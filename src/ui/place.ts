// The alley screen: the place being restored, its next task, and the story dialogue.

import { ICONS } from '../art/icons';
import { moodOf, portrait } from '../art/portraits';
import { STYLES } from '../art/decor';
import { MAP_H, MapState, mapSvg, plot } from '../art/alleymap';
import { layerHasStyles, sceneSvg } from '../art/places';
import { CHAINS, itemName } from '../game/items';
import { ensureGenerators } from '../game/model';
import { EPISODES_PER_SEASON, offerOnEpisode, seasonReward } from '../game/offers';
import { completeNextTask, introKey, markSeen, outroKey, progress } from '../game/progress';
import { buzz } from '../platform/haptics';
import { CAST, Line, PLACES, Place } from '../story/story';
import type { App } from './app';
import { add, clear, fa, h, svgIcon, wait } from './dom';
import { confetti, rays } from './celebrate';
import { sfx } from './sound';

export class PlaceScreen {
  readonly places = PLACES;

  private working = false;
  /** A finished place opened from the map or the episode chips (null = the current one). */
  private viewing: Place | null = null;
  /** Season whose episode chips are listed (null = the season of the place shown). */
  private seasonShown: number | null = null;

  constructor(private app: App) {}

  /** Shows the alley screen; resolves when the player goes back to the board. */
  open(): Promise<void> {
    return new Promise((resolve) => {
      const screen = h('div', { class: 'place' });
      this.viewing = null;
      this.seasonShown = null;
      document.body.append(screen);
      const back = () => {
        screen.remove();
        resolve();
      };
      this.render(screen, back);
      // A new season that arrived by update: its first place has not been introduced yet.
      const cur = progress(this.app.s).place;
      if (cur && markSeen(this.app.s, introKey(cur.id))) {
        this.app.dirty();
        void this.dialogue(cur.intro);
      }
    });
  }

  private render(screen: HTMLElement, back: () => void, flashLayer = false): void {
    const s = this.app.s;
    const p = progress(s);
    clear(screen);
    const place: Place = this.viewing ?? p.place ?? PLACES[PLACES.length - 1];
    const scene = h('div', { class: 'scene', html: this.scene(place) });
    if (flashLayer) scene.append(h('div', { class: 'flash' }));
    const visit = (k: number) => {
      if (k > p.placeIndex) return this.app.toast('اول قسمت‌های قبلی رو تموم کن!');
      this.viewing = k === p.placeIndex ? null : PLACES[k];
      this.seasonShown = null;
      sfx.page();
      this.render(screen, back);
    };
    const shown = PLACES.indexOf(place);
    // One row of seasons, then the five episodes of the chosen one: 45 chips at once would
    // push the task card off the screen.
    const seasonOf = (k: number) => Math.floor(k / EPISODES_PER_SEASON);
    const curSeason = seasonOf(Math.min(p.placeIndex, PLACES.length - 1));
    const sel = this.seasonShown ?? seasonOf(shown);
    const seasons = h('div', { class: 'seasons' }, ...Array.from({ length: Math.ceil(PLACES.length / EPISODES_PER_SEASON) }, (_, n) =>
      h('button', {
        class: `sn${n < curSeason ? ' done' : n === curSeason ? ' cur' : ' locked'}${n === sel ? ' shown' : ''}`,
        onclick: () => {
          if (n > curSeason) return this.app.toast('اول فصل‌های قبلی رو تموم کن!');
          this.seasonShown = n;
          sfx.page();
          this.render(screen, back);
        },
      }, `فصل ${fa(n + 1)}`)));
    const episodes = h('div', { class: 'episodes' }, ...PLACES.slice(sel * EPISODES_PER_SEASON, (sel + 1) * EPISODES_PER_SEASON).map((_, j) => {
      const k = sel * EPISODES_PER_SEASON + j;
      return h('button', { class: `ep${k < p.placeIndex ? ' done' : k === p.placeIndex ? ' cur' : ''}${k === shown ? ' shown' : ''}`, onclick: () => visit(k) }, `قسمت ${fa(k + 1)}`);
    }));

    const card = h('div', { class: 'card' });
    if (this.viewing) {
      card.append(
        h('div', { class: 'tasktitle' }, '✓ این قسمت تموم شده'),
        h('p', { class: 'muted' }, 'می‌تونی سبک هر تکه رو از فهرست پایین عوض کنی.'),
        h('button', { class: 'btn', onclick: () => visit(p.placeIndex) }, 'برگرد به قسمت فعلی'),
      );
    } else if (!p.next || !p.place) {
      card.append(
        h('div', { class: 'tasktitle' }, 'فصل بیست‌ویکم تموم شد! 🎉'),
        h('p', { class: 'muted' }, 'کوچه‌ی اقاقیا نجات پیدا کرد و دالون دو کوچه دوباره باز شد. ولی تابستون بچه‌ها… فصل بیست‌ودوم به‌زودی با آپدیت بعدی میاد.'),
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
        done
          ? layerHasStyles(place.id, t.layer)
            ? h('button', { class: 'chip', 'aria-label': 'تغییر سبک', onclick: async () => {
                await this.chooseStyle(place, t.layer, false);
                this.render(screen, back);
              } }, '🎨 سبک')
            : null
          : h('span', { class: 'cost' }, fa(t.cost), h('span', { html: svgIcon(ICONS.star) })));
    }));
    screen.append(
      h('div', { class: 'top' },
        h('button', { class: 'chip', onclick: back }, '→ بازی'),
        h('h2', {}, place.name),
        h('button', { class: 'chip', 'aria-label': 'نقشه‌ی محله', onclick: () => this.openMap(screen, back, visit) }, '🗺'),
        h('div', { class: 'chip' }, fa(s.stars), h('span', { html: svgIcon(ICONS.star) }))),
      scene,
      seasons,
      episodes,
      card,
      list,
    );
    // Keep the chosen season in view (the strip starts at season 1).
    requestAnimationFrame(() => seasons.querySelector('.shown')?.scrollIntoView({ inline: 'center', block: 'nearest' }));
  }

  /** The whole alley: restored places in colour, the current one under scaffolding. */
  private openMap(screen: HTMLElement, back: () => void, visit: (k: number) => void): void {
    const p = progress(this.app.s);
    const states: MapState[] = PLACES.map((_, k) => (k < p.placeIndex ? 'done' : k === p.placeIndex ? 'current' : 'locked'));
    const close = () => view.remove();
    const body = h('div', { class: 'map-body', html: mapSvg(PLACES.map((x) => x.id), PLACES.map((x) => x.name), states) });
    const view = h('div', { class: 'mapview' },
      h('div', { class: 'top' }, h('button', { class: 'chip', onclick: close }, '→ برگرد'), h('h2', {}, 'نقشه‌ی محله'), h('span', { class: 'chip' }, `${fa(Math.min(p.placeIndex, PLACES.length))}/${fa(PLACES.length)} ✓`)),
      body);
    body.addEventListener('click', (e) => {
      const g = (e.target as Element).closest('.map-place') as SVGGElement | null;
      if (!g) return;
      const k = Number(g.dataset.k);
      if (k > p.placeIndex) return this.app.toast('اول قسمت‌های قبلی رو تموم کن!');
      close();
      visit(k);
    });
    screen.append(view);
    sfx.page();
    // Open at the place being worked on.
    const k = Math.min(p.placeIndex, PLACES.length - 1);
    requestAnimationFrame(() => {
      const svg = body.querySelector('svg');
      if (!svg) return;
      const scale = svg.getBoundingClientRect().height / MAP_H;
      body.scrollTop = plot(k).y * scale - body.clientHeight / 2;
    });
    void back;
  }

  private scene(place: Place, override?: { layer: string; style: number }): string {
    const s = this.app.s;
    return sceneSvg(place.id, (layer) => this.layerDone(place, layer),
      (layer) => (override?.layer === layer ? override.style : s.decor[`${place.id}.${layer}`] ?? 0));
  }

  /**
   * Lets the player pick the look of a restored piece: three previews of the whole place.
   * The choice is saved at once and can be changed later from the task list.
   */
  chooseStyle(place: Place, layer: string, fresh: boolean): Promise<void> {
    const s = this.app.s;
    const key = `${place.id}.${layer}`;
    return this.app.modals.open(fresh ? 'سبکش رو انتخاب کن!' : 'تغییر سبک', (body, close) => {
      const grid = h('div', { class: 'decor-pick' });
      const preview = h('div', { class: 'decor-preview' });
      const draw = () => {
        clear(grid);
        preview.innerHTML = this.scene(place, { layer, style: s.decor[key] ?? 0 });
        STYLES.forEach((st, k) => {
          grid.append(h('button', { class: `decor-opt${(s.decor[key] ?? 0) === k ? ' on' : ''}`, onclick: () => {
            s.decor[key] = k;
            sfx.tap();
            this.app.dirty();
            draw();
          } }, h('div', { class: 'thumb', html: this.scene(place, { layer, style: k }) }), h('b', {}, st.name)));
        });
      };
      draw();
      add(body,
        preview,
        grid,
        h('p', { style: 'font-size:12px;margin:6px 0 0' }, 'هر وقت خواستی می‌تونی از فهرست کارها عوضش کنی.'),
        h('button', { class: 'btn', onclick: close }, 'همینو می‌خوام'));
    }, !fresh);
  }

  /** Episode finished: the place wipes from how it was to how it is now, with confetti. */
  episodeDone(place: Place): Promise<void> {
    const n = PLACES.indexOf(place) + 1;
    const before = sceneSvg(place.id, () => false);
    const after = this.scene(place);
    sfx.levelUp();
    return this.app.modals.open(`قسمت ${fa(n)} تموم شد!`, (body, close) => {
      const wipe = h('div', { class: 'wipe' },
        h('div', { class: 'w-before', html: before }),
        h('div', { class: 'w-after', html: after }),
        h('div', { class: 'w-line' }),
        h('span', { class: 'w-tag b' }, 'قبل'), h('span', { class: 'w-tag a' }, 'بعد'));
      add(body,
        h('div', { class: 'hero-wrap small' }, rays(), h('b', { class: 'ep-name' }, place.name)),
        wipe,
        h('p', {}, 'همسایه‌ها باورشون نمی‌شه! ببین چی بود و چی شد.'),
        h('button', { class: 'btn big', onclick: close }, 'ادامه‌ی قصه'));
      setTimeout(() => {
        wipe.classList.add('go');
        confetti(50);
      }, 400);
    }, false);
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
    if (layerHasStyles(r.place.id, r.task.layer)) {
      await this.chooseStyle(r.place, r.task.layer, true);
      this.render(screen, back);
    }
    await this.dialogue(r.task.after);
    if (r.placeFinished) {
      await this.episodeDone(r.place);
      if (markSeen(s, outroKey(r.place.id))) await this.dialogue(r.place.outro);
      const sr = seasonReward(PLACES.indexOf(r.place));
      if (sr && markSeen(s, `season:${sr.season}`)) await this.app.modals.seasonReward(sr);
      if (r.place.id === PLACES[0].id && markSeen(s, 'ask:rate')) await this.app.modals.rateAsk();
      if (r.nextPlace && markSeen(s, introKey(r.nextPlace.id))) {
        this.render(screen, back);
        await wait(400);
        await this.dialogue(r.nextPlace.intro);
      }
      // A new season brings its own generator (and its chain into the orders).
      const arrived = ensureGenerators(s);
      if (arrived.length) this.app.dirty();
      for (const it of arrived) {
        const where = s.board.some((c) => c.item?.chain === it.chain) ? 'رو صفحه‌ست' : 'تو کیفته';
        this.app.toast(`«${itemName(it)}» رسید و ${where}! از حالا سفارش «${CHAINS[CHAINS[it.chain].produces!].name}» هم میاد.`);
        await wait(2600);
      }
      // From episode 2 on, a finished episode starts a 24 h celebration bundle.
      if (r.place.id !== PLACES[0].id) {
        offerOnEpisode(s, Date.now());
        await this.app.modals.offer('chapter');
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
          h('div', { class: `face${k > 0 && lines[k - 1].who === line.who ? ' react' : ''}`, html: svgIcon(portrait(line.who, line.mood ?? moodOf(line.text))) }),
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
