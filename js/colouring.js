/* Colouring studio: a catalog of tap-to-fill pictures (saved per child) and a free drawing canvas.
   Pictures come by age: js/colouring/age3.js … age10.js (Colouring.addPack, loaded only when that age is shown),
   plus the 23 "classics" below, folded into ages 3–5. The catalog opens on the child's own age.
   Catalog: finished pictures show in the child's colours, unfinished ones in black and white.
   A finished picture can always be coloured again ("Start again"); the finished version stays in the catalog
   until the new one is finished. */
(function () {
  const INK = '#1F3A44';
  const L = `stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"`;
  const R = `data-r fill="#fff" ${L}`;
  const eye = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r || 8}" fill="${INK}"/><circle cx="${x + 2.5}" cy="${y - 3}" r="${(r || 8) / 3}" fill="#fff"/>`;
  const smile = (x, y, w) => `<path d="M${x - w} ${y} q${w} ${w * 0.9} ${w * 2} 0" ${L} fill="none"/>`;
  // Zig-zag ring (lion mane, sun rays).
  const star = (cx, cy, rOut, rIn, n) => {
    let p = '';
    for (let i = 0; i < n * 2; i++) { const a = Math.PI * i / n - Math.PI / 2, r = i % 2 ? rIn : rOut; p += (i ? ' L' : 'M') + (cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1); }
    return p + ' Z';
  };
  const band = (cx, cy, ro, ri) => `M${cx - ro} ${cy} A${ro} ${ro} 0 0 1 ${cx + ro} ${cy} L${cx + ri} ${cy} A${ri} ${ri} 0 0 0 ${cx - ri} ${cy} Z`;
  const cloud = (x, y, s) => `<path ${R} d="M${x} ${y} q${-4 * s} ${-26 * s} ${22 * s} ${-28 * s} q${6 * s} ${-22 * s} ${32 * s} ${-16 * s} q${22 * s} ${-12 * s} ${34 * s} ${12 * s} q${22 * s} ${2 * s} ${18 * s} ${32 * s} z"/>`;
  const BRAINY_C = [[150, 165, 70], [95, 155, 40], [205, 155, 40], [112, 112, 40], [188, 112, 40], [150, 98, 42], [104, 198, 34], [196, 198, 34], [150, 212, 42]];

  // cat = catalog category.
  const PICS = {
    monkey: { cat: 'animals', svg: `
      <path d="M200 250 q60 10 55 -50 q-3 -25 -22 -20" ${L} fill="none" stroke-width="10"/>
      <ellipse ${R} cx="150" cy="240" rx="58" ry="50"/><ellipse ${R} cx="150" cy="250" rx="34" ry="30"/>
      <circle ${R} cx="76" cy="118" r="28"/><circle ${R} cx="224" cy="118" r="28"/>
      <circle ${R} cx="76" cy="118" r="14"/><circle ${R} cx="224" cy="118" r="14"/>
      <circle ${R} cx="150" cy="120" r="72"/>
      <path ${R} d="M150 92 q-28 -16 -48 6 q-16 20 -2 42 q-8 34 50 44 q58 -10 50 -44 q14 -22 -2 -42 q-20 -22 -48 -6 z"/>
      ${eye(128, 124)}${eye(172, 124)}
      <circle cx="142" cy="150" r="3.5" fill="${INK}"/><circle cx="158" cy="150" r="3.5" fill="${INK}"/>${smile(150, 162, 18)}
      <path ${R} d="M196 236 q38 -6 50 -46 q10 8 2 30 q-12 30 -46 34 z"/>` },
    cat: { cat: 'animals', svg: `
      <path ${R} d="M212 252 q62 -6 52 -84 q-4 -16 -15 -6 q6 58 -40 66 z"/>
      <ellipse ${R} cx="150" cy="235" rx="66" ry="55"/><ellipse ${R} cx="150" cy="246" rx="36" ry="32"/>
      <polygon ${R} points="86,98 94,30 138,70"/><polygon ${R} points="214,98 206,30 162,70"/>
      <polygon ${R} points="96,82 100,50 120,70"/><polygon ${R} points="204,82 200,50 180,70"/>
      <circle ${R} cx="150" cy="118" r="62"/>
      <ellipse cx="126" cy="114" rx="8" ry="11" fill="${INK}"/><ellipse cx="174" cy="114" rx="8" ry="11" fill="${INK}"/>
      <polygon ${R} points="142,134 158,134 150,144"/>${smile(141, 150, 9)}${smile(159, 150, 9)}
      <path d="M96 136 h-34 M98 148 l-32 8 M204 136 h34 M202 148 l32 8" ${L}/>
      <ellipse ${R} cx="122" cy="288" rx="22" ry="10"/><ellipse ${R} cx="178" cy="288" rx="22" ry="10"/>` },
    bunny: { cat: 'animals', svg: `
      <ellipse ${R} cx="120" cy="72" rx="20" ry="56"/><ellipse ${R} cx="180" cy="72" rx="20" ry="56"/>
      <ellipse ${R} cx="120" cy="76" rx="9" ry="40"/><ellipse ${R} cx="180" cy="76" rx="9" ry="40"/>
      <circle ${R} cx="208" cy="256" r="18"/>
      <ellipse ${R} cx="150" cy="238" rx="60" ry="55"/>
      <circle ${R} cx="150" cy="145" r="56"/>
      ${eye(130, 138)}${eye(170, 138)}
      <circle ${R} cx="114" cy="160" r="10"/><circle ${R} cx="186" cy="160" r="10"/>
      <ellipse ${R} cx="150" cy="156" rx="8" ry="6"/><rect ${R} x="142" y="168" width="16" height="14" rx="3"/>
      <polygon ${R} points="62,214 104,232 70,262"/><path ${R} d="M58 214 q-14 -22 6 -24 q4 14 -6 24 z"/>` },
    bear: { cat: 'animals', svg: `
      <circle ${R} cx="94" cy="72" r="26"/><circle ${R} cx="206" cy="72" r="26"/>
      <circle ${R} cx="94" cy="72" r="12"/><circle ${R} cx="206" cy="72" r="12"/>
      <ellipse ${R} cx="150" cy="238" rx="72" ry="58"/><ellipse ${R} cx="150" cy="248" rx="40" ry="36"/>
      <path ${R} d="M150 262 q-26 -18 -14 -32 q8 -8 14 2 q6 -10 14 -2 q12 14 -14 32 z"/>
      <circle ${R} cx="150" cy="126" r="68"/>
      ${eye(124, 116)}${eye(176, 116)}
      <ellipse ${R} cx="150" cy="152" rx="30" ry="22"/><ellipse cx="150" cy="144" rx="9" ry="6" fill="${INK}"/>${smile(150, 156, 10)}
      <ellipse ${R} cx="84" cy="236" rx="18" ry="26"/><ellipse ${R} cx="216" cy="236" rx="18" ry="26"/>` },
    lion: { cat: 'animals', svg: `
      <ellipse ${R} cx="150" cy="250" rx="62" ry="44"/>
      <path ${R} d="${star(150, 128, 104, 80, 14)}"/>
      <circle ${R} cx="104" cy="80" r="15"/><circle ${R} cx="196" cy="80" r="15"/>
      <circle ${R} cx="150" cy="130" r="62"/>
      ${eye(126, 120)}${eye(174, 120)}
      <ellipse ${R} cx="150" cy="156" rx="28" ry="20"/><polygon fill="${INK}" points="140,144 160,144 150,154"/>${smile(150, 160, 10)}
      <path d="M128 158 l-18 -3 M128 165 l-18 4 M172 158 l18 -3 M172 165 l18 4" ${L}/>` },
    elephant: { cat: 'animals', svg: `
      <ellipse ${R} cx="150" cy="252" rx="70" ry="42"/>
      <ellipse ${R} cx="78" cy="128" rx="52" ry="62"/><ellipse ${R} cx="222" cy="128" rx="52" ry="62"/>
      <ellipse ${R} cx="82" cy="130" rx="30" ry="40"/><ellipse ${R} cx="218" cy="130" rx="30" ry="40"/>
      <circle ${R} cx="150" cy="120" r="62"/>
      <path ${R} d="M134 156 q-8 62 18 94 q16 12 24 -2 q-22 -30 -12 -92 z"/>
      ${eye(128, 116)}${eye(172, 116)}
      <circle ${R} cx="116" cy="146" r="9"/><circle ${R} cx="184" cy="146" r="9"/>` },
    owl: { cat: 'animals', svg: `
      <rect ${R} x="30" y="262" width="240" height="18" rx="9"/>
      <polygon ${R} points="78,82 92,36 122,70"/><polygon ${R} points="222,82 208,36 178,70"/>
      <ellipse ${R} cx="150" cy="165" rx="86" ry="104"/>
      <ellipse ${R} cx="150" cy="200" rx="54" ry="64"/>
      <path d="M126 186 q8 8 16 0 M158 186 q8 8 16 0 M142 210 q8 8 16 0 M126 234 q8 8 16 0 M158 234 q8 8 16 0" ${L} fill="none"/>
      <path ${R} d="M70 150 q-28 52 8 102 q18 -52 -8 -102 z"/><path ${R} d="M230 150 q28 52 -8 102 q-18 -52 8 -102 z"/>
      <circle ${R} cx="116" cy="128" r="30"/><circle ${R} cx="184" cy="128" r="30"/>
      ${eye(116, 128, 13)}${eye(184, 128, 13)}
      <polygon ${R} points="140,152 160,152 150,172"/>
      <path d="M128 262 v12 M140 262 v12 M160 262 v12 M172 262 v12" ${L}/>` },
    butterfly: { cat: 'animals', svg: `
      <path ${R} d="M150 150 q-96 -126 -122 -44 q-12 62 122 44 z"/><path ${R} d="M150 150 q96 -126 122 -44 q12 62 -122 44 z"/>
      <path ${R} d="M150 156 q-92 8 -92 70 q22 42 92 -70 z"/><path ${R} d="M150 156 q92 8 92 70 q-22 42 -92 -70 z"/>
      <circle ${R} cx="82" cy="100" r="18"/><circle ${R} cx="218" cy="100" r="18"/>
      <circle ${R} cx="98" cy="206" r="13"/><circle ${R} cx="202" cy="206" r="13"/>
      <ellipse ${R} cx="150" cy="166" rx="11" ry="56"/><circle ${R} cx="150" cy="100" r="15"/>
      <path d="M146 88 q-14 -30 -30 -36 M154 88 q14 -30 30 -36" ${L} fill="none"/><circle cx="116" cy="52" r="5" fill="${INK}"/><circle cx="184" cy="52" r="5" fill="${INK}"/>` },
    turtle: { cat: 'animals', svg: `
      <circle ${R} cx="256" cy="190" r="26"/>${eye(264, 184, 5)}${smile(262, 198, 7)}
      <ellipse ${R} cx="90" cy="236" rx="20" ry="14"/><ellipse ${R} cx="210" cy="236" rx="20" ry="14"/>
      <polygon ${R} points="50,206 26,220 52,220"/>
      <path ${R} d="M58 210 q92 -176 184 0 z"/>
      <polygon ${R} points="150,100 178,118 178,152 150,170 122,152 122,118"/>
      <path ${R} d="M110 126 l12 -8 v34 l-12 10 q-22 4 -30 -10 q10 -20 30 -26 z"/>
      <path ${R} d="M190 126 l-12 -8 v34 l12 10 q22 4 30 -10 q-10 -20 -30 -26 z"/>
      <rect ${R} x="52" y="204" width="196" height="20" rx="10"/>` },
    whale: { cat: 'animals', svg: `
      <path ${R} d="M0 262 q25 -16 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 V300 H0 z"/>
      <path ${R} d="M248 150 q24 -46 46 -26 q-8 22 -30 26 q26 14 12 40 q-20 -6 -28 -40 z"/>
      <path ${R} d="M34 176 q6 -96 128 -96 q92 0 100 82 q-8 62 -112 62 q-110 0 -116 -48 z"/>
      <path ${R} d="M48 196 q70 50 160 18 q-70 -2 -160 -18 z"/>
      ${eye(92, 150, 8)}${smile(98, 176, 14)}
      <circle ${R} cx="130" cy="56" r="9"/><circle ${R} cx="150" cy="40" r="11"/><circle ${R} cx="170" cy="56" r="9"/>
      <path d="M150 80 v-22" ${L}/>` },
    fish: { cat: 'animals', svg: `
      <path d="M40 290 q-14 -40 6 -70 q18 -30 0 -60" ${L} fill="none"/>
      <path d="M270 290 q14 -36 -4 -66" ${L} fill="none"/>
      <polygon ${R} points="222,150 285,95 285,205"/>
      <path ${R} d="M110 98 q40 -45 90 -4 z"/>
      <ellipse ${R} cx="140" cy="155" rx="92" ry="60"/>
      <path ${R} d="M120 170 q20 30 50 10 q-20 -20 -50 -10 z"/>
      <circle ${R} cx="88" cy="138" r="13"/><circle cx="91" cy="139" r="5" fill="${INK}"/>
      <path d="M60 172 q14 10 28 0" ${L} fill="none"/>
      <circle ${R} cx="40" cy="80" r="12"/><circle ${R} cx="62" cy="48" r="8"/><circle ${R} cx="36" cy="30" r="6"/>` },
    unicorn: { cat: 'fantasy', svg: `
      <circle ${R} cx="96" cy="98" r="24"/><circle ${R} cx="80" cy="140" r="22"/><circle ${R} cx="84" cy="182" r="20"/><circle ${R} cx="98" cy="218" r="18"/>
      <polygon ${R} points="104,92 112,48 136,84"/><polygon ${R} points="196,92 188,48 164,84"/>
      <circle ${R} cx="150" cy="150" r="66"/>
      <polygon ${R} points="150,18 134,90 166,90"/><path d="M140 70 l20 -8 M138 82 l24 -9 M144 52 l12 -5" ${L}/>
      <ellipse ${R} cx="150" cy="190" rx="42" ry="28"/>
      <circle cx="136" cy="190" r="4" fill="${INK}"/><circle cx="164" cy="190" r="4" fill="${INK}"/>
      <path d="M116 140 q10 10 20 0 M164 140 q10 10 20 0" ${L} fill="none"/>
      <circle ${R} cx="112" cy="166" r="9"/><circle ${R} cx="188" cy="166" r="9"/>` },
    dino: { cat: 'fantasy', svg: `
      <polygon ${R} points="80,196 14,246 90,236"/>
      <polygon ${R} points="104,152 118,124 132,150"/><polygon ${R} points="136,144 152,112 166,142"/><polygon ${R} points="168,148 184,122 196,154"/>
      <ellipse ${R} cx="150" cy="200" rx="82" ry="56"/>
      <ellipse ${R} cx="150" cy="214" rx="48" ry="32"/>
      <path ${R} d="M196 170 q8 -30 20 -48 l32 14 q-10 22 -12 48 z"/>
      <ellipse ${R} cx="238" cy="112" rx="46" ry="36"/>
      ${eye(250, 102, 7)}<path d="M214 126 q22 14 50 2" ${L} fill="none"/>
      <rect ${R} x="102" y="238" width="32" height="44" rx="12"/><rect ${R} x="168" y="238" width="32" height="44" rx="12"/>` },
    brainy: { cat: 'fantasy', svg: `<g data-r fill="#fff">
        ${BRAINY_C.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" stroke="${INK}" stroke-width="8"/>`).join('')}
        ${BRAINY_C.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>
      <circle ${R} cx="122" cy="160" r="24"/><circle ${R} cx="178" cy="160" r="24"/>
      <circle cx="124" cy="162" r="9" fill="${INK}"/><circle cx="180" cy="162" r="9" fill="${INK}"/>
      <path ${R} d="M124 196 q26 30 52 0 z"/>
      <path ${R} d="M100 74 v22 q50 18 100 0 v-22 z"/>
      <polygon ${R} points="150,30 238,58 150,86 62,58"/>
      <path ${R} d="M222 64 h14 l-3 30 h-8 z"/>` },
    castle: { cat: 'fantasy', svg: `
      <rect ${R} x="40" y="112" width="60" height="170"/><rect ${R} x="200" y="112" width="60" height="170"/>
      <polygon ${R} points="34,114 70,46 106,114"/><polygon ${R} points="194,114 230,46 266,114"/>
      <path d="M70 46 v-24" ${L}/><polygon ${R} points="70,22 94,30 70,38"/><path d="M230 46 v-24" ${L}/><polygon ${R} points="230,22 254,30 230,38"/>
      <path ${R} d="M100 282 V150 h16 v-18 h20 v18 h28 v-18 h20 v18 h16 V282 z"/>
      <path ${R} d="M130 282 v-52 q20 -28 40 0 v52 z"/>
      <path ${R} d="M58 160 q12 -16 24 0 v24 h-24 z"/><path ${R} d="M218 160 q12 -16 24 0 v24 h-24 z"/>
      <circle ${R} cx="150" cy="180" r="12"/>` },
    rocket: { cat: 'fantasy', svg: `
      <polygon ${R} points="40,50 46,64 62,64 50,74 54,90 40,80 26,90 30,74 18,64 34,64"/>
      <polygon ${R} points="250,200 255,212 268,212 258,220 262,233 250,225 238,233 242,220 232,212 245,212"/>
      <path ${R} d="M128 230 q22 60 44 0 z"/>
      <path ${R} d="M110 170 l-30 50 l40 -10 z"/><path ${R} d="M190 170 l30 50 l-40 -10 z"/>
      <path ${R} d="M150 20 q50 50 40 190 h-80 q-10 -140 40 -190 z"/>
      <path ${R} d="M120 70 q30 -45 60 0 z"/>
      <circle ${R} cx="150" cy="120" r="24"/>` },
    icecream: { cat: 'food', svg: `
      <polygon ${R} points="100,168 200,168 150,292"/>
      <path d="M112 196 l60 60 M130 180 l50 50 M188 196 l-60 60 M170 180 l-50 50" ${L}/>
      <circle ${R} cx="150" cy="146" r="54"/>
      <path ${R} d="M100 160 q8 26 22 10 q10 22 26 4 q14 20 28 0 q14 18 24 -14 q-50 18 -100 0 z"/>
      <circle ${R} cx="150" cy="84" r="44"/>
      <circle ${R} cx="150" cy="34" r="14"/><path d="M150 20 q6 -14 18 -16" ${L} fill="none"/>
      <rect ${R} x="122" y="74" width="10" height="5" rx="2" transform="rotate(-30 127 76)"/><rect ${R} x="164" y="92" width="10" height="5" rx="2" transform="rotate(30 169 94)"/>` },
    cupcake: { cat: 'food', svg: `
      <polygon ${R} points="82,182 218,182 196,282 104,282"/>
      <path d="M112 182 l8 100 M140 182 l3 100 M160 182 l-3 100 M188 182 l-8 100" ${L}/>
      <path ${R} d="M70 188 q-12 -40 30 -46 q0 -42 50 -42 q50 0 50 42 q42 6 30 46 z"/>
      <circle ${R} cx="150" cy="88" r="17"/><path d="M150 72 q4 -14 16 -18" ${L} fill="none"/>
      <rect ${R} x="104" y="150" width="12" height="6" rx="3" transform="rotate(-25 110 153)"/>
      <rect ${R} x="176" y="138" width="12" height="6" rx="3" transform="rotate(30 182 141)"/>
      <rect ${R} x="146" y="124" width="12" height="6" rx="3"/>` },
    flower: { cat: 'nature', svg: `
      <polygon ${R} points="105,230 195,230 182,292 118,292"/>
      <rect ${R} x="144" y="135" width="12" height="96"/>
      <ellipse ${R} cx="118" cy="190" rx="28" ry="12" transform="rotate(-30 118 190)"/>
      <ellipse ${R} cx="182" cy="175" rx="28" ry="12" transform="rotate(30 182 175)"/>
      <circle ${R} cx="150" cy="58" r="30"/><circle ${R} cx="196" cy="90" r="30"/><circle ${R} cx="180" cy="142" r="30"/>
      <circle ${R} cx="120" cy="142" r="30"/><circle ${R} cx="104" cy="90" r="30"/>
      <circle ${R} cx="150" cy="100" r="28"/>
      <polygon ${R} points="40,40 47,58 66,58 51,70 57,88 40,77 23,88 29,70 14,58 33,58"/>` },
    rainbow: { cat: 'nature', svg: `
      <path ${R} d="${star(250, 52, 34, 24, 10)}"/><circle ${R} cx="250" cy="52" r="20"/>
      ${[0, 1, 2, 3, 4].map(i => `<path ${R} d="${band(150, 236, 130 - i * 20, 110 - i * 20)}"/>`).join('')}
      ${cloud(4, 262, 1.15)}${cloud(186, 262, 1.15)}` },
    house: { cat: 'things', svg: `<rect ${R} x="0" y="240" width="300" height="60"/>
      <circle ${R} cx="250" cy="50" r="28"/>
      <rect ${R} x="195" y="62" width="26" height="50"/>
      <rect ${R} x="60" y="130" width="180" height="115"/>
      <polygon ${R} points="40,138 150,50 260,138"/>
      <rect ${R} x="130" y="180" width="42" height="65" rx="4"/>
      <rect ${R} x="78" y="155" width="36" height="34"/><rect ${R} x="188" y="155" width="36" height="34"/>
      <path d="M96 155v34M78 172h36M206 155v34M188 172h36" ${L} fill="none"/>` },
    car: { cat: 'things', svg: `
      <rect ${R} x="0" y="244" width="300" height="56"/><path d="M20 272 h40 M100 272 h40 M180 272 h40 M260 272 h30" ${L}/>
      <path ${R} d="M28 204 v-40 q0 -16 16 -16 h38 l36 -46 h92 l40 46 h22 q16 0 16 16 v40 z"/>
      <polygon ${R} points="128,112 168,112 168,148 100,148"/><polygon ${R} points="178,112 206,112 236,148 178,148"/>
      <circle ${R} cx="44" cy="174" r="9"/><rect ${R} x="250" y="168" width="20" height="12" rx="4"/>
      <circle ${R} cx="90" cy="206" r="30"/><circle ${R} cx="220" cy="206" r="30"/>
      <circle ${R} cx="90" cy="206" r="12"/><circle ${R} cx="220" cy="206" r="12"/>` },
    balloon: { cat: 'things', svg: `
      ${cloud(10, 112, 0.9)}${cloud(206, 210, 0.85)}
      <path ${R} d="M150 26 q82 0 82 86 q0 52 -62 98 h-40 q-62 -46 -62 -98 q0 -86 82 -86 z"/>
      <path ${R} d="M150 26 q-36 62 -20 184 h40 q16 -122 -20 -184 z"/>
      <path d="M130 210 l-2 32 M170 210 l2 32" ${L}/>
      <rect ${R} x="124" y="240" width="52" height="40" rx="6"/><path d="M124 256 h52" ${L}/>
      <path d="M246 60 q8 -8 16 0 q8 -8 16 0" ${L} fill="none"/>` }
  };
  // ---------- picture packs: one file per age (js/colouring/age3.js … age10.js), loaded only when needed ----------
  // A pack calls Colouring.addPack(age, [{ id: 'a<age>-…', cat, name: { en, fr, es, de, zh }, svg }, …]).
  // Array order = display order; the first few are the ones open under IK_CONFIG.limits (colouringPerAge).
  // The 23 pictures above are the "classics": they keep their ids (saved drawings, the puzzle game) and are
  // folded into the age 3–5 catalogs by how many parts they have, after that age's own pack.
  const AGES = [3, 4, 5, 6, 7, 8, 9, 10];
  const CLASSIC_AGE = {
    balloon: 3, cupcake: 3, lion: 3, brainy: 3, icecream: 3, whale: 3, fish: 3, house: 3, rocket: 3,
    elephant: 4, monkey: 4, rainbow: 4, turtle: 4, butterfly: 4, car: 4, dino: 4, owl: 4,
    bear: 5, castle: 5, cat: 5, flower: 5, unicorn: 5, bunny: 5
  };
  const PACKS = {};     // age -> picture ids, in display order
  const PACK_PICS = {}; // id -> { cat, name, svg, age }
  const loading = {};   // age -> Promise
  // Where the site lives, so packs load from file:// too and from any page depth (like js/voice.js).
  const BASE = (function () { const s = document.currentScript && document.currentScript.src; return s ? s.replace(/js\/colouring\.js(\?.*)?$/, '') : ''; })();
  function addPack(age, list) {
    PACKS[age] = [];
    (list || []).forEach(p => {
      if (!p || !p.id || !p.svg || PICS[p.id] || PACK_PICS[p.id]) return;
      PACK_PICS[p.id] = Object.assign({}, p, { age });
      PACKS[age].push(p.id);
    });
  }
  // Same-origin <script> tag: allowed by the Content-Security-Policy, and works from file://.
  function loadPack(age) {
    age = Number(age);
    if (PACKS[age]) return Promise.resolve(true);
    if (!AGES.includes(age)) return Promise.resolve(false);
    if (!loading[age]) {
      loading[age] = new Promise(res => {
        const s = document.createElement('script');
        s.src = BASE + 'js/colouring/age' + age + '.js';
        s.onload = () => res(!!PACKS[age]);
        s.onerror = () => { delete loading[age]; s.remove(); res(false); }; // offline: try again next time
        document.head.appendChild(s);
      });
    }
    return loading[age];
  }
  const packAgeOf = id => { const m = /^a(\d+)-/.exec(id || ''); return m ? Number(m[1]) : null; };
  // Loads the packs that these picture ids come from (e.g. a child's saved drawings for the parents' gallery).
  const loadFor = ids => Promise.all([...new Set(ids.map(packAgeOf).filter(a => a && !PACKS[a]))].map(loadPack));
  const get = id => PICS[id] || PACK_PICS[id] || null;
  const picName = id => {
    const p = PACK_PICS[id];
    return p ? (p.name && (p.name[I18N.getLang()] || p.name.en)) || id : t('pic_' + id);
  };
  // Pictures for one age: its own pack (once loaded), then the classics folded into that age.
  const forAge = age => (PACKS[age] || []).concat(Object.keys(PICS).filter(k => CLASSIC_AGE[k] === age));
  const packIndex = id => { const a = packAgeOf(id); return a && PACKS[a] ? PACKS[a].indexOf(id) : -1; };
  const ageFor = child => Math.min(10, Math.max(3, (child && Store.currentAge(child)) || 3));
  // Stickers "colour all the pictures" / "all the animal pictures": every open picture of the child's own age
  // (only animals for the second). Needs that age's pack loaded; an empty set never counts.
  function allDone(child, animalsOnly) {
    const age = ageFor(child);
    if (!PACKS[age]) return false;
    const d = child.drawings || {};
    const set = forAge(age).filter(k => Store.pictureOpen(k) && (!animalsOnly || get(k).cat === 'animals'));
    return set.length > 0 && set.every(k => d[k] && d[k].done);
  }

  // Category chips (only the ones that have pictures are shown).
  const CATS = [['all', '🌈'], ['princess', '👑'], ['animals', '🐵'], ['dinosaurs', '🦕'], ['ocean', '🐠'], ['fantasy', '🦄'], ['space', '🚀'],
    ['vehicles', '🚒'], ['food', '🍦'], ['nature', '🌸'], ['hobbies', '⚽'], ['holidays', '🎁'], ['patterns', '🌀'], ['things', '🧸']];
  const PALETTE = ['#EF4444', '#FB923C', '#FFD21F', '#5CCB6F', '#14B8A6', '#3ED8E8', '#3B82F6', '#A855F7', '#F472B6', '#FDA4AF', '#8D5524', '#F9D7B5', '#9CA3AF', '#1F3A44', '#FFFFFF'];
  const DONE_AT = 0.6; // "I'm done" becomes available at 60% coloured

  const regionCount = svg => (svg.match(/data-r/g) || []).length;
  const applyFills = (svgEl, fills) => { if (!fills) return; svgEl.querySelectorAll('[data-r]').forEach((r, i) => { if (fills[i]) r.setAttribute('fill', fills[i]); }); };

  function render(root, child, opts) {
    opts = opts || {};
    let colour = PALETTE[5], size = 12, filter = 'all', age = ageFor(child), view = 0;
    const tried = {}; // ages whose pack we already tried to load (so an offline catalog doesn't loop)
    const save = fn => Store.updateChild(child.id, c => { c.drawings = c.drawings || {}; fn(c.drawings); });
    const data = () => (Store.getChild(child.id).drawings || {});

    // ---------- catalog ----------
    // The child's own age first. The number chips (3–10) show another age's pictures; the child's own age has a ⭐.
    function ageChips() {
      const own = ageFor(child);
      return `<div class="age-chips" role="group" aria-label="${t('col_ages')}"><span class="age-cake" aria-hidden="true">🎂</span>${AGES.map(a =>
        `<button type="button" class="age-chip${a === age ? ' active' : ''}${a === own ? ' own' : ''}" data-age="${a}" aria-pressed="${a === age}" aria-label="${t('col_age', { n: a })}">${a}</button>`).join('')}</div>`;
    }
    function bindAges() {
      root.querySelectorAll('[data-age]').forEach(b => b.onclick = () => {
        const a = Number(b.dataset.age); if (a === age) return;
        age = a; filter = 'all'; GK.sfx('tap'); catalog();
      });
      // On a very narrow screen the row can be wider than the screen: keep the chosen age in view.
      const row = root.querySelector('.age-chips'), on = row && row.querySelector('.age-chip.active');
      if (on && row.scrollWidth > row.clientWidth) row.scrollLeft = on.offsetLeft - (row.clientWidth - on.offsetWidth) / 2;
    }
    function catalog() {
      const token = ++view;
      if (!PACKS[age] && !tried[age]) { // this age's pictures aren't here yet: load them
        root.innerHTML = `${ageChips()}<div class="cat-loading" role="status" aria-busy="true"><span class="boot-dots"><i></i><i></i><i></i></span></div>`;
        bindAges();
        loadPack(age).then(() => { tried[age] = true; if (token === view && root.isConnected) catalog(); });
        return;
      }
      const d = data();
      const keys = forAge(age), offline = !PACKS[age];
      // Pictures locked for now (IK_CONFIG.limits) come after the open ones and show a big padlock.
      const open = new Set(keys.filter(k => Store.pictureOpen(k)));
      const shown = keys.filter(k => open.has(k)).concat(keys.filter(k => !open.has(k)));
      const cats = CATS.filter(([k]) => k === 'all' || keys.some(p => get(p).cat === k));
      if (!cats.some(([k]) => k === filter)) filter = 'all';
      // Kids' catalog: pictures and names only (no counters). A finished picture shows in colour with
      // a ✅, a started one gets a 🎨 corner badge, a locked one a 🔒.
      root.innerHTML = `
        ${ageChips()}
        <div class="cat-filters" role="tablist">${cats.map(([k, e]) => `<button type="button" role="tab" class="cat-chip ${k === filter ? 'active' : ''}" data-f="${k}"><span>${e}</span>${t('cat_' + k)}</button>`).join('')}</div>
        <div class="cat-grid">
          ${filter === 'all' ? `<button type="button" class="pic-card free-card" data-free><span class="free-art">🖌️</span><strong>${t('freeDraw')}</strong></button>` : ''}
          ${shown.filter(k => filter === 'all' || get(k).cat === filter).map(k => {
            const P = get(k), e = d[k] || {}, total = regionCount(P.svg), held = !open.has(k);
            const pct = e.fills ? Math.round(e.fills.filter(Boolean).length / total * 100) : 0;
            const state = held ? t('locked') : e.done ? t('finished') : pct ? t('inProgress', { p: pct }) : '';
            const mark = held ? '🔒' : e.done ? '✅' : pct ? '🎨' : '';
            return `<button type="button" class="pic-card ${e.done ? 'is-done' : ''}${held ? ' is-locked' : ''}" data-pic="${k}" aria-label="${Art.esc(picName(k))}${state ? ' – ' + state : ''}">
              <svg class="pic-thumb" viewBox="0 0 300 300" aria-hidden="true">${P.svg}</svg>
              <strong>${Art.esc(picName(k))}</strong>
              ${mark ? `<span class="pic-mark${held ? ' lock' : ''}" aria-hidden="true">${mark}</span>` : ''}
            </button>`;
          }).join('')}
          ${offline ? `<button type="button" class="pic-card free-card retry-card" data-retry><span class="free-art">🔄</span><strong>${t('col_retry')}</strong></button>` : ''}
        </div>`;
      // Finished pictures show in the child's colours; everything else stays black and white.
      root.querySelectorAll('.pic-card[data-pic]').forEach(card => { const e = d[card.dataset.pic]; if (e && e.done) applyFills(card.querySelector('svg'), e.doneFills); });
      bindAges();
      root.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { filter = b.dataset.f; GK.sfx('tap'); catalog(); });
      root.querySelectorAll('[data-pic]').forEach(b => b.onclick = () => {
        if (!open.has(b.dataset.pic)) { GK.sfx('tap'); if (opts.onLocked) opts.onLocked(); return; }
        GK.sfx('pop'); editor(b.dataset.pic);
      });
      const fr = root.querySelector('[data-free]'); if (fr) fr.onclick = () => { GK.sfx('pop'); freeDraw(); };
      const rt = root.querySelector('[data-retry]'); if (rt) rt.onclick = () => { tried[age] = false; GK.sfx('tap'); catalog(); };
    }

    // ---------- palette ----------
    const paletteHtml = brushes => `<div class="palette">${PALETTE.map(c => `<button type="button" class="swatch ${c === colour ? 'active' : ''}" data-c="${c}" style="background:${c}" aria-label="${c}"></button>`).join('')}
        ${brushes ? `<span class="brush-sizes">${[6, 12, 24].map(s => `<button type="button" class="brush ${s === size ? 'active' : ''}" data-s="${s}" aria-label="${s}"><i style="width:${s}px;height:${s}px"></i></button>`).join('')}</span>` : ''}</div>`;
    function bindPalette() {
      root.querySelector('.palette').onclick = e => {
        const s = e.target.closest('.swatch'), br = e.target.closest('.brush');
        if (s) { colour = s.dataset.c; root.querySelectorAll('.swatch').forEach(x => x.classList.toggle('active', x === s)); GK.sfx('tap'); }
        if (br) { size = +br.dataset.s; root.querySelectorAll('.brush').forEach(x => x.classList.toggle('active', x === br)); }
      };
    }
    const head = (title, right) => `<div class="studio-head"><button type="button" class="btn ghost small" data-back><span class="flip-rtl">←</span> ${t('allPictures')}</button><h2>${title}</h2><span class="studio-right">${right || ''}</span></div>`;

    // ---------- colour one picture ----------
    function editor(pic) {
      const P = get(pic);
      if (!P || !Store.pictureOpen(pic)) return catalog(); // unknown, or locked for now
      view++; // a catalog still loading must not draw over the editor
      const total = regionCount(P.svg);
      const e = data()[pic] || {};
      let fills = (e.fills && e.fills.length === total) ? e.fills.slice() : Array(total).fill(null);
      root.innerHTML = `
        ${head(Art.esc(picName(pic)), `<span class="studio-prog"><b>0</b> / ${total}</span>`)}
        <div class="canvas-wrap"><svg class="colour-svg" viewBox="0 0 300 300">${P.svg}</svg></div>
        ${paletteHtml(false)}
        <div class="row center studio-actions">
          <button type="button" class="btn ghost" data-redo>🔄 ${t('startAgain')}</button>
          <button type="button" class="btn primary" data-done disabled>✅ ${t('imDone')}</button>
        </div>`;
      const svg = root.querySelector('svg');
      applyFills(svg, fills);
      const prog = () => {
        const n = fills.filter(Boolean).length;
        root.querySelector('.studio-prog b').textContent = n;
        root.querySelector('[data-done]').disabled = n / total < DONE_AT;
        return n;
      };
      prog();
      // A finished picture counts (for stickers) the first time, and again only after "Start again":
      // pressing "I'm done" again, or tapping a picture that is already finished, is not a new picture.
      let restarted = false;
      const finish = () => {
        const counted = !(data()[pic] || {}).done || restarted;
        restarted = false;
        const b4 = counted && opts.before ? opts.before() : null; // sticker counters before this picture is saved
        save(dr => { dr[pic] = { fills: fills.slice(), done: true, doneFills: fills.slice(), at: Date.now() }; });
        celebrate(pic, counted, b4);
      };
      svg.addEventListener('click', ev => {
        const r = ev.target.closest('[data-r]'); if (!r) return;
        const i = [...svg.querySelectorAll('[data-r]')].indexOf(r);
        r.setAttribute('fill', colour); fills[i] = colour; GK.sfx('pop');
        r.classList.remove('just'); void r.getBBox(); r.classList.add('just');
        save(dr => { dr[pic] = Object.assign({}, dr[pic] || {}, { fills: fills.slice() }); });
        if (prog() === total) setTimeout(finish, 350); // every part coloured: finished automatically
      });
      root.querySelector('[data-done]').onclick = finish;
      root.querySelector('[data-redo]').onclick = () => {
        fills = Array(total).fill(null); restarted = true;
        save(dr => { dr[pic] = Object.assign({}, dr[pic] || {}, { fills: fills.slice() }); }); // keep the finished copy for the catalog
        svg.querySelectorAll('[data-r]').forEach(r => r.setAttribute('fill', '#fff')); prog(); GK.sfx('tap');
      };
      root.querySelector('[data-back]').onclick = catalog;
      bindPalette();
      GK.speak(picName(pic) + '! ' + t('tapToColour'));
    }

    function celebrate(pic, counted, b4) {
      GK.sfx('win');
      const m = GK.el(`<div class="modal-back"><div class="modal"><div class="colour-done">
        <div class="done-pic"><svg viewBox="0 0 300 300">${get(pic).svg}</svg></div>
        <h2>${t('masterpiece', { name: Art.esc(picName(pic)) })}</h2>
        <p class="muted">${t('savedToCatalog')}</p>
        <div class="row center"><button class="btn ghost" data-keep>🖍️ ${t('keepColouring')}</button><button class="btn primary" data-more>🎨 ${t('colourAnother')}</button></div>
      </div></div></div>`);
      applyFills(m.querySelector('svg'), (data()[pic] || {}).doneFills);
      document.body.appendChild(m);
      GK.speak(t('masterpiece', { name: picName(pic) }));
      m.querySelector('[data-keep]').onclick = () => m.remove();
      m.querySelector('[data-more]').onclick = () => { m.remove(); catalog(); };
      if (opts.onFinish) opts.onFinish(pic, counted, b4);
    }

    // ---------- free drawing ----------
    function freeDraw() {
      view++;
      root.innerHTML = `${head(t('freeDraw'))}<div class="canvas-wrap"><canvas class="free-canvas"></canvas></div>${paletteHtml(true)}
        <div class="row center studio-actions"><button type="button" class="btn ghost" data-clear>🧽 ${t('clear')}</button></div>`;
      const wrap = root.querySelector('.canvas-wrap'), cv = wrap.querySelector('canvas');
      const w = wrap.clientWidth || 600, h = Math.round(w * 0.75), dpr = window.devicePixelRatio || 1;
      cv.width = w * dpr; cv.height = h * dpr; cv.style.height = h + 'px';
      const g = cv.getContext('2d'); g.scale(dpr, dpr);
      const blank = () => { g.fillStyle = '#fff'; g.fillRect(0, 0, w, h); };
      blank(); g.lineCap = g.lineJoin = 'round';
      let drawing = false, lx = 0, ly = 0;
      const pos = e => { const b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
      const line = (x, y) => { g.strokeStyle = colour; g.lineWidth = size; g.beginPath(); g.moveTo(lx, ly); g.lineTo(x, y); g.stroke(); lx = x; ly = y; };
      cv.addEventListener('pointerdown', e => { drawing = true; [lx, ly] = pos(e); try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } line(lx + 0.1, ly + 0.1); });
      cv.addEventListener('pointermove', e => { if (drawing) line(...pos(e)); });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => cv.addEventListener(ev, () => (drawing = false)));
      root.querySelector('[data-clear]').onclick = blank;
      root.querySelector('[data-back]').onclick = catalog;
      bindPalette();
    }

    catalog();
  }

  window.Colouring = {
    render, PICS, AGES, CLASSIC_AGE, addPack, loadPack, loadFor, get, name: picName, forAge, packIndex, ageFor, allDone,
    count: () => Object.keys(PICS).length + Object.keys(PACK_PICS).length
  };
})();
