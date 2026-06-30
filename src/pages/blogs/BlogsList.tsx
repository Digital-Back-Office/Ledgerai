import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Home, ChevronRight, Search, Sparkles } from "lucide-react";
import { blogPosts } from "../../data/blogs";
import { Link } from "../../components/Link";
import { SEO } from "../../components/SEO";
import { TopBar } from "../../components/hero/TopBar";
import { Nav } from "../../components/hero/Nav";
import { Footer } from "../../components/hero/Footer";

export default function BlogsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Get unique categories for filtering
  const categories = ["All", ...Array.from(new Set(blogPosts.map((post) => post.category)))];

  // Filter posts based on search and category selection
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // JSON-LD structured data for the Blog page
  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Accounting & Bookkeeping Insights | Ledger AI",
    "description": "Expert financial guidance, compliance advice, tax tips, and bookkeeping strategies for UK startups, SMEs, and growing businesses.",
    "url": "https://ledgerai.backoffice.digital/blogs",
    "publisher": {
      "@type": "Organization",
      "name": "Ledger AI",
      "logo": {
        "@type": "ImageObject",
        "url": "https://ledgerai.backoffice.digital/favicon.svg"
      }
    },
    "blogPost": blogPosts.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "image": `https://ledgerai.backoffice.digital${post.coverImage}`,
      "datePublished": "2026-06-25T10:00:00+00:00", // Standardised ISO format
      "author": {
        "@type": "Person",
        "name": post.author.split(",")[0]
      },
      "url": `https://ledgerai.backoffice.digital/blogs/${post.slug}`
    }))
  };

  // Nav scroll handler - if on blogs, navigate to homepage booking section
  const handleScrollToBooking = () => {
    window.location.href = "/#book-demo";
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans" style={{ fontFamily: "'Sora', 'DM Sans', sans-serif" }}>
      <SEO
        title="Accounting & Bookkeeping Insights | Ledger AI"
        description="Expert financial guidance, compliance advice, tax tips, and bookkeeping strategies for UK startups, SMEs, and growing businesses."
        canonicalUrl="https://ledgerai.backoffice.digital/blogs"
        ogTitle="Accounting & Bookkeeping Insights | Ledger AI"
        ogDescription="Explore expert financial guidance, compliance advice, and bookkeeping strategies for UK businesses."
        jsonLd={jsonLdData}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
      `}</style>

      <TopBar />
      <Nav scrollToBooking={handleScrollToBooking} />

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-10">
          <Link href="/" className="hover:text-[#13b5ea] flex items-center gap-1 transition-colors">
            <Home size={12} /> Home
          </Link>
          <ChevronRight size={10} className="text-slate-400" />
          <span className="text-slate-800">Blogs</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-[#13b5ea]/10 text-[#13b5ea] text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest"
          >
            <Sparkles size={12} /> Expert Resources
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-5 leading-tight"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Accounting & <span className="text-[#13b5ea]">Bookkeeping</span> Insights
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 leading-relaxed"
          >
            Explore expert financial guidance, compliance advice, tax calculations, and bookkeeping strategies tailored specifically for UK startups, SMEs, and growing businesses.
          </motion.p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-xs font-semibold px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === category
                    ? "bg-[#13b5ea] text-white shadow-sm shadow-[#13b5ea]/25"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-sm pl-11 pr-4 py-2.5 rounded-xl border border-slate-100 focus:outline-none focus:border-[#13b5ea] focus:bg-white transition-all placeholder-slate-400"
            />
          </div>
        </div>

        {/* Blogs Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-100 hover:-translate-y-1 transition-all overflow-hidden"
              >
                {/* Featured Image */}
                <Link href={`/blogs/${post.slug}`} className="block aspect-video overflow-hidden bg-slate-100 relative">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {post.category}
                    </span>
                  </div>
                </Link>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    {/* Date and Reading Time */}
                    <div className="flex items-center gap-4 text-slate-400 text-[11px] font-medium mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {post.publishedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {post.readingTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-slate-900 font-bold text-lg leading-snug mb-3 group-hover:text-[#13b5ea] transition-colors line-clamp-2">
                      <Link href={`/blogs/${post.slug}`}>{post.title}</Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Read More Link */}
                  <div>
                    <Link
                      href={`/blogs/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#13b5ea] group-hover:text-[#0e9fd2] transition-colors"
                    >
                      Read More <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm mb-20">
            <p className="text-slate-500 text-base mb-2">No articles match your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="text-[#13b5ea] font-semibold text-sm hover:underline"
            >
              Clear filters and search
            </button>
          </div>
        )}

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl mb-12">
          {/* Graphic Accents */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-[#13b5ea]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-2xl mx-auto text-center">
            <span className="text-[#13b5ea] text-xs font-bold uppercase tracking-wider block mb-4">Streamline operations</span>
            <h2 className="text-3xl font-bold mb-4 tracking-tight leading-tight">Automate Your Bookkeeping & Stay Compliant</h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              Join modern UK businesses scaling rapidly with AI-driven transaction ingestion, automated general ledger categorization, and error-free tax calculations.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleScrollToBooking}
                className="w-full sm:w-auto bg-[#13b5ea] hover:bg-[#0e9fd2] text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-[#13b5ea]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                Book a Demo <ArrowRight size={16} />
              </button>
              <Link
                href="/#features"
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-8 py-3.5 rounded-xl transition-all border border-slate-700 flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
