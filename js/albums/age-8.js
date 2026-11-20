/* IntelloKids sticker album for 8-year-olds: elemental dragons, royal crowns, mermaids, sports, rockets, castles and
   race cars (see "Age albums" in js/stickers.js). kind: 'royal' or 'action' sets the order from the child's avatar
   (girl/boy); every child sees and can win everything. Names: English|Français|Español|Deutsch|中文. */
window.Stickers && Stickers.addAlbum(8, [
  { id: 'dragons', kind: 'action', t: 'Dragon den|L’antre des dragons|La guarida de los dragones|Drachenhöhle|巨龙巢穴', icon: '🐲', frame: 'shield', bg: ['#FFF4E6', '#F6B25C'], track: 'plays', items: [
    ['m:dragon:r,#FFD54F,#991B1B,#FDE68A+🔥', 'Fire dragon|Dragon de feu|Dragón de fuego|Feuerdrache|火龙'], ['m:dragon:#7DD3FC,#F0F9FF,#0284C7,#FFFFFF+❄️', 'Ice dragon|Dragon de glace|Dragón de hielo|Eisdrache|冰龙'],
    ['m:dragon:#6366F1,#C7D2FE,#312E81,#FDE68A+⚡', 'Storm dragon|Dragon de l’orage|Dragón de la tormenta|Sturmdrache|风暴龙'], ['m:dragon:#16A34A,#BBF7D0,#14532D,#FDE68A+🍃', 'Forest dragon|Dragon de la forêt|Dragón del bosque|Walddrache|森林龙'],
    ['m:dragon:#0EA5E9,#A5F3FC,#0E7490,#E0F2FE+🌊', 'Ocean dragon|Dragon des océans|Dragón del océano|Meeresdrache|海洋龙'], ['m:dragon:#A855F7,#F5D0FE,#6B21A8,#FFFFFF+💎', 'Crystal dragon|Dragon de cristal|Dragón de cristal|Kristalldrache|水晶龙'],
    ['m:dragon:#FBBF24,#FEF3C7,#F97316,#FFFFFF+☀️', 'Sun dragon|Dragon du soleil|Dragón del sol|Sonnendrache|太阳龙'], ['m:dragon:#475569,#CBD5E1,#1E293B,#E2E8F0+🌙', 'Moon dragon|Dragon de la lune|Dragón de la luna|Monddrache|月亮龙'],
    ['m:dragon:#EA580C,#FDE68A,#7C2D12,#FCD34D+🌋', 'Lava dragon|Dragon de lave|Dragón de lava|Lavadrache|熔岩龙'], ['m:dragon:#E0F2FE,#FFFFFF,#93C5FD,#FDE68A+☁️', 'Cloud dragon|Dragon des nuages|Dragón de las nubes|Wolkendrache|云龙'],
    ['m:dragon:#D97706,#FEF3C7,#92400E,#FFFFFF+🌵', 'Desert dragon|Dragon du désert|Dragón del desierto|Wüstendrache|沙漠龙'], ['m:dragon:#EC4899,#FCE7F3,#9D174D,#FDE68A+🌸', 'Blossom dragon|Dragon des fleurs|Dragón de las flores|Blütendrache|花之龙'],
    ['m:dragon:#14B8A6,#CCFBF1,#0F766E,#FDE68A+🌀', 'Wind dragon|Dragon du vent|Dragón del viento|Winddrache|风之龙'], ['m:dragon:#1E1B4B,#A5B4FC,#7C3AED,#FDE68A,legend+⭐', 'Star dragon|Dragon des étoiles|Dragón de las estrellas|Sternendrache|星辰龙'],
    ['m:dragon:#F5B800,#FFF7D6,#B45309,#FFFFFF,legend+👑', 'Dragon king|Roi des dragons|Rey de los dragones|Drachenkönig|龙王']
  ] },
  { id: 'court', kind: 'royal', t: 'Royal court|La cour royale|La corte real|Königshof|皇家宫廷', icon: '👑', frame: 'heart', bg: ['#FFF6FB', '#F5B3D6'], track: 'answers', items: [
    ['m:crown:crown,gold,r,b', 'Ruby crown|Couronne de rubis|Corona de rubíes|Rubinkrone|红宝石王冠'], ['m:crown:tiara,silver,k,c', 'Pink tiara|Diadème rose|Tiara rosa|Rosa Diadem|粉色头冠'],
    ['m:crown:circlet,rose,p,w', 'Rose circlet|Cercle de rose|Diadema rosa|Rosenreif|玫瑰金发箍'], ['m:crown:crown,silver,b,w', 'Ice crown|Couronne de glace|Corona de hielo|Eiskrone|冰雪王冠'],
    ['m:crown:tiara,gold,g,y', 'Emerald tiara|Diadème d’émeraude|Tiara de esmeraldas|Smaragd-Diadem|祖母绿头冠'], ['m:crown:circlet,gold,b,c', 'Sky circlet|Cercle du ciel|Diadema del cielo|Himmelsreif|天空发箍'],
    ['m:crown:crown,rose,k,p', 'Sweetheart crown|Couronne de cœur|Corona de corazón|Herzenskrone|甜心王冠'], ['m:crown:tiara,rose,p,k', 'Lilac tiara|Diadème lilas|Tiara lila|Flieder-Diadem|丁香头冠'],
    ['m:crown:circlet,silver,g,m', 'Forest circlet|Cercle de la forêt|Diadema del bosque|Waldreif|森林发箍'], ['m:crown:crown,gold,g,r', 'Garden crown|Couronne du jardin|Corona del jardín|Gartenkrone|花园王冠'],
    ['m:crown:tiara,silver,b,w', 'Snow tiara|Diadème des neiges|Tiara de nieve|Schnee-Diadem|雪花头冠'], ['m:crown:crown,silver,p,k', 'Starlight crown|Couronne de lumière|Corona de luz de estrellas|Sternenlichtkrone|星光王冠'],
    ['m:crown:circlet,gold,r,y', 'Sunset circlet|Cercle du couchant|Diadema del atardecer|Abendrot-Reif|夕阳发箍'], ['m:crown:tiara,gold,c,k', 'Mermaid tiara|Diadème de sirène|Tiara de sirena|Meerjungfrauen-Diadem|美人鱼头冠'],
    ['m:crown:crown,gold,#F5B800,r', 'Queen’s crown|Couronne de la reine|Corona de la reina|Krone der Königin|女王的王冠']
  ] },
  { id: 'sports', kind: 'action', t: 'Sports stars|Champions du sport|Estrellas del deporte|Sportstars|运动明星', icon: '⚽', frame: 'circle', bg: ['#ECFAEF', '#5CCB6F'], track: 'stars', items: [
    ['⚽', 'Football|Football|Fútbol|Fußball|足球'], ['🏀', 'Basketball|Basket|Baloncesto|Basketball|篮球'], ['🏈', 'American football|Football américain|Fútbol americano|Football|美式橄榄球'],
    ['⚾', 'Baseball|Baseball|Béisbol|Baseball|棒球'], ['🎾', 'Tennis|Tennis|Tenis|Tennis|网球'], ['🏉', 'Rugby|Rugby|Rugby|Rugby|英式橄榄球'],
    ['🏓', 'Table tennis|Ping-pong|Ping-pong|Tischtennis|乒乓球'], ['🏸', 'Badminton|Badminton|Bádminton|Badminton|羽毛球'], ['🏒', 'Ice hockey|Hockey sur glace|Hockey sobre hielo|Eishockey|冰球'],
    ['⛳', 'Golf|Golf|Golf|Golf|高尔夫'], ['🥊', 'Boxing gloves|Gants de boxe|Guantes de boxeo|Boxhandschuhe|拳击手套'], ['🏹', 'Archery|Tir à l’arc|Tiro con arco|Bogenschießen|射箭'],
    ['⛸️', 'Ice skating|Patin à glace|Patinaje sobre hielo|Eislaufen|滑冰'], ['🤸', 'Gymnastics|Gymnastique|Gimnasia|Turnen|体操'], ['🏆+⭐', 'Champion cup|Coupe du champion|Copa de campeón|Siegerpokal|冠军奖杯']
  ] },
  { id: 'mermaids', kind: 'royal', t: 'Mermaid lagoon|Le lagon des sirènes|La laguna de las sirenas|Meerjungfrauen-Lagune|美人鱼泻湖', icon: '🧜‍♀️', frame: 'circle', bg: ['#E8FBFF', '#5ED3E6'], track: 'fills', items: [
    ['🧜‍♀️', 'Mermaid|Sirène|Sirena|Meerjungfrau|美人鱼'], ['🧜‍♂️', 'Merman|Triton|Tritón|Meermann|人鱼王子'], ['🧜‍♀️+🐚', 'Shell mermaid|Sirène des coquillages|Sirena de conchas|Muschel-Meerjungfrau|贝壳美人鱼'],
    ['🧜‍♀️+🐠', 'Reef mermaid|Sirène du récif|Sirena del arrecife|Riff-Meerjungfrau|珊瑚礁美人鱼'], ['🧜‍♀️+🌊', 'Wave mermaid|Sirène des vagues|Sirena de las olas|Wellen-Meerjungfrau|浪花美人鱼'], ['🧜‍♀️+🌙', 'Moonlight mermaid|Sirène au clair de lune|Sirena de luna|Mondschein-Meerjungfrau|月光美人鱼'],
    ['🧜‍♀️+🐬', 'Dolphin friend|Amie des dauphins|Amiga de los delfines|Delfinfreundin|海豚朋友'], ['🧜‍♀️+⭐', 'Star mermaid|Sirène étoilée|Sirena estrella|Sternen-Meerjungfrau|星星美人鱼'], ['🧜‍♀️+🎶', 'Singing mermaid|Sirène chanteuse|Sirena cantora|Singende Meerjungfrau|唱歌的美人鱼'],
    ['🧜‍♀️+💎', 'Pearl mermaid|Sirène des perles|Sirena de perlas|Perlen-Meerjungfrau|珍珠美人鱼'], ['🧜‍♂️+🔱', 'Sea king|Roi des mers|Rey del mar|Meereskönig|海洋之王'], ['🧜‍♀️+🌸', 'Coral mermaid|Sirène corail|Sirena de coral|Korallen-Meerjungfrau|珊瑚花美人鱼'],
    ['🧜‍♀️+❄️', 'Arctic mermaid|Sirène arctique|Sirena ártica|Polar-Meerjungfrau|北极美人鱼'], ['🧜‍♀️+🌈', 'Rainbow mermaid|Sirène arc-en-ciel|Sirena arcoíris|Regenbogen-Meerjungfrau|彩虹美人鱼'],
    ['🧜‍♀️+👑', 'Mermaid queen|Reine des sirènes|Reina sirena|Meerjungfrauenkönigin|美人鱼女王']
  ] },
  { id: 'rockets', kind: 'action', t: 'Rocket mission|Mission fusée|Misión cohete|Raketenmission|火箭任务', icon: '🚀', frame: 'circle', bg: ['#4A4FA6', '#151A55'], track: 'chests', items: [
    ['m:rocket:w,r,c,r', 'Red Comet|Comète Rouge|Cometa Rojo|Roter Komet|红色彗星号'], ['m:rocket:p,y,c,k', 'Star Hopper|Saute-Étoiles|Saltaestrellas|Sternenhüpfer|跳星号'],
    ['m:rocket:b,w,y,w', 'Blue Arrow|Flèche Bleue|Flecha Azul|Blauer Pfeil|蓝箭号'], ['m:rocket:y,r,c,o', 'Sunbeam|Rayon de Soleil|Rayo de Sol|Sonnenstrahl|阳光号'],
    ['m:rocket:g,y,w,g', 'Moon Bug|Insecte Lunaire|Bicho Lunar|Mondkäfer|月球虫号'], ['m:rocket:o,p,c,y', 'Orbit Racer|Coureur d’Orbite|Corredor Orbital|Orbitflitzer|轨道飞车号'],
    ['m:rocket:k,p,w,w', 'Pink Nova|Nova Rose|Nova Rosa|Pinke Nova|粉红新星号'], ['m:rocket:s,b,c,b', 'Silver Falcon|Faucon d’Argent|Halcón Plateado|Silberfalke|银鹰号'],
    ['m:rocket:t,y,c,y', 'Teal Twister|Tornade Turquoise|Tornado Turquesa|Türkiser Wirbel|青色旋风号'], ['m:rocket:r,y,w,y', 'Fire Flyer|Vol de Feu|Volador de Fuego|Feuerflieger|火焰飞行号'],
    ['m:rocket:w,b,c,p', 'Galaxy Glider|Planeur Galactique|Planeador Galáctico|Galaxiegleiter|银河滑翔号'], ['m:rocket:x,#F5B800,c,y', 'Night Hawk|Faucon de Nuit|Halcón Nocturno|Nachtfalke|夜鹰号'],
    ['m:rocket:p,c,w,c', 'Space Dolphin|Dauphin Spatial|Delfín Espacial|Weltraumdelfin|太空海豚号'], ['m:rocket:w,g,c,g', 'Explorer One|Explorateur Un|Explorador Uno|Entdecker Eins|探索者一号'],
    ['m:rocket:#F5B800,r,c,r', 'Golden Voyager|Voyageur Doré|Viajero Dorado|Goldener Voyager|黄金旅行者号']
  ] },
  { id: 'castles', t: 'Castle quest|La quête des châteaux|La búsqueda del castillo|Burgen-Abenteuer|城堡探险', icon: '🏰', frame: 'shield', bg: ['#F0F7FF', '#9CC3EC'], track: 'three', items: [
    ['m:castle:w,k,p,fairy', 'Pink palace|Palais rose|Palacio rosa|Rosa Palast|粉红宫殿'], ['m:castle:s,b,r,fort', 'Stone fort|Fort de pierre|Fuerte de piedra|Steinfestung|石头堡垒'],
    ['m:castle:#FDE68A,r,b,fairy', 'Sunny castle|Château du soleil|Castillo del sol|Sonnenschloss|阳光城堡'], ['m:castle:#CBD5E1,x,y,fort', 'Knight’s keep|Donjon du chevalier|Torre del caballero|Ritterburg|骑士城堡'],
    ['m:castle:w,b,y,fairy', 'Sky castle|Château du ciel|Castillo del cielo|Himmelsschloss|天空城堡'], ['m:castle:#E9D5FF,p,k,fairy', 'Lilac palace|Palais lilas|Palacio lila|Fliederpalast|丁香宫殿'],
    ['m:castle:#D6D3D1,g,r,fort', 'Forest fort|Fort de la forêt|Fuerte del bosque|Waldfestung|森林堡垒'], ['m:castle:#BAE6FD,w,c,fairy', 'Ice palace|Palais de glace|Palacio de hielo|Eispalast|冰雪宫殿'],
    ['m:castle:#FECACA,r,y,fort', 'Red tower|Tour rouge|Torre roja|Roter Turm|红色塔楼'], ['m:castle:w,g,k,fairy', 'Garden palace|Palais du jardin|Palacio del jardín|Gartenpalast|花园宫殿'],
    ['m:castle:#94A3B8,p,y,fort', 'Dragon keep|Donjon du dragon|Torre del dragón|Drachenburg|飞龙城堡'], ['m:castle:#FEF3C7,o,r,fairy', 'Desert palace|Palais du désert|Palacio del desierto|Wüstenpalast|沙漠宫殿'],
    ['m:castle:#C7D2FE,v,y,fairy', 'Moon castle|Château de la lune|Castillo de la luna|Mondschloss|月亮城堡'], ['m:castle:#1E293B,p,y,fort', 'Night fortress|Forteresse de la nuit|Fortaleza nocturna|Nachtfestung|暗夜要塞'],
    ['m:castle:#FDE68A,#F5B800,r,fairy', 'Golden palace|Palais doré|Palacio dorado|Goldpalast|黄金宫殿']
  ] },
  { id: 'racers', kind: 'action', t: 'Speed racers|Les bolides|Bólidos|Flitzer|极速赛车', icon: '🏁', frame: 'square', bg: ['#F5F7F9', '#B4BFCB'], track: 'minutes', items: [
    ['m:truck:racer,b,y,7', 'Blue Flash|Éclair Bleu|Rayo Azul|Blauer Blitz|蓝色闪电'], ['m:truck:racer,r,w,1', 'Red Rocket|Fusée Rouge|Cohete Rojo|Rote Rakete|红色火箭'],
    ['m:truck:racer,g,y,3', 'Green Machine|Machine Verte|Máquina Verde|Grüne Maschine|绿色机器'], ['m:truck:racer,y,x,5', 'Yellow Zoom|Zoom Jaune|Zum Amarillo|Gelber Zoom|黄色飞驰'],
    ['m:truck:racer,o,b,8', 'Orange Dash|Fonceur Orange|Carrera Naranja|Oranger Sprinter|橙色冲刺'], ['m:truck:racer,p,y,9', 'Purple Streak|Traînée Violette|Estela Morada|Lila Strahl|紫色流光'],
    ['m:truck:racer,k,w,2', 'Pink Speedster|Bolide Rose|Bólido Rosa|Pinker Flitzer|粉色飞车'], ['m:truck:racer,t,y,4', 'Teal Turbo|Turbo Turquoise|Turbo Turquesa|Türkis-Turbo|青色涡轮'],
    ['m:truck:racer,x,r,6', 'Night Racer|Coureur de Nuit|Corredor Nocturno|Nachtrenner|暗夜赛车'], ['m:truck:racer,w,b,10', 'Snow Racer|Coureur des Neiges|Corredor de Nieve|Schneerenner|雪地赛车'],
    ['m:truck:racer,c,p,11', 'Sky Racer|Coureur du Ciel|Corredor del Cielo|Himmelsrenner|天空赛车'], ['m:truck:racer,#16A34A,w,12', 'Jungle Racer|Coureur de la Jungle|Corredor de la Selva|Dschungelrenner|丛林赛车'],
    ['m:truck:racer,#DC2626,#F5B800,13', 'Fire Fury|Furie de Feu|Furia de Fuego|Feuerwut|烈焰赛车'], ['m:truck:racer,#7C3AED,c,14', 'Thunder Racer|Coureur du Tonnerre|Corredor del Trueno|Donnerrenner|雷霆赛车'],
    ['m:truck:racer,#F5B800,r,1', 'Golden Champion|Champion Doré|Campeón Dorado|Goldener Champion|黄金冠军']
  ] }
]);
