// Every mergeable thing in the game. Two items of the same chain and level merge into the
// next level. Generators are items too: tap them (costs energy) to drop items of the chain
// they produce; merging two generators makes a stronger one.

export type ChainId =
  | 'tea' | 'bread' | 'garden' | 'tools' | 'textile' | 'pottery' | 'sweets'
  | 'genTea' | 'genBread' | 'genGarden' | 'genTools' | 'genTextile' | 'genPottery' | 'genSweets'
  | 'chest' | 'coins' | 'energy';

export interface ChainDef {
  id: ChainId;
  /** Display name of the whole chain (shown in the info bar). */
  name: string;
  levels: string[];
  /** For generators: the chain they drop items of. */
  produces?: ChainId;
  /** Player level at which this chain's generator starts appearing in rewards. */
  unlockLevel?: number;
  /** Tapping consumes the item and gives a reward instead of merging further (coins, energy). */
  collectible?: 'coins' | 'energy';
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
  genTea: { id: 'genTea', name: 'قوطی چای', levels: ['قوطی چای', 'قوطی چای حلبی', 'صندوقچه چای'], produces: 'tea', unlockLevel: 1 },
  genBread: { id: 'genBread', name: 'تنور', levels: ['تنور کوچک', 'تنور', 'تنور بزرگ'], produces: 'bread', unlockLevel: 1 },
  genGarden: { id: 'genGarden', name: 'باغچه', levels: ['باغچه کوچک', 'باغچه', 'باغچه گل'], produces: 'garden', unlockLevel: 2 },
  genTools: { id: 'genTools', name: 'جعبه ابزار', levels: ['جعبه ابزار', 'جعبه ابزار بزرگ', 'کارگاه'], produces: 'tools', unlockLevel: 3 },
  genTextile: { id: 'genTextile', name: 'دار قالی', levels: ['دوک نخ‌ریسی', 'دار قالی', 'دار قالی بزرگ'], produces: 'textile', unlockLevel: 4 },
  genPottery: { id: 'genPottery', name: 'کوره', levels: ['کوره کوچک', 'کوره', 'کوره سفالگری'], produces: 'pottery', unlockLevel: 5 },
  genSweets: { id: 'genSweets', name: 'قنادی', levels: ['قابلمه‌ی شیره', 'فر قنادی', 'قنادی'], produces: 'sweets', unlockLevel: 7 },
  chest: { id: 'chest', name: 'صندوقچه', levels: ['صندوقچه چوبی', 'صندوقچه مسی', 'صندوقچه طلایی'] },
  coins: { id: 'coins', name: 'سکه', levels: ['چند سکه', 'کیسه سکه', 'کوزه سکه'], collectible: 'coins' },
  energy: { id: 'energy', name: 'انرژی', levels: ['استکان انرژی', 'قوری انرژی', 'سماور انرژی'], collectible: 'energy' },
};

export const PRODUCT_CHAINS: ChainId[] = ['tea', 'bread', 'garden', 'tools', 'textile', 'pottery', 'sweets'];
export const GENERATOR_CHAINS: ChainId[] = ['genTea', 'genBread', 'genGarden', 'genTools', 'genTextile', 'genPottery', 'genSweets'];

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
