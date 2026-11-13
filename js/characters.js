/* SVG artwork: Brainy, the virtual friend, shapes and balloons. */
(function () {
  const TEAL = '#0E6E7E', CYAN = '#3ED8E8', YELLOW = '#FFD21F', INK = '#12323A';

  // ---------- Brainy ----------
  // A cute, baby-like cloud brain: big sparkly eyes, rosy cheeks, a little sprout on top
  // (Brainy grows with the child), tiny feet and a waving paw. No glasses or graduation cap.
  function brainy(opts) {
    opts = opts || {};
    const mood = opts.mood || 'happy'; // happy | cheer | think
    const LINE = '#169FB3';
    const puffs = [[100, 116, 56], [56, 110, 30], [144, 110, 30], [70, 78, 30], [130, 78, 30], [100, 66, 32], [66, 144, 28], [134, 144, 28], [100, 150, 34]];
    const outline = puffs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r + 4}" fill="${LINE}"/>`).join('');
    const fill = puffs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${CYAN}"/>`).join('');
    const feet = `<ellipse cx="82" cy="184" rx="15" ry="9" fill="${LINE}"/><ellipse cx="118" cy="184" rx="15" ry="9" fill="${LINE}"/>
      <ellipse cx="82" cy="182" rx="12" ry="6.5" fill="#7BE6F0"/><ellipse cx="118" cy="182" rx="12" ry="6.5" fill="#7BE6F0"/>`;
    const sprout = `<path d="M100 40 Q98 28 101 18" stroke="#3FAE52" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M101 22 Q86 6 74 16 Q86 30 101 22 Z" fill="#5CCB6F" stroke="#3FAE52" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M101 20 Q114 2 128 10 Q118 26 101 20 Z" fill="#7BDC8B" stroke="#3FAE52" stroke-width="2.5" stroke-linejoin="round"/>`;
    const shine = `<ellipse cx="68" cy="70" rx="15" ry="8" fill="#B8F6FB" opacity=".9" transform="rotate(-25 68 70)"/>
      <circle cx="148" cy="96" r="4" fill="#B8F6FB" opacity=".9"/>`;
    const eyes = mood === 'think'
      ? `<path d="M66 108 q14 -12 28 0 M106 108 q14 -12 28 0" stroke="${INK}" stroke-width="5.5" fill="none" stroke-linecap="round"/>`
      : `<ellipse cx="80" cy="106" rx="16" ry="18" fill="#fff"/><ellipse cx="120" cy="106" rx="16" ry="18" fill="#fff"/>
         <ellipse cx="81" cy="109" rx="11" ry="13" fill="${INK}"/><ellipse cx="121" cy="109" rx="11" ry="13" fill="${INK}"/>
         <circle cx="85" cy="103" r="4.5" fill="#fff"/><circle cx="125" cy="103" r="4.5" fill="#fff"/>
         <circle cx="77" cy="115" r="2.2" fill="#fff"/><circle cx="117" cy="115" r="2.2" fill="#fff"/>`;
    const cheeks = `<ellipse cx="60" cy="130" rx="10" ry="6.5" fill="#FF7FA0" opacity=".85"/><ellipse cx="140" cy="130" rx="10" ry="6.5" fill="#FF7FA0" opacity=".85"/>`;
    const mouth = mood === 'cheer'
      ? `<path d="M86 130 Q100 152 114 130 Z" fill="#7A1F2B"/><ellipse cx="100" cy="142" rx="8" ry="5" fill="#FF8FA3"/>`
      : mood === 'think'
        ? `<path d="M92 136 q8 5 16 0" stroke="#7A1F2B" stroke-width="4" fill="none" stroke-linecap="round"/>`
        : `<path d="M88 132 Q100 146 112 132" stroke="#7A1F2B" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
    const sparkles = mood === 'cheer' ? `<path d="M30 60 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z" fill="${YELLOW}"/><path d="M168 46 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2 Z" fill="${YELLOW}"/>` : '';
    // Little waving paw.
    const hand = opts.thumb !== false
      ? `<g class="wave-hand" transform="translate(168 112) rotate(15)">
           <circle cx="0" cy="0" r="15" fill="${LINE}"/><circle cx="0" cy="0" r="11.5" fill="${CYAN}"/>
           <circle cx="-5" cy="-9" r="4.5" fill="${CYAN}" stroke="${LINE}" stroke-width="2.5"/><circle cx="4" cy="-11" r="4.5" fill="${CYAN}" stroke="${LINE}" stroke-width="2.5"/><circle cx="11" cy="-5" r="4.2" fill="${CYAN}" stroke="${LINE}" stroke-width="2.5"/></g>` : '';
    return `<svg class="brainy ${opts.className || ''}" viewBox="0 0 200 200" role="img" aria-label="Brainy">
      ${feet}${outline}${fill}${shine}${sprout}${eyes}${cheeks}${mouth}${sparkles}${hand}</svg>`;
  }
  // ---------- Virtual friend ----------
  const SKINS = ['#F9D7B5', '#E8B48A', '#C68642', '#8D5524'];
  const HAIR = ['#3B2416', '#3B2416', '#1E130C', '#120B07'];

  // stage: 0 = 3–4, 1 = 5–6, 2 = 7–10. level adds a little height and unlocks outfits.
  function friend(f, stage, level) {
    f = f || { gender: 'girl', skin: 0 };
    stage = stage || 0; level = level || 1;
    const skin = SKINS[f.skin || 0], hair = HAIR[f.skin || 0];
    const grow = Math.min(level - 1, 12) * 1.6;
    const headR = [44, 40, 36][stage];
    const bodyH = [48, 60, 72][stage] + grow * 0.6;
    const legH = [24, 34, 46][stage] + grow * 0.4;
    const bodyW = [58, 62, 64][stage];
    const cx = 100, bottom = 254;
    const legsTop = bottom - legH, bodyTop = legsTop - bodyH, cy = bodyTop - headR + 10;
    const girl = f.gender === 'girl';
    const top = f.top || (girl ? '#F47C8A' : CYAN), pants = TEAL, edge = f.top ? 'rgba(0,0,0,.18)' : null;
    let s = '';

    if (level >= 3 && !f.plain) s += `<rect x="${cx - bodyW / 2 - 10}" y="${bodyTop + 6}" width="${bodyW + 20}" height="${bodyH * 0.75}" rx="14" fill="${YELLOW}" stroke="#D4A90F" stroke-width="3"/>`;
    if (girl) s += `<ellipse cx="${cx}" cy="${cy + headR * 0.35}" rx="${headR * 1.12}" ry="${headR * 1.12}" fill="${hair}"/>`;

    // legs + shoes
    s += `<rect x="${cx - 20}" y="${legsTop - 4}" width="16" height="${legH + 2}" rx="8" fill="${girl ? skin : pants}"/>
          <rect x="${cx + 4}" y="${legsTop - 4}" width="16" height="${legH + 2}" rx="8" fill="${girl ? skin : pants}"/>
          <ellipse cx="${cx - 14}" cy="${bottom}" rx="14" ry="7" fill="${INK}"/><ellipse cx="${cx + 14}" cy="${bottom}" rx="14" ry="7" fill="${INK}"/>`;
    // arms
    const sy = bodyTop + 14;
    s += `<path d="M${cx - bodyW / 2 + 4} ${sy} L${cx - bodyW / 2 - 16} ${sy + bodyH * 0.55}" stroke="${skin}" stroke-width="13" stroke-linecap="round"/>
          <path d="M${cx + bodyW / 2 - 4} ${sy} L${cx + bodyW / 2 + 18} ${sy - 18}" stroke="${skin}" stroke-width="13" stroke-linecap="round"/>`;
    // body
    if (girl) s += `<path d="M${cx - bodyW / 2 + 6} ${bodyTop} L${cx + bodyW / 2 - 6} ${bodyTop} L${cx + bodyW / 2 + 10} ${legsTop + 6} L${cx - bodyW / 2 - 10} ${legsTop + 6} Z" fill="${top}" stroke="${edge || '#D95E6D'}" stroke-width="3" stroke-linejoin="round"/>`;
    else s += `<rect x="${cx - bodyW / 2}" y="${bodyTop}" width="${bodyW}" height="${bodyH + 4}" rx="16" fill="${top}" stroke="${edge || '#22B9CB'}" stroke-width="3"/>
               <rect x="${cx - bodyW / 2 + 2}" y="${legsTop - 6}" width="${bodyW - 4}" height="12" rx="4" fill="${pants}"/>`;
    s += `<text x="${cx}" y="${bodyTop + bodyH * 0.5}" text-anchor="middle" font-size="${18 + stage * 2}" fill="#fff" font-family="Fredoka, sans-serif" font-weight="700">${escapeAttr(f.mark || '★')}</text>`;
    if (level >= 5 && !f.plain) s += `<path d="M${cx - 22} ${bodyTop + 2} Q${cx} ${bodyTop + 14} ${cx + 22} ${bodyTop + 2}" stroke="${YELLOW}" stroke-width="9" fill="none" stroke-linecap="round"/>`;

    // head
    s += `<circle cx="${cx}" cy="${cy}" r="${headR}" fill="${skin}"/>`;
    // hair
    const hTop = `M${cx - headR - 1} ${cy + 2} A${headR + 1} ${headR + 1} 0 0 1 ${cx + headR + 1} ${cy + 2} Q${cx + headR * 0.4} ${cy - headR * 0.45} ${cx} ${cy - headR * 0.35} Q${cx - headR * 0.5} ${cy - headR * 0.5} ${cx - headR - 1} ${cy + 2} Z`;
    s += `<path d="${hTop}" fill="${hair}"/>`;
    if (girl) s += `<circle cx="${cx - headR - 6}" cy="${cy - headR * 0.3}" r="${headR * 0.38}" fill="${hair}"/>
                    <circle cx="${cx + headR + 6}" cy="${cy - headR * 0.3}" r="${headR * 0.38}" fill="${hair}"/>
                    <path d="M${cx + headR * 0.35} ${cy - headR * 0.85} l14 -10 l0 20 Z M${cx + headR * 0.35} ${cy - headR * 0.85} l-14 -10 l0 20 Z" fill="${YELLOW}"/>`;
    else s += `<path d="M${cx - 6} ${cy - headR + 2} q6 -14 16 -8" stroke="${hair}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    // face
    const ey = cy + headR * 0.15, ex = headR * 0.38;
    s += `<ellipse cx="${cx - ex}" cy="${ey}" rx="5.5" ry="7" fill="${INK}"/><ellipse cx="${cx + ex}" cy="${ey}" rx="5.5" ry="7" fill="${INK}"/>
          <circle cx="${cx - ex + 2}" cy="${ey - 3}" r="2" fill="#fff"/><circle cx="${cx + ex + 2}" cy="${ey - 3}" r="2" fill="#fff"/>
          <circle cx="${cx - ex - 8}" cy="${ey + 13}" r="6" fill="#F47C8A" opacity=".45"/><circle cx="${cx + ex + 8}" cy="${ey + 13}" r="6" fill="#F47C8A" opacity=".45"/>
          <path d="M${cx - 10} ${ey + 14} Q${cx} ${ey + 24} ${cx + 10} ${ey + 14}" stroke="#7A1F2B" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    if (level >= 8 && !f.plain) s += `<polygon points="${cx - 20},${cy - headR + 4} ${cx - 20},${cy - headR - 16} ${cx - 10},${cy - headR - 6} ${cx},${cy - headR - 20} ${cx + 10},${cy - headR - 6} ${cx + 20},${cy - headR - 16} ${cx + 20},${cy - headR + 4}" fill="${YELLOW}" stroke="#D4A90F" stroke-width="2.5" stroke-linejoin="round"/>`;

    return `<svg class="friend" viewBox="0 0 200 262" role="img" aria-label="${escapeAttr(f.name || 'friend')}">${s}</svg>`;
  }

  // ---------- Shapes ----------
  function starPoints(cx, cy, R, r, n) {
    const pts = [];
    for (let i = 0; i < n * 2; i++) {
      const a = Math.PI / n * i - Math.PI / 2, rad = i % 2 ? r : R;
      pts.push((cx + Math.cos(a) * rad).toFixed(1) + ',' + (cy + Math.sin(a) * rad).toFixed(1));
    }
    return pts.join(' ');
  }
  const SHAPE_PATHS = {
    circle: a => `<circle cx="50" cy="50" r="42" ${a}/>`,
    square: a => `<rect x="10" y="10" width="80" height="80" rx="6" ${a}/>`,
    triangle: a => `<polygon points="50,8 94,90 6,90" stroke-linejoin="round" ${a}/>`,
    star: a => `<polygon points="${starPoints(50, 53, 46, 20, 5)}" stroke-linejoin="round" ${a}/>`,
    heart: a => `<path d="M50 90 C18 66 4 46 16 26 C28 8 47 14 50 30 C53 14 72 8 84 26 C96 46 82 66 50 90 Z" ${a}/>`,
    rectangle: a => `<rect x="4" y="24" width="92" height="52" rx="5" ${a}/>`,
    oval: a => `<ellipse cx="50" cy="50" rx="45" ry="30" ${a}/>`,
    diamond: a => `<polygon points="50,4 90,50 50,96 10,50" stroke-linejoin="round" ${a}/>`
  };
  function shape(type, color, outline) {
    const a = outline
      ? `fill="rgba(14,110,126,.10)" stroke="${TEAL}" stroke-width="4" stroke-dasharray="8 6"`
      : `fill="${color}" stroke="${TEAL}" stroke-width="4"`;
    return `<svg class="shape-svg" viewBox="0 0 100 100" aria-hidden="true">${SHAPE_PATHS[type](a)}</svg>`;
  }

  const COLOURS = { red: '#EF4444', blue: '#3B82F6', yellow: '#FFD21F', green: '#5CCB6F', orange: '#FB923C', purple: '#A855F7', pink: '#F472B6' };

  function balloon(color) {
    return `<svg class="balloon-svg" viewBox="0 0 80 130" aria-hidden="true">
      <path d="M40 92 Q34 110 44 128" stroke="#7a8b90" stroke-width="2" fill="none"/>
      <ellipse cx="40" cy="46" rx="34" ry="42" fill="${color}" stroke="rgba(0,0,0,.18)" stroke-width="2"/>
      <polygon points="35,92 45,92 40,84" fill="${color}"/>
      <ellipse cx="28" cy="30" rx="7" ry="12" fill="#fff" opacity=".45" transform="rotate(-20 28 30)"/></svg>`;
  }

  function escapeAttr(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  const starPts = (cx, cy, r, rot) => { let p = ''; for (let i = 0; i < 10; i++) { const a = (Math.PI * i) / 5 - Math.PI / 2 + rot * Math.PI / 180, rr = i % 2 ? r * 0.4 : r; p += (cx + rr * Math.cos(a)).toFixed(2) + ',' + (cy + rr * Math.sin(a)).toFixed(2) + ' '; } return `<polygon points="${p.trim()}" fill="#FFDE00"/>`; };
  // Real flags drawn in SVG (emoji flags don't show on Windows). Shown as round, glossy badges.
  const FLAGS = {
    gb: `<rect width="60" height="30" fill="#012169"/>
         <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/>
         <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" stroke-width="2.4"/>
         <path d="M30,0 V30 M0,15 H60" stroke="#fff" stroke-width="10"/>
         <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" stroke-width="6"/>`,
    fr: `<rect x="15" width="10" height="30" fill="#0055A4"/><rect x="25" width="10" height="30" fill="#fff"/><rect x="35" width="10" height="30" fill="#EF4135"/>`,
    es: `<rect width="60" height="30" fill="#AA151B"/><rect y="7.5" width="60" height="15" fill="#F1BF00"/>
         <g transform="translate(22 15)"><rect x="-3.2" y="-4" width="6.4" height="7.5" rx="1.6" fill="#AA151B" stroke="#C8962E" stroke-width="0.8"/><rect x="-3.6" y="-5.6" width="7.2" height="1.6" rx=".6" fill="#C8962E"/></g>`,
    de: `<rect width="60" height="10" fill="#000"/><rect y="10" width="60" height="10" fill="#DD0000"/><rect y="20" width="60" height="10" fill="#FFCE00"/>`,
    // China: drawn on the visible square (x 15–45) so the stars stay inside the round badge.
    cn: `<rect width="60" height="30" fill="#EE1C25"/>${starPts(24, 11, 6.5, 0)}${starPts(33.5, 4.5, 2, 23)}${starPts(36.5, 8.5, 2, 46)}${starPts(36.5, 13.5, 2, 70)}${starPts(33.5, 17.5, 2, 21)}`
  };
  function flag(code) {
    const body = FLAGS[code] || FLAGS.gb;
    // viewBox centres a square crop of the flag; the circle mask makes a round badge.
    return `<span class="flag-badge" aria-hidden="true"><svg viewBox="15 0 30 30" preserveAspectRatio="xMidYMid slice">${body}</svg><i class="flag-shine"></i></span>`;
  }

  // T-shirt colours the child can choose for their own character.
  const SHIRTS = ['#A855F7', '#5CCB6F', '#FB923C', '#3B82F6', '#F472B6', '#EF4444', '#FFD21F', '#14B8A6'];
  window.Art = { brainy, friend, shape, balloon, flag, SHIRTS, COLOURS, SKINS, SHAPES: Object.keys(SHAPE_PATHS), esc: escapeAttr };
})();
