# Integration logos

Wired up in `src/content/site/integrations.md` — swapping a file needs no code
change, only the `logo:` path if the extension differs.

| File | Status |
| --- | --- |
| `quickbooks.png` | Real asset, supplied by the client. Trimmed and resized to 128x128 with transparency. |
| `xero.svg` | **Placeholder** — text drawn by hand, not the official mark. |
| `sage.svg` | **Placeholder** — text drawn by hand, not the official mark. |

Replace the two placeholders with the vendors' real logos:

    xero.svg   https://www.xero.com/uk/about/media-kit/
    sage.svg   https://www.sage.com/en-gb/company/media/

Each vendor publishes partner brand guidelines covering permitted use, minimum
clear space and whether a "works with" claim needs their sign-off — worth a read
before these go live.

The header renders each logo at 28px tall inside an 80x36px box, on white. Marks
wider than about 2.9:1 will be capped by the box width instead and sit shorter,
so prefer a compact lockup or an icon mark over a long wordmark.

The placeholder SVGs use `textLength` to pin their width: an SVG loaded through
`<img>` is an isolated document and cannot reach the page's Sora webfont, so
without it the text reflows to a fallback font and no longer fits its viewBox.
