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
  sona: { id: 'sona', name: 'سونا‌خانم', role: 'مادر آیدین، از تبریز' },
  yadollah: { id: 'yadollah', name: 'عمو یدالله', role: 'سرایدار کاروانسرا' },
  jalal: { id: 'jalal', name: 'استاد جلال', role: 'مقنی پیر یزدی' },
  sepideh: { id: 'sepideh', name: 'سپیده', role: 'مجری برنامه‌ی آشپزی' },
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
  sona: ['ساغ اول قیزیم! الهی خیر ببینی.', 'آیدین راست می‌گفت، این کوچه یه چیز دیگه‌ست.', 'به این می‌گن سلیقه! مثل گل‌های ائل‌گلی.'],
  yadollah: ['خدا قوت جوون!', 'قندی هم ازت ممنونه.', 'دستت درد نکنه. مثل بارون تو کویر بودی.'],
  jalal: ['خیر ببینی بابا.', 'مثل آب قنات، زلال و به‌موقع!', 'حاجی بود حتماً بهت می‌نازید.'],
  sepideh: ['عالی بود! دوربین، کات!', 'این صحنه رو باید دوباره پخش کنیم!', 'بیننده‌هامون عاشقت می‌شن!'],
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
  // ------------------------------------------------------------------ season 9: سفر شمال
  {
    id: 'station',
    name: 'ایستگاه قطار',
    intro: [
      { who: 'kaveh', text: 'قطار تهران ـ ساری، از روی پل ورسک. ننه‌گلاب، شصت سال پیش با همین قطار رفتید؟' },
      { who: 'golab', text: 'با پدرم. هفت سالم بود. از پنجره دست بیرون آوردم، ابرها رو گرفتم.' },
      { who: 'morteza', text: 'ایستگاه درب‌وداغونه! تا قطار بیاد، یه دستی به سر و روش بکشیم.' },
    ],
    tasks: [
      { id: 'sta.benches', title: 'نیمکت‌های سکو', cost: 270, layer: 'benches', after: [{ who: 'reza', text: 'نیمکت‌ها رو رنگ زدیم. حالا مسافرها با خیال راحت منتظر می‌مونن.' }] },
      { id: 'sta.clock', title: 'ساعت ایستگاه', cost: 272, layer: 'clock', after: [{ who: 'bahman', text: 'ساعت راه افتاد. چهل سال منتظر قطار برگشت بودم؛ این بار سر وقت رسیدم.' }] },
      { id: 'sta.booth', title: 'باجه‌ی بلیط', cost: 274, layer: 'booth', after: [{ who: 'morteza', text: 'بیست و هفت تا بلیط! تخفیف گروهی گرفتم. … مفت، نه. ولی ارزون!' }] },
      { id: 'sta.luggage', title: 'چمدون‌ها', cost: 276, layer: 'luggage', after: [{ who: 'fakhri', text: 'فقط هفت تا چمدون آوردم. برای یه هفته کمه، ولی کنار میام.' }, { who: 'kaveh', text: 'مادر… هفت تا؟!', mood: 'surprised' }] },
      { id: 'sta.lamps', title: 'فانوس‌های سکو', cost: 278, layer: 'lamps', after: [{ who: 'narges', text: 'سوت قطار! همه سوار شید! گلاب کوچولو، اولین سفرت!', mood: 'happy' }] },
    ],
    outro: [
      { who: 'golab', text: '(از پنجره‌ی قطار) ابرها… هنوز همون‌جان. فقط من پیر شدم.', mood: 'sad' },
      { who: 'aydin', text: 'نه ننه‌گلاب. شما فقط بیشتر دیدی. بزرگ‌تر شدی.' },
    ],
  },
  {
    id: 'seavilla',
    name: 'ویلای کنار دریا',
    intro: [
      { who: 'farokhi', text: 'ویلای دوستمه، کنار دریا. گفت «هر وقت خواستی». فکر نکنم منظورش بیست و هفت نفر بود.' },
      { who: 'shirin', text: 'وای! دریا! … ولی ویلا چرا این‌قدر خاک‌گرفته‌ست؟' },
      { who: 'golab', text: 'اول خونه رو آب و جارو کنیم. دریا جایی نمی‌ره، مادر.' },
    ],
    tasks: [
      { id: 'sv.porch', title: 'ایوون چوبی', cost: 276, layer: 'porch', after: [{ who: 'kaveh', text: 'ایوون رو به دریاست. معمار این ویلا آدم باذوقی بوده.' }] },
      { id: 'sv.hammock', title: 'ننو زیر درخت', cost: 278, layer: 'hammock', after: [{ who: 'morteza', text: 'من دیگه از این ننو پا نمی‌شم. بقالی؟ کدوم بقالی؟' }] },
      { id: 'sv.grill', title: 'منقل کباب', cost: 280, layer: 'grill', after: [{ who: 'reza', text: 'جوجه‌کباب با برنج شمالی! سنگک ندارم، ولی کته‌ی خوبی بلدم.' }] },
      { id: 'sv.umbrellas', title: 'چترهای ساحلی', cost: 282, layer: 'umbrellas', after: [{ who: 'aydin', text: 'دریاچه‌ی ائل‌گلی قشنگه، ولی دریا یه چیز دیگه‌ست!' }] },
      { id: 'sv.lights', title: 'چراغ‌های ایوون', cost: 284, layer: 'lights', after: [{ who: 'golab', text: 'صدای موج… شب‌ها تا صبح بیدار می‌مونم و گوش می‌دم.', mood: 'happy' }] },
    ],
    outro: [
      { who: 'fakhri', text: 'فردا می‌ریم شالیزار. پدرم یه زمانی این‌جا برنج می‌کاشت. … آره، منم شمالی‌ام. تعجب کردید؟' },
      { who: 'mahin', text: 'فخری‌خانم شمالیه؟! چهل ساله تو این محله‌ام، این رو نمی‌دونستم!', mood: 'surprised' },
    ],
  },
  {
    id: 'paddy',
    name: 'شالیزار',
    intro: [
      { who: 'fakhri', text: 'این‌جا خونه‌ی پدری منه. کومه‌ش هنوز سرپاست. شالیزار ولی سال‌هاست کاشته نشده.' },
      { who: 'kaveh', text: 'مادر… هیچ‌وقت نگفته بودی.' },
      { who: 'fakhri', text: 'آدم بعضی چیزها رو نمی‌گه، پسرم. تا وقتی که آماده باشه.' },
    ],
    tasks: [
      { id: 'pad.water', title: 'آب کرت‌ها', cost: 282, layer: 'water', after: [{ who: 'fakhri', text: 'آب که تو کرت می‌افته، آسمون توش پیدا می‌شه. اینو پدرم یادم داد.' }] },
      { id: 'pad.seedlings', title: 'نشای برنج', cost: 284, layer: 'seedlings', after: [{ who: 'shirin', text: 'تا زانو تو گل! ولی چه کیفی داره!', mood: 'happy' }] },
      { id: 'pad.kumeh', title: 'کومه‌ی گالی‌پوش', cost: 286, layer: 'kumeh', after: [{ who: 'golab', text: 'سقف گالی‌پوش! بوی کاه نم‌خورده… بچگی‌م رو بهم برگردوندید.' }] },
      { id: 'pad.scarecrow', title: 'مترسک', cost: 288, layer: 'scarecrow', after: [{ who: 'reza', text: 'مترسک رو شبیه آقا مرتضی ساختیم! کلاهش رو ببینید!' }, { who: 'morteza', text: 'خیلی هم شبیه نیست! … فقط یه کم.' }] },
      { id: 'pad.sunset', title: 'غروب شالیزار', cost: 290, layer: 'sunset', after: [{ who: 'fakhri', text: 'بابا… شالیزارت دوباره سبز شد.', mood: 'sad' }, { who: 'golab', text: 'گریه کن، فخری‌جان. بعضی گریه‌ها قشنگن.' }] },
    ],
    outro: [
      { who: 'aydin', text: 'فردا بریم ماسوله! یه روستا که پشت‌بوم هر خونه، حیاط خونه‌ی بالاییه.' },
      { who: 'mahin', text: 'یعنی آدم رو سر همسایه راه می‌ره؟ عینهو محله‌ی خودمون!', mood: 'happy' },
    ],
  },
  {
    id: 'masuleh',
    name: 'روستای ماسوله',
    intro: [
      { who: 'kaveh', text: 'ماسوله! خونه‌ها پله‌پله روی کوه. هزار ساله این‌جوری زندگی می‌کنن.' },
      { who: 'bahman', text: 'مه داره میاد. ماسوله تو مه، مثل یه نقاشی می‌مونه.' },
      { who: 'narges', text: 'یه قهوه‌خونه‌ی کوچیک این بالاست. … شبیه قهوه‌خونه‌ی حاج‌بابا!' },
    ],
    tasks: [
      { id: 'mas.roofs', title: 'پشت‌بوم‌های پله‌ای', cost: 288, layer: 'roofs', after: [{ who: 'kaveh', text: 'هر پشت‌بوم، کوچه‌ی خونه‌ی بالاییه. اینجا همسایه‌ها واقعاً روی هم زندگی می‌کنن.' }] },
      { id: 'mas.windows', title: 'پنجره‌های چوبی', cost: 290, layer: 'windows', after: [{ who: 'shirin', text: 'قاب‌های زرد! همه‌ی خونه‌ها یه رنگن، مثل یه خونواده.' }] },
      { id: 'mas.flowers', title: 'گلدون‌های لب پنجره', cost: 292, layer: 'flowers', after: [{ who: 'golab', text: 'شمعدونی، مثل حیاط خودمون. گل‌ها همه جا یه زبون دارن.' }] },
      { id: 'mas.teahouse', title: 'قهوه‌خونه‌ی کوهستان', cost: 294, layer: 'teahouse', after: [{ who: 'narges', text: 'یه استکان چای تو ماسوله… حاج‌بابا، کاش این‌جا بودی.', mood: 'sad' }] },
      { id: 'mas.lanterns', title: 'فانوس‌ها در مه', cost: 296, layer: 'lanterns', after: [{ who: 'bahman', text: 'فانوس‌ها تو مه… انگار ستاره‌ها اومدن پایین قدم بزنن.', mood: 'happy' }] },
    ],
    outro: [
      { who: 'mahin', text: 'فردا سیزده‌به‌دره! کنار دریا. سبزه‌ها رو آوردید؟' },
      { who: 'golab', text: 'سبزه‌م از قبل عید تو قطار همراهمه. می‌خوام خودم به آب بدمش.' },
    ],
  },
  {
    id: 'sizdah',
    name: 'سیزده‌به‌در کنار دریا',
    intro: [
      { who: 'narges', text: 'روز آخر سفر. همه کنار دریا، با سفره و سبزه و بادبادک!' },
      { who: 'reza', text: 'کاهو سکنجبین با من! سکنجبینش رو دیشب جوشوندم.' },
      { who: 'shirin', text: 'دخترها! سبزه گره بزنیم، آرزو کنیم!' },
    ],
    tasks: [
      { id: 'siz.sofreh', title: 'سفره‌ی کنار دریا', cost: 294, layer: 'sofreh', after: [{ who: 'fakhri', text: 'میرزاقاسمی و باقلاقاتق، غذای شمالی. … امروز آشپز منم.' }] },
      { id: 'siz.kites', title: 'بادبادک‌ها', cost: 296, layer: 'kites', after: [{ who: 'aydin', text: 'بادبادک طاووسی کاوه بالاتر از همه! باد شمال یه چیز دیگه‌ست.' }] },
      { id: 'siz.lettuce', title: 'کاهو سکنجبین', cost: 298, layer: 'lettuce', after: [{ who: 'morteza', text: 'یه کاسه‌ی دیگه بده رضا… نه، دو تا! امروز رژیم ندارم.' }] },
      { id: 'siz.sabzeh', title: 'سبزه به آب', cost: 300, layer: 'sabzeh', after: [{ who: 'golab', text: 'سبزه‌م رو دادم به دریا. یه آرزو کردم… که این کوچه همیشه همین‌جوری بمونه.', mood: 'sad' }] },
      { id: 'siz.photo', title: 'عکس کنار دریا', cost: 302, layer: 'photo', after: [{ who: 'golab', text: 'شصت سال منتظر بودم دوباره دریا رو ببینم. این بار با همه‌ی خونواده‌م.', mood: 'happy' }, { who: 'narges', text: 'ما همیشه خونواده‌تیم، ننه‌گلاب.', mood: 'happy' }] },
    ],
    outro: [
      { who: 'kaveh', text: 'نرگس… یه ایمیل اومده. از اصفهان. می‌خوان من سرپرست مرمت یه خونه‌ی صفوی بشم.', mood: 'surprised' },
      { who: 'narges', text: 'اصفهان؟! … یعنی از کوچه بریم؟', mood: 'sad' },
      { who: 'mahin', text: 'نه! هیچ‌کس از این کوچه جایی نمی‌ره! … فصل بعد، باید یه فکری بکنیم.', mood: 'angry' },
    ],
  },
  // ------------------------------------------------------------------ season 10: اصفهان
  {
    id: 'safavid',
    name: 'خونه‌ی صفوی',
    intro: [
      { who: 'kaveh', text: 'یه ماه این‌جام، فقط برای دیدن کار. بعد تصمیم می‌گیرم. قول.' },
      { who: 'golab', text: 'یه ماه؟ ما هم میایم! … اصفهان نصف جهانه، ما که نصف جهان رو ندیدیم.' },
      { who: 'narges', text: 'کل کوچه دوباره سفر! این دفعه با اتوبوس.' },
      { who: 'kaveh', text: 'خونه‌ی صفوی چهارصد سالشه. ایوونش ترک برداشته، حوضش خشکه.' },
    ],
    tasks: [
      { id: 'saf.iwan', title: 'ایوون مقرنس', cost: 300, layer: 'iwan', after: [{ who: 'kaveh', text: 'مقرنس‌کاری… مثل لونه‌ی زنبور، ولی از گچ. هر تکه رو با دست تراشیدن.' }] },
      { id: 'saf.pool', title: 'حوض حیاط', cost: 302, layer: 'pool', after: [{ who: 'golab', text: 'حوض همه‌ی خونه‌های قدیمی شبیه همه. انگار همه یه مادر دارن.' }] },
      { id: 'saf.garden', title: 'باغچه‌ی چهارباغ', cost: 304, layer: 'garden', after: [{ who: 'fakhri', text: 'چهار باغچه، با جوی آب وسطش. نقشه‌ی بهشت ایرانی.' }] },
      { id: 'saf.doors', title: 'درهای گره‌چینی', cost: 306, layer: 'doors', after: [{ who: 'aydin', text: 'این گره‌چینی کار یه عمره. استادکارش لابد مثل ننه‌ی من صبور بوده.' }] },
      { id: 'saf.lights', title: 'چراغ‌های ایوون', cost: 308, layer: 'lights', after: [{ who: 'kaveh', text: 'مدیر میراث گفت کار من بهترین مرمت سال بوده. می‌خوان اینجا بمونم…', mood: 'surprised' }] },
    ],
    outro: [
      { who: 'narges', text: 'کاوه… هر تصمیمی بگیری، باهاتم. ولی امشب فقط بریم کنار زاینده‌رود.' },
      { who: 'kaveh', text: 'امشب فقط زاینده‌رود. قول.' },
    ],
  },
  {
    id: 'siosepol',
    name: 'سی‌وسه‌پل',
    intro: [
      { who: 'bahman', text: 'سی و سه تا طاق. جوون که بودیم، زیر این پل آواز می‌خوندیم.' },
      { who: 'reza', text: 'زاینده‌رود آب داره! چه شانسی. … ولی چراغ‌های پل خاموشه.' },
      { who: 'shirin', text: 'خاموش؟ ما اینجاییم که روشنش کنیم!' },
    ],
    tasks: [
      { id: 'sio.arches', title: 'طاق‌های پل', cost: 306, layer: 'arches', after: [{ who: 'kaveh', text: 'چهارصد ساله این آجرها روی هم‌اند. معمارهای اون زمان استاد ما هستن.' }] },
      { id: 'sio.river', title: 'آب زاینده‌رود', cost: 308, layer: 'river', after: [{ who: 'golab', text: 'رودخونه‌ی پر، شهر رو زنده می‌کنه. مثل آب حوض که حیاط رو.' }] },
      { id: 'sio.lights', title: 'چراغ‌های طاق‌ها', cost: 310, layer: 'lights', after: [{ who: 'mahin', text: 'شنونده‌های عزیز! زنده از سی‌وسه‌پل… قشنگ‌ترین شب عمرم!', mood: 'happy' }] },
      { id: 'sio.boat', title: 'قایق‌های پدالی', cost: 312, layer: 'boat', after: [{ who: 'morteza', text: 'قایق قویی! … چرا من باید پدال بزنم؟ چرا همیشه من؟', mood: 'angry' }] },
      { id: 'sio.song', title: 'آواز زیر پل', cost: 314, layer: 'song', after: [{ who: 'bahman', text: 'داداش… این آواز رو برای تو می‌خونم. زیر همون طاقی که با هم می‌خوندیم.', mood: 'sad' }] },
    ],
    outro: [
      { who: 'aydin', text: 'فردا میدون نقش جهان! میدونی که از تبریز هم معروف‌تره… فقط یه کم!' },
      { who: 'kaveh', text: 'تو میدون یه کارگاه مرمت دارن. می‌خوام ببینم چی کار می‌کنن.' },
    ],
  },
  {
    id: 'naqshejahan',
    name: 'میدان نقش جهان',
    intro: [
      { who: 'golab', text: 'وای… این همه گنبد و کاشی! حاج‌بابا همیشه می‌گفت قبل از مردن باید اینجا رو ببینم.', mood: 'surprised' },
      { who: 'narges', text: 'دلیجان‌ها رو نگاه کن! سوار شیم؟' },
      { who: 'kaveh', text: 'میدون صدها ساله. ولی حوض وسطش و طاق‌نماهای دورش هر سال مرمت می‌خوان.' },
    ],
    tasks: [
      { id: 'nq.arcade', title: 'طاق‌نماهای میدان', cost: 312, layer: 'arcade', after: [{ who: 'kaveh', text: 'دو طبقه طاق‌نما، دور تا دور میدون. یه قاب برای کل شهر.' }] },
      { id: 'nq.pool', title: 'حوض بزرگ', cost: 314, layer: 'pool', after: [{ who: 'shirin', text: 'فواره‌ها! گلاب کوچولو داره دنبال کبوترها می‌دوه!', mood: 'happy' }] },
      { id: 'nq.carriage', title: 'دلیجان', cost: 316, layer: 'carriage', after: [{ who: 'fakhri', text: 'یه دور دلیجان سواری. … من هیچ‌وقت این‌قدر خوش نگذرونده بودم.', mood: 'happy' }] },
      { id: 'nq.domes', title: 'گنبدهای فیروزه‌ای', cost: 318, layer: 'domes', after: [{ who: 'golab', text: 'حاج‌بابا، دیدمش. همون‌جوری که می‌گفتی. آبی‌تر از آسمون.', mood: 'sad' }] },
      { id: 'nq.lanterns', title: 'فانوس‌های شب', cost: 320, layer: 'lanterns', after: [{ who: 'narges', text: 'شب میدون… مثل شب کوچه‌ی خودمون. فقط هزار برابر بزرگ‌تر.' }] },
    ],
    outro: [
      { who: 'kaveh', text: 'تو بازار قیصریه یه استاد مینیاتور هست. نود سالشه، ولی شاگرد نداره.' },
      { who: 'kaveh', text: 'گفت: «هنری که شاگرد نداشته باشه، با استادش می‌میره.» … تمام راه بهش فکر کردم.' },
    ],
  },
  {
    id: 'workshop',
    name: 'کارگاه هنرهای اصفهان',
    intro: [
      { who: 'mahin', text: 'استاد مینیاتور گفت هر کی بخواد، یه چیزی یادش می‌ده. من مینا کاری می‌خوام!' },
      { who: 'aydin', text: 'منم قلم‌زنی. پدربزرگم همیشه می‌گفت دستت باید یه هنر بلد باشه.' },
      { who: 'kaveh', text: 'کارگاه خاک خورده. قبل از کلاس، باید سر پا بشه.' },
    ],
    tasks: [
      { id: 'ws.easels', title: 'سه‌پایه‌های نقاشی', cost: 318, layer: 'easels', after: [{ who: 'shirin', text: 'اولین مینیاتورم! … یه گل که شبیه گربه شده. ولی با عشق کشیدمش!', mood: 'happy' }] },
      { id: 'ws.mina', title: 'میز میناکاری', cost: 320, layer: 'mina', after: [{ who: 'mahin', text: 'آبی مینا… رنگش از آسمون اصفهان دزدیده شده!' }] },
      { id: 'ws.ghalam', title: 'قلم‌زنی روی مس', cost: 322, layer: 'ghalam', after: [{ who: 'aydin', text: 'تق، تق، تق… هر ضربه یه خط. مثل گره‌ی فرش، صبر می‌خواد.' }] },
      { id: 'ws.khatam', title: 'جعبه‌ی خاتم', cost: 324, layer: 'khatam', after: [{ who: 'reza', text: 'هزار تا تکه‌ی ریز چوب و استخون… این رو چه جوری می‌سازن؟!', mood: 'surprised' }] },
      { id: 'ws.window', title: 'پنجره‌ی کارگاه', cost: 326, layer: 'window', after: [{ who: 'kaveh', text: 'تصمیمم رو گرفتم. برمی‌گردیم. ولی دست خالی نه.', mood: 'happy' }] },
    ],
    outro: [
      { who: 'kaveh', text: 'تو کوچه‌ی خودمون یه مدرسه‌ی مرمت باز می‌کنیم. استاد مینیاتور هم ماهی یه بار میاد درس می‌ده.' },
      { who: 'narges', text: 'یعنی… می‌مونیم؟', mood: 'happy' },
      { who: 'kaveh', text: 'جای ما همون‌جاست، نرگس. هنر رو باید برد جایی که آدم‌هاش رو دوست داری.', mood: 'happy' },
    ],
  },
  {
    id: 'restoschool',
    name: 'مدرسه‌ی مرمت کوچه',
    intro: [
      { who: 'farokhi', text: 'طبقه‌ی دوم پاساژ هم خالیه. مدرسه‌ی مرمت اون‌جا باشه، کنار موزه.' },
      { who: 'mahin', text: 'اولین ثبت‌نامی‌ها: بیست و سه نفر! از همه‌ی محله‌ها، حتی کوچه‌ی بهار!' },
      { who: 'golab', text: 'پس کلاس رو آماده کنیم. بچه‌ها باید جای خوب درس بخونن.' },
    ],
    tasks: [
      { id: 'sch.desks', title: 'میز و نیمکت‌ها', cost: 324, layer: 'desks', after: [{ who: 'reza', text: 'میزها رو از چوب درخت توت خونه‌ی پدری ساختیم. یادگاری حاج‌بابا.' }] },
      { id: 'sch.board', title: 'تخته‌ی کلاس', cost: 326, layer: 'board', after: [{ who: 'kaveh', text: 'درس اول: «هر خونه‌ی قدیمی یه قصه داره. مرمت یعنی گوش دادن به اون قصه.»' }] },
      { id: 'sch.tools', title: 'قفسه‌ی ابزار مرمت', cost: 328, layer: 'tools', after: [{ who: 'morteza', text: 'ابزارها رو از بقالی آوردم. … فروشی نیستن! هدیه‌ن. باور کنید!' }] },
      { id: 'sch.model', title: 'ماکت خونه‌ی صفوی', cost: 330, layer: 'model', after: [{ who: 'aydin', text: 'ماکت رو بچه‌ها با هم ساختن. یه روز یکی‌شون خود خونه رو مرمت می‌کنه.' }] },
      { id: 'sch.ribbon', title: 'جشن افتتاح مدرسه', cost: 332, layer: 'ribbon', after: [{ who: 'narges', text: 'از یه قهوه‌خونه‌ی خاک‌گرفته شروع کردیم. حالا کوچه‌ی ما بقیه رو یاد می‌ده چه‌جوری نجات بدن.', mood: 'happy' }] },
    ],
    outro: [
      { who: 'mahin', text: 'خبر داغ! … یه نامه از یونسکو! کارشناس‌هاشون از ماکت کوچه تو موزه عکس دیدن!', mood: 'surprised' },
      { who: 'farokhi', text: 'ثبت جهانی؟ … کوچه‌ی حاج‌بابا؟', mood: 'surprised' },
      { who: 'golab', text: 'حاج‌بابا… کوچه‌ات داره دنیا رو می‌گیره. فصل بعد…', mood: 'happy' },
    ],
  },
  // ------------------------------------------------------------------ season 11: ثبت جهانی
  {
    id: 'dossier',
    name: 'دفتر پرونده‌ی ثبت',
    intro: [
      { who: 'farokhi', text: 'یونسکو یه پرونده‌ی کامل می‌خواد: نقشه، عکس، تاریخچه، و اینکه مردم چطور از کوچه نگه‌داری می‌کنن.' },
      { who: 'mahin', text: 'تاریخچه با من! چهل ساله همه‌چی این کوچه رو یادداشت کردم. … بالاخره به یه دردی خورد!', mood: 'happy' },
      { who: 'kaveh', text: 'کتابخونه‌ی خونه‌ی همسایه‌ها رو دفتر کار می‌کنیم. میز بزرگ لازم داریم.' },
    ],
    tasks: [
      { id: 'dos.table', title: 'میز بزرگ نقشه‌ها', cost: 330, layer: 'table', after: [{ who: 'kaveh', text: 'نقشه‌ی همه‌ی خونه‌ها، با مقیاس. شاگردهای مدرسه‌ی مرمت کشیدنش.' }] },
      { id: 'dos.files', title: 'کمد پرونده‌ها', cost: 332, layer: 'files', after: [{ who: 'mahin', text: 'دفترچه‌ی سال ۱۳۶۰: «امروز حاج‌بابا سماور نو خرید.» … اینم تاریخه دیگه!' }] },
      { id: 'dos.photos', title: 'دیوار عکس‌ها', cost: 334, layer: 'photos', after: [{ who: 'bahman', text: 'عکس‌های قدیمی من از هامبورگ هم هست. کوچه از نگاه کسی که دلش تنگش بود.' }] },
      { id: 'dos.lamp', title: 'چراغ مطالعه', cost: 336, layer: 'lamp', after: [{ who: 'narges', text: 'سه شب تا صبح بیدار موندیم. ولی پرونده تموم شد.' }] },
      { id: 'dos.stamp', title: 'مهر و امضای پرونده', cost: 338, layer: 'stamp', after: [{ who: 'farokhi', text: 'پرونده رفت! حالا کارشناس‌های یونسکو میان کوچه رو ببینن.', mood: 'happy' }] },
    ],
    outro: [
      { who: 'golab', text: 'مهمون خارجی؟ پس کوچه باید از همیشه تمیزتر باشه. همه جارو دست بگیرید!' },
      { who: 'aydin', text: 'من انگلیسی بلدم. ترکی هم بلدم. … اگه ترک بودن، کمک می‌کنه!' },
    ],
  },
  {
    id: 'inspection',
    name: 'روز بازدید',
    intro: [
      { who: 'mahin', text: 'کارشناس‌ها ساعت ده میان! سه نفرن: یکی ایتالیایی، یکی ژاپنی، یکی هم از مصر.' },
      { who: 'morteza', text: 'من به همه‌شون شربت مجانی می‌دم. … این کارها رو یونسکو می‌بینه، نه؟' },
      { who: 'kaveh', text: 'کوچه رو همون‌جوری که هست نشون می‌دیم. زنده، با آدم‌هاش.' },
    ],
    tasks: [
      { id: 'ins.sweep', title: 'جارو و آب‌پاشی کوچه', cost: 336, layer: 'sweep', after: [{ who: 'golab', text: 'آب‌پاشی صبح، بوی خاک نم‌خورده… این رو هم بنویسید تو پرونده.' }] },
      { id: 'ins.signs', title: 'تابلوهای راهنما', cost: 338, layer: 'signs', after: [{ who: 'aydin', text: 'فارسی، انگلیسی… و یه کوچولو ترکی، برای دل خودم.' }] },
      { id: 'ins.flowers', title: 'گلدون‌های در خونه‌ها', cost: 340, layer: 'flowers', after: [{ who: 'fakhri', text: 'هر در یه گلدون. هر گلدون یه رنگ. با ننه‌گلاب انتخاب کردیم.' }] },
      { id: 'ins.guides', title: 'میز خوش‌آمد', cost: 342, layer: 'guides', after: [{ who: 'narges', text: 'کارشناس ژاپنی گفت: «این کوچه مثل یه خونواده‌ست.» … فهمید!', mood: 'happy' }] },
      { id: 'ins.tea', title: 'چای قهوه‌خونه برای مهمون‌ها', cost: 344, layer: 'tea', after: [{ who: 'reza', text: 'کارشناس ایتالیایی سه تا سنگک خرید! گفت از پیتزا خوشمزه‌تره!', mood: 'happy' }] },
    ],
    outro: [
      { who: 'farokhi', text: 'کارشناس‌ها گفتن یه نمایشگاه عکس هم می‌خوان، تا جلسه‌ی نهایی.' },
      { who: 'kaveh', text: 'آب‌انبار! بهترین گالری دنیا. نور از نورگیر می‌افته روی عکس‌ها.' },
    ],
  },
  {
    id: 'exhibition',
    name: 'نمایشگاه عکس آب‌انبار',
    intro: [
      { who: 'shirin', text: 'عکس‌ها رو بزرگ چاپ کردیم! از قهوه‌خونه‌ی خاک‌گرفته تا جشن نام‌گذاری.' },
      { who: 'mahin', text: 'عکس‌های من بهتر از همه‌ست. … آره، خودم انتخابشون کردم.' },
      { who: 'kaveh', text: 'آب‌انبار نم داره. باید قاب‌ها و نورپردازی درست باشه.' },
    ],
    tasks: [
      { id: 'exh.frames', title: 'قاب‌های بزرگ', cost: 342, layer: 'frames', after: [{ who: 'narges', text: 'عکس اول: روزی که فرخی اومد کوچه رو بخره. عکس آخر: فرخی داور فینال.', mood: 'happy' }] },
      { id: 'exh.lights', title: 'نورپردازی', cost: 344, layer: 'lights', after: [{ who: 'kaveh', text: 'هر عکس یه نور. مثل چراغ‌های قهوه‌خونه در اولین شب.' }] },
      { id: 'exh.path', title: 'مسیر بازدید', cost: 346, layer: 'path', after: [{ who: 'reza', text: 'چهل پله پایین، چهل سال خاطره. حساب دقیقیه!' }] },
      { id: 'exh.book', title: 'دفتر یادبود', cost: 348, layer: 'book', after: [{ who: 'golab', text: 'یه بچه نوشته: «وقتی بزرگ شدم، می‌خوام مثل ننه‌گلاب باشم.» … دیگه چی می‌خوام از دنیا؟', mood: 'sad' }] },
      { id: 'exh.ribbon', title: 'افتتاح نمایشگاه', cost: 350, layer: 'ribbon', after: [{ who: 'farokhi', text: 'جلسه‌ی نهایی یونسکو یه ماه دیگه‌ست. تا اون موقع… یه جشن فرهنگی بگیریم؟', mood: 'happy' }] },
    ],
    outro: [
      { who: 'bahman', text: 'شب فرهنگ ایرانی! سنتور، خوشنویسی، آش… همه‌چی که این کوچه رو کوچه کرده.' },
      { who: 'mahin', text: 'از رادیو اعلام می‌کنم. کل تهران دعوتن!' },
    ],
  },
  {
    id: 'culturenight',
    name: 'شب فرهنگ ایرانی',
    intro: [
      { who: 'bahman', text: 'یه استاد خوشنویس میاد، شعر حافظ می‌نویسه برای هر کی بخواد.' },
      { who: 'golab', text: 'آش رشته با من. صد کاسه! … دویست کاسه!' },
      { who: 'aydin', text: 'فرش‌ها رو تو کوچه پهن می‌کنیم. مهمون باید رو فرش بشینه.' },
    ],
    tasks: [
      { id: 'cn.carpets', title: 'فرش‌های کوچه', cost: 348, layer: 'carpets', after: [{ who: 'aydin', text: 'سی تا فرش، از سر کوچه تا ته کوچه. ننه‌م ببینه، ذوق می‌کنه.' }] },
      { id: 'cn.santur', title: 'سنتور و تار', cost: 350, layer: 'santur', after: [{ who: 'bahman', text: 'شاگرد مدرسه‌ی مرمت سنتور می‌زنه، من تار. … چهل سال دیر، ولی بالاخره.' }] },
      { id: 'cn.calligraphy', title: 'میز خوشنویسی', cost: 352, layer: 'calligraphy', after: [{ who: 'narges', text: 'استاد برام نوشت: «دل می‌رود ز دستم، صاحب‌دلان خدا را». قابش می‌کنم.', mood: 'happy' }] },
      { id: 'cn.ash', title: 'دیگ‌های آش', cost: 354, layer: 'ash', after: [{ who: 'golab', text: 'دویست کاسه تموم شد! … فردا دوباره بار می‌ذارم.' }] },
      { id: 'cn.lanterns', title: 'فانوس‌های کوچه', cost: 356, layer: 'lanterns', after: [{ who: 'mahin', text: 'زنگ زدن… از پاریس! جلسه‌ی یونسکو فردا صبحه. همه بیدار بمونید!', mood: 'surprised' }] },
    ],
    outro: [
      { who: 'farokhi', text: '(صبح، تلفن به دست) … ثبت شد. کوچه‌ی حاج‌بابا ثبت جهانی شد!', mood: 'happy' },
      { who: 'narges', text: 'حاج‌بابا… شنیدی؟ کوچه‌ت مال کل دنیا شد.', mood: 'sad' },
    ],
  },
  {
    id: 'worldparty',
    name: 'جشن ثبت جهانی',
    intro: [
      { who: 'mahin', text: 'تلویزیون اومده! خبرگزاری‌ها اومدن! … ولی خبر رو اول من دادم!', mood: 'happy' },
      { who: 'kaveh', text: 'یه لوح بزرگ رو سردر کوچه نصب می‌کنیم. کنار لوح ثبت ملی.' },
      { who: 'golab', text: 'و یه عکس با همه. همه‌ی همه. حتی کوچه‌ی بهار.' },
    ],
    tasks: [
      { id: 'wp.plaque', title: 'لوح ثبت جهانی', cost: 354, layer: 'plaque', after: [{ who: 'farokhi', text: 'دو تا لوح، کنار هم. یه روز من می‌خواستم این سردر رو خراب کنم.' }] },
      { id: 'wp.flags', title: 'پرچم‌های کشورها', cost: 356, layer: 'flags', after: [{ who: 'aydin', text: 'کارشناس‌ها هم اومدن! ژاپنیه بادبادک آورده، ایتالیاییه… پیتزا. باید جلوش رو بگیریم!' }] },
      { id: 'wp.stage', title: 'سن جشن', cost: 358, layer: 'stage', after: [{ who: 'narges', text: 'سخنرانی؟ من؟ … فقط یه جمله می‌گم: «این کوچه رو آدم‌هاش نجات دادن، نه آجرهاش.»', mood: 'happy' }] },
      { id: 'wp.lights', title: 'چراغونی کل محله', cost: 360, layer: 'lights', after: [{ who: 'reza', text: 'از سر خیابون تا ته کوچه، همه‌جا روشن! این دفعه برق رو آقا مرتضی حساب کرد.' }, { who: 'morteza', text: 'آره… مجانی. دیگه عادت کردم.', mood: 'happy' }] },
      { id: 'wp.photo', title: 'عکس بزرگ محله', cost: 362, layer: 'photo', after: [{ who: 'golab', text: 'یک، دو، سه… «سیـــب!» … حاج‌بابا هم تو عکسه. من می‌بینمش.', mood: 'happy' }] },
    ],
    outro: [
      { who: 'mahin', text: 'خبر داغ! … خب، این یکی خیلی داغ نیست، ولی مهمه.', mood: 'surprised' },
      { who: 'mahin', text: 'هفته‌ی دیگه تولد ننه‌گلابه. نود سالگیش! یه جشن لازم داره که تاریخ یادش بمونه!', mood: 'happy' },
      { who: 'golab', text: 'نود؟ … من هنوز هفتاد ساله‌م، مهین! حساب کتابت ضعیفه!', mood: 'angry' },
    ],
  },
  // ------------------------------------------------------------------ season 12: تولد ننه‌گلاب
  {
    id: 'mahinhome',
    name: 'خونه‌ی خاله مهین',
    intro: [
      { who: 'mahin', text: 'جلسه‌ی سری! خونه‌ی من. ننه‌گلاب نباید بفهمه. … چرا همه‌تون دارید می‌خندید؟' },
      { who: 'shirin', text: 'خاله، شما و راز نگه داشتن؟', mood: 'happy' },
      { who: 'mahin', text: 'این دفعه فرق داره! … ولی اول یه کم خونه رو جمع کنیم. چهل سال روزنامه نگه داشتم.' },
    ],
    tasks: [
      { id: 'mh2.papers', title: 'کپه‌ی روزنامه‌ها', cost: 360, layer: 'papers', after: [{ who: 'reza', text: 'روزنامه‌ی سال شصت و دو! «افتتاح نونوایی اوستا رضا»… پدرم بود! چه جوون بود!', mood: 'surprised' }] },
      { id: 'mh2.radio', title: 'رادیوی قدیمی', cost: 362, layer: 'radio', after: [{ who: 'mahin', text: 'این رادیو رو مادرم داد. از همین فهمیدم که خبر، مهم‌ترین چیز دنیاست.' }] },
      { id: 'mh2.sofa', title: 'مبل و پشتی', cost: 364, layer: 'sofa', after: [{ who: 'fakhri', text: 'خونه‌ت قشنگه مهین. … چهل سال همسایه‌ایم، اولین باره میام تو.' }, { who: 'mahin', text: 'آخه همیشه من میام خونه‌ی بقیه!', mood: 'happy' }] },
      { id: 'mh2.albums', title: 'آلبوم‌های عکس', cost: 366, layer: 'albums', after: [{ who: 'narges', text: 'عکس‌های ننه‌گلاب از جوونی… خاله، این‌ها رو از کجا آوردی؟!', mood: 'surprised' }, { who: 'mahin', text: 'خبرنگار هیچ‌وقت منبعش رو لو نمی‌ده!' }] },
      { id: 'mh2.board', title: 'تخته‌ی نقشه‌ی جشن', cost: 368, layer: 'board', after: [{ who: 'mahin', text: 'نقشه: رضا کیک، آیدین تالار، نرگس دیوار خاطرات، بهمن… نگه داشتن ننه‌گلاب تا ساعت هشت!' }] },
    ],
    outro: [
      { who: 'bahman', text: 'من باید ننه‌گلاب رو سرگرم کنم؟ … می‌برمش تجریش، آش رشته. اون عاشق آشه.' },
      { who: 'reza', text: 'کیک با من. یه کیک که کل محله ازش بخوره. شب تا صبح کار دارم!' },
    ],
  },
  {
    id: 'cakeroom',
    name: 'کیک‌پزی اوستا رضا',
    intro: [
      { who: 'reza', text: 'پشت نونوایی یه اتاق خالیه. امشب کیک‌پزی می‌شه!' },
      { who: 'shirin', text: 'رضا، تو تا حالا کیک پختی؟', mood: 'surprised' },
      { who: 'reza', text: 'سنگک می‌پزم، دخترم. کیک هم یه نون شیرینه دیگه! … نه؟' },
    ],
    tasks: [
      { id: 'ck.oven', title: 'فر بزرگ', cost: 366, layer: 'oven', after: [{ who: 'reza', text: 'فر روشن شد! حرارتش مثل تنور سنگکه. … شاید یه کم زیاده.' }] },
      { id: 'ck.layers', title: 'لایه‌های کیک', cost: 368, layer: 'layers', after: [{ who: 'fakhri', text: 'لایه‌ی اول سوخت، رضا. … خوب شد من اومدم.' }, { who: 'reza', text: 'فخری‌خانم، دمت گرم!', mood: 'happy' }] },
      { id: 'ck.cream', title: 'خامه و گلاب', cost: 370, layer: 'cream', after: [{ who: 'golab', text: '(تلفنی) رضا، چرا صدای همزن میاد؟ … نه، هیچی، رادیوئه!' }] },
      { id: 'ck.decor', title: 'تزئین کیک', cost: 372, layer: 'decor', after: [{ who: 'shirin', text: 'گل‌های خامه‌ای! هر گل یه رنگ، مثل گلدون‌های در خونه‌ها.' }] },
      { id: 'ck.box', title: 'جعبه‌ی بزرگ کیک', cost: 374, layer: 'box', after: [{ who: 'reza', text: 'سه طبقه، صد و ده تیکه. کیک من! … و فخری‌خانم.', mood: 'happy' }] },
    ],
    outro: [
      { who: 'aydin', text: 'تالار پاساژ آماده‌ست، ولی خالیه. باید حسابی تزئینش کنیم.' },
      { who: 'farokhi', text: 'تالار پاساژ… یه روز می‌خواستم اونجا رو بدم اجاره، برای عروسی‌های پولدارها. حالا برای ننه‌گلاب.' },
    ],
  },
  {
    id: 'hall',
    name: 'تالار محله',
    intro: [
      { who: 'aydin', text: 'دیوارها سفیده، صندلی‌ها نامرتب. سه ساعت وقت داریم!' },
      { who: 'kaveh', text: 'شاگردهای مدرسه‌ی مرمت هم اومدن کمک. کلاس امروزشون: «تالار در سه ساعت»!' },
    ],
    tasks: [
      { id: 'hl.curtains', title: 'پرده‌های مخمل', cost: 372, layer: 'curtains', after: [{ who: 'golab', text: '(تلفنی) بهمن، چرا هی ساعت رو نگاه می‌کنی؟ … نه، کجا بریم؟' }] },
      { id: 'hl.tables', title: 'میزهای گرد', cost: 374, layer: 'tables', after: [{ who: 'morteza', text: 'صد و ده صندلی، دو برابر جشن نام‌گذاری. کرایه؟ … نه، دیگه حتی نمی‌پرسم.' }] },
      { id: 'hl.flowers', title: 'دیوار گل', cost: 376, layer: 'flowers', after: [{ who: 'fakhri', text: 'گل محمدی، از حیاط ننه‌گلاب. … یواشکی چیدیم!' }] },
      { id: 'hl.stage', title: 'سن موسیقی', cost: 378, layer: 'stage', after: [{ who: 'bahman', text: 'تار داداش، سنتور شاگرد، ساز عاشیقی آیدین. ارکستر محله!' }] },
      { id: 'hl.lights', title: 'چلچراغ تالار', cost: 380, layer: 'lights', after: [{ who: 'aydin', text: 'چلچراغ روشن شد! … حالا فقط دیوار خاطرات مونده.' }] },
    ],
    outro: [
      { who: 'narges', text: 'دیوار خاطرات… یه عمر ننه‌گلاب، روی یه دیوار. از کجا شروع کنیم؟' },
      { who: 'mahin', text: 'از اولش. از روزی که اومد این کوچه، شصت سال پیش.' },
    ],
  },
  {
    id: 'memories',
    name: 'دیوار خاطرات',
    intro: [
      { who: 'narges', text: 'هر کی یه چیز آورده. یه عکس، یه نامه، یه یادگاری.' },
      { who: 'bahman', text: 'من نامه‌هایی رو آوردم که داداش برام نوشت. همشون اسم گلاب داره. همیشه هوای کوچه رو داشت.' },
    ],
    tasks: [
      { id: 'mem.young', title: 'عکس جوونی ننه‌گلاب', cost: 378, layer: 'young', after: [{ who: 'mahin', text: 'ننه‌گلاب، بیست سالگی، کنار حوض. این عکس رو مادرم گرفته بود.' }] },
      { id: 'mem.samovar', title: 'سماور قهوه‌خونه', cost: 380, layer: 'samovar', after: [{ who: 'narges', text: 'سماور قهوه‌خونه رو از موزه قرض گرفتیم. اولین چیزی که تو این کوچه درست کردیم.' }] },
      { id: 'mem.letters', title: 'نامه‌های قدیمی', cost: 382, layer: 'letters', after: [{ who: 'bahman', text: 'نامه‌ی آخر داداش: «گلاب هنوز هر صبح جلوی خونه رو آب‌پاشی می‌کنه.»', mood: 'sad' }] },
      { id: 'mem.rose', title: 'شیشه‌ی گلاب', cost: 384, layer: 'rose', after: [{ who: 'golab', text: '(از پشت در) … بهمن؟ اینجا کجاست؟ چرا همه ساکتن؟', mood: 'surprised' }] },
      { id: 'mem.cradle', title: 'گهواره‌ی گلاب کوچولو', cost: 386, layer: 'cradle', after: [{ who: 'narges', text: 'و آخرین عکس: دو تا گلاب. یکی هفتاد سال، یکی یه سال. … حالا، چراغ‌ها خاموش!', mood: 'happy' }] },
    ],
    outro: [
      { who: 'golab', text: '(چراغ‌ها روشن میشن) … یا خدا! همه‌تون این‌جایید؟!', mood: 'surprised' },
      { who: 'mahin', text: 'تولدت مبارک ننه‌گلاب!!! … دیدید؟ راز رو نگه داشتم!', mood: 'happy' },
    ],
  },
  {
    id: 'birthday',
    name: 'جشن تولد ننه‌گلاب',
    intro: [
      { who: 'golab', text: 'من… من نمی‌دونم چی بگم. یه عمر تو این کوچه کار کردم. هیچ‌وقت فکر نمی‌کردم…', mood: 'sad' },
      { who: 'narges', text: 'نگو ننه‌گلاب. امشب فقط جشن بگیر.' },
    ],
    tasks: [
      { id: 'bd.cake', title: 'کیک سه‌طبقه', cost: 384, layer: 'cake', after: [{ who: 'reza', text: 'کیک رسید! بدون حتی یه ترک. … فقط یه گوشه‌ش رو موقع آوردن خوردم.' }] },
      { id: 'bd.candles', title: 'شمع‌های تولد', cost: 386, layer: 'candles', after: [{ who: 'golab', text: 'هفتاد شمع؟ مهین، می‌خوای تالار آتیش بگیره؟ … هفت تا کافیه!', mood: 'happy' }] },
      { id: 'bd.gifts', title: 'میز کادوها', cost: 388, layer: 'gifts', after: [{ who: 'farokhi', text: 'کادوی من: یه سند. خونه‌ی ننه‌گلاب برای همیشه ثبت میراث شد. هیچ‌کس نمی‌تونه بخرتش.' }, { who: 'golab', text: 'فرخی… پسرم… بیا بغلم.', mood: 'sad' }] },
      { id: 'bd.music', title: 'ارکستر محله', cost: 390, layer: 'music', after: [{ who: 'bahman', text: 'این آهنگ رو گلاب شصت سال پیش تو عروسی خواهرش می‌خوند. … حالا همه با هم!', mood: 'happy' }] },
      { id: 'bd.wish', title: 'آرزوی ننه‌گلاب', cost: 392, layer: 'wish', after: [{ who: 'golab', text: 'آرزوم؟ آرزوم برآورده شده. این کوچه زنده‌ست. شماها زنده‌اید. دیگه هیچی نمی‌خوام.', mood: 'happy' }, { who: 'narges', text: 'پس آرزوی ما رو بکن: که صد سال دیگه هم تو این کوچه باشی.', mood: 'happy' }] },
    ],
    outro: [
      { who: 'shirin', text: 'خب… حالا که همه این‌جان… من و آیدین یه خبر داریم.', mood: 'happy' },
      { who: 'aydin', text: 'تاریخ عروسی رو تعیین کردیم! یه عروسی ترکی ـ تهرونی، تو همین کوچه!', mood: 'happy' },
      { who: 'mahin', text: 'خبر داغ!!! … ای بابا، این دفعه هم من آخرین نفر بودم که فهمیدم!', mood: 'surprised' },
    ],
  },
  // ------------------------------------------------------------------ season 13: عروسی شیرین و آیدین
  {
    id: 'nest',
    name: 'خونه‌ی بخت',
    intro: [
      { who: 'shirin', text: 'یه ماه تا عروسی مونده و ما هنوز خونه نداریم! آیدین می‌گه بریم تبریز، من می‌گم همین کوچه.', mood: 'sad' },
      { who: 'morteza', text: 'بالای بقالی یه طبقه خالیه. سی ساله انبار گردوئه. … اجاره‌ش؟ … بعداً حرفش رو می‌زنیم.' },
      { who: 'mahin', text: 'یعنی مجانی! آقا مرتضی وقتی می‌گه «بعداً»، یعنی هیچ‌وقت!', mood: 'happy' },
    ],
    tasks: [
      { id: 'ns.sacks', title: 'گونی‌های گردو', cost: 390, layer: 'sacks', after: [{ who: 'morteza', text: 'سی سال گردو! … نصفش رو بدید به رضا، برای نون گردویی. نصفش هم… خب، اون نصف رو بعداً حساب می‌کنیم.' }] },
      { id: 'ns.window', title: 'پنجره‌ی رو به کوچه', cost: 392, layer: 'window', after: [{ who: 'shirin', text: 'از این پنجره کل کوچه پیداست. صبح‌ها با بوی سنگک رضا بیدار می‌شم!', mood: 'happy' }] },
      { id: 'ns.kitchen', title: 'آشپزخونه‌ی کوچیک', cost: 394, layer: 'kitchen', after: [{ who: 'aydin', text: 'من آشپزی بلدم ها! کوفته، دلمه، آش دوغ… شیرین فقط چای دم می‌کنه.' }, { who: 'shirin', text: 'ولی چای من حرف نداره!', mood: 'angry' }] },
      { id: 'ns.carpet', title: 'فرش دستباف تبریز', cost: 396, layer: 'carpet', after: [{ who: 'aydin', text: 'این فرش رو پدربزرگم بافته. گفته بود «این، فرش اولین خونه‌ی نوه‌مه».', mood: 'happy' }] },
      { id: 'ns.shelf', title: 'طاقچه و قاب عکس‌ها', cost: 398, layer: 'shelf', after: [{ who: 'narges', text: 'عکس کوچه، عکس ائل‌گلی، عکس شما دوتا… خونه یعنی همین.' }] },
    ],
    outro: [
      { who: 'mahin', text: 'خبر داغ! یه ماشین با پلاک تبریز سر کوچه وایساده. پر از سینی‌های تزئین‌شده!', mood: 'surprised' },
      { who: 'aydin', text: 'ننه‌م اومد! … با خونچا. خونچای عروس، رسم ماست.', mood: 'happy' },
    ],
  },
  {
    id: 'henna',
    name: 'حنابندان',
    intro: [
      { who: 'sona', text: 'سلام قیزیم! ببین، فارسی یاد گرفتم! … یه کم. از تبریز حنا آوردم، بهترین حنای دنیا!', mood: 'happy' },
      { who: 'golab', text: 'خوش گلمیسیز سونا‌خانم! حنابندان تو حیاط من. این حیاط سال‌هاست منتظر یه حنابندانه.' },
      { who: 'shirin', text: 'من تو آرایشگاه صد تا عروس رو حنا گذاشتم. حالا نوبت خودمه… دستام می‌لرزه!', mood: 'surprised' },
    ],
    tasks: [
      { id: 'hn.khoncha', title: 'سینی‌های خونچا', cost: 396, layer: 'khoncha', after: [{ who: 'sona', text: 'هفت تا خونچا: پارچه، آینه، قند، شیرینی، میوه، حنا… و یه روسری کلاغی برای عروس.' }] },
      { id: 'hn.henna', title: 'کاسه‌ی حنا', cost: 398, layer: 'henna', after: [{ who: 'fakhri', text: 'حنای تبریز رنگش قرمزتره، قبول. ولی حنای یزد خوشبوتره!' }, { who: 'sona', text: 'فخری‌خانم، حنا که دعوا نداره! بیا، یه کم هم تو بذار.', mood: 'happy' }] },
      { id: 'hn.daf', title: 'دف و دایره', cost: 400, layer: 'daf', after: [{ who: 'mahin', text: 'خودم دایره می‌زنم! … یه بار تو عروسی خواهرم زدم، نصف مهمون‌ها رفتن. ولی این دفعه تمرین کردم!', mood: 'happy' }] },
      { id: 'hn.sweets', title: 'قرابیه و نون‌برنجی', cost: 402, layer: 'sweets', after: [{ who: 'reza', text: 'قرابیه‌ی سونا‌خانم رو خوردم… من سی ساله نونوام، ولی این یه چیز دیگه‌ست!', mood: 'surprised' }] },
      { id: 'hn.candles', title: 'شمع‌های حنابندان', cost: 404, layer: 'candles', after: [{ who: 'golab', text: 'رسم ماست: شمع‌ها رو دور حنا روشن می‌کنن که راه زندگی عروس روشن باشه.' }, { who: 'sona', text: 'تو تبریز هم همین رسمه. می‌بینی؟ ما چقدر شبیه همیم!', mood: 'happy' }] },
    ],
    outro: [
      { who: 'aydin', text: 'یه مشکل داریم. ننه‌م می‌گه عروس باید با ماشین گل‌زده بره، نه پیاده. رسمه.' },
      { who: 'morteza', text: 'ماشین؟ … تو انباری یه پیکان دارم. سی ساله روشنش نکردم. شاید هنوز نفس داشته باشه.' },
    ],
  },
  {
    id: 'paykan',
    name: 'پیکان عروس',
    intro: [
      { who: 'kaveh', text: 'من ساختمون مرمت می‌کنم، ماشین نه! … ولی چه فرقی داره؟ یه چیز قدیمیه که باید دوباره زنده بشه.' },
      { who: 'morteza', text: 'پیکان، مدل پنجاه و چهار. اولین چیزی که با پول بقالی خریدم. با همین ماشین می‌رفتیم شمال.' },
      { who: 'bahman', text: 'من این ماشین رو یادمه! داداش یه بار باهاش رفت تجریش، پنچر کرد، سه ساعت پیاده اومد!', mood: 'happy' },
    ],
    tasks: [
      { id: 'pk.tires', title: 'لاستیک‌های پنچر', cost: 402, layer: 'tires', after: [{ who: 'reza', text: 'چهار تا لاستیک، چهار تا پنچری. ماشین هم مثل آدم پیر می‌شه دیگه.' }] },
      { id: 'pk.engine', title: 'موتور خاک‌گرفته', cost: 404, layer: 'engine', after: [{ who: 'kaveh', text: '(صدای موتور) … روشن شد! روشن شد! … آقا مرتضی، چرا چشمات خیسه؟', mood: 'surprised' }, { who: 'morteza', text: 'دود رفت تو چشمم. … فقط دود.', mood: 'sad' }] },
      { id: 'pk.paint', title: 'رنگ سفید صدفی', cost: 406, layer: 'paint', after: [{ who: 'farokhi', text: 'سفید صدفی. ماشین‌های خودم رو هم همین رنگ می‌کردم. … البته اون‌ها پیکان نبودن.' }] },
      { id: 'pk.flowers', title: 'تاج گل کاپوت', cost: 408, layer: 'flowers', after: [{ who: 'shirin', text: 'گل مریم و رز قرمز! … ماشین عروس داره از خود عروس خوشگل‌تر می‌شه!', mood: 'happy' }] },
      { id: 'pk.ribbons', title: 'روبان و بوق', cost: 410, layer: 'ribbons', after: [{ who: 'mahin', text: '(بوق) … بیپ بیپ! حالا دیگه همه‌ی محله فهمیدن عروسی نزدیکه!', mood: 'happy' }] },
    ],
    outro: [
      { who: 'aydin', text: 'ماشین آماده‌ست. ولی عروسی رو کجا بگیریم؟ کوچه جا نداره، تالار هم کوچیکه. نصف تبریز دارن میان!', mood: 'surprised' },
      { who: 'kaveh', text: 'خونه‌باغ شمیرون! همون باغی که آقا مرتضی ارث برد. باغ‌ها رو برای همین ساختن.' },
    ],
  },
  {
    id: 'gardenwed',
    name: 'عروسی در باغ',
    intro: [
      { who: 'narges', text: 'خونه‌باغ شمیرون، دوباره زنده. این دفعه برای یه عروسی!', mood: 'happy' },
      { who: 'sona', text: 'تبریزی‌ها رسیدن! … سیصد نفر. نگران نباشید، شام خودشون رو هم آوردن.', mood: 'happy' },
      { who: 'bahman', text: '(جلوی در باغ) رسمه: تا داماد شیرینی نده، در باز نمی‌شه!' },
    ],
    tasks: [
      { id: 'gw.arch', title: 'طاق گل ورودی', cost: 408, layer: 'arch', after: [{ who: 'aydin', text: 'عمو بهمن، این هم شیرینی. … یه جعبه گز اصفهان؟ قبول؟', mood: 'happy' }, { who: 'bahman', text: 'قبول! در باز شد!', mood: 'happy' }] },
      { id: 'gw.pool', title: 'حوض پر از گلبرگ', cost: 410, layer: 'pool', after: [{ who: 'golab', text: 'حوض رو پر از گلبرگ کردیم. مثل باغ‌های قدیم تهرون.' }] },
      { id: 'gw.seats', title: 'جایگاه عروس و داماد', cost: 412, layer: 'seats', after: [{ who: 'fakhri', text: 'شیرین… خیلی خوشگل شدی دخترم. … این رو به کسی نگید.', mood: 'happy' }] },
      { id: 'gw.dinner', title: 'شام عروسی', cost: 414, layer: 'dinner', after: [{ who: 'reza', text: 'کوفته تبریزی کنار چلوکباب تهرونی! … و سنگک، البته. سنگک همیشه هست.' }] },
      { id: 'gw.music', title: 'عاشیق و تار', cost: 416, layer: 'music', after: [{ who: 'bahman', text: 'ساز عاشیق تبریز با تار داداش. دو تا ساز، یه آهنگ. مثل این دو تا.' }, { who: 'mahin', text: 'کِل بکشید! کِــــل!', mood: 'happy' }] },
    ],
    outro: [
      { who: 'shirin', text: 'آیدین… یادته روزی که مغازه‌ی ته کوچه رو اجاره کردی؟ خاله مهین گفت «این پسره یه هفته هم دووم نمیاره».', mood: 'happy' },
      { who: 'aydin', text: 'حالا داماد کوچه‌ام! … راستی، فردا «پاتختی» داریم؟ اون دیگه رسم تهرونیه، نه؟' },
      { who: 'mahin', text: 'معلومه که داریم! پاتختی بدون من؟ کادوها رو کی باید بشمره؟', mood: 'happy' },
    ],
  },
  {
    id: 'patakhti',
    name: 'پاتختی',
    intro: [
      { who: 'mahin', text: 'صبح پاتختی! مهمون‌ها از ساعت ده میان. کادوها از ساعت ده و یه دقیقه!' },
      { who: 'shirin', text: 'خاله، ما دیشب ساعت سه خوابیدیم! … ولی باشه، بیاید بالا.', mood: 'sad' },
    ],
    tasks: [
      { id: 'pt.sofreh', title: 'سفره‌ی پاتختی', cost: 414, layer: 'sofreh', after: [{ who: 'golab', text: 'پاتختی یعنی عروس رسماً خانم خونه‌ی خودش شده. مبارکت باشه دخترم.' }] },
      { id: 'pt.gifts', title: 'کادوهای مهمون‌ها', cost: 416, layer: 'gifts', after: [{ who: 'mahin', text: 'سرویس چینی از فخری‌خانم، پتو از سونا‌خانم، و… آقا مرتضی؟ یه گونی گردو!', mood: 'surprised' }, { who: 'morteza', text: 'گردوی تازه‌ست ها! پارسالیه، ولی تازه‌ست.' }] },
      { id: 'pt.tea', title: 'سماور و چای تبریزی', cost: 418, layer: 'tea', after: [{ who: 'sona', text: 'شیرین قیزیم، چای تو از چای من بهتره. … این رو به کسی نگو!', mood: 'happy' }, { who: 'fakhri', text: 'سونا‌خانم، تو هم؟ ما دو تا خیلی شبیه همیم.', mood: 'happy' }] },
      { id: 'pt.album', title: 'آلبوم عروسی', cost: 420, layer: 'album', after: [{ who: 'narges', text: 'عکس آخر آلبوم: کل محله، جلوی پیکان عروس. حاج‌بابا اگه بود، درست وسط عکس وایمیستاد.' }] },
      { id: 'pt.suitcase', title: 'چمدون ماه عسل', cost: 422, layer: 'suitcase', after: [{ who: 'aydin', text: 'ماه عسل کجا بریم؟ … کاوه می‌گه یه جای خاص سراغ داره. یه کاروانسرای قدیمی وسط کویر.', mood: 'surprised' }] },
    ],
    outro: [
      { who: 'kaveh', text: 'راستش… یه نامه از میراث فرهنگی اومده. یه کاروانسرای چهارصد ساله سر راه کاشان داره فرو می‌ریزه.' },
      { who: 'narges', text: 'یعنی… کل محله بریم کویر؟', mood: 'surprised' },
      { who: 'mahin', text: 'کویر؟! … من کرم ضدآفتاب کم دارم. همین الان برم بخرم!', mood: 'surprised' },
    ],
  },
  // ------------------------------------------------------------------ season 14: کاروانسرا
  {
    id: 'roadhouse',
    name: 'قهوه‌خونه‌ی بین‌راهی',
    intro: [
      { who: 'kaveh', text: 'جاده‌ی کاشان. دو ساعت دیگه می‌رسیم کاروانسرا… اگه پیکان آقا مرتضی دووم بیاره.' },
      { who: 'morteza', text: 'پیکان من دووم میاره! … فقط یه کم آب رادیاتش جوش اومده.', mood: 'angry' },
      { who: 'mahin', text: 'یه قهوه‌خونه‌ی متروکه کنار جاده‌ست! … کسی چای نمی‌خواد؟', mood: 'happy' },
    ],
    tasks: [
      { id: 'rh.sign', title: 'تابلوی «چای داغ»', cost: 420, layer: 'sign', after: [{ who: 'reza', text: 'بچه که بودم، بابام می‌گفت چای جاده یه مزه‌ی دیگه داره. راست می‌گفت.' }] },
      { id: 'rh.benches', title: 'تخت‌های چوبی', cost: 422, layer: 'benches', after: [{ who: 'golab', text: 'رو همین تخت‌ها مسافرها شب رو صبح می‌کردن، زیر آسمون پرستاره.' }] },
      { id: 'rh.samovar', title: 'سماور ذغالی', cost: 424, layer: 'samovar', after: [{ who: 'narges', text: 'سماور ذغالی! حاج‌بابا همیشه می‌گفت چای ذغالی یه چیز دیگه‌ست.', mood: 'happy' }] },
      { id: 'rh.dizi', title: 'دیزی سنگی', cost: 426, layer: 'dizi', after: [{ who: 'reza', text: 'دیزی سنگی و سنگک داغ… کی گفته غذای جاده باید بد باشه؟', mood: 'happy' }, { who: 'aydin', text: 'تو تبریز بهش می‌گیم «پیتی». ولی این هم بد نیست!', mood: 'happy' }] },
      { id: 'rh.lights', title: 'چراغ‌های جاده', cost: 428, layer: 'lights', after: [{ who: 'shirin', text: 'چراغ‌ها روشن شد! حالا اولین ماشینی که رد شه، وایمیسه.' }, { who: 'mahin', text: 'یه کامیون وایساد! راننده‌ش می‌پرسه: «باز کردید؟»', mood: 'surprised' }] },
    ],
    outro: [
      { who: 'yadollah', text: 'سلام علیکم. من یدالله‌ام، سی ساله سرایدار کاروانسرای این‌جام. شنیدم یه کوچه اومده که خرابه‌ها رو زنده می‌کنه.' },
      { who: 'kaveh', text: 'شما نامه رو نوشتید؟', mood: 'surprised' },
      { who: 'yadollah', text: 'نوشتم، ولی فکر نمی‌کردم کسی بیاد. بیاید بریم، قندی منتظره.' },
      { who: 'narges', text: 'قندی کیه؟', mood: 'surprised' },
      { who: 'yadollah', text: 'شترم!', mood: 'happy' },
    ],
  },
  {
    id: 'caravan',
    name: 'کاروانسرای صفوی',
    intro: [
      { who: 'narges', text: 'چهارصد سال! هنوز آجرهاش سرپاست، ولی نصف ایوون‌ها ریخته.', mood: 'surprised' },
      { who: 'yadollah', text: 'یه زمانی صد تا شتر این‌جا بار می‌انداختن. حالا فقط من موندم و قندی.', mood: 'sad' },
      { who: 'kaveh', text: 'مثل روز اول کوچه‌ی خودمون. شروع کنیم!' },
    ],
    tasks: [
      { id: 'cv.gate', title: 'سردر آجری', cost: 426, layer: 'gate', after: [{ who: 'kaveh', text: 'بنّاهای صفوی نقش‌ها رو با خود آجر می‌ساختن. ببینید، بالای در نوشته: «بنا شد».' }] },
      { id: 'cv.pool', title: 'حوض وسط حیاط', cost: 428, layer: 'pool', after: [{ who: 'golab', text: 'حوض پر آب شد. مسافرها اول از همه این‌جا گرد راه رو از صورتشون می‌شستن.' }] },
      { id: 'cv.iwans', title: 'ایوون‌های حیاط', cost: 430, layer: 'iwans', after: [{ who: 'farokhi', text: 'من یه عمر ساختمون ساختم. ولی این رو با دست ساختن، بدون حتی یه جرثقیل.', mood: 'surprised' }] },
      { id: 'cv.platforms', title: 'سکوهای بار', cost: 432, layer: 'platforms', after: [{ who: 'bahman', text: 'پدرمون می‌گفت پدربزرگش با کاروان ابریشم می‌آورد. شاید یه شب همین‌جا خوابیده.' }] },
      { id: 'cv.tree', title: 'درخت انار حیاط', cost: 434, layer: 'tree', after: [{ who: 'yadollah', text: 'این انار رو پدرم کاشت. بیست ساله میوه نداده. … ببین! یه شکوفه!', mood: 'surprised' }] },
    ],
    outro: [
      { who: 'yadollah', text: 'حیاط زنده شد. ولی حجره‌ها… مسافر کجا بخوابه؟' },
      { who: 'shirin', text: 'ما! من و آیدین ماه عسل اومدیم. اولین مسافرهای حجره‌ها ما باشیم!', mood: 'happy' },
    ],
  },
  {
    id: 'hojreh',
    name: 'حجره‌های کاروانسرا',
    intro: [
      { who: 'aydin', text: 'هر حجره یه داستان داره. رو دیوار این یکی، یه تاجر شعر نوشته.' },
      { who: 'fakhri', text: 'حجره‌ها باید گرم و تمیز باشن. مهمون حبیب خداست.' },
    ],
    tasks: [
      { id: 'hj.door', title: 'درهای گره‌چینی', cost: 432, layer: 'door', after: [{ who: 'kaveh', text: 'درهای گره‌چینی. یه دونه میخ هم توشون نیست، همه‌ش چفت و بست چوبیه.' }] },
      { id: 'hj.rugs', title: 'گلیم‌های کاشان', cost: 434, layer: 'rugs', after: [{ who: 'aydin', text: 'گلیم کاشان، فرش تبریز… امشب این حجره یه تیکه از کل ایرانه!', mood: 'happy' }] },
      { id: 'hj.cushions', title: 'پشتی و متکا', cost: 436, layer: 'cushions', after: [{ who: 'morteza', text: 'متکای پر قو؟ … نه، پنبه‌ایه. ولی گفتن مجانیه، پس عالیه!', mood: 'happy' }] },
      { id: 'hj.niche', title: 'طاقچه و پیه‌سوز', cost: 438, layer: 'niche', after: [{ who: 'golab', text: 'پیه‌سوز روشن شد. مادرم می‌گفت مسافرها تو نور همین چراغ‌ها قصه می‌گفتن.' }] },
      { id: 'hj.curtain', title: 'پرده‌ی کرباس', cost: 440, layer: 'curtain', after: [{ who: 'shirin', text: 'حجره‌ی ما آماده‌ست! … آیدین، این‌جا از هر هتلی قشنگ‌تره.', mood: 'happy' }] },
    ],
    outro: [
      { who: 'yadollah', text: 'امشب ماه نیست. یعنی کویر پرستاره‌ترین شبش رو داره. بیاید بریم رو تپه‌ها.' },
      { who: 'mahin', text: 'تو تاریکی؟ با عقرب و مار؟!', mood: 'surprised' },
      { who: 'yadollah', text: 'نترس خانم. قندی راه رو بلده.' },
    ],
  },
  {
    id: 'desertnight',
    name: 'شب کویر',
    intro: [
      { who: 'narges', text: 'تا حالا این‌همه ستاره ندیده بودم. انگار یکی آسمون رو پر از نقل کرده.', mood: 'surprised' },
      { who: 'yadollah', text: 'اون نوار سفید رو می‌بینی؟ شما می‌گید «راه شیری». مادربزرگم می‌گفت «کاه‌کشون».' },
    ],
    tasks: [
      { id: 'dn.fire', title: 'آتیش هیزم', cost: 438, layer: 'fire', after: [{ who: 'reza', text: 'آتیش روشن شد! … حالا می‌شه سیب‌زمینی تو خاکستر پخت؟', mood: 'happy' }] },
      { id: 'dn.rug', title: 'گلیم روی شن', cost: 440, layer: 'rug', after: [{ who: 'golab', text: 'رو شن دراز بکش دخترم، ستاره‌ها رو بشمار. بچه که بودم تا صد می‌شمردم و خوابم می‌برد.' }] },
      { id: 'dn.telescope', title: 'تلسکوپ', cost: 442, layer: 'telescope', after: [{ who: 'kaveh', text: 'تلسکوپ مدرسه‌ی مرمته. … زحل! حلقه‌هاش رو ببینید!', mood: 'surprised' }] },
      { id: 'dn.tea', title: 'چای آتیشی', cost: 444, layer: 'tea', after: [{ who: 'bahman', text: 'چای رو آتیش، زیر ستاره‌ها. تو هامبورگ چهل سال دلم برای همین تنگ بود.', mood: 'sad' }] },
      { id: 'dn.camel', title: 'قندی و زنگوله‌ش', cost: 446, layer: 'camel', after: [{ who: 'yadollah', text: 'قندی هم اومد. صدای زنگوله‌ش رو که می‌شنوم، یاد کاروان‌های قدیم میفتم.' }, { who: 'mahin', text: 'قندی من رو بو کرد! … فکر کنم ازم خوشش اومد!', mood: 'happy' }] },
    ],
    outro: [
      { who: 'yadollah', text: 'من یه عمر این‌جا تنها بودم. امشب اولین باره که کاروانسرا صدای خنده داره.', mood: 'sad' },
      { who: 'narges', text: 'عمو یدالله، بیاید این‌جا رو اقامتگاه بوم‌گردی کنیم. مسافر بیاد، کاروانسرا زنده بمونه.', mood: 'happy' },
      { who: 'yadollah', text: 'یعنی… دیگه تنها نیستم؟', mood: 'surprised' },
    ],
  },
  {
    id: 'ecolodge',
    name: 'اقامتگاه بوم‌گردی',
    intro: [
      { who: 'mahin', text: 'خبر داغ! اولین مهمون‌ها رزرو کردن! یه خانواده از شیراز، یه زوج از رشت و یه گروه دانشجو از تبریز!', mood: 'happy' },
      { who: 'yadollah', text: 'یه هفته پیش این‌جا فقط من بودم و باد. حالا رزرو داریم؟!', mood: 'surprised' },
    ],
    tasks: [
      { id: 'el.sign', title: 'تابلوی اقامتگاه', cost: 444, layer: 'sign', after: [{ who: 'narges', text: 'اسمش رو چی بذاریم؟ … «کاروانسرای قندی»! همه موافقن؟', mood: 'happy' }, { who: 'yadollah', text: 'قندی موافقه. سرش رو تکون داد!', mood: 'happy' }] },
      { id: 'el.sofreh', title: 'سفره‌ی محلی', cost: 446, layer: 'sofreh', after: [{ who: 'fakhri', text: 'کشک بادمجون، آش کاشی، شیرینی گل‌محمدی. غذای محلی، دست‌پخت محلی.' }] },
      { id: 'el.crafts', title: 'بازارچه‌ی صنایع دستی', cost: 448, layer: 'crafts', after: [{ who: 'shirin', text: 'گلاب کاشان، گلیم، سفال… هر مهمون با یه یادگاری برمی‌گرده.' }] },
      { id: 'el.ride', title: 'سواری با قندی', cost: 450, layer: 'ride', after: [{ who: 'reza', text: 'من سوار شتر شدم! … حالا چطوری پیاده شم؟!', mood: 'surprised' }] },
      { id: 'el.book', title: 'دفتر یادبود', cost: 452, layer: 'book', after: [{ who: 'yadollah', text: 'اولین جمله‌ی دفتر رو نرگس نوشت: «هر خرابه منتظر یه نفره که دوستش داشته باشه.»', mood: 'happy' }] },
    ],
    outro: [
      { who: 'yadollah', text: 'نرگس خانم، یه چیزی برات دارم. چهل سال پیش یه مسافر این جعبه رو جا گذاشت.' },
      { who: 'narges', text: 'این… عکس حاج‌باباست! جلوی همین کاروانسرا. پشتش نوشته: «سفر یزد، به یاد رفیقم…»', mood: 'surprised' },
      { who: 'mahin', text: 'رفیق یزدیِ حاج‌بابا؟ … خبر داغ‌تر از این نداریم!', mood: 'surprised' },
    ],
  },
  // ------------------------------------------------------------------ season 15: رفیق یزدی
  {
    id: 'yazdlanes',
    name: 'کوچه‌های کاهگلی',
    intro: [
      { who: 'narges', text: 'یزد! تو عکس، حاج‌بابا جلوی یه در چوبی با دو تا کوبه وایساده. باید همون در رو پیدا کنیم.' },
      { who: 'mahin', text: 'تو این شهر هزار تا در دوکوبه‌ای هست! … ولی نگران نباش، از هر کی بپرسم جوابم رو می‌ده.', mood: 'happy' },
      { who: 'bahman', text: 'داداش همیشه می‌گفت «یزد شهر بادگیرهاست». حالا می‌فهمم چرا.', mood: 'surprised' },
    ],
    tasks: [
      { id: 'yl.sabat', title: 'ساباط کوچه', cost: 450, layer: 'sabat', after: [{ who: 'kaveh', text: 'ساباط‌ها رو ساختن که کوچه سایه داشته باشه. تابستون یزد شوخی نداره.' }] },
      { id: 'yl.door', title: 'در دوکوبه‌ای', cost: 452, layer: 'door', after: [{ who: 'golab', text: 'می‌دونستی؟ کوبه‌ی گرد مال خانم‌هاست، کوبه‌ی دراز مال آقایون. صاحبخونه از صداش می‌فهمید کی پشت دره.' }] },
      { id: 'yl.benches', title: 'سکوهای دم در', cost: 454, layer: 'benches', after: [{ who: 'reza', text: 'رو این سکوها همسایه‌ها می‌نشستن و حرف می‌زدن. درست مثل تخت جلوی نونوایی من.' }] },
      { id: 'yl.lamps', title: 'چراغ‌های کوچه', cost: 456, layer: 'lamps', after: [{ who: 'shirin', text: 'چراغ‌ها که روشن شد، رنگ کاهگل طلایی شد. عکس بگیرم!', mood: 'happy' }] },
      { id: 'yl.sign', title: 'تابلوی نشونی', cost: 458, layer: 'sign', after: [{ who: 'mahin', text: 'پیداش کردم! پیرمرد بقال سر کوچه عکس رو دید و گفت: «این جلاله! جلال مقنی!»', mood: 'surprised' }] },
    ],
    outro: [
      { who: 'mahin', text: 'گفتن استاد جلال هر روز صبح می‌ره سر قنات. چهل ساله کسی یادش نمیاد یه روز نرفته باشه.' },
      { who: 'narges', text: 'پس فردا صبح زود، می‌ریم قنات.' },
    ],
  },
  {
    id: 'qanat',
    name: 'قنات',
    intro: [
      { who: 'kaveh', text: 'قنات… یه رود زیرزمینی که آدم‌ها با دست کندن. بعضی‌هاش دو هزار ساله‌ان.', mood: 'surprised' },
      { who: 'jalal', text: 'کی اومده سراغ من؟ … این عکس… این عکس رو از کجا آوردید؟', mood: 'surprised' },
      { who: 'narges', text: 'من نرگسم، نوه‌ی حاج‌بابا. حاج‌بابا… دیگه بین ما نیست.', mood: 'sad' },
      { who: 'jalal', text: 'خدا رحمتش کنه. … چهل سال منتظر بودم یه روز از اون در بیاد تو.', mood: 'sad' },
    ],
    tasks: [
      { id: 'qn.shaft', title: 'دهانه‌ی چاه', cost: 456, layer: 'shaft', after: [{ who: 'jalal', text: 'هر چاه یه نفس قناته. اگه یکی بسته بشه، آب راهش رو گم می‌کنه.' }] },
      { id: 'qn.windlass', title: 'چرخ چاه', cost: 458, layer: 'windlass', after: [{ who: 'farokhi', text: 'من برج ساختم، ولی هیچ‌وقت چیزی زیر زمین نساختم. این یه شاهکاره.', mood: 'surprised' }] },
      { id: 'qn.bucket', title: 'دلو و طناب', cost: 460, layer: 'bucket', after: [{ who: 'reza', text: 'آب قنات رو چشیدم. … خنک‌تر از یخچال خونه‌ی ماست!', mood: 'surprised' }] },
      { id: 'qn.channel', title: 'کانال آب', cost: 462, layer: 'channel', after: [{ who: 'jalal', text: 'حاجی جوون که بود، یه تابستون با من همین کانال رو لای‌روبی کرد. دستاش پر تاول شد، ولی نرفت.' }] },
      { id: 'qn.payab', title: 'پله‌های پایاب', cost: 464, layer: 'payab', after: [{ who: 'narges', text: 'پله‌هایی که تا خود آب می‌رن. حاج‌بابا همیشه می‌گفت «باید تا ته کار رفت». حالا می‌دونم از کی یاد گرفته بود.' }] },
    ],
    outro: [
      { who: 'jalal', text: 'بیاید خونه‌ی من. یه جعبه دارم که چهل ساله منتظر صاحبشه.' },
    ],
  },
  {
    id: 'windhouse',
    name: 'خونه‌ی بادگیر',
    intro: [
      { who: 'jalal', text: 'خونه‌ی من. بادگیرش رو پدربزرگم ساخت. ولی خیلی وقته تنهایی از پسش برنمیام.', mood: 'sad' },
      { who: 'fakhri', text: 'حیاطش گود افتاده! یعنی چی؟', mood: 'surprised' },
      { who: 'jalal', text: 'گودال باغچه. پایین‌تر، خنک‌تر. یزدی‌ها با گرما کنار اومدن، نجنگیدن.' },
    ],
    tasks: [
      { id: 'wh.tower', title: 'برج بادگیر', cost: 462, layer: 'tower', after: [{ who: 'kaveh', text: 'باد از بالا میاد، از روی حوض رد می‌شه و خنک می‌شه. کولر دو هزار ساله، بدون برق!', mood: 'surprised' }] },
      { id: 'wh.poolroom', title: 'حوض‌خونه', cost: 464, layer: 'poolroom', after: [{ who: 'golab', text: 'کنار حوض‌خونه بشینید. وسط ظهر تابستون هم خنکه. کاش خونه‌ی ما هم بادگیر داشت.' }] },
      { id: 'wh.garden', title: 'گودال باغچه', cost: 466, layer: 'garden', after: [{ who: 'fakhri', text: 'انار و انجیر و یه درخت توت. جلال‌خان، باغچه‌ت مثل بهشته.', mood: 'happy' }] },
      { id: 'wh.window', title: 'پنجره‌ی گره‌چینی', cost: 468, layer: 'window', after: [{ who: 'aydin', text: 'نقش این پنجره مثل نقش فرش تبریزه. هنر همه‌ی ایران یه زبونه.' }] },
      { id: 'wh.box', title: 'جعبه‌ی نامه‌ها', cost: 470, layer: 'box', after: [{ who: 'jalal', text: 'این جعبه پر از نامه‌های حاجیه. هر سال یکی می‌نوشت. ولی من… هیچ‌وقت جواب ندادم.', mood: 'sad' }, { who: 'narges', text: 'چرا، استاد؟', mood: 'surprised' }] },
    ],
    outro: [
      { who: 'jalal', text: 'من سواد نداشتم، دخترم. خجالت می‌کشیدم بگم. نامه‌هاش رو همسایه برام می‌خوند.', mood: 'sad' },
      { who: 'narges', text: 'حاج‌بابا حتماً می‌دونست. برای همین هر سال باز هم می‌نوشت.', mood: 'sad' },
      { who: 'bahman', text: 'داداش همیشه همین‌طوری بود. دوستی رو با جواب نامه نمی‌سنجید.' },
    ],
  },
  {
    id: 'yazdsweets',
    name: 'قنادی رفاقت',
    intro: [
      { who: 'reza', text: 'استاد جلال می‌گه بهترین قطاب یزد مال قنادی سر کوچه‌ست. ولی صاحبش پیر شده و مغازه نیمه‌تعطیله.' },
      { who: 'jalal', text: 'قنادی «رفاقت». حاجی و من هر بار این‌جا قطاب و چای می‌خوردیم.' },
    ],
    tasks: [
      { id: 'ys.oven', title: 'فر و سینی‌ها', cost: 468, layer: 'oven', after: [{ who: 'reza', text: 'فر قنادی روشن شد! بوی هل و گلاب پیچید تو کوچه.', mood: 'happy' }] },
      { id: 'ys.ghotab', title: 'قطاب', cost: 470, layer: 'ghotab', after: [{ who: 'mahin', text: 'قطاب! پر از مغز بادوم و پودر قند. … یکی دیگه، فقط یکی دیگه!', mood: 'happy' }] },
      { id: 'ys.baklava', title: 'باقلوای یزدی', cost: 472, layer: 'baklava', after: [{ who: 'aydin', text: 'باقلوای یزدی با باقلوای تبریز فرق داره. این‌جا نرم‌تره… هر دوش رو دوست دارم!', mood: 'happy' }] },
      { id: 'ys.pashmak', title: 'پشمک', cost: 474, layer: 'pashmak', after: [{ who: 'shirin', text: 'پشمک! مثل ابر شیرین. بچه که بودم فکر می‌کردم پشمک از ابرها میاد.', mood: 'happy' }] },
      { id: 'ys.showcase', title: 'ویترین شیرینی', cost: 476, layer: 'showcase', after: [{ who: 'jalal', text: 'قنادی رفاقت دوباره باز شد. حاجی اگه بود، اولین مشتریش بود.' }] },
    ],
    outro: [
      { who: 'narges', text: 'استاد جلال، با ما بیاید تهران. قهوه‌خونه‌ی حاج‌بابا رو ببینید. چهل سال دیر شده، ولی هنوز دیر نیست.' },
      { who: 'jalal', text: 'تهران؟ من چهل ساله از یزد بیرون نرفتم. … باشه. ولی قطاب هم میارم.', mood: 'happy' },
    ],
  },
  {
    id: 'reunion',
    name: 'مهمون یزدی',
    intro: [
      { who: 'mahin', text: 'خبر داغ! یه مهمون از یزد داره میاد قهوه‌خونه! کل محله جمع شدن.', mood: 'happy' },
      { who: 'jalal', text: 'این‌جا… همون قهوه‌خونه‌ایه که حاجی تو نامه‌هاش می‌نوشت. همون تخت‌ها، همون پنجره‌ها.', mood: 'surprised' },
    ],
    tasks: [
      { id: 'rn.photo', title: 'قاب عکس دو رفیق', cost: 474, layer: 'photo', after: [{ who: 'narges', text: 'عکس حاج‌بابا و استاد جلال جلوی در دوکوبه‌ای. حالا جاش رو دیوار قهوه‌خونه‌ست.' }] },
      { id: 'rn.sweets', title: 'سینی قطاب یزدی', cost: 476, layer: 'sweets', after: [{ who: 'reza', text: 'قطاب یزد کنار سنگک تهرون. امروز همه مهمون قهوه‌خونه‌ان!', mood: 'happy' }] },
      { id: 'rn.model', title: 'ماکت بادگیر', cost: 478, layer: 'model', after: [{ who: 'jalal', text: 'این بادگیر کوچیک رو خودم ساختم، برای قهوه‌خونه‌ی حاجی. که همیشه یه کم از یزد این‌جا باشه.' }] },
      { id: 'rn.samovar', title: 'چای دو رفیق', cost: 480, layer: 'samovar', after: [{ who: 'golab', text: 'جلال‌خان، سماور حاجی رو امروز از موزه آوردیم، فقط برای شما. حاجی همیشه می‌گفت اولین چای مال مهمونه.' }] },
      { id: 'rn.letter', title: 'نامه‌ی جواب', cost: 482, layer: 'letter', after: [{ who: 'jalal', text: 'یه نامه نوشتم، اولین نامه‌ی عمرم. نرگس خانم یادم داد. … «سلام حاجی، دیر شد، ولی رسیدم.»', mood: 'sad' }, { who: 'narges', text: 'می‌ذاریمش تو قاب، کنار عکس شما دوتا. برای همیشه.', mood: 'sad' }] },
    ],
    outro: [
      { who: 'jalal', text: 'یه چیزی بگم؟ تو یزد کلی پیرمرد و پیرزن مثل من هستن که سواد ندارن و خجالت می‌کشن بگن.', mood: 'sad' },
      { who: 'narges', text: 'پس یه مدرسه‌ی شبونه راه بندازیم! برای هر کی که هیچ‌وقت فرصتش رو نداشت.', mood: 'happy' },
      { who: 'morteza', text: 'مدرسه‌ی شبونه؟ … راستش، من حساب رو خوب بلدم، ولی نوشتن…', mood: 'sad' },
      { who: 'mahin', text: 'آقا مرتضی! این دیگه خبر داغ نیست، این خبر قشنگه!', mood: 'happy' },
    ],
  },
  // ------------------------------------------------------------------ season 16: مدرسه‌ی شبونه
  {
    id: 'oldschool',
    name: 'مدرسه‌ی قدیمی محله',
    intro: [
      { who: 'narges', text: 'مدرسه‌ی قدیمی کوچه. من و شیرین کلاس اول رو همین‌جا خوندیم. بیست ساله درش قفله.', mood: 'sad' },
      { who: 'shirin', text: 'یادته معلم‌مون همیشه می‌گفت «نرگس، ساکت!»؟ هنوز هم این در رو که می‌بینم، ساکت می‌شم!', mood: 'happy' },
      { who: 'fakhri', text: 'من سی سال معلم بودم. اگه قراره مدرسه‌ی شبونه راه بیفته، کلاسش با من.' },
      { who: 'mahin', text: 'فخری‌خانم معلم بوده؟! … چطور من این رو نمی‌دونستم؟!', mood: 'surprised' },
    ],
    tasks: [
      { id: 'os.sign', title: 'تابلوی مدرسه', cost: 480, layer: 'sign', after: [{ who: 'kaveh', text: 'تابلو رو تمیز کردم. زیرش نوشته: «دبستان امید، تأسیس ۱۳۴۲».' }] },
      { id: 'os.benches', title: 'نیمکت‌های چوبی', cost: 482, layer: 'benches', after: [{ who: 'golab', text: 'رو این نیمکت‌ها اسم سه نسل از بچه‌های کوچه کنده شده.' }] },
      { id: 'os.board', title: 'تخته‌سیاه', cost: 484, layer: 'board', after: [{ who: 'fakhri', text: 'تخته‌سیاه رو رنگ زدم. حالا فقط شاگرد کم داریم.' }] },
      { id: 'os.heater', title: 'بخاری نفتی', cost: 486, layer: 'heater', after: [{ who: 'reza', text: 'بخاری نفتی! زمستون‌ها همه دورش جمع می‌شدیم و نون‌مون رو روش گرم می‌کردیم.', mood: 'happy' }] },
      { id: 'os.bell', title: 'زنگ مدرسه', cost: 488, layer: 'bell', after: [{ who: 'mahin', text: '(زنگ) … دیدید؟ هنوز صداش رو که می‌شنوم، دلم می‌خواد بدوم سر کلاس!', mood: 'happy' }] },
    ],
    outro: [
      { who: 'fakhri', text: 'کلاس از شنبه، ساعت هفت شب. هر کی می‌خواد بیاد، اسم بنویسه.' },
      { who: 'morteza', text: 'اسم… بنویسه؟ … یکی برام می‌نویسه؟', mood: 'sad' },
      { who: 'narges', text: 'آقا مرتضی، از شنبه خودتون می‌نویسید.', mood: 'happy' },
    ],
  },
  {
    id: 'firstclass',
    name: 'اولین شب کلاس',
    intro: [
      { who: 'jalal', text: 'از یزد اومدم که درس بخونم. تو این سن. خنده‌داره، نه؟', mood: 'sad' },
      { who: 'fakhri', text: 'هیچ‌چی خنده‌دار نیست، جلال‌خان. بفرمایید سر جاتون.', mood: 'angry' },
      { who: 'yadollah', text: 'منم اومدم! قندی رو دادم دست همسایه. بهش گفتم «قندی، باید باسواد برگردم».', mood: 'happy' },
    ],
    tasks: [
      { id: 'fc.lights', title: 'چراغ‌های کلاس', cost: 486, layer: 'lights', after: [{ who: 'shirin', text: 'کلاس روشن شد. چه حس عجیبیه، شب بیای مدرسه.' }] },
      { id: 'fc.alphabet', title: 'الفبای دیوار', cost: 488, layer: 'alphabet', after: [{ who: 'fakhri', text: '«آ» مثل آب. «ب» مثل بابا. … آقا مرتضی، «پ» مثل چی؟' }, { who: 'morteza', text: '«پ» مثل… پول!', mood: 'happy' }, { who: 'fakhri', text: 'بد نیست. یعنی خوبه.' }] },
      { id: 'fc.notebooks', title: 'دفتر و مداد', cost: 490, layer: 'notebooks', after: [{ who: 'yadollah', text: 'دفتر خودم! اسمم رو روش نوشتن. یعنی یه روز خودم می‌تونم بنویسمش؟', mood: 'surprised' }] },
      { id: 'fc.samovar', title: 'سماور کلاس', cost: 492, layer: 'samovar', after: [{ who: 'golab', text: 'کلاس شبونه بدون چای نمی‌شه. شاگردهای این کلاس همه از شصت گذشتن!', mood: 'happy' }] },
      { id: 'fc.word', title: 'اولین کلمه', cost: 494, layer: 'word', after: [{ who: 'jalal', text: 'نوشتم! «آب». اولین کلمه‌ای که تو عمرم نوشتم. مقنی باید اول «آب» بنویسه دیگه.', mood: 'happy' }] },
    ],
    outro: [
      { who: 'fakhri', text: 'شاگردهای خوبی هستید. ولی کتاب کم داریم. با یه دفتر و یه تخته، سواد کامل نمی‌شه.' },
      { who: 'morteza', text: 'کتاب؟ … پیکان من! پیکان رو کتابخونه‌ی سیار کنیم، بره همه‌ی محله‌ها.', mood: 'happy' },
      { who: 'mahin', text: 'آقا مرتضی پیشنهاد مجانی داد؟! این دیگه از برکت مدرسه‌ست!', mood: 'surprised' },
    ],
  },
  {
    id: 'bookvan',
    name: 'کتابخونه‌ی سیار',
    intro: [
      { who: 'kaveh', text: 'پیکان عروس، حالا کتابخونه‌ی سیار! صندلی عقب رو برداشتیم، جاش قفسه می‌ذاریم.' },
      { who: 'aydin', text: 'از تبریز یه بار کتاب قصه فرستادن. ننه‌م گفت «کتاب، بهترین سوغاتیه».' },
    ],
    tasks: [
      { id: 'bv.shelves', title: 'قفسه‌های ماشین', cost: 492, layer: 'shelves', after: [{ who: 'farokhi', text: 'قفسه‌ها رو جوری ساختیم که تو دست‌انداز کتاب‌ها نریزن. مهندسی یعنی همین!' }] },
      { id: 'bv.books', title: 'کتاب‌های قصه', cost: 494, layer: 'books', after: [{ who: 'narges', text: 'شاهنامه‌ی مصور، قصه‌های مجید، گلستان سعدی… برای هر سنی یه کتاب.' }] },
      { id: 'bv.sign', title: 'تابلوی کتابخونه', cost: 496, layer: 'sign', after: [{ who: 'shirin', text: 'رو ماشین نوشتیم «کتابخونه‌ی سیار محله». درشت، که از دور خونده بشه.' }] },
      { id: 'bv.rug', title: 'گلیم و پشتی', cost: 498, layer: 'rug', after: [{ who: 'bahman', text: 'کنار ماشین گلیم پهن کردیم. هر کی کتاب گرفت، همین‌جا می‌شینه و می‌خونه.' }] },
      { id: 'bv.lamp', title: 'چراغ مطالعه', cost: 500, layer: 'lamp', after: [{ who: 'yadollah', text: 'یه کتاب گرفتم که توش عکس شتر داره. فردا شب برای قندی می‌خونمش!', mood: 'happy' }] },
    ],
    outro: [
      { who: 'mahin', text: 'خبر داغ! بچه‌های محله‌ی بغلی هم صف کشیدن. کتابخونه‌ی سیار از نونوایی رضا شلوغ‌تر شده!', mood: 'surprised' },
      { who: 'reza', text: 'از نونوایی من شلوغ‌تر؟ … خب، این یکی رو قبول دارم.', mood: 'happy' },
      { who: 'fakhri', text: 'آخر ماه شب شعر داریم. هر شاگرد یه چیزی می‌نویسه و می‌خونه.' },
    ],
  },
  {
    id: 'poetry',
    name: 'شب شعر',
    intro: [
      { who: 'fakhri', text: 'امشب شاگردها نوشته‌ی خودشون رو می‌خونن. هیچ‌کس حق نداره بخنده!', mood: 'angry' },
      { who: 'mahin', text: 'رادیو محله امشب زنده پخش می‌کنه! … ای وای، باتری میکروفون کجاست؟', mood: 'surprised' },
    ],
    tasks: [
      { id: 'pn.stage', title: 'سکوی شعرخوانی', cost: 498, layer: 'stage', after: [{ who: 'kaveh', text: 'سکو رو با آجرهای قدیمی مدرسه ساختیم. هر آجرش یه خاطره‌ست.' }] },
      { id: 'pn.lanterns', title: 'فانوس‌های حیاط', cost: 500, layer: 'lanterns', after: [{ who: 'golab', text: 'فانوس‌ها رو که روشن کردن، حیاط مدرسه شد مثل شب‌های قدیم.' }] },
      { id: 'pn.wall', title: 'دیوار نوشته‌ها', cost: 502, layer: 'wall', after: [{ who: 'narges', text: 'دیوار رو پر از نوشته‌ی شاگردها کردیم. خط جلال‌خان از همه قشنگ‌تره!', mood: 'happy' }] },
      { id: 'pn.tea', title: 'چای و خرما', cost: 504, layer: 'tea', after: [{ who: 'yadollah', text: 'خرمای کویر آوردم. شب شعر بدون خرما مثل کویر بدون ستاره‌ست.', mood: 'happy' }] },
      { id: 'pn.mic', title: 'میکروفون رادیو', cost: 506, layer: 'mic', after: [{ who: 'morteza', text: '(پشت میکروفون) «من مرتضی‌ام. بقالم. و امشب… اسمم رو خودم نوشتم.»', mood: 'sad' }, { who: 'mahin', text: 'کل محله داره دست می‌زنه، آقا مرتضی!', mood: 'happy' }] },
    ],
    outro: [
      { who: 'jalal', text: 'نوبت منه. «حاجی، رفیقم. چهل سال تو نوشتی و من گوش دادم. حالا من می‌نویسم و تو گوش بده.»', mood: 'sad' },
      { who: 'bahman', text: 'داداش اگه بود، الان گریه می‌کرد. … منم دارم گریه می‌کنم.', mood: 'sad' },
      { who: 'fakhri', text: 'ماه دیگه امتحان آخره. هر کی قبول بشه، تقدیرنامه می‌گیره.' },
    ],
  },
  {
    id: 'graduation',
    name: 'جشن تقدیرنامه',
    intro: [
      { who: 'fakhri', text: 'امتحان تموم شد. … همه قبول شدن. همه‌تون.', mood: 'happy' },
      { who: 'morteza', text: 'من؟ من هم؟! فخری‌خانم، شوخی که نمی‌کنید؟', mood: 'surprised' },
      { who: 'fakhri', text: 'من هیچ‌وقت شوخی نمی‌کنم، آقا مرتضی.' },
    ],
    tasks: [
      { id: 'gr.stage', title: 'سن جشن', cost: 504, layer: 'stage', after: [{ who: 'aydin', text: 'سن رو با فرش تبریز فرش کردیم. برای این شاگردها کم‌ترین کاره.' }] },
      { id: 'gr.certs', title: 'تقدیرنامه‌ها', cost: 506, layer: 'certs', after: [{ who: 'fakhri', text: 'تقدیرنامه‌ها رو با خط خودم نوشتم. هر اسم رو سه بار تمرین کردم.' }] },
      { id: 'gr.flowers', title: 'گل و شیرینی', cost: 508, layer: 'flowers', after: [{ who: 'reza', text: 'نون‌برنجی و گل محمدی، برای باسوادترین پیرمردهای تهرون!', mood: 'happy' }] },
      { id: 'gr.photo', title: 'عکس یادگاری', cost: 510, layer: 'photo', after: [{ who: 'shirin', text: 'همه بیاید! شاگردها جلو، معلم وسط. … فخری‌خانم، یه لبخند!' }, { who: 'fakhri', text: '… لبخند زدم دیگه.' }] },
      { id: 'gr.sign', title: 'تابلوی تازه‌ی بقالی', cost: 512, layer: 'sign', after: [{ who: 'morteza', text: 'تابلوی تازه‌ی بقالی رو خودم نوشتم: «بقالی مرتضی — نسیه هم داریم!»', mood: 'happy' }, { who: 'mahin', text: 'نسیه؟!! آقا مرتضی، سواد آدم رو عوض می‌کنه!', mood: 'surprised' }] },
    ],
    outro: [
      { who: 'mahin', text: 'داغ‌ترین خبر سال! تلویزیون زنگ زد. می‌خوان یه مسابقه‌ی آشپزی تو کوچه‌ی ما ضبط کنن!', mood: 'surprised' },
      { who: 'reza', text: 'مسابقه‌ی آشپزی؟ … من فقط نون بلدم!', mood: 'surprised' },
      { who: 'golab', text: 'نترس رضا. این کوچه یه آشپزخونه‌ی بزرگه. فقط باید درش رو باز کرد.', mood: 'happy' },
    ],
  },
  // ------------------------------------------------------------------ season 17: مسابقه‌ی آشپزی
  {
    id: 'tvset',
    name: 'استودیوی کوچه',
    intro: [
      { who: 'sepideh', text: 'سلام به همه! من سپیده‌ام، مجری «آشپزی محله». قراره کوچه‌ی شما بشه استودیوی ما!', mood: 'happy' },
      { who: 'mahin', text: 'تلویزیون! تو کوچه‌ی ما! … من باید برم آرایشگاه شیرین. همین الان!', mood: 'surprised' },
      { who: 'reza', text: 'من فقط نون بلدم. ولی اگه قراره کوچه رو نشون بدن، باید بهترین نون عمرم رو بپزم.' },
    ],
    tasks: [
      { id: 'tv.lights', title: 'نورهای صحنه', cost: 510, layer: 'lights', after: [{ who: 'sepideh', text: 'نورها رو ببینید! کوچه‌ی شما از هر استودیویی قشنگ‌تره.', mood: 'happy' }] },
      { id: 'tv.cameras', title: 'دوربین‌ها', cost: 512, layer: 'cameras', after: [{ who: 'farokhi', text: 'سه تا دوربین، برای یه کوچه؟ حالا می‌فهمم چقدر مهم شدیم.', mood: 'surprised' }] },
      { id: 'tv.stations', title: 'میزهای آشپزی', cost: 514, layer: 'stations', after: [{ who: 'aydin', text: 'من و رضا یه تیم، نرگس و شیرین یه تیم، فخری‌خانم و ننه‌گلاب یه تیم. فخری‌خانم، ما رو نترسونید!', mood: 'happy' }] },
      { id: 'tv.judges', title: 'میز داورها', cost: 516, layer: 'judges', after: [{ who: 'sepideh', text: 'داورهامون: یه سرآشپز، یه منتقد غذا و یه داور ویژه از خود کوچه: آقا مرتضی! چون تا حالا از هیچ غذایی تعریف نکرده.' }] },
      { id: 'tv.banner', title: 'تابلوی «آشپزی محله»', cost: 518, layer: 'banner', after: [{ who: 'shirin', text: 'تابلو رو زدیم! … مامانم از شهرستان زنگ زد: «شیرین، تلویزیونی شدی؟»', mood: 'happy' }] },
    ],
    outro: [
      { who: 'sepideh', text: 'مرحله‌ی اول: غذای سنتی. هر تیم یه غذای اصیل ایرانی می‌پزه. فردا صبح، ساعت ده!' },
      { who: 'golab', text: 'غذای سنتی؟ پس آشپزخونه‌ی من. سی ساله کسی توش آشپزی نکرده، ولی هنوز بوی قورمه‌سبزی می‌ده.' },
    ],
  },
  {
    id: 'golabkitchen',
    name: 'آشپزخونه‌ی ننه‌گلاب',
    intro: [
      { who: 'golab', text: 'این آشپزخونه‌ی مادرمه. هر جمعه این‌جا قورمه‌سبزی بار می‌ذاشت و کل کوچه بوش رو می‌فهمید.' },
      { who: 'narges', text: 'ننه‌گلاب، دستور پخت مادرتون رو یادتونه؟' },
      { who: 'golab', text: 'دستور؟ دخترم، قورمه‌سبزی با دل پخته می‌شه، نه با دستور.', mood: 'happy' },
    ],
    tasks: [
      { id: 'gk.stove', title: 'اجاق قدیمی', cost: 516, layer: 'stove', after: [{ who: 'kaveh', text: 'اجاق رو تعمیر کردم. شعله‌ش آبیه، یعنی سالمه.' }] },
      { id: 'gk.pots', title: 'قابلمه‌های مسی', cost: 518, layer: 'pots', after: [{ who: 'fakhri', text: 'قابلمه‌ها رو سفید کردیم. مسگر محله گفت این‌ها صد سال عمر دارن.' }] },
      { id: 'gk.herbs', title: 'سبزی قورمه', cost: 520, layer: 'herbs', after: [{ who: 'golab', text: 'تره، جعفری، گشنیز، شنبلیله. شنبلیله زیاد نشه ها! … فخری، دستت رو کم کن!', mood: 'angry' }, { who: 'fakhri', text: 'من سی سال قورمه‌سبزی پختم، گلاب‌خانم.', mood: 'angry' }] },
      { id: 'gk.shelf', title: 'قفسه‌ی ادویه', cost: 522, layer: 'shelf', after: [{ who: 'aydin', text: 'زردچوبه، لیمو عمانی، زعفرون… ادویه‌های ایران مثل رنگ‌های فرش تبریزن.' }] },
      { id: 'gk.window', title: 'پنجره‌ی رو به کوچه', cost: 524, layer: 'window', after: [{ who: 'sepideh', text: 'دوربین رو بذارید پشت پنجره. بوی قورمه‌سبزی رو نمی‌شه نشون داد، ولی بخارش رو چرا!', mood: 'happy' }] },
    ],
    outro: [
      { who: 'sepideh', text: 'نتیجه‌ی مرحله‌ی اول: مساوی! همه‌ی تیم‌ها بیست گرفتن. داور ویژه‌مون، آقا مرتضی، سه بشقاب خورد.', mood: 'surprised' },
      { who: 'morteza', text: 'برای داوری بود! … باید مطمئن می‌شدم.' },
      { who: 'sepideh', text: 'مرحله‌ی دوم: خرید مواد از بازار. هر تیم بودجه‌ی محدود داره!' },
      { who: 'morteza', text: 'بودجه‌ی محدود؟ بالاخره یه مسابقه که من توش استادم!', mood: 'happy' },
    ],
  },
  {
    id: 'market',
    name: 'بازار تره‌بار',
    intro: [
      { who: 'morteza', text: 'قانون اول بازار: هیچ‌وقت قیمت اول رو قبول نکن. قانون دوم: قانون اول رو فراموش نکن!', mood: 'happy' },
      { who: 'reza', text: 'آقا مرتضی، شما که تو تیم ما نیستی!' },
      { who: 'morteza', text: 'من داورم، ولی مشاور هم هستم. مجانی!', mood: 'happy' },
    ],
    tasks: [
      { id: 'mk.stalls', title: 'بساط سبزی‌فروش', cost: 522, layer: 'stalls', after: [{ who: 'shirin', text: 'سبزی تازه، صبح زود از باغ‌های ورامین اومده. بوش رو ببین!' }] },
      { id: 'mk.fruit', title: 'جعبه‌های میوه', cost: 524, layer: 'fruit', after: [{ who: 'bahman', text: 'انار ساوه، سیب دماوند، پرتقال شمال. هامبورگ هیچ‌وقت همچین بازاری نداشت.', mood: 'happy' }] },
      { id: 'mk.spices', title: 'ادویه‌فروشی', cost: 526, layer: 'spices', after: [{ who: 'yadollah', text: 'زیره‌ی کرمان، زعفرون قائن… من بوی کویر رو تو ادویه‌ها حس می‌کنم.' }] },
      { id: 'mk.scale', title: 'ترازوی قدیمی', cost: 528, layer: 'scale', after: [{ who: 'morteza', text: 'یه کیلو؟ این ترازو نهصد گرم نشون می‌ده! … آهان، پاکت رو حساب نکرده. ببخشید.', mood: 'surprised' }] },
      { id: 'mk.cart', title: 'گاری خرید', cost: 530, layer: 'cart', after: [{ who: 'aydin', text: 'گاری پر شد و هنوز پول داریم! آقا مرتضی، شما نابغه‌ای!', mood: 'happy' }, { who: 'morteza', text: 'می‌دونم.' }] },
    ],
    outro: [
      { who: 'sepideh', text: 'و حالا… فینال! غذای فینال: پلو و ته‌دیگ. ته‌دیگ برنده رو تعیین می‌کنه!', mood: 'happy' },
      { who: 'reza', text: 'ته‌دیگ… یعنی نون برنج! بالاخره یه چیزی که بلدم!', mood: 'happy' },
    ],
  },
  {
    id: 'finalcook',
    name: 'فینال آشپزی',
    intro: [
      { who: 'sepideh', text: 'به فینال «آشپزی محله» خوش اومدید! سه تیم، سه دیگ پلو، یه ته‌دیگ برنده.', mood: 'happy' },
      { who: 'golab', text: 'یادتون باشه: ته‌دیگ صبر می‌خواد. هر کی عجله کنه، ته‌دیگش می‌سوزه.' },
    ],
    tasks: [
      { id: 'fn.stations', title: 'ایستگاه‌های فینال', cost: 528, layer: 'stations', after: [{ who: 'kaveh', text: 'سه ایستگاه، سه اجاق. … چرا اجاق تیم رضا از همه داغ‌تره؟', mood: 'surprised' }, { who: 'reza', text: 'تنوری‌ام دیگه!', mood: 'happy' }] },
      { id: 'fn.pots', title: 'دیگ‌های پلو', cost: 530, layer: 'pots', after: [{ who: 'narges', text: 'برنج دم کشید. بوش کل کوچه رو گرفته. همسایه‌های محله‌ی بغلی هم اومدن!' }] },
      { id: 'fn.tahdig', title: 'ته‌دیگ', cost: 532, layer: 'tahdig', after: [{ who: 'shirin', text: 'لحظه‌ی حقیقت! دیگ رو برگردون… ته‌دیگ رضا… طلایی و یکپارچه!', mood: 'surprised' }, { who: 'aydin', text: 'رضا، تو یه هنرمندی!', mood: 'happy' }] },
      { id: 'fn.table', title: 'سفره‌ی داورها', cost: 534, layer: 'table', after: [{ who: 'morteza', text: 'من به عنوان داور ویژه… بیست! بیست! بیست! اولین باره که چیزی رو مجانی تعریف می‌کنم.', mood: 'happy' }] },
      { id: 'fn.clock', title: 'ساعت مسابقه', cost: 536, layer: 'clock', after: [{ who: 'sepideh', text: 'زمان تموم شد! و برنده‌ی «آشپزی محله»… کل کوچه‌ست! داورها نتونستن انتخاب کنن.', mood: 'happy' }] },
    ],
    outro: [
      { who: 'sepideh', text: 'برنامه‌ی ما جمعه شب پخش می‌شه. ولی قبلش یه پیشنهاد دارم: یه سفره‌ی بزرگ، برای همه‌ی محله.' },
      { who: 'golab', text: 'سفره‌ی بزرگ؟ مثل قدیما! هر خونه یه غذا میاورد و همه کنار هم می‌خوردن.', mood: 'happy' },
    ],
  },
  {
    id: 'bigsofreh',
    name: 'سفره‌ی محله',
    intro: [
      { who: 'mahin', text: 'خبر داغ! برنامه پخش شد و تلفن من از صبح زنگ می‌خوره! همه می‌خوان بدونن کوچه‌ی ما کجاست.', mood: 'surprised' },
      { who: 'narges', text: 'امشب سفره‌ی محله‌ست، از اول کوچه تا آخرش. هر کی یه غذا آورده.' },
    ],
    tasks: [
      { id: 'bs.sofreh', title: 'سفره‌ی بلند', cost: 534, layer: 'sofreh', after: [{ who: 'fakhri', text: 'سفره رو از اول کوچه تا جلوی قهوه‌خونه پهن کردیم. صد و پنجاه متر!', mood: 'surprised' }] },
      { id: 'bs.dishes', title: 'غذاهای همسایه‌ها', cost: 536, layer: 'dishes', after: [{ who: 'aydin', text: 'کوفته‌ی تبریز، قورمه‌سبزی ننه‌گلاب، قطاب یزد، آش کاشی… کل ایران سر این سفره‌ست.', mood: 'happy' }] },
      { id: 'bs.bread', title: 'سبدهای سنگک', cost: 538, layer: 'bread', after: [{ who: 'reza', text: 'هزار تا سنگک! فکر کنم بعد از این، نونوایی رو یه هفته تعطیل کنم!', mood: 'happy' }] },
      { id: 'bs.sweets', title: 'شیرینی و چای', cost: 540, layer: 'sweets', after: [{ who: 'jalal', text: 'قطاب آوردم، از قنادی رفاقت. حاجی اگه بود، بالای سفره می‌نشست.' }] },
      { id: 'bs.lights', title: 'چراغونی سفره', cost: 542, layer: 'lights', after: [{ who: 'sepideh', text: 'من تو هزار تا برنامه بودم، ولی هیچ‌وقت همچین سفره‌ای ندیدم. … این کوچه، خونه‌ست.', mood: 'sad' }] },
    ],
    outro: [
      { who: 'golab', text: '(به آسمون نگاه می‌کنه) … بوی برف میاد. امسال زمستون زود اومده.' },
      { who: 'kaveh', text: 'برف سنگین؟ پشت‌بوم‌های کاهگلی کوچه طاقت برف سنگین ندارن.', mood: 'surprised' },
      { who: 'narges', text: 'پس قبل از برف، باید همه‌ی پشت‌بوم‌ها رو آماده کنیم.' },
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
