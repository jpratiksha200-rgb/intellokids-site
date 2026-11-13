/* Shared helpers for every mini game. */
(function () {
  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const sample = (arr, n) => shuffle(arr).slice(0, n);

  // Brainy reads instructions aloud (helps kids who can't read yet), in his own recorded voice (js/voice.js).
  // deviceText: optional version for the device voice (e.g. with the child's name, which can't be recorded).
  function speak(text, deviceText) { try { BrainyVoice.say(text, deviceText); } catch (e) { /* speech not available */ } }
  // A line with names (the child's, the friend's): the device voice says it all; the recorded name-free version if it can't.
  function speakNamed(deviceText, recordedText) { try { BrainyVoice.sayNamed(deviceText, recordedText); } catch (e) { /* speech not available */ } }

  // Tiny sound effects with the Web Audio API (no audio files needed).
  let actx = null;
  function sfx(kind) {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const notes = { good: [660, 880], bad: [220, 180], pop: [520], win: [523, 659, 784, 1046], tap: [440] }[kind] || [440];
      notes.forEach((f, i) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = kind === 'bad' ? 'triangle' : 'sine'; o.frequency.value = f;
        const t0 = actx.currentTime + i * 0.11;
        g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.18, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
        o.connect(g).connect(actx.destination); o.start(t0); o.stop(t0 + 0.25);
      });
    } catch (e) { /* audio not available */ }
  }

  function el(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }

  // Standard game frame: instruction bubble with Brainy, progress dots, play area.
  function frame(root, ctx, total) {
    root.innerHTML = `
      <div class="game">
        <div class="game-head">
          <div class="game-brainy">${Art.brainy({ thumb: false })}</div>
          <div class="bubble"><span class="instr"></span>
            <button class="icon-btn listen" type="button" aria-label="${t('listen')}">🔊</button></div>
        </div>
        <div class="dots" aria-hidden="true">${Array.from({ length: total }, () => '<span></span>').join('')}</div>
        <div class="play-area"></div>
      </div>`;
    const instrEl = root.querySelector('.instr');
    const dots = root.querySelectorAll('.dots span');
    let current = '';
    root.querySelector('.listen').onclick = () => speak(current);
    return {
      area: root.querySelector('.play-area'),
      say(text, silent) { current = text; instrEl.textContent = text; if (track) { track.instr = text; track.note = ''; } if (!silent) speak(text); },
      progress(i) { dots.forEach((d, k) => d.classList.toggle('done', k < i)); },
      brainy: root.querySelector('.game-brainy')
    };
  }

  // ---- Progress tracking for the parents' dashboard ----
  // A tracking session runs while a game is open: it counts answers, mistakes and
  // which question each mistake happened on.
  let track = null;
  function beginTrack() { track = { start: Date.now(), answers: 0, mistakes: 0, missed: {}, instr: '', note: '', lastMiss: 0 }; return track; }
  function endTrack() { const t0 = track; track = null; if (t0) t0.ms = Date.now() - t0.start; return t0; }
  function note(text) { if (track) track.note = text; }
  function answered() { if (track) track.answers++; }
  function miss() {
    if (!track) return;
    const now = Date.now();
    if (now - track.lastMiss < 150) return; // one wrong tap can flag two elements
    track.lastMiss = now; track.mistakes++;
    const label = track.instr + (track.note ? ' (' + track.note + ')' : '');
    if (label) track.missed[label] = (track.missed[label] || 0) + 1;
  }

  function good(node) { sfx('good'); if (node) { node.classList.remove('wrong'); node.classList.add('right'); } }
  function bad(node) {
    sfx('bad'); miss();
    if (node) { node.classList.remove('wrong'); void node.offsetWidth; node.classList.add('wrong'); }
  }

  // Younger children get a little leniency (set per game by the app) so stars feel fair.
  let leniency = 0;
  function setLeniency(n) { leniency = n || 0; }
  function starsFor(mistakes, total) {
    mistakes = Math.max(0, mistakes - leniency);
    if (mistakes === 0) return 3;
    if (mistakes <= Math.max(1, Math.round(total * 0.4))) return 2;
    return 1;
  }

  // Builds a row of big answer buttons. items: [{html, value, label}]
  function choices(container, items, onPick, cls) {
    const wrap = el(`<div class="choices ${cls || ''}"></div>`);
    items.forEach(it => {
      const b = el(`<button type="button" class="choice"></button>`);
      b.innerHTML = it.html; if (it.label) b.setAttribute('aria-label', it.label);
      b.onclick = () => onPick(it.value, b);
      wrap.appendChild(b);
    });
    container.appendChild(wrap);
    return wrap;
  }

  // Runs N rounds. renderRound(index, done) must call done(correctFirstTry:boolean) when the round ends.
  function rounds(ui, total, renderRound, finish) {
    let i = 0, mistakes = 0;
    const next = () => {
      ui.progress(i);
      if (i >= total) return finish(starsFor(mistakes, total));
      ui.area.innerHTML = '';
      renderRound(i, misses => { mistakes += misses; i++; answered(); setTimeout(next, 700); });
    };
    next();
  }

  window.GK = { rand, shuffle, pick, sample, speak, speakNamed, sfx, el, frame, good, bad, starsFor, setLeniency, choices, rounds, beginTrack, endTrack, note, answered, miss };
  window.Games = {};
})();
