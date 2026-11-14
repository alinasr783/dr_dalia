import type { Metadata } from "next";
import { SITE_URL } from "@/lib/supabase/config";

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
    ? "عيادة د. داليا عبد الموجود زريع | أفضل دكتورة طب وتجميل وزراعة الأسنان بالهرم والجيزة"
    : "Dr. Dalia AbdElMougood Zariaa | Premier Dental Implant & Cosmetic Clinic in Giza";

  const description = isAr
    ? "عيادة الدكتورة داليا عبد الموجود زريع لطب وجراحة وتجميل وزراعة الأسنان بالهرم، الجيزة. خبرة متميزة في ابتسامة هوليود، الفينير، زراعة الأسنان الفورية، تبييض الليزر، وعلاج الجذور بدون ألم."
    : "Experience world-class dental care at Dr. Dalia AbdElMougood Zariaa Dental Clinic in Haram, Giza. Specializing in Dental Implants, Hollywood Smile Veneers, Laser Whitening, Orthodontics & Painless Root Canal.";

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
    },
    openGraph: {
      type: "website",
      locale: isAr ? "ar_EG" : "en_US",
      alternateLocale: isAr ? ["en_US"] : ["ar_EG"],
      url: canonicalUrl,
      siteName: isAr
        ? "عيادة د. داليا عبد الموجود زريع لطب وتجميل الأسنان"
        : "Dr. Dalia AbdElMougood Zariaa Dental Clinic",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function LangLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  const isRtl = lang === "ar";

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Dentist", "MedicalClinic", "LocalBusiness"],
        "@id": `${SITE_URL}/#clinic`,
        name: isRtl
          ? "عيادة د. داليا عبد الموجود زريع لطب وتجميل وزراعة الأسنان"
          : "Dr. Dalia AbdElMougood Zariaa Dental Clinic",
        alternateName: [
          "Dr. Dalia Dental Clinic",
          "عيادة دكتورة داليا زريع للأسنان",
          "Dr. Dalia AbdElMougood Zariaa",
        ],
        description: isRtl
          ? "عيادة متخصصة في طب وجراحة وتجميل وزراعة الأسنان بالهرم والجيزة تحت إشراف الدكتورة داليا عبد الموجود زريع."
          : "Premier dental clinic specializing in dental implants, cosmetic dentistry, veneers, orthodontics, and laser whitening in Giza, Egypt.",
        url: `${SITE_URL}/${isRtl ? "ar" : "en"}`,
        logo: `${SITE_URL}/logo.svg`,
        image: [`${SITE_URL}/logo.svg`, `${SITE_URL}/doctor.png`],
        telephone: "+201018571561",
        email: "drdalia89is@gmail.com",
        priceRange: "$$",
        currenciesAccepted: "EGP, USD",
        paymentAccepted: "Cash, Credit Card, Vodafone Cash, InstaPay",
        medicalSpecialty: [
          "Dentistry",
          "CosmeticDentistry",
          "Prosthodontics",
          "Endodontics",
          "Orthodontics",
          "PediatricDentistry",
        ],
        address: {
          "@type": "PostalAddress",
          streetAddress: "155 شارع الهرم - المطبعة - بجوار بنك مصر",
          addressLocality: "الهرم، الجيزة",
          addressRegion: "Giza",
          postalCode: "12556",
          addressCountry: "EG",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 29.9944946,
          longitude: 31.1610751,
        },
        hasMap:
          "https://www.google.com/maps/place/29%C2%B059'40.2%22N+31%C2%B009'39.9%22E",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Saturday",
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
            ],
            opens: "14:00",
            closes: "22:00",
          },
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          bestRating: "5",
          worstRating: "1",
          ratingCount: "340",
          reviewCount: "295",
        },
        founder: {
          "@type": "Physician",
          "@id": `${SITE_URL}/#doctor`,
          name: isRtl
            ? "د. داليا عبد الموجود زريع"
            : "Dr. Dalia AbdElMougood Zariaa",
          jobTitle: isRtl
            ? "استشاري وأخصائي طب وجراحة وتجميل الأسنان"
            : "Consultant & Specialist in Cosmetic & Implant Dentistry",
          medicalSpecialty: "Dentistry",
          worksFor: {
            "@id": `${SITE_URL}/#clinic`,
          },
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: isRtl ? "خدمات طب وتجميل الأسنان" : "Dental Clinic Services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "MedicalProcedure",
                name: isRtl
                  ? "زراعة الأسنان الفورية والرقمية"
                  : "Immediate & Digital Dental Implants",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "MedicalProcedure",
                name: isRtl
                  ? "ابتسامة هوليود وعدسات الفينير"
                  : "Hollywood Smile & Porcelain Veneers",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "MedicalProcedure",
                name: isRtl
                  ? "تبييض الأسنان بالليزر"
                  : "Laser Teeth Whitening",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "MedicalProcedure",
                name: isRtl
                  ? "علاج العصب والجذور بجهاز الروتاري بدون ألم"
                  : "Painless Rotary Root Canal Treatment",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "MedicalProcedure",
                name: isRtl
                  ? "تقويم الأسنان الشفاف والمعدني"
                  : "Clear & Metal Orthodontics",
              },
            },
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: isRtl
          ? "عيادة د. داليا عبد الموجود زريع لطب وتجميل الأسنان"
          : "Dr. Dalia AbdElMougood Zariaa Dental Clinic",
        inLanguage: ["ar-EG", "en-US"],
        publisher: {
          "@id": `${SITE_URL}/#clinic`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/${isRtl ? "ar" : "en"}/articles?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={isRtl ? "font-tajawal" : "font-jua"}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {children}
    </div>
  );
}
