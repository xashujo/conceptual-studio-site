// Every project on /work/, and the two case studies. Facts come from the Framer site
// (CURRENT WEBSITE/) and brief section 3; anything missing is marked [TBC: ...].
import type { ImageMetadata } from 'astro';

import nccSi02 from '../assets/work/new-city-college-strategic-intent/02.webp';
import nccSi03 from '../assets/work/new-city-college-strategic-intent/03.webp';
import nccSi04 from '../assets/work/new-city-college-strategic-intent/04.webp';
import nccSi05 from '../assets/work/new-city-college-strategic-intent/05.webp';
import nccSi06 from '../assets/work/new-city-college-strategic-intent/06.webp';
import nccSi07 from '../assets/work/new-city-college-strategic-intent/07.webp';
import nccSi08 from '../assets/work/new-city-college-strategic-intent/08.webp';
import ose01 from '../assets/work/oxford-school-of-english/01.webp';
import oseOldSign from '../assets/work/oxford-school-of-english/02.webp';
import ose04 from '../assets/work/oxford-school-of-english/04.webp';
import ose05 from '../assets/work/oxford-school-of-english/05.webp';
import ose06 from '../assets/work/oxford-school-of-english/06.webp';
import ose07 from '../assets/work/oxford-school-of-english/07.webp';
import ose10 from '../assets/work/oxford-school-of-english/10.webp';
import oseShelter from '../assets/work/oxford-school-of-english/bus-shelter.webp';
import oseSign from '../assets/work/oxford-school-of-english/sign.webp';
import acl from '../assets/work/acl-essex-infographics/03.webp';
import nccInf from '../assets/work/new-city-college-infographics/02.webp';
import fou from '../assets/work/fou-answer/01.webp';
import nygg from '../assets/work/new-york-general-group/01.webp';
import pandora from '../assets/work/sherman-poon-pandora-forever/06.webp';
import kut from '../assets/work/kut-magazine/04.webp';
import fmp from '../assets/work/exploring-mental-health-through-3d-storytelling/02.webp';
import detached from '../assets/work/detached/02.webp';
import rebirth from '../assets/work/rebirth/01.webp';
import otherSide from '../assets/work/the-other-side/01.webp';

export const filters = [
  ['all', 'All'],
  ['brand', 'Brand identity'],
  ['data', 'Data visualisation'],
  ['motion', '3D and motion'],
  ['archive', 'Archive: student work'],
] as const;
export type Filter = (typeof filters)[number][0];

export interface Project {
  slug: string; title: string; client: string; year: number;
  disciplines: string[]; summary: string; tags: Filter[];
  image: ImageMetadata; alt: string; medium: string; position?: string;
  /** Kingston School of Art work: shown only under Archive, labelled as student work. */
  student?: boolean;
  /** true when /work/<slug>/ exists */
  caseStudy?: boolean;
}

export const projects: Project[] = [
  { slug: 'new-city-college-strategic-intent', title: 'Strategic Intent', client: 'New City College London', year: 2025,
    disciplines: ['Data visualisation', 'Graphic design'], tags: ['data'], caseStudy: true,
    summary: "Infographics for the college's strategic intent briefing, used in its executive merger communications.",
    image: nccSi02, alt: 'Black map of east London boroughs showing the colleges that merged to form New City College, with a timeline from 1990 to 2024',
    medium: 'Map and timeline of the college mergers, 1990 to 2024', position: '0% 50%' },
  { slug: 'oxford-school-of-english', title: 'Oxford School of English', client: 'Oxford School of English', year: 2023,
    disciplines: ['Visual identity', 'Branding'], tags: ['brand'], caseStudy: true,
    summary: 'A new identity for a private English school in Oxford, now a UK-registered trademark.',
    image: oseShelter, alt: 'Oxford School of English poster in a bus shelter on an Oxford street, beside a red double-decker bus',
    medium: 'Visual identity, on a bus shelter poster', position: '50% 46%' },
  { slug: 'acl-essex-infographics', title: 'Learner data', client: 'ACL Essex', year: 2025,
    disciplines: ['Data visualisation', 'Graphic design'], tags: ['data'],
    summary: 'Infographics and regional maps of learner data across seven delivery centres.',
    image: acl, alt: 'Heat map of Essex showing ACL enrolments by local authority in 2024, in five shades of blue',
    medium: 'Heat map of enrolments by local authority, 2024' },
  { slug: 'fou-answer', title: 'Fou Answer', client: 'Fou Answer, Tokyo', year: 2025,
    disciplines: ['Branding', 'UX and UI', '3D'], tags: ['brand', 'motion'],
    summary: 'Brand, product and 3D design for a tech startup in Tokyo, where I was design lead.',
    image: fou, alt: 'Fou Answer eye symbol drawn in black pixels over rows of binary digits',
    medium: 'Brand symbol' },
  { slug: 'new-york-general-group', title: 'Internal video', client: 'New York General Group', year: 2025,
    disciplines: ['CGI', '3D animation'], tags: ['motion'],
    summary: 'A 30-second animation for internal briefings.',
    image: nygg, alt: 'NYGG lettering in white on a black starfield',
    medium: 'Title frame from the video' },
  { slug: 'new-city-college-infographics', title: 'BSix merger', client: 'New City College London', year: 2024,
    disciplines: ['Data visualisation', 'Graphic design'], tags: ['data'],
    summary: 'Infographics for the merger of BSix Sixth Form College into New City College.',
    image: nccInf, alt: 'Map of London boroughs marking the BSix and New City College campuses',
    medium: 'Campus map, BSix and New City College', position: '50% 30%' },
  { slug: 'sherman-poon-pandora-forever', title: 'Pandora Forever', client: 'Sherman Poon', year: 2023,
    disciplines: ['CGI', '3D animation'], tags: ['motion'],
    summary: "CGI worlds for Sherman Poon's music video, shown on billboards including Times Square in Hong Kong.",
    image: pandora, alt: 'Sherman Poon waving in front of the video on the Times Square screen in Hong Kong',
    medium: 'CGI, on the Times Square screen, Hong Kong', position: '50% 42%' },

  // Archive: student work from Kingston School of Art (brief 6.2).
  { slug: 'kut-magazine', title: 'KUT Magazine', client: 'Kingston School of Art', year: 2023, student: true,
    disciplines: ['Visual identity', 'Art direction', 'Photography'], tags: ['archive'],
    summary: 'An arts magazine on emerging creatives: identity, interviews, layout and print.',
    image: kut, alt: 'KUT Magazine spread', medium: 'Student work. Magazine' },
  { slug: 'exploring-mental-health-through-3d-storytelling', title: 'Exploring Mental Health Through 3D Storytelling', client: 'Kingston School of Art', year: 2023, student: true,
    disciplines: ['3D animation', 'Video editing', 'Art direction'], tags: ['archive'],
    summary: 'Final major project for my BA (Hons), on mental health.',
    image: fmp, alt: 'A chrome figure holding its head, standing before a large red disc in a dark room',
    medium: 'Student work. Still from the film' },
  { slug: 'detached', title: 'Detached', client: 'Kingston School of Art', year: 2022, student: true,
    disciplines: ['3D modelling', 'Art direction'], tags: ['archive'],
    summary: 'Two figures, one glass and one metal, drifting in a violet void.',
    image: detached, alt: 'Two transparent figures floating on a violet and orange background',
    medium: 'Student work. 3D render' },
  { slug: 'rebirth', title: 'Rebirth', client: 'Kingston School of Art', year: 2022, student: true,
    disciplines: ['3D modelling', 'Art direction'], tags: ['archive'],
    summary: 'A glass hand reaching for a star.',
    image: rebirth, alt: 'A translucent glass hand reaching up towards a bright star in purple haze',
    medium: 'Student work. 3D render' },
  { slug: 'the-other-side', title: 'The Other Side', client: 'Kingston School of Art', year: 2021, student: true,
    disciplines: ['3D modelling', 'Art direction'], tags: ['archive'],
    summary: 'My first work in Blender: chrome forms over liquid.',
    image: otherSide, alt: 'Floating chrome shapes above a pink liquid surface',
    medium: 'Student work. 3D render' },
];

// ---------- Case studies (brief 6.3) ----------

export interface Plate { image: ImageMetadata; alt: string; medium: string; }
export interface Row { kind: 'full' | 'pair' | 'trio' | 'quad'; plates: Plate[]; }
export interface CaseStudy {
  slug: string;
  outcome: string;
  problem: string[];
  did: string[];
  rows: Row[];
  before?: { before: Plate; after: Plate };
  happened: string[];
  next: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'new-city-college-strategic-intent',
    outcome: 'Used in the college\'s executive merger communications.',
    problem: [
      'New City College needed a strategic intent briefing that senior leaders and institutional stakeholders could read quickly. The material was policy-heavy and the data behind it was complex: demographic forecasts for its boroughs, student numbers split by age, level and support need, and growth across employment sectors.',
      'The college has also grown through a long run of mergers, and the briefing needed to show where it came from. [TBC: the brief in NCC\'s own words, if you have it]',
    ],
    did: [
      'I sorted the data first, then built one visual language for the whole suite, so a forecast, a sector chart and a set of student splits all read as parts of one document.',
      'For the history I drew a map and timeline of the college mergers from 1990 to 2024, setting each merger on the borough where it happened. Student numbers by level became a set of matching pie charts with the totals printed beside them, so each group can be compared at a glance.',
      '[TBC: a decision or trade-off you made, for example a chart type you ruled out or data you left out]',
    ],
    rows: [
      { kind: 'pair', plates: [
        { image: nccSi03, alt: 'Bar chart of borough populations from 2024 to 2030, with a line for total population', medium: 'Demographic forecast, 2024 to 2030' },
        { image: nccSi04, alt: 'Bar chart of minimum growth rate across seven employment sectors', medium: 'Key employment growth by sector' },
      ] },
      { kind: 'quad', plates: [
        { image: nccSi05, alt: 'Pie chart of 10,404 students aged 16 to 18 by level, 2024/25', medium: 'Students aged 16 to 18 by level, 2024/25' },
        { image: nccSi06, alt: 'Pie chart of 655 discrete SEND students aged 16 to 24 by level, 2024/25', medium: 'Discrete SEND students aged 16 to 24 by level, 2024/25' },
        { image: nccSi07, alt: 'Pie chart of 500 mainstream SEND students aged 16 to 24 by level, 2024/25', medium: 'Mainstream SEND students aged 16 to 24 by level, 2024/25' },
        { image: nccSi08, alt: 'Pie chart of 8,900 adult students by level, 2024/25', medium: 'Adult students by level, 2024/25' },
      ] },
    ],
    happened: [
      'The infographics were used in the college\'s executive merger communications.',
      '[TBC: anything else that followed, for example where the briefing was published or who it went to]',
    ],
    next: 'oxford-school-of-english',
  },
  {
    slug: 'oxford-school-of-english',
    outcome: 'Now a UK-registered trademark.',
    problem: [
      'The Oxford School of English teaches English to students from abroad, and wanted to win more of them. Its old logo had no clear structure, said little to an international market, and copied the Oxford Dictionary logo.',
      'The school wanted to look modern and prestigious without losing its historic roots.',
    ],
    did: [
      'This was a solo project: logo, type and colour.',
      'I put an English lion inside a shield, after the traditional English crest. It nods to the England football crest and the house crests in the Harry Potter films, both of which students from abroad are likely to know.',
      'The two colours, Oxford Gold and Oxford White, come from the stone of the city\'s buildings. The type pairs a classic serif with a modern sans to keep the prestige without looking dated.',
      '[TBC: a decision or trade-off you made, for example a direction the school turned down]',
    ],
    rows: [
      { kind: 'full', plates: [
        { image: ose10, alt: 'Oxford School of English poster with a photograph of an Oxford college, in a station frame', medium: 'Poster in a station' },
      ] },
      { kind: 'pair', plates: [
        { image: ose06, alt: 'Two gold Oxford School of English lanyards with student ID cards', medium: 'Student lanyards and ID cards' },
        { image: ose07, alt: 'The lion shield beside a black football kit with the crest on the chest', medium: 'Crest and kit' },
      ] },
      { kind: 'trio', plates: [
        { image: ose01, alt: 'Lion shield beside the word Oxford and School of English, in black on gold', medium: 'Primary logo' },
        { image: ose04, alt: 'Lion shield above the Oxford wordmark, in black on gold', medium: 'Stacked logo' },
        { image: ose05, alt: 'Lion shield beside the letters OSE, in black on gold', medium: 'Short logo' },
      ] },
    ],
    before: {
      before: { image: oseOldSign, alt: 'The school\'s shopfront with its old sign above the door', medium: 'Before: the old sign on the shopfront' },
      after: { image: oseSign, alt: 'A square gold sign with the lion shield and Oxford wordmark on a white wall', medium: 'After: the new sign' },
    },
    happened: [
      'The new identity is now a UK-registered trademark.',
      '[TBC: anything else that followed, for example enquiries from abroad or where the identity has been used]',
    ],
    next: 'new-city-college-strategic-intent',
  },
];

export const bySlug = (slug: string) => projects.find((p) => p.slug === slug)!;
