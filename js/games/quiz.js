/* Age-appropriate quiz. Every time it opens, it picks a random mix of question
   types from a large bank, with random numbers, pictures and answer order, and
   avoids repeating questions the child saw recently. */
(function () {
  const recent = []; // signatures of recently asked questions (this session)
  const remember = sig => { recent.push(sig); if (recent.length > 60) recent.shift(); };

  Games.quiz = {
    title: 'g_quiz', icon: '❓',
    start(root, ctx) {
      const group = ctx.group, total = group === 'tiny' ? 5 : group === 'junior' ? 6 : 8;
      const ui = GK.frame(root, ctx, total);
      const R = GK.rand, P = GK.pick;
      const EMOJI = ['🐥', '🍎', '⭐', '🐟', '🌸', '🍓', '🐞', '🚗', '🎈', '🐸', '🍪', '🦋', '🐢', '🍩'];
      const numBtn = x => ({ html: `<span class="num">${x}</span>`, value: x });
      const numOpts = (ans, spread, min, n) => {
        const s = new Set([ans]);
        let guard = 0;
        while (s.size < (n || 3) && guard++ < 100) { const x = ans + R(-spread, spread); if (x >= (min || 0)) s.add(x); }
        return GK.shuffle([...s]).map(numBtn);
      };
      const pics = (e, n) => `<div class="quiz-visual">${e.repeat(n)}</div>`;
      const SIDES = { triangle: 3, square: 4, rectangle: 4, diamond: 4 };

      const bank = {
        count(max) {
          const n = R(1, max), e = P(EMOJI);
          return { sig: 'count' + n + e, q: t('quiz_count'), visual: pics(e, n), opts: numOpts(n, 2, 1), ans: n };
        },
        shape() {
          const pool = group === 'tiny' ? ['circle', 'square', 'triangle', 'star', 'heart'] : Art.SHAPES;
          const s = GK.sample(pool, group === 'tiny' ? 3 : 4), ans = s[0], col = P(Object.values(Art.COLOURS));
          return { sig: 'shape' + ans, q: t('quiz_shape', { shape: t('shape_' + ans) }), opts: GK.shuffle(s).map(x => ({ html: Art.shape(x, col), value: x })), ans, cls: 'shapes' };
        },
        colour() {
          const c = GK.sample(Object.keys(Art.COLOURS), 3), ans = c[0], sh = P(['circle', 'star', 'heart', 'square']);
          return { sig: 'col' + ans, q: t('quiz_colour', { colour: t('col_' + ans) }), opts: GK.shuffle(c).map(x => ({ html: Art.shape(sh, Art.COLOURS[x]), value: x })), ans, cls: 'shapes' };
        },
        more(max) {
          const [e1, e2] = GK.sample(EMOJI, 2);
          let a = R(1, max), b = R(1, max); while (b === a) b = R(1, max);
          const opts = GK.shuffle([[e1, a], [e2, b]]).map(([e, n]) => ({ html: `<span class="emo-set">${e.repeat(n)}</span>`, value: n }));
          return { sig: 'more' + a + b, q: t('quiz_more'), opts, ans: Math.max(a, b), cls: 'sets' };
        },
        fewer(max) {
          const [e1, e2] = GK.sample(EMOJI, 2);
          let a = R(1, max), b = R(1, max); while (b === a) b = R(1, max);
          const opts = GK.shuffle([[e1, a], [e2, b]]).map(([e, n]) => ({ html: `<span class="emo-set">${e.repeat(n)}</span>`, value: n }));
          return { sig: 'fewer' + a + b, q: t('quiz_fewer'), opts, ans: Math.min(a, b), cls: 'sets' };
        },
        oddEmoji() {
          const [same, odd] = GK.sample(EMOJI, 2);
          const items = GK.shuffle([same, same, same, odd]).map((e, i) => ({ html: `<span class="num">${e}</span>`, value: e === odd ? 'odd' : 'same' + i }));
          return { sig: 'odd' + same + odd, q: t('quiz_oddone'), opts: items, ans: 'odd' };
        },
        sides() {
          const shape = P(Object.keys(SIDES)), n = SIDES[shape];
          return { sig: 'sides' + shape, q: t('quiz_sides', { shape: t('shape_' + shape) }), visual: `<div class="quiz-shape">${Art.shape(shape, Art.COLOURS.yellow)}</div>`, opts: numOpts(n, 2, 0), ans: n };
        },
        next(max) { const n = R(1, max); return { sig: 'next' + n, q: t('quiz_next', { n }), opts: numOpts(n + 1, 2, 1), ans: n + 1 }; },
        before(max) { const n = R(2, max); return { sig: 'before' + n, q: t('quiz_before', { n }), opts: numOpts(n - 1, 2, 0), ans: n - 1 }; },
        bigger(max) {
          const list = GK.sample([...Array(max).keys()].map(x => x + 1), group === 'explorer' ? 3 : 2);
          return { sig: 'big' + list.join(), q: t('quiz_bigger'), opts: GK.shuffle(list).map(numBtn), ans: Math.max(...list) };
        },
        smaller(max) {
          const list = GK.sample([...Array(max).keys()].map(x => x + 1), group === 'explorer' ? 3 : 2);
          return { sig: 'small' + list.join(), q: t('quiz_smaller'), opts: GK.shuffle(list).map(numBtn), ans: Math.min(...list) };
        },
        sum(maxA, maxB) { const a = R(1, maxA), b = R(1, maxB); return { sig: 'sum' + a + '+' + b, q: t('quiz_sum', { a, b }), opts: numOpts(a + b, 3, 0), ans: a + b }; },
        sub(maxA) { const a = R(3, maxA), b = R(1, a - 1); return { sig: 'sub' + a + '-' + b, q: t('quiz_sub', { a, b }), opts: numOpts(a - b, 3, 0), ans: a - b }; },
        mul(maxA, maxB) { const a = R(2, maxA), b = R(2, maxB); return { sig: 'mul' + a + 'x' + b, q: t('quiz_mul', { a, b }), opts: numOpts(a * b, 5, 0, 4), ans: a * b }; },
        div() { const b = R(2, 10), ans = R(2, 10), a = b * ans; return { sig: 'div' + a + '/' + b, q: t('quiz_div', { a, b }), opts: numOpts(ans, 3, 1, 4), ans }; },
        double(max) { const n = R(1, max); return { sig: 'dbl' + n, q: t('quiz_double', { n }), opts: numOpts(n * 2, 3, 0), ans: n * 2 }; },
        half(max) { const ans = R(1, max), n = ans * 2; return { sig: 'half' + n, q: t('quiz_half', { n }), opts: numOpts(ans, 3, 0), ans }; },
        missing(max) { const a = R(1, max), b = R(1, max), c = a + b; return { sig: 'miss' + a + '_' + c, q: t('quiz_missing', { a, c }), opts: numOpts(b, 3, 0), ans: b }; },
        even() {
          const evenN = R(1, 25) * 2, odds = GK.sample([...Array(25).keys()].map(x => x * 2 + 1), 2);
          return { sig: 'even' + evenN, q: t('quiz_even'), opts: GK.shuffle([evenN, ...odds]).map(numBtn), ans: evenN };
        },
        tens() { const n = R(11, 99); return { sig: 'tens' + n, q: t('quiz_tens', { n }), opts: numOpts(Math.floor(n / 10), 2, 0), ans: Math.floor(n / 10) }; },

        // ---- Picture questions (no reading or counting needed) ----
        kind() {
          const K = { animal: ['🐶', '🐱', '🐰', '🐻', '🦁', '🐸', '🐵', '🐮'], fruit: ['🍎', '🍌', '🍇', '🍓', '🍐', '🍉', '🍒', '🍑'], vehicle: ['🚗', '🚌', '🚲', '✈️', '🚀', '🚂', '⛵', '🚁'] };
          const k = P(Object.keys(K)), others = Object.keys(K).filter(x => x !== k);
          const ans = P(K[k]), opts = GK.shuffle([ans, ...GK.sample(K[others[0]], 1), ...GK.sample(K[others[1]], group === 'tiny' ? 1 : 2)]);
          return { sig: 'kind' + k + ans, q: t('quiz_' + k), opts: opts.map(e => ({ html: `<span class="num">${e}</span>`, value: e })), ans };
        },
        yesNoSet(key, yes, no) {
          const ans = P(yes), opts = GK.shuffle([ans, ...GK.sample(no, group === 'tiny' ? 2 : 3)]);
          return { sig: key + ans, q: t(key), opts: opts.map(e => ({ html: `<span class="num">${e}</span>`, value: e })), ans };
        },
        fly() { return bank.yesNoSet('quiz_fly', ['🐦', '🦋', '✈️', '🐝', '🦅', '🚁', '🦉'], ['🐶', '🐟', '🚗', '🐢', '🐘', '🐌', '🐄']); },
        water() { return bank.yesNoSet('quiz_water', ['🐟', '🐳', '🐙', '🐬', '🦀', '🐠', '🦈'], ['🐶', '🐮', '🦁', '🐔', '🐴', '🐿️', '🐑']); },
        hot() { return bank.yesNoSet('quiz_hot', ['🔥', '☀️', '☕', '🌶️', '🌋'], ['❄️', '🧊', '⛄', '🍦', '🐧']); },
        cold() { return bank.yesNoSet('quiz_cold', ['❄️', '🧊', '⛄', '🍦', '🐧'], ['🔥', '☀️', '☕', '🌶️', '🌋']); },
        bigAnimal() {
          const SIZE = [['🐭', 1], ['🐥', 1], ['🐰', 2], ['🐱', 2], ['🐶', 3], ['🐑', 4], ['🐴', 5], ['🦁', 5], ['🦒', 6], ['🐘', 7], ['🐳', 8]];
          const [a, b] = GK.sample(SIZE.filter((x, i, arr) => true), 2); if (a[1] === b[1]) return bank.bigAnimal();
          const ans = a[1] > b[1] ? a[0] : b[0];
          return { sig: 'big' + a[0] + b[0], q: t('quiz_bigAnimal'), opts: GK.shuffle([a[0], b[0]]).map(e => ({ html: `<span class="num">${e}</span>`, value: e })), ans };
        },
        colourOf() {
          const THINGS = [['🍌', 'yellow'], ['🍎', 'red'], ['🐸', 'green'], ['🍊', 'orange'], ['🍇', 'purple'], ['🐷', 'pink'], ['🐳', 'blue'], ['🌻', 'yellow'], ['🍓', 'red'], ['🥦', 'green']];
          const [e, col] = P(THINGS), opts = GK.shuffle([col, ...GK.sample(Object.keys(Art.COLOURS).filter(c => c !== col), 2)]);
          return { sig: 'colof' + e, q: t('quiz_colourOf'), visual: `<div class="quiz-visual">${e}</div>`, opts: opts.map(c => ({ html: Art.shape('circle', Art.COLOURS[c]), value: c, label: t('col_' + c) })), ans: col, cls: 'shapes' };
        },
        sound() {
          const S = [['cow', '🐮'], ['dog', '🐶'], ['cat', '🐱'], ['duck', '🦆'], ['sheep', '🐑'], ['lion', '🦁']];
          const [k, ans] = P(S), opts = GK.shuffle([ans, ...GK.sample(S.filter(x => x[0] !== k).map(x => x[1]), 2)]);
          return { sig: 'snd' + k, q: t('quiz_says', { sound: t('snd_' + k) }), opts: opts.map(e => ({ html: `<span class="num">${e}</span>`, value: e })), ans };
        },
        pair() {
          const PAIRS = [['🧦', '👟'], ['🔑', '🔒'], ['🐝', '🌸'], ['🪥', '🦷'], ['🐶', '🦴'], ['🐰', '🥕'], ['☔', '🌧️'], ['🐒', '🍌'], ['✏️', '📒'], ['🍳', '🥚']];
          const [a, ans] = P(PAIRS), opts = GK.shuffle([ans, ...GK.sample(PAIRS.filter(p => p[1] !== ans).map(p => p[1]), 2)]);
          return { sig: 'pair' + a, q: t('quiz_pair'), visual: `<div class="quiz-visual">${a}</div>`, opts: opts.map(e => ({ html: `<span class="num">${e}</span>`, value: e })), ans };
        },
        emojiPattern() {
          const [x, y, z] = GK.sample(['🍎', '🍌', '⭐', '🐟', '🌸', '🚗', '🎈', '🐸'], 3);
          const T = P(group === 'tiny' ? [[x, y]] : [[x, y], [x, x, y], [x, y, z]]);
          const shown = Array.from({ length: T.length * 2 }, (_, i) => T[i % T.length]), ans = T[shown.length % T.length];
          const opts = GK.shuffle([ans, ...[x, y, z].filter(v => v !== ans)].slice(0, 3));
          return { sig: 'pat' + shown.join(''), q: t('quiz_patternNext'), visual: `<div class="quiz-visual">${shown.join(' ')} ❓</div>`, opts: opts.map(e => ({ html: `<span class="num">${e}</span>`, value: e })), ans };
        },
        // ---- Thinking questions for older children ----
        wordMul(max) { const a = R(2, max), b = R(2, max), e = P(['🍎', '🍪', '⭐', '🎈', '🧁']); return { sig: 'wm' + a + b, q: t('quiz_wpMul', { a, b, e }), opts: numOpts(a * b, 5, 0, 4), ans: a * b }; },
        wordAdd(max) { const a = R(2, max), b = R(1, max), e = P(['🐟', '🌸', '🐞', '🍓', '🚗']); return { sig: 'wa' + a + b, q: t('quiz_wpAdd', { a, b, e }), opts: numOpts(a + b, 3, 0), ans: a + b }; },
        wordSub(max) { const a = R(4, max), b = R(1, a - 1), e = P(['🍬', '🎈', '🍪', '⭐']); return { sig: 'ws' + a + b, q: t('quiz_wpSub', { a, b, e }), opts: numOpts(a - b, 3, 0), ans: a - b }; },
        fraction() {
          const F = [[1, 2], [1, 3], [1, 4], [3, 4], [2, 3]].filter(([n, dd]) => group === 'explorer' || dd <= 4 && n === 1);
          const [n, dd] = P(F), ans = n + '/' + dd;
          const slices = Array.from({ length: dd }, (_, i) => { const a0 = i / dd * 2 * Math.PI - Math.PI / 2, a1 = (i + 1) / dd * 2 * Math.PI - Math.PI / 2;
            return `<path d="M50 50 L${50 + 40 * Math.cos(a0)} ${50 + 40 * Math.sin(a0)} A40 40 0 ${dd === 1 ? 1 : 0} 1 ${50 + 40 * Math.cos(a1)} ${50 + 40 * Math.sin(a1)} Z" fill="${i < n ? '#FFD21F' : '#fff'}" stroke="#0E6E7E" stroke-width="2.5"/>`; }).join('');
          const opts = GK.shuffle([...new Set([ans, ...GK.sample(['1/2', '1/3', '1/4', '3/4', '2/3'].filter(x => x !== ans), 3)])].slice(0, 4));
          return { sig: 'frac' + ans, q: t('quiz_fraction'), visual: `<div class="quiz-visual"><svg viewBox="0 0 100 100" width="130" height="130">${slices}</svg></div>`, opts: opts.map(x => ({ html: `<span class="num">${x}</span>`, value: x })), ans };
        },
        seq() {
          const step = P(group === 'explorer' ? [2, 3, 5, 10, 4] : [1, 2, 10]), start = R(0, group === 'explorer' ? 30 : 10);
          const s = [0, 1, 2, 3].map(i => start + i * step), ans = start + 4 * step;
          return { sig: 'seq' + start + step, q: t('quiz_seq', { s: s.join(', ') + ', ?' }), opts: numOpts(ans, step + 2, 0, 4), ans };
        },
        mult5() {
          const ans = R(1, 12) * 5, wrong = GK.sample([...Array(60).keys()].filter(x => x > 0 && x % 5 !== 0), 3);
          return { sig: 'm5' + ans, q: t('quiz_mult5'), opts: GK.shuffle([ans, ...wrong]).map(numBtn), ans };
        }
      };

      // Question types per age group, with age-appropriate number ranges.
      // Number ranges grow with the child's age and progress (ctx.level 0–1), so it stays fair.
      const lv = typeof ctx.level === 'number' ? ctx.level : 0.3;
      const S = (a, b) => Math.round(a + (b - a) * lv);
      const pools = {
        tiny: [() => bank.count(S(3, 7)), bank.shape, bank.colour, () => bank.more(S(4, 7)), () => bank.fewer(S(4, 7)), bank.oddEmoji, () => bank.next(S(4, 9)), () => bank.count(S(3, 6)),
          bank.kind, bank.fly, bank.water, bank.bigAnimal, bank.colourOf, bank.sound, bank.pair, bank.emojiPattern, bank.hot, bank.cold],
        junior: [() => bank.count(S(6, 12)), () => bank.sum(S(4, 9), S(4, 9)), () => bank.sub(S(8, 20)), () => bank.next(S(12, 50)), () => bank.before(S(12, 50)), () => bank.bigger(S(15, 50)), () => bank.smaller(S(15, 50)),
          bank.shape, bank.sides, bank.oddEmoji, () => bank.double(S(4, 10)), () => bank.missing(S(4, 10)), () => bank.more(S(6, 10)),
          bank.kind, bank.sound, bank.pair, bank.emojiPattern, bank.hot, bank.cold, bank.water, () => bank.wordAdd(S(5, 10)), () => bank.wordSub(S(6, 12)), bank.seq, bank.fraction],
        explorer: [() => bank.sum(S(20, 90), S(15, 60)), () => bank.sub(S(30, 120)), () => bank.mul(S(5, 12), S(5, 12)), bank.div, () => bank.bigger(S(100, 1000)), () => bank.smaller(S(100, 1000)),
          () => bank.double(S(15, 60)), () => bank.half(S(10, 50)), () => bank.missing(S(15, 60)), bank.even, bank.tens, bank.sides, () => bank.before(S(100, 1000)), () => bank.next(S(99, 999)),
          () => bank.wordMul(S(4, 9)), () => bank.wordAdd(S(20, 80)), () => bank.wordSub(S(20, 90)), bank.fraction, bank.seq, bank.mult5, bank.emojiPattern]
      }[group];
      // 3-year-olds can't count yet: only picture questions (shapes, colours, odd one out, more/fewer by looking).
      if (ctx.age && ctx.age <= 3) pools.splice(0, pools.length, bank.shape, bank.colour, bank.oddEmoji, () => bank.more(4), () => bank.fewer(4),
        bank.kind, bank.fly, bank.water, bank.bigAnimal, bank.colourOf, bank.sound, bank.pair, bank.emojiPattern);

      // A different random mix of question types every time.
      let order = GK.shuffle(pools.map((_, i) => i));
      while (order.length < total) order = order.concat(GK.shuffle(pools.map((_, i) => i)));
      const plan = order.slice(0, total);
      const asked = new Set();
      const makeQ = i => {
        let Q, tries = 0;
        do { Q = pools[plan[i]](); } while ((asked.has(Q.sig) || recent.includes(Q.sig)) && ++tries < 15);
        asked.add(Q.sig); remember(Q.sig);
        return Q;
      };

      GK.rounds(ui, total, (i, done) => {
        const Q = makeQ(i);
        ui.area.appendChild(GK.el(`<div class="quiz-count">${t('questionOf', { i: i + 1, n: total })}</div>`));
        ui.say(Q.q);
        if (Q.visual) ui.area.appendChild(GK.el(Q.visual));
        let miss = 0;
        const wrap = GK.choices(ui.area, Q.opts, (v, b) => {
          if (v === Q.ans) { GK.good(b); wrap.querySelectorAll('button').forEach(x => (x.disabled = true)); done(miss); }
          else { miss++; GK.bad(b); }
        }, Q.cls || 'numbers');
      }, ctx.finish);
    }
  };
})();
