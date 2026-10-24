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
};

export interface Line {
  who: string;
  text: string;
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
];

export function findTask(id: string): { place: Place; task: Task; index: number } | null {
  for (const place of PLACES) {
    const index = place.tasks.findIndex((t) => t.id === id);
    if (index >= 0) return { place, task: place.tasks[index], index };
  }
  return null;
}
