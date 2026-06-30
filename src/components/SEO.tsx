import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  jsonLd?: Record<string, any>;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage = "https://ledgerai.backoffice.digital/og-image.png",
  jsonLd,
}) => {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // Helper to update or create meta tags
    const updateMetaTag = (attr: string, value: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${value}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, value);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // 2. Update Meta Description
    updateMetaTag("name", "description", description);

    // 3. Update Canonical URL
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute("href", canonicalUrl);

    // 4. Update Open Graph Tags
    updateMetaTag("property", "og:title", ogTitle);
    updateMetaTag("property", "og:description", ogDescription);
    updateMetaTag("property", "og:image", ogImage);
    updateMetaTag("property", "og:url", canonicalUrl);

    // 5. Update JSON-LD Schema
    if (jsonLd) {
      let scriptEl = document.getElementById("jsonld-seo") as HTMLScriptElement;
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.id = "jsonld-seo";
        scriptEl.type = "application/ld+json";
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else {
      // Remove it if not present on this page to avoid leaks
      const scriptEl = document.getElementById("jsonld-seo");
      if (scriptEl) {
        scriptEl.remove();
      }
    }
  }, [title, description, canonicalUrl, ogTitle, ogDescription, ogImage, jsonLd]);

  return null; // Side-effect only component
};
