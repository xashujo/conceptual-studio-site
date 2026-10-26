// /work/ filters (brief 6.2): the re-layout is animated with GSAP Flip.
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

// The varied grid: spans per row on desktop, repeating. Every 4 drops a little so the
// row edges don't line up.
const PATTERN = [[5, 4, 3], [3, 5, 4], [4, 3, 5]];
const SIZE: Record<number, string> = { 7: 'l', 5: 'l', 4: 'm', 3: 's' };

// Rows of three; when one card would be left alone, the last four go two by two (7 + 5, 5 + 7),
// and a last pair goes 7 + 5, so no row is half empty.
function spansFor(n: number) {
  const three = PATTERN.flat();
  const rest = n % 3;
  const full = n - (rest === 1 ? 4 : rest);
  const tail = rest === 1 ? [7, 5, 5, 7] : rest === 2 ? [7, 5] : [];
  return [...Array.from({ length: full }, (_, i) => three[i % three.length]), ...tail];
}

function varied(cards: HTMLElement[]) {
  const spans = spansFor(cards.length);
  cards.forEach((c, i) => {
    const span = spans[i];
    c.dataset.span = String(span);
    c.dataset.size = SIZE[span];
    if (span === 4) c.dataset.drop = ''; else delete c.dataset.drop;
  });
}

// Bento trial: a placement per number of cards, in the order the cards appear, as
// [first column, columns, first row, rows] on a 12-column grid. Each set fills its block
// with no holes. Portrait images (Oxford, BSix, Pandora) get the tall tiles.
type Cell = [number, number, number, number];
const BENTO: Record<number, Cell[]> = {
  // Strategic Intent, Oxford, ACL, Fou Answer, NYGG, BSix, Pandora Forever
  7: [[1, 7, 1, 4], [8, 5, 1, 6], [1, 4, 5, 4], [1, 3, 9, 3], [4, 4, 9, 3], [5, 3, 5, 4], [8, 5, 7, 5]],
  // the archive: KUT, the final major project, then three square renders
  5: [[1, 7, 1, 5], [8, 5, 1, 5], [1, 4, 6, 4], [5, 4, 6, 4], [9, 4, 6, 4]],
  // data and motion: one large, one wide below it, one tall beside both
  3: [[1, 8, 1, 5], [1, 8, 6, 4], [9, 4, 1, 9]],
  // brand: Oxford's portrait poster, then Fou Answer
  2: [[1, 5, 1, 6], [6, 7, 1, 6]],
};

function bento(cards: HTMLElement[]) {
  const cells = BENTO[cards.length];
  cards.forEach((c, i) => {
    const cell = cells?.[i];
    if (cell) c.style.setProperty('--area', `${cell[2]} / ${cell[0]} / span ${cell[3]} / span ${cell[1]}`);
    else c.style.removeProperty('--area'); // shortcut: other counts fall back to auto-placed 4 x 3 tiles; add a set if a filter ever has another count
  });
}

export function initWorkFilter() {
  const grid = document.querySelector<HTMLElement>('.grid');
  if (!grid) return;
  const layout = grid.dataset.layout === 'bento' ? bento : varied;
  const cards = [...grid.querySelectorAll<HTMLElement>('.wc')];
  const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-filter]')];
  const note = document.querySelector<HTMLElement>('.archive-note');
  const still = matchMedia('(prefers-reduced-motion: reduce)');

  const show = (f: string) => {
    const state = Flip.getState(cards);
    cards.forEach((c) => {
      const tags = c.dataset.tags!.split(' ');
      c.hidden = f === 'all' ? tags.includes('archive') : !tags.includes(f);
    });
    layout(cards.filter((c) => !c.hidden));
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === f)));
    if (note) note.hidden = f !== 'archive';
    if (still.matches) return;
    Flip.from(state, {
      duration: 0.7, ease: 'expo.out', absolute: true, nested: true, scale: false,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.06 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.25, ease: 'power1.out' }),
    });
  };

  layout(cards.filter((c) => !c.hidden));
  buttons.forEach((b) => b.addEventListener('click', () => show(b.dataset.filter!)));
}
