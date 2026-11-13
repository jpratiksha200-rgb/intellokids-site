/* Talk to Brainy: a safe chat for children, answered on the device.
 *
 * Brainy's "brain" is rule-based, so it can never say anything we did not write. It understands
 * greetings and small talk, feelings, sums (with child-friendly explanations), times tables,
 * spelling, counting, the date and time, and a set of child-friendly facts, in all five site
 * languages. All its words live in js/i18n/<lang>.js (keys chat_*, chip_*, bk_* = what the child
 * may type, br_* = Brainy's answers; "||" separates answer variants, "|" separates keywords).
 *
 * Safety: every message first goes through BrainySafety (js/brainy-safety.js). Nothing a child
 * types leaves the device: there are no network calls. Parents can switch the chat off, read the
 * conversation and see alerts in the child's progress dashboard. A daily message limit keeps the
 * chat a helper, not a replacement for playing and learning.
 *
 * Later (admin.md): a server-side AI can answer open questions behind this same safety filter. */
(function () {
  const S = window.BrainySafety;
  const cfg = () => Object.assign({ enabled: true, dailyLimit: 60, maxLength: 150, keep: 120 }, (window.IK_CONFIG && IK_CONFIG.brainyChat) || {});
  const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const lang = () => I18N.getLang();
  const dayKey = ts => { const d = new Date(ts); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };

  // ---------- understanding what the child typed ----------
  // English words that mean something else in another site language (German "Bad" = bathroom).
  const FALSE_FRIENDS = { de: ['bad'] };
  const kwCache = {};
  function lists(key) {
    const l = lang();
    const split = s => (s || '').split('|').map(x => x.trim()).filter(Boolean);
    return [split(I18N.tIn(l, key)), l === 'en' ? [] : split(I18N.tIn('en', key)).filter(w => !(FALSE_FRIENDS[l] || []).includes(w))];
  }
  // Keywords for the current language plus English (kids often type English words).
  function keys(key) {
    const ck = lang() + ':' + key;
    if (kwCache[ck]) return kwCache[ck];
    const [own, en] = lists(key);
    const all = own.concat(en.filter(w => !own.includes(w)));
    return (kwCache[ck] = all.map(p => S.CJK.test(p) ? { cjk: p } : { re: new RegExp('(^| )' + escRe(S.norm(p)) + '(?= |$)', 'u') }));
  }
  // whole: Chinese keywords must be the entire message (是 "yes" is inside almost every sentence).
  function has(text, key, whole) {
    const n = S.norm(text), bare = String(text).replace(/[^\p{L}\p{N}]/gu, '');
    return keys(key).some(k => k.cjk ? (whole ? bare === k.cjk : text.includes(k.cjk)) : k.re.test(n));
  }
  const wordCount = text => (S.norm(text).match(/\S+/g) || []).length + (String(text).match(/[㐀-鿿]/g) || []).length / 2;

  // Answer variants are separated by "||". Never the same variant twice in a row.
  const lastPick = {};
  function pick(key, vars) {
    const all = t(key, vars).split('||').map(s => s.trim()).filter(Boolean);
    let i = Math.floor(Math.random() * all.length);
    if (all.length > 1 && lastPick[key] === i) i = (i + 1) % all.length;
    lastPick[key] = i;
    return all[i];
  }

  // ---------- numbers and sums ----------
  const ZH = { 零: 0, 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
  function zhNum(s) {
    if (s === '十') return 10;
    const i = s.indexOf('十');
    if (i === -1) return Number(s.split('').map(c => ZH[c]).join(''));
    return (i === 0 ? 1 : ZH[s[0]]) * 10 + (i === s.length - 1 ? 0 : ZH[s[i + 1]] || 0);
  }
  const plain = s => String(s).toLowerCase().replace(/ñ/g, 'ny').replace(/ß/g, 'ss').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/['’]/g, ' ');
  function wordRe(w) { return new RegExp('(^|[^\\p{L}])' + escRe(plain(w).trim()) + '(?=[^\\p{L}]|$)', 'gu'); }
  // Number words ("seven", "sept", 七) → digits.
  function numberify(text) {
    let s = ' ' + plain(text) + ' ';
    s = s.replace(/[零一二两三四五六七八九十]+/g, m => ' ' + zhNum(m) + ' ');
    const [own, en] = lists('bk_nums');
    const words = [];
    [own, en].forEach(list => list.forEach((w, i) => words.push([w, i])));
    words.sort((a, b) => b[0].length - a[0].length).forEach(([w, i]) => { s = s.replace(wordRe(w), '$1 ' + i + ' '); });
    return s;
  }
  // Finds a sum in the message. Returns its tokens, or null.
  function findSum(text) {
    let s = numberify(text);
    s = s.replace(/加上|加/g, ' + ').replace(/减去|减/g, ' - ').replace(/乘以|乘/g, ' * ').replace(/除以/g, ' / ');
    s = s.replace(/[×✕✖]/g, ' * ').replace(/÷/g, ' / ').replace(/[−–—]/g, ' - ');
    s = s.replace(/(\d)\s*x\s*(?=\d)/g, '$1 * ').replace(/(\d)\s*:\s*(\d)(?!\d)/g, '$1 / $2');
    s = s.replace(/(\d),(\d{3})(?!\d)/g, '$1$2').replace(/(\d),(\d)/g, '$1.$2');
    const ops = [];
    [['bk_opAdd', '+'], ['bk_opSub', '-'], ['bk_opMul', '*'], ['bk_opDiv', '/']].forEach(([k, op]) => {
      const [own, en] = lists(k); own.concat(en).forEach(w => ops.push([w, op]));
    });
    ops.sort((a, b) => b[0].length - a[0].length).forEach(([w, op]) => { s = s.replace(wordRe(w), '$1 ' + op + ' '); });
    const runs = (s.match(/[\d.+\-*/()\s]+/g) || []).map(r => r.trim()).filter(r => /\d\s*[+\-*/]\s*[-(]*\s*\d/.test(r));
    if (!runs.length) return null;
    const expr = runs.sort((a, b) => b.length - a.length)[0];
    // "555-1234" is a phone number, not a sum.
    if (/^[\d\s-]+$/.test(expr) && expr.replace(/\D/g, '').length >= 7) return null;
    return evaluate(expr);
  }
  // Tiny calculator (+ − × ÷ and brackets). No eval().
  function evaluate(expr) {
    const tk = expr.match(/\d+(?:\.\d+)?|[+\-*/()]/g);
    if (!tk || tk.length > 25) return null;
    let i = 0, ops = 0;
    const peek = () => tk[i], next = () => tk[i++];
    function prim() {
      const x = next();
      if (x === '(') { const v = sum(); if (next() !== ')') throw 0; return v; }
      if (x === '-') return -prim();
      if (x === '+') return prim();
      if (x == null || isNaN(x)) throw 0;
      return Number(x);
    }
    function prod() {
      let v = prim();
      while (peek() === '*' || peek() === '/') {
        const o = next(), r = prim(); ops++;
        if (o === '/' && r === 0) throw 'zero';
        v = o === '*' ? v * r : v / r;
      }
      return v;
    }
    function sum() {
      let v = prod();
      while (peek() === '+' || peek() === '-') { const o = next(), r = prod(); ops++; v = o === '+' ? v + r : v - r; }
      return v;
    }
    try {
      const v = sum();
      return i === tk.length && ops ? { v, tk } : null;
    } catch (e) { return e === 'zero' ? { zero: true, tk } : null; }
  }
  const rep = (e, n) => Array(Math.max(0, n)).fill(e).join('');
  const range = (a, b) => { const out = []; for (let k = a; a <= b ? k <= b : k >= b; k += a <= b ? 1 : -1) out.push(k); return out; };
  const fmt = x => Number.isInteger(x) ? x.toLocaleString(I18N.voice()) : String(Math.round(x * 1000) / 1000);
  const SYM = { '+': '+', '-': '−', '*': '×', '/': '÷' };

  function explainSum(p) {
    const intro = pick('br_m_intro');
    if (p.zero) return { text: intro + ' ' + t('br_m_zero'), topic: 'sum', chips: ['moreSum', 'joke'] };
    const q = p.tk.map(x => SYM[x] || x).join(' ').replace(/\( /g, '(').replace(/ \)/g, ')');
    const r = fmt(p.v);
    const bin = p.tk.length === 3 && !isNaN(p.tk[0]) && !isNaN(p.tk[2]);
    const a = bin ? Number(p.tk[0]) : 0, b = bin ? Number(p.tk[2]) : 0, op = bin ? p.tk[1] : '';
    const ints = bin && Number.isInteger(a) && Number.isInteger(b);
    let text, visual = '';
    if (Math.abs(p.v) >= 1e6 || a >= 1e6 || b >= 1e6) text = t('br_m_big', { q, r });
    else if (!ints) text = t('br_m_result', { q, r });
    else if (op === '+') {
      if (a + b <= 12) { text = t('br_m_count', { a, b, r }); visual = rep('🍎', a) + ' + ' + rep('🍎', b) + ' = ' + r; }
      else if (b <= 5) text = t('br_m_on', { a, b, r, steps: range(a + 1, a + b).join(', ') });
      else if (a >= 10 && b >= 10 && a < 100 && b < 100) {
        const at = a - a % 10, bt = b - b % 10;
        text = t('br_m_split', { at, bt, tt: at + bt, ao: a % 10, bo: b % 10, oo: a % 10 + b % 10, r });
      } else text = t('br_m_result', { q, r });
    } else if (op === '-') {
      if (a - b < 0) text = t('br_m_neg', { a, b, r });
      else if (a <= 12) { text = t('br_m_take', { a, b, r }); visual = rep('🍪', a) + ' − ' + rep('🍪', b) + ' = ' + (rep('🍪', a - b) || '0'); }
      else if (b <= 5) text = t('br_m_back', { a, b, r, steps: range(a - 1, a - b).join(', ') });
      else text = t('br_m_check', { a, b, r });
    } else if (op === '*') {
      if (a === 0 || b === 0) text = t('br_m_timesZero', { a, b });
      else if (a <= 6 && b <= 6 && a * b <= 24) { text = t('br_m_groups', { a, b, r }); visual = Array(a).fill(rep('🟢', b)).join('  '); }
      else if (a <= 5 && b < 1000) text = t('br_m_repeat', { a, b, r, steps: Array(a).fill(b).join(' + ') });
      else text = t('br_m_mulCheck', { a, b, r });
    } else if (op === '/') {
      const whole = Math.floor(a / b), rem = a % b;
      if (a < 0 || b < 0) text = t('br_m_result', { q, r });
      else if (rem) text = t('br_m_rem', { a, b, q: whole, rem });
      else if (a <= 100) {
        text = t('br_m_share', { a, b, r });
        if (a <= 24 && b <= 6) visual = Array(b).fill(rep('🍬', whole)).join('  ');
      } else text = t('br_m_result', { q, r });
    } else text = t('br_m_result', { q, r });
    return { text: intro + ' ' + text, visual, topic: 'sum', chips: ['moreSum', 'joke'] };
  }

  // ---------- the brain ----------
  const KB = ['legs', 'bigAnimal', 'fastAnimal', 'sky', 'rainbow', 'sun', 'moon', 'planets', 'dino', 'year', 'days', 'seasons', 'plants', 'teeth', 'shapes', 'rain', 'mix', 'sounds'];
  const FEELINGS = [['grief', 'feelings'], ['sad', 'feelings'], ['scared', 'feelings'], ['angry'], ['bored'], ['tired'], ['hungry']];
  const TALK = ['howareyou', 'greet', 'name', 'real', 'age', 'fav', 'live', 'love', 'thanks', 'bye', 'play', 'sumhelp', 'help', 'joke', 'fact', 'happy', 'yes', 'no'];
  const SHORT = { happy: 1, yes: 1, no: 1 };   // only when the message is short ("good", "yes")
  const ACTIONS = { bored: ['map', 'quiz', 'colour'], play: ['map', 'quiz', 'colour', 'stickers'], happy: ['map'], sad: [], tired: [] };
  const CHIPS = { joke: ['moreJoke', 'fact', 'sum'], fact: ['moreFact', 'joke', 'sum'], sad: ['joke', 'fact'], scared: ['joke', 'fact'], grief: [], angry: ['joke', 'play'] };

  function defaultChips(group) {
    return group === 'tiny' ? ['hello', 'how', 'joke', 'fact', 'count', 'play']
      : group === 'junior' ? ['hello', 'how', 'sum', 'spell', 'joke', 'fact']
      : ['how', 'sum', 'spell', 'fact', 'joke', 'play'];
  }

  /* reply(text, ctx) → { text, visual?, actions?, chips?, topic?, flag?, mask?, keypad?, mood? }
   * ctx: { name, group, lastTopic } */
  function think(raw, ctx) {
    const text = String(raw || '').slice(0, cfg().maxLength);
    const name = ctx.name || '';
    const sum = findSum(text);

    // 1. Safety first.
    const safe = S.check(text, lang(), { isMaths: !!sum });
    if (safe.kind) {
      const out = { text: pick('br_s_' + (safe.kind === 'private' && safe.hit === 'number' ? 'number' : safe.kind), { name }), topic: 'safety', id: 'safety:' + safe.kind, mood: 'happy' };
      if (safe.kind === 'danger') { out.flag = 'danger'; out.chips = []; }
      if (safe.kind === 'private' || safe.kind === 'rude') out.mask = safe.kind;
      return out;
    }
    if (!/[\p{L}\p{N}]/u.test(text)) return { text: pick('br_emoji'), id: 'emoji' };

    // 2. Things Brainy can work out.
    if (has(text, 'bk_table')) {
      const m = numberify(text).match(/\d+/);
      const n = m ? Number(m[0]) : null;
      if (n && n <= 20) return { text: t('br_table', { n }), visual: range(1, 10).map(k => `${n} × ${k} = ${n * k}`).join('\n'), topic: 'sum', id: 'table', chips: ['moreSum', 'joke'] };
    }
    if (sum) return Object.assign(explainSum(sum), { id: 'sum' });
    const spelled = spell(text);
    if (spelled) return Object.assign(spelled, { id: 'spell' });
    if (has(text, 'bk_count')) {
      const m = numberify(text).match(/\d+/g);      // "count from 1 to 20" → 20
      let n = m ? Number(m[m.length - 1]) : 10;
      if (!n) n = 10;
      if (n <= 30) return { text: t('br_count', { n, list: range(1, n).join(', ') }), topic: 'count' };
      if (n <= 100) { const tens = range(1, Math.floor(n / 10)).map(k => k * 10); if (n % 10) tens.push(n); return { text: t('br_count', { n, list: tens.join(', ') }), topic: 'count' }; }
      return { text: t('br_countBig', { list: range(1, 10).map(k => k * 10).join(', ') }), topic: 'count' };
    }
    if (has(text, 'bk_time')) return { text: t('br_time', { time: new Date().toLocaleTimeString(I18N.voice(), { hour: '2-digit', minute: '2-digit' }) }), id: 'time' };
    if (has(text, 'bk_day')) return { text: t('br_day', { day: new Date().toLocaleDateString(I18N.voice(), { weekday: 'long', day: 'numeric', month: 'long' }) }), id: 'day' };

    // 3. Feelings come before facts ("I'm sad my dinosaur broke").
    for (const [id, flag] of FEELINGS) {
      if (has(text, 'bk_' + id)) return { text: pick('br_' + id, { name }), flag, actions: ACTIONS[id], chips: CHIPS[id], topic: id, mood: 'happy' };
    }
    // 4. Facts.
    for (const id of KB) if (has(text, 'bk_q_' + id)) return { text: t('br_q_' + id), topic: 'fact', id: 'kb:' + id, chips: ['moreFact', 'joke'] };
    // 5. Small talk.
    const short = wordCount(text) <= 5;
    for (const id of TALK) {
      if (SHORT[id] && !short) continue;
      if (!has(text, 'bk_' + id, !!SHORT[id])) continue;
      if (id === 'joke') return { text: pick('br_jokes'), topic: 'joke', chips: CHIPS.joke, mood: 'cheer' };
      if (id === 'fact') return { text: pick('br_facts'), topic: 'fact', id, chips: CHIPS.fact };
      if (id === 'sumhelp') return { text: t('br_sumhelp'), topic: 'sum', id, keypad: true, chips: [] };
      if (id === 'help') return { text: t('br_help'), topic: 'help' };
      if (id === 'yes') {
        if (ctx.lastTopic === 'joke') return { text: pick('br_jokes'), topic: 'joke', id: 'yes>joke', chips: CHIPS.joke, mood: 'cheer' };
        if (ctx.lastTopic === 'fact') return { text: pick('br_facts'), topic: 'fact', id: 'yes>fact', chips: CHIPS.fact };
        if (ctx.lastTopic === 'sum') return { text: t('br_sumhelp'), topic: 'sum', id: 'yes>sum', keypad: true, chips: [] };
      }
      return { text: pick('br_' + id, { name }), topic: id, actions: ACTIONS[id], mood: 'cheer' };
    }
    // 6. Just a number: tell something about it.
    const only = numberify(text).trim().match(/^(\d{1,6})$/);
    if (only) { const n = Number(only[1]); return { text: t(n % 2 ? 'br_numOdd' : 'br_numEven', { n, n1: n + 1 }), id: 'number' }; }
    // 7. Brainy doesn't know: say so honestly and suggest things it can do.
    return { text: pick('br_unknown'), topic: 'unknown', mood: 'think' };
  }
  // id says which rule answered (used by the tests and handy when debugging).
  function reply(raw, ctx) { const r = think(raw, ctx || {}); r.id = r.id || r.topic || 'other'; return r; }

  // "How do you spell cat?" (the word after the question) or "cat 怎么拼？" (the word before it).
  function spell(text) {
    const n = S.norm(text);
    const skip = lists('bk_spellSkip').flat().map(S.norm);
    const words = s => s.split(' ').filter(w => w && !skip.includes(w));
    for (const k of keys('bk_spell')) {
      let at = -1, len = 0;
      if (k.cjk) { at = n.indexOf(k.cjk); len = k.cjk.length; }
      else { const m = n.match(k.re); if (m) { at = m.index; len = m[0].length; } }
      if (at < 0) continue;
      const target = words(n.slice(at + len))[0] || (k.cjk ? words(n.slice(0, at)).pop() : null);
      if (!target || target.length > 24 || !/^\p{L}+$/u.test(target) || S.CJK.test(target)) return null;
      // Show the word as the child typed it (accents and capitals kept).
      const word = (String(text).match(/\p{L}+/gu) || []).find(w => S.norm(w) === target) || target;
      const letters = Array.from(word.toUpperCase());
      return { text: t('br_spell', { word, letters: letters.join(' - ') }), say: t('br_spell', { word, letters: letters.join(', ') }), topic: 'spell', chips: ['spell', 'sum'] };
    }
    return null;
  }

  // ---------- chat history (on this device only) ----------
  function state(kid) { return kid.chat || { log: [], day: '', sent: 0 }; }
  function save(kidId, entry, countIt) {
    const keep = cfg().keep;
    Store.updateChild(kidId, c => {
      const ch = c.chat || (c.chat = { log: [], day: '', sent: 0 });
      ch.log.push(entry);
      if (ch.log.length > keep) ch.log.splice(0, ch.log.length - keep);
      if (countIt) { const d = dayKey(Date.now()); if (ch.day !== d) { ch.day = d; ch.sent = 0; } ch.sent++; }
      if (entry.flag && entry.me) {
        c.chatFlags = c.chatFlags || [];
        c.chatFlags.push({ t: entry.t, level: entry.flag, text: entry.text });
        if (c.chatFlags.length > 30) c.chatFlags.splice(0, c.chatFlags.length - 30);
      }
    });
  }
  function overLimit(kid) { const ch = state(kid); return ch.day === dayKey(Date.now()) && ch.sent >= cfg().dailyLimit; }
  const enabled = kid => cfg().enabled && !(kid && kid.chatOff);
  // Talk to Brainy is for children aged minAge and over (IK_CONFIG.brainyChat.minAge). Uses the child's age today,
  // so it follows a change in the profile and the child's yearly age update. Younger children don't see the chat at all.
  const minAge = () => Math.max(0, +cfg().minAge || 0);
  const forAge = kid => !!kid && Store.currentAge(kid) >= minAge();

  // Text for the speech voice: no emojis, and maths symbols as words.
  function speechOf(s) {
    return String(s)
      .replace(/\s\+\s/g, ' ' + t('say_plus') + ' ').replace(/\s[−-]\s/g, ' ' + t('say_minus') + ' ')
      .replace(/\s×\s/g, ' ' + t('say_times') + ' ').replace(/\s[÷:]\s/g, ' ' + t('say_div') + ' ').replace(/\s=\s/g, ' ' + t('say_eq') + ' ')
      .replace(/[\p{Extended_Pictographic}‍️⃣]/gu, '').replace(/\s+/g, ' ').trim();
  }

  // ---------- the chat screen ----------
  const ACT_ICON = { map: '🗺️', quiz: '❓', colour: '🎨', stickers: '🦄' };
  const PAD = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '−', '0', '⌫', '=', '+'];

  function render(root, kid) {
    const c = cfg();
    const group = Store.ageGroup(kid);
    root.innerHTML = `
      <div class="chat">
        <div class="chat-head">
          <div class="chat-brainy" aria-hidden="true">${Art.brainy({ mood: 'cheer' })}</div>
          <div class="chat-head-text"><strong>Brainy</strong><span class="chat-status">${t('chat_ready')}</span></div>
        </div>
        <div class="chat-log" role="log" aria-live="polite" aria-label="${t('chatTitle')}" tabindex="0"></div>
        <div class="chat-chips" role="group" aria-label="${t('chat_ideas')}"></div>
        <div class="chat-pad" hidden>${PAD.map(k => `<button type="button" class="pad-key${/\d/.test(k) ? '' : ' op'}" data-k="${k}">${k}</button>`).join('')}</div>
        <form class="chat-form" novalidate autocomplete="off">
          <button type="button" class="icon-btn chat-pad-btn" aria-label="${t('chat_pad')}" aria-expanded="false">🔢</button>
          <input class="input chat-input" type="text" maxlength="${c.maxLength}" enterkeyhint="send" autocomplete="off" placeholder="${t('chat_placeholder')}" aria-label="${t('chat_placeholder')}">
          <button type="submit" class="btn primary chat-send" aria-label="${t('chat_send')}"><span class="flip-rtl" aria-hidden="true">➤</span></button>
        </form>
        <p class="chat-safe">${t('chat_safe')}</p>
      </div>`;
    const log = root.querySelector('.chat-log'), chipsEl = root.querySelector('.chat-chips');
    const form = root.querySelector('.chat-form'), input = root.querySelector('.chat-input');
    const pad = root.querySelector('.chat-pad'), padBtn = root.querySelector('.chat-pad-btn');
    const face = root.querySelector('.chat-brainy'), status = root.querySelector('.chat-status');
    let busy = false, lastSend = 0, lastTopic = null;
    const alive = () => document.body.contains(root);

    function mood(m) { face.innerHTML = Art.brainy({ mood: m }); }
    function say(m) { GK.speak(speechOf(m.s || ((m.text || '') + ' ' + (m.v && m.v.includes('\n') ? m.v.replace(/\n/g, '. ') : '')))); }

    function bubble(m) {
      const el = document.createElement('div');
      el.className = 'msg ' + (m.me ? 'me' : 'brainy');
      const p = document.createElement('p'); p.textContent = m.text; el.appendChild(p);
      if (m.v) { const v = document.createElement('div'); v.className = 'msg-visual'; v.textContent = m.v; el.appendChild(v); }
      if (!m.me && m.a && m.a.length) {
        const row = document.createElement('div'); row.className = 'msg-actions';
        m.a.forEach(a => {
          const link = document.createElement('a');
          link.className = 'btn ghost small'; link.href = '#/kid/' + encodeURIComponent(kid.id) + '/' + a;
          link.textContent = ACT_ICON[a] + ' ' + t('menu_' + a);
          row.appendChild(link);
        });
        el.appendChild(row);
      }
      if (!m.me) {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'msg-say'; b.textContent = '🔊'; b.setAttribute('aria-label', t('chat_listen'));
        b.onclick = () => say(m);
        el.appendChild(b);
      }
      return el;
    }
    function add(m) { log.appendChild(bubble(m)); log.scrollTop = log.scrollHeight; }
    function brainySays(r, persist) {
      const m = { t: Date.now(), text: r.text };
      if (r.visual) m.v = r.visual;
      if (r.actions && r.actions.length) m.a = r.actions;
      add(Object.assign({ s: r.say }, m));
      if (persist !== false) save(kid.id, m, false);
      say(Object.assign({ s: r.say }, m));
      chips(r.chips && r.chips.length ? r.chips : r.chips ? [] : defaultChips(group));
      if (r.keypad) openPad(true);
    }
    function chips(list) {
      chipsEl.innerHTML = '';
      list.forEach(k => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'chip'; b.textContent = t('chip_' + k);
        b.onclick = () => send(t('chip_' + k).replace(/^[^\p{L}\p{N}]+/u, ''));
        chipsEl.appendChild(b);
      });
    }
    function openPad(open) {
      pad.hidden = !open; padBtn.setAttribute('aria-expanded', String(open));
      padBtn.classList.toggle('on', open);
      if (open) log.scrollTop = log.scrollHeight;
    }
    function lock() { input.disabled = true; form.querySelector('.chat-send').disabled = true; chipsEl.innerHTML = ''; openPad(false); }

    function send(raw) {
      const text = String(raw || '').replace(/\s+/g, ' ').trim().slice(0, c.maxLength);
      if (!text || busy) return;
      const now = Date.now();
      if (now - lastSend < 700) return; // no flooding
      lastSend = now;
      const fresh = Store.getChild(kid.id);
      if (!fresh || !enabled(fresh) || !forAge(fresh)) return;
      if (overLimit(fresh)) { brainySays({ text: t('chat_limit'), actions: ['map', 'colour'], chips: [] }); lock(); return; }
      const r = reply(text, { name: fresh.name, group, lastTopic });
      const shown = r.mask ? S.redact(text, r.mask) : r.flag === 'danger' ? S.redact(text, 'danger') : text;
      const mine = { t: now, me: 1, text: shown };
      if (r.flag) mine.flag = r.flag;
      add(mine); save(kid.id, mine, true);
      input.value = '';
      busy = true; mood('think'); status.textContent = t('chat_typing');
      const dots = document.createElement('div'); dots.className = 'msg brainy typing'; dots.setAttribute('aria-label', t('chat_typing'));
      dots.innerHTML = '<span></span><span></span><span></span>';
      log.appendChild(dots); log.scrollTop = log.scrollHeight;
      setTimeout(() => {
        if (!alive()) return;
        dots.remove(); busy = false; status.textContent = t('chat_ready');
        lastTopic = r.topic || null;
        mood(r.mood || 'cheer');
        brainySays(r);
        if (overLimit(Store.getChild(kid.id))) setTimeout(() => { if (alive()) { brainySays({ text: t('chat_limit'), actions: ['map', 'colour'], chips: [] }); lock(); } }, 1600);
      }, 550 + Math.min(900, r.text.length * 8));
    }

    form.onsubmit = e => { e.preventDefault(); send(input.value); };
    padBtn.onclick = () => openPad(pad.hidden);
    pad.querySelectorAll('[data-k]').forEach(b => b.onclick = () => {
      const k = b.dataset.k;
      GK.sfx('tap');
      if (k === '⌫') input.value = input.value.replace(/\s*\S\s*$/, '');
      else if (k === '=') send(input.value);
      else if (/\d/.test(k)) input.value += k;
      else input.value = input.value.replace(/\s+$/, '') + ' ' + k + ' ';
    });

    // Earlier messages, then a hello.
    const st = state(kid);
    st.log.slice(-40).forEach(add);
    const lastAt = st.log.length ? st.log[st.log.length - 1].t : 0;
    if (overLimit(kid)) { brainySays({ text: t('chat_limit'), actions: ['map', 'colour'], chips: [] }, false); lock(); }
    else if (!st.log.length) brainySays({ text: t('chat_welcome', { name: kid.name }) });
    else if (Date.now() - lastAt > 3 * 3600e3) brainySays({ text: t('chat_welcomeBack', { name: kid.name }) });
    else chips(defaultChips(group));
    // Open on the newest message, also once emoji and fonts have finished loading.
    const toEnd = () => { if (alive()) log.scrollTop = log.scrollHeight; };
    requestAnimationFrame(toEnd);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(toEnd);
    if (window.matchMedia && matchMedia('(pointer: fine)').matches && !input.disabled) input.focus({ preventScroll: true });
  }

  // ---------- parents' dashboard ----------
  const unseen = c => (c.chatFlags || []).filter(f => f.t > (c.chatSeen || 0));
  const when = ts => new Date(ts).toLocaleString(I18N.voice(), { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  // Red/amber notice at the top of the child's dashboard when Brainy noticed something new.
  function parentAlert(c) {
    const list = unseen(c);
    if (!list.length) return '';
    const danger = list.some(f => f.level === 'danger');
    return `<div class="card chat-alert ${danger ? 'danger' : 'feelings'}" role="alert">
      <span class="chat-alert-icon" aria-hidden="true">${danger ? '🚩' : '💛'}</span>
      <p>${t('chatp_alert', { name: Art.esc(c.name) })}</p>
      <button type="button" class="btn primary small" data-chat-show>${t('chatp_alertBtn')}</button></div>`;
  }

  function parentCard(c) {
    const name = Art.esc(c.name), on = enabled(c), ch = state(c), flags = (c.chatFlags || []).slice().reverse();
    const week = ch.log.filter(m => m.me && m.t > Date.now() - 7 * 864e5).length;
    const seen = c.chatSeen || 0;
    // While Talk to Brainy is locked for now (IK_CONFIG.limits), there's no on/off switch, but the history stays visible.
    const held = !Store.chatOpen();
    // Under the chat's age (IK_CONFIG.brainyChat.minAge): a short note and no switch. Messages from before an
    // age change in the profile stay visible, so a parent can still read or delete them.
    const young = !forAge(c), n = minAge();
    const head = `<div class="row between chat-parent-head"><h2>💬 ${t('chatp_title')}</h2>
        ${young ? `<span class="lock-chip">🎂 ${t('chat_age', { n })}</span>` : held ? `<span class="lock-chip">🔒 ${t('locked')} · ${t('lim_later')}</span>` : `<button type="button" class="switch${on ? ' on' : ''}" role="switch" aria-checked="${on}" data-chat-toggle>
          <span class="switch-track" aria-hidden="true"><span class="switch-knob"></span></span><span>${on ? t('chatp_on') : t('chatp_offLabel')}</span></button>`}</div>`;
    if (young && !ch.log.length && !flags.length) return `<article class="card chat-parent chat-young" id="brainy-chat-card">${head}<p class="muted">${t('chatp_age', { n, name })}</p></article>`;
    return `<article class="card chat-parent" id="brainy-chat-card">
      ${head}
      ${young ? `<p class="muted">${t('chatp_age', { n, name })}</p>` : `<p class="muted">${t('chatp_desc', { name })}</p>
      <p><b>${t('chatp_week', { n: week, name })}</b></p>`}
      <h3>${t('chatp_flagsTitle', { name })}</h3>
      ${flags.length ? `<ul class="chat-flags">${flags.map(f => `<li class="flag-${f.level}${f.t > seen ? ' new' : ''}"><span class="flag-icon" aria-hidden="true">${f.level === 'danger' ? '🚩' : '💛'}</span>
          <div><b>${t('chatp_flag_' + f.level, { name })}</b><q>${Art.esc(f.text)}</q><small class="muted">${when(f.t)}</small></div></li>`).join('')}</ul>`
        : `<p class="muted">${t('chatp_noFlags')}</p>`}
      ${ch.log.length ? `<details class="chat-history"><summary>${t('chatp_seeChat')}</summary>
          <ol>${ch.log.slice(-60).map(m => `<li class="${m.me ? 'me' : 'brainy'}${m.flag ? ' flag-' + m.flag : ''}"><b>${m.me ? name : 'Brainy'}</b><span>${Art.esc(m.text)}${m.v ? `<span class="msg-visual">${Art.esc(m.v)}</span>` : ''}</span><small class="muted">${when(m.t)}</small></li>`).join('')}</ol></details>
        <div class="row"><button type="button" class="btn ghost small" data-chat-clear>🗑️ ${t('chatp_clear')}</button></div>`
        : `<p class="muted small">${t('chatp_noChat', { name })}</p>`}
    </article>`;
  }

  function bindParent(root, kidId, rerender, toast) {
    const tg = root.querySelector('[data-chat-toggle]');
    if (tg) tg.onclick = () => { Store.updateChild(kidId, c => { c.chatOff = !c.chatOff; }); rerender(); };
    const cl = root.querySelector('[data-chat-clear]');
    if (cl) cl.onclick = () => {
      const c = Store.getChild(kidId);
      if (!c || !confirm(t('chatp_confirmClear', { name: c.name }))) return;
      Store.updateChild(kidId, x => { x.chat = { log: [], day: '', sent: 0 }; x.chatFlags = []; });
      toast(t('chatp_cleared')); rerender();
    };
    const sh = root.querySelector('[data-chat-show]');
    if (sh) sh.onclick = () => {
      const card = root.querySelector('#brainy-chat-card');
      if (!card) return;
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const d = card.querySelector('details'); if (d) d.open = true;
    };
  }
  function markSeen(kidId) { Store.updateChild(kidId, c => { if ((c.chatFlags || []).length) c.chatSeen = Date.now(); }); }

  window.BrainyChat = { render, reply, enabled, forAge, minAge, parentAlert, parentCard, bindParent, markSeen, unseen, _findSum: findSum };
})();
