// Bento layout for case study galleries (Josh, 4 Nov: "show proper bento grids"). The gallery becomes one
// 12-column grid of bands two rows tall. A band holds three images (one large tile and two small, or three
// tall) or two (a wide and a narrow, or two halves). The first image is always the large hero tile, and
// the bands alternate sides so the tiles interlock instead of stacking in uniform rows.
// Inside a band each image goes to the slot whose shape is nearest its own, so a portrait lanyard lands
// in a tall tile and a wide logo in a wide one. Tiles never crop: the image sits whole on its own
// background colour (see [slug].astro).

export interface Tile { index: number; col: number; row: number; w: number; h: number }
type Slot = { col: number; row: number; w: number; h: number };

// Slot shapes as the image area sees them on desktop: column width, gap, caption height, row height.
const U = 80, G = 24, CAP = 52, R = 3 * U + CAP;
export const ratioOf = (s: { w: number; h: number }) => (s.w * U + (s.w - 1) * G) / (s.h * R + (s.h - 1) * G - CAP);

const trios: Slot[][] = [
  [{ col: 1, row: 0, w: 8, h: 2 }, { col: 9, row: 0, w: 4, h: 1 }, { col: 9, row: 1, w: 4, h: 1 }], // large + two small
  [{ col: 1, row: 0, w: 4, h: 2 }, { col: 5, row: 0, w: 4, h: 2 }, { col: 9, row: 0, w: 4, h: 2 }], // three tall
];
const pairs: Slot[][] = [
  [{ col: 1, row: 0, w: 7, h: 2 }, { col: 8, row: 0, w: 5, h: 2 }], // wide + narrow
  [{ col: 1, row: 0, w: 6, h: 2 }, { col: 7, row: 0, w: 6, h: 2 }], // halves
];
const single: Slot[] = [{ col: 1, row: 0, w: 12, h: 2 }];

const mirror = (t: Slot[]) => t.map((s) => ({ ...s, col: 14 - s.col - s.w }));
const misfit = (ratio: number, s: Slot) => Math.abs(Math.log(ratio / ratioOf(s)));

function permutations<T>(xs: T[]): T[][] {
  if (xs.length < 2) return [xs];
  return xs.flatMap((x, i) => permutations([...xs.slice(0, i), ...xs.slice(i + 1)]).map((p) => [x, ...p]));
}

// Band sizes: threes, ending in a pair or two; a lone image only when there is just one.
export function bands(n: number): number[] {
  if (n <= 0) return [];
  if (n <= 3) return [n];
  const out = Array(Math.floor(n / 3)).fill(3);
  if (n % 3 === 2) out.push(2);
  if (n % 3 === 1) out.splice(-1, 1, 2, 2);
  return out;
}

/** Places images (given by width / height) into the bento. Tiles come back in reading order. `flip` starts
 *  on the mirrored side, so consecutive bentos on one page (CMD's chapters) alternate too. */
export function bento(ratios: number[], flip = false): Tile[] {
  const tiles: Tile[] = [];
  let start = 0, row = 1;
  bands(ratios.length).forEach((size, b) => {
    const idx = ratios.slice(start, start + size).map((_, i) => start + i);
    let templates = size === 3 ? trios : size === 2 ? pairs : [single];
    // The first band opens with the hero: the first image, in the largest tile.
    if (b === 0) templates = [templates[0]];
    if ((b + Number(flip)) % 2) templates = templates.map(mirror);
    let best: { cost: number; slots: Slot[]; order: number[] } | undefined;
    for (const slots of templates) {
      for (const order of permutations(idx)) {
        if (b === 0 && order[0] !== 0) continue;
        const cost = order.reduce((c, i, k) => c + misfit(ratios[i], slots[k]), 0);
        if (!best || cost < best.cost - 1e-9) best = { cost, slots, order };
      }
    }
    best!.order.forEach((i, k) => { const s = best!.slots[k]; tiles.push({ index: i, col: s.col, row: row + s.row, w: s.w, h: s.h }); });
    row += 2;
    start += size;
  });
  return tiles.sort((a, b) => a.row - b.row || a.col - b.col);
}
