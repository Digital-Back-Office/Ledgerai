# Ledger AI — Astro

A rebuild of the Ledger AI marketing site in Astro. Same design, same copy, same
URLs — but every page is prerendered to static HTML at build time instead of
being assembled in the browser by React.

## Why

The previous site was a Vite + React SPA. The HTML served to a crawler was an
empty `<div id="root">`; the title, description, canonical URL and JSON-LD were
all injected from a `useEffect` after hydration, and the blog posts were parsed
from JavaScript template literals at runtime. Anything that did not execute the
bundle saw nothing.

Now:

| | Before | After |
|---|---|---|
| Landing page HTML | empty shell | ~92 KB of real content |
| Meta / canonical / OG | injected after hydration | in the served HTML |
| JSON-LD | injected after hydration | in the served HTML |
| Blog body | parsed client-side from a `.ts` string | compiled at build time |
| JS shipped | React + framer-motion + lucide | ~12 KB of vanilla scripts |
| Sitemap / RSS / robots | none | generated |

## Commands

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # -> dist/
npm run preview
```

**If something is missing in `npm run dev` but present in a build**, the dev
server's content cache is stale. `dev` and `build` keep separate caches, and
the dev one skips any file whose contents it has already seen. So if a field is
added to `content.config.ts` while `dev` is running, a content file saved just
before it is validated against the old schema, the new field is dropped, and
that copy is then reused, even after a restart. Stop the dev server, delete
`.astro/data-store.json`, and start it again.

## Layout

```
src/
  content/          all site copy, as markdown
    site/           brand, navigation, footer
    sections/       one file per page section
    features/       the five product features (+ their demo data)
    steps/          "how it works" steps
    faqs/           FAQ entries — also the source for FAQPage JSON-LD
    blog/           articles
  content.config.ts collection schemas (zod) — the contract for the above
  components/       one .astro file per section of the old React tree
  layouts/          BaseLayout: head, meta, JSON-LD, analytics
  lib/
    content.ts      typed helpers for reading collections
    layout.ts       column and span helpers for `.cells` grids
    schema.ts       schema.org graph builders
  pages/            routes
  styles/global.css theme, entrance animations, article styles
scripts/
  gen-icons.mjs     regenerates components/icons-data.ts from lucide-react
  convert-blogs.mjs the one-off TS -> markdown migration (kept for reference)
```

### Editing copy

Everything a marketer would want to change lives in `src/content/`. Headlines,
button labels, FAQ answers, the bank list, the demo-panel sample data, error
messages — none of it is in a component. `content.config.ts` validates it, so a
typo in a field name fails the build rather than rendering blank.

### Icons

The React app imported `lucide-react`, which meant no icon appeared until the
bundle ran. `src/components/icons-data.ts` holds the exact same SVG path data,
extracted from `lucide-react` v1.7.0, and `Icon.astro` inlines it. To add an
icon, add its name to `scripts/gen-icons.mjs` and re-run it.

### Animations

framer-motion is replaced by CSS transitions plus one `IntersectionObserver` in
`BaseLayout.astro`. Elements carry `.anim` with a direction (`.anim-up`,
`.anim-left`, …) and an optional `--anim-delay`.

The hidden starting state is scoped to `html.js`, a class set by an inline
script in `<head>`. Without JavaScript — or for a crawler that skips scripts —
the content is simply visible. It is never hidden waiting for a script that may
not run.

### Show/hide

Toggling always uses the `hidden` **attribute**, never the `hidden` class:
Tailwind's preflight declares `[hidden] { display: none !important }`, so the
attribute reliably beats any `flex`/`grid` utility on the same element. The
class would lose to them.

### Design system

The look is built from a small set of classes in `styles/global.css` and a
handful of shared components, so a new page is assembled rather than styled
from scratch.

| Piece | What it is |
| --- | --- |
| `.wrap` | The page container. |
| `.sheet` | The one raised surface: white, hairline border, navy-tinted shadow. |
| `.cells` | A block of cells sharing hairlines. Use `cellGrid` / `cellSpan` from `lib/layout.ts` so the last row is never left with an empty slot. |
| `.grid-paper` | Squared-paper texture for tinted and ink sections. |
| `.label`, `.mark` | Section label with its brand rule; the highlighter stroke behind key words. |
| `.btn` + `-primary` / `-ink` / `-line` | Buttons. Primary is brand fill with ink text, which keeps contrast high. |
| `SectionHead` | Label and heading on the left, supporting line on the right. |
| `PageHead` | Header band for inner pages (breadcrumb, H1, intro, optional slots). |
| `Steps`, `FaqBlock` | The ink "how it works" band and the FAQ section, shared across pages. |
| `FeatureVisual`, `FeatureFigure` | The product panels, and one framed as a hero figure. |

Two things to know before changing layout:

- **Every `grid` has one shrinkable column by default** (`.grid` in
  `global.css`). Without it, a single unbreakable line inside a grid sets the
  track's minimum width and pushes the column wider than the page, which a
  section's `overflow-x: clip` then hides rather than fixes. Any `grid-cols-*`
  utility overrides the default.
- **`FeatureVisual` and `PipelineDiagram` size themselves by container, not
  viewport.** The same panel appears in cards from about 280px to 570px wide,
  so their `@md:` / `@container` rules respond to the box they are placed in.

## URLs

`build.format: 'preserve'` is deliberate — it emits `dist/blogs/<slug>.html`,
which GitHub Pages serves at `/blogs/<slug>` with no trailing-slash redirect,
exactly matching the old client-side router's paths.

`'file'` is the obvious choice here and is wrong: it emits the blog index as
`dist/blogs.html` *alongside* the `dist/blogs/` directory holding the posts.
GitHub Pages resolves a bare `/blogs` to the directory, which has no
`index.html`, and 404s. `'preserve'` emits `dist/blogs/index.html` instead and
leaves every other path unchanged.

## Deployment

`.github/workflows/deploy.yml` builds on push to `main` and publishes `dist/` to
GitHub Pages with the `ledgerai.backoffice.digital` CNAME — unchanged from the
old repo apart from `npm ci` and the build output.

## Known issues carried over

- Blog copy links to `/services/bookkeeping`, a page that does not exist on this
  site. Present in the original content; not invented here.
- Footer "Privacy", "Terms" and "GDPR" links, and the cookie banner's policy
  links, all point at `#`.
- `src/components/Loader.astro` reproduces the old 2-second splash overlay but
  is **not** mounted. On a prerendered page it would hide content that has
  already painted, which works against the reason for this rewrite. Import it
  into `pages/index.astro` to restore it.
