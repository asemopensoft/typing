import asyncio
import io
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request
from contextlib import redirect_stderr, redirect_stdout

try:
    from telegram import Update
    from telegram.ext import (
        ApplicationBuilder,
        CommandHandler,
        ContextTypes,
        MessageHandler,
        filters,
    )
except ImportError:
    print("❌ مكتبة python-telegram-bot غير مثبتة!")
    print("يرجى تشغيل: pip install python-telegram-bot")
    sys.exit(1)

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(BASE_DIR, "telegram_config.json")
LEGACY_OWNER_FILE = os.path.join(BASE_DIR, "telegram_owner.json")

# ⚠️ لا تضع مفاتيح API هنا مباشرة! استخدم ملف telegram_config.json (مُضاف لـ .gitignore)
# أو قم بتعريف متغيرات البيئة: BOT_TOKEN, GROQ_API_KEY, OWNER_ID
DEFAULT_CONFIG = {
    "bot_token": os.environ.get("BOT_TOKEN", ""),
    "owner_id": int(os.environ.get("OWNER_ID", "0")) or None,
    "groq_api_key": os.environ.get("GROQ_API_KEY", ""),
    "groq_model": "qwen/qwen3.8-27b",
    "gemini_api_key": os.environ.get("GEMINI_API_KEY", ""),
    "active_provider": "groq",
}


def load_config() -> dict:
    cfg = dict(DEFAULT_CONFIG)
    if os.path.exists(LEGACY_OWNER_FILE):
        try:
            with open(LEGACY_OWNER_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                if data.get("owner_id"):
                    cfg["owner_id"] = data["owner_id"]
        except Exception:
            pass

    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, "r", encoding="utf-8") as f:
                saved = json.load(f)
                cfg.update(saved)
        except Exception as e:
            print(f"⚠️ خطأ أثناء قراءة ملف الإعدادات: {e}")

    if os.environ.get("GROQ_API_KEY"):
        cfg["groq_api_key"] = os.environ["GROQ_API_KEY"]
    if os.environ.get("GEMINI_API_KEY"):
        cfg["gemini_api_key"] = os.environ["GEMINI_API_KEY"]

    return cfg


def save_config(cfg: dict):
    try:
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(cfg, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"❌ تعذر حفظ الإعدادات: {e}")


config = load_config()


def is_owner(user_id: int) -> bool:
    return config.get("owner_id") is not None and user_id == config["owner_id"]


# ========================================================
# 🛠️ أدوات الوكيل التنفيذي (Agent Executive Tools)
# ========================================================

def replace_text(search: str, replace: str = "", exts: list = None, target_dir: str = BASE_DIR) -> str:
    """استبدال أو حذف نص في كافة ملفات المشروع بترميز UTF-8."""
    if not search:
        return "❌ النص المراد البحث عنه فارغ."
    if exts is None:
        exts = [".html", ".js", ".ts", ".css", ".json", ".py", ".md", ".bak"]
    skip_dirs = {".git", "node_modules", "__pycache__", ".gemini", ".next", "dist", "build"}

    # تنظيف النص والبحث أيضاً عن متغيرات المسافات
    search_variants = [search]
    search_clean = " ".join(search.split())
    if search_clean not in search_variants:
        search_variants.append(search_clean)

    modified = []
    total_count = 0

    for root, dirs, files in os.walk(target_dir):
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        for f in files:
            if any(f.endswith(e) for e in exts):
                filepath = os.path.join(root, f)
                rel = os.path.relpath(filepath, target_dir)
                try:
                    with open(filepath, "r", encoding="utf-8", errors="ignore") as fp:
                        content = fp.read()

                    found_in_file = False
                    for variant in search_variants:
                        if variant in content:
                            count = content.count(variant)
                            total_count += count
                            content = content.replace(variant, replace)
                            found_in_file = True

                    if found_in_file:
                        with open(filepath, "w", encoding="utf-8") as fp:
                            fp.write(content)
                        modified.append(rel)
                except Exception as e:
                    print(f"خطأ في {rel}: {e}")

    if modified:
        action_word = f"حذف '{search}'" if not replace else f"استبدال '{search}' بـ '{replace}'"
        res = f"✅ تم {action_word} بنجاح في {len(modified)} ملف:\n"
        res += "\n".join(f"• {m}" for m in modified)
        return res
    return f"ℹ️ لم يتم العثور على النص '{search}' في ملفات المشروع."


def write_file(filepath: str, content: str) -> str:
    full_path = os.path.join(BASE_DIR, filepath) if not os.path.isabs(filepath) else filepath
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)
    rel = os.path.relpath(full_path, BASE_DIR)
    return f"✅ تم حفظ الملف: `{rel}` ({len(content)} حرف)"


def read_file(filepath: str, max_lines: int = 150) -> str:
    full_path = os.path.join(BASE_DIR, filepath) if not os.path.isabs(filepath) else filepath
    if not os.path.exists(full_path):
        return f"❌ الملف غير موجود: `{filepath}`"
    try:
        with open(full_path, "r", encoding="utf-8", errors="ignore") as f:
            lines = f.readlines()
        content = "".join(lines[:max_lines])
        if len(lines) > max_lines:
            content += f"\n... (تم عرض أول {max_lines} سطر من أصل {len(lines)})"
        return content
    except Exception as e:
        return f"❌ خطأ في القراءة: {e}"


def search_files(query: str, exts: list = None) -> str:
    if not query:
        return "❌ النص فارغ."
    if exts is None:
        exts = [".html", ".js", ".ts", ".css", ".json", ".py", ".md", ".bak"]
    skip_dirs = {".git", "node_modules", "__pycache__", ".gemini", ".next", "dist", "build"}

    matches = []
    for root, dirs, files in os.walk(BASE_DIR):
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        for f in files:
            if any(f.endswith(e) for e in exts):
                filepath = os.path.join(root, f)
                rel = os.path.relpath(filepath, BASE_DIR)
                try:
                    with open(filepath, "r", encoding="utf-8", errors="ignore") as fp:
                        for idx, line in enumerate(fp, 1):
                            if query in line:
                                matches.append(f"{rel}:{idx} -> {line.strip()[:80]}")
                                if len(matches) >= 20:
                                    break
                except Exception:
                    pass
        if len(matches) >= 20:
            break

    if matches:
        return f"🔍 تم العثور على {len(matches)} نتائج لـ '{query}':\n" + "\n".join(matches)
    return f"ℹ️ لم يتم العثور على '{query}'."


def run_command(cmd: str) -> str:
    try:
        res = subprocess.run(
            ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", cmd],
            cwd=BASE_DIR,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=60,
        )
        out = (res.stdout or "") + (res.stderr or "")
        return out.strip() or "✅ تم التنفيذ بنجاح بدون مخرجات."
    except subprocess.TimeoutExpired:
        return "⏳ انتهت مهلة التنفيذ (60 ثانية)."
    except Exception as e:
        return f"❌ خطأ أثناء تشغيل الأمر: {e}"


def execute_python_code(code_str: str) -> str:
    captured = []

    def custom_print(*args, **kwargs):
        captured.append(" ".join(str(a) for a in args))

    context = {
        "os": os,
        "sys": sys,
        "re": re,
        "json": json,
        "BASE_DIR": BASE_DIR,
        "replace_text": replace_text,
        "write_file": write_file,
        "read_file": read_file,
        "search_files": search_files,
        "run_command": run_command,
        "print": custom_print,
    }

    buf = io.StringIO()
    try:
        with redirect_stdout(buf), redirect_stderr(buf):
            exec(code_str, context)
        raw = buf.getvalue().strip()
        if raw:
            captured.append(raw)
        result = "\n".join(captured).strip()
        return result or "✅ تم التنفيذ بنجاح."
    except Exception as e:
        return f"❌ خطأ أثناء تنفيذ كود بايثون: {e}"


# ========================================================
# 🧠 محرك الاستعلام والذكاء الاصطناعي الخفيف
# ========================================================

def get_project_files_overview() -> str:
    """قائمة أسماء الملفات فقط لتوفير التوكنز وتجنب أخطاء 413 و 429."""
    extensions = [".html", ".js", ".ts", ".css", ".json", ".py", ".md"]
    skip_dirs = {".git", "node_modules", "__pycache__", ".next", "dist", "build", ".gemini", "logo"}
    files_list = []
    for root, dirs, files in os.walk(BASE_DIR):
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        for f in files:
            if any(f.endswith(ext) for ext in extensions):
                rel = os.path.relpath(os.path.join(root, f), BASE_DIR)
                files_list.append(rel)
    return ", ".join(files_list[:40])


def build_system_prompt() -> str:
    files_overview = get_project_files_overview()
    return (
        f"أنت وكيل برمجي تنفيذي ذكي (Autonomous Developer Agent) لمشروع BarqType.\n"
        f"المسار: {BASE_DIR}\n"
        f"الملفات الحالية:\n[{files_overview}]\n\n"
        f"🚨 قواعد صارمة:\n"
        f"1. نفذ المطلوب فوراً بدون شروحات طويلة وبدون كتابة 'الخطوة 1، الخطوة 2'.\n"
        f"2. لحذف أو استبدال نص في ملفات النظام، اكتب فوراً داخل كود بايثون:\n"
        f"```python\n"
        f"res = replace_text('النص المطلوب حذفه', 'البديل أو فارغ')\n"
        f"print(res)\n"
        f"```\n"
        f"3. لكتابة أو تعديل ملف كامل: `write_file('اسم_الملف', 'المحتوى')`\n"
        f"4. لقراءة ملف: `print(read_file('اسم_الملف'))`\n"
        f"5. لتشغيل أمر نظام: اكتبه داخل كتلة ```powershell\n"
        f"6. تنبيه: لا تستدعِ أدوات خارجية أو حاويات مثل container.exec أو JSON tool calling. أنت لست في حاوية Docker. أي تنفيذ يتم حصراً عبر كتل كود بايثون (```python) أو أوامر (```powershell) فقط.\n"
        f"7. أجب بالعربية باختصار شديد."
    )


def query_groq(user_prompt: str) -> str:
    api_key = config.get("groq_api_key")
    if not api_key:
        raise ValueError("مفتاح Groq غير متوفر.")

    # ترتيب النماذج المجانية المتاحة على Groq حسب الاستقرار والأداء
    candidate_models = [
        "qwen/qwen3.8-27b",
        config.get("groq_model", "qwen/qwen3.8-27b"),
        "allam-2-7b",
        "openai/gpt-oss-120b",
        "openai/gpt-oss-20b",
    ]
    models_to_try = []
    for m in candidate_models:
        if m and m not in models_to_try:
            models_to_try.append(m)

    system_prompt = build_system_prompt()
    last_error = ""

    for model in models_to_try:
        url = "https://api.groq.com/openai/v1/chat/completions"
        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": 0.2,
            "max_tokens": 1500,
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
            },
        )

        try:
            with urllib.request.urlopen(req, timeout=40) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                choice = data["choices"][0]
                message = choice.get("message", {})
                content = message.get("content") or ""
                config["groq_model"] = model
                save_config(config)
                return content
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="ignore")
            last_error = f"{e.code}: {err_body}"
            print(f"⚠️ النموذج {model} واجه خطأ ({e.code})، جاري التبديل التلقائي للنموذج التالي...")
            # الانتقال التلقائي للنموذج التالي لأي خطأ (سواء 400 أو 413 أو 429 أو غيره)
            continue
        except Exception as e:
            last_error = str(e)
            print(f"⚠️ خطأ اتصال مع النموذج {model}: {e}")
            continue

    raise RuntimeError(f"تمت محاولة جميع النماذج وفشلت: {last_error}")


def query_gemini(user_prompt: str) -> str:
    if not GEMINI_AVAILABLE:
        raise ValueError("مكتبة google-generativeai غير مثبتة.")
    api_key = config.get("gemini_api_key")
    if not api_key:
        raise ValueError("مفتاح Gemini غير محدد.")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash")
    system_prompt = build_system_prompt()
    full_prompt = f"{system_prompt}\n\nطلب المطور:\n{user_prompt}"
    res = model.generate_content(full_prompt)
    return res.text if res.text else "تمت المعالجة بدون نص."


def ask_ai(user_prompt: str) -> str:
    provider = config.get("active_provider", "groq")
    if provider == "groq" and config.get("groq_api_key"):
        return query_groq(user_prompt)
    elif provider == "gemini" and config.get("gemini_api_key"):
        return query_gemini(user_prompt)
    elif config.get("groq_api_key"):
        return query_groq(user_prompt)
    elif config.get("gemini_api_key"):
        return query_gemini(user_prompt)
    else:
        return "⚠️ لا يوجد مفتاح ذكاء اصطناعي مفعل. أرسل /setkey <المفتاح> لتفعيله."


def extract_code_blocks(text: str) -> list:
    pattern = r"```([a-zA-Z0-9_-]*)\s*\n(.*?)\n```"
    matches = re.findall(pattern, text, re.DOTALL)
    blocks = []
    for lang, code in matches:
        cleaned = code.strip()
        if cleaned:
            blocks.append((lang.lower().strip(), cleaned))
    return blocks


async def send_chunked(update: Update, text: str, parse_mode: str = None):
    if len(text) <= 4000:
        await update.message.reply_text(text, parse_mode=parse_mode)
        return
    for i in range(0, len(text), 4000):
        await update.message.reply_text(text[i : i + 4000])


# ========================================================
# 📱 معالجات أوامر التيليجرام
# ========================================================

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    if config.get("owner_id") is None:
        config["owner_id"] = user.id
        save_config(config)

    if not is_owner(user.id):
        await update.message.reply_text("⛔ هذا البوت خاص بالمطور فقط.")
        return

    provider_info = f"⚡ المزود: Groq ({config.get('groq_model')}) - مجاني فائق السرعة"
    await update.message.reply_text(
        f"👋 أهلاً بك يا {user.first_name}!\n\n"
        f"🤖 **وكيل التحكم التنفيذي بمشروع BarqType جاهز ومحدث.**\n"
        f"{provider_info}\n\n"
        f"📌 **الأوامر السريعة المتاحة:**\n"
        f"• `/status` - حالة Git الحالية\n"
        f"• `/push <رسالة>` - حفظ ورفع التعديلات على GitHub فوراً\n"
        f"• `/search <نص>` - بحث سريع عن أي نص في ملفات المشروع\n"
        f"• `/replace <القديم> => <الجديد>` - استبدال نص مباشر بدون انتظار AI\n"
        f"• `/cmd <أمر>` - تنفيذ أمر مباشر في PowerShell\n"
        f"• `/models` - عرض النماذج والتبديل بينها\n"
        f"• أو فقط أرسل أي طلب تريده وسيقوم الوكيل بتنفيذه وتعديل الملفات فوراً!"
    )


async def help_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_owner(update.effective_user.id):
        return
    await update.message.reply_text(
        "🛠️ **دليل الأوامر:**\n"
        "• `/status` : فحص حالة ملفات Git\n"
        "• `/push تحديث` : رفع التعديلات لـ GitHub\n"
        "• `/search نص` : بحث عن كلمة في كافة الملفات\n"
        "• `/replace قديم => جديد` : استبدال مباشر في كل الملفات\n"
        "• `/cmd git status` : تشغيل أمر PowerShell\n"
        "• أو اكتب طلبك مباشرة وسينفذه الوكيل فوراً."
    )


async def git_status_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_owner(update.effective_user.id):
        return
    out = run_command("git status")
    await send_chunked(update, f"📊 **حالة Git:**\n```\n{out}\n```")


async def git_push_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_owner(update.effective_user.id):
        return
    commit_msg = " ".join(context.args) if context.args else "تحديث من تيليجرام"
    status_msg = await update.message.reply_text("🚀 جاري حفظ التغييرات ورفعها...")
    out = run_command(f'git add . ; git commit -m "{commit_msg}" ; git push')
    await status_msg.edit_text(f"✅ **نتيجة الرفع:**\n```\n{out[:3500]}\n```")


async def files_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_owner(update.effective_user.id):
        return
    out = run_command("git ls-files")
    await send_chunked(update, f"📁 **ملفات المشروع:**\n```\n{out[:3800]}\n```")


async def cmd_exec(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_owner(update.effective_user.id):
        return
    if not context.args:
        await update.message.reply_text("⚠️ اكتب الأمر بعد /cmd\nمثال: `/cmd dir` أو `/cmd git branch`")
        return
    command = " ".join(context.args)
    status_msg = await update.message.reply_text(f"⚙️ جاري تنفيذ: `{command}`...")
    output = run_command(command)
    await status_msg.delete()
    await send_chunked(update, f"💻 **مخرجات الأمر:**\n```\n{output[:3800]}\n```")


async def search_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_owner(update.effective_user.id):
        return
    if not context.args:
        await update.message.reply_text("⚠️ يرجى تحديد النص المراد البحث عنه.\nمثال: `/search كلمة`")
        return
    query = " ".join(context.args).strip()
    status_msg = await update.message.reply_text(f"🔍 جاري البحث عن: `{query}`...")
    res = search_files(query)
    await status_msg.delete()
    await send_chunked(update, res)


async def replace_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_owner(update.effective_user.id):
        return
    full_text = " ".join(context.args)
    if "=>" not in full_text:
        await update.message.reply_text(
            "⚠️ الصيغة الصحيحة للأمر:\n`/replace النص القديم => النص الجديد`\n"
            "(إذا أردت حذفه فقط اترك ما بعد => فارغاً)"
        )
        return
    parts = full_text.split("=>", 1)
    old_text = parts[0].strip()
    new_text = parts[1].strip()
    status_msg = await update.message.reply_text(f"⚙️ جاري استبدال '{old_text}'...")
    res = replace_text(old_text, new_text)
    await status_msg.delete()
    await send_chunked(update, res)


async def models_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_owner(update.effective_user.id):
        return
    if context.args:
        new_model = context.args[0].strip()
        config["groq_model"] = new_model
        save_config(config)
        await update.message.reply_text(f"✅ تم تغيير النموذج إلى: `{new_model}`")
        return

    current = config.get("groq_model", "qwen/qwen3.8-27b")
    await update.message.reply_text(
        f"🤖 **النموذج الحالي:** `{current}`\n\n"
        f"📋 **النماذج المجانية المتاحة:**\n"
        f"1. `qwen/qwen3.8-27b` (سريع وممتاز وبدون حدود ضيقة)\n"
        f"2. `openai/gpt-oss-20b` (سريع وخفيف جداً)\n"
        f"3. `openai/gpt-oss-120b` (النموذج الأضخم)\n"
        f"4. `allam-2-7b` (نموذج علام العربي)\n\n"
        f"💡 لتغيير النموذج أرسل:\n`/models qwen/qwen3.8-27b`"
    )


async def setkey_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_owner(update.effective_user.id):
        return
    if not context.args:
        await update.message.reply_text("⚠️ اكتب المفتاح بعد الأمر.\nمثال: `/setkey gsk_xxxxxx`")
        return
    key = context.args[0].strip()
    if key.startswith("gsk_"):
        config["groq_api_key"] = key
        config["active_provider"] = "groq"
        save_config(config)
        await update.message.reply_text("✅ تم حفظ وتفعيل مفتاح Groq المجاني بنجاح! ⚡")
    elif key.startswith("AIza"):
        config["gemini_api_key"] = key
        config["active_provider"] = "gemini"
        save_config(config)
        await update.message.reply_text("✅ تم تفعيل مفتاح Google AI Studio (Gemini) المجاني! 🌟")
    else:
        config["groq_api_key"] = key
        save_config(config)
        await update.message.reply_text("✅ تم حفظ المفتاح.")


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_owner(update.effective_user.id):
        return

    user_text = update.message.text.strip()

    # 1) فحص سريع لطلبات الحذف المباشرة
    match_del = re.match(r"^(?:قم\s+بإلغاء|قم\s+بالغاء|احذف|إلغاء|الغاء)\s+(?:اسم|الاسم|نص|كلمة)?\s*[\"']?([^\"'\n]+)[\"']?.*$", user_text, re.IGNORECASE)
    if match_del and len(match_del.group(1).strip()) > 2 and ("صفحات" in user_text or "ملفات" in user_text or "النظام" in user_text or "المشروع" in user_text):
        target_name = match_del.group(1).strip()
        status_msg = await update.message.reply_text(f"⚡ جاري تنفيذ الحذف المباشر لـ '{target_name}' من كافة الملفات...")
        result = replace_text(target_name, "")
        await status_msg.edit_text(result)
        return

    # 2) فحص سريع لطلبات الاستبدال المباشرة (استجابة فورية بدون توكنز أو تأخير)
    # أمثلة: "قم باستبدال النص X الى Y بس", "استبدل X بـ Y", "غير X الى Y"
    match_rep = re.match(
        r"^(?:قم\s+باستبدال|استبدل|بدل|غير)\s+(?:النص|الاسم|كلمة)?\s*[\"']?([^\"'\n]+?)[\"']?\s+(?:الى|إلى|بـ|ب)\s+[\"']?([^\"'\n]+?)[\"']?$",
        user_text,
        re.IGNORECASE,
    )
    if match_rep:
        old_txt = match_rep.group(1).strip()
        raw_new_txt = match_rep.group(2).strip()
        new_txt = re.sub(r"\s+(?:بس|فقط)$", "", raw_new_txt).strip()
        status_msg = await update.message.reply_text(f"⚡ جاري الاستبدال المباشر لـ '{old_txt}' بـ '{new_txt}' في كافة الملفات...")
        result = replace_text(old_txt, new_txt)
        await status_msg.edit_text(result)
        return

    status_msg = await update.message.reply_text("⚡ جاري التفكير وتحضير التنفيذ عبر الوكيل...")

    try:
        reply_text = ask_ai(user_text)
        await status_msg.delete()
        await send_chunked(update, reply_text)

        # تنفيذ كتل الكود الصادرة من الوكيل
        code_blocks = extract_code_blocks(reply_text)
        for lang, code in code_blocks:
            if lang in ("python", "py"):
                exec_msg = await update.message.reply_text("⚙️ جاري تنفيذ كود بايثون التنفيذي على المشروع...")
                exec_result = execute_python_code(code)
                await exec_msg.edit_text(f"📋 **نتيجة التنفيذ المباشر:**\n{exec_result}")

            elif lang in ("powershell", "ps1", "cmd", "bash", "sh", "shell", "bat"):
                cmd_msg = await update.message.reply_text(f"⚙️ جاري تشغيل أمر النظام:\n`{code}`")
                cmd_out = run_command(code)
                await cmd_msg.edit_text(f"💻 **نتيجة الأمر:**\n```\n{cmd_out[:3500]}\n```")

    except Exception as e:
        await status_msg.edit_text(f"❌ حدث خطأ أثناء المعالجة: {e}")


async def run_bot_service():
    bot_token = config.get("bot_token")
    app = ApplicationBuilder().token(bot_token).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_cmd))
    app.add_handler(CommandHandler("status", git_status_cmd))
    app.add_handler(CommandHandler("push", git_push_cmd))
    app.add_handler(CommandHandler("files", files_cmd))
    app.add_handler(CommandHandler("cmd", cmd_exec))
    app.add_handler(CommandHandler("run", cmd_exec))
    app.add_handler(CommandHandler("search", search_cmd))
    app.add_handler(CommandHandler("replace", replace_cmd))
    app.add_handler(CommandHandler("models", models_cmd))
    app.add_handler(CommandHandler("setkey", setkey_cmd))
    app.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), handle_message))

    print("=" * 60)
    print("🤖 وكيل تيليجرام التنفيذي (Agent Engine - 100% Free)")
    print(f"⚡ النموذج النشط: Groq ({config.get('groq_model')})")
    print("🔗 https://t.me/asem_antigravity_bot")
    print("=" * 60)

    if config.get("groq_api_key"):
        try:
            print("⚙️ جاري التحقق من جاهزية المحرك التنفيذي...")
            test_resp = query_groq("قل جاهز فقط")
            print(f"✅ الوكيل التنفيذي جاهز بنجاح! رد الاختبار: {test_resp.strip()[:40]}")
        except Exception as e:
            print(f"⚠️ تنبيه فحص Groq: {e}")

    await app.initialize()
    await app.start()
    await app.updater.start_polling()
    print("🚀 البوت يعمل الآن ويستقبل المهام التنفيذية في تيليجرام...")

    try:
        while True:
            await asyncio.sleep(3600)
    finally:
        await app.updater.stop()
        await app.stop()
        await app.shutdown()


if __name__ == "__main__":
    try:
        asyncio.run(run_bot_service())
    except KeyboardInterrupt:
        print("\n🛑 تم إيقاف البوت بنجاح.")
