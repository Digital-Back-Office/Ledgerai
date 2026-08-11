import type { APIRoute } from "astro";
import { getLegalPages, getPosts } from "../lib/content";

/**
 * The XML sitemap, in the same shape as the one dataflow.zone serves: a single
 * flat <urlset> with changefreq and priority on every entry, rather than the
 * sitemap-index.xml / sitemap-0.xml pair @astrojs/sitemap emits.
 *
 * Static pages are listed by hand — there are few enough that an explicit list
 * is clearer than route introspection, and it keeps /404 out. Blog posts and
 * legal pages come from the content collections so a new file can't be orphaned.
 */
const STATIC_ROUTES: Array<{ path: string; changefreq: string; priority: string }> = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/blogs", changefreq: "weekly", priority: "0.8" },
  { path: "/sitemap", changefreq: "monthly", priority: "0.4" },
];

/**
 * No trailing slash, unlike dataflow.zone: this site builds with
 * `format: 'preserve'`, so pages are served as /blogs/foo and BaseLayout emits
 * exactly that as the canonical. A trailing slash here would point Google at a
 * URL that disagrees with the canonical tag on the page it lands on.
 */
const toAbsoluteUrl = (origin: string, routePath: string) =>
  routePath === "/" ? `${origin}/` : `${origin}${routePath.replace(/\/+$/, "")}`;

const urlRow = (
  origin: string,
  route: { path: string; changefreq: string; priority: string; lastmod?: string }
) => {
  const loc = toAbsoluteUrl(origin, route.path);
  const lastmod = route.lastmod ? `<lastmod>${route.lastmod}</lastmod>` : "";
  return `<url><loc>${loc}</loc>${lastmod}<changefreq>${route.changefreq}</changefreq><priority>${route.priority}</priority></url>`;
};

export const GET: APIRoute = async ({ site }) => {
  const origin = (site?.toString() ?? "https://ledgerai.backoffice.digital").replace(/\/$/, "");
  const posts = await getPosts();
  const legal = await getLegalPages();

  // Newest first, matching how the blog index reads.
  const blogRoutes = posts
    .map((entry) => ({
      path: `/blogs/${entry.id}`,
      changefreq: "monthly",
      priority: "0.7",
      lastmod: entry.data.date,
    }))
    .sort((a, b) => b.lastmod.localeCompare(a.lastmod));

  const legalRoutes = legal.map((entry) => ({
    path: `/legal/${entry.id}`,
    changefreq: "yearly",
    priority: "0.4",
    lastmod: entry.data.updated,
  }));

  const xmlRows = [...STATIC_ROUTES, ...blogRoutes, ...legalRoutes]
    .map((route) => urlRow(origin, route))
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xmlRows}</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
