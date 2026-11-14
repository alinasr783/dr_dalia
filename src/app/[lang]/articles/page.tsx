import type { Metadata } from "next";
import { listPosts } from "@/lib/supabase/db";
import { SITE_URL } from "@/lib/supabase/config";
import type { Language } from "@/lib/supabaseMock";
import ArticlesListClient from "@/components/articles/ArticlesListClient";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const isAr = lang === "ar";

  const title = isAr
    ? "المقالات الطبية وموسوعة طب الأسنان بلا ألم | د. داليا عبد الموجود زارع"
    : "Medical Articles & Painless Dentistry Guide | Dr. Dalia AbdElMougood Zariaa";

  const description = isAr
    ? "اقرأ أحدث المقالات والنصائح الطبية الموثوقة من د. داليا عبد الموجود زارع استشاري طب وجراحة الأسنان بالقصر العيني بالمعادي: زراعة الأسنان، ابتسامة هوليود، أسنان الأطفال، وعلاج العصب بدون ألم."
    : "Read expert clinical dental guides and painless oral care articles by Dr. Dalia AbdElMougood Zariaa (Qasr El Ainy Dental Consultant in Maadi, Cairo) on dental implants, veneers, pediatric care, and root canals.";

  return {
    title,
    description,
    keywords: [
      "مقالات طب الأسنان",
      "دكتورة داليا عبد الموجود زارع",
      "زراعة الأسنان بدون ألم المعادي",
      "علاج أسنان الأطفال بدون خوف",
      "ابتسامة هوليود وفينيرز",
      "حشو العصب بدون ألم",
      "توريد اللثة بالليزر",
      "نصائح صحة الفم والأسنان",
      "Dr. Dalia Dental Articles",
      "Painless Dentistry Blog Maadi Cairo",
      "Dental Care Guides Egypt",
    ],
    alternates: {
      canonical: `${SITE_URL}/${isAr ? "ar" : "en"}/articles`,
      languages: {
        "ar-EG": `${SITE_URL}/ar/articles`,
        ar: `${SITE_URL}/ar/articles`,
        "en-US": `${SITE_URL}/en/articles`,
        en: `${SITE_URL}/en/articles`,
        "x-default": `${SITE_URL}/ar/articles`,
      },
      types: {
        "application/rss+xml": `${SITE_URL}/feed.xml`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${isAr ? "ar" : "en"}/articles`,
      siteName: isAr
        ? "عيادة د. داليا عبد الموجود زارع لطب الأسنان"
        : "Dr. Dalia AbdElMougood Zariaa Dental Clinic",
      locale: isAr ? "ar_EG" : "en_US",
      alternateLocale: isAr ? ["en_US"] : ["ar_EG"],
      type: "website",
      images: [
        {
          url: `${SITE_URL}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/opengraph-image`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function ArticlesPage({ params }: PageProps) {
  const { lang } = await params;
  const currentLang: Language = lang === "ar" ? "ar" : "en";
  const isAr = currentLang === "ar";
  const pageUrl = `${SITE_URL}/${currentLang}/articles`;

  const { posts } = await listPosts({ status: "published", limit: 100 });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Blog", "CollectionPage"],
        "@id": `${pageUrl}#blog`,
        name: isAr
          ? "موسوعة ومدونة د. داليا عبد الموجود زارع لطب الأسنان بدون ألم"
          : "Dr. Dalia AbdElMougood Zariaa Painless Dentistry Blog & Encyclopedia",
        description: isAr
          ? "دليل طبي متكامل ومقالات موثوقة في زراعة وتجميل وعلاج الأسنان بدون ألم"
          : "Comprehensive medical guides and expert clinical articles on painless dental care",
        url: pageUrl,
        inLanguage: isAr ? "ar-EG" : "en-US",
        publisher: {
          "@type": "Dentist",
          name: isAr
            ? "د. داليا عبد الموجود زارع"
            : "Dr. Dalia AbdElMougood Zariaa",
          url: `${SITE_URL}/${currentLang}`,
        },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: posts.map((p, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${pageUrl}/${p.slug}`,
            name: isAr ? p.title : p.title_en || p.title,
          })),
        },
        blogPost: posts.map((p) => ({
          "@type": "BlogPosting",
          headline: isAr ? p.title : p.title_en || p.title,
          description: isAr ? p.excerpt : p.excerpt_en || p.excerpt,
          url: `${pageUrl}/${p.slug}`,
          image: p.cover_image,
          datePublished: p.published_at,
          dateModified: p.updated_at || p.published_at,
          author: {
            "@type": "Physician",
            name: isAr
              ? p.author_name
              : p.author_name_en || p.author_name,
            jobTitle: isAr
              ? p.author_role
              : p.author_role_en || p.author_role,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
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
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnalyticsTracker />
      <ArticlesListClient initialPosts={posts} lang={currentLang} />
    </>
  );
}
