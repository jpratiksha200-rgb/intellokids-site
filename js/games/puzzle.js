/* Picture puzzle: a colourful picture is cut into pieces and mixed up. Tap two pieces to swap them.
   2×2 (easy) → 3×3 → 4×4 (tricky, older children). A different random picture and colours every time. */
Games.puzzle = {
  title: 'g_puzzle', icon: '🖼️',
  start(root, ctx) {
    const d = ctx.difficulty;
    const n = ctx.group === 'tiny' ? [2, 2, 3][d - 1] : ctx.group === 'junior' ? [2, 3, 3][d - 1] : [3, 3, 4][d - 1];
    const ui = GK.frame(root, ctx, 1);
    const PAL = ['#EF4444', '#FB923C', '#FFD21F', '#5CCB6F', '#14B8A6', '#3ED8E8', '#3B82F6', '#A855F7', '#F472B6', '#F9D7B5', '#8D5524'];
    GK.rounds(ui, 1, (round, done) => {
      ui.say(t('g_puzzle_i'));
      // Colour a random catalog picture with random colours.
      const keys = Object.keys(Colouring.PICS), pic = GK.pick(keys);
      const tmp = document.createElement('div');
      tmp.innerHTML = `<svg viewBox="0 0 300 300">${Colouring.PICS[pic].svg}</svg>`;
      tmp.querySelectorAll('[data-r]').forEach(r => r.setAttribute('fill', GK.pick(PAL)));
      const art = tmp.querySelector('svg').innerHTML, sz = 300 / n;
      const bg = `<rect width="300" height="300" fill="#FFF9E6"/>`;
      const tile = k => `<svg viewBox="${(k % n) * sz} ${Math.floor(k / n) * sz} ${sz} ${sz}">${bg}${art}</svg>`;
      // Shuffle until it is actually mixed up.
      let order; do { order = GK.shuffle([...Array(n * n).keys()]); } while (order.every((v, i) => v === i));
      const wrapEl = GK.el(`<div class="puzzle-wrap"><div class="puzzle" style="--n:${n}"></div><div class="puzzle-preview" title="${t('pic_' + pic)}"><svg viewBox="0 0 300 300">${bg}${art}</svg></div></div>`);
      const grid = wrapEl.querySelector('.puzzle');
      let sel = null, swaps = 0;
      const draw = () => {
        grid.innerHTML = order.map((k, i) => `<button type="button" class="pz ${k === i ? 'ok' : ''} ${sel === i ? 'sel' : ''}" data-i="${i}">${tile(k)}</button>`).join('');
      };
      draw();
      grid.addEventListener('click', e => {
        const b = e.target.closest('.pz'); if (!b) return;
        const i = +b.dataset.i;
        if (sel === null) { sel = i; GK.sfx('tap'); draw(); return; }
        if (sel !== i) { [order[sel], order[i]] = [order[i], order[sel]]; swaps++; GK.sfx('pop'); }
        sel = null; draw();
        if (order.every((v, k) => v === k)) {
          grid.classList.add('solved'); GK.good(grid);
          // Fewer swaps = more stars (a perfect solve needs at most n*n - 1 swaps).
          done(swaps <= n * n ? 0 : swaps <= n * n * 2 ? 1 : 3);
        }
      });
      ui.area.appendChild(wrapEl);
    }, ctx.finish);
  }
};
