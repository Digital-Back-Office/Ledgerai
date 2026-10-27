import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

/**
 * `FaqBlock.astro` is not purely props-driven: it calls `getSection("book-demo")`
 * from `src/lib/content.ts` internally (for the "Something we haven't covered?"
 * link), which requires a `sections` collection to exist in whichever Astro
 * project is currently running it. Astro's `glob()` loader resolves its `base`
 * relative to *this* project's root (`preview/`), and that resolution supports
 * `../`, so this points straight at the real content directory instead of a
 * copy — see astro/dist/content/loaders/glob.js: `new URL(base, config.root)`.
 *
 * No schema is declared on purpose: FaqBlock only reads `demo.form?.subtitle`,
 * and declaring one here would mean maintaining a second copy of the schema
 * already defined in `src/content.config.ts`. Untyped passthrough data is a
 * fine trade for a proof of concept that never leaves this machine.
 */
const sections = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "../src/content/sections" }),
});

export const collections = { sections };
