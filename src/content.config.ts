// Content the CMS edits (brief section 10). Field names match .pages.yml exactly.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Pages CMS stores a reference as the other entry's file path; keep just its id (the file name).
const ref = z.string().transform((p) => p.split('/').pop()!.replace(/\.ya?ml$/, ''));

const yml = (folder: string) => glob({ pattern: '*.{yml,yaml}', base: `./src/content/${folder}` });

const caption = z.object({ title: z.string().min(1), medium: z.string().min(1) });

export const collections = {
  projects: defineCollection({
    loader: yml('projects'),
    schema: ({ image }) => {
      // Alt text is required on every image (brief section 10).
      const pic = z.object({ src: image(), alt: z.string().min(1) });
      const block = z.discriminatedUnion('type', [
        z.object({ type: z.literal('text'), body: z.string(), caption: caption.optional() }),
        z.object({ type: z.literal('image'), image: pic, caption }),
        z.object({ type: z.literal('imagePair'), left: pic, right: pic, caption }),
        z.object({
          type: z.literal('video'),
          file: z.string().optional(), // short loop in the repo
          url: z.string().url().optional(), // longer film on R2
          poster: pic.optional(),
          caption,
        }).refine((v) => v.file || v.url, 'A video block needs a file or a URL'),
        z.object({ type: z.literal('stat'), value: z.string(), label: z.string(), caption: caption.optional() }),
        z.object({ type: z.literal('quote'), testimonial: ref, caption: caption.optional() }),
        z.object({ type: z.literal('chartImage'), image: pic, caption }),
        z.object({ type: z.literal('beforeAfter'), before: pic, after: pic, caption }),
      ]);
      return z.object({
        title: z.string(),
        slug: z.string().regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
        client: ref,
        year: z.number().int(),
        disciplines: z.array(z.string()).min(1),
        sector: z.string(),
        outcome: z.string(),
        featured: z.boolean().default(false),
        featuredOrder: z.number().optional(),
        archive: z.boolean().default(false),
        cover: pic,
        coverCaption: caption,
        problem: z.string().optional(),
        whatIDid: z.string().optional(),
        whatHappened: z.string().optional(),
        testimonial: ref.optional(),
        next: ref.optional(),
        blocks: z.array(block).default([]),
      });
    },
  }),
  services: defineCollection({
    loader: yml('services'),
    schema: z.object({
      name: z.string(),
      slug: z.string().regex(/^[a-z0-9-]+$/),
      summary: z.string(),
      includes: z.array(z.string()).default([]),
      tiers: z.array(z.object({
        name: z.string(),
        fromPrice: z.string(),
        timeline: z.string().optional(),
        includes: z.string(),
      })),
      faqs: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
      related: z.array(ref).default([]),
    }),
  }),
  testimonials: defineCollection({
    loader: yml('testimonials'),
    schema: z.object({ quote: z.string(), name: z.string(), role: z.string(), organisation: z.string() }),
  }),
  clients: defineCollection({
    loader: yml('clients'),
    schema: ({ image }) => z.object({
      name: z.string(),
      logo: image().optional(),
      trustedBy: z.boolean().default(false),
    }),
  }),
  settings: defineCollection({
    loader: yml('settings'),
    schema: z.object({
      availability: z.boolean(),
      availabilityText: z.string(),
      email: z.string().email(),
      responseTime: z.string(),
      socialLinks: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
      companyName: z.string(),
      companyNumber: z.string().optional(),
    }),
  }),
};
