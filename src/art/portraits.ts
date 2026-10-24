// Character busts (100×100). Female characters wear a headscarf (Iranian content rules).

import { INK, O, THIN } from './kit';

const SKIN = '#f3c7a0';
const SKIN_D = '#e2a77e';

export type Mood = 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised';

interface FaceOpts {
  skin?: string;
  eyes?: 'open' | 'smile' | 'narrow';
  brows?: 'soft' | 'thick' | 'raised' | 'stern' | 'worried';
  mouth?: 'smile' | 'grin' | 'small' | 'smirk' | 'open' | 'frown' | 'flat';
  blush?: boolean;
  lashes?: boolean;
  wrinkles?: boolean;
  tear?: boolean;
}

/** How a mood overrides a character's resting face. */
const MOODS: Record<Mood, FaceOpts> = {
  neutral: {},
  happy: { eyes: 'smile', mouth: 'grin' },
  sad: { eyes: 'open', brows: 'worried', mouth: 'frown', tear: true },
  angry: { eyes: 'open', brows: 'stern', mouth: 'flat' },
  surprised: { eyes: 'open', brows: 'raised', mouth: 'open' },
};

function face(o: FaceOpts = {}): string {
  const skin = o.skin ?? SKIN;
  const eyeY = 52;
  const eyes =
    o.eyes === 'smile'
      ? `<path d="M37 ${eyeY} q4 -4 8 0 M55 ${eyeY} q4 -4 8 0" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`
      : o.eyes === 'narrow'
        ? `<path d="M37 ${eyeY} h8 M55 ${eyeY} h8" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`
        : `<ellipse cx="41" cy="${eyeY}" rx="3.2" ry="4" fill="${INK}"/><ellipse cx="59" cy="${eyeY}" rx="3.2" ry="4" fill="${INK}"/>` +
          `<circle cx="42.2" cy="${eyeY - 1.5}" r="1.1" fill="#fff"/><circle cx="60.2" cy="${eyeY - 1.5}" r="1.1" fill="#fff"/>`;
  const lashes = o.lashes ? `<path d="M37 ${eyeY - 3} l-2.5 -2 M63 ${eyeY - 3} l2.5 -2" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>` : '';
  const browY = eyeY - 8;
  const brows =
    o.brows === 'thick'
      ? `<path d="M35 ${browY} q6 -4 11 0 M54 ${browY} q6 -4 11 0" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round"/>`
      : o.brows === 'raised'
        ? `<path d="M36 ${browY - 2} q5 -5 10 -1 M54 ${browY - 1} q5 -4 10 1" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`
        : o.brows === 'stern'
          ? `<path d="M36 ${browY - 2} L46 ${browY + 1} M54 ${browY + 1} L64 ${browY - 2}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`
          : o.brows === 'worried'
            ? `<path d="M36 ${browY + 1} L46 ${browY - 3} M54 ${browY - 3} L64 ${browY + 1}" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`
          : `<path d="M36 ${browY} q5 -3 10 0 M54 ${browY} q5 -3 10 0" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`;
  const mouth =
    o.mouth === 'grin'
      ? `<path d="M41 64 q9 9 18 0 Z" fill="#a8423a" ${THIN}/><path d="M43 64.5 h14" stroke="#fff" stroke-width="2"/>`
      : o.mouth === 'small'
        ? `<path d="M46 65 q4 2.5 8 0" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>`
        : o.mouth === 'smirk'
          ? `<path d="M44 65 q8 3 13 -2" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`
          : o.mouth === 'open'
            ? `<ellipse cx="50" cy="66" rx="5" ry="4" fill="#a8423a" ${THIN}/>`
            : o.mouth === 'frown'
              ? `<path d="M43 68 q7 -6 14 0" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`
              : o.mouth === 'flat'
                ? `<path d="M44 66 h12" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`
            : `<path d="M43 64 q7 6 14 0" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`;
  return (
    `<ellipse cx="50" cy="54" rx="21" ry="24" fill="${skin}" ${O}/>` +
    `<ellipse cx="29" cy="56" rx="3.5" ry="5" fill="${skin}" ${THIN}/><ellipse cx="71" cy="56" rx="3.5" ry="5" fill="${skin}" ${THIN}/>` +
    `<path d="M48 55 q2 6 -1 8" fill="none" stroke="${SKIN_D}" stroke-width="2" stroke-linecap="round"/>` +
    (o.blush ? `<ellipse cx="37" cy="61" rx="4.5" ry="2.6" fill="#f08f8f" opacity=".5"/><ellipse cx="63" cy="61" rx="4.5" ry="2.6" fill="#f08f8f" opacity=".5"/>` : '') +
    (o.wrinkles ? `<path d="M33 49 q-2 2 0 4 M67 49 q2 2 0 4 M42 70 q8 3 16 0" fill="none" stroke="${SKIN_D}" stroke-width="1.6" stroke-linecap="round"/>` : '') +
    eyes + lashes + brows + mouth +
    (o.tear ? `<path d="M37 57 q-2 4 0 6 q2 -2 0 -6 Z" fill="#7cc8f0" stroke="#3a76c4" stroke-width=".8"/>` : '')
  );
}

const bg = (c1: string, c2: string) =>
  `<circle cx="50" cy="50" r="49" fill="${c2}"/><circle cx="50" cy="44" r="40" fill="${c1}" opacity=".55"/>`;

const shoulders = (fill: string, collar = '') =>
  `<path d="M14 100 C14 84 30 78 50 78 C70 78 86 84 86 100 Z" fill="${fill}" ${O}/>` + collar;

/** Loose Tehrani headscarf (rusari) leaving the front hair visible. */
const scarf = (fill: string, pattern = '', hair = '#3b2216') =>
  `<path d="M26 60 C20 30 34 18 50 18 C66 18 80 30 74 60 C78 76 70 86 50 88 C30 86 22 76 26 60 Z" fill="${fill}" ${O}/>` +
  `<path d="M31 46 C34 34 42 30 50 31 C58 30 66 34 69 46 C62 38 56 37 50 38 C44 37 38 38 31 46 Z" fill="${hair}" ${THIN}/>` +
  pattern;

/** Scarf drawn on top of the face edges (the part that frames the chin). */
const scarfFront = (fill: string) =>
  `<path d="M28 58 C28 76 38 84 50 85 C62 84 72 76 72 58 C74 74 68 90 50 92 C32 90 26 74 28 58 Z" fill="${fill}" ${O}/>`;

const dots = (color: string) =>
  [[34, 26], [46, 22], [58, 24], [68, 32], [28, 38], [72, 46]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="${color}"/>`).join('');

export const CAST_IDS = ['narges', 'mahin', 'reza', 'shirin', 'kaveh', 'morteza', 'golab', 'fakhri', 'farokhi', 'bahman', 'aydin'];
export const MOOD_LIST: Mood[] = ['neutral', 'happy', 'sad', 'angry', 'surprised'];

const PORTRAITS: Record<string, (m: FaceOpts) => string> = {
  narges: (m) =>
    bg('#ffd9a8', '#f6b26b') + shoulders('#2f7d6d', `<path d="M42 80 L50 92 L58 80" fill="#f6e3b0" ${THIN}/>`) +
    scarf('#e2507a', dots('#ffd36b')) + face({ blush: true, lashes: true, mouth: 'smile', ...m }) + scarfFront('#e2507a'),
  mahin: (m) =>
    bg('#e8d5ff', '#b48be6') + shoulders('#6c33c2') +
    scarf('#8e44ad', [[32, 30], [48, 22], [64, 28], [72, 44], [28, 46]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="#ffd36b" ${THIN} stroke-width="1"/>`).join(''), '#7a5a3a') +
    face({ eyes: 'open', brows: 'raised', mouth: 'open', blush: true, lashes: true, wrinkles: true, ...m }) +
    `<circle cx="41" cy="52" r="7" fill="none" stroke="#b07a10" stroke-width="2"/><circle cx="59" cy="52" r="7" fill="none" stroke="#b07a10" stroke-width="2"/><path d="M48 52 h4" stroke="#b07a10" stroke-width="2"/>` +
    scarfFront('#8e44ad'),
  reza: (m) =>
    bg('#fff0c8', '#e8c27a') + shoulders('#f4f0e6', `<path d="M34 82 L50 96 L66 82" fill="none" ${THIN}/>`) +
    face({ eyes: 'smile', brows: 'thick', mouth: 'grin', skin: '#e9b48a', ...m }) +
    `<path d="M38 62 C42 58 48 60 50 61 C52 60 58 58 62 62 C58 66 54 63 50 64 C46 63 42 66 38 62 Z" fill="#5a3a22" ${THIN}/>` +
    `<path d="M28 40 C28 22 72 22 72 40 Z" fill="#fff" ${O}/><path d="M28 40 L72 40" ${O}/>` +
    `<ellipse cx="34" cy="70" rx="2" ry="1.4" fill="#fff" opacity=".8"/>`,
  shirin: (m) =>
    bg('#ffe0ef', '#ff9ec4') + shoulders('#1d1d3a', `<circle cx="50" cy="86" r="3" fill="#ffd36b" ${THIN}/>`) +
    scarf('#ff7a9c', `<path d="M30 30 L70 30" stroke="#fff" stroke-width="2" opacity=".6"/><path d="M28 40 L72 40" stroke="#fff" stroke-width="2" opacity=".6"/>`, '#c0782e') +
    face({ eyes: 'open', brows: 'soft', mouth: 'smirk', blush: true, lashes: true, ...m }) +
    (m.mouth ? '' : `<path d="M45 66 q5 3 10 -1" fill="none" stroke="#d33a5b" stroke-width="2.8" stroke-linecap="round"/>`) +
    scarfFront('#ff7a9c'),
  kaveh: (m) =>
    bg('#d6ecff', '#7cb7ef') + shoulders('#3a4f9a', `<path d="M40 80 L50 90 L60 80" fill="#fff" ${THIN}/>`) +
    face({ eyes: 'open', brows: 'soft', mouth: 'small', ...m }) +
    `<path d="M30 46 C26 22 74 22 70 46 C66 32 56 30 50 31 C44 30 34 32 30 46 Z" fill="#2b1b12" ${O}/>` +
    `<path d="M32 60 C34 76 44 80 50 80 C56 80 66 76 68 60 C64 70 58 72 50 72 C42 72 36 70 32 60 Z" fill="#3b2a20" ${THIN}/>` +
    `<rect x="34" y="47" width="13" height="10" rx="3" fill="none" stroke="${INK}" stroke-width="2"/><rect x="53" y="47" width="13" height="10" rx="3" fill="none" stroke="${INK}" stroke-width="2"/><path d="M47 51 h6" stroke="${INK}" stroke-width="2"/>`,
  morteza: (m) =>
    bg('#e3f3d6', '#9ccf7a') + shoulders('#8d6e4a', `<rect x="36" y="80" width="28" height="20" fill="#f4f0e6" ${THIN}/>`) +
    face({ eyes: 'narrow', brows: 'thick', mouth: 'smirk', skin: '#eab88f', wrinkles: true, ...m }) +
    `<path d="M36 61 C42 57 47 59 50 60 C53 59 58 57 64 61 C60 64 56 62 50 63 C44 62 40 64 36 61 Z" fill="#6b6b6b" ${THIN}/>` +
    `<path d="M28 44 C26 36 30 34 32 38 M72 44 C74 36 70 34 68 38" fill="none" stroke="#6b6b6b" stroke-width="4" stroke-linecap="round"/>` +
    `<ellipse cx="44" cy="34" rx="6" ry="2.4" fill="#fff" opacity=".5"/>`,
  golab: (m) =>
    bg('#fff4e0', '#f2c9a0') + shoulders('#2c3e50') +
    scarf('#f4f0e6', `<path d="M30 34 q20 -10 40 0" fill="none" stroke="#c0392b" stroke-width="1.6" opacity=".5"/>`, '#d8d8d8') +
    face({ eyes: 'smile', brows: 'soft', mouth: 'smile', wrinkles: true, skin: '#eebd96', blush: true, ...m }) +
    scarfFront('#f4f0e6'),
  fakhri: (m) =>
    bg('#e6f0e0', '#8fb98a') + shoulders('#1f3b2d', `<path d="M38 84 q12 8 24 0" fill="none" stroke="#f4f0e6" stroke-width="3" stroke-dasharray="1 4" stroke-linecap="round"/>`) +
    scarf('#1f3b2d', `<path d="M28 34 Q50 16 72 34" fill="none" stroke="#f6c945" stroke-width="2.4"/><path d="M26 44 Q50 30 74 44" fill="none" stroke="#f6c945" stroke-width="1.4" opacity=".8"/>`, '#5a5a5a') +
    face({ eyes: 'narrow', brows: 'raised', mouth: 'small', wrinkles: true, skin: '#efc39c', lashes: true, ...m }) +
    `<circle cx="29" cy="62" r="2.6" fill="url(#gGold)" ${THIN}/><circle cx="71" cy="62" r="2.6" fill="url(#gGold)" ${THIN}/>` +
    scarfFront('#1f3b2d'),
  farokhi: (m) =>
    bg('#e6e6e6', '#9aa4ae') + shoulders('#1b1b1b', `<path d="M42 80 L50 92 L58 80 Z" fill="#fff" ${THIN}/><path d="M48 84 L52 84 L53 96 L50 99 L47 96 Z" fill="#c0392b" ${THIN}/>`) +
    face({ eyes: 'narrow', brows: 'stern', mouth: 'smirk', ...m }) +
    `<path d="M29 46 C26 22 74 20 71 44 C66 34 54 28 40 34 C36 36 32 40 29 46 Z" fill="#111" ${O}/>` +
    `<path d="M33 48 h14 v6 c0 3 -14 3 -14 0 Z M53 48 h14 v6 c0 3 -14 3 -14 0 Z" fill="#222" ${THIN}/><path d="M47 50 h6" stroke="${INK}" stroke-width="2"/>`,
  bahman: (m) =>
    bg('#e3e8f0', '#9fb0c8') + shoulders('#5b4a3a', `<path d="M34 82 C40 90 60 90 66 82 L62 96 L38 96 Z" fill="url(#gCarpet)" ${THIN}/>`) +
    `<path d="M29 50 C27 40 30 36 33 38 M71 50 C73 40 70 36 67 38" fill="none" stroke="#e8e8e8" stroke-width="5" stroke-linecap="round"/>` +
    face({ eyes: 'smile', brows: 'soft', mouth: 'small', skin: '#efc6a4', wrinkles: true, ...m }) +
    `<path d="M38 61 C42 57 47 59 50 60 C53 59 58 57 62 61 C58 65 54 63 50 64 C46 63 42 65 38 61 Z" fill="#f0f0f0" ${THIN}/>` +
    `<circle cx="41" cy="52" r="6.5" fill="none" stroke="#6b4a2a" stroke-width="1.8"/><circle cx="59" cy="52" r="6.5" fill="none" stroke="#6b4a2a" stroke-width="1.8"/><path d="M47.5 52 h5" stroke="#6b4a2a" stroke-width="1.8"/>` +
    `<ellipse cx="50" cy="35" rx="30" ry="6" fill="#4a4a5a" ${O}/><path d="M32 34 C32 18 68 18 68 34 Z" fill="#4a4a5a" ${O}/><path d="M33 30 H67" stroke="#2a2a3a" stroke-width="4"/><path d="M44 21 Q50 25 56 21" fill="none" stroke="#2a2a3a" stroke-width="1.6"/>`,
  aydin: (m) =>
    bg('#fdebd0', '#e59866') +
    shoulders('#f4f0e6', `<path d="M30 84 C34 80 40 80 44 84 L44 100 L30 100 Z M70 84 C66 80 60 80 56 84 L56 100 L70 100 Z" fill="url(#gCarpet)" ${THIN}/>`) +
    face({ eyes: 'open', brows: 'thick', mouth: 'smile', skin: '#efc19a', ...m }) +
    // Dark curls and a neat moustache.
    [[32, 38, 8], [40, 30, 9], [50, 27, 9], [60, 30, 9], [68, 38, 8], [36, 34, 6], [64, 34, 6]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#24160e" ${THIN}/>`).join('') +
    `<path d="M41 61 C44 58 48 59 50 60 C52 59 56 58 59 61 C56 63 53 62 50 62.5 C47 62 44 63 41 61 Z" fill="#24160e"/>`,
};

const cache = new Map<string, string>();

/** A character's bust; `mood` changes the eyes, brows and mouth. */
export function portrait(id: string, mood: Mood = 'neutral'): string {
  const key = `${id}:${mood}`;
  let svg = cache.get(key);
  if (!svg) {
    svg = (PORTRAITS[id] ?? PORTRAITS.narges)(MOODS[mood]);
    cache.set(key, svg);
  }
  return svg;
}

/** Guesses the mood of a story line from its wording (used when a line has none set). */
export function moodOf(text: string): Mood {
  // Persian has no \b in JS regexes: "وای" must stand alone (not inside نونوایی).
  if (/(^|[\s،.!؟…])وای($|[\s،.!؟…])|خدا مرگم|(^|\s)چی؟|جدی؟|!؟|؟!|نه بابا|باورم نمی/.test(text)) return 'surprised';
  if (/نمی‌ذارم|بسه|عصبان|غلط|حق نداره|ساکت|برو بیرون|دیگه تحمل/.test(text)) return 'angry';
  if (/خدابیامرز|متأسف|غصه|گریه|دلم گرفت|دلم تنگ|تنها|حیف|بیچاره|مریض/.test(text)) return 'sad';
  if (/!|عالی|مرسی|ممنون|دمت گرم|قربون|خوشحال|ماشالله|مبارک|آفرین|جشن/.test(text)) return 'happy';
  return 'neutral';
}
