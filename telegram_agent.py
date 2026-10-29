import asyncio
import json
import os
import subprocess
import sys

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

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
    print("يرجى تشغيل: pip install python-telegram-bot google-generativeai")
    sys.exit(1)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(BASE_DIR, "telegram_config.json")
OWNER_FILE = os.path.join(BASE_DIR, "telegram_owner.json")

BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
owner_id = None

if os.path.exists(CONFIG_FILE):
    try:
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            cfg = json.load(f)
            BOT_TOKEN = BOT_TOKEN or cfg.get("bot_token") or cfg.get("BOT_TOKEN", "")
            GEMINI_API_KEY = GEMINI_API_KEY or cfg.get("gemini_api_key") or cfg.get("GEMINI_API_KEY", "")
            if not owner_id and "owner_id" in cfg:
                owner_id = cfg["owner_id"]
    except Exception:
        pass

if not owner_id and os.path.exists(OWNER_FILE):
    try:
        with open(OWNER_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            owner_id = data.get("owner_id")
    except Exception:
        pass

gemini_model = None
ai_active = False


def is_owner(user_id: int) -> bool:
    return owner_id is not None and user_id == owner_id


def read_project_files() -> str:
    context_parts = []
    extensions = [".py", ".js", ".ts", ".html", ".css", ".json", ".md"]
    skip_dirs = {"node_modules", ".git", "__pycache__", ".next", "dist", "build"}
    for root, dirs, files in os.walk(BASE_DIR):
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                filepath = os.path.join(root, file)
                rel_path = os.path.relpath(filepath, BASE_DIR)
                try:
                    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                    if len(content) < 50000:
                        context_parts.append(f"=== {rel_path} ===\n{content}")
                except Exception:
                    pass
    return "\n\n".join(context_parts[:20])


def execute_shell_from_response(response_text: str) -> str:
    results = []
    lines = response_text.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if line.startswith("  ash") or line.startswith("  shell") or line.startswith("  cmd"):
            cmd_lines = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith("  "):
                cmd_lines.append(lines[i])
                i += 1
            if cmd_lines:
                cmd = "\n".join(cmd_lines).strip()
                try:
                    result = subprocess.run(cmd, cwd=BASE_DIR, capture_output=True, text=True, shell=True, timeout=30)
                    out = result.stdout or result.stderr or "تم التنفيذ."
                    results.append(f"✅ نتيجة:\n{out[:500]}")
                except Exception as e:
                    results.append(f"❌ خطأ: {e}")
        i += 1
    return "\n".join(results)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    global owner_id
    user = update.effective_user
    if owner_id is None:
        owner_id = user.id
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump({"owner_id": owner_id, "username": user.username, "first_name": user.first_name}, f, ensure_ascii=False, indent=2)
        ai_status = "🤖 الذكاء الاصطناعي: مفعل!" if ai_active else "⚠️ الذكاء الاصطناعي: غير متاح حالياً."
        await update.message.reply_text(
            f"✅ أهلاً بك يا {user.first_name}!\n🔒 تم الربط (ID: {owner_id}).\n\n{ai_status}\n\n"
            "📌 الأوامر:\n🔹 /status\n🔹 /push <رسالة>\n🔹 /files\n🔹 أرسل أي طلب للذكاء الاصطناعي"
        )
        return
    if not is_owner(user.id):
        await update.message.reply_text("⛔ هذا البوت خاص.")
        return
    await update.message.reply_text("👋 مرحباً مجدداً!")


async def help_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_owner(update.effective_user.id):
        return
    await update.message.reply_text(
        "🛠️ **الأوامر:**\n• /status\n• /push رسالة\n• /files\n• أرسل أي طلب للذكاء الاصطناعي",
        parse_mode="Markdown"
    )


async def git_status_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_owner(update.effective_user.id):
        return
    result = subprocess.run(["git", "status"], cwd=BASE_DIR, capture_output=True, text=True, shell=True)
    await update.message.reply_text(f"`	ext\n{result.stdout or result.stderr}\n`", parse_mode="Markdown")


async def git_push_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_owner(update.effective_user.id):
        return
    commit_msg = " ".join(context.args) if context.args else "تحديث من تيليجرام"
    msg = await update.message.reply_text(f"🚀 جاري الرفع...")
    cmd = f'git add . && git commit -m "{commit_msg}" && git push'
    result = subprocess.run(cmd, cwd=BASE_DIR, capture_output=True, text=True, shell=True)
    await msg.edit_text(f"✅ نتيجة:\n`	ext\n{(result.stdout or result.stderr)[:3500]}\n`", parse_mode="Markdown")


async def files_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_owner(update.effective_user.id):
        return
    result = subprocess.run(["git", "ls-files"], cwd=BASE_DIR, capture_output=True, text=True, shell=True)
    await update.message.reply_text(f"📁 الملفات:\n`\n{result.stdout.strip()[:3000]}\n`", parse_mode="Markdown")


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_owner(update.effective_user.id):
        return
    user_prompt = update.message.text
    if not ai_active or gemini_model is None:
        await update.message.reply_text("⚠️ الذكاء الاصطناعي غير متاح. شغّل: pip install google-generativeai")
        return
    msg = await update.message.reply_text("🤖 جاري المعالجة...")
    try:
        project_ctx = read_project_files()
        prompt = (
            f"أنت مساعد برمجي. المشروع في: {BASE_DIR}\n\nالملفات:\n{project_ctx[:25000]}\n\n"
            f"طلب: {user_prompt}\n\nأجب بالعربية. إذا احتجت shell اكتبه في كتلة bash."
        )
        response = gemini_model.generate_content(prompt)
        result_text = response.text.strip() if response.text else "✅ تم."
        cmd_results = execute_shell_from_response(result_text)
        if len(result_text) > 4000:
            for i in range(0, len(result_text), 4000):
                await update.message.reply_text(result_text[i:i+4000])
        else:
            await update.message.reply_text(result_text)
        if cmd_results:
            await update.message.reply_text(f"⚙️ نتائج:\n{cmd_results[:2000]}")
        await msg.delete()
    except Exception as e:
        await msg.edit_text(f"❌ خطأ: {e}")


async def run_bot_service():
    global gemini_model, ai_active
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_cmd))
    app.add_handler(CommandHandler("status", git_status_cmd))
    app.add_handler(CommandHandler("push", git_push_cmd))
    app.add_handler(CommandHandler("files", files_cmd))
    app.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), handle_message))

    print("=" * 60)
    print("🤖 بوت Gemini AI جاهز")
    print("🔗 https://t.me/asem_antigravity_bot")
    print("=" * 60)

    if GEMINI_AVAILABLE and GEMINI_API_KEY:
        try:
            print("⚙️ تهيئة Gemini...")
            genai.configure(api_key=GEMINI_API_KEY)
            gemini_model = genai.GenerativeModel("gemini-2.0-flash")
            test = gemini_model.generate_content("قل جاهز فقط")
            if test.text:
                ai_active = True
                print(f"✅ Gemini مفعل! الرد: {test.text.strip()}")
        except Exception as e:
            print(f"⚠️ Gemini غير متاح: {e}")
    else:
        print("⚠️ google-generativeai غير مثبتة. شغّل: pip install google-generativeai")

    await app.initialize()
    await app.start()
    await app.updater.start_polling()
    print(f"🚀 البوت يعمل {'مع AI' if ai_active else 'بدون AI (Git فقط)'}!")
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
        print("\n🛑 تم إيقاف البوت.")
