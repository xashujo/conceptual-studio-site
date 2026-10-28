// Facts shown on more than one page. Sources are noted; anything unconfirmed is [TBC].
// Email, reply time, social links, company details and the client list are edited in Pages CMS
// (Site settings and Clients); they're read here so every page uses the same values.
import { getCollection, getEntry } from 'astro:content';

const settings = (await getEntry('settings', 'site'))!.data;
/** The home page's own words, from Pages CMS (Home page). "{reply time}" in a value becomes the Reply time setting. */
export const home = (await getEntry('home', 'home'))!.data;

export const email = settings.email;
export const startHref = `mailto:${email}?subject=New%20project`; // shortcut: email until the enquiry form exists
export const quoteHref = `mailto:${email}?subject=Custom%20quote`;
export const replyTime = `I reply ${settings.responseTime}.`;
export const responseTime = settings.responseTime;
export const nextSteps = settings.nextSteps.replaceAll('{reply time}', settings.responseTime);
export const hours = 'I answer email on weekdays, 9:00 to 17:00 London time.'; // Framer /contact
export const availability = { on: settings.availability, text: settings.availabilityText };

// The glass dials, as CSS variables for <html> (1 = as designed). Read by components.css and the glass scripts.
const g = settings.glass;
export const glassStyle = `--g-bend:${g.bend / 100};--g-frost:${g.frost / 100};--g-blur:${g.blur / 100};--g-shine:${g.shine / 100};--g-reach:${g.reach / 100}`;

export const social = settings.socialLinks.map((l) => ({ label: l.label, href: l.url }));

export const company = {
  name: settings.companyName,
  registeredIn: 'England and Wales',
  number: settings.companyNumber ?? '[TBC]',
  office: '[TBC: registered office address]', // the law asks for it; Josh to decide which address
};

export const nav = [
  { label: 'Work', href: '/work/' },
  { label: 'Services', href: '/services/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];

// Clients ticked "Show in Worked with" in Pages CMS, in their set order, education first.
const shown = (await getCollection('clients', (c) => c.data.trustedBy))
  .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99) || a.data.name.localeCompare(b.data.name));
export const clients = shown.map((c) => c.data.name);
// Clients ticked "Show in Trusted By" in Pages CMS, in their set order, for the home page's line.
export const trustedBy = (await getCollection('clients', (c) => c.data.homeTrusted))
  .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99) || a.data.name.localeCompare(b.data.name))
  .map((c) => c.data.name);
export const clientGroups = (['Education', 'Companies and international'] as const)
  .map((kind) => ({ kind, names: shown.filter((c) => (c.data.group ?? 'Companies and international') === kind).map((c) => c.data.name) }))
  .filter((g) => g.names.length);

// The quote shown on the home page (ticked "Show on the home page" in Testimonials).
export const homeQuote = (await getCollection('testimonials', (t) => t.data.onHomePage))[0]?.data;
export const heroQuote = (await getCollection('testimonials', (t) => t.data.inHero))[0]?.data;

// Every artwork on the site, with the credit the colophon and the plate captions use.
export const art = {
  hunt: {
    title: 'La Chasse Chinoise (The Chinese Hunt), after François Boucher, after 1743',
    medium: 'Etching and engraving by Gabriel and Jacques Gabriel Huquier. The Met 53.600.1009, public domain. Duotoned',
  },
  jardin: {
    title: 'Le Jardin Chinois (The Chinese Garden), after François Boucher, after 1743',
    medium: 'Etching and engraving by Jacques Gabriel Huquier. The Met 53.600.1008, public domain. Duotoned',
  },
  kew: {
    title: 'View of the Wilderness at Kew, William Marlow, 1763',
    medium: 'Watercolour, for Sir William Chambers. The Met 25.19.43, public domain. Toned for night',
  },
  ranelagh: {
    title: 'The Chinese Building and Rotunda, Ranelagh Gardens, Chelsea, 1752',
    medium: 'Hand-coloured etching by Charles Grignion after Canaletto. Rijksmuseum RP-P-1932-457, public domain. Toned for night',
  },
  garden: {
    title: 'Le Jardin Chinois (The Chinese Garden), François Boucher, 1742',
    medium: 'Oil on canvas, Musée des Beaux-Arts et d’Archéologie, Besançon. Public domain. Engraved and toned in gold. [TBC: where the scan came from]',
  },  peche: {
    title: 'La Pêche Chinoise (The Chinese Fishing Party), François Boucher, 1742',
    medium: 'Oil on canvas, Musée des Beaux-Arts et d’Archéologie, Besançon. Public domain. Toned in gold. [TBC: where the scan came from]',
  },
  apotheosis: {
    title: 'The Apotheosis of Hercules, François Lemoyne, 1731–1736',
    medium: 'Ceiling painting, Salon d’Hercule, Château de Versailles. Public domain. Toned in gold. [TBC: where the scan came from]',
  },
};
