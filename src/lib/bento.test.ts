// Run: node --test src/lib/bento.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bento, splits, COLS } from './bento.ts';

const mix = (n: number) => Array.from({ length: n }, (_, i) => ({ ratio: [1.4, 0.8, 2.5, 1.2, 1.0][i % 5] }));

test('splits use blocks of two to five, and cover every image', () => {
  for (let n = 1; n <= 12; n++) for (const s of splits(n)) {
    assert.equal(s.reduce((a, x) => a + x, 0), n);
    if (n > 1) assert.ok(s.every((k) => k >= 2 && k <= 5), `n=${n}: ${s}`);
  }
});

test('the grid is solid: every image placed once, no overlaps, no holes', () => {
  for (let n = 1; n <= 12; n++) {
    const tiles = bento(mix(n));
    assert.deepEqual(tiles.map((t) => t.index).sort((a, b) => a - b), [...Array(n).keys()]);
    const cells = new Set<string>();
    let rows = 0;
    for (const t of tiles) for (let c = t.col; c < t.col + t.w; c++) for (let r = t.row; r < t.row + t.h; r++) {
      const k = `${c},${r}`; assert.ok(!cells.has(k), `n=${n}: overlap at ${k}`); cells.add(k);
      assert.ok(c >= 1 && c <= COLS);
      rows = Math.max(rows, r);
    }
    assert.equal(cells.size, rows * COLS, `n=${n}: holes`);
  }
});

test('the first image takes the largest tile', () => {
  for (let n = 2; n <= 9; n++) {
    const tiles = bento(mix(n));
    const first = tiles.find((t) => t.index === 0)!;
    assert.ok(tiles.every((t) => t.w * t.h <= first.w * first.h), `n=${n}`);
  }
});

test('a tall image lands in a tall tile', () => {
  const tiles = bento([{ ratio: 1.3 }, { ratio: 0.6 }, { ratio: 1.3 }, { ratio: 1.3 }]);
  const tall = tiles.find((t) => t.index === 1)!;
  assert.ok(tall.h * 0.75 > tall.w * 0.9, JSON.stringify(tall));
});
