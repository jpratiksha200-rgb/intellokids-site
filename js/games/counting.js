/* Count with Brainy: tap each item to count it, then pick the number. */
Games.counting = {
  title: 'g_counting', icon: '🔢',
  start(root, ctx) {
    const d = ctx.difficulty;
    const [lo, hi] = d === 1 ? [1, 5] : [3, 10];
    const items = ['🍎', '🐟', '⭐', '🐥', '🌸', '🍓', '🐞', '🚗', '🎈', '🐸'];
    const total = 5;
    const ui = GK.frame(root, ctx, total);
    let last = 0;
    GK.rounds(ui, total, (i, done) => {
      let n;
      do { n = GK.rand(lo, hi); } while (n === last);
      last = n;
      const emoji = GK.pick(items);
      ui.say(t('g_counting_i'), i > 0);
      GK.note(n + ' ' + emoji);
      const field = GK.el(`<div class="count-field"></div>`);
      let counted = 0;
      for (let k = 0; k < n; k++) {
        const b = GK.el(`<button type="button" class="count-item">${emoji}</button>`);
        b.onclick = () => {
          if (b.classList.contains('counted')) return;
          counted++; b.classList.add('counted'); b.dataset.n = counted;
          GK.sfx('tap'); GK.speak(String(counted));
        };
        field.appendChild(b);
      }
      ui.area.appendChild(field);
      const opts = new Set([n]);
      while (opts.size < 3) { const x = n + GK.pick([-2, -1, 1, 2]); if (x >= 1 && x <= hi + 2) opts.add(x); }
      let miss = 0;
      const wrap = GK.choices(ui.area, GK.shuffle([...opts]).map(x => ({ html: `<span class="num">${x}</span>`, value: x })), (v, b) => {
        if (v === n) { GK.good(b); wrap.querySelectorAll('button').forEach(x => (x.disabled = true)); GK.speak(String(n)); done(miss); }
        else { miss++; GK.bad(b); }
      }, 'numbers');
    }, ctx.finish);
  }
};
