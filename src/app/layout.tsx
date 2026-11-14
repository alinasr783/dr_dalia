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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#06446F" },
    { media: "(prefers-color-scheme: dark)", color: "#0B192C" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "عيادة د. داليا عبد الموجود زارع لطب وتجميل وزراعة الأسنان | Dr. Dalia Dental Clinic",
    template: "%s | د. داليا عبد الموجود زارع",
  },
  description:
    "عيادة الدكتورة داليا عبد الموجود زارع (استشاري طب وجراحة الفم والأسنان بالقصر العيني) بالمعادي، القاهرة. زراعة الأسنان الفورية بدون ألم، ابتسامة هوليود وفينيرز الإيماكس، تبييض الأسنان بالليزر، علاج العصب بدون ألم، ورعاية فائقة لأسنان الأطفال بأحدث التقنيات الرقمية.",
  applicationName: "Dr. Dalia Dental Clinic",
  authors: [
    {
      name: "د. داليا عبد الموجود زارع | Dr. Dalia AbdElMougood Zariaa",
      url: SITE_URL,
    },
  ],
  creator: "Dr. Dalia AbdElMougood Zariaa Dental Clinic",
  publisher: "Dr. Dalia AbdElMougood Zariaa Dental Clinic",
  category: "Health & Medical > Dentistry",
  keywords: [
    "دكتورة داليا عبد الموجود زارع",
    "دكتورة داليا زريع",
    "داليا عبد الموجود",
    "عيادة اسنان المعادي",
    "افضل دكتور اسنان في المعادي",
    "افضل دكتورة اسنان في القاهرة",
    "دكتور اسنان القصر العيني",
    "زراعة الاسنان بدون الم المعادي",
    "اسعار زراعة الاسنان في مصر",
    "ابتسامة هوليود القاهرة",
    "فينيرز الاسنان ايماكس",
    "تبييض الاسنان بالليزر المعادي",
    "علاج عصب الاسنان بدون الم",
    "تقويم الاسنان الشفاف",
    "طب اسنان الاطفال بدون خوف",
    "توريد وتحديد اللثة بالليزر",
    "تركيبات الزيركون والايماكس",
    "علاج الضحكة اللثوية بالبوتوكس",
    "مقالات طب الاسنان الموثوقة",
    "Dr. Dalia AbdElMougood Zariaa",
    "Dr. Dalia Dental Clinic",
    "Best Dentist in Maadi Cairo",
    "Dental Implants Egypt Painless",
    "Hollywood Smile Cairo Maadi",
    "Cosmetic Dentistry Egypt",
    "Laser Teeth Whitening Cairo",
    "Pediatric Dentistry Maadi",
    "Emax Veneers Cairo",
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
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    alternateLocale: ["en_US"],
    url: `${SITE_URL}/ar`,
    siteName:
      "عيادة د. داليا عبد الموجود زارع لطب وتجميل الأسنان | Dr. Dalia Dental Clinic",
    title:
      "عيادة د. داليا عبد الموجود زارع لطب وتجميل وزراعة الأسنان | Dr. Dalia Dental Clinic",
    description:
      "احصل على ابتسامة مثالية ورعاية طبية بدون ألم في عيادة د. داليا عبد الموجود زارع بالمعادي، القاهرة. زراعة الأسنان، الفينيرز، تبييض الليزر، وعلاج العصب بدون ألم.",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "عيادة د. داليا عبد الموجود زارع لطب وتجميل وزراعة الأسنان",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "عيادة د. داليا عبد الموجود زارع لطب وتجميل وزراعة الأسنان | Dr. Dalia Dental Clinic",
    description:
      "أحدث تقنيات زراعة وتجميل الأسنان وابتسامة هوليود بدون ألم في عيادة د. داليا عبد الموجود زارع استشاري طب الأسنان بالقصر العيني.",
    images: [`${SITE_URL}/opengraph-image`],
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
    "geo.region": "EG-C",
    "geo.placename": "Maadi, Cairo Governorate, Egypt",
    "geo.position": "29.9742821;31.2753871",
    ICBM: "29.9742821, 31.2753871",
    "format-detection": "telephone=yes, address=yes, email=yes",
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
      dir="rtl"
      className={`${jua.variable} ${tajawal.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans font-jua">
        {children}
      </body>
    </html>
  );
}
