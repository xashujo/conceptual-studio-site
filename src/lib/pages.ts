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
const load = async <C extends 'workPage' | 'caseStudyPage' | 'servicesPage' | 'aboutPage' | 'contactPage' | 'procurementPage'>(c: C, id: string) =>
  fill((await getEntry(c, id))!.data);

export const workPage = await load('workPage', 'work');
export const caseStudyPage = await load('caseStudyPage', 'case-study');
export const servicesPage = await load('servicesPage', 'services');
export const aboutPage = await load('aboutPage', 'about');
export const contactPage = await load('contactPage', 'contact');
export const procurementPage = await load('procurementPage', 'procurement');

/** Paragraphs from a CMS text field: an empty line between them. */
export const paras = (s: string) => s.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean);

// Title Case for headings, buttons and labels (Josh, 28 Oct), as on the home page: every word capitalised
// except the small ones, never the first or last; "and" becomes "&". Capitals already there are kept.
const small = new Set(['a', 'an', 'the', 'of', 'to', 'in', 'on', 'for', 'at', 'by', 'or', 'but', 'with', 'as']);
export const titleCase = (s: string) => s.replace(/\band\b/gi, '&').split(' ')
  .map((w, i, all) => (i > 0 && i < all.length - 1 && small.has(w.toLowerCase()) ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1)))
  .join(' ');
