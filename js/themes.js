// ==============================================================
// BARQTYPE THEMES MANAGER — DIRECT INSTANT DUAL-THEME ENGINE
// (STRICTLY VECTOR SVG ICONS — ZERO CASUAL EMOJIS)
// Modes:
// 1. "gold"  : Barq Gold (الهوية الأصلية - Dark Petrol & Gold)
// 2. "light" : Light Mode (الوضع الفاتح - Clean Daylight Minimal)
// ==============================================================

(function () {
  // Pure Vector SVG Icons
  var ICONS = {
    palette: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle"><path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10 .93 0 1.69-.75 1.69-1.69 0-.44-.18-.84-.44-1.13-.29-.29-.44-.65-.44-1.12 0-.93.76-1.69 1.69-1.69h2c3.04 0 5.5-2.46 5.5-5.5C21.5 6.48 17.02 2 12 2z"/><circle cx="7.5" cy="11.5" r="1.5" fill="currentColor"/><circle cx="9.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="14.5" cy="7.5" r="1.5" fill="currentColor"/><circle cx="16.5" cy="11.5" r="1.5" fill="currentColor"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fill-opacity="0.3"></polygon></svg>',
    sun: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle"><circle cx="12" cy="12" r="4" fill="currentColor" fill-opacity="0.3"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>'
  };

  var BARQ_THEMES = [
    {
      id: "gold",
      nameAr: "برق الذهبي (الأصلي)",
      nameEn: "Barq Gold (Original)",
      accent: "#e8af47",
      bg: "#17242d",
      iconSvg: ICONS.bolt
    },
    {
      id: "light",
      nameAr: "الوضع الفاتح",
      nameEn: "Light Mode",
      accent: "#e8af47",
      bg: "#f8fafc",
      iconSvg: ICONS.sun
    }
  ];

  // 1. Initial Load from LocalStorage (normalize 'carbon' to 'light')
  var currentTheme = localStorage.getItem("barq_theme") || "gold";
  if (currentTheme === "carbon") currentTheme = "light";
  if (currentTheme !== "gold" && currentTheme !== "light") currentTheme = "gold";

  // Apply immediately before DOM render to prevent flash of wrong theme
  document.documentElement.setAttribute("data-theme", currentTheme);

  function applyTheme(themeId) {
    if (themeId === "carbon") themeId = "light";
    if (themeId !== "gold" && themeId !== "light") themeId = "gold";

    currentTheme = themeId;
    document.documentElement.setAttribute("data-theme", themeId);
    try {
      localStorage.setItem("barq_theme", themeId);
    } catch (e) { }

    updateThemeUI();

    // Trigger SVG chart re-draw if on result page
    if (window._lastRes && typeof window.renderBarqChart === "function") {
      try { window.renderBarqChart(window._lastRes); } catch (e) { }
    }
  }

  // Fast direct toggle: switches immediately between Gold (Original) and Light Mode
  function toggleBarqTheme() {
    var nextTheme = (currentTheme === "gold") ? "light" : "gold";
    applyTheme(nextTheme);
    showThemeFlashBadge(nextTheme);
  }

  function updateThemeUI() {
    var btn = document.getElementById("btn-theme-picker");
    var dot = document.getElementById("header-theme-dot");
    var isAr = (document.documentElement.lang === "ar" || document.documentElement.dir === "rtl");

    if (btn) {
      if (currentTheme === "gold") {
        btn.title = isAr ? "المظهر: برق الذهبي الأصلي (انقر للتبديل إلى الوضع الفاتح Light)" : "Theme: Barq Gold Original (Click to switch to Light Mode)";
        btn.setAttribute("aria-label", isAr ? "برق الذهبي" : "Barq Gold");
      } else {
        btn.title = isAr ? "المظهر: الوضع الفاتح (انقر للتبديل إلى برق الذهبي الأصلي)" : "Theme: Light Mode (Click to switch to Barq Gold Original)";
        btn.setAttribute("aria-label", isAr ? "الوضع الفاتح" : "Light Mode");
      }
    }

    if (dot) {
      if (currentTheme === "gold") {
        dot.style.background = "#e8af47";
        dot.style.boxShadow = "0 0 8px #e8af47";
      } else {
        dot.style.background = "#e8af47";
        dot.style.boxShadow = "0 0 8px rgba(232, 175, 71, 0.75)";
      }
    }
  }

  // Brief non-blocking toast badge (fades in & out in 1s, pointer-events: none, zero popups)
  var toastTimer = null;
  function showThemeFlashBadge(themeId) {
    var isAr = (document.documentElement.lang === "ar" || document.documentElement.dir === "rtl");
    var tObj = (themeId === "light") ? BARQ_THEMES[1] : BARQ_THEMES[0];

    var badge = document.getElementById("barq-theme-quick-toast");
    if (!badge) {
      badge = document.createElement("div");
      badge.id = "barq-theme-quick-toast";
      document.body.appendChild(badge);
    }

    badge.innerHTML = '<span class="btq-icon">' + tObj.iconSvg + '</span> <span class="btq-text">' + (isAr ? tObj.nameAr : tObj.nameEn) + '</span>';
    badge.className = "barq-theme-toast-show";

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      badge.className = "";
    }, 1100);
  }

  // Inject Theme Button into Header with SVG icon
  function injectHeaderThemeButton() {
    var ctrls = document.querySelector(".ctrls") || document.querySelector("header nav");
    if (!ctrls || document.getElementById("btn-theme-picker")) return;

    var btn = document.createElement("button");
    btn.className = "pb";
    btn.id = "btn-theme-picker";
    btn.onclick = toggleBarqTheme;
    btn.style.display = "inline-flex";
    btn.style.alignItems = "center";
    btn.style.gap = "6px";
    btn.style.padding = "5px 10px";
    btn.style.cursor = "pointer";
    btn.innerHTML = '<span class="theme-btn-svg" style="display:inline-flex;align-items:center">' + ICONS.palette + '</span><span class="theme-current-dot" id="header-theme-dot"></span>';

    if (ctrls.classList && ctrls.classList.contains("ctrls")) {
      ctrls.insertBefore(btn, ctrls.firstChild);
    } else {
      ctrls.appendChild(btn);
    }
    updateThemeUI();
  }

  // Global APIs
  window.toggleBarqTheme = toggleBarqTheme;
  window.selectBarqTheme = function (themeId) { applyTheme(themeId); };
  window.openThemeModal = toggleBarqTheme; // Direct instant toggle without any popup
  window.closeThemeModal = function () {};
  window.applyBarqTheme = applyTheme;

  // Init on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      applyTheme(currentTheme);
      injectHeaderThemeButton();
    });
  } else {
    applyTheme(currentTheme);
    injectHeaderThemeButton();
  }
})();
