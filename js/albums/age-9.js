/* IntelloKids sticker album for 9-year-olds: mythical creatures, legendary dragons, galaxies, music, our own pixel
   art, crown jewels and mysteries (see "Age albums" in js/stickers.js). kind: 'royal' or 'action' sets the order
   from the child's avatar (girl/boy); every child sees and can win everything. Names: English|Français|Español|Deutsch|中文. */
window.Stickers && Stickers.addAlbum(9, [
  { id: 'myths', t: 'Mythical creatures|Créatures fantastiques|Criaturas míticas|Fabelwesen|神奇生物', icon: '🐉', frame: 'hex', bg: ['#3C3684', '#14103F'], track: 'plays', items: [
    ['🐉', 'Sky serpent|Serpent céleste|Serpiente celeste|Himmelsschlange|天空神龙'], ['🧞', 'Genie|Génie|Genio|Dschinn|神灯精灵'], ['🧝', 'Elf|Elfe|Elfo|Elf|精灵'],
    ['🧙', 'Wizard|Magicien|Mago|Zauberer|巫师'], ['🦅+🦁', 'Griffin|Griffon|Grifo|Greif|狮鹫'], ['🦚~320+🔥', 'Phoenix|Phénix|Fénix|Phönix|凤凰'],
    ['🐙~250+🌊', 'Kraken|Kraken|Kraken|Krake der Tiefe|海怪'], ['🦍+❄️', 'Yeti|Yéti|Yeti|Yeti|雪人怪'], ['🐴+☁️', 'Pegasus|Pégase|Pegaso|Pegasus|飞马'],
    ['🐍~100+🌊', 'Sea serpent|Serpent de mer|Serpiente marina|Seeschlange|海蛇怪'], ['🦅+⚡', 'Thunderbird|Oiseau-tonnerre|Pájaro del trueno|Donnervogel|雷鸟'], ['🦊+✨', 'Spirit fox|Renard esprit|Zorro espíritu|Geisterfuchs|灵狐'],
    ['🦎+🔥', 'Fire salamander|Salamandre de feu|Salamandra de fuego|Feuersalamander|火蜥蜴'], ['🐎+🏹', 'Centaur|Centaure|Centauro|Zentaur|半人马'], ['🦄+🌌', 'Cosmic unicorn|Licorne cosmique|Unicornio cósmico|Kosmisches Einhorn|宇宙独角兽']
  ] },
  { id: 'dragons', kind: 'action', t: 'Legendary dragons|Dragons légendaires|Dragones legendarios|Legendäre Drachen|传奇巨龙', icon: '🐲', frame: 'shield', bg: ['#38306B', '#120C33'], track: 'answers', items: [
    ['m:dragon:#1F2937,#6B7280,#111827,#E5E7EB,legend', 'Obsidian dragon|Dragon d’obsidienne|Dragón de obsidiana|Obsidiandrache|黑曜石龙'], ['m:dragon:#DC2626,#FCA5A5,#7F1D1D,#FDE68A,legend', 'Ruby dragon|Dragon de rubis|Dragón de rubí|Rubindrache|红宝石龙'],
    ['m:dragon:#2563EB,#BFDBFE,#1E3A8A,#E0F2FE,legend', 'Sapphire dragon|Dragon de saphir|Dragón de zafiro|Saphirdrache|蓝宝石龙'], ['m:dragon:#059669,#A7F3D0,#064E3B,#FDE68A,legend', 'Emerald dragon|Dragon d’émeraude|Dragón de esmeralda|Smaragddrache|祖母绿龙'],
    ['m:dragon:#9333EA,#E9D5FF,#581C87,#FDE68A,legend', 'Amethyst dragon|Dragon d’améthyste|Dragón de amatista|Amethystdrache|紫水晶龙'], ['m:dragon:#E5E7EB,#FFFFFF,#9CA3AF,#93C5FD,legend', 'Silver dragon|Dragon d’argent|Dragón de plata|Silberdrache|白银龙'],
    ['m:dragon:#B45309,#FDE68A,#78350F,#FFF7ED,legend', 'Bronze dragon|Dragon de bronze|Dragón de bronce|Bronzedrache|青铜龙'], ['m:dragon:#FDF2F8,#FFFFFF,#F9A8D4,#FDE68A,legend', 'Pearl dragon|Dragon de perle|Dragón de perla|Perlendrache|珍珠龙'],
    ['m:dragon:#4338CA,#C7D2FE,#1E1B4B,#FDE68A,legend+⚡', 'Tempest dragon|Dragon de la tempête|Dragón de la tempestad|Unwetterdrache|暴风龙'], ['m:dragon:#EA580C,#FED7AA,#7C2D12,#FDE68A,legend+🌋', 'Volcano dragon|Dragon du volcan|Dragón del volcán|Vulkandrache|火山龙'],
    ['m:dragon:#67E8F9,#ECFEFF,#0891B2,#FFFFFF,legend+❄️', 'Glacier dragon|Dragon des glaciers|Dragón del glaciar|Gletscherdrache|冰川龙'], ['m:dragon:#7C3AED,#F0ABFC,#312E81,#FDE68A,legend+🌌', 'Nebula dragon|Dragon de la nébuleuse|Dragón de la nebulosa|Nebeldrache|星云龙'],
    ['m:dragon:#10B981,#A7F3D0,#6366F1,#FFFFFF,legend+🌈', 'Aurora dragon|Dragon de l’aurore|Dragón de la aurora|Polarlichtdrache|极光龙'], ['m:dragon:#111827,#F5B800,#374151,#F5B800,legend+🌑', 'Eclipse dragon|Dragon de l’éclipse|Dragón del eclipse|Finsternisdrache|日蚀龙'],
    ['m:dragon:#F5B800,#FFF7D6,#DC2626,#FFFFFF,legend+☀️', 'Ancient gold dragon|Dragon d’or ancien|Dragón de oro antiguo|Uralter Golddrache|远古金龙']
  ] },
  { id: 'galaxy', t: 'Galaxy explorer|Explorateur de galaxies|Explorador de galaxias|Galaxie-Entdecker|银河探险家', icon: '🌌', frame: 'circle', bg: ['#4A4FA6', '#0B0E33'], track: 'stars', items: [
    ['m:planet:#22D3EE,#0E7490,#A5F3FC,1,0,bands', 'Aqua Prime|Aqua Prime|Aqua Prime|Aqua Prime|水晶一号'], ['m:planet:#F472B6,#BE185D,,2,0,swirl', 'Rosetta|Rosetta|Rosetta|Rosetta|罗塞塔'],
    ['m:planet:#A3E635,#4D7C0F,#FDE68A,0,0,spots', 'Verdia|Verdia|Verdia|Verdia|绿野星'], ['m:planet:#FB923C,#C2410C,#FDBA74,1,0,bands', 'Ember-9|Braise-9|Brasa-9|Glut-9|余烬9号'],
    ['m:planet:#818CF8,#3730A3,#E0E7FF,2,0,swirl', 'Zephyr|Zéphyr|Céfiro|Zephyr|西风星'], ['m:planet:#FDE047,#CA8A04,,1,0,craters', 'Solara|Solara|Solara|Solara|索拉拉'],
    ['m:planet:#E879F9,#7E22CE,#F5D0FE,0,0,bands', 'Lilac Nova|Nova Lilas|Nova Lila|Lila Nova|紫丁香新星'], ['m:planet:#2DD4BF,#115E59,,2,0,spots', 'Tealos|Tealos|Tealos|Tealos|青石星'],
    ['m:planet:#F87171,#991B1B,#FCA5A5,1,0,swirl', 'Red Rock|Roche Rouge|Roca Roja|Roter Fels|红岩星'], ['m:planet:#93C5FD,#1D4ED8,#FFFFFF,0,0,bands', 'Glacia|Glacia|Glacia|Glacia|冰川星'],
    ['m:planet:#FCD34D,#B45309,#FDE68A,2,0,jupiter', 'Big Amber|Grande Ambre|Gran Ámbar|Großer Bernstein|大琥珀星'], ['m:planet:#C4B5FD,#6D28D9,,1,0,craters', 'Lavender moon|Lune lavande|Luna lavanda|Lavendelmond|薰衣草月'],
    ['m:planet:#4ADE80,#166534,#BBF7D0,1,0,swirl', 'Jungle World|Monde Jungle|Mundo Selva|Dschungelwelt|丛林星'], ['m:planet:#F9A8D4,#DB2777,#FBCFE8,2,0,bands', 'Candy Ring|Anneau Bonbon|Anillo de Caramelo|Bonbonring|糖果光环星'],
    ['m:planet:#F5B800,#B45309,#FFF3C4,2,0,bands', 'Golden Giant|Géante Dorée|Gigante Dorado|Goldener Riese|金色巨星']
  ] },
  { id: 'music', t: 'Music makers|Les musiciens|Los músicos|Musikmacher|音乐达人', icon: '🎸', frame: 'burst', bg: ['#FFF5EA', '#F59E5C'], track: 'fills', items: [
    ['🎸', 'Guitar|Guitare|Guitarra|Gitarre|吉他'], ['🎹', 'Piano|Piano|Piano|Klavier|钢琴'], ['🎺', 'Trumpet|Trompette|Trompeta|Trompete|小号'],
    ['🎻', 'Violin|Violon|Violín|Geige|小提琴'], ['🎷', 'Saxophone|Saxophone|Saxofón|Saxofon|萨克斯'], ['🎧', 'Headphones|Casque audio|Auriculares|Kopfhörer|耳机'],
    ['🪕', 'Banjo|Banjo|Banjo|Banjo|班卓琴'], ['🎵', 'Music note|Note de musique|Nota musical|Musiknote|音符'], ['📯', 'Horn|Cor|Trompa|Horn|号角'],
    ['🎼', 'Sheet music|Partition|Partitura|Notenblatt|乐谱'], ['📻', 'Radio|Radio|Radio|Radio|收音机'], ['💿', 'Disc|Disque|Disco|CD|光盘'],
    ['🎙️', 'Studio mic|Micro de studio|Micrófono de estudio|Studiomikrofon|录音话筒'], ['🔔', 'Bell|Cloche|Campana|Glocke|铃铛'], ['🎸+⚡', 'Electric guitar|Guitare électrique|Guitarra eléctrica|E-Gitarre|电吉他']
  ] },
  { id: 'pixel', kind: 'action', t: 'Pixel quest|Quête en pixels|Aventura pixelada|Pixel-Abenteuer|像素大冒险', icon: '🎮', frame: 'square', bg: ['#ECFFF3', '#7BE0A0'], track: 'chests', items: [
    ['m:pixel:sword', 'Pixel sword|Épée pixel|Espada pixel|Pixel-Schwert|像素剑'], ['m:pixel:shield', 'Pixel shield|Bouclier pixel|Escudo pixel|Pixel-Schild|像素盾'],
    ['m:pixel:potion', 'Magic potion|Potion magique|Poción mágica|Zaubertrank|魔法药水'], ['m:pixel:heart', 'Extra life|Vie bonus|Vida extra|Extraleben|额外生命'],
    ['m:pixel:key', 'Golden key|Clé d’or|Llave dorada|Goldener Schlüssel|金钥匙'], ['m:pixel:coin', 'Gold coin|Pièce d’or|Moneda de oro|Goldmünze|金币'],
    ['m:pixel:gem', 'Blue gem|Gemme bleue|Gema azul|Blauer Edelstein|蓝宝石'], ['m:pixel:chest', 'Treasure chest|Coffre au trésor|Cofre del tesoro|Schatztruhe|宝箱'],
    ['m:pixel:mushroom', 'Forest mushroom|Champignon des bois|Seta del bosque|Waldpilz|森林蘑菇'], ['m:pixel:wand', 'Magic wand|Baguette magique|Varita mágica|Zauberstab|魔法棒'],
    ['m:pixel:star', 'Super star|Super étoile|Súper estrella|Superstern|超级星星'], ['m:pixel:slime', 'Slime buddy|Copain gluant|Amigo baboso|Schleimfreund|史莱姆伙伴'],
    ['m:pixel:rocket', 'Pixel rocket|Fusée pixel|Cohete pixel|Pixel-Rakete|像素火箭'], ['m:pixel:bolt', 'Power-up|Bonus d’énergie|Potenciador|Power-up|能量加速'],
    ['m:pixel:crown', 'Pixel crown|Couronne pixel|Corona pixel|Pixel-Krone|像素王冠']
  ] },
  { id: 'jewels', kind: 'royal', t: 'Crown jewels|Les joyaux de la couronne|Las joyas de la corona|Kronjuwelen|皇冠珠宝', icon: '💎', frame: 'hex', bg: ['#FDF6FF', '#E3B6F5'], track: 'three', items: [
    ['m:gem:round,r', 'Ruby|Rubis|Rubí|Rubin|红宝石'], ['m:gem:oval,b', 'Sapphire|Saphir|Zafiro|Saphir|蓝宝石'], ['m:gem:emerald,g', 'Emerald|Émeraude|Esmeralda|Smaragd|祖母绿'],
    ['m:gem:princess,#BFE3FF', 'Diamond|Diamant|Diamante|Diamant|钻石'], ['m:gem:marquise,p', 'Amethyst|Améthyste|Amatista|Amethyst|紫水晶'], ['m:gem:pear,y', 'Topaz|Topaze|Topacio|Topas|黄玉'],
    ['m:gem:heart,k', 'Rose quartz|Quartz rose|Cuarzo rosa|Rosenquarz|粉晶'], ['m:gem:trillion,o', 'Fire opal|Opale de feu|Ópalo de fuego|Feueropal|火蛋白石'], ['m:gem:round,c', 'Aquamarine|Aigue-marine|Aguamarina|Aquamarin|海蓝宝'],
    ['m:gem:oval,#16A34A', 'Jade|Jade|Jade|Jade|玉石'], ['m:gem:star,#F5B800', 'Star stone|Pierre étoile|Piedra estrella|Sternstein|星光石'], ['m:gem:emerald,#9F1239', 'Garnet|Grenat|Granate|Granat|石榴石'],
    ['m:gem:pear,#C7D2FE', 'Moonstone|Pierre de lune|Piedra lunar|Mondstein|月光石'], ['m:gem:marquise,#14B8A6', 'Tourmaline|Tourmaline|Turmalina|Turmalin|碧玺'],
    ['m:gem:heart,#E11D48', 'Queen’s heart|Cœur de la reine|Corazón de la reina|Herz der Königin|女王之心']
  ] },
  { id: 'mystery', t: 'Mystery club|Le club des mystères|El club del misterio|Rätselclub|神秘侦探社', icon: '🔍', frame: 'circle', bg: ['#F8F3EA', '#C9B48A'], track: 'minutes', items: [
    ['🔍', 'Magnifying glass|Loupe|Lupa|Lupe|放大镜'], ['🕵️', 'Detective|Détective|Detective|Detektiv|侦探'], ['🗝️', 'Old key|Vieille clé|Llave antigua|Alter Schlüssel|古老钥匙'],
    ['🗺️', 'Treasure map|Carte au trésor|Mapa del tesoro|Schatzkarte|藏宝图'], ['🧭', 'Compass|Boussole|Brújula|Kompass|指南针'], ['🔦', 'Torch|Lampe torche|Linterna|Taschenlampe|手电筒'],
    ['📜', 'Secret scroll|Parchemin secret|Pergamino secreto|Geheime Schriftrolle|秘密卷轴'], ['🔐', 'Padlock|Cadenas|Candado|Vorhängeschloss|密码锁'], ['🎩', 'Top hat|Haut-de-forme|Sombrero de copa|Zylinder|礼帽'],
    ['🕯️', 'Candle|Bougie|Vela|Kerze|蜡烛'], ['🦉', 'Wise owl|Hibou sage|Búho sabio|Weise Eule|智慧猫头鹰'], ['👣', 'Footprints|Empreintes de pas|Huellas|Fußspuren|脚印'],
    ['✉️', 'Secret letter|Lettre secrète|Carta secreta|Geheimer Brief|秘密信件'], ['🔮', 'Crystal ball|Boule de cristal|Bola de cristal|Kristallkugel|水晶球'], ['⏳', 'Hourglass|Sablier|Reloj de arena|Sanduhr|沙漏']
  ] }
]);
