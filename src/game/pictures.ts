import baked from '../data/pictures.json';
import { COLOR_INDEX, PALETTE, colorDistance } from './palette';

/** A picture is a grid of palette indices, -1 for an empty cell. */
export interface Picture { id: string; title: string; w: number; h: number; cells: number[] }

/** Hand-drawn Persian pictures (16×16), used for the very first levels and special ones. */
const HAND: Record<string, string[]> = {
  pomegranate: [
    '................',
    '.......gg.......',
    '......gnng......',
    '.....nrnnrn.....',
    '.....rrrrrr.....',
    '...rrrrrrrrrr...',
    '..rrrrrrrrkkrr..',
    '.rrrrrrrrrrkkrr.',
    '.rrrrrrrrrrrkrr.',
    '.rrrrrrrrrrrrrr.',
    '.rrrrrrrrrrrrrr.',
    '.nrrrrrrrrrrrrr.',
    '..nrrrrrrrrrrr..',
    '...nnrrrrrrrr...',
    '.....nnnnnn.....',
    '................',
  ],
  tea_glass: [
    '................',
    '.....w...w......',
    '......w...w.....',
    '....w...w.......',
    '..ssssssssssss..',
    '..swrrrrrrrrrs..',
    '..swrrrrrrrrrs..',
    '...swrrrrrrrs...',
    '....srrrrrrs....',
    '.....srrrrs.....',
    '....swrrrrrs....',
    '...swrrrrrrrs...',
    '...srrrrrrrrs...',
    '....ssssssss....',
    '.yyyyyyyyyyyyyy.',
    '..yyyyyyyyyyyy..',
  ],
  watermelon_yalda: [
    '................',
    '................',
    '................',
    '................',
    'rrrrrrrrrrrrrrrr',
    'rrxrrrrrxrrrrxrr',
    '.rrrrxrrrrrxrrr.',
    '.rrrrrrrrrrrrrr.',
    '..rrxrrrrxrrrr..',
    '..wrrrrrrrrrrw..',
    '...wwrrrrrrww...',
    '...gwwwwwwwwg...',
    '....ggwwwwgg....',
    '.....dggggd.....',
    '......dddd......',
    '................',
  ],
  goldfish: [
    '................',
    '....cccccccc....',
    '...cccccccccc...',
    '..cccccccccccc..',
    '.ccccccccccccoc.',
    '.cccooooccccooc.',
    '.ccoooooocccooc.',
    '.cooowoooooooc..',
    '.cooxooooocooc..',
    '.ccoooooocccooc.',
    '.cccooooccccooc.',
    '.cccccccccccccc.',
    '..cgccgcccgccc..',
    '...dgggdggdgg...',
    '....nnnnnnnn....',
    '................',
  ],
  pishi: [
    '................',
    '.oo..........oo.',
    '.ooo........ooo.',
    '.okoo......ookoo',
    '.okkoooooooookko',
    '.oooooooooooooo.',
    '.oooooooooooooo.',
    '.oowwoooooowwoo.',
    'ooowxoooooowxooo',
    '.oowwoooooowwoo.',
    'woooooookooooooo',
    '.wooooowwwoooow.',
    'woooooxwwxooooow',
    '.ooooowwwwooooo.',
    '..oooooooooooo..',
    '....oooooooo....',
  ],
  tulip_laleh: [
    '................',
    '.....r..r..r....',
    '.....rr.rr.rr...',
    '.....rrrrrrrr...',
    '.....rrrkrrrr...',
    '.....rrkrrrrr...',
    '.....rrrrrrrr...',
    '......rrrrrr....',
    '.......rrrr.....',
    '........g.......',
    '...gg...g...gg..',
    '....ggg.g.ggg...',
    '.....gggggggg...',
    '.......ggg......',
    '........g.......',
    '........g.......',
  ],
  sabzeh: [
    '................',
    '...g...g..g..g..',
    '..gg.g.gg.g.gg..',
    '..gggg.gggggg.g.',
    '.ggdggggdgggggg.',
    '.gggggdggggdggg.',
    '.ggdggggggggdgg.',
    '..ggggdgggdggg..',
    '..rrrrrrrrrrrr..',
    '.kkkkkkkkkkkkkk.',
    '..cccccccccccc..',
    '..cyyccyycyycc..',
    '...cccccccccc...',
    '....cccccccc....',
    '.....cccccc.....',
    '................',
  ],
  azadi: [
    '.......ww.......',
    '......wccw......',
    '.....wccccw.....',
    '.....wwwwww.....',
    '....wccccccw....',
    '....wwwwwwww....',
    '...wwcwwwwcww...',
    '...wwwwwwwwww...',
    '..wwwwwccwwwww..',
    '..wwwwcccwwwww..',
    '.wwwwccccccwwww.',
    '.wwwccccccccwww.',
    'wwwcccc..cccwwww',
    'wwccc......cccww',
    'wwcc........ccww',
    'ssssssssssssssss',
  ],
};

const HAND_TITLES: Record<string, string> = {
  pomegranate: 'انار شب یلدا',
  tea_glass: 'استکان چای',
  watermelon_yalda: 'هندوانه یلدایی',
  goldfish: 'ماهی قرمز',
  pishi: 'پیشی',
  tulip_laleh: 'لاله',
  sabzeh: 'سبزه نوروز',
  azadi: 'برج آزادی',
};

const TITLES: Record<string, string> = {
  heart: 'قلب', orange_heart: 'قلب نارنجی', yellow_heart: 'قلب زرد', green_heart: 'قلب سبز', blue_heart: 'قلب آبی', purple_heart: 'قلب بنفش',
  apple: 'سیب', cherries: 'گیلاس', strawberry: 'توت‌فرنگی', watermelon: 'هندوانه', tangerine: 'نارنگی', lemon: 'لیمو', banana: 'موز',
  grapes: 'انگور', peach: 'هلو', pear: 'گلابی', green_apple: 'سیب سبز', pineapple: 'آناناس', kiwi: 'کیوی', tomato: 'گوجه', carrot: 'هویج',
  corn: 'ذرت', mushroom: 'قارچ', avocado: 'آووکادو', eggplant: 'بادمجان', pepper: 'فلفل', burger: 'همبرگر', pizza: 'پیتزا', fries: 'سیب‌زمینی',
  donut: 'دونات', cookie: 'کلوچه', cake: 'کیک تولد', shortcake: 'کیک', cupcake: 'کاپ‌کیک', icecream: 'بستنی', lollipop: 'آبنبات چوبی',
  candy: 'آبنبات', tea: 'فنجان چای', honey: 'عسل', cheese: 'پنیر', egg: 'نیمرو', cat: 'گربه', dog: 'سگ', panda: 'پاندا', frog: 'قورباغه',
  pig: 'خوک', monkey: 'میمون', lion: 'شیر', tiger: 'ببر', bear: 'خرس', koala: 'کوالا', rabbit: 'خرگوش', fox: 'روباه', chicken: 'مرغ',
  penguin: 'پنگوئن', chick: 'جوجه', owl: 'جغد', turtle: 'لاک‌پشت', octopus: 'هشت‌پا', tropical_fish: 'ماهی رنگی', fish: 'ماهی', whale: 'نهنگ',
  dolphin: 'دلفین', butterfly: 'پروانه', ladybug: 'کفشدوزک', bee: 'زنبور', snail: 'حلزون', unicorn: 'تک‌شاخ', dragon: 'اژدها', crab: 'خرچنگ',
  parrot: 'طوطی', flamingo: 'فلامینگو', hedgehog: 'جوجه‌تیغی', cow: 'گاو', mouse: 'موش', hamster: 'همستر', tulip: 'لاله', rose: 'گل رز',
  sunflower: 'آفتابگردان', blossom: 'شکوفه', hibiscus: 'گل ختمی', cactus: 'کاکتوس', palm: 'نخل', clover: 'شبدر', maple: 'برگ پاییزی',
  tree: 'درخت', rainbow: 'رنگین‌کمان', sun: 'خورشید', moon: 'ماه', star: 'ستاره', cloud: 'ابر و خورشید', zap: 'رعد', snowflake: 'دونه برف',
  fire: 'آتش', drop: 'قطره', snowman: 'آدم‌برفی', xmas_tree: 'درخت کاج', football: 'توپ فوتبال', basketball: 'توپ بسکتبال', tennis: 'توپ تنیس',
  trophy: 'جام قهرمانی', medal: 'مدال طلا', gamepad: 'دسته بازی', dice: 'تاس', target: 'هدف', guitar: 'گیتار', gift: 'کادو', balloon: 'بادکنک',
  ribbon: 'پاپیون', crown: 'تاج', gem: 'الماس', ring: 'انگشتر', key: 'کلید', lock: 'قفل', bulb: 'لامپ', phone: 'موبایل', clock: 'ساعت زنگ‌دار',
  car: 'ماشین', bus: 'اتوبوس', rocket: 'موشک', plane: 'هواپیما', boat: 'قایق', bike: 'دوچرخه', house: 'خانه', tent: 'چادر', ghost: 'روح',
  alien: 'آدم فضایی', robot: 'ربات', pumpkin: 'کدو', smile: 'لبخند', cool: 'باحال', love_eyes: 'عاشق', joy: 'خنده', wink: 'چشمک', angry: 'عصبانی',
  clown: 'دلقک', poop: 'پی‌پی', art: 'پالت رنگ', books: 'کتاب‌ها', pencil: 'مداد', umbrella: 'چتر', anchor: 'لنگر', magnet: 'آهنربا',
  bomb: 'بمب', hourglass: 'ساعت شنی', lamp: 'چراغ', kite: 'بادبادک', teddy: 'عروسک خرسی', crystal_ball: 'گوی جادویی', sheep: 'گوسفند',
  camel: 'شتر', elephant: 'فیل', giraffe: 'زرافه', zebra: 'گورخر', peacock: 'طاووس', swan: 'قو', shell: 'صدف', mango: 'انبه', coconut: 'نارگیل',
  bread: 'نان', croissant: 'کروسان', popcorn: 'پاپ‌کورن', cocktail: 'آبمیوه', bubble_tea: 'بابل تی', sushi: 'سوشی', watch: 'ساعت مچی',
  camera: 'دوربین', tv: 'تلویزیون', headphones: 'هدفون', soccer_shoe: 'کتونی', hat: 'کلاه', glasses: 'عینک', dress: 'لباس', lipstick: 'رژ لب',
  sparkles: 'درخشش', mosque: 'گنبد', fountain: 'فواره', carousel: 'چرخ‌وفلک اسبی', ferris: 'چرخ‌وفلک',
};

function parseRows(rows: string[]): { w: number; h: number; cells: number[] } {
  const h = rows.length;
  const w = Math.max(...rows.map((r) => r.length));
  const cells: number[] = [];
  for (const r of rows) for (let x = 0; x < w; x++) {
    const ch = r[x] ?? '.';
    cells.push(ch === '.' ? -1 : COLOR_INDEX[ch]);
  }
  return { w, h, cells };
}

export const HAND_IDS = Object.keys(HAND);
export const BAKED_IDS = Object.keys(baked);

export function pictureTitle(id: string): string {
  return HAND_TITLES[id] ?? TITLES[id] ?? id;
}

/** Load a picture at (about) the given size; hand-drawn ones are scaled up by nearest neighbour. */
export function loadPicture(id: string, size: number): Picture {
  if (HAND[id]) {
    const src = parseRows(HAND[id]);
    if (size === src.w) return { id, title: pictureTitle(id), ...src };
    const cells: number[] = [];
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      cells.push(src.cells[Math.floor((y * src.h) / size) * src.w + Math.floor((x * src.w) / size)]);
    }
    return { id, title: pictureTitle(id), w: size, h: size, cells };
  }
  const sizes = (baked as Record<string, Record<string, string>>)[id];
  const avail = Object.keys(sizes).map(Number).sort((a, b) => a - b);
  const pick = avail.find((s) => s >= size) ?? avail[avail.length - 1];
  return { id, title: pictureTitle(id), ...parseRows(sizes[pick].split('/')) };
}

/**
 * Reduce a picture to at most `maxColors` colours: first fix lone noisy cells, then fold the
 * rarest colours into their nearest surviving colour. Fewer colours = easier level.
 */
export function simplify(pic: Picture, maxColors: number): Picture {
  const { w, h } = pic;
  let cells = pic.cells.slice();
  // Lone cells whose neighbours all share another colour become that colour.
  const next = cells.slice();
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const c = cells[y * w + x];
    if (c < 0) continue;
    const nb: number[] = [];
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < w && ny < h && cells[ny * w + nx] >= 0) nb.push(cells[ny * w + nx]);
    }
    if (nb.length >= 3 && !nb.includes(c)) {
      const counts = new Map<number, number>();
      for (const n of nb) counts.set(n, (counts.get(n) ?? 0) + 1);
      const [best, n] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
      if (n >= 2) next[y * w + x] = best;
    }
  }
  cells = next;
  const minCount = Math.max(4, Math.round((w * h) / 60));
  for (;;) {
    const counts = new Map<number, number>();
    for (const c of cells) if (c >= 0) counts.set(c, (counts.get(c) ?? 0) + 1);
    if (counts.size <= 1) break;
    const sorted = [...counts.entries()].sort((a, b) => a[1] - b[1]);
    const [rare, n] = sorted[0];
    if (counts.size <= maxColors && n >= minCount) break;
    let target = -1, bd = Infinity;
    for (const [c] of counts) if (c !== rare) {
      const d = colorDistance(rare, c);
      if (d < bd) { bd = d; target = c; }
    }
    cells = cells.map((c) => (c === rare ? target : c));
  }
  return { ...pic, cells };
}

export function colorsOf(pic: Picture): number[] {
  return [...new Set(pic.cells.filter((c) => c >= 0))];
}

export { PALETTE };
