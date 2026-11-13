/* Connect the dots: tap the numbers in order. Older children count in 2s or 5s. */
Games.dots = {
  title: 'g_dots', icon: '🔗',
  start(root, ctx) {
    const d = ctx.difficulty, g = ctx.group, total = 2;
    const count = g === 'tiny' ? [5, 6, 8][d - 1] : g === 'junior' ? [8, 10, 12][d - 1] : [10, 12, 15][d - 1];
    const step = g === 'explorer' ? [1, 2, 5][d - 1] : g === 'junior' && d === 3 ? 2 : 1;
    const ui = GK.frame(root, ctx, total);
    GK.rounds(ui, total, (round, done) => {
      ui.say(step > 1 ? t('g_dots_i2', { n: step }) : t('g_dots_i'), round > 0);
      // Random, well-spaced positions (percent of the board).
      const pts = [];
      let guard = 0;
      while (pts.length < count && guard++ < 4000) {
        const p = [8 + Math.random() * 84, 8 + Math.random() * 84];
        if (pts.every(q => Math.hypot(q[0] - p[0], q[1] - p[1]) > 15)) pts.push(p);
      }
      const nums = pts.map((_, k) => (k + 1) * step);
      const board = GK.el(`<div class="dots-board"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg></div>`);
      const svg = board.querySelector('svg');
      let next = 0, miss = 0;
      pts.forEach((p, k) => {
        const b = GK.el(`<button type="button" class="dot" style="left:${p[0]}%;top:${p[1]}%">${nums[k]}</button>`);
        b.onclick = () => {
          if (k !== next) { miss++; GK.bad(b); return; }
          GK.sfx('pop'); b.classList.add('on'); b.disabled = true;
          if (k > 0) svg.insertAdjacentHTML('beforeend', `<line x1="${pts[k - 1][0]}" y1="${pts[k - 1][1]}" x2="${p[0]}" y2="${p[1]}"/>`);
          next++;
          if (next === pts.length) { GK.good(board); done(miss); }
        };
        board.appendChild(b);
      });
      ui.area.appendChild(board);
    }, ctx.finish);
  }
};
