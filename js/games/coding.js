/* Code Brainy: plan a list of arrow moves to reach the star (coding basics). */
Games.coding = {
  title: 'g_coding', icon: '🤖',
  start(root, ctx) {
    const size = 5, total = 3, rocksN = ctx.difficulty === 1 ? 0 : 4, maxCmds = 12;
    const DIRS = { up: [0, -1, '⬆️'], down: [0, 1, '⬇️'], left: [-1, 0, '⬅️'], right: [1, 0, '➡️'] };
    const ui = GK.frame(root, ctx, total);
    const key = (x, y) => x + ',' + y;

    function reachable(start, goal, rocks) {
      const seen = new Set([key(...start)]), q = [start];
      while (q.length) {
        const [x, y] = q.shift();
        if (x === goal[0] && y === goal[1]) return true;
        for (const d of Object.values(DIRS)) {
          const nx = x + d[0], ny = y + d[1], k = key(nx, ny);
          if (nx < 0 || ny < 0 || nx >= size || ny >= size || rocks.has(k) || seen.has(k)) continue;
          seen.add(k); q.push([nx, ny]);
        }
      }
      return false;
    }

    function level() {
      for (;;) {
        const start = [0, GK.rand(0, size - 1)];
        const goal = [GK.rand(2, size - 1), GK.rand(0, size - 1)];
        const rocks = new Set();
        while (rocks.size < rocksN) {
          const r = [GK.rand(1, size - 1), GK.rand(0, size - 1)];
          if (key(...r) !== key(...goal)) rocks.add(key(...r));
        }
        if (reachable(start, goal, rocks)) return { start, goal, rocks };
      }
    }

    GK.rounds(ui, total, (i, done) => {
      ui.say(t('g_coding_i'), i > 0);
      const L = level();
      let pos = L.start.slice(), cmds = [], running = false, miss = 0;
      const board = GK.el(`<div class="code-board" style="--n:${size}"></div>`);
      for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
        const k = key(x, y);
        board.appendChild(GK.el(`<div class="cell">${L.rocks.has(k) ? '🪨' : key(...L.goal) === k ? '⭐' : ''}</div>`));
      }
      const bot = GK.el(`<div class="code-bot">${Art.brainy({ thumb: false })}</div>`);
      board.appendChild(bot);
      const queue = GK.el(`<div class="code-queue" aria-live="polite"></div>`);
      const pad = GK.el(`<div class="code-pad"></div>`);
      Object.entries(DIRS).forEach(([name, d]) => {
        const b = GK.el(`<button type="button" class="choice small" aria-label="${name}">${d[2]}</button>`);
        b.onclick = () => { if (!running && cmds.length < maxCmds) { cmds.push(name); GK.sfx('tap'); drawQueue(); } };
        pad.appendChild(b);
      });
      const undo = GK.el(`<button type="button" class="btn ghost">${t('undo')}</button>`);
      const go = GK.el(`<button type="button" class="btn primary">${t('go')}</button>`);
      undo.onclick = () => { if (!running) { cmds.pop(); drawQueue(); } };
      go.onclick = run;
      const controls = GK.el(`<div class="code-controls"></div>`);
      controls.append(pad, GK.el('<div class="code-actions"></div>'));
      controls.lastChild.append(undo, go);
      ui.area.append(board, queue, controls);
      place();

      function place() { bot.style.transform = `translate(${pos[0] * 100}%, ${pos[1] * 100}%)`; }
      function drawQueue() { queue.innerHTML = cmds.map(c => `<span>${DIRS[c][2]}</span>`).join('') || '<em>…</em>'; }
      drawQueue();

      function fail() {
        miss++; GK.bad(board);
        setTimeout(() => { pos = L.start.slice(); place(); running = false; }, 700);
      }

      function run() {
        if (running || !cmds.length) return;
        running = true; pos = L.start.slice(); place();
        let k = 0;
        const step = () => {
          if (k >= cmds.length) {
            if (pos[0] === L.goal[0] && pos[1] === L.goal[1]) { GK.good(board); done(miss); }
            else fail();
            return;
          }
          const d = DIRS[cmds[k++]];
          const nx = pos[0] + d[0], ny = pos[1] + d[1];
          if (nx < 0 || ny < 0 || nx >= size || ny >= size || L.rocks.has(key(nx, ny))) return fail();
          pos = [nx, ny]; place(); GK.sfx('tap');
          setTimeout(step, 420);
        };
        setTimeout(step, 300);
      }
    }, ctx.finish);
  }
};
