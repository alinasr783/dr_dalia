import type { Metadata } from "next";
import { SITE_URL } from "@/lib/supabase/config";
import AnalyticsTracker from "@/components/AnalyticsTracker";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isAr = lang !== "en";

  const title = isAr
    ? "عيادة د. داليا عبد الموجود زارع | أفضل استشاري طب وتجميل وزراعة الأسنان بالمعادي"
    : "Dr. Dalia AbdElMougood Zariaa | Premier Dental Implant & Cosmetic Clinic in Maadi, Cairo";

  const description = isAr
    ? "عيادة الدكتورة داليا عبد الموجود زارع لطب وجراحة وتجميل وزراعة الأسنان بالمعادي، القاهرة. خبرة متميزة في ابتسامة هوليود، الفينيرز، زراعة الأسنان الفورية، تبييض الليزر، وعلاج الجذور بدون ألم."
    : "Experience world-class painless dental care at Dr. Dalia AbdElMougood Zariaa Dental Clinic in Maadi, Cairo. Specializing in Dental Implants, Hollywood Smile Veneers, Laser Whitening, Orthodontics & Painless Root Canal.";

  const canonicalUrl = `${SITE_URL}/${isAr ? "ar" : "en"}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "ar-EG": `${SITE_URL}/ar`,
        ar: `${SITE_URL}/ar`,
        "en-US": `${SITE_URL}/en`,
        en: `${SITE_URL}/en`,
        "x-default": `${SITE_URL}/ar`,
      },
      types: {
        "application/rss+xml": `${SITE_URL}/feed.xml`,
      },
    },
    openGraph: {
      type: "website",
      locale: isAr ? "ar_EG" : "en_US",
      alternateLocale: isAr ? ["en_US"] : ["ar_EG"],
      url: canonicalUrl,
      siteName: isAr
        ? "عيادة د. داليا عبد الموجود زارع لطب وتجميل الأسنان"
        : "Dr. Dalia AbdElMougood Zariaa Dental Clinic",
      title,
      description,
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
  };
}

export default async function LangLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  const isRtl = lang === "ar";
  const currentLang = isRtl ? "ar" : "en";

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Dentist", "MedicalClinic", "LocalBusiness"],
        "@id": `${SITE_URL}/#clinic`,
        name: isRtl
          ? "عيادة د. داليا عبد الموجود زارع لطب وتجميل وزراعة الأسنان"
          : "Dr. Dalia AbdElMougood Zariaa Dental Clinic",
        alternateName: [
          "Dr. Dalia Dental Clinic",
          "عيادة دكتورة داليا زارع للأسنان",
          "عيادة دكتورة داليا زريع",
          "د. داليا عبد الموجود زارع",
          "د. داليا عبد الموجود زريع",
          "Dr. Dalia AbdElMougood Zariaa",
        ],
        description: isRtl
          ? "عيادة متخصصة في طب وجراحة وتجميل وزراعة الأسنان بدون ألم بالمعادي، القاهرة تحت إشراف الدكتورة داليا عبد الموجود زارع استشاري طب الأسنان بالقصر العيني."
          : "Premier dental clinic specializing in painless dental implants, cosmetic dentistry, veneers, orthodontics, and laser whitening in Maadi, Cairo, Egypt.",
        url: `${SITE_URL}/${currentLang}`,
        logo: `${SITE_URL}/logo.svg`,
        image: [
          `${SITE_URL}/logo.svg`,
          "https://i.ibb.co/h14mtXMx/IMG-20260728-WA0001.jpg",
        ],
        telephone: "+201112521494",
        email: "drdalia89is@gmail.com",
        priceRange: "$$",
        currenciesAccepted: "EGP, USD, SAR, AED, KWD, EUR",
        paymentAccepted:
          "Cash, Credit Card, Visa, Mastercard, InstaPay, Vodafone Cash",
        medicalSpecialty: [
          "Dentistry",
          "CosmeticDentistry",
          "DentalImplantology",
          "Prosthodontics",
          "Endodontics",
          "Orthodontics",
          "PediatricDentistry",
          "Periodontics",
        ],
        address: {
          "@type": "PostalAddress",
          streetAddress: "45 شارع النصر، البساتين الغربية، المعادي",
          addressLocality: "المعادي، القاهرة",
          addressRegion: "Cairo Governorate",
          postalCode: "11728",
          addressCountry: "EG",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 29.9742821,
          longitude: 31.2753871,
        },
        hasMap: "https://maps.google.com/?q=29.9742821,31.2753871",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Sunday"],
            opens: "15:00",
            closes: "21:30",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Tuesday"],
            opens: "16:00",
            closes: "21:30",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Thursday"],
            opens: "16:00",
            closes: "21:30",
          },
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          bestRating: "5",
          worstRating: "1",
          ratingCount: "38",
          reviewCount: "38",
        },
        founder: {
          "@type": "Physician",
          "@id": `${SITE_URL}/#doctor`,
          name: isRtl
            ? "د. داليا عبد الموجود زارع"
            : "Dr. Dalia AbdElMougood Zariaa",
          jobTitle: isRtl
            ? "استشاري وأخصائي طب وجراحة وتجميل الأسنان - القصر العيني"
            : "Consultant & Specialist in Cosmetic & Implant Dentistry - Qasr El Ainy",
          alumniOf: {
            "@type": "EducationalOrganization",
            name: "كلية طب الفم والأسنان - جامعة القاهرة (القصر العيني)",
          },
          medicalSpecialty: "Dentistry",
          worksFor: {
            "@id": `${SITE_URL}/#clinic`,
          },
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: isRtl
          ? "عيادة د. داليا عبد الموجود زارع لطب وتجميل الأسنان"
          : "Dr. Dalia AbdElMougood Zariaa Dental Clinic",
        inLanguage: ["ar-EG", "en-US"],
        publisher: {
          "@id": `${SITE_URL}/#clinic`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/${currentLang}/articles?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      lang={currentLang}
      className={isRtl ? "font-tajawal" : "font-jua"}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AnalyticsTracker />
      {children}
    </div>
  );
}
