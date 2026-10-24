import type { Mood } from '../art/portraits';

// The neighbourhood serial: places in the alley, the restoration tasks bought with stars,
// and the dialogue that plays after each one. Text is colloquial Tehrani Persian on purpose.

export interface Character {
  id: string;
  name: string;
  /** Short role shown under the name in dialogue. */
  role: string;
}

export const CAST: Record<string, Character> = {
  narges: { id: 'narges', name: 'نرگس', role: 'نوه‌ی حاج‌بابا' },
  mahin: { id: 'mahin', name: 'خاله مهین', role: 'خبرگزاری محله' },
  reza: { id: 'reza', name: 'اوستا رضا', role: 'نونوای سنگکی' },
  shirin: { id: 'shirin', name: 'شیرین', role: 'آرایشگر، رفیق بچگی نرگس' },
  kaveh: { id: 'kaveh', name: 'کاوه', role: 'معمار مرمت' },
  morteza: { id: 'morteza', name: 'آقا مرتضی', role: 'بقال سر کوچه' },
  golab: { id: 'golab', name: 'ننه‌گلاب', role: 'قدیمی‌ترین همسایه' },
  farokhi: { id: 'farokhi', name: 'آقای فرخی', role: 'سازنده‌ی پاساژ' },
  fakhri: { id: 'fakhri', name: 'فخری‌خانم', role: 'مادر کاوه' },
  bahman: { id: 'bahman', name: 'عمو بهمن', role: 'برادر حاج‌بابا، از هامبورگ' },
  aydin: { id: 'aydin', name: 'آیدین', role: 'فرش‌فروش تبریزی' },
};

/** Short thank-you lines shown when an order is delivered (one picked at random). */
export const THANKS: Record<string, string[]> = {
  narges: ['عالی شد! مرسی!', 'حاج‌بابا بود حتماً کیف می‌کرد.', 'یه قدم دیگه به نجات کوچه!'],
  mahin: ['دستت طلا! حالا برم به همه بگم.', 'وای چه خوشگل! عکس بگیرم؟', 'خبر داری؟ نه؟ بعداً می‌گم!'],
  reza: ['دمت گرم! نون امروزت مهمون من.', 'خدا قوت بچه‌جون!', 'این شد کار!'],
  shirin: ['عاشقتم! ✨', 'اینو باید استوری کنم!', 'قربون دستت!'],
  kaveh: ['دقیقاً همونی که لازم بود.', 'ممنون… واقعاً ممنون.', 'کارت درسته!'],
  morteza: ['مرسی… حساب‌مون که صافه دیگه؟', 'مفت که نیست… نه؟ آهان، هدیه‌ست!', 'خیر ببینی!'],
  golab: ['خیر از جوونیت ببینی مادر.', 'الهی قربونت برم.', 'مادرجونت بهت افتخار می‌کنه.'],
  fakhri: ['…بد نیست. یعنی خوبه.', 'قبول.', 'سلیقه داری.'],
  farokhi: ['حرفه‌ای بود.', 'جالبه… خیلی جالبه.', 'باید قبول کنم، کارت خوبه.'],
  bahman: ['دستت درد نکنه بابا جان.', 'چهل سال دلم برای این بو تنگ شده بود.', 'آفرین! داداش بود کیف می‌کرد.'],
  aydin: ['ساغ اول! یعنی دستت درد نکنه.', 'به این می‌گن کار تمیز، مثل گره‌ی فرش تبریز!', 'شیرین می‌گفت تو بهترینی. راست می‌گفت.'],
};

export interface Line {
  who: string;
  text: string;
  /** Face to show; guessed from the text when omitted (art/portraits.ts moodOf). */
  mood?: Mood;
}

export interface Task {
  id: string;
  title: string;
  cost: number;
  /** Scene layer that switches to its restored look when done. */
  layer: string;
  after: Line[];
}

export interface Place {
  id: string;
  name: string;
  /** Plays the first time the place opens. */
  intro: Line[];
  tasks: Task[];
  /** Plays when the last task is done (episode cliffhanger). */
  outro: Line[];
}

export const PLACES: Place[] = [
  {
    id: 'teahouse',
    name: 'قهوه‌خانه‌ی حاج‌بابا',
    intro: [
      { who: 'narges', text: 'بعد از ده سال… کوچه‌مون هنوز بوی نون سنگک می‌ده.' },
      { who: 'mahin', text: 'وای خدا مرگم بده! نرگس؟ خودتی؟ چقدر خانم شدی ماشالله!' },
      { who: 'narges', text: 'سلام خاله مهین! دلم براتون یه ذره شده بود.' },
      { who: 'mahin', text: 'خبر داری دیگه؟ این فرخیه می‌خواد کل کوچه رو بخره، جاش پاساژ بزنه!' },
      { who: 'narges', text: 'پاساژ؟! قهوه‌خانه‌ی حاج‌بابا هم؟' },
      { who: 'mahin', text: 'اول از همه همونو. می‌گه «مخروبه‌ست، به درد نمی‌خوره». تا آخر ماه مهلت داده.' },
      { who: 'narges', text: 'نمی‌ذارم. قهوه‌خانه رو دوباره راه می‌ندازم. شما هم کمکم می‌کنید؟' },
      { who: 'mahin', text: 'من؟ معلومه! فقط اول یه چای بده دستم، گلوم خشک شد از بس حرف زدم.' },
    ],
    tasks: [
      {
        id: 'teahouse.dust', title: 'گردگیری و جارو', cost: 1, layer: 'dust',
        after: [
          { who: 'mahin', text: 'این همه خاک؟ اگه حاج‌بابا می‌دید، سکته می‌کرد خدابیامرز.' },
          { who: 'narges', text: 'هنوز عکسش رو دیوار هست… با همون سبیلای چخماقی.' },
        ],
      },
      {
        id: 'teahouse.door', title: 'تعمیر در چوبی', cost: 1, layer: 'door',
        after: [
          { who: 'kaveh', text: 'ببخشید، این در گره‌چینیه؟ کار دست قدیمه، حیفه عوضش کنید.' },
          { who: 'narges', text: 'شما…؟' },
          { who: 'kaveh', text: 'کاوه‌ام، معمار مرمت. طبقه بالای بقالی آقا مرتضی می‌شینم.' },
          { who: 'mahin', text: '(یواشکی) مجرده‌ها! گفته باشم.' },
        ],
      },
      {
        id: 'teahouse.samovar', title: 'روشن کردن سماور بزرگ', cost: 2, layer: 'samovar',
        after: [
          { who: 'reza', text: 'بوی چای قهوه‌خونه! به جان خودم ده سال بود این بو تو کوچه نپیچیده بود.' },
          { who: 'narges', text: 'اوستا رضا! چای اول مال شماست.' },
          { who: 'reza', text: 'با یه سنگک داغ؟ قبوله. فردا صبح اول وقت بیا نونوایی.' },
        ],
      },
      {
        id: 'teahouse.takht', title: 'چیدن تخت‌ها و پشتی‌ها', cost: 2, layer: 'takht',
        after: [
          { who: 'morteza', text: 'این پشتی‌ها رو از کجا آوردی؟ مفت که نبوده… نه؟' },
          { who: 'narges', text: 'از انباری حاج‌بابا، آقا مرتضی. مفت مفت.' },
          { who: 'morteza', text: 'آهان. پس یه چای مفت هم بده، که حساب‌مون صاف بشه.' },
        ],
      },
      {
        id: 'teahouse.sign', title: 'آویختن تابلوی قدیمی', cost: 3, layer: 'sign',
        after: [
          { who: 'golab', text: 'این تابلو رو حاج‌بابا خودش با دستای خودش نوشت. سال پنجاه و دو.' },
          { who: 'narges', text: 'ننه‌گلاب! شما یادتونه؟' },
          { who: 'golab', text: 'من همه‌چی یادمه مادر. حتی چیزایی که بقیه دوست دارن یادم بره.' },
        ],
      },
      {
        id: 'teahouse.open', title: 'افتتاح دوباره‌ی قهوه‌خانه', cost: 3, layer: 'lights',
        after: [
          { who: 'mahin', text: 'کل محله اومدن! حتی اون پسره‌ی کاوه، که فقط واسه تو اومده.' },
          { who: 'kaveh', text: 'من… واسه معماری اومدم خاله.' },
          { who: 'mahin', text: 'آره جون عمه‌ت.' },
        ],
      },
    ],
    outro: [
      { who: 'farokhi', text: 'تبریک می‌گم خانم. قشنگ شده. ولی یه قهوه‌خونه کوچه رو نجات نمی‌ده.' },
      { who: 'narges', text: 'آقای فرخی، این کوچه فروشی نیست.' },
      { who: 'farokhi', text: 'همه‌چی فروشیه. از اوستا رضا بپرسید… قرارداد نونوایی رو دیروز امضا کرد.' },
      { who: 'narges', text: 'چی؟!' },
    ],
  },
  {
    id: 'bakery',
    name: 'نانوایی سنگکی اوستا رضا',
    intro: [
      { who: 'narges', text: 'اوستا رضا، راسته؟ نونوایی رو فروختید؟' },
      { who: 'reza', text: 'تنورم ترک برداشته، دخترم. خرج تعمیرش از کل درآمد یه سالم بیشتره.' },
      { who: 'reza', text: 'فرخی بیعانه داده. اگه تا آخر ماه پس ندم، نونوایی مال اونه.' },
      { who: 'narges', text: 'پس تا آخر ماه تنور رو درست می‌کنیم و بیعانه رو پس می‌دیم. با هم.' },
      { who: 'reza', text: 'خدا از دهنت بشنوه. خمیرش با من، بقیه‌ش با تو.' },
    ],
    tasks: [
      {
        id: 'bakery.flour', title: 'جابه‌جایی کیسه‌های آرد', cost: 5, layer: 'flour',
        after: [
          { who: 'shirin', text: 'نرگـــس! برگشتی و به من نگفتی؟ قهرم باهات.' },
          { who: 'narges', text: 'شیرین! تو رو خدا قهر نکن، کمک لازم دارم.' },
          { who: 'shirin', text: 'باشه، آشتی. ولی موهات رو باید بیای آرایشگاه درست کنم. وضعیت قرمزه.' },
        ],
      },
      {
        id: 'bakery.pebbles', title: 'شستن ریگ‌های تنور', cost: 6, layer: 'pebbles',
        after: [
          { who: 'reza', text: 'سنگک بی‌ریگ داغ، مثل چای بی‌قنده. می‌شه خوردش، ولی دل آدم نمی‌خواد.' },
        ],
      },
      {
        id: 'bakery.oven', title: 'مرمت تنور', cost: 7, layer: 'oven',
        after: [
          { who: 'kaveh', text: 'این ترک رو با گِل و کاه سنتی پر کردیم. صد سال دیگه هم دووم میاره.' },
          { who: 'reza', text: 'پسر، دستت درد نکنه. پولشو چطور بدم؟' },
          { who: 'kaveh', text: 'هر روز یه سنگک کنجدی. تا آخر عمر.' },
        ],
      },
      {
        id: 'bakery.counter', title: 'پیشخوان نو', cost: 8, layer: 'counter',
        after: [
          { who: 'mahin', text: 'خبر داغ! زن فرخی دیروز اومده بود سنگک بخره. با یه ماشین به این گندگی!' },
          { who: 'narges', text: 'خاله، شما این خبرا رو از کجا میارید؟' },
          { who: 'mahin', text: 'من آنتنم مادر. آنتن.' },
        ],
      },
      {
        id: 'bakery.queue', title: 'سایه‌بان صف نون', cost: 9, layer: 'awning',
        after: [
          { who: 'morteza', text: 'صف از نونوایی تا بقالی من رسیده. مشتریای منم زیاد شدن… خدا خیرت بده.' },
        ],
      },
      {
        id: 'bakery.first', title: 'اولین تنور داغ', cost: 10, layer: 'fire',
        after: [
          { who: 'reza', text: 'بیعانه‌ی فرخی رو پس دادم. نونوایی مال خودمه. مال محله‌ست.' },
          { who: 'narges', text: 'این اولین سنگک، مال حاج‌بابا. خدا رحمتش کنه.' },
        ],
      },
    ],
    outro: [
      { who: 'golab', text: 'نرگس جان… حاج‌بابا یه امانتی پیش من گذاشته بود. گفت فقط به تو بدم.' },
      { who: 'narges', text: 'امانتی؟ چی هست ننه‌گلاب؟' },
      { who: 'golab', text: 'یه کلید. و یه نامه، که روش نوشته «برای وقتی که فرخی برگرده».' },
      { who: 'narges', text: 'برگرده؟ مگه فرخی قبلاً هم این‌جا بوده؟' },
    ],
  },
  {
    id: 'garden',
    name: 'حیاط و گلخانه‌ی ننه‌گلاب',
    intro: [
      { who: 'golab', text: 'این حیاط یه روزی پر گل محمدی بود. گلابش رو خودم می‌گرفتم، مثل کاشون.' },
      { who: 'narges', text: 'کلید مال کجاست ننه‌گلاب؟' },
      { who: 'golab', text: 'اول حیاطم رو زنده کن. پیرزن‌ها حرفشونو لای گل‌ها می‌زنن مادر.' },
    ],
    tasks: [
      { id: 'garden.weeds', title: 'کندن علف‌های هرز', cost: 10, layer: 'weeds', after: [{ who: 'shirin', text: 'ناخنام! ناخنای کاشته‌م! نرگس اینا رو جبران می‌کنی.' }] },
      { id: 'garden.pool', title: 'پر کردن حوض', cost: 12, layer: 'pool', after: [{ who: 'kaveh', text: 'حوض فیروزه‌ای، حیاط آجری… این خونه یه گنجه. فرخی هم اینو می‌دونه.' }] },
      { id: 'garden.roses', title: 'کاشتن گل محمدی', cost: 14, layer: 'roses', after: [{ who: 'golab', text: 'بوشو! بوی جوونی منه.' }] },
      { id: 'garden.bench', title: 'تخت چوبی کنار حوض', cost: 16, layer: 'bench', after: [{ who: 'mahin', text: 'نرگس و کاوه دیشب تا ساعت یازده رو این تخت نشسته بودن. فقط می‌گم.' }, { who: 'narges', text: 'خاله!! داشتیم نقشه می‌کشیدیم!' }, { who: 'mahin', text: 'منم همینو گفتم. نقشه.' }] },
      { id: 'garden.distill', title: 'دیگ گلاب‌گیری', cost: 18, layer: 'distill', after: [{ who: 'golab', text: 'اولین شیشه گلاب مال توئه. حالا وقتشه نامه رو بخونی.' }] },
    ],
    outro: [
      { who: 'narges', text: '«نرگس جان، فرخی پسر شریک قدیمی منه. پدرش این کوچه رو یه بار از من گرفت…»' },
      { who: 'narges', text: '«…سند اصلی تو حمام قدیمی کوچه‌ست. کلید همینه. مواظب باش.»' },
      { who: 'kaveh', text: 'حمام؟ اون حمام چهل ساله بسته‌ست.' },
      { who: 'narges', text: 'پس وقتشه بازش کنیم.' },
    ],
  },
  {
    id: 'salon',
    name: 'آرایشگاه شیرین',
    intro: [
      { who: 'shirin', text: 'قبل از حمام، یه کار مهم‌تر داریم.' },
      { who: 'narges', text: 'چی مهم‌تر از سند کوچه؟' },
      { who: 'shirin', text: 'آرایشگاه من! فرخی اجاره رو دو برابر کرده. اگه مشتری نیاد، تا عید تعطیلم.' },
    ],
    tasks: [
      { id: 'salon.mirror', title: 'آینه‌کاری تازه', cost: 18, layer: 'mirror', after: [{ who: 'shirin', text: 'وای! خودمو تو آینه نشناختم. از بس خوشگل شدم.' }] },
      { id: 'salon.chairs', title: 'صندلی‌های نو', cost: 22, layer: 'chairs', after: [{ who: 'mahin', text: 'من مشتری اولم. رنگ شرابی. مثل جوونیام.' }] },
      { id: 'salon.curtain', title: 'پرده‌ی ترمه', cost: 26, layer: 'curtain', after: [{ who: 'shirin', text: 'نرگس… بین تو و کاوه چه خبره؟ راستشو بگو.' }, { who: 'narges', text: 'هیچی! …فعلاً.' }] },
      { id: 'salon.sign', title: 'تابلوی نئونی', cost: 30, layer: 'neon', after: [{ who: 'morteza', text: 'برق این تابلو رو از کجا می‌گیری؟ از کنتور من نباشه!' }] },
      { id: 'salon.party', title: 'جشن بازگشایی', cost: 34, layer: 'party', after: [{ who: 'shirin', text: 'ده تا نوبت برای فردا! نرگس، نجاتم دادی.' }] },
    ],
    outro: [
      { who: 'mahin', text: 'بچه‌ها! فرخی با دو تا مأمور شهرداری اومده سر کوچه!' },
      { who: 'farokhi', text: 'حکم تخریب حمام قدیمی. فردا صبح لودر میاد.' },
      { who: 'narges', text: 'تا فردا صبح وقت داریم.' },
    ],
  },
  {
    id: 'hammam',
    name: 'حمام قدیمی کوچه',
    intro: [
      { who: 'kaveh', text: 'سقفش سالمه، کاشی‌هاش قاجاریه. اگه ثبت میراثی بشه، هیچ لودری جرئت نمی‌کنه.' },
      { who: 'narges', text: 'پس امشب کل محله کار می‌کنیم.' },
      { who: 'reza', text: 'نون و چایش با من و نرگس. بازوش با بچه‌های محل.' },
    ],
    tasks: [
      { id: 'hammam.door', title: 'باز کردن در قفل‌شده', cost: 30, layer: 'door', after: [{ who: 'narges', text: 'کلید حاج‌بابا… کار کرد!' }] },
      { id: 'hammam.tiles', title: 'شستن کاشی‌های قاجاری', cost: 36, layer: 'tiles', after: [{ who: 'kaveh', text: 'این امضای استاد کاشی‌کاره. سال ۱۲۹۸. این‌جا یه موزه‌ست، نه مخروبه.' }] },
      { id: 'hammam.pool', title: 'مرمت خزینه', cost: 42, layer: 'pool', after: [{ who: 'golab', text: 'یه چیزی زیر سنگ وسط خزینه‌ست. حاج‌بابا همیشه می‌گفت «گنج زیر آبه».' }] },
      { id: 'hammam.box', title: 'بیرون آوردن صندوقچه', cost: 48, layer: 'box', after: [{ who: 'narges', text: 'سند اصلی کوچه! به اسم همه‌ی اهالی. هیچ‌کس نمی‌تونه بفروشدش.' }] },
      { id: 'hammam.lights', title: 'چراغونی برای ثبت میراث', cost: 54, layer: 'lights', after: [{ who: 'farokhi', text: '…حاج‌بابا همیشه یه قدم جلوتر بود. پدرم هم همینو می‌گفت.' }] },
    ],
    outro: [
      { who: 'farokhi', text: 'لودرها رو برمی‌گردونم. ولی یه شرط دارم.' },
      { who: 'narges', text: 'چه شرطی؟' },
      { who: 'farokhi', text: 'یه چای از سماور حاج‌بابا. پدرم می‌گفت بهترین چای تهران بود.' },
      { who: 'mahin', text: 'این قصه تموم نشده‌ها… فصل بعد: عروسی! کی؟ نمی‌گم!' },
    ],
  },
  // ------------------------------------------------------------------ season 2: عروسی
  {
    id: 'khastegari',
    name: 'مهمانخانه‌ی نرگس',
    intro: [
      { who: 'mahin', text: 'نرگـــس! خبر داری؟ امشب خواستگاری داری!' },
      { who: 'narges', text: 'چی؟! کی گفته؟' },
      { who: 'mahin', text: 'خود کاوه به اوستا رضا گفت، اوستا رضا به آقا مرتضی، آقا مرتضی هم به من. یعنی کل محله.' },
      { who: 'narges', text: 'وای… مهمانخانه هنوز پر از اسباب‌کشیه!' },
      { who: 'golab', text: 'غصه نخور مادر. تا غروب وقت داریم. فقط مادرش… فخری‌خانم… خیلی سخت‌گیره.' },
    ],
    tasks: [
      { id: 'khastegari.carpet', title: 'پهن کردن فرش کاشان', cost: 40, layer: 'carpet', after: [{ who: 'golab', text: 'این فرش جهیزیه‌ی مادرجونته. پنجاه سال پیش با همین فرش عروس شد.' }] },
      { id: 'khastegari.curtain', title: 'پرده‌های ترمه', cost: 44, layer: 'curtain', after: [{ who: 'shirin', text: 'پرده‌ها رو که زدی، حالا نوبت موهای توئه. بشین ببینم!' }] },
      { id: 'khastegari.fruit', title: 'چیدن میوه و شیرینی', cost: 48, layer: 'fruit', after: [{ who: 'morteza', text: 'این سیب‌ها رو از بهترین جعبه‌م دادم. قیمتش رو بعداً… نه، هدیه‌ست. هدیه!' }, { who: 'mahin', text: 'آقا مرتضی هدیه داد؟ دنیا داره تموم می‌شه!' }] },
      { id: 'khastegari.tea', title: 'سماور و سینی چای', cost: 52, layer: 'tea', after: [{ who: 'fakhri', text: 'چای رو خود عروس خانم آورد؟ رنگش خوبه. ببینیم دستپختش هم همین‌قدر خوبه یا نه.' }] },
      { id: 'khastegari.flowers', title: 'گلدان گل محمدی', cost: 56, layer: 'flowers', after: [{ who: 'kaveh', text: 'نرگس… من حرف زیادی بلد نیستم. فقط می‌دونم می‌خوام این کوچه رو با تو ادامه بدم.' }, { who: 'narges', text: '…' }, { who: 'mahin', text: 'بگو بله دیگه دختر! چایی‌مون یخ کرد!' }] },
    ],
    outro: [
      { who: 'narges', text: 'بله.' },
      { who: 'fakhri', text: 'مبارکه. ولی یه شرط دارم: شیرینی عروسی باید از بهترین قنادی تهران باشه.' },
      { who: 'reza', text: 'قنادی محله ما ده ساله بسته‌ست خانم…' },
      { who: 'narges', text: 'پس بازش می‌کنیم.' },
    ],
  },
  {
    id: 'sweetshop',
    name: 'قنادی قدیمی محله',
    intro: [
      { who: 'golab', text: 'قنادی آقا جلال… زولبیا بامیه‌هاش تا سر خیابون بو می‌داد.' },
      { who: 'reza', text: 'آقا جلال رفت شهرستان. کلیدش پیش منه. فقط بلد نیستم شیرینی بپزم!' },
      { who: 'narges', text: 'یاد می‌گیریم. قابلمه‌ی شیره رو بیارید!' },
    ],
    tasks: [
      { id: 'sweetshop.sign', title: 'تابلوی قنادی', cost: 50, layer: 'sign', after: [{ who: 'mahin', text: 'تابلوش رو که زدی، ده نفر اومدن پرسیدن «کی باز می‌کنید؟» من گفتم فردا. ببخشید!' }] },
      { id: 'sweetshop.shelves', title: 'قفسه‌های شیشه‌ای', cost: 55, layer: 'shelves', after: [{ who: 'shirin', text: 'این شیشه‌های نقل و نبات رو ببین! مثل مغازه‌ی عروسکیه.' }] },
      { id: 'sweetshop.oven', title: 'روشن کردن فر قنادی', cost: 60, layer: 'oven', after: [{ who: 'reza', text: 'فر قنادی با تنور سنگکی فرق داره… ولی بوی آرد همه‌جا یکیه.' }] },
      { id: 'sweetshop.counter', title: 'ویترین شیرینی', cost: 65, layer: 'counter', after: [{ who: 'fakhri', text: 'باقلواش… قبول. سوهانش… قبول. ولی کیک عروسی چی؟' }] },
      { id: 'sweetshop.cake', title: 'کیک سه‌طبقه‌ی عروسی', cost: 70, layer: 'cake', after: [{ who: 'fakhri', text: 'خب… خوبه. خیلی خوبه. از کاوه نگید که من گفتم.' }, { who: 'mahin', text: 'فخری‌خانم لبخند زد! ثبتش کنید تو تاریخ محله!' }] },
    ],
    outro: [
      { who: 'shirin', text: 'نرگس، لباس عروس چی؟ نگو که هنوز نخریدی!' },
      { who: 'narges', text: 'پول لباس‌های بالاشهر رو ندارم شیرین.' },
      { who: 'golab', text: 'خیاطی ترمه‌دوز ته کوچه… چرخ خیاطی مادرجونت هنوز اونجاست.' },
    ],
  },
  {
    id: 'tailor',
    name: 'خیاطی ترمه‌دوز',
    intro: [
      { who: 'golab', text: 'مادرجونت لباس عروس نصف دخترای این محله رو با همین چرخ دوخته بود.' },
      { who: 'narges', text: 'من خیاطی بلد نیستم ننه‌گلاب…' },
      { who: 'golab', text: 'من بلدم. دستام دیگه نمی‌لرزه وقتی برای نوه‌ی مریم‌خانم می‌دوزم.' },
    ],
    tasks: [
      { id: 'tailor.machine', title: 'تعمیر چرخ خیاطی', cost: 60, layer: 'machine', after: [{ who: 'kaveh', text: 'یه قطره روغن، یه پیچ… چرخ مادرجون مثل روز اول کار می‌کنه.' }] },
      { id: 'tailor.fabric', title: 'قفسه‌ی پارچه و ترمه', cost: 66, layer: 'fabric', after: [{ who: 'shirin', text: 'این ترمه‌ی سفید رو ببین! با گل‌دوزی نقره‌ای… محشره.' }] },
      { id: 'tailor.dress', title: 'دوختن لباس عروس', cost: 72, layer: 'dress', after: [{ who: 'golab', text: 'آستین بلند، دامن بلند، تور ظریف… مثل لباس مادرجونت.' }, { who: 'narges', text: 'ننه‌گلاب… گریه‌م گرفت.' }] },
      { id: 'tailor.mirror', title: 'آینه‌ی قدی', cost: 78, layer: 'mirror', after: [{ who: 'mahin', text: 'فخری‌خانم لباس رو دید، گفت «ایراد نداره». یعنی عاشقش شده!' }] },
      { id: 'tailor.lights', title: 'چراغ‌های ویترین', cost: 84, layer: 'lights', after: [{ who: 'shirin', text: 'سه تا عروس دیگه هم سفارش لباس دادن! خیاطی دوباره راه افتاد.' }] },
    ],
    outro: [
      { who: 'fakhri', text: 'عقد باید طبق رسم باشه. سفره‌ی عقد کامل: آینه، شمعدان، نقل، نبات… همه‌چی.' },
      { who: 'narges', text: 'چشم فخری‌خانم.' },
      { who: 'fakhri', text: 'می‌تونی بگی… مادر.' },
    ],
  },
  {
    id: 'aghd',
    name: 'سفره‌ی عقد',
    intro: [
      { who: 'mahin', text: 'سفره‌ی عقد رو تو حیاط ننه‌گلاب می‌چینیم. من مسئول نقل و شایعات… یعنی نقل و شیرینی!' },
      { who: 'golab', text: 'آینه و شمعدان مادرجونت تو صندوقخونه‌ست. صد ساله‌ست مادر.' },
    ],
    tasks: [
      { id: 'aghd.cloth', title: 'پهن کردن سفره‌ی ترمه', cost: 70, layer: 'cloth', after: [{ who: 'shirin', text: 'ترمه‌ی کرمانی! این سفره عکس‌خورش عالیه.' }] },
      { id: 'aghd.mirror', title: 'آینه و شمعدان', cost: 77, layer: 'mirror', after: [{ who: 'golab', text: 'اولین چیزی که عروس تو آینه می‌بینه، باید روشنایی باشه.' }] },
      { id: 'aghd.bread', title: 'نان سنگک «مبارک باد»', cost: 84, layer: 'bread', after: [{ who: 'reza', text: 'رو این سنگک با زعفرون نوشتم «مبارک باد». بهترین نونیه که تو عمرم پختم.' }] },
      { id: 'aghd.sweets', title: 'نقل، نبات و عسل', cost: 91, layer: 'sweets', after: [{ who: 'mahin', text: 'عسل رو گذاشتم که زندگی‌تون شیرین باشه. نقل رو هم که سرتون بریزیم!' }] },
      { id: 'aghd.candles', title: 'گل و شمع', cost: 98, layer: 'candles', after: [{ who: 'kaveh', text: 'نرگس… آماده‌ای؟' }, { who: 'narges', text: 'با اجازه‌ی بزرگترها… بله!' }, { who: 'mahin', text: 'کِل بکشید! کِــــل!' }] },
    ],
    outro: [
      { who: 'farokhi', text: 'تبریک می‌گم. اجازه بدید جشن عروسی رو من… تو کوچه بگیرم. به یاد پدرم و حاج‌بابا.' },
      { who: 'narges', text: 'آقای فرخی؟!' },
      { who: 'farokhi', text: 'کوچه‌ای که نجاتش دادید، لایق یه جشن درسته.' },
    ],
  },
  {
    id: 'wedding',
    name: 'جشن عروسی در کوچه',
    intro: [
      { who: 'mahin', text: 'کل محله دعوتن! حتی پسرخاله‌ی آقا مرتضی که ده ساله باهاش قهره.' },
      { who: 'morteza', text: 'آشتی می‌کنیم. ولی شامش با فرخیه، نه با من!' },
    ],
    tasks: [
      { id: 'wedding.lights', title: 'چراغونی کوچه', cost: 80, layer: 'lights', after: [{ who: 'shirin', text: 'کوچه شبیه شب یلدا شده! نه، قشنگ‌تر!' }] },
      { id: 'wedding.tables', title: 'میزهای مهمون‌ها', cost: 88, layer: 'tables', after: [{ who: 'reza', text: 'سیصد تا سنگک داغ. دستام دیگه حس ندارن، دلم ولی خوشه.' }] },
      { id: 'wedding.music', title: 'تار و تنبک', cost: 96, layer: 'music', after: [{ who: 'golab', text: 'این همون ترانه‌ایه که حاج‌بابا و مادرجون باهاش رقصیدن.' }] },
      { id: 'wedding.arch', title: 'طاق گل عروس', cost: 104, layer: 'arch', after: [{ who: 'fakhri', text: 'نرگس… قدمت به خانواده‌مون خوش باشه. مادرجونت حتماً الان خوشحاله.' }] },
      { id: 'wedding.fireworks', title: 'آتش‌بازی', cost: 112, layer: 'fireworks', after: [{ who: 'kaveh', text: 'این کوچه، این آدم‌ها، تو… هیچ پاساژی جاشونو نمی‌گیره.' }, { who: 'narges', text: 'خونه یعنی همین.' }] },
    ],
    outro: [
      { who: 'mahin', text: 'خب بچه‌ها، عروسی تموم شد. ولی من یه خبری دارم…' },
      { who: 'narges', text: 'باز چی شده خاله؟' },
      { who: 'mahin', text: 'یه نفر از اون ور دنیا یه نامه برای حاج‌بابا فرستاده! فصل بعد…' },
    ],
  },
  // ------------------------------------------------------------------ season 3: نامه‌ای از اون ور دنیا
  {
    id: 'postoffice',
    name: 'پستخونه‌ی قدیمی محله',
    intro: [
      { who: 'mahin', text: 'نرگس! این نامه از هامبورگ اومده. پستچی می‌گه پستخونه‌ی محله که بسته‌ست، یه ماهه دستش مونده!' },
      { who: 'narges', text: 'هامبورگ؟ برای حاج‌بابا؟ … پشت پاکت نوشته: «از طرف بهمن».' },
      { who: 'golab', text: 'بهمن؟! نه بابا… امکان نداره.', mood: 'surprised' },
      { who: 'narges', text: 'ننه‌گلاب، بهمن کیه؟' },
      { who: 'golab', text: 'برادر کوچیک حاج‌بابا. چهل ساله رفته. حتی برای خاکسپاری داداشش هم نیومد.', mood: 'sad' },
      { who: 'narges', text: 'باید جوابش رو بدیم. ولی اول این پستخونه رو راه می‌ندازیم که دیگه هیچ نامه‌ای گم نشه.' },
    ],
    tasks: [
      { id: 'post.counter', title: 'تمیز کردن پیشخوان پست', cost: 80, layer: 'counter', after: [{ who: 'reza', text: 'یادش بخیر. نامه‌های سربازی‌م رو از همین باجه پست می‌کردم.' }] },
      { id: 'post.boxes', title: 'صندوق‌های نامه', cost: 84, layer: 'boxes', after: [{ who: 'morteza', text: 'یکی از این صندوق‌ها مال منه. قبضای عقب‌افتاده‌م توشه… بذار بسته بمونه!' }, { who: 'mahin', text: 'آقا مرتضی، اون صندوق خالیه. قبضاتو من قبلاً دیدم.' }] },
      { id: 'post.scale', title: 'ترازوی برنجی بسته‌ها', cost: 88, layer: 'scale', after: [{ who: 'kaveh', text: 'این ترازو صد سال سن داره. حاج‌بابا هیچی رو دور نمی‌انداخت.' }] },
      { id: 'post.phone', title: 'باجه‌ی تلفن', cost: 91, layer: 'phone', after: [{ who: 'narges', text: 'با همین تلفن به هامبورگ زنگ می‌زنم. شماره‌ش ته نامه‌ست.' }, { who: 'narges', text: '…الو؟ عمو بهمن؟ من نرگسم، نوه‌ی حاج‌بابا.' }] },
      { id: 'post.sign', title: 'تابلوی «پست»', cost: 95, layer: 'sign', after: [{ who: 'shirin', text: 'کوچه‌مون پستخونه هم داره! دیگه کارت دعوت هیچ عروسی‌ای گم نمی‌شه!' }] },
    ],
    outro: [
      { who: 'narges', text: 'عمو بهمن پشت تلفن فقط گریه کرد. نمی‌دونست حاج‌بابا رفته.', mood: 'sad' },
      { who: 'narges', text: 'گفت چند تا عکس قدیمی تو نامه گذاشته… ولی فقط نگاتیوه. باید ظاهرشون کنیم.' },
      { who: 'mahin', text: 'ته کوچه یه عکاسخونه‌ی قدیمی هست! «آتلیه رز». بیست ساله تعطیله.' },
    ],
  },
  {
    id: 'photo',
    name: 'عکاسخونه‌ی آتلیه رز',
    intro: [
      { who: 'kaveh', text: 'دستگاه ظهور هنوز سالمه. فقط تاریکخونه رو باید راه بندازیم.' },
      { who: 'golab', text: 'این عکاسخونه رو یادمه… عکس عروسی خیلی‌ها این‌جا گرفته شد.' },
      { who: 'narges', text: 'شما هم این‌جا عکس دارید، ننه‌گلاب؟' },
      { who: 'golab', text: 'یه عکس داشتم… که هیچ‌وقت ظاهر نشد.', mood: 'sad' },
    ],
    tasks: [
      { id: 'photo.backdrop', title: 'پرده‌ی پشت عکس', cost: 89, layer: 'backdrop', after: [{ who: 'shirin', text: 'این پرده‌ی گل‌گلی! همه‌ی عکس‌های قدیمی مامانم با همین پرده‌ست!' }] },
      { id: 'photo.camera', title: 'دوربین سه‌پایه‌دار', cost: 93, layer: 'camera', after: [{ who: 'kaveh', text: 'دوربین آکاردئونی. برای عکس گرفتن باید بری زیر پارچه‌ی سیاهش.' }, { who: 'mahin', text: 'من می‌رم زیرش! … وای چه تاریکه!' }] },
      { id: 'photo.lights', title: 'چراغ‌های عکاسی', cost: 97, layer: 'lights', after: [{ who: 'reza', text: 'نور که اومد ببین چه خوش‌تیپ شدم! یه عکس بگیر بزنم پشت ویترین نونوایی.' }] },
      { id: 'photo.darkroom', title: 'تاریکخونه', cost: 100, layer: 'darkroom', after: [{ who: 'narges', text: 'نگاتیوها داره ظاهر می‌شه… سه تا جوون جلوی قهوه‌خونه.' }, { who: 'narges', text: 'این حاج‌باباست… این باید بهمن باشه… و این دختر با چادر گل‌گلی…', mood: 'surprised' }] },
      { id: 'photo.frames', title: 'قاب‌های قدیمی', cost: 104, layer: 'frames', after: [{ who: 'golab', text: 'این منم، مادر. هجده سالمه. اون پسری هم که کنارمه، بهمن.', mood: 'sad' }] },
    ],
    outro: [
      { who: 'narges', text: 'ننه‌گلاب… شما و عمو بهمن؟', mood: 'surprised' },
      { who: 'golab', text: 'قرار بود عروسی کنیم. یه شب گفت می‌ره آلمان کار کنه، شش ماهه برمی‌گرده.' },
      { who: 'golab', text: 'چهل سال گذشت. نه خودش اومد، نه نامه‌ای.', mood: 'sad' },
      { who: 'mahin', text: 'اینو دیگه منم نمی‌دونستم. کل عمرم!', mood: 'surprised' },
    ],
  },
  {
    id: 'zurkhaneh',
    name: 'زورخونه‌ی پهلوون‌ها',
    intro: [
      { who: 'reza', text: 'عمو بهمن نوشته عید میاد! دلش می‌خواد یه بار دیگه صدای ضرب زورخونه رو بشنوه.' },
      { who: 'morteza', text: 'زورخونه؟ اون‌جا که الان انبار گونی‌های منه!' },
      { who: 'reza', text: 'پس خالیش کن آقا مرتضی. حاج‌بابا و بهمن هر دو پهلوون همین گود بودن.' },
      { who: 'farokhi', text: 'منم کمک می‌کنم. پدرم می‌گفت یه بار بهمن رو تو همین گود زمین زده.' },
    ],
    tasks: [
      { id: 'zur.pit', title: 'گود زورخونه', cost: 98, layer: 'pit', after: [{ who: 'kaveh', text: 'گود هشت‌ضلعیه. خاکش رو عوض کردیم؛ آماده‌ی ورزشه.' }] },
      { id: 'zur.meel', title: 'میل و کباده', cost: 102, layer: 'meel', after: [{ who: 'morteza', text: 'این میل‌ها چقدر سنگینه! … نه، کمرم چیزیش نشد. فقط یه کم تکون خورد.' }] },
      { id: 'zur.drum', title: 'ضرب مرشد', cost: 106, layer: 'drum', after: [{ who: 'reza', text: 'مرشد قدیمی رو پیدا کردم! نود سالشه، ولی صداش هنوز تا سر کوچه می‌رسه.' }] },
      { id: 'zur.bell', title: 'زنگ مرشد', cost: 109, layer: 'bell', after: [{ who: 'farokhi', text: 'این زنگ رو پدرم هدیه داده بود. نمی‌دونستم هنوز هست.' }] },
      { id: 'zur.photos', title: 'عکس پهلوون‌ها', cost: 113, layer: 'photos', after: [{ who: 'narges', text: 'عکس حاج‌بابا و عمو بهمن رو زدیم بالای گود. کنار هم، مثل قدیم.' }] },
    ],
    outro: [
      { who: 'narges', text: 'عمو بهمن زنگ زد. صداش خسته بود.', mood: 'sad' },
      { who: 'narges', text: 'دکترها گفتن قلبش ضعیفه. شاید این آخرین سفرش باشه.', mood: 'sad' },
      { who: 'golab', text: 'پس باید زودتر بیاد. من دیگه چهل سال وقت ندارم.' },
    ],
  },
  {
    id: 'cinema',
    name: 'سینمای سر کوچه',
    intro: [
      { who: 'shirin', text: 'من یه نقشه دارم! اولین قرار ننه‌گلاب و عمو بهمن کجا بوده؟' },
      { who: 'golab', text: 'سینمای سر کوچه. یه فیلم سیاه‌وسفید بود. هیچی‌ش یادم نیست، فقط دستاش یادمه.' },
      { who: 'mahin', text: 'پس شبی که میاد، سینما رو باز می‌کنیم. با همون فیلم!' },
      { who: 'kaveh', text: 'سینما ده ساله تعطیله. سقفش چکه می‌کنه، صندلی‌هاش شکسته…' },
      { who: 'narges', text: 'ده سال که چیزی نیست. ما یه کوچه رو از دست پاساژ نجات دادیم!' },
    ],
    tasks: [
      { id: 'cinema.seats', title: 'صندلی‌های مخمل قرمز', cost: 107, layer: 'seats', after: [{ who: 'mahin', text: 'من ردیف اول می‌شینم. بقیه هم موقع فیلم ساکت!' }] },
      { id: 'cinema.screen', title: 'پرده‌ی سینما', cost: 111, layer: 'screen', after: [{ who: 'kaveh', text: 'پرده نوئه، ولی قاب چوبیش همون قدیمیه. حیف بود عوضش کنیم.' }] },
      { id: 'cinema.projector', title: 'آپارات قدیمی', cost: 115, layer: 'projector', after: [{ who: 'farokhi', text: 'نسخه‌ی اون فیلم رو از آرشیو پیدا کردم. هزینه‌ش با من.' }] },
      { id: 'cinema.posters', title: 'پوسترهای فیلم', cost: 118, layer: 'posters', after: [{ who: 'shirin', text: 'پوسترها رو خودم رنگ کردم! این یکی ننه‌گلاب جوونیاشه… شبیه شده؟' }] },
      { id: 'cinema.marquee', title: 'تابلوی نئون سینما', cost: 122, layer: 'marquee', after: [{ who: 'narges', text: 'تابلو روشن شد: «امشب، نمایش ویژه». فقط مونده مهمون اصلی.' }] },
    ],
    outro: [
      { who: 'reza', text: 'نرگس! یه تاکسی سر کوچه وایساده… یه پیرمرد با کلاه شاپو پیاده شد!', mood: 'surprised' },
      { who: 'bahman', text: 'سلام… این‌جا… هنوز همون کوچه‌ست؟' },
      { who: 'narges', text: 'عمو بهمن؟!' },
    ],
  },
  {
    id: 'home',
    name: 'خونه‌ی پدری',
    intro: [
      { who: 'bahman', text: 'چهل سال… درخت توت حیاط هنوز هست. ولی خونه‌ی پدری…', mood: 'sad' },
      { who: 'narges', text: 'از همه‌جا خراب‌تره، عمو. ولی تا شب درستش می‌کنیم.' },
      { who: 'bahman', text: 'نرگس جان، حاج‌بابا… از من دلخور بود؟', mood: 'sad' },
      { who: 'golab', text: 'دلخور نبود، بهمن. منتظر بود. مثل من.' },
    ],
    tasks: [
      { id: 'home.tree', title: 'درخت توت حیاط', cost: 116, layer: 'tree', after: [{ who: 'bahman', text: 'بچه که بودیم از همین درخت بالا می‌رفتیم. یه بار افتادم، دستم شکست. داداش منو تا درمونگاه کول کرد.' }] },
      { id: 'home.pool', title: 'حوض و ماهی قرمز', cost: 120, layer: 'pool', after: [{ who: 'golab', text: 'ماهی قرمزها رو خودم خریدم. مثل اون عیدی که قول دادی برگردی.' }] },
      { id: 'home.room', title: 'ارسی اتاق شاه‌نشین', cost: 124, layer: 'room', after: [{ who: 'bahman', text: 'این شیشه‌های رنگی… مادرم هر صبح جلوشون نماز می‌خوند.' }, { who: 'kaveh', text: 'حاج‌بابا هیچی رو دور نمی‌انداخت، عمو. حتی خاطره‌ها رو.' }] },
      { id: 'home.letters', title: 'صندوقچه‌ی نامه‌ها', cost: 127, layer: 'letters', after: [{ who: 'narges', text: 'عمو… این صندوقچه پر از نامه‌ست. همه به اسم شما. هیچ‌کدوم پست نشده.' }, { who: 'bahman', text: 'داداش… چهل سال برای من نامه نوشته؟', mood: 'sad' }] },
      { id: 'home.lights', title: 'چراغونی خونه‌ی پدری', cost: 131, layer: 'lights', after: [{ who: 'bahman', text: 'گلاب… من خیلی دیر اومدم. ولی اگه قبول کنی، بقیه‌ی عمرم رو همین‌جا می‌مونم.' }, { who: 'golab', text: 'پیرمرد! فکر کردی این بار می‌ذارم بری؟', mood: 'happy' }] },
    ],
    outro: [
      { who: 'mahin', text: 'عروسی دوم کوچه! این بار عروس هشتاد سالشه، داماد هشتاد و دو!' },
      { who: 'bahman', text: 'خونه‌ی پدری رو می‌دم به محله. بشه «خونه‌ی همسایه‌ها». مال همه.' },
      { who: 'narges', text: 'حاج‌بابا بود، از همه خوشحال‌تر بود.' },
      { who: 'shirin', text: 'نرگس… چرا امروز رنگت پریده؟ صبحونه هم نخوردی…' },
      { who: 'mahin', text: 'وای! نکنه… خبریه؟! فصل بعد…', mood: 'surprised' },
    ],
  },
  // ------------------------------------------------------------------ season 4: یه نفر تو راهه
  {
    id: 'grocery',
    name: 'بقالی آقا مرتضی',
    intro: [
      { who: 'mahin', text: 'خبر داغ! نرگس امروز صبح سه بار رفته داروخونه!', mood: 'surprised' },
      { who: 'shirin', text: 'خاله! شاید سرما خورده!' },
      { who: 'mahin', text: 'سرما خورده و یه جعبه شیرینی هم خریده؟ من بیست ساله خبرنگارم، دخترم!' },
      { who: 'narges', text: 'باشه، باشه… بله. یه نفر تو راهه.', mood: 'happy' },
      { who: 'morteza', text: 'مبارکه! حالا که بچه داره میاد، بقالی من باید آبرومند باشه. یه عمره خاک می‌خوره.' },
    ],
    tasks: [
      { id: 'grocery.shelves', title: 'قفسه‌های بقالی', cost: 120, layer: 'shelves', after: [{ who: 'morteza', text: 'هر قوطی سر جاش. حتی اونایی که تاریخشون… نه، همه تازه‌ست!' }] },
      { id: 'grocery.scale', title: 'ترازوی دوکفه', cost: 122, layer: 'scale', after: [{ who: 'kaveh', text: 'این ترازو کج بود آقا مرتضی. یه عمر کم‌فروشی می‌کردی؟' }, { who: 'morteza', text: 'کج بود؟ … خب، الان که صافه دیگه!' }] },
      { id: 'grocery.fridge', title: 'یخچال نوشیدنی', cost: 124, layer: 'fridge', after: [{ who: 'shirin', text: 'یخچال روشن شد! نرگس، هوس چی کردی؟ ترشی؟ بستنی؟ هر دو با هم؟' }] },
      { id: 'grocery.sacks', title: 'گونی‌های برنج و حبوبات', cost: 126, layer: 'sacks', after: [{ who: 'golab', text: 'برنج دم‌سیاه گرفتم، برای کاچی و آش. زن حامله باید جون بگیره.' }] },
      { id: 'grocery.sign', title: 'تابلوی «بقالی برکت»', cost: 128, layer: 'sign', after: [{ who: 'morteza', text: 'بقالی برکت. سی ساله این تابلو رو می‌خواستم. هزینه‌ش رو هم… خودم دادم!' }, { who: 'mahin', text: 'آقا مرتضی پول داد؟ دیگه هیچی تو این دنیا عجیب نیست!' }] },
    ],
    outro: [
      { who: 'fakhri', text: 'نوه‌ی من باید تو اتاق درست و حسابی بزرگ بشه. سیسمونی رو من می‌خرم.' },
      { who: 'golab', text: 'سیسمونی رسم خونواده‌ی عروسه، فخری‌خانم. من جای مادربزرگ نرگسم.' },
      { who: 'fakhri', text: '…پس با هم می‌خریم. ولی سلیقه با من.' },
      { who: 'golab', text: 'اینو دیگه خواب ببینی!', mood: 'angry' },
    ],
  },
  {
    id: 'sismooni',
    name: 'سیسمونی‌فروشی محله',
    intro: [
      { who: 'shirin', text: 'ته کوچه یه مغازه‌ی سیسمونی خالیه. صاحبش رفته کانادا و کلیدش دست منه!' },
      { who: 'fakhri', text: 'پس خودمون راهش می‌ندازیم. هرچی بچه لازم داره، از همین کوچه.' },
      { who: 'golab', text: 'اولین چیزی هم که می‌خریم، گهواره‌ی چوبیه. مثل قدیما.' },
      { who: 'fakhri', text: 'گهواره؟ الان همه تخت بچه می‌خرن!', mood: 'surprised' },
    ],
    tasks: [
      { id: 'sis.window', title: 'ویترین مغازه', cost: 126, layer: 'window', after: [{ who: 'shirin', text: 'ویترین برق می‌زنه! حالا هر کی رد شه، وایمیسه.' }] },
      { id: 'sis.cradle', title: 'گهواره‌ی چوبی', cost: 128, layer: 'cradle', after: [{ who: 'golab', text: 'این گهواره رو پدربزرگ نرگس با دست خودش ساخته بود. تو انباری پیداش کردم.' }, { who: 'fakhri', text: '…خب، قشنگه. قبول. ولی پتوش رو من انتخاب می‌کنم.' }] },
      { id: 'sis.clothes', title: 'لباس‌های بچه', cost: 130, layer: 'clothes', after: [{ who: 'mahin', text: 'آبی بخریم یا صورتی؟ هنوز نمی‌دونیم پسره یا دختر!' }, { who: 'narges', text: 'سبز می‌خریم، خاله. مثل درختای کوچه.' }] },
      { id: 'sis.toys', title: 'قفسه‌ی اسباب‌بازی', cost: 132, layer: 'toys', after: [{ who: 'reza', text: 'این عروسک نمدی رو خانمم دوخته. هدیه‌ی نونوایی برای بچه!' }] },
      { id: 'sis.sign', title: 'تابلوی «سیسمونی محله»', cost: 134, layer: 'sign', after: [{ who: 'kaveh', text: 'مادرم و ننه‌گلاب تا آخر با هم دعوا کردن… ولی با هم خرید کردن. اینم یه جور صلحه.' }] },
    ],
    outro: [
      { who: 'bahman', text: 'نرگس جان، من هم یه هدیه دارم: کتابای داداش، و کتابای خودم از هامبورگ.' },
      { who: 'bahman', text: 'تو خونه‌ی همسایه‌ها یه کتابخونه بسازیم. بچه‌ی تو اولین عضوش باشه.' },
      { who: 'narges', text: 'عمو… این بهترین هدیه‌ی دنیاست.', mood: 'happy' },
    ],
  },
  {
    id: 'library',
    name: 'کتابخونه‌ی خونه‌ی همسایه‌ها',
    intro: [
      { who: 'kaveh', text: 'اتاق شاه‌نشین رو قفسه‌بندی می‌کنیم. نور ارسی‌ها برای کتاب خوندن عالیه.' },
      { who: 'bahman', text: 'دیوان حافظ داداش رو می‌ذاریم بالای همه. با همون حاشیه‌نویسی‌هاش.' },
      { who: 'mahin', text: 'یه قفسه هم مال مجله‌های من. چهل سال خبر جمع کردم!' },
    ],
    tasks: [
      { id: 'lib.shelves', title: 'قفسه‌های کتاب', cost: 132, layer: 'shelves', after: [{ who: 'kaveh', text: 'قفسه‌ها از چوب گردوئه. صد سال دووم میارن، مثل همین خونه.' }] },
      { id: 'lib.rug', title: 'فرش و پشتی', cost: 134, layer: 'rug', after: [{ who: 'golab', text: 'بچه‌ها رو زمین می‌شینن و قصه گوش می‌دن. مثل ما، شب‌های قدیم.' }] },
      { id: 'lib.lamp', title: 'چراغ مطالعه', cost: 136, layer: 'lamp', after: [{ who: 'shirin', text: 'هر پنجشنبه برای بچه‌ها قصه می‌خونم! با صداسازی!' }] },
      { id: 'lib.hafez', title: 'دیوان حافظ حاج‌بابا', cost: 138, layer: 'hafez', after: [{ who: 'bahman', text: 'یه فال بگیریم برای بچه…' }, { who: 'bahman', text: '«مژده ای دل که مسیحا نفسی می‌آید…»' }, { who: 'narges', text: 'حافظ هم خبر داره، عمو!', mood: 'happy' }] },
      { id: 'lib.globe', title: 'کره‌ی جغرافیا', cost: 140, layer: 'globe', after: [{ who: 'bahman', text: 'که بدونه دنیا بزرگه… ولی خونه همین‌جاست.' }] },
    ],
    outro: [
      { who: 'narges', text: 'آخ… کاوه… فکر کنم وقتشه!', mood: 'surprised' },
      { who: 'kaveh', text: 'وقتش؟! الان؟! ماشین! کی ماشین داره؟!', mood: 'surprised' },
      { who: 'farokhi', text: 'ماشین من سر کوچه‌ست. بپرید بالا!' },
      { who: 'mahin', text: 'من زودتر از همه می‌رم بیمارستان. خبرش باید اول دست من باشه!' },
    ],
  },
  {
    id: 'nursery',
    name: 'اتاق بچه',
    intro: [
      { who: 'kaveh', text: 'تا نرگس و بچه از بیمارستان برگردن، اتاق بچه باید آماده باشه. فقط دو روز وقت داریم!' },
      { who: 'fakhri', text: 'رنگ دیوارش رو من انتخاب کردم.' },
      { who: 'golab', text: 'پرده‌ش رو هم من دوختم.' },
      { who: 'reza', text: 'بقیه‌ش با ما. یالا محله!' },
    ],
    tasks: [
      { id: 'nur.walls', title: 'رنگ دیوار اتاق', cost: 138, layer: 'walls', after: [{ who: 'fakhri', text: 'سبز پسته‌ای. آرامش‌بخشه. تو کتاب خوندم.' }] },
      { id: 'nur.cradle', title: 'گهواره کنار پنجره', cost: 140, layer: 'cradle', after: [{ who: 'golab', text: 'گهواره‌ی پدربزرگش، رو به آفتاب صبح.' }] },
      { id: 'nur.mobile', title: 'آویز بالای گهواره', cost: 142, layer: 'mobile', after: [{ who: 'shirin', text: 'ماه و ستاره و ماهی قرمز! همه‌ش رو خودم ساختم.' }] },
      { id: 'nur.curtain', title: 'پرده‌ی گل‌دوزی', cost: 144, layer: 'curtain', after: [{ who: 'golab', text: 'گل‌هاش رو یکی‌یکی دوختم. هر گل یه دعا.' }] },
      { id: 'nur.lamp', title: 'چراغ‌خواب', cost: 146, layer: 'lamp', after: [{ who: 'kaveh', text: 'زنگ زدن… دارن میان! همه برید سر کوچه!', mood: 'happy' }] },
    ],
    outro: [
      { who: 'narges', text: 'سلام به همه… با یه مهمون کوچولو.', mood: 'happy' },
      { who: 'mahin', text: 'دختره یا پسر؟! زود بگو!', mood: 'surprised' },
      { who: 'narges', text: 'دختر. اسمش رو هم… فردا شب، تو جشن می‌گیم.' },
    ],
  },
  {
    id: 'naming',
    name: 'جشن نام‌گذاری',
    intro: [
      { who: 'shirin', text: 'جشن تو حیاط ننه‌گلاب! کل محله دعوتن.' },
      { who: 'reza', text: 'نون و پنیر و سبزی با من!' },
      { who: 'bahman', text: 'اسپند دود کنیم، مثل قدیم.' },
    ],
    tasks: [
      { id: 'name.tables', title: 'میز و صندلی حیاط', cost: 144, layer: 'tables', after: [{ who: 'morteza', text: 'صندلی‌ها رو از بقالی آوردم. کرایه هم نمی‌گیرم! … این بار.' }] },
      { id: 'name.sofreh', title: 'سفره‌ی شیرینی و شربت', cost: 146, layer: 'sofreh', after: [{ who: 'fakhri', text: 'شربت بیدمشک با گلاب ننه‌گلاب. باید قبول کنم، ترکیب‌مون حرف نداره.' }] },
      { id: 'name.lights', title: 'ریسه و فانوس', cost: 148, layer: 'lights', after: [{ who: 'farokhi', text: 'من کوچه‌های زیادی ساختم. ولی هیچ‌کدوم این‌قدر روشن نبودن.' }] },
      { id: 'name.esfand', title: 'اسپنددون', cost: 150, layer: 'esfand', after: [{ who: 'golab', text: 'اسفند دونه دونه، اسفند سی و سه دونه… چشم حسود بترکه!' }] },
      { id: 'name.cradle', title: 'گهواره وسط جشن', cost: 152, layer: 'cradle', after: [{ who: 'narges', text: 'اسمش رو گذاشتیم «گلاب». به یاد کسی که چهل سال منتظر موند و نذاشت این کوچه بمیره.' }, { who: 'golab', text: '…الهی قربونش برم. الهی قربون هر دوتون برم.', mood: 'sad' }] },
    ],
    outro: [
      { who: 'mahin', text: 'بچه‌ها… یه نامه از شهرداری اومده. برای کل کوچه.', mood: 'sad' },
      { who: 'kaveh', text: '«طرح تعریض خیابان… تخریب ضلع شمالی کوچه»؟!', mood: 'surprised' },
      { who: 'narges', text: 'یعنی خونه‌ی ننه‌گلاب… قهوه‌خونه… همه‌ش؟', mood: 'sad' },
      { who: 'farokhi', text: 'این دفعه من طرف شمام. فصل بعد…' },
    ],
  },
  // ------------------------------------------------------------------ season 5: طرح تعریض خیابان
  {
    id: 'gate',
    name: 'سردر کوچه',
    intro: [
      { who: 'farokhi', text: 'با شهرداری حرف زدم. فقط یه راه داریم: ثابت کنیم این کوچه تاریخیه. میراث فرهنگی باید ثبتش کنه.' },
      { who: 'kaveh', text: 'زیر گچ‌های سردر کوچه یه کتیبه هست. پدربزرگم می‌گفت تاریخ ساخت کوچه روشه.' },
      { who: 'mahin', text: 'پس چرا تا حالا کسی درش نیاورده؟!' },
      { who: 'golab', text: 'چون تا حالا کسی نمی‌خواست کوچه‌ی ما رو خراب کنه، مادر.' },
    ],
    tasks: [
      { id: 'gate.arch', title: 'طاق آجری سردر', cost: 148, layer: 'arch', after: [{ who: 'kaveh', text: 'آجرها رو یکی‌یکی تمیز کردیم. ملاتش هنوز سالمه. قدیمیا کارشون رو بلد بودن.' }] },
      { id: 'gate.katibeh', title: 'کتیبه‌ی کاشی', cost: 150, layer: 'katibeh', after: [{ who: 'bahman', text: '«بنا شد این گذر به سال هزار و دویست و هشتاد و پنج»… صد و بیست سال!', mood: 'surprised' }, { who: 'farokhi', text: 'این همون چیزیه که لازم داشتیم!', mood: 'happy' }] },
      { id: 'gate.door', title: 'در و کوبه‌ها', cost: 152, layer: 'door', after: [{ who: 'golab', text: 'کوبه‌ی سنگین برای مردها، حلقه‌ی سبک برای زن‌ها. صاحبخونه از صداش می‌فهمید کی پشت دره.' }] },
      { id: 'gate.plate', title: 'پلاک «کوچه‌ی حاج‌بابا»', cost: 154, layer: 'plate', after: [{ who: 'reza', text: 'پلاک آبی نو. حالا اسم حاج‌بابا رو هر کی رد شه می‌خونه.' }] },
      { id: 'gate.lamp', title: 'چراغ سردر', cost: 156, layer: 'lamp', after: [{ who: 'shirin', text: 'شب‌ها از سر خیابون پیداست! انگار کوچه داره صدامون می‌کنه.' }] },
    ],
    outro: [
      { who: 'farokhi', text: 'میراث جواب داد: «یه سردر برای ثبت کافی نیست. باید کل محله رو ببینیم.»', mood: 'sad' },
      { who: 'narges', text: 'پس کل محله رو نشونشون می‌دیم. امشب همه بیاید پشت‌بوم قهوه‌خونه. طومار امضا می‌کنیم!' },
    ],
  },
  {
    id: 'rooftop',
    name: 'پشت‌بوم قهوه‌خونه',
    intro: [
      { who: 'morteza', text: 'پشت‌بوم؟ از اون بالا آدم می‌افته! … خب، من میام. فقط برای امضا.' },
      { who: 'reza', text: 'قدیما تابستونا همه رو پشت‌بوم می‌خوابیدن. زیر ستاره‌ها.' },
      { who: 'kaveh', text: 'اول نرده‌ها رو درست کنیم. با یه نوزاد تو جمع، شوخی نداریم.' },
    ],
    tasks: [
      { id: 'roof.rail', title: 'نرده‌ی پشت‌بوم', cost: 154, layer: 'rail', after: [{ who: 'kaveh', text: 'نرده‌ها محکمه. حتی آقا مرتضی هم می‌تونه بهش تکیه بده.' }, { who: 'morteza', text: 'یعنی چی «حتی»؟!', mood: 'angry' }] },
      { id: 'roof.kilim', title: 'گلیم و پشتی', cost: 156, layer: 'kilim', after: [{ who: 'fakhri', text: 'گلیم قشقایی جهیزیه‌ی من بود. امشب مال همه‌ی محله‌ست.' }] },
      { id: 'roof.samovar', title: 'سماور زغالی', cost: 158, layer: 'samovar', after: [{ who: 'reza', text: 'سماور زغالی حاج‌بابا! چایش طعم پنجاه سال پیش رو می‌ده.' }] },
      { id: 'roof.pots', title: 'گلدون‌های شمعدونی', cost: 160, layer: 'pots', after: [{ who: 'golab', text: 'شمعدونی رو پشت‌بوم بذاری، تا پاییز گل می‌ده. مثل این محله؛ سرسخته.' }] },
      { id: 'roof.scroll', title: 'طومار امضاها', cost: 162, layer: 'scroll', after: [{ who: 'mahin', text: 'سیصد و دوازده امضا! کل محله‌های بغل هم امضا کردن. خبرش رو خودم پخش کردم!', mood: 'happy' }] },
    ],
    outro: [
      { who: 'reza', text: 'یه لحظه ساکت! … صدای آب نمیاد؟ از زیر پامون؟', mood: 'surprised' },
      { who: 'kaveh', text: 'زیر قهوه‌خونه یه پله‌ست که به زیر خیابون می‌ره… یه آب‌انبار قدیمی!', mood: 'surprised' },
      { who: 'farokhi', text: 'اگه آب‌انبار زیر خیابون باشه… هیچ بیلی نمی‌تونه بهش دست بزنه!' },
    ],
  },
  {
    id: 'cistern',
    name: 'آب‌انبار قدیمی',
    intro: [
      { who: 'kaveh', text: 'چهل پله پایین می‌ره. گنبدش سالمه، ولی پر از خاک و آشغاله.' },
      { who: 'bahman', text: 'بچه که بودیم داداش می‌گفت زیر کوچه یه دریاچه‌ست. فکر می‌کردم قصه‌ست!' },
      { who: 'narges', text: 'پس قصه‌های حاج‌بابا راست بود. بریم پایین!' },
    ],
    tasks: [
      { id: 'cis.stairs', title: 'پلکان آب‌انبار', cost: 160, layer: 'stairs', after: [{ who: 'reza', text: 'چهل پله، شمردم! به هر پله یه صلوات… نفسم برید.' }] },
      { id: 'cis.dome', title: 'گنبد و نورگیر', cost: 162, layer: 'dome', after: [{ who: 'kaveh', text: 'نور از نورگیر می‌افته رو آب. این‌ها رو دویست سال پیش حساب کردن.' }] },
      { id: 'cis.badgir', title: 'بادگیرها', cost: 164, layer: 'badgir', after: [{ who: 'bahman', text: 'بادگیر آب رو خنک نگه می‌داشت. یخچال بی‌برق، کار اجداد ما!' }] },
      { id: 'cis.tap', title: 'شیر برنجی', cost: 166, layer: 'tap', after: [{ who: 'golab', text: 'مادرم با کوزه از همین شیر آب می‌آورد. صداش هنوز تو گوشمه.' }] },
      { id: 'cis.lights', title: 'چراغ‌های آب‌انبار', cost: 168, layer: 'lights', after: [{ who: 'shirin', text: 'وای… آب برق می‌زنه. اینجا قشنگ‌ترین جای تهرانه!', mood: 'happy' }] },
    ],
    outro: [
      { who: 'farokhi', text: 'خبر رسید: «آب‌انبار دوره‌ی قاجار زیر معبر. طرح تعریض تا بررسی کامل متوقف شد.»', mood: 'happy' },
      { who: 'mahin', text: 'متوقف شد! نه لغو؟', mood: 'surprised' },
      { who: 'farokhi', text: 'برای لغو، کارشناس‌ها باید ببینن این محله چقدر تاریخ داره. یه جا لازم داریم که همه‌ش رو نشون بده.' },
    ],
  },
  {
    id: 'museum',
    name: 'موزه‌ی محله',
    intro: [
      { who: 'farokhi', text: 'طبقه‌ی همکف پاساژ من خالیه. اونجا موزه‌ی محله رو می‌سازیم.' },
      { who: 'golab', text: 'تو پاساژت؟ همون که می‌خواستی جای کوچه‌ی ما بسازی؟', mood: 'surprised' },
      { who: 'farokhi', text: 'آدم عوض می‌شه، خانم. این محله منو عوض کرد.' },
      { who: 'narges', text: 'پس هرکی هر چی قدیمی داره، بیاره!' },
    ],
    tasks: [
      { id: 'mus.cases', title: 'ویترین‌های شیشه‌ای', cost: 166, layer: 'cases', after: [{ who: 'morteza', text: 'اولین ترازوی بقالی‌م رو دادم. یه عمر باهاش… درست وزن کردم!' }] },
      { id: 'mus.photos', title: 'عکس‌های قدیمی محله', cost: 168, layer: 'photos', after: [{ who: 'mahin', text: 'این منم، چهل سال پیش! قبل از این‌که بفهمم خبرنگارم.' }] },
      { id: 'mus.samovar', title: 'سماور حاج‌بابا', cost: 170, layer: 'samovar', after: [{ who: 'bahman', text: 'داداش هر صبح اول این سماور رو روشن می‌کرد، بعد سلام می‌کرد.' }] },
      { id: 'mus.model', title: 'ماکت کوچه', cost: 172, layer: 'model', after: [{ who: 'kaveh', text: 'همه‌ی خونه‌ها، با مقیاس یک به پنجاه. سه ماه شب‌بیداری کشید.' }, { who: 'narges', text: 'و یه گهواره‌ی کوچیک تو حیاط ننه‌گلاب!', mood: 'happy' }] },
      { id: 'mus.ribbon', title: 'روبان افتتاح', cost: 174, layer: 'ribbon', after: [{ who: 'golab', text: 'قیچی رو بدید دست گلاب کوچولو. این موزه مال نسل اونه.' }] },
    ],
    outro: [
      { who: 'farokhi', text: 'کارشناس‌های میراث سه ساعت تو موزه موندن. سه ساعت!' },
      { who: 'kaveh', text: 'و…؟' },
      { who: 'farokhi', text: 'کوچه‌ی حاج‌بابا ثبت ملی شد. طرح تعریض لغو شد!', mood: 'happy' },
      { who: 'mahin', text: 'جشن! باید کل شهر خبردار بشه!', mood: 'happy' },
    ],
  },
  {
    id: 'heritage',
    name: 'جشن ثبت ملی',
    intro: [
      { who: 'reza', text: 'امشب نون سنگک مجانیه، برای کل شهر!' },
      { who: 'morteza', text: 'شربتم مجانیه… فقط امشب. فردا دوباره حساب‌کتاب!' },
      { who: 'narges', text: 'یه میز بلند وسط کوچه، از سردر تا آب‌انبار. همه با هم شام می‌خوریم.' },
    ],
    tasks: [
      { id: 'her.flags', title: 'پرچم‌ها و ریسه‌ها', cost: 172, layer: 'flags', after: [{ who: 'shirin', text: 'سبز و سفید و قرمز، از این سر کوچه تا اون سر!' }] },
      { id: 'her.table', title: 'میز شام کوچه', cost: 174, layer: 'table', after: [{ who: 'fakhri', text: 'چهل متر میز، صد و بیست صندلی. فکر کنم کمه.' }, { who: 'golab', text: 'زمین که هست، فخری‌جان. قدیما همه رو زمین می‌نشستن.' }] },
      { id: 'her.stage', title: 'سن و نوازنده‌ها', cost: 176, layer: 'stage', after: [{ who: 'bahman', text: 'تار داداش رو آوردم. چهل ساله دستم بهش نخورده… ولی امشب می‌زنم.' }] },
      { id: 'her.plaque', title: 'لوح ثبت ملی', cost: 178, layer: 'plaque', after: [{ who: 'farokhi', text: '«کوچه‌ی حاج‌بابا، ثبت‌شده در فهرست آثار ملی». روی سردر نصبش کنیم.' }] },
      { id: 'her.photo', title: 'عکس یادگاری محله', cost: 180, layer: 'photo', after: [{ who: 'narges', text: 'همه بیاید تو عکس! حاج‌بابا… اینم از کوچه‌ات. نجاتش دادیم.', mood: 'happy' }, { who: 'golab', text: 'اون از بالا داره می‌خنده، مادر. مطمئنم.', mood: 'sad' }] },
    ],
    outro: [
      { who: 'mahin', text: 'خبر داغ! … نه، این دفعه جدیه.', mood: 'surprised' },
      { who: 'mahin', text: 'برای شیرین خواستگار اومده. از تبریز!', mood: 'happy' },
      { who: 'shirin', text: 'خاله!!! قرار بود به کسی نگی!', mood: 'angry' },
      { who: 'narges', text: 'شیرین؟! … فصل بعد، باید همه‌چی رو برام تعریف کنی!', mood: 'happy' },
    ],
  },
  // ------------------------------------------------------------------ season 6: خواستگار تبریزی
  {
    id: 'carpetshop',
    name: 'حجره‌ی فرش آیدین',
    intro: [
      { who: 'shirin', text: 'باشه، باشه! اسمش آیدینه. فرش‌فروشه، از تبریز. اومده بود بازار تهران بار ببره…' },
      { who: 'mahin', text: '…و سر از آرایشگاه زنونه‌ی تو درآورد؟!', mood: 'surprised' },
      { who: 'shirin', text: 'خاله! اومده بود برای مادرش کارت هدیه بخره!', mood: 'angry' },
      { who: 'aydin', text: 'سلام به همه. شیرین گفت از این کوچه جایی نمی‌ره. پس من میام این‌جا. مغازه‌ی خالی ته کوچه رو اجاره کردم.' },
      { who: 'golab', text: 'پسر عاقلیه. تا حالا هیچ خواستگاری محله رو انتخاب نکرده بود.' },
    ],
    tasks: [
      { id: 'carpet.hang', title: 'فرش‌های آویز', cost: 180, layer: 'hang', after: [{ who: 'aydin', text: 'این یکی کار مادربزرگمه. شیش ماه پاش نشست. هر گره‌ش یه دعاست.' }] },
      { id: 'carpet.stack', title: 'دسته‌ی فرش‌های تاشده', cost: 182, layer: 'stack', after: [{ who: 'morteza', text: 'این همه فرش! قیمت دوستانه هم داری… برای همسایه‌ها؟' }, { who: 'aydin', text: 'برای همسایه‌ها، چای مجانی. فرش حساب‌کتاب داره!' }] },
      { id: 'carpet.loom', title: 'دار قالی کوچک', cost: 184, layer: 'loom', after: [{ who: 'fakhri', text: 'من بچه که بودم قالی می‌بافتم. … دستم هنوز یادشه.' }] },
      { id: 'carpet.lamp', title: 'چراغ حجره', cost: 186, layer: 'lamp', after: [{ who: 'kaveh', text: 'نور زرد برای فرش بهتره. رنگ‌ها گرم‌تر دیده می‌شن.' }] },
      { id: 'carpet.sign', title: 'تابلوی «فرش آیدین»', cost: 188, layer: 'sign', after: [{ who: 'aydin', text: 'حالا که حجره راه افتاد… شیرین خانم، اجازه می‌دی خانواده‌م بیان خواستگاری؟', mood: 'happy' }, { who: 'shirin', text: '…اول تو باید خانواده‌ی من رو ببینی. یعنی کل این کوچه رو!' }] },
    ],
    outro: [
      { who: 'aydin', text: 'پس کل کوچه بیاد تبریز! ننه‌م می‌گه مهمون حبیب خداست. هر چی بیشتر، بهتر.' },
      { who: 'reza', text: 'تبریز؟ همه با هم؟ … من نونوایی رو چی کار کنم؟', mood: 'surprised' },
      { who: 'golab', text: 'یه روز نون نپزی، دنیا به آخر نمی‌رسه، رضا. بلیط قطار رو بگیر!' },
    ],
  },
  {
    id: 'bazaar',
    name: 'بازار تبریز',
    intro: [
      { who: 'aydin', text: 'به بازار تبریز خوش اومدید! یکی از بزرگ‌ترین بازارهای سرپوشیده‌ی دنیا. ثبت جهانیه.' },
      { who: 'kaveh', text: 'این طاق‌ها… آجرکاری‌ش بی‌نظیره. ولی بعضی حجره‌ها خاک خورده.' },
      { who: 'aydin', text: 'حجره‌ی پدربزرگم همین‌جاست. سال‌هاست بسته‌ست. می‌خوام قبل از خواستگاری بازش کنم.' },
    ],
    tasks: [
      { id: 'baz.vaults', title: 'طاق‌های آجری', cost: 186, layer: 'vaults', after: [{ who: 'kaveh', text: 'هر طاق یه نورگیر داره. صدها سال پیش، بدون برق، کل بازار روشن بوده.' }] },
      { id: 'baz.spices', title: 'حجره‌ی ادویه', cost: 188, layer: 'spices', after: [{ who: 'golab', text: 'زعفرون، سماق، زردچوبه… بوی بازار قدیم تهران رو می‌ده.' }] },
      { id: 'baz.carpets', title: 'فرش‌های بازار', cost: 190, layer: 'carpets', after: [{ who: 'bahman', text: 'تو هامبورگ هم فرش تبریز داشتم. تنها چیزی بود که منو یاد خونه می‌نداخت.' }] },
      { id: 'baz.lanterns', title: 'فانوس‌های بازار', cost: 192, layer: 'lanterns', after: [{ who: 'mahin', text: 'از این‌جا یه عکس بگیرم برای گروه خانوادگی. همه از حسودی می‌ترکن!' }] },
      { id: 'baz.shop', title: 'حجره‌ی پدربزرگ', cost: 194, layer: 'shop', after: [{ who: 'aydin', text: 'پدربزرگم می‌گفت: «فرش خوب، مثل خانواده‌ی خوبه. گره‌هاش باید محکم باشه.»' }] },
    ],
    outro: [
      { who: 'aydin', text: 'امشب ننه‌م منتظرمونه. ولی قبلش… شیرین، بیا بریم ائل‌گلی. یه حرفی دارم.' },
      { who: 'mahin', text: 'ما هم میایم!' },
      { who: 'narges', text: 'خاله… این دفعه نه. بذار تنها برن.', mood: 'happy' },
    ],
  },
  {
    id: 'elgoli',
    name: 'عمارت ائل‌گلی',
    intro: [
      { who: 'shirin', text: 'وای… عمارت وسط دریاچه! ولی چرا چراغاش خاموشه؟' },
      { who: 'aydin', text: 'به شهرداری گفتم امشب روشنش کنن. گفتن «برای چی؟» گفتم «برای یه سؤال مهم.»' },
      { who: 'mahin', text: '(از پشت درخت) … من اصلاً این‌جا نیستم.', mood: 'surprised' },
    ],
    tasks: [
      { id: 'el.pavilion', title: 'عمارت وسط آب', cost: 192, layer: 'pavilion', after: [{ who: 'aydin', text: 'قاجارها این‌جا تابستون‌ها می‌اومدن. حالا مال همه‌ی مردمه.' }] },
      { id: 'el.lake', title: 'آب دریاچه', cost: 194, layer: 'lake', after: [{ who: 'shirin', text: 'آب صاف شد! ماه افتاده توش.' }] },
      { id: 'el.boats', title: 'قایق‌های پارویی', cost: 196, layer: 'boats', after: [{ who: 'aydin', text: 'پارو زدن بلدی؟ … نه؟ خب، من بلدم. تو فقط بشین.' }] },
      { id: 'el.fountains', title: 'فواره‌ها', cost: 198, layer: 'fountains', after: [{ who: 'shirin', text: 'آیدین… داری دستت رو تو جیبت می‌کنی. چی تو جیبته؟', mood: 'surprised' }] },
      { id: 'el.lights', title: 'چراغ‌های عمارت', cost: 200, layer: 'lights', after: [{ who: 'aydin', text: 'شیرین… با من ازدواج می‌کنی؟ قول می‌دم هیچ‌وقت از اون کوچه نبرمت.', mood: 'happy' }, { who: 'shirin', text: 'بله! … ولی اول باید ننه‌ت منو بپسنده!', mood: 'happy' }] },
    ],
    outro: [
      { who: 'mahin', text: '(از پشت درخت بیرون میاد) گفت بله! گفت بله! همه بدونن!', mood: 'happy' },
      { who: 'shirin', text: 'خاله!!!', mood: 'angry' },
      { who: 'aydin', text: 'حالا نوبت ننه‌ست. خدا به دادمون برسه.' },
    ],
  },
  {
    id: 'tabrizhome',
    name: 'خونه‌ی ننه‌ی آیدین',
    intro: [
      { who: 'aydin', text: 'ننه‌م فارسی کم بلده. ولی چشماش همه‌چی رو می‌فهمه.' },
      { who: 'golab', text: 'من ترکی یه کم بلدم. مادرم از اردبیل بود. … «خوش گلمیسیز»!' },
      { who: 'aydin', text: 'خونه‌ی ننه سرده، بخاری‌ش خرابه. تا ننه از بازار برگرده، گرمش کنیم.' },
    ],
    tasks: [
      { id: 'th.window', title: 'پنجره‌ی برفی', cost: 198, layer: 'window', after: [{ who: 'reza', text: 'برف میاد! تهران دو ساله این‌جوری برف ندیده.' }] },
      { id: 'th.rug', title: 'ورنی ارسباران', cost: 200, layer: 'rug', after: [{ who: 'fakhri', text: 'ورنی دستباف. گره‌هاش ریزه. ننه‌ت خانم باسلیقه‌ایه.' }] },
      { id: 'th.samovar', title: 'سماور و بخاری', cost: 202, layer: 'samovar', after: [{ who: 'golab', text: 'خونه گرم شد. حالا یه چای تبریزی با قند… مثل خونه‌ی مادرم.' }] },
      { id: 'th.saz', title: 'ساز عاشیقی پدربزرگ', cost: 204, layer: 'saz', after: [{ who: 'bahman', text: 'ساز عاشیقی! … یه آهنگ بلدم. مال جوونی‌مه. بذارید امتحان کنم.' }] },
      { id: 'th.sofreh', title: 'سفره‌ی کوفته تبریزی', cost: 206, layer: 'sofreh', after: [{ who: 'aydin', text: 'ننه اومد! … داره به سفره نگاه می‌کنه… داره لبخند می‌زنه!', mood: 'happy' }, { who: 'shirin', text: 'یعنی… قبول کرد؟', mood: 'surprised' }] },
    ],
    outro: [
      { who: 'aydin', text: 'ننه گفت: «این دختر با یه کوچه آدم اومده. همچین دختری رو نباید از دست داد.»', mood: 'happy' },
      { who: 'golab', text: 'بله‌برون رو تو کوچه‌ی خودمون می‌گیریم. ننه‌ی آیدین هم مهمون ماست!' },
    ],
  },
  {
    id: 'balehboron',
    name: 'جشن بله‌برون',
    intro: [
      { who: 'mahin', text: 'خانواده‌ی آیدین از تبریز اومدن، با سه تا ماشین شیرینی!' },
      { who: 'morteza', text: 'سه ماشین؟! … من فقط یه جعبه‌ی نون‌برنجی خریدم.', mood: 'surprised' },
      { who: 'narges', text: 'یه جشن ترکی‌ـ‌تهرونی! نصف ساز، نصف تنبک. یالا!' },
    ],
    tasks: [
      { id: 'bb.rings', title: 'سینی حلقه و انگشتر', cost: 204, layer: 'rings', after: [{ who: 'aydin', text: 'این انگشتر مال ننه‌م بود. حالا مال توئه، شیرین.' }] },
      { id: 'bb.sofreh', title: 'سفره‌ی بله‌برون', cost: 206, layer: 'sofreh', after: [{ who: 'fakhri', text: 'قرابیه‌ی تبریز و نون‌برنجی کرمانشاه، کنار هم. محله‌ی ما همینه دیگه.' }] },
      { id: 'bb.ashiq', title: 'عاشیق و ساز', cost: 208, layer: 'ashiq', after: [{ who: 'bahman', text: 'عاشیق از تبریز اومده، من هم تار داداش رو آوردم. امشب دوتایی می‌زنیم.' }] },
      { id: 'bb.lights', title: 'ریسه و فانوس', cost: 210, layer: 'lights', after: [{ who: 'reza', text: 'یالّی! همه دست همو بگیرید، دور حیاط!', mood: 'happy' }] },
      { id: 'bb.sweets', title: 'سینی شیرینی تبریزی', cost: 212, layer: 'sweets', after: [{ who: 'shirin', text: 'خاله مهین… این دفعه می‌تونی به همه بگی. هر کی رو دوست داری.', mood: 'happy' }, { who: 'mahin', text: 'بهترین خبر عمرم! … البته بعد از سه تا خبر قبلی.', mood: 'happy' }] },
    ],
    outro: [
      { who: 'morteza', text: 'آهای همسایه‌ها! یه نامه از دفتر اسناد رسمی اومده… به اسم من!', mood: 'surprised' },
      { who: 'morteza', text: '«ارثیه‌ی عمه‌ی مرحوم: یه خونه‌باغ قدیمی تو شمیرانات»… من؟! عمه داشتم؟!', mood: 'surprised' },
      { who: 'mahin', text: 'آقا مرتضی پولدار شد! فصل بعد خیلی خبر داره…', mood: 'happy' },
    ],
  },
  // ------------------------------------------------------------------ season 7: ارثیه‌ی آقا مرتضی
  {
    id: 'gardenhouse',
    name: 'خونه‌باغ شمیرون',
    intro: [
      { who: 'morteza', text: 'اینه؟ این خونه‌باغ منه؟ … این که جنگله! علف تا زانو!', mood: 'surprised' },
      { who: 'kaveh', text: 'خونه‌باغ قاجاریه، آقا مرتضی. یه کم کار داره، ولی گنجه.' },
      { who: 'morteza', text: 'گنج؟ پس زود تمیزش کنیم، بفروشیمش! یعنی… یه نگاهی بندازیم.' },
      { who: 'golab', text: 'عمه‌ت رو یادمه، مرتضی. زن نازنینی بود. هر عید برای بچه‌های کوچه عیدی می‌فرستاد.' },
    ],
    tasks: [
      { id: 'gh.gate', title: 'در باغ', cost: 210, layer: 'gate', after: [{ who: 'reza', text: 'در باز شد! … جیر جیرش تا تجریش رفت.' }] },
      { id: 'gh.path', title: 'خیابون‌باغ', cost: 212, layer: 'path', after: [{ who: 'kaveh', text: 'این خیابون‌باغ مستقیم می‌ره تا عمارت. قدیمیا به این می‌گفتن «محور».' }] },
      { id: 'gh.chenar', title: 'چنارهای کهن', cost: 214, layer: 'chenar', after: [{ who: 'bahman', text: 'این چنارها صد سالشونه. ما رفتیم و برگشتیم، اینا همین‌جا موندن.' }] },
      { id: 'gh.facade', title: 'نمای عمارت', cost: 216, layer: 'facade', after: [{ who: 'aydin', text: 'آجرکاری‌ش مثل بازار تبریزه! استادکار تبریزی ساخته، شک ندارم.' }] },
      { id: 'gh.stream', title: 'جوی آب', cost: 218, layer: 'stream', after: [{ who: 'morteza', text: 'آب راه افتاد… صداش رو بشنوید. … چرا این‌قدر آرومم؟', mood: 'surprised' }] },
    ],
    outro: [
      { who: 'morteza', text: 'یه دلال زنگ زد. گفت برای این باغ یه برج بیست طبقه می‌سازه. پول خوبی می‌ده.' },
      { who: 'farokhi', text: 'مرتضی‌خان… من یه روز همین حرف رو درباره‌ی کوچه‌ی شما زدم. یادته چی شد؟' },
      { who: 'morteza', text: '…بذارید اول زیرزمینش رو ببینیم. بعد تصمیم می‌گیرم.' },
    ],
  },
  {
    id: 'poolhouse',
    name: 'حوضخانه',
    intro: [
      { who: 'kaveh', text: 'حوضخونه! تابستونا این‌جا خنک‌ترین جای خونه بوده. آب از وسط می‌گذره.' },
      { who: 'shirin', text: 'آیدین، این کاشی‌ها رو ببین! همه‌ش ترک برداشته…' },
      { who: 'aydin', text: 'استادکار کاشی تبریزی می‌شناسم. یه زنگ بزنم، فردا این‌جاست.' },
    ],
    tasks: [
      { id: 'ph.pool', title: 'حوض هشت‌ضلعی', cost: 216, layer: 'pool', after: [{ who: 'golab', text: 'حوض هشت‌گوش. مادربزرگم می‌گفت هشت تا گوشه، هشت تا در بهشت.' }] },
      { id: 'ph.tiles', title: 'کاشی‌های دیوار', cost: 218, layer: 'tiles', after: [{ who: 'aydin', text: 'کاشی هفت‌رنگ. هر رنگ رو جدا پختن. صبر می‌خواد، مثل فرش.' }] },
      { id: 'ph.fountain', title: 'فواره‌ی سنگی', cost: 220, layer: 'fountain', after: [{ who: 'narges', text: 'گلاب کوچولو داره به فواره می‌خنده! اولین بارشه آب می‌بینه که بالا میره!', mood: 'happy' }] },
      { id: 'ph.niche', title: 'طاقچه‌ها', cost: 222, layer: 'niche', after: [{ who: 'morteza', text: 'تو این طاقچه یه جعبه بود… یه نامه توشه. به خط عمه‌م. به اسم من.', mood: 'surprised' }] },
      { id: 'ph.light', title: 'نورگیر سقف', cost: 224, layer: 'light', after: [{ who: 'morteza', text: '«مرتضی جان، تو تنها کسی بودی که بچه که بودی برام نون می‌خریدی. این باغ مال تو. ولی مال تو تنها نباشه.»', mood: 'sad' }] },
    ],
    outro: [
      { who: 'morteza', text: '«مال تو تنها نباشه»… یعنی چی؟' },
      { who: 'golab', text: 'یعنی عمه‌ت تو رو بهتر از خودت می‌شناخت، مرتضی.' },
      { who: 'mahin', text: 'آقا مرتضی گریه کرد! … نه، خاک رفت تو چشمش. باشه.', mood: 'surprised' },
    ],
  },
  {
    id: 'orchard',
    name: 'باغ میوه',
    intro: [
      { who: 'reza', text: 'پشت عمارت یه باغ میوه‌ست! گیلاس، آلبالو، زردآلو… همه‌ش خشک شده.' },
      { who: 'golab', text: 'درخت تشنه‌ست، نمرده. آبش بدید، هرسش کنید، سال دیگه بار می‌ده.' },
      { who: 'fakhri', text: 'من با پدرم باغ داشتیم. پیوند زدن بلدم. … بالاخره یه جا لازم شد!' },
    ],
    tasks: [
      { id: 'or.prune', title: 'هرس درخت‌ها', cost: 222, layer: 'prune', after: [{ who: 'fakhri', text: 'شاخه‌های خشک رفت. حالا درخت نفس می‌کشه.' }] },
      { id: 'or.water', title: 'آبیاری کرت‌ها', cost: 224, layer: 'water', after: [{ who: 'kaveh', text: 'قنات قدیمی هنوز آب داره. فقط مسیرش رو باز کردیم.' }] },
      { id: 'or.cherries', title: 'گیلاس و آلبالو', cost: 226, layer: 'cherries', after: [{ who: 'shirin', text: 'گیلاس‌ها رسیدن! گوشواره‌ی گیلاسی، مثل بچگی!', mood: 'happy' }] },
      { id: 'or.ladder', title: 'نردبون و سبدها', cost: 228, layer: 'ladder', after: [{ who: 'morteza', text: 'سبدها رو پر کنید، ببریم برای بچه‌های کوچه. … مجانی. آره، مجانی!' }] },
      { id: 'or.swing', title: 'تاب زیر درخت', cost: 230, layer: 'swing', after: [{ who: 'narges', text: 'تاب! گلاب کوچولو اولین تابش رو این‌جا خورد.', mood: 'happy' }] },
    ],
    outro: [
      { who: 'morteza', text: 'من تصمیمم رو گرفتم. این باغ رو نمی‌فروشم.' },
      { who: 'morteza', text: 'درش رو باز می‌کنیم. برای همه. یه باغ عمومی، به اسم عمه‌م.' },
      { who: 'farokhi', text: 'مرتضی‌خان… تو از من آدم بهتری شدی.', mood: 'happy' },
      { who: 'kaveh', text: 'قبل از افتتاح، تالار آینه‌ی عمارت باید درست بشه. اون‌جا قلب این خونه‌ست.' },
    ],
  },
  {
    id: 'mirrorhall',
    name: 'تالار آینه',
    intro: [
      { who: 'kaveh', text: 'آینه‌کاری قاجاری. هزاران تکه آینه‌ی کوچیک، با دست. نصفش ریخته.' },
      { who: 'aydin', text: 'استادکار کاشی گفت یه دوست آینه‌کار داره. اونم داره میاد.' },
      { who: 'mahin', text: 'تو آینه‌ها هزار تا خاله مهین می‌بینم! بالاخره یکی حرفم رو گوش می‌ده.' },
    ],
    tasks: [
      { id: 'mh.mirrors', title: 'آینه‌کاری سقف', cost: 228, layer: 'mirrors', after: [{ who: 'kaveh', text: 'یه شمع روشن کنی، هزار تا شمع می‌بینی. این بود جادوی قاجاری.' }] },
      { id: 'mh.orosi', title: 'ارسی‌های رنگی', cost: 230, layer: 'orosi', after: [{ who: 'bahman', text: 'مثل اتاق شاه‌نشین خونه‌ی پدری. همه‌ی خونه‌های خوب یه شکل خوشبختن.' }] },
      { id: 'mh.chandelier', title: 'چلچراغ بلور', cost: 232, layer: 'chandelier', after: [{ who: 'reza', text: 'چلچراغ رو آویزون کردیم. … دستم می‌لرزید. اگه می‌افتاد، یه عمر باید نون می‌پختم تا پولش رو بدم!' }] },
      { id: 'mh.carpet', title: 'فرش ابریشم', cost: 234, layer: 'carpet', after: [{ who: 'aydin', text: 'فرش ابریشم تبریز، هدیه‌ی ننه. گفت «باغ عمومی هم باید فرش آبرومند داشته باشه.»' }] },
      { id: 'mh.portrait', title: 'تصویر عمه‌خانم', cost: 236, layer: 'portrait', after: [{ who: 'morteza', text: 'عکس عمه‌م رو زدیم بالای تالار. … عمه‌جان، باغت رو نگه داشتم.', mood: 'sad' }] },
    ],
    outro: [
      { who: 'mahin', text: 'روز افتتاح رو اعلام کردم! کل شمیرون خبر دارن. کل تهران! کل…' },
      { who: 'golab', text: 'خب، خب، مهین. بریم جشن رو آماده کنیم.' },
    ],
  },
  {
    id: 'parkopening',
    name: 'افتتاح باغ عمومی',
    intro: [
      { who: 'morteza', text: 'امروز درِ «باغ عمه‌خانم» رو برای همه باز می‌کنیم. ورودی؟ … مجانی.' },
      { who: 'shirin', text: 'آقا مرتضی، تو رو خدا یه بار دیگه بگو! «مجانی»!', mood: 'happy' },
      { who: 'morteza', text: 'مجانی! … ولی بستنی‌فروشی کنار در مال خودمه. آدم باید یه درآمدی داشته باشه دیگه!' },
    ],
    tasks: [
      { id: 'po.ribbon', title: 'روبان سر در باغ', cost: 234, layer: 'ribbon', after: [{ who: 'golab', text: 'قیچی دست مرتضی. عمه‌ش از بالا داره کیف می‌کنه.' }] },
      { id: 'po.benches', title: 'نیمکت‌های باغ', cost: 236, layer: 'benches', after: [{ who: 'bahman', text: 'یه نیمکت زیر چنار. این‌جا می‌شینم و برای داداش نامه می‌نویسم. این بار پست می‌کنم.' }] },
      { id: 'po.flowers', title: 'باغچه‌های گل', cost: 238, layer: 'flowers', after: [{ who: 'fakhri', text: 'لاله و اطلسی و شمعدونی. … ننه‌گلاب، این دفعه رنگ‌ها رو با هم انتخاب کردیم.' }, { who: 'golab', text: 'آخرش دوست شدیم، فخری‌جان.', mood: 'happy' }] },
      { id: 'po.kiosk', title: 'دکه‌ی بستنی مرتضی', cost: 240, layer: 'kiosk', after: [{ who: 'morteza', text: 'بستنی سنتی، هر کدوم… نه، امروز همه مهمون من!', mood: 'happy' }] },
      { id: 'po.lights', title: 'فانوس‌های باغ', cost: 242, layer: 'lights', after: [{ who: 'narges', text: 'هفت فصل پیش فقط یه قهوه‌خونه‌ی خاک‌گرفته داشتیم. حالا یه کوچه، یه محله، یه باغ.', mood: 'happy' }] },
    ],
    outro: [
      { who: 'mahin', text: 'خبر داغ… این دفعه درباره‌ی خودمه!', mood: 'surprised' },
      { who: 'mahin', text: 'رادیو محلی زنگ زد. می‌خوان من یه برنامه داشته باشم: «خبرهای محله با خاله مهین»!', mood: 'happy' },
      { who: 'reza', text: 'خدا به داد کل تهران برسه!', mood: 'surprised' },
    ],
  },
  // ------------------------------------------------------------------ season 8: رادیو محله
  {
    id: 'radio',
    name: 'استودیوی رادیو محله',
    intro: [
      { who: 'mahin', text: 'رادیو محلی یه اتاق بهم داده، پشت پستخونه. ولی بیشتر شبیه انباریه تا استودیو!' },
      { who: 'kaveh', text: 'دیوارها رو عایق می‌کنیم که صدای بوق ماشین‌ها نیاد. یه میز صدا هم لازمه.' },
      { who: 'bahman', text: 'صفحه‌های قدیمی داداش رو میارم. ترانه‌های قدیمی تهران، برای لای برنامه.' },
    ],
    tasks: [
      { id: 'rad.foam', title: 'عایق صدای دیوارها', cost: 240, layer: 'foam', after: [{ who: 'kaveh', text: 'حالا اگه آقا مرتضی پشت در هم داد بزنه، این‌جا شنیده نمی‌شه.' }, { who: 'morteza', text: 'من کی داد زدم؟!', mood: 'angry' }] },
      { id: 'rad.records', title: 'قفسه‌ی صفحه‌ها', cost: 242, layer: 'records', after: [{ who: 'bahman', text: 'این صفحه رو داداش روز عروسیش گذاشت. هنوز خش نداره.' }] },
      { id: 'rad.desk', title: 'میز صدا', cost: 244, layer: 'desk', after: [{ who: 'aydin', text: 'این دکمه‌ها رو نزنید خاله… نه، اون یکی هم نه!' }] },
      { id: 'rad.mic', title: 'میکروفون و هدفون', cost: 246, layer: 'mic', after: [{ who: 'mahin', text: 'الو؟ الو؟ … صدای منو دارید؟ سلام تهران!', mood: 'happy' }] },
      { id: 'rad.onair', title: 'چراغ «روی آنتن»', cost: 248, layer: 'onair', after: [{ who: 'mahin', text: 'شنونده‌های عزیز، اولین تماس… از کوچه‌ی بهار. بفرمایید!' }] },
    ],
    outro: [
      { who: 'mahin', text: '(از رادیو) علی آقا از کوچه‌ی بهار می‌گه: «کوچه‌ی حاج‌بابا فقط بلده خونه تعمیر کنه. فوتبال بلد نیستن!»', mood: 'surprised' },
      { who: 'reza', text: 'چی؟! من بیست سال پیش دروازه‌بان تیم محله بودم!', mood: 'angry' },
      { who: 'mahin', text: 'پس رسمیه: جام محلات! کوچه‌ی حاج‌بابا در برابر کوچه‌ی بهار. ولی… ما زمین نداریم.' },
    ],
  },
  {
    id: 'pitch',
    name: 'زمین خاکی کوچه',
    intro: [
      { who: 'morteza', text: 'زمین خالی پشت آب‌انبار مال شهرداریه. ولی قول دادن یه سال بدن دست ما.' },
      { who: 'bahman', text: 'تو هامبورگ مربی تیم بچه‌ها بودم. … جدی می‌گم! سی سال.' },
      { who: 'aydin', text: 'من تو تبریز هافبک بودم. تراکتوری‌ام، ولی برای این کوچه می‌دوم!' },
    ],
    tasks: [
      { id: 'pit.lines', title: 'خط‌کشی زمین', cost: 246, layer: 'lines', after: [{ who: 'kaveh', text: 'با گچ خط کشیدیم. صاف و دقیق، مثل نقشه‌ی معماری.' }] },
      { id: 'pit.goals', title: 'دروازه‌ها', cost: 248, layer: 'goals', after: [{ who: 'reza', text: 'دروازه! حالا ببینم کی جرئت داره از من گل بزنه.' }] },
      { id: 'pit.nets', title: 'تور دروازه', cost: 250, layer: 'nets', after: [{ who: 'golab', text: 'تورش رو خودم بافتم، از نخ قالی. محکم‌تر از این پیدا نمی‌شه.' }] },
      { id: 'pit.bench', title: 'نیمکت ذخیره‌ها', cost: 252, layer: 'bench', after: [{ who: 'morteza', text: 'من رو نیمکت می‌شینم. مربی دوم. … بالاخره یکی باید آب‌معدنی‌ها رو بشمره!' }] },
      { id: 'pit.light', title: 'نورافکن', cost: 254, layer: 'light', after: [{ who: 'fakhri', text: 'تمرین هر شب ساعت هشت. هر کی دیر بیاد، با من طرفه.', mood: 'angry' }, { who: 'kaveh', text: 'مادرم مدیر تیم شده. خدا به داد تیم برسه.' }] },
    ],
    outro: [
      { who: 'narges', text: 'تیم آماده‌ست، ولی تماشاگر کجا بشینه؟ کوچه‌ی بهار با صد نفر میان!' },
      { who: 'shirin', text: 'سکو می‌سازیم! با پرچم و طبل. باید بلندتر از اونا داد بزنیم!' },
    ],
  },
  {
    id: 'stands',
    name: 'سکوی تماشاگرها',
    intro: [
      { who: 'shirin', text: 'من و نرگس لیدر تماشاگرهاییم! شعارهامون رو هم نوشتیم.' },
      { who: 'mahin', text: 'منم گزارشگرم. از همین الان تمرین می‌کنم: «گـــــــــــل!»', mood: 'happy' },
      { who: 'golab', text: 'یه فلاسک چای و یه قابلمه دلمه میارم. فوتبال بی‌دلمه نمی‌شه.' },
    ],
    tasks: [
      { id: 'st.seats', title: 'سکوهای بتنی', cost: 252, layer: 'seats', after: [{ who: 'kaveh', text: 'پنج ردیف سکو. هر ردیف یه رنگ، از کاشی‌های اضافه‌ی حوضخونه.' }] },
      { id: 'st.banner', title: 'بنر «کوچه‌ی حاج‌بابا»', cost: 254, layer: 'banner', after: [{ who: 'narges', text: 'بنر رو بچه‌های کتابخونه نقاشی کردن. عکس سماور هم داره!' }] },
      { id: 'st.drums', title: 'طبل و شیپور', cost: 256, layer: 'drums', after: [{ who: 'reza', text: 'طبل نونوایی! هر صبح باهاش خمیر می‌کوبیدم… شوخی کردم.' }] },
      { id: 'st.score', title: 'تابلوی امتیاز', cost: 258, layer: 'score', after: [{ who: 'aydin', text: 'تابلوی دستی. شماره‌ها رو خودمون عوض می‌کنیم. امیدوارم زیاد کار داشته باشه!' }] },
      { id: 'st.flags', title: 'پرچم‌های محله', cost: 260, layer: 'flags', after: [{ who: 'shirin', text: 'یه، دو، سه… «کوچه، کوچه، حاج‌بابا!»', mood: 'happy' }] },
    ],
    outro: [
      { who: 'mahin', text: 'شنونده‌های عزیز! فردا شب، فینال جام محلات. پخش زنده، فقط از رادیو محله!' },
      { who: 'reza', text: 'امشب نمی‌تونم بخوابم. بیست ساله دستکش دروازه‌بانی دستم نکردم.' },
    ],
  },
  {
    id: 'final',
    name: 'فینال جام محلات',
    intro: [
      { who: 'mahin', text: '«سلام به همه‌ی شنونده‌ها! هوا خنکه، سکوها پره، و داور… داور هنوز نیومده!»', mood: 'surprised' },
      { who: 'farokhi', text: 'داور منم. بی‌طرف‌ترین آدم این شهر. … کسی که یه روز می‌خواست هر دو کوچه رو بخره!' },
      { who: 'bahman', text: 'بچه‌ها، فقط یه چیز: با هم بازی کنید. مثل وقتی کوچه رو ساختید.' },
    ],
    tasks: [
      { id: 'fin.booth', title: 'جایگاه گزارشگر', cost: 258, layer: 'booth', after: [{ who: 'mahin', text: '«توپ دست آیدینه… پاس به کاوه… کاوه شوت می‌زنه… گـــــل!!!»', mood: 'happy' }] },
      { id: 'fin.ball', title: 'توپ فینال', cost: 260, layer: 'ball', after: [{ who: 'mahin', text: '«کوچه‌ی بهار جواب داد. یک ـ یک. آقا مرتضی از نیمکت داره به داور اعتراض می‌کنه!»' }, { who: 'morteza', text: 'آفساید بود! به خدا آفساید بود!', mood: 'angry' }] },
      { id: 'fin.lights', title: 'نورافکن‌های فینال', cost: 262, layer: 'lights', after: [{ who: 'mahin', text: '«دقیقه‌ی آخر! پنالتی برای کوچه‌ی بهار! همه‌ی چشم‌ها به اوستا رضاست…»', mood: 'surprised' }] },
      { id: 'fin.save', title: 'دستکش اوستا رضا', cost: 264, layer: 'save', after: [{ who: 'mahin', text: '«گرفت! گرفت! اوستا رضا پنالتی رو گرفت!!!»', mood: 'happy' }, { who: 'reza', text: 'بیست سال… بیست سال منتظر این لحظه بودم.', mood: 'happy' }] },
      { id: 'fin.trophy', title: 'جام قهرمانی', cost: 266, layer: 'trophy', after: [{ who: 'mahin', text: '«سوت پایان! کوچه‌ی حاج‌بابا قهرمان جام محلات!»', mood: 'happy' }, { who: 'farokhi', text: 'علی آقا از کوچه‌ی بهار اومد دست داد. گفت سال دیگه انتقام می‌گیرن.' }] },
    ],
    outro: [
      { who: 'mahin', text: 'رادیو می‌گه برنامه‌ی دیشب پرشنونده‌ترین برنامه‌ی سال بوده! گزارش من رو تو شبکه‌ها پخش کردن!', mood: 'happy' },
      { who: 'golab', text: 'پس جشن بگیریم. یه جشن درست و حسابی، با دهل و سرنا!' },
    ],
  },
  {
    id: 'victory',
    name: 'جشن قهرمانی',
    intro: [
      { who: 'aydin', text: 'وانت رو گل‌زدیم. جام رو می‌ذاریم پشتش و کل محله رو دور می‌زنیم!' },
      { who: 'morteza', text: 'وانت من! … باشه، فقط امشب. فقط برای جام.' },
      { who: 'reza', text: 'نون و پنیر و سبزی برای همه. امشب نونوایی تا صبح بازه!' },
    ],
    tasks: [
      { id: 'vic.truck', title: 'وانت گل‌زده', cost: 264, layer: 'truck', after: [{ who: 'shirin', text: 'گل‌های باغ عمه‌خانم! آقا مرتضی اجازه داد بچینیم.' }, { who: 'morteza', text: 'فقط گل‌های پژمرده رو… ای بابا، همه رو چیدید؟!', mood: 'surprised' }] },
      { id: 'vic.dohol', title: 'دهل و سرنا', cost: 266, layer: 'dohol', after: [{ who: 'bahman', text: 'دهل که بزنن، دیگه پیر و جوون نداره. همه باید برقصن!' }] },
      { id: 'vic.sweets', title: 'شیرینی و شربت', cost: 268, layer: 'sweets', after: [{ who: 'fakhri', text: 'شربت آلبالو از باغ میوه. گیلاس‌ها هم برای سال دیگه.' }] },
      { id: 'vic.lights', title: 'ریسه‌های جشن', cost: 270, layer: 'lights', after: [{ who: 'narges', text: 'کوچه‌ای که یه روز می‌خواستن خرابش کنن، امشب از همه‌ی تهران روشن‌تره.', mood: 'happy' }] },
      { id: 'vic.photo', title: 'عکس تیم قهرمان', cost: 272, layer: 'photo', after: [{ who: 'mahin', text: 'این عکس رو کنار عکس حاج‌بابا تو موزه می‌زنیم. تاریخ این کوچه داره نوشته می‌شه!', mood: 'happy' }] },
    ],
    outro: [
      { who: 'golab', text: 'بچه‌ها… من یه آرزو دارم. قبل از اینکه خیلی پیر بشم، یه بار دیگه دریای شمال رو ببینم.', mood: 'sad' },
      { who: 'narges', text: 'پس امسال نوروز، کل کوچه با هم می‌ریم شمال!', mood: 'happy' },
      { who: 'mahin', text: 'سفر شمال؟ با این همه آدم؟ … فصل بعد خیلی شلوغه!', mood: 'surprised' },
    ],
  },
];

export function findTask(id: string): { place: Place; task: Task; index: number } | null {
  for (const place of PLACES) {
    const index = place.tasks.findIndex((t) => t.id === id);
    if (index >= 0) return { place, task: place.tasks[index], index };
  }
  return null;
}
