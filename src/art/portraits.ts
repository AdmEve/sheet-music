// Character busts (100×100).

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
  /** Lip colour for the line-drawn mouths (defaults to the ink colour). */
  lips?: string;
  /** Iris colour; given, the open eyes are drawn larger with a coloured iris. */
  iris?: string;
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
        : o.iris
          ? [41, 59].map((x) => `<ellipse cx="${x}" cy="${eyeY}" rx="3.9" ry="4.7" fill="#2a1a12"/><ellipse cx="${x}" cy="${eyeY + 0.8}" rx="2.7" ry="3.2" fill="${o.iris}"/><circle cx="${x}" cy="${eyeY + 0.8}" r="1.4" fill="#1a0e08"/>` +
              `<circle cx="${x + 1.5}" cy="${eyeY - 1.6}" r="1.4" fill="#fff"/><circle cx="${x - 1.4}" cy="${eyeY + 2.4}" r=".7" fill="#fff"/><path d="M${x - 4.6} ${eyeY - 2.6} q4.6 -4.4 9.2 0" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>`).join('')
          : `<ellipse cx="41" cy="${eyeY}" rx="3.2" ry="4" fill="${INK}"/><ellipse cx="59" cy="${eyeY}" rx="3.2" ry="4" fill="${INK}"/>` +
            `<circle cx="42.2" cy="${eyeY - 1.5}" r="1.1" fill="#fff"/><circle cx="60.2" cy="${eyeY - 1.5}" r="1.1" fill="#fff"/>`;
  const lashes = o.lashes ? `<path d="M37 ${eyeY - 3} l-2.5 -2 M38 ${eyeY - 4.4} l-1.6 -2.6 M63 ${eyeY - 3} l2.5 -2 M62 ${eyeY - 4.4} l1.6 -2.6" stroke="${INK}" stroke-width="1.4" stroke-linecap="round"/>` : '';
  const lip = o.lips ?? INK;
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
        ? `<path d="M46 65 q4 2.5 8 0" fill="none" stroke="${lip}" stroke-width="2.4" stroke-linecap="round"/>`
        : o.mouth === 'smirk'
          ? `<path d="M44 65 q8 3 13 -2" fill="none" stroke="${lip}" stroke-width="2.6" stroke-linecap="round"/>`
          : o.mouth === 'open'
            ? `<ellipse cx="50" cy="66" rx="5" ry="4" fill="#a8423a" ${THIN}/>`
            : o.mouth === 'frown'
              ? `<path d="M43 68 q7 -6 14 0" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`
              : o.mouth === 'flat'
                ? `<path d="M44 66 h12" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`
            : `<path d="M43 64 q7 6 14 0" fill="none" stroke="${lip}" stroke-width="2.6" stroke-linecap="round"/>` + (o.lips ? `<path d="M46.5 68 q3.5 1.6 7 0" fill="none" stroke="${o.lips}" stroke-width="1.6" stroke-linecap="round" opacity=".55"/>` : '');
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

type HairStyle = 'long' | 'curls' | 'waves' | 'bun' | 'bob' | 'ponytail' | 'braid' | 'shoulder';

const sheen = (d: string) => `<path d="${d}" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".28"/>`;

/** Side locks that fall in front of the ears and over the shoulders. */
const locks = (c: string, len: number) =>
  `<path d="M30 46 C24 58 24 ${70 + len * 0.3} 27 ${76 + len} L35 ${74 + len} C31 ${64 + len * 0.3} 31 56 34 48 Z M70 46 C76 58 76 ${70 + len * 0.3} 73 ${76 + len} L65 ${74 + len} C69 ${64 + len * 0.3} 69 56 66 48 Z" fill="${c}" ${THIN}/>`;

/** Hair drawn behind the head and shoulders. */
function hairBack(style: HairStyle, c: string): string {
  switch (style) {
    case 'long':
      return `<path d="M27 54 C22 28 36 17 50 17 C64 17 78 28 73 54 C76 70 80 84 82 98 H18 C20 84 24 70 27 54 Z" fill="${c}" ${O}/>`;
    case 'waves':
      return `<path d="M26 54 C20 26 36 15 50 15 C66 15 80 26 74 54 C78 68 84 80 84 92 Q78 88 74 94 Q68 90 64 96 H36 Q32 90 26 94 Q22 88 16 92 C16 80 22 68 26 54 Z" fill="${c}" ${O}/>`;
    case 'curls':
      return [[25, 64], [23, 52], [26, 40], [33, 30], [43, 24], [55, 24], [66, 29], [74, 39], [77, 51], [75, 64]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9.5" fill="${c}" ${THIN}/>`).join('');
    case 'bun':
      return `<circle cx="50" cy="19" r="11" fill="${c}" ${O}/><path d="M42 16 q8 -6 16 0" fill="none" stroke="#fff" stroke-width="1.6" opacity=".3"/>`;
    case 'bob':
      return `<path d="M25 64 C20 30 36 18 50 18 C64 18 80 30 75 64 C75 72 72 77 66 78 H34 C28 77 25 72 25 64 Z" fill="${c}" ${O}/>`;
    case 'ponytail':
      return `<path d="M64 40 C84 44 88 68 78 90 C74 78 70 62 62 50 Z" fill="${c}" ${O}/>`;
    case 'braid':
      return `<path d="M30 50 C26 30 38 22 50 22 C62 22 74 30 70 50 Z" fill="${c}" ${O}/>`;
    case 'shoulder':
      return `<path d="M27 58 C22 30 36 19 50 19 C64 19 78 30 73 58 C75 70 77 80 75 88 H25 C23 80 25 70 27 58 Z" fill="${c}" ${O}/>`;
  }
}

/** Hair drawn over the face: fringe, parting and locks. */
function hairFront(style: HairStyle, c: string): string {
  switch (style) {
    case 'long':
      return locks(c, 12) + `<path d="M29 52 C27 33 38 24 50 24 C63 24 73 33 71 52 C69 43 65 37 59 34 C52 40 42 42 35 40 C32 44 30 48 29 52 Z" fill="${c}" ${THIN}/>` + sheen('M38 30 q10 -5 22 -1');
    case 'waves':
      return locks(c, 14) + `<path d="M30 46 C30 28 40 21 50 21 C60 21 70 28 70 46 C66 36 58 30 50 29 C42 30 34 36 30 46 Z" fill="${c}" ${THIN}/>` +
        `<path d="M50 24 C46 32 40 38 32 48 M50 24 C54 32 60 38 68 48" fill="none" stroke="${INK}" stroke-width="1" opacity=".4"/>` + sheen('M36 30 q6 -5 12 -5');
    case 'curls':
      return [[33, 37], [41, 32], [50, 30], [59, 32], [67, 37]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6.4" fill="${c}" ${THIN}/>`).join('') + sheen('M44 27 q6 -3 12 0');
    case 'bun':
      return `<path d="M29 52 C27 34 38 26 50 26 C62 26 73 34 71 52 C67 41 59 35 50 35 C41 35 33 41 29 52 Z" fill="${c}" ${THIN}/>` +
        `<path d="M36 40 q6 -6 14 -6 M64 40 q-6 -6 -14 -6" fill="none" stroke="${INK}" stroke-width=".9" opacity=".35"/>` + sheen('M40 30 q10 -4 20 0');
    case 'bob':
      return `<path d="M29 50 C27 40 27 64 28 76 H35 C32 66 32 56 33 48 Z M71 50 C73 40 73 64 72 76 H65 C68 66 68 56 67 48 Z" fill="${c}" ${THIN}/>` +
        `<path d="M30 47 C29 30 39 23 50 23 C61 23 71 30 70 47 C64 42 36 42 30 47 Z" fill="${c}" ${THIN}/>` + sheen('M36 30 q14 -7 28 0');
    case 'ponytail':
      return `<path d="M29 50 C28 42 31 38 36 37 C34 42 32 46 29 50 Z M71 50 C72 42 69 38 64 37 C66 42 68 46 71 50 Z" fill="${c}" ${THIN}/>`;
    case 'braid':
      return `<path d="M29 52 C27 33 38 25 50 26 C49 33 40 39 29 52 Z M71 52 C73 33 62 25 50 26 C51 33 60 39 71 52 Z" fill="${c}" ${THIN}/>` +
        Array.from({ length: 5 }, (_, i) => `<ellipse cx="${68 + i * 1.2}" cy="${70 + i * 6.4}" rx="5" ry="4.2" fill="${c}" ${THIN} stroke-width="1.2"/>`).join('') +
        `<path d="M70 98 l-3 -4 h7 Z" fill="${c}" ${THIN} stroke-width="1"/><rect x="69" y="94" width="7" height="3" rx="1" fill="#3f8a5a"/>`;
    case 'shoulder':
      return locks(c, 4) + `<path d="M29 52 C27 32 38 24 52 25 C63 26 72 34 71 52 C68 40 60 33 46 34 C40 36 34 42 29 52 Z" fill="${c}" ${THIN}/>` + sheen('M40 30 q10 -4 20 -1');
  }
}

/** A woman's bust: back hair, shoulders, face, then fringe and anything worn over it. */
const woman = (hair: HairStyle, color: string, body: string, f: FaceOpts, over = '') => hairBack(hair, color) + body + face(f) + hairFront(hair, color) + over;

export const CAST_IDS = ['narges', 'mahin', 'reza', 'shirin', 'kaveh', 'morteza', 'golab', 'fakhri', 'farokhi', 'bahman', 'aydin', 'sona', 'yadollah', 'jalal', 'sepideh', 'karim', 'parisa', 'saburi', 'arash', 'mahbanu', 'rahimi'];
export const MOOD_LIST: Mood[] = ['neutral', 'happy', 'sad', 'angry', 'surprised'];

const PORTRAITS: Record<string, (m: FaceOpts) => string> = {
  narges: (m) =>
    bg('#ffd9a8', '#f6b26b') +
    woman('long', '#4a2a1a', shoulders('#2f7d6d', `<path d="M42 80 L50 92 L58 80" fill="#f6e3b0" ${THIN}/>`),
      { blush: true, lashes: true, iris: '#7a4a24', lips: '#c0505b', mouth: 'smile', ...m },
      // A pink flower pinned in her hair.
      [0, 72, 144, 216, 288].map((a) => `<ellipse cx="66" cy="27" rx="2.4" ry="3.6" transform="rotate(${a} 66 30.4)" fill="#e2507a" stroke="${INK}" stroke-width=".7"/>`).join('') + `<circle cx="66" cy="30.4" r="1.6" fill="#ffd36b"/>`),
  mahin: (m) =>
    bg('#e8d5ff', '#b48be6') +
    woman('curls', '#9a3a1a', shoulders('#6c33c2', `<path d="M38 82 q12 8 24 0" fill="none" stroke="#ffd36b" stroke-width="2.6" stroke-dasharray="1 4" stroke-linecap="round"/>`),
      { eyes: 'open', brows: 'raised', mouth: 'open', blush: true, lashes: true, wrinkles: true, iris: '#6a4a2a', lips: '#b0405a', ...m },
      `<circle cx="41" cy="52" r="7" fill="none" stroke="#b07a10" stroke-width="2"/><circle cx="59" cy="52" r="7" fill="none" stroke="#b07a10" stroke-width="2"/><path d="M48 52 h4" stroke="#b07a10" stroke-width="2"/>`),
  reza: (m) =>
    bg('#fff0c8', '#e8c27a') + shoulders('#f4f0e6', `<path d="M34 82 L50 96 L66 82" fill="none" ${THIN}/>`) +
    face({ eyes: 'smile', brows: 'thick', mouth: 'grin', skin: '#e9b48a', ...m }) +
    `<path d="M38 62 C42 58 48 60 50 61 C52 60 58 58 62 62 C58 66 54 63 50 64 C46 63 42 66 38 62 Z" fill="#5a3a22" ${THIN}/>` +
    `<path d="M28 40 C28 22 72 22 72 40 Z" fill="#fff" ${O}/><path d="M28 40 L72 40" ${O}/>` +
    `<ellipse cx="34" cy="70" rx="2" ry="1.4" fill="#fff" opacity=".8"/>`,
  shirin: (m) =>
    bg('#ffe0ef', '#ff9ec4') +
    woman('waves', '#b8692a', shoulders('#1d1d3a', `<circle cx="50" cy="86" r="3" fill="#ffd36b" ${THIN}/>`),
      { eyes: 'open', brows: 'soft', mouth: 'smirk', blush: true, lashes: true, iris: '#8a5a2a', lips: '#d33a5b', ...m },
      // The hairdresser's own pink streak.
      `<path d="M67 50 C71 62 71 76 69 88" fill="none" stroke="#ff7a9c" stroke-width="2.6" stroke-linecap="round" opacity=".9"/>`),
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
    bg('#fff4e0', '#f2c9a0') +
    woman('bun', '#e4e4e0', shoulders('#2c3e50', `<path d="M40 82 q10 6 20 0" fill="none" stroke="#f4f0e6" stroke-width="2.4"/>`),
      { eyes: 'smile', brows: 'soft', mouth: 'smile', wrinkles: true, skin: '#eebd96', blush: true, lips: '#b0605a', ...m },
      `<circle cx="29" cy="62" r="2.2" fill="#fffdf6" ${THIN} stroke-width=".8"/><circle cx="71" cy="62" r="2.2" fill="#fffdf6" ${THIN} stroke-width=".8"/>`),
  fakhri: (m) =>
    bg('#e6f0e0', '#8fb98a') +
    woman('bun', '#6a6a6a', shoulders('#1f3b2d', `<path d="M38 84 q12 8 24 0" fill="none" stroke="#f4f0e6" stroke-width="3" stroke-dasharray="1 4" stroke-linecap="round"/>`),
      { eyes: 'narrow', brows: 'raised', mouth: 'small', wrinkles: true, skin: '#efc39c', lashes: true, lips: '#9a3a4a', ...m },
      `<circle cx="29" cy="62" r="2.6" fill="url(#gGold)" ${THIN}/><circle cx="71" cy="62" r="2.6" fill="url(#gGold)" ${THIN}/><path d="M41 12 L59 25" stroke="#d9a63a" stroke-width="2.4" stroke-linecap="round"/><circle cx="41" cy="12" r="2" fill="url(#gGold)"/>`),
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
  sona: (m) =>
    bg('#fbe3d6', '#c86b5a') +
    woman('bun', '#3a2a22', shoulders('#2e3a6a', `<path d="M40 82 q10 6 20 0" fill="none" stroke="url(#gGold)" stroke-width="2.4"/>`),
      { eyes: 'smile', brows: 'soft', mouth: 'smile', wrinkles: true, skin: '#efc39c', blush: true, lashes: true, lips: '#b0404a', ...m },
      // A silver streak and a deep-red Tabrizi silk hairband with gold dots.
      `<path d="M38 31 q6 -3 12 -2" fill="none" stroke="#b8b8b0" stroke-width="2.4" stroke-linecap="round"/><path d="M30 42 Q50 26 70 42" fill="none" stroke="#8e1230" stroke-width="4"/>` +
      [[38, 34.6], [50, 31.6], [62, 34.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5" fill="#f6c945"/>`).join('') +
      `<circle cx="29" cy="63" r="2.4" fill="url(#gGold)" ${THIN}/><circle cx="71" cy="63" r="2.4" fill="url(#gGold)" ${THIN}/>`),
  yadollah: (m) =>
    bg('#ffe7b8', '#e0a050') +
    // Striped camel-hair cloak (aba) over a white shirt.
    shoulders('#7a5232', `<path d="M40 80 L50 92 L60 80" fill="#f4f0e6" ${THIN}/><path d="M24 90 L30 80 M76 90 L70 80" stroke="#c9a26b" stroke-width="3"/>`) +
    face({ eyes: 'narrow', brows: 'thick', mouth: 'smile', skin: '#d9a072', wrinkles: true, ...m }) +
    // White beard and moustache.
    `<path d="M30 58 C30 80 40 90 50 90 C60 90 70 80 70 58 C66 70 60 72 50 72 C40 72 34 70 30 58 Z" fill="#f0f0ea" ${THIN}/>` +
    `<path d="M39 63 C43 59 47 61 50 62 C53 61 57 59 61 63 C57 66 54 64 50 65 C46 64 43 66 39 63 Z" fill="#f0f0ea" ${THIN}/>` +
    (m.mouth === 'open' ? `<ellipse cx="50" cy="69" rx="4" ry="3" fill="#a8423a" ${THIN}/>` : '') +
    // Felt cap (kolah namadi).
    `<path d="M29 42 C27 20 73 20 71 42 Z" fill="#8a6a48" ${O}/><path d="M29 42 Q50 36 71 42" fill="none" stroke="#5e4630" stroke-width="2"/>` +
    `<path d="M40 26 q10 -4 20 0" fill="none" stroke="#a8885e" stroke-width="1.6"/>`,
  jalal: (m) =>
    bg('#e6f0f6', '#8fb3c8') +
    // A dark felt vest over a white collarless shirt.
    shoulders('#f4f0e6', `<path d="M24 92 C26 84 32 80 40 80 L46 100 H24 Z M76 92 C74 84 68 80 60 80 L54 100 H76 Z" fill="#3a4a5a" ${THIN}/>`) +
    // White fringe of hair around a bald crown.
    `<path d="M28 52 C24 40 28 30 34 28 M72 52 C76 40 72 30 66 28" fill="none" stroke="#e8e8e2" stroke-width="7" stroke-linecap="round"/>` +
    face({ eyes: 'open', brows: 'soft', mouth: 'small', skin: '#dcaa7e', wrinkles: true, ...m }) +
    `<path d="M33 37 q17 -14 34 0" fill="none" stroke="#c48a5e" stroke-width="1.4" opacity=".7"/>` +
    // Bushy white moustache.
    `<path d="M36 61 C40 55 46 57 50 59 C54 57 60 55 64 61 C61 66 56 64 50 63 C44 64 39 66 36 61 Z" fill="#f0f0ea" ${THIN}/>`,
  sepideh: (m) =>
    bg('#dcefff', '#6aa8e0') +
    // Mustard blazer with a clip-on microphone, and a glossy bob.
    woman('bob', '#22140c', shoulders('#e0a030', `<path d="M40 80 L50 96 L60 80" fill="#fffdf6" ${THIN}/><rect x="60" y="86" width="5" height="8" rx="2" fill="#2a2a2a"/>`),
      { eyes: 'open', brows: 'soft', mouth: 'smile', blush: true, lashes: true, skin: '#f2c4a0', iris: '#5a3a20', lips: '#c0505b', ...m }),
  karim: (m) =>
    bg('#fde3ec', '#e891ae') +
    // Work shirt with a damask rose in the pocket.
    shoulders('#5a7a4a', `<path d="M40 80 L50 92 L60 80" fill="#f4f0e6" ${THIN}/><rect x="58" y="86" width="12" height="8" fill="#4a6a3a" ${THIN} stroke-width="1"/><circle cx="64" cy="85" r="4" fill="url(#gRoseDeep)" ${THIN} stroke-width=".8"/>`) +
    face({ eyes: 'smile', brows: 'thick', mouth: 'smile', skin: '#e2ad82', ...m }) +
    // Short dark beard and a flat cap.
    `<path d="M30 58 C32 78 42 84 50 84 C58 84 68 78 70 58 C66 70 60 72 50 72 C40 72 34 70 30 58 Z" fill="#3a2418" ${THIN}/>` +
    `<path d="M40 62 C44 59 48 60 50 61 C52 60 56 59 60 62 C57 64 53 63 50 63.5 C47 63 43 64 40 62 Z" fill="#3a2418"/>` +
    `<path d="M27 42 C27 24 73 24 73 42 Z" fill="#6a5a4a" ${O}/><path d="M26 42 Q50 34 80 44 L76 48 Q50 40 26 46 Z" fill="#5a4a3a" ${THIN}/>`,
  parisa: (m) =>
    bg('#fff0d0', '#f0a040') +
    // Hi-vis vest over a dark top, ponytail under a white hard hat.
    woman('ponytail', '#3b2216', shoulders('#3a4a5a', `<path d="M30 84 L40 80 L44 100 H30 Z M70 84 L60 80 L56 100 H70 Z" fill="#ff8a2a" ${THIN}/><path d="M33 90 h8 M59 90 h8" stroke="#e8e8e2" stroke-width="2.4"/>`),
      { eyes: 'open', brows: 'soft', mouth: 'smile', blush: true, lashes: true, skin: '#f0c49c', iris: '#6a4428', lips: '#c0606a', ...m },
      `<path d="M24 40 C24 14 76 14 76 40 Z" fill="#fafafa" ${O}/><path d="M18 40 H82 Q82 46 76 46 H24 Q18 46 18 40 Z" fill="#e8e8e8" ${O}/><path d="M50 16 V40" stroke="#d0d0d0" stroke-width="4"/>`),
  saburi: (m) =>
    bg('#e3f3e6', '#7fbf8e') +
    // A herbalist's green apron over a white shirt.
    shoulders('#f4f0e6', `<path d="M36 82 H64 L66 100 H34 Z" fill="#3f8a5a" ${THIN}/><path d="M40 82 L36 78 M60 82 L64 78" stroke="#2a6a42" stroke-width="2"/>`) +
    `<path d="M28 50 C25 38 29 32 33 32 M72 50 C75 38 71 32 67 32" fill="none" stroke="#b8b8b0" stroke-width="6" stroke-linecap="round"/>` +
    face({ eyes: 'smile', brows: 'soft', mouth: 'small', skin: '#e9bc94', wrinkles: true, ...m }) +
    `<path d="M44 70 C44 80 56 80 56 70 C53 73 47 73 44 70 Z" fill="#b8b8b0" ${THIN}/>` +
    `<path d="M41 63 C44 60 48 61 50 62 C52 61 56 60 59 63 C56 65 53 64 50 64.5 C47 64 44 65 41 63 Z" fill="#b8b8b0"/>` +
    `<circle cx="41" cy="52" r="6.5" fill="none" stroke="#3a3a3a" stroke-width="1.8"/><circle cx="59" cy="52" r="6.5" fill="none" stroke="#3a3a3a" stroke-width="1.8"/><path d="M47.5 52 h5" stroke="#3a3a3a" stroke-width="1.8"/>`,
  arash: (m) =>
    bg('#e0f4ff', '#5ab8e8') +
    // Striped summer T-shirt.
    shoulders('#e0303f', `<path d="M22 90 H78 M18 96 H82" stroke="#fffdf6" stroke-width="3"/><path d="M42 79 Q50 85 58 79" fill="none" stroke="#fffdf6" stroke-width="2.4"/>`) +
    face({ eyes: 'open', brows: 'soft', mouth: 'grin', skin: '#f0c49a', blush: true, ...m }) +
    // Messy short hair with a cowlick, freckles and a plaster on one cheek.
    `<path d="M29 48 C24 26 40 20 50 22 C62 20 78 28 71 48 C68 38 62 34 56 36 L54 31 L50 36 L44 32 L42 37 C36 36 32 40 29 48 Z" fill="#2b1b12" ${O}/>` +
    `<path d="M50 23 Q53 12 61 13 Q55 16 55 23 Z" fill="#2b1b12" ${THIN}/>` +
    [[34, 60], [37, 63], [40, 60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1" fill="#b8784a"/>`).join('') +
    `<rect x="62" y="56" width="9" height="4.5" rx="2" fill="#f6dcb4" ${THIN} stroke-width=".8" transform="rotate(-25 66.5 58)"/><path d="M66 56.5 l1.4 3" stroke="#c9a27a" stroke-width=".8"/>`,
  mahbanu: (m) =>
    bg('#f3ecd8', '#c9b27a') +
    // Brown waistcoat over a floury white apron; a long grey braid.
    woman('braid', '#b8b8b0', shoulders('#7a4a2a', `<path d="M38 82 H62 L64 100 H36 Z" fill="#f4f0e6" ${THIN}/><circle cx="44" cy="92" r="2" fill="#fffdf6" opacity=".9"/>`),
      { eyes: 'smile', brows: 'soft', mouth: 'smile', wrinkles: true, skin: '#e2b088', blush: true, lashes: true, lips: '#a8504a', ...m },
      // A smudge of flour on one cheek.
      `<ellipse cx="62" cy="61" rx="4" ry="2.2" fill="#fffdf6" opacity=".85"/>`),
  rahimi: (m) =>
    bg('#e6ecff', '#8fa0e0') +
    // A plum cardigan, a pen in the pocket, red-framed glasses.
    woman('shoulder', '#2a1a12', shoulders('#7a3a6a', `<path d="M42 80 L50 90 L58 80" fill="#fffdf6" ${THIN}/><rect x="64" y="88" width="2.6" height="10" rx="1" fill="#3a76c4"/>`),
      { eyes: 'open', brows: 'soft', mouth: 'smile', blush: true, lashes: true, skin: '#f0c49c', iris: '#5a3a20', lips: '#b0405a', ...m },
      `<rect x="34" y="47" width="13" height="10" rx="4" fill="none" stroke="#a0304a" stroke-width="1.8"/><rect x="53" y="47" width="13" height="10" rx="4" fill="none" stroke="#a0304a" stroke-width="1.8"/><path d="M47 51 h6" stroke="#a0304a" stroke-width="1.8"/>`),
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
