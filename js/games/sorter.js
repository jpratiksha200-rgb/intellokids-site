/* Shape sorter: drag (or tap then tap) each shape into its matching hole. */
Games.sorter = {
  title: 'g_sorter', icon: '🧩',
  start(root, ctx) {
    const d = ctx.difficulty;
    const pool = d === 1 ? ['circle', 'square', 'triangle', 'star'] : Art.SHAPES;
    const perRound = d === 1 ? 3 : 4, total = d === 1 ? 2 : 3;
    const ui = GK.frame(root, ctx, total);

    GK.rounds(ui, total, (i, done) => {
      ui.say(t('g_sorter_i'), i > 0);
      const set = GK.sample(pool, perRound);
      const cols = GK.sample(Object.values(Art.COLOURS), perRound);
      const holes = GK.el(`<div class="sorter-holes"></div>`);
      const pieces = GK.el(`<div class="sorter-pieces"></div>`);
      GK.shuffle(set).forEach(s => holes.appendChild(GK.el(`<div class="hole" data-shape="${s}">${Art.shape(s, '', true)}</div>`)));
      set.forEach((s, k) => pieces.appendChild(GK.el(`<button type="button" class="piece" data-shape="${s}" aria-label="${t('shape_' + s)}">${Art.shape(s, cols[k])}</button>`)));
      ui.area.append(holes, pieces);

      let miss = 0, placed = 0, selected = null;

      function tryPlace(piece, hole) {
        if (!hole || hole.classList.contains('filled')) return false;
        if (hole.dataset.shape === piece.dataset.shape) {
          GK.good(hole); hole.classList.add('filled');
          hole.innerHTML = piece.innerHTML; piece.remove();
          GK.speak(t('shape_' + piece.dataset.shape));
          if (++placed === perRound) done(miss);
        } else { miss++; GK.bad(hole); GK.bad(piece); }
        return true;
      }

      pieces.querySelectorAll('.piece').forEach(piece => {
        let sx = 0, sy = 0, moved = false, dragging = false;
        piece.addEventListener('pointerdown', e => {
          e.preventDefault(); dragging = true; moved = false; sx = e.clientX; sy = e.clientY;
          try { piece.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
          piece.classList.add('dragging');
        });
        piece.addEventListener('pointermove', e => {
          if (!dragging) return;
          const dx = e.clientX - sx, dy = e.clientY - sy;
          if (Math.abs(dx) + Math.abs(dy) > 8) moved = true;
          piece.style.transform = `translate(${dx}px, ${dy}px) scale(1.1)`;
        });
        const end = e => {
          if (!dragging) return;
          dragging = false; piece.classList.remove('dragging'); piece.style.transform = '';
          if (moved) {
            const hole = document.elementsFromPoint(e.clientX, e.clientY).map(x => x.closest && x.closest('.hole')).find(Boolean);
            tryPlace(piece, hole);
          } else {
            // Tap mode: select the piece, then tap a hole.
            pieces.querySelectorAll('.piece').forEach(p => p.classList.remove('selected'));
            selected = piece; piece.classList.add('selected'); GK.sfx('tap');
          }
        };
        piece.addEventListener('pointerup', end);
        piece.addEventListener('pointercancel', end);
      });

      holes.addEventListener('click', e => {
        const hole = e.target.closest('.hole');
        if (selected && hole) { const p = selected; selected = null; p.classList.remove('selected'); tryPlace(p, hole); }
      });
    }, ctx.finish);
  }
};
