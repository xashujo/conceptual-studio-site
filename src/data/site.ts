// Site-wide facts. Wording from copy/home.md and DECISIONS.md.
export const email = 'joshuamcdonald099@gmail.com'; // TBC: a studio address instead (DECISIONS)
export const startHref = `mailto:${email}?subject=New%20project`; // shortcut: no /contact/ page yet, point it there once built
export const quoteHref = `mailto:${email}?subject=Custom%20quote`;
export const sentence = 'Conceptual Studio is my design practice in London. Most of my work is in education. I also design for companies and edit video for social media.';
// The six clients brief section 3 says can be named, education first.
export const clientGroups = [
  { kind: 'Education', names: ['New City College London', 'Southbank College Group', 'ACL Essex', 'Oxford School of English'] },
  { kind: 'Companies and international', names: ['Fou Answer, Tokyo', 'New York General Group'] },
];
export const clients = clientGroups.flatMap((g) => g.names);
