/* Colour match: pop the balloon of the colour Brainy asks for. */
Games.colours = {
  title: 'g_colours', icon: '🎈',
  start(root, ctx) {
    const d = ctx.difficulty;
    const pool = d === 1 ? ['red', 'blue', 'yellow', 'green'] : Object.keys(Art.COLOURS);
    const n = d === 1 ? 3 : 5, total = 5;
    const ui = GK.frame(root, ctx, total);
    let last = null;
    GK.rounds(ui, total, (i, done) => {
      let target;
      do { target = GK.pick(pool); } while (target === last);
      last = target;
      const opts = GK.shuffle([target, ...GK.sample(pool.filter(c => c !== target), n - 1)]);
      ui.say(t('g_colours_i', { colour: t('col_' + target) }));
      let miss = 0;
      const wrap = GK.choices(ui.area, opts.map(c => ({ html: Art.balloon(Art.COLOURS[c]), value: c, label: t('col_' + c) })), (v, b) => {
        if (v === target) {
          GK.sfx('pop'); b.classList.add('popped'); wrap.querySelectorAll('button').forEach(x => (x.disabled = true));
          GK.speak(t('col_' + target)); done(miss);
        } else { miss++; GK.bad(b); }
      }, 'balloons');
    }, ctx.finish);
  }
};
