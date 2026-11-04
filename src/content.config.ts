// Content Josh edits in Pages CMS (brief section 10). Field names match .pages.yml exactly.
// The pages read this through src/data/work.ts, src/data/services.ts and src/lib/site.ts.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Pages CMS stores a reference as the other entry's file path; keep just its id (the file name).
const ref = z.string().transform((p) => p.split('/').pop()!.replace(/\.ya?ml$/, ''));
const yml = (folder: string) => glob({ pattern: '*.{yml,yaml}', base: `./src/content/${folder}` });
const text = z.string().nullish().transform((s) => s ?? '');

// The other pages' own words (Josh, 2 Nov): one file each in src/content/pages/, edited in Pages CMS.
// "{reply time}" in any of them becomes the Reply time from Site settings.
type Shape = z.ZodRawShape | ((h: { image: () => z.ZodTypeAny }) => z.ZodRawShape);
const page = (file: string, shape: Shape) => defineCollection({
  loader: glob({ pattern: `${file}.yml`, base: './src/content/pages' }),
  schema: (h) => z.object(typeof shape === 'function' ? shape(h) : shape),
});
// One picture of real work, so a page of words has something to look at (Josh, 4 Nov).
const picture = (image: () => z.ZodTypeAny) => z.object({ src: image(), alt: s, caption: text, focus: text }).nullish();
const s = z.string().min(1);
const items = z.array(z.object({ title: s, text: s }));
export const pages = {
  workPage: page('work', { heading: s, intro: s, archiveFilter: s, archiveNote: text, clientsHeading: s, closeText: s }),
  caseStudyPage: page('case-study', {
    backLabel: s, clientLabel: s, disciplinesLabel: s, outcomeLabel: s, problemHeading: s, didHeading: s, workHeading: s,
    beforeAfterHeading: s, happenedHeading: s, nextLabel: s, closeText: s,
  }),
  servicesPage: page('services', {
    heading: s, intro: s, note: s, quoteNote: text, listHeading: s, retainersHeading: s, retainersNote: text, howHeading: s,
    listNote: text, extrasHeading: text, firstStepLabel: s, terms: items, procurementHeading: s, procurementText: s, procurementButton: s, enquiryHeading: s,
    workHeading: s, pricesHeading: s, pricesNote: text, faqHeading: s, closeText: s, planEmailSubject: s, planEmail: s,
  }),
  aboutPage: page('about', ({ image }) => ({
    heading: s, intro: s, storyHeading: s, story: s, storyImage: picture(image), valuesHeading: s, values: items, clientsHeading: s,
    wantHeading: s, want: s, closeText: s,
  })),
  contactPage: page('contact', {
    heading: s, intro: s, hours: text, elsewhereHeading: s, procurementHeading: s, procurementText: s, procurementButton: s,
    enquiryHeading: s, formHeading: s, enquiryIntro: s, enquiryAlt: text, callLink: text, callButton: s, thanksHeading: s, thanksText: s, closeHeading: s, closeText: s,
    poLabel: s, poLimitLabel: s, poHelp: s,
  }),
  procurementPage: page('procurement', {
    heading: s, intro: s, orgHeading: s, org: items, detailsHeading: s, details: z.array(z.object({ label: s, value: s })), stepsHeading: s, steps: items,
    emailButton: s, emailSubject: s, closeText: s,
  }),
};

export const collections = {
  ...pages,
  projects: defineCollection({
    loader: yml('projects'),
    schema: ({ image }) => {
      // Alt text is required on every image (brief section 10).
      const pic = z.object({ src: image(), alt: z.string().min(1), caption: z.string().min(1) });
      return z.object({
        title: z.string(),
        slug: z.string().regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
        client: z.string(),
        year: z.number().int(),
        disciplines: z.array(z.string()).min(1),
        filters: z.array(z.enum(['Brand identity', 'Data visualisation', '3D and motion'])).nullish().transform((v) => v ?? []),
        studentWork: z.boolean().nullish().transform((v) => !!v),
        // A small label on the card, e.g. Concept (Josh, 4 Nov). Student work is always labelled Student Work.
        label: text,
        order: z.number().nullish(),
        summary: z.string(),
        cover: pic,
        thumb: image().nullish(),
        coverFocus: z.string().nullish(),
        featured: z.boolean().nullish().transform((v) => !!v),
        featuredOrder: z.number().nullish(),
        homeFilter: z.enum(['Branding', 'Data Visualisation', 'Social Media']).nullish(),
        homeFocus: z.string().nullish(),
        homeCharts: z.array(z.object({ src: image(), alt: z.string().min(1), title: z.string(), caption: z.string() })).nullish().transform((v) => v ?? []),
        // A printed piece shown as a page-turning magazine on the Work page (Josh, 4 Nov): every page in order, cover first.
        magazine: z.array(z.object({ src: image(), alt: z.string().min(1) })).nullish().transform((v) => v ?? []),
        hasPage: z.boolean().nullish().transform((v) => !!v),
        outcome: text,
        problem: text,
        whatIDid: text,
        whatHappened: text,
        gallery: z.array(z.object({
          layout: z.string().nullish(), // retired: each chapter's images are laid out as one bento
          heading: z.string().nullish(),
          text: z.string().nullish(),
          images: z.array(pic).min(1),
        })).nullish().transform((v) => v ?? []),
        before: pic.nullish(),
        after: pic.nullish(),
        // Outcomes bento (Josh, 4 Nov): the work out in the world, and short figures. Every figure must be real.
        outcomeImages: z.array(pic.extend({ video: z.string().nullish() })).nullish().transform((v) => v ?? []),
        stats: z.array(z.object({ value: z.string().min(1), label: z.string().min(1) })).nullish().transform((v) => v ?? []),
        // Optional moving title graphic at the top of the case study (Josh, 4 Nov: the CMD logo reveal).
        heroVideo: z.object({ video: z.string().min(1), poster: image(), alt: z.string().min(1) }).nullish(),
        demoLink: text,
        demoButton: text,
      });
    },
  }),
  services: defineCollection({
    loader: yml('services'),
    schema: ({ image }) => z.object({
      name: z.string(),
      order: z.number().nullish(),
      page: z.string().nullish(),
      // A service without its own page that still gets a full card, not a line in Also Available (Josh, 4 Nov).
      card: z.boolean().nullish().transform((v) => !!v),
      summary: z.string(),
      homePrice: z.string().nullish(),
      homeTime: z.string().nullish(),
      homeLink: z.string().nullish(),
      // The service's own page (Josh, 2 Nov): the kinds of work, real examples and questions.
      lane: text,
      kinds: text,
      examples: z.array(z.object({ src: image(), alt: z.string().min(1), focus: z.string().nullish(), title: z.string(), caption: z.string() })).nullish().transform((v) => v ?? []),
      // The picture at the top of the service's card on /services/ (Josh, 4 Nov).
      cardImage: z.object({ src: image(), alt: z.string().min(1), focus: z.string().nullish() }).nullish(),
      faqs: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })).nullish().transform((v) => v ?? []),
      demoHeading: text,
      demoText: text,
      tiers: z.array(z.object({
        name: z.string(),
        price: z.string(),
        time: z.string().nullish(),
        includes: z.string(),
        note: z.string().nullish(),
        lead: z.string().nullish(),
        badge: z.string().nullish(),
        button: z.string().nullish(),
        monthly: z.boolean().nullish(),
        onHome: z.boolean().nullish(),
      })).min(1),
    }),
  }),
  testimonials: defineCollection({
    loader: yml('testimonials'),
    schema: z.object({
      quote: z.string(), name: z.string(), role: z.string().nullish(), organisation: z.string(),
      onHomePage: z.boolean().nullish().transform((v) => !!v),
      // The case study this was said about; it then shows in that project's Outcomes.
      project: ref.nullish(),
    }),
  }),
  clients: defineCollection({
    loader: yml('clients'),
    schema: ({ image }) => z.object({
      name: z.string(),
      logo: image().nullish(),
      logoLabel: z.string().nullish(),
      trustedBy: z.boolean().nullish().transform((v) => !!v),
      homeTrusted: z.boolean().nullish().transform((v) => !!v),
      group: z.enum(['Education', 'Companies and international']).nullish(),
      order: z.number().nullish(),
    }),
  }),
  // The home page's own words (Josh, 28 Oct): one file, src/content/home/home.yml.
  home: defineCollection({
    loader: yml('home'),
    schema: ({ image }) => z.object({
      headline: z.string().min(1),
      intro: z.string().min(1),
      startButton: z.string().min(1),
      workButton: z.string().min(1),
      trustedByLabel: z.string().min(1),
      stats: z.array(z.object({ number: z.number(), after: z.string().nullish().transform((s) => s ?? ''), label: z.string().min(1) })),
      workHeading: z.string().min(1),
      allProjects: z.string().min(1),
      // Vertical videos under the Social Media filter; the file path is under public/ (Pages CMS: Short videos).
      socialVideos: z.array(z.object({ title: z.string().min(1), year: z.number().int(), video: z.string().min(1), poster: image(), alt: z.string().min(1) }))
        .nullish().transform((v) => v ?? []),
      // Why Clients Choose Us (Josh, 2 Nov): what's distinctive about the studio, between the clients and the proof.
      approach: z.array(z.object({ title: z.string().min(1), text: z.string().min(1) })),
      results: z.array(ref),
      backdrop: z.enum(['canvas', 'painting']).default('canvas'),
      canvasImage: image(),
      pageImage: image(),
      aboutLead: z.string().min(1),
      closeText: z.string().min(1),
      steps: z.array(z.object({ title: z.string().min(1), text: z.string().min(1) })),
    }),
  }),
  settings: defineCollection({
    loader: yml('settings'),
    schema: z.object({
      availability: z.boolean(),
      availabilityText: z.string(),
      email: z.string().email(),
      responseTime: z.string(),
      nextSteps: text,
      socialLinks: z.array(z.object({ label: z.string(), url: z.string().url() })).nullish().transform((v) => v ?? []),
      companyName: z.string(),
      companyNumber: z.string().min(1),
      registeredOffice: z.string().min(1),
      footerText: z.string().min(1),
      colophon: z.string().min(1),
      // The tab icon; src/pages/[icon].ts makes every favicon size from it.
      favicon: z.string().regex(/^@assets\/.+\.(png|jpe?g|webp|svg)$/i, 'Upload a PNG, JPEG, WebP or SVG').default('@assets/brand/favicon.png'),
      // Glass dials, as percentages of the designed look (100 = as designed).
      glass: z.object({
        bend: z.number().min(0).max(300).default(100),
        frost: z.number().min(0).max(300).default(100),
        blur: z.number().min(0).max(300).default(100),
        shine: z.number().min(0).max(300).default(100),
        reach: z.number().min(0).max(300).default(100),
      }).nullish().transform((g) => g ?? { bend: 100, frost: 100, blur: 100, shine: 100, reach: 100 }),
    }),
  }),
};
