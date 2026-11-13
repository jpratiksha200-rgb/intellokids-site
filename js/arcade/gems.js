/* Gem Garden (age 7): swap two neighbouring garden gems to make a row of 3 or more of the same kind.
 * Collect enough gems before the moves run out. Stars: moves left ≥ 6 → 3, ≥ 2 → 2, else 1.
 * Higher levels: more gems to collect, a sixth gem kind (level 6+), fewer moves (level 10+).
 * Controls: tap a gem then a neighbour, or swipe a gem; keyboard: arrows move the yellow frame,
 * Space/Enter picks a gem, then an arrow swaps it that way. */
Arcade.games.gems = {
  title: 'ag_gems', icon: '💎', instr: 'g_gems_i',
  start(stage, ctx) {
    const A = Arcade, s = ctx.s, L = ctx.level, N = 7;
    const KINDS = ['🌱', '⭐', '💧', '🌸', '🍄', '🌙'].slice(0, L >= 6 ? 6 : 5);
    const goal = Math.min(110, 22 + L * 4);
    let moves = L >= 10 ? 18 : 20, collected = 0, busy = false, done = false, sel = null, cur = { r: 3, c: 3 }, combo = 0;
    const grid = [];
    const hud = () => ctx.hud(`💎 ${Math.min(collected, goal)} / ${goal}  ·  👣 ${moves}`);

    // A board with no ready-made rows.
    for (let r = 0; r < N; r++) {
      grid.push([]);
      for (let c = 0; c < N; c++) {
        let k;
        do { k = A.irand(0, KINDS.length - 1); } while ((c >= 2 && grid[r][c - 1] === k && grid[r][c - 2] === k) || (r >= 2 && grid[r - 1][c] === k && grid[r - 2][c] === k));
        grid[r][c] = k;
      }
    }
    stage.innerHTML = `<div class="gm-board" role="grid" aria-label="${t('ag_gems')}" style="grid-template-columns:repeat(${N},1fr)"></div>`;
    const board = stage.firstChild;
    const cells = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'gm-cell'; b.dataset.r = r; b.dataset.c = c;
      board.appendChild(b); cells.push(b);
    }
    const cell = (r, c) => cells[r * N + c];
    function paint(clearSet) {
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        const b = cell(r, c), k = grid[r][c];
        b.textContent = k == null ? '' : KINDS[k];
        b.className = 'gm-cell k' + k + (sel && sel.r === r && sel.c === c ? ' sel' : '') + (cur.r === r && cur.c === c ? ' cur' : '') + (clearSet && clearSet.has(r * N + c) ? ' clear' : '');
        b.setAttribute('aria-label', k == null ? '' : KINDS[k]);
      }
    }
    function matches() {
      const out = new Set();
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        const k = grid[r][c];
        if (k == null) continue;
        if (c <= N - 3 && grid[r][c + 1] === k && grid[r][c + 2] === k) { let e = c; while (e < N && grid[r][e] === k) out.add(r * N + e++); }
        if (r <= N - 3 && grid[r + 1][c] === k && grid[r + 2][c] === k) { let e = r; while (e < N && grid[e][c] === k) out.add(e++ * N + c); }
      }
      return out;
    }
    function anyMove() {
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) for (const [dr, dc] of [[0, 1], [1, 0]]) {
        const r2 = r + dr, c2 = c + dc;
        if (r2 >= N || c2 >= N) continue;
        swapCells(r, c, r2, c2); const ok = matches().size > 0; swapCells(r, c, r2, c2);
        if (ok) return true;
      }
      return false;
    }
    function swapCells(r, c, r2, c2) { const k = grid[r][c]; grid[r][c] = grid[r2][c2]; grid[r2][c2] = k; }
    function shuffle() {
      do {
        const all = grid.flat(); for (let i = all.length - 1; i > 0; i--) { const j = A.irand(0, i); [all[i], all[j]] = [all[j], all[i]]; }
        for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) grid[r][c] = all[r * N + c];
      } while (matches().size || !anyMove());
    }
    function settle() {
      const m = matches();
      if (!m.size) {
        combo = 0; busy = false; paint();
        if (collected >= goal) { done = true; A.note(1046, 400); s.timer(() => ctx.win(moves >= 6 ? 3 : moves >= 2 ? 2 : 1), 600); }
        else if (moves <= 0) { done = true; s.timer(() => ctx.lose(), 500); }
        else if (!anyMove()) { shuffle(); paint(); }
        return;
      }
      combo++;
      collected += m.size; hud();
      A.melody(combo * 2); if (combo > 1) A.melody(combo * 2 + 2);
      paint(m);
      const b = stage.getBoundingClientRect();
      [...m].slice(0, 4).forEach(i => { const r = cells[i].getBoundingClientRect(); A.burst(stage, r.left - b.left + r.width / 2, r.top - b.top + r.height / 2, ['✨'], 2); });
      s.timer(() => {
        m.forEach(i => { grid[Math.floor(i / N)][i % N] = null; });
        for (let c = 0; c < N; c++) {               // gravity, then new gems from the top
          const col = []; for (let r = N - 1; r >= 0; r--) if (grid[r][c] != null) col.push(grid[r][c]);
          for (let r = N - 1, i = 0; r >= 0; r--, i++) grid[r][c] = i < col.length ? col[i] : A.irand(0, KINDS.length - 1);
        }
        paint(); board.classList.remove('drop'); void board.offsetWidth; board.classList.add('drop');
        s.timer(settle, 260);
      }, 280);
    }
    function trySwap(r, c, r2, c2) {
      if (busy || done || r2 < 0 || c2 < 0 || r2 >= N || c2 >= N) return;
      sel = null;
      swapCells(r, c, r2, c2);
      if (!matches().size) { // not a match: swap back with a little shake
        swapCells(r, c, r2, c2); paint();
        [cell(r, c), cell(r2, c2)].forEach(b => { b.classList.add('nope'); });
        A.note(220, 160, 'triangle');
        return;
      }
      moves--; busy = true; hud(); A.note(520, 90);
      settle();
    }
    const DIR = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };
    function tapCell(r, c) {
      if (busy || done) return;
      cur = { r, c };
      if (sel && Math.abs(sel.r - r) + Math.abs(sel.c - c) === 1) return trySwap(sel.r, sel.c, r, c);
      sel = sel && sel.r === r && sel.c === c ? null : { r, c };
      A.note(440, 60); paint();
    }
    // Swipe a gem, or tap two gems.
    let start = null;
    s.on(board, 'pointerdown', e => { const b = e.target.closest('.gm-cell'); if (!b) return; e.preventDefault(); start = { r: +b.dataset.r, c: +b.dataset.c, x: e.clientX, y: e.clientY }; });
    s.on(board, 'pointerup', e => {
      if (!start) return;
      const dx = e.clientX - start.x, dy = e.clientY - start.y, st = start; start = null;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return tapCell(st.r, st.c);
      const [dr, dc] = Math.abs(dx) > Math.abs(dy) ? [0, Math.sign(dx)] : [Math.sign(dy), 0];
      cur = { r: st.r, c: st.c }; trySwap(st.r, st.c, st.r + dr, st.c + dc);
    });
    s.on(board, 'click', e => { const b = e.target.closest('.gm-cell'); if (b && e.detail === 0) tapCell(+b.dataset.r, +b.dataset.c); });
    const arrow = d => () => {
      if (busy || done) return;
      const [dr, dc] = DIR[d];
      if (sel) return trySwap(sel.r, sel.c, sel.r + dr, sel.c + dc);
      cur = { r: Math.max(0, Math.min(N - 1, cur.r + dr)), c: Math.max(0, Math.min(N - 1, cur.c + dc)) }; paint();
    };
    A.keys(s, { up: arrow('up'), down: arrow('down'), left: arrow('left'), right: arrow('right'),
      action: () => { if (!busy && !done) { sel = sel ? null : { r: cur.r, c: cur.c }; paint(); } }, forceEnter: true });
    if (!anyMove()) shuffle();
    paint(); hud();
  }
};
