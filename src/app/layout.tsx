import type { Metadata, Viewport } from "next";
import { Jua, Tajawal } from "next/font/google";
import "@/app/globals.css";
import { SITE_URL } from "@/lib/supabase/config";

const jua = Jua({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-jua",
  display: "swap",
});

const tajawal = Tajawal({
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  subsets: ["arabic"],
  variable: "--font-tajawal",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0EA5E9",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "عيادة د. داليا عبد الموجود زريع لطب وتجميل وزراعة الأسنان | Dr. Dalia Dental Clinic",
    template: "%s | د. داليا عبد الموجود زريع",
  },
  description:
    "عيادة الدكتورة داليا عبد الموجود زريع لطب وجراحة وتجميل وزراعة الأسنان بالهرم والجيزة. زراعة الأسنان الفورية، ابتسامة هوليود والفينير، تبييض الأسنان بالليزر، علاج الجذور بدون ألم، وتقويم الأسنان بأحدث التقنيات الرقمية.",
  applicationName: "Dr. Dalia Dental Clinic",
  authors: [
    {
      name: "د. داليا عبد الموجود زريع | Dr. Dalia AbdElMougood Zariaa",
      url: SITE_URL,
    },
  ],
  creator: "Dr. Dalia AbdElMougood Zariaa Dental Clinic",
  publisher: "Dr. Dalia AbdElMougood Zariaa Dental Clinic",
  category: "Medical & Dental Health",
  keywords: [
    "دكتورة داليا عبد الموجود زريع",
    "عيادة دكتورة داليا زريع",
    "افضل دكتور اسنان في الهرم",
    "افضل عيادة اسنان في الجيزة",
    "زراعة الاسنان في مصر",
    "ابتسامة هوليود",
    "فينير الاسنان",
    "تبييض الاسنان بالليزر",
    "علاج عصب الاسنان بدون الم",
    "تقويم الاسنان الشفاف",
    "طب اسنان الاطفال",
    "تركيبات الزيركون والايماكس",
    "مقالات طب الاسنان",
    "Dr. Dalia AbdElMougood Zariaa",
    "Dr. Dalia Dental Clinic",
    "Best Dentist in Haram Giza",
    "Dental Implants Egypt",
    "Hollywood Smile Cairo Giza",
    "Cosmetic Dentistry Egypt",
    "Laser Teeth Whitening",
  ],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon", type: "image/png", sizes: "64x64" },
    ],
    shortcut: ["/icon.svg"],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: `${SITE_URL}/ar`,
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
    locale: "ar_EG",
    alternateLocale: ["en_US"],
    url: `${SITE_URL}/ar`,
    siteName:
      "عيادة د. داليا عبد الموجود زريع لطب وتجميل الأسنان | Dr. Dalia Dental Clinic",
    title:
      "عيادة د. داليا عبد الموجود زريع لطب وتجميل وزراعة الأسنان | Dr. Dalia Dental Clinic",
    description:
      "احصل على ابتسامة مثالية ورعاية طبية متكاملة في عيادة د. داليا عبد الموجود زريع بالهرم، الجيزة. زراعة الأسنان، الفينير، تبييض الليزر، وعلاج العصب بدون ألم.",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "عيادة د. داليا عبد الموجود زريع لطب وتجميل وزراعة الأسنان | Dr. Dalia Dental Clinic",
    description:
      "أحدث تقنيات زراعة وتجميل الأسنان وابتسامة هوليود في عيادة د. داليا عبد الموجود زريع بالهرم والجيزة.",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "EG-GZ",
    "geo.placename": "El Haram, Giza, Egypt",
    "geo.position": "29.9944946;31.1610751",
    ICBM: "29.9944946, 31.1610751",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      className={`${jua.variable} ${tajawal.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans font-jua">
        {children}
      </body>
    </html>
  );
}
