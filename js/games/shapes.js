/* Learn shapes (ages 3–4, harder levels add more shapes). */
Games.shapes = {
  title: 'g_shapes', icon: '🔺',
  start(root, ctx) {
    const d = ctx.difficulty;
    const pool = d === 1 ? ['circle', 'square', 'triangle']
      : d === 2 ? ['circle', 'square', 'triangle', 'star', 'heart', 'rectangle']
      : Art.SHAPES;
    const n = d === 1 ? 3 : 4, total = 5;
    const ui = GK.frame(root, ctx, total);
    let last = null;
    GK.rounds(ui, total, (i, done) => {
      let target;
      do { target = GK.pick(pool); } while (target === last);
      last = target;
      const opts = GK.shuffle([target, ...GK.sample(pool.filter(s => s !== target), n - 1)]);
      const cols = GK.sample(Object.values(Art.COLOURS), n);
      ui.say(t('g_shapes_i', { shape: t('shape_' + target) }));
      let miss = 0;
      const wrap = GK.choices(ui.area, opts.map((s, k) => ({ html: Art.shape(s, cols[k]), value: s, label: t('shape_' + s) })), (v, b) => {
        if (v === target) {
          GK.good(b); wrap.querySelectorAll('button').forEach(x => (x.disabled = true));
          done(miss);
        } else { miss++; GK.bad(b); }
      }, 'shapes');
    }, ctx.finish);
  }
};
