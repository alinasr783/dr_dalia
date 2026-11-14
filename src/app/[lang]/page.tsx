import type { Metadata } from "next";
import LandingPageClient from "@/components/home/LandingPageClient";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { SITE_URL } from "@/lib/supabase/config";
import {
  clinicInfo,
  testimonialsList,
  servicesDataJson,
  Language,
} from "@/lib/supabaseMock";

type PageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const isAr = lang === "ar";

  const title = isAr
    ? "عيادة د. داليا عبد الموجود زارع | استشاري طب وتجميل وزراعة الأسنان بالمعادي"
    : "Dr. Dalia AbdElMougood Zariaa Dental Clinic | Painless Cosmetic & Implant Dentistry in Maadi, Cairo";

  const description = isAr
    ? "عيادة د. داليا عبد الموجود زارع (استشاري طب وجراحة الفم والأسنان بالقصر العيني) في المعادي، القاهرة. خبرة أكثر من 20 عاماً في زراعة الأسنان بدون ألم، ابتسامة هوليود والفينيرز، تبييض الأسنان بالليزر، علاج العصب بدون ألم، وطب أسنان الأطفال."
    : "Dr. Dalia AbdElMougood Zariaa Dental Clinic in Maadi, Cairo. 20+ years of clinical excellence in painless dental implants, Hollywood Smile porcelain veneers, laser teeth whitening, painless rotary root canals, and gentle pediatric dentistry.";

  const canonicalUrl = `${SITE_URL}/${isAr ? "ar" : "en"}`;

  const keywords = isAr
    ? [
        "دكتورة داليا عبد الموجود زارع",
        "دكتورة داليا زريع",
        "عيادة أسنان المعادي",
        "افضل دكتور اسنان في المعادي",
        "دكتور اسنان القصر العيني",
        "زراعة الاسنان بدون الم المعادي",
        "ابتسامة هوليود في مصر",
        "فينيرز الاسنان ايماكس",
        "تبييض الاسنان بالليزر في القاهرة",
        "حشو وعلاج عصب بدون الم",
        "طب اسنان الاطفال المعادي",
        "توريد وتحديد اللثة بالليزر",
        "علاج الضحكة اللثوية",
        "تركيبات الزيركون والايماكس",
        "اسعار زراعة الاسنان في مصر",
        "عيادة اسنان شارع النصر المعادي",
      ]
    : [
        "Dr. Dalia AbdElMougood Zariaa",
        "Dr Dalia Dental Clinic Maadi",
        "Best Dentist in Maadi Cairo",
        "Painless Dental Implants Egypt",
        "Hollywood Smile Cairo",
        "Porcelain Veneers Maadi",
        "Laser Teeth Whitening Cairo",
        "Painless Root Canal Treatment",
        "Pediatric Dentist Maadi",
        "Cosmetic Dentistry Egypt",
        "Laser Gum Contouring",
        "Zirconia Dental Crowns",
      ];

  return {
    title,
    description,
    keywords,
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
        ? "عيادة د. داليا عبد الموجود زارع لطب الأسنان بلا ألم"
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

export default async function LandingPage({ params }: PageProps) {
  const { lang } = await params;
  const currentLang = (lang === "ar" ? "ar" : "en") as Language;
  const isAr = currentLang === "ar";
  const pageUrl = `${SITE_URL}/${currentLang}`;

  const topReviews = testimonialsList.slice(0, 10).map((review) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: isAr ? review.nameAr : review.nameEn,
    },
    datePublished: "2026-01-15",
    reviewBody: isAr ? review.reviewAr : review.reviewEn,
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(review.rating),
      bestRating: "5",
      worstRating: "1",
    },
  }));

  const medicalProcedures = servicesDataJson.services.map((service) => ({
    "@type": "MedicalProcedure",
    name: isAr ? service.titleAr : service.titleEn,
    description: isAr ? service.descAr : service.descEn,
    image: service.image,
    procedureType: "NoninvasiveProcedure",
  }));

  const faqItems = isAr
    ? [
        {
          question: "هل إجراءات زراعة وعلاج الأسنان في عيادة د. داليا بدون ألم حقاً؟",
          answer:
            "نعم تماماً؛ تعتمد د. داليا عبد الموجود زارع على بروتوكولات التخدير الموضعي الرقمي اللطيف وأحدث التقنيات الطبية لضمان جلسة مريحة وخالية بنسبة 100% من أي ألم أو انزعاج، سواء في زراعة الأسنان، علاج العصب، أو الحشوات التجميلية.",
        },
        {
          question: "ما هي مميزات فينيرز الأسنان وابتسامة هوليود في العيادة؟",
          answer:
            "نستخدم أجود خامات الإيماكس والزركونيا العالمية المصممة رقمياً لتناسب تقاسيم وجهك بدقة فائقة، مع الحفاظ الأقصى على بنية الأسنان الطبيعية ومظهر ناصع يدوم لسنوات طويلة.",
        },
        {
          question: "كيف تتعامل العيادة مع خوف الأطفال من طبيب الأسنان؟",
          answer:
            "تتمتع دكتورة داليا بخبرة استثنائية وأسلوب هادئ ومحبب للأطفال يحوّل زيارة الأسنان إلى تجربة ممتعة بدون خوف أو دموع، مع استخدام تقنيات متطورة للعلاج السريع وغير المؤلم.",
        },
        {
          question: "ما هي خطوات زراعة الأسنان والمدة اللازمة للتعافي؟",
          answer:
            "تتم الزراعة بعد فحص ثلاثي الأبعاد دقيق (CBCT) وتستغرق جلسة وضع الغرسة نحو 20 إلى 30 دقيقة فقط تحت تخدير موضعي بسيط، ويمكن للمريض استئناف نشاطه الطبيعي في اليوم التالي مباشرة.",
        },
        {
          question: "أين تقع عيادة دكتورة داليا وكيف يمكنني حجز موعد استشارة؟",
          answer:
            "تقع العيادة في 45 شارع النصر، المعادي، القاهرة. يمكنك حجز موعدك بسهولة عبر تطبيق واتساب على الرقم 01112521494 أو من خلال زر الحجز المباشر بالموقع.",
        },
        {
          question: "ما هي مواعيد العمل المتاحة في العيادة؟",
          answer:
            "نستقبلكم أيام الأحد والثلاثاء والخميس من الساعة 3:00 عصراً وحتى 9:30 مساءً بمواعيد مسبقة لضمان أقصى درجات الخصوصية والرعاية الطبية الفائقة.",
        },
      ]
    : [
        {
          question: "Are dental procedures at Dr. Dalia's clinic truly painless?",
          answer:
            "Yes, absolutely. Dr. Dalia AbdElMougood Zariaa applies gentle digital local anesthesia protocols and modern micro-invasive techniques to ensure 100% stress-free, painless treatments for implants, root canals, and restorative care.",
        },
        {
          question: "What makes Hollywood Smile and Veneers special at our clinic?",
          answer:
            "We use premium custom-crafted Emax and Zirconia ceramics digitally planned to harmonize with your facial aesthetics, offering exceptional longevity and a natural-looking radiant smile.",
        },
        {
          question: "How do you help children overcome dental fear?",
          answer:
            "With over two decades of gentle patient handling, Dr. Dalia creates a warm, welcoming environment that transforms pediatric visits into fun, positive experiences without tears or anxiety.",
        },
        {
          question: "How long does a dental implant procedure take?",
          answer:
            "Implant fixture placement typically takes only 20 to 30 minutes under gentle anesthesia. Most patients return to their routine activities comfortably the very next day.",
        },
        {
          question: "Where is the clinic located and how can I book an appointment?",
          answer:
            "The clinic is located at 45 Al Nasr Street, Maadi, Cairo Governorate, Egypt. You can instantly book via WhatsApp (+201112521494) or through the online booking buttons.",
        },
        {
          question: "What are the clinic's operating hours?",
          answer:
            "We welcome patients on Sundays, Tuesdays, and Thursdays from 3:00 PM to 9:30 PM by prior appointment to guarantee personalized, unhurried clinical care.",
        },
      ];

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Dentist", "MedicalClinic", "LocalBusiness"],
        "@id": `${SITE_URL}/#clinic`,
        name: isAr
          ? "عيادة د. داليا عبد الموجود زارع لطب وتجميل وزراعة الأسنان"
          : "Dr. Dalia AbdElMougood Zariaa Dental Clinic",
        alternateName: [
          "د. داليا عبد الموجود زارع",
          "د. داليا عبد الموجود زريع",
          "دكتورة داليا زارع",
          "دكتورة داليا زريع",
          "عيادة دكتورة داليا للأسنان بالمعادي",
          "Dr. Dalia Dental Clinic Maadi",
          "Dr. Dalia AbdElMougood Zariaa",
        ],
        description: isAr
          ? "عيادة استشارية متخصصة في طب وجراحة وتجميل وزراعة الأسنان بلا ألم بالمعادي، القاهرة تحت إشراف الدكتورة داليا عبد الموجود زارع استشاري طب الأسنان بالقصر العيني."
          : "Premier dental clinic in Maadi, Cairo specializing in painless dental implants, Hollywood Smile veneers, laser whitening, orthodontics, and gentle pediatric dentistry under consultant Dr. Dalia AbdElMougood Zariaa.",
        url: pageUrl,
        logo: `${SITE_URL}/logo.svg`,
        image: [
          `${SITE_URL}/logo.svg`,
          "https://i.ibb.co/h14mtXMx/IMG-20260728-WA0001.jpg",
        ],
        telephone: "+201112521494",
        email: "drdalia89is@gmail.com",
        priceRange: "$$",
        currenciesAccepted: "EGP, USD, SAR, AED, KWD, EUR",
        paymentAccepted: "Cash, Credit Card, Visa, Mastercard, InstaPay, Vodafone Cash",
        medicalSpecialty: [
          "Dentistry",
          "CosmeticDentistry",
          "DentalImplantology",
          "PediatricDentistry",
          "Endodontics",
          "Orthodontics",
          "Periodontics",
          "Prosthodontics",
        ],
        availableService: medicalProcedures,
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
        review: topReviews,
        founder: {
          "@type": "Physician",
          "@id": `${SITE_URL}/#doctor`,
          name: isAr
            ? "د. داليا عبد الموجود زارع"
            : "Dr. Dalia AbdElMougood Zariaa",
          alternateName: [
            "د. داليا عبد الموجود زريع",
            "دكتورة داليا زارع",
          ],
          jobTitle: isAr
            ? "استشاري طب وجراحة وتجميل الفم والأسنان - القصر العيني"
            : "Consultant in Oral & Dental Medicine and Surgery - Qasr El Ainy, Cairo University",
          alumniOf: {
            "@type": "EducationalOrganization",
            name: "كلية طب الفم والأسنان - جامعة القاهرة (القصر العيني)",
          },
          medicalSpecialty: "Dentistry",
          worksFor: {
            "@id": `${SITE_URL}/#clinic`,
          },
          image: "https://i.ibb.co/h14mtXMx/IMG-20260728-WA0001.jpg",
          url: pageUrl,
        },
        sameAs: [
          "https://www.facebook.com/share/1CocjuuFjk/",
          "https://www.instagram.com/dr_dalia_abdelmowgoud?igsh=MWY2Y2szbzlnZG95NA==",
          "https://snapchat.com/t/BsKEHjCC",
          clinicInfo.whatsappLink ||
            `https://wa.me/${clinicInfo.whatsappNumber}`,
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: isAr
          ? "عيادة د. داليا عبد الموجود زارع لطب الأسنان"
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
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: isAr ? "الرئيسية" : "Home",
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: isAr
          ? "عيادة د. داليا عبد الموجود زارع لطب وتجميل وزراعة الأسنان"
          : "Dr. Dalia AbdElMougood Zariaa Dental Clinic",
        description: isAr
          ? "رعاية متكاملة لطب وجراحة وتجميل الأسنان بدون ألم بالمعادي"
          : "Painless comprehensive dental care in Maadi, Cairo",
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        about: {
          "@id": `${SITE_URL}/#clinic`,
        },
        inLanguage: isAr ? "ar-EG" : "en-US",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "#home p"],
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AnalyticsTracker />
      <LandingPageClient lang={currentLang} />
    </>
  );
}
