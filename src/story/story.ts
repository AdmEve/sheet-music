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
];

export function findTask(id: string): { place: Place; task: Task; index: number } | null {
  for (const place of PLACES) {
    const index = place.tasks.findIndex((t) => t.id === id);
    if (index >= 0) return { place, task: place.tasks[index], index };
  }
  return null;
}
