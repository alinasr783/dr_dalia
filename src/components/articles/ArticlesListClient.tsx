"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  Clock,
  Eye,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Tag,
  X,
  Home,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { clinicInfo, Language } from "@/lib/supabaseMock";
import type { Post } from "@/lib/supabase/types";

interface Props {
  initialPosts: Post[];
  lang: Language;
}

export default function ArticlesListClient({ initialPosts, lang }: Props) {
  const isAr = lang === "ar";
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTag, setSelectedTag] = useState<string>("");

  useEffect(() => {
    let active = true;
    fetch("/api/posts?status=published")
      .then((res) => res.json())
      .then((data) => {
        if (active && data?.success && Array.isArray(data.posts)) {
          setPosts(data.posts);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const getTitle = (p: Post) => (isAr ? p.title : p.title_en || p.title);
  const getExcerpt = (p: Post) => (isAr ? p.excerpt : p.excerpt_en || p.excerpt);
  const getCategory = (p: Post) =>
    isAr ? p.category : p.category_en || p.category;
  const getAuthor = (p: Post) =>
    isAr ? p.author_name : p.author_name_en || p.author_name;

  const categories = useMemo(() => {
    const map = new Map<string, { key: string; label: string; count: number }>();
    for (const p of posts) {
      const key = p.category;
      const label = getCategory(p);
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(key, { key, label, count: 1 });
      }
    }
    return Array.from(map.values());
  }, [posts, isAr]);

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (selectedCategory !== "all" && p.category !== selectedCategory) {
        return false;
      }
      if (
        selectedTag &&
        !p.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase())
      ) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matches =
          p.title.toLowerCase().includes(q) ||
          (p.title_en && p.title_en.toLowerCase().includes(q)) ||
          p.excerpt.toLowerCase().includes(q) ||
          (p.excerpt_en && p.excerpt_en.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [posts, selectedCategory, selectedTag, searchQuery]);

  const isFiltering =
    selectedCategory !== "all" || Boolean(selectedTag) || Boolean(searchQuery.trim());
  const featuredPost = !isFiltering
    ? filteredPosts.find((p) => p.featured) || filteredPosts[0]
    : null;
  const gridPosts = featuredPost
    ? filteredPosts.filter((p) => p.id !== featuredPost.id)
    : filteredPosts;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(isAr ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  const whatsappMessage = isAr
    ? "مرحباً دكتورة داليا عبد الموجود زارع، قرأت مقالاتكم الطبية وأود حجز موعد استشارة بدون ألم"
    : "Hello Dr. Dalia AbdElMougood Zariaa, I read your dental articles and would like to book a Painless consultation.";
  const whatsappUrl = `https://wa.me/${clinicInfo.whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar lang={lang} />

      <main className="flex-1 pt-28 pb-16 px-4 md:px-12">
        <div className="max-w-[1200px] mx-auto space-y-10">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs md:text-sm text-foreground/60"
          >
            <Link
              href={`/${lang}`}
              className="inline-flex items-center gap-1.5 hover:text-brand-primary transition-colors font-medium"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{isAr ? "الرئيسية" : "Home"}</span>
            </Link>
            {isAr ? (
              <ChevronLeft className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
            <span className="font-bold text-brand-primary">
              {isAr ? "المقالات الطبية والمدونة" : "Medical Articles & Blog"}
            </span>
          </nav>

          {/* Hero Banner */}
          <div className="relative rounded-3xl bg-gradient-to-br from-brand-primary via-[#085387] to-brand-action text-white p-8 md:p-12 overflow-hidden shadow-lg">
            <div className="relative z-10 max-w-3xl space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-brand-accent text-xs font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                {isAr
                  ? "موسوعة طب الأسنان بلا ألم"
                  : "Painless Dentistry Knowledge Hub"}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
                {isAr
                  ? "مقالات ونصائح د. داليا عبد الموجود زارع لابتسامة صحية بلا ألم"
                  : "Dr. Dalia AbdElMougood Zariaa's Dental Articles & Painless Care Guides"}
              </h1>
              <p className="text-sm md:text-base text-white/85 leading-relaxed">
                {isAr
                  ? "اكتشف أحدث المعلومات الطبية الموثوقة حول زراعة الأسنان، ابتسامة هوليود، علاج أسنان الأطفال بدون خوف، وحشو العصب في جلسة واحدة بدون ألم"
                  : "Explore evidence-based guides on painless dental implants, Hollywood Smile veneers, tear-free pediatric dentistry, and single-visit root canals."}
              </p>

              {/* Search Bar */}
              <div className="pt-2 max-w-xl">
                <div className="relative">
                  <Search className="w-5 h-5 text-brand-primary/60 absolute top-1/2 -translate-y-1/2 right-4 ltr:right-auto ltr:left-4 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      isAr
                        ? "ابحث عن موضوع طبي (مثل: زراعة الأسنان، فينيرز، أطفال، عصب...)"
                        : "Search articles (e.g., implants, veneers, kids, root canal...)"
                    }
                    className="w-full rounded-2xl bg-white text-foreground placeholder:text-foreground/45 py-3.5 pr-12 pl-10 ltr:pl-12 ltr:pr-10 text-sm font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute top-1/2 -translate-y-1/2 left-3.5 ltr:left-auto ltr:right-3.5 text-foreground/45 hover:text-foreground cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Subtle decorative circle */}
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-brand-accent/15 blur-3xl pointer-events-none" />
          </div>

          {/* Categories Filter Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSelectedTag("");
              }}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === "all" && !selectedTag
                  ? "bg-brand-primary text-white shadow-sm"
                  : "bg-white text-foreground/75 hover:bg-brand-accent/20 border border-border"
              }`}
            >
              {isAr ? "جميع المقالات" : "All Articles"} ({posts.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.key);
                  setSelectedTag("");
                }}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.key
                    ? "bg-brand-primary text-white shadow-sm"
                    : "bg-white text-foreground/75 hover:bg-brand-accent/20 border border-border"
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}

            {selectedTag && (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-action text-white text-xs font-bold">
                <Tag className="w-3.5 h-3.5" />
                {selectedTag}
                <button
                  type="button"
                  onClick={() => setSelectedTag("")}
                  className="hover:opacity-80 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
          </div>

          {/* Featured Article Card */}
          {featuredPost && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <Link
                href={`/${lang}/articles/${featuredPost.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden bg-white border-2 border-brand-accent/50 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-72 sm:h-80 lg:h-full min-h-[320px] lg:col-span-6 bg-muted overflow-hidden">
                  <Image
                    src={featuredPost.cover_image}
                    alt={featuredPost.image_alt || getTitle(featuredPost)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute top-4 right-4 left-4 flex items-center justify-between">
                    <span className="px-3.5 py-1.5 rounded-full bg-brand-primary/95 text-white text-xs font-bold shadow">
                      {getCategory(featuredPost)}
                    </span>
                    <span className="px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-bold shadow">
                      {isAr ? "مقال مميز" : "Featured Guide"}
                    </span>
                  </div>
                </div>

                <div className="p-6 md:p-10 lg:col-span-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-foreground/60">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-brand-action" />
                        {formatDate(featuredPost.published_at)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-brand-action" />
                        {featuredPost.reading_time}{" "}
                        {isAr ? "دقائق قراءة" : "min read"}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-brand-action" />
                        {featuredPost.views} {isAr ? "مشاهدة" : "views"}
                      </span>
                    </div>

                    <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-brand-primary group-hover:text-brand-action transition-colors leading-snug">
                      {getTitle(featuredPost)}
                    </h2>

                    <p className="text-sm md:text-base text-foreground/75 leading-relaxed line-clamp-3">
                      {getExcerpt(featuredPost)}
                    </p>

                    {featuredPost.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {featuredPost.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-lg bg-brand-accent/20 text-brand-primary text-[11px] font-semibold"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-6 mt-6 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border border-brand-accent shrink-0">
                        <Image
                          src={
                            featuredPost.author_avatar ||
                            "https://i.ibb.co/h14mtXMx/IMG-20260728-WA0001.jpg"
                          }
                          alt={getAuthor(featuredPost)}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-brand-primary">
                          {getAuthor(featuredPost)}
                        </p>
                        <p className="text-[11px] text-foreground/55">
                          {isAr
                            ? featuredPost.author_role
                            : featuredPost.author_role_en}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold group-hover:bg-brand-action transition-colors">
                      {isAr ? "اقرأ المقال" : "Read Article"}
                      {isAr ? (
                        <ArrowLeft className="w-4 h-4" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Articles Grid */}
          {gridPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridPosts.map((post, idx) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.06 }}
                  className="h-full"
                >
                  <Link
                    href={`/${lang}/articles/${post.slug}`}
                    className="group h-full flex flex-col rounded-2xl overflow-hidden bg-white border border-border hover:border-brand-accent shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-56 w-full bg-muted overflow-hidden">
                      <Image
                        src={post.cover_image}
                        alt={post.image_alt || getTitle(post)}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute top-3 right-3 left-3 flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-brand-primary/90 backdrop-blur-sm text-white text-[11px] font-bold">
                          {getCategory(post)}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-sm text-white text-[11px] inline-flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-xs text-foreground/55">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-brand-action" />
                            {formatDate(post.published_at)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-brand-action" />
                            {post.reading_time}{" "}
                            {isAr ? "دقائق قراءة" : "min read"}
                          </span>
                        </div>

                        <h2 className="text-lg font-bold text-brand-primary group-hover:text-brand-action transition-colors leading-snug line-clamp-2">
                          {getTitle(post)}
                        </h2>

                        <p className="text-xs md:text-sm text-foreground/70 line-clamp-3 leading-relaxed">
                          {getExcerpt(post)}
                        </p>
                      </div>

                      <div className="pt-4 mt-5 border-t border-border/80 flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground/65">
                          {getAuthor(post)}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-action">
                          {isAr ? "اقرأ المزيد" : "Read More"}
                          {isAr ? (
                            <ArrowLeft className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowRight className="w-3.5 h-3.5" />
                          )}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          ) : (
            !featuredPost && (
              <div className="rounded-2xl bg-white border border-border p-12 text-center space-y-4">
                <p className="text-lg font-bold text-brand-primary">
                  {isAr
                    ? "لا توجد مقالات مطابقة لبحثك حالياً"
                    : "No articles match your current filter"}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedTag("");
                  }}
                  className="px-5 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-bold hover:bg-brand-action transition-colors cursor-pointer"
                >
                  {isAr ? "عرض جميع المقالات" : "Show All Articles"}
                </button>
              </div>
            )
          )}

          {/* Consultation CTA Box */}
          <div className="rounded-3xl bg-white border-2 border-brand-accent/60 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2 text-center md:text-start">
              <h3 className="text-xl md:text-2xl font-extrabold text-brand-primary">
                {isAr
                  ? "هل لديك استفسار طبي حول صحة أو تجميل أسنانك؟"
                  : "Have a Question About Your Dental Health or Smile Makeover?"}
              </h3>
              <p className="text-sm text-foreground/70 max-w-2xl">
                {isAr
                  ? "تواصل مباشرة مع عيادة د. داليا عبد الموجود زارع في المعادي لحجز موعد فحص واستشارة شاملة بدون ألم"
                  : "Contact Dr. Dalia AbdElMougood Zariaa's clinic in Maadi directly to book a gentle, painless dental consultation."}
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn shrink-0"
            >
              <span>
                {isAr
                  ? "احجز استشارتك بلا ألم الآن"
                  : "Book Your Painless Consultation"}
              </span>
            </a>
          </div>
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
