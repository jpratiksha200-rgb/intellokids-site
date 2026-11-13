/* IntelloKids translations: core.
   The texts live in one file per language: js/i18n/en.js, fr.js, es.js (owner, 2026-11-13: the site is in these 3;
   German and Chinese are parked in parked/languages/, see the README there).
   Each calls IK_I18N.add(code, { key: 'text', ... }). Load this file first, then the language files.
   To add a language: copy js/i18n/en.js, translate every value, add a <script> tag for it,
   and add the language to IK_CONFIG.languages in config.js. English is the fallback for missing keys. */
(function () {
  const dict = {};
  let current = 'en';

  function add(code, entries) { dict[code] = Object.assign(dict[code] || {}, entries); }

  // t('key', { name: 'Mia' }) → the text in the current language, with {placeholders} filled in.
  function t(key, vars) {
    let s = (dict[current] && dict[current][key]) || (dict.en && dict.en[key]) || key;
    if (vars) for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
    return s;
  }

  function langConfig(code) { return (window.IK_CONFIG.languages || []).find(x => x.code === code) || {}; }
  // A language counts only if its texts are loaded AND it is listed in IK_CONFIG.languages (so texts added for a
  // parked language, e.g. by an older Android app's ik-native.js, never switch the site to it).
  const usable = code => !!(dict[code] && langConfig(code).code);

  function setLang(code) {
    // A language that isn't loaded (e.g. a saved 'de' or 'zh' from before they were parked) falls back to English.
    current = usable(code) ? code : 'en';
    document.documentElement.lang = current;
    document.documentElement.dir = langConfig(current).dir || 'ltr';
  }

  function getLang() { return current; }
  function voice() { return langConfig(current).voice || 'en-GB'; }

  window.IK_I18N = { add };
  // tIn('fr', key): the raw text in one specific language, '' if missing (no English fallback).
  const tIn = (c, k) => (dict[c] && dict[c][k]) || '';
  window.I18N = { t, tIn, setLang, getLang, voice, has: usable, hasKey: (c, k) => !!(dict[c] && dict[c][k]) };
  window.t = t;
})();
