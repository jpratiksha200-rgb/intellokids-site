/* Stickers are only earned by completing or achieving something (owner, 2026-11-10): never on login, never for pressing Play, starting or leaving an activity, never for time spent; reveals only at the moment of the achievement.

   IntelloKids sticker album: challenge-based stickers, the reveal celebration and the album.
   Each sticker has a challenge. Locked stickers show a silhouette and the challenge (read aloud by Brainy).
   Winning one plays a gift-box reveal with confetti, so the child feels they really earned it.
   Two kinds of stickers: the stickers below (for every age), and an album for each age 3–10
   (js/albums/age-N.js, 105 stickers each, loaded only when needed; see "Age albums").

   How the rule is kept:
   - Only these moments can award a sticker: the result screen of a finished game or quiz, a finished
     colouring picture, a won treasure-chest game, and making the virtual friend. Each one takes
     `const b = Stickers.before(id)` BEFORE it records the achievement and calls `Stickers.check(id, b)` after.
     Nothing else calls check(): not login, the kid home, the album, the map, opening a game or a chest,
     leaving early, or a timer.
   - check() gives a sticker only if its challenge is met now AND this moment moved its own counter
     (d.raw). So an older save's past never turns into a pile of stickers, wherever it is checked.
   - ONE sticker per moment at most, so the reveal never says "Next sticker" or "more are waiting"
     (pickOne() chooses; see check() for the one named exception).
   - Counters only count completed things: Store.tally() (finished games, right answers in them, stars won,
     3-star and no-mistake games, finished pictures), chests.won (won chest games). Nothing counts time.
   - Each age album counts from a starting point saved the first time the child uses it (albumBase).
     A child who already had stickers in it keeps them and goes on from there; a new age album (birthday)
     gets its own starting point. Nothing is filed or awarded when a child logs in or opens a page.
   infra/check-stickers.ps1 tests this rule; run it on every change to stickers, games, colouring, chests,
   result screens or login (see admin.md). */
(function () {
  const SCRIPT_SRC = (document.currentScript && document.currentScript.src) || '';
  const ALL = ['tiny', 'junior', 'explorer'];
  // Game groups used by the "Super Skills" stickers.
  const SKILL = {
    shapes: ['shapes', 'sorter', 'shadow'], colours: ['colours'], counting: ['counting', 'dots'], size: ['bigsmall'],
    memory: ['memory'], puzzles: ['pattern', 'odd', 'maze', 'puzzle'], maths: ['addition', 'mathsrace', 'clock'], coding: ['coding']
  };
  // Which age groups can play each skill (from the adventure map pools in app.js).
  const SKILL_GROUPS = {
    shapes: ALL, colours: ['tiny'], counting: ALL, size: ['tiny', 'junior'],
    memory: ALL, puzzles: ALL, maths: ['junior', 'explorer'], coding: ['explorer']
  };

  // Sticker definitions. art = emoji, bg = two gradient colours, r = rarity (1 common, 2 rare, 3 epic).
  // goal(s) returns [have, need] from the child's stats s; raw(s) is the counter behind it (not capped),
  // so check() can tell whether the moment being checked moved it (see the rule at the top).
  const W = (n, art, bg, r) => ({ id: 'w' + n, col: 'adventure', art, bg, r, chal: () => t('chal_world', { n, world: t('w' + n) }), goal: s => [Math.min(s.worldLevels[n - 1], 10), 10], raw: s => s.worldLevels[n - 1] });
  const SK = (k, art, bg) => ({ id: 'sk_' + k, col: 'skills', art, bg, r: 1, groups: SKILL_GROUPS[k],
    chal: () => t('chal_skill', { n: 3, game: SKILL[k].map(g => t(Games[g].title)).join(' / ') }), goal: s => [Math.min(s.skill3[k], 3), 3], raw: s => s.skill3[k] });
  const DEFS = [
    W(1, '☁️', ['#BDEBFF', '#7FD4F5'], 1), W(2, '🦊', ['#C8F0C0', '#5DBB63'], 1), W(3, '🐉', ['#E7D3FF', '#A855F7'], 1),
    W(4, '🐬', ['#BFF0FF', '#2BB3E0'], 1), W(5, '🍭', ['#FFE0EE', '#F98FC0'], 2), W(6, '🐪', ['#FFF1C2', '#E9B65C'], 2),
    W(7, '⛄', ['#F2FAFF', '#A9D3F2'], 2), W(8, '🦕', ['#DFF5C8', '#8CCB5E'], 2), W(9, '🚀', ['#C9CCF5', '#3B2A8C'], 3), W(10, '🦄', ['#FFE3F3', '#CDB6FF'], 3),
    SK('shapes', '🔷', ['#D7F3FF', '#3ED8E8']), SK('colours', '🎨', ['#FFE7D1', '#F59E0B']), SK('counting', '🔢', ['#E3F7E6', '#5CCB6F']),
    SK('size', '🔍', ['#FFF4D6', '#FFD21F']), SK('memory', '🧠', ['#FFE0EE', '#F47C8A']), SK('puzzles', '🧩', ['#E7F5FF', '#5AA9E6']),
    SK('maths', '➕', ['#EDE3FF', '#A855F7']), SK('coding', '🤖', ['#DDF4F7', '#0E6E7E']),
    { id: 'q1', col: 'quiz', art: '❓', bg: ['#FFF4D6', '#FFB703'], r: 1, chal: () => t('chal_quiz1'), goal: s => [Math.min(s.quizzes, 1), 1] },
    { id: 'q2', col: 'quiz', art: '🌟', bg: ['#FFF9DB', '#FFD21F'], r: 2, chal: () => t('chal_quizPerfect', { n: 1 }), goal: s => [Math.min(s.perfectQuiz, 1), 1] },
    { id: 'q3', col: 'quiz', art: '🏆', bg: ['#FFF1C2', '#E0B100'], r: 3, chal: () => t('chal_quizPerfect', { n: 5 }), goal: s => [Math.min(s.perfectQuiz, 5), 5] },
    { id: 's1', col: 'stars', art: '⭐', bg: ['#FFF9DB', '#FFD21F'], r: 1, chal: () => t('chal_star1'), goal: s => [Math.min(s.bestStars, 1), 1] },
    { id: 's2', col: 'stars', art: '✨', bg: ['#FFF4D6', '#FFB703'], r: 1, chal: () => t('chal_stars', { n: 25 }), goal: s => [Math.min(s.bestStars, 25), 25] },
    { id: 's3', col: 'stars', art: '💫', bg: ['#EDE3FF', '#A855F7'], r: 2, chal: () => t('chal_stars', { n: 100 }), goal: s => [Math.min(s.bestStars, 100), 100] },
    { id: 's4', col: 'stars', art: '🌌', bg: ['#C9CCF5', '#1B1F5C'], r: 3, chal: () => t('chal_stars', { n: 250 }), goal: s => [Math.min(s.bestStars, 250), 250] },
    { id: 'h1', col: 'habits', art: '👋', bg: ['#E3F7E6', '#5CCB6F'], r: 1, chal: () => t('chal_firstPlay'), goal: s => [Math.min(s.games, 1), 1] },
    { id: 'h2', col: 'habits', art: '🔥', bg: ['#FFE7D1', '#F47C3C'], r: 2, chal: () => t('chal_streak', { n: 3 }), goal: s => [Math.min(s.streak, 3), 3] },
    { id: 'h3', col: 'habits', art: '📅', bg: ['#FFE0EE', '#F47C8A'], r: 3, chal: () => t('chal_streak', { n: 7 }), goal: s => [Math.min(s.streak, 7), 7] },
    { id: 'h4', col: 'habits', art: '🐝', bg: ['#FFF4D6', '#FFD21F'], r: 1, chal: () => t('chal_plays', { n: 30 }), goal: s => [Math.min(s.games, 30), 30] },
    { id: 'f1', col: 'friends', art: '💛', bg: ['#FFF4D6', '#FFD21F'], r: 1, chal: () => t('chal_friend'), goal: s => [s.hasFriend ? 1 : 0, 1] },
    { id: 'f2', col: 'friends', art: '🎒', bg: ['#E3F7E6', '#5CCB6F'], r: 2, chal: () => t('chal_friendLevel', { n: 3 }), goal: s => [Math.min(s.level, 3), 3] },
    { id: 'f3', col: 'friends', art: '👑', bg: ['#FFF1C2', '#E0B100'], r: 3, chal: () => t('chal_friendLevel', { n: 8 }), goal: s => [Math.min(s.level, 8), 8] },
    { id: 'c1', col: 'creative', art: '🖍️', bg: ['#FFE0EE', '#F47C8A'], r: 1, chal: () => t('chal_picture1'), goal: s => [Math.min(s.pictures, 1), 1] },
    { id: 'c2', col: 'creative', art: '🖼️', bg: ['#EDE3FF', '#A855F7'], r: 2, chal: () => t('chal_drawings', { n: 3 }), goal: s => [Math.min(s.pictures, 3), 3] },
    { id: 'c3', col: 'creative', art: '🖌️', bg: ['#FFF4D6', '#FB923C'], r: 2, chal: () => t('chal_drawings', { n: 5 }), goal: s => [Math.min(s.pictures, 5), 5] },
    { id: 'p1', col: 'creative', art: '🎯', bg: ['#FFE7D1', '#F47C3C'], r: 2, chal: () => t('chal_perfectWorld'), goal: s => [Math.min(s.bestWorld3, 10), 10] },
    { id: 'p2', col: 'creative', art: '💪', bg: ['#D7F3FF', '#0E6E7E'], r: 1, chal: () => t('chal_improve'), goal: s => [Math.min(s.improved, 1), 1] }
  ];
  // The counter behind each of the stickers above (their goal() caps it at the target).
  const RAW = { q1: 'quizzes', q2: 'perfectQuiz', q3: 'perfectQuiz', s1: 'bestStars', s2: 'bestStars', s3: 'bestStars', s4: 'bestStars',
    h1: 'games', h2: 'streak', h3: 'streak', h4: 'games', f1: s => (s.hasFriend ? 1 : 0), f2: 'level', f3: 'level',
    c1: 'pictures', c2: 'pictures', c3: 'pictures', p1: 'bestWorld3', p2: 'improved' };
  const rawOf = stat => (typeof stat === 'function' ? stat : s => +s[stat] || 0);
  DEFS.forEach(d => { if (!d.raw) d.raw = rawOf(RAW[d.id]); });
  // ---- 50 more stickers (milestones children reach naturally as they play) ----
  // N(id, collection, emoji, gradient, rarity, challenge key, challenge vars, stat, target, ageGroups?)
  const N = (id, col, art, bg, r, key, vars, stat, need, groups) => ({ id, col, art, bg, r, groups,
    chal: () => t(key, Object.assign({ n: need }, typeof vars === 'function' ? vars() : vars)),
    goal: s => [Math.min(rawOf(stat)(s), need), need], raw: rawOf(stat) });
  const GP = (g, art, bg, groups) => N('gp_' + g, 'skills', art, bg, 1, 'chal_gamePlays', () => ({ game: t(Games[g].title) }), s => s.gamePlays[g] || 0, 10, groups);
  const B = { teal: ['#D7F3FF', '#3ED8E8'], gold: ['#FFF4D6', '#FFB703'], pink: ['#FFE0EE', '#F47C8A'], green: ['#E3F7E6', '#5CCB6F'],
    purple: ['#EDE3FF', '#A855F7'], orange: ['#FFE7D1', '#FB923C'], navy: ['#C9CCF5', '#3B2A8C'], rainbow: ['#FFE3F3', '#A9E4FF'] };
  DEFS.push(
    // Adventure milestones
    N('lv5', 'adventure', '🥾', B.green, 1, 'chal_levels', {}, 'levelsDone', 5),
    N('lv25', 'adventure', '🧭', B.teal, 1, 'chal_levels', {}, 'levelsDone', 25),
    N('lv50', 'adventure', '🏕️', B.orange, 2, 'chal_levels', {}, 'levelsDone', 50),
    N('lv75', 'adventure', '🗻', B.purple, 2, 'chal_levels', {}, 'levelsDone', 75),
    N('lv100', 'adventure', '🎖️', B.rainbow, 3, 'chal_levels', {}, 'levelsDone', 100),
    N('pw3', 'adventure', '💎', B.navy, 3, 'chal_perfectWorlds', {}, 'perfectWorlds', 3),
    // Treasure chests on the map (js/chests.js)
    N('ch1', 'adventure', '🎁', B.gold, 1, 'chal_chest1', {}, 'chestsWon', 1),
    N('ch10', 'adventure', '🗝️', B.rainbow, 3, 'chal_chests', {}, 'chestsWon', 10),
    // Practise every game
    GP('shapes', '🔺', B.teal, ['tiny', 'junior', 'explorer']), GP('sorter', '🟦', B.teal, ['tiny']), GP('colours', '🎈', B.pink, ['tiny']),
    GP('counting', '🧮', B.green, ['tiny', 'junior']), GP('bigsmall', '🐘', B.gold, ['tiny', 'junior']), GP('memory', '🃏', B.purple, ['tiny', 'junior', 'explorer']),
    GP('pattern', '🔁', B.orange, ['junior', 'explorer']), GP('odd', '🕵️', B.navy, ['junior', 'explorer']), GP('addition', '🍎', B.pink, ['junior', 'explorer']),
    GP('mathsrace', '🏎️', B.orange, ['explorer']), GP('coding', '💻', B.teal, ['explorer']),
    // Skill & care
    N('ts10', 'skills', '🥇', B.gold, 1, 'chal_threeStars', {}, 'threeStars', 10),
    N('ts25', 'skills', '🏅', B.gold, 2, 'chal_threeStars', {}, 'threeStars', 25),
    Object.assign(N('pg1', 'skills', '✅', B.green, 1, 'chal_perfectGames', {}, 'perfectGames', 1), { chal: () => t('chal_perfectGame1') }),
    N('pg10', 'skills', '🦉', B.purple, 2, 'chal_perfectGames', {}, 'perfectGames', 10),
    N('sp1', 'skills', '⚡', B.gold, 1, 'chal_fast', {}, 'fastGames', 1),
    N('sp10', 'skills', '🐆', B.orange, 3, 'chal_fast', {}, 'fastGames', 10),
    // Quizzes
    N('q25', 'quiz', '📝', B.teal, 2, 'chal_quizzes', {}, 'quizzes', 25),
    N('qp10', 'quiz', '🏵️', B.rainbow, 3, 'chal_quizPerfect', {}, 'perfectQuiz', 10),
    // Brain power (correct answers)
    N('an100', 'stars', '💡', B.gold, 1, 'chal_answers', {}, 'answers', 200),
    N('an500', 'stars', '📚', B.purple, 2, 'chal_answers', {}, 'answers', 500),
    N('an1000', 'stars', '🧙', B.navy, 3, 'chal_answers', {}, 'answers', 1000),
    // Every day: finished games, days, streaks. Nothing for time alone: the three stickers that were for
    // minutes played (ids mn30/mn120/mn300 kept, so children who own them keep them) are now for no-mistake games.
    N('pl50', 'habits', '🎮', B.teal, 1, 'chal_plays', {}, 'games', 50),
    N('pl100', 'habits', '🕹️', B.purple, 2, 'chal_plays', {}, 'games', 100),
    N('pl200', 'habits', '🏰', B.rainbow, 3, 'chal_plays', {}, 'games', 200),
    N('mn30', 'habits', '🦅', B.green, 1, 'chal_perfectGames', {}, 'perfectGames', 25),
    N('mn120', 'habits', '🎓', B.gold, 2, 'chal_perfectGames', {}, 'perfectGames', 50),
    N('mn300', 'habits', '💯', B.orange, 3, 'chal_perfectGames', {}, 'perfectGames', 100),
    N('dy10', 'habits', '📆', B.teal, 1, 'chal_days', {}, 'days', 10),
    N('dy30', 'habits', '🗓️', B.purple, 2, 'chal_days', {}, 'days', 30),
    N('st14', 'habits', '☄️', B.orange, 3, 'chal_streak', {}, 'streak', 14),
    N('st30', 'habits', '🌋', B.navy, 3, 'chal_streak', {}, 'streak', 30),
    // Friends grow up
    N('fl5', 'friends', '🧣', B.pink, 1, 'chal_friendLevel', {}, 'level', 5),
    N('fl12', 'friends', '🎉', B.gold, 2, 'chal_friendLevel', {}, 'level', 12),
    N('fl20', 'friends', '🪐', B.navy, 3, 'chal_friendLevel', {}, 'level', 20),
    // Creative & brave
    N('d10', 'creative', '🌈', B.rainbow, 2, 'chal_drawings', {}, 'pictures', 10),
    N('dan', 'creative', '🦁', B.orange, 2, 'chal_drawAnimals', {}, s => s.animalsAll ? 1 : 0, 1),
    N('dall', 'creative', '🏛️', B.rainbow, 3, 'chal_drawAll', {}, s => s.drawingsAll ? 1 : 0, 1),
    N('cf200', 'creative', '✏️', B.pink, 2, 'chal_drawings', {}, 'pictures', 25),
    N('im5', 'creative', '📈', B.green, 1, 'chal_improveN', {}, 'improved', 5),
    N('im15', 'creative', '🧗', B.orange, 2, 'chal_improveN', {}, 'improved', 15),
    // Collector
    N('sc10', 'collector', '📒', B.teal, 1, 'chal_stickers', {}, 'stickersGot', 10),
    N('sc25', 'collector', '🗃️', B.purple, 2, 'chal_stickers', {}, 'stickersGot', 25),
    N('sc50', 'collector', '💖', B.rainbow, 3, 'chal_stickers', {}, 'stickersGot', 50)
  );
  // Milestones that can only happen once (a whole world, every picture, the friend, level 100): when one of
  // these is reached it is the sticker of that moment (see pickOne()).
  const ONCE = new Set(['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9', 'w10', 'p1', 'pw3', 'dan', 'dall', 'f1', 'lv100']);
  // Among the other stickers for every age, the "first time" ones go first (first game, quiz, picture, chest).
  const FIRST = ['h1', 'q1', 'c1', 'ch1', 's1'];
  const ORDER = {}; DEFS.forEach((d, i) => { ORDER[d.id] = i; });
  const COLLECTIONS = ['adventure', 'skills', 'quiz', 'stars', 'habits', 'friends', 'creative', 'collector'];
  const COL_ICON = { adventure: '🗺️', skills: '🧠', quiz: '❓', stars: '⭐', habits: '🔥', friends: '💛', creative: '🎨', collector: '📒' };

  const COL_BG = { adventure: ['#C8F0C0', '#5DBB63'], skills: ['#D7F3FF', '#3ED8E8'], quiz: ['#FFF4D6', '#FFB703'], stars: ['#FFF9DB', '#FFD21F'],
    habits: ['#FFE7D1', '#F47C3C'], friends: ['#FFE0EE', '#F47C8A'], creative: ['#EDE3FF', '#A855F7'], collector: ['#E3F7E6', '#5CCB6F'] };

  // ---- Age albums (owner, 2026-11-09) ----
  // Each age 3–10 has its own album: 7 themed collections of 15 stickers (js/albums/age-N.js).
  // Every collection follows one track: its stickers come one after another as the child FINISHES games,
  // gives right answers in them, wins stars, finishes colouring pictures, wins treasure-chest games, gets
  // 3 stars or finishes games with no mistakes. Each counts from the album's starting point (albumBase),
  // and all of it can be done with the free limits on (IK_CONFIG.limits), e.g. by playing again.
  // (The track names are the ones used in js/albums/age-N.js; 'fills' = finished pictures, 'minutes' =
  // no-mistake games: time played no longer counts, owner 2026-11-10.)
  // Pace (owner, 2026-11-11): one sticker per achievement moment at most. A typical child (about 5 answers
  // and 1–3 stars a game) gets one sticker per finished game for the first ~10 games (each one earned: first
  // game, first star, the first sticker of each game track…), then about one every 2–3 games: each game
  // track's 2nd sticker comes after ~35–45 games, then one every ~15 games. Timeline: infra/check-stickers.py,
  // part f. Pictures and chest wins are separate activities, so their first sticker comes with the first one.
  const TRACKS = {
    plays: { stat: 'games', key: 'chal_plays', steps: [3, 35, 50, 65, 80, 95, 110, 125, 140, 160, 180, 200, 220, 245, 270] },
    answers: { stat: 'answers', key: 'chal_answers', steps: [20, 185, 260, 335, 410, 485, 560, 640, 720, 800, 900, 1000, 1100, 1220, 1350] },
    stars: { stat: 'gameStars', key: 'chal_stars', steps: [10, 80, 110, 140, 170, 205, 240, 275, 310, 350, 390, 435, 480, 530, 580] }, // stars won in finished games, replays too
    fills: { stat: 'pictures', key: 'chal_drawings', one: 'chal_picture1', steps: [1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 17, 20, 24, 28, 32] },
    chests: { stat: 'chestWins', key: 'chal_chestGames', one: 'chal_chestGame1', steps: [1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 17, 20, 24, 28, 32] },
    three: { stat: 'threeStars', key: 'chal_threeStars', steps: [2, 12, 16, 20, 25, 30, 35, 40, 45, 51, 57, 63, 70, 77, 85] },
    minutes: { stat: 'perfectGames', key: 'chal_perfectGames', steps: [2, 13, 17, 21, 26, 31, 36, 41, 46, 52, 58, 64, 71, 78, 86] }
  };
  const TRACK_ORDER = Object.keys(TRACKS);
  const ALBUMS = {}, AGE_MIN = 3, AGE_MAX = 10, ALBUM_SIZE = 105, LANGS = ['en', 'fr', 'es', 'de', 'zh'];
  // 'English|Français|Español|Deutsch|中文' (one word = the same in every language)
  const names = s => { const p = String(s).split('|'); return LANGS.reduce((o, l, i) => { o[l] = p[i] || p[0]; return o; }, {}); };
  // Art: an emoji ('🦄'), with a colour turn ('🦄~200') and/or a little extra emoji ('🦄+⭐'), or a picture from
  // js/albums/motifs.js ('m:dragon:g,y,t'), which can also have a little extra emoji ('m:dragon:r,y,o,w+🔥').
  function parseArt(spec) {
    const [main, pair] = spec.split('+');
    if (main.indexOf('m:') === 0) { const p = main.split(':'); return { motif: p[1], params: (p[2] || '').split(','), pair: pair || '' }; }
    const [art, hue] = main.split('~');
    return { art, hue: hue ? +hue : 0, pair: pair || '' };
  }
  function addAlbum(age, cols) {
    const defs = [];
    cols.forEach(c => {
      const T = TRACKS[c.track];
      c.names = names(c.t);
      c.items.forEach(([spec, nm, bg], i) => {
        const need = T.steps[i];
        defs.push(Object.assign(parseArt(spec), {
          id: `a${age}-${c.id}-${i + 1}`, album: age, col: c.id, track: c.track, step: i, shape: c.frame, bg: bg ? bg.split(',') : c.bg,
          r: i >= 13 ? 3 : i >= 9 ? 2 : 1, foil: i === 14, names: names(nm),
          chal: () => (need === 1 && T.one ? t(T.one) : t(T.key, { n: need })),
          // Progress since the album's starting point (none before the album is set up for this child).
          goal: s => [Math.max(0, Math.min(prog(s, age, T.stat), need)), need],
          raw: s => prog(s, age, T.stat)
        }));
      });
    });
    ALBUMS[age] = { age, cols, defs };
  }
  const prog = (s, age, stat) => (s.prog && s.prog.age === age ? s.prog[stat] || 0 : 0);
  const albumAge = c => Math.max(AGE_MIN, Math.min(AGE_MAX, Store.currentAge(c)));
  const lang = () => (window.I18N && I18N.getLang ? I18N.getLang() : 'en');
  const nameOf = d => (d.names ? d.names[lang()] || d.names.en : t('stk_' + d.id));
  function findDef(id) {
    const m = /^a(\d+)-/.exec(id);
    return m ? (ALBUMS[+m[1]] ? ALBUMS[+m[1]].defs.find(d => d.id === id) : null) : DEFS.find(d => d.id === id);
  }
  const nameById = id => { const d = findDef(id); return d ? nameOf(d) : t('stk_new'); };

  // Loading: the album files sit next to this script (js/albums/). Script tags work from file:// and with the CSP.
  const ALBUM_DIR = SCRIPT_SRC.replace(/stickers\.js(\?.*)?$/, 'albums/');
  const loading = {};
  const inject = src => new Promise(res => {
    const s = document.createElement('script');
    s.src = src; s.onload = () => res(true); s.onerror = () => { s.remove(); res(false); };
    document.head.appendChild(s);
  });
  function loadAge(age) {
    age = Math.max(AGE_MIN, Math.min(AGE_MAX, age | 0));
    if (ALBUMS[age]) return Promise.resolve(true);
    if (!loading[age]) {
      const motifs = window.StickerMotifs ? Promise.resolve(true) : (loading.motifs = loading.motifs || inject(ALBUM_DIR + 'motifs.js'));
      loading[age] = motifs.then(() => inject(ALBUM_DIR + 'age-' + age + '.js')).then(() => {
        if (!ALBUMS[age]) delete loading[age]; // try again next time (e.g. offline)
        if (!window.StickerMotifs) delete loading.motifs;
        return !!ALBUMS[age];
      });
    }
    return loading[age];
  }
  // The child's own album, plus earlier albums the child has stickers from (after a birthday).
  function agesFor(c) {
    const set = new Set([albumAge(c)]);
    Object.keys(c.badges || {}).forEach(id => { const m = /^a(\d+)-/.exec(id); if (m) set.add(+m[1]); });
    return [...set];
  }
  // Stickers kept from earlier age albums (after a birthday): they count in the totals too.
  const kept = c => Object.keys(c.badges || {}).filter(id => { const m = /^a(\d+)-/.exec(id); return m && +m[1] !== albumAge(c); }).length;
  const ready = c => agesFor(c).every(a => ALBUMS[a]);
  // Gets the child ready (setup: saves counters and the album's starting point, never awards anything),
  // right away and again once the child's album(s) have loaded.
  const loadFor = c => {
    if (!c) return Promise.resolve(false);
    setup(c.id);
    return Promise.all(agesFor(c).map(loadAge)).then(r => { setup(c.id); return r.every(Boolean); });
  };

  const dayKey = ts => { const d = new Date(ts); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };

  // Everything the challenges need, computed from the child's saved data. Only COMPLETED things count:
  // finished games (history entries with stars), the lifetime tally, won chest games, finished pictures.
  function stats(c) {
    const group = Store.ageGroup(c), hist = (c.history || []).filter(h => h.stars > 0), T = Store.tally(c), ch = c.chests || {};
    const worldLevels = Array(10).fill(0), world3 = Array(10).fill(0);
    Object.entries(c.completed || {}).forEach(([k, stars]) => {
      const [g, i] = k.split(':');
      if (g !== group || !/^\d+$/.test(i)) return;
      const w = Math.floor(Number(i) / 10);
      if (w < 10) { worldLevels[w]++; if (stars === 3) world3[w]++; }
    });
    const skill3 = {};
    Object.keys(SKILL).forEach(k => { skill3[k] = hist.filter(h => SKILL[k].includes(h.game) && h.stars === 3).length; });
    const quizzes = hist.filter(h => h.game === 'quiz');
    // Longest run of consecutive days with play.
    const days = [...new Set(hist.map(h => dayKey(h.t)))].map(k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d).getTime(); }).sort((a, b) => a - b);
    let streak = days.length ? 1 : 0, run = 1;
    for (let i = 1; i < days.length; i++) { run = Math.round((days[i] - days[i - 1]) / 864e5) === 1 ? run + 1 : 1; streak = Math.max(streak, run); }
    const chestsWon = Object.values(ch.best || {}).filter(n => n > 0).length; // different chests whose game was won
    const s = {
      worldLevels, bestWorld3: Math.max(...world3), skill3, quizzes: quizzes.length, perfectQuiz: quizzes.filter(h => h.stars === 3).length,
      streak, hasFriend: !!c.friend, level: Store.level(c), improved: c.improved || 0,
      // Stars won in games (best per level and quiz); the +3 for a treasure chest doesn't count.
      bestStars: Object.values(c.completed || {}).reduce((a, n) => a + (+n || 0), 0),
      // Lifetime counts of completed things (Store.tally): never shrink, never count time.
      games: T.games, answers: T.answers, gameStars: T.stars, threeStars: T.three, perfectGames: T.perfect, pictures: T.pictures || 0,
      chestWins: ch.won != null ? ch.won : chestsWon, chestsWon,
      // Extra stats for the 50 milestone stickers
      levelsDone: worldLevels.reduce((a, b) => a + b, 0), perfectWorlds: world3.filter(n => n >= 10).length,
      gamePlays: hist.reduce((m, h) => { m[h.game] = (m[h.game] || 0) + 1; return m; }, {}),
      fastGames: hist.filter(h => h.stars === 3 && h.ms && h.ms < 60000).length,
      days: new Set(hist.map(h => dayKey(h.t))).size,
      // Every open picture of the child's own age (all, or just the animals): see Colouring.allDone.
      drawingsAll: window.Colouring ? Colouring.allDone(c, false) : false,
      animalsAll: window.Colouring ? Colouring.allDone(c, true) : false,
      stickersGot: Object.keys(c.badges || {}).length
    };
    // The age album counts from its starting point (see setup()).
    const age = albumAge(c), base = (c.albumBase || {})[age];
    s.prog = base ? Object.keys(base).reduce((p, k) => { p[k] = (s[k] || 0) - base[k]; return p; }, { age }) : null;
    return s;
  }
  // Starting point of an age album: today's counts, so only what the child completes from now on counts.
  // A child who already has stickers in this album (from before this rule) keeps them and goes on from there:
  // the start is set back by the step those stickers needed, so the next one needs only the rest.
  function albumStart(c, age, s) {
    const A = ALBUMS[age], got = c.badges || {}, base = {};
    A.cols.forEach(col => {
      const T = TRACKS[col.track];
      let k = 0; while (k < col.items.length && got[`a${age}-${col.id}-${k + 1}`]) k++;
      base[T.stat] = (s[T.stat] || 0) - (k ? T.steps[k - 1] : 0);
    });
    return base;
  }

  // The stickers for every age that fit this child.
  function baseFor(c) {
    const group = Store.ageGroup(c);
    // 3-year-olds don't get number games, so number stickers are hidden until they turn 4.
    const noNumbers = Store.currentAge(c) <= 3, NUM_IDS = ['sk_counting', 'sk_maths', 'gp_counting', 'gp_addition', 'gp_mathsrace'];
    return DEFS.filter(d => (!d.groups || d.groups.includes(group)) && !(noNumbers && NUM_IDS.includes(d.id)));
  }
  // The child's age album (once loaded) first, then the stickers for every age.
  function forChild(c) {
    const s = stats(c), got = c.badges || {}, A = ALBUMS[albumAge(c)];
    const order = A ? colOrder(c, A.cols).map(x => x.id) : [];
    const ageDefs = A ? A.defs.slice().sort((a, b) => order.indexOf(a.col) - order.indexOf(b.col) || a.step - b.step) : [];
    return ageDefs.concat(baseFor(c)).map(d => {
      const [have, need] = d.goal(s);
      return Object.assign({}, d, { have, need, got: !!got[d.id], isNew: !!(c.badgeNew || {})[d.id] });
    });
  }
  // Stickers won in an earlier age album (they stay in the album for good).
  function earlier(c) {
    const now = albumAge(c), got = c.badges || {}, isNew = c.badgeNew || {};
    return agesFor(c).filter(a => a !== now && ALBUMS[a]).sort((a, b) => a - b).map(a => ({ age: a, cols: ALBUMS[a].cols,
      defs: ALBUMS[a].defs.filter(d => got[d.id]).map(d => Object.assign({}, d, { have: 1, need: 1, got: true, isNew: !!isNew[d.id] })) })).filter(x => x.defs.length);
  }
  // Every sticker the child has won, oldest first (for the parents' dashboard).
  function earned(c) {
    const got = c.badges || {};
    return forChild(c).filter(d => d.got).concat(...earlier(c).map(x => x.defs)).sort((a, b) => (got[a.id] || 0) - (got[b.id] || 0));
  }

  // Getting a child ready, quietly: never awards, files or shows a sticker. Runs on every kid page (from
  // loadFor) and before every check. Saves the lifetime tally (worked out once from the history of an older
  // save) and the age album's starting point (first use of that age's album).
  function setup(childId) {
    const c = Store.getChild(childId);
    if (!c) return;
    const age = albumAge(c), needTally = !c.tally, needBase = !!ALBUMS[age] && !(c.albumBase && c.albumBase[age]);
    if (!needTally && !needBase) return;
    const T = Store.tally(c), s = stats(c);
    Store.updateChild(childId, k => {
      if (!k.tally) k.tally = Object.assign({}, T);
      if (needBase) { k.albumBase = Object.assign({}, k.albumBase); k.albumBase[age] = albumStart(k, age, s); }
    });
  }

  // Step 1 of an achievement moment: the counters of the stickers the child doesn't have yet, taken BEFORE
  // the achievement is saved. Pass the result to check() once it is saved.
  function before(childId) {
    setup(childId);
    const c = Store.getChild(childId);
    if (!c) return null;
    const s = stats(c), m = {};
    forChild(c).forEach(d => { if (!d.got) m[d.id] = d.raw(s); });
    return m;
  }

  // Step 2: award the sticker this moment has just earned: challenge met AND its counter moved since
  // before() (see the rule at the top). Without a before() snapshot nothing is awarded.
  // ONE sticker per moment at most (owner, 2026-11-10: "Next sticker" and "more stickers waiting" looked like
  // free stickers). When several are reached at once, pickOne() chooses; the others are not queued: they come
  // at a later moment that moves their counter again. Named exception (stkHeld): a milestone that can never
  // move again (ONCE, or a Collector sticker, which only moves when another sticker is won) and lost its moment
  // to another sticker is given at the next achievement moment that wins nothing else.
  // Returns [] or [the sticker], to reveal right there (result screen, finished picture, won chest, new friend).
  function check(childId, prev) {
    if (!prev || !Store.getChild(childId)) return [];
    setup(childId);
    const c = Store.getChild(childId), s = stats(c), list = forChild(c), held = c.stkHeld || {};
    const fresh = list.filter(d => !d.got && d.have >= d.need && d.id in prev && d.raw(s) > prev[d.id]);
    const pick = pickOne(fresh, s) || list.find(d => !d.got && held[d.id] && d.have >= d.need) || null;
    // Milestones this moment reached that can't come back: kept for a later moment (see above).
    const total = Object.keys(c.badges || {}).length + (pick ? 1 : 0);
    const hold = fresh.filter(d => d !== pick && ONCE.has(d.id))
      .concat(list.filter(d => d !== pick && !d.got && d.col === 'collector' && d.id in prev && prev[d.id] < d.need && total >= d.need));
    if (!pick && !hold.length) return [];
    const now = Date.now();
    Store.updateChild(childId, k => {
      k.badges = k.badges || {}; k.badgeNew = k.badgeNew || {};
      if (pick) { k.badges[pick.id] = now; k.badgeNew[pick.id] = 1; }
      const h = Object.assign({}, k.stkHeld);
      hold.forEach(d => { h[d.id] = 1; });
      if (pick) delete h[pick.id];
      k.stkHeld = h;
    });
    return pick ? [pick] : [];
  }
  // Which sticker a moment gives when several are reached at once: a once-only milestone (a whole world…),
  // else the age album (the collection that has waited longest past its target, then the track order),
  // else the stickers for every age ("first time" ones first, then the smallest target).
  function pickOne(fresh, s) {
    if (!fresh.length) return null;
    const once = fresh.filter(d => ONCE.has(d.id));
    if (once.length) return once[0];
    const over = d => (d.raw(s) - d.need) / d.need;
    const alb = fresh.filter(d => d.album).sort((a, b) => over(b) - over(a) || TRACK_ORDER.indexOf(a.track) - TRACK_ORDER.indexOf(b.track) || a.step - b.step);
    if (alb.length) return alb[0];
    const rank = d => (FIRST.indexOf(d.id) + 1) || 99;
    return fresh.slice().sort((a, b) => rank(a) - rank(b) || a.need - b.need || ORDER[a.id] - ORDER[b.id])[0];
  }

  // The test account (Store.login) is made with some past games: it gets the stickers for every age that
  // those games earned, as a real child would have, so its past is never handed out later.
  function seed(c) {
    const s = stats(c);
    c.badges = c.badges || {};
    for (let pass = 0; pass < 4; pass++) {
      const add = baseFor(c).filter(d => !c.badges[d.id] && d.goal(s)[0] >= d.goal(s)[1]);
      if (!add.length) break;
      add.forEach(d => { c.badges[d.id] = c.addedAt || 1; });
      s.stickersGot = Object.keys(c.badges).length;
    }
    return c;
  }

  // ---- Visuals ----
  // Sticker frames (age albums choose one per collection). Paths in a 100 x 100 box.
  function flowerPath(n) {
    let p = '';
    for (let i = 0; i < n; i++) {
      const a0 = (Math.PI * 2 * i) / n - Math.PI / 2, a1 = (Math.PI * 2 * (i + 1)) / n - Math.PI / 2, am = (a0 + a1) / 2;
      const pt = (a, r) => (50 + r * Math.cos(a)).toFixed(1) + ' ' + (50 + r * Math.sin(a)).toFixed(1);
      p += (i ? '' : 'M' + pt(a0, 40)) + ' Q' + pt(am, 58) + ' ' + pt(a1, 40);
    }
    return p + ' Z';
  }
  const FRAMES = {
    circle: 'M50 3 A47 47 0 1 1 49.9 3 Z',
    square: 'M27 4 H73 Q96 4 96 27 V73 Q96 96 73 96 H27 Q4 96 4 73 V27 Q4 4 27 4 Z',
    hex: 'M50 3 L91 26.5 L91 73.5 L50 97 L9 73.5 L9 26.5 Z',
    heart: 'M50 93 C14 70 1 48 10 27 C19 7 43 6 50 25 C57 6 81 7 90 27 C99 48 86 70 50 93 Z',
    cloud: 'M27 86 Q4 86 4 63 Q4 44 22 41 Q24 15 50 14 Q70 13 78 31 Q97 33 97 57 Q97 86 72 86 Z',
    shield: 'M50 3 L93 15 Q94 66 50 97 Q6 66 7 15 Z',
    flower: flowerPath(8),
    burst: (() => { let p = ''; for (let i = 0; i < 32; i++) { const a = (Math.PI * i) / 16 - Math.PI / 2, r = i % 2 ? 41 : 48; p += (i ? ' L' : 'M') + (50 + r * Math.cos(a)).toFixed(1) + ' ' + (50 + r * Math.sin(a)).toFixed(1); } return p + ' Z'; })(),
    scallop: scallopPath(50, 50, 47, 41, 14)
  };
  const INNER = 'transform="translate(50 50) scale(.84) translate(-50 -50)"';

  function art(d, opts) {
    opts = opts || {};
    const locked = opts.locked, sil = locked && opts.silhouette;
    const id = ('g' + d.id + (opts.uid || '')).replace(/[^\w-]/g, '');
    // Die-cut sticker: a white rim (golden for rare age-album stickers), a gradient, the picture and a shine.
    // Stickers for every age: scalloped edge when rare or super rare. Age albums: the collection's frame.
    const P = d.shape ? FRAMES[d.shape] || FRAMES.circle : d.r >= 2 && !locked ? FRAMES.scallop : FRAMES.circle;
    const rim = !locked && d.album && d.r >= 2 ? '#FFE7A3' : '#fff';
    const bg = locked ? ['#F1F5F6', '#D5DFE2'] : d.bg;
    const foil = d.foil && !locked ? `<linearGradient id="f${id}" x1="0" y1="0" x2="1" y2="1" spreadMethod="reflect">
          <stop offset="0" stop-color="#FF9AD5"/><stop offset=".25" stop-color="#FFE66D"/><stop offset=".5" stop-color="#8CF5C4"/><stop offset=".75" stop-color="#8AB8FF"/><stop offset="1" stop-color="#E29BFF"/>
          ${opts.still ? '' : '<animateTransform attributeName="gradientTransform" type="translate" values="-.5 -.5; .5 .5; -.5 -.5" dur="5s" repeatCount="indefinite"/>'}</linearGradient>` : '';
    const motif = d.motif && (!locked || sil) && window.StickerMotifs
      ? `<g transform="translate(15 15) scale(.7)"${sil ? ` filter="url(#s${id})"` : ''}>${StickerMotifs.draw(d.motif, d.params, id)}</g>` : '';
    const face = d.motif ? (locked && !sil ? '?' : '') : locked && !sil ? '?' : d.art;
    return `<span class="stk ${locked ? 'locked' : 'got r' + d.r}${d.foil && !locked ? ' foil' : ''} ${opts.cls || ''}">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <defs><radialGradient id="${id}" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></radialGradient>${foil}
          ${sil && d.motif ? `<filter id="s${id}"><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .22 0"/></filter>` : ''}</defs>
        <path d="${P}" fill="${rim}"/>
        ${d.album ? `<path d="${P}" ${INNER}` : '<circle cx="50" cy="50" r="39"'} fill="url(#${id})" ${locked ? 'stroke="#B8C7CB" stroke-width="2.4" stroke-dasharray="5 5"' : ''}/>
        ${foil ? `<path d="${P}" ${INNER} fill="url(#f${id})" opacity=".5" style="mix-blend-mode:soft-light"/>` : ''}
        ${motif}
        ${!locked ? '<ellipse cx="36" cy="25" rx="17" ry="8" fill="#fff" opacity=".4" transform="rotate(-20 36 25)"/>' : ''}
      </svg>
      ${face ? `<span class="stk-emoji ${sil ? 'sil' : ''}"${d.hue && !locked ? ` style="filter:hue-rotate(${d.hue}deg)"` : ''}>${face}</span>` : ''}
      ${d.pair && (!locked || sil) ? `<span class="stk-pair${sil ? ' sil' : ''}">${d.pair}</span>` : ''}
      ${locked ? '<span class="stk-lock">🔒</span>' : ''}
      ${!locked && d.r === 3 ? '<span class="stk-sparkle">✨</span>' : ''}
    </span>`;
  }
  function scallopPath(cx, cy, R, r, n) {
    let p = '';
    for (let i = 0; i <= n * 2; i++) {
      const a = (Math.PI * i) / n, rad = i % 2 === 0 ? R : r + (R - r) * 0.55;
      p += (i ? ' L' : 'M') + (cx + rad * Math.cos(a)).toFixed(1) + ' ' + (cy + rad * Math.sin(a)).toFixed(1);
    }
    return p + ' Z';
  }
  const rarityLabel = r => t(['', 'rar_common', 'rar_rare', 'rar_epic'][r]);

  // Locked sticker tapped: show the challenge, a silhouette hint and the progress.
  function showChallenge(d, modal) {
    const pct = Math.round(Math.min(1, d.have / d.need) * 100);
    const m = modal(`<div class="stk-challenge">
      ${art(d, { locked: true, silhouette: true, cls: 'big', uid: 'ch' })}
      <p class="stk-rarity r${d.r}">${rarityLabel(d.r)}</p>
      <h2>${Art.esc(nameOf(d))}</h2>
      <div class="bubble"><span>🎯 ${t('howToWin')} <strong>${d.chal()}</strong></span></div>
      <div class="stk-progress"><div class="bar"><i style="width:${pct}%"></i></div><span>${d.have} / ${d.need}</span></div>
      <div class="row center"><button class="btn primary" data-x>${t('okLetsGo')} 💪</button></div></div>`);
    GK.speak(t('howToWin') + ' ' + d.chal());
    m.el.querySelector('[data-x]').onclick = m.close;
  }

  // The big moment: gift box → tap → confetti burst → the sticker. list = what check() returned for THIS
  // moment: one sticker at most (owner, 2026-11-10), so there is no "Next sticker" and nothing "waiting".
  function celebrate(list, modal, done) {
    list = list.slice(0, 1);
    const next = () => {
      const d = list.shift();
      if (!d) return done && done();
      const name = Art.esc(nameOf(d));
      const m = modal(`<div class="stk-reveal">
          <div class="rays"></div>
          <p class="reveal-title">${t('youWonSticker')}</p>
          <button type="button" class="gift" aria-label="${t('tapToOpen')}">🎁</button>
          <p class="tap-hint">${t('tapToOpen')}</p>
          <div class="reveal-sticker" hidden>
            ${art(d, { cls: 'huge', uid: 'rv' })}
            <p class="stk-rarity r${d.r}">${rarityLabel(d.r)}</p>
            <h2>${name}</h2>
            <p class="muted stk-done">✅ ${d.chal()}</p>
            <button type="button" class="btn primary big" data-ok>${t('addToAlbum')} ✨</button>
          </div>
          <div class="confetti"></div></div>`);
      m.el.classList.add('reveal-back');
      GK.sfx('pop');
      GK.speak(t('youWonSticker') + ' ' + t('tapToOpen'));
      const gift = m.el.querySelector('.gift');
      gift.onclick = () => {
        gift.classList.add('open'); GK.sfx('win');
        setTimeout(() => {
          gift.hidden = true; m.el.querySelector('.tap-hint').hidden = true;
          m.el.querySelector('.reveal-sticker').hidden = false;
          burst(m.el.querySelector('.confetti'));
          setTimeout(() => GK.sfx('win'), 350);
          // Age-album stickers have no recorded name, so Brainy cheers without it.
          GK.speak(d.album ? t('wowNew') : t('wowSticker', { name: t('stk_' + d.id) }));
        }, 450);
      };
      m.el.querySelector('[data-ok]').onclick = () => { m.close(); next(); };
    };
    next();
  }
  function burst(box) {
    const colours = ['#FFD21F', '#3ED8E8', '#F47C8A', '#5CCB6F', '#A855F7', '#FF8A3D'];
    const shapes = ['⭐', '✨', '🎉', '💖', '🌟'];
    for (let i = 0; i < 70; i++) {
      const p = document.createElement('i');
      const isEmoji = i % 7 === 0;
      p.className = 'cf' + (isEmoji ? ' emo' : '');
      if (isEmoji) p.textContent = shapes[i % shapes.length]; else p.style.background = colours[i % colours.length];
      const a = Math.random() * Math.PI * 2, dist = 120 + Math.random() * 260;
      p.style.setProperty('--x', Math.cos(a) * dist + 'px');
      p.style.setProperty('--y', Math.sin(a) * dist - 80 + 'px');
      p.style.setProperty('--r', Math.random() * 720 - 360 + 'deg');
      p.style.animationDelay = Math.random() * 0.15 + 's';
      box.appendChild(p);
    }
  }

  // Order of the age album's collections. From age 7, the child's avatar choice (kid.me.gender) brings the
  // princess/fairy/royal collections (girls) or the dragon/knight/action ones (boys) to the front. Nothing is
  // hidden: every child sees and can win every collection (owner, 2026-11-09).
  function colOrder(kid, cols) {
    const g = kid.me && kid.me.gender, first = albumAge(kid) >= 7 ? (g === 'girl' ? 'royal' : g === 'boy' ? 'action' : '') : '';
    return first ? cols.filter(c => c.kind === first).concat(cols.filter(c => c.kind !== first)) : cols.slice();
  }

  // Album page: shelves of collection covers (the child's age album, the stickers for every age, earlier
  // albums), and the open collection below. Keeps the page short on phones.
  const lastOpen = {};
  function album(root, kid, modal) {
    const list = forChild(kid), age = albumAge(kid), A = ALBUMS[age];
    const old = kept(kid), got = list.filter(d => d.got).length + old, size = list.length + old;
    const shelf = (title, cols) => cols.length ? `<section class="album-shelf card"><h2>${title}</h2><div class="shelf">${cols.map(c => {
      const n = c.items.filter(d => d.got).length, fresh = c.items.some(d => d.isNew);
      return `<button type="button" class="cover${n === c.items.length ? ' done' : ''}" data-col="${c.key}" aria-label="${Art.esc(c.name)}: ${n} / ${c.items.length}">
        ${art({ id: 'cv' + c.key, art: c.icon, bg: c.bg, shape: c.frame, r: 1, album: c.album }, { cls: 'cover-stk', uid: 'cv' })}
        <span class="cover-name">${Art.esc(c.name)}</span><span class="cover-count">${n} / ${c.items.length}</span>
        ${fresh ? `<span class="new-tag">${t('newTag')}</span>` : ''}</button>`; }).join('')}</div></section>` : '';
    const ageCols = A ? colOrder(kid, A.cols).map(c => ({ key: 'a' + age + '-' + c.id, icon: c.icon, name: c.names[lang()] || c.names.en, bg: c.bg, frame: c.frame, album: age,
      items: list.filter(d => d.album === age && d.col === c.id) })) : [];
    const baseCols = COLLECTIONS.map(col => ({ key: 'b-' + col, icon: COL_ICON[col], name: t('col_' + col + '_t'), bg: COL_BG[col], frame: 'circle',
      items: list.filter(d => !d.album && d.col === col) })).filter(c => c.items.length);
    const oldCols = earlier(kid).map(x => ({ key: 'e' + x.age, icon: '🎂', name: t('alb_age', { n: x.age }), bg: ['#FFF4D6', '#FFB703'], frame: 'flower', album: x.age, items: x.defs }));
    const all = ageCols.concat(baseCols, oldCols);
    let open = all.find(c => c.key === lastOpen[kid.id]) || ageCols.find(c => c.items.some(d => d.isNew)) || ageCols.find(c => c.items.some(d => !d.got)) || all[0];
    root.innerHTML = `
      <div class="album-head card">
        <div class="album-brainy" aria-hidden="true">${Art.brainy({ mood: 'cheer' })}</div>
        <div class="album-fill" role="img" aria-label="${t('albumCount', { n: got, total: size })}">
          <span class="album-fill-icon" aria-hidden="true">🦄</span>
          <div class="bar"><i style="width:${Math.max(4, Math.round(got / size * 100))}%"></i></div>
          <span class="album-fill-n">${got} / ${size}</span>
        </div>
      </div>
      ${shelf('🎂 ' + t('alb_mine', { n: age }), ageCols)}
      ${shelf('⭐ ' + t('alb_more'), baseCols)}
      ${shelf('📚 ' + t('alb_earlier'), oldCols)}
      <section class="album-page card" id="album-open"></section>`;
    const page = root.querySelector('#album-open');
    function show(c, scroll) {
      open = c; lastOpen[kid.id] = c.key;
      root.querySelectorAll('.cover').forEach(b => b.classList.toggle('active', b.dataset.col === c.key));
      // In an age album the next sticker to win shows its silhouette and progress; later ones stay a surprise.
      const nextUp = c.items.find(d => !d.got && d.album);
      page.innerHTML = `<h3><span>${Art.esc(c.name)}</span> <small class="muted">${c.items.filter(d => d.got).length} / ${c.items.length}</small></h3>
        <div class="album-grid">${c.items.map(d => `
          <button type="button" class="album-slot ${d.got ? 'is-got' : 'is-locked'} ${d.isNew ? 'is-new' : ''}" data-s="${d.id}" aria-label="${Art.esc(nameOf(d))}${d.got ? '' : ' – ' + t('locked')}">
            ${art(d, { locked: !d.got, silhouette: d === nextUp })}
            ${d.isNew ? `<span class="new-tag">${t('newTag')}</span>` : ''}
            ${d.got ? `<span class="slot-name">${Art.esc(nameOf(d))}</span>` : ''}
            ${!d.got && d.have > 0 ? `<span class="slot-prog"><i style="width:${Math.round(d.have / d.need * 100)}%"></i></span>` : ''}
          </button>`).join('')}</div>`;
      page.querySelectorAll('[data-s]').forEach(b => b.onclick = () => {
        const d = c.items.find(x => x.id === b.dataset.s);
        if (d.got) {
          GK.sfx('good'); b.classList.remove('wiggle'); void b.offsetWidth; b.classList.add('wiggle');
          GK.speak(d.album ? d.chal() : t('stk_' + d.id) + '! ' + d.chal());
        } else showChallenge(d, modal);
      });
      if (scroll) page.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    root.querySelectorAll('.cover').forEach(b => b.onclick = () => { GK.sfx('tap'); show(all.find(c => c.key === b.dataset.col), true); });
    if (open) show(open, false);
    // Stickers seen in the album are no longer "new".
    if (list.some(d => d.isNew) || oldCols.some(c => c.items.some(d => d.isNew))) setTimeout(() => Store.updateChild(kid.id, c => { c.badgeNew = {}; }), 1500);
  }

  window.Stickers = {
    before, check, setup, seed, forChild, earned, celebrate, album, art, load: loadAge, loadFor, ready, addAlbum, name: nameOf, nameById,
    count: c => Object.keys(c.badges || {}).length,
    total: c => baseFor(c).length + ALBUM_SIZE + kept(c), // every age album has 105 stickers, loaded or not
    _albums: ALBUMS, _tracks: TRACKS
  };
})();
