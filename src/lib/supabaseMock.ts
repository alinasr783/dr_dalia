import siteData from "@/data/siteData.json";

export type Language = "en" | "ar";

// ────────────────────────────────────────────────────────────────
// Translation dictionaries (static, no backend needed)
// ────────────────────────────────────────────────────────────────
export const translations = {
  en: {
    nav: {
      home: "Home",
      gallery: "Gallery",
      beforeAfter: "Before & After",
      about: "About",
      testimonials: "Patient Stories",
      clinic: "Our Clinic",
    },
    hero: {
      headline: "A healthy smile, by design",
      subheadline:
        "Expert dental care and modern aesthetics by Dr. Dalia. We focus on precise treatments to ensure your teeth stay healthy and look natural.",
      cta: "Book on WhatsApp",
    },
    gallery: {
      title: "Smile Gallery",
      subtitle:
        "Professional results that reflect our commitment to the highest standards of quality in cosmetic and restorative dentistry.",
      items: [
        { title: "Whitening & Cosmetics" },
        { title: "Clear Aligners" },
        { title: "Cosmetic Restorations" },
      ],
    },
    beforeAfter: {
      title: "Before & After",
      subtitle:
        "See the real transformations and life-changing results achieved at our clinic.",
      before: "Before",
      after: "After",
      cases: [
        {
          title: "Orthodontic Correction",
          description: "Complete alignment using clear aligners over 12 months.",
        },
        {
          title: "Veneers & Whitening",
          description: "Full smile makeover with custom porcelain veneers.",
        },
      ],
    },
    about: {
      badge: "Experience & Excellence",
      title: "About Dr. Dalia",
      bio: "With over 10 years of experience in oral and maxillofacial surgery and dentistry, Dr. Dalia provides comprehensive healthcare that combines scientific accuracy with an aesthetic touch. We always strive to use the latest technologies to ensure patient comfort and optimal results.",
      degrees: [
        "Fellowship of the Royal College of Surgeons",
        "Specialized in Prosthodontics and Cosmetic Dentistry",
        "Special care for patients with dental anxiety",
      ],
    },
    testimonials: {
      title: "Patient Stories",
      subtitle:
        "We are proud of our patients' trust and always strive to provide the best treatment experience.",
    },
    clinic: {
      title: "Our Clinic",
      subtitle: "Visit us for your dental care needs.",
      hours: "Working Hours",
      hoursSchedule: [
        { day: "Sat - Wed:", time: "10:00 AM - 9:00 PM" },
        { day: "Thursday:", time: "10:00 AM - 5:00 PM" },
      ],
      fridayNote: "Friday: Closed",
      fridaySubNote: "* Emergency services available by appointment",
      contact: "Contact Us",
      address: "123 Nile Corniche, Maadi, Cairo, Egypt",
      phone: "+971 50 123 4567",
      mapTitle: "Find Us",
      getDirections: "Get Directions",
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} Dr. Dalia Dental Clinic. All rights reserved.`,
      followUs: "Follow Us",
      description:
        "Comprehensive and advanced dental care in the heart of Maadi.",
      contactUs: "Contact Us",
      address: "Address",
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      gallery: "معرض الابتسامات",
      beforeAfter: "قبل وبعد",
      about: "عن الطبيبة",
      testimonials: "قصص المرضى",
      clinic: "عيادتنا",
    },
    hero: {
      headline: "ابتسامة صحية، بتصميم مدروس",
      subheadline:
        "رعاية أسنان متخصصة وجماليات عصرية من د. داليا. نركّز على علاجات دقيقة لضمان صحة أسنانك ومظهرها الطبيعي.",
      cta: "احجز عبر واتساب",
    },
    gallery: {
      title: "معرض الابتسامات",
      subtitle:
        "نتائج احترافية تعكس التزامنا بأعلى معايير الجودة في طب الأسنان التجميلي والترميمي.",
      items: [
        { title: "التبييض والتجميل" },
        { title: "التقويم الشفاف" },
        { title: "التركيبات التجميلية" },
      ],
    },
    beforeAfter: {
      title: "قبل وبعد",
      subtitle: "شاهد التحولات الحقيقية والنتائج المذهلة في عيادتنا.",
      before: "قبل",
      after: "بعد",
      cases: [
        {
          title: "التصحيح العضوي",
          description: "محاذاة كاملة باستخدام التقويم الشفاف على مدى 12 شهراً.",
        },
        {
          title: "الفينير والتبييض",
          description: "تحول كامل للابتسامة بقشور بورسلين مخصصة.",
        },
      ],
    },
    about: {
      badge: "الخبرة والتميز",
      title: "عن د. داليا",
      bio: "بخبرة تزيد عن 10 سنوات في جراحة الفم والوجه والفكين وطب الأسنان، تقدم د. داليا رعاية صحية شاملة تجمع بين الدقة العلمية واللمسة الجمالية. نسعى دائماً لاستخدام أحدث التقنيات لضمان راحة المريض وتحقيق أفضل النتائج.",
      degrees: [
        "زمالة الكلية الملكية لجراحي الأسنان",
        "متخصصة في طب الأسنان الترميمي والتجميلي",
        "رعاية خاصة للمرضى الذين يعانون من الخوف من أطباء الأسنان",
      ],
    },
    testimonials: {
      title: "قصص المرضى",
      subtitle: "نفتخر بثقة مرضائنا ونسعى دائماً لتقديم أفضل تجربة علاجية.",
    },
    clinic: {
      title: "عيادتنا",
      subtitle: "زورنا لاحتياجات رعاية أسنانك.",
      hours: "ساعات العمل",
      hoursSchedule: [
        { day: "السبت - الأربعاء:", time: "10:00 ص - 9:00 م" },
        { day: "الخميس:", time: "10:00 ص - 5:00 م" },
      ],
      fridayNote: "الجمعة: مغلق",
      fridaySubNote: "* خدمات الطوارئ متاحة حسب الموعد",
      contact: "تواصل معنا",
      address: "123 كورنيش النيل، المعادي، القاهرة، مصر",
      phone: "+971 50 123 4567",
      mapTitle: "موقعنا",
      getDirections: "الاتجاهات",
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} عيادة د. داليا لطب الأسنان. جميع الحقوق محفوظة.`,
      followUs: "تابعنا",
      description: "رعاية أسنان شاملة ومتقدمة في قلب المعادي.",
      contactUs: "تواصل معنا",
      address: "العنوان",
    },
  },
};

// ────────────────────────────────────────────────────────────────
// Re-export structured data from JSON for easy swapping later
// ────────────────────────────────────────────────────────────────
export const clinicInfo = siteData.clinic;
export const heroBackground = siteData.heroBackground;
export const galleryItems = siteData.gallery;
export const beforeAfterCases = siteData.beforeAfter;
export const aboutDoctorImage = siteData.aboutDoctorImage;
export const testimonialsList = siteData.testimonials;
export const socialLinks = siteData.socialLinks;
