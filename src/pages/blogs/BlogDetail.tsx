import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, ArrowRight, Home, ChevronRight, User, BookOpen } from "lucide-react";
import { blogPosts } from "../../data/blogs";
import type { BlogPost } from "../../data/blogs";
import { Link } from "../../components/Link";
import { SEO } from "../../components/SEO";
import { TopBar } from "../../components/hero/TopBar";
import { Nav } from "../../components/hero/Nav";
import { Footer } from "../../components/hero/Footer";

// ─── Inline Markdown Parser Utilities ─────────────────────────────────────────

const parseInlineMarkdown = (text: string): React.ReactNode => {
  let parts: React.ReactNode[] = [text];

  // 1. Handle bold text **text**
  parts = parts.flatMap((part) => {
    if (typeof part !== "string") return part;
    const subParts = [];
    const regex = /\*\*([\s\S]*?)\*\*/g;
    let match;
    let lastIndex = 0;
    while ((match = regex.exec(part)) !== null) {
      if (match.index > lastIndex) {
        subParts.push(part.substring(lastIndex, match.index));
      }
      subParts.push(
        <strong key={`bold-${match.index}`} className="font-bold text-slate-900">
          {match[1]}
        </strong>
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < part.length) {
      subParts.push(part.substring(lastIndex));
    }
    return subParts;
  });

  // 2. Handle links [text](url)
  parts = parts.flatMap((part) => {
    if (typeof part !== "string") return part;
    const subParts = [];
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    let lastIndex = 0;
    while ((match = regex.exec(part)) !== null) {
      if (match.index > lastIndex) {
        subParts.push(part.substring(lastIndex, match.index));
      }
      const label = match[1];
      const url = match[2];
      const isInternal = url.startsWith("/");
      
      if (isInternal) {
        subParts.push(
          <Link key={`link-${match.index}`} href={url} className="text-[#13b5ea] hover:text-[#0e9fd2] font-semibold hover:underline transition-colors">
            {label}
          </Link>
        );
      } else {
        subParts.push(
          <a
            key={`link-${match.index}`}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#13b5ea] hover:text-[#0e9fd2] font-semibold hover:underline transition-colors inline-flex items-center gap-0.5"
          >
            {label}
          </a>
        );
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < part.length) {
      subParts.push(part.substring(lastIndex));
    }
    return subParts;
  });

  // 3. Handle inline code `code`
  parts = parts.flatMap((part) => {
    if (typeof part !== "string") return part;
    const subParts = [];
    const regex = /`([^`]+)`/g;
    let match;
    let lastIndex = 0;
    while ((match = regex.exec(part)) !== null) {
      if (match.index > lastIndex) {
        subParts.push(part.substring(lastIndex, match.index));
      }
      subParts.push(
        <code key={`code-${match.index}`} className="bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold font-mono px-1.5 py-0.5 rounded border border-slate-200">
          {match[1]}
        </code>
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < part.length) {
      subParts.push(part.substring(lastIndex));
    }
    return subParts;
  });

  return <React.Fragment>{parts}</React.Fragment>;
};

// ─── Block Markdown Parser Component ──────────────────────────────────────────

const renderMarkdownToReact = (markdown: string): React.ReactNode[] => {
  const lines = markdown.split("\n");
  const elements: React.ReactNode[] = [];
  
  let currentList: { type: "ul" | "ol"; items: string[] } | null = null;
  let currentTable: string[][] | null = null;
  let currentBlockquote: string[] | null = null;
  let currentParagraph: string[] = [];

  const flushParagraph = (key: string | number) => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(" ").trim();
      if (text) {
        elements.push(
          <p key={`p-${key}`} className="text-slate-600 text-base sm:text-lg leading-relaxed my-5 font-normal">
            {parseInlineMarkdown(text)}
          </p>
        );
      }
      currentParagraph = [];
    }
  };

  const flushList = (key: string | number) => {
    if (currentList) {
      const listKey = `list-${key}`;
      if (currentList.type === "ul") {
        elements.push(
          <ul key={listKey} className="list-disc pl-6 my-6 space-y-3 text-slate-600 text-base sm:text-lg">
            {currentList.items.map((item, idx) => (
              <li key={`${listKey}-${idx}`}>{parseInlineMarkdown(item)}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={listKey} className="list-decimal pl-6 my-6 space-y-3 text-slate-600 text-base sm:text-lg">
            {currentList.items.map((item, idx) => (
              <li key={`${listKey}-${idx}`}>{parseInlineMarkdown(item)}</li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  const flushTable = (key: string | number) => {
    if (currentTable && currentTable.length > 0) {
      const tableKey = `table-${key}`;
      const headers = currentTable[0];
      // Check if second row is a column alignment divider (e.g. :--- or ---)
      const hasDivider = currentTable.length > 1 && currentTable[1].every((cell) => cell.startsWith(":") || cell.startsWith("-") || cell.endsWith("-"));
      const dataRows = hasDivider ? currentTable.slice(2) : currentTable.slice(1);

      elements.push(
        <div key={tableKey} className="overflow-x-auto my-8 border border-slate-200/60 rounded-2xl shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {headers.map((header, headIdx) => (
                  <th key={`th-${headIdx}`} className="px-6 py-4 text-left text-xs font-extrabold text-slate-800 uppercase tracking-wider bg-slate-50/80">
                    {parseInlineMarkdown(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100 text-sm sm:text-base text-slate-600">
              {dataRows.map((row, rowIdx) => (
                <tr key={`tr-${rowIdx}`} className="hover:bg-slate-50/50 transition-colors">
                  {row.map((cell, cellIdx) => (
                    <td key={`td-${rowIdx}-${cellIdx}`} className="px-6 py-4 whitespace-normal font-medium align-middle">
                      {parseInlineMarkdown(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      currentTable = null;
    }
  };

  const flushBlockquote = (key: string | number) => {
    if (currentBlockquote && currentBlockquote.length > 0) {
      const blockquoteKey = `bq-${key}`;
      const combined = currentBlockquote.join("\n").trim();
      let alertType = "";
      let cleanText = combined;

      if (combined.startsWith("[!NOTE]")) {
        alertType = "note";
        cleanText = combined.replace("[!NOTE]", "").trim();
      } else if (combined.startsWith("[!TIP]")) {
        alertType = "tip";
        cleanText = combined.replace("[!TIP]", "").trim();
      } else if (combined.startsWith("[!IMPORTANT]")) {
        alertType = "important";
        cleanText = combined.replace("[!IMPORTANT]", "").trim();
      } else if (combined.startsWith("[!WARNING]")) {
        alertType = "warning";
        cleanText = combined.replace("[!WARNING]", "").trim();
      } else if (combined.startsWith("[!CAUTION]")) {
        alertType = "caution";
        cleanText = combined.replace("[!CAUTION]", "").trim();
      }

      if (alertType) {
        const alertClasses: Record<string, string> = {
          note: "bg-blue-50/40 border-l-4 border-blue-500 text-blue-900 p-5 rounded-r-2xl my-6 shadow-sm",
          tip: "bg-emerald-50/40 border-l-4 border-emerald-500 text-emerald-900 p-5 rounded-r-2xl my-6 shadow-sm",
          important: "bg-violet-50/40 border-l-4 border-violet-500 text-violet-900 p-5 rounded-r-2xl my-6 shadow-sm",
          warning: "bg-amber-50/40 border-l-4 border-amber-500 text-amber-900 p-5 rounded-r-2xl my-6 shadow-sm",
          caution: "bg-red-50/40 border-l-4 border-red-500 text-red-900 p-5 rounded-r-2xl my-6 shadow-sm",
        };
        elements.push(
          <div key={blockquoteKey} className={alertClasses[alertType]}>
            {renderMarkdownToReact(cleanText)}
          </div>
        );
      } else {
        elements.push(
          <blockquote key={blockquoteKey} className="border-l-4 border-[#13b5ea] pl-6 my-8 italic text-slate-500 text-base sm:text-lg leading-relaxed bg-slate-50/40 py-2 pr-4 rounded-r-lg">
            {renderMarkdownToReact(combined)}
          </blockquote>
        );
      }
      currentBlockquote = null;
    }
  };

  const flushAll = (key: string | number) => {
    flushParagraph(key);
    flushList(key);
    flushTable(key);
    flushBlockquote(key);
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty lines
    if (!trimmed) {
      flushAll(i);
      continue;
    }

    // Heading 1
    if (trimmed.startsWith("# ")) {
      flushAll(i);
      elements.push(
        <h1 key={`h1-${i}`} className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-10 mb-5 leading-tight tracking-tight">
          {parseInlineMarkdown(trimmed.substring(2))}
        </h1>
      );
      continue;
    }

    // Heading 2
    if (trimmed.startsWith("## ")) {
      flushAll(i);
      elements.push(
        <h2 key={`h2-${i}`} className="text-2xl sm:text-3xl font-bold text-slate-900 mt-12 mb-4 border-b border-slate-100 pb-3 tracking-tight">
          {parseInlineMarkdown(trimmed.substring(3))}
        </h2>
      );
      continue;
    }

    // Heading 3
    if (trimmed.startsWith("### ")) {
      flushAll(i);
      elements.push(
        <h3 key={`h3-${i}`} className="text-xl sm:text-2xl font-bold text-slate-900 mt-8 mb-3 tracking-tight">
          {parseInlineMarkdown(trimmed.substring(4))}
        </h3>
      );
      continue;
    }

    // Horizontal Rule
    if (trimmed === "---") {
      flushAll(i);
      elements.push(<hr key={`hr-${i}`} className="my-10 border-slate-200" />);
      continue;
    }

    // Blockquote
    if (line.startsWith(">")) {
      flushParagraph(i);
      flushList(i);
      flushTable(i);
      
      const content = line.substring(1).trim();
      if (!currentBlockquote) {
        currentBlockquote = [];
      }
      currentBlockquote.push(content);
      continue;
    }

    // Bullet list items
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      flushParagraph(i);
      flushTable(i);
      flushBlockquote(i);

      const content = trimmed.substring(2);
      if (!currentList || currentList.type !== "ul") {
        flushList(i);
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(content);
      continue;
    }

    // Numbered list items
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      flushParagraph(i);
      flushTable(i);
      flushBlockquote(i);

      const content = numMatch[2];
      if (!currentList || currentList.type !== "ol") {
        flushList(i);
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(content);
      continue;
    }

    // Tables
    if (trimmed.startsWith("|")) {
      flushParagraph(i);
      flushList(i);
      flushBlockquote(i);

      const cells = trimmed.split("|").map((c) => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      if (!currentTable) {
        currentTable = [];
      }
      currentTable.push(cells);
      continue;
    }

    // Default paragraph line
    flushList(i);
    flushTable(i);
    flushBlockquote(i);
    currentParagraph.push(line);
  }

  // End of document clean up
  flushAll("end");

  return elements;
};

// ─── Main Component ──────────────────────────────────────────────────────────

interface BlogDetailProps {
  slug: string;
}

export default function BlogDetail({ slug }: BlogDetailProps) {
  // Find current blog post
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between" style={{ fontFamily: "'Sora', sans-serif" }}>
        <div>
          <TopBar />
          <Nav scrollToBooking={() => window.location.href = "/#book-demo"} />
          <div className="max-w-md mx-auto text-center py-20 px-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Post Not Found</h1>
            <p className="text-slate-600 mb-8">The blog article you are looking for does not exist or has been relocated.</p>
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 bg-[#13b5ea] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0e9fd2] transition-colors"
            >
              <ArrowLeft size={16} /> Back to Blogs
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Find related posts
  const relatedPosts = blogPosts.filter((p) => post.related.includes(p.slug));

  // Find prev/next navigation
  const currentIndex = blogPosts.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  // JSON-LD structured data for the BlogPosting
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": `https://ledgerai.backoffice.digital${post.coverImage}`,
    "datePublished": "2026-06-25T10:00:00+00:00", // Standardized ISO dates
    "author": {
      "@type": "Person",
      "name": post.author.split(",")[0]
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ledger AI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ledgerai.backoffice.digital/favicon.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://ledgerai.backoffice.digital/blogs/${post.slug}`
    }
  };

  const handleScrollToBooking = () => {
    window.location.href = "/#book-demo";
  };

  return (
    <div className="min-h-screen bg-white font-sans" style={{ fontFamily: "'Sora', 'DM Sans', sans-serif" }}>
      <SEO
        title={post.seo.title}
        description={post.seo.description}
        canonicalUrl={post.seo.canonicalUrl}
        ogTitle={post.seo.ogTitle}
        ogDescription={post.seo.ogDescription}
        ogImage={`https://ledgerai.backoffice.digital${post.coverImage}`}
        jsonLd={jsonLdData}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
      `}</style>

      <TopBar />
      <Nav scrollToBooking={handleScrollToBooking} />

      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 py-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link href="/" className="hover:text-[#13b5ea] flex items-center gap-1 transition-colors">
              <Home size={12} /> Home
            </Link>
            <ChevronRight size={10} className="text-slate-400" />
            <Link href="/blogs" className="hover:text-[#13b5ea] transition-colors">
              Blogs
            </Link>
            <ChevronRight size={10} className="text-slate-400" />
            <span className="text-slate-800 line-clamp-1">{post.title}</span>
          </nav>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 pt-12 pb-20">
        {/* Header */}
        <header className="mb-10 text-left">
          <span className="bg-[#13b5ea]/10 text-[#13b5ea] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider inline-block mb-5">
            {post.category}
          </span>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {post.title}
          </h1>

          {/* Post details */}
          <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-slate-500 text-sm border-y border-slate-100 py-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                <User size={14} />
              </div>
              <span className="font-semibold text-slate-700">{post.author}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{post.publishedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>{post.readingTime} reading time</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="aspect-[21/9] rounded-3xl overflow-hidden mb-12 shadow-sm border border-slate-100 bg-slate-100">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="max-w-none text-slate-700 leading-relaxed font-sans select-text">
          {renderMarkdownToReact(post.content)}
        </div>

        {/* Pagination Navigation */}
        <div className="border-t border-slate-100 pt-10 mt-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          {prevPost ? (
            <Link
              href={`/blogs/${prevPost.slug}`}
              className="w-full sm:w-1/2 p-5 rounded-2xl border border-slate-100 hover:border-[#13b5ea] hover:shadow-lg hover:shadow-slate-100 transition-all flex flex-col items-start gap-1 group"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <ArrowLeft size={10} /> Previous Article
              </span>
              <span className="text-slate-800 font-bold text-sm sm:text-base leading-snug group-hover:text-[#13b5ea] transition-colors line-clamp-1">
                {prevPost.title}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block sm:w-1/2" />
          )}

          {nextPost ? (
            <Link
              href={`/blogs/${nextPost.slug}`}
              className="w-full sm:w-1/2 p-5 rounded-2xl border border-slate-100 hover:border-[#13b5ea] hover:shadow-lg hover:shadow-slate-100 transition-all flex flex-col items-end gap-1 group text-right"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                Next Article <ArrowRight size={10} />
              </span>
              <span className="text-slate-800 font-bold text-sm sm:text-base leading-snug group-hover:text-[#13b5ea] transition-colors line-clamp-1">
                {nextPost.title}
              </span>
            </Link>
          ) : (
            <div className="hidden sm:block sm:w-1/2" />
          )}
        </div>
      </article>

      {/* Related Articles Section */}
      {relatedPosts.length > 0 && (
        <section className="bg-slate-50 border-t border-slate-100 py-16">
          <div className="max-w-4xl mx-auto px-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">
              Related Articles
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {relatedPosts.map((rPost) => (
                <article
                  key={rPost.slug}
                  className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  <Link href={`/blogs/${rPost.slug}`} className="block aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={rPost.coverImage}
                      alt={rPost.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      loading="lazy"
                    />
                  </Link>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#13b5ea] uppercase tracking-wider block mb-2">
                        {rPost.category}
                      </span>
                      <h4 className="text-slate-900 font-bold text-base leading-snug mb-3 group-hover:text-[#13b5ea] transition-colors line-clamp-2">
                        <Link href={`/blogs/${rPost.slug}`}>{rPost.title}</Link>
                      </h4>
                    </div>
                    <Link
                      href={`/blogs/${rPost.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#13b5ea] hover:text-[#0e9fd2] mt-2"
                    >
                      Read Article <ArrowRight size={12} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Booking CTA Banner */}
      <section className="bg-white border-t border-slate-100 py-16 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 tracking-tight">
            Ready to Automate Your Bookkeeping?
          </h2>
          <p className="text-slate-600 mb-8 text-sm sm:text-base leading-relaxed">
            Eliminate manual data entries and secure HMRC and Companies House compliance automatically. Get started with Ledger AI.
          </p>
          <button
            onClick={handleScrollToBooking}
            className="inline-flex items-center justify-center gap-2 bg-[#13b5ea] text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-[#0e9fd2] transition-colors text-base shadow-lg shadow-[#13b5ea]/20 cursor-pointer"
          >
            Book a Live Demo <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
