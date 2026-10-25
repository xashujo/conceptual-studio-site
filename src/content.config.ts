import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const text = z.string().default('');
// Pages CMS can save an empty optional field as "", so treat "" as missing.
const blank = (v: unknown) => (v === '' || v === null ? undefined : v);
const opt = <T extends z.ZodTypeAny>(schema: T) => z.preprocess(blank, schema.optional());

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: ({ image }) => {
    const pic = z.object({ src: image(), alt: z.string(), caption: opt(z.string()) });
    const block = z.discriminatedUnion('type', [
      z.object({ type: z.literal('image'), size: z.enum(['full', 'wide', 'narrow']).default('wide'), src: image(), alt: z.string(), caption: opt(z.string()) }),
      z.object({ type: z.literal('pair'), left: pic, right: pic }),
      z.object({ type: z.literal('text'), heading: z.string().optional(), body: z.string() }),
      z.object({ type: z.literal('stat'), value: z.string(), label: z.string() }),
      z.object({ type: z.literal('video'), mp4: opt(z.string()), youtube: opt(z.string()), poster: opt(image()), alt: opt(z.string()), caption: opt(z.string()) }),
    ]);
    return z.object({
      title: z.string(),
      client: z.string(),
      year: z.number(),
      category: z.enum(['brand', 'data', 'motion']),
      disciplines: z.array(z.string()),
      summary: z.string(),
      context: opt(z.string()),
      featured: z.boolean().default(false),
      order: z.number().default(99),
      archive: z.boolean().default(false),
      cover: image(),
      coverAlt: z.string(),
      problem: text,
      approach: text,
      outcome: text,
      testimonial: opt(z.string()),
      link: z.preprocess((v: any) => (v && v.url ? v : undefined), z.object({ label: z.string(), url: z.string().url() }).optional()),
      blocks: z.array(block).default([]),
    });
  },
});

const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      order: z.number().default(1),
      short: z.string(),
      summary: z.string(),
      image: image(),
      imageAlt: z.string(),
      includes: z.array(z.string()),
      kinds: z.array(z.string()),
      tiers: z.array(
        z.object({
          name: z.string(),
          price: z.number().nullable().default(null),
          description: z.string(),
          includes: z.array(z.string()).default([]),
          timeline: opt(z.string()),
        }),
      ),
      faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
      related: z.array(z.string()).default([]),
    }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/testimonials' }),
  schema: z.object({
    quote: z.string(),
    excerpt: opt(z.string()),
    name: z.string(),
    role: z.string(),
    organisation: z.string(),
  }),
});

const clients = defineCollection({
  loader: file('./src/data/clients.json'),
  schema: z.object({ id: z.string(), name: z.string(), kind: z.enum(['Education', 'Companies', 'Music']) }),
});

export const collections = { projects, services, testimonials, clients };
