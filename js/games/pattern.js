/* Pattern finder: what comes next in the sequence? */
Games.pattern = {
  title: 'g_pattern', icon: '🔁',
  start(root, ctx) {
    const sets = [['🔴', '🔵', '🟡', '🟢'], ['🍎', '🍌', '🍇', '🍓'], ['🐶', '🐱', '🐰', '🐻'], ['⭐', '🌙', '☀️', '☁️'], ['🚗', '🚲', '🚂', '✈️']];
    const templates = ctx.difficulty === 1 ? [[0, 1]] : [[0, 1, 2], [0, 0, 1], [0, 1, 1], [0, 1, 2, 1]];
    const total = 5;
    const ui = GK.frame(root, ctx, total);
    GK.rounds(ui, total, (i, done) => {
      ui.say(t('g_pattern_i'), i > 0);
      const units = GK.shuffle(GK.pick(sets));
      const tpl = GK.pick(templates);
      const len = tpl.length * 2 + GK.rand(0, tpl.length - 1);
      const seq = Array.from({ length: len + 1 }, (_, k) => units[tpl[k % tpl.length]]);
      const answer = seq.pop();
      const row = GK.el(`<div class="pattern-row">${seq.map(x => `<span>${x}</span>`).join('')}<span class="pattern-q">?</span></div>`);
      ui.area.appendChild(row);
      // Distractors: prefer items already in the pattern, then a new one.
      const used = [...new Set(tpl.map(k => units[k]))].filter(u => u !== answer);
      const rest = units.filter(u => u !== answer && !used.includes(u));
      const opts = GK.shuffle([answer, ...GK.shuffle(used).concat(rest).slice(0, 2)]);
      let miss = 0;
      const wrap = GK.choices(ui.area, opts.map(x => ({ html: `<span class="emoji-big">${x}</span>`, value: x })), (v, b) => {
        if (v === answer) {
          GK.good(b); row.querySelector('.pattern-q').textContent = answer; row.querySelector('.pattern-q').classList.add('solved');
          wrap.querySelectorAll('button').forEach(x => (x.disabled = true)); done(miss);
        } else { miss++; GK.bad(b); }
      });
    }, ctx.finish);
  }
};
