/* Big and small: tap the biggest or the smallest. */
Games.bigsmall = {
  title: 'g_bigsmall', icon: '🐘',
  start(root, ctx) {
    const items = ['🐘', '🐶', '🍉', '🚌', '🌳', '🐻', '🦒', '🍎', '🐳', '🏠'];
    const n = ctx.difficulty === 1 ? 2 : 3, total = 5;
    const ui = GK.frame(root, ctx, total);
    GK.rounds(ui, total, (i, done) => {
      const askBig = Math.random() < 0.5;
      const emoji = GK.pick(items);
      const sizes = n === 2 ? [44, 110] : [40, 72, 112];
      const opts = GK.shuffle(sizes.map((s, k) => ({ s, k })));
      const want = askBig ? sizes.length - 1 : 0;
      ui.say(t(askBig ? 'g_big_i' : 'g_small_i'));
      let miss = 0;
      const wrap = GK.choices(ui.area, opts.map(o => ({ html: `<span style="font-size:${o.s}px;line-height:1">${emoji}</span>`, value: o.k })), (v, b) => {
        if (v === want) { GK.good(b); wrap.querySelectorAll('button').forEach(x => (x.disabled = true)); done(miss); }
        else { miss++; GK.bad(b); }
      }, 'sizes');
    }, ctx.finish);
  }
};
