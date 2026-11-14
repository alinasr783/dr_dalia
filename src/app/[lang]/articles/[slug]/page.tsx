import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostByIdOrSlug, listPosts } from "@/lib/supabase/db";
import { SITE_URL } from "@/lib/supabase/config";
import type { Language } from "@/lib/supabaseMock";
import ArticleDetailClient from "@/components/articles/ArticleDetailClient";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const isAr = lang === "ar";
  const post = await getPostByIdOrSlug(slug);

  if (!post) {
    return {
      title: isAr ? "المقال غير موجود | د. داليا عبد الموجود" : "Article Not Found | Dr. Dalia",
      robots: { index: false, follow: true },
    };
  }

  const title = isAr
    ? post.seo_title || `${post.title} | د. داليا عبد الموجود زارع`
    : post.title_en
    ? `${post.title_en} | Dr. Dalia AbdElMougood Zariaa`
    : `${post.title} | Dr. Dalia AbdElMougood Zariaa`;

  const description = isAr
    ? post.seo_description || post.excerpt
    : post.excerpt_en || post.seo_description || post.excerpt;

  const canonicalUrl = `${SITE_URL}/${isAr ? "ar" : "en"}/articles/${post.slug}`;

  return {
    title,
    description,
    keywords: [
      ...(post.tags || []),
      post.focus_keyword || "",
      post.category,
      "دكتورة داليا عبد الموجود زارع",
      "عيادة أسنان المعادي",
      "طب أسنان بلا ألم",
    ].filter(Boolean),
    authors: [
      {
        name: isAr ? post.author_name : post.author_name_en || post.author_name,
        url: `${SITE_URL}/${isAr ? "ar" : "en"}`,
      },
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "ar-EG": `${SITE_URL}/ar/articles/${post.slug}`,
        "en-US": `${SITE_URL}/en/articles/${post.slug}`,
        "x-default": `${SITE_URL}/ar/articles/${post.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: isAr
        ? "عيادة د. داليا عبد الموجود زارع لطب الأسنان"
        : "Dr. Dalia AbdElMougood Zariaa Dental Clinic",
      locale: isAr ? "ar_EG" : "en_US",
      type: "article",
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: [isAr ? post.author_name : post.author_name_en || post.author_name],
      section: isAr ? post.category : post.category_en || post.category,
      tags: post.tags,
      images: [
        {
          url: post.cover_image,
          width: 1200,
          height: 630,
          alt: post.image_alt || title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.cover_image],
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const currentLang: Language = lang === "ar" ? "ar" : "en";
  const isAr = currentLang === "ar";

  const post = await getPostByIdOrSlug(slug);
  if (!post) {
    notFound();
  }

  const { posts: allPublished } = await listPosts({
    status: "published",
    limit: 20,
  });

  const relatedPosts = allPublished
    .filter((p) => p.id !== post.id)
    .sort((a, b) => {
      const aSameCat = a.category === post.category ? 1 : 0;
      const bSameCat = b.category === post.category ? 1 : 0;
      return bSameCat - aSameCat;
    })
    .slice(0, 3);

  const articleTitle = isAr ? post.title : post.title_en || post.title;
  const articleDesc = isAr ? post.excerpt : post.excerpt_en || post.excerpt;
  const articleUrl = `${SITE_URL}/${currentLang}/articles/${post.slug}`;

  const graph: Record<string, unknown>[] = [
    {
      "@type": ["Article", "MedicalWebPage", "BlogPosting"],
      "@id": `${articleUrl}#article`,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": articleUrl,
      },
      headline: articleTitle,
      description: articleDesc,
      image: [post.cover_image],
      datePublished: post.published_at,
      dateModified: post.updated_at,
      inLanguage: isAr ? "ar-EG" : "en-US",
      articleSection: isAr ? post.category : post.category_en || post.category,
      keywords: (post.tags || []).join(", "),
      author: {
        "@type": "Physician",
        name: isAr ? post.author_name : post.author_name_en || post.author_name,
        jobTitle: isAr ? post.author_role : post.author_role_en || post.author_role,
        image: post.author_avatar,
        url: `${SITE_URL}/${currentLang}`,
      },
      publisher: {
        "@type": "Dentist",
        name: isAr
          ? "عيادة د. داليا عبد الموجود زارع لطب الأسنان"
          : "Dr. Dalia AbdElMougood Zariaa Dental Clinic",
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo.svg`,
        },
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: isAr ? "الرئيسية" : "Home",
          item: `${SITE_URL}/${currentLang}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: isAr ? "المقالات الطبية" : "Medical Articles",
          item: `${SITE_URL}/${currentLang}/articles`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: articleTitle,
          item: articleUrl,
        },
      ],
    },
  ];

  if (post.faqs && post.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: post.faqs.map((faq) => ({
        "@type": "Question",
        name: isAr ? faq.question : faq.question_en || faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: isAr ? faq.answer : faq.answer_en || faq.answer,
        },
      })),
    });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnalyticsTracker articleSlug={post.slug} />
      <ArticleDetailClient
        post={post}
        relatedPosts={relatedPosts}
        lang={currentLang}
      />
    </>
  );
}
