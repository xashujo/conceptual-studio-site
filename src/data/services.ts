// The services and their pricing ladders (brief 6.4, copy/pricing.md draft 3).
// Prices are [TBC] until Josh confirms them. Times are calendar time, first call to final files.
export interface Tier { id: string; name: string; price: string; time?: string; included: string; note?: string }
export interface Service { id: string; name: string; href?: string; line: string; tiers: Tier[] }

const tbc = 'From £[TBC]';

export const services: Service[] = [
  {
    id: 'brand',
    name: 'Brand identity',
    href: '/services/brand-identity/',
    line: 'A logo, colours, type, mockups and the rules for using them, so your own team can make new material without coming back to me every time.',
    tiers: [
      { id: 'essentials', name: 'Logo and essentials', price: tbc, time: 'from 4 weeks', included: 'A logo, colour palette and typefaces, a one-page sheet on how to use them, and mockups showing the identity in use.' },
      { id: 'full', name: 'Full identity', price: tbc, time: 'from 8 weeks', included: 'Everything in Logo and essentials, plus a brand guidelines document and templates your team can use, such as social posts, letterheads and presentations.', note: '[TBC: how many templates are included]' },
      { id: 'rollout', name: 'Identity and rollout', price: tbc, time: 'from 12 weeks', included: 'A full identity applied across the things people actually see, such as signage, prospectuses and campaigns, with print handled through my print partners.', note: 'Quoted per project.' },
    ],
  },
  {
    id: 'data',
    name: 'Data visualisation and reports',
    href: '/services/data-visualisation/',
    line: 'Charts, maps and infographics, and the reports they sit in, from annual reports to sustainability reports, drawn from your own figures.',
    tiers: [
      { id: 'charts', name: 'Charts and infographics', price: tbc, time: 'from 1 week', included: 'The charts your document needs, built from your own figures and supplied as PNG and PDF, ready to drop into your own layout.' },
      { id: 'report', name: 'Charts and full report', price: tbc, time: 'from 2 weeks', included: 'The charts plus the whole report designed around them, such as an annual, strategy or sustainability report. Supplied as print-ready PDFs for coated and uncoated paper, an accessible PDF and PNGs.', note: 'Priced for a report of around 16 pages; longer reports are quoted.' },
      { id: 'maps', name: 'Maps and recurring reports', price: tbc, time: 'from 4 weeks', included: 'Custom data maps, like the London borough heat maps, or a report designed as a template you can reuse each year.', note: 'Quoted per project. [TBC: how long the heat maps took]' },
    ],
  },
  {
    id: 'social',
    name: 'Social media editing',
    line: 'Short videos cut from your footage, with captions and versions sized for each platform. Single edits, monthly packs or a monthly retainer.',
    tiers: [
      { id: 'single', name: 'Single edit', price: tbc, time: 'from 3 days', included: 'One short video cut from your footage, with captions and versions sized for each platform, and one round of changes.' },
      { id: 'pack', name: 'Monthly pack', price: 'From £[TBC] a month', included: 'Eight short edits a month, planned together so they look like a set.' },
      { id: 'retainer', name: 'Monthly retainer', price: 'From £[TBC] a month', included: 'Twelve edits a month, about three a week, at a fixed monthly price. Three-month minimum.' },
    ],
  },
];

export const custom: Tier = {
  id: 'custom',
  name: 'Custom',
  price: 'Fixed quote',
  time: 'within three working days',
  included: "Need something that isn't listed here, or a mix of services? Tell me what you need, your deadline and your budget if you have one.",
};

export const serviceById = (id: string) => services.find((s) => s.id === id)!;

// Budget bands from brief 11, matching college quote bands.
export const budgets = ['Under £5,000', '£5,000 to £10,000', '£10,000 to £25,000', '£25,000 to £50,000', 'Over £50,000', 'Not sure yet'];
