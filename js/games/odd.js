/* Odd one out: three things belong together, one does not. */
Games.odd = {
  title: 'g_odd', icon: '🔍',
  start(root, ctx) {
    const easy = [['🍎', '🍌', '🍇', '🍓', '🍐', '🍊'], ['🐶', '🐱', '🐰', '🐻', '🐸', '🐵'], ['🚗', '🚌', '🚲', '🚂', '🚜', '🚕'], ['⚽', '🏀', '🎾', '🏈', '🏐', '⚾'], ['☀️', '🌧️', '⛅', '❄️', '🌈', '⚡']];
    const hard = easy.concat([['🐮', '🐷', '🐔', '🐑', '🐴', '🦆'], ['🐙', '🐟', '🐬', '🦀', '🐳', '🦈'], ['🥕', '🥦', '🌽', '🍆', '🥔', '🫑'], ['✏️', '📏', '✂️', '📚', '🖍️', '📐']]);
    const cats = ctx.difficulty === 1 ? easy : hard;
    const total = 5;
    const ui = GK.frame(root, ctx, total);
    GK.rounds(ui, total, (i, done) => {
      ui.say(t('g_odd_i'), i > 0);
      const [a, b] = GK.sample(cats, 2);
      const odd = GK.pick(b);
      const items = GK.shuffle([...GK.sample(a, 3), odd]);
      let miss = 0;
      const wrap = GK.choices(ui.area, items.map(x => ({ html: `<span class="emoji-big">${x}</span>`, value: x })), (v, btn) => {
        if (v === odd) { GK.good(btn); wrap.querySelectorAll('button').forEach(x => (x.disabled = true)); done(miss); }
        else { miss++; GK.bad(btn); }
      }, 'grid4');
    }, ctx.finish);
  }
};
