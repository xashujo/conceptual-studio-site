// Facts shown on more than one page. Sources are noted; anything unconfirmed is [TBC].
export const email = 'joshuamcdonald099@gmail.com'; // Framer /contact (DECISIONS: TBC if a studio address replaces it)
export const startHref = `mailto:${email}?subject=New%20project`; // shortcut: email until the enquiry form exists
export const replyTime = 'I reply within three working days.'; // DECISIONS, Josh
export const hours = 'I answer email on weekdays, 9:00 to 17:00 London time.'; // Framer /contact

export const social = [
  { label: 'Instagram', href: 'https://www.instagram.com/conceptual.pdf/' }, // Framer /contact
  { label: 'TikTok', href: 'https://www.tiktok.com/@conceptual.studio' }, // Josh
  { label: 'LinkedIn', href: 'https://uk.linkedin.com/in/joshua-mcdonald-9268a2260' }, // Framer /contact
];

export const company = {
  name: 'Conceptual Studio Limited',
  registeredIn: 'England and Wales',
  number: '15410582', // Companies House, checked 26 Oct 2026
  office: '[TBC: registered office address]', // the law asks for it; Josh to decide which address
};

export const nav = [
  { label: 'Work', href: '/work/' },
  { label: 'Services', href: '/services/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];

// The six clients brief section 3 says can be named (same list as the home prototypes).
export const clients = ['New City College London', 'Southbank College Group', 'ACL Essex', 'Oxford School of English', 'Fou Answer, Tokyo', 'New York General Group'];

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
  },
};
