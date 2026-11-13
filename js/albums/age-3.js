/* IntelloKids sticker album for 3-year-olds: big, simple, bold pictures (see "Age albums" in js/stickers.js).
   Names: English|Français|Español|Deutsch|中文. Each collection has 15 stickers, won one after another. */
window.Stickers && Stickers.addAlbum(3, [
  { id: 'farm', t: 'Farm friends|Amis de la ferme|Amigos de la granja|Bauernhof-Freunde|农场朋友', icon: '🐮', frame: 'circle', bg: ['#EEFADF', '#8BD45E'], track: 'plays', items: [
    ['🐮', 'Cow|Vache|Vaca|Kuh|奶牛'], ['🐷', 'Pig|Cochon|Cerdito|Schwein|小猪'], ['🐔', 'Hen|Poule|Gallina|Huhn|母鸡'],
    ['🐤', 'Chick|Poussin|Pollito|Küken|小鸡'], ['🐑', 'Sheep|Mouton|Oveja|Schaf|绵羊'], ['🐴', 'Horse|Cheval|Caballo|Pferd|马'],
    ['🐐', 'Goat|Chèvre|Cabra|Ziege|山羊'], ['🦆', 'Duck|Canard|Pato|Ente|鸭子'], ['🐓', 'Rooster|Coq|Gallo|Hahn|公鸡'],
    ['🦃', 'Turkey|Dindon|Pavo|Truthahn|火鸡'], ['🐣', 'Hatching chick|Poussin qui éclot|Pollito saliendo del huevo|Schlüpfendes Küken|破壳小鸡'], ['🐝', 'Busy bee|Abeille|Abeja|Biene|小蜜蜂'],
    ['🦙', 'Llama|Lama|Llama|Lama|羊驼'], ['🐂', 'Ox|Bœuf|Buey|Ochse|公牛'], ['🐇', 'Rabbit|Lapin|Conejo|Kaninchen|兔子']
  ] },
  { id: 'fruit', t: 'Yummy fruit|Fruits miam|Frutas ricas|Leckeres Obst|好吃的水果', icon: '🍓', frame: 'flower', bg: ['#FFF0F3', '#FF8FAB'], track: 'answers', items: [
    ['🍎', 'Apple|Pomme|Manzana|Apfel|苹果'], ['🍌', 'Banana|Banane|Plátano|Banane|香蕉'], ['🍇', 'Grapes|Raisin|Uvas|Trauben|葡萄'],
    ['🍓', 'Strawberry|Fraise|Fresa|Erdbeere|草莓'], ['🍊', 'Orange|Orange|Naranja|Orange|橙子'], ['🍉', 'Watermelon|Pastèque|Sandía|Wassermelone|西瓜'],
    ['🍐', 'Pear|Poire|Pera|Birne|梨'], ['🍒', 'Cherries|Cerises|Cerezas|Kirschen|樱桃'], ['🍑', 'Peach|Pêche|Melocotón|Pfirsich|桃子'],
    ['🍍', 'Pineapple|Ananas|Piña|Ananas|菠萝'], ['🥝', 'Kiwi|Kiwi|Kiwi|Kiwi|猕猴桃'], ['🍋', 'Lemon|Citron|Limón|Zitrone|柠檬'],
    ['🥭', 'Mango|Mangue|Mango|Mango|芒果'], ['🍏', 'Green apple|Pomme verte|Manzana verde|Grüner Apfel|青苹果'], ['🥥', 'Coconut|Noix de coco|Coco|Kokosnuss|椰子']
  ] },
  { id: 'shapes', t: 'Shapes and colours|Formes et couleurs|Formas y colores|Formen und Farben|形状和颜色', icon: '🔷', frame: 'square', bg: ['#FFFFFF', '#D6ECF3'], track: 'stars', items: [
    ['m:shape:circle,red', 'Red circle|Cercle rouge|Círculo rojo|Roter Kreis|红色圆形'], ['m:shape:square,blue', 'Blue square|Carré bleu|Cuadrado azul|Blaues Quadrat|蓝色正方形'],
    ['m:shape:triangle,yellow', 'Yellow triangle|Triangle jaune|Triángulo amarillo|Gelbes Dreieck|黄色三角形'], ['m:shape:star,green', 'Green star|Étoile verte|Estrella verde|Grüner Stern|绿色星形'],
    ['m:shape:heart,pink', 'Pink heart|Cœur rose|Corazón rosa|Rosa Herz|粉色心形'], ['m:shape:diamond,orange', 'Orange diamond|Losange orange|Rombo naranja|Orange Raute|橙色菱形'],
    ['m:shape:oval,purple', 'Purple oval|Ovale violet|Óvalo morado|Lila Oval|紫色椭圆'], ['m:shape:rectangle,green', 'Green rectangle|Rectangle vert|Rectángulo verde|Grünes Rechteck|绿色长方形'],
    ['m:shape:circle,yellow', 'Yellow circle|Cercle jaune|Círculo amarillo|Gelber Kreis|黄色圆形'], ['m:shape:triangle,blue', 'Blue triangle|Triangle bleu|Triángulo azul|Blaues Dreieck|蓝色三角形'],
    ['m:shape:star,red', 'Red star|Étoile rouge|Estrella roja|Roter Stern|红色星形'], ['m:shape:heart,purple', 'Purple heart|Cœur violet|Corazón morado|Lila Herz|紫色心形'],
    ['m:shape:square,orange', 'Orange square|Carré orange|Cuadrado naranja|Oranges Quadrat|橙色正方形'], ['m:shape:diamond,pink', 'Pink diamond|Losange rose|Rombo rosa|Rosa Raute|粉色菱形'],
    ['m:shape:star,#F5B800', 'Golden star|Étoile dorée|Estrella dorada|Goldener Stern|金色星星']
  ] },
  { id: 'toys', t: 'My toys|Mes jouets|Mis juguetes|Meine Spielsachen|我的玩具', icon: '🧸', frame: 'cloud', bg: ['#EAF6FF', '#7CC4F2'], track: 'fills', items: [
    ['🧸', 'Teddy bear|Nounours|Osito de peluche|Teddybär|泰迪熊'], ['🎈', 'Balloon|Ballon de baudruche|Globo|Luftballon|气球'], ['🧩', 'Puzzle piece|Pièce de puzzle|Pieza de puzle|Puzzleteil|拼图块'],
    ['🎲', 'Dice|Dé|Dado|Würfel|骰子'], ['🥁', 'Drum|Tambour|Tambor|Trommel|小鼓'], ['🏐', 'Ball|Ballon|Pelota|Ball|皮球'],
    ['🧱', 'Bricks|Briques|Ladrillos|Bausteine|积木'], ['🎁', 'Present|Cadeau|Regalo|Geschenk|礼物'], ['🖍️', 'Crayon|Crayon de cire|Cera de colores|Wachsmalstift|蜡笔'],
    ['🎠', 'Carousel horse|Cheval de manège|Caballito de carrusel|Karussellpferd|旋转木马'], ['🛴', 'Scooter|Trottinette|Patinete|Roller|滑板车'], ['🪁', 'Kite|Cerf-volant|Cometa|Drachen|风筝'],
    ['🪀', 'Yo-yo|Yo-yo|Yoyó|Jo-Jo|悠悠球'], ['🎳', 'Skittles|Quilles|Bolos|Kegel|保龄球'], ['🤖', 'Toy robot|Robot jouet|Robot de juguete|Spielzeugroboter|玩具机器人']
  ] },
  { id: 'go', t: 'Things that go|Ça roule !|¡A rodar!|Fahrzeuge|会跑的车', icon: '🚗', frame: 'circle', bg: ['#FFF8DC', '#FFC93C'], track: 'chests', items: [
    ['🚗', 'Car|Voiture|Coche|Auto|小汽车'], ['🚌', 'Bus|Bus|Autobús|Bus|公交车'], ['🚂', 'Train|Train|Tren|Zug|火车'],
    ['✈️', 'Plane|Avion|Avión|Flugzeug|飞机'], ['🚁', 'Helicopter|Hélicoptère|Helicóptero|Hubschrauber|直升机'], ['⛵', 'Sailboat|Voilier|Velero|Segelboot|帆船'],
    ['🚀', 'Rocket|Fusée|Cohete|Rakete|火箭'], ['🚒', 'Fire engine|Camion de pompiers|Camión de bomberos|Feuerwehrauto|消防车'], ['🚑', 'Ambulance|Ambulance|Ambulancia|Krankenwagen|救护车'],
    ['🚓', 'Police car|Voiture de police|Coche de policía|Polizeiauto|警车'], ['🚜', 'Tractor|Tracteur|Tractor|Traktor|拖拉机'], ['🚲', 'Bike|Vélo|Bicicleta|Fahrrad|自行车'],
    ['🚕', 'Taxi|Taxi|Taxi|Taxi|出租车'], ['🚚', 'Lorry|Camion|Camión|Lastwagen|卡车'], ['🏎️', 'Race car|Voiture de course|Coche de carreras|Rennwagen|赛车']
  ] },
  { id: 'faces', t: 'Happy faces|Visages joyeux|Caritas felices|Fröhliche Gesichter|开心的脸', icon: '😀', frame: 'burst', bg: ['#FFFBE0', '#FFB84D'], track: 'three', items: [
    ['😀', 'Big smile|Grand sourire|Gran sonrisa|Breites Lächeln|大大的笑'], ['😊', 'Happy|Content|Feliz|Glücklich|开心'], ['😍', 'Love eyes|Yeux d’amour|Ojos de amor|Verliebte Augen|爱心眼'],
    ['🥳', 'Party face|Fête !|¡De fiesta!|Party!|派对脸'], ['😎', 'Cool|Trop cool|Genial|Cool|酷酷的'], ['🤗', 'Big hug|Câlin|Abrazo|Umarmung|大拥抱'],
    ['😴', 'Sleepy|Endormi|Dormilón|Schläfrig|困困的'], ['🤩', 'Star eyes|Yeux étoilés|Ojos de estrella|Sternenaugen|星星眼'], ['😋', 'Yummy|Miam|Rico|Lecker|好好吃'],
    ['😜', 'Silly|Rigolo|Bromista|Albern|调皮'], ['😇', 'Little angel|Petit ange|Angelito|Kleiner Engel|小天使'], ['🥰', 'Lovely|Plein d’amour|Cariñoso|Liebevoll|甜甜的'],
    ['😺', 'Happy cat|Chat content|Gato feliz|Fröhliche Katze|开心猫'], ['🙃', 'Upside down|À l’envers|Al revés|Kopfüber|倒过来'], ['🤠', 'Cowboy|Cow-boy|Vaquero|Cowboy|牛仔']
  ] },
  { id: 'pets', t: 'Pet pals|Mes animaux|Mis mascotas|Haustiere|宠物伙伴', icon: '🐶', frame: 'heart', bg: ['#FFEEF5', '#FF9CC2'], track: 'minutes', items: [
    ['🐶', 'Puppy|Chiot|Cachorro|Welpe|小狗'], ['🐱', 'Kitten|Chaton|Gatito|Kätzchen|小猫'], ['🐹', 'Hamster|Hamster|Hámster|Hamster|仓鼠'],
    ['🐰', 'Bunny|Lapinou|Conejito|Häschen|小兔子'], ['🐭', 'Mouse|Souris|Ratón|Maus|小老鼠'], ['🐢', 'Turtle|Tortue|Tortuga|Schildkröte|乌龟'],
    ['🐦', 'Bird|Oiseau|Pájaro|Vogel|小鸟'], ['🦜', 'Parrot|Perroquet|Loro|Papagei|鹦鹉'], ['🐩', 'Poodle|Caniche|Caniche|Pudel|贵宾犬'],
    ['🦎', 'Lizard|Lézard|Lagartija|Eidechse|蜥蜴'], ['🐾', 'Paw prints|Empreintes|Huellas|Pfotenabdrücke|小脚印'], ['🐸', 'Frog|Grenouille|Rana|Frosch|青蛙'],
    ['🐕', 'Dog|Chien|Perro|Hund|狗狗'], ['🐈', 'Cat|Chat|Gato|Katze|猫咪'], ['🐁', 'Tiny mouse|Petite souris|Ratoncito|Mäuschen|小小鼠']
  ] }
]);
