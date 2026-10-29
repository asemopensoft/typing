// ==============================================================
// 1. CURRICULUM DATA (18 ARABIC + 18 ENGLISH LESSONS)
// ==============================================================

var CURRICULUM = {
  ar: [
    {
      id: "ar_s1",
      num: 1,
      title: "الصف الأساسي (Home Row)",
      desc: "تعلم مفاتيح الارتكاز وبناء وضعية اليدين الصحيحة على الكيبورد دون النظر للمفاتيح.",
      lessons: [
        {
          id: "ar_1_1",
          title: "مفاتيح الارتكاز والسبابتين (ت، ب)",
          desc: "ضع السبابة اليمنى على (ت) واليسرى على (ب). النتوء البارز يرشدك للموضع الصحيح دائماً.",
          keys: ["ت", "ب", "مسافة"],
          text: "تت بب تب بت تتت ببب تبت بتب تت بب تبت بت ت ب ت ب بت تب تت بب تبت بتب"
        },
        {
          id: "ar_1_2",
          title: "أصابع الصف الأساسي (ن، م، ك / ي، س، ش)",
          desc: "اليمين: ن (وسطى)، م (بنصر)، ك (خنصر). اليسار: ي (وسطى)، س (بنصر)، ش (خنصر).",
          keys: ["ن", "م", "ك", "ي", "س", "ش"],
          text: "بيت بنت تين مسك سمك سكت شمس يمس سمن سكين كم نم تم بن تن سن شن مس كك مم نن"
        },
        {
          id: "ar_1_3",
          title: "تمدد السبابتين والصف الأساسي الكامل (ا، ل)",
          desc: "تمدد بالسبابة اليمنى يساراً إلى (ا) وباليسرى يميناً إلى (ل) لتكتمل حروف الصف الأساسي.",
          keys: ["ا", "ل", "ط"],
          text: "كل بل تل مال سال نام مات كتب لبن شمل سليم لسان سلام كاتب نبات لباس شباك كمن"
        }
      ]
    },
    {
      id: "ar_s2",
      num: 2,
      title: "الصف العلوي (Upper Row)",
      desc: "الصعود بالأصابع إلى الصف العلوي والعودة مباشرة لوضعية الارتكاز.",
      lessons: [
        {
          id: "ar_2_1",
          title: "سبابة ووسطى الصف العلوي (ع، غ، ف، ق، ث، هـ)",
          desc: "سبابة اليمين لـ (ع، غ) ووسطى لـ (هـ). سبابة اليسار لـ (ف، ق) ووسطى لـ (ث).",
          keys: ["ع", "غ", "ف", "ق", "ث", "ه"],
          text: "علم عمل فعل فهم قلم عسل سهم غالب شهد فلك عقل ثقة ثعلب قفل غيم لهب سقف"
        },
        {
          id: "ar_2_2",
          title: "أطراف الصف العلوي (ص، ض، خ، ح، ج، د)",
          desc: "أتقن حروف أطراف الصف العلوي: (خ، ح، ج، د) باليد اليمنى، و(ص، ض) باليد اليسرى.",
          keys: ["ص", "ض", "خ", "ح", "ج", "د"],
          text: "صدق حق خلق جهد خشب جبل دمع ضحك مدح نجاح صيف ضيف حكم فتح دخل قصد حقد"
        },
        {
          id: "ar_2_3",
          title: "دمج وانسيابية الصفين الأساسي والعلوي",
          desc: "تدريب عملي يجمع بين الصف الأساسي والصف العلوي في كلمات متناسقة تتدفق بسلاسة.",
          keys: ["علم", "صدق", "خلق", "نجاح"],
          text: "علم نافع فتح باب النجاح دمع العين فضل الصدق خلق جميل كتم الغضب صدق الحديث كسب حلال"
        }
      ]
    },
    {
      id: "ar_s3",
      num: 3,
      title: "الصف السفلي (Lower Row)",
      desc: "الهبوط بالأصابع إلى الصف السفلي وإتقان جميع حروف الكيبورد الأساسية والهمزات.",
      lessons: [
        {
          id: "ar_3_1",
          title: "سبابة ووسطى الصف السفلي (ر، لا، ى، ة)",
          desc: "انزل بالسبابة اليمنى نحو (ر، ى) والوسطى نحو (ة). وباليد اليسرى نحو (لا).",
          keys: ["ر", "لا", "ى", "ة"],
          text: "ربيع رحمة سيرة فكرة نهضة طريق قوة حياة أثر قرية شجرة بشرى حكمة هدى راية"
        },
        {
          id: "ar_3_2",
          title: "بنصر وخنصر الصف السفلي والهمزات (و، ز، ظ، ء، ئ، ؤ)",
          desc: "أتقن مفاتيح: (و، ز، ظ) باليد اليمنى، و(ء، ئ، ؤ) باليد اليسرى مع علامات الترقيم.",
          keys: ["و", "ز", "ظ", "ء", "ئ", "ؤ", "،", "."],
          text: "ضوء، جزء، تفاؤل، فضاء، ظرف، نقاء، وفاء، هواء، زهرة، روعة، فائز، مسؤول، سؤال، ظلال."
        },
        {
          id: "ar_3_3",
          title: "تكامل الكيبورد الكامل (جميع الصفوف الثلاثة)",
          desc: "تمارين تجمع كامل حروف الكيبورد العربي في الصفوف الثلاثة بتناسق وإيقاع مريح.",
          keys: ["نهر", "بحر", "سماء", "ضياء"],
          text: "العلم يرفع بيتا لا عماد له، والجهل يهدم بيت العز والشرف. القراءة تضيء دروب الفكر وتصقل الروح."
        }
      ]
    },
    {
      id: "ar_s4",
      num: 4,
      title: "الكلمات وتدفق الحروف (Words)",
      desc: "بناء تدفق مستمر وسلس لأكثر الكلمات شيوعاً دون التوقف المفاجئ بين الحروف.",
      lessons: [
        {
          id: "ar_4_1",
          title: "أكثر الكلمات العربية استخداماً",
          desc: "تثبيت الكلمات المتكررة في النصوص لبناء سرعة كتابة تلقائية عبر الذاكرة العضلية.",
          keys: ["في", "من", "على", "كان"],
          text: "في من على إلى عن مع كان هذا كل يوم عمل علم خير حق قول فعل رشد فضل نفع زمن عهد"
        },
        {
          id: "ar_4_2",
          title: "توازن اليدين وتناوب الأصابع",
          desc: "كلمات تتناوب فيها الحروف بين اليدين اليمنى واليسرى لانسيابية مضاعفة وإيقاع ثابت.",
          keys: ["وطن", "معلم", "مبدع", "صديق"],
          text: "وطن مهندس معلم كاتب طالب مفكر مخلص مبدع قائد طبيب باحث مسافر صديق وفي شجاع كريم حليم عادل"
        },
        {
          id: "ar_4_3",
          title: "اللواحق والتراكيب الشائعة",
          desc: "التدريب على بادئات الكلمات ونهاياتها الشائعة (ال التعريف، التاء المربوطة، التنوين).",
          keys: ["التعليم", "المستمر", "الإتقان"],
          text: "التعلم المستمر التفكير السليم التطوير الدائم الإتقان التام الابتكار الرائد المحاولة المتكررة الثقة الراسخة"
        }
      ]
    },
    {
      id: "ar_s5",
      num: 5,
      title: "الجمل وعلامات الترقيم (Sentences)",
      desc: "كتابة جمل فصيحة متكاملة واستخدام الفاصلة والنقطة والمسافات بدقة دون النظر.",
      lessons: [
        {
          id: "ar_5_1",
          title: "جمل قصيرة متقنة مع علامات الترقيم",
          desc: "تعلم إدراج الفاصلة (،) والنقطة (.) بعد الكلمات مع مسافة واحدة صحيحة.",
          keys: ["،", "."],
          text: "الصدق منجاة، والكذب مهواة. الصبر مفتاح الفرج، والعمل شرف الإنسان. الوقت كنز ثمين، فاغتنمه بالخير."
        },
        {
          id: "ar_5_2",
          title: "أمثال وحكم عربية بليغة",
          desc: "نصوص رصينة تعزز مهارة القراءة المسبقة بالعين أثناء طباعة الكلمات الحالية بالأصابع.",
          keys: ["حكمة", "مثل", "أثر"],
          text: "من جد وجد ومن زرع حصد، ومن سار على الدرب وصل. خير الكلام ما قل ودل، وخير العمل ما نفع الناس."
        },
        {
          id: "ar_5_3",
          title: "تدفق الفقرات المتصلة",
          desc: "الحفاظ على وتيرة موحدة وثابتة أثناء الانتقال بين جملتين دون تباطؤ.",
          keys: ["فقرات", "انسيابية", "ثبات"],
          text: "تبدأ رحلة النجاح بخطوة واثقة نحو الهدف المنشود، والعزيمة الصادقة تذلل أصعب العقبات في طريق التميز."
        }
      ]
    },
    {
      id: "ar_s6",
      num: 6,
      title: "السرعة والتمكن (Speed & Mastery)",
      desc: "رفع معدل الكلمات في الدقيقة (WPM) وتحقيق دقة 90%+ للحصول على شهادة الإتقان والتاج.",
      lessons: [
        {
          id: "ar_6_1",
          title: "سباق السرعة الأول (هدف 25+ WPM)",
          desc: "تحدي زمني سريع لاختبار دقة وسرعة انطلاق أصابعك على لوحة المفاتيح.",
          keys: ["تحدي", "سرعة", "انطلاق"],
          text: "كن متفائلا في كل خطوة، فالأمل يفتح الأبواب المغلقة ويمنحك القوة لمواصلة الكفاح بثبات وثقة عالية."
        },
        {
          id: "ar_6_2",
          title: "سباق الكفاءة العالية (هدف 40+ WPM)",
          desc: "رفع الإيقاع الذهني والحركي لمستوى الطباعين المحترفين بسرعة تتجاوز 40 كلمة بالدقيقة.",
          keys: ["كفاءة", "إتقان", "احتراف"],
          text: "إن سرعة التفكير وجودة التنفيذ ركيزتان أساسيتان لتحقيق الإنجازات الكبرى في عالم سريع التغير ومتسارع الخطى."
        },
        {
          id: "ar_6_3",
          title: "الاختبار النهائي والتاج الذهبي",
          desc: "الاختبار الشامل لمسار التعلم! أثبت تمكنك الكامل بدقة 95%+ لتتوج بالتاج الذهبي.",
          keys: ["تتويج", "تاج", "نجاح"],
          text: "الطباعة السريعة باللمس مهارة حيوية تجعل لوحة المفاتيح امتدادا طبيعيا لأفكارك، ومبارك وصولك لقمة الاحتراف."
        }
      ]
    }
  ],
  en: [
    {
      id: "en_s1",
      num: 1,
      title: "Home Row Foundations",
      desc: "Master anchor keys (F, J) and rest finger positioning without looking at the keyboard.",
      lessons: [
        {
          id: "en_1_1",
          title: "Anchor Keys & Index Fingers (F, J)",
          desc: "Left index rests on F and right index on J. Feel the tactile bumps on both keycaps.",
          keys: ["f", "j", "space"],
          text: "ff jj fj jf ff jj fjf jfj fff jjj f j j f fj jf ff jj fj jf fjf jfj ff jj"
        },
        {
          id: "en_1_2",
          title: "Core Home Row (D, K, S, L, A, ;)",
          desc: "Left hand: D, S, A. Right hand: K, L, ;. Keep wrists relaxed and slightly hovering.",
          keys: ["d", "k", "s", "l", "a", ";"],
          text: "ask dad lad fall flask salads all sad salads ask dad fall flask alas salads all lad dad"
        },
        {
          id: "en_1_3",
          title: "Index Reaches (G, H) & Full Home Row",
          desc: "Stretch left index to G and right index to H. Return instantly to anchor keys.",
          keys: ["g", "h"],
          text: "glad flag flash half glass alas dash had shall salads flask alfalfa fall glad half glass flag"
        }
      ]
    },
    {
      id: "en_s2",
      num: 2,
      title: "Upper Row Expansion",
      desc: "Reach up to the top row and instantly snap fingers back to the home row anchor position.",
      lessons: [
        {
          id: "en_2_1",
          title: "Upper Index & Middle (E, R, U, I)",
          desc: "Left reaches up to E and R. Right reaches up to U and I. Return to home keys immediately.",
          keys: ["e", "r", "u", "i"],
          text: "fire rude sure user deer fair ride free gear hear lake like hide rise rush leaf life safe"
        },
        {
          id: "en_2_2",
          title: "Upper Ring, Pinky & Reaches (W, O, Q, P, T, Y)",
          desc: "Reach W, Q on the left; O, P on the right; and reaches T, Y with your index fingers.",
          keys: ["w", "o", "q", "p", "t", "y"],
          text: "write world quote quiet water today great power yellow people light party treat sweet youth"
        },
        {
          id: "en_2_3",
          title: "Home & Upper Row Word Integration",
          desc: "Connect the home row and top row smoothly to form rich English vocabulary.",
          keys: ["great", "people", "write", "future"],
          text: "great people write great poetry free youth walk toward bright future fresh water fills deep wells"
        }
      ]
    },
    {
      id: "en_s3",
      num: 3,
      title: "Lower Row Navigation",
      desc: "Curl fingers gracefully downward to master the bottom row keys while preserving wrist posture.",
      lessons: [
        {
          id: "en_3_1",
          title: "Lower Index & Middle (V, B, N, M)",
          desc: "Left index curls down to V, B. Right index curls to N, M. Keep light rhythmic taps.",
          keys: ["v", "b", "n", "m"],
          text: "move brave name best time make mind number given verb dream brain river balance combine"
        },
        {
          id: "en_3_2",
          title: "Lower Ring, Pinky & Punctuation (C, X, Z, Comma, Period)",
          desc: "Complete the alphabet with C, X, Z, along with standard comma and period punctuation.",
          keys: ["c", "x", "z", ",", "."],
          text: "the quick brown fox jumps over the lazy dog, and packs five dozen velvet jugs. zero extra complex size."
        },
        {
          id: "en_3_3",
          title: "Full Keyboard Pangrams & Three-Row Flow",
          desc: "Practice comprehensive pangrams that exercise every letter across all three keyboard rows.",
          keys: ["pangram", "flow", "rhythm"],
          text: "pack my box with five dozen liquor jugs. bright vixens jump; dozy fowl quack. crazy frederick bought opal jewels."
        }
      ]
    },
    {
      id: "en_s4",
      num: 4,
      title: "High-Frequency Words",
      desc: "Build seamless muscle memory for the most common English words and Shift key capitalization.",
      lessons: [
        {
          id: "en_4_1",
          title: "Top Most Common Words",
          desc: "Master the high-frequency words that constitute the majority of everyday English reading.",
          keys: ["the", "that", "have", "with"],
          text: "the of and to a in is you that it he was for on are as with his they at be this have from one all would"
        },
        {
          id: "en_4_2",
          title: "Rhythmic Hand Alternation",
          desc: "Words that alternate cleanly between left and right hands for effortless typing speed.",
          keys: ["balance", "cadence", "rhythm"],
          text: "problem visual island profit formal enrich signals visual height authentic element panel field suspend dynamic"
        },
        {
          id: "en_4_3",
          title: "Common Prefixes and Suffixes",
          desc: "Train automatic finger sequences for common endings: -ing, -tion, -ment, -able, -ness.",
          keys: ["ing", "tion", "ment", "ness"],
          text: "learning movement kindness powerful development creative building action national stable forward beautiful"
        }
      ]
    },
    {
      id: "en_s5",
      num: 5,
      title: "Sentences & Cadence",
      desc: "Type complete grammatical sentences with rhythm, punctuation, and steady pacing.",
      lessons: [
        {
          id: "en_5_1",
          title: "Conversational Flow & Punctuation",
          desc: "Practice natural sentence flow with proper single spacing after commas and periods.",
          keys: [",", "."],
          text: "Consistency is the true secret of speed. Practice every day with calm focus, and your fingers will fly across the keys."
        },
        {
          id: "en_5_2",
          title: "Inspiring Quotes & Timeless Wisdom",
          desc: "Read whole words ahead with your eyes while your fingers execute the current word automatically.",
          keys: ["focus", "wisdom", "dreams"],
          text: "The future belongs to those who believe in the beauty of their dreams. Small daily improvements lead to stunning results."
        },
        {
          id: "en_5_3",
          title: "Flowing Multi-Sentence Paragraphs",
          desc: "Maintain a smooth, piano-like cadence without stopping abruptly between words.",
          keys: ["cadence", "fluidity", "harmony"],
          text: "True skill comes from relaxed repetition and patience. When your mind quiets down, muscle memory takes over naturally."
        }
      ]
    },
    {
      id: "en_s6",
      num: 6,
      title: "Speed & Mastery",
      desc: "Push your speed beyond 40+ WPM with 90%+ accuracy to earn your Grand Master Certification.",
      lessons: [
        {
          id: "en_6_1",
          title: "Speed Sprint 1 (Goal: 30+ WPM)",
          desc: "Fast-paced sprint test. Focus on clean, rhythmic typing with minimal backspacing.",
          keys: ["speed", "sprint", "rhythm"],
          text: "Speed is a natural consequence of rhythm and precision. Trust your fingers and let each keystroke land with clear confidence."
        },
        {
          id: "en_6_2",
          title: "Advanced Pro Sprint (Goal: 45+ WPM)",
          desc: "Elevate your pace to match professional touch-typists worldwide with unwavering accuracy.",
          keys: ["precision", "pro", "mastery"],
          text: "Every master was once a beginner who refused to quit. Keep your eyes on the text and let muscle memory drive your typing speed."
        },
        {
          id: "en_6_3",
          title: "Grand Master Graduation & Gold Crown",
          desc: "The ultimate challenge! Complete this final exam with 90%+ accuracy to graduate with honors.",
          keys: ["crown", "graduation", "gold"],
          text: "Congratulations on achieving true touch typing mastery. Your fingers now express your ideas at the speed of thought."
        }
      ]
    }
  ]
};


// ==============================================================
// 2. KEYBOARD & FINGER MAPPINGS (IQUNIX A80 - FIXED PHYSICAL LTR)
// ==============================================================
var FINGER_DATA = {
  lp: { name: "Left Pinky", color: "#e55656" },
  lr: { name: "Left Ring", color: "#ed8936" },
  lm: { name: "Left Middle", color: "#ecc94b" },
  li: { name: "Left Index", color: "#48bb78" },
  ri: { name: "Right Index", color: "#38b2ac" },
  rm: { name: "Right Middle", color: "#4299e1" },
  rr: { name: "Right Ring", color: "#9f7aea" },
  rp: { name: "Right Pinky", color: "#ed64a6" },
  th: { name: "Thumb", color: "#a0aec0" }
};

var KB_ROWS = [
  [
    { k: "`~", ar: "ذ", w: 1, f: "lp" },
    { k: "1", ar: "١", w: 1, f: "lp" },
    { k: "2", ar: "٢", w: 1, f: "lr" },
    { k: "3", ar: "٣", w: 1, f: "lm" },
    { k: "4", ar: "٤", w: 1, f: "li" },
    { k: "5", ar: "٥", w: 1, f: "li" },
    { k: "6", ar: "٦", w: 1, f: "ri" },
    { k: "7", ar: "٧", w: 1, f: "ri" },
    { k: "8", ar: "٨", w: 1, f: "rm" },
    { k: "9", ar: "٩", w: 1, f: "rr" },
    { k: "0", ar: "٠", w: 1, f: "rp" },
    { k: "-_", ar: "-", w: 1, f: "rp" },
    { k: "=+", ar: "=", w: 1, f: "rp" },
    { k: "Backspace", ar: "Backspace", w: 2, f: "rp", special: true }
  ],
  [
    { k: "Tab", ar: "Tab", w: 1.5, f: "lp", special: true },
    { k: "Q", ar: "ض", w: 1, f: "lp" },
    { k: "W", ar: "ص", w: 1, f: "lr" },
    { k: "E", ar: "ث", w: 1, f: "lm" },
    { k: "R", ar: "ق", w: 1, f: "li" },
    { k: "T", ar: "ف", w: 1, f: "li" },
    { k: "Y", ar: "غ", w: 1, f: "ri" },
    { k: "U", ar: "ع", w: 1, f: "ri" },
    { k: "I", ar: "هـ", w: 1, f: "rm" },
    { k: "O", ar: "خ", w: 1, f: "rr" },
    { k: "P", ar: "ح", w: 1, f: "rp" },
    { k: "[{", ar: "ج", w: 1, f: "rp" },
    { k: "]}", ar: "د", w: 1, f: "rp" },
    { k: "\\|", ar: "\\", w: 1.5, f: "rp" }
  ],
  [
    { k: "Caps", ar: "Caps", w: 1.75, f: "lp", special: true },
    { k: "A", ar: "ش", w: 1, f: "lp" },
    { k: "S", ar: "س", w: 1, f: "lr" },
    { k: "D", ar: "ي", w: 1, f: "lm" },
    { k: "F", ar: "ب", w: 1, f: "li", bump: true },
    { k: "G", ar: "ل", w: 1, f: "li" },
    { k: "H", ar: "ا", w: 1, f: "ri" },
    { k: "J", ar: "ت", w: 1, f: "ri", bump: true },
    { k: "K", ar: "ن", w: 1, f: "rm" },
    { k: "L", ar: "م", w: 1, f: "rr" },
    { k: ";:", ar: "ك", w: 1, f: "rp" },
    { k: "'\"", ar: "ط", w: 1, f: "rp" },
    { k: "Enter", ar: "Enter", w: 2.25, f: "rp", special: true }
  ],
  [
    { k: "Shift", ar: "Shift", w: 2.25, f: "lp", special: true },
    { k: "Z", ar: "ئ", w: 1, f: "lp" },
    { k: "X", ar: "ء", w: 1, f: "lr" },
    { k: "C", ar: "ؤ", w: 1, f: "lm" },
    { k: "V", ar: "ر", w: 1, f: "li" },
    { k: "B", ar: "لا", w: 1, f: "li" },
    { k: "N", ar: "ى", w: 1, f: "ri" },
    { k: "M", ar: "ة", w: 1, f: "ri" },
    { k: ",<", ar: "و", w: 1, f: "rm" },
    { k: ".>", ar: "ز", w: 1, f: "rr" },
    { k: "/?", ar: "ظ", w: 1, f: "rp" },
    { k: "Shift", ar: "Shift", w: 2.75, f: "rp", special: true }
  ],
  [
    { k: "Ctrl", ar: "Ctrl", w: 1.25, f: "lp", special: true },
    { k: "Alt", ar: "Alt", w: 1.25, f: "lp", special: true },
    { k: "Space", ar: "مسافة", w: 6.25, f: "th", special: true },
    { k: "Alt", ar: "Alt", w: 1.25, f: "rp", special: true },
    { k: "Ctrl", ar: "Ctrl", w: 1.25, f: "rp", special: true }
  ]
];

var QWERTY_TO_AR = {
  "`": "ذ", "~": "ّ", "1": "1", "!": "!", "2": "2", "@": "@", "3": "3", "#": "#",
  "4": "4", "$": "$", "5": "5", "%": "%", "6": "6", "^": "^", "7": "7", "&": "&",
  "8": "8", "*": "*", "9": "9", "(": "(", "0": "0", ")": ")", "-": "-", "_": "_",
  "=": "=", "+": "+",
  "q": "ض", "Q": "َ", "w": "ص", "W": "ً", "e": "ث", "E": "ُ", "r": "ق", "R": "ٌ",
  "t": "ف", "T": "لإ", "y": "غ", "Y": "إ", "u": "ع", "U": "‘", "i": "ه", "I": "÷",
  "o": "خ", "O": "×", "p": "ح", "P": "؛", "[": "ج", "{": "<", "]": "د", "}": ">",
  "\\": "\\", "|": "|",
  "a": "ش", "A": "ِ", "s": "س", "S": "ٍ", "d": "ي", "D": "]", "f": "ب", "F": "[",
  "g": "ل", "G": "لأ", "h": "ا", "H": "أ", "j": "ت", "J": "ـ", "k": "ن", "K": "،",
  "l": "م", "L": "/", ";": "ك", ":": ":", "'": "ط", "\"": "\"",
  "z": "ئ", "Z": "~", "x": "ء", "X": "ْ", "c": "ؤ", "C": "}", "v": "ر", "V": "{",
  "b": "لا", "B": "لآ", "n": "ى", "N": "آ", "m": "ة", "M": "’", ",": "و", "<": ",",
  ".": "ز", ">": ".", "/": "ظ", "?": "؟", " ": " "
};

function normalizeArabic(c) {
  if (!c) return "";
  if (c === "أ" || c === "إ" || c === "آ" || c === "ٱ") return "ا";
  if (c === "ة") return "ه";
  if (c === "ى") return "ي";
  return c;
}

function matchTypedKey(typed, expected, lang) {
  if (typed === expected) return true;
  if (lang === "ar") {
    if (normalizeArabic(typed) === normalizeArabic(expected)) return true;
    var mapped = QWERTY_TO_AR[typed];
    if (mapped) {
      if (mapped === expected) return true;
      if (normalizeArabic(mapped) === normalizeArabic(expected)) return true;
    }
  } else {
    if (typed.toLowerCase() === expected.toLowerCase()) return true;
  }
  return false;
}

var VK_FINGER_MAP = {
  tilda: 'lp', '1': 'lp', q: 'lp', a: 'lp', z: 'lp',
  tab: 'lp', capslock: 'lp', 'shift-left': 'lp', control: 'lp',
  '2': 'lr', w: 'lr', s: 'lr', x: 'lr',
  '3': 'lm', e: 'lm', d: 'lm', c: 'lm',
  '4': 'li', '5': 'li', r: 'li', t: 'li', f: 'li', g: 'li', v: 'li', b: 'li',
  '6': 'ri', '7': 'ri', y: 'ri', u: 'ri', h: 'ri', j: 'ri', n: 'ri', m: 'ri',
  '8': 'rm', i: 'rm', k: 'rm', comma: 'rm',
  '9': 'rr', o: 'rr', l: 'rr', dot: 'rr',
  '0': 'rp', minus: 'rp', equal: 'rp', p: 'rp',
  'left-center-bracket': 'rp', 'right-center-bracket': 'rp', backslash: 'rp',
  semicolon: 'rp', 'single-quote': 'rp', slash: 'rp',
  enter: 'rp', 'shift-right': 'rp', backspace: 'rp', 'alt-right': 'rp',
  space: 'th'
};

function mapCharToVkId(ch, lang) {
  if (!ch) return 'neutral';
  if (ch === ' ') return 'space';
  if (lang === 'ar') {
    var arToEn = {
      'ذ': 'tilda', '١': '1', '٢': '2', '٣': '3', '٤': '4', '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9', '٠': '0',
      'ض': 'q', 'ص': 'w', 'ث': 'e', 'ق': 'r', 'ف': 't', 'غ': 'y', 'ع': 'u', 'ه': 'i', 'هـ': 'i', 'خ': 'o', 'ح': 'p', 'ج': 'left-center-bracket', 'د': 'right-center-bracket',
      'ش': 'a', 'س': 's', 'ي': 'd', 'ب': 'f', 'ل': 'g', 'ا': 'h', 'أ': 'h', 'إ': 'y', 'آ': 'n', 'ت': 'j', 'ن': 'k', 'م': 'l', 'ك': 'semicolon', 'ط': 'single-quote',
      'ئ': 'z', 'ء': 'x', 'ؤ': 'c', 'ر': 'v', 'لا': 'b', 'ى': 'n', 'ة': 'm', 'و': 'comma', 'ز': 'dot', 'ظ': 'slash',
      'لإ': 't', 'لأ': 'g', 'لآ': 'b',
      '،': 'comma', '؛': 'semicolon', '؟': 'slash', '.': 'dot', 'ّ': 'tilda'
    };
    return arToEn[ch] || 'neutral';
  } else {
    var c = ch.toLowerCase();
    if (c >= 'a' && c <= 'z') return c;
    if (c >= '0' && c <= '9') return c;
    if (c === '.') return 'dot';
    if (c === ',') return 'comma';
    if (c === ';') return 'semicolon';
    if (c === "'") return 'single-quote';
    if (c === '/') return 'slash';
    return 'neutral';
  }
}

// ==============================================================
// 3. STORAGE & VERSIONED PROGRESS SYSTEM (INDEPENDENT AR/EN)
// ==============================================================
var STORAGE_KEY = "barqtype_learn_v2";
var USER_PROGRESS = {
  ar: { completed: {}, bestWpm: {}, bestAcc: {}, stars: {}, lastStage: "ar_s1", lastLesson: "ar_1_1" },
  en: { completed: {}, bestWpm: {}, bestAcc: {}, stars: {}, lastStage: "en_s1", lastLesson: "en_1_1" }
};

function loadProgress() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("barqtype_learn_v1");
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed.ar) USER_PROGRESS.ar = Object.assign(USER_PROGRESS.ar, parsed.ar);
      if (parsed.en) USER_PROGRESS.en = Object.assign(USER_PROGRESS.en, parsed.en);
    }
  } catch (e) {
    console.warn("Storage load error:", e);
  }
  syncLearnWithCloud();
}

function syncLearnWithCloud() {
  if (typeof window !== 'undefined' && window.BarqAPI && window.BarqAPI.isLoggedIn && window.BarqAPI.isLoggedIn()) {
    window.BarqAPI.getLearnProgress().then(function (res) {
      if (res && res.progress && Array.isArray(res.progress)) {
        res.progress.forEach(function (p) {
          var l = p.lang || 'ar';
          if (!USER_PROGRESS[l]) return;
          USER_PROGRESS[l].completed[p.lesson_id] = true;
          if (!USER_PROGRESS[l].bestWpm[p.lesson_id] || p.best_wpm > USER_PROGRESS[l].bestWpm[p.lesson_id]) {
            USER_PROGRESS[l].bestWpm[p.lesson_id] = p.best_wpm;
          }
          if (!USER_PROGRESS[l].bestAcc[p.lesson_id] || p.best_acc > USER_PROGRESS[l].bestAcc[p.lesson_id]) {
            USER_PROGRESS[l].bestAcc[p.lesson_id] = p.best_acc;
          }
          if (!USER_PROGRESS[l].stars[p.lesson_id] || p.stars > USER_PROGRESS[l].stars[p.lesson_id]) {
            USER_PROGRESS[l].stars[p.lesson_id] = p.stars;
          }
        });
        saveProgress();
        if (typeof renderStagesGrid === 'function' && document.getElementById('view-stages').style.display !== 'none') {
          renderStagesGrid();
        }
      }
    }).catch(function (e) {
      console.warn("Cloud learn sync error:", e);
    });
  }
}
window.syncLearnWithCloud = syncLearnWithCloud;

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(USER_PROGRESS));
  } catch (e) {
    console.warn("Storage save error:", e);
  }
}

// ==============================================================
// 4. SOUND ENGINE (RAZER GREEN SYNTHESIS)
// ==============================================================
var SOUND_ENABLED = true;
var _actx = null, _rgSounds = [], _spaceSound = null, _backspaceSound = null, _errSound = null;

function initAudio() {
  if (_actx) return;
  try {
    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    _actx = new AudioCtx({ latencyHint: 0, sampleRate: 44100 });
    _rgSounds = [
      _synthRGSound(_actx, 0), _synthRGSound(_actx, 1), _synthRGSound(_actx, 2),
      _synthRGSound(_actx, 3), _synthRGSound(_actx, 4), _synthRGSound(_actx, 5)
    ];
    _spaceSound = _synthSpaceSound(_actx);
    _backspaceSound = _synthRGSound(_actx, 2, false, true);
    _errSound = _synthErrSound(_actx);
  } catch (e) { }
}

function _synthRGSound(actx, variant, isSpace, isBackspace) {
  var sr = actx.sampleRate;
  var dur = isSpace ? 0.075 : (isBackspace ? 0.048 : 0.052);
  var len = Math.floor(sr * dur);
  var buf = actx.createBuffer(1, len, sr);
  var d = buf.getChannelData(0);

  var pitch = 1.0 + (variant - 2.5) * 0.035;
  if (isSpace) pitch *= 0.62;
  if (isBackspace) pitch *= 1.15;

  var thockFreq = (isSpace ? 185 : 365) * pitch;
  var thockDecay = isSpace ? 48 : 78;
  var clackFreq = (isSpace ? 470 : 860) * pitch;
  var clackDecay = isSpace ? 82 : 125;
  var snapFreq = (isSpace ? 2100 : 3300) * pitch;
  var clickFreq = (isSpace ? 2900 : 4100) * pitch;
  var clickDecay = isSpace ? 360 : 520;

  function makeFilter(f, Q) {
    var w = 2 * Math.PI * f / sr;
    var alpha = Math.sin(w) / (2 * Q);
    var a0 = 1 + alpha;
    return {
      b0: alpha / a0,
      a1: (-2 * Math.cos(w)) / a0,
      a2: (1 - alpha) / a0,
      x1: 0, x2: 0, y1: 0, y2: 0,
      tick: function (x) {
        var y = this.b0 * (x - this.x2) - this.a1 * this.y1 - this.a2 * this.y2;
        this.x2 = this.x1;
        this.x1 = x;
        this.y2 = this.y1;
        this.y1 = y;
        return y;
      }
    };
  }

  var fThock = makeFilter(thockFreq, isSpace ? 3.6 : 4.0);
  var fClack = makeFilter(clackFreq, 4.6);
  var fSnap = makeFilter(snapFreq, 5.8);
  var fClick = makeFilter(clickFreq, 7.2);

  for (var i = 0; i < len; i++) {
    var t = i / sr;
    var impactEnv = Math.exp(-t * 1900);
    var spike = (i === 0) ? 0.95 : (i === 1) ? -0.8 : (i === 2) ? 0.55 : (i === 3) ? -0.35 : 0;
    var contactNoise = (Math.random() * 2 - 1) * impactEnv;
    var x = spike * 0.75 + contactNoise * 0.45;

    var resThock = fThock.tick(x);
    var resClack = fClack.tick(x);
    var resSnap = fSnap.tick(x);
    var resClick = fClick.tick(x);

    var bottomOut = Math.sin(2 * Math.PI * thockFreq * t) * Math.exp(-t * thockDecay) * (isSpace ? 0.56 : 0.38);
    var stemSnap = (Math.random() * 2 - 1) * Math.exp(-t * (isSpace ? 420 : 660)) * 0.18;
    var highTick = Math.cos(2 * Math.PI * clickFreq * t) * Math.exp(-t * clickDecay) * 0.16;

    var sample = resThock * 1.7 + resClack * 1.15 + resSnap * 0.7 + resClick * 0.5 + bottomOut + stemSnap + highTick;

    var masterEnv = t < 0.0003 ? (t / 0.0003) : Math.exp(-t * (isSpace ? 40 : 60));
    sample *= masterEnv;

    d[i] = Math.tanh(sample * 1.35) * (isSpace ? 0.92 : 0.86);
  }
  return buf;
}
function _oldSynthRG(actx, variant) {
  var dur = 0.045, len = Math.floor(actx.sampleRate * dur);
  var buf = actx.createBuffer(1, len, actx.sampleRate), d = buf.getChannelData(0);
  var pitchMod = 1.0 + (variant - 1) * 0.07;
  for (var i = 0; i < len; i++) {
    var t = i / actx.sampleRate;
    var click = Math.sin(2 * Math.PI * 3400 * pitchMod * t) * Math.exp(-t * 320);
    var body = Math.sin(2 * Math.PI * 850 * pitchMod * t) * Math.exp(-t * 90);
    var snap = (Math.random() * 2 - 1) * Math.exp(-t * 500) * 0.45;
    d[i] = (click * 0.5 + body * 0.35 + snap) * 0.7;
  }
  return buf;
}

function _synthSpaceSound(actx) {
  return _synthRGSound(actx, 0, true, false);
}
function _oldSpace(actx) {
  var dur = 0.065, len = Math.floor(actx.sampleRate * dur);
  var buf = actx.createBuffer(1, len, actx.sampleRate), d = buf.getChannelData(0);
  for (var i = 0; i < len; i++) {
    var t = i / actx.sampleRate;
    var thud = Math.sin(2 * Math.PI * 220 * t) * Math.exp(-t * 60);
    var snap = (Math.random() * 2 - 1) * Math.exp(-t * 300) * 0.25;
    d[i] = (thud * 0.7 + snap) * 0.8;
  }
  return buf;
}

function _synthErrSound(actx) {
  var sr = actx.sampleRate;
  var len = Math.floor(sr * 0.062);
  var buf = actx.createBuffer(1, len, sr);
  var d = buf.getChannelData(0);
  var thudFreq = 165;
  for (var i = 0; i < len; i++) {
    var t = i / sr;
    var impact = (i === 0) ? 0.7 : (i === 1) ? -0.5 : (i === 2) ? 0.3 : 0;
    var wobble = (Math.random() * 2 - 1) * Math.exp(-t * 320) * 0.22;
    var lowThud = Math.sin(2 * Math.PI * thudFreq * t) * Math.exp(-t * 68) * 0.58;
    var bodyPop = Math.sin(2 * Math.PI * 320 * t) * Math.exp(-t * 115) * 0.32;
    var sample = (impact * 0.3 + wobble + lowThud + bodyPop) * Math.exp(-t * 42);
    d[i] = Math.tanh(sample * 1.2) * 0.8;
  }
  return buf;
}
function _oldErr(actx) {
  var dur = 0.08, len = Math.floor(actx.sampleRate * dur);
  var buf = actx.createBuffer(1, len, actx.sampleRate), d = buf.getChannelData(0);
  for (var i = 0; i < len; i++) {
    var t = i / actx.sampleRate;
    d[i] = Math.sin(2 * Math.PI * 180 * t) * Math.exp(-t * 40) * 0.5;
  }
  return buf;
}

function playKeySound(isSpace, isBackspace) {
  if (!SOUND_ENABLED || !_actx) return;
  if (_actx.state === 'suspended') _actx.resume();
  try {
    var src = _actx.createBufferSource();
    src.buffer = (isSpace && _spaceSound) ? _spaceSound : (isBackspace && _backspaceSound) ? _backspaceSound : _rgSounds[Math.floor(Math.random() * _rgSounds.length)];
    var gain = _actx.createGain();
    gain.gain.value = 0.65;
    src.connect(gain);
    gain.connect(_actx.destination);
    src.start(0);
  } catch (e) { }
}

function playErrSound() {
  if (!SOUND_ENABLED || !_actx || !_errSound) return;
  if (_actx.state === 'suspended') _actx.resume();
  try {
    var src = _actx.createBufferSource();
    src.buffer = _errSound;
    var gain = _actx.createGain();
    gain.gain.value = 0.5;
    src.connect(gain);
    gain.connect(_actx.destination);
    src.start(0);
  } catch (e) { }
}

function toggleSound() {
  SOUND_ENABLED = !SOUND_ENABLED;
  var btn = document.getElementById("btn-sound");
  var svg = document.getElementById("sound-icon-svg");
  if (btn) btn.className = "pb" + (SOUND_ENABLED ? " on" : "");
  if (svg) {
    if (SOUND_ENABLED) {
      svg.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path id="sound-wave-path" d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"></path>';
    } else {
      svg.innerHTML = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>';
    }
  }
}

// ==============================================================
// 5. APPLICATION STATE & ROUTING
// ==============================================================
var CURRENT_LANG = "ar";
var CURRENT_STAGE_ID = "ar_s1";
var CURRENT_LESSON = null;

var LESSON_STATE = {
  active: false,
  text: "",
  idx: 0,
  errors: 0,
  startTime: null,
  timerInterval: null,
  wpm: 0,
  acc: 100
};

function setLanguage(lang) {
  CURRENT_LANG = lang; try { localStorage.setItem("barqtype_lang", lang); var ts2 = JSON.parse(localStorage.getItem("ts2") || "{}"); ts2.lang = lang; localStorage.setItem("ts2", JSON.stringify(ts2)); } catch(e){}
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === "ar" ? "rtl" : "ltr");

  var btnAr = document.getElementById("lang-ar");
  var btnEn = document.getElementById("lang-en");
  if (btnAr) btnAr.className = "pb" + (lang === "ar" ? " on" : "");
  if (btnEn) btnEn.className = "pb" + (lang === "en" ? " on" : "");

  var isAr = (lang === "ar");

  document.title = isAr ? "Barqtype – مسار تعلم الطباعة ثنائي اللغة" : "Barqtype – Bilingual Typing Learning Path";

  var navTest = document.getElementById("txt-nav-test");
  var navStats = document.getElementById("txt-nav-stats");
  var navLearn = document.getElementById("txt-nav-learn");
  if (navTest) navTest.textContent = isAr ? "تدريب" : "Practice";
  if (navStats) navStats.textContent = isAr ? "إحصاءات" : "Stats";
  if (navLearn) navLearn.textContent = isAr ? "تعلم" : "Learn"; var navDictation = document.getElementById("txt-nav-dictation"); if (navDictation) navDictation.textContent = isAr ? "إملاء" : "Dictation"; var navRace = document.getElementById("txt-nav-race"); if (navRace) navRace.textContent = isAr ? "سباق" : "Race";

  document.getElementById("hero-title").textContent = isAr ? "مسار التعلم الذكي لطباعة اللمس" : "Smart Bilingual Touch-Typing Curriculum";
  document.getElementById("hero-desc").textContent = isAr
    ? "خطة تعليمية منهجية من 6 مراحل و18 درساً تنتقل بك من الصفر إلى الاحتراف بذاكرة عضلية فائقة ودون النظر إلى الكيبورد."
    : "A systematic 6-stage, 18-lesson path from beginner basics to fluent touch typing with muscle memory.";
  document.getElementById("txt-overall-lbl").textContent = isAr ? "التقدم العام" : "Overall Progress";
  document.getElementById("txt-back-stages").textContent = isAr ? "العودة إلى المراحل" : "Back to Stages";
  document.getElementById("txt-back-stage").textContent = isAr ? "العودة للدروس" : "Back to Lessons";

  var backArrow = document.getElementById("back-arrow");
  var lessonBackArrow = document.getElementById("lesson-back-arrow");
  if (backArrow) backArrow.textContent = isAr ? "→" : "←";
  if (lessonBackArrow) lessonBackArrow.textContent = isAr ? "→" : "←";

  document.getElementById("lbl-live-wpm").textContent = isAr ? "السرعة (WPM)" : "Speed (WPM)";
  document.getElementById("lbl-live-acc").textContent = isAr ? "الدقة" : "Accuracy";
  document.getElementById("lbl-live-err").textContent = isAr ? "الأخطاء" : "Errors";
  document.getElementById("lbl-live-prog").textContent = isAr ? "التقدم" : "Progress";

  var lblMWpm = document.getElementById("lbl-m-wpm");
  var lblMAcc = document.getElementById("lbl-m-acc");
  var lblMErr = document.getElementById("lbl-m-err");
  if (lblMWpm) lblMWpm.textContent = isAr ? "السرعة" : "Speed";
  if (lblMAcc) lblMAcc.textContent = isAr ? "الدقة" : "Accuracy";
  if (lblMErr) lblMErr.textContent = isAr ? "الأخطاء" : "Errors";

  var footerEl = document.getElementById("learn-footer");
  if (footerEl) {
    footerEl.innerHTML = isAr
      ? "Barqtype Learn &bull; تم الإنشاء والتطوير بواسطة المبرمج   عاصم السلمي"
      : "Barqtype Learn &bull; Created &amp; Developed by Eng. عاصم السلمي";
  }

  buildKeyboard();
  showStagesView();
}

function showStagesView() {
  if (LESSON_STATE.active) stopLesson();
  document.getElementById("view-stages").style.display = "flex";
  document.getElementById("view-stage-lessons").style.display = "none";
  document.getElementById("view-active-lesson").style.display = "none";
  renderStagesGrid();
}

function showStageLessonsView(stageId) {
  if (LESSON_STATE.active) stopLesson();
  CURRENT_STAGE_ID = stageId;
  document.getElementById("view-stages").style.display = "none";
  document.getElementById("view-stage-lessons").style.display = "flex";
  document.getElementById("view-active-lesson").style.display = "none";
  renderStageLessons(stageId);
}

function showActiveLessonView(lesson) {
  CURRENT_LESSON = lesson;
  document.getElementById("view-stages").style.display = "none";
  document.getElementById("view-stage-lessons").style.display = "none";
  document.getElementById("view-active-lesson").style.display = "flex";
  startLesson(lesson);
}

// ==============================================================
// 6. RENDER STAGES & LESSONS (6 STAGES WITH PROGRESS)
// ==============================================================
function renderStagesGrid() {
  var container = document.getElementById("stages-container");
  container.innerHTML = "";
  var stages = CURRICULUM[CURRENT_LANG];
  var prog = USER_PROGRESS[CURRENT_LANG];
  var totalLessons = stages.length * 3;
  var completedCount = Object.keys(prog.completed).length;
  var isAr = (CURRENT_LANG === "ar");

  document.getElementById("overall-progress-text").textContent = isAr ? (completedCount + " من " + totalLessons + " درساً") : (completedCount + " of " + totalLessons + " lessons");
  var pct = Math.round((completedCount / totalLessons) * 100);
  document.getElementById("overall-bar").style.width = pct + "%";

  var currentStageIdx = 0;
  for (var s = 0; s < stages.length; s++) {
    var sComp = 0;
    for (var l = 0; l < stages[s].lessons.length; l++) {
      if (prog.completed[stages[s].lessons[l].id]) sComp++;
    }
    if (sComp < stages[s].lessons.length) {
      currentStageIdx = s;
      break;
    }
    if (s === stages.length - 1) currentStageIdx = stages.length - 1;
  }

  var checkSvg = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px;margin-inline-end:3px"><polyline points="20 6 9 17 4 12"></polyline></svg>';
  var lockSvg = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px;margin-inline-end:3px"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';
  var playSvg = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px;margin-inline-end:3px"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
  var kbSvg = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-inline-end:3px"><rect x="2" y="4" width="20" height="16" rx="2"></rect><line x1="6" y1="8" x2="6.01" y2="8"></line><line x1="10" y1="8" x2="10.01" y2="8"></line><line x1="14" y1="8" x2="14.01" y2="8"></line><line x1="18" y1="8" x2="18.01" y2="8"></line><line x1="6" y1="12" x2="6.01" y2="12"></line><line x1="18" y1="12" x2="18.01" y2="12"></line><line x1="10" y1="16" x2="14" y2="16"></line></svg>';

  for (var i = 0; i < stages.length; i++) {
    var stage = stages[i];
    var stageCompleted = 0;
    for (var j = 0; j < stage.lessons.length; j++) {
      if (prog.completed[stage.lessons[j].id]) stageCompleted++;
    }

    var isCompleted = (stageCompleted === stage.lessons.length);
    var isCurrent = (i === currentStageIdx && !isCompleted);
    var isLocked = (i > currentStageIdx);
    var stagePct = Math.round((stageCompleted / stage.lessons.length) * 100);

    var card = document.createElement("div");
    card.className = "stage-card" + (isCompleted ? " completed" : (isCurrent ? " is-current" : (isLocked ? " is-locked" : "")));
    card.onclick = (function (sId) { return function () { showStageLessonsView(sId); }; })(stage.id);

    var statusHtml = "";
    var btnText = "";
    if (isCompleted) {
      statusHtml = '<span class="stage-status-badge status-completed">' + checkSvg + (isAr ? "مكتمل (3 من 3)" : "Completed (3/3)") + '</span>';
      btnText = isAr ? "مراجعة المرحلة" : "Review Stage";
    } else if (isCurrent) {
      statusHtml = '<span class="stage-status-badge status-progress">' + playSvg + (stageCompleted > 0 ? (isAr ? (stageCompleted + " من 3 دروس") : (stageCompleted + " of 3 done")) : (isAr ? "المرحلة الحالية" : "Current Stage")) + '</span>';
      btnText = stageCompleted > 0 ? (isAr ? "متابعة المرحلة" : "Continue") : (isAr ? "بدء المرحلة" : "Start Stage");
    } else {
      statusHtml = '<span class="stage-status-badge status-locked">' + lockSvg + (isAr ? "مرحلة مقفلة" : "Locked") + '</span>';
      btnText = isAr ? "مقفلة" : "Locked";
    }

    card.innerHTML =
      '<div class="stage-card-header">' +
      '<div class="stage-badge-num">' + stage.num + '</div>' +
      statusHtml +
      '</div>' +
      '<div class="stage-card-body">' +
      '<h3>' + stage.title + '</h3>' +
      '<p>' + stage.desc + '</p>' +
      '<div class="stage-mini-progress"><div class="stage-mini-bar" style="width:' + stagePct + '%"></div></div>' +
      '</div>' +
      '<div class="stage-card-footer">' +
      '<span class="stage-lessons-count">' + kbSvg + (isAr ? (stageCompleted + " من " + stage.lessons.length + " دروس") : (stageCompleted + " of " + stage.lessons.length + " lessons")) + '</span>' +
      '<button class="stage-action-btn">' + btnText + '</button>' +
      '</div>';

    container.appendChild(card);
  }
}

function renderStageLessons(stageId) {
  var stages = CURRICULUM[CURRENT_LANG];
  var stage = null;
  for (var i = 0; i < stages.length; i++) {
    if (stages[i].id === stageId) { stage = stages[i]; break; }
  }
  if (!stage) return;

  var prog = USER_PROGRESS[CURRENT_LANG];
  var isAr = (CURRENT_LANG === "ar");
  document.getElementById("stage-banner-title").textContent = stage.title;
  document.getElementById("stage-banner-desc").textContent = stage.desc;

  var doneCount = 0;
  for (var j = 0; j < stage.lessons.length; j++) {
    if (prog.completed[stage.lessons[j].id]) doneCount++;
  }
  document.getElementById("stage-lessons-progress-badge").textContent = isAr ? (doneCount + " من 3 مكتمل") : (doneCount + " of 3 done");

  var activeLessonIdx = -1;
  for (var a = 0; a < stage.lessons.length; a++) {
    if (!prog.completed[stage.lessons[a].id]) {
      activeLessonIdx = a;
      break;
    }
  }
  if (activeLessonIdx === -1) activeLessonIdx = 0;

  var list = document.getElementById("lessons-container");
  list.innerHTML = "";

  for (var k = 0; k < stage.lessons.length; k++) {
    var lesson = stage.lessons[k];
    var isDone = !!prog.completed[lesson.id];
    var isActive = (k === activeLessonIdx);
    var bestWpm = prog.bestWpm[lesson.id] || 0;
    var bestAcc = prog.bestAcc[lesson.id] || 0;
    var stars = prog.stars[lesson.id] || 0;
    var starsStr = "★".repeat(stars) + "☆".repeat(Math.max(0, 3 - stars));

    var row = document.createElement("div");
    row.className = "lesson-row-card" + (isDone ? " done" : (isActive ? " is-active-lesson" : ""));
    row.onclick = (function (les) { return function () { showActiveLessonView(les); }; })(lesson);

    var keysChips = "";
    for (var m = 0; m < Math.min(lesson.keys.length, 6); m++) {
      keysChips += '<kbd class="mini-keycap">' + lesson.keys[m] + '</kbd>';
    }

    var btnClass = isActive && !isDone ? "btn-start-lesson is-primary" : "btn-start-lesson is-secondary";
    var btnLabel = isDone ?
      (isAr ? "إعادة التمرين" : "Practice Again") :
      (isActive ? (isAr ? "ابدأ الآن ↵" : "Start Now ↵") : (isAr ? "بدء" : "Start"));

    row.innerHTML =
      '<div class="lesson-row-main">' +
      '<div class="lesson-num-badge">' + (k + 1) + '</div>' +
      '<div class="lesson-row-texts">' +
      '<h4>' + lesson.title + '</h4>' +
      '<p>' + lesson.desc + '</p>' +
      '<div class="lesson-keys-preview">' + keysChips + '</div>' +
      '</div>' +
      '</div>' +
      '<div class="lesson-row-stats">' +
      (isDone ? (
        '<div class="stat-pill"><span class="val">' + bestWpm + '</span><span class="lbl">WPM</span></div>' +
        '<div class="stat-pill"><span class="val">' + bestAcc + '%</span><span class="lbl">' + (isAr ? "دقة" : "Acc") + '</span></div>' +
        '<div class="stars-display">' + starsStr + '</div>'
      ) : '') +
      '<button class="' + btnClass + '">' + btnLabel + '</button>' +
      '</div>';

    list.appendChild(row);
  }
}

// ==============================================================
// 7. KEYBOARD BUILDER & FINGER HIGHLIGHTING
// ==============================================================
function buildKeyboard() {
  var rowsEl = document.getElementById("kb-rows");
  if (!rowsEl) return;
  rowsEl.innerHTML = "";
  var isAr = (CURRENT_LANG === "ar");

  for (var ri = 0; ri < KB_ROWS.length; ri++) {
    var row = KB_ROWS[ri];
    var rowEl = document.createElement("div");
    rowEl.className = "kb-row";
    rowEl.setAttribute("dir", "ltr");

    for (var ki = 0; ki < row.length; ki++) {
      var kd = row[ki];
      var fInfo = FINGER_DATA[kd.f] || FINGER_DATA.th;
      var el = document.createElement("div");
      var isAccent = (kd.k === "Space");
      el.className = "kb-key" + (isAccent ? " key-accent" : "") + (kd.bump ? " has-bump" : "");
      el.id = "kbk_" + ri + "_" + ki;
      el.style.width = "calc(var(--k-unit) * " + kd.w + ")";
      el.dataset.k = kd.k;
      el.dataset.ar = kd.ar;
      el.dataset.f = kd.f;

      var mainLbl = isAr ? kd.ar : (kd.k.length === 1 ? kd.k.toLowerCase() : kd.k);
      var subLbl = isAr ? (kd.k.length === 1 ? kd.k.toLowerCase() : "") : kd.ar;

      if (kd.special) {
        mainLbl = kd.k;
        subLbl = "";
      }

      if (subLbl) {
        var subSpan = document.createElement("span");
        subSpan.className = "kb-lbl-sub";
        subSpan.textContent = subLbl;
        el.appendChild(subSpan);
      }
      var mainSpan = document.createElement("span");
      mainSpan.className = "kb-lbl-main";
      mainSpan.textContent = mainLbl;
      el.appendChild(mainSpan);

      var strip = document.createElement("div");
      strip.className = "kb-finger-strip";
      strip.style.background = fInfo.color;
      el.appendChild(strip);

      rowEl.appendChild(el);
    }
    rowsEl.appendChild(rowEl);
  }
}

function highlightTargetKey(targetChar) {
  var allKeys = document.querySelectorAll(".kb-key.key-target");
  for (var i = 0; i < allKeys.length; i++) allKeys[i].classList.remove("key-target");

  if (!targetChar) return;
  var isAr = (CURRENT_LANG === "ar");
  var allKeysDom = document.querySelectorAll(".kb-key");
  var targetEl = null;

  for (var j = 0; j < allKeysDom.length; j++) {
    var kEl = allKeysDom[j];
    if (targetChar === " " && kEl.dataset.k === "Space") {
      targetEl = kEl;
      break;
    }
    if (isAr) {
      if (kEl.dataset.ar === targetChar || normalizeArabic(kEl.dataset.ar) === normalizeArabic(targetChar)) {
        targetEl = kEl;
        break;
      }
    } else {
      if (kEl.dataset.k && kEl.dataset.k.toLowerCase() === targetChar.toLowerCase()) {
        targetEl = kEl;
        break;
      }
    }
  }

  if (targetEl) {
    targetEl.classList.add("key-target");
  }

  var isUpperEn = targetChar && (targetChar >= "A" && targetChar <= "Z");
  var isShiftSym = targetChar && ('~!@#$%^&*()_+{}|:"<>?'.indexOf(targetChar) >= 0);
  var isShiftAr = targetChar && ('أإآلألإلآ،؛؟ّ'.indexOf(targetChar) >= 0);
  var needsShift = !!(isUpperEn || isShiftSym || isShiftAr);

  var vkId = mapCharToVkId(targetChar, CURRENT_LANG);
  setVkHandPose(vkId, needsShift);
}

function setVkHandPose(vkKey, needsShift) {
  var svg = document.getElementById("hand-both");
  if (!svg) return;

  var allG = svg.querySelectorAll("g[id]");
  for (var i = 0; i < allG.length; i++) {
    allG[i].classList.add("st0");
    allG[i].classList.remove("show-hand");
  }

  if (!vkKey || vkKey === "neutral") {
    _showVkGroup("hand-neutral-left");
    _showVkGroup("hand-neutral-right");
    return;
  }

  if (vkKey === "space") {
    _showVkGroup("hand-space");
    _showVkGroup("hand-neutral-left");
    return;
  }

  var finger = VK_FINGER_MAP[vkKey] || "";
  var side = finger ? finger.charAt(0) : "";
  var targetId = "hand-" + vkKey;

  if (side === "l") {
    if (!_showVkGroup(targetId)) {
      _showVkGroup("hand-neutral-left");
    }
    if (needsShift) {
      _showVkGroup("hand-shift-right");
    } else {
      _showVkGroup("hand-neutral-right");
    }
  } else if (side === "r") {
    if (!_showVkGroup(targetId)) {
      _showVkGroup("hand-neutral-right");
    }
    if (needsShift) {
      _showVkGroup("hand-shift-left");
    } else {
      _showVkGroup("hand-neutral-left");
    }
  } else {
    if (!_showVkGroup(targetId)) {
      _showVkGroup("hand-neutral-left");
    }
    _showVkGroup("hand-neutral-right");
  }
}

function _showVkGroup(id) {
  var el = document.getElementById(id);
  if (el) {
    el.classList.remove("st0");
    el.classList.add("show-hand");
    return true;
  }
  return false;
}

function animateHandTap(ok) {
  var svg = document.getElementById("hand-both");
  if (!svg) return;
  svg.classList.remove("hf-error", "hf-pressed");
  void svg.offsetWidth;
  if (ok) {
    svg.classList.add("hf-pressed");
    setTimeout(function () { if (svg) svg.classList.remove("hf-pressed"); }, 120);
  } else {
    svg.classList.add("hf-error");
    setTimeout(function () { if (svg) svg.classList.remove("hf-error"); }, 200);
  }
}

// ==============================================================
// 8. ACTIVE LESSON ENGINE & TYPING LOGIC
// ==============================================================
function startLesson(lesson) {
  initAudio();
  LESSON_STATE.active = true;
  LESSON_STATE.text = lesson.text;
  LESSON_STATE.idx = 0;
  LESSON_STATE.errors = 0;
  LESSON_STATE.startTime = null;
  LESSON_STATE.wpm = 0;
  LESSON_STATE.acc = 100;

  if (LESSON_STATE.timerInterval) clearInterval(LESSON_STATE.timerInterval);

  document.getElementById("active-lesson-title").textContent = lesson.title;
  document.getElementById("active-lesson-intro").textContent = lesson.desc;

  var prog = USER_PROGRESS[CURRENT_LANG];
  var stars = prog.stars[lesson.id] || 0;
  document.getElementById("active-lesson-best-stars").textContent = stars ? ("★".repeat(stars) + "☆".repeat(3 - stars)) : "";

  updateLiveStats();
  renderTypingFlow();
  highlightTargetKey(LESSON_STATE.text[0]);

  var typingBox = document.getElementById("typing-box");
  var mobileInp = document.getElementById("learn-inp");
  if (typingBox) typingBox.focus();
  if (mobileInp) {
    mobileInp.value = "";
    mobileInp.focus({ preventScroll: true });
  }
}

function stopLesson() {
  LESSON_STATE.active = false;
  if (LESSON_STATE.timerInterval) {
    clearInterval(LESSON_STATE.timerInterval);
    LESSON_STATE.timerInterval = null;
  }
}

function renderTypingFlow() {
  var flow = document.getElementById("typing-flow");
  var txt = LESSON_STATE.text;
  var curr = LESSON_STATE.idx;
  var h = "";

  for (var i = 0; i < txt.length; i++) {
    var c = txt[i];
    var displayChar = (c === " " ? " " : c);
    if (i < curr) {
      h += '<span class="ch-done">' + displayChar + '</span>';
    } else if (i === curr) {
      h += '<span class="ch-current">' + (c === " " ? "␣" : displayChar) + '</span>';
    } else {
      h += '<span class="ch-pending">' + displayChar + '</span>';
    }
  }
  flow.innerHTML = h;

  // Auto scroll active char into center view if multi-line
  var curSpan = flow.querySelector(".ch-current");
  if (curSpan) {
    var box = document.getElementById("typing-box");
    if (box && curSpan.offsetTop > box.clientHeight * 0.55) {
      box.scrollTop = curSpan.offsetTop - box.clientHeight * 0.28;
    }
  }
}

function updateLiveStats() {
  if (LESSON_STATE.startTime) {
    var elapsedMin = (Date.now() - LESSON_STATE.startTime) / 60000;
    if (elapsedMin > 0.004) {
      var netChars = Math.max(0, LESSON_STATE.idx - LESSON_STATE.errors);
      LESSON_STATE.wpm = Math.round((netChars / 5) / elapsedMin);
    }
  }
  var totalTyped = LESSON_STATE.idx + LESSON_STATE.errors;
  LESSON_STATE.acc = totalTyped > 0 ? Math.max(0, Math.round(((totalTyped - LESSON_STATE.errors) / totalTyped) * 100)) : 100;

  document.getElementById("live-wpm").textContent = LESSON_STATE.wpm;
  document.getElementById("live-acc").textContent = LESSON_STATE.acc + "%";
  document.getElementById("live-errors").textContent = LESSON_STATE.errors;

  var pct = Math.round((LESSON_STATE.idx / LESSON_STATE.text.length) * 100);
  document.getElementById("live-progress").textContent = pct + "%";
}

function handleLessonCharTyped(typedChar, isBackspace) {
  if (!LESSON_STATE.active) return;

  if (isBackspace) {
    if (LESSON_STATE.idx > 0) {
      LESSON_STATE.idx--;
      playKeySound(false, true);
      renderTypingFlow();
      highlightTargetKey(LESSON_STATE.text[LESSON_STATE.idx]);
      updateLiveStats();
    }
    return;
  }

  if (!typedChar) return;

  if (!LESSON_STATE.startTime) {
    LESSON_STATE.startTime = Date.now();
    LESSON_STATE.timerInterval = setInterval(updateLiveStats, 200);
  }

  var expected = LESSON_STATE.text[LESSON_STATE.idx];
  var isMatch = matchTypedKey(typedChar, expected, CURRENT_LANG);

  if (isMatch) {
    playKeySound(expected === " ");
    animateHandTap(true);
    LESSON_STATE.idx++;

    if (LESSON_STATE.idx >= LESSON_STATE.text.length) {
      completeLesson();
      return;
    }
  } else {
    playErrSound();
    animateHandTap(false);
    LESSON_STATE.errors++;
  }

  updateLiveStats();
  renderTypingFlow();
  highlightTargetKey(LESSON_STATE.text[LESSON_STATE.idx]);
}

// 1. DESKTOP PHYSICAL KEYBOARD LISTENER
window.addEventListener("keydown", function (e) {
  if (!LESSON_STATE.active) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  var modal = document.getElementById("result-modal");
  if (modal.classList.contains("open")) {
    if (e.key === "Tab") {
      e.preventDefault();
      retryCurrentLesson();
    } else if (e.key === "Enter") {
      e.preventDefault();
      goToNextLesson();
    } else if (e.key === "Escape") {
      modal.classList.remove("open");
      showStageLessonsView(CURRENT_STAGE_ID);
    }
    return;
  }

  if (e.key === "Escape") {
    showStageLessonsView(CURRENT_STAGE_ID);
    return;
  }

  if (e.key === "Backspace") {
    e.preventDefault();
    handleLessonCharTyped("", true);
    var mobileInp = document.getElementById("learn-inp");
    if (mobileInp) mobileInp.value = "";
    return;
  }

  if (e.key.length === 1 || e.key === "Spacebar" || e.key === " ") {
    e.preventDefault();
    var typed = (e.key === "Spacebar" ? " " : e.key);
    handleLessonCharTyped(typed, false);
    var mobileInp = document.getElementById("learn-inp");
    if (mobileInp) mobileInp.value = "";
  }
});

// 2. MOBILE INPUT PIPELINE (NATIVE OS KEYBOARD TARGET)
(function setupMobileInput() {
  var inp = document.getElementById("learn-inp");
  var box = document.getElementById("typing-box");
  if (!inp || !box) return;

  function focusInp() {
    inp.focus({ preventScroll: true });
    setTimeout(function () { inp.focus({ preventScroll: true }); }, 40);
  }

  box.addEventListener("click", focusInp);
  box.addEventListener("touchend", focusInp);

  var isComposing = false;
  inp.addEventListener("compositionstart", function () { isComposing = true; });
  inp.addEventListener("compositionend", function (e) {
    isComposing = false;
    var data = e.data || "";
    for (var i = 0; i < data.length; i++) {
      handleLessonCharTyped(data[i], false);
    }
    inp.value = "";
  });

  inp.addEventListener("beforeinput", function (e) {
    if (e.inputType === "deleteContentBackward" || e.inputType === "deleteContentForward") {
      e.preventDefault();
      handleLessonCharTyped("", true);
      inp.value = "";
    }
  });

  inp.addEventListener("input", function (e) {
    if (isComposing) return;
    if (e.inputType === "deleteContentBackward") {
      inp.value = "";
      return;
    }
    var val = inp.value;
    if (val) {
      for (var i = 0; i < val.length; i++) {
        handleLessonCharTyped(val[i], false);
      }
      inp.value = "";
    }
  });
})();

function completeLesson() {
  stopLesson();
  updateLiveStats();

  var wpm = Math.max(10, LESSON_STATE.wpm);
  var acc = LESSON_STATE.acc;
  var passed = (acc >= 90);

  var stars = 1;
  if (acc >= 95 && wpm >= 25) stars = 3;
  else if (acc >= 90) stars = 2;

  var prog = USER_PROGRESS[CURRENT_LANG];
  prog.completed[CURRENT_LESSON.id] = true;
  if (!prog.bestWpm[CURRENT_LESSON.id] || wpm > prog.bestWpm[CURRENT_LESSON.id]) prog.bestWpm[CURRENT_LESSON.id] = wpm;
  if (!prog.bestAcc[CURRENT_LESSON.id] || acc > prog.bestAcc[CURRENT_LESSON.id]) prog.bestAcc[CURRENT_LESSON.id] = acc;
  if (!prog.stars[CURRENT_LESSON.id] || stars > prog.stars[CURRENT_LESSON.id]) prog.stars[CURRENT_LESSON.id] = stars;
  prog.lastStage = CURRENT_STAGE_ID;
  prog.lastLesson = CURRENT_LESSON.id;
  saveProgress();

  if (window.BarqAPI && window.BarqAPI.syncLearnProgress) {
    window.BarqAPI.syncLearnProgress([{
      lang: CURRENT_LANG,
      lesson_id: CURRENT_LESSON.id,
      best_wpm: wpm,
      best_acc: acc,
      stars: stars
    }]);
  }

  var isAr = (CURRENT_LANG === "ar");
  var trophyEl = document.getElementById("modal-trophy");
  if (trophyEl) {
    trophyEl.innerHTML = '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2"></path><path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.45 1-1 1H7v2h10v-2h-2c-.55 0-1-.45-1-1v-2.34"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>';
  }
  document.getElementById("modal-title").textContent = passed
    ? (isAr ? "تم إكمال الدرس بنجاح!" : "Lesson Completed!")
    : (isAr ? "تمرين جيد، استمر في التقدم!" : "Good Practice, Keep Going!");
  document.getElementById("modal-stars").textContent = "★".repeat(stars) + "☆".repeat(3 - stars);
  document.getElementById("m-wpm").textContent = wpm;
  document.getElementById("m-acc").textContent = acc + "%";
  document.getElementById("m-err").textContent = LESSON_STATE.errors;
  document.getElementById("lbl-m-wpm").textContent = isAr ? "السرعة" : "Speed";
  document.getElementById("lbl-m-acc").textContent = isAr ? "الدقة" : "Accuracy";
  document.getElementById("lbl-m-err").textContent = isAr ? "الأخطاء" : "Errors";

  document.getElementById("modal-feedback").textContent = passed
    ? (isAr ? "رائع جداً! حققت نسبة الدقة الموصى بها (90%+) وثبتّ ذاكرتك العضلية." : "Excellent! You achieved the recommended 90%+ accuracy threshold.")
    : (isAr ? "دقتك أقل من 90%. نوصي بإعادة التمرين لتثبيت الحركات، أو يمكنك المتابعة للدرس التالي." : "Accuracy is under 90%. We recommend retrying to reinforce finger memory, or you may proceed to the next lesson.");

  document.getElementById("btn-modal-retry").textContent = isAr ? "إعادة التمرين (Tab)" : "Retry Lesson (Tab)";
  document.getElementById("btn-modal-next").textContent = isAr ? "الدرس التالي (Enter)" : "Next Lesson (Enter)";

  document.getElementById("result-modal").classList.add("open");
}

function retryCurrentLesson() {
  document.getElementById("result-modal").classList.remove("open");
  if (CURRENT_LESSON) startLesson(CURRENT_LESSON);
}

function goToNextLesson() {
  document.getElementById("result-modal").classList.remove("open");
  var stages = CURRICULUM[CURRENT_LANG];
  var nextLesson = null;
  var nextStageId = CURRENT_STAGE_ID;
  var found = false;

  for (var i = 0; i < stages.length; i++) {
    for (var j = 0; j < stages[i].lessons.length; j++) {
      if (found) {
        nextLesson = stages[i].lessons[j];
        nextStageId = stages[i].id;
        break;
      }
      if (stages[i].lessons[j].id === CURRENT_LESSON.id) {
        found = true;
      }
    }
    if (nextLesson) break;
  }

  if (nextLesson) {
    CURRENT_STAGE_ID = nextStageId;
    showActiveLessonView(nextLesson);
  } else {
    showStagesView();
  }
}

// ==============================================================
// 9. INITIALIZATION
// ==============================================================
window.addEventListener("DOMContentLoaded", function () {
  loadProgress();
  buildKeyboard();
  var _initLang = "ar"; try { _initLang = localStorage.getItem("barqtype_lang") || JSON.parse(localStorage.getItem("ts2") || "{}").lang || "ar"; } catch(e){} setLanguage(_initLang);
});