// The services and their pricing ladders (brief 6.4). The content lives in src/content/services/
// and is edited in Pages CMS; this file only shapes it for the pages.
// Times are calendar time, first call to final files.
import { getCollection } from 'astro:content';

export interface Tier { id: string; name: string; price: string; time?: string; included: string; note?: string; lead?: string; badge?: string; button?: string; monthly: boolean; onHome: boolean }
import type { ImageMetadata } from 'astro';
export interface Service {
  id: string; name: string; href?: string; card: boolean; line: string; tiers: Tier[];
  /** The lane it sits in on /services/ (Video, Colleges & Data, Branding, Monthly) and its own page's words. */
  lane: string; kinds: string; faqs: { q: string; a: string }[];
  examples: { img: ImageMetadata; alt: string; pos?: string; title: string; medium: string }[];
  cardImage?: { img: ImageMetadata; alt: string; pos?: string };
  demo: { heading: string; text: string };
  home: { price: string; time?: string; link: string };
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const services: Service[] = (await getCollection('services'))
  .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99))
  .map(({ id, data: d }) => {
    const tiers = d.tiers.map((t) => ({
      id: slug(t.name), name: t.name, price: t.price, time: t.time ?? undefined, included: t.includes, note: t.note ?? undefined,
      lead: t.lead ?? undefined, badge: t.badge ?? undefined, button: t.button ?? undefined,
      monthly: t.monthly ?? false, onHome: t.onHome ?? false,
    }));
    return {
      id, name: d.name, href: d.page ?? undefined, card: d.card, line: d.summary, tiers,
      lane: d.lane || d.name, kinds: d.kinds, faqs: d.faqs.map((f) => ({ q: f.question, a: f.answer })),
      examples: d.examples.map((e) => ({ img: e.src, alt: e.alt, pos: e.focus ?? undefined, title: e.title, medium: e.caption })),
      cardImage: d.cardImage ? { img: d.cardImage.src, alt: d.cardImage.alt, pos: d.cardImage.focus ?? undefined } : undefined,
      demo: { heading: d.demoHeading, text: d.demoText },
      home: { price: d.homePrice || tiers[0].price, time: d.homeTime || tiers[0].time, link: d.homeLink || `${d.name} prices` },
    };
  });

export const custom: Tier = {
  id: 'custom',
  name: 'Custom',
  price: 'Fixed quote',
  time: 'within three working days',
  included: "Need something that isn't listed here, or a mix of services? Tell me what you need, your deadline and your budget if you have one.",
};

/** The services shown as full cards: those with a page of their own, plus any ticked "Show as a card". */
export const isLane = (s: Service) => (!!s.href && !s.href.includes('#')) || s.card;

export const serviceById = (id: string) => {
  const s = services.find((x) => x.id === id);
  if (!s) throw new Error(`No service file called "${id}" in src/content/services`);
  return s;
};

// Budget bands from brief 11, matching college quote bands.
export const budgets = ['Under £5,000', '£5,000 to £10,000', '£10,000 to £25,000', '£25,000 to £50,000', 'Over £50,000', 'Not sure yet'];
