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
    : "Medical Articles & Painless Dentistry Blog | Dr. Dalia AbdElMougood Zariaa";

  const description = isAr
    ? "اقرأ أحدث المقالات والنصائح الطبية الموثوقة من د. داليا عبد الموجود زارع استشاري طب وجراحة الأسنان بالقصر العيني حول زراعة الأسنان، ابتسامة هوليود، أسنان الأطفال، وعلاج العصب بدون ألم."
    : "Read expert dental articles and painless oral care guides by Dr. Dalia AbdElMougood Zariaa (Qasr El Ainy Dental Consultant) on dental implants, Hollywood Smile veneers, pediatric dentistry, and root canals.";

  return {
    title,
    description,
    keywords: [
      "مقالات طب الأسنان",
      "دكتورة داليا عبد الموجود زارع",
      "زراعة الأسنان بدون ألم",
      "علاج أسنان الأطفال بدون خوف",
      "ابتسامة هوليود المعادي",
      "حشو العصب بدون ألم",
      "توريد اللثة بالليزر",
      "Dr. Dalia Dental Articles",
      "Painless Dentistry Blog Maadi Cairo",
    ],
    alternates: {
      canonical: `${SITE_URL}/${isAr ? "ar" : "en"}/articles`,
      languages: {
        "ar-EG": `${SITE_URL}/ar/articles`,
        "en-US": `${SITE_URL}/en/articles`,
        "x-default": `${SITE_URL}/ar/articles`,
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
      type: "website",
      images: [
        {
          url: "https://i.ibb.co/h14mtXMx/IMG-20260728-WA0001.jpg",
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
      images: ["https://i.ibb.co/h14mtXMx/IMG-20260728-WA0001.jpg"],
    },
  };
}

export default async function ArticlesPage({ params }: PageProps) {
  const { lang } = await params;
  const currentLang: Language = lang === "ar" ? "ar" : "en";
  const isAr = currentLang === "ar";

  const { posts } = await listPosts({ status: "published", limit: 100 });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${SITE_URL}/${currentLang}/articles#blog`,
        name: isAr
          ? "مدونة وموسوعة عيادة د. داليا عبد الموجود زارع لطب الأسنان بلا ألم"
          : "Dr. Dalia AbdElMougood Zariaa Painless Dentistry Blog",
        description: isAr
          ? "مقالات طبية متخصصة في طب وجراحة وتجميل الأسنان بدون ألم"
          : "Expert clinical articles on painless dentistry and smile aesthetics",
        url: `${SITE_URL}/${currentLang}/articles`,
        inLanguage: isAr ? "ar-EG" : "en-US",
        publisher: {
          "@type": "Dentist",
          name: isAr
            ? "د. داليا عبد الموجود زارع"
            : "Dr. Dalia AbdElMougood Zariaa",
          url: `${SITE_URL}/${currentLang}`,
        },
        blogPost: posts.map((p) => ({
          "@type": "BlogPosting",
          headline: isAr ? p.title : p.title_en || p.title,
          description: isAr ? p.excerpt : p.excerpt_en || p.excerpt,
          url: `${SITE_URL}/${currentLang}/articles/${p.slug}`,
          image: p.cover_image,
          datePublished: p.published_at,
          dateModified: p.updated_at,
          author: {
            "@type": "Person",
            name: isAr ? p.author_name : p.author_name_en || p.author_name,
          },
        })),
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
