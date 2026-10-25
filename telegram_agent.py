import asyncio
import json
import os
import subprocess
import sys

# محاولة استيراد حزمة Antigravity الرسمية
try:
    from google.antigravity import Agent, LocalAgentConfig, CapabilitiesConfig
    ANTIGRAVITY_AVAILABLE = True
except ImportError:
    ANTIGRAVITY_AVAILABLE = False

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
    print("يرجى تشغيل الأمر التالي في الطرفية أولاً:")
    print("pip install python-telegram-bot google-antigravity")
    sys.exit(1)

# --- إعدادات البوت ---
BOT_TOKEN = "8897239334:AAE699QTKVJXkCrddqIDS0K98Dxip9_F5E4"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_FILE = os.path.join(BASE_DIR, "telegram_owner.json")

# تحميل معرّف المالك إن وجد لحماية البوت
owner_id = None
if os.path.exists(CONFIG_FILE):
    try:
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            owner_id = data.get("owner_id")
    except Exception:
        pass

agent_instance = None


def is_owner(user_id: int) -> bool:
    return owner_id is not None and user_id == owner_id


# --- أوامر البوت ---
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    global owner_id
    user = update.effective_user

    # ربط البوت تلقائياً بأول من يضغط Start (أنت)
    if owner_id is None:
        owner_id = user.id
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump({"owner_id": owner_id, "username": user.username, "first_name": user.first_name}, f, ensure_ascii=False, indent=2)
        await update.message.reply_text(
            f"✅ أهلاً بك يا {user.first_name}!\n"
            f"🔒 تم ربط البوت بحسابك بنجاح (ID: {owner_id}).\n"
            "أنت الآن المالك الوحيد ولن يستجيب البوت لأي مستخدم آخر.\n\n"
            "📌 الأوامر السريعة المتاحة:\n"
            "🔹 أرسل أي نص لتنفيذه كأمر برمجى عبر وكيل Antigravity.\n"
            "🔹 /status - فحص حالة مستودع Git\n"
            "🔹 /push <رسالة> - رفع التعديلات فوراً إلى Git (Commit & Push)\n"
            "🔹 /help - قائمة المساعدة"
        )
        return

    if not is_owner(user.id):
        await update.message.reply_text("⛔ عذراً، هذا البوت خاص ولا يستجيب إلا لمالكه.")
        return

    await update.message.reply_text("👋 مرحباً مجدداً! بانتظار توجيهاتك.")


async def help_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_owner(update.effective_user.id):
        return

    help_text = (
        "🛠️ **دليل أوامر البوت:**\n\n"
        "1️⃣ **كتابة الأوامر البرمجية:**\n"
        "أرسل أي رسالة نصية عادية مثل:\n"
        "• `افحص ملفات الـ css واصلح مشاكل التوافق`\n"
        "• `قم بإنشاء صفحة تسجيل جديدة`\n\n"
        "2️⃣ **أوامر Git المباشرة:**\n"
        "• `/status` : عرض التعديلات المعلقة في Git.\n"
        "• `/push رسالة التعديل` : عمل git add و commit و git push فوراً."
    )
    await update.message.reply_text(help_text, parse_mode="Markdown")


async def git_status_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_owner(update.effective_user.id):
        return

    await update.message.reply_text("🔍 جاري فحص حالة Git في المشروع...")
    result = subprocess.run(["git", "status"], cwd=BASE_DIR, capture_output=True, text=True, shell=True)
    output = result.stdout or result.stderr or "لا توجد مخرجات."
    await update.message.reply_text(f"```text\n{output}\n```", parse_mode="Markdown")


async def git_push_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_owner(update.effective_user.id):
        return

    commit_msg = " ".join(context.args) if context.args else "تحديث التعديلات من تيليجرام"
    status_msg = await update.message.reply_text(f"🚀 جاري الرفع إلى Git برمز:\n`{commit_msg}`...")

    cmd = f'git add . && git commit -m "{commit_msg}" && git push'
    result = subprocess.run(cmd, cwd=BASE_DIR, capture_output=True, text=True, shell=True)

    output = result.stdout or result.stderr or "تم التنفيذ."
    await status_msg.edit_text(f"✅ نتيجة الرفع إلى Git:\n```text\n{output[:3500]}\n```", parse_mode="Markdown")


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not is_owner(update.effective_user.id):
        return

    user_prompt = update.message.text

    if not ANTIGRAVITY_AVAILABLE or agent_instance is None:
        await update.message.reply_text(
            "⚠️ مكتبة `google-antigravity` غير مثبتة أو لم يتم تهيئتها.\n"
            "يمكنك تثبيتها عبر:\n`pip install google-antigravity`",
            parse_mode="Markdown"
        )
        return

    status_msg = await update.message.reply_text("⚙️ جاري تنفيذ المهمة عبر وكيل Antigravity...")

    try:
        response = await agent_instance.chat(user_prompt)

        tokens = []
        async for token in response:
            tokens.append(token)
        result_text = "".join(tokens).strip()

        if not result_text:
            result_text = "✅ تم تنفيذ المهمة بنجاح بدون مخرجات نصية."

        # إرسال النتيجة وتقسيمها إذا كانت طويلة
        if len(result_text) > 4000:
            for i in range(0, len(result_text), 4000):
                await update.message.reply_text(result_text[i:i+4000])
        else:
            await update.message.reply_text(result_text)

        await status_msg.delete()

    except Exception as e:
        await update.message.reply_text(f"❌ حدث خطأ أثناء تنفيذ المهمة: {e}")


async def main():
    global agent_instance

    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", help_cmd))
    app.add_handler(CommandHandler("status", git_status_cmd))
    app.add_handler(CommandHandler("push", git_push_cmd))
    app.add_handler(MessageHandler(filters.TEXT & (~filters.COMMAND), handle_message))

    print("=" * 50)
    print("🤖 بوت التحكم بـ Antigravity جاهز للتشغيل")
    print(f"🔗 رابط البوت: https://t.me/asem_antigravity_bot")
    print("=" * 50)

    if ANTIGRAVITY_AVAILABLE:
        print("⚙️ جاري تهيئة وكيل Antigravity بكامل الصلاحيات...")
        config = LocalAgentConfig(
            system_instructions=(
                "You are an expert autonomous developer. Execute commands precisely "
                "in this repository, modify code when requested, and summarize results."
            ),
            capabilities=CapabilitiesConfig()
        )
        async with Agent(config) as agent:
            agent_instance = agent
            await app.initialize()
            await app.start()
            await app.updater.start_polling()
            print("🚀 البوت متصل الآن بنجاح! توجه لتيليجرام واضغط Start.")
            try:
                while True:
                    await asyncio.sleep(3600)
            finally:
                await app.updater.stop()
                await app.stop()
                await app.shutdown()
    else:
        print("⚠️ جاري تشغيل البوت بدون وكيل Antigravity (أوامر Git فقط ستعمل حتى يتم تثبيت الحزمة).")
        await app.initialize()
        await app.start()
        await app.updater.start_polling()
        print("🚀 البوت متصل الآن بنجاح!")
        try:
            while True:
                await asyncio.sleep(3600)
        finally:
            await app.updater.stop()
            await app.stop()
            await app.shutdown()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n🛑 تم إيقاف البوت.")
