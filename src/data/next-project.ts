// The "Next project" chain at the foot of each case study.
// Every case study links to one other, and following the links visits every case study once
// before coming back to the first, so nobody gets stuck looping between two projects.
// Each step goes to the most related project not yet in the chain: same Work page filter first,
// then same client, then shared disciplines. Ties go to Work page order.

export interface Linkable { slug: string; filters: string[]; client: string; disciplines: string[]; }

export const relatedness = (a: Linkable, b: Linkable) =>
  a.filters.filter((f) => b.filters.includes(f)).length * 3 +
  (a.client === b.client ? 2 : 0) +
  a.disciplines.filter((d) => b.disciplines.includes(d)).length;

/** Maps each slug to the next one. `items` must be in Work page order. */
export function nextChain(items: Linkable[]): Record<string, string> {
  if (items.length < 2) return {};
  const left = items.slice(1);
  const order = [items[0]];
  while (left.length) {
    const here = order[order.length - 1];
    let best = 0;
    left.forEach((p, i) => { if (relatedness(here, p) > relatedness(here, left[best])) best = i; });
    order.push(...left.splice(best, 1));
  }
  return Object.fromEntries(order.map((p, i) => [p.slug, order[(i + 1) % order.length].slug]));
}
