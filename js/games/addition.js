/* Adding up with pictures. */
Games.addition = {
  title: 'g_addition', icon: '➕',
  start(root, ctx) {
    const max = ctx.difficulty === 1 ? 5 : 10;
    const items = ['🍎', '🐥', '⭐', '🍪', '🌸', '🐟'];
    const total = 5;
    const ui = GK.frame(root, ctx, total);
    GK.rounds(ui, total, (i, done) => {
      ui.say(t('g_addition_i'), i > 0);
      const a = GK.rand(1, max - 1), b = GK.rand(1, max - a), sum = a + b, e = GK.pick(items);
      GK.note(`${a} + ${b} = ${sum}`);
      ui.area.appendChild(GK.el(`<div class="sum-row"><span class="group">${e.repeat(a)}</span><span class="op">+</span><span class="group">${e.repeat(b)}</span><span class="op">=</span><span class="op">?</span></div>`));
      const opts = new Set([sum]);
      while (opts.size < 3) { const x = sum + GK.pick([-2, -1, 1, 2]); if (x >= 1) opts.add(x); }
      let miss = 0;
      const wrap = GK.choices(ui.area, GK.shuffle([...opts]).map(x => ({ html: `<span class="num">${x}</span>`, value: x })), (v, btn) => {
        if (v === sum) { GK.good(btn); GK.speak(`${a} + ${b} = ${sum}`); wrap.querySelectorAll('button').forEach(x => (x.disabled = true)); done(miss); }
        else { miss++; GK.bad(btn); }
      }, 'numbers');
    }, ctx.finish);
  }
};
