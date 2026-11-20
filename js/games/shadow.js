/* Shadow match: which shadow belongs to the picture? Harder levels use look-alike shapes. */
Games.shadow = {
  title: 'g_shadow', icon: '👤',
  start(root, ctx) {
    const d = ctx.difficulty, total = 5, n = d === 1 ? 3 : 4;
    const SETS = [
      ['🐶', '🐱', '🐰', '🐻', '🐼', '🦊', '🐸', '🐵', '🦁', '🐯', '🐮', '🐷'],
      ['🐘', '🦒', '🦓', '🦘', '🐪', '🦏', '🐄', '🐎'],
      ['🍎', '🍌', '🍇', '🍓', '🍐', '🍉', '🥕', '🌽'],
      ['🚗', '🚌', '🚲', '✈️', '🚀', '🚂', '⛵', '🚁'],
      ['🦋', '🐞', '🐝', '🐢', '🐌', '🐙', '🐳', '🦀'],
      ['⭐', '❤️', '🌙', '☀️', '☁️', '🌸', '🍄', '🎈']
    ];
    const ui = GK.frame(root, ctx, total);
    let last = null;
    GK.rounds(ui, total, (i, done) => {
      ui.say(t('g_shadow_i'), i > 0);
      // Easy: mix sets (very different shapes). Harder: all options from one set (look-alikes).
      const set = GK.pick(SETS);
      let target; do { target = GK.pick(set); } while (target === last); last = target;
      const pool = d === 1 ? SETS.flat().filter(e => e !== target && !set.includes(e)) : set.filter(e => e !== target);
      const opts = GK.shuffle([target, ...GK.sample(pool, n - 1)]);
      GK.note(target);
      ui.area.appendChild(GK.el(`<div class="shadow-target">${target}</div>`));
      let miss = 0;
      const wrap = GK.choices(ui.area, opts.map(e => ({ html: `<span class="shadow-emo">${e}</span>`, value: e })), (v, b) => {
        if (v === target) { GK.good(b); b.querySelector('.shadow-emo').classList.add('revealed'); wrap.querySelectorAll('button').forEach(x => (x.disabled = true)); done(miss); }
        else { miss++; GK.bad(b); }
      }, 'shapes');
    }, ctx.finish);
  }
};
