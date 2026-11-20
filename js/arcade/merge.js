/* Number Garden (age 9): slide all the number tiles; two tiles with the same number join and grow into their
 * sum (2+2 → 4 → 8 …). Reach the target number to win; if the garden fills up with no move left, try again.
 * Higher levels: bigger targets (32 → 64 → 128 → 256) and garden stones that never move (level 6+: 1, 12+: 2).
 * Controls: arrows / WASD, swipe on the garden, or the big arrow buttons. Stars: 3 on the first try, then 2, 1. */
Arcade.games.merge = {
  title: 'ag_merge', icon: '🔢', instr: 'g_merge_i',
  start(stage, ctx) {
    const A = Arcade, s = ctx.s, L = ctx.level, N = 4, STONE = -1;
    const target = L < 2 ? 32 : L < 4 ? 64 : L < 9 ? 128 : 256;
    const stones = L >= 12 ? 2 : L >= 6 ? 1 : 0;
    const PLANT = { 2: '🌱', 4: '🌿', 8: '🍀', 16: '🌷', 32: '🌻', 64: '🌳', 128: '🍎', 256: '🌈', 512: '👑' };
    let grid = Array.from({ length: N }, () => Array(N).fill(0)), best = 2, done = false, fresh = new Set(), merged = new Set();
    stage.innerHTML = `<div class="mg-board" role="grid" aria-label="${t('ag_merge')}"></div>`;
    const board = stage.firstChild;
    const hud = () => ctx.hud(`🎯 ${target}  ·  ${PLANT[best] || '⭐'} ${best}`);
    function empties() { const e = []; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (grid[r][c] === 0) e.push([r, c]); return e; }
    function add() { const e = empties(); if (!e.length) return; const [r, c] = A.pick(e); grid[r][c] = Math.random() < 0.9 ? 2 : 4; fresh.add(r * N + c); }
    for (let i = 0; i < stones; i++) { const [r, c] = A.pick(empties().filter(([r, c]) => (r === 1 || r === 2) && (c === 1 || c === 2))); grid[r][c] = STONE; }
    add(); add();
    function paint() {
      board.innerHTML = grid.map((row, r) => row.map((v, c) => {
        const i = r * N + c;
        if (v === STONE) return `<div class="mg-cell stone" role="gridcell" aria-label="${t('arc_stone')}"><span aria-hidden="true">🪨</span></div>`;
        if (!v) return '<div class="mg-cell" role="gridcell"></div>';
        return `<div class="mg-cell v v${Math.min(v, 1024)}${fresh.has(i) ? ' new' : ''}${merged.has(i) ? ' merged' : ''}" role="gridcell" aria-label="${v}"><b>${v}</b><span aria-hidden="true">${PLANT[v] || '⭐'}</span></div>`;
      }).join('')).join('');
      fresh = new Set(); merged = new Set();
    }
    // Slide one line towards its start; stones split a line into separate parts.
    function slideLine(line) {
      const out = line.slice(); let gain = 0, moved = false, mergedAt = [];
      let segStart = 0;
      for (let i = 0; i <= N; i++) {
        if (i === N || line[i] === STONE) {
          const seg = line.slice(segStart, i).filter(v => v > 0), res = [];
          for (let j = 0; j < seg.length; j++) {
            if (j + 1 < seg.length && seg[j] === seg[j + 1]) { res.push(seg[j] * 2); gain = Math.max(gain, seg[j] * 2); mergedAt.push(segStart + res.length - 1); j++; }
            else res.push(seg[j]);
          }
          for (let k = segStart; k < i; k++) { const v = res[k - segStart] || 0; if (out[k] !== v) moved = true; out[k] = v; }
          segStart = i + 1;
        }
      }
      return { out, gain, moved, mergedAt };
    }
    function move(d) {
      if (done) return;
      let moved = false, gain = 0;
      for (let k = 0; k < N; k++) {
        const idx = Array.from({ length: N }, (_, i) => d === 'left' ? [k, i] : d === 'right' ? [k, N - 1 - i] : d === 'up' ? [i, k] : [N - 1 - i, k]);
        const res = slideLine(idx.map(([r, c]) => grid[r][c]));
        if (res.moved) moved = true;
        gain = Math.max(gain, res.gain);
        idx.forEach(([r, c], i) => { grid[r][c] = res.out[i]; });
        res.mergedAt.forEach(i => { const [r, c] = idx[i]; merged.add(r * N + c); });
      }
      if (!moved) { A.note(200, 120, 'triangle'); return; }
      if (gain) { best = Math.max(best, gain); A.melody(Math.log2(gain)); } else A.note(480, 60);
      add(); paint(); hud();
      if (best >= target) {
        done = true; A.note(1046, 400);
        const b = stage.getBoundingClientRect(); A.burst(stage, b.width / 2, b.height / 2, ['🌟', '✨', '🌈'], 10);
        s.timer(() => ctx.win(ctx.attempt <= 1 ? 3 : ctx.attempt <= 3 ? 2 : 1), 800);
      } else if (!canMove()) { done = true; s.timer(() => ctx.lose(), 700); }
    }
    function canMove() {
      if (empties().length) return true;
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        const v = grid[r][c]; if (v === STONE) continue;
        if (c + 1 < N && grid[r][c + 1] === v) return true;
        if (r + 1 < N && grid[r + 1][c] === v) return true;
      }
      return false;
    }
    A.keys(s, { up: () => move('up'), down: () => move('down'), left: () => move('left'), right: () => move('right') });
    A.swipe(s, board, d => { if (d !== 'tap') move(d); });
    A.pad(stage, s, move);
    paint(); hud();
    ctx.say(t('g_merge_i') + ' ' + t('g_merge_i2', { n: target }));
  }
};
