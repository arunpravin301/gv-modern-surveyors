import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guidesCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: "./src/content/guides" }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    category: z.string(),
    readTime: z.string(),
    date: z.date(),
  }),
});

export const collections = {
  'guides': guidesCollection,
};
