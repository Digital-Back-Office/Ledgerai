# Ledger AI – Web Vitals Changes Report

Branch: `improve-web-vitals` · Plan: `docs/LedgerAI-Core-Web-Vitals-Fix-Plan.docx.md`
Baseline (mobile): score 42, LCP 10.7 s, TBT 900 ms, FCP 4.5 s. Target: 90+, LCP ≤ 2.5 s, TBT ≤ 150 ms, FCP ≤ 1.5 s, CLS < 0.1.

> Status: code changes built successfully (`npm run build`, 18 pages). **Lighthouse has not been re-run yet**, so the score impact is unmeasured.

## 1. Changes in the repo

| Area | Change | Files |
|---|---|---|
| Hero LCP | Removed `.anim` / `.anim-up` from h1, badge, lede, CTAs, email form, hero figure and fact grid. Hero text is now visible in raw HTML. | `HeroSection.astro`, `PageHead.astro`, `pages/[...slug].astro` |
| Animation CSS | Hidden state applies only when `.js` is set, `prefers-reduced-motion: no-preference`, and `:not(.in)`. Below-the-fold elements still animate. | `styles/global.css` |
| Analytics | Removed standalone `gtag/js` (Google Ads) tag. Added Consent Mode v2 (all denied by default, `wait_for_update: 500`). Stored "accepted" choice is replayed on return visits. GTM loads on first `pointerdown`/`scroll`/`keydown`, or after 10 s. `window.gtag` is now a dataLayer stub, so existing `gtag("event", …)` calls still work. | `layouts/BaseLayout.astro` |
| Consent update | Accept button sends `gtag("consent","update", granted)`. Decline leaves everything denied. | `components/CookieConsent.astro` |
| Fonts | Google Fonts links removed. Self-hosted Fontsource variable fonts (Bricolage Grotesque, Geist, Geist Mono), Latin subset only, `font-display: swap`. Heading font preloaded. | `global.css`, `BaseLayout.astro`, `package.json` |
| Critical CSS | `build.inlineStylesheets: 'always'`. Built HTML has zero stylesheet `<link>`s. | `astro.config.mjs` |
| Logo | Nav and Footer use `astro:assets` `<Image>` (WebP, 160×40, 1x/2x). 110 KB PNG becomes 1–2 KB. `public/Logo.png` kept for JSON-LD. | `Nav.astro`, `Footer.astro`, `src/assets/logo.png` |
| JS cleanups | Build target ES2022 (Vite and tsconfig). Scroll observers and popup auto-open observer start from `requestIdleCallback` (fallback `setTimeout`). | `astro.config.mjs`, `tsconfig.json`, `BaseLayout.astro`, `EmailPopup.astro` |

## 2. Cloudflare configuration (manual, not in repo)

Cache Rules, in this order:

| # | Match | Setting |
|---|---|---|
| 1 | URI Path starts with `/_astro/` | Cache eligible; Edge TTL 1 year; Browser TTL 1 year (`immutable`) |
| 2 | URI Path ends with `.webp .avif .png .jpg .svg .woff2` | Cache eligible; Edge TTL 30 days; Browser TTL 30 days |
| 3 | Everything else (HTML), excluding `/_astro/` and queries containing `preview` | Cache eligible; Edge TTL 1 hour; Browser TTL 10 minutes |

Zone: Tiered Cache **On**, Brotli **On**, HTTP/3 **On**, Early Hints **On**, Rocket Loader **Off**. Purge cache on every deploy.

## 3. Deployment checklist (read before merging)

1. **Re-create Google Ads inside GTM (blocking).** `gtag/js?id=AW-18022362771` is gone. Add a Google Ads Conversion Linker and a conversion tag in container `GTM-NR65TM3J`, gated on `ad_storage`/`ad_user_data`. Without it, Ads conversions stop.
2. **Check GTM Consent Settings.** Tags must declare consent requirements. Turn on consent overview in GTM, then confirm in Tag Assistant: no Google tag sets cookies before Accept, and conversions fire after Accept.
3. **Expect lower analytics counts.** GTM now loads only on interaction (or after 10 s), so no-interaction bounces are undercounted. Page-view and bounce-rate trends will shift. Annotate the deploy date in GA.
4. **Purge Cloudflare after deploy.** HTML is cached for 1 h at the edge, 10 min in browsers. Without a purge, old HTML may reference removed `/_astro/*` hashes. Add a purge step to `deploy.yml` (Cloudflare API token as a GitHub secret) or purge manually.
5. **Rule order matters in Cloudflare.** Rule 3 must not catch `/_astro/*`. Keep rules 1 and 2 first, or exclude `/_astro/` in rule 3.
6. **GitHub Pages cannot set headers.** All caching is Cloudflare-side. If Cloudflare is bypassed or paused, caching reverts to GitHub's defaults.
7. **Lockfile.** `package-lock.json` changed (three Fontsource packages). CI uses `npm ci`, so commit the lockfile with `package.json`.
8. **Cloudflare Email Obfuscation / Rocket Loader / Auto Minify.** Keep Rocket Loader off. Obfuscation injects a second script, so consider disabling it if no email addresses are on the pages.
9. **The `?offer=1` popup link.** It is cached by the HTML rule. This is harmless (the script strips the flag), but test that the popup still opens from other pages.

## 4. Verification after deploy

| Check | How | Pass when |
|---|---|---|
| Score | pagespeed.web.dev, mobile, 3 runs, take median | 85–95+ |
| LCP | DevTools Performance, Slow 4G + 4× CPU | LCP element is the h1, under 2.5 s |
| Render blocking | Lighthouse "Eliminate render-blocking resources" | No CSS or font items |
| Caching | `curl -I https://ledgerai.backoffice.digital/_astro/<file>` | `max-age=31536000`, `cf-cache-status: HIT` on second request |
| HTML caching | `curl -I https://ledgerai.backoffice.digital/` twice | Second request `HIT` |
| Consent | GTM Preview / Tag Assistant | Nothing fires before Accept |
| Events | GTM Preview: click CTA, submit form, open popup | `cta_click`, `form_submitted`, `popup_opened` appear in dataLayer |
| CLS | Lighthouse + visual check at font swap | Under 0.1 |
| Reduced motion | Enable "reduce motion" in OS | No hidden content, no animation |
| No JS | Disable JS | All content visible |

## 5. Key success factors and risks

- **GTM contents decide TBT.** Deferring the loader helps, but heavy tags inside the container (Ads, remarketing, heatmaps) still cost main-thread time once loaded. Audit and remove unused tags.
- **Lighthouse does not interact**, so GTM loads at the 10 s fallback or not at all in the lab. Lab scores will look better than real-user behaviour. Track field data (CrUX, `web-vitals`, or Cloudflare Web Analytics) for real INP.
- **Font swap can cause layout shift.** No `size-adjust` fallback face was added. If CLS rises after deploy, add fallback metrics or Fontaine.
- **Bricolage uses the `wght` file, not `opsz`.** This saves about 34 KB but drops optical sizing. Visually compare headings against production.
- **Fonts are Latin-only.** Characters outside Latin (e.g. some Vietnamese or extended Latin) fall back to system fonts. Fine for a UK audience; revisit if content expands.
- **Hero figure is no longer animated.** Intentional for LCP; the figure is a large block that could otherwise become the LCP element late.
- **Idle-deferred observers** mean reveal-on-scroll for above-the-fold items starts up to about 300 ms after load. Watch for visible pop-in on slow devices.
- **Roll back plan.** Revert the branch and purge Cloudflare. Consent and GTM changes are all in `BaseLayout.astro`.
- **Not done:** Partytown, Cloudflare Polish, real-user INP tracking, size-adjust fallback fonts, automated cache purge.
