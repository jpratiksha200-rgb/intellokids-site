/* Memory cards: flip two cards at a time and find all the pairs. */
Games.memory = {
  title: 'g_memory', icon: '🃏',
  start(root, ctx) {
    const pairs = { 1: 3, 2: 4, 3: 6 }[ctx.difficulty] || 4;
    const pool = ['🐶', '🐱', '🦁', '🐸', '🐼', '🦊', '🐵', '🐧', '🦄', '🐢', '🐙', '🦋'];
    const ui = GK.frame(root, ctx, pairs);
    ui.say(t('g_memory_i'));
    const deck = GK.shuffle(GK.sample(pool, pairs).flatMap(e => [e, e]));
    const grid = GK.el(`<div class="memory-grid cols-${pairs >= 6 ? 4 : pairs === 4 ? 4 : 3}"></div>`);
    let open = [], found = 0, misses = 0, lock = false;
    deck.forEach(e => {
      const c = GK.el(`<button type="button" class="mcard"><span class="card-inner"><span class="card-back">?</span><span class="card-front">${e}</span></span></button>`);
      c.dataset.e = e;
      c.onclick = () => {
        if (lock || c.classList.contains('flipped')) return;
        c.classList.add('flipped'); GK.sfx('tap'); open.push(c);
        if (open.length < 2) return;
        const [a, b] = open; open = [];
        if (a.dataset.e === b.dataset.e) {
          setTimeout(() => { GK.good(a); GK.good(b); }, 250);
          found++; ui.progress(found); GK.answered();
          if (found === pairs) {
            const stars = misses <= pairs ? 3 : misses <= pairs * 2 ? 2 : 1;
            setTimeout(() => ctx.finish(stars), 900);
          }
        } else {
          misses++; lock = true; GK.note(a.dataset.e + ' / ' + b.dataset.e); GK.miss();
          setTimeout(() => { a.classList.remove('flipped'); b.classList.remove('flipped'); lock = false; }, 900);
        }
      };
      grid.appendChild(c);
    });
    ui.area.appendChild(grid);
  }
};
