import siteData from "@/data/siteData.json";
import servicesData from "@/data/servicesData.json";

export type Language = "en" | "ar";

// ────────────────────────────────────────────────────────────────
// Translation dictionaries (static, no backend needed)
// ────────────────────────────────────────────────────────────────
export const translations = {
  en: {
    nav: {
      home: "Home",
      services: "Services",
      gallery: "Kids' Smiles",
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
      title: "Kids' Smiles",
      subtitle:
        "We make dental visits fun and stress-free for children, with gentle care that keeps their little smiles healthy and happy.",
      items: [
        { title: "Happy Little Smiles" },
        { title: "Gentle Kids' Care" },
        { title: "Cavity-Free Kids" },
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
      bio: "Dr. Dalia is a dental consultant and a graduate of the Faculty of Dentistry, Qasr El Ainy. She cares about making every visit comfortable and pain-free. She is gentle with patients, and great with kids and easing their fear of the dentist. Her services include tooth fillings, root canal treatment, dental implants, teeth whitening, and gum care.",
      degrees: [
        "Dental Consultant - Graduate of Faculty of Dentistry, Qasr El Ainy",
        "Fillings & Painless Root Canal Treatment",
        "Dental Implants, Whitening & Gum Care",
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
        { day: "Sunday:", time: "3:00 PM - 9:30 PM" },
        { day: "Monday:", time: "Closed" },
        { day: "Tuesday:", time: "4:00 PM - 9:30 PM" },
        { day: "Wednesday:", time: "Closed" },
        { day: "Thursday:", time: "4:00 PM - 9:30 PM" },
        { day: "Friday:", time: "Closed" },
        { day: "Saturday:", time: "Closed" },
      ],
      fridayNote: "",
      fridaySubNote: "",
      contact: "Contact Us",
      address: "45 Al Nasr Street, Al Basatin Al Gharbeyah, Maadi, Cairo Governorate",
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
      services: "خدماتنا",
      gallery: "ابتسامات أطفال",
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
      title: "ابتسامات أطفال",
      subtitle:
        "بنخلي زيارة الأسنان تجربة ممتعة ومريحة لأطفالك، مع تعامل لطيف يحافظ على ابتساماتهم الصغيرة صحية وسعيدة.",
      items: [
        { title: "ابتسامات صغيرة سعيدة" },
        { title: "رعاية لطيفة للأطفال" },
        { title: "أسنان أطفال بدون تسوس" },
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
      bio: "د. داليا استشاري أسنان وخريجة كلية طب الأسنان – القصر العيني. بتهتم إن كل زيارة تكون مريحة ومن غير ألم. لطيفة في التعامل مع المرضى، وشاطرة جداً مع الأطفال وتهدية خوفهم من دكتور الأسنان. من خدماتها: حشو الأسنان، علاج العصب، زراعة الأسنان، التبييض، والعناية باللثة.",
      degrees: [
        "استشاري أسنان – خريجة كلية طب الأسنان، القصر العيني",
        "حشو وعلاج عصب بدون ألم",
        "زراعة أسنان وتبييض وعناية باللثة",
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
        { day: "الأحد:", time: "3:00 م - 9:30 م" },
        { day: "الاثنين:", time: "مغلق" },
        { day: "الثلاثاء:", time: "4:00 م - 9:30 م" },
        { day: "الأربعاء:", time: "مغلق" },
        { day: "الخميس:", time: "4:00 م - 9:30 م" },
        { day: "الجمعة:", time: "مغلق" },
        { day: "السبت:", time: "مغلق" },
      ],
      fridayNote: "",
      fridaySubNote: "",
      contact: "تواصل معنا",
      address: "45 شارع النصر، البساتين الغربية، المعادي، محافظة القاهرة",
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
export const servicesDataJson = servicesData;
