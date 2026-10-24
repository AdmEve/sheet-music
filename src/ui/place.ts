// The alley screen: the place being restored, its next task, and the story dialogue.

import { ICONS } from '../art/icons';
import { portrait } from '../art/portraits';
import { sceneSvg } from '../art/places';
import { completeNextTask, introKey, markSeen, outroKey, progress } from '../game/progress';
import { buzz } from '../platform/haptics';
import { CAST, Line, PLACES, Place } from '../story/story';
import type { App } from './app';
import { add, clear, fa, h, svgIcon, wait } from './dom';
import { sfx } from './sound';

export class PlaceScreen {
  readonly places = PLACES;

  private working = false;

  constructor(private app: App) {}

  /** Shows the alley screen; resolves when the player goes back to the board. */
  open(): Promise<void> {
    return new Promise((resolve) => {
      const screen = h('div', { class: 'place' });
      document.body.append(screen);
      const back = () => {
        screen.remove();
        resolve();
      };
      this.render(screen, back);
    });
  }

  private render(screen: HTMLElement, back: () => void, flashLayer = false): void {
    const s = this.app.s;
    const p = progress(s);
    clear(screen);
    const place: Place = p.place ?? PLACES[PLACES.length - 1];
    const scene = h('div', { class: 'scene', html: sceneSvg(place.id, (layer) => this.layerDone(place, layer)) });
    if (flashLayer) scene.append(h('div', { class: 'flash' }));
    const episodes = h('div', { class: 'episodes' }, ...PLACES.map((_, k) =>
      h('span', { class: `ep${k < p.placeIndex ? ' done' : k === p.placeIndex ? ' cur' : ''}` }, `قسمت ${fa(k + 1)}`)));

    const card = h('div', { class: 'card' });
    if (!p.next || !p.place) {
      card.append(
        h('div', { class: 'tasktitle' }, 'فصل دوم تموم شد! 💍'),
        h('p', { class: 'muted' }, 'کوچه نجات پیدا کرد و عروسی هم برگزار شد. فصل سوم («نامه‌ای از اون ور دنیا») به‌زودی با آپدیت بعدی میاد.'),
        h('button', { class: 'btn', onclick: back }, 'برگرد به بازی'),
      );
    } else {
      const total = p.place.tasks.length;
      const enough = s.stars >= p.next.cost;
      add(card,
        h('div', { class: 'muted' }, `کار ${fa(p.doneInPlace + 1)} از ${fa(total)}`),
        h('div', { class: 'progress' }, h('div', { style: `width:${(p.doneInPlace / total) * 100}%` })),
        h('div', { class: 'tasktitle' }, p.next.title),
        h('button', { class: `btn ${enough ? 'gold' : 'plain'}`, onclick: () => this.doTask(screen, back) },
          enough ? 'انجامش بده  ' : 'ستاره کافی نداری  ', fa(p.next.cost), h('span', { html: svgIcon(ICONS.star) })),
        enough ? null : h('p', { class: 'muted' }, `ستاره‌هات: ${fa(s.stars)}. سفارش همسایه‌ها رو تحویل بده تا ستاره جمع کنی.`),
      );
    }
    const list = h('div', { class: 'tasks' }, ...place.tasks.map((t) => {
      const done = s.tasksDone.includes(t.id);
      const cur = p.next?.id === t.id;
      return h('div', { class: `task${done ? ' done' : cur ? ' cur' : ''}` },
        h('span', { class: 'mark' }, done ? '✓' : cur ? '◀' : '•'),
        h('span', { class: 'tt' }, t.title),
        done ? null : h('span', { class: 'cost' }, fa(t.cost), h('span', { html: svgIcon(ICONS.star) })));
    }));
    screen.append(
      h('div', { class: 'top' },
        h('button', { class: 'chip', onclick: back }, '→ بازی'),
        h('h2', {}, place.name),
        h('div', { class: 'chip' }, fa(s.stars), h('span', { html: svgIcon(ICONS.star) }))),
      scene,
      episodes,
      card,
      list,
    );
  }

  private layerDone(place: Place, layer: string): boolean {
    const t = place.tasks.find((x) => x.layer === layer);
    return !!t && this.app.s.tasksDone.includes(t.id);
  }

  private async doTask(screen: HTMLElement, back: () => void): Promise<void> {
    // One task at a time: a double tap must not buy the next task too.
    if (this.working) return;
    this.working = true;
    try {
      await this.runTask(screen, back);
    } finally {
      this.working = false;
    }
  }

  private async runTask(screen: HTMLElement, back: () => void): Promise<void> {
    const s = this.app.s;
    const r = completeNextTask(s);
    if (!r.ok) {
      if (r.reason === 'notEnoughStars') {
        sfx.error();
        back();
      }
      return;
    }
    sfx.task();
    buzz('heavy');
    await this.app.saveNow();
    this.render(screen, back, true);
    await wait(900);
    await this.dialogue(r.task.after);
    if (r.placeFinished) {
      if (markSeen(s, outroKey(r.place.id))) await this.dialogue(r.place.outro);
      if (r.place.id === PLACES[0].id && markSeen(s, 'ask:rate')) await this.app.modals.rateAsk();
      if (r.nextPlace && markSeen(s, introKey(r.nextPlace.id))) {
        this.render(screen, back);
        await wait(400);
        await this.dialogue(r.nextPlace.intro);
      }
      this.app.dirty();
    }
    this.render(screen, back);
  }

  /** Plays lines one by one; tap to advance (first tap finishes the typing). */
  dialogue(lines: Line[]): Promise<void> {
    return new Promise((resolve) => {
      if (!lines.length) return resolve();
      const root = h('div', { class: 'dialogue' });
      document.body.append(root);
      let k = 0;
      let typing = 0;
      let full = '';
      let textEl: HTMLElement | null = null;
      const show = () => {
        const line = lines[k];
        const who = CAST[line.who];
        clear(root);
        root.classList.toggle('flip', line.who !== 'narges');
        textEl = h('div', { class: 'text' });
        root.append(h('div', { class: 'row' },
          h('div', { class: 'face', html: svgIcon(portrait(line.who)) }),
          h('div', { class: 'bubble' },
            h('div', { class: 'who' }, who?.name ?? '', h('span', { class: 'role' }, who?.role ?? '')),
            textEl,
            h('div', { class: 'next' }, k < lines.length - 1 ? 'ادامه ◂' : 'بستن ◂'))));
        full = line.text;
        let n = 0;
        clearInterval(typing);
        typing = window.setInterval(() => {
          n += 2;
          if (textEl) textEl.textContent = full.slice(0, n);
          if (n >= full.length) clearInterval(typing);
        }, 22);
        sfx.page();
      };
      root.addEventListener('click', () => {
        if (textEl && textEl.textContent !== full) {
          clearInterval(typing);
          textEl.textContent = full;
          return;
        }
        k++;
        if (k >= lines.length) {
          clearInterval(typing);
          root.remove();
          resolve();
        } else show();
      });
      show();
    });
  }
}
