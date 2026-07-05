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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${jua.variable} ${tajawal.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col font-sans font-jua">
        {children}
      </body>
    </html>
  );
}
