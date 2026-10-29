// ==============================================================
// BARQTYPE DICTATION ENGINE v2 — Streamlined Flow
// الكلمة تُنطق تلقائياً → اكتب → Enter → تنتقل تلقائياً
// Space = إعادة سماع | Tab = تخطي | كل شيء من الكيبورد
// ==============================================================

(function () {
  'use strict';

  // ── WORD BANKS ──
  const WORDS = {
    en: {
      easy: [
        'apple','house','water','table','chair','green','heart','light','music','happy',
        'bread','cloud','dance','earth','flame','glass','juice','laugh','money','night',
        'ocean','paint','queen','river','stone','tiger','uncle','voice','world','young',
        'beach','candy','dream','empty','fresh','giant','horse','ivory','jewel','knife',
        'lemon','magic','north','olive','piano','quiet','robot','sugar','truck','under',
        'vivid','whale','xenon','yacht','zebra','angel','brain','charm','delay','enjoy',
        'fairy','grape','honey','image','joker','koala','lunar','maple','noble','opera',
        'pearl','quest','royal','solar','tulip','umbra','valve','wrist','youth','chill',
        'blaze','crane','drift','eagle','frost','gloom','haven','inlet','jolly','knack',
        'lithe','mirth','nerve','oxide','prism','quilt','ridge','shaft','thorn','ultra'
      ],
      medium: [
        'building','computer','elephant','football','keyboard','language','mountain','notebook','organize','platform',
        'question','remember','sandwich','together','umbrella','vacation','whenever','yourself','absolute','baseball',
        'calendar','daughter','exercise','feedback','generate','hardware','instinct','judgment','knocking','leverage',
        'magnetic','navigate','obstacle','powerful','quantify','railroad','schedule','template','universe','validate',
        'wireless','wrapping','animated','borrowed','cleaning','delivery','entrance','finished','graphics','homeland',
        'imagined','jokingly','kilowatt','landlord','memories','mushroom','narrowed','offering','pleasant','recently',
        'software','teamwork','uncommon','violence','workshop','yielding','backbone','cardigan','dazzling','emerging',
        'festival','gathered','hopeless','identity','journals','knockout','lifetime','merchant','nineteen','occupied',
        'painting','realized','shouting','thirteen','umbrella','volcanic','windmill','yourself','backyard','cardinal',
        'decisive','excelled','fraction','graceful','heirloom','ignition','javelina','kindling','luminous','marathon'
      ],
      hard: [
        'extraordinary','communication','understanding','international','environmental','approximately','infrastructure','collaboration','consciousness','revolutionary',
        'comprehensive','sophisticated','philosophical','determination','recommendation','significantly','establishment','entertainment','vulnerability','archaeological',
        'administrative','unprecedented','technological','distinguished','investigation','controversial','independently','mathematician','psychological','accommodation',
        'concentration','demonstration','encouragement','functionality','gravitational','hallucination','illustration','jurisdictions','kaleidoscopic','manufacturing',
        'nevertheless','opportunities','parliamentary','qualification','rehabilitation','simultaneously','transformation','uncomfortable','weatherization','extraordinary',
        'accessibility','biodegradable','circumference','disappointing','electromagnetic','fundamentally','globalization','horizontality','improvisation','jurisdictional',
        'knowledgeable','legitimately','misconception','noncommittal','organizational','perpendicular','quintessential','retrospective','specifications','traditionally',
        'uncomfortable','vulnerability','whistleblower','communication','approximately','sophisticated','consciousness','distinguished','investigation','independently',
        'concentration','demonstration','encouragement','gravitational','hallucination','manufacturing','nevertheless','parliamentary','qualification','simultaneously',
        'accessibility','biodegradable','circumference','disappointing','electromagnetic','fundamentally','globalization','improvisation','knowledgeable','misconception',
        'organizational','perpendicular','quintessential','retrospective','specifications','traditionally','uncomfortable','whistleblower','understanding','revolutionary'
      ]
    },
    ar: {
      easy: [
        'كتاب','قلم','بيت','شمس','قمر','ماء','نار','حب','ورد','سلام',
        'باب','نور','يوم','عين','قلب','لون','صوت','حلم','بحر','سما',
        'نجم','خير','علم','فرح','طفل','وطن','ذهب','رمل','حرف','مسك',
        'زهر','ليل','جبل','سهل','حقل','درس','لعب','طير','سمك','ملح',
        'عسل','خبز','بيض','شاي','حظ','رزق','عمل','كلب','قط','فيل',
        'ثلج','غيم','ريح','مطر','برق','رعد','فجر','ضوء','ظل','روح',
        'سيف','درع','رمح','قوس','تاج','عرش','بئر','حجر','تبن','خشب',
        'صدق','أمل','صبر','شكر','جود','عدل','حكم','رأي','فكر','عقل',
        'سلم','حرب','أمن','حصن','سور','برج','جسر','مرج','حدق','بذر',
        'نبت','شجر','غصن','جذر','لحا','ثمر','ورق','ساق','عنب','تين'
      ],
      medium: [
        'مستشفى','جامعة','مكتبة','مدرسة','حاسوب','هاتف','طائرة','سيارة','قطار','سفينة',
        'مفتاح','شباك','مصباح','ساعة','كرسي','طاولة','خزانة','ثلاجة','غسالة','مروحة',
        'رسالة','مجلة','صحيفة','قصيدة','رواية','مسرح','سينما','متحف','معبد','قصر',
        'شارع','ميدان','حديقة','منتزه','ملعب','مسبح','شاطئ','جزيرة','صحراء','غابة',
        'عصفور','فراشة','دلفين','زرافة','غزال','نمر','ثعلب','أرنب','سلحف','حمامة',
        'فطور','غداء','عشاء','وجبة','طبيخ','سلطة','حلوى','بسكت','عصير','لبن',
        'طبيب','مهندس','معلم','محامي','صحفي','رسام','مغني','ممثل','كاتب','عالم',
        'وزارة','سفارة','شرطة','جيش','محكمة','مجلس','هيئة','لجنة','نقابة','جمعية',
        'تجارة','صناعة','زراعة','سياحة','تعليم','صحة','عدالة','ثقافة','رياضة','فنون',
        'ربيع','صيف','خريف','شتاء','كانون','شباط','آذار','نيسان','أيار','حزيرن'
      ],
      hard: [
        'استراتيجية','اقتصادية','ديمقراطية','تكنولوجيا','أيديولوجيا','بيروقراطية','إمبريالية','رأسمالية','اشتراكية','ليبرالية',
        'الاستقلال','الاستعمار','الاستثمار','الازدهار','الانتصار','الاختراع','الاكتشاف','الابتكار','التفاوض','المساواة',
        'المسؤولية','الموسوعة','المشاركة','المنافسة','المعاملة','المؤسسة','المحافظة','المراسلة','المعالجة','الممارسة',
        'الديناميكية','الجيوسياسية','الإلكترونية','الأكاديمية','البيولوجية','الفيزيائية','الكيميائية','الرياضيات','الجغرافيا','الفلسفية',
        'الحضارة','الثورة','الجمهورية','السيادة','الدبلوماسية','البنية','التحتية','الإنتاجية','التنافسية','الاستدامة',
        'الميكانيكية','الهيدروجين','البروتوكول','الكربوهيدرات','المغناطيسية','الديناصورات','الأنثروبولوجيا','السيكولوجية','الأرستقراطية','الميتافيزيقية',
        'البيروقراطية','الإمبراطورية','الجيوفيزيائية','الإيكولوجية','التكنوقراطية','الإنفراستركتشر','الماكروسكوبية','الميكروسكوبية','المنهجية','الأيديولوجية',
        'الاستراتيجية','التكنولوجية','الديمقراطية','الرأسمالية','الاشتراكية','الليبرالية','المؤسساتية','الاحترافية','الاستثنائية','التخصصية',
        'الكهرومغناطيسية','الثيرموديناميكية','الفوتوغرافية','السينمائية','الأوركسترالية','البيوكيميائية','النيوروسيكولوجية','الإبستيمولوجية','الفينومينولوجية','البراغماتية',
        'الطوبوغرافية','الكريستالية','الأيروديناميكية','الهيدروليكية','الإحصائية','الكهروكيميائية','الفيزيولوجية','السيسمولوجية','الجيومورفولوجية','البالونتولوجية'
      ]
    }
  };

  // ── STATE ──
  let lang = 'ar';
  let difficulty = 'easy';
  let currentRound = [];
  let currentIndex = 0;
  let score = 0;
  let correctCount = 0;
  let replays = 0;
  let results = [];
  let isPlaying = false;
  let roundSize = 10;
  let isChecking = false;  // prevent double-submit during transition
  let advanceTimer = null;

  // ── DOM ELEMENTS ──
  const $ = (id) => document.getElementById(id);
  const speakerBtn = $('dict-speaker');
  const inputField = $('dict-input');
  const feedbackEl = $('dict-feedback');
  const wordNumEl = $('dict-word-num');
  const scoreEl = $('dict-score');
  const replayCountEl = $('dict-replays');
  const progressFill = $('dict-progress-fill');
  const speakerHint = $('dict-speaker-hint');
  const gameArea = $('dict-game');
  const resultsArea = $('dict-results');

  // ── LANGUAGE & DIFFICULTY ──
  function setDictLang(l) {
    lang = l; try { localStorage.setItem("barqtype_lang", l); const ts2 = JSON.parse(localStorage.getItem("ts2") || "{}"); ts2.lang = l; localStorage.setItem("ts2", JSON.stringify(ts2)); } catch(e){}
    document.getElementById('dict-lang-en').classList.toggle('on', l === 'en');
    document.getElementById('dict-lang-ar').classList.toggle('on', l === 'ar');
    inputField.dir = l === 'ar' ? 'rtl' : 'ltr';
    inputField.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr');
    inputField.placeholder = l === 'ar' ? 'اكتب ثم Enter...' : 'Type then Enter...';
    updateLabels();
    if (isPlaying) startNewRound();
  }
  window.setDictLang = setDictLang;

  function setDictDifficulty(d) {
    difficulty = d;
    document.getElementById('dict-easy').classList.toggle('on', d === 'easy');
    document.getElementById('dict-med').classList.toggle('on', d === 'medium');
    document.getElementById('dict-hard').classList.toggle('on', d === 'hard');
    if (isPlaying) startNewRound();
  }
  window.setDictDifficulty = setDictDifficulty;

  function updateLabels() {
    const isAr = lang === 'ar';
    const nTest = $('txt-dict-test'); if (nTest) nTest.textContent = isAr ? 'تدريب' : 'Practice'; const nStats = $('txt-dict-stats'); if (nStats) nStats.textContent = isAr ? 'إحصاءات' : 'Stats'; const nLearn = $('txt-dict-learn'); if (nLearn) nLearn.textContent = isAr ? 'تعلم' : 'Learn'; const nDict = $('txt-dict-dictation'); if (nDict) nDict.textContent = isAr ? 'إملاء' : 'Dictation'; const nRace = $('txt-dict-race'); if (nRace) nRace.textContent = isAr ? 'سباق' : 'Race'; speakerHint.textContent = isAr
      ? 'Enter = تحقق  ·  Space = أعد السماع  ·  Tab = تخطي'
      : 'Enter = Check  ·  Space = Replay  ·  Tab = Skip';
  }

  // ── SOUND & PRONUNCIATION ENGINE (DUAL-ENGINE) ──
  // 1) High-Fidelity Audio Stream (Google TTS for Arabic, Youdao/Oxford for English)
  //    → Crystal clear human/studio pronunciation without robotic distortion or missing voices
  // 2) Web Speech API fallback (speechSynthesis)
  //    → Works offline; uses smart voice filtering (prefers crisp female voices like Zira/Jenny over muffled David)

  let activeAudio = null;
  let cachedVoices = [];
  let voicesReady = false;
  let speechRate = 1.0;
  let hasUserInteracted = false;

  function markInteracted() {
    if (!hasUserInteracted) {
      hasUserInteracted = true;
      try {
        const silentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
        silentAudio.play().catch(() => {});
      } catch (e) {}
      if (speakerBtn) speakerBtn.classList.remove('awaiting-start');
    }
  }
  document.addEventListener('keydown', markInteracted, { capture: true });
  document.addEventListener('pointerdown', markInteracted, { capture: true });

  function setDictSpeed(s) {
    speechRate = s;
    const sSlow = document.getElementById('dict-spd-slow');
    const sNorm = document.getElementById('dict-spd-norm');
    const sFast = document.getElementById('dict-spd-fast');
    if (sSlow) sSlow.classList.toggle('on', s === 0.85);
    if (sNorm) sNorm.classList.toggle('on', s === 1.0);
    if (sFast) sFast.classList.toggle('on', s === 1.15);
  }
  window.setDictSpeed = setDictSpeed;

  function loadVoices() {
    return new Promise((resolve) => {
      if (!window.speechSynthesis) {
        resolve([]);
        return;
      }
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) {
        cachedVoices = v;
        voicesReady = true;
        resolve(v);
        return;
      }
      window.speechSynthesis.onvoiceschanged = () => {
        cachedVoices = window.speechSynthesis.getVoices();
        voicesReady = true;
        resolve(cachedVoices);
      };
      setTimeout(() => {
        cachedVoices = window.speechSynthesis.getVoices();
        voicesReady = cachedVoices.length > 0;
        resolve(cachedVoices);
      }, 1000);
    });
  }
  if (window.speechSynthesis) {
    loadVoices();
  }

  function findBestVoice(targetLang) {
    const voices = cachedVoices;
    if (!voices.length) return null;

    if (targetLang === 'ar') {
      const onlineAr = voices.find(v => (v.lang.startsWith('ar') || v.lang.includes('ar-')) && (v.name.includes('Natural') || v.name.includes('Online')));
      if (onlineAr) return onlineAr;
      const googleAr = voices.find(v => v.lang.startsWith('ar') && v.name.includes('Google'));
      if (googleAr) return googleAr;
      const anyAr = voices.find(v => v.lang.startsWith('ar') || v.name.toLowerCase().includes('arabic'));
      if (anyAr) return anyAr;
    } else {
      const onlineEn = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Online')));
      if (onlineEn) return onlineEn;
      const googleEn = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'));
      if (googleEn) return googleEn;
      const femaleEn = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Zira') || v.name.includes('Hazel') || v.name.includes('Susan') || v.name.includes('Jenny') || v.name.includes('Female')));
      if (femaleEn) return femaleEn;
      const nonDavid = voices.find(v => v.lang.startsWith('en') && !v.name.includes('David'));
      if (nonDavid) return nonDavid;
      const anyEn = voices.find(v => v.lang.startsWith('en'));
      if (anyEn) return anyEn;
    }
    return null;
  }

  // ── AUDIO CACHE & PRELOADING ──
  const audioCache = new Map();

  function getAudioUrls(word, targetLang) {
    const clean = word.trim();
    const q = encodeURIComponent(clean);
    const apiServer = (typeof window !== 'undefined' && window.BarqAPI && window.BarqAPI.getServerUrl)
      ? window.BarqAPI.getServerUrl()
      : ((typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin !== 'null' && !window.location.protocol.startsWith('file')) ? window.location.origin : 'http://localhost:3001');
    const localUrl = `${apiServer}/audio/dictation/${targetLang}/${difficulty}/${q}.mp3`;

    if (targetLang === 'ar') {
      return [
        localUrl, // 1) المصدر المحلي فائق السرعة وبدون إنترنت خارجي
        `https://api.streamelements.com/kappa/v2/speech?voice=Zeina&text=${q}`,
        `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ar&q=${q}`
      ];
    } else {
      return [
        localUrl, // 1) المصدر المحلي فائق السرعة وبدون إنترنت خارجي
        `https://dict.youdao.com/dictvoice?audio=${q}&type=2`,
        `https://api.streamelements.com/kappa/v2/speech?voice=Joanna&text=${q}`,
        `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${q}`
      ];
    }
  }

  function preloadWordAudio(word, targetLang) {
    if (!word) return;
    const key = `${targetLang}:${word.trim().toLowerCase()}`;
    if (audioCache.has(key)) return;

    const urls = getAudioUrls(word, targetLang);
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = urls[0];
    audioCache.set(key, { audio, urls, urlIndex: 0 });
  }

  function speak(word, callback) {
    if (!word) return;

    if (activeAudio) {
      try {
        activeAudio.pause();
        activeAudio.currentTime = 0;
      } catch (e) {}
      activeAudio = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    speakerBtn.classList.add('speaking');
    let finished = false;

    const onDone = () => {
      if (finished) return;
      finished = true;
      speakerBtn.classList.remove('speaking');
      if (callback) callback();
    };

    const key = `${lang}:${word.trim().toLowerCase()}`;
    let cached = audioCache.get(key);
    if (!cached) {
      preloadWordAudio(word, lang);
      cached = audioCache.get(key);
    }

    // If preloaded and ready to play immediately
    if (cached && cached.audio) {
      const a = cached.audio;
      activeAudio = a;
      a.playbackRate = speechRate;

      if (a.readyState >= 2) {
        a.currentTime = 0;
        a.onended = onDone;
        a.onerror = () => trySequentialStreams(word, cached.urls, 1, onDone);
        const p = a.play();
        if (p) {
          p.catch(() => trySequentialStreams(word, cached.urls, 1, onDone));
        }
        return;
      }
    }

    const urls = cached ? cached.urls : getAudioUrls(word, lang);
    trySequentialStreams(word, urls, 0, onDone);
  }

  function trySequentialStreams(word, urls, startIdx, onDone) {
    let finished = false;
    const key = `${lang}:${word.trim().toLowerCase()}`;

    function tryNext(i) {
      if (finished) return;

      if (i < urls.length) {
        const url = urls[i];
        const a = new Audio(url);
        activeAudio = a;
        a.playbackRate = speechRate;

        let failed = false;
        const onFail = () => {
          if (failed || finished) return;
          failed = true;
          tryNext(i + 1);
        };

        a.onended = () => {
          if (finished) return;
          finished = true;
          onDone();
        };

        a.onerror = onFail;

        const timer = setTimeout(() => {
          if (!finished && (!a.duration || a.paused)) {
            onFail();
          }
        }, 2200);

        a.onplay = () => {
          clearTimeout(timer);
          audioCache.set(key, { audio: a, urls, urlIndex: i });
        };

        const p = a.play();
        if (p) {
          p.catch(() => {
            clearTimeout(timer);
            onFail();
          });
        }
      } else {
        // All streams exhausted → fallback to Web Speech API
        activeAudio = null;
        speakLocalSpeech(word, onDone);
      }
    }

    tryNext(startIdx);
  }

  function speakLocalSpeech(word, onDone) {
    if (!window.speechSynthesis) {
      onDone();
      return;
    }

    const utter = new SpeechSynthesisUtterance(word);
    utter.volume = 1.0;
    utter.rate = speechRate;

    const bestVoice = findBestVoice(lang);
    if (bestVoice) {
      utter.voice = bestVoice;
      utter.lang = bestVoice.lang;

      if (lang === 'en' && bestVoice.name.includes('David')) {
        utter.pitch = 1.2;
        utter.rate = speechRate * 0.95;
      } else {
        utter.pitch = 1.05;
      }
    } else {
      utter.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
      if (lang === 'ar') {
        showArabicVoiceNotice();
      }
    }

    utter.onend = onDone;
    utter.onerror = () => {
      onDone();
    };

    window.speechSynthesis.speak(utter);
  }

  function showArabicVoiceNotice() {
    const notice = document.getElementById('dict-audio-notice');
    if (!notice) return;
    notice.innerHTML = `<span><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg> لتشغيل الصوت العربي في وضع أوفلاين: يمكنك تثبيت حزمة الصوت العربي من إعدادات ويندوز (Settings → Speech)، أو الاتصال بالإنترنت للاستماع للصوت عالي الدقة.</span>`;
    notice.classList.remove('hidden');
    setTimeout(() => {
      notice.classList.add('hidden');
    }, 6000);
  }

  // ── GAME LOGIC ──
  function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function startNewRound() {
    const bank = WORDS[lang][difficulty];
    currentRound = shuffleArray(bank).slice(0, roundSize);
    currentIndex = 0;
    score = 0;
    correctCount = 0;
    replays = 0;
    results = [];
    isPlaying = true;
    isChecking = false;
    clearTimeout(advanceTimer);

    gameArea.classList.remove('hidden');
    resultsArea.classList.remove('show');
    resultsArea.style.display = 'none';
    feedbackEl.classList.remove('show', 'correct-fb', 'wrong-fb');

    updateStats();
    loadWord();
  }
  window.startNewRound = startNewRound;

  function loadWord() {
    isChecking = false;
    replays = 0;
    inputField.value = '';
    inputField.classList.remove('correct', 'wrong');
    inputField.disabled = false;
    feedbackEl.classList.remove('show', 'correct-fb', 'wrong-fb');
    feedbackEl.innerHTML = '';
    replayCountEl.textContent = '';
    updateStats();

    // Focus input immediately
    inputField.focus();

    // Preload audio for current word & next word in advance
    const cur = currentRound[currentIndex];
    if (cur) preloadWordAudio(cur, lang);
    const nxt = currentRound[currentIndex + 1];
    if (nxt) preloadWordAudio(nxt, lang);

    // Auto-play the word:
    // If user has already interacted, auto-play immediately.
    // If initial load before interaction, invite user to press Space or click speaker.
    if (hasUserInteracted) {
      setTimeout(() => {
        speakCurrent();
      }, 250);
    } else {
      speakerBtn.classList.add('awaiting-start');
      speakerHint.textContent = lang === 'ar'
        ? 'اضغط Space أو انقر هنا للاستماع'
        : 'Press Space or click here to listen';
    }
  }

  let lastSpeakTime = 0;
  function speakCurrent() {
    const now = Date.now();
    // 200ms debounce throttle to avoid audio abort storm from rapid key presses
    if (now - lastSpeakTime < 200) return;
    lastSpeakTime = now;

    if (currentIndex < currentRound.length) {
      speak(currentRound[currentIndex]);
      replays++;
      if (replays > 1) {
        replayCountEl.textContent = lang === 'ar'
          ? `إعادة: ${replays - 1}`
          : `Replays: ${replays - 1}`;
      }
    }
  }

  function normalizeText(str, currentLang) {
    if (!str) return '';
    let s = str.trim().toLowerCase();
    if (currentLang === 'ar') {
      // Remove diacritics / tashkeel (fatha, damma, kasra, sukun, shadda, tanwin)
      s = s.replace(/[\u064B-\u065F\u0670]/g, '');
      // Normalize alef variants
      s = s.replace(/[أإآٱ]/g, 'ا');
      // Normalize teh marbuta
      s = s.replace(/ة/g, 'ه');
      // Normalize alef maqsura
      s = s.replace(/ى/g, 'ي');
    }
    return s;
  }

  function checkAnswer() {
    if (!isPlaying || currentIndex >= currentRound.length || isChecking) return;

    const rawUser = inputField.value.trim();
    if (!rawUser) {
      // Empty input → treat as skip
      skipWord();
      return;
    }

    isChecking = true;
    const targetWord = currentRound[currentIndex];
    const isCorrect = (rawUser.toLowerCase() === targetWord.toLowerCase()) ||
                      (normalizeText(rawUser, lang) === normalizeText(targetWord, lang));
    let points = 0;

    if (isCorrect) {
      points = replays <= 1 ? 10 : 7;
      correctCount++;
      inputField.classList.add('correct');
      showFeedback(true, targetWord, rawUser);
    } else {
      points = 0;
      inputField.classList.add('wrong');
      showFeedback(false, targetWord, rawUser);
    }

    score += points;
    results.push({
      word: currentRound[currentIndex],
      userAnswer: inputField.value.trim(),
      correct: isCorrect,
      points,
      replays
    });

    inputField.disabled = true;
    updateStats();

    // Auto-advance: fast for correct, a bit longer for wrong (to read answer)
    advanceTimer = setTimeout(() => {
      advanceToNext();
    }, isCorrect ? 800 : 2000);
  }

  function skipWord() {
    if (!isPlaying || currentIndex >= currentRound.length || isChecking) return;

    isChecking = true;
    results.push({
      word: currentRound[currentIndex],
      userAnswer: '—',
      correct: false,
      points: 0,
      replays
    });

    showFeedback(false, currentRound[currentIndex], '—');
    inputField.disabled = true;
    updateStats();

    advanceTimer = setTimeout(() => {
      advanceToNext();
    }, 1500);
  }

  function advanceToNext() {
    currentIndex++;
    if (currentIndex >= currentRound.length) {
      showResults();
    } else {
      loadWord();
    }
  }

  function showFeedback(isCorrect, correctWord, userAnswer) {
    feedbackEl.className = 'dict-feedback show ' + (isCorrect ? 'correct-fb' : 'wrong-fb');

    if (isCorrect) {
      const txt = lang === 'ar' ? 'صحيح!' : 'Correct!';
      feedbackEl.innerHTML = `
        <div class="fb-row">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#48bb78" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg>
          <span class="fb-text" style="color:#48bb78">${txt}</span>
        </div>
      `;
    } else {
      // Build diff highlighting
      const correctLower = correctWord.toLowerCase();
      const userLower = (userAnswer && userAnswer !== '—') ? userAnswer.toLowerCase() : '';
      let diffHtml = '';
      for (let i = 0; i < correctWord.length; i++) {
        const ch = correctWord[i];
        const userCh = userLower[i] || '';
        const cls = (ch.toLowerCase() === userCh) ? 'match' : 'miss';
        diffHtml += `<span class="ch ${cls}">${ch}</span>`;
      }
      feedbackEl.innerHTML = `
        <div class="fb-row">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#e55656" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
          <div class="fb-diff" ${lang === 'ar' ? 'dir="rtl"' : ''}>${diffHtml}</div>
        </div>
      `;
    }
  }

  function updateStats() {
    wordNumEl.textContent = `${currentIndex + 1}/${roundSize}`;
    scoreEl.textContent = score;
    progressFill.style.width = `${((currentIndex) / roundSize) * 100}%`;
  }

  // ── RESULTS ──
  function showResults() {
    isPlaying = false;
    isChecking = false;
    gameArea.classList.add('hidden');
    resultsArea.style.display = 'flex';
    setTimeout(() => resultsArea.classList.add('show'), 50);

    const pct = Math.round((correctCount / roundSize) * 100);
    const maxScore = roundSize * 10;

    // Save best
    const bestKey = `barq_dict_best_${lang}_${difficulty}`;
    const prevBest = parseInt(localStorage.getItem(bestKey) || '0');
    const isNewBest = score > prevBest;
    if (isNewBest) localStorage.setItem(bestKey, score);

    // Sync result with Barq API if user is authenticated
    if (window.BarqAPI && window.BarqAPI.saveDictationResult) {
      const wrongList = results.filter(r => !r.correct).map(r => ({ word: r.word, userAnswer: r.userAnswer }));
      window.BarqAPI.saveDictationResult({
        lang: lang,
        difficulty: difficulty,
        score: score,
        accuracy: pct,
        wrong_words: wrongList
      });
    }

    // Title & Vector Icon
    let iconSvg, title;
    if (pct >= 90) {
      iconSvg = '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2"/><path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H7c-.55 0-1 .45-1 1v1h12v-1c0-.55-.45-1-1-1h-2c-.55 0-1-.45-1-1v-2.34"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>';
      title = lang === 'ar' ? 'ممتاز!' : 'Excellent!';
    } else if (pct >= 70) {
      iconSvg = '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
      title = lang === 'ar' ? 'أداء رائع!' : 'Great job!';
    } else if (pct >= 50) {
      iconSvg = '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
      title = lang === 'ar' ? 'جيد، واصل!' : 'Good, keep going!';
    } else {
      iconSvg = '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>';
      title = lang === 'ar' ? 'حاول مرة أخرى' : 'Try again';
    }

    const subtitle = lang === 'ar'
      ? `أجبت على ${correctCount} من ${roundSize} كلمات بشكل صحيح`
      : `You got ${correctCount} out of ${roundSize} words correct`;

    // Wrong words
    const wrongResults = results.filter(r => !r.correct);
    let wrongHtml = '';
    if (wrongResults.length > 0) {
      const wrongTitle = lang === 'ar' ? 'الكلمات الخاطئة' : 'Incorrect Words';
      wrongHtml = `<div class="result-wrong-list"><h3>${wrongTitle}</h3>`;
      wrongResults.forEach(r => {
        wrongHtml += `
          <div class="wrong-word-item">
            <span class="ww-your">${r.userAnswer}</span>
            <span class="ww-arrow">→</span>
            <span class="ww-correct">${r.word}</span>
            <button class="ww-replay-btn" onclick="window._speakWord('${r.word}')" title="Listen">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            </button>
          </div>`;
      });
      wrongHtml += '</div>';
    }

    const bestVal = Math.max(score, prevBest);
    const newBestBadge = isNewBest
      ? `<span class="best-score-badge"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px;margin-inline-end:3px"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> ${lang === 'ar' ? 'رقم قياسي جديد!' : 'New record!'}</span>`
      : '';

    const retryLabel = lang === 'ar' ? 'إعادة المحاولة' : 'Try Again';
    const correctLabel = lang === 'ar' ? 'صحيح' : 'Correct';
    const pointsLabel = lang === 'ar' ? 'النقاط' : 'Points';
    const bestLbl = lang === 'ar' ? 'أفضل نتيجة' : 'Best';
    const pctLabel = lang === 'ar' ? 'النسبة' : 'Accuracy';

    resultsArea.innerHTML = `
      <div class="result-header">
        <div class="result-emoji">${iconSvg}</div>
        <div class="result-title">${title}</div>
        <div class="result-subtitle">${subtitle}</div>
        ${newBestBadge}
      </div>
      <div class="result-score-ring">
        <svg viewBox="0 0 140 140">
          <circle class="ring-bg" cx="70" cy="70" r="60"/>
          <circle class="ring-fill ${pct >= 70 ? 'ok' : ''}" cx="70" cy="70" r="60" id="result-ring"/>
        </svg>
        <div class="result-score-text">${pct}%</div>
      </div>
      <div class="result-details">
        <div class="result-detail-card">
          <div class="rd-val">${correctCount}/${roundSize}</div>
          <div class="rd-lbl">${correctLabel}</div>
        </div>
        <div class="result-detail-card">
          <div class="rd-val">${score}/${maxScore}</div>
          <div class="rd-lbl">${pointsLabel}</div>
        </div>
        <div class="result-detail-card">
          <div class="rd-val">${pct}%</div>
          <div class="rd-lbl">${pctLabel}</div>
        </div>
        <div class="result-detail-card">
          <div class="rd-val">${bestVal}</div>
          <div class="rd-lbl">${bestLbl}</div>
        </div>
      </div>
      ${wrongHtml}
      <button class="dict-btn primary" onclick="startNewRound()" style="margin-top:8px;font-size:16px;padding:12px 32px;">
        ${retryLabel}
      </button>
      <div class="result-shortcut-hint">${lang === 'ar' ? 'أو اضغط Enter' : 'or press Enter'}</div>
    `;

    // Animate ring
    setTimeout(() => {
      const ring = document.getElementById('result-ring');
      if (ring) {
        const circumference = 2 * Math.PI * 60;
        ring.style.strokeDasharray = circumference;
        ring.style.strokeDashoffset = circumference - (circumference * pct / 100);
      }
    }, 100);
  }

  // Global speak helper for replay buttons
  window._speakWord = function(word) {
    speak(word);
  };

  // ── UNIFIED KEYBOARD HANDLER ──
  // Everything from the keyboard — no mouse needed!
  inputField.addEventListener('keydown', (e) => {
    // Enter = check answer
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!isPlaying && resultsArea.classList.contains('show')) {
        // On results screen, Enter = retry
        startNewRound();
        return;
      }
      checkAnswer();
      return;
    }

    // Space = ALWAYS play / replay audio (works even if letters already typed, never inserts unwanted spaces)
    if (e.key === ' ') {
      e.preventDefault();
      markInteracted();
      speakCurrent();
      return;
    }

    // Tab = skip word
    if (e.key === 'Tab') {
      e.preventDefault();
      skipWord();
      return;
    }
  });

  // Global Enter on results screen
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isPlaying && resultsArea.classList.contains('show')) {
      e.preventDefault();
      startNewRound();
    }
  });

  // Speaker button still works for mouse users
  speakerBtn.addEventListener('click', () => {
    markInteracted();
    speakCurrent();
  });

  // ── INIT ──
  function init() {
    let savedLang = 'ar'; try { savedLang = localStorage.getItem('barqtype_lang') || JSON.parse(localStorage.getItem('ts2') || '{}').lang || 'ar'; } catch(e){} setDictLang(savedLang);
    setDictDifficulty('easy');
    updateLabels();
    startNewRound();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
