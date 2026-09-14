/**
 * schema.org graphs.
 *
 * The React app built one JSON-LD blob inline in the Hero component and
 * injected it after hydration, with the FAQ answers duplicated by hand from
 * the accordion. Everything here is derived from the same markdown the page
 * renders, so the two can't drift apart.
 */
import { absolute, authorName, isoDate } from "./content";

interface Brand {
  name?: string;
  url?: string;
  favicon?: string;
  applicationDescription?: string;
}

const orgId = (site: string) => `${site}/#organization`;
const siteId = (site: string) => `${site}/#website`;

export function organization(brand: Brand) {
  const site = (brand.url ?? "").replace(/\/$/, "");
  return {
    "@type": "Organization",
    "@id": orgId(site),
    name: brand.name,
    url: site + "/",
    logo: {
      "@type": "ImageObject",
      url: absolute(brand.favicon ?? "/favicon.svg", site),
    },
  };
}

export function website(brand: Brand) {
  const site = (brand.url ?? "").replace(/\/$/, "");
  return {
    "@type": "WebSite",
    "@id": siteId(site),
    url: site + "/",
    name: brand.name,
    publisher: { "@id": orgId(site) },
  };
}

export function webApplication(brand: Brand) {
  const site = (brand.url ?? "").replace(/\/$/, "");
  return {
    "@type": "WebApplication",
    "@id": `${site}/#application`,
    name: brand.name,
    url: site + "/",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All",
    browserRequirements: "Requires HTML5 compatible browser",
    description: brand.applicationDescription,
    publisher: { "@id": orgId(site) },
  };
}

/**
 * Drives AI answer engines and Google's FAQ rich result.
 *
 * `path` scopes the `@id` to the page the accordion is actually on — every
 * landing page carries its own FAQs, and they'd collide on one id otherwise.
 */
export function faqPage(
  brand: Brand,
  faqs: { question: string; answer: string }[],
  path = "/"
) {
  const site = (brand.url ?? "").replace(/\/$/, "");
  return {
    "@type": "FAQPage",
    "@id": `${site}${path === "/" ? "/" : path}#faq`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

interface Post {
  title: string;
  excerpt: string;
  coverImage: string;
  date: string;
  author: string;
  category: string;
  readingTime: string;
}

export function blogPosting(brand: Brand, post: Post, slug: string) {
  const site = (brand.url ?? "").replace(/\/$/, "");
  const url = `${site}/blogs/${slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: absolute(post.coverImage, site),
    datePublished: isoDate(post.date),
    dateModified: isoDate(post.date),
    articleSection: post.category,
    author: { "@type": "Person", name: authorName(post.author) },
    publisher: {
      "@type": "Organization",
      name: brand.name,
      logo: {
        "@type": "ImageObject",
        url: absolute(brand.favicon ?? "/favicon.svg", site),
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };
}

export function blogIndex(
  brand: Brand,
  meta: { name: string; description: string },
  posts: { id: string; data: Post }[]
) {
  const site = (brand.url ?? "").replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: meta.name,
    description: meta.description,
    url: `${site}/blogs`,
    publisher: {
      "@type": "Organization",
      name: brand.name,
      logo: {
        "@type": "ImageObject",
        url: absolute(brand.favicon ?? "/favicon.svg", site),
      },
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.data.title,
      description: post.data.excerpt,
      image: absolute(post.data.coverImage, site),
      datePublished: isoDate(post.data.date),
      author: { "@type": "Person", name: authorName(post.data.author) },
      url: `${site}/blogs/${post.id}`,
    })),
  };
}

/** Breadcrumbs help both search results and answer engines place the page. */
export function breadcrumbs(brand: Brand, trail: { name: string; item?: string }[]) {
  const site = (brand.url ?? "").replace(/\/$/, "");
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      ...(crumb.item ? { item: absolute(crumb.item, site) } : {}),
    })),
  };
}

/**
 * The graph for one service landing page: what the page is, the software it
 * describes, and its FAQs — all built from the same markdown the page renders,
 * which is what Google asks for when it says structured data must match the
 * visible content.
 */
export function solutionPage(
  brand: Brand,
  page: {
    path: string;
    name: string;
    headline: string;
    description: string;
    /** The benefit lines shown on the page, reused as `featureList`. */
    features?: string[];
    faqs?: { question: string; answer: string }[];
  }
) {
  const site = (brand.url ?? "").replace(/\/$/, "");
  const url = site + page.path;

  const graph: Record<string, unknown>[] = [
    organization(brand),
    website(brand),
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: page.name,
      headline: page.headline,
      description: page.description,
      inLanguage: "en-GB",
      isPartOf: { "@id": siteId(site) },
      publisher: { "@id": orgId(site) },
      about: { "@id": `${url}#application` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${url}#application`,
      name: brand.name,
      url,
      applicationCategory: "FinanceApplication",
      applicationSubCategory: page.name,
      operatingSystem: "All",
      browserRequirements: "Requires HTML5 compatible browser",
      description: page.description,
      ...(page.features?.length ? { featureList: page.features } : {}),
      publisher: { "@id": orgId(site) },
    },
  ];

  if (page.faqs?.length) graph.push(faqPage(brand, page.faqs, page.path));

  return { "@context": "https://schema.org", "@graph": graph };
}
