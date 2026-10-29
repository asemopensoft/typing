# scripts/generate_dictation_audio.py
import asyncio
import os
import edge_tts

# قائمة الكلمات المستخرجة من dictation.js
WORDS_AR = {
    "easy": ['كتاب','قلم','بيت','شمس','قمر','ماء','نار','حب','ورد','سلام','باب','نور','يوم','عين','قلب','لون','صوت','حلم','بحر','سما','نجم','خير','علم','فرح','طفل','وطن','ذهب','رمل','حرف','مسك','زهر','ليل','جبل','سهل','حقل','درس','لعب','طير','سمك','ملح','عسل','خبز','بيض','شاي','حظ','رزق','عمل','كلب','قط','فيل','ثلج','غيم','ريح','مطر','برق','رعد','فجر','ضوء','ظل','روح','سيف','درع','رمح','قوس','تاج','عرش','بئر','حجر','تبن','خشب','صدق','أمل','صبر','شكر','جود','عدل','حكم','رأي','فكر','عقل','سلم','حرب','أمن','حصن','سور','برج','جسر','مرج','حدق','بذر','نبت','شجر','غصن','جذر','لحا','ثمر','ورق','ساق','عنب','تين'],
    "medium": ['مستشفى','جامعة','مكتبة','مدرسة','حاسوب','هاتف','طائرة','سيارة','قطار','سفينة','مفتاح','شباك','مصباح','ساعة','كرسي','طاولة','خزانة','ثلاجة','غسالة','مروحة','رسالة','مجلة','صحيفة','قصيدة','رواية','مسرح','سينما','متحف','معبد','قصر','شارع','ميدان','حديقة','منتزه','ملعب','مسبح','شاطئ','جزيرة','صحراء','غابة','عصفور','فراشة','دلفين','زرافة','غزال','نمر','ثعلب','أرنب','سلحف','حمامة','فطور','غداء','عشاء','وجبة','طبيخ','سلطة','حلوى','بسكت','عصير','لبن','طبيب','مهندس','معلم','محامي','صحفي','رسام','مغني','ممثل','كاتب','عالم','وزارة','سفارة','شرطة','جيش','محكمة','مجلس','هيئة','لجنة','نقابة','جمعية','تجارة','صناعة','زراعة','سياحة','تعليم','صحة','عدالة','ثقافة','رياضة','فنون','ربيع','صيف','خريف','شتاء','كانون','شباط','آذار','نيسان','أيار','حزيرن'],
    "hard": ['استراتيجية','اقتصادية','ديمقراطية','تكنولوجيا','أيديولوجيا','بيروقراطية','إمبريالية','رأسمالية','اشتراكية','ليبرالية','الاستقلال','الاستعمار','الاستثمار','الازدهار','الانتصار','الاختراع','الاكتشاف','الابتكار','التفاوض','المساواة','المسؤولية','الموسوعة','المشاركة','المنافسة','المعاملة','المؤسسة','المحافظة','المراسلة','المعالجة','الممارسة','الديناميكية','الجيوسياسية','الإلكترونية','الأكاديمية','البيولوجية','الفيزيائية','الكيميائية','الرياضيات','الجغرافيا','الفلسفية','الحضارة','الثورة','الجمهورية','السيادة','الدبلوماسية','البنية','التحتية','الإنتاجية','التنافسية','الاستدامة','الميكانيكية','الهيدروجين','البروتوكول','الكربوهيدرات','المغناطيسية','الديناصورات','الأنثروبولوجيا','السيكولوجية','الأرستقراطية','الميتافيزيقية','البيروقراطية','الإمبراطورية','الجيوفيزيائية','الإيكولوجية','التكنوقراطية','الإنفراستركتشر','الماكروسكوبية','الميكروسكوبية','المنهجية','الأيديولوجية','الاستراتيجية','التكنولوجية','الديمقراطية','الرأسمالية','الاشتراكية','الليبرالية','المؤسساتية','الاحترافية','الاستثنائية','التخصصية','الكهرومغناطيسية','الثيرموديناميكية','الفوتوغرافية','السينمائية','الأوركسترالية','البيوكيميائية','النيوروسيكولوجية','الإبستيمولوجية','الفينومينولوجية','البراغماتية','الطوبوغرافية','الكريستالية','الأيروديناميكية','الهيدروليكية','الإحصائية','الكهروكيميائية','الفيزيولوجية','السيسمولوجية','الجيومورفولوجية','البالونتولوجية']
}

WORDS_EN = {
    "easy": ['apple','house','water','table','chair','green','heart','light','music','happy','bread','cloud','dance','earth','flame','glass','juice','laugh','money','night','ocean','paint','queen','river','stone','tiger','uncle','voice','world','young','beach','candy','dream','empty','fresh','giant','horse','ivory','jewel','knife','lemon','magic','north','olive','piano','quiet','robot','sugar','truck','under','vivid','whale','xenon','yacht','zebra','angel','brain','charm','delay','enjoy','fairy','grape','honey','image','joker','koala','lunar','maple','noble','opera','pearl','quest','royal','solar','tulip','umbra','valve','wrist','youth','chill','blaze','crane','drift','eagle','frost','gloom','haven','inlet','jolly','knack','lithe','mirth','nerve','oxide','prism','quilt','ridge','shaft','thorn','ultra'],
    "medium": ['building','computer','elephant','football','keyboard','language','mountain','notebook','organize','platform','question','remember','sandwich','together','umbrella','vacation','whenever','yourself','absolute','baseball','calendar','daughter','exercise','feedback','generate','hardware','instinct','judgment','knocking','leverage','magnetic','navigate','obstacle','powerful','quantify','railroad','schedule','template','universe','validate','wireless','wrapping','animated','borrowed','cleaning','delivery','entrance','finished','graphics','homeland','imagined','jokingly','kilowatt','landlord','memories','mushroom','narrowed','offering','pleasant','recently','software','teamwork','uncommon','violence','workshop','yielding','backbone','cardigan','dazzling','emerging','festival','gathered','hopeless','identity','journals','knockout','lifetime','merchant','nineteen','occupied','painting','realized','shouting','thirteen','umbrella','volcanic','windmill','yourself','backyard','cardinal','decisive','excelled','fraction','graceful','heirloom','ignition','javelina','kindling','luminous','marathon'],
    "hard": ['extraordinary','communication','understanding','international','environmental','approximately','infrastructure','collaboration','consciousness','revolutionary','comprehensive','sophisticated','philosophical','determination','recommendation','significantly','establishment','entertainment','vulnerability','archaeological','administrative','unprecedented','technological','distinguished','investigation','controversial','independently','mathematician','psychological','accommodation','concentration','demonstration','encouragement','functionality','gravitational','hallucination','illustration','jurisdictions','kaleidoscopic','manufacturing','nevertheless','opportunities','parliamentary','qualification','rehabilitation','simultaneously','transformation','uncomfortable','weatherization','extraordinary','accessibility','biodegradable','circumference','disappointing','electromagnetic','fundamentally','globalization','horizontality','improvisation','jurisdictional','knowledgeable','legitimately','misconception','noncommittal','organizational','perpendicular','quintessential','retrospective','specifications','traditionally','uncomfortable','vulnerability','whistleblower']
}

VOICE_AR = "ar-SA-ZariyahNeural"  # صوت عربي طبيعي فائق النقاء
VOICE_EN = "en-US-JennyNeural"    # صوت إنجليزي استوديو

BASE_DIR = os.path.join(os.path.dirname(__file__), "..", "server", "public", "audio", "dictation")

async def generate_category(lang, difficulty, words, voice, sem):
    target_dir = os.path.join(BASE_DIR, lang, difficulty)
    os.makedirs(target_dir, exist_ok=True)
    
    unique_words = []
    seen = set()
    for w in words:
        clean = w.strip()
        if clean and clean not in seen:
            seen.add(clean)
            unique_words.append(clean)

    async def generate_single(clean_word):
        filename = f"{clean_word}.mp3"
        filepath = os.path.join(target_dir, filename)
        if os.path.exists(filepath) and os.path.getsize(filepath) > 0:
            return
        async with sem:
            for attempt in range(3):
                try:
                    communicate = edge_tts.Communicate(clean_word, voice)
                    await communicate.save(filepath)
                    print(f"Generated: [{lang}/{difficulty}] {clean_word}")
                    break
                except Exception as e:
                    if attempt == 2:
                        print(f"Failed [{lang}/{difficulty}] {clean_word}: {e}")
                    else:
                        await asyncio.sleep(1)

    tasks = [generate_single(w) for w in unique_words]
    await asyncio.gather(*tasks)

async def main():
    print("🚀 Starting Audio Asset Generation...")
    sem = asyncio.Semaphore(5)  # Limit concurrency to prevent rate limits
    for diff, words in WORDS_AR.items():
        print(f"Generating Arabic {diff}...")
        await generate_category("ar", diff, words, VOICE_AR, sem)
    for diff, words in WORDS_EN.items():
        print(f"Generating English {diff}...")
        await generate_category("en", diff, words, VOICE_EN, sem)
    print("✅ All Audio Assets Successfully Generated!")

if __name__ == "__main__":
    asyncio.run(main())
