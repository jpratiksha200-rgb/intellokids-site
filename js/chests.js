/* Treasure chests on the adventure map (owner, 2026-11-08; reworked 2026-11-10).
 * After every 5 levels there is a chest: after level 5, 10, 15 … 100 (20 per age path). It is its own stop ON the
 * map's road, between level 5 and 6 (and after level 10 at the end of the world page). Finishing level 5 leads
 * straight to the chest ("Next"): the child taps it open and plays their own arcade game (js/arcade/*.js, chosen by
 * age: 3 → Bubble Party … 10 → Brick Rocket; chest k plays level k, so every chest is a little harder). A big "Skip"
 * button goes straight to level 6; a skipped chest stays "ready" on the map. Chests never block the next level.
 *
 * Saved per child in child.chests = { open: { 'tiny:3': time }, best: { 'tiny:3': stars }, lv: { bubbles: 3 }, plays, won }
 * ('tiny:3' = chest 3 on the 3–4 path). open = the chest's game was played to the end at least once (win or lose);
 * only then the first-time +3 ⭐ is given. won = chest games WON: the chest-game stickers count these (stickers.js).
 * Tapping the lid open, skipping or losing never awards a sticker (owner, 2026-11-10): only a WON chest game is a
 * sticker moment (Stickers.before just before the win is saved, Stickers.check on its result screen).
 * Old saves (where opening the lid filled open) simply show those chests as played. */
(function () {
  const EVERY = 5, COUNT = 20, BONUS = 3;
  const GAME_BY_AGE = { 3: 'bubbles', 4: 'peekaboo', 5: 'fruit', 6: 'hop', 7: 'gems', 8: 'snake', 9: 'merge', 10: 'bricks' };
  const data = kid => kid.chests || { open: {}, best: {}, lv: {}, plays: 0 };
  const keyOf = (kid, k) => Store.ageGroup(kid) + ':' + k;
  // Chest k sits after level EVERY*k (level index EVERY*k − 1 on the child's path). It is ready once that level is
  // done AND that level is still allowed: free-plan limits plug in through Chests.levelAllowed(kid, levelIndex),
  // so a chest behind a locked level stays locked (same rule as the map, even for old saves).
  const allowed = (kid, k) => typeof window.Chests.levelAllowed !== 'function' || window.Chests.levelAllowed(kid, EVERY * k - 1);
  const unlocked = (kid, k) => !!(kid.completed || {})[Store.ageGroup(kid) + ':' + (EVERY * k - 1)] && allowed(kid, k);
  const opened = (kid, k) => !!data(kid).open[keyOf(kid, k)];   // its game was played to the end at least once
  function gameFor(kid) { const a = Math.max(3, Math.min(10, Store.currentAge(kid))); return GAME_BY_AGE[a]; }
  const worldOfChest = k => Math.floor((EVERY * k - 1) / 10) + 1;   // 1-based world page the chest is on
  const chestAfter = levelIdx => (levelIdx + 1) % EVERY === 0 && (levelIdx + 1) / EVERY <= COUNT ? (levelIdx + 1) / EVERY : 0;
  const reduced = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* The treasure chest drawing (original art): warm wood with gold bands, rivets, gems, a keyhole lock.
   * state: ready (glow, sparkles, shine sweep) | open (lid open, coins and gems inside) | locked (chains and a padlock).
   * opts.mini: a small still chest for titles and buttons. Every drawing gets its own gradient ids, so many chests
   * can share a page. */
  let uid = 0;
  const spark = (x, y, s, d) => `<path class="ch-spark" style="animation-delay:${d}s" d="M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z" fill="#FFF8CF"/>`;
  const coin = (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.62}" fill="#F7C531" stroke="#B9800C" stroke-width="1.4"/><ellipse cx="${x}" cy="${y - 0.6}" rx="${r * 0.55}" ry="${r * 0.3}" fill="#FFE68A"/>`;
  const gem = (x, y, s, c, hi) => `<path d="M${x} ${y - s}L${x + s} ${y - s * 0.2}L${x} ${y + s}L${x - s} ${y - s * 0.2}Z" fill="${c}" stroke="rgba(0,0,0,.25)" stroke-width="1"/><path d="M${x} ${y - s}L${x + s * 0.45} ${y - s * 0.2}L${x} ${y + s * 0.15}L${x - s * 0.45} ${y - s * 0.2}Z" fill="${hi}"/>`;
  function art(state, opts) {
    opts = opts || {};
    const id = 'ikch' + (++uid), mini = !!opts.mini;
    const W = `url(#${id}w)`, L = `url(#${id}l)`, G = `url(#${id}g)`;
    const ink = '#5A2C0C';
    const defs = `<defs>
      <linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CD7D3E"/><stop offset="1" stop-color="#8A4518"/></linearGradient>
      <linearGradient id="${id}l" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E69A55"/><stop offset="1" stop-color="#A9592A"/></linearGradient>
      <linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6BE"/><stop offset=".45" stop-color="#FFCD33"/><stop offset="1" stop-color="#C8860F"/></linearGradient>
      <linearGradient id="${id}i" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E3510"/><stop offset="1" stop-color="#3E1A06"/></linearGradient>
      <radialGradient id="${id}r"><stop offset="0" stop-color="#FFF3A0" stop-opacity=".95"/><stop offset=".55" stop-color="#FFD84A" stop-opacity=".45"/><stop offset="1" stop-color="#FFD84A" stop-opacity="0"/></radialGradient>
      <clipPath id="${id}c"><rect x="14" y="54" width="92" height="44" rx="7"/><path d="M12 58V40C12 24 32 18 60 18C88 18 108 24 108 40V58Z"/></clipPath>
    </defs>`;
    // Front of the chest (body, bands, rivets, lock plate): the same in every state.
    const body = `
      <rect x="14" y="54" width="92" height="44" rx="7" fill="${W}" stroke="${ink}" stroke-width="2"/>
      <path d="M15 70H105M15 84H105" stroke="${ink}" stroke-opacity=".35" stroke-width="1.6"/>
      <rect x="24" y="56" width="9" height="40" fill="${G}" stroke="#A86F08" stroke-width="1"/>
      <rect x="87" y="56" width="9" height="40" fill="${G}" stroke="#A86F08" stroke-width="1"/>
      <rect x="11" y="91" width="98" height="9" rx="3.5" fill="${G}" stroke="#A86F08" stroke-width="1.2"/>
      <path d="M14 82V95H27Z M106 82V95H93Z" fill="${G}" stroke="#A86F08" stroke-width="1"/>
      ${[[28.5, 62], [28.5, 86], [91.5, 62], [91.5, 86]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.7" fill="#9A6406"/>`).join('')}
      <path d="M48 53H72V69Q72 79 60 83Q48 79 48 69Z" fill="${G}" stroke="#A86F08" stroke-width="1.4"/>
      ${gem(60, 59, 4.6, '#E8344E', '#FF9AAB')}
      <circle cx="60" cy="70.5" r="2.7" fill="#3B1D06"/><path d="M58.5 71.5H61.5L62.4 77H57.6Z" fill="#3B1D06"/>`;
    // The closed, domed lid with its rim band and gems.
    const lid = `
      <path d="M12 58V40C12 24 32 18 60 18C88 18 108 24 108 40V58Z" fill="${L}" stroke="${ink}" stroke-width="2"/>
      <path d="M14 44C30 34 90 34 106 44" stroke="${ink}" stroke-opacity=".3" stroke-width="1.5" fill="none"/>
      <path d="M24 27.5L33 23.6V55H24Z" fill="${G}" stroke="#A86F08" stroke-width="1"/>
      <path d="M87 23.6L96 27.5V55H87Z" fill="${G}" stroke="#A86F08" stroke-width="1"/>
      <rect x="10" y="51" width="100" height="9" rx="3.5" fill="${G}" stroke="#A86F08" stroke-width="1.2"/>
      ${gem(60, 24, 5.2, '#3A7BF2', '#9CC4FF')}${gem(28.5, 40, 3.4, '#22B865', '#9CF0C0')}${gem(91.5, 40, 3.4, '#A855F7', '#E2C4FF')}
      <path d="M22 37C27 28 42 23 58 22.5" stroke="#fff" stroke-opacity=".5" stroke-width="2.6" stroke-linecap="round" fill="none"/>`;
    // Open: the lid tipped back (its inside shows), light and treasure inside.
    const openLid = `
      <path d="M13 54L20 14C40 7 80 7 100 14L107 54Z" fill="url(#${id}i)" stroke="${ink}" stroke-width="2"/>
      <path d="M20 14C40 7 80 7 100 14" stroke="${G}" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M29 12V50M91 12V50" stroke="${G}" stroke-width="5"/>
      <ellipse cx="60" cy="52" rx="44" ry="12" fill="#FFE98A"/>
      ${coin(30, 52, 6)}${coin(43, 47, 6.5)}${coin(77, 47, 6.5)}${coin(90, 52, 6)}${coin(60, 50, 7)}
      ${gem(50, 43, 5.5, '#E8344E', '#FF9AAB')}${gem(70, 42, 5.5, '#3A7BF2', '#9CC4FF')}${gem(60, 38, 4.5, '#22B865', '#9CF0C0')}
      ${coin(36, 55, 5.5)}${coin(84, 55, 5.5)}
      <rect x="10" y="51" width="100" height="8" rx="3.5" fill="${G}" stroke="#A86F08" stroke-width="1.2"/>`;
    // Locked: two chains across the front and a steel padlock.
    const chains = `
      <path d="M16 30L104 96M104 30L16 96" stroke="#5E6B77" stroke-width="7" stroke-linecap="round" stroke-dasharray="6 3.5"/>
      <path d="M16 30L104 96M104 30L16 96" stroke="#C4CED8" stroke-width="3" stroke-linecap="round" stroke-dasharray="6 3.5"/>
      <path d="M53 63V57A7 7 0 0 1 67 57V63" stroke="#5E6B77" stroke-width="4" fill="none"/>
      <rect x="47" y="62" width="26" height="21" rx="4" fill="#B7C3CE" stroke="#4E5A66" stroke-width="2"/>
      <circle cx="60" cy="70.5" r="2.6" fill="#3A444E"/><path d="M58.6 71.5H61.4L62.2 77H57.8Z" fill="#3A444E"/>`;
    const glow = state === 'ready' && !mini ? `<circle class="ch-glow" cx="60" cy="58" r="56" fill="url(#${id}r)"/>` : '';
    const openGlow = state === 'open' && !mini ? `<circle cx="60" cy="46" r="50" fill="url(#${id}r)" opacity=".85"/>` : '';
    const shine = state === 'ready' && !mini ? `<g clip-path="url(#${id}c)"><g transform="skewX(-18)"><rect class="ch-shine" x="-20" y="0" width="14" height="110" fill="#fff" opacity=".5"/></g></g>` : '';
    const sparks = state === 'ready' && !mini ? spark(14, 16, 6, 0) + spark(108, 12, 5, 0.6) + spark(112, 66, 4, 1.2) + spark(8, 74, 4, 0.9) : '';
    return `<svg viewBox="0 0 120 110" aria-hidden="true" class="chest-art ${state}${mini ? ' mini' : ''}" focusable="false">${defs}
      ${glow}${openGlow}
      <ellipse cx="60" cy="102" rx="46" ry="5" fill="#000" opacity=".16"/>
      ${state === 'open' ? openLid + body : lid + body}
      ${shine}${state === 'locked' ? chains : ''}${sparks}
    </svg>`;
  }

  // The two chests of one world page as stops on the road (after its 5th and its 10th level).
  // at = their two points in map units; pct turns a point into CSS left/top.
  function mapMarkup(kid, w, at, pct) {
    return [[w * 2 + 1, at[0]], [w * 2 + 2, at[1]]].map(([k, p]) => {
      const open = unlocked(kid, k), was = opened(kid, k), held = !allowed(kid, k);
      const state = !open ? 'locked' : was ? 'open' : 'ready';
      const label = open ? t(was ? 'chest_again' : 'chest_ready') : held ? t('locked') : t('chest_locked', { n: EVERY * k });
      // Locked chests are not links: a chest held by the free limits gets data-lock (the map's own
      // "locked for now" note), one not reached yet says which level opens it (bindMap).
      const where = open ? `href="#/kid/${kid.id}/chest/${k}"` : held ? 'data-lock aria-disabled="true" role="link"' : 'aria-disabled="true" role="link" tabindex="0"';
      return `<a class="map-chest ${state}" style="${pct(p)}" ${where} aria-label="${t('chest_title')} ${k}: ${label}" data-chest="${k}">${art(state)}</a>`;
    }).join('');
  }

  // Locked chest tapped on the map: say what to do instead of opening.
  function bindMap(root, kid, toast) {
    root.querySelectorAll('.map-chest.locked:not([data-lock])').forEach(a => {
      const say = e => { e.preventDefault(); const msg = t('chest_locked', { n: EVERY * Number(a.dataset.chest) }); toast('🔒 ' + msg); GK.speak(msg); };
      a.addEventListener('click', say);
      a.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') say(e); });
    });
  }

  // Where "Next" goes after finishing a level: the chest right after it, while that chest is ready and its game was
  // never played (a skipped chest is offered again). Otherwise null, and the level's own "Next" stays.
  function nextAfterLevel(kid, levelIdx) {
    const k = chestAfter(levelIdx);
    return k && allowed(kid, k) && !opened(kid, k) ? `#/kid/${kid.id}/chest/${k}` : null;
  }

  // A chest game played to the end (win or lose), the first time: the +3 ⭐ bonus. It is given just before the
  // sticker moment (as the lid opening gave it before), so it never counts towards a sticker itself.
  function firstPlay(kid, k) {
    let first = false;
    Store.updateChild(kid.id, c => {
      const d = c.chests = c.chests || { open: {}, best: {}, lv: {}, plays: 0 };
      d.open = d.open || {};
      const key = keyOf(c, k);
      if (!d.open[key]) { d.open[key] = Date.now(); first = true; c.stars = (c.stars || 0) + BONUS; c.xp = (c.xp || 0) + 5; }
    });
    return first;
  }
  // The game's result: counted for the parents; a WON game also counts for the chest-game stickers (won).
  function record(kid, k, gid, stars) {
    Store.updateChild(kid.id, c => {
      const d = c.chests = c.chests || { open: {}, best: {}, lv: {}, plays: 0 };
      d.best = d.best || {}; d.lv = d.lv || {};
      const key = keyOf(c, k);
      d.plays = (d.plays || 0) + 1;
      // Chest games WON: the chest-game stickers count these (never opening a chest, skipping or losing). Older saves
      // start from the chests they have won (the same count the stickers used for them before).
      if (d.won == null) d.won = Object.values(d.best).filter(n => n > 0).length;
      if (stars) { d.won++; d.best[key] = Math.max(d.best[key] || 0, stars); d.lv[gid] = Math.max(d.lv[gid] || 0, k); }
    });
  }

  // The opening moment: the chest shakes, the lid bursts open with light rays, coins and gems pop out, confetti.
  function burst(stage) {
    const fx = stage.querySelector('.chest-fx');
    if (!fx || reduced()) return;
    const loot = [];
    for (let i = 0; i < 12; i++) {
      const a = -Math.PI / 2 + (i - 5.5) * 0.25, d = 85 + (i % 3) * 25;
      const kind = i % 3 === 1 ? `<svg viewBox="-8 -8 16 16">${gem(0, 0, 7, ['#E8344E', '#3A7BF2', '#22B865', '#A855F7'][i % 4], '#fff9')}</svg>`
        : `<svg viewBox="-8 -8 16 16">${coin(0, 0, 7)}</svg>`;
      loot.push(`<span class="chest-loot" style="--dx:${Math.round(Math.cos(a) * d)}px;--dy:${Math.round(Math.sin(a) * d)}px;--r:${(i % 2 ? 1 : -1) * (120 + i * 25)}deg;animation-delay:${(i % 4) * 0.04}s">${kind}</span>`);
    }
    const colours = ['#FF5D73', '#FFC93C', '#3EC5F0', '#7ED957', '#B57BFF', '#FF9F43'];
    for (let i = 0; i < 26; i++) {
      loot.push(`<i class="chest-confetti" style="left:${(i * 37) % 100}%;background:${colours[i % colours.length]};--x:${((i * 53) % 60) - 30}px;--r:${(i * 97) % 360}deg;animation-delay:${0.25 + (i % 7) * 0.07}s"></i>`);
    }
    fx.innerHTML = loot.join('');
    setTimeout(() => { if (fx.isConnected) fx.innerHTML = ''; }, 2600);
  }

  /* The chest screen: tap the chest open, play the game at level k, the result, then Next → the level after the chest.
   * A big Skip button (here and during the game) goes straight to that level; nothing is recorded.
   * h = { modal, toast, go, lockNote, onReward, before, checkStickers, celebrate } from app.js */
  function view(app, kid, k, h) {
    const mapHref = `#/kid/${kid.id}/map/${worldOfChest(k)}`;
    if (!(k >= 1 && k <= COUNT)) return h.go(mapHref);
    if (!allowed(kid, k) && h.lockNote) { h.lockNote(); return h.go(mapHref); }   // held by the free limits
    if (!unlocked(kid, k)) { const m = t('chest_locked', { n: EVERY * k }); h.toast('🔒 ' + m); GK.speak(m); return h.go(mapHref); }
    // The level after this chest (its own route shows the "locked for now" screen when the free limits hold it).
    const nextHref = k < COUNT ? `#/kid/${kid.id}/play/${EVERY * k}` : mapHref;
    const gid = gameFor(kid), G = Arcade.games[gid];
    app.innerHTML = `
      <section class="page chest-page">
        <div class="kid-head chest-head"><a class="round-btn" href="${mapHref}" aria-label="${t('backToMap')}">🗺️</a>
          <h1><span class="chest-mini">${art('ready', { mini: true })}</span> <span class="chest-h1-text">${t(G.title)}</span></h1>
          <a class="btn chest-skip" href="${nextHref}" data-skip aria-label="${t('chest_skipAria')}">${t('chest_skip')} <span class="flip-rtl" aria-hidden="true">⏭</span></a></div>
        <div class="card arc-root"></div>
      </section>`;
    const root = app.querySelector('.arc-root');
    // Skip: stop the game first, so nothing it does later can count.
    app.querySelector('[data-skip]').addEventListener('click', () => { if (window.Arcade) Arcade.stop(); });

    function opening() {
      root.innerHTML = `<div class="chest-open">
        <div class="chest-stage">
          <div class="chest-rays" aria-hidden="true"></div>
          <button type="button" class="chest-big" aria-label="${t('chest_tapOpen')}">${art('ready')}</button>
          <div class="chest-fx" aria-hidden="true"></div>
        </div>
        <p class="chest-msg">${t('chest_tapOpen')}</p></div>`;
      GK.speak(t('chest_found'));
      const stage = root.querySelector('.chest-stage'), btn = root.querySelector('.chest-big');
      btn.focus();
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        btn.disabled = true;
        const open = () => {
          if (!btn.isConnected) return;
          btn.classList.remove('shake');
          btn.innerHTML = art('open'); btn.classList.add('opened');
          stage.classList.add('burst');
          GK.sfx('win');
          burst(stage);
          root.querySelector('.chest-msg').innerHTML = `<strong>${t('chest_found')}</strong>
            <button type="button" class="btn primary big chest-play">${G.icon} ${t('chest_play', { game: t(G.title) })}</button>`;
          const play = root.querySelector('.chest-play');
          play.addEventListener('click', round);
          setTimeout(() => play.focus(), 50);
        };
        if (reduced()) open(); else { btn.classList.add('shake'); GK.sfx('tap'); setTimeout(open, 420); }
      });
    }

    function round() {
      Arcade.stop();
      attempt++;
      root.innerHTML = `<div class="arc">
        <div class="arc-head">
          <div class="arc-brainy" aria-hidden="true">${Art.brainy({ thumb: false })}</div>
          <div class="bubble arc-bubble"><span class="arc-instr"></span><button class="icon-btn listen" type="button" aria-label="${t('listen')}">🔊</button></div>
          <span class="arc-hud" aria-live="polite"></span>
        </div>
        <div class="arc-stage"></div>
      </div>`;
      const instrEl = root.querySelector('.arc-instr'), hudEl = root.querySelector('.arc-hud');
      let said = '';
      const say = text => { said = text; instrEl.textContent = text; GK.speak(text); };
      root.querySelector('.listen').onclick = () => GK.speak(said);
      const s = Arcade.session(root);
      let over = false;
      const end = (won, stars) => {
        if (over || s.dead) return;   // finished already, or the child skipped / left
        over = true; s.end();
        const first = firstPlay(kid, k);
        if (first && h.onReward) h.onReward();
        // Only a WON game is a sticker moment (stickers.js): before() just before the win is saved, check() on the result.
        const b4 = won && h.before ? h.before() : null;
        record(kid, k, gid, stars);
        result(won, stars, first, b4);
      };
      const ctx = {
        level: k, age: Store.currentAge(kid), s, attempt,
        hud: txt => { hudEl.textContent = txt; },
        say,
        win: stars => end(true, stars),
        lose: () => end(false, 0)
      };
      say(t(G.instr));
      Arcade.current = { game: gid, level: k, ctx }; // handy for tests and debugging
      try { G.start(root.querySelector('.arc-stage'), ctx); }
      catch (e) { console.error(e); s.end(); over = true; result(false, 0, false, null); }
    }
    let attempt = 0;

    function result(won, stars, first, b4) {
      // Stickers won (e.g. "Treasure Hunter") wait in a gift box here, never in the middle of a game.
      // Only a won game can earn one; opening the chest, skipping or losing never does.
      const gifts = won && b4 && h.checkStickers ? h.checkStickers(b4) : [];
      const giftText = gifts.length ? t('giftOne') : ''; // one sticker per moment at most
      const msg = (won ? t('greatJob') + ' ' + t('youEarned', { n: stars }) : t('arc_oops')) + (giftText ? ' ' + giftText : '');
      const last = k >= COUNT;
      const m = h.modal(`
        <div class="result chest-result">
          <div class="chest-result-art">${art('open')}</div>
          <h2>${won ? t('greatJob') : t('arc_oops')}</h2>
          ${won ? `<p class="result-stars" aria-label="${t('youEarned', { n: stars })}">${'<span class="on">★</span>'.repeat(stars)}${'<span>★</span>'.repeat(3 - stars)}</p>` : ''}
          ${first ? `<p class="chest-bonus">+${BONUS} ⭐</p>` : ''}
          ${gifts.length ? `<button type="button" class="gift-btn" data-gift>🎁 ${giftText}</button>` : ''}
          <div class="row center result-actions">
            <button type="button" class="round-btn${won ? '' : ' primary'}" data-again aria-label="${won ? t('playAgain') : t('arc_tryAgain')}" title="${won ? t('playAgain') : t('arc_tryAgain')}">🔄</button>
            <a class="round-btn${last ? ' primary' : ''}" href="${mapHref}" data-back aria-label="${t('backToMap')}" title="${t('backToMap')}">🗺️</a>
            ${last ? '' : `<a class="btn primary big" href="${nextHref}" data-back data-next>${t('nextLevel')} <span class="flip-rtl" aria-hidden="true">▶</span></a>`}</div>
        </div>`);
      GK.speak(msg);
      const gift = m.el.querySelector('[data-gift]');
      if (gift) gift.onclick = () => { gift.remove(); h.celebrate(gifts); };
      m.el.querySelector('[data-again]').onclick = () => { m.close(); round(); };
      m.el.querySelectorAll('[data-back]').forEach(b => b.onclick = () => m.close());
    }

    // First time (or skipped before): the opening moment. A chest whose game was played: "Play again" goes straight in.
    if (opened(kid, k)) round(); else opening();
  }

  // One line for the parents' dashboard.
  function summary(kid) {
    const d = data(kid), n = Object.keys(d.open || {}).length;
    if (!n) return t('chest_dashNone');
    const gid = gameFor(kid), lv = (d.lv || {})[gid] || 0;
    return t('chest_dash', { n, game: t(Arcade.games[gid].title), lv: Math.max(1, lv) });
  }
  // Chests whose game was played, for the parents' activity timeline.
  function events(kid) {
    return Object.entries(data(kid).open || {}).map(([key, ts]) => ({ t: ts, icon: '🎁', text: t('ev_chest', { n: key.split(':')[1] }), meta: '' }));
  }
  const count = kid => Object.keys(data(kid).open || {}).length;

  window.Chests = { EVERY, COUNT, GAME_BY_AGE, gameFor, unlocked, opened, chestAfter, nextAfterLevel, mapMarkup, bindMap, view, summary, events, count, art,
    // A chest is held when the level before it is held by the free-plan limits (same rule as the map).
    levelAllowed: (kid, i) => typeof Store.levelOpen !== 'function' || Store.levelOpen(i) };
})();
