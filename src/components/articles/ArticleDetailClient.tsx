"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Eye,
  Share2,
  Check,
  Home,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ListChecks,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Phone,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { clinicInfo, Language } from "@/lib/supabaseMock";
import type { Post } from "@/lib/supabase/types";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function injectHeadingIdsAndExtractToc(html: string): {
  processedHtml: string;
  toc: TocItem[];
} {
  const toc: TocItem[] = [];
  let index = 0;
  const processedHtml = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_match, levelStr, attrs, inner) => {
      const level = Number(levelStr);
      const plainText = inner.replace(/<[^>]*>/g, "").trim();
      const id = `section-${++index}`;
      if (plainText) {
        toc.push({ id, text: plainText, level });
      }
      return `<h${level}${attrs} id="${id}" class="scroll-mt-28">${inner}</h${level}>`;
    }
  );
  return { processedHtml, toc };
}

interface Props {
  post: Post;
  relatedPosts: Post[];
  lang: Language;
}

export default function ArticleDetailClient({
  post,
  relatedPosts,
  lang,
}: Props) {
  const isAr = lang === "ar";
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const title = isAr ? post.title : post.title_en || post.title;
  const excerpt = isAr ? post.excerpt : post.excerpt_en || post.excerpt;
  const rawContent = isAr ? post.content : post.content_en || post.content;
  const category = isAr ? post.category : post.category_en || post.category;
  const authorName = isAr
    ? post.author_name
    : post.author_name_en || post.author_name;
  const authorRole = isAr
    ? post.author_role
    : post.author_role_en || post.author_role;
  const takeaways =
    !isAr && post.key_takeaways_en && post.key_takeaways_en.length > 0
      ? post.key_takeaways_en
      : post.key_takeaways || [];

  const { processedHtml, toc } = useMemo(
    () => injectHeadingIdsAndExtractToc(rawContent),
    [rawContent]
  );

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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore
    }
  };

  const handleShareWhatsApp = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `${title}\n${url}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const bookingWhatsappMessage = isAr
    ? `مرحباً دكتورة داليا عبد الموجود زارع، قرأت مقال (${post.title}) وأود حجز موعد استشارة بدون ألم.`
    : `Hello Dr. Dalia AbdElMougood Zariaa, I read your article "${title}" and would like to book a Painless consultation.`;
  const bookingWhatsappUrl = `https://wa.me/${
    clinicInfo.whatsappNumber
  }?text=${encodeURIComponent(bookingWhatsappMessage)}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 z-[70] bg-brand-accent/25">
        <div
          className="h-full bg-gradient-to-r from-brand-primary to-brand-action transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <Navbar lang={lang} />

      <main className="flex-1 pt-28 pb-16 px-4 md:px-12">
        <div className="max-w-[1200px] mx-auto space-y-8">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-foreground/60"
          >
            <Link
              href={`/${lang}`}
              className="inline-flex items-center gap-1 hover:text-brand-primary transition-colors font-medium"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{isAr ? "الرئيسية" : "Home"}</span>
            </Link>
            {isAr ? (
              <ChevronLeft className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
            <Link
              href={`/${lang}/articles`}
              className="hover:text-brand-primary transition-colors font-medium"
            >
              {isAr ? "المقالات الطبية" : "Medical Articles"}
            </Link>
            {isAr ? (
              <ChevronLeft className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
            <span className="text-brand-action font-semibold">{category}</span>
            {isAr ? (
              <ChevronLeft className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
            <span className="font-bold text-brand-primary line-clamp-1 max-w-[260px] sm:max-w-md">
              {title}
            </span>
          </nav>

          {/* Article Header Card */}
          <header className="rounded-3xl bg-white border border-border shadow-sm p-6 md:p-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3.5 py-1.5 rounded-full bg-brand-primary text-white text-xs font-bold">
                  {category}
                </span>
                {post.featured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-400/90 text-slate-950 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    {isAr ? "مقال مميز" : "Featured"}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{isAr ? "مشاركة واتساب" : "Share on WhatsApp"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{isAr ? "تم النسخ!" : "Copied!"}</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{isAr ? "نسخ الرابط" : "Copy Link"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-primary leading-tight">
              {title}
            </h1>

            <p className="text-base md:text-lg text-foreground/75 leading-relaxed">
              {excerpt}
            </p>

            {/* Author & Meta Bar */}
            <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-brand-accent shrink-0">
                  <Image
                    src={
                      post.author_avatar ||
                      "https://i.ibb.co/h14mtXMx/IMG-20260728-WA0001.jpg"
                    }
                    alt={authorName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-brand-primary">
                    {authorName}
                  </p>
                  <p className="text-xs text-foreground/60">{authorRole}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-foreground/60">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-brand-action" />
                  {formatDate(post.published_at)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-action" />
                  {post.reading_time} {isAr ? "دقائق قراءة" : "min read"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-brand-action" />
                  {post.views} {isAr ? "مشاهدة" : "views"}
                </span>
              </div>
            </div>

            {/* Cover Image */}
            <figure className="space-y-2">
              <div className="relative h-72 sm:h-96 md:h-[460px] w-full rounded-2xl overflow-hidden bg-muted border border-border">
                <Image
                  src={post.cover_image}
                  alt={post.image_alt || title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1200px) 100vw, 1200px"
                />
              </div>
              {post.image_caption && (
                <figcaption className="text-center text-xs text-foreground/55 italic">
                  {post.image_caption}
                </figcaption>
              )}
            </figure>
          </header>

          {/* Main 2-Column Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Article Body Column */}
            <article className="lg:col-span-8 space-y-8">
              {/* Key Takeaways Box */}
              {takeaways.length > 0 && (
                <div className="rounded-2xl bg-gradient-to-br from-brand-primary/5 via-brand-accent/15 to-white border-2 border-brand-accent/60 p-6 md:p-7 space-y-4">
                  <div className="flex items-center gap-2.5 text-brand-primary font-extrabold text-base md:text-lg">
                    <ListChecks className="w-5 h-5 text-brand-action shrink-0" />
                    <h2>
                      {isAr
                        ? "أهم النقاط المستفادة من هذا المقال"
                        : "Key Takeaways from This Guide"}
                    </h2>
                  </div>
                  <ul className="space-y-2.5">
                    {takeaways.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-sm md:text-base text-foreground/85"
                      >
                        <CheckCircle2 className="w-5 h-5 text-brand-action shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Rich Article Body */}
              <div className="rounded-3xl bg-white border border-border p-6 sm:p-8 md:p-10 shadow-sm">
                <div
                  className="article-rich-content space-y-5 text-foreground/85 leading-relaxed text-base md:text-[17px] [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-extrabold [&_h2]:text-brand-primary [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-brand-accent/40 [&_h3]:text-lg [&_h3]:md:text-xl [&_h3]:font-bold [&_h3]:text-brand-action [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:leading-8 [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:space-y-2.5 [&_ol]:list-decimal [&_ol]:ps-6 [&_ol]:space-y-2.5 [&_li]:leading-7 [&_strong]:text-brand-primary [&_strong]:font-bold [&_blockquote]:border-s-4 [&_blockquote]:border-brand-action [&_blockquote]:bg-brand-accent/15 [&_blockquote]:p-5 [&_blockquote]:rounded-2xl [&_blockquote]:italic [&_blockquote]:text-brand-primary [&_blockquote]:font-medium [&_a]:text-brand-action [&_a]:underline [&_img]:rounded-2xl [&_img]:my-6"
                  dangerouslySetInnerHTML={{ __html: processedHtml }}
                />
              </div>

              {/* FAQ Section */}
              {post.faqs && post.faqs.length > 0 && (
                <section className="rounded-3xl bg-white border border-border p-6 sm:p-8 md:p-10 shadow-sm space-y-6">
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-6 h-6 text-brand-action" />
                    <h2 className="text-xl md:text-2xl font-extrabold text-brand-primary">
                      {isAr
                        ? "الأسئلة الشائعة حول الموضوع"
                        : "Frequently Asked Questions"}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {post.faqs.map((faq, idx) => {
                      const isOpen = openFaqIdx === idx;
                      const qText = isAr
                        ? faq.question
                        : faq.question_en || faq.question;
                      const aText = isAr
                        ? faq.answer
                        : faq.answer_en || faq.answer;
                      return (
                        <div
                          key={idx}
                          className="rounded-2xl border border-border overflow-hidden bg-background/40"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setOpenFaqIdx(isOpen ? null : idx)
                            }
                            className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-start font-bold text-brand-primary hover:bg-brand-accent/15 transition-colors cursor-pointer"
                          >
                            <span className="text-sm md:text-base">{qText}</span>
                            <ChevronDown
                              className={`w-5 h-5 shrink-0 text-brand-action transition-transform duration-200 ${
                                isOpen ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-5 md:px-5 text-sm md:text-base text-foreground/75 leading-relaxed border-t border-border/60 pt-3 bg-white">
                              {aText}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="rounded-2xl bg-white border border-border p-5 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-foreground/60 me-2">
                    {isAr ? "الكلمات المفتاحية:" : "Tags:"}
                  </span>
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/${lang}/articles`}
                      className="px-3 py-1.5 rounded-xl bg-brand-accent/20 hover:bg-brand-primary hover:text-white text-brand-primary text-xs font-bold transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Author Bio & Clinic CTA Card */}
              <div className="rounded-3xl bg-gradient-to-br from-brand-primary to-[#09568A] text-white p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-brand-accent shrink-0 shadow-md">
                  <Image
                    src={
                      post.author_avatar ||
                      "https://i.ibb.co/h14mtXMx/IMG-20260728-WA0001.jpg"
                    }
                    alt={authorName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-3 text-center sm:text-start flex-1">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-accent">
                      {isAr ? "إشراف ومراجعة طبية" : "Medically Reviewed By"}
                    </span>
                    <h3 className="text-xl font-extrabold">{authorName}</h3>
                    <p className="text-xs text-brand-accent/90 font-medium">
                      {authorRole}
                    </p>
                  </div>
                  <p className="text-xs md:text-sm text-white/85 leading-relaxed">
                    {isAr
                      ? "خبرة تمتد لأكثر من 20 عاماً في طب وجراحة وتجميل الأسنان بدون ألم في المعادي. نهتم بتقديم تجربة علاجية هادئة ومريحة للكبار والأطفال بأحدث الأجهزة العالمية."
                      : "Over 20 years of clinical excellence in painless restorative, cosmetic, and pediatric dentistry in Maadi, Cairo."}
                  </p>
                  <div className="pt-2">
                    <a
                      href={bookingWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-xs md:text-sm shadow transition-all"
                    >
                      <span>
                        {isAr
                          ? "احجز موعدك الآن مع د. داليا عبر واتساب"
                          : "Book an Appointment with Dr. Dalia on WhatsApp"}
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </article>

            {/* Sticky Sidebar */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              {/* Table of Contents */}
              {toc.length > 0 && (
                <div className="rounded-2xl bg-white border border-border p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 font-extrabold text-brand-primary text-base border-b border-border pb-3">
                    <BookOpen className="w-4 h-4 text-brand-action" />
                    <span>
                      {isAr ? "فهرس محتويات المقال" : "Table of Contents"}
                    </span>
                  </div>
                  <nav className="space-y-2">
                    {toc.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block text-xs md:text-sm hover:text-brand-action transition-colors leading-snug ${
                          item.level === 3
                            ? "ps-4 text-foreground/65"
                            : "font-semibold text-foreground/85"
                        }`}
                      >
                        • {item.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Quick Clinic Booking Card */}
              <div className="rounded-2xl bg-white border-2 border-brand-accent/60 p-6 shadow-sm space-y-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-brand-action uppercase">
                    {isAr ? "عيادة طب أسنان بلا ألم" : "Painless Dental Care"}
                  </span>
                  <h3 className="text-lg font-extrabold text-brand-primary">
                    {isAr
                      ? "احجز استشارتك مع د. داليا"
                      : "Book Your Painless Visit"}
                  </h3>
                  <p className="text-xs text-foreground/65 leading-relaxed">
                    {isAr
                      ? "فحص شامل وخطة علاجية دقيقة بدون ألم في قلب المعادي."
                      : "Comprehensive dental checkup and personalized painless care in Maadi."}
                  </p>
                </div>

                <div className="space-y-2.5 text-xs text-foreground/75 pt-2 border-t border-border">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-brand-action shrink-0 mt-0.5" />
                    <span>
                      {isAr
                        ? "45 شارع النصر، المعادي، القاهرة"
                        : "45 Al Nasr Street, Maadi, Cairo"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brand-action shrink-0" />
                    <span dir="ltr">+20 111 252 1494</span>
                  </div>
                </div>

                <a
                  href={bookingWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full whatsapp-btn !py-3 !px-4 !text-sm"
                >
                  <span>
                    {isAr ? "تواصل عبر واتساب الآن" : "Chat on WhatsApp Now"}
                  </span>
                </a>
              </div>
            </aside>
          </div>

          {/* Related Articles Section */}
          {relatedPosts.length > 0 && (
            <section className="pt-8 border-t border-border space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-extrabold text-brand-primary">
                  {isAr ? "مقالات طبية أخرى قد تهمك" : "Related Dental Articles"}
                </h2>
                <Link
                  href={`/${lang}/articles`}
                  className="inline-flex items-center gap-1.5 text-xs md:text-sm font-bold text-brand-action hover:underline"
                >
                  <span>{isAr ? "عرض جميع المقالات" : "View All Articles"}</span>
                  {isAr ? (
                    <ArrowLeft className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rel) => {
                  const relTitle = isAr
                    ? rel.title
                    : rel.title_en || rel.title;
                  const relExcerpt = isAr
                    ? rel.excerpt
                    : rel.excerpt_en || rel.excerpt;
                  const relCat = isAr
                    ? rel.category
                    : rel.category_en || rel.category;
                  return (
                    <Link
                      key={rel.id}
                      href={`/${lang}/articles/${rel.slug}`}
                      className="group rounded-2xl overflow-hidden bg-white border border-border hover:border-brand-accent shadow-sm hover:shadow-lg transition-all flex flex-col"
                    >
                      <div className="relative h-48 w-full bg-muted overflow-hidden">
                        <Image
                          src={rel.cover_image}
                          alt={rel.image_alt || relTitle}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-brand-primary/90 text-white text-[11px] font-bold">
                          {relCat}
                        </span>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                          <h3 className="text-base font-bold text-brand-primary group-hover:text-brand-action transition-colors line-clamp-2">
                            {relTitle}
                          </h3>
                          <p className="text-xs text-foreground/65 line-clamp-2">
                            {relExcerpt}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-action pt-2">
                          {isAr ? "اقرأ المقال" : "Read Article"}
                          {isAr ? (
                            <ArrowLeft className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowRight className="w-3.5 h-3.5" />
                          )}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
