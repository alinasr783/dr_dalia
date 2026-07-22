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
      services: "Painless Services",
      gallery: "Kids' Smiles",
      beforeAfter: "Before & After",
      about: "About",
      testimonials: "Patient Stories",
      clinic: "Our Clinic",
    },
    hero: {
      headline: "A healthy, Painless smile, by design",
      subheadline:
        "Expert Painless dental care and modern aesthetics by Dr. Dalia. We focus on precise, painless treatments to ensure your teeth stay healthy and look natural.",
      cta: "Book a Painless Visit",
    },
    gallery: {
      title: "Kids' Painless Smiles",
      subtitle:
        "We make dental visits fun and stress-free for children, with gentle Painless care that keeps their little smiles healthy and happy.",
      items: [
        { title: "Painless Cheerful Grins" },
        { title: "Smiles Made Painless" },
        { title: "Painless Bright Smiles" },
      ],
    },
    beforeAfter: {
      title: "Painless Before & After",
      subtitle:
        "See the real Painless transformations and life-changing results achieved at our clinic.",
      before: "Before",
      after: "After",
      cases: [
        {
          title: "Painless Orthodontic Correction",
          description: "Complete Painless alignment using clear aligners over 12 months.",
        },
        {
          title: "Painless Veneers & Whitening",
          description: "Full Painless smile makeover with custom porcelain veneers.",
        },
      ],
    },
    about: {
      badge: "Painless Experience & Excellence",
      title: "About Dr. Dalia",
      bio: "Dr. Dalia is a dental consultant and a graduate of the Faculty of Dentistry, Qasr El Ainy. She cares about making every visit comfortable and Painless. She is gentle with patients, and great with kids and easing their fear of the dentist. Her services include Painless tooth fillings, Painless root canal treatment, Painless dental implants, teeth whitening, and gum care.",
      degrees: [
        "Dental Consultant - Graduate of Faculty of Dentistry, Qasr El Ainy",
        "Painless Fillings & Root Canal Treatment",
        "Painless Dental Implants, Whitening & Gum Care",
        "Painless Cosmetic Fillings",
        "Painless Premium Crowns & Bridges (E-max / Zirconia)",
        "Painless Hollywood Smile & Smile Design",
        "Painless Pediatric Dentistry",
        "Painless Gum Depigmentation (Laser)",
      ],
    },
    testimonials: {
      title: "Painless Patient Stories",
      subtitle:
        "We are proud of our patients' trust and always strive to provide the best Painless treatment experience.",
    },
    clinic: {
      title: "Our Painless Clinic",
      subtitle: "Visit us for Painless, premium dental care needs.",
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
      address: "45 Al Nasr Street, Maadi, Cairo Governorate",
      phone: "+971 50 123 4567",
      mapTitle: "Find Us",
      getDirections: "Get Directions",
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} Dr. Dalia Dental Clinic - Painless Dentistry. All rights reserved.`,
      followUs: "Follow Us",
      description:
        "Comprehensive and advanced Painless dental care in the heart of Maadi.",
      contactUs: "Contact Us",
      address: "Address",
    },
  },
  ar: {
    nav: {
      home: "الرئيسية",
      services: "خدمات بلا ألم",
      gallery: "ابتسامات أطفال",
      beforeAfter: "قبل وبعد",
      about: "عن الطبيبة",
      testimonials: "قصص المرضى",
      clinic: "عيادتنا",
    },
    hero: {
      headline: "ابتسامة صحية بلا ألم، بتصميم مدروس",
      subheadline:
        "رعاية أسنان متخصصة وجماليات عصرية من د. داليا. نركّز على علاجات دقيقة وبدون ألم لضمان صحة أسنانك ومظهرها الطبيعي.",
      cta: "احجز زيارتك بلا ألم",
    },
    gallery: {
      title: "ابتسامات أطفال بلا ألم",
      subtitle:
        "بنخلي زيارة الأسنان تجربة ممتعة ومريحة لأطفالك، مع تعامل لطيف وبلا ألم يحافظ على ابتساماتهم الصغيرة صحية وسعيدة.",
      items: [
        { title: "ابتسامات مبهجة بلا ألم" },
        { title: "ابتسامات سهلة وبلا ألم" },
        { title: "ابتسامات مشرقة بلا ألم" },
      ],
    },
    beforeAfter: {
      title: "قبل وبعد بلا ألم",
      subtitle: "شاهد التحولات الحقيقية والنتائج المذهلة بلا ألم في عيادتنا.",
      before: "قبل",
      after: "بعد",
      cases: [
        {
          title: "تصحيح عضوي بلا ألم",
          description: "محاذاة كاملة وبدون ألم باستخدام التقويم الشفاف على مدى 12 شهراً.",
        },
        {
          title: "فينيرز وتبييض بلا ألم",
          description: "تحول كامل وبدون ألم للابتسامة بقشور بورسلين مخصصة.",
        },
      ],
    },
    about: {
      badge: "خبرة وتميز بلا ألم",
      title: "عن د. داليا",
      bio: "د. داليا استشاري أسنان وخريجة كلية طب الأسنان – القصر العيني. بتهتم إن كل زيارة تكون مريحة ومن غير ألم. لطيفة في التعامل مع المرضى، وشاطرة جداً مع الأطفال وتهدية خوفهم من دكتور الأسنان. من خدماتها: حشو الأسنان بلا ألم، علاج العصب بلا ألم، زراعة الأسنان بلا ألم، التبييض، والعناية باللثة.",
      degrees: [
        "استشاري أسنان – خريجة كلية طب الأسنان، القصر العيني",
        "حشو وعلاج عصب بلا ألم",
        "زراعة أسنان وتبييض وعناية باللثة بلا ألم",
        "الحشوات التجميلية الحديثة بلا ألم",
        "تركيبات الأسنان الثابتة بلا ألم (إي ماكس وزركونيا)",
        "ابتسامة هوليود وتصميم الابتسامة بلا ألم",
        "علاج أسنان الأطفال بلا ألم",
        "إزالة تصبغات اللثة بالليزر بلا ألم",
      ],
    },
    testimonials: {
      title: "قصص مرضانا بلا ألم",
      subtitle: "نفتخر بثقة مرضائنا ونسعى دائماً لتقديم أفضل تجربة علاجية بلا ألم.",
    },
    clinic: {
      title: "عيادتنا بلا ألم",
      subtitle: "زورنا لاحتياجات رعاية أسنانك بلا ألم.",
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
      copyright: `© ${new Date().getFullYear()} عيادة د. داليا لطب الأسنان - طب أسنان بلا ألم. جميع الحقوق محفوظة.`,
      followUs: "تابعنا",
      description: "رعاية أسنان شاملة ومتقدمة وبدون ألم في قلب المعادي.",
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
