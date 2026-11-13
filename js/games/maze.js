/* Maze: guide Brainy to the star. A new random maze every time; bigger mazes at higher difficulty.
   Move with the arrow buttons, the keyboard, or by tapping a neighbouring square. */
Games.maze = {
  title: 'g_maze', icon: '🌀',
  start(root, ctx) {
    const d = ctx.difficulty;
    const n = ctx.group === 'tiny' ? [4, 5, 6][d - 1] : ctx.group === 'junior' ? [5, 6, 7][d - 1] : [6, 8, 9][d - 1];
    const total = 2;
    const ui = GK.frame(root, ctx, total);
    const N = 1, E = 2, S = 4, W = 8, DIRS = { [N]: [0, -1, S], [E]: [1, 0, W], [S]: [0, 1, N], [W]: [-1, 0, E] };

    // Classic "recursive backtracker" maze: every square is reachable, one path between any two squares.
    function makeMaze() {
      const walls = Array.from({ length: n * n }, () => N | E | S | W), seen = new Set([0]), stack = [[0, 0]];
      while (stack.length) {
        const [x, y] = stack[stack.length - 1];
        const opts = GK.shuffle([N, E, S, W]).filter(dir => { const [dx, dy] = DIRS[dir]; const nx = x + dx, ny = y + dy; return nx >= 0 && ny >= 0 && nx < n && ny < n && !seen.has(ny * n + nx); });
        if (!opts.length) { stack.pop(); continue; }
        const dir = opts[0], [dx, dy, back] = DIRS[dir], nx = x + dx, ny = y + dy;
        walls[y * n + x] &= ~dir; walls[ny * n + nx] &= ~back; seen.add(ny * n + nx); stack.push([nx, ny]);
      }
      return walls;
    }

    GK.rounds(ui, total, (round, done) => {
      ui.say(t('g_maze_i'), round > 0);
      const walls = makeMaze();
      let px = 0, py = 0, bumps = 0, finished = false;
      const goal = [n - 1, n - 1];
      const board = GK.el(`<div class="maze" style="--n:${n}"></div>`);
      for (let i = 0; i < n * n; i++) {
        const w = walls[i];
        board.appendChild(GK.el(`<div class="mz ${w & N ? 'n' : ''} ${w & E ? 'e' : ''} ${w & S ? 's' : ''} ${w & W ? 'w' : ''}" data-i="${i}"></div>`));
      }
      const cells = board.children;
      cells[goal[1] * n + goal[0]].innerHTML = '<span class="mz-goal">⭐</span>';
      const me = GK.el(`<span class="mz-me">${Art.brainy({ thumb: false })}</span>`);
      const pad = GK.el(`<div class="maze-pad">
          <button type="button" class="choice mz-btn" data-d="${N}" aria-label="up">⬆️</button>
          <div><button type="button" class="choice mz-btn" data-d="${W}" aria-label="left">⬅️</button><button type="button" class="choice mz-btn" data-d="${S}" aria-label="down">⬇️</button><button type="button" class="choice mz-btn" data-d="${E}" aria-label="right">➡️</button></div></div>`);
      const place = () => { cells[py * n + px].appendChild(me); cells[py * n + px].classList.add('trail'); };
      place();
      const move = dir => {
        if (finished) return;
        if (walls[py * n + px] & dir) { bumps++; GK.note(bumps + ''); if (bumps % 3 === 0) GK.bad(board); else GK.sfx('tap'); return; }
        const [dx, dy] = DIRS[dir]; px += dx; py += dy; place(); GK.sfx('pop');
        if (px === goal[0] && py === goal[1]) { finished = true; GK.good(board); document.removeEventListener('keydown', onKey); done(Math.floor(bumps / 3)); }
      };
      const onKey = e => {
        if (!board.isConnected) return document.removeEventListener('keydown', onKey);
        const dir = { ArrowUp: N, ArrowRight: E, ArrowDown: S, ArrowLeft: W }[e.key];
        if (dir) { e.preventDefault(); move(dir); }
      };
      document.addEventListener('keydown', onKey);
      pad.addEventListener('click', e => { const b = e.target.closest('[data-d]'); if (b) move(+b.dataset.d); });
      // Tap a neighbouring square to move there.
      board.addEventListener('click', e => {
        const c = e.target.closest('.mz'); if (!c) return;
        const i = +c.dataset.i, x = i % n, y = Math.floor(i / n);
        const dir = x === px + 1 && y === py ? E : x === px - 1 && y === py ? W : y === py + 1 && x === px ? S : y === py - 1 && x === px ? N : 0;
        if (dir) move(dir);
      });
      ui.area.appendChild(board); ui.area.appendChild(pad);
    }, ctx.finish);
  }
};
