// Every mergeable thing in the game. Two items of the same chain and level merge into the
// next level. Generators are items too: tap them (costs energy) to drop items of the chain
// they produce; merging two generators makes a stronger one.

export type ChainId =
  | 'tea' | 'bread' | 'garden' | 'tools' | 'textile' | 'pottery' | 'sweets' | 'post' | 'baby' | 'lamp' | 'saz' | 'tile' | 'football' | 'sea' | 'craft' | 'callig' | 'party' | 'wed'
  | 'genTea' | 'genBread' | 'genGarden' | 'genTools' | 'genTextile' | 'genPottery' | 'genSweets' | 'genPost' | 'genBaby' | 'genLamp' | 'genSaz' | 'genTile' | 'genFootball' | 'genSea' | 'genCraft' | 'genCallig' | 'genParty' | 'genWed'
  | 'chest' | 'coins' | 'energy'
  | 'yalda' | 'genYalda' | 'nowruz' | 'genNowruz' | 'kite' | 'genKite' | 'lavashak' | 'genLavashak'
  | 'ash' | 'genAsh' | 'icecream' | 'genIcecream' | 'suri' | 'genSuri' | 'school' | 'genSchool';

export interface ChainDef {
  id: ChainId;
  /** Display name of the whole chain (shown in the info bar). */
  name: string;
  levels: string[];
  /** For generators: the chain they drop items of. */
  produces?: ChainId;
  /** Player level at which this chain's generator starts appearing in rewards. */
  unlockLevel?: number;
  /** Season generators: handed out when the story reaches this place (its season's first). */
  unlockPlace?: string;
  /** Tapping consumes the item and gives a reward instead of merging further (coins, energy). */
  collectible?: 'coins' | 'energy';
  /** Event chains and their generators exist only while their event runs. */
  event?: string;
}

export const CHAINS: Record<ChainId, ChainDef> = {
  tea: {
    id: 'tea',
    name: 'چای',
    levels: ['برگ چای', 'چای خشک', 'حبه قند', 'استکان کمرباریک', 'استکان چای', 'سینی چای', 'قوری گل‌سرخی', 'سماور مسی', 'سماور برنجی', 'سماور طلایی'],
  },
  bread: {
    id: 'bread',
    name: 'نان',
    levels: ['خوشه گندم', 'کیسه آرد', 'خمیر', 'نان لواش', 'نان بربری', 'نان سنگک', 'سبد نان', 'سفره نان و پنیر', 'سفره صبحانه'],
  },
  garden: {
    id: 'garden',
    name: 'گل و گلاب',
    levels: ['دانه', 'جوانه', 'نهال', 'گلدان شمعدانی', 'غنچه گل محمدی', 'گل محمدی', 'دسته گل', 'شیشه گلاب', 'گلاب‌پاش نقره'],
  },
  tools: {
    id: 'tools',
    name: 'ابزار',
    levels: ['میخ', 'پیچ‌گوشتی', 'آچار', 'چکش', 'اره', 'قلم‌مو', 'سطل رنگ', 'نردبان'],
  },
  textile: {
    id: 'textile',
    name: 'فرش و پارچه',
    levels: ['پشم', 'کلاف نخ', 'کلاف رنگی', 'دستمال', 'رومیزی ترمه', 'گلیم', 'قالیچه', 'فرش کاشان'],
  },
  pottery: {
    id: 'pottery',
    name: 'سفال و کاشی',
    levels: ['گل رس', 'خشت', 'کاسه سفالی', 'کوزه', 'کاشی فیروزه‌ای', 'کاشی گل‌دار', 'بشقاب مینا', 'گلدان مینا'],
  },
  sweets: {
    id: 'sweets',
    name: 'شیرینی',
    levels: ['شکر', 'نقل', 'نان برنجی', 'زولبیا بامیه', 'باقلوا', 'سوهان قم', 'شیرینی خامه‌ای', 'جعبه شیرینی', 'کیک عروسی'],
  },
  post: {
    id: 'post',
    name: 'نامه و پست',
    levels: ['مداد', 'کاغذ نامه', 'پاکت نامه', 'تمبر', 'نامه‌ی لاک‌ومهر', 'دسته‌ی نامه', 'بسته‌ی پستی', 'صندوق پست'],
  },
  baby: {
    id: 'baby',
    name: 'سیسمونی',
    levels: ['جغجغه', 'جوراب بچه', 'کلاه بافتنی', 'لباس بچه', 'عروسک نمدی', 'پتوی بچه', 'گهواره', 'کالسکه'],
  },
  lamp: {
    id: 'lamp',
    name: 'چراغ',
    levels: ['کبریت', 'شمع', 'پیه‌سوز', 'فانوس', 'چراغ گردسوز', 'چراغ توری', 'لاله‌ی شیشه‌ای', 'چلچراغ'],
  },
  saz: {
    id: 'saz',
    name: 'ساز',
    levels: ['سیم ساز', 'مضراب', 'دف', 'تنبک', 'کمانچه', 'سه‌تار', 'ساز عاشیقی', 'تار'],
  },
  tile: {
    id: 'tile',
    name: 'کاشی',
    levels: ['تکه‌ی کاشی', 'کاشی ساده', 'کاشی فیروزه‌ای', 'کاشی گل‌دار', 'کاشی هفت‌رنگ', 'ترنج کاشی', 'کاشی معرق', 'گنبد کاشی'],
  },
  football: {
    id: 'football',
    name: 'فوتبال',
    levels: ['سوت', 'توپ پلاستیکی', 'کتونی', 'دستکش دروازه‌بانی', 'پیراهن تیم', 'توپ چرمی', 'مدال', 'جام قهرمانی'],
  },
  sea: {
    id: 'sea',
    name: 'دریا',
    levels: ['صدف کوچک', 'ستاره‌ی دریایی', 'سطل و بیلچه', 'تیوپ', 'قلعه‌ی شنی', 'قایق بادبانی', 'فانوس دریایی', 'کشتی'],
  },
  craft: {
    id: 'craft',
    name: 'صنایع دستی',
    levels: ['قلم‌مو', 'رنگ‌دان', 'کاسه‌ی مینا', 'بشقاب قلم‌زنی', 'جعبه‌ی خاتم', 'قاب مینیاتور', 'قلمدان', 'طاووس میناکاری'],
  },
  callig: {
    id: 'callig',
    name: 'خوشنویسی',
    levels: ['قلم نی', 'دوات و لیقه', 'کاغذ آهارمهره', 'سیاه‌مشق', 'قطعه‌ی نستعلیق', 'تابلوی خوشنویسی', 'کتاب مذهّب', 'کتیبه‌ی طلایی'],
  },
  party: {
    id: 'party',
    name: 'جشن',
    levels: ['بادکنک', 'کلاه تولد', 'شمع تولد', 'کارت تبریک', 'جعبه‌ی کادو', 'دسته گل', 'سبد هدیه', 'کیک تولد'],
  },
  wed: {
    id: 'wed',
    name: 'عروسی',
    levels: ['نقل', 'کله‌قند', 'سینی حنا', 'جعبه‌ی حلقه', 'شمعدان', 'خونچای عروس', 'آینه و شمعدان', 'ماشین عروس'],
  },
  genTea: { id: 'genTea', name: 'قوطی چای', levels: ['قوطی چای', 'قوطی چای حلبی', 'صندوقچه چای'], produces: 'tea', unlockLevel: 1 },
  genBread: { id: 'genBread', name: 'تنور', levels: ['تنور کوچک', 'تنور', 'تنور بزرگ'], produces: 'bread', unlockLevel: 1 },
  genGarden: { id: 'genGarden', name: 'باغچه', levels: ['باغچه کوچک', 'باغچه', 'باغچه گل'], produces: 'garden', unlockLevel: 2 },
  genTools: { id: 'genTools', name: 'جعبه ابزار', levels: ['جعبه ابزار', 'جعبه ابزار بزرگ', 'کارگاه'], produces: 'tools', unlockLevel: 3 },
  genTextile: { id: 'genTextile', name: 'دار قالی', levels: ['دوک نخ‌ریسی', 'دار قالی', 'دار قالی بزرگ'], produces: 'textile', unlockLevel: 4 },
  genPottery: { id: 'genPottery', name: 'کوره', levels: ['کوره کوچک', 'کوره', 'کوره سفالگری'], produces: 'pottery', unlockLevel: 5 },
  genSweets: { id: 'genSweets', name: 'قنادی', levels: ['قابلمه‌ی شیره', 'فر قنادی', 'قنادی'], produces: 'sweets', unlockLevel: 7 },
  genPost: { id: 'genPost', name: 'میز تحریر', levels: ['میز تحریر کوچک', 'میز تحریر', 'میز تحریر چوبی'], produces: 'post', unlockPlace: 'postoffice' },
  genBaby: { id: 'genBaby', name: 'سبد کاموا', levels: ['سبد کاموای کوچک', 'سبد کاموا', 'صندوق بافتنی'], produces: 'baby', unlockPlace: 'grocery' },
  genLamp: { id: 'genLamp', name: 'سندان مسگری', levels: ['سندان کوچک', 'سندان مسگری', 'کارگاه مسگری'], produces: 'lamp', unlockPlace: 'gate' },
  genSaz: { id: 'genSaz', name: 'میز سازسازی', levels: ['میز سازسازی کوچک', 'میز سازسازی', 'کارگاه سازسازی'], produces: 'saz', unlockPlace: 'carpetshop' },
  genTile: { id: 'genTile', name: 'جعبه‌ی لعاب', levels: ['جعبه‌ی لعاب کوچک', 'جعبه‌ی لعاب', 'کارگاه کاشی‌گری'], produces: 'tile', unlockPlace: 'gardenhouse' },
  genFootball: { id: 'genFootball', name: 'ساک ورزشی', levels: ['ساک ورزشی کوچک', 'ساک ورزشی', 'کمد رختکن'], produces: 'football', unlockPlace: 'radio' },
  genSea: { id: 'genSea', name: 'زنبیل ساحلی', levels: ['زنبیل ساحلی کوچک', 'زنبیل ساحلی', 'صندوق ساحلی'], produces: 'sea', unlockPlace: 'station' },
  genCraft: { id: 'genCraft', name: 'سه‌پایه‌ی نقاشی', levels: ['سه‌پایه‌ی کوچک', 'سه‌پایه‌ی نقاشی', 'کارگاه مینیاتور'], produces: 'craft', unlockPlace: 'safavid' },
  genCallig: { id: 'genCallig', name: 'میز خوشنویسی', levels: ['جعبه‌ی قلم', 'میز خوشنویسی', 'کارگاه خوشنویسی'], produces: 'callig', unlockPlace: 'dossier' },
  genParty: { id: 'genParty', name: 'جعبه‌ی جشن', levels: ['جعبه‌ی جشن کوچک', 'جعبه‌ی جشن', 'صندوق جشن'], produces: 'party', unlockPlace: 'mahinhome' },
  genWed: { id: 'genWed', name: 'بقچه‌ی جهیزیه', levels: ['بقچه‌ی کوچک', 'بقچه‌ی ترمه', 'صندوقچه‌ی جهیزیه'], produces: 'wed', unlockPlace: 'nest' },
  chest: { id: 'chest', name: 'صندوقچه', levels: ['صندوقچه چوبی', 'صندوقچه مسی', 'صندوقچه طلایی'] },
  coins: { id: 'coins', name: 'سکه', levels: ['چند سکه', 'کیسه سکه', 'کوزه سکه'], collectible: 'coins' },
  energy: { id: 'energy', name: 'انرژی', levels: ['استکان انرژی', 'قوری انرژی', 'سماور انرژی'], collectible: 'energy' },
  yalda: { id: 'yalda', name: 'یلدا', levels: ['دونه‌ی انار', 'انار', 'کاسه‌ی انار دون‌شده', 'قاچ هندونه', 'سینی آجیل', 'دیوان حافظ'], event: 'yalda' },
  genYalda: { id: 'genYalda', name: 'سبد یلدا', levels: ['سبد یلدا'], produces: 'yalda', event: 'yalda' },
  nowruz: { id: 'nowruz', name: 'نوروز', levels: ['تخم‌مرغ رنگی', 'سیب سرخ', 'سبزه', 'ماهی قرمز', 'گل سنبل', 'سفره‌ی هفت‌سین'], event: 'nowruz' },
  genNowruz: { id: 'genNowruz', name: 'سبد نوروزی', levels: ['سبد نوروزی'], produces: 'nowruz', event: 'nowruz' },
  kite: { id: 'kite', name: 'بادبادک', levels: ['کاغذ رنگی', 'قرقره‌ی نخ', 'بادبادک کوچک', 'بادبادک دم‌دار', 'دو بادبادک', 'بادبادک طاووسی'], event: 'kite' },
  genKite: { id: 'genKite', name: 'جعبه‌ی کاردستی', levels: ['جعبه‌ی کاردستی'], produces: 'kite', event: 'kite' },
  lavashak: { id: 'lavashak', name: 'لواشک', levels: ['آلوچه', 'زردآلو', 'کاسه‌ی آلو', 'لواشک لوله‌ای', 'سینی لواشک', 'سبد سوغاتی'], event: 'lavashak' },
  genLavashak: { id: 'genLavashak', name: 'زنبیل میوه', levels: ['زنبیل میوه'], produces: 'lavashak', event: 'lavashak' },
  ash: { id: 'ash', name: 'آش رشته', levels: ['سبزی آش', 'رشته', 'کاسه‌ی کشک', 'پیازداغ و نعناداغ', 'کاسه‌ی آش رشته', 'دیگ آش'], event: 'ash' },
  genAsh: { id: 'genAsh', name: 'سبد سبزی', levels: ['سبد سبزی'], produces: 'ash', event: 'ash' },
  icecream: { id: 'icecream', name: 'بستنی سنتی', levels: ['شیشه‌ی شیر', 'زعفران', 'بستنی نونی', 'فالوده', 'بستنی سنتی', 'گاری بستنی'], event: 'icecream' },
  genIcecream: { id: 'genIcecream', name: 'بستنی‌ساز', levels: ['بستنی‌ساز دستی'], produces: 'icecream', event: 'icecream' },
  suri: { id: 'suri', name: 'چهارشنبه‌سوری', levels: ['بوته‌ی خار', 'قاشق و کاسه', 'آجیل مشکل‌گشا', 'فانوس', 'کوزه‌ی نو', 'آتیش چهارشنبه‌سوری'], event: 'suri' },
  genSuri: { id: 'genSuri', name: 'سبد چهارشنبه‌سوری', levels: ['سبد چهارشنبه‌سوری'], produces: 'suri', event: 'suri' },
  school: { id: 'school', name: 'بوی ماه مهر', levels: ['مداد', 'پاک‌کن و تراش', 'دفتر مشق', 'جامدادی', 'کتاب فارسی اول', 'کیف مدرسه‌ی نو'], event: 'school' },
  genSchool: { id: 'genSchool', name: 'جعبه‌ی لوازم‌التحریر', levels: ['جعبه‌ی لوازم‌التحریر'], produces: 'school', event: 'school' },
};

export const PRODUCT_CHAINS: ChainId[] = ['tea', 'bread', 'garden', 'tools', 'textile', 'pottery', 'sweets', 'post', 'baby', 'lamp', 'saz', 'tile', 'football', 'sea', 'craft', 'callig', 'party', 'wed'];
export const GENERATOR_CHAINS: ChainId[] = ['genTea', 'genBread', 'genGarden', 'genTools', 'genTextile', 'genPottery', 'genSweets', 'genPost', 'genBaby', 'genLamp', 'genSaz', 'genTile', 'genFootball', 'genSea', 'genCraft', 'genCallig', 'genParty', 'genWed'];

export interface Item {
  chain: ChainId;
  /** 1-based level within the chain. */
  level: number;
}

export const maxLevel = (chain: ChainId) => CHAINS[chain].levels.length;
export const itemName = (it: Item) => CHAINS[it.chain].levels[it.level - 1];
export const isGenerator = (it: Item) => CHAINS[it.chain].produces !== undefined;
export const sameItem = (a: Item, b: Item) => a.chain === b.chain && a.level === b.level;
export const canMerge = (a: Item, b: Item) => sameItem(a, b) && a.level < maxLevel(a.chain);
export const itemKey = (it: Item) => `${it.chain}:${it.level}`;

/** Value used to price orders and selling: doubles per level, generators are pricier. */
export function itemValue(it: Item): number {
  const base = isGenerator(it) ? 40 : CHAINS[it.chain].collectible ? 5 : 1;
  return base * 2 ** (it.level - 1);
}

/** Chance of each level when a generator of the given level is tapped. */
export function spawnWeights(genLevel: number): number[] {
  switch (genLevel) {
    case 1: return [0.86, 0.14];
    case 2: return [0.66, 0.28, 0.06];
    default: return [0.5, 0.34, 0.16];
  }
}

/** Collectible payouts (coins / energy items). */
export function collectAmount(it: Item): number {
  return it.chain === 'coins' ? [5, 15, 40][it.level - 1] : [5, 15, 40][it.level - 1];
}
