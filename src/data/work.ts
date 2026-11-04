// Every project on /work/, the case studies and the home page's featured work.
// The content lives in src/content/projects/ and is edited in Pages CMS; this file only
// shapes it for the pages. Anything missing is marked [TBC: ...] in the content itself.
import type { ImageMetadata } from 'astro';
import { getCollection } from 'astro:content';

export const filters = [
  ['all', 'All'],
  ['brand', 'Brand identity'],
  ['data', 'Data visualisation'],
  ['motion', '3D and motion'],
  ['archive', 'Archive: student work'],
] as const;
export type Filter = (typeof filters)[number][0];
// The home page's own filters (Josh, 28 Oct). A project without a Home page filter in the CMS follows its Work page filter.
export const homeFilters = ['Branding', 'Data Visualisation', 'Social Media'] as const;
export type HomeFilter = (typeof homeFilters)[number];
const homeFromWork: Partial<Record<string, HomeFilter>> = { 'Brand identity': 'Branding', 'Data visualisation': 'Data Visualisation' };
const filterKey: Record<string, Filter> = { 'Brand identity': 'brand', 'Data visualisation': 'data', '3D and motion': 'motion' };

export interface Plate { image: ImageMetadata; alt: string; medium: string; }
export interface Row { kind: 'full' | 'pair' | 'trio' | 'quad'; plates: Plate[]; }
/** A run of rows under one optional heading and paragraph (Katseye-style chapters, Josh 4 Nov). */
export interface Chapter { heading?: string; text: string[]; rows: Row[]; }
export interface Project {
  slug: string; title: string; client: string; year: number;
  disciplines: string[]; summary: string; tags: Filter[];
  image: ImageMetadata; alt: string; medium: string; position?: string;
  /** Card thumbnail: the whole work on warm black. Falls back to the cover. */
  thumb?: ImageMetadata;
  /** Kingston School of Art work: shown only under Archive, labelled as student work. */
  student?: boolean;
  /** The small label on the card: Student Work, or the project's own label, e.g. Concept. */
  label?: string;
  /** Pages of a magazine the card opens on the Work page, cover first. */
  magazine: { image: ImageMetadata; alt: string }[];
  /** true when /work/<slug>/ exists */
  caseStudy?: boolean;
  featured: boolean; featuredOrder?: number; homePosition?: string;
  /** One result line, shown on the home page card. */
  outcome?: string;
  /** The home page filter it shows under; empty for none (it still shows under All). */
  homeFilter?: HomeFilter;
  homeCharts: (Plate & { title: string })[];
}
export interface CaseStudy {
  slug: string;
  outcome: string;
  problem: string[];
  did: string[];
  chapters: Chapter[];
  before?: { before: Plate; after: Plate };
  happened: string[];
  next: string;
  demo?: { href: string; label: string };
}

const kinds: Record<string, Row['kind']> = { 'One large': 'full', 'Two side by side': 'pair', 'Three in a row': 'trio', 'Four in a grid': 'quad' };
const paragraphs = (s: string) => s.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean);
const plate = (p: { src: ImageMetadata; alt: string; caption: string }): Plate => ({ image: p.src, alt: p.alt, medium: p.caption });

const entries = (await getCollection('projects'))
  .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999) || a.data.title.localeCompare(b.data.title));

export const projects: Project[] = entries.map(({ data: d }) => ({
  slug: d.slug, title: d.title, client: d.client, year: d.year,
  disciplines: d.disciplines, summary: d.summary,
  tags: d.studentWork ? ['archive'] : d.filters.map((f) => filterKey[f]),
  image: d.cover.src, alt: d.cover.alt, medium: d.cover.caption, position: d.coverFocus ?? undefined, thumb: d.thumb ?? undefined,
  student: d.studentWork || undefined,
  label: d.studentWork ? 'Student Work' : d.label || undefined,
  caseStudy: d.hasPage || undefined,
  magazine: d.magazine.map((m) => ({ image: m.src, alt: m.alt })),
  featured: d.featured, featuredOrder: d.featuredOrder ?? undefined, homePosition: d.homeFocus ?? undefined,
  outcome: d.outcome || undefined,
  homeFilter: d.homeFilter ?? d.filters.map((f) => homeFromWork[f]).find(Boolean),
  homeCharts: d.homeCharts.map((c) => ({ image: c.src, alt: c.alt, title: c.title, medium: c.caption })),
}));

export const bySlug = (slug: string) => {
  const p = projects.find((x) => x.slug === slug);
  if (!p) throw new Error(`No project with the web address "${slug}"`);
  return p;
};

export const caseStudies: CaseStudy[] = entries.filter((e) => e.data.hasPage).map(({ data: d }) => ({
  slug: d.slug,
  outcome: d.outcome,
  problem: paragraphs(d.problem),
  did: paragraphs(d.whatIDid),
  // A row with a heading opens a new chapter; rows without one join the chapter above.
  chapters: d.gallery.reduce<Chapter[]>((all, r) => {
    const row = { kind: kinds[r.layout], plates: r.images.map(plate) };
    if (r.heading || all.length === 0) all.push({ heading: r.heading || undefined, text: paragraphs(r.text ?? ''), rows: [] });
    all[all.length - 1].rows.push(row);
    return all;
  }, []),
  before: d.before && d.after ? { before: plate(d.before), after: plate(d.after) } : undefined,
  happened: paragraphs(d.whatHappened),
  // Without a chosen next project, link to the next case study in Work page order.
  next: d.next ?? '',
  demo: d.demoLink ? { href: d.demoLink, label: d.demoButton || 'See the Live Demo' } : undefined,
})).map((cs, i, all) => ({ ...cs, next: cs.next || all[(i + 1) % all.length].slug }));

/** The home page's featured work, in position order (ties broken by title). */
export const featured = projects
  .filter((p) => p.featured)
  .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99) || a.title.localeCompare(b.title));

/** Where a project card links: its own page, or the Work page when it has none yet. */
// A magazine opens where it is on the Work page; see Magazine.astro.
export const projectHref = (p: Project) => (p.caseStudy ? `/work/${p.slug}/` : p.magazine.length ? `/work/#read-${p.slug}` : '/work/');
