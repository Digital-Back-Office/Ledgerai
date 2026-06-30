import { bookkeepingTipsContent } from "./tips";
import { complianceContent } from "./compliance";
import { differenceContent } from "./difference";

export interface BlogSEO {
  title: string;
  description: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  suggestedImagePrompt: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  publishedDate: string;
  readingTime: string;
  author: string;
  seo: BlogSEO;
  related: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "from-pdf-to-trial-balance-workflow-modern-accountants",
    title: "From PDF to Trial Balance: A Faster Workflow for Modern Accountants",
    excerpt: "Discover how modern accountants automate client data extraction. Convert PDFs, emails, and receipts into a clean, reconciled Trial Balance in minutes.",
    content: bookkeepingTipsContent,
    coverImage: "/blogs/pdf-to-trial-balance.jpg",
    category: "Financial Operations",
    publishedDate: "25 June 2026",
    readingTime: "8 min read",
    author: "Emma Davies, Senior Workflow Consultant",
    seo: {
      title: "From PDF to Trial Balance: Accounting Workflow Guide",
      description: "Discover how modern accountants automate client data extraction. Convert PDFs, emails & receipts to a clean Trial Balance in minutes.",
      canonicalUrl: "https://ledgerai.backoffice.digital/blogs/from-pdf-to-trial-balance-workflow-modern-accountants",
      ogTitle: "From PDF to Trial Balance: A Faster Workflow for Accountants",
      ogDescription: "Convert raw client PDFs, emails, and receipts to a clean Trial Balance in minutes.",
      suggestedImagePrompt: "Modern sleek dual monitor setup in an accounting office, one screen showing a glowing digital PDF document and the other screen displaying a clean visual spreadsheet trial balance."
    },
    related: [
      "guide-to-bookkeeping-automation-uk-accounting-firms-2026",
      "hidden-cost-manual-bank-statement-processing-uk-firms"
    ]
  },
  {
    slug: "guide-to-bookkeeping-automation-uk-accounting-firms-2026",
    title: "The Complete Guide to Bookkeeping Automation for UK Accounting Firms (2026)",
    excerpt: "Learn how UK accounting firms automate bookkeeping in 2026. Master MTD compliance, AI transaction matching, and scale client capacity without hiring.",
    content: complianceContent,
    coverImage: "/blogs/bookkeeping-automation-2026.jpg",
    category: "Guides & Automation",
    publishedDate: "18 June 2026",
    readingTime: "9 min read",
    author: "Robert Harrison, Chartered Accountant",
    seo: {
      title: "UK Bookkeeping Automation Guide 2026 | Ledger AI",
      description: "Learn how UK accounting firms automate bookkeeping in 2026. Master MTD compliance, AI transaction matching, and client onboarding.",
      canonicalUrl: "https://ledgerai.backoffice.digital/blogs/guide-to-bookkeeping-automation-uk-accounting-firms-2026",
      ogTitle: "Guide to Bookkeeping Automation for UK Accounting Firms (2026)",
      ogDescription: "Discover how UK accounting firms scale capacity, improve margins, and automate compliance in 2026.",
      suggestedImagePrompt: "High-end corporate office workspace in London, large tablet displaying modern automated bookkeeping dashboard with charts, graphs, and UK tax data."
    },
    related: [
      "from-pdf-to-trial-balance-workflow-modern-accountants",
      "hidden-cost-manual-bank-statement-processing-uk-firms"
    ]
  },
  {
    slug: "hidden-cost-manual-bank-statement-processing-uk-firms",
    title: "The Hidden Cost of Manual Bank Statement Processing for UK Accounting Firms",
    excerpt: "Manual bank statement data entry is costing your UK firm. Learn about error rates, security risks, staff burnout, and how to transition to AI extraction.",
    content: differenceContent,
    coverImage: "/blogs/manual-statement-cost.jpg",
    category: "Compliance & Costs",
    publishedDate: "11 June 2026",
    readingTime: "7 min read",
    author: "Sarah Jenkins, Director of Operations",
    seo: {
      title: "Hidden Cost of Manual Bank Statement Processing",
      description: "Manual bank statement data entry is costing your UK firm. Learn about error rates, security risks, staff burnout, and how to automate.",
      canonicalUrl: "https://ledgerai.backoffice.digital/blogs/hidden-cost-manual-bank-statement-processing-uk-firms",
      ogTitle: "The Hidden Cost of Manual Bank Statement Processing",
      ogDescription: "Find out how manual statement keying drains margins and limits firm capacity, and how to fix it.",
      suggestedImagePrompt: "Conceptual visual illustration of business money leak, a stack of paper bank statements on a desk, a clock ticking, and small glowing blue numbers escaping."
    },
    related: [
      "from-pdf-to-trial-balance-workflow-modern-accountants",
      "guide-to-bookkeeping-automation-uk-accounting-firms-2026"
    ]
  }
];
