import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/supabase/config";

export default function robots(): MetadataRoute.Robots {
  const disallowList = [
    "/dashboard",
    "/dashboard/*",
    "/ar/dashboard",
    "/ar/dashboard/*",
    "/en/dashboard",
    "/en/dashboard/*",
    "/api/",
    "/api/*",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/ar", "/en", "/ar/*", "/en/*", "/feed.xml", "/llms.txt"],
        disallow: disallowList,
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/ar", "/en", "/ar/*", "/en/*"],
        disallow: disallowList,
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/", "/*.jpg", "/*.png", "/*.webp", "/*.svg", "/opengraph-image", "/icon", "/apple-icon"],
        disallow: disallowList,
      },
      {
        userAgent: "Bingbot",
        allow: ["/", "/ar", "/en", "/ar/*", "/en/*"],
        disallow: disallowList,
      },
      {
        userAgent: "Applebot",
        allow: ["/", "/ar", "/en", "/ar/*", "/en/*"],
        disallow: disallowList,
      },
      {
        userAgent: "DuckDuckBot",
        allow: ["/", "/ar", "/en", "/ar/*", "/en/*"],
        disallow: disallowList,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
