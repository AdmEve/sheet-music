// Season 11 («ثبت جهانی») place scenes. Same contract as scenes.ts: each task layer is drawn
// "before" until done, then "after".

import { INK, O, THIN, sparkle } from './kit';
import { Layer, SceneDef, cobweb, dustPile, floor, geranium, glow, lantern, plank, stringLights } from './scenes';
import { courtyard, darkness, text, wall } from './scenes3';

const pointed = (x0: number, x1: number, y: number, top: number, bottom: number) => {
  const m = (x0 + x1) / 2;
  return `M${x0} ${bottom} V${y} Q${x0} ${top + (y - top) * 0.25} ${m} ${top} Q${x1} ${top + (y - top) * 0.25} ${x1} ${y} V${bottom} Z`;
};

const photo = (x: number, y: number, w: number, h: number, scene: 'cafe' | 'party' | 'gate' | 'people') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#gGold)" ${O}/><rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" fill="#e8d3a8" ${THIN} stroke-width="1"/>` +
  (scene === 'cafe' ? `<rect x="${x + w * 0.3}" y="${y + h * 0.35}" width="${w * 0.4}" height="${h * 0.5}" fill="#8a6a48"/>`
    : scene === 'party' ? Array.from({ length: 5 }, (_, i) => `<circle cx="${x + 6 + i * (w - 12) / 4}" cy="${y + h * 0.3}" r="2" fill="#c0392b"/>`).join('') + `<rect x="${x + 6}" y="${y + h * 0.55}" width="${w - 12}" height="${h * 0.25}" fill="#8a6a48"/>`
      : scene === 'gate' ? `<path d="${pointed(x + w * 0.3, x + w * 0.7, y + h * 0.5, y + h * 0.25, y + h - 4)}" fill="#8a6a48"/>`
        : Array.from({ length: 4 }, (_, i) => `<circle cx="${x + 8 + i * (w - 16) / 3}" cy="${y + h * 0.45}" r="3" fill="#8a6a48"/><path d="M${x + 5 + i * (w - 16) / 3} ${y + h - 4} v-8 q3 -3 6 0 v8" fill="#8a6a48"/>`).join(''));

const carpetRug = (x: number, y: number, w: number, h: number, field: string, border: string) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${border}" ${O}/><rect x="${x + w * 0.12}" y="${y + h * 0.18}" width="${w * 0.76}" height="${h * 0.64}" fill="${field}" ${THIN} stroke-width="1"/>` +
  `<path d="M${x + w / 2} ${y + h * 0.26} L${x + w * 0.7} ${y + h / 2} L${x + w / 2} ${y + h * 0.74} L${x + w * 0.3} ${y + h / 2} Z" fill="${border}" ${THIN} stroke-width="1"/>`;

// ------------------------------------------------------------------ دفتر پرونده

const DOSSIER: Record<string, Layer> = {
  photos: (d) =>
    d
      ? photo(20, 24, 60, 44, 'cafe') + photo(92, 18, 70, 50, 'party') + photo(176, 22, 56, 44, 'gate') + photo(244, 18, 70, 50, 'people') +
        `<path d="M50 24 L50 14 M127 18 V10 M204 22 V14 M279 18 V10" stroke="#e0303f" stroke-width="2"/>`
      : cobweb(0, 0, 1) + cobweb(360, 0, 1, true),
  files: (d) =>
    `<rect x="290" y="80" width="56" height="110" fill="${d ? 'url(#gSteel)' : '#7a7a7a'}" ${O}/>` +
    [96, 128, 160].map((y) => `<rect x="296" y="${y}" width="44" height="26" rx="2" fill="${d ? '#d8dee4' : '#6a6a6a'}" ${THIN}/><rect x="312" y="${y + 10}" width="12" height="4" rx="1" fill="${INK}"/>`).join('') +
    (d ? [0, 1, 2].map((k) => `<rect x="${300 + k * 10}" y="74" width="12" height="8" fill="${['#f6c945', '#e0303f', '#3a76c4'][k]}" ${THIN} stroke-width="1"/>`).join('') : ''),
  table: (d) =>
    d
      ? `<path d="M50 160 L310 160 L330 186 L30 186 Z" fill="url(#gWood)" ${O}/><path d="M40 186 V226 M320 186 V226" ${O} stroke-width="4"/>` +
        `<path d="M80 164 L200 164 L210 182 L70 182 Z" fill="#f6e3b0" ${THIN}/>` + Array.from({ length: 6 }, (_, i) => `<path d="M${84 + i * 20} 166 V180" stroke="#9b8a76" stroke-width="1"/>`).join('') +
        `<path d="M90 172 H190" stroke="#3a76c4" stroke-width="1.6"/>`
      : plank(60, 200, 120, 6) + plank(190, 212, 110, -8),
  lamp: (d) => (d ? `<path d="M250 160 V130 L270 116" fill="none" ${O} stroke-width="3"/><path d="M262 108 L284 118 L276 128 Z" fill="url(#gNavy)" ${O}/>` + glow(260, 150, 50, 0.6) : darkness(0.3)),
  stamp: (d) =>
    d
      ? `<rect x="220" y="168" width="44" height="12" fill="#fffdf6" ${THIN}/><circle cx="252" cy="174" r="5" fill="none" stroke="#e0303f" stroke-width="2"/>` +
        `<path d="M226 150 H244 V160 H226 Z" fill="url(#gWoodDark)" ${THIN}/><path d="M235 150 V138" ${O} stroke-width="4"/>` + sparkle(280, 150, 5)
      : '',
};

// ------------------------------------------------------------------ روز بازدید (the alley by day)

const INSPECTION: Record<string, Layer> = {
  sweep: (d) =>
    d
      ? Array.from({ length: 8 }, (_, i) => `<ellipse cx="${40 + i * 40}" cy="${210 + (i % 2) * 14}" rx="14" ry="3" fill="#7a6a56" opacity=".5"/>`).join('') +
        `<path d="M300 236 L316 180" ${O} stroke="url(#gWood)" stroke-width="3"/><path d="M296 236 L322 236 L318 222 L304 222 Z" fill="#d8b860" ${THIN}/>`
      : dustPile(80, 210) + dustPile(200, 222) + dustPile(290, 206) + plank(120, 220, 60, 8),
  signs: (d) =>
    d
      ? [[20, 120], [290, 120]].map(([x, y]) => `<rect x="${x}" y="${y}" width="56" height="24" rx="4" fill="url(#gBlue)" ${O}/>` +
          `<path d="M${Number(x) + 8} ${Number(y) + 9} H${Number(x) + 40} M${Number(x) + 8} ${Number(y) + 16} H${Number(x) + 32}" stroke="#fff" stroke-width="2"/><path d="M${Number(x) + 44} ${Number(y) + 12} l6 0 l-3 -4 M${Number(x) + 50} ${Number(y) + 12} l-3 4" stroke="#fff" stroke-width="1.6"/>`).join('')
      : '',
  flowers: (d) => (d ? [40, 110, 250, 320].map((x) => geranium(x, 176, 0.8)).join('') : ''),
  guides: (d) =>
    d
      ? `<rect x="130" y="176" width="100" height="8" rx="2" fill="#fffdf6" ${O}/><path d="M136 184 V214 M224 184 V214" ${O} stroke-width="3"/>` +
        `<rect x="140" y="160" width="36" height="16" rx="2" fill="#fffdf6" ${THIN}/>` + text(158, 172, 'WELCOME', 6, '#3a76c4') + `<rect x="186" y="164" width="30" height="12" rx="2" fill="url(#gRed)" ${THIN}/>` + text(201, 173, 'خوش آمدید', 5, '#fff')
      : '',
  tea: (d) =>
    d
      ? `<ellipse cx="180" cy="150" rx="24" ry="6" fill="url(#gBrass)" ${THIN}/>` +
        [166, 180, 194].map((x) => `<path d="M${x - 4} 148 L${x - 3} 136 L${x + 3} 136 L${x + 4} 148 Z" fill="#c0392b" ${THIN} stroke-width="1"/>`).join('') +
        `<path class="steam" d="M180 132 q-4 -6 0 -12" fill="none" stroke="#fff" stroke-width="2" opacity=".7"/>` + sparkle(214, 128, 5)
      : '',
};

const inspectionBase = () =>
  courtyard() + `<path d="${pointed(140, 220, 70, 30, 150)}" fill="url(#gTerracotta)" ${O}/><path d="${pointed(156, 204, 96, 70, 150)}" fill="#3b2a20" ${O}/>` +
  `<rect x="150" y="40" width="60" height="12" rx="2" fill="url(#gBlue)" ${THIN}/>`;

// ------------------------------------------------------------------ نمایشگاه آب‌انبار (inside the cistern)

const EXHIBITION: Record<string, Layer> = {
  frames: (d) =>
    d
      ? photo(30, 70, 70, 54, 'cafe') + photo(116, 60, 80, 64, 'party') + photo(212, 66, 64, 54, 'gate') + photo(290, 74, 56, 46, 'people')
      : [30, 116, 212, 290].map((x) => `<rect x="${x}" y="70" width="60" height="50" fill="none" stroke="#7a6a5a" stroke-width="2" stroke-dasharray="4 4"/>`).join(''),
  lights: (d) =>
    d
      ? [65, 156, 244, 318].map((x) => `<path d="M${x - 6} 30 L${x + 6} 30 L${x + 30} 130 L${x - 30} 130 Z" fill="#fff6c8" opacity=".18"/><circle cx="${x}" cy="30" r="4" fill="#ffe08a" ${THIN} stroke-width="1"/>`).join('')
      : darkness(0.45),
  path: (d) =>
    d
      ? `<path d="M0 200 Q180 186 360 200" fill="none" stroke="#e0303f" stroke-width="4"/>` + [60, 140, 220, 300].map((x) => `<path d="M${x} 236 V196" ${O} stroke="url(#gBrass)" stroke-width="3"/><circle cx="${x}" cy="194" r="4" fill="url(#gBrass)" ${THIN}/>`).join('')
      : dustPile(100, 216) + dustPile(260, 222),
  book: (d) =>
    d
      ? `<rect x="160" y="166" width="40" height="40" fill="url(#gWood)" ${O}/><path d="M154 162 L180 154 L206 162 L180 170 Z" fill="#fffdf6" ${O}/><path d="M180 154 V170" ${THIN}/>` +
        `<path d="M162 162 h12 M186 160 h12" stroke="#3a76c4" stroke-width="1"/><path d="M200 158 L214 144" stroke="${INK}" stroke-width="2"/>`
      : '',
  ribbon: (d) =>
    d
      ? `<path d="M0 150 Q90 162 180 150 T360 150" fill="none" stroke="#e0303f" stroke-width="5"/><path d="M180 150 l-14 -9 v18 Z M180 150 l14 -9 v18 Z" fill="url(#gRed)" ${THIN}/>` + sparkle(60, 40, 5) + sparkle(300, 46, 5)
      : '',
};

const exhibitionBase = () =>
  `<rect width="360" height="240" fill="#5a4a3e"/>` +
  `<path d="M0 0 H360 V40 Q180 -10 0 40 Z" fill="#4a3a30"/>` + Array.from({ length: 10 }, (_, i) => `<path d="M${i * 40} 40 V176" stroke="#4a3a30" stroke-width="2"/>`).join('') +
  `<rect y="176" width="360" height="64" fill="#7a6a56"/><path d="M0 176 H360" ${O}/>`;

// ------------------------------------------------------------------ شب فرهنگ ایرانی (night)

const CULTURENIGHT: Record<string, Layer> = {
  carpets: (d) =>
    d
      ? carpetRug(20, 190, 90, 44, 'url(#gCarpet)', 'url(#gNavy)') + carpetRug(130, 196, 100, 40, 'url(#gNavy)', 'url(#gCarpet)') + carpetRug(250, 190, 90, 44, '#2f7d6d', 'url(#gCarpet)')
      : plank(60, 210, 80, 6) + plank(220, 220, 90, -8),
  santur: (d) =>
    d
      ? `<path d="M30 176 L90 168 L100 186 L20 194 Z" fill="url(#gWood)" ${O}/>` + Array.from({ length: 7 }, (_, i) => `<path d="M${30 + i * 2} ${178 + i * 2} L${90 + i * 1.4} ${170 + i * 2}" stroke="#f6e3b0" stroke-width=".8"/>`).join('') +
        `<path d="M62 160 L78 146 M70 162 L86 150" stroke="${INK}" stroke-width="1.6"/>`
      : '',
  calligraphy: (d) =>
    d
      ? `<rect x="140" y="150" width="80" height="10" rx="2" fill="url(#gWood)" ${O}/><rect x="150" y="128" width="60" height="22" fill="#fffdf6" ${THIN}/>` +
        `<path d="M156 142 q8 -10 16 0 q6 -8 12 0 q6 -6 12 2" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/><circle cx="170" cy="134" r="1.4" fill="${INK}"/>` +
        `<path d="M216 140 L230 120" stroke="#8b5328" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="226" cy="150" rx="6" ry="3" fill="#1b1b1b" ${THIN}/>`
      : '',
  ash: (d) =>
    d
      ? `<path d="M270 150 L330 150 L326 180 C322 186 278 186 274 180 Z" fill="url(#gCopper)" ${O}/><path d="M266 150 H334" ${O} stroke-width="4"/>` +
        `<ellipse cx="300" cy="150" rx="28" ry="5" fill="#8a9a4a" ${THIN}/><path d="M286 148 q5 -3 10 0 M302 151 q5 -3 10 0" fill="none" stroke="#f2e6cc" stroke-width="2"/>` +
        `<path class="steam" d="M290 140 q-4 -8 0 -16 M310 140 q-4 -8 0 -16" fill="none" stroke="#e8e8e8" stroke-width="2.6" stroke-linecap="round" opacity=".8"/>`
      : '',
  lanterns: (d) => (d ? stringLights(16) + lantern(40, 30) + lantern(320, 30) + sparkle(180, 30, 6) : darkness(0.35)),
};

const cultureBase = () =>
  `<rect width="360" height="170" fill="#22305e"/>` + Array.from({ length: 18 }, (_, i) => `<circle cx="${(i * 83) % 356 + 2}" cy="${(i * 37) % 50 + 4}" r="1.2" fill="#fff6c8"/>`).join('') +
  `<rect x="0" y="50" width="110" height="130" fill="#d9a873" ${O}/><rect x="250" y="60" width="110" height="120" fill="#e0b07a" ${O}/>` +
  [[24, 80], [74, 80], [276, 90], [326, 90]].map(([x, y]) => `<rect x="${x - 8}" y="${y}" width="16" height="22" rx="8" fill="#ffe08a" ${THIN}/>`).join('') + floor('#8a7a66', 180);

// ------------------------------------------------------------------ جشن ثبت جهانی

const WORLDPARTY: Record<string, Layer> = {
  plaque: (d) =>
    d
      ? glow(180, 64, 30, 0.5) + `<rect x="150" y="52" width="60" height="26" rx="4" fill="url(#gSilver)" ${O}/>` + text(180, 64, 'UNESCO', 8, '#3a76c4') + text(180, 74, 'ثبت جهانی', 7, '#4b2e1e') +
        `<rect x="150" y="82" width="60" height="16" rx="3" fill="url(#gBrass)" ${THIN}/>` + text(180, 93, 'ثبت ملی', 7, '#4b2e1e')
      : `<rect x="150" y="52" width="60" height="26" rx="4" fill="none" stroke="#9b8a76" stroke-width="2" stroke-dasharray="4 4"/>`,
  flags: (d) =>
    d
      ? `<path d="M0 26 Q180 56 360 26" fill="none" stroke="${INK}" stroke-width="1.2"/>` +
        Array.from({ length: 14 }, (_, i) => { const x = 12 + i * 26, y = 27 + Math.sin((x / 360) * Math.PI) * 15;
          return `<rect x="${x - 8}" y="${y}" width="16" height="11" fill="${['#2a9d4a', '#fffdf6', '#e0303f', '#3a76c4', '#f6c945', '#fffdf6'][i % 6]}" ${THIN} stroke-width=".8"/>` + (i % 6 === 1 ? `<circle cx="${x}" cy="${y + 5.5}" r="3" fill="#e0303f"/>` : ''); }).join('')
      : '',
  stage: (d) =>
    d
      ? `<rect x="110" y="176" width="140" height="16" fill="url(#gWoodDark)" ${O}/><path d="M118 192 V236 M242 192 V236" ${O} stroke-width="4"/>` +
        `<path d="M180 176 V150 M174 150 h12" ${THIN} stroke-width="2"/><circle cx="180" cy="148" r="4" fill="${INK}"/>` + glow(180, 160, 50, 0.4)
      : plank(130, 210, 100, 6),
  lights: (d) => (d ? stringLights(110, ['#ffd36b', '#ff7a9c', '#5fe0e0', '#9be36b']) + lantern(40, 60) + lantern(320, 60) : darkness(0.32)),
  photo: (d) =>
    d
      ? `<path d="M40 236 L52 196 L64 236 M52 196 V236" ${O} stroke-width="2.4"/><rect x="38" y="180" width="30" height="18" rx="3" fill="#333" ${O}/><circle cx="53" cy="189" r="5" fill="url(#gSky)" ${THIN}/>` +
        glow(46, 172, 30, 0.9) + sparkle(46, 168, 8, '#fff') + Array.from({ length: 20 }, (_, i) => `<rect x="${(i * 47) % 350 + 4}" y="${(i * 29) % 150 + 6}" width="5" height="3" rx="1" fill="${['#ff7a9c', '#ffd36b', '#5fe0e0', '#c58bff'][i % 4]}" transform="rotate(${(i * 53) % 180} ${(i * 47) % 350 + 6} ${(i * 29) % 150 + 7})"/>`).join('')
      : '',
};

const worldBase = () =>
  `<rect width="360" height="170" fill="#22305e"/>` + Array.from({ length: 20 }, (_, i) => `<circle cx="${(i * 83) % 356 + 2}" cy="${(i * 37) % 60 + 4}" r="1.2" fill="#fff6c8"/>`).join('') +
  `<rect x="0" y="40" width="120" height="140" fill="#d9a873" ${O}/><rect x="240" y="40" width="120" height="140" fill="#e0b07a" ${O}/>` +
  `<path d="${pointed(120, 240, 90, 40, 176)}" fill="url(#gTerracotta)" ${O}/><path d="${pointed(146, 214, 120, 96, 176)}" fill="#3b2a20" ${O}/>` + floor('#8a7a66', 176);

export const SCENES11: Record<string, SceneDef> = {
  dossier: { base: wall('#efe3cc') + floor('#a5703e'), order: ['photos', 'files', 'table', 'stamp', 'lamp'], layers: DOSSIER },
  inspection: { base: inspectionBase(), order: ['sweep', 'signs', 'flowers', 'guides', 'tea'], layers: INSPECTION },
  exhibition: { base: exhibitionBase(), order: ['lights', 'frames', 'path', 'book', 'ribbon'], layers: EXHIBITION },
  culturenight: { base: cultureBase(), order: ['carpets', 'santur', 'calligraphy', 'ash', 'lanterns'], layers: CULTURENIGHT },
  worldparty: { base: worldBase(), order: ['plaque', 'flags', 'stage', 'lights', 'photo'], layers: WORLDPARTY },
};
