// The other pages' words from Pages CMS (src/content/pages/*.yml), with "{reply time}" filled in
// from Site settings everywhere it appears.
import { getEntry } from 'astro:content';
import { responseTime } from './site';

const fill = <T>(v: T): T => {
  if (typeof v === 'string') return v.replaceAll('{reply time}', responseTime) as T;
  if (Array.isArray(v)) return v.map(fill) as T;
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fill(x)])) as T;
  return v;
};
const load = async <C extends 'workPage' | 'caseStudyPage' | 'servicesPage' | 'aboutPage' | 'contactPage' | 'procurementPage' | 'privacyPage' | 'accessibilityPage'>(c: C, id: string) =>
  fill((await getEntry(c, id))!.data);

export const workPage = await load('workPage', 'work');
export const caseStudyPage = await load('caseStudyPage', 'case-study');
export const servicesPage = await load('servicesPage', 'services');
export const aboutPage = await load('aboutPage', 'about');
export const contactPage = await load('contactPage', 'contact');
export const procurementPage = await load('procurementPage', 'procurement');
export const privacyPage = await load('privacyPage', 'privacy');
export const accessibilityPage = await load('accessibilityPage', 'accessibility');

/** Paragraphs from a CMS text field: an empty line between them. */
export const paras = (s: string) => s.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean);

// Title Case for headings, buttons and labels (Josh, 28 Oct; 5 Nov): every word capitalised except short
// prepositions and conjunctions, never the first or last; "The" is always capitalised ("Out in The World");
// "and" becomes "&". Capitals already there are kept, and a word with a capital inside ("iPhone") is left as it is.
// Both halves of a hyphenated word are capitalised; a word after a bracket or quote is too ("(Numbers Blurred)").
const small = new Set(['a', 'an', 'of', 'to', 'in', 'on', 'for', 'at', 'by', 'or', 'but', 'with', 'as', 'from']);
const cap = (p: string) => (/\p{Lu}/u.test(p.slice(1)) ? p : p.replace(/^(\P{L}*)(\p{Ll})/u, (_, lead, c) => lead + c.toUpperCase()));
export const titleCase = (s: string) => s.replace(/,?\s+and\b/gi, ' &').replace(/\band\b/gi, '&').split(' ')
  .map((w, i, all) => (i > 0 && i < all.length - 1 && small.has(w.toLowerCase()) ? w.toLowerCase() : w.split('-').map(cap).join('-')))
  .join(' ');
/** A one-line statement set as a heading: Title Case, without the closing full stop ("Inc." keeps its own). */
export const headline = (s: string) => titleCase(s).replace(/(?<!\b(?:Inc|Ltd|Co))\.$/, '');
// Large headings: a word joiner after a hyphen stops "In-House" breaking as "In- / House" (Josh, 4 Nov). It's invisible and zero-width.
export const keepHyphens = (s: string) => s.replace(/(\p{L})-(?=\p{L})/gu, '$1-\u2060');
