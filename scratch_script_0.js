
// ==============================================================
// 1. DATA AND STATE
// ==============================================================
var POOLS={
  en:{
    common:"the be to of and a in that have it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us great need large often hand high place hold world found still learn cover food state keep eye never last let thought city tree far sea draw left late run while press close night real life few open seem next white begin walk paper always music those both mark book letter until mile river car feet care second enough girl young ready above ever red list feel talk bird soon body dog family".split(" "),
    medium:"important different following however become number through development between something national against before system company around believe public already everything another government power change together interest provide children across question within business without office process whether include continue economic social person member example research program problem support general control recent possible political market science level service create student consider complete usually remain certainly information relationship experience performance environment technology community available condition education throughout understand population management significant opportunity".split(" "),
    code:"function const return import export interface async await typeof string number boolean undefined null array object class extends implements private public readonly static while switch case break continue try catch finally throw delete void let var true false this super module require console log error map filter reduce Promise resolve reject fetch params router component useState useEffect callback timeout interval length index value result input output default type enum".split(" "),
    quotes:["The quick brown fox jumps over the lazy dog.","To be or not to be, that is the question.","All that glitters is not gold.","The only way to do great work is to love what you do.","In the middle of every difficulty lies opportunity.","Life is what happens when you are busy making other plans.","The journey of a thousand miles begins with one step.","Be the change that you wish to see in the world.","You only live once, but if you do it right, once is enough."]
  },
  ar:{
    common:"في من إلى على هذا هذه كان كانت ما لا مع عن أن إن لم لن قد قال يقول التي الذي الذين وهو وهي هو هي نحن أنت الله كل بعض مثل حتى فإن وقد كما بما وما ولا لأن لكن بعد قبل يكون أكثر أقل حيث عند منذ خلال بين فوق تحت أمام خلف داخل خارج يوم ليلة ساعة سنة شهر وقت مكان بلد مدينة شارع بيت باب غرفة كتاب قلم ورقة طاولة كرسي مدرسة معلم طالب علم عمل مال حياة صحة قوة جميل كبير صغير طويل قصير سريع بطيء قريب بعيد جديد قديم حار بارد".split(" "),
    medium:"الحكومة المجتمع التعليم الاقتصاد السياسة الثقافة التكنولوجيا المعلومات التطوير البرمجة الحاسوب المستقبل التغيير الابتكار التفكير التخطيط المشروع الهدف النجاح التجربة المعرفة الحكمة العدالة الحرية المساواة التعاون التواصل الاحترام الصداقة العائلة المجموعة الحضارة التاريخ الجغرافيا العلوم الرياضيات الفيزياء الكيمياء الأدب الشعر الموسيقى الرياضة".split(" "),
    code:"دالة ثابت إرجاع استيراد تصدير واجهة انتظار سلسلة رقم منطقي مصفوفة كائن صنف يمتد خاص عام بينما مفتاح حالة توقف محاولة رمي حذف افتراضي نوع".split(" "),
    quotes:["العلم في الصغر كالنقش على الحجر.","من جد وجد ومن زرع حصد.","اطلب العلم من المهد إلى اللحد.","الصبر مفتاح الفرج.","العقل السليم في الجسم السليم.","الوقت كالسيف إن لم تقطعه قطعك.","خير الكلام ما قل ودل.","من تعلم لغة قوم أمن شرهم."]
  }
};

var LESSONS=[
  {id:"home",lv:1,ic:"🏠",t:"الصف الأساسي",d:"ASDF JKL",ks:"a s d f j k l".split(" "),pe:"fall flask glad half jag lads safe ask",pa:"في من إلى على هذا كان ما لا"},
  {id:"top",lv:2,ic:"⬆️",t:"الصف العلوي",d:"QWER YUIOP",ks:"q w e r t y u i o p".split(" "),pe:"your type quite port write tower power quiet",pa:"التي يكون تكون الذي وهو وهي"},
  {id:"bot",lv:2,ic:"⬇️",t:"الصف السفلي",d:"ZXCV BNM",ks:"z x c v b n m".split(" "),pe:"black zinc move verb next calm brim",pa:"مثل حتى فإن وقد كما بما ولا"},
  {id:"num",lv:3,ic:"🔢",t:"الأرقام",d:"0-9",ks:"1 2 3 4 5 6 7 8 9 0".split(" "),pe:"score 42 win by 100 order 7",pa:"يوم 24 ساعة عام 365"},
  {id:"cap",lv:3,ic:"🔠",t:"الحروف الكبيرة",d:"Shift",ks:["Shift"],pe:"The Quick Brown Fox Jumps",pa:"اللغة العربية جميلة"},
  {id:"pun",lv:3,ic:"✏️",t:"علامات الترقيم",d:".,!?:",ks:". , ! ? :".split(" "),pe:"Hello, world! How are you?",pa:"مرحبا كيف حالك؟"},
  {id:"spd",lv:4,ic:"⚡",t:"تدريب السرعة",d:"كلمات شائعة",ks:[],pe:"the quick brown fox jumps over",pa:"من جد وجد ومن زرع حصد"},
  {id:"cod",lv:4,ic:"💻",t:"مفاتيح البرمجة",d:"(){}[]=",ks:"( ) { } [ ] = /".split(" "),pe:"function hello() { return true; }",pa:"دالة مرحبا() إرجاع صحيح"}
];

var ACHS=[
  {id:"ft",ic:"🎯",n:"الخطوة الأولى",d:"أكمل اختبارك الأول"},
  {id:"w50",ic:"⚡",n:"50 WPM",d:"حقق 50 كلمة/دقيقة"},
  {id:"w80",ic:"🚀",n:"80 WPM",d:"حقق 80 كلمة/دقيقة"},
  {id:"a100",ic:"✨",n:"الكمال",d:"دقة 100%"},
  {id:"t10",ic:"🏅",n:"المداوم",d:"أكمل 10 اختبارات"}
];

var KR=[
  ["q","w","e","r","t","y","u","i","o","p"],
  ["a","s","d","f","g","h","j","k","l"],
  ["z","x","c","v","b","n","m"]
];
var FM={q:"lp",w:"lr",e:"lm",r:"li",t:"li",y:"ri",u:"ri",i:"rm",o:"rr",p:"rp",a:"lp",s:"lr",d:"lm",f:"li",g:"li",h:"ri",j:"ri",k:"rm",l:"rr",z:"lp",x:"lr",c:"lm",v:"li",b:"li",n:"ri",m:"ri"};
var FN={lp:"خنصر يسار",lr:"بنسر يسار",lm:"وسطى يسار",li:"سبابة يسار",ri:"سبابة يمين",rm:"وسطى يمين",rr:"بنسر يمين",rp:"خنصر يمين"};

var S={lang:"en",dur:30,mode:"common",text:"",ch:[],idx:0,on:false,fin:false,left:30,ks:[],t0:0,tk:0,ti:null,ec:0};

// Local storage
function gR(){try{return JSON.parse(localStorage.getItem("tm2")||"[]")}catch(e){return[]}}
function pR(r){var a=gR();a.unshift(r);localStorage.setItem("tm2",JSON.stringify(a.slice(0,200)))}
function gS(){try{return JSON.parse(localStorage.getItem("ts2")||"{}")}catch(e){return{}}}
function pS(o){localStorage.setItem("ts2",JSON.stringify(o))}
function gA(){try{return JSON.parse(localStorage.getItem("ta2")||"[]")}catch(e){return[]}}
function pA(a){localStorage.setItem("ta2",JSON.stringify(a))}

function calcWPM(c,ms){return ms<=0?0:Math.round(c/5/(ms/60000))}
function calcAcc(c,t){return t?Math.round(c/t*100):100}

// ==============================================================
// 2. QWERTY <-> ARABIC MAPPING (PREVENTS MISMATCH ERRORS)
// ==============================================================
var QWERTY_TO_AR = {
  "`":"ذ", "~":"ّ", "1":"1", "!":"!", "2":"2", "@":"@", "3":"3", "#":"#",
  "4":"4", "$":"$", "5":"5", "%":"%", "6":"6", "^":"^", "7":"7", "&":"&",
  "8":"8", "*":"*", "9":"9", "(":"(", "0":"0", ")":")", "-":"-", "_":"_",
  "=":"=", "+":"+",
  "q":"ض", "Q":"َ", "w":"ص", "W":"ً", "e":"ث", "E":"ُ", "r":"ق", "R":"ٌ",
  "t":"ف", "T":"لإ", "y":"غ", "Y":"إ", "u":"ع", "U":"‘", "i":"ه", "I":"÷",
  "o":"خ", "O":"×", "p":"ح", "P":"؛", "[":"ج", "{":"<", "]":"د", "}":">",
  "\\":"\\", "|":"|",
  "a":"ش", "A":"ِ", "s":"س", "S":"ٍ", "d":"ي", "D":"]", "f":"ب", "F":"[",
  "g":"ل", "G":"لأ", "h":"ا", "H":"أ", "j":"ت", "J":"ـ", "k":"ن", "K":"،",
  "l":"م", "L":"/", ";":"ك", ":":":", "'":"ط", "\"":"\"",
  "z":"ئ", "Z":"~", "x":"ء", "X":"ْ", "c":"ؤ", "C":"}", "v":"ر", "V":"{",
  "b":"لا", "B":"لآ", "n":"ى", "N":"آ", "m":"ة", "M":"’", ",":"و", "<":",",
  ".":"ز", ">":".", "/":"ظ", "?":"؟", " ":" "
};

function normalizeAr(c){
  if(!c) return "";
  if(c === "أ" || c === "إ" || c === "آ" || c === "ٱ") return "ا";
  if(c === "ة") return "ه";
  if(c === "ى") return "ي";
  return c;
}

function matchChar(inputKey, expectedChar){
  if(inputKey === expectedChar) return true;
  var isArChar = /[\u0600-\u06FF]/.test(expectedChar);

  if(S.lang === "ar" || isArChar){
    // 1. Direct Arabic match or normalized match
    if(normalizeAr(inputKey) === normalizeAr(expectedChar)) return true;

    // 2. If user pressed physical key on English layout, convert to Arabic key
    var mapped = QWERTY_TO_AR[inputKey];
    if(mapped){
      if(mapped === expectedChar) return true;
      if(normalizeAr(mapped) === normalizeAr(expectedChar)) return true;
    }
  } else {
    // English: case-insensitive match
    if(inputKey.toLowerCase() === expectedChar.toLowerCase()) return true;
  }
  return false;
}

// ==============================================================
// 3. EDCLUB KEYBOARD DEFINITION & ENGINE (PHYSICAL LTR LAYOUT)
// ==============================================================
var FINGER_DATA = {
  lp: { color: "#6366f1", hand: "L", ar: "الخنصر الأيسر", en: "Left Pinky" },
  lr: { color: "#a855f7", hand: "L", ar: "البنسر الأيسر", en: "Left Ring" },
  lm: { color: "#3b82f6", hand: "L", ar: "الوسطى اليسرى", en: "Left Middle" },
  li: { color: "#06b6d4", hand: "L", ar: "السبابة اليسرى", en: "Left Index" },
  th: { color: "#e2b714", hand: "B", ar: "الإبهام", en: "Thumbs" },
  ri: { color: "#10b981", hand: "R", ar: "السبابة اليمنى", en: "Right Index" },
  rm: { color: "#84cc16", hand: "R", ar: "الوسطى اليمنى", en: "Right Middle" },
  rr: { color: "#f59e0b", hand: "R", ar: "البنسر الأيمن", en: "Right Ring" },
  rp: { color: "#ef4444", hand: "R", ar: "الخنصر الأيمن", en: "Right Pinky" }
};

// Standard Physical Keyboard rows from Left to Right (Worldwide Physical Layout)
var KB_ROWS = [
  // Row 0: ~ to Backspace
  [
    { k:"~`", ar:"ذ", w:1, f:"lp" },
    { k:"1!", ar:"1", w:1, f:"lp" },
    { k:"2@", ar:"2", w:1, f:"lr" },
    { k:"3#", ar:"3", w:1, f:"lm" },
    { k:"4$", ar:"4", w:1, f:"li" },
    { k:"5%", ar:"5", w:1, f:"li" },
    { k:"6^", ar:"6", w:1, f:"ri" },
    { k:"7&", ar:"7", w:1, f:"ri" },
    { k:"8*", ar:"8", w:1, f:"rm" },
    { k:"9(", ar:"9", w:1, f:"rr" },
    { k:"0)", ar:"0", w:1, f:"rp" },
    { k:"-_", ar:"-", w:1, f:"rp" },
    { k:"=+", ar:"=", w:1, f:"rp" },
    { k:"Backspace", ar:"Backspace", w:2, f:"rp", special:true }
  ],
  // Row 1: Tab, Q(ض), W(ص)... to P(ح), [(ج), ](د), \
  [
    { k:"Tab", ar:"Tab", w:1.5, f:"lp", special:true },
    { k:"q", ar:"ض", w:1, f:"lp" },
    { k:"w", ar:"ص", w:1, f:"lr" },
    { k:"e", ar:"ث", w:1, f:"lm" },
    { k:"r", ar:"ق", w:1, f:"li" },
    { k:"t", ar:"ف", w:1, f:"li" },
    { k:"y", ar:"غ", w:1, f:"ri" },
    { k:"u", ar:"ع", w:1, f:"ri" },
    { k:"i", ar:"ه", w:1, f:"rm" },
    { k:"o", ar:"خ", w:1, f:"rr" },
    { k:"p", ar:"ح", w:1, f:"rp" },
    { k:"[{", ar:"ج", w:1, f:"rp" },
    { k:"]}", ar:"د", w:1, f:"rp" },
    { k:"\\|", ar:"\\", w:1.5, f:"rp", special:true }
  ],
  // Row 2: Caps, A(ش), S(س)... to ;(ك), '(ط), Enter
  [
    { k:"Caps", ar:"Caps", w:1.75, f:"lp", special:true },
    { k:"a", ar:"ش", w:1, f:"lp" },
    { k:"s", ar:"س", w:1, f:"lr" },
    { k:"d", ar:"ي", w:1, f:"lm" },
    { k:"f", ar:"ب", w:1, f:"li", bump:true },
    { k:"g", ar:"ل", w:1, f:"li" },
    { k:"h", ar:"ا", w:1, f:"ri" },
    { k:"j", ar:"ت", w:1, f:"ri", bump:true },
    { k:"k", ar:"ن", w:1, f:"rm" },
    { k:"l", ar:"م", w:1, f:"rr" },
    { k:";:", ar:"ك", w:1, f:"rp" },
    { k:"'\"", ar:"ط", w:1, f:"rp" },
    { k:"Enter", ar:"Enter", w:2.25, f:"rp", special:true }
  ],
  // Row 3: Shift, Z(ئ), X(ء)... to /(ظ), Shift
  [
    { k:"Shift", ar:"Shift", w:2.25, f:"lp", special:true, side:"left" },
    { k:"z", ar:"ئ", w:1, f:"lp" },
    { k:"x", ar:"ء", w:1, f:"lr" },
    { k:"c", ar:"ؤ", w:1, f:"lm" },
    { k:"v", ar:"ر", w:1, f:"li" },
    { k:"b", ar:"لا", w:1, f:"li" },
    { k:"n", ar:"ى", w:1, f:"ri" },
    { k:"m", ar:"ة", w:1, f:"ri" },
    { k:",<", ar:"و", w:1, f:"rm" },
    { k:".>", ar:"ز", w:1, f:"rr" },
    { k:"/?", ar:"ظ", w:1, f:"rp" },
    { k:"Shift", ar:"Shift", w:2.75, f:"rp", special:true, side:"right" }
  ],
  // Row 4: Space Row
  [
    { k:"Ctrl", ar:"Ctrl", w:1.5, f:"lp", special:true },
    { k:"Alt", ar:"Alt", w:1.5, f:"th", special:true },
    { k:"Space", ar:"Space", w:7, f:"th", special:true },
    { k:"Alt", ar:"Alt", w:1.5, f:"th", special:true },
    { k:"Ctrl", ar:"Ctrl", w:1.5, f:"rp", special:true }
  ]
];

var _kbVisible = true;
var _kbTimeouts = {};

function buildKeyboard(){
  var rowsEl = document.getElementById("kb-rows");
  if(!rowsEl) return;
  rowsEl.innerHTML = "";
  var isAr = (S.lang === "ar");

  for(var ri = 0; ri < KB_ROWS.length; ri++){
    var row = KB_ROWS[ri];
    var rowEl = document.createElement("div");
    rowEl.className = "kb-row";

    for(var ki = 0; ki < row.length; ki++){
      var kd = row[ki];
      var fInfo = FINGER_DATA[kd.f] || FINGER_DATA.th;
      var el = document.createElement("div");
      var isAccent = (kd.k === "Space");
      var isMod = kd.special && !isAccent;
      var keyTypeClass = isAccent ? " key-accent" : (isMod ? " key-mod" : " key-alpha");
      el.className = "kb-key" + keyTypeClass + (kd.special ? " special" : "") + (kd.bump ? " has-bump" : "");
      el.id = "kbk_" + ri + "_" + ki;
      el.style.width = "calc(var(--k-unit) * " + kd.w + ")";

      // Metadata for key matching
      el.dataset.k = kd.k;
      el.dataset.ar = kd.ar;
      el.dataset.f = kd.f;
      el.dataset.side = kd.side || "";

      // Labeling
      var mainLbl = "", subLbl = "";
      if(kd.special){
        if(kd.k === "Space"){
          mainLbl = isAr ? "مسافة (SPACE)" : "SPACE";
        } else if(kd.k === "Backspace"){
          mainLbl = "⌫ Backspace";
        } else if(kd.k === "Enter"){
          mainLbl = "↵ Enter";
        } else if(kd.k === "Shift"){
          mainLbl = "⇧ Shift";
        } else {
          mainLbl = kd.k;
        }
      } else {
        if(isAr){
          mainLbl = kd.ar;
          subLbl = kd.k.length === 1 ? kd.k.toLowerCase() : kd.k[0];
        } else {
          mainLbl = kd.k.length === 1 ? kd.k.toLowerCase() : kd.k[0];
          subLbl = kd.ar;
        }
      }

      // Sub label
      if(subLbl){
        var subSpan = document.createElement("span");
        subSpan.className = "kb-lbl-sub";
        subSpan.textContent = subLbl;
        el.appendChild(subSpan);
      }

      // Main label
      var mainSpan = document.createElement("span");
      mainSpan.className = "kb-lbl-main";
      mainSpan.textContent = mainLbl;
      el.appendChild(mainSpan);

      // Finger colored bottom strip
      var strip = document.createElement("div");
      strip.className = "kb-finger-strip";
      strip.style.background = fInfo.color;
      el.appendChild(strip);

      rowEl.appendChild(el);
    }
    rowsEl.appendChild(rowEl);
  }

  buildLegend();
  updateTargetKey();
}

function buildLegend(){
  var leg = document.getElementById("kb-legend");
  if(!leg) return;
  var isAr = (S.lang === "ar");
  var list = [
    { c: FINGER_DATA.lp.color, l: isAr ? "خنصر يسار" : "L-Pinky" },
    { c: FINGER_DATA.lr.color, l: isAr ? "بنسر يسار" : "L-Ring" },
    { c: FINGER_DATA.lm.color, l: isAr ? "وسطى يسار" : "L-Middle" },
    { c: FINGER_DATA.li.color, l: isAr ? "سبابة يسار" : "L-Index" },
    { c: FINGER_DATA.th.color, l: isAr ? "إبهام" : "Thumbs" },
    { c: FINGER_DATA.ri.color, l: isAr ? "سبابة يمين" : "R-Index" },
    { c: FINGER_DATA.rm.color, l: isAr ? "وسطى يمين" : "R-Middle" },
    { c: FINGER_DATA.rr.color, l: isAr ? "بنسر يمين" : "R-Ring" },
    { c: FINGER_DATA.rp.color, l: isAr ? "خنصر يمين" : "R-Pinky" }
  ];
  var h = "";
  for(var i = 0; i < list.length; i++){
    h += '<div class="kb-legend-item"><div class="kb-legend-dot" style="background:'+list[i].c+'"></div><span class="kb-legend-lbl">'+list[i].l+'</span></div>';
  }
  leg.innerHTML = h;
}

// Find key element corresponding to target character
function findKeyElForChar(char){
  if(!char) return null;
  var isAr = (S.lang === "ar");
  var all = document.querySelectorAll(".kb-key");

  if(char === " "){
    for(var i = 0; i < all.length; i++) if(all[i].dataset.k === "Space") return all[i];
  }

  for(var j = 0; j < all.length; j++){
    var el = all[j];
    var k = el.dataset.k;
    var ar = el.dataset.ar;
    if(isAr){
      if(ar === char || normalizeAr(ar) === normalizeAr(char)) return el;
      if(QWERTY_TO_AR[k] === char || normalizeAr(QWERTY_TO_AR[k]) === normalizeAr(char)) return el;
    } else {
      if(k.toLowerCase() === char.toLowerCase()) return el;
      if(k.length === 2 && (k[0] === char || k[1] === char)) return el;
    }
  }

  // Fallback check
  for(var m = 0; m < all.length; m++){
    var k2 = all[m].dataset.k;
    if(k2.toLowerCase() === char.toLowerCase()) return all[m];
  }
  return null;
}

function updateKeyboardCasing(isShiftActive){
  if(S.lang === "ar") return;
  var allKeys = document.querySelectorAll(".kb-key");
  for(var i = 0; i < allKeys.length; i++){
    var el = allKeys[i];
    var k = el.dataset.k;
    if(!k || el.classList.contains("special")) continue;
    var mainLblEl = el.querySelector(".kb-lbl-main");
    if(!mainLblEl) continue;
    if(k.length === 1 && k.toLowerCase() >= 'a' && k.toLowerCase() <= 'z'){
      mainLblEl.textContent = isShiftActive ? k.toUpperCase() : k.toLowerCase();
    } else if(k.length === 2){
      // Pairs like "1!", "2@", "-_", "=+", "[{", "]}", ";:", "'\"", ",<", ".>", "/?"
      mainLblEl.textContent = isShiftActive ? k[1] : k[0];
    }
  }
}

// Update Target Key in EdClub style (pulsing glow + finger indicator)
function updateTargetKey(){
  var prev = document.querySelectorAll(".kb-key.target-key, .kb-key.shift-needed");
  for(var i = 0; i < prev.length; i++){
    prev[i].classList.remove("target-key","shift-needed");
  }

  var badge = document.getElementById("kb-next-badge");
  var fBadge = document.getElementById("kb-finger-badge");
  var fDot = document.getElementById("kb-finger-dot");
  var fText = document.getElementById("kb-finger-text");
  var isAr = (S.lang === "ar");

  if(!S.text || S.idx >= S.text.length){
    if(badge) badge.textContent = "—";
    if(fText) fText.textContent = isAr ? "مكتمل" : "Complete";
    updateKeyboardCasing(false);
    return;
  }

  var nextCh = S.text[S.idx];
  var el = findKeyElForChar(nextCh);

  if(badge){
    badge.textContent = (nextCh === " ") ? (isAr ? "مسافة" : "SPACE") : nextCh;
  }

  var isUpperEn = (nextCh >= "A" && nextCh <= "Z");
  var isShiftSym = '~!@#$%^&*()_+{}|:"<>?'.indexOf(nextCh) >= 0;
  var needsShift = (isUpperEn || isShiftSym);

  // Dynamic casing: displays lowercase for lowercase text, uppercase for uppercase text
  updateKeyboardCasing(needsShift);

  if(el){
    el.classList.add("target-key");
    var fCode = el.dataset.f;
    var fInfo = FINGER_DATA[fCode] || FINGER_DATA.th;
    if(fDot) fDot.style.background = fInfo.color;
    if(fText) fText.textContent = isAr ? fInfo.ar : fInfo.en;
    if(fBadge) fBadge.style.borderColor = fInfo.color;

    // Shift helper
    if(needsShift){
      var oppSide = (fInfo.hand === "L") ? "right" : "left";
      var shifts = document.querySelectorAll(".kb-key[data-k='Shift']");
      for(var s = 0; s < shifts.length; s++){
        if(shifts[s].dataset.side === oppSide){
          shifts[s].classList.add("shift-needed");
        }
      }
    }
  } else {
    if(fDot) fDot.style.background = "#e2b714";
    if(fText) fText.textContent = isAr ? "إبهام" : "Thumbs";
  }
}

// Highlight key on press (ok / err)
function highlightPressedKey(evKey, ok){
  var all = document.querySelectorAll(".kb-key");
  var evL = evKey.toLowerCase();

  for(var i = 0; i < all.length; i++){
    var el = all[i];
    var k = el.dataset.k;
    var ar = el.dataset.ar;
    var match = false;

    if(k === "Space" && evKey === " ") match = true;
    else if(k.toLowerCase() === evL) match = true;
    else if(ar === evKey || normalizeAr(ar) === normalizeAr(evKey)) match = true;
    else if(QWERTY_TO_AR[evKey] === ar || QWERTY_TO_AR[k] === evKey) match = true;
    else if(k === "Backspace" && evL === "backspace") match = true;
    else if(k.length === 2 && (k[0] === evKey || k[1] === evKey)) match = true;

    if(match){
      _animateKeyPress(el, ok);
    }
  }
}

function _animateKeyPress(el, ok){
  var id = el.id;
  if(_kbTimeouts[id]){
    clearTimeout(_kbTimeouts[id]);
    _kbTimeouts[id] = null;
  }
  el.classList.remove("pressed-ok","pressed-err");
  void el.offsetWidth;
  el.classList.add(ok ? "pressed-ok" : "pressed-err");

  _kbTimeouts[id] = setTimeout(function(){
    el.classList.remove("pressed-ok","pressed-err");
    _kbTimeouts[id] = null;
  }, 120);
}

function toggleKeyboard(){
  _kbVisible = !_kbVisible;
  var wrap = document.getElementById("kb-wrap");
  var btn = document.getElementById("kb-toggle-btn");
  var lbl = document.getElementById("kb-toggle-lbl");
  var isAr = (S.lang === "ar");

  if(_kbVisible){
    wrap.classList.remove("hidden");
    btn.classList.add("on");
    lbl.textContent = isAr ? "إخفاء الكيبورد" : "Hide Keyboard";
  } else {
    wrap.classList.add("hidden");
    btn.classList.remove("on");
    lbl.textContent = isAr ? "إظهار الكيبورد" : "Show Keyboard";
  }
}

// ==============================================================
// 4. ZERO-LATENCY RAZER GREEN MECHANICAL SWITCH AUDIO
// ==============================================================
var _actx = null, _masterGain = null;
var _rgSounds = [], _spaceSound = null, _errSound = null;

function _initAudio(){
  if(_actx){
    if(_actx.state === 'suspended') _actx.resume();
    return;
  }
  try {
    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if(!AudioCtx) return;
    _actx = new AudioCtx({ latencyHint: 0, sampleRate: 44100 });
    if(_actx.state === 'suspended') _actx.resume();

    _masterGain = _actx.createGain();
    _masterGain.gain.setValueAtTime(0.85, _actx.currentTime);
    _masterGain.connect(_actx.destination);

    var silentBuf = _actx.createBuffer(1, 128, _actx.sampleRate);
    var silentSrc = _actx.createBufferSource();
    silentSrc.buffer = silentBuf;
    silentSrc.loop = true;
    silentSrc.connect(_actx.destination);
    silentSrc.start(0);

    _rgSounds = [
      _synthesizeRGSound(_actx, 0),
      _synthesizeRGSound(_actx, 1),
      _synthesizeRGSound(_actx, 2),
      _synthesizeRGSound(_actx, 3)
    ];
    _spaceSound = _synthesizeSpaceSound(_actx);
    _errSound = _synthesizeErrorSound(_actx);
  } catch(e){}
}

function _synthesizeRGSound(actx, variant){
  var sr = actx.sampleRate;
  var len = Math.floor(sr * 0.045);
  var buf = actx.createBuffer(1, len, sr);
  var d = buf.getChannelData(0);
  var pitch = 1 + (variant - 1.5) * 0.04;
  var clickFreq = 4300 * pitch, clackFreq = 1100 * pitch, thudFreq = 260 * pitch;

  for(var i = 0; i < len; i++){
    var t = i / sr;
    var impulse = (i === 0) ? 0.95 : (i === 1) ? -0.75 : (i === 2) ? 0.55 : (i < 8) ? (Math.random()*2-1)*0.25 : 0;
    var click = Math.cos(2 * Math.PI * clickFreq * t) * Math.exp(-t * 680) * 0.45;
    var clack = Math.sin(2 * Math.PI * clackFreq * t) * Math.exp(-t * 220) * 0.35;
    var thud = Math.sin(2 * Math.PI * thudFreq * t) * Math.exp(-t * 110) * 0.25;
    d[i] = (impulse * 0.4 + click + clack + thud) * 0.85;
  }
  return buf;
}

function _synthesizeSpaceSound(actx){
  var sr = actx.sampleRate;
  var len = Math.floor(sr * 0.065);
  var buf = actx.createBuffer(1, len, sr);
  var d = buf.getChannelData(0);

  for(var i = 0; i < len; i++){
    var t = i / sr;
    var impulse = (i === 0) ? 0.85 : (i === 1) ? -0.65 : (i < 8) ? (Math.random()*2-1)*0.2 : 0;
    var click = Math.cos(2 * Math.PI * 3000 * t) * Math.exp(-t * 500) * 0.3;
    var clack = Math.sin(2 * Math.PI * 750 * t) * Math.exp(-t * 160) * 0.45;
    var thud = Math.sin(2 * Math.PI * 210 * t) * Math.exp(-t * 70) * 0.45;
    d[i] = (impulse * 0.3 + click + clack + thud) * 0.9;
  }
  return buf;
}

function _synthesizeErrorSound(actx){
  var sr = actx.sampleRate;
  var len = Math.floor(sr * 0.07);
  var buf = actx.createBuffer(1, len, sr);
  var d = buf.getChannelData(0);

  for(var i = 0; i < len; i++){
    var t = i / sr;
    var impulse = (i === 0) ? 0.7 : (i === 1) ? -0.5 : 0;
    var lowThud = Math.sin(2 * Math.PI * 190 * t) * Math.exp(-t * 90) * 0.55;
    var woodPop = Math.sin(2 * Math.PI * 380 * t) * Math.exp(-t * 140) * 0.35;
    d[i] = (impulse * 0.25 + lowThud + woodPop) * 0.8;
  }
  return buf;
}

window.addEventListener("pointerdown", _initAudio, { passive: true });
window.addEventListener("mousedown", _initAudio, { passive: true });
window.addEventListener("keydown", _initAudio, { passive: true });

function playCorrectSound(isSpace){
  if(!_actx) _initAudio();
  if(!_actx) return;
  if(_actx.state === 'suspended') _actx.resume();
  try {
    var src = _actx.createBufferSource();
    src.buffer = (isSpace && _spaceSound) ? _spaceSound : _rgSounds[Math.floor(Math.random() * _rgSounds.length)];
    src.connect(_masterGain);
    src.start(_actx.currentTime);
  } catch(e){}
}

function playErrorSound(){
  if(!_actx) _initAudio();
  if(!_actx) return;
  if(_actx.state === 'suspended') _actx.resume();
  try {
    var src = _actx.createBufferSource();
    if(_errSound) src.buffer = _errSound;
    src.connect(_masterGain);
    src.start(_actx.currentTime);
  } catch(e){}
}

// ==============================================================
// 5. TEST FLOW AND KEYBOARD EVENT HANDLERS
// ==============================================================
function genText(){
  var p = POOLS[S.lang][S.mode];
  if(S.mode === "quotes") return p[Math.floor(Math.random() * p.length)];
  var w = [];
  for(var i = 0; i < 80; i++) w.push(p[Math.floor(Math.random() * p.length)]);
  return w.join(" ");
}

function initTest(){
  if(S.ti) clearInterval(S.ti);
  S.text = genText();
  S.ch = [];
  for(var i = 0; i < S.text.length; i++) S.ch.push({ c: S.text[i], s: i === 0 ? "now" : "w" });
  S.idx = 0;
  S.on = false;
  S.fin = false;
  S.left = S.dur;
  S.ks = [];
  S.ec = 0;
  S.t0 = 0;
  S.tk = 0;

  document.getElementById("xwpm").innerHTML = "&mdash;";
  document.getElementById("xacc").innerHTML = "&mdash;";
  document.getElementById("xerr").textContent = "0";
  document.getElementById("timer").textContent = S.dur;
  document.getElementById("timer").className = "num";
  document.getElementById("hint").style.display = "block";
  document.getElementById("tcard").className = "card";

  var w = document.getElementById("words");
  w.scrollTop = 0;
  w.className = S.lang === "ar" ? "ar" : "";
  renderChars();
  updRing(S.dur, S.dur);
  updateTargetKey();

  var nTest = document.getElementById("n-test");
  if(!nTest || nTest.classList.contains("on")){
    document.getElementById("p-test").className = "page show";
  }
  document.getElementById("p-result").className = "page";
  document.getElementById("inp").value = "";
  document.getElementById("inp").focus();
}

function renderChars(){
  var words = [];
  var curWord = [];

  for(var i = 0; i < S.ch.length; i++){
    var o = S.ch[i];
    if(o.c === " "){
      if(curWord.length > 0){
        words.push('<span class="word">' + curWord.join("") + '</span>');
        curWord = [];
      }
      var cls = "c sp " + o.s;
      words.push('<span class="' + cls + '">&nbsp;</span>');
    } else {
      var cls2 = "c " + o.s;
      curWord.push('<span class="' + cls2 + '">' + o.c + '</span>');
    }
  }
  if(curWord.length > 0){
    words.push('<span class="word">' + curWord.join("") + '</span>');
  }

  var wordsEl = document.getElementById("words");
  wordsEl.innerHTML = words.join("");

  // Smooth scroll active char into view (protects top padding & Arabic ascenders)
  var curEl = wordsEl.querySelector(".c.now");
  if(curEl){
    var cardHeight = wordsEl.clientHeight;
    var topPos = curEl.offsetTop;
    if(topPos > cardHeight * 0.55){
      wordsEl.scrollTop = topPos - cardHeight * 0.28;
    } else {
      wordsEl.scrollTop = 0;
    }
  }
}

function updRing(l, t){
  var r = document.getElementById("ring");
  r.style.strokeDashoffset = 201.06 * (1 - l / t);
  r.style.stroke = (l <= 5 && S.on) ? "var(--err)" : "var(--accent)";
}

function finishTest(){
  if(S.ti) clearInterval(S.ti);
  S.fin = true;
  S.on = false;
  document.getElementById("tcard").className = "card";
  document.getElementById("hint").style.display = "none";

  var el = (performance.now() - S.t0) / 1000;
  var cor = 0, em = {}, tm = {};
  for(var i = 0; i < S.ks.length; i++){
    var k = S.ks[i];
    if(k.ok) cor++;
    else em[k.ex] = (em[k.ex] || 0) + 1;
    if(k.ok && k.dur > 0 && k.dur < 2000){
      if(!tm[k.ch]) tm[k.ch] = [];
      tm[k.ch].push(k.dur);
    }
  }
  var errs = 0;
  for(var x in em) errs += em[x];

  var res = {
    wpm: calcWPM(cor, el * 1000),
    raw: calcWPM(S.ks.length, el * 1000),
    acc: calcAcc(cor, S.ks.length),
    cor: cor,
    errs: errs,
    tot: S.ks.length,
    dur: el,
    em: em,
    tm: tm,
    ts: Date.now(),
    lang: S.lang
  };
  pR(res);
  showResult(res);
  chkAch();
}

function showResult(r){
  document.getElementById("p-test").className = "page";
  var rp = document.getElementById("p-result");
  rp.className = "page show";

  document.getElementById("rw").textContent = r.wpm;
  document.getElementById("rw").style.color = r.wpm >= 80 ? "var(--ok)" : r.wpm >= 50 ? "var(--accent)" : "var(--text)";
  document.getElementById("rr").textContent = r.raw;
  document.getElementById("ra").textContent = r.acc + "%";
  document.getElementById("ra").style.color = r.acc >= 98 ? "var(--ok)" : r.acc >= 90 ? "var(--accent)" : "var(--err)";
  document.getElementById("re").textContent = r.errs;
  document.getElementById("re").style.color = r.errs > 0 ? "var(--err)" : "var(--ok)";
  document.getElementById("rt").textContent = Math.round(r.dur) + "s";

  var te = [];
  for(var c in r.em) te.push([c, r.em[c]]);
  te.sort(function(a,b){ return b[1] - a[1]; });
  te = te.slice(0, 8);
  var ec = document.getElementById("rerr");
  if(!te.length){
    ec.innerHTML = "<p style='color:var(--ok)'>لا أخطاء! 🎉</p>";
  } else {
    var h = "";
    for(var i = 0; i < te.length; i++){
      var ch = te[i][0] === " " ? "⎵" : te[i][0];
      h += "<div class='chip'><div class='ch2'>" + ch + "</div><div class='cn'>x" + te[i][1] + "</div></div>";
    }
    ec.innerHTML = h;
  }

  var tents = [];
  for(var c2 in r.tm){
    var arr = r.tm[c2], sum = 0;
    for(var j = 0; j < arr.length; j++) sum += arr[j];
    tents.push({ c: c2, av: Math.round(sum / arr.length) });
  }
  tents.sort(function(a,b){ return b.av - a.av; });
  tents = tents.slice(0, 5);
  var sk = document.getElementById("rslow");
  if(!tents.length){
    sk.innerHTML = "<p style='color:var(--sub);font-size:13px'>بيانات غير كافية</p>";
  } else {
    var h2 = "";
    for(var i2 = 0; i2 < tents.length; i2++){
      var bc = tents[i2].av > 400 ? "var(--err)" : tents[i2].av > 250 ? "var(--accent)" : "var(--ok)";
      var pct = Math.min((tents[i2].av / 600) * 100, 100);
      var ch3 = tents[i2].c === " " ? "⎵" : tents[i2].c;
      h2 += "<div class='trow'><span class='k'>" + ch3 + "</span><div class='bwrap'><div class='bfill' style='width:" + pct + "%;background:" + bc + "'></div></div><span class='ms'>" + tents[i2].av + "ms</span></div>";
    }
    sk.innerHTML = h2;
  }

  var tip = document.getElementById("rtip");
  if(te.length > 0){
    tip.style.display = "flex";
    var chars = [];
    for(var i3 = 0; i3 < Math.min(te.length, 3); i3++){
      chars.push(te[i3][0] === " " ? "المسافة" : '"' + te[i3][0] + '"');
    }
    document.getElementById("rtiptext").textContent = "تكرر لديك أخطاء في: " + chars.join("، ") + ". سيخصص التمرين القادم لتحسينها.";
  } else {
    tip.style.display = "none";
  }
}

// KEYDOWN LISTENER (INSTANT ZERO-LATENCY DISPATCH + DUAL-LAYOUT MATCHING)
document.addEventListener("keydown", function(e){
  if(e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) return;
  var omModal = document.getElementById('online-modal');
  if(omModal && omModal.classList.contains('show')) return;

  var tp = document.getElementById("p-test");
  var rp = document.getElementById("p-result");
  if(tp.className.indexOf("show") < 0 && rp.className.indexOf("show") < 0) return;

  if(e.key === "Tab"){ e.preventDefault(); initTest(); return; }
  if(e.key === "Escape"){ initTest(); return; }
  if(S.fin) return;
  if(e.ctrlKey || e.altKey || e.metaKey) return;

  if(e.key === "Backspace"){
    e.preventDefault();
    if(S.idx > 0){
      playCorrectSound(false);
      highlightPressedKey("Backspace", true);
      S.idx--;
      S.ch[S.idx].s = "now";
      if(S.idx + 1 < S.ch.length) S.ch[S.idx + 1].s = "w";
      renderChars();
      updateTargetKey();
    }
    return;
  }

  if(e.key.length !== 1) return;
  var ex = S.text[S.idx];
  if(!ex) return;

  // ROBUST DUAL-LAYOUT KEYSTROKE MATCHING (ACCURATE ARABIC & ENGLISH MATCHING)
  var ok = matchChar(e.key, ex);

  // IMMEDIATE DISPATCH: AUDIO + VISUAL KEYBOARD HIGHLIGHT
  if(ok){
    playCorrectSound(ex === " ");
  } else {
    playErrorSound();
  }
  highlightPressedKey(e.key, ok);

  // START TIMER ON FIRST KEYSTROKE
  if(!S.on && S.idx === 0){
    S.on = true;
    S.t0 = performance.now();
    S.tk = S.t0;
    document.getElementById("hint").style.display = "none";
    document.getElementById("tcard").className = "card glow";
    startTimer();
  }

  var now = performance.now();
  var dur = S.tk > 0 ? (now - S.tk) : 0;
  S.tk = now;
  if(!ok) S.ec++;
  S.ks.push({ ch: e.key, ex: ex, ok: ok, dur: dur });
  S.ch[S.idx].s = ok ? "ok" : "bad";
  S.idx++;
  if(S.idx < S.ch.length) S.ch[S.idx].s = "now";

  var el2 = now - S.t0;
  var cor2 = 0;
  for(var i = 0; i < S.ks.length; i++) if(S.ks[i].ok) cor2++;
  var w = calcWPM(cor2, el2);
  var a = calcAcc(cor2, S.ks.length);

  document.getElementById("xwpm").textContent = w;
  document.getElementById("xwpm").style.color = w >= 80 ? "var(--ok)" : w >= 50 ? "var(--accent)" : "var(--text)";
  document.getElementById("xacc").textContent = a;
  document.getElementById("xacc").style.color = a >= 95 ? "var(--ok)" : a >= 85 ? "var(--accent)" : "var(--err)";
  document.getElementById("xerr").textContent = S.ec;
  document.getElementById("xerr").style.color = S.ec > 0 ? "var(--err)" : "var(--text)";

  renderChars();
  updateTargetKey();

  if(S.idx >= S.text.length) finishTest();
});

document.getElementById("tcard").addEventListener("click", function(){
  document.getElementById("inp").focus();
});

function startTimer(){
  S.ti = setInterval(function(){
    S.left--;
    document.getElementById("timer").textContent = S.left;
    if(S.left <= 5) document.getElementById("timer").className = "num red";
    updRing(S.left, S.dur);
    if(S.left <= 0) finishTest();
  }, 1000);
}

// UI LOCALIZATION FOR NAV TABS AND LABELS
function updateUILanguage(l){
  var isAr = (l === "ar");
  // Race Tab & Subnav Translations
  var nRace = document.getElementById("n-race");
  if(nRace) nRace.textContent = isAr ? "🏁 سباق" : "🏁 Race";
  var raceTitle = document.getElementById("race-title-txt");
  if(raceTitle) raceTitle.textContent = isAr ? "سباق السرعة" : "RACE DUEL";
  var raceSub = document.getElementById("race-title-sub");
  if(raceSub) raceSub.textContent = isAr ? "سباق تفاعلي على نفس الكيبورد" : "Interactive Duel on Same Keyboard";
  var rmGhost = document.getElementById("rm-ghost-lbl");
  if(rmGhost) rmGhost.textContent = isAr ? "سباق التناوب (شبح المنافس)" : "1v1 Ghost Duel";
  var rmBot = document.getElementById("rm-bot-lbl");
  if(rmBot) rmBot.textContent = isAr ? "سباق ضد الروبوت" : "Race vs AI Bot";
  var rmBotCfg = document.getElementById("rm-bot-cfg-lbl");
  if(rmBotCfg) rmBotCfg.textContent = isAr ? "مستوى الروبوت:" : "Bot Level:";
  var rCardHint = document.getElementById("r-card-hint");
  if(rCardHint){
    rCardHint.textContent = isAr ?
      "اكتب النص أعلاه بأقصى سرعة • اضغط Tab للإعادة" :
      "Type the text above as fast as possible • Press Tab to restart";
  }
  var botSel = document.getElementById("rm-bot-level");
  if(botSel){
    var curBotVal = botSel.value;
    if(isAr){
      botSel.innerHTML = "<option value='35'>🟢 مبتدئ (35 WPM)</option><option value='65'>🟡 متوسط (65 WPM)</option><option value='95'>🔴 محترف (95 WPM)</option><option value='125'>⚡ خارق (125 WPM)</option>";
    } else {
      botSel.innerHTML = "<option value='35'>🟢 Beginner (35 WPM)</option><option value='65'>🟡 Medium (65 WPM)</option><option value='95'>🔴 Pro (95 WPM)</option><option value='125'>⚡ Beast (125 WPM)</option>";
    }
    botSel.value = curBotVal;
  }


  // 1. Header Navigation Tabs
  var nTest = document.getElementById("n-test");
  if(nTest) nTest.textContent = isAr ? "تدريب" : "Practice";
  var nStats = document.getElementById("n-stats");
  if(nStats) nStats.textContent = isAr ? "إحصاءات" : "Stats";
  var nLearn = document.getElementById("n-learn");
  if(nLearn) nLearn.textContent = isAr ? "تعلم" : "Learn";

  // 2. Mode Select Dropdown
  var ms = document.getElementById("msel");
  if(ms){
    var curVal = ms.value;
    if(isAr){
      ms.innerHTML = "<option value='common'>شائع</option><option value='medium'>متوسط</option><option value='code'>كود</option><option value='quotes'>اقتباسات</option>";
    } else {
      ms.innerHTML = "<option value='common'>common</option><option value='medium'>medium</option><option value='code'>code</option><option value='quotes'>quotes</option>";
    }
    ms.value = curVal;
  }

  // 3. Stats Bar Labels
  var lblAcc = document.getElementById("lbl-acc");
  if(lblAcc) lblAcc.textContent = isAr ? "دقة %" : "Accuracy %";
  var lblErr = document.getElementById("lbl-err");
  if(lblErr) lblErr.textContent = isAr ? "أخطاء" : "Errors";

  // 4. Typing Box Hint
  var hintEl = document.getElementById("hint");
  if(hintEl) hintEl.textContent = isAr ? "ابدأ الكتابة للبدء • اضغط Tab للإعادة السريعة" : "Start typing to begin • Press Tab to restart";

  // 5. Actions Bar
  var gbtnLbl = document.getElementById("gbtn-lbl");
  if(gbtnLbl) gbtnLbl.textContent = isAr ? "إعادة" : "Restart";
  var kbToggleLbl = document.getElementById("kb-toggle-lbl");
  if(kbToggleLbl){
    kbToggleLbl.textContent = _kbVisible ? (isAr ? "إخفاء الكيبورد" : "Hide Keyboard") : (isAr ? "إظهار الكيبورد" : "Show Keyboard");
  }

  // 6. Keyboard Guide Next Key Label
  var nextLbl = document.getElementById("kb-next-lbl");
  if(nextLbl) nextLbl.textContent = isAr ? "الحرف التالي:" : "Next Key:";
}

// CONTROL FUNCTIONS
function setLang(l){
  S.lang = l;
  document.documentElement.lang = l;
  document.documentElement.dir = (l === "ar" ? "rtl" : "ltr");
  document.getElementById("l-en").className = "pb" + (l === "en" ? " on" : "");
  document.getElementById("l-ar").className = "pb" + (l === "ar" ? " on" : "");
  updateUILanguage(l);
  pS({ lang: l, dur: S.dur, mode: S.mode });
  buildKeyboard();

  var curTab = "test";
  var tabs = ["test","stats","learn","race"];
  for(var i = 0; i < tabs.length; i++){
    var nb = document.getElementById("n-" + tabs[i]);
    if(nb && nb.classList.contains("on")) curTab = tabs[i];
  }
  showTab(curTab);
}

function setDur(d){
  S.dur = d;
  document.getElementById("d-15").className = "pb" + (d === 15 ? " on" : "");
  document.getElementById("d-30").className = "pb" + (d === 30 ? " on" : "");
  document.getElementById("d-60").className = "pb" + (d === 60 ? " on" : "");
  pS({ lang: S.lang, dur: d, mode: S.mode });
  initTest();
}

function setMode(m){
  S.mode = m;
  pS({ lang: S.lang, dur: S.dur, mode: m });
  initTest();
}

function showTab(t){
  var tabs = ["test","stats","learn","race"];
  for(var i = 0; i < tabs.length; i++){
    var nb = document.getElementById("n-" + tabs[i]);
    if(nb) nb.className = "nb" + (tabs[i] === t ? " on" : "");
    var pg = document.getElementById("p-" + tabs[i]);
    if(pg) pg.className = "page" + (tabs[i] === t ? " show" : "");
  }
  document.getElementById("p-result").className = "page";
  if(t === "test") initTest();
  if(t === "stats") renderStats();
  if(t === "learn") renderLearn();
  if(t === "race") initRace();
}

// STATS RENDERING
function renderStats(){
  var rs = gR();
  var con = document.getElementById("scon");
  var emp = document.getElementById("semp");
  if(!rs.length){ emp.style.display = "block"; con.style.display = "none"; return; }
  emp.style.display = "none"; con.style.display = "block";

  var best = 0, sum = 0, sumA = 0;
  for(var i = 0; i < rs.length; i++){
    if(rs[i].wpm > best) best = rs[i].wpm;
    sum += rs[i].wpm;
    sumA += rs[i].acc;
  }
  var avg = Math.round(sum / rs.length);
  var avgA = Math.round(sumA / rs.length);
  var tt = 0;
  for(var j = 0; j < rs.length; j++) tt += rs[j].dur;

  document.getElementById("sb").textContent = best;
  document.getElementById("sb").style.color = "var(--accent)";
  document.getElementById("sa").textContent = avg;
  document.getElementById("sac").textContent = avgA + "%";
  document.getElementById("st").textContent = rs.length;
  document.getElementById("stm").textContent = tt < 3600 ? Math.round(tt / 60) + "m" : (tt / 3600).toFixed(1) + "h";

  var l20 = rs.slice(0, 20).reverse();
  drawChart("cwpm", l20.map(function(r){ return r.wpm; }), "var(--accent)");
  drawChart("cacc", l20.map(function(r){ return r.acc}), "var(--ok)");

  var ge = {}, gt = {};
  for(var k = 0; k < rs.length; k++){
    var r = rs[k];
    if(r.em) for(var c in r.em) ge[c] = (ge[c] || 0) + r.em[c];
    if(r.tm) for(var c2 in r.tm){
      if(!gt[c2]) gt[c2] = [];
      for(var m = 0; m < r.tm[c2].length; m++) gt[c2].push(r.tm[c2][m]);
    }
  }
  renderHeatmap(ge, gt);
  renderAch();

  var rl = document.getElementById("rlist");
  var rh = "";
  var sl = rs.slice(0, 10);
  for(var n = 0; n < sl.length; n++){
    var d = new Date(sl[n].ts);
    var ds = d.getDate() + "/" + (d.getMonth() + 1) + " " + d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0");
    var acl = sl[n].acc >= 95 ? "var(--ok)" : sl[n].acc >= 85 ? "var(--accent)" : "var(--err)";
    rh += "<div class='recrow'><span style='font-size:11px;color:var(--sub);font-family:monospace'>" + ds + "</span><span style='font-family:monospace;font-weight:700;color:var(--accent)'>" + sl[n].wpm + " WPM</span><span style='font-family:monospace;color:" + acl + "'>" + sl[n].acc + "%</span><span style='font-size:11px;color:var(--sub);font-family:monospace'>" + Math.round(sl[n].dur) + "s</span><span style='font-size:11px;color:var(--sub);font-family:monospace'>" + (sl[n].lang || "en").toUpperCase() + "</span></div>";
  }
  rl.innerHTML = rh;
}

function drawChart(id, data, color){
  var svg = document.getElementById(id);
  if(!data || data.length < 2){ svg.innerHTML = ""; return; }
  var W = 300, H = 80;
  var max = data[0], min = data[0];
  for(var i = 1; i < data.length; i++){
    if(data[i] > max) max = data[i];
    if(data[i] < min) min = data[i];
  }
  var range = max - min || 1;
  var pts = "";
  for(var j = 0; j < data.length; j++){
    var x = (j / (data.length - 1)) * W;
    var y = H - ((data[j] - min) / range) * (H - 10) - 5;
    pts += x + "," + y + " ";
  }
  svg.innerHTML = "<defs><linearGradient id='g" + id + "' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='" + color + "' stop-opacity='.3'/><stop offset='100%' stop-color='" + color + "' stop-opacity='0'/></linearGradient></defs><polygon points='0," + H + " " + pts + W + "," + H + "' fill='url(#g" + id + ")'/><polyline points='" + pts + "' fill='none' stroke='" + color + "' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/>";
}

function mastery(e, ts){
  var t = ts.length;
  if(!t && !e) return 50;
  var avg = 0;
  if(t){
    var s = 0;
    for(var i = 0; i < t; i++) s += ts[i];
    avg = s / t;
  } else avg = 500;
  var sp = Math.max(0, Math.min(100, 100 - (avg - 100) / 4));
  var er = e / (t + e + 1);
  return Math.round(sp * .4 + (1 - er) * 100 * .6);
}

function renderHeatmap(em, tm){
  var w = document.getElementById("hmap");
  var h = "";
  for(var ri = 0; ri < KR.length; ri++){
    h += "<div class='hmrow' style='padding-left:" + (ri * 14) + "px'>";
    for(var ci = 0; ci < KR[ri].length; ci++){
      var k = KR[ri][ci];
      var e = em[k] || 0;
      var ts = tm[k] || [];
      var m = mastery(e, ts);
      var has = (e > 0 || ts.length > 0);
      var bg, bd;
      if(m >= 80){ bg = "rgba(76,175,125,.4)"; bd = "rgba(76,175,125,.6)"; }
      else if(m >= 60){ bg = "rgba(226,183,20,.35)"; bd = "rgba(226,183,20,.6)"; }
      else if(m >= 40){ bg = "rgba(229,146,86,.45)"; bd = "rgba(229,146,86,.7)"; }
      else { bg = "rgba(229,86,86,.5)"; bd = "rgba(229,86,86,.7)"; }
      var sty = has ? "background:" + bg + ";border-color:" + bd : "";
      var avg2 = 0;
      if(ts.length){
        var s2 = 0;
        for(var z = 0; z < ts.length; z++) s2 += ts[z];
        avg2 = Math.round(s2 / ts.length);
      }
      var fn = FM[k] ? FN[FM[k]] : "";
      var tip2 = "إتقان: " + m + "%\nأخطاء: " + e;
      if(avg2) tip2 += "\nمتوسط: " + avg2 + "ms";
      if(fn) tip2 += "\n" + fn;
      h += "<div class='hmk' style='" + sty + "' title='" + tip2 + "'>" + k + "</div>";
    }
    h += "</div>";
  }
  w.innerHTML = h;
}

function renderAch(){
  var ul = gA();
  var g = document.getElementById("achg");
  var h = "";
  for(var i = 0; i < ACHS.length; i++){
    var a = ACHS[i];
    var u = null;
    for(var j = 0; j < ul.length; j++){
      if(ul[j].id === a.id){ u = ul[j]; break; }
    }
    h += "<div class='ach" + (u ? " got" : "") + "'><div class='ico'>" + a.ico + "</div><div class='nm'>" + a.n + "</div><div class='ds'>" + a.d + "</div></div>";
  }
  g.innerHTML = h;
}

function chkAch(){
  var rs = gR();
  var ul = gA();
  var nu = [];
  var best = 0;
  for(var i = 0; i < rs.length; i++) if(rs[i].wpm > best) best = rs[i].wpm;
  var cks = [
    { id: "ft", c: rs.length >= 1 },
    { id: "w50", c: best >= 50 },
    { id: "w80", c: best >= 80 },
    { id: "a100", c: false },
    { id: "t10", c: rs.length >= 10 }
  ];
  for(var j = 0; j < rs.length; j++) if(rs[j].acc === 100) cks[3].c = true;
  for(var k = 0; k < cks.length; k++){
    if(cks[k].c){
      var found = false;
      for(var m = 0; m < ul.length; m++) if(ul[m].id === cks[k].id) found = true;
      if(!found){
        ul.push({ id: cks[k].id, date: new Date().toISOString() });
        nu.push(cks[k].id);
      }
    }
  }
  if(nu.length){
    pA(ul);
    for(var n = 0; n < nu.length; n++) showToast(nu[n]);
  }
}

function showToast(id){
  var a = null;
  for(var i = 0; i < ACHS.length; i++) if(ACHS[i].id === id) a = ACHS[i];
  if(!a) return;
  var con = document.getElementById("toasts");
  var d = document.createElement("div");
  d.className = "toast2";
  d.innerHTML = "<span style='font-size:28px'>" + a.ico + "</span><div><div style='font-size:11px;color:var(--accent);text-transform:uppercase'>إنجاز جديد!</div><div style='font-size:14px;font-weight:600'>" + a.n + "</div><div style='font-size:12px;color:var(--sub)'>" + a.d + "</div></div>";
  con.appendChild(d);
  setTimeout(function(){
    d.style.opacity = "0";
    d.style.transition = "opacity .4s";
    setTimeout(function(){ d.remove(); }, 400);
  }, 4000);
}

function renderLearn(){
  var g = document.getElementById("lgrid");
  var h = "";
  var lvs = [1, 2, 3, 4, 5];
  for(var li = 0; li < lvs.length; li++){
    var lv = lvs[li];
    var ls = [];
    for(var j = 0; j < LESSONS.length; j++) if(LESSONS[j].lv === lv) ls.push(LESSONS[j]);
    if(!ls.length) continue;
    h += "<div class='lvs'><div class='lvh'><div class='lvb" + (lv === 1 ? " g" : "") + "'>" + lv + "</div><span class='lvl'>المستوى " + lv + "</span><div class='lvline'></div></div><div class='lgrid'>";
    for(var k = 0; k < ls.length; k++){
      var l = ls[k];
      var ksh = "";
      for(var m = 0; m < Math.min(l.ks.length, 6); m++) ksh += "<span>" + l.ks[m] + "</span>";
      h += "<div class='lc'><div class='ico'>" + l.ic + "</div><div><div class='tt'>" + l.t + "</div><div class='ds'>" + l.d + "</div>" + (l.ks.length ? "<div class='ks'>" + ksh + "</div>" : "") + "</div></div>";
    }
    h += "</div></div>";
  }
  g.innerHTML = h;
}

// ==============================================================
// 7. RACE MODE ENGINE (GHOST DUEL + AI BOT SYSTEM)
// ==============================================================
var RACE = {
  modeType: "ghost", // "ghost" or "bot"
  botSpeed: 65,      // WPM
  turn: 1,           // 1 = Player 1, 2 = Player 2 (Ghost race)
  text: "",
  p1: { idx:0, ks:[], t0:0, on:false, fin:false, wpm:0, acc:100, finTime:0 },
  p2: { idx:0, ks:[], t0:0, on:false, fin:false, wpm:0, acc:100, finTime:0 },
  ch: [],
  ghostTimeline: [], // [{ t: ms, pct: %, wpm: N, acc: N }] recorded from Player 1
  ghostInterval: null,
  botInterval: null,
  timerInterval: null,
  elapsed: 0,
  started: false,
  done: false
};

function setRaceModeType(type){
  RACE.modeType = type;
  document.getElementById("rm-ghost-btn").className = "rm-pill" + (type === "ghost" ? " on" : "");
  document.getElementById("rm-bot-btn").className = "rm-pill" + (type === "bot" ? " on" : "");
  document.getElementById("rm-bot-config").style.display = (type === "bot" ? "flex" : "none");
  initRace();
}

function setBotSpeed(spd){
  RACE.botSpeed = parseInt(spd, 10) || 65;
  initRace();
}

function genRaceText(){
  var p = POOLS[S.lang]["common"];
  var w = [];
  for(var i = 0; i < 50; i++) w.push(p[Math.floor(Math.random() * p.length)]);
  return w.join(" ");
}

function initRace(){
  if(RACE.timerInterval) clearInterval(RACE.timerInterval);
  if(RACE.ghostInterval) clearInterval(RACE.ghostInterval);
  if(RACE.botInterval) clearInterval(RACE.botInterval);

  RACE.turn = 1;
  RACE.text = genRaceText();
  RACE.done = false;
  RACE.started = false;
  RACE.elapsed = 0;
  RACE.ghostTimeline = [];

  RACE.p1 = { idx:0, ks:[], t0:0, on:false, fin:false, wpm:0, acc:100, finTime:0 };
  RACE.p2 = { idx:0, ks:[], t0:0, on:false, fin:false, wpm:0, acc:100, finTime:0 };

  RACE.ch = [];
  for(var i = 0; i < RACE.text.length; i++) RACE.ch.push({ c: RACE.text[i], s: i === 0 ? "now" : "w" });

  var isAr = (S.lang === "ar");

  // Reset Track UI
  document.getElementById("race-result").className = "";
  document.getElementById("rbar1").style.width = "0%";
  document.getElementById("rbar2").style.width = "0%";
  updateCarPosition("rcar1", 0);
  updateCarPosition("rcar2", 0);
  document.getElementById("rp1-wpm").textContent = "—";
  document.getElementById("rp1-acc").textContent = "—";
  document.getElementById("rp2-wpm").textContent = "—";
  document.getElementById("rp2-acc").textContent = "—";
  document.getElementById("rp1-pct").textContent = "0%";
  document.getElementById("rp2-pct").textContent = "0%";
  document.getElementById("race-timer").textContent = "—";

  if(RACE.modeType === "ghost"){
    document.getElementById("rp1-name").textContent = isAr ? "اللاعب 1 (أنت)" : "Player 1 (You)";
    document.getElementById("rp2-name").textContent = isAr ? "اللاعب 2 (المنافس)" : "Player 2 (Opponent)";
    document.getElementById("rp2-avatar").textContent = "2";
    document.getElementById("rp2-avatar").className = "race-player-avatar race-p2-avatar";
    document.getElementById("rp1-hint").textContent = isAr ? "ابدأ الكتابة للتسجيل" : "Type to record run";
    document.getElementById("rp2-hint").textContent = isAr ? "في انتظار دوره" : "Waiting for turn";

    // Card banner
    document.getElementById("r-main-card").className = "race-main-card glow-p1";
    document.getElementById("r-turn-ico").textContent = "🟡";
    document.getElementById("r-turn-txt").textContent = isAr ? "الجولة 1: دور اللاعب 1 — اكتب الآن لتسجيل مسار سيارتك!" : "Round 1: Player 1 Turn — Type to record your ghost car!";
    document.getElementById("r-turn-sub").textContent = isAr ? "اضغط أي حرف للانطلاق" : "Press any key to start";
  } else {
    // Bot mode
    document.getElementById("rp1-name").textContent = isAr ? "أنت (السيارة الصفراء)" : "You (Yellow Car)";
    document.getElementById("rp2-name").textContent = (isAr ? "🤖 الروبوت الذكي (" : "🤖 AI Bot (") + RACE.botSpeed + " WPM)";
    document.getElementById("rp2-avatar").textContent = "🤖";
    document.getElementById("rp2-avatar").className = "race-player-avatar race-p2-avatar";
    document.getElementById("rp1-hint").textContent = isAr ? "انطلق وتجاوز الروبوت" : "Beat the bot!";
    document.getElementById("rp2-hint").textContent = isAr ? "جاهز للانطلاق" : "Ready to race";

    document.getElementById("r-main-card").className = "race-main-card glow-p1";
    document.getElementById("r-turn-ico").textContent = "🤖";
    document.getElementById("r-turn-txt").textContent = isAr ? "تحدي الروبوت: اكتب وتغلب على سيارة الذكاء الاصطناعي!" : "Bot Duel: Beat the AI car to the finish line!";
    document.getElementById("r-turn-sub").textContent = isAr ? "انطلق فوراً بالطباعة" : "Start typing to race";
  }

  var rw = document.getElementById("r-words");
  rw.className = isAr ? "race-words ar" : "race-words";
  rw.scrollTop = 0;
  renderRaceWords();

  document.getElementById("r-inp").value = "";
  document.getElementById("r-inp").focus();
}

function updateCarPosition(carId, pct){
  var car = document.getElementById(carId);
  var track = document.getElementById(carId === "rcar1" ? "rtrack1" : "rtrack2");
  if(!car || !track) return;
  var trackW = track.clientWidth;
  var carW = 30;
  var flagW = 38;
  var available = trackW - flagW - carW - 6;
  var pos = Math.max(2, Math.min(available, (pct / 100) * available));
  car.style.left = pos + "px";
}

function renderRaceWords(){
  var words = [];
  var curWord = [];
  for(var i = 0; i < RACE.ch.length; i++){
    var o = RACE.ch[i];
    if(o.c === " "){
      if(curWord.length > 0){ words.push('<span class="word">' + curWord.join("") + '</span>'); curWord = []; }
      var cls = "c sp " + o.s;
      words.push('<span class="' + cls + '">&nbsp;</span>');
    } else {
      var cls2 = "c " + o.s;
      curWord.push('<span class="' + cls2 + '">' + o.c + '</span>');
    }
  }
  if(curWord.length > 0) words.push('<span class="word">' + curWord.join("") + '</span>');
  var el = document.getElementById("r-words");
  el.innerHTML = words.join("");

  // Smooth scroll
  var cur = el.querySelector(".c.now");
  if(cur){
    var h = el.clientHeight;
    var top = cur.offsetTop;
    if(top > h * 0.55) el.scrollTop = top - h * 0.28;
    else el.scrollTop = 0;
  }
}

function startRaceTimer(){
  var t0 = performance.now();
  RACE.timerInterval = setInterval(function(){
    RACE.elapsed = Math.round((performance.now() - t0) / 1000);
    document.getElementById("race-timer").textContent = RACE.elapsed + "s";
  }, 500);
}

function calcRaceStats(player){
  var cor = 0;
  for(var i = 0; i < player.ks.length; i++) if(player.ks[i].ok) cor++;
  var el = player.t0 > 0 ? (performance.now() - player.t0) : 1;
  player.wpm = calcWPM(cor, el);
  player.acc = calcAcc(cor, player.ks.length);
  return { wpm: player.wpm, acc: player.acc };
}

function updateRaceUI(playerNum, pct, wpm, acc){
  var barId = "rbar" + playerNum;
  var carId = "rcar" + playerNum;
  var wpmId = "rp" + playerNum + "-wpm";
  var accId = "rp" + playerNum + "-acc";
  var pctId = "rp" + playerNum + "-pct";

  var barPct = Math.min(pct / RACE.text.length * 100, 93);
  document.getElementById(barId).style.width = barPct + "%";
  updateCarPosition(carId, barPct);
  document.getElementById(wpmId).textContent = wpm > 0 ? wpm : "—";
  document.getElementById(accId).textContent = acc > 0 ? acc + "%" : "—";
  document.getElementById(pctId).textContent = Math.round(barPct) + "%";
}

// Start AI Bot car movement
function startAIBot(){
  var botCharsPerSec = (RACE.botSpeed * 5) / 60;
  var botIdx = 0;
  var botT0 = performance.now();
  var totalChars = RACE.text.length;

  RACE.botInterval = setInterval(function(){
    if(RACE.done) { clearInterval(RACE.botInterval); return; }
    var el = (performance.now() - botT0) / 1000;
    botIdx = Math.min(totalChars, Math.floor(el * botCharsPerSec));
    var pct = Math.min(botIdx / totalChars * 100, 93);

    document.getElementById("rbar2").style.width = pct + "%";
    updateCarPosition("rcar2", pct);
    document.getElementById("rp2-wpm").textContent = RACE.botSpeed;
    document.getElementById("rp2-acc").textContent = "98%";
    document.getElementById("rp2-pct").textContent = Math.round(pct) + "%";

    if(botIdx >= totalChars){
      clearInterval(RACE.botInterval);
      document.getElementById("rbar2").style.width = "100%";
      updateCarPosition("rcar2", 100);
      document.getElementById("rp2-pct").textContent = "100%";
      document.getElementById("rp2-hint").textContent = "🏁 وصل الروبوت!";
      RACE.p2.fin = true;
      RACE.p2.finTime = Math.round(el * 10) / 10;
      RACE.p2.wpm = RACE.botSpeed;
      RACE.p2.acc = 98;
      if(RACE.p1.fin) showRaceResult();
    }
  }, 100);
}

// Start Player 1 Ghost Replay during Player 2's turn
function startGhostReplay(){
  var t0 = performance.now();
  var timeline = RACE.ghostTimeline;
  if(!timeline || !timeline.length) return;

  var currentTlIdx = 0;
  RACE.ghostInterval = setInterval(function(){
    if(RACE.done) { clearInterval(RACE.ghostInterval); return; }
    var el = performance.now() - t0;

    while(currentTlIdx < timeline.length - 1 && timeline[currentTlIdx + 1].t <= el){
      currentTlIdx++;
    }
    var pt = timeline[currentTlIdx];
    if(pt){
      var barPct = Math.min(pt.idx / RACE.text.length * 100, 93);
      document.getElementById("rbar1").style.width = barPct + "%";
      updateCarPosition("rcar1", barPct);
      document.getElementById("rp1-wpm").textContent = pt.wpm;
      document.getElementById("rp1-acc").textContent = pt.acc + "%";
      document.getElementById("rp1-pct").textContent = Math.round(barPct) + "%";
    }

    if(currentTlIdx >= timeline.length - 1){
      clearInterval(RACE.ghostInterval);
      document.getElementById("rbar1").style.width = "100%";
      updateCarPosition("rcar1", 100);
      document.getElementById("rp1-pct").textContent = "100%";
    }
  }, 100);
}

function handleRaceKey(e){
  if(RACE.done) return;
  var isAr = (S.lang === "ar");

  // Determine current active player
  var curPlayer = (RACE.modeType === "ghost" && RACE.turn === 2) ? RACE.p2 : RACE.p1;
  var curPlayerNum = (RACE.modeType === "ghost" && RACE.turn === 2) ? 2 : 1;

  if(curPlayer.fin) return;

  if(e.key === "Backspace"){
    e.preventDefault();
    if(curPlayer.idx > 0){
      curPlayer.idx--;
      RACE.ch[curPlayer.idx].s = "now";
      if(curPlayer.idx + 1 < RACE.ch.length) RACE.ch[curPlayer.idx + 1].s = "w";
      renderRaceWords();
      playCorrectSound(false);
    }
    return;
  }

  if(e.key.length !== 1) return;
  var ex = RACE.text[curPlayer.idx];
  if(!ex) return;

  var ok = matchChar(e.key, ex);

  // Player starts typing
  if(!curPlayer.on){
    curPlayer.on = true;
    curPlayer.t0 = performance.now();

    if(!RACE.started){
      RACE.started = true;
      startRaceTimer();
    }

    if(RACE.modeType === "bot"){
      startAIBot();
      document.getElementById("rp1-hint").textContent = isAr ? "تكتب الآن..." : "Typing now...";
    } else {
      if(RACE.turn === 1){
        document.getElementById("rp1-hint").textContent = isAr ? "تسجيل الجولة 1..." : "Recording P1...";
      } else {
        document.getElementById("rp2-hint").textContent = isAr ? "تتحدى الشبح الآن!" : "Challenging Ghost!";
        startGhostReplay();
      }
    }
  }

  curPlayer.ks.push({ ch: e.key, ex: ex, ok: ok });
  RACE.ch[curPlayer.idx].s = ok ? "ok" : "bad";
  curPlayer.idx++;
  if(curPlayer.idx < RACE.ch.length) RACE.ch[curPlayer.idx].s = "now";

  if(ok) playCorrectSound(ex === " "); else playErrorSound();

  var stats = calcRaceStats(curPlayer);
  updateRaceUI(curPlayerNum, curPlayer.idx, stats.wpm, stats.acc);

  // If Player 1 in ghost mode, record point to ghost timeline
  if(RACE.modeType === "ghost" && RACE.turn === 1){
    RACE.ghostTimeline.push({
      t: performance.now() - curPlayer.t0,
      idx: curPlayer.idx,
      wpm: stats.wpm,
      acc: stats.acc
    });
  }

  renderRaceWords();

  // Check finish
  if(curPlayer.idx >= RACE.text.length){
    finishPlayerRun(curPlayerNum, curPlayer);
  }
}

function finishPlayerRun(playerNum, player){
  player.fin = true;
  var isAr = (S.lang === "ar");
  var el = (performance.now() - player.t0) / 1000;
  player.finTime = Math.round(el * 10) / 10;
  var cor = 0;
  for(var i = 0; i < player.ks.length; i++) if(player.ks[i].ok) cor++;
  player.wpm = calcWPM(cor, el * 1000);
  player.acc = calcAcc(cor, player.ks.length);

  document.getElementById("rbar" + playerNum).style.width = "100%";
  updateCarPosition("rcar" + playerNum, 100);
  document.getElementById("rp" + playerNum + "-pct").textContent = "100%";
  document.getElementById("rp" + playerNum + "-hint").textContent = "🏁 " + (isAr ? "انتهى!" : "Finished!");
  playCorrectSound(true);

  if(RACE.modeType === "bot"){
    showRaceResult();
  } else if(RACE.modeType === "ghost"){
    if(RACE.turn === 1){
      // Transition to Player 2
      RACE.turn = 2;
      startRaceCountdown(function(){
        // Reset text for Player 2
        RACE.ch = [];
        for(var i = 0; i < RACE.text.length; i++) RACE.ch.push({ c: RACE.text[i], s: i === 0 ? "now" : "w" });
        renderRaceWords();

        // Reset track 1 back to 0 for replay
        document.getElementById("rbar1").style.width = "0%";
        updateCarPosition("rcar1", 0);
        document.getElementById("rp1-pct").textContent = "0%";
        document.getElementById("rp1-hint").textContent = isAr ? "سيارة الشبح جاهزة" : "Ghost car ready";

        // Card banner for Player 2
        document.getElementById("r-main-card").className = "race-main-card glow-p2";
        document.getElementById("r-turn-ico").textContent = "🔵";
        document.getElementById("r-turn-txt").textContent = isAr ?
          ("الجولة 2: دور اللاعب 2 — انطلق وتغلب على شبح اللاعب 1 (" + RACE.p1.wpm + " WPM)!") :
          ("Round 2: Player 2 Turn — Beat Player 1 Ghost (" + RACE.p1.wpm + " WPM)!");
        document.getElementById("r-turn-sub").textContent = isAr ? "انطلق فوراً بالطباعة" : "Start typing to race";

        document.getElementById("r-inp").value = "";
        document.getElementById("r-inp").focus();
      });
    } else {
      // Both done
      showRaceResult();
    }
  }
}

function showRaceResult(){
  if(RACE.timerInterval) clearInterval(RACE.timerInterval);
  if(RACE.ghostInterval) clearInterval(RACE.ghostInterval);
  if(RACE.botInterval) clearInterval(RACE.botInterval);
  RACE.done = true;

  var isAr = (S.lang === "ar");
  var p1Wins = false;

  if(RACE.modeType === "bot"){
    p1Wins = RACE.p1.fin && (!RACE.p2.fin || RACE.p1.finTime <= RACE.p2.finTime);
  } else {
    p1Wins = RACE.p1.finTime <= RACE.p2.finTime;
    if(!RACE.p1.fin) p1Wins = false;
    if(!RACE.p2.fin) p1Wins = true;
  }

  var winnerName = "";
  if(RACE.modeType === "bot"){
    winnerName = p1Wins ? (isAr ? "أنت (الإنسان)" : "You (Human)") : (isAr ? "الروبوت الذكي 🤖" : "AI Bot 🤖");
  } else {
    winnerName = p1Wins ? (isAr ? "اللاعب 1" : "Player 1") : (isAr ? "اللاعب 2" : "Player 2");
  }

  document.getElementById("race-winner-badge").textContent = p1Wins ? "🥇" : "🏆";
  document.getElementById("race-winner-title").textContent = winnerName + (isAr ? " يفوز بالسباق!" : " Wins the Race!");
  document.getElementById("race-winner-sub").textContent = isAr ? "انتهى التحدي — منصة التتويج والنتائج" : "Challenge Complete — Final Podium";

  var pod1 = document.getElementById("race-pod1");
  var pod2 = document.getElementById("race-pod2");

  if(p1Wins){
    pod1.className = "race-podium-card gold";
    pod2.className = "race-podium-card silver";
    pod1.querySelector(".race-podium-medal").textContent = "🥇";
    pod2.querySelector(".race-podium-medal").textContent = "🥈";
  } else {
    pod1.className = "race-podium-card silver";
    pod2.className = "race-podium-card gold";
    pod1.querySelector(".race-podium-medal").textContent = "🥈";
    pod2.querySelector(".race-podium-medal").textContent = "🥇";
  }

  var p1Label = (RACE.modeType === "bot") ? (isAr ? "أنت" : "You") : (isAr ? "اللاعب 1" : "Player 1");
  var p2Label = (RACE.modeType === "bot") ? (isAr ? "الروبوت" : "AI Bot") : (isAr ? "اللاعب 2" : "Player 2");

  document.getElementById("race-pod1-name").textContent = p1Label;
  document.getElementById("race-pod1-wpm").textContent = RACE.p1.fin ? RACE.p1.wpm : "—";
  document.getElementById("race-pod1-acc").textContent = RACE.p1.fin ? RACE.p1.acc + "%" : "—";
  document.getElementById("race-pod1-time").textContent = RACE.p1.fin ? RACE.p1.finTime + "s" : "DNF";

  document.getElementById("race-pod2-name").textContent = p2Label;
  document.getElementById("race-pod2-wpm").textContent = RACE.p2.fin ? RACE.p2.wpm : "—";
  document.getElementById("race-pod2-acc").textContent = RACE.p2.fin ? RACE.p2.acc + "%" : "—";
  document.getElementById("race-pod2-time").textContent = RACE.p2.fin ? RACE.p2.finTime + "s" : "DNF";

  document.getElementById("race-result").className = "show";

  // Toast
  var toastEl = document.createElement("div");
  toastEl.className = "toast2";
  var winWpm = p1Wins ? RACE.p1.wpm : RACE.p2.wpm;
  toastEl.innerHTML = "<span style='font-size:28px'>🏆</span><div><div style='font-size:11px;color:var(--accent);text-transform:uppercase'>" + (isAr ? "مبروك الفوز!" : "Race Winner!") + "</div><div style='font-size:14px;font-weight:600'>" + winnerName + " (" + winWpm + " WPM)</div></div>";
  document.getElementById("toasts").appendChild(toastEl);
  setTimeout(function(){ toastEl.style.opacity="0"; toastEl.style.transition="opacity .4s"; setTimeout(function(){ toastEl.remove(); }, 400); }, 5000);
}

function startRaceCountdown(cb){
  var cd = document.getElementById("race-countdown");
  var display = document.getElementById("race-cd-display");
  cd.className = "";
  var n = 3;
  display.className = "cd-number";
  display.textContent = n;

  var interval = setInterval(function(){
    n--;
    if(n > 0){
      display.textContent = n;
      display.className = "";
      void display.offsetWidth;
      display.className = "cd-number";
    } else if(n === 0){
      display.textContent = "GO!";
      display.className = "";
      void display.offsetWidth;
      display.className = "cd-go";
    } else {
      clearInterval(interval);
      cd.className = "hidden";
      if(cb) cb();
    }
  }, 750);
}

// Global Race keydown listener
document.addEventListener("keydown", function(e){
  if(e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) return;
  var omModal = document.getElementById('online-modal');
  if(omModal && omModal.classList.contains('show')) return;

  var racePage = document.getElementById("p-race");
  if(!racePage || racePage.className.indexOf("show") < 0) return;
  if(RACE.done) return;

  if(e.key === "Tab" && !e.ctrlKey){
    e.preventDefault();
    initRace();
    return;
  }
  if(e.key === "Escape"){
    e.preventDefault();
    initRace();
    return;
  }

  handleRaceKey(e);
});

// Initialize state and app
var sv = gS();
if(sv.lang) S.lang = sv.lang;
if(sv.dur) S.dur = sv.dur;
if(sv.mode) S.mode = sv.mode;

if(sv.lang === "ar"){
  document.getElementById("l-en").className = "pb";
  document.getElementById("l-ar").className = "pb on";
  document.documentElement.lang = "ar";
  document.documentElement.dir = "rtl";
} else {
  document.getElementById("l-en").className = "pb on";
  document.getElementById("l-ar").className = "pb";
  document.documentElement.lang = "en";
  document.documentElement.dir = "ltr";
}
if(sv.dur){
  document.getElementById("d-15").className = "pb" + (sv.dur === 15 ? " on" : "");
  document.getElementById("d-30").className = "pb" + (sv.dur === 30 ? " on" : "");
  document.getElementById("d-60").className = "pb" + (sv.dur === 60 ? " on" : "");
}
if(sv.mode) document.getElementById("msel").value = sv.mode;

updateUILanguage(S.lang);
buildKeyboard();
initTest();

// ══════════════════════════════════════════════════════════════
// ONLINE RACE MODULE  (Socket.io)
// ══════════════════════════════════════════════════════════════
var OM = {
  socket: null,
  roomCode: null,
  myId: null,
  myName: '',
  isHost: false,
  oppName: '',
  oppId: null,
  raceText: '',
  raceDuration: 30,
  raceStartTime: null,
  raceTimer: null,
  progressInterval: null,
  // Typing state
  omIdx: 0,
  omErrors: 0,
  omTotalTyped: 0,
  omDone: false,
  omChars: []
};

// ── Duration selector ─────────────────────────────────────────
function omSelectDuration(dur) {
  OM.raceDuration = parseInt(dur);
  document.querySelectorAll('#om-panel-create .om-dur-pill').forEach(function(b) {
    b.classList.toggle('on', parseInt(b.dataset.dur) === OM.raceDuration);
  });
}

function omChangeLobbyDuration(dur) {
  if (!OM.isHost) return;
  OM.raceDuration = parseInt(dur);
  document.querySelectorAll('#om-dur-pills-lobby .om-dur-pill').forEach(function(b) {
    b.classList.toggle('on', parseInt(b.dataset.dur) === OM.raceDuration);
  });
  if (OM.socket && OM.roomCode) {
    OM.socket.emit('set_duration', { code: OM.roomCode, duration: OM.raceDuration });
  }
}

// ── Server URL Configuration ──────────────────────────────────
// Automatically determine server URL:
// 1. If custom URL stored in localStorage, use it
// 2. If running locally (localhost, 127.0.0.1, or file://), connect to http://localhost:3001
// 3. If in production (deployed on Render, Railway, etc.), connect to window.location.origin
var OM_SERVER_URL = (function() {
  if (typeof window !== 'undefined' && window.location) {
    var host = (window.location.hostname || '').toLowerCase();
    var proto = window.location.protocol || '';
    if (proto === 'file:' || host === 'localhost' || host === '127.0.0.1' || host === '') {
      return 'http://localhost:3001';
    }
    return window.location.origin;
  }
  return 'http://localhost:3001';
})();

function omGetServerUrl() {
  var custom = localStorage.getItem('tm_server_url');
  if (custom && custom.trim()) return custom.trim().replace(/\/$/, '');
  return OM_SERVER_URL;
}

function omToggleSettings() {
  var d = document.getElementById('om-settings-drawer');
  if (!d) return;
  var isHidden = d.style.display === 'none' || !d.style.display;
  d.style.display = isHidden ? 'block' : 'none';
  if (isHidden) {
    var inp = document.getElementById('om-custom-srv-inp');
    if (inp) inp.value = localStorage.getItem('tm_server_url') || '';
  }
}

function omSaveCustomServer() {
  var inp = document.getElementById('om-custom-srv-inp');
  var val = (inp ? inp.value.trim() : '').replace(/\/$/, '');
  if (val) {
    localStorage.setItem('tm_server_url', val);
  } else {
    localStorage.removeItem('tm_server_url');
  }
  var d = document.getElementById('om-settings-drawer');
  if (d) d.style.display = 'none';
  omShowToast(S.lang === 'ar' ? 'تم حفظ إعدادات الخادم' : 'Server settings saved');
  if (OM.socket) {
    OM.socket.disconnect();
  }
  omConnect();
}

// ── Status dot indicator ──────────────────────────────────────
function omSetConnStatus(state, msg) {
  var dot = document.getElementById('om-conn-dot');
  var nOnline = document.getElementById('n-online');
  if (!dot) return;
  if (state === 'connected') {
    dot.style.background = '#10b981';
    dot.style.boxShadow = '0 0 8px rgba(16,185,129,0.8)';
    dot.title = S.lang === 'ar' ? 'متصل بالخادم' : 'Connected to server';
    if (nOnline) nOnline.classList.add('connected');
  } else if (state === 'connecting') {
    dot.style.background = '#f59e0b';
    dot.style.boxShadow = '0 0 6px rgba(245,158,11,0.6)';
    dot.title = S.lang === 'ar' ? 'جارِ الاتصال...' : 'Connecting...';
  } else if (state === 'err') {
    dot.style.background = '#ef4444';
    dot.style.boxShadow = '0 0 6px rgba(239,68,68,0.6)';
    dot.title = msg || (S.lang === 'ar' ? 'غير متصل بالخادم' : 'Disconnected');
    if (nOnline) nOnline.classList.remove('connected');
  } else {
    dot.style.background = '#4b5563';
    dot.style.boxShadow = 'none';
    dot.title = S.lang === 'ar' ? 'غير متصل' : 'Disconnected';
    if (nOnline) nOnline.classList.remove('connected');
  }
}

// ── Socket.io CDN loader ──────────────────────────────────────
function loadSocketIO(cb) {
  if (typeof io !== 'undefined') { cb(); return; }
  var s = document.createElement('script');
  s.src = 'https://cdn.socket.io/4.7.5/socket.io.min.js';
  s.onload = cb;
  s.onerror = function() {
    omSetConnStatus('err', 'Failed to load socket client');
  };
  document.head.appendChild(s);
}

// ── Modal control ─────────────────────────────────────────────
function openOnlineRace() {
  document.getElementById('online-modal').classList.add('show');
  var errEl = document.getElementById('om-err');
  if (errEl) errEl.textContent = '';
  omShowScreen('setup');
  // Auto connect quietly in the background
  if (!OM.socket || !OM.socket.connected) {
    omConnect();
  }
}
function closeOnlineRace() {
  document.getElementById('online-modal').classList.remove('show');
}
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeOnlineRace();
});
var _onlineModalEl = document.getElementById('online-modal');
if (_onlineModalEl) {
  _onlineModalEl.addEventListener('click', function(e) {
    if (e.target === this) closeOnlineRace();
  });
}

// ── Screen management ─────────────────────────────────────────
function omShowScreen(name) {
  document.querySelectorAll('.om-screen').forEach(function(s) { s.classList.remove('active'); });
  var target = document.getElementById('om-screen-' + name);
  if (target) target.classList.add('active');
}

// ── Tab switch (create / join) ────────────────────────────────
function omSwitchTab(t) {
  var isCreate = t === 'create';
  document.getElementById('om-tab-create').classList.toggle('on', isCreate);
  document.getElementById('om-tab-join').classList.toggle('on', !isCreate);
  document.getElementById('om-panel-create').style.display = isCreate ? '' : 'none';
  document.getElementById('om-panel-join').style.display = isCreate ? 'none' : '';
  document.getElementById('om-err').textContent = '';
}

// ── Connect to server ─────────────────────────────────────────
var _omEventsBound = false;
function omConnect(cb) {
  if (OM.socket && OM.socket.connected) {
    omSetConnStatus('connected');
    if (cb) cb();
    return;
  }

  var url = omGetServerUrl();
  omSetConnStatus('connecting');

  loadSocketIO(function() {
    if (OM.socket) {
      if (OM.socket.connected) {
        omSetConnStatus('connected');
        if (cb) cb();
        return;
      }
      OM.socket.disconnect();
    }

    try {
      OM.socket = io(url, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnectionAttempts: 5
      });
    } catch(e) {
      omSetConnStatus('err', e.message);
      if (cb) {
        var errEl = document.getElementById('om-err');
        if (errEl) errEl.textContent = S.lang === 'ar' ? 'تعذر الاتصال بالخادم' : 'Failed to connect to server';
      }
      return;
    }

    OM.socket.on('connect', function() {
      OM.myId = OM.socket.id;
      omSetConnStatus('connected');
      var errEl = document.getElementById('om-err');
      if (errEl && errEl.dataset.isConnWait) {
        errEl.textContent = '';
        delete errEl.dataset.isConnWait;
      }
      if (cb) cb();
    });

    OM.socket.on('connect_error', function() {
      omSetConnStatus('err');
      var errEl = document.getElementById('om-err');
      if (errEl && errEl.dataset.isConnWait) {
        errEl.textContent = S.lang === 'ar' ? 'تعذر الاتصال بالخادم. يرجى التأكد من تشغيل الخادم' : 'Could not connect to server. Please ensure server is running.';
      }
    });

    OM.socket.on('disconnect', function() {
      omSetConnStatus('disconnected');
    });

    // Register server events
    if (!_omEventsBound) {
      _omEventsBound = true;
      OM.socket.on('room_created', function(d) {
        OM.roomCode = d.code;
        OM.isHost = true;
        omShowLobby(d.roomState);
      });
      OM.socket.on('room_joined', function(d) {
        OM.roomCode = d.code;
        OM.isHost = false;
        omShowLobby(d.roomState);
      });
      OM.socket.on('join_error', function(d) {
        var msgs = {
          room_not_found: S.lang === 'ar' ? 'الغرفة غير موجودة، تأكد من الرمز' : 'Room not found, check the code',
          race_already_started: S.lang === 'ar' ? 'السباق بدأ بالفعل' : 'Race already started',
          room_full: S.lang === 'ar' ? 'الغرفة ممتلئة' : 'Room is full',
          already_in_room: S.lang === 'ar' ? 'أنت بالفعل في غرفة' : 'Already in a room'
        };
        var errEl = document.getElementById('om-err');
        if (errEl) errEl.textContent = msgs[d.message] || d.message;
      });
      OM.socket.on('room_state', function(d) {
        omUpdateLobby(d);
      });
      OM.socket.on('player_left', function(d) {
        if (d.newHostId === OM.myId) OM.isHost = true;
        omUpdateLobby({ players: [], hostId: OM.myId, state: 'waiting', code: OM.roomCode });
        omShowToast(S.lang === 'ar' ? (d.name + ' غادر السباق') : (d.name + ' left the race'));
      });
      OM.socket.on('countdown_start', function(d) {
        OM.raceText = d.text;
        if (typeof d.duration !== 'undefined') OM.raceDuration = parseInt(d.duration);
        if (d.lang) OM.raceLang = d.lang;
        omShowScreen('countdown');
      });
      OM.socket.on('countdown_tick', function(d) {
        var el = document.getElementById('om-cd-num');
        if (!el) return;
        if (d.count > 0) {
          el.textContent = d.count;
          el.style.color = '#38bdf8';
        } else {
          el.textContent = 'GO!';
          el.style.color = '#4ade80';
          el.style.textShadow = '0 0 40px rgba(74,222,128,0.7)';
        }
      });
      OM.socket.on('race_go', function(d) {
        OM.raceStartTime = d.startTime;
        if (typeof d.duration !== 'undefined') OM.raceDuration = parseInt(d.duration);
        if (d.lang) OM.raceLang = d.lang;
        omStartRaceScreen();
      });
      OM.socket.on('opponent_progress', function(d) {
        var fill = document.getElementById('om-opp-fill');
        var badge = document.getElementById('om-opp-wpm-badge');
        var pct = document.getElementById('om-opp-pct-badge');
        if (fill) fill.style.width = d.progress + '%';
        if (badge) badge.textContent = d.wpm + ' WPM';
        if (pct) pct.textContent = d.progress + '%';
      });
      OM.socket.on('opponent_finished', function(d) {
        var oppName = d.name || OM.oppName || (S.lang === 'ar' ? 'المنافس' : 'Opponent');
        omShowToast(oppName + (S.lang === 'ar' ? ' أنهى السباق! ' : ' finished! ') + d.wpm + ' WPM 🎉');
      });
      OM.socket.on('race_grace_period', function(d) {
        var alertEl = document.getElementById('om-grace-alert');
        if (alertEl) {
          alertEl.style.display = 'block';
          alertEl.textContent = S.lang === 'ar' ?
            ('⚠️ المنافس (' + (d.finisher || 'الخصم') + ') وصل لخط النهاية! متبقي 5 ثوانٍ لإنهاء ما تستطيع!') :
            ('⚠️ Opponent (' + (d.finisher || 'Opponent') + ') finished! 5s remaining!');
        }
      });
      OM.socket.on('room_reset_lobby', function(d) {
        omShowLobby(d.roomState);
        var alertEl = document.getElementById('om-grace-alert');
        if (alertEl) alertEl.style.display = 'none';
        document.getElementById('om-my-fill').style.width = '0%';
        document.getElementById('om-my-pct-badge').textContent = '0%';
        document.getElementById('om-my-wpm-badge').textContent = '0 WPM';
        document.getElementById('om-opp-fill').style.width = '0%';
        document.getElementById('om-opp-pct-badge').textContent = '0%';
        document.getElementById('om-opp-wpm-badge').textContent = '0 WPM';
        omShowToast(S.lang === 'ar' ? 'تمت العودة للغرفة لسباق جديد! 🏁' : 'Returned to lobby for a rematch! 🏁');
      });
      OM.socket.on('race_results', function(d) {
        omShowResults(d);
      });
      OM.socket.on('error_msg', function(d) {
        omShowToast(d.message, true);
      });
    }
  });
}

// ── Create room ───────────────────────────────────────────────
function omCreateRoom() {
  var errEl = document.getElementById('om-err');
  if (errEl) errEl.textContent = '';
  OM.myName = document.getElementById('om-name-c').value.trim() || (S.lang === 'ar' ? 'لاعب 1' : 'Player 1');
  
  if (!OM.socket || !OM.socket.connected) {
    if (errEl) {
      errEl.textContent = S.lang === 'ar' ? 'جارِ الاتصال بالخادم...' : 'Connecting to server...';
      errEl.dataset.isConnWait = '1';
    }
    omConnect(function() {
      OM.socket.emit('create_room', { name: OM.myName, lang: S.lang, duration: OM.raceDuration });
    });
  } else {
    OM.socket.emit('create_room', { name: OM.myName, lang: S.lang, duration: OM.raceDuration });
  }
}

// ── Join room ─────────────────────────────────────────────────
function omJoinRoom() {
  var errEl = document.getElementById('om-err');
  if (errEl) errEl.textContent = '';
  var code = document.getElementById('om-code-inp').value.trim().toUpperCase();
  if (code.length !== 4) {
    if (errEl) errEl.textContent = S.lang === 'ar' ? 'الرمز يجب أن يكون 4 أحرف' : 'Code must be 4 characters';
    return;
  }
  OM.myName = document.getElementById('om-name-j').value.trim() || (S.lang === 'ar' ? 'لاعب 2' : 'Player 2');

  if (!OM.socket || !OM.socket.connected) {
    if (errEl) {
      errEl.textContent = S.lang === 'ar' ? 'جارِ الاتصال بالخادم...' : 'Connecting to server...';
      errEl.dataset.isConnWait = '1';
    }
    omConnect(function() {
      OM.socket.emit('join_room', { code: code, name: OM.myName });
    });
  } else {
    OM.socket.emit('join_room', { code: code, name: OM.myName });
  }
}

// ── Show lobby ────────────────────────────────────────────────
function omShowLobby(state) {
  omShowScreen('lobby');
  document.getElementById('om-lobby-code-display').textContent = OM.roomCode;
  omUpdateLobby(state);
}

function omUpdateLobby(state) {
  var players = state.players || [];
  var myData = null, oppData = null;
  players.forEach(function(p) {
    if (p.id === OM.myId || (OM.myId === null && p.isHost)) myData = p;
    else oppData = p;
  });
  if (!myData && players.length > 0) myData = players[0];
  if (players.length > 1 && !oppData) oppData = players[1];

  // Update my slot
  if (myData) {
    document.getElementById('om-pname-p1').textContent = myData.name;
    document.getElementById('om-prole-p1').textContent = myData.isHost ? (S.lang === 'ar' ? 'المضيف 👑' : 'Host 👑') : (S.lang === 'ar' ? 'لاعب' : 'Player');
  }

  // Update opponent slot
  var slot2 = document.getElementById('om-slot-p2');
  var av2 = document.getElementById('om-av-p2');
  if (oppData) {
    OM.oppName = oppData.name;
    OM.oppId = oppData.id;
    document.getElementById('om-pname-p2').textContent = oppData.name;
    document.getElementById('om-prole-p2').textContent = oppData.isHost ? (S.lang === 'ar' ? 'المضيف 👑' : 'Host 👑') : (S.lang === 'ar' ? 'لاعب' : 'Player');
    slot2.className = 'om-player-slot filled p2';
    av2.className = 'om-player-avatar om-pa-p2';
    av2.textContent = '2';
    document.getElementById('om-waiting-pulse').style.display = 'none';
    // Show start button only for host
    if (OM.isHost) {
      document.getElementById('om-start-btn').style.display = '';
    }
  } else {
    document.getElementById('om-pname-p2').textContent = S.lang === 'ar' ? 'في انتظار المنافس...' : 'Waiting for opponent...';
    document.getElementById('om-prole-p2').textContent = '—';
    slot2.className = 'om-player-slot';
    av2.className = 'om-player-avatar om-pa-empty';
    av2.textContent = '?';
    document.getElementById('om-waiting-pulse').style.display = '';
    document.getElementById('om-start-btn').style.display = 'none';
  }

  // Sync duration pills in lobby
  if (typeof state.duration !== 'undefined') {
    OM.raceDuration = parseInt(state.duration);
    document.querySelectorAll('#om-dur-pills-lobby .om-dur-pill').forEach(function(b) {
      b.classList.toggle('on', parseInt(b.dataset.dur) === OM.raceDuration);
    });
  }

  // Update name labels in race screen
  document.getElementById('om-my-name-lbl').textContent = OM.myName;
  document.getElementById('om-opp-name-lbl').textContent = OM.oppName || (S.lang === 'ar' ? 'المنافس' : 'Opponent');
}

// ── Start race (host only) ────────────────────────────────────
function omStartRace() {
  if (!OM.socket || !OM.roomCode) return;
  OM.socket.emit('start_race', { code: OM.roomCode });
}

// ── Leave room ────────────────────────────────────────────────
function omLeaveRoom() {
  if (OM.socket && OM.roomCode) {
    OM.socket.emit('leave_room', { code: OM.roomCode });
  }
  OM.roomCode = null;
  OM.isHost = false;
  omShowScreen('setup');
}

// ── Copy code to clipboard ────────────────────────────────────
function omCopyCode() {
  navigator.clipboard.writeText(OM.roomCode).then(function() {
    var btn = document.getElementById('om-copy-btn');
    var lbl = document.getElementById('om-copy-lbl');
    lbl.textContent = S.lang === 'ar' ? 'تم النسخ! ✓' : 'Copied! ✓';
    btn.style.background = 'rgba(74,222,128,0.2)';
    btn.style.borderColor = 'rgba(74,222,128,0.5)';
    btn.style.color = '#4ade80';
    setTimeout(function() {
      lbl.textContent = S.lang === 'ar' ? 'نسخ الرمز' : 'Copy code';
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.style.color = '';
    }, 2000);
  });
}

// ── Auto scroll active word ───────────────────────────────────
function omScrollToActive() {
  var el = OM.omChars[OM.omIdx];
  var box = document.getElementById('om-words');
  if (!el || !box) return;
  var top = el.offsetTop - box.offsetTop;
  if (top > 70) {
    box.scrollTop = top - 45;
  } else {
    box.scrollTop = 0;
  }
}

// ── Start race screen ─────────────────────────────────────────
function omStartRaceScreen() {
  omShowScreen('race');
  OM.omIdx = 0;
  OM.omErrors = 0;
  OM.omTotalTyped = 0;
  OM.omDone = false;

  // Reset tracks and badges
  document.getElementById('om-my-fill').style.width = '0%';
  document.getElementById('om-opp-fill').style.width = '0%';
  document.getElementById('om-my-wpm-badge').textContent = '0 WPM';
  document.getElementById('om-opp-wpm-badge').textContent = '0 WPM';
  document.getElementById('om-my-pct-badge').textContent = '0%';
  document.getElementById('om-opp-pct-badge').textContent = '0%';

  // Build text with robust Arabic font and RTL detection
  var isAr = (OM.raceLang === 'ar') || /[\u0600-\u06FF]/.test(OM.raceText) || (S.lang === 'ar');
  var wordsEl = document.getElementById('om-words');
  wordsEl.innerHTML = '';
  wordsEl.scrollTop = 0;
  if (isAr) {
    wordsEl.className = 'ar';
    wordsEl.setAttribute('dir', 'rtl');
    wordsEl.style.direction = 'rtl';
    wordsEl.style.textAlign = 'right';
    wordsEl.style.fontFamily = "var(--far), 'Cairo', sans-serif";
    wordsEl.style.letterSpacing = 'normal';
    wordsEl.style.wordSpacing = 'normal';
  } else {
    wordsEl.className = '';
    wordsEl.setAttribute('dir', 'ltr');
    wordsEl.style.direction = 'ltr';
    wordsEl.style.textAlign = 'left';
    wordsEl.style.fontFamily = "var(--fen), 'Roboto Mono', monospace";
  }
  OM.omChars = [];
  var words = OM.raceText.split(' ');
  words.forEach(function(word, wi) {
    var wDiv = document.createElement('span');
    wDiv.className = 'word';
    word.split('').forEach(function(ch) {
      var s = document.createElement('span');
      s.className = 'c';
      s.textContent = ch;
      OM.omChars.push(s);
      wDiv.appendChild(s);
    });
    if (wi < words.length - 1) {
      var sp = document.createElement('span');
      sp.className = 'c sp';
      sp.textContent = ' ';
      OM.omChars.push(sp);
      wDiv.appendChild(sp);
    }
    wordsEl.appendChild(wDiv);
  });
  if (OM.omChars.length > 0) OM.omChars[0].classList.add('now');

  // Focus input
  var inp = document.getElementById('om-inp');
  inp.value = '';
  inp.focus();

  // Race timer setup
  if (OM.raceTimer) clearInterval(OM.raceTimer);
  var timerEl = document.getElementById('om-race-timer');
  var timerLbl = document.getElementById('om-race-timer-lbl');

  if (OM.raceDuration > 0) {
    timerEl.textContent = OM.raceDuration;
    timerEl.className = 'om-big-timer';
    timerLbl.textContent = S.lang === 'ar' ? 'الوقت المتبقي' : 'Time Left';

    OM.raceTimer = setInterval(function() {
      var elapsed = Math.floor((Date.now() - OM.raceStartTime) / 1000);
      var remaining = Math.max(0, OM.raceDuration - elapsed);
      timerEl.textContent = remaining;

      if (remaining <= 5) {
        timerEl.className = 'om-big-timer danger';
      } else {
        timerEl.className = 'om-big-timer';
      }

      if (remaining <= 0) {
        clearInterval(OM.raceTimer);
        omTimeUp();
      }
    }, 500);
  } else {
    timerEl.textContent = '0s';
    timerEl.className = 'om-big-timer';
    timerLbl.textContent = S.lang === 'ar' ? 'الوقت' : 'Time';

    OM.raceTimer = setInterval(function() {
      var elapsed = Math.floor((Date.now() - OM.raceStartTime) / 1000);
      timerEl.textContent = elapsed + 's';
    }, 500);
  }

  // Progress sender interval (every 300ms)
  if (OM.progressInterval) clearInterval(OM.progressInterval);
  OM.progressInterval = setInterval(function() {
    if (OM.omDone) { clearInterval(OM.progressInterval); return; }
    var progress = OM.omChars.length > 0 ? Math.min(100, Math.round((OM.omIdx / OM.omChars.length) * 100)) : 0;
    var elapsed = (Date.now() - OM.raceStartTime) / 60000;
    var wpm = elapsed > 0 ? Math.round((OM.omTotalTyped / 5) / elapsed) : 0;
    var acc = OM.omTotalTyped > 0 ? Math.max(0, Math.round(((OM.omTotalTyped - OM.omErrors) / OM.omTotalTyped) * 100)) : 100;
    // Update my bar
    document.getElementById('om-my-fill').style.width = progress + '%';
    document.getElementById('om-my-pct-badge').textContent = progress + '%';
    document.getElementById('om-my-wpm-badge').textContent = wpm + ' WPM';
    // Emit to server
    OM.socket.emit('progress_update', { code: OM.roomCode, progress: progress, wpm: wpm, acc: acc });
  }, 300);
}

// ── Time up handler ───────────────────────────────────────────
function omTimeUp() {
  if (OM.omDone) return;
  OM.omDone = true;
  clearInterval(OM.raceTimer);
  clearInterval(OM.progressInterval);

  var elapsed = (Date.now() - OM.raceStartTime) / 60000;
  var wpm = elapsed > 0 ? Math.round((OM.omTotalTyped / 5) / elapsed) : 0;
  var acc = OM.omTotalTyped > 0 ? Math.max(0, Math.round(((OM.omTotalTyped - OM.omErrors) / OM.omTotalTyped) * 100)) : 100;
  var progress = OM.omChars.length > 0 ? Math.min(100, Math.round((OM.omIdx / OM.omChars.length) * 100)) : 0;

  OM.socket.emit('time_up', {
    code: OM.roomCode,
    wpm: wpm,
    acc: acc,
    progress: progress
  });
}

// ── Race finish handler ───────────────────────────────────────
function omRaceFinish() {
  if (OM.omDone) return;
  OM.omDone = true;
  clearInterval(OM.raceTimer);
  clearInterval(OM.progressInterval);

  var finTime = parseFloat(((Date.now() - OM.raceStartTime) / 1000).toFixed(1));
  var elapsed = finTime / 60;
  var wpm = elapsed > 0 ? Math.round((OM.omTotalTyped / 5) / elapsed) : 0;
  var acc = OM.omTotalTyped > 0 ? Math.max(0, Math.round(((OM.omTotalTyped - OM.omErrors) / OM.omTotalTyped) * 100)) : 100;

  document.getElementById('om-my-fill').style.width = '100%';
  document.getElementById('om-my-pct-badge').textContent = '100%';
  document.getElementById('om-my-wpm-badge').textContent = wpm + ' WPM';

  OM.socket.emit('race_finished', { code: OM.roomCode, wpm: wpm, acc: acc, finTime: finTime });
}

// ── Online race global keydown listener (Backspace & Typing) ──
window.addEventListener('keydown', function(e) {
  if(e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) return;
  var raceScreen = document.getElementById('om-screen-race');
  if (!raceScreen || !raceScreen.classList.contains('active')) return;
  if (OM.omDone || !OM.raceText) return;

  // Handle Backspace
  if (e.key === 'Backspace') {
    e.preventDefault();
    if (OM.omIdx > 0) {
      if (OM.omIdx < OM.omChars.length) {
        OM.omChars[OM.omIdx].classList.remove('now');
      }
      OM.omIdx--;
      var prev = OM.omChars[OM.omIdx];
      if (prev.classList.contains('bad')) {
        OM.omErrors = Math.max(0, OM.omErrors - 1);
      }
      prev.className = 'c now' + (prev.classList.contains('sp') ? ' sp' : '');
      omScrollToActive();
    }
    return;
  }

  // Handle standard typing characters
  if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
    e.preventDefault();
    var expected = OM.omChars[OM.omIdx];
    if (!expected) return;

    OM.omTotalTyped++;
    var charTyped = e.key;
    var expectedChar = expected.textContent;

    if (charTyped === expectedChar) {
      expected.className = 'c ok' + (expected.classList.contains('sp') ? ' sp' : '');
    } else {
      expected.className = 'c bad' + (expected.classList.contains('sp') ? ' sp' : '');
      OM.omErrors++;
    }

    OM.omIdx++;
    if (OM.omIdx < OM.omChars.length) {
      OM.omChars[OM.omIdx].classList.add('now');
      omScrollToActive();
    } else {
      omRaceFinish();
    }
  }
});

// ── Canvas Confetti Particle System ───────────────────────────
var _omConfettiAnimId = null;
function launchVictoryConfetti() {
  var canvas = document.getElementById('om-confetti-canvas');
  if (!canvas) return;
  var parent = canvas.parentElement;
  canvas.width = parent.clientWidth || 800;
  canvas.height = parent.clientHeight || 500;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (_omConfettiAnimId) cancelAnimationFrame(_omConfettiAnimId);

  var colors = ['#ffd700', '#f59e0b', '#38bdf8', '#22c55e', '#ec4899', '#a855f7', '#ffffff'];
  var particles = [];
  var total = 140;

  for (var i = 0; i < total; i++) {
    particles.push({
      x: canvas.width / 2 + (Math.random() * 200 - 100),
      y: canvas.height * 0.35 + (Math.random() * 60 - 30),
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() * -12) - 4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      opacity: 1,
      shape: Math.random() > 0.3 ? 'rect' : 'circle'
    });
  }

  var start = performance.now();
  function loop(now) {
    var elapsed = (now - start) / 1000;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var alive = 0;

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.vx *= 0.985;
      p.rot += p.vRot;

      if (elapsed > 2.5) {
        p.opacity -= 0.02;
      }

      if (p.opacity > 0 && p.y < canvas.height + 20) {
        alive++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    if (alive > 0 && elapsed < 4.5) {
      _omConfettiAnimId = requestAnimationFrame(loop);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  _omConfettiAnimId = requestAnimationFrame(loop);
}

// ── Web Audio Victory Sound Fanfare ───────────────────────────
function playVictoryFanfare(isWinner) {
  try {
    if (typeof _initAudio === 'function') _initAudio();
    if (!_actx) return;
    if (_actx.state === 'suspended') _actx.resume();

    var now = _actx.currentTime;
    if (isWinner) {
      // 4 triumphant fanfare chords: C5, E5, G5, C6
      var notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach(function(freq, idx) {
        var osc = _actx.createOscillator();
        var gain = _actx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.28, now + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + (idx === 3 ? 0.95 : 0.45));
        osc.connect(gain);
        gain.connect(_masterGain || _actx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.1);
      });
    } else {
      // 3 pleasant melody notes for good game
      var notes2 = [392.00, 523.25, 659.25];
      notes2.forEach(function(freq, idx) {
        var osc = _actx.createOscillator();
        var gain = _actx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.14);
        gain.gain.setValueAtTime(0, now + idx * 0.14);
        gain.gain.linearRampToValueAtTime(0.22, now + idx * 0.14 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.6);
        osc.connect(gain);
        gain.connect(_masterGain || _actx.destination);
        osc.start(now + idx * 0.14);
        osc.stop(now + idx * 0.14 + 0.75);
      });
    }
  } catch(e) {}
}

// ── Show results ──────────────────────────────────────────────
var _lastRaceResults = null;
function omShowResults(data) {
  clearInterval(OM.raceTimer);
  clearInterval(OM.progressInterval);
  OM.omDone = true;
  _lastRaceResults = data;

  var alertEl = document.getElementById('om-grace-alert');
  if (alertEl) alertEl.style.display = 'none';

  omShowScreen('results');
  var players = data.players || [];
  var winner = data.winner || players[0];
  var amIWinner = winner && winner.id === OM.myId;
  var isAr = S.lang === 'ar';

  // Champion banner & header
  var champPill = document.getElementById('om-champ-pill');
  var champNameEl = document.getElementById('om-champ-name');
  var champMsg = document.getElementById('om-champ-msg');

  if (winner) {
    var winnerIsMe = winner.id === OM.myId;
    if (champPill) {
      champPill.innerHTML = winnerIsMe ?
        (isAr ? '👑 أنت البطل الفائز • VICTORY! 👑' : '👑 YOU WON • VICTORY! 👑') :
        (isAr ? '👑 بطل السباق الفائز • CHAMPION 👑' : '👑 RACE CHAMPION 👑');
    }
    if (champNameEl) {
      champNameEl.textContent = winner.name + (winnerIsMe ? (isAr ? ' (أنت)' : ' (You)') : '');
    }
    if (champMsg) {
      champMsg.className = 'om-champ-submsg ' + (winnerIsMe ? 'win' : 'lose');
      champMsg.textContent = winnerIsMe ?
        (isAr ? '🎉 مبروك الفوز الساحق يا بطل! أداء استثنائي وتفوق في سرعة الطباعة!' : '🎉 Outstanding victory! Exceptional typing speed and accuracy!') :
        (isAr ? ('⚔️ منافسة بطولية نارية! فاز ' + winner.name + ' بالمركز الأول، حظاً أوفر في جولة الانتقام!') : ('⚔️ Epic match! ' + winner.name + ' took 1st place! Challenge them to a rematch!'));
    }
  }

  // Differential bar
  var diffBar = document.getElementById('om-diff-bar');
  var diffText = document.getElementById('om-diff-text');
  if (players.length >= 2) {
    var p1 = players[0];
    var p2 = players[1];
    var diffWpm = Math.abs((p1.wpm || 0) - (p2.wpm || 0));
    if (diffBar && diffText) {
      diffBar.style.display = 'flex';
      diffText.innerHTML = isAr ?
        ('فارق السرعة بين المتنافسين: <span class="om-diff-badge">+' + diffWpm + ' WPM</span> لصالح ' + p1.name) :
        ('Speed Differential: <span class="om-diff-badge">+' + diffWpm + ' WPM</span> for ' + p1.name);
    }
  } else if (diffBar) {
    diffBar.style.display = 'none';
  }

  // Build esports cards
  var podEl = document.getElementById('om-podium');
  podEl.innerHTML = '';
  players.forEach(function(p, i) {
    var isWinner = winner && p.id === winner.id;
    var isMe = p.id === OM.myId;
    var rankLabel = isWinner ? (isAr ? '🥇 المركز الأول' : '🥇 1st Place') : (isAr ? '🥈 المركز الثاني' : '🥈 2nd Place');
    var timeTxt = p.finTime ? (p.finTime + (isAr ? ' ثانية' : 's')) : (isAr ? 'انتهاء الوقت' : 'Time up');

    var card = document.createElement('div');
    card.className = 'om-podium-card ' + (isWinner ? 'winner' : 'loser');
    card.innerHTML =
      '<div class="om-pod-header">' +
        '<div class="om-pod-medal-badge">' + (isWinner ? '👑' : '🥈') + '</div>' +
        '<div class="om-pod-rank-lbl">' + rankLabel + '</div>' +
      '</div>' +
      '<div class="om-pod-avatar">' + (isWinner ? '🏆' : '⚡') + '</div>' +
      '<div class="om-pod-name">' +
        p.name + (isMe ? '<span class="you-badge">' + (isAr ? 'أنت' : 'You') + '</span>' : '') +
      '</div>' +
      '<div class="om-pod-big-wpm">' + (p.wpm || 0) + '</div>' +
      '<div class="om-pod-wpm-sub">WPM • ' + (isAr ? 'كلمة/دقيقة' : 'Words/Min') + '</div>' +
      '<div class="om-pod-stats-grid">' +
        '<div class="om-pod-s-item">' +
          '<div class="om-pod-s-val">' + (p.acc || 0) + '%</div>' +
          '<div class="om-pod-s-lbl">' + (isAr ? 'الدقة' : 'Accuracy') + '</div>' +
        '</div>' +
        '<div class="om-pod-s-item">' +
          '<div class="om-pod-s-val">' + (p.progress || 0) + '%</div>' +
          '<div class="om-pod-s-lbl">' + (isAr ? 'الإنجاز' : 'Progress') + '</div>' +
        '</div>' +
        '<div class="om-pod-s-item" style="grid-column:span 2;margin-top:2px">' +
          '<div class="om-pod-s-val" style="color:var(--sub)">' + timeTxt + '</div>' +
          '<div class="om-pod-s-lbl">' + (isAr ? 'الوقت المستغرق' : 'Elapsed Time') + '</div>' +
        '</div>' +
      '</div>';
    podEl.appendChild(card);
  });

  // Rematch button label based on host/guest
  var againBtn = document.getElementById('om-again-btn');
  var againLbl = document.getElementById('om-again-lbl');
  if (againBtn && againLbl) {
    againBtn.style.display = 'flex';
    againLbl.textContent = OM.isHost ?
      (isAr ? '🔄 سباق مجدداً (إعادة البدء)' : '🔄 Rematch (Start Lobby)') :
      (isAr ? '⚔️ طلب جولة ثانية (انتقام)' : '⚔️ Request Rematch');
  }

  // Trigger celebration effects
  launchVictoryConfetti();
  playVictoryFanfare(amIWinner);
}

// ── Rematch (Play Again) ──────────────────────────────────────
function omPlayAgain() {
  if (!OM.socket || !OM.roomCode) return;
  OM.socket.emit('play_again', { code: OM.roomCode });
}

// ── Share results summary ─────────────────────────────────────
function omShareResults() {
  if (!_lastRaceResults || !_lastRaceResults.players) return;
  var isAr = S.lang === 'ar';
  var winner = _lastRaceResults.winner;
  var myData = null;
  _lastRaceResults.players.forEach(function(p) { if (p.id === OM.myId) myData = p; });
  var me = myData || _lastRaceResults.players[0];

  var text = isAr ?
    ('🏁 نتيجة سباق TypeMaster:\n' +
     '👑 الفائز: ' + (winner ? winner.name : '—') + ' (' + (winner ? winner.wpm : 0) + ' WPM)\n' +
     '⚡ سرعتي: ' + (me ? me.wpm : 0) + ' WPM | الدقة: ' + (me ? me.acc : 100) + '%\n' +
     'تحداني الآن في TypeMaster!') :
    ('🏁 TypeMaster Race Result:\n' +
     '👑 Winner: ' + (winner ? winner.name : '—') + ' (' + (winner ? winner.wpm : 0) + ' WPM)\n' +
     '⚡ My Speed: ' + (me ? me.wpm : 0) + ' WPM | Accuracy: ' + (me ? me.acc : 100) + '%\n' +
     'Challenge me on TypeMaster!');

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function() {
      omShowToast(isAr ? 'تم نسخ ملخص النتيجة للحافظة! 📋' : 'Results copied to clipboard! 📋');
    });
  }
}

// ── Go back to setup ──────────────────────────────────────────
function omGoSetup() {
  if (OM.socket && OM.roomCode) {
    OM.socket.emit('leave_room', { code: OM.roomCode });
    OM.roomCode = null;
    OM.isHost = false;
  }
  omShowScreen('setup');
}

// ── Toast helper ──────────────────────────────────────────────
function omShowToast(msg, isErr) {
  var t = document.createElement('div');
  t.className = 'toast2';
  t.style.borderColor = isErr ? 'var(--err)' : 'var(--accent)';
  t.textContent = msg;
  document.getElementById('toasts').appendChild(t);
  setTimeout(function() {
    t.style.opacity = '0';
    t.style.transition = 'opacity .4s';
    setTimeout(function() { t.remove(); }, 400);
  }, 4000);
}

// ── Update online race UI language ────────────────────────────
var _origUpdateUILanguage = typeof updateUILanguage === 'function' ? updateUILanguage : null;
if (_origUpdateUILanguage) {
  var _wrappedUpdateUI = function(lang) {
    _origUpdateUILanguage(lang);
    var isAr = lang === 'ar';
    var el = function(id) { return document.getElementById(id); };
    // Nav button
    if(el('n-online-lbl')) el('n-online-lbl').textContent = isAr ? 'شبكي' : 'Online';
    // Modal labels
    if(el('om-header-title')) el('om-header-title').textContent = isAr ? 'السباق عبر الشبكة' : 'Online Race';
    if(el('om-tab-create')) el('om-tab-create').textContent = isAr ? '➕ إنشاء غرفة' : '➕ Create Room';
    if(el('om-tab-join')) el('om-tab-join').textContent = isAr ? '🔗 الانضمام برمز' : '🔗 Join by Code';
    if(el('om-name-lbl-c')) el('om-name-lbl-c').textContent = isAr ? 'اسمك في السباق' : 'Your display name';
    if(el('om-name-c')) el('om-name-c').placeholder = isAr ? 'اكتب اسمك هنا...' : 'Enter your name...';
    if(el('om-create-lbl')) el('om-create-lbl').textContent = isAr ? 'إنشاء غرفة جديدة' : 'Create New Room';
    if(el('om-name-lbl-j')) el('om-name-lbl-j').textContent = isAr ? 'اسمك في السباق' : 'Your display name';
    if(el('om-code-lbl')) el('om-code-lbl').textContent = isAr ? 'رمز الغرفة (4 أحرف)' : 'Room Code (4 chars)';
    if(el('om-join-lbl')) el('om-join-lbl').textContent = isAr ? 'الانضمام للسباق' : 'Join Race';
    if(el('om-code-share-lbl')) el('om-code-share-lbl').textContent = isAr ? 'شارك هذا الرمز مع منافسك' : 'Share this code with your opponent';
    if(el('om-copy-lbl')) el('om-copy-lbl').textContent = isAr ? 'نسخ الرمز' : 'Copy Code';
    if(el('om-waiting-lbl')) el('om-waiting-lbl').textContent = isAr ? 'في انتظار الانضمام' : 'Waiting for opponent...';
    if(el('om-start-lbl')) el('om-start-lbl').textContent = isAr ? 'ابدأ السباق!' : 'Start Race!';
    if(el('om-leave-lbl')) el('om-leave-lbl').textContent = isAr ? '← مغادرة الغرفة' : '← Leave Room';
    if(el('om-cd-lbl')) el('om-cd-lbl').textContent = isAr ? 'استعد للانطلاق!' : 'Get ready!';
    if(el('om-race-timer-lbl')) el('om-race-timer-lbl').textContent = isAr ? 'الوقت: ' : 'Time: ';
    if(el('om-again-lbl')) el('om-again-lbl').textContent = isAr ? (OM.isHost ? '🔄 سباق مجدداً (إعادة البدء)' : '⚔️ طلب جولة ثانية (انتقام)') : (OM.isHost ? '🔄 Rematch (Start Lobby)' : '⚔️ Request Rematch');
    if(el('om-share-lbl')) el('om-share-lbl').textContent = isAr ? 'مشاركة النتيجة' : 'Share Result';
    if(el('om-newroom-lbl')) el('om-newroom-lbl').textContent = isAr ? '🚪 غرفة جديدة' : '🚪 New Room';
    if(el('om-prole-p1')) if(el('om-prole-p1').textContent.indexOf('👑') > -1) el('om-prole-p1').textContent = isAr ? 'المضيف 👑' : 'Host 👑';
  };
  window.updateUILanguage = _wrappedUpdateUI;
}
// ══════════════════════════════════════════════════════════════
// END ONLINE RACE MODULE
// ══════════════════════════════════════════════════════════════
