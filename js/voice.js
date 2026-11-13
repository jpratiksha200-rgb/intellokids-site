/* Brainy's voice.
   Brainy speaks with his own recorded voice: the kid voice from the IntelloKids videos (chosen by the owner).
   Every line he says is pre-recorded as a small MP3 in audio/brainy/<lang>/<id>.mp3, and the list of recorded
   lines for a language is in js/voice/<lang>.js. Both are made by infra/build-voice.ps1; run it again whenever
   a spoken text changes or a new one is added (see infra/voice/README.md).

   How a text is spoken:
   1. It is split into sentences. Each sentence is played from its recording.
   2. A sentence with numbers that has no recording of its own (quiz sums, "What number comes after 57?")
      is put together from recorded pieces: the words, the numbers (0–100, the hundreds and 1000; others are
      built from those) and the maths words (plus, minus…).
   3. If anything is missing (a new text not recorded yet, a language without recordings such as German,
      or a network error), the whole text is read by the device's own voice instead, picking a child-like
      voice where the device has one, so Brainy still sounds young.
   4. A line with names a parent typed (the child's, their friend's) can't be recorded: sayNamed() has the device
      voice read the whole line in one go, and plays the recorded name-free version if the device can't speak. */
(function () {
  const conf = (window.IK_CONFIG && IK_CONFIG.brainyVoice) || {};
  const RECORDED = conf.recorded || [];
  // Where the site lives (works from file:// and from the web, and from any page depth).
  const BASE = (function () {
    const s = document.currentScript && document.currentScript.src;
    return s ? s.replace(/js\/voice\.js(\?.*)?$/, '') : '';
  })();

  // ---------- recorded lines ----------
  const manifests = {};   // lang -> Set of recorded ids
  const loading = {};     // lang -> Promise
  window.IK_VOICE = { add(lang, ids) { manifests[lang] = new Set(ids ? ids.split(' ') : []); } };

  function ensure(lang) {
    if (manifests[lang]) return Promise.resolve(true);
    if (!RECORDED.includes(lang)) return Promise.resolve(false);
    if (!loading[lang]) {
      loading[lang] = new Promise(res => {
        const s = document.createElement('script');
        s.src = BASE + 'js/voice/' + lang + '.js';
        s.onload = () => res(!!manifests[lang]);
        s.onerror = () => res(false);
        document.head.appendChild(s);
      });
    }
    return loading[lang];
  }

  // Short, stable id for a recorded piece (FNV-1a hash + length). The same function names the files.
  function id(key) {
    let h = 0x811c9dc5;
    for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    return h.toString(36) + key.length.toString(36);
  }
  const EMOJI = /\p{Extended_Pictographic}|️|‍|[★☆]/gu;
  const stripEmoji = s => s.replace(EMOJI, '');
  const norm = s => stripEmoji(s).replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim().toLowerCase();
  // Sentences end with . ! ? : (and the Chinese forms).
  const sentences = s => (s.match(/[^.!?:。！？：]+[.!?:。！？：]*|[.!?:。！？：]+/g) || []).map(x => x.trim()).filter(x => /[\p{L}\p{N}]/u.test(stripEmoji(x)));
  // A number as recorded pieces: 0–100 and 1000 are recorded whole; 101–999 = hundreds + the rest
  // ("three hundred" + "forty-two"). Chinese says the rest differently after hundreds (三百零五, 三百一十二): 'z' pieces.
  function numberPieces(n, lang) {
    if (n <= 100 || n >= 1000) return [['n', String(n)]];
    const h = n - n % 100, r = n % 100, out = [['h', String(h)]];
    if (r) out.push([lang === 'zh' && r < 20 ? 'z' : 'n', String(r)]);
    return out;
  }
  // Pieces of a sentence with numbers: words, numbers and maths signs. A lone " ? " is the unknown in "3 + ? = 7".
  function numberParts(sentence, lang) {
    const out = [];
    stripEmoji(sentence).split(/(\d+|[+−×÷=]|\s\?\s)/).forEach(p => {
      if (!p) return;
      if (/^\d+$/.test(p)) out.push(...numberPieces(Number(p), lang));
      else if (/^[+−×÷=]$/.test(p)) out.push(['o', p]);
      else if (/^\s\?\s$/.test(p)) out.push(['o', '?']);
      else {
        const c = p.replace(/^[\s\p{P}\p{S}]+|[\s\p{P}\p{S}]+$/gu, '');
        if (/\p{L}/u.test(c)) out.push(['s', c]);
      }
    });
    return out;
  }
  const keyOf = ([k, v]) => k + '|' + (k === 's' ? norm(v) : v);

  // The recorded pieces needed for a text, or null if something is not recorded.
  function plan(lang, text) {
    const have = manifests[lang];
    if (!have) return null;
    const ids = [];
    for (const s of sentences(text)) {
      const whole = id(keyOf(['s', s]));
      if (have.has(whole)) { ids.push(whole); continue; }
      if (!/\d/.test(s)) return null;
      const parts = numberParts(s, lang).map(p => id(keyOf(p)));
      if (!parts.length || parts.some(p => !have.has(p))) return null;
      ids.push(...parts);
    }
    return ids.length ? ids : null;
  }

  // ---------- playback ----------
  // One audio element for everything: phones (iPhone/iPad especially) only let an element play after a tap,
  // so we unlock it on the first tap with a silent clip and then reuse it for every line.
  let el = null, current = null;   // current = the playback in progress
  const player = () => { if (!el) { el = new Audio(); el.preload = 'auto'; } return el; };
  const clipUrl = (lang, i) => BASE + 'audio/brainy/' + lang + '/' + i + '.mp3';
  function unlock() {
    const a = player();
    if (current || a.src) return;
    a.src = BASE + 'audio/brainy/silence.mp3';
    const p = a.play();
    if (p && p.catch) p.catch(() => { /* not allowed yet */ });
  }
  ['pointerdown', 'touchend', 'keydown'].forEach(ev => document.addEventListener(ev, unlock, { once: true, capture: true }));

  function stop() {
    ticket++;   // anything still waiting to start (a recording list loading, a device line) is cancelled too
    if (el) { el.onended = null; el.onerror = null; try { el.pause(); } catch (e) { /* ignore */ } }
    current = null;
    try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) { /* ignore */ }
  }
  function playIds(lang, ids, fallbackText) {
    const a = player(), run = { k: 0 };
    current = run;
    // Warm the cache for the next pieces so they follow on quickly.
    ids.slice(1).forEach(i => { const w = new Audio(); w.preload = 'auto'; w.src = clipUrl(lang, i); });
    const fail = () => { if (current === run) { current = null; deviceSpeak(fallbackText); } };
    const next = () => {
      if (current !== run) return;
      if (run.k >= ids.length) { current = null; return; }
      a.onended = () => setTimeout(next, 30);
      a.onerror = fail;
      a.src = clipUrl(lang, ids[run.k++]);
      const p = a.play();
      if (p && p.catch) p.catch(fail);
    };
    next();
  }

  // ---------- device voice (fallback) ----------
  // A child-like voice first; otherwise a light voice with the pitch raised so Brainy still sounds young.
  // [name, pitch]; names are matched as whole words in the voice name ("Microsoft Ana Online (Natural)").
  const DEVICE_VOICES = {
    en: [['Ana', 1.05], ['Maisie', 1.05], ['Jenny', 1.3], ['Aria', 1.3], ['Libby', 1.3], ['Sonia', 1.3], ['Emma', 1.3], ['Ava', 1.3],
      ['Google US English', 1.3], ['Google UK English Female', 1.3], ['Samantha', 1.3], ['Karen', 1.3], ['Tessa', 1.3], ['Kate', 1.3],
      ['Serena', 1.3], ['Hazel', 1.35], ['Susan', 1.35], ['Zira', 1.35]],
    fr: [['Eloise', 1.05], ['Denise', 1.3], ['Vivienne', 1.3], ['Brigitte', 1.3], ['Google français', 1.3], ['Amélie', 1.3], ['Audrey', 1.3],
      ['Marie', 1.3], ['Julie', 1.35], ['Hortense', 1.35]],
    es: [['Elvira', 1.3], ['Ximena', 1.3], ['Dalia', 1.3], ['Google español', 1.3], ['Mónica', 1.3], ['Paulina', 1.3], ['Helena', 1.35],
      ['Laura', 1.35], ['Sabina', 1.35]],
    de: [['Gisela', 1.05], ['Katja', 1.3], ['Amala', 1.3], ['Seraphina', 1.3], ['Google Deutsch', 1.3], ['Anna', 1.3], ['Petra', 1.3],
      ['Hedda', 1.35]],
    zh: [['Xiaoyou', 1.05], ['Xiaoshuang', 1.05], ['Yunxia', 1.05], ['Xiaoxiao', 1.25], ['Xiaoyi', 1.25], ['Google 普通话', 1.25],
      ['Tingting', 1.3], ['Huihui', 1.35], ['Yaoyao', 1.35]]
  };
  const DEFAULT_PITCH = 1.3;
  let voiceCache = {};
  try { window.speechSynthesis && speechSynthesis.addEventListener('voiceschanged', () => { voiceCache = {}; }); } catch (e) { /* old browser */ }
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Best device voice for a language like 'en-GB' → { voice, pitch } (voice is null if the device lists none).
  function pickVoice(lang, voices) {
    const list = voices || (window.speechSynthesis ? speechSynthesis.getVoices() : []);
    if (!voices && voiceCache[lang] && list.length) return voiceCache[lang];
    const base = lang.slice(0, 2).toLowerCase(), want = lang.toLowerCase(), prefs = DEVICE_VOICES[base] || [];
    let best = null, bestScore = -1;
    list.forEach(v => {
      const vl = (v.lang || '').replace('_', '-').toLowerCase();
      if (vl.slice(0, 2) !== base) return;
      const name = v.name || '';
      const i = prefs.findIndex(([n]) => new RegExp('(^|[^A-Za-z])' + esc(n) + '(Multilingual)?(?![A-Za-z])', 'i').test(name));
      let score = i >= 0 ? 1000 - i * 10 : (/natural|neural|online|enhanced|premium/i.test(name) ? 50 : 0);
      if (vl === want) score += 5;
      if (v.default) score += 1;
      if (score > bestScore) { bestScore = score; best = { voice: v, pitch: i >= 0 ? prefs[i][1] : DEFAULT_PITCH }; }
    });
    const res = best || { voice: null, pitch: DEFAULT_PITCH };
    if (!voices && list.length) voiceCache[lang] = res;
    return res;
  }

  // hooks (optional): { onstart, onerror } for the utterance (sayNamed uses them to fall back to a recording).
  function deviceSpeak(text, hooks) {
    try {
      if (!window.speechSynthesis || !text) return false;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(stripEmoji(text));
      const lang = I18N.voice(), bv = pickVoice(lang);
      u.lang = bv.voice ? bv.voice.lang : lang;
      if (bv.voice) u.voice = bv.voice;
      u.pitch = bv.pitch; u.rate = 0.92;
      if (hooks) { u.onstart = hooks.onstart || null; u.onerror = hooks.onerror || null; }
      report({ how: 'device', lang: I18N.getLang(), text: u.text });
      // Test browsers (headless Chrome driven by a script) stay silent: the device voice can play through the
      // speakers even with --mute-audio, which the owner doesn't want. Recordings are muted by that flag.
      if (navigator.webdriver || /HeadlessChrome/.test(navigator.userAgent)) return false;
      speechSynthesis.speak(u);
      return true;
    } catch (e) { return false; /* speech not available */ }
  }
  // For tests: BrainyVoice.onPlan = p => console.log(p) shows what Brainy is about to say and how.
  function report(p) { try { if (window.BrainyVoice && typeof BrainyVoice.onPlan === 'function') BrainyVoice.onPlan(p); } catch (e) { /* ignore */ } }

  // ---------- public ----------
  // say(text): Brainy says the text. deviceText (optional) is what the device voice says if the recording
  // can't be used (e.g. the version with the child's name, which can't be recorded in advance).
  let ticket = 0;
  function say(text, deviceText) {
    stop();
    if (!text) return;
    const lang = I18N.getLang(), mine = ++ticket;
    const go = () => {
      if (mine !== ticket) return;   // something newer was said meanwhile
      try {
        const ids = plan(lang, text);
        if (ids) report({ how: 'recorded', lang, text, ids });
        if (ids) playIds(lang, ids, deviceText || text);
        else deviceSpeak(deviceText || text);
      } catch (e) { current = null; deviceSpeak(deviceText || text); }   // no audio support: device voice (or silence)
    };
    if (manifests[lang] || !RECORDED.includes(lang)) go();
    else Promise.race([ensure(lang), new Promise(r => setTimeout(r, 1500))]).then(go);
  }

  // sayNamed(deviceText, recordedText): a line with names a parent typed, e.g. "Hi Leo! Your friend Thomas and Brainy
  // are ready to play!". Names can't be recorded, so the device voice reads the whole line in one go: one voice and a
  // natural flow (splicing device-voice names between recorded words switches voice mid-sentence). If the device has
  // no voice for the language (no voices listed for it, no speechSynthesis, an error such as a phone without a
  // text-to-speech engine, or nothing starts within 3 s), Brainy says the recorded name-free line instead.
  function sayNamed(deviceText, recordedText) {
    stop();
    const mine = ticket;
    const recorded = () => { if (mine === ticket) say(recordedText); };
    let started = false;
    try {
      const synth = window.speechSynthesis, voices = synth ? synth.getVoices() : [];
      if (!deviceText || !synth || (voices.length && !pickVoice(I18N.voice()).voice)) return recorded();
    } catch (e) { return recorded(); }
    const ok = deviceSpeak(deviceText, {
      onstart: () => { started = true; },
      onerror: e => { if (!/interrupted|cancel/i.test((e && e.error) || '')) recorded(); }
    });
    if (!ok) return recorded();
    setTimeout(() => { if (!started && mine === ticket) { try { speechSynthesis.cancel(); } catch (e) { /* ignore */ } recorded(); } }, 3000);
  }

  // Load the current language's list early, so the first line plays straight away.
  document.addEventListener('DOMContentLoaded', () => { try { ensure(I18N.getLang()); } catch (e) { /* ignore */ } });

  window.BrainyVoice = { say, sayNamed, stop, ensure, pickVoice, _id: id, _plan: plan, _sentences: sentences, _numberParts: numberParts, _keyOf: keyOf };
})();
