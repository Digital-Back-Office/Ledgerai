import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Every word on the site lives in markdown under `src/content/`.
 *
 * In the React app all of this copy was hardcoded inside .tsx components, so
 * changing a headline meant editing JSX and redeploying the bundle. Here:
 *
 *  - repeated items (features, steps, FAQs, blog posts) are one file each,
 *    ordered by `order`;
 *  - one-off copy for a page section lives in `sections/`;
 *  - global chrome (brand, nav, footer) lives in `site/`.
 */

const md = (dir: string) => glob({ pattern: "**/*.md", base: `./src/content/${dir}` });

/** A button or link rendered as a call to action. */
const cta = z.object({
  label: z.string(),
  href: z.string().optional(),
  /** Analytics label sent with the gtag `cta_click` event. */
  event: z.string().optional(),
  style: z.enum(["primary", "secondary", "ghost"]).default("primary"),
  /** Opens the email-capture popup instead of navigating. */
  opensPopup: z.boolean().default(false),
  external: z.boolean().default(false),
});

/** Small eyebrow + heading + optional subheading, shared by most sections. */
const sectionHeader = {
  eyebrow: z.string().optional(),
  heading: z.string().optional(),
  /** Rendered in the brand colour inside the heading, replacing `{accent}`. */
  headingAccent: z.string().optional(),
  subheading: z.string().optional(),
  badge: z.string().optional(),
};

/** A web3forms-backed email or booking form. */
const form = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  placeholder: z.string().optional(),
  submitLabel: z.string(),
  loadingLabel: z.string().default("Sending..."),
  /** Value posted as `source` so submissions can be told apart. */
  source: z.string().optional(),
  note: z.string().optional(),
  successTitle: z.string().optional(),
  successMessage: z.string().optional(),
  errorMessage: z.string().default("Something went wrong. Please try again."),
  connectionErrorMessage: z.string().default("Error connecting to server."),
  fields: z
    .array(
      z.object({
        name: z.string(),
        placeholder: z.string(),
        type: z.enum(["text", "email", "tel"]).default("text"),
        required: z.boolean().default(false),
      })
    )
    .default([]),
});

/** The mock product panels a feature — or a landing page's hero — can show. */
const visual = z.enum(["email", "statements", "categorise", "balance", "alerts"]);

/** The five product features, with the mock data each panel shows. */
const features = defineCollection({
  loader: md("features"),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    description: z.string(),
    /** Key into the generated icon set. */
    icon: z.string(),
    /** Which visual panel renders for this feature. */
    visual,

    /** visual: email */
    emails: z
      .array(z.object({ from: z.string(), subject: z.string(), time: z.string() }))
      .default([]),
    emailNote: z.string().optional(),

    /** visual: statements */
    banks: z
      .array(
        z.object({
          name: z.string(),
          client: z.string(),
          date: z.string(),
          transactions: z.number(),
          color: z.string(),
        })
      )
      .default([]),
    bankBadge: z.string().optional(),

    /** visual: categorise */
    transactions: z
      .array(
        z.object({
          name: z.string(),
          category: z.string(),
          amount: z.string(),
          color: z.string(),
        })
      )
      .default([]),

    /** visual: alerts */
    alerts: z
      .array(
        z.object({
          company: z.string(),
          bank: z.string(),
          label: z.string(),
          color: z.string(),
          icon: z.string(),
        })
      )
      .default([]),

    /** visual: balance */
    ledger: z
      .object({
        columns: z.array(z.string()),
        rows: z.array(
          z.object({
            account: z.string(),
            debit: z.string().default(""),
            credit: z.string().default(""),
          })
        ),
        footer: z.string(),
      })
      .optional(),
  }),
});

/** The three "how it works" cards. */
const steps = defineCollection({
  loader: md("steps"),
  schema: z.object({
    order: z.number(),
    number: z.string(),
    title: z.string(),
    description: z.string(),
    icon: z.string(),
  }),
});

/** FAQ accordion entries. Body = the answer, which also feeds FAQPage JSON-LD. */
const faqs = defineCollection({
  loader: md("faqs"),
  schema: z.object({
    order: z.number(),
    question: z.string(),
    answer: z.string(),
  }),
});

/** Long-form articles. Body = the post. */
const blog = defineCollection({
  loader: md("blog"),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    excerpt: z.string(),
    coverImage: z.string(),
    category: z.string(),
    /** ISO date — drives both the displayed date and `datePublished`. */
    date: z.string(),
    readingTime: z.string(),
    author: z.string(),
    seo: z.object({
      title: z.string(),
      description: z.string(),
      ogTitle: z.string(),
      ogDescription: z.string(),
      /** Authoring note describing the intended cover art. */
      suggestedImagePrompt: z.string().optional(),
    }),
    related: z.array(z.string()).default([]),
  }),
});

/** Privacy, terms, cookie and GDPR pages. Body = the policy text itself. */
const legal = defineCollection({
  loader: md("legal"),
  schema: z.object({
    /** Order in the legal sidebar and the footer. */
    order: z.number(),
    title: z.string(),
    /** Short label used in the footer and the cross-links between policies. */
    shortTitle: z.string(),
    /** One-line summary rendered under the H1. */
    summary: z.string(),
    /** ISO date — shown as "Last updated" and used for `dateModified`. */
    updated: z.string(),
    seo: z.object({ title: z.string(), description: z.string() }),
  }),
});

/**
 * SEO landing pages for a single service or topic (bank statement processing,
 * invoice processing, AI bookkeeping).
 *
 * Each file is a whole page: its own URL, meta, breadcrumb trail and every
 * section it renders, all driven by `src/pages/[...slug].astro`. Sections are
 * optional so a page can drop the ones its brief didn't call for, and the
 * template skips whatever is absent rather than rendering an empty shell.
 */
const solutions = defineCollection({
  loader: md("solutions"),
  schema: z.object({
    order: z.number(),
    /** Site-relative URL, no trailing slash — this is what the route builds. */
    url: z.string(),
    /** Label used wherever the page is cross-linked (nav, footer, sitemap, related). */
    shortTitle: z.string(),
    /** One line under `shortTitle` in the header dropdown. */
    tagline: z.string(),
    /** Key into the generated icon set, used by the header dropdown. */
    icon: z.string(),
    seo: z.object({
      title: z.string(),
      description: z.string(),
      /** Authoring notes from the content brief; not rendered. */
      primaryKeyword: z.string().optional(),
      secondaryKeywords: z.array(z.string()).default([]),
    }),
    /** Breadcrumb trail between Home and this page. */
    trail: z.array(z.object({ name: z.string(), item: z.string().optional() })).default([]),

    hero: z.object({
      badge: z.string(),
      h1: z.string(),
      intro: z.string(),
      ctas: z.array(cta).default([]),
      trustPoints: z.array(z.string()).default([]),
      image: z.object({ src: z.string(), alt: z.string() }).optional(),
      /**
       * A product panel to show beside the copy when the page has no `image`:
       * the matching entry in the `features` collection supplies the data.
       */
      visual: visual.optional(),
    }),

    /** "Why the manual way hurts" — the problem framing, where a brief has one. */
    challenges: z
      .object({
        ...sectionHeader,
        items: z.array(z.object({ title: z.string(), icon: z.string() })).default([]),
        image: z.object({ src: z.string(), alt: z.string() }).optional(),
      })
      .optional(),

    /** Prose block(s) explaining the product, plus optional stat-style callouts. */
    what: z
      .object({
        ...sectionHeader,
        body: z.array(z.string()).default([]),
        highlights: z
          .array(z.object({ title: z.string(), description: z.string(), icon: z.string() }))
          .default([]),
      })
      .optional(),

    audience: z
      .object({
        ...sectionHeader,
        items: z.array(z.object({ text: z.string(), icon: z.string() })).default([]),
      })
      .optional(),

    /** Numbered walkthrough. `title` is the step's short label. */
    process: z
      .object({
        ...sectionHeader,
        items: z.array(z.object({ title: z.string(), description: z.string(), icon: z.string() }))
          .default([]),
      })
      .optional(),

    benefits: z
      .object({
        ...sectionHeader,
        items: z.array(z.object({ text: z.string(), icon: z.string() })).default([]),
      })
      .optional(),

    integrations: z
      .object({
        ...sectionHeader,
        body: z.string().optional(),
        groups: z
          .array(z.object({ title: z.string(), icon: z.string(), items: z.array(z.string()) }))
          .default([]),
      })
      .optional(),

    /** Contextual internal links, with descriptive anchor text. */
    related: z
      .object({
        ...sectionHeader,
        items: z
          .array(z.object({ label: z.string(), href: z.string(), description: z.string() }))
          .default([]),
      })
      .optional(),

    /** Rendered as an accordion and emitted as FAQPage structured data. */
    faqs: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),

    /** Closing band above the demo form. */
    closing: z
      .object({
        ...sectionHeader,
        body: z.string().optional(),
        ctas: z.array(cta).default([]),
      })
      .optional(),
  }),
});

/**
 * Subscription tiers on /pricing, one file per plan. The body is unused — every
 * figure is frontmatter so the cards, the comparison table and the Offer
 * structured data all read the same numbers.
 */
const plans = defineCollection({
  loader: md("plans"),
  schema: z.object({
    order: z.number(),
    name: z.string(),
    tagline: z.string(),
    /** GBP. The yearly saving shown on the card is derived from these two. */
    monthlyPrice: z.number(),
    yearlyPrice: z.number(),
    /** Draws the card with the brand border and this ribbon. */
    badge: z.string().optional(),
    featured: z.boolean().default(false),
    /** The headline allowances, shown as a list under the price. */
    allowances: z.array(z.object({ label: z.string(), value: z.string(), note: z.string().optional() })),
    features: z.array(z.string()).default([]),
    /** Premium-only extras, listed under their own heading. */
    extrasHeading: z.string().optional(),
    extras: z.array(z.string()).default([]),
    cta: cta,
  }),
});

/** Rows of the plan-by-plan comparison table on /pricing. */
const comparisonRow = z.object({
  label: z.string(),
  /** One cell per plan, in plan order. `true`/`false` render as a tick or dash. */
  values: z.array(z.union([z.string(), z.boolean()])),
});

const sections = defineCollection({
  loader: md("sections"),
  schema: z.object({
    ...sectionHeader,
    ctas: z.array(cta).default([]),
    form: form.optional(),

    /** Page-level SEO for the section that heads a page. */
    pageTitle: z.string().optional(),
    pageDescription: z.string().optional(),

    /** Short reassurance lines, e.g. "No credit card required". */
    trustPoints: z.array(z.string()).default([]),
    /** Generic bullet list (showcase ticks, try-free notes). */
    bullets: z
      .array(z.object({ text: z.string(), tone: z.enum(["brand", "warning"]).default("brand") }))
      .default([]),

    /** topbar: the announcement strip. */
    announcement: z
      .object({
        before: z.string(),
        highlight: z.string(),
        after: z.string(),
        linkLabel: z.string(),
      })
      .optional(),

    /** hero / showcase / popup: headline assembled from parts, so no HTML in copy. */
    headline: z
      .object({
        before: z.string().default(""),
        accent: z.string(),
        after: z.string().default(""),
      })
      .optional(),

    /**
     * hero: the wording in the product illustration. Its names and figures are
     * not here — they come from the sample data in the `features` collection.
     */
    figure: z
      .object({
        /** File-type tag on the incoming email. */
        attachment: z.string().optional(),
        linesLabel: z.string(),
        /** `{count}` is the number of statement lines not listed. */
        moreLabel: z.string().optional(),
        balanceLabel: z.string(),
        balanceStatus: z.string().optional(),
        exportLabel: z.string().optional(),
        exportFormats: z.array(z.string()).default([]),
        caption: z.string().optional(),
      })
      .optional(),

    /** showcase: the illustration beside the copy. */
    image: z.object({ alt: z.string() }).optional(),

    /**
     * integrations page: the blocks under its header. The platforms themselves
     * are listed in `site/integrations.md`; these are the words around them.
     */
    apps: z
      .object({
        ...sectionHeader,
        /** Caption above each platform's `sends` line. */
        sendsLabel: z.string().optional(),
        /** Link to the vendor's own site. `{name}` is the platform's name. */
        linkLabel: z.string().optional(),
      })
      .optional(),
    flow: z
      .object({
        ...sectionHeader,
        /** Heading over the platforms in the diagram. */
        outputLabel: z.string().optional(),
      })
      .optional(),
    notes: z
      .object({
        ...sectionHeader,
        items: z
          .array(
            z.object({
              title: z.string(),
              description: z.string(),
              href: z.string().optional(),
              linkLabel: z.string().optional(),
            })
          )
          .default([]),
      })
      .optional(),
    /** integrations page: heading for its FAQs. */
    faqHeading: z.string().optional(),
    /** Entries of the `faqs` collection to show, by file name without `.md`. */
    faqIds: z.array(z.string()).default([]),
    /**
     * showcase: the inputs -> Ledger AI -> outputs diagram, drawn in HTML so
     * its labels are real text. Without it the section falls back to the PNG.
     */
    pipeline: z
      .object({
        inputLabel: z.string().optional(),
        outputLabel: z.string().optional(),
        /** `type` is the short file-type tag drawn beside the label. */
        inputs: z.array(z.object({ label: z.string(), type: z.string().optional() })),
        core: z.string(),
        coreNote: z.string().optional(),
        outputs: z.array(z.string()),
      })
      .optional(),

    /** try-free: uploader copy and limits. */
    uploader: z
      .object({
        dailyLimit: z.number(),
        maxFileSizeMb: z.number(),
        apiBaseUrl: z.string(),
        dropTitle: z.string(),
        dropHint: z.string(),
        submitLabel: z.string(),
        processingLabel: z.string(),
        remainingLabel: z.string(),
        emailPromptLabel: z.string(),
        sendingToLabel: z.string(),
        changeLabel: z.string(),
        invalidTypeError: z.string(),
        tooLargeError: z.string(),
        genericError: z.string(),
        successTitle: z.string(),
        modal: z.object({
          heading: z.string(),
          body: z.string(),
          placeholder: z.string(),
          submitLabel: z.string(),
          invalidEmail: z.string(),
          note: z.string(),
        }),
        limitReached: z.object({
          heading: z.string(),
          body: z.string(),
        }),
      })
      .optional(),
    /** try-free: fallback bank list before the API responds. */
    supportedBanks: z.array(z.string()).default([]),
    panelTitle: z.string().optional(),

    /** book-demo: the pull quote beside the form. */
    testimonial: z.object({ quote: z.string(), stars: z.number().default(5) }).optional(),

    /** email popup: scarcity meter. */
    scarcity: z
      .object({
        totalSpots: z.number(),
        baseSpotsLeft: z.number(),
        minSpotsLeft: z.number(),
        decayStart: z.string(),
        decayEveryDays: z.number(),
        decayAmount: z.number(),
        /** `{left}` and `{total}` are substituted at runtime. */
        label: z.string(),
        claimedLabel: z.string(),
      })
      .optional(),

    /** blog index: search + empty state. */
    searchPlaceholder: z.string().optional(),
    allCategoriesLabel: z.string().optional(),
    emptyState: z.object({ message: z.string(), action: z.string() }).optional(),

    /** cookie consent: the policy links inside the body copy. */
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),

    /** pricing: billing toggle, comparison table and the page's own FAQs. */
    billing: z
      .object({ monthlyLabel: z.string(), yearlyLabel: z.string(), yearlyNote: z.string() })
      .optional(),
    comparison: z
      .object({ ...sectionHeader, rows: z.array(comparisonRow) })
      .optional(),
    faqs: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
  }),
});

const site = defineCollection({
  loader: md("site"),
  schema: z.object({
    /** brand */
    name: z.string().optional(),
    legalName: z.string().optional(),
    logo: z.string().optional(),
    logoAlt: z.string().optional(),
    favicon: z.string().optional(),
    ogImage: z.string().optional(),
    url: z.string().optional(),
    appUrl: z.string().optional(),
    defaultTitle: z.string().optional(),
    defaultDescription: z.string().optional(),
    /** Posted with every web3forms submission. */
    formAccessKey: z.string().optional(),
    gtmId: z.string().optional(),
    googleAdsId: z.string().optional(),
    /** send_to value for the booking conversion event. */
    bookingConversionLabel: z.string().optional(),
    applicationDescription: z.string().optional(),

    /** navigation + footer */
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    /**
     * Header dropdown holding the `solutions` landing pages. Only the label is
     * authored here — the entries come from the collection, so adding a landing
     * page puts it in the menu without touching this file.
     */
    menuLabel: z.string().optional(),
    /**
     * integrations: the accounting software Ledger AI syncs with, shown on the
     * /integrations page. `logo` is a path under public/ — swap the
     * placeholder files there for the official brand assets.
     */
    integrations: z
      .array(
        z.object({
          name: z.string(),
          logo: z.string(),
          tagline: z.string(),
          /** What Ledger AI hands over to this platform, as a short noun phrase. */
          sends: z.string().optional(),
          /** The vendor's own site. Omit to leave the link out. */
          href: z.string().optional(),
          external: z.boolean().default(false),
        })
      )
      .default([]),
    login: z.object({ label: z.string(), href: z.string() }).optional(),
    cta: cta.optional(),
    copyright: z.string().optional(),
  }),
});

export const collections = { features, steps, faqs, blog, legal, sections, site, solutions, plans };
