"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Sparkles,
  Eye,
} from "lucide-react";
import { translations, Language } from "@/lib/supabaseMock";
import type { Post } from "@/lib/supabase/types";

export default function ArticlesSection({ lang }: { lang: Language }) {
  const isAr = lang === "ar";
  const t = translations[lang].articles;
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    let active = true;
    fetch("/api/posts?status=published&limit=6")
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        if (data?.success && Array.isArray(data.posts) && data.posts.length > 0) {
          const homePosts = data.posts.filter(
            (p: Post) => p.show_on_homepage !== false
          );
          setPosts((homePosts.length > 0 ? homePosts : data.posts).slice(0, 4));
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  if (posts.length === 0) return null;

  const featured = posts.find((p) => p.featured) || posts[0];
  const others = posts.filter((p) => p.id !== featured.id).slice(0, 3);

  const getTitle = (p: Post) => (isAr ? p.title : p.title_en || p.title);
  const getExcerpt = (p: Post) => (isAr ? p.excerpt : p.excerpt_en || p.excerpt);
  const getCategory = (p: Post) =>
    isAr ? p.category : p.category_en || p.category;
  const getAuthor = (p: Post) =>
    isAr ? p.author_name : p.author_name_en || p.author_name;

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(isAr ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "";
    }
  };

  return (
    <section
      id="articles"
      className="py-16 px-4 md:px-12 bg-background relative overflow-hidden"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-brand-action" />
              {t.badge}
            </span>
            <h2 className="text-[26px] md:text-[32px] leading-tight font-bold text-brand-primary">
              {t.title}
            </h2>
            <p className="text-sm md:text-base text-foreground/70 max-w-[650px]">
              {t.subtitle}
            </p>
          </div>

          <Link
            href={`/${lang}/articles`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold text-sm hover:bg-brand-action transition-all shadow-md hover:shadow-lg shrink-0 self-start md:self-auto"
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.viewMore}</span>
            {isAr ? (
              <ArrowLeft className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </Link>
        </motion.div>

        {/* Featured Article Hero Card */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              href={`/${lang}/articles/${featured.slug}`}
              className="group grid grid-cols-1 lg:grid-cols-12 rounded-2xl overflow-hidden bg-white border-2 border-brand-accent/40 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-64 sm:h-80 lg:h-full lg:col-span-6 min-h-[280px] overflow-hidden bg-muted">
                <Image
                  src={featured.cover_image}
                  alt={featured.image_alt || getTitle(featured)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 left-4 flex items-center justify-between gap-2">
                  <span className="px-3.5 py-1 rounded-full bg-brand-primary/90 backdrop-blur-md text-white text-xs font-bold shadow">
                    {getCategory(featured)}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-400/95 text-slate-950 text-xs font-bold shadow">
                    {isAr ? "مقال مميز" : "Featured"}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8 lg:col-span-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-foreground/60">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-action" />
                      {formatDate(featured.published_at)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-action" />
                      {featured.reading_time} {t.minRead}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-brand-action" />
                      {featured.views}{" "}
                      {isAr ? "مشاهدة" : "views"}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-brand-primary group-hover:text-brand-action transition-colors leading-snug">
                    {getTitle(featured)}
                  </h3>

                  <p className="text-sm md:text-base text-foreground/70 line-clamp-3 leading-relaxed">
                    {getExcerpt(featured)}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-border flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-brand-accent bg-brand-accent/20 shrink-0">
                      <Image
                        src={
                          featured.author_avatar ||
                          "https://i.ibb.co/h14mtXMx/IMG-20260728-WA0001.jpg"
                        }
                        alt={getAuthor(featured)}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-brand-primary">
                        {getAuthor(featured)}
                      </p>
                      <p className="text-[11px] text-foreground/50">
                        {isAr ? featured.author_role : featured.author_role_en}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-action group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                    {t.readMore}
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

        {/* Secondary Articles Grid */}
        {others.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {others.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
              >
                <Link
                  href={`/${lang}/articles/${post.slug}`}
                  className="group h-full flex flex-col rounded-2xl overflow-hidden bg-white border border-border hover:border-brand-accent shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-52 w-full overflow-hidden bg-muted">
                    <Image
                      src={post.cover_image}
                      alt={post.image_alt || getTitle(post)}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute top-3 right-3 left-3 flex justify-between items-center">
                      <span className="px-3 py-1 rounded-full bg-brand-primary/90 backdrop-blur-sm text-white text-[11px] font-bold">
                        {getCategory(post)}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 text-[11px] text-foreground/55">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-brand-action" />
                          {formatDate(post.published_at)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-brand-action" />
                          {post.reading_time} {t.minRead}
                        </span>
                      </div>

                      <h3 className="text-base md:text-lg font-bold text-brand-primary group-hover:text-brand-action transition-colors line-clamp-2 leading-snug">
                        {getTitle(post)}
                      </h3>

                      <p className="text-xs md:text-sm text-foreground/65 line-clamp-3 leading-relaxed">
                        {getExcerpt(post)}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-border/70 flex items-center justify-between text-xs font-bold text-brand-action">
                      <span>{t.readMore}</span>
                      {isAr ? (
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                      ) : (
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom View More Button (Mobile & Desktop emphasis) */}
        <div className="mt-10 flex justify-center">
          <Link
            href={`/${lang}/articles`}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-white border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-bold text-sm transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.viewMore}</span>
            {isAr ? (
              <ArrowLeft className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </Link>
        </div>
      </div>
    </section>
  );
}
