// @ts-check
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

/**
 * Phase 1 proof of concept only: proves a separate Astro project can import
 * and render a real component (`src/components/FaqBlock.astro`) from the
 * main site — its real markup, its real transitive imports (Icon.astro,
 * FaqList.astro, lib/content.ts), and its real Tailwind theme — without
 * copying any of it.
 *
 * Deliberately `output: 'static'` (the default): every prop here is
 * hardcoded, so there is no request-time data and therefore no need for
 * on-demand rendering or a server adapter. The main project's own build
 * fails outright if even one route opts out of prerendering without an
 * adapter installed (verified against `astro build`'s source), so staying
 * static here is not just simpler — it's what keeps this POC from ever
 * needing a dependency the main site doesn't already have.
 *
 * Vite's default dev-server file-access allowlist is scoped to whatever it
 * detects as the workspace root. This project has no package.json of its
 * own (intentionally, to avoid a second `node_modules`), so that detection
 * is not something to rely on — the repo root is allow-listed explicitly
 * instead, since every real file this POC renders (the component, its
 * sibling imports, the real global.css, the real content markdown) lives
 * there, one level up from this config file.
 */
const repoRoot = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig({
  output: "static",
  vite: {
    plugins: [tailwindcss()],
    server: {
      fs: {
        allow: [repoRoot],
      },
    },
  },
});
