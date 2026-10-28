// Content Josh edits in Pages CMS (brief section 10). Field names match .pages.yml exactly.
// The pages read this through src/data/work.ts, src/data/services.ts and src/lib/site.ts.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Pages CMS stores a reference as the other entry's file path; keep just its id (the file name).
const ref = z.string().transform((p) => p.split('/').pop()!.replace(/\.ya?ml$/, ''));
const yml = (folder: string) => glob({ pattern: '*.{yml,yaml}', base: `./src/content/${folder}` });
const text = z.string().nullish().transform((s) => s ?? '');

export const collections = {
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
        order: z.number().nullish(),
        summary: z.string(),
        cover: pic,
        coverFocus: z.string().nullish(),
        featured: z.boolean().nullish().transform((v) => !!v),
        featuredOrder: z.number().nullish(),
        homeFilter: z.enum(['Branding', 'Data Visualisation', 'Social Media']).nullish(),
        homeFocus: z.string().nullish(),
        homeCharts: z.array(z.object({ src: image(), alt: z.string().min(1), title: z.string(), caption: z.string() })).nullish().transform((v) => v ?? []),
        hasPage: z.boolean().nullish().transform((v) => !!v),
        outcome: text,
        problem: text,
        whatIDid: text,
        whatHappened: text,
        gallery: z.array(z.object({
          layout: z.enum(['One large', 'Two side by side', 'Three in a row', 'Four in a grid']),
          images: z.array(pic).min(1),
        })).nullish().transform((v) => v ?? []),
        before: pic.nullish(),
        after: pic.nullish(),
        next: ref.nullish(),
      });
    },
  }),
  services: defineCollection({
    loader: yml('services'),
    schema: z.object({
      name: z.string(),
      order: z.number().nullish(),
      page: z.string().nullish(),
      summary: z.string(),
      homePrice: z.string().nullish(),
      homeTime: z.string().nullish(),
      homeLink: z.string().nullish(),
      tiers: z.array(z.object({
        name: z.string(),
        price: z.string(),
        time: z.string().nullish(),
        includes: z.string(),
        note: z.string().nullish(),
        lead: z.string().nullish(),
        badge: z.string().nullish(),
        button: z.string().nullish(),
      })).min(1),
    }),
  }),
  testimonials: defineCollection({
    loader: yml('testimonials'),
    schema: z.object({
      quote: z.string(), name: z.string(), role: z.string(), organisation: z.string(),
      onHomePage: z.boolean().nullish().transform((v) => !!v),
    }),
  }),
  clients: defineCollection({
    loader: yml('clients'),
    schema: ({ image }) => z.object({
      name: z.string(),
      logo: image().nullish(),
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
      workButton: z.string().min(1),
      workButtonHover: z.string().min(1),
      trustedByLabel: z.string().min(1),
      stats: z.array(z.object({ number: z.number(), after: z.string().nullish().transform((s) => s ?? ''), label: z.string().min(1) })),
      workHeading: z.string().min(1),
      allProjects: z.string().min(1),
      results: z.array(ref),
      howHeading: z.string().min(1),
      howIntro: z.string().min(1),
      howImage: image(),
      steps: z.array(z.object({ title: z.string().min(1), text: z.string().min(1) })),
      values: z.array(z.object({ title: z.string().min(1), text: z.string().min(1) })),
    }),
  }),
  settings: defineCollection({
    loader: yml('settings'),
    schema: z.object({
      availability: z.boolean(),
      availabilityText: z.string(),
      email: z.string().email(),
      responseTime: z.string(),
      socialLinks: z.array(z.object({ label: z.string(), url: z.string().url() })).nullish().transform((v) => v ?? []),
      companyName: z.string(),
      companyNumber: z.string().nullish(),
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
