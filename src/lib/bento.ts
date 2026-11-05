// Apple-style bento for case studies (Josh, 4 Nov: "Where is the bento?"). One dense grid of six columns with
// tight, even gutters. Tiles come in mixed sizes, as in Apple's feature grids: a large feature, tall and wide
// tiles, and small ones. The grid is built from hand-drawn blocks of two to five tiles, stacked into one grid,
// alternating sides so they interlock.
// Every tile has a shape it would like (an image's width / height). For each block, every image goes to the
// slot whose shape is nearest its own; across blocks the split of images that wastes least space wins.
// The first tile is always the large feature. Tiles never crop artwork: see [slug].astro.

export interface Item { ratio: number; /** how much a poor fit matters: 1 for artwork, more for photos, less for text */ weight?: number }
export interface Tile { index: number; col: number; row: number; w: number; h: number }
type Slot = { col: number; row: number; w: number; h: number };

export const COLS = 6;
// A row is three quarters of a column wide. Desktop measures (column, gutter) set the shapes the slots aim at.
export const ROW = 0.75;
const U = 180, G = 12;
export const ratioOf = (s: { w: number; h: number }) => (s.w * U + (s.w - 1) * G) / (s.h * U * ROW + (s.h - 1) * G);

// Blocks drawn as six-column maps; A is the block's lead tile. `plain` blocks (equal tiles) cost a little more,
// so the grid only falls back to them when the images really want them.
const draw = (rows: string[], plain = false) => {
  const slots = new Map<string, Slot>();
  rows.forEach((line, r) => [...line].forEach((ch, c) => {
    const s = slots.get(ch);
    if (!s) slots.set(ch, { col: c + 1, row: r, w: 1, h: 1 });
    else { s.w = Math.max(s.w, c + 2 - s.col); s.h = Math.max(s.h, r + 1 - s.row); }
  }));
  return { slots: [...slots.keys()].sort().map((k) => slots.get(k)!), rows: rows.length, plain };
};
type Block = ReturnType<typeof draw>;

const blocks: Record<number, Block[]> = {
  1: [draw(['AAAAAA', 'AAAAAA']), draw(['AAAAAA', 'AAAAAA', 'AAAAAA', 'AAAAAA'])],
  2: [
    draw(['AAAABB', 'AAAABB', 'AAAABB', 'AAAABB']),
    draw(['AAAABB', 'AAAABB']),
    draw(['AAABBB', 'AAABBB', 'AAABBB'], true),
  ],
  3: [
    draw(['AAAABB', 'AAAABB', 'AAAACC', 'AAAACC']),
    draw(['AAAAAA', 'AAAAAA', 'BBBCCC', 'BBBCCC']),
    draw(['AAAABB', 'AAAABB', 'CCCCBB', 'CCCCBB']),
    draw(['AABBCC', 'AABBCC', 'AABBCC', 'AABBCC'], true),
  ],
  4: [
    draw(['AAAABB', 'AAAABB', 'CCDDBB', 'CCDDBB']),
    draw(['AAAABB', 'AAAABB', 'DDCCCC', 'DDCCCC']),
    draw(['AAAABB', 'AAAABB', 'AAAACC', 'AAAACC', 'DDDDDD', 'DDDDDD']),
    draw(['AAABBB', 'AAABBB', 'CCCDDD', 'CCCDDD'], true),
  ],
  5: [
    draw(['AAAABB', 'AAAABB', 'CCDDEE', 'CCDDEE']),
    draw(['AAAABB', 'AAAABB', 'AAAACC', 'AAAACC', 'DDDEEE', 'DDDEEE']),
    draw(['AABBBB', 'AABBBB', 'AACCDD', 'EECCDD']),
  ],
};

const mirror = (b: Block): Block => ({ ...b, slots: b.slots.map((s) => ({ ...s, col: COLS + 2 - s.col - s.w })) });
const misfit = (it: Item, s: Slot) => (it.weight ?? 1) * Math.abs(Math.log(it.ratio / ratioOf(s)));

function permutations<T>(xs: T[]): T[][] {
  if (xs.length < 2) return [xs];
  return xs.flatMap((x, i) => permutations([...xs.slice(0, i), ...xs.slice(i + 1)]).map((p) => [x, ...p]));
}

// Splits n into blocks of two to five (a lone block of one only when n is 1).
export function splits(n: number): number[][] {
  if (n <= 0) return [[]];
  if (n === 1) return [[1]];
  const out: number[][] = [];
  const walk = (left: number, acc: number[]) => {
    if (left === 0) return void out.push(acc);
    for (let k = 2; k <= Math.min(5, left); k++) walk(left - k, [...acc, k]);
  };
  walk(n, []);
  return out;
}

/** The best way to lay `items` (indices start..start+size) into one block, and its cost. */
function fit(items: Item[], start: number, size: number, flip: boolean, lead: boolean, plainCost: number) {
  const idx = Array.from({ length: size }, (_, i) => start + i);
  let best: { cost: number; block: Block; order: number[] } | undefined;
  for (const raw of blocks[size]) {
    const block = flip ? mirror(raw) : raw;
    for (const order of permutations(idx)) {
      if (lead && order[0] !== start) continue; // the opening image takes the feature tile
      let cost = order.reduce((c, i, k) => c + misfit(items[i], block.slots[k]), raw.plain ? plainCost * size : 0);
      // Keep the CMS order where shapes allow (a before reads before its after).
      const seat = (k: number) => block.slots[k].row * COLS + block.slots[k].col;
      for (let a = 0; a < size; a++) for (let b = a + 1; b < size; b++) if ((order[a] - order[b]) * (seat(a) - seat(b)) < 0) cost += 0.1;
      if (!best || cost < best.cost - 1e-9) best = { cost, block, order };
    }
  }
  return best!;
}

/** Places items into the bento. Tiles come back in reading order. `flip` starts on the mirrored side.
 *  `plainCost` is how much less an even grid is liked than a feature layout; slides of one shape (the data
 *  projects) use less, so two charts sit as equal halves instead of one wide strip (Josh, 5 Nov: "so thin"). */
export function bento(items: Item[], flip = false, plainCost = 0.35): Tile[] {
  if (!items.length) return [];
  let best: { cost: number; tiles: Tile[] } | undefined;
  for (const sizes of splits(items.length)) {
    let start = 0, row = 1, cost = 0.25 * sizes.length; // fewer, bigger blocks read calmer
    const tiles: Tile[] = [];
    sizes.forEach((size, b) => {
      const f = fit(items, start, size, (b + Number(flip)) % 2 === 1, b === 0, plainCost);
      cost += f.cost;
      f.order.forEach((i, k) => { const s = f.block.slots[k]; tiles.push({ index: i, col: s.col, row: row + s.row, w: s.w, h: s.h }); });
      row += f.block.rows;
      start += size;
    });
    if (!best || cost < best.cost - 1e-9) best = { cost, tiles };
  }
  return best!.tiles.sort((a, b) => a.row - b.row || a.col - b.col);
}
