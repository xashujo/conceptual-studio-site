// Run: node --test src/lib/bento.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bento, bands } from './bento.ts';

test('bands never leave a lone image unless there is only one', () => {
  for (let n = 1; n <= 12; n++) {
    const b = bands(n);
    assert.equal(b.reduce((a, x) => a + x, 0), n);
    if (n > 1) assert.ok(!b.includes(1), `n=${n}: ${b}`);
  }
});

test('every band fills its 12 columns x 2 rows with no overlap', () => {
  for (let n = 1; n <= 12; n++) {
    const tiles = bento(Array.from({ length: n }, (_, i) => [1.4, 0.8, 2.5, 1.2][i % 4]));
    assert.deepEqual(tiles.map((t) => t.index).sort((a, b) => a - b), [...Array(n).keys()]);
    const cells = new Set<string>();
    for (const t of tiles) for (let c = t.col; c < t.col + t.w; c++) for (let r = t.row; r < t.row + t.h; r++) {
      const k = `${c},${r}`; assert.ok(!cells.has(k), `overlap at ${k}`); cells.add(k);
      assert.ok(c >= 1 && c <= 12);
    }
    assert.equal(cells.size, 24 * bands(n).length);
  }
});

test('the first image is the hero tile', () => {
  const [first] = bento([0.8, 1.4, 1.4]);
  assert.deepEqual([first.index, first.w, first.h], [0, 8, 2]);
});

test('a portrait image lands in a tall tile', () => {
  const tiles = bento([1.4, 1.2, 2.5, 1.7, 0.83, 1.87]); // the Oxford gallery
  const lanyards = tiles.find((t) => t.index === 4)!;
  assert.equal(lanyards.h, 2);
});

test('a flipped bento opens on the other side, still with the hero first', () => {
  const first = bento([1.4, 1.4, 1.4], true).find((t) => t.index === 0)!;
  assert.deepEqual([first.index, first.col, first.w], [0, 5, 8]);
});
