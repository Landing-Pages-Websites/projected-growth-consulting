// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { publishedSlugs } from './src/lib/posts';

export default defineConfig({
  site: 'https://projectedgrowthconsultancy.com',
  integrations: [
    sitemap({
      // The unwritten article shells are noindex (see blog/[slug].astro).
      // Advertising them here would ask Google to crawl pages that tell it to
      // go away. publishedSlugs is the same source of truth that decides which
      // posts get a real page, so the two can never drift.
      filter: (page) => {
        const m = new URL(page).pathname.match(/^\/blog\/([^/]+)\/?$/);
        return !m || publishedSlugs.has(m[1]);
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
