import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/supabase/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/dashboard", "/ar/dashboard", "/en/dashboard", "/api/"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/"],
        disallow: ["/dashboard", "/ar/dashboard", "/en/dashboard", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
