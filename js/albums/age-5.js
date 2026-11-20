/* IntelloKids sticker album for 5-year-olds: friendly characters, dinosaurs, sea life, space, bugs and sweets
   (see "Age albums" in js/stickers.js). Names: English|Français|Español|Deutsch|中文 (one name = the same everywhere). */
window.Stickers && Stickers.addAlbum(5, [
  { id: 'monsters', t: 'Monster pals|Copains monstres|Amigos monstruos|Monster-Freunde|怪兽伙伴', icon: '👾', frame: 'circle', bg: ['#FFFFFF', '#D3E6FF'], track: 'plays', items: [
    ['m:mon:g,2,horns,smile,,round', 'Bloop'], ['m:mon:p,1,ant,open,y,tall', 'Zib'], ['m:mon:o,3,ears,fang,,wide', 'Gobo'],
    ['m:mon:c,2,tuft,grin,b,round', 'Wigglet'], ['m:mon:k,2,none,tongue,,round', 'Pinky Pop'], ['m:mon:b,2,ant,smile,c,tall', 'Bubbo'],
    ['m:mon:y,1,horns,grin,o,wide', 'Snorf'], ['m:mon:t,3,tuft,smile,,round', 'Mimo'], ['m:mon:r,2,ears,open,y,wide', 'Rumble'],
    ['m:mon:l,1,tuft,tongue,k,tall', 'Fizzle'], ['m:mon:m,2,horns,fang,t,round', 'Tumtum'], ['m:mon:#FF8A65,3,ant,grin,,tall', 'Kipkap'],
    ['m:mon:#60A5FA,2,ears,smile,w,round', 'Blubbery'], ['m:mon:#F472B6,1,horns,open,p,wide', 'Glimmer'], ['m:mon:#FFD21F,2,tuft,grin,o,round', 'Sunny Snoot']
  ] },
  { id: 'dinos', t: 'Dino world|Le monde des dinos|El mundo de los dinos|Dino-Welt|恐龙世界', icon: '🦕', frame: 'hex', bg: ['#F7FBEA', '#C9DF8A'], track: 'answers', items: [
    ['m:dino:rex,g,y,spots', 'Green T. rex|T. rex vert|T. rex verde|Grüner T. rex|绿色霸王龙'], ['m:dino:long,b,c,none', 'Blue long-neck|Long-cou bleu|Cuellilargo azul|Blauer Langhals|蓝色长颈龙'],
    ['m:dino:trike,o,y,none', 'Orange triceratops|Tricératops orange|Triceratops naranja|Oranger Triceratops|橙色三角龙'], ['m:dino:stego,p,k,stripes', 'Purple stegosaurus|Stégosaure violet|Estegosaurio morado|Lila Stegosaurus|紫色剑龙'],
    ['m:dino:ptero,t,c,none', 'Teal pterodactyl|Ptérodactyle turquoise|Pterodáctilo turquesa|Türkiser Flugsaurier|青色翼龙'], ['m:dino:baby,g,o,spots', 'Baby dino|Bébé dino|Bebé dino|Dino-Baby|恐龙宝宝'],
    ['m:dino:rex,r,y,none', 'Red T. rex|T. rex rouge|T. rex rojo|Roter T. rex|红色霸王龙'], ['m:dino:long,g,y,spots', 'Spotty long-neck|Long-cou tacheté|Cuellilargo con manchas|Gepunkteter Langhals|斑点长颈龙'],
    ['m:dino:trike,b,c,spots', 'Blue triceratops|Tricératops bleu|Triceratops azul|Blauer Triceratops|蓝色三角龙'], ['m:dino:stego,g,o,none', 'Green stegosaurus|Stégosaure vert|Estegosaurio verde|Grüner Stegosaurus|绿色剑龙'],
    ['m:dino:ptero,o,y,none', 'Sunset pterodactyl|Ptérodactyle du soir|Pterodáctilo del atardecer|Abendrot-Flugsaurier|晚霞翼龙'], ['m:dino:baby,p,k,spots', 'Purple dino baby|Bébé dino violet|Bebé dino morado|Lila Dino-Baby|紫色恐龙宝宝'],
    ['m:dino:rex,p,y,stripes', 'Stripy T. rex|T. rex rayé|T. rex a rayas|Gestreifter T. rex|条纹霸王龙'], ['m:dino:long,k,w,spots', 'Pink long-neck|Long-cou rose|Cuellilargo rosa|Rosa Langhals|粉色长颈龙'],
    ['m:dino:rex,#F5B800,#FFF3C4,spots', 'Golden T. rex|T. rex doré|T. rex dorado|Goldener T. rex|金色霸王龙']
  ] },
  { id: 'sea', t: 'Under the sea|Sous la mer|Bajo el mar|Unter dem Meer|海底世界', icon: '🐙', frame: 'circle', bg: ['#E4F8FF', '#4FB3E8'], track: 'stars', items: [
    ['🐟', 'Fish|Poisson|Pez|Fisch|小鱼'], ['🐠', 'Tropical fish|Poisson tropical|Pez tropical|Tropenfisch|热带鱼'], ['🐡', 'Pufferfish|Poisson-globe|Pez globo|Kugelfisch|河豚'],
    ['🦈', 'Shark|Requin|Tiburón|Hai|鲨鱼'], ['🐙', 'Octopus|Pieuvre|Pulpo|Krake|章鱼'], ['🦑', 'Squid|Calmar|Calamar|Tintenfisch|鱿鱼'],
    ['🦀', 'Crab|Crabe|Cangrejo|Krebs|螃蟹'], ['🦞', 'Lobster|Homard|Langosta|Hummer|龙虾'], ['🦐', 'Shrimp|Crevette|Gamba|Garnele|虾'],
    ['🐚', 'Seashell|Coquillage|Concha|Muschel|贝壳'], ['🐬', 'Dolphin|Dauphin|Delfín|Delfin|海豚'], ['🐳', 'Whale|Baleine|Ballena|Wal|鲸鱼'],
    ['🐋', 'Blue whale|Baleine bleue|Ballena azul|Blauwal|蓝鲸'], ['🦦', 'Otter|Loutre|Nutria|Otter|水獭'], ['🦪', 'Pearl oyster|Huître perlière|Ostra perlera|Perlenauster|珍珠贝']
  ] },
  { id: 'space', t: 'Space trip|Voyage dans l’espace|Viaje al espacio|Weltraumreise|太空旅行', icon: '🪐', frame: 'burst', bg: ['#4A4FA6', '#151A55'], track: 'fills', items: [
    ['🌍', 'Earth|Terre|Tierra|Erde|地球'], ['🌕', 'Full moon|Pleine lune|Luna llena|Vollmond|满月'], ['🌗', 'Half moon|Demi-lune|Media luna|Halbmond|半月'],
    ['🪐', 'Ringed planet|Planète à anneaux|Planeta con anillos|Ringplanet|带环行星'], ['☄️', 'Comet|Comète|Cometa|Komet|彗星'], ['🌠', 'Shooting star|Étoile filante|Estrella fugaz|Sternschnuppe|流星'],
    ['👨‍🚀', 'Astronaut|Astronaute|Astronauta|Astronaut|宇航员'], ['👩‍🚀', 'Space explorer|Exploratrice de l’espace|Exploradora espacial|Raumfahrerin|女宇航员'], ['🛰️', 'Satellite|Satellite|Satélite|Satellit|卫星'],
    ['🔭', 'Telescope|Télescope|Telescopio|Teleskop|望远镜'], ['🌌', 'Milky Way|Voie lactée|Vía Láctea|Milchstraße|银河'], ['👽', 'Friendly alien|Gentil extraterrestre|Extraterrestre amigable|Netter Außerirdischer|友好的外星人'],
    ['👾', 'Space critter|Bestiole de l’espace|Bichito espacial|Weltraumwesen|太空小怪'], ['🚀+🌙', 'Moon rocket|Fusée lunaire|Cohete lunar|Mondrakete|登月火箭'], ['🌙+⭐', 'Starry night|Nuit étoilée|Noche estrellada|Sternennacht|星夜']
  ] },
  { id: 'sweets', t: 'Sweet treats|Douceurs|Dulces|Süßigkeiten|甜蜜零食', icon: '🍭', frame: 'scallop', bg: ['#FFF2F8', '#FF9EC7'], track: 'chests', items: [
    ['🍭', 'Lollipop|Sucette|Piruleta|Lutscher|棒棒糖'], ['🍬', 'Sweetie|Bonbon|Caramelo|Bonbon|糖果'], ['🍫', 'Chocolate|Chocolat|Chocolate|Schokolade|巧克力'],
    ['🍩', 'Doughnut|Beignet|Dónut|Donut|甜甜圈'], ['🍪', 'Cookie|Cookie|Galleta|Keks|曲奇'], ['🍦', 'Ice cream|Glace|Helado|Eis|冰淇淋'],
    ['🍨', 'Ice cream cup|Coupe glacée|Copa de helado|Eisbecher|冰淇淋杯'], ['🍧', 'Shaved ice|Glace pilée|Granizado|Wassereis|刨冰'], ['🍮', 'Pudding|Flan|Flan|Pudding|布丁'],
    ['🍯', 'Honey|Miel|Miel|Honig|蜂蜜'], ['🍡', 'Dango|Dango|Dango|Dango|团子'], ['🥤', 'Milkshake|Milk-shake|Batido|Milchshake|奶昔'],
    ['🥮', 'Mooncake|Gâteau de lune|Pastel de luna|Mondkuchen|月饼'], ['🍥', 'Swirl cake|Gâteau spirale|Pastel espiral|Spiralkuchen|漩涡糕'], ['🍫+🍓', 'Chocolate strawberry|Fraise au chocolat|Fresa con chocolate|Schoko-Erdbeere|巧克力草莓']
  ] },
  { id: 'bugs', t: 'Bug buddies|Petites bêtes|Bichitos|Krabbelfreunde|虫虫伙伴', icon: '🐞', frame: 'flower', bg: ['#F6FCE9', '#B5E07A'], track: 'three', items: [
    ['m:bug:lady,r,x', 'Ladybird|Coccinelle|Mariquita|Marienkäfer|瓢虫'], ['m:bug:butterfly,b,c', 'Blue butterfly|Papillon bleu|Mariposa azul|Blauer Falter|蓝蝴蝶'],
    ['m:bug:bee,y,x', 'Bumblebee|Bourdon|Abejorro|Hummel|大黄蜂'], ['m:bug:caterpillar,g,y', 'Caterpillar|Chenille|Oruga|Raupe|毛毛虫'],
    ['m:bug:snail,o,n', 'Snail|Escargot|Caracol|Schnecke|蜗牛'], ['m:bug:beetle,t,y', 'Shiny beetle|Scarabée brillant|Escarabajo brillante|Glänzender Käfer|闪亮甲虫'],
    ['m:bug:dragonfly,b,c', 'Dragonfly|Libellule|Libélula|Libelle|蜻蜓'], ['m:bug:lady,y,x', 'Yellow ladybird|Coccinelle jaune|Mariquita amarilla|Gelber Marienkäfer|黄瓢虫'],
    ['m:bug:butterfly,k,p', 'Pink butterfly|Papillon rose|Mariposa rosa|Rosa Falter|粉蝴蝶'], ['m:bug:caterpillar,p,k', 'Purple caterpillar|Chenille violette|Oruga morada|Lila Raupe|紫色毛毛虫'],
    ['m:bug:beetle,p,k', 'Purple beetle|Scarabée violet|Escarabajo morado|Lila Käfer|紫色甲虫'], ['m:bug:snail,k,p', 'Pink snail|Escargot rose|Caracol rosa|Rosa Schnecke|粉色蜗牛'],
    ['m:bug:dragonfly,g,y', 'Green dragonfly|Libellule verte|Libélula verde|Grüne Libelle|绿蜻蜓'], ['m:bug:butterfly,o,y', 'Sunset butterfly|Papillon couchant|Mariposa del atardecer|Abendfalter|晚霞蝴蝶'],
    ['m:bug:lady,#F5B800,r', 'Golden ladybird|Coccinelle dorée|Mariquita dorada|Goldener Marienkäfer|金瓢虫']
  ] },
  { id: 'fair', t: 'Fun fair|Fête foraine|Feria|Jahrmarkt|游乐园', icon: '🎡', frame: 'burst', bg: ['#FFF6E4', '#FFA26B'], track: 'minutes', items: [
    ['🎪', 'Circus tent|Chapiteau|Carpa de circo|Zirkuszelt|马戏帐篷'], ['🎡', 'Big wheel|Grande roue|Noria|Riesenrad|摩天轮'], ['🎢', 'Roller coaster|Montagnes russes|Montaña rusa|Achterbahn|过山车'],
    ['🤹', 'Juggler|Jongleur|Malabarista|Jongleur|杂耍'], ['🎟️', 'Ticket|Ticket|Entrada|Eintrittskarte|门票'], ['🎆', 'Fireworks|Feu d’artifice|Fuegos artificiales|Feuerwerk|烟花'],
    ['🎇', 'Sparkler|Cierge magique|Bengala|Wunderkerze|仙女棒'], ['🎉', 'Party popper|Cotillon|Cañón de confeti|Knallbonbon|派对礼花'], ['🎊', 'Confetti ball|Boule de confettis|Bola de confeti|Konfettiball|彩球'],
    ['🎏', 'Fish windsock|Manche à air poisson|Banderín de carpa|Fischdrachen|鲤鱼旗'], ['🎐', 'Wind chime|Carillon|Campanilla de viento|Windspiel|风铃'], ['🎶', 'Music|Musique|Música|Musik|音乐'],
    ['🎤', 'Microphone|Micro|Micrófono|Mikrofon|麦克风'], ['🎯', 'Bullseye|Dans le mille|Diana|Volltreffer|正中靶心'], ['🎭', 'Theatre masks|Masques de théâtre|Máscaras de teatro|Theatermasken|戏剧面具']
  ] }
]);
