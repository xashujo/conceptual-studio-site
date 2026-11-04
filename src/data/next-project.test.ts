// Run: node --experimental-strip-types src/data/next-project.test.ts
import assert from 'node:assert/strict';
import { nextChain } from './next-project.ts';

const p = (slug: string, filter: string, client: string, ...disciplines: string[]) => ({ slug, filters: [filter], client, disciplines });
const items = [
  p('ncc-intent', 'data', 'NCC', 'Data visualisation', 'Graphic design'),
  p('doubleshot', 'brand', 'DoubleShot', 'Visual identity', 'Branding'),
  p('ncc-report', 'data', 'NCC', 'Data visualisation', 'Report design'),
  p('oxford', 'brand', 'Oxford', 'Visual identity', 'Branding'),
  p('cmd', 'brand', 'CMD', 'Visual identity', 'Branding', 'Motion'),
  p('freeport', 'data', 'USP', 'Data visualisation', 'Infographics'),
  p('finder', 'data', 'Concept', 'Data visualisation'),
];
const next = nextChain(items);

// One loop through everything: start anywhere, and every project comes up exactly once.
for (const start of items.map((i) => i.slug)) {
  const seen = new Set<string>();
  for (let s = start; !seen.has(s); s = next[s]) seen.add(s);
  assert.equal(seen.size, items.length, `from ${start}`);
}
// Never links to itself; related work comes first.
for (const [a, b] of Object.entries(next)) assert.notEqual(a, b);
assert.equal(next['ncc-intent'], 'ncc-report');
assert.equal(next['ncc-report'], 'freeport');
assert.equal(next['doubleshot'], 'oxford');
assert.deepEqual(nextChain([items[0]]), {});
console.log('next-project: ok', next);
