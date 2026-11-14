import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "عيادة د. داليا عبد الموجود زريع لطب وتجميل الأسنان | Dr. Dalia Dental Clinic",
    short_name: "د. داليا زريع",
    description:
      "عيادة الدكتورة داليا عبد الموجود زريع لطب وجراحة وتجميل وزراعة الأسنان بالهرم والجيزة - ابتسامة هوليود، زراعة الأسنان، الفينير، وتبييض الأسنان بالليزر.",
    start_url: "/ar",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#0EA5E9",
    orientation: "portrait",
    lang: "ar",
    dir: "rtl",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "64x64",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
