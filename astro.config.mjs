// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://ledgerai.backoffice.digital',
  // Every route is prerendered to static HTML at build time — the whole point of
  // the move off the client-rendered Vite/React app.
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    // /blogs/foo.html rather than /blogs/foo/index.html keeps URLs identical to
    // the old client-side router. 'preserve' rather than 'file' so that
    // pages/blogs/index.astro emits blogs/index.html instead of blogs.html —
    // with 'file' both blogs.html and a blogs/ directory exist, and GitHub Pages
    // resolves a bare /blogs to the directory, which has no index and 404s.
    format: 'preserve',
  },
  // No @astrojs/sitemap: the XML sitemap is served by src/pages/sitemap.xml.ts,
  // a single flat urlset matching the format dataflow.zone uses. Running both
  // would publish two competing sitemaps of the same site.
  integrations: [],
  vite: {
    plugins: [tailwindcss()],
  },
});
