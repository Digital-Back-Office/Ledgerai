// @ts-check
import { readFileSync, readdirSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * `lastmod` dates for the XML sitemap, read straight out of the content
 * frontmatter that the pages themselves render from.
 *
 * Search Console ignores `changefreq` and `priority` but does read `lastmod`,
 * so it is the only optional field worth emitting — and it has to be true, or
 * Google starts distrusting it. Using the build date for every URL would mark
 * three-month-old posts as changed on every deploy, which is exactly that.
 */
const frontmatterDates = (dir, field, urlPath) => {
  const pattern = new RegExp(`^${field}:\\s*"?([0-9]{4}-[0-9]{2}-[0-9]{2})`, 'm');
  return Object.fromEntries(
    readdirSync(`./src/content/${dir}`)
      .filter((file) => file.endsWith('.md'))
      .map((file) => {
        const match = pattern.exec(readFileSync(`./src/content/${dir}/${file}`, 'utf8'));
        return [urlPath(file.replace(/\.md$/, '')), match?.[1]];
      })
      .filter(([, date]) => date)
  );
};

const posts = frontmatterDates('blog', 'date', (slug) => `/blogs/${slug}`);
const legal = frontmatterDates('legal', 'updated', (slug) => `/legal/${slug}`);
const newestPost = Object.values(posts).sort().at(-1);

/** Pages assembled from that content inherit the newest date they show. */
const lastmodByPath = {
  ...posts,
  ...legal,
  '/': newestPost,
  '/blogs': newestPost,
  '/sitemap': [...Object.values(posts), ...Object.values(legal)].sort().at(-1),
};

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
  integrations: [
    sitemap({
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/\/$/, '') || '/';
        const lastmod = lastmodByPath[path];
        return lastmod ? { ...item, lastmod: `${lastmod}T00:00:00+00:00` } : item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
