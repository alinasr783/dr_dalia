import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "عيادة د. داليا عبد الموجود زارع لطب وتجميل الأسنان | Dr. Dalia Dental Clinic",
    short_name: "د. داليا زارع",
    description:
      "عيادة الدكتورة داليا عبد الموجود زارع لطب وجراحة وتجميل وزراعة الأسنان بالمعادي، القاهرة - ابتسامة هوليود، زراعة الأسنان بدون ألم، الفينيرز، وتبييض الأسنان بالليزر.",
    start_url: "/ar",
    scope: "/",
    display: "standalone",
    background_color: "#F8FAFC",
    theme_color: "#06446F",
    orientation: "portrait",
    lang: "ar",
    dir: "rtl",
    categories: ["medical", "health", "lifestyle"],
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
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
