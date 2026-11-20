/* IntelloKids sticker art: small original SVG pictures for the age albums (js/albums/age-*.js).
   Loaded with the first age album (Stickers.load). Each motif draws in a 100 x 100 box and takes the
   parameters written in the album file, e.g. 'm:dragon:#E53935,#FFD54F,#B71C1C,#FFF3C4'.
   Colours are a hex value or one of the letters in C below. Nothing here is copied from any brand or show. */
(function () {
  const C = { r: '#EF4444', o: '#FB923C', y: '#FFD21F', g: '#5CCB6F', b: '#3B82F6', p: '#A855F7', k: '#F472B6', t: '#14B8A6', n: '#A16207',
    w: '#FFFFFF', s: '#CBD5E1', d: '#F5B800', x: '#1F2937', c: '#3ED8E8', m: '#6EE7B7', l: '#C4B5FD', v: '#7C3AED', e: '#94A3B8', a: '#F9D7B5' };
  const col = v => C[v] || v || '#94A3B8';
  // Darker (k > 0) or lighter (k < 0) version of a colour.
  function shade(hex, k) {
    hex = col(hex);
    const n = parseInt(hex.slice(1), 16), to = k < 0 ? 255 : 0, f = Math.abs(k);
    const ch = v => Math.round(v + (to - v) * f);
    return '#' + ((1 << 24) + (ch(n >> 16) << 16) + (ch((n >> 8) & 255) << 8) + ch(n & 255)).toString(16).slice(1);
  }
  const INK = '#1F2937';
  const line = c => `stroke="${shade(c, 0.45)}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
  const eye = (x, y, r, look) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="2.2"/>
    <circle cx="${x + (look || 0.18) * r}" cy="${y + 0.12 * r}" r="${r * 0.55}" fill="${INK}"/><circle cx="${x + 0.32 * r}" cy="${y - 0.18 * r}" r="${r * 0.2}" fill="#fff"/>`;
  const smile = (x, y, w, d) => `<path d="M${x - w} ${y} Q${x} ${y + (d || w * 0.8)} ${x + w} ${y}" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
  const cheeks = (x1, x2, y) => `<ellipse cx="${x1}" cy="${y}" rx="4.5" ry="3" fill="#FF8FB1" opacity=".55"/><ellipse cx="${x2}" cy="${y}" rx="4.5" ry="3" fill="#FF8FB1" opacity=".55"/>`;
  const sparkle = (x, y, r, c) => `<path d="M${x} ${y - r} Q${x + r * 0.18} ${y - r * 0.18} ${x + r} ${y} Q${x + r * 0.18} ${y + r * 0.18} ${x} ${y + r} Q${x - r * 0.18} ${y + r * 0.18} ${x - r} ${y} Q${x - r * 0.18} ${y - r * 0.18} ${x} ${y - r} Z" fill="${c || '#fff'}"/>`;
  const star = (cx, cy, R, r, n, rot) => {
    let p = '';
    for (let i = 0; i < n * 2; i++) {
      const a = Math.PI / n * i - Math.PI / 2 + (rot || 0), rad = i % 2 ? r : R;
      p += (i ? 'L' : 'M') + (cx + Math.cos(a) * rad).toFixed(1) + ' ' + (cy + Math.sin(a) * rad).toFixed(1);
    }
    return p + 'Z';
  };
  const emo = (x, y, size, e) => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" dominant-baseline="central">${e}</text>`;

  const M = {};

  // ---- Shapes and colours (age 3): the same shapes as the games (Art.shape). p: shape, colour name
  M.shape = ([type, c]) => {
    const fill = (window.Art && Art.COLOURS[c]) || col(c);
    const svg = window.Art ? Art.shape(type, fill) : '';
    return svg.replace('<svg class="shape-svg"', '<svg x="14" y="14" width="72" height="72"');
  };

  // ---- Monster pals: body colour, eyes (1-3), top (horns/ant/ears/tuft/none), mouth, spots colour, body (round/tall/wide)
  M.mon = ([c, eyes, top, mouth, spots, body]) => {
    c = col(c); const o = shade(c, 0.45);
    const B = body === 'tall' ? { cx: 50, cy: 56, rx: 25, ry: 31 } : body === 'wide' ? { cx: 50, cy: 60, rx: 35, ry: 25 } : { cx: 50, cy: 57, rx: 30, ry: 29 };
    const top0 = B.cy - B.ry;
    let s = '';
    if (top === 'horns') s += `<path d="M${B.cx - 15} ${top0 + 8} Q${B.cx - 24} ${top0 - 4} ${B.cx - 20} ${top0 - 14} Q${B.cx - 12} ${top0 - 4} ${B.cx - 6} ${top0 + 3} Z" fill="#FFF3C4" ${line('#E9B65C')}/>
      <path d="M${B.cx + 15} ${top0 + 8} Q${B.cx + 24} ${top0 - 4} ${B.cx + 20} ${top0 - 14} Q${B.cx + 12} ${top0 - 4} ${B.cx + 6} ${top0 + 3} Z" fill="#FFF3C4" ${line('#E9B65C')}/>`;
    if (top === 'ant') s += `<path d="M${B.cx - 8} ${top0 + 4} Q${B.cx - 14} ${top0 - 8} ${B.cx - 18} ${top0 - 12}" fill="none" stroke="${o}" stroke-width="3"/><circle cx="${B.cx - 18}" cy="${top0 - 13}" r="5" fill="${shade(c, -0.4)}" stroke="${o}" stroke-width="2.5"/>
      <path d="M${B.cx + 8} ${top0 + 4} Q${B.cx + 14} ${top0 - 8} ${B.cx + 18} ${top0 - 12}" fill="none" stroke="${o}" stroke-width="3"/><circle cx="${B.cx + 18}" cy="${top0 - 13}" r="5" fill="${shade(c, -0.4)}" stroke="${o}" stroke-width="2.5"/>`;
    if (top === 'ears') s += `<circle cx="${B.cx - B.rx + 8}" cy="${top0 + 8}" r="9" fill="${c}" ${line(c)}/><circle cx="${B.cx + B.rx - 8}" cy="${top0 + 8}" r="9" fill="${c}" ${line(c)}/>
      <circle cx="${B.cx - B.rx + 8}" cy="${top0 + 8}" r="4.5" fill="#FF8FB1"/><circle cx="${B.cx + B.rx - 8}" cy="${top0 + 8}" r="4.5" fill="#FF8FB1"/>`;
    if (top === 'tuft') s += `<path d="M${B.cx - 8} ${top0 + 5} Q${B.cx - 12} ${top0 - 10} ${B.cx - 2} ${top0 - 8} Q${B.cx + 2} ${top0 - 16} ${B.cx + 8} ${top0 - 7} Q${B.cx + 16} ${top0 - 8} ${B.cx + 9} ${top0 + 5} Z" fill="${shade(c, 0.15)}" ${line(c)}/>`;
    // feet and arms
    s += `<ellipse cx="${B.cx - 12}" cy="${B.cy + B.ry - 1}" rx="9" ry="6" fill="${shade(c, 0.18)}" ${line(c)}/><ellipse cx="${B.cx + 12}" cy="${B.cy + B.ry - 1}" rx="9" ry="6" fill="${shade(c, 0.18)}" ${line(c)}/>
      <ellipse cx="${B.cx - B.rx + 1}" cy="${B.cy + 5}" rx="6" ry="9" transform="rotate(28 ${B.cx - B.rx + 1} ${B.cy + 5})" fill="${shade(c, 0.1)}" ${line(c)}/>
      <ellipse cx="${B.cx + B.rx - 1}" cy="${B.cy + 5}" rx="6" ry="9" transform="rotate(-28 ${B.cx + B.rx - 1} ${B.cy + 5})" fill="${shade(c, 0.1)}" ${line(c)}/>`;
    s += `<ellipse cx="${B.cx}" cy="${B.cy}" rx="${B.rx}" ry="${B.ry}" fill="${c}" ${line(c)}/>
      <ellipse cx="${B.cx}" cy="${B.cy + B.ry * 0.35}" rx="${B.rx * 0.62}" ry="${B.ry * 0.45}" fill="${shade(c, -0.35)}" opacity=".7"/>`;
    if (spots) { const sc = col(spots); s += `<circle cx="${B.cx - B.rx * 0.62}" cy="${B.cy - 2}" r="4" fill="${sc}"/><circle cx="${B.cx + B.rx * 0.6}" cy="${B.cy - 6}" r="5" fill="${sc}"/><circle cx="${B.cx + B.rx * 0.45}" cy="${B.cy + 10}" r="3" fill="${sc}"/><circle cx="${B.cx - B.rx * 0.45}" cy="${B.cy + 14}" r="3.5" fill="${sc}"/>`; }
    const ey = B.cy - B.ry * 0.3;
    if (eyes === '1') s += eye(B.cx, ey, 11);
    else if (eyes === '3') s += eye(B.cx - 13, ey + 3, 6.5) + eye(B.cx, ey - 4, 7) + eye(B.cx + 13, ey + 3, 6.5);
    else s += eye(B.cx - 10, ey, 8) + eye(B.cx + 10, ey, 8);
    const my = B.cy + B.ry * 0.25;
    if (mouth === 'open') s += `<path d="M${B.cx - 10} ${my} Q${B.cx} ${my + 16} ${B.cx + 10} ${my} Z" fill="#7F1D1D" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="${B.cx}" cy="${my + 8}" rx="5" ry="3" fill="#FF8FB1"/>`;
    else if (mouth === 'fang') s += smile(B.cx, my, 10) + `<path d="M${B.cx - 6} ${my + 3.4} L${B.cx - 3} ${my + 9} L${B.cx} ${my + 4.6} Z" fill="#fff" stroke="${INK}" stroke-width="1.5"/>`;
    else if (mouth === 'grin') s += `<path d="M${B.cx - 12} ${my - 1} Q${B.cx} ${my + 14} ${B.cx + 12} ${my - 1} Z" fill="#fff" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/><path d="M${B.cx - 11} ${my + 2} L${B.cx + 11} ${my + 2}" stroke="${INK}" stroke-width="1.5"/>`;
    else if (mouth === 'tongue') s += smile(B.cx, my, 9) + `<path d="M${B.cx - 2} ${my + 5} Q${B.cx + 3} ${my + 13} ${B.cx + 7} ${my + 4}" fill="#FF8FB1" stroke="${INK}" stroke-width="1.8"/>`;
    else s += smile(B.cx, my, 9);
    if (eyes !== '1') s += cheeks(B.cx - 19, B.cx + 19, my - 2);
    return s;
  };

  // ---- Robot friends: colour, head (box/round/tv), eyes (round/visor/one/hearts), top (ball/bolt/dish/none), mouth (grid/smile/dots)
  M.bot = ([c, head, eyes, top, mouth]) => {
    c = col(c); const o = shade(c, 0.45), lt = shade(c, -0.4);
    let s = '';
    if (top === 'ball') s += `<path d="M50 28 L50 12" stroke="${o}" stroke-width="3"/><circle cx="50" cy="10" r="5.5" fill="#FFD21F" stroke="${shade('#FFD21F', 0.45)}" stroke-width="2.5"/>`;
    if (top === 'bolt') s += `<path d="M48 26 L54 15 L49 15 L53 5 L44 18 L49 18 L46 26 Z" fill="#FFD21F" stroke="${shade('#FFD21F', 0.45)}" stroke-width="2" stroke-linejoin="round"/>`;
    if (top === 'dish') s += `<path d="M50 28 L50 18" stroke="${o}" stroke-width="3"/><path d="M38 10 Q50 26 62 10 Z" fill="${lt}" ${line(c)}/><circle cx="50" cy="12" r="2.5" fill="${o}"/>`;
    s += `<rect x="36" y="74" width="28" height="16" rx="6" fill="${shade(c, 0.12)}" ${line(c)}/><circle cx="44" cy="82" r="2.6" fill="#FFD21F"/><circle cx="50" cy="82" r="2.6" fill="#5CCB6F"/><circle cx="56" cy="82" r="2.6" fill="#EF4444"/>
      <rect x="44" y="68" width="12" height="8" fill="${shade(c, 0.25)}"/>
      <rect x="13" y="42" width="10" height="17" rx="3" fill="${shade(c, 0.2)}" ${line(c)}/><rect x="77" y="42" width="10" height="17" rx="3" fill="${shade(c, 0.2)}" ${line(c)}/>`;
    if (head === 'round') s += `<circle cx="50" cy="48" r="28" fill="${c}" ${line(c)}/>`;
    else if (head === 'tv') s += `<rect x="19" y="24" width="62" height="48" rx="9" fill="${c}" ${line(c)}/><rect x="27" y="31" width="46" height="34" rx="7" fill="#DFF7FA" stroke="${o}" stroke-width="2.5"/>`;
    else s += `<rect x="21" y="25" width="58" height="46" rx="11" fill="${c}" ${line(c)}/>`;
    s += `<path d="M27 32 Q30 28 36 28" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7" fill="none"/>`;
    if (eyes === 'visor') s += `<rect x="29" y="38" width="42" height="14" rx="7" fill="${INK}"/><ellipse cx="40" cy="45" rx="5" ry="3.6" fill="#3ED8E8"/><ellipse cx="60" cy="45" rx="5" ry="3.6" fill="#3ED8E8"/>`;
    else if (eyes === 'one') s += `<circle cx="50" cy="45" r="10.5" fill="#fff" stroke="${INK}" stroke-width="2.2"/><circle cx="51" cy="46" r="6" fill="#3ED8E8" stroke="${INK}" stroke-width="1.6"/><circle cx="51" cy="46" r="2.6" fill="${INK}"/><circle cx="54" cy="42.5" r="1.8" fill="#fff"/>`;
    else if (eyes === 'hearts') s += `<path d="M39 50 C31 44 33 37 39 40 C45 37 47 44 39 50 Z" fill="#F472B6" stroke="${INK}" stroke-width="1.8"/><path d="M61 50 C53 44 55 37 61 40 C67 37 69 44 61 50 Z" fill="#F472B6" stroke="${INK}" stroke-width="1.8"/>`;
    else s += eye(39, 44, 7) + eye(61, 44, 7);
    if (mouth === 'grid') s += `<rect x="38" y="56" width="24" height="9" rx="2.5" fill="${INK}"/><path d="M44 56 V65 M50 56 V65 M56 56 V65" stroke="#7DD3FC" stroke-width="1.6"/>`;
    else if (mouth === 'dots') s += [41, 47, 53, 59].map(x => `<circle cx="${x}" cy="60" r="2.2" fill="${INK}"/>`).join('');
    else s += smile(50, 57, 9, 7);
    return s;
  };

  // ---- Dinosaurs: species (rex/long/trike/stego/ptero/baby), colour, accent, pattern (spots/stripes/none)
  M.dino = ([sp, c, a, pat]) => {
    c = col(c); a = col(a || shade(c, -0.45)); const o = shade(c, 0.45), dk = shade(c, 0.18);
    const L = line(c);
    const spots = (pts) => pat === 'spots' ? pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${shade(c, 0.25)}"/>`).join('') : pat === 'stripes' ? pts.map(([x, y, r]) => `<path d="M${x - r} ${y - r * 1.4} Q${x} ${y} ${x - r * 0.4} ${y + r * 1.4}" stroke="${shade(c, 0.28)}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('') : '';
    const leg = (x, y, h, f) => `<rect x="${x}" y="${y}" width="10" height="${h}" rx="4" fill="${f || c}" ${L}/>`;
    if (sp === 'long') return `<path d="M24 62 Q8 70 5 56 Q15 63 26 56 Z" fill="${c}" ${L}/>${leg(28, 66, 20, dk)}${leg(52, 66, 20, dk)}
      <path d="M54 60 Q66 50 66 26 L78 24 Q80 54 64 70 Z" fill="${c}" ${L}/>
      <ellipse cx="44" cy="63" rx="25" ry="15" fill="${c}" ${L}/>${spots([[36, 56, 3], [46, 54, 3.5], [56, 58, 3]])}
      <ellipse cx="44" cy="69" rx="15" ry="6" fill="${a}" opacity=".85"/>${leg(34, 68, 18)}${leg(58, 66, 18)}
      <ellipse cx="76" cy="21" rx="12" ry="8.5" fill="${c}" ${L}/>${eye(78, 18, 3.6)}${smile(80, 24, 4, 3)}`;
    if (sp === 'trike') return `<path d="M22 62 Q8 66 6 55 Q14 60 24 55 Z" fill="${c}" ${L}/>${leg(26, 66, 20, dk)}${leg(48, 66, 20, dk)}
      <ellipse cx="42" cy="62" rx="24" ry="16" fill="${c}" ${L}/>${spots([[32, 54, 3], [42, 52, 3.5], [52, 56, 3]])}
      <ellipse cx="42" cy="68" rx="15" ry="6" fill="${a}" opacity=".85"/>${leg(32, 68, 18)}${leg(54, 66, 18)}
      <circle cx="64" cy="46" r="17" fill="${a}" ${line(a)}/><circle cx="64" cy="46" r="11" fill="${shade(a, -0.3)}"/>
      <path d="M68 41 L73 22 L77 41 Z" fill="#FFF3C4" ${line('#E9B65C')}/><path d="M79 45 L90 30 L86 47 Z" fill="#FFF3C4" ${line('#E9B65C')}/>
      <ellipse cx="74" cy="54" rx="15" ry="11" fill="${c}" ${L}/><path d="M86 52 L95 57 L86 61 Z" fill="${shade(c, 0.25)}" ${L}/>
      <path d="M84 49 L88 42 L89 50 Z" fill="#FFF3C4"/>${eye(76, 50, 3.8)}`;
    if (sp === 'stego') return `${[[24, 52], [34, 42], [46, 38], [58, 42], [68, 50]].map(([x, y], i) => `<path d="M${x - 7} ${y + 10} L${x} ${y - 6 - (i === 2 ? 4 : 0)} L${x + 7} ${y + 10} Z" fill="${a}" ${line(a)}/>`).join('')}
      <path d="M24 64 Q8 64 5 52" stroke="${o}" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M24 64 Q8 64 5 52" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M6 52 L0 46 M10 50 L8 42" stroke="#E9B65C" stroke-width="3.5" stroke-linecap="round"/>
      ${leg(28, 66, 20, dk)}${leg(54, 66, 20, dk)}<ellipse cx="46" cy="62" rx="26" ry="16" fill="${c}" ${L}/>${spots([[38, 56, 3], [50, 54, 3.5], [60, 60, 3]])}
      <ellipse cx="46" cy="69" rx="16" ry="6" fill="${shade(c, -0.4)}" opacity=".8"/>${leg(34, 68, 18)}${leg(60, 66, 18)}
      <ellipse cx="78" cy="64" rx="12" ry="8.5" fill="${c}" ${L}/>${eye(80, 61, 3.6)}${smile(83, 67, 3.5, 2.5)}`;
    if (sp === 'ptero') return `<path d="M44 52 L6 40 Q14 54 8 64 Q24 58 44 64 Z" fill="${a}" ${line(a)}/><path d="M56 52 L94 40 Q86 54 92 64 Q76 58 56 64 Z" fill="${a}" ${line(a)}/>
      <path d="M44 52 L18 46 M44 58 L16 58 M56 52 L82 46 M56 58 L84 58" stroke="${shade(a, 0.3)}" stroke-width="1.8"/>
      <ellipse cx="50" cy="62" rx="10" ry="17" fill="${c}" ${L}/><ellipse cx="50" cy="66" rx="5.5" ry="10" fill="${shade(c, -0.4)}"/>
      <path d="M44 30 L30 18 L46 26 Z" fill="${shade(c, 0.2)}" ${L}/><ellipse cx="50" cy="34" rx="11" ry="10" fill="${c}" ${L}/>
      <path d="M58 32 L80 38 L58 40 Z" fill="#FFD9A8" ${line('#E9B65C')}/>${eye(51, 31, 4)}`;
    if (sp === 'baby') return `<circle cx="50" cy="42" r="19" fill="${c}" ${L}/>${spots([[38, 34, 2.6], [62, 36, 2.6]])}
      <path d="M42 24 L46 14 L50 22 L54 14 L58 24 Z" fill="${a}" ${line(a)}/>${eye(43, 42, 5.5)}${eye(57, 42, 5.5)}${smile(50, 51, 5, 4)}${cheeks(37, 63, 50)}
      <path d="M22 58 L30 52 L37 60 L45 52 L52 60 L60 52 L67 60 L74 52 L79 58 Q82 86 50 88 Q18 86 22 58 Z" fill="#FFF8E7" stroke="#D9C9A6" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="36" cy="72" r="4" fill="${a}" opacity=".7"/><circle cx="58" cy="76" r="5" fill="${a}" opacity=".7"/><circle cx="66" cy="66" r="3" fill="${a}" opacity=".7"/>`;
    // rex
    return `<path d="M32 64 Q10 68 4 52 Q18 60 34 56 Z" fill="${c}" ${L}/>${leg(30, 70, 16, dk)}
      <ellipse cx="42" cy="60" rx="19" ry="17" fill="${c}" ${L}/>${spots([[34, 54, 3], [44, 50, 3], [36, 64, 2.6]])}
      <ellipse cx="46" cy="65" rx="10" ry="10" fill="${a}" opacity=".85"/>${leg(44, 70, 16)}
      <ellipse cx="55" cy="47" rx="11" ry="11" fill="${c}"/>
      <path d="M44 34 Q46 20 64 20 Q84 20 86 36 Q86 50 70 50 Q52 52 46 44 Z" fill="${c}" ${L}/>
      <path d="M60 46 Q72 52 84 42" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/><path d="M66 48 L67 52 L69 48.6 Z M74 47.6 L75 51 L77 47 Z" fill="#fff"/>
      <circle cx="80" cy="30" r="1.8" fill="${INK}"/>${eye(64, 31, 5.5)}
      <path d="M58 60 Q66 60 66 66" stroke="${o}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M58 60 Q66 60 66 66" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  };

  // ---- Bugs: kind (lady/beetle/butterfly/bee/dragonfly/caterpillar/snail), colour 1, colour 2
  M.bug = ([k, c1, c2]) => {
    c1 = col(c1); c2 = col(c2 || INK);
    const ant = (x, y) => `<path d="M${x - 4} ${y} Q${x - 8} ${y - 10} ${x - 14} ${y - 12}" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/><circle cx="${x - 14}" cy="${y - 12}" r="2.6" fill="${INK}"/>
      <path d="M${x + 4} ${y} Q${x + 8} ${y - 10} ${x + 14} ${y - 12}" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/><circle cx="${x + 14}" cy="${y - 12}" r="2.6" fill="${INK}"/>`;
    if (k === 'butterfly') return `<ellipse cx="32" cy="38" rx="20" ry="16" transform="rotate(-25 32 38)" fill="${c1}" ${line(c1)}/><ellipse cx="68" cy="38" rx="20" ry="16" transform="rotate(25 68 38)" fill="${c1}" ${line(c1)}/>
      <ellipse cx="35" cy="66" rx="14" ry="12" transform="rotate(20 35 66)" fill="${c2}" ${line(c2)}/><ellipse cx="65" cy="66" rx="14" ry="12" transform="rotate(-20 65 66)" fill="${c2}" ${line(c2)}/>
      <circle cx="30" cy="36" r="6" fill="#fff" opacity=".85"/><circle cx="70" cy="36" r="6" fill="#fff" opacity=".85"/><circle cx="35" cy="66" r="4" fill="#fff" opacity=".7"/><circle cx="65" cy="66" r="4" fill="#fff" opacity=".7"/>
      <rect x="45" y="30" width="10" height="44" rx="5" fill="${INK}"/>${ant(50, 30)}<circle cx="47.5" cy="35" r="1.6" fill="#fff"/><circle cx="52.5" cy="35" r="1.6" fill="#fff"/>`;
    if (k === 'bee') return `<ellipse cx="38" cy="34" rx="12" ry="16" transform="rotate(-30 38 34)" fill="#E0F7FF" stroke="#9CC9D4" stroke-width="2.5" opacity=".95"/><ellipse cx="60" cy="32" rx="12" ry="16" transform="rotate(25 60 32)" fill="#E0F7FF" stroke="#9CC9D4" stroke-width="2.5" opacity=".95"/>
      <path d="M20 58 L12 58" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="48" cy="58" rx="28" ry="20" fill="${c1}" ${line(c1)}/>
      <path d="M38 40 Q34 58 38 76 M50 38 Q46 58 50 78" stroke="${c2}" stroke-width="7" fill="none"/>
      <circle cx="72" cy="54" r="13" fill="${c1}" ${line(c1)}/>${eye(75, 51, 4)}${smile(73, 59, 4, 3)}<ellipse cx="66" cy="58" rx="3" ry="2" fill="#FF8FB1" opacity=".6"/>`;
    if (k === 'dragonfly') return `<ellipse cx="30" cy="36" rx="22" ry="8" transform="rotate(-15 30 36)" fill="${c2}" opacity=".55" stroke="${shade(c2, 0.3)}" stroke-width="2"/><ellipse cx="70" cy="36" rx="22" ry="8" transform="rotate(15 70 36)" fill="${c2}" opacity=".55" stroke="${shade(c2, 0.3)}" stroke-width="2"/>
      <ellipse cx="32" cy="50" rx="19" ry="7" transform="rotate(12 32 50)" fill="${c2}" opacity=".55" stroke="${shade(c2, 0.3)}" stroke-width="2"/><ellipse cx="68" cy="50" rx="19" ry="7" transform="rotate(-12 68 50)" fill="${c2}" opacity=".55" stroke="${shade(c2, 0.3)}" stroke-width="2"/>
      ${[48, 56, 64, 72, 80].map(y => `<ellipse cx="50" cy="${y}" rx="${5 - (y - 48) / 16}" ry="5" fill="${c1}" ${line(c1)}/>`).join('')}
      <ellipse cx="50" cy="40" rx="8" ry="9" fill="${c1}" ${line(c1)}/><circle cx="42" cy="28" r="8" fill="${c1}" ${line(c1)}/><circle cx="58" cy="28" r="8" fill="${c1}" ${line(c1)}/>
      <circle cx="44" cy="27" r="3.5" fill="${INK}"/><circle cx="56" cy="27" r="3.5" fill="${INK}"/><circle cx="45" cy="25.6" r="1.3" fill="#fff"/><circle cx="57" cy="25.6" r="1.3" fill="#fff"/>`;
    if (k === 'caterpillar') return [[22, 70], [34, 64], [46, 62], [58, 64]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="11" fill="${i % 2 ? c2 : c1}" ${line(i % 2 ? c2 : c1)}/><path d="M${x - 3} ${y + 10} L${x - 4} ${y + 15} M${x + 3} ${y + 10} L${x + 4} ${y + 15}" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`).join('')
      + `<circle cx="72" cy="52" r="14" fill="${c1}" ${line(c1)}/>${ant(72, 40)}${eye(67, 50, 4)}${eye(78, 50, 4)}${smile(72, 58, 5, 4)}`;
    if (k === 'snail') return `<path d="M14 80 Q12 70 24 68 L70 68 Q84 66 86 54 Q90 46 84 42" fill="none" stroke="#E9C46A" stroke-width="0"/>
      <path d="M12 82 Q14 70 28 70 L66 70 Q78 68 80 56 L80 46 Q86 44 88 52 Q90 76 70 82 Z" fill="#FFE2B3" ${line('#E9B65C')}/>
      <path d="M78 46 L74 32 M84 46 L88 32" stroke="#E9B65C" stroke-width="3" stroke-linecap="round"/><circle cx="74" cy="31" r="3.4" fill="${INK}"/><circle cx="88" cy="31" r="3.4" fill="${INK}"/>
      <circle cx="44" cy="50" r="24" fill="${c1}" ${line(c1)}/><path d="M44 50 m0 -4 a4 4 0 1 1 -4 4 a8 8 0 1 1 8 8 a12 12 0 1 1 -12 -12 a16 16 0 1 1 16 16" fill="none" stroke="${c2}" stroke-width="3.5" stroke-linecap="round"/>${smile(84, 58, 3, 2.5)}`;
    if (k === 'beetle') return `<path d="M30 40 L18 32 M30 54 L16 56 M32 68 L20 78 M70 40 L82 32 M70 54 L84 56 M68 68 L80 78" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="50" cy="26" r="11" fill="${INK}"/>${ant(50, 18)}
      <ellipse cx="50" cy="56" rx="24" ry="29" fill="${c1}" stroke="${shade(c1, 0.5)}" stroke-width="3"/><path d="M50 30 V85" stroke="${shade(c1, 0.5)}" stroke-width="2.5"/>
      <ellipse cx="40" cy="44" rx="6" ry="11" fill="#fff" opacity=".45" transform="rotate(-15 40 44)"/><circle cx="62" cy="64" r="4" fill="${c2}" opacity=".9"/><circle cx="38" cy="68" r="4" fill="${c2}" opacity=".9"/>
      <circle cx="45" cy="25" r="2.4" fill="#fff"/><circle cx="55" cy="25" r="2.4" fill="#fff"/>`;
    // ladybird
    return `<path d="M28 46 L16 40 M27 60 L14 62 M30 72 L20 80 M72 46 L84 40 M73 60 L86 62 M70 72 L80 80" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="50" cy="30" r="13" fill="${INK}"/>${ant(50, 20)}<circle cx="45" cy="29" r="3" fill="#fff"/><circle cx="55" cy="29" r="3" fill="#fff"/><circle cx="45.6" cy="29.4" r="1.5" fill="${INK}"/><circle cx="55.6" cy="29.4" r="1.5" fill="${INK}"/>
      <circle cx="50" cy="58" r="27" fill="${c1}" stroke="${shade(c1, 0.5)}" stroke-width="3"/><path d="M50 32 V85" stroke="${INK}" stroke-width="3"/>
      ${[[38, 46, 5], [62, 46, 5], [34, 62, 4.5], [66, 62, 4.5], [42, 74, 4], [58, 74, 4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c2}"/>`).join('')}
      <ellipse cx="38" cy="40" rx="6" ry="3.5" fill="#fff" opacity=".5" transform="rotate(-30 38 40)"/>`;
  };

  // ---- Fish: body (round/long/tall), colour 1, colour 2, pattern (stripes/spots/plain/zigzag)
  M.fish = ([b, c1, c2, pat], uid) => {
    c1 = col(c1); c2 = col(c2);
    const B = b === 'long' ? { rx: 33, ry: 16 } : b === 'tall' ? { rx: 22, ry: 27 } : { rx: 28, ry: 22 };
    const cx = 54, cy = 52, id = 'fc' + uid;
    let pattern = '';
    if (pat === 'stripes') pattern = [-14, 0, 14].map(dx => `<rect x="${cx + dx - 3.5}" y="${cy - 40}" width="7" height="80" fill="${c2}"/>`).join('');
    if (pat === 'spots') pattern = [[-12, -6, 4], [2, -10, 3.4], [12, 2, 4.2], [-4, 8, 3.6], [-16, 8, 2.6]].map(([x, y, r]) => `<circle cx="${cx + x}" cy="${cy + y}" r="${r}" fill="${c2}"/>`).join('');
    if (pat === 'zigzag') pattern = `<path d="M${cx - 30} ${cy} L${cx - 20} ${cy - 8} L${cx - 10} ${cy + 4} L${cx} ${cy - 8} L${cx + 10} ${cy + 4} L${cx + 20} ${cy - 8} L${cx + 30} ${cy}" stroke="${c2}" stroke-width="6" fill="none" stroke-linejoin="round"/>`;
    const finTop = b === 'tall' ? `M${cx - 14} ${cy - 20} Q${cx - 6} ${cy - 46} ${cx + 10} ${cy - 24} Z` : `M${cx - 12} ${cy - B.ry + 4} Q${cx} ${cy - B.ry - 16} ${cx + 12} ${cy - B.ry + 2} Z`;
    const finBot = b === 'tall' ? `M${cx - 12} ${cy + 20} Q${cx - 4} ${cy + 44} ${cx + 8} ${cy + 22} Z` : `M${cx - 6} ${cy + B.ry - 3} Q${cx} ${cy + B.ry + 10} ${cx + 8} ${cy + B.ry - 4} Z`;
    return `<defs><clipPath id="${id}"><ellipse cx="${cx}" cy="${cy}" rx="${B.rx}" ry="${B.ry}"/></clipPath></defs>
      <path d="M${cx - B.rx + 4} ${cy} L${cx - B.rx - 18} ${cy - 16} Q${cx - B.rx - 10} ${cy} ${cx - B.rx - 18} ${cy + 16} Z" fill="${c2}" ${line(c2)}/>
      <path d="${finTop}" fill="${c2}" ${line(c2)}/><path d="${finBot}" fill="${c2}" ${line(c2)}/>
      <ellipse cx="${cx}" cy="${cy}" rx="${B.rx}" ry="${B.ry}" fill="${c1}"/><g clip-path="url(#${id})">${pattern}<ellipse cx="${cx + 4}" cy="${cy + B.ry * 0.55}" rx="${B.rx * 0.8}" ry="${B.ry * 0.35}" fill="#fff" opacity=".25"/></g>
      <ellipse cx="${cx}" cy="${cy}" rx="${B.rx}" ry="${B.ry}" fill="none" ${line(c1)}/>
      <path d="M${cx + B.rx * 0.35} ${cy - B.ry * 0.5} Q${cx + B.rx * 0.2} ${cy} ${cx + B.rx * 0.35} ${cy + B.ry * 0.5}" stroke="${shade(c1, 0.35)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      ${eye(cx + B.rx * 0.6, cy - B.ry * 0.25, 5.5)}<path d="M${cx + B.rx - 5} ${cy + 6} q4 3 6 -1" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <circle cx="${cx + B.rx + 8}" cy="${cy - 16}" r="3" fill="#fff" stroke="#9CC9D4" stroke-width="1.5"/><circle cx="${cx + B.rx + 12}" cy="${cy - 26}" r="2" fill="#fff" stroke="#9CC9D4" stroke-width="1.5"/>`;
  };

  // ---- Sweets: kind (cupcake/donut/cone/pop/cake/macaron/shake), colour 1, colour 2, topper (cherry/star/heart/none)
  M.sweet = ([k, c1, c2, top]) => {
    c1 = col(c1); c2 = col(c2);
    const sprinkles = (pts) => pts.map(([x, y, r], i) => `<rect x="${x}" y="${y}" width="6" height="2.6" rx="1.3" transform="rotate(${r} ${x + 3} ${y + 1.3})" fill="${['#EF4444', '#3B82F6', '#FFD21F', '#5CCB6F', '#A855F7', '#fff'][i % 6]}"/>`).join('');
    const topper = (x, y) => top === 'cherry' ? `<path d="M${x} ${y - 4} Q${x + 2} ${y - 14} ${x + 8} ${y - 16}" stroke="#5B8C2A" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="6" fill="#E11D48" ${line('#E11D48')}/><circle cx="${x - 2}" cy="${y - 2}" r="1.6" fill="#fff"/>`
      : top === 'star' ? `<path d="${star(x, y - 2, 9, 4, 5)}" fill="#FFD21F" ${line('#FFD21F')}/>`
      : top === 'heart' ? `<path d="M${x} ${y + 5} C${x - 10} ${y - 2} ${x - 7} ${y - 11} ${x} ${y - 6} C${x + 7} ${y - 11} ${x + 10} ${y - 2} ${x} ${y + 5} Z" fill="#F472B6" ${line('#F472B6')}/>` : '';
    if (k === 'donut') return `<path fill-rule="evenodd" d="M50 20 a32 30 0 1 0 0.1 0 Z M50 41 a10 9 0 1 1 -0.1 0 Z" fill="#E9B872" ${line('#E9B872')}/>
      <path fill-rule="evenodd" d="M24 46 Q22 26 50 23 Q78 26 76 46 Q80 54 72 58 Q68 66 60 62 Q52 70 44 63 Q34 68 30 60 Q20 58 24 46 Z M50 41 a10 9 0 1 1 -0.1 0 Z" fill="${c1}" ${line(c1)}/>
      ${sprinkles([[32, 34, 20], [44, 28, -30], [60, 30, 40], [68, 42, -10], [30, 50, 60], [62, 54, 15], [42, 56, -40], [54, 34, 70]])}<ellipse cx="38" cy="32" rx="7" ry="3.5" fill="#fff" opacity=".45" transform="rotate(-25 38 32)"/>${topper(50, 22)}`;
    if (k === 'cone') return `<path d="M34 50 L50 92 L66 50 Z" fill="#E9B872" ${line('#E9B872')}/><path d="M38 58 L60 52 M40 66 L63 58 M43 74 L58 68 M62 58 L42 52 M60 66 L38 60" stroke="#C9893F" stroke-width="2"/>
      <circle cx="50" cy="44" r="17" fill="${c2}" ${line(c2)}/><circle cx="50" cy="28" r="14" fill="${c1}" ${line(c1)}/>
      <path d="M34 48 Q38 56 42 50 Q46 58 50 51 Q54 58 58 50 Q62 56 66 48" fill="${c2}" stroke="none"/>${topper(52, 15)}<ellipse cx="44" cy="24" rx="4" ry="2.4" fill="#fff" opacity=".5"/>`;
    if (k === 'pop') return `<rect x="47" y="56" width="6" height="36" rx="3" fill="#fff" stroke="#C9D6D9" stroke-width="2"/>
      <circle cx="50" cy="40" r="26" fill="${c1}" ${line(c1)}/><path d="M50 40 m0 -4 a4 4 0 1 1 -4 4 a8 8 0 1 1 8 8 a12 12 0 1 1 -12 -12 a16 16 0 1 1 16 16 a20 20 0 1 1 -20 -20" fill="none" stroke="${c2}" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="38" cy="26" rx="7" ry="3.5" fill="#fff" opacity=".5" transform="rotate(-30 38 26)"/><path d="M42 58 Q50 64 58 58" stroke="#F472B6" stroke-width="4" fill="none"/>`;
    if (k === 'cake') return `<rect x="20" y="58" width="60" height="26" rx="5" fill="${c2}" ${line(c2)}/><rect x="26" y="38" width="48" height="22" rx="5" fill="${c2}" ${line(c2)}/>
      <path d="M26 44 Q26 36 34 36 L66 36 Q74 36 74 44 Q70 52 66 46 Q62 54 58 46 Q54 52 50 46 Q46 54 42 46 Q38 52 34 46 Q30 52 26 44 Z" fill="${c1}" ${line(c1)}/>
      <path d="M20 64 Q20 56 28 56 L72 56 Q80 56 80 64 Q76 72 72 64 Q68 72 62 64 Q58 72 52 64 Q48 72 42 64 Q38 72 32 64 Q28 72 24 64 Z" fill="${c1}" ${line(c1)}/>
      ${top === 'none' ? '' : `<rect x="47" y="20" width="6" height="16" rx="2" fill="#93C5FD" stroke="#3B82F6" stroke-width="2"/><path d="M50 8 Q55 14 50 19 Q45 14 50 8 Z" fill="#FFB703"/>`}${sprinkles([[30, 72, 20], [46, 76, -30], [62, 72, 40]])}`;
    if (k === 'macaron') return `<ellipse cx="50" cy="62" rx="30" ry="14" fill="${c1}" ${line(c1)}/><rect x="22" y="44" width="56" height="14" rx="7" fill="${c2}" stroke="${shade(c2, 0.3)}" stroke-width="2.5"/>
      <ellipse cx="50" cy="40" rx="30" ry="15" fill="${c1}" ${line(c1)}/><ellipse cx="40" cy="35" rx="9" ry="3.5" fill="#fff" opacity=".45"/>
      <path d="M22 56 Q26 60 30 56 Q34 60 38 56 Q42 60 46 56 Q50 60 54 56 Q58 60 62 56 Q66 60 70 56 Q74 60 78 56" stroke="${shade(c1, 0.2)}" stroke-width="2.5" fill="none"/>${topper(50, 24)}`;
    if (k === 'shake') return `<path d="M30 34 L36 88 L64 88 L70 34 Z" fill="#E0F7FF" stroke="#9CC9D4" stroke-width="3" stroke-linejoin="round"/><path d="M32 46 L37 86 L63 86 L68 46 Z" fill="${c2}"/>
      <path d="M26 36 Q30 18 50 22 Q70 18 74 36 Z" fill="#fff" stroke="#D5DFE2" stroke-width="3"/><rect x="56" y="4" width="5" height="34" rx="2.5" transform="rotate(18 58 21)" fill="${c1}"/>${sprinkles([[36, 26, 20], [48, 22, -30], [62, 28, 40]])}${topper(44, 18)}`;
    // cupcake
    return `<path d="M26 58 L32 88 L68 88 L74 58 Z" fill="${c2}" ${line(c2)}/><path d="M36 60 L38 86 M46 60 L46 86 M54 60 L54 86 M64 60 L62 86" stroke="${shade(c2, 0.25)}" stroke-width="2.5"/>
      <path d="M22 60 Q16 48 28 46 Q26 34 40 34 Q42 22 56 24 Q68 24 66 36 Q80 36 76 48 Q86 52 76 60 Z" fill="${c1}" ${line(c1)}/>
      <ellipse cx="38" cy="40" rx="7" ry="3.5" fill="#fff" opacity=".45" transform="rotate(-20 38 40)"/>${sprinkles([[32, 50, 20], [44, 44, -30], [58, 48, 40], [66, 52, -10], [50, 54, 60]])}${topper(52, 22)}`;
  };

  // ---- Planets: a name (mercury … sun) or custom: colour 1, colour 2 (bands), ring colour, moons, face (1), style (bands/spots/swirl)
  const PLANETS = {
    mercury: ['#B8B2A7', '#8F887C', '', 0, 0, 'craters'], venus: ['#F5C77E', '#E8A94F', '', 0, 0, 'swirl'], earth: ['#3B82F6', '#5CCB6F', '', 1, 0, 'earth'],
    mars: ['#E4572E', '#B23A1B', '', 2, 0, 'spots'], jupiter: ['#E8C39E', '#C47F4F', '', 0, 0, 'jupiter'], saturn: ['#F2D49B', '#D9A85B', '#E9D3A3', 0, 0, 'bands'],
    uranus: ['#7DD3FC', '#5BBDE4', '#BAE6FD', 0, 0, 'plain'], neptune: ['#2563EB', '#1E40AF', '', 1, 0, 'spots'], pluto: ['#D6C2A8', '#F5EBDD', '', 0, 0, 'heart'],
    moon: ['#E5E7EB', '#B8BEC6', '', 0, 1, 'craters'], sun: ['#FDB813', '#FB923C', '', 0, 1, 'sun']
  };
  M.planet = (p, uid) => {
    const [c1r, c2r, ring, moons, face, style] = PLANETS[p[0]] || p;
    const c1 = col(c1r), c2 = col(c2r), id = 'pc' + uid, R = ring ? 24 : 29, cx = 50, cy = 50;
    let s = '', body = '';
    if (style === 'sun') s += Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<path d="M${cx + Math.cos(a) * 30} ${cy + Math.sin(a) * 30} L${cx + Math.cos(a + 0.12) * 42} ${cy + Math.sin(a + 0.12) * 42} L${cx + Math.cos(a - 0.12) * 42} ${cy + Math.sin(a - 0.12) * 42} Z" fill="${c2}"/>`; }).join('');
    if (ring) s += `<ellipse cx="${cx}" cy="${cy}" rx="44" ry="11" transform="rotate(-16 ${cx} ${cy})" fill="none" stroke="${col(ring)}" stroke-width="5" opacity=".9"/>`;
    if (style === 'bands' || style === 'jupiter') body = [-16, -6, 6, 15].map((dy, i) => `<rect x="0" y="${cy + dy - 3}" width="100" height="${i % 2 ? 4 : 6}" fill="${c2}" opacity=".85"/>`).join('') + (style === 'jupiter' ? `<ellipse cx="${cx + 8}" cy="${cy + 9}" rx="7" ry="4" fill="#C2410C"/>` : '');
    if (style === 'spots') body = `<circle cx="${cx - 10}" cy="${cy - 8}" r="7" fill="${c2}" opacity=".8"/><circle cx="${cx + 12}" cy="${cy + 8}" r="5" fill="${c2}" opacity=".8"/><circle cx="${cx - 2}" cy="${cy + 16}" r="3.5" fill="${c2}" opacity=".8"/>`;
    if (style === 'craters') body = [[-10, -8, 6], [10, 6, 5], [-4, 14, 3.5], [14, -12, 3]].map(([x, y, r]) => `<circle cx="${cx + x}" cy="${cy + y}" r="${r}" fill="${c2}" opacity=".7"/>`).join('');
    if (style === 'swirl') body = `<path d="M${cx - 28} ${cy - 6} Q${cx - 6} ${cy - 18} ${cx + 10} ${cy - 6} T${cx + 30} ${cy}" stroke="${c2}" stroke-width="5" fill="none"/><path d="M${cx - 26} ${cy + 10} Q${cx} ${cy} ${cx + 28} ${cy + 12}" stroke="${c2}" stroke-width="4" fill="none"/>`;
    if (style === 'earth') body = `<path d="M${cx - 18} ${cy - 18} Q${cx - 4} ${cy - 24} ${cx - 2} ${cy - 10} Q${cx + 4} ${cy} ${cx - 8} ${cy + 4} Q${cx - 20} ${cy + 4} ${cx - 18} ${cy - 18} Z" fill="${c2}"/><path d="M${cx + 8} ${cy + 4} Q${cx + 22} ${cy - 2} ${cx + 24} ${cy + 12} Q${cx + 16} ${cy + 24} ${cx + 6} ${cy + 18} Z" fill="${c2}"/><path d="M${cx - 24} ${cy + 14} Q${cx - 10} ${cy + 10} ${cx} ${cy + 18}" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".85"/>`;
    if (style === 'heart') body = `<path d="M${cx + 4} ${cy + 18} C${cx - 14} ${cy + 6} ${cx - 10} ${cy - 8} ${cx + 2} ${cy - 2} C${cx + 12} ${cy - 10} ${cx + 22} ${cy + 4} ${cx + 4} ${cy + 18} Z" fill="${c2}"/>`;
    s += `<defs><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath></defs><circle cx="${cx}" cy="${cy}" r="${R}" fill="${c1}"/>
      <g clip-path="url(#${id})">${body}<circle cx="${cx + R * 0.5}" cy="${cy + R * 0.5}" r="${R}" fill="#000" opacity=".12"/></g>
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" ${line(c1)}/><ellipse cx="${cx - R * 0.42}" cy="${cy - R * 0.5}" rx="${R * 0.3}" ry="${R * 0.16}" fill="#fff" opacity=".45" transform="rotate(-30 ${cx - R * 0.42} ${cy - R * 0.5})"/>`;
    if (ring) s += `<path d="M${cx - 44} ${cy} A44 11 0 0 0 ${cx + 44} ${cy}" transform="rotate(-16 ${cx} ${cy})" fill="none" stroke="${col(ring)}" stroke-width="5"/>`;
    if (+face) s += eye(cx - 9, cy - 3, 4.5) + eye(cx + 9, cy - 3, 4.5) + smile(cx, cy + 7, 6, 5) + cheeks(cx - 16, cx + 16, cy + 5);
    for (let i = 0; i < (+moons || 0); i++) s += `<circle cx="${[84, 16][i]}" cy="${[20, 82][i]}" r="${[5, 4][i]}" fill="#E5E7EB" stroke="#9CA3AF" stroke-width="2"/>`;
    return s;
  };

  // ---- Dragons: body, belly, wing, horn colours; style (legend = shiny scales and sparkles)
  M.dragon = ([b, be, w, h, style]) => {
    b = col(b); be = col(be); w = col(w || shade(b, 0.2)); h = col(h || '#FFF3C4');
    const o = shade(b, 0.5), L = `stroke="${o}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
    let s = `<path d="M38 78 Q14 86 10 70 Q7 60 17 55" fill="none" stroke="${o}" stroke-width="13" stroke-linecap="round"/><path d="M38 78 Q14 86 10 70 Q7 60 17 55" fill="none" stroke="${b}" stroke-width="7.5" stroke-linecap="round"/>
      <path d="M19 57 L8 49 Q14 40 24 47 Z" fill="${h}" ${L}/>
      <path d="M42 46 L16 22 Q22 36 13 40 Q24 44 19 52 Q31 52 38 60 Z" fill="${w}" ${L}/><path d="M38 48 L22 34 M36 54 L20 46" stroke="${shade(w, 0.35)}" stroke-width="2" stroke-linecap="round"/>
      ${[[40, 44], [34, 54], [31, 64]].map(([x, y]) => `<path d="M${x} ${y} L${x - 8} ${y - 3} L${x - 1} ${y - 8} Z" fill="${h}" ${L}/>`).join('')}
      <ellipse cx="40" cy="84" rx="9" ry="5" fill="${shade(b, 0.15)}" ${L}/><ellipse cx="60" cy="84" rx="9" ry="5" fill="${shade(b, 0.15)}" ${L}/>
      <path d="M30 84 Q24 60 40 48 Q54 40 62 52 Q70 66 66 84 Z" fill="${b}" ${L}/>
      <path d="M38 82 C36 66 41 57 48 57 C56 57 60 66 58 82 Z" fill="${be}" stroke="${shade(be, 0.35)}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M41 66 Q48 63 56 66 M40 73 Q48 70 57 73" stroke="${shade(be, 0.35)}" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M60 60 Q68 60 68 68" fill="none" stroke="${o}" stroke-width="7" stroke-linecap="round"/><path d="M60 60 Q68 60 68 68" fill="none" stroke="${b}" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M50 18 Q44 4 37 8 Q45 12 46 22 Z" fill="${h}" ${L}/><path d="M61 16 Q61 2 53 3 Q59 9 56 19 Z" fill="${h}" ${L}/>
      <path d="M41 28 L33 25 L40 36 Z" fill="${w}" ${L}/>
      <ellipse cx="58" cy="31" rx="19" ry="16" fill="${b}" ${L}/><ellipse cx="74" cy="38" rx="12" ry="9.5" fill="${b}" ${L}/>
      <ellipse cx="58" cy="31" rx="17" ry="14" fill="${b}"/><ellipse cx="75" cy="40" rx="8" ry="5" fill="${shade(be, -0.1)}" opacity=".8"/>
      <circle cx="78" cy="35" r="1.7" fill="${o}"/><circle cx="83" cy="36" r="1.7" fill="${o}"/>
      <path d="M68 45 Q75 48 83 43" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
      ${eye(62, 28, 6.5)}<ellipse cx="50" cy="38" rx="4.5" ry="3" fill="#FF8FB1" opacity=".5"/>`;
    if (style === 'legend') s += `<path d="M46 58 L49 55 L52 58 L49 61 Z M52 68 L55 65 L58 68 L55 71 Z" fill="#fff" opacity=".35"/>${sparkle(86, 16, 6, '#FFE66D')}${sparkle(20, 86, 4.5, '#FFE66D')}${sparkle(88, 70, 4, '#fff')}`;
    return s;
  };

  // ---- Knight shields: colour 1, colour 2, division (plain/pale/fess/quarter/chevron/bend/cross/border), emblem emoji
  M.shield = ([c1, c2, div, em], uid) => {
    c1 = col(c1); c2 = col(c2); const id = 'sh' + uid;
    const P = 'M50 10 L84 19 Q84 62 50 90 Q16 62 16 19 Z';
    const parts = { pale: `<rect x="50" y="0" width="50" height="100" fill="${c2}"/>`, fess: `<rect x="0" y="50" width="100" height="50" fill="${c2}"/>`,
      quarter: `<rect x="50" y="0" width="50" height="50" fill="${c2}"/><rect x="0" y="50" width="50" height="50" fill="${c2}"/>`,
      chevron: `<path d="M0 78 L50 40 L100 78 L100 94 L50 56 L0 94 Z" fill="${c2}"/>`, bend: `<path d="M0 6 L18 0 L100 82 L100 100 Z" fill="${c2}"/>`,
      cross: `<rect x="43" y="0" width="14" height="100" fill="${c2}"/><rect x="0" y="40" width="100" height="14" fill="${c2}"/>`,
      border: `<path d="${P}" transform="translate(50 50) scale(.78) translate(-50 -50)" fill="none" stroke="${c2}" stroke-width="9"/>` };
    return `<defs><clipPath id="${id}"><path d="${P}"/></clipPath></defs><path d="${P}" fill="${c1}"/><g clip-path="url(#${id})">${parts[div] || ''}<path d="M50 0 L100 0 L100 100 L50 100 Z" fill="#000" opacity=".08"/></g>
      <path d="${P}" fill="none" stroke="#F5B800" stroke-width="5" stroke-linejoin="round"/><path d="${P}" fill="none" stroke="${shade('#F5B800', 0.4)}" stroke-width="1.5" stroke-linejoin="round"/>
      <circle cx="50" cy="47" r="15" fill="#fff" stroke="#F5B800" stroke-width="3"/>${emo(50, 48, 19, em || '⭐')}<path d="M24 22 L48 15" stroke="#fff" stroke-width="3" opacity=".5" stroke-linecap="round"/>`;
  };

  // ---- Ninjas: suit colour, band (and belt) colour, eyes (happy/brave/wink)
  M.ninja = ([su, ba, ey]) => {
    su = col(su); ba = col(ba); const L = line(su);
    const eyes = ey === 'brave' ? `<path d="M36 41 L45 43 M64 41 L55 43" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/><circle cx="41" cy="46.5" r="3" fill="${INK}"/><circle cx="59" cy="46.5" r="3" fill="${INK}"/>`
      : ey === 'wink' ? `<circle cx="41" cy="46" r="3.2" fill="${INK}"/><circle cx="42" cy="45" r="1" fill="#fff"/><path d="M55 46 Q59 42 63 46" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
      : `<path d="M37 47 Q41 42 45 47 M55 47 Q59 42 63 47" stroke="${INK}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
    return `<path d="M72 30 Q86 22 94 30 Q86 31 79 36 Z" fill="${ba}" ${line(ba)}/><path d="M72 34 Q84 36 90 46 Q81 42 74 40 Z" fill="${ba}" ${line(ba)}/>
      <rect x="30" y="62" width="40" height="26" rx="12" fill="${su}" ${L}/><rect x="31" y="72" width="38" height="6" fill="${ba}"/><path d="M50 72 L46 84 M50 72 L55 84" stroke="${ba}" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="26" cy="70" r="6" fill="${su}" ${L}/><circle cx="74" cy="70" r="6" fill="${su}" ${L}/>
      <circle cx="50" cy="42" r="25" fill="${su}" ${L}/><rect x="29" y="37" width="42" height="16" rx="8" fill="#F9D7B5" stroke="${shade(su, 0.3)}" stroke-width="2"/>
      ${eyes}<rect x="25" y="25" width="50" height="8" rx="4" fill="${ba}" ${line(ba)}/><circle cx="50" cy="29" r="3.4" fill="#fff" opacity=".8"/>
      <ellipse cx="38" cy="22" rx="7" ry="3" fill="#fff" opacity=".25" transform="rotate(-25 38 22)"/>`;
  };

  // ---- Superheroes (our own): suit, cape, mask, hair, skin (0-3), chest emblem
  M.hero = ([su, ca, ma, ha, sk, em]) => {
    su = col(su); ca = col(ca); ma = col(ma); ha = col(ha);
    const skin = ['#F9D7B5', '#E8B48A', '#C68642', '#8D5524'][+sk || 0];
    return `<path d="M32 50 Q18 78 22 92 L78 92 Q82 78 68 50 Z" fill="${ca}" ${line(ca)}/>
      <path d="M30 66 L18 56 M70 66 L82 56" stroke="${shade(su, 0.45)}" stroke-width="10" stroke-linecap="round"/><path d="M30 66 L18 56 M70 66 L82 56" stroke="${su}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="17" cy="54" r="5.5" fill="${ma}" ${line(ma)}/><circle cx="83" cy="54" r="5.5" fill="${ma}" ${line(ma)}/>
      <rect x="33" y="56" width="34" height="34" rx="12" fill="${su}" ${line(su)}/><rect x="33" y="78" width="34" height="5" fill="${ma}"/>
      <circle cx="50" cy="68" r="8.5" fill="#fff" stroke="${ma}" stroke-width="2.5"/>${emo(50, 68.5, 11, em || '⚡')}
      <circle cx="50" cy="36" r="20" fill="${skin}" stroke="${shade(skin, 0.35)}" stroke-width="2.5"/>
      <path d="M30 34 Q30 14 50 14 Q72 14 70 32 Q64 22 56 24 Q50 18 44 24 Q36 22 30 34 Z" fill="${ha}" ${line(ha)}/>
      <path d="M31 34 Q50 27 69 34 L68 43 Q50 38 32 43 Z" fill="${ma}" ${line(ma)}/>
      <ellipse cx="42" cy="37.5" rx="4.5" ry="3.6" fill="#fff"/><ellipse cx="58" cy="37.5" rx="4.5" ry="3.6" fill="#fff"/><circle cx="42.6" cy="38" r="2" fill="${INK}"/><circle cx="58.6" cy="38" r="2" fill="${INK}"/>
      ${smile(50, 46, 6, 5)}`;
  };

  // ---- Monster trucks and race cars: kind (monster/racer), body colour, accent colour, number or emoji
  M.truck = ([k, bc, ac, num]) => {
    bc = col(bc); ac = col(ac); const L = line(bc);
    const wheel = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#4B5563" stroke-width="${r * 0.28}" stroke-dasharray="3 3"/><circle cx="${x}" cy="${y}" r="${r * 0.42}" fill="${ac}" stroke="#D1D5DB" stroke-width="2"/><circle cx="${x}" cy="${y}" r="${r * 0.12}" fill="#fff"/>`;
    if (k === 'racer') return `<path d="M12 50 L12 42 L22 42 L24 50 Z" fill="${ac}" ${line(ac)}/>
      <path d="M8 64 Q8 52 24 50 L40 40 L62 40 L76 50 Q92 52 92 62 Q92 68 86 68 L14 68 Q8 68 8 64 Z" fill="${bc}" ${L}/>
      <path d="M42 44 L60 44 L70 51 L38 51 Z" fill="#BFEFFF" stroke="${shade(bc, 0.45)}" stroke-width="2"/><path d="M10 60 L90 60" stroke="${ac}" stroke-width="4"/>
      <circle cx="50" cy="58" r="7" fill="#fff" stroke="${ac}" stroke-width="2.5"/><text x="50" y="58.5" font-size="9" font-weight="700" font-family="sans-serif" text-anchor="middle" dominant-baseline="central" fill="${INK}">${num || 7}</text>
      ${wheel(26, 68, 10)}${wheel(74, 68, 10)}<circle cx="88" cy="56" r="2.6" fill="#FFE66D"/>`;
    return `<path d="M30 64 L30 56 M70 64 L70 56" stroke="#9CA3AF" stroke-width="4"/>
      <path d="M10 56 L10 44 L36 44 L44 28 L68 28 L76 44 L90 46 L90 58 Q90 62 86 62 L14 62 Q10 62 10 56 Z" fill="${bc}" ${L}/>
      <path d="M46 42 L50 32 L65 32 L70 42 Z" fill="#BFEFFF" stroke="${shade(bc, 0.45)}" stroke-width="2"/>
      <path d="M14 54 Q22 46 28 52 Q34 44 40 52 Q46 46 50 54 Z" fill="${ac}"/>${num ? emo(64, 52, 11, num) : ''}<rect x="84" y="48" width="5" height="5" rx="1.5" fill="#FFE66D"/>
      ${wheel(28, 72, 15)}${wheel(72, 72, 15)}`;
  };

  // ---- Rockets: body, fin, window colours, stripe colour
  M.rocket = ([bc, fc, wc, sc]) => {
    bc = col(bc); fc = col(fc); wc = col(wc || '#BFEFFF'); sc = col(sc || fc);
    return `<g transform="rotate(35 50 50)"><path d="M42 68 Q50 98 58 68 Z" fill="#FB923C"/><path d="M46 68 Q50 86 54 68 Z" fill="#FFE66D"/>
      <path d="M36 52 L22 70 L36 66 Z" fill="${fc}" ${line(fc)}/><path d="M64 52 L78 70 L64 66 Z" fill="${fc}" ${line(fc)}/>
      <path d="M50 6 Q68 22 65 66 L35 66 Q32 22 50 6 Z" fill="${bc}" ${line(bc)}/><path d="M50 6 Q60 14 63 24 L37 24 Q40 14 50 6 Z" fill="${fc}" ${line(fc)}/>
      <rect x="34" y="52" width="32" height="6" fill="${sc}"/><circle cx="50" cy="38" r="8.5" fill="${wc}" stroke="${shade(bc, 0.45)}" stroke-width="3"/><circle cx="47" cy="35" r="2.6" fill="#fff" opacity=".8"/>
      <rect x="44" y="66" width="12" height="5" rx="2" fill="#9CA3AF"/></g>${sparkle(16, 20, 5, '#FFE66D')}${sparkle(84, 84, 4, '#fff')}`;
  };

  // ---- Castles: wall, roof, flag colours; style (fairy = pointed roofs, fort = battlements)
  M.castle = ([wc, rc, fc, st]) => {
    wc = col(wc); rc = col(rc); fc = col(fc); const L = line(wc);
    const flag = (x, y) => `<path d="M${x} ${y} L${x} ${y - 14}" stroke="${INK}" stroke-width="2"/><path d="M${x} ${y - 14} L${x + 11} ${y - 10} L${x} ${y - 6} Z" fill="${fc}"/>`;
    const battle = (x, y, w) => Array.from({ length: Math.floor(w / 8) }, (_, i) => `<rect x="${x + i * 8}" y="${y - 6}" width="5" height="7" fill="${wc}" ${L}/>`).join('');
    const tower = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${wc}" ${L}/>` + (st === 'fort' ? battle(x + 1, y, w) : `<path d="M${x - 3} ${y} L${x + w / 2} ${y - w - 6} L${x + w + 3} ${y} Z" fill="${rc}" ${line(rc)}/>${flag(x + w / 2, y - w - 6)}`);
    return `${tower(14, 46, 16, 40)}${tower(70, 46, 16, 40)}${tower(36, 34, 28, 52)}
      <rect x="28" y="58" width="44" height="28" fill="${wc}" ${L}/>${st === 'fort' ? battle(29, 58, 44) : ''}
      <path d="M42 86 L42 72 Q50 62 58 72 L58 86 Z" fill="${shade(wc, 0.5)}"/><path d="M42 74 L58 74" stroke="${shade(wc, 0.3)}" stroke-width="1.5"/>
      <path d="M46 46 Q50 41 54 46 L54 54 L46 54 Z" fill="#FFE66D" stroke="${shade(wc, 0.45)}" stroke-width="2"/><rect x="19" y="56" width="6" height="9" rx="3" fill="${shade(wc, 0.5)}"/><rect x="75" y="56" width="6" height="9" rx="3" fill="${shade(wc, 0.5)}"/>
      ${st === 'fort' ? flag(50, 28) : ''}`;
  };

  // ---- Crowns: kind (crown/tiara/circlet), metal (gold/silver/rose), main gem, side gems
  const METAL = { gold: ['#FFD95A', '#E0A800'], silver: ['#E5E7EB', '#9CA3AF'], rose: ['#FBCFE8', '#E89BBE'] };
  M.crown = ([k, me, g1, g2]) => {
    const [m1, m2] = METAL[me] || METAL.gold; g1 = col(g1); g2 = col(g2 || g1);
    const L = `stroke="${shade(m2, 0.35)}" stroke-width="2.8" stroke-linejoin="round"`;
    const gem = (x, y, r, c) => `<path d="M${x} ${y - r} L${x + r * 0.8} ${y} L${x} ${y + r} L${x - r * 0.8} ${y} Z" fill="${c}" stroke="${shade(c, 0.4)}" stroke-width="1.8" stroke-linejoin="round"/><path d="M${x - r * 0.3} ${y - r * 0.35} L${x} ${y - r * 0.7}" stroke="#fff" stroke-width="1.6" opacity=".8"/>`;
    if (k === 'tiara') return `<path d="M14 70 Q50 52 86 70 L84 76 Q50 60 16 76 Z" fill="${m1}" ${L}/>
      <path d="M20 66 Q26 50 34 58 Q38 44 46 52 Q50 30 54 52 Q62 44 66 58 Q74 50 80 66 Q50 54 20 66 Z" fill="${m1}" ${L}/>
      <path d="M30 60 Q34 52 38 58 M62 58 Q66 52 70 60" stroke="${m2}" stroke-width="2" fill="none"/>${gem(50, 46, 8, g1)}${gem(34, 58, 4.5, g2)}${gem(66, 58, 4.5, g2)}
      <circle cx="50" cy="31" r="3.5" fill="#fff" stroke="${m2}" stroke-width="1.5"/>${sparkle(78, 36, 6, '#fff')}${sparkle(22, 42, 4, '#FFE66D')}`;
    if (k === 'circlet') return `<ellipse cx="50" cy="56" rx="34" ry="14" fill="none" stroke="${m2}" stroke-width="9"/><ellipse cx="50" cy="56" rx="34" ry="14" fill="none" stroke="${m1}" stroke-width="5.5"/>
      <path d="M38 64 Q50 44 62 64" fill="${m1}" ${L}/>${gem(50, 58, 9, g1)}${gem(24, 62, 4, g2)}${gem(76, 62, 4, g2)}${sparkle(80, 34, 6, '#fff')}`;
    return `<path d="M18 62 L16 28 L32 44 L50 18 L68 44 L84 28 L82 62 Z" fill="${m1}" ${L}/>
      <path d="M26 54 L25 38 L33 48 Z M74 54 L75 38 L67 48 Z" fill="#fff" opacity=".35"/>
      <rect x="16" y="60" width="68" height="18" rx="4" fill="${m1}" ${L}/><path d="M18 64 L82 64" stroke="#fff" stroke-width="2" opacity=".55"/>
      <circle cx="16" cy="27" r="4.5" fill="${g2}" ${L}/><circle cx="50" cy="16" r="5" fill="${g2}" ${L}/><circle cx="84" cy="27" r="4.5" fill="${g2}" ${L}/>
      ${gem(50, 69, 8, g1)}<circle cx="31" cy="69" r="4.5" fill="${g2}" stroke="${shade(g2, 0.4)}" stroke-width="1.8"/><circle cx="69" cy="69" r="4.5" fill="${g2}" stroke="${shade(g2, 0.4)}" stroke-width="1.8"/>${sparkle(86, 82, 5, '#fff')}`;
  };

  // ---- Gems: cut (round/emerald/heart/pear/marquise/princess/star/oval/trillion), colour
  M.gem = ([cut, c]) => {
    c = col(c); const lt = shade(c, -0.45), mid = shade(c, -0.18), dk = shade(c, 0.25), o = shade(c, 0.5);
    const S = `stroke="${o}" stroke-width="2.5" stroke-linejoin="round"`;
    let s = '';
    if (cut === 'emerald') s = `<path d="M30 20 L70 20 L82 32 L82 68 L70 80 L30 80 L18 68 L18 32 Z" fill="${c}" ${S}/><path d="M36 30 L64 30 L72 38 L72 62 L64 70 L36 70 L28 62 L28 38 Z" fill="${mid}" ${S}/><path d="M42 40 L58 40 L62 44 L62 56 L58 60 L42 60 L38 56 L38 44 Z" fill="${lt}" ${S}/><path d="M30 20 L36 30 M70 20 L64 30 M82 32 L72 38 M82 68 L72 62 M70 80 L64 70 M30 80 L36 70 M18 68 L28 62 M18 32 L28 38" stroke="${o}" stroke-width="2"/>`;
    else if (cut === 'heart') s = `<path d="M50 86 C14 62 8 38 22 24 C34 14 46 20 50 32 C54 20 66 14 78 24 C92 38 86 62 50 86 Z" fill="${c}" ${S}/><path d="M50 32 L50 86 M22 24 L50 52 L78 24 M50 52 L14 44 M50 52 L86 44" stroke="${o}" stroke-width="1.8" fill="none"/><path d="M22 24 C34 14 46 20 50 32 L50 52 Z" fill="${lt}" opacity=".7"/><path d="M50 52 L86 44 C82 60 70 72 50 86 Z" fill="${dk}" opacity=".6"/>`;
    else if (cut === 'pear') s = `<path d="M50 10 Q80 44 78 62 Q76 88 50 88 Q24 88 22 62 Q20 44 50 10 Z" fill="${c}" ${S}/><path d="M50 10 L50 88 M50 50 L22 62 M50 50 L78 62 M50 50 L32 84 M50 50 L68 84" stroke="${o}" stroke-width="1.8"/><path d="M50 10 L50 50 L22 62 Q20 44 50 10 Z" fill="${lt}" opacity=".7"/><path d="M50 50 L78 62 Q76 88 50 88 Z" fill="${dk}" opacity=".5"/>`;
    else if (cut === 'marquise') s = `<path d="M50 8 Q84 50 50 92 Q16 50 50 8 Z" fill="${c}" ${S}/><path d="M50 8 L50 92 M30 50 L70 50 M50 8 L30 50 L50 92 L70 50 Z" stroke="${o}" stroke-width="1.8" fill="none"/><path d="M50 8 L30 50 L50 50 Z" fill="${lt}" opacity=".75"/><path d="M50 50 L70 50 L50 92 Z" fill="${dk}" opacity=".55"/>`;
    else if (cut === 'princess') s = `<rect x="18" y="18" width="64" height="64" rx="3" fill="${c}" ${S}/><path d="M18 18 L82 82 M82 18 L18 82 M50 18 L50 82 M18 50 L82 50" stroke="${o}" stroke-width="1.8"/><path d="M18 18 L50 50 L18 82 Z" fill="${lt}" opacity=".6"/><path d="M82 18 L50 50 L82 82 Z" fill="${dk}" opacity=".5"/><rect x="38" y="38" width="24" height="24" fill="${mid}" ${S}/>`;
    else if (cut === 'star') s = `<path d="${star(50, 54, 42, 19, 5)}" fill="${c}" ${S}/><path d="${star(50, 54, 20, 9, 5)}" fill="${lt}" ${S}/>${Array.from({ length: 5 }, (_, i) => { const a = Math.PI * 2 / 5 * i - Math.PI / 2; return `<path d="M${50 + Math.cos(a) * 20} ${54 + Math.sin(a) * 20} L${50 + Math.cos(a) * 42} ${54 + Math.sin(a) * 42}" stroke="${o}" stroke-width="1.8"/>`; }).join('')}`;
    else if (cut === 'oval') s = `<ellipse cx="50" cy="50" rx="30" ry="40" fill="${c}" ${S}/><ellipse cx="50" cy="50" rx="15" ry="22" fill="${mid}" ${S}/><path d="M50 10 L50 28 M50 72 L50 90 M20 50 L35 50 M65 50 L80 50 M29 22 L39 33 M71 22 L61 33 M29 78 L39 67 M71 78 L61 67" stroke="${o}" stroke-width="1.8"/><path d="M50 10 Q24 14 20 50 L35 50 Q35 30 50 28 Z" fill="${lt}" opacity=".7"/>`;
    else if (cut === 'trillion') s = `<path d="M50 12 L88 80 L12 80 Z" fill="${c}" ${S}/><path d="M50 36 L70 70 L30 70 Z" fill="${mid}" ${S}/><path d="M50 12 L50 36 M88 80 L70 70 M12 80 L30 70" stroke="${o}" stroke-width="1.8"/><path d="M50 12 L12 80 L30 70 L50 36 Z" fill="${lt}" opacity=".7"/>`;
    else s = `<path d="M30 22 L70 22 L86 42 L50 88 L14 42 Z" fill="${c}" ${S}/><path d="M14 42 L86 42 M30 22 L40 42 L50 22 L60 42 L70 22 M40 42 L50 88 L60 42" stroke="${o}" stroke-width="1.8" fill="none"/>
      <path d="M30 22 L40 42 L14 42 Z M50 22 L60 42 L40 42 Z" fill="${lt}" opacity=".75"/><path d="M60 42 L86 42 L50 88 Z" fill="${dk}" opacity=".5"/>`;
    return s + sparkle(78, 18, 7, '#fff') + sparkle(22, 80, 4.5, '#fff');
  };

  // ---- Potions: bottle (round/tall/flask/heart), liquid colour, cork colour, extra (bubbles/sparkle/swirl/none)
  M.potion = ([bt, lc, cc, ex], uid) => {
    lc = col(lc); cc = col(cc || '#B7791F'); const id = 'po' + uid;
    const shapes = { round: 'M42 36 L42 26 L58 26 L58 36 Q78 44 78 64 Q78 88 50 88 Q22 88 22 64 Q22 44 42 36 Z',
      tall: 'M42 30 L42 20 L58 20 L58 30 Q66 34 66 44 L66 80 Q66 88 58 88 L42 88 Q34 88 34 80 L34 44 Q34 34 42 30 Z',
      flask: 'M43 38 L43 22 L57 22 L57 38 L78 80 Q82 88 72 88 L28 88 Q18 88 22 80 Z',
      heart: 'M43 30 L43 20 L57 20 L57 30 Q64 30 72 36 Q86 48 74 66 Q64 80 50 90 Q36 80 26 66 Q14 48 28 36 Q36 30 43 30 Z' };
    const P = shapes[bt] || shapes.round, top = bt === 'tall' ? 20 : bt === 'round' ? 26 : 22;
    const extra = ex === 'bubbles' ? `<circle cx="44" cy="70" r="3.5" fill="#fff" opacity=".7"/><circle cx="56" cy="62" r="2.5" fill="#fff" opacity=".7"/><circle cx="50" cy="78" r="2" fill="#fff" opacity=".7"/>`
      : ex === 'swirl' ? `<path d="M30 66 Q40 58 50 66 T70 66" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/>`
      : ex === 'sparkle' ? sparkle(56, 70, 6, '#fff') + sparkle(42, 64, 3.5, '#fff') : '';
    return `<defs><clipPath id="${id}"><path d="${P}"/></clipPath></defs><path d="${P}" fill="#E8F7FB" opacity=".9"/>
      <g clip-path="url(#${id})"><path d="M0 56 Q25 50 50 56 T100 56 L100 100 L0 100 Z" fill="${lc}"/><path d="M0 56 Q25 50 50 56 T100 56 L100 60 Q75 54 50 60 T0 60 Z" fill="#fff" opacity=".35"/>${extra}</g>
      <path d="${P}" fill="none" stroke="#7FB2C2" stroke-width="3" stroke-linejoin="round"/><path d="M30 50 Q28 62 32 72" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".8"/>
      <rect x="40" y="${top - 12}" width="20" height="14" rx="3" fill="${cc}" ${line(cc)}/><path d="M38 ${top + 2} L62 ${top + 2}" stroke="#7FB2C2" stroke-width="3" stroke-linecap="round"/>${sparkle(80, 22, 6, '#FFE66D')}`;
  };

  // ---- Constellations: name. Stars [x, y, size] and the lines between them (pairs of star numbers).
  const SKY = {
    plough: [[[10, 34, 3], [24, 36, 3], [36, 42, 3.2], [48, 46, 3], [52, 64, 3], [76, 66, 3.4], [80, 46, 3.4]], [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]]],
    orion: [[[32, 18, 4], [66, 22, 3.2], [44, 50, 2.6], [50, 48, 2.6], [56, 46, 2.6], [36, 80, 3], [68, 78, 4], [50, 12, 2]], [[0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6], [0, 7], [7, 1]]],
    cassiopeia: [[[10, 40, 3.2], [28, 60, 3], [46, 42, 3.4], [64, 58, 3], [86, 36, 3.2]], [[0, 1], [1, 2], [2, 3], [3, 4]]],
    swan: [[[50, 12, 3.6], [50, 36, 3], [50, 58, 2.6], [50, 84, 3.2], [22, 32, 2.8], [78, 42, 2.8]], [[0, 1], [1, 2], [2, 3], [4, 1], [1, 5]]],
    lion: [[[70, 22, 2.6], [62, 18, 2.6], [56, 26, 2.8], [60, 36, 3], [64, 48, 3.8], [30, 46, 3], [18, 58, 3.4], [34, 62, 2.8]], [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 4]]],
    lyre: [[[44, 14, 4.2], [52, 30, 2.4], [40, 32, 2.4], [56, 62, 2.8], [42, 66, 2.8]], [[0, 1], [0, 2], [1, 2], [1, 3], [2, 4], [3, 4]]],
    dragon: [[[80, 20, 3.4], [88, 30, 2.8], [76, 34, 2.8], [66, 46, 2.6], [56, 40, 2.6], [44, 50, 2.6], [40, 66, 2.6], [26, 74, 2.8], [14, 64, 2.6]], [[0, 1], [1, 2], [2, 0], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]]],
    pegasus: [[[30, 30, 3.2], [70, 30, 3.2], [70, 64, 3], [30, 64, 3], [12, 82, 2.6], [86, 16, 2.6], [88, 50, 2.4]], [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [1, 5], [2, 6]]],
    twins: [[[30, 14, 3.8], [60, 18, 4], [32, 40, 2.6], [58, 44, 2.6], [30, 66, 2.8], [62, 70, 2.8], [24, 86, 2.4], [70, 88, 2.4]], [[0, 2], [2, 4], [4, 6], [1, 3], [3, 5], [5, 7], [2, 3]]],
    bull: [[[50, 54, 4.2], [40, 46, 2.6], [46, 40, 2.6], [56, 44, 2.6], [20, 18, 3], [82, 22, 3], [72, 80, 2.4]], [[0, 1], [1, 2], [0, 3], [1, 4], [3, 5], [0, 6]]],
    cross: [[[50, 12, 3.6], [50, 86, 4], [24, 50, 3.2], [74, 44, 3.2], [62, 60, 2]], [[0, 1], [2, 3]]],
    eagle: [[[50, 40, 4.2], [44, 34, 2.6], [56, 46, 2.6], [20, 22, 2.6], [80, 62, 2.6], [50, 84, 2.8]], [[1, 0], [0, 2], [1, 3], [2, 4], [0, 5]]],
    scorpion: [[[80, 14, 2.6], [76, 26, 2.8], [72, 38, 3.8], [62, 52, 2.6], [56, 66, 2.6], [46, 78, 2.6], [30, 82, 2.6], [18, 74, 2.8], [22, 62, 2.6]], [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]]],
    littlebear: [[[86, 16, 4.4], [70, 24, 2.6], [56, 34, 2.6], [44, 46, 2.6], [24, 44, 3], [24, 64, 3], [44, 64, 2.6]], [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]]],
    andromeda: [[[14, 70, 3.2], [32, 58, 3], [50, 46, 3.6], [70, 32, 3.2], [88, 18, 2.6], [44, 30, 2.4], [58, 66, 2.4]], [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [2, 6]]]
  };
  M.sky = ([name]) => {
    const [stars, links] = SKY[name] || SKY.plough;
    return links.map(([a, b]) => `<path d="M${stars[a][0]} ${stars[a][1]} L${stars[b][0]} ${stars[b][1]}" stroke="#BAE6FD" stroke-width="2.4" stroke-linecap="round" opacity=".85"/>`).join('')
      + stars.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r * 1.9}" fill="#FFE66D" opacity=".25"/>${sparkle(x, y, r * 1.5, '#FFF7C2')}<circle cx="${x}" cy="${y}" r="${r * 0.55}" fill="#fff"/>`).join('');
  };

  // ---- Pixel art (our own sprites, 12 x 12). Letters are colours (see PX); '.' is empty.
  const PX = { k: '#1F2937', w: '#FFFFFF', r: '#EF4444', R: '#B91C1C', o: '#FB923C', y: '#FFD21F', Y: '#B88A00', g: '#5CCB6F', G: '#15803D', b: '#3B82F6', B: '#1E40AF',
    c: '#7DD3FC', p: '#A855F7', P: '#6B21A8', n: '#B7791F', N: '#78350F', s: '#CBD5E1', S: '#64748B', e: '#F9D7B5', m: '#F472B6', t: '#14B8A6' };
  const SPRITES = {
    sword: ['..........kk', '.........kss', '........kssk', '.......ksskk', '......ksskk.', '.k...ksskk..', '.kk.ksskk...', '..kkkskk....', '...kNkk.....', '..kNkyk.....', '.kNk.kk.....', '.kk.........'],
    shield: ['..kkkkkkkk..', '.kbbbbyybbk.', '.kbbbbyybbk.', '.kbbbbyybbk.', '.kyyyyyyyyk.', '.kyyyyyyyyk.', '.kbbbbyybbk.', '.kbbbbyybbk.', '..kbbbyybk..', '...kbbybk...', '....kbbk....', '.....kk.....'],
    potion: ['....kkkk....', '....kNNk....', '.....kk.....', '....kwwk....', '...kwccwk...', '..kwccccwk..', '.kwmmmmmmwk.', '.kmmwmmmmmk.', '.kmmmmmmwmk.', '.kmmmmmmmmk.', '..kmmmmmmk..', '...kkkkkk...'],
    heart: ['............', '..kkk..kkk..', '.krrrkkrrrk.', 'krwwrrrrrrRk', 'krwrrrrrrrRk', 'krrrrrrrrrRk', '.krrrrrrrRk.', '..krrrrrRk..', '...krrrRk...', '....krRk....', '.....kk.....', '............'],
    key: ['............', '..kkkk......', '.kyyyyk.....', 'kyykkyyk....', 'kykk.kyk....', 'kyyk.kykkkkk', '.kyykyyyyyyk', '..kkkkkykyk.', '.......kkkk.', '............', '............', '............'],
    coin: ['...kkkkkk...', '..kyyyyyyk..', '.kyywwyyyYk.', 'kyywyyyyyyYk', 'kyyykkkyyyYk', 'kyyyykyyyyYk', 'kyyyykyyyyYk', 'kyyykkkyyyYk', 'kyyyyyyyyyYk', '.kYyyyyyyYk.', '..kYYYYYYk..', '...kkkkkk...'],
    gem: ['............', '...kkkkkk...', '..kcwccccbk.', '.kcwcccccbBk', 'kkkkkkkkkkkk', '.kccccccbBk.', '..kcccccBk..', '...kcccBk...', '....kcBk....', '.....kk.....', '............', '............'],
    chest: ['............', '..kkkkkkkk..', '.kNnnnnnnNk.', 'kNnnnnnnnnNk', 'kkkkkyykkkkk', 'kNnnnyynnnNk', 'kNnnnkknnnNk', 'kNnnnnnnnnNk', 'kNnnnnnnnnNk', 'kkkkkkkkkkkk', '............', '............'],
    crown: ['............', 'k....k....k.', 'yk..kyk..ky.', 'yyk.kyk.kyy.', 'yyykyyykyyy.', 'yyyyyyyyyyy.', 'yryyybyyyry.', 'yyyyyyyyyyy.', 'kkkkkkkkkkk.', '............', '............', '............'],
    wand: ['........y...', '.......yyy..', '......yywyy.', '.......yyy..', '......k.y...', '.....kpk....', '....kpk.....', '...kpk......', '..kpk.......', '.kpk........', 'kpk.........', 'kk..........'],
    star: ['.....kk.....', '....kyyk....', '....kyyk....', 'kkkkkyykkkkk', 'kyyyywwyyyyk', '.kyyywyyyyk.', '..kyyyyyyk..', '..kyyyyyyk..', '.kyyykkyyyk.', '.kyyk..kyyk.', 'kyyk....kyyk', 'kkk......kkk'],
    mushroom: ['....kkkk....', '..kkrrrrkk..', '.krrwwrrrrk.', 'krrwwrrrwwrk', 'krrrrrrrwwrk', 'kwwrrrrrrrrk', 'kkkkkkkkkkkk', '...keeeek...', '...kekkek...', '...keeeek...', '...keeeek...', '....kkkk....'],
    slime: ['............', '............', '....kkkk....', '...kggggk...', '..kgwggggk..', '.kgwgggggGk.', '.kggkggkgGk.', 'kgggkggkggGk', 'kggggggggGGk', 'kgggmggmgGGk', '.kGGGGGGGGk.', '..kkkkkkkk..'],
    rocket: ['.....kk.....', '....krrk....', '...kwwwwk...', '...kwccwk...', '...kwccwk...', '...kwwwwk...', '..kkwwwwkk..', '.krkwwwwkrk.', '.krkwwwwkrk.', '.kk.kkkk.kk.', '....oyyo....', '.....oo.....'],
    cat: ['............', '.kk......kk.', '.kok....kok.', '.kook..kook.', '.koooookook.', 'koowooowookk', 'koookooookk.', 'koooommoooko', '.kooooooook.', '..kkkkkkkk..', '............', '............'],
    knight: ['...kkkkkk...', '..kssssssk..', '.kssSSSSssk.', '.kskkkkkksk.', '.ksssssssk..', '..kssssssk..', '.kkbbbbbbkk.', 'kskbbyybbksk', 'kskbbyybbksk', '.kkbbbbbbkk.', '..kSk..kSk..', '..kkk..kkk..'],
    wizard: ['.....kk.....', '....kppk....', '...kppypk...', '..kppppppk..', '.kkkkkkkkkk.', '...keeeek...', '...kekkek...', '...kwwwwk...', '..kpwwwwpk..', '.kpppwwpppk.', '.kpppppppk..', '..kkkkkkk...'],
    robot: ['.....kk.....', '.....ky.....', '..kkkkkkkk..', '..ksssssssk.', '..kscksckk..', '..ksssssssk.', '..kskkkkssk.', '..kkkkkkkk..', '.kSksssskSk.', '.kSksrrskSk.', '...ksssssk..', '...kk..kk...'],
    alien: ['............', '...kkkkkk...', '..kggggggk..', '.kggggggggk.', '.kgkkggkkgk.', '.kgkwggkwgk.', '.kggggggggk.', '..kggkkggk..', '...kggggk...', '..kgkggkgk..', '..kk.kk.kk..', '............'],
    dragon: ['............', '..k.k.......', '.kgkgk......', '.kggggkkk...', 'kgwkggggk...', 'kgkkgggggk..', 'kggggggyygk.', '.kkgggyyygkk', '...kggyyggGk', '...kgggggGk.', '....kkkkkk..', '............'],
    fox: ['............', 'kk......kk..', 'kok....kok..', 'koook.kook..', 'kooooooook..', 'kowkooowkok.', 'koooowooook.', '.kwwwkwwwk..', '..kwwwwwk...', '...kkkkk....', '............', '............'],
    frog: ['............', '.kkk...kkk..', 'kwkgk.kwkgk.', 'kkkgkkkkkgk.', 'kgggggggggk.', 'kggggggggggk', 'kgkgggggkggk', 'kggkkkkkggk.', '.kgggggggk..', 'kgkk...kkgk.', 'kkk.....kkk.', '............'],
    bunny: ['..kk..kk....', '.kwmk.kwmk..', '.kwmk.kwmk..', '.kwwkkkwwk..', 'kwwwwwwwwwk.', 'kwkwwwwkwwk.', 'kwwwwmwwwwk.', 'kwmwwwwwmwk.', '.kwwwwwwwk..', '..kkkkkkk...', '............', '............'],
    bird: ['............', '.....kkkk...', '....kbbbbk..', '...kbbwkbbk.', '...kbbbbbbok', 'kk.kbbbbbbk.', 'kbkbbbbbbbk.', '.kbbbbwwwbk.', '..kbbwwwwk..', '...kkkkkk...', '....k..k....', '...kk..kk...'],
    fish: ['............', '............', '....kkkk....', 'k..kbbbbk...', 'kkkbbbbwbk..', 'kbkbbbbkbbk.', 'kbbbbbbbbbk.', 'kkkbbbbbbk..', 'k..kbbbbk...', '....kkkk....', '............', '............'],
    princess: ['...ky.yk....', '...kyyyk....', '..knnnnnk...', '.knneeennk..', '.knekeeknk..', '.knneeennk..', '..knmmmnk...', '..kmmmmmk...', '.kmmmwmmmk..', 'kmmmmmmmmmk.', 'kkkkkkkkkkk.', '............'],
    ninja: ['...kkkkkk...', '..kkkkkkkk..', '.kkrrrrrrkkr', '.keeeeeeeekr', '.kekkeekkek.', '.kkkkkkkkkk.', '..kkkkkkkk..', '.kkkkrrkkkk.', 'kkkkkkkkkkkk', '.kkk....kkk.', '.kk......kk.', '............'],
    ghostfriend: ['............', '...kkkkk....', '..kwwwwwk...', '.kwwwwwwwk..', '.kwkwwwkwk..', '.kwwwwwwwk..', '.kwwmwwmwk..', '.kwwwwwwwk..', '.kwwwwwwwk..', '.kwkwkwkwk..', '.kk.k.k.kk..', '............'],
    controller: ['............', '............', '..kkkkkkkk..', '.kssssssssk.', 'ksskssssrssk', 'skkksssbsysk', 'ksskssssgssk', 'kssssssssssk', 'ksssskkssssk', '.kssk..kssk.', '..kk....kk..', '............'],
    trophy: ['............', 'kkkkkkkkkkk.', 'kyyywyyyyyk.', 'kyywyyyyyyk.', '.kyyyyyyyk..', '..kyyyyyk...', '...kyyyk....', '....kyk.....', '....kyk.....', '..kkkkkkk...', '..kNNNNNk...', '..kkkkkkk...'],
    bolt: ['......kkk...', '.....kyyk...', '....kyyk....', '...kyyk.....', '..kyyykkkk..', '.kyyyyyyyk..', '..kkkkyyk...', '....kyyk....', '...kyyk.....', '..kyyk......', '..kyk.......', '..kk........']
  };
  M.pixel = ([name]) => {
    const g = SPRITES[name] || SPRITES.star, n = g.length, cell = 76 / n, x0 = 12, y0 = 12;
    let s = '';
    g.forEach((row, y) => {
      let x = 0;
      while (x < row.length) {
        const ch = row[x];
        if (ch === '.') { x++; continue; }
        let w = 1; while (row[x + w] === ch) w++;
        s += `<rect x="${(x0 + x * cell).toFixed(2)}" y="${(y0 + y * cell).toFixed(2)}" width="${(w * cell + 0.3).toFixed(2)}" height="${(cell + 0.3).toFixed(2)}" fill="${PX[ch] || '#000'}"/>`;
        x += w;
      }
    });
    return `<g shape-rendering="crispEdges">${s}</g>`;
  };

  window.StickerMotifs = { draw: (name, params, uid) => (M[name] ? M[name](params, uid) : ''), names: Object.keys(M), sprites: Object.keys(SPRITES), sky: Object.keys(SKY), planets: Object.keys(PLANETS) };
})();
