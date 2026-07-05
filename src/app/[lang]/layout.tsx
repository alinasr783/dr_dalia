import type { Metadata, Viewport } from "next";
import { Jua, Tajawal } from "next/font/google";
import "@/app/globals.css";

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
};

export const metadata: Metadata = {
  title: "Dr. Dalia | Premium Dental Clinic",
  description: "Experience the flawless smile transformation with Dr. Dalia's premium dental care.",
};

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function LangLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  const isRtl = lang === "ar";
  const fontClass = isRtl ? tajawal.variable : jua.variable;

  return (
    <html
      lang={lang}
      dir={isRtl ? "rtl" : "ltr"}
      className={`${fontClass} h-full antialiased scroll-smooth`}
    >
      <body className={`min-h-full flex flex-col font-sans ${isRtl ? "font-tajawal" : "font-jua"}`}>
        {children}
      </body>
    </html>
  );
}
