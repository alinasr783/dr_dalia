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
      bio: "Specialist in oral and dental medicine at Qasr El Ainy. Aesthetic dental fillings and root canal treatment using the latest devices, pain-free. Expert in dealing with patients and always keen on perfection. Treatment of gum bleeding and its causes such as gum recession. Educating children and dealing with their fears, and how to protect adults' and children's teeth from decay. Dental implants of all types. Removing stains and whitening. Latest devices and highest technologies available. Follow-up of cases before and after with photos. 30% discount on clinic services on the occasion of the clinic's anniversary.",
      degrees: [
        "Specialist in Oral and Dental Medicine - Qasr El Ainy",
        "Aesthetic Fillings & Painless Root Canal Treatment",
        "Dental Implants, Whitening & Gum Treatment",
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
      bio: "اخصائي الفم و الأسنان بالقصر العيني. حشو تجميلي للاسنان وعلاج العصب بأحدث الأجهزة بدون الم. تجيد التعامل مع المرضى وتسعى دائماً لاتقان العمل. علاج نزيف اللثه والمسببات له مثل انحصار اللثه. توعيه الأطفال والتعامل مع خوفهم وكيفيه حمايه أسنان الكبار والأطفال من التسوس. زراعه الأسنان بكل الأنواع. ازالة التصبغات والتبييض. متاح أحدث الاجهزه واعلي التقنيات ومتابعه الحاله قبل وبعد بالصور. خصم ٣٠ في المائة علي خدمات العياده بمناسبه عيد ميلاد العيادة.",
      degrees: [
        "اخصائي الفم و الأسنان - القصر العيني",
        "حشو تجميلي وعلاج عصب بدون الم",
        "زراعة أسنان وتبييض وعلاج اللثة",
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
