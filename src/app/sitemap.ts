import type { MetadataRoute } from "next";
import { listPosts } from "@/lib/supabase/db";
import { SITE_URL } from "@/lib/supabase/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/ar`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: {
          ar: `${SITE_URL}/ar`,
          en: `${SITE_URL}/en`,
        },
      },
    },
    {
      url: `${SITE_URL}/en`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: {
          ar: `${SITE_URL}/ar`,
          en: `${SITE_URL}/en`,
        },
      },
    },
    {
      url: `${SITE_URL}/ar/articles`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
      alternates: {
        languages: {
          ar: `${SITE_URL}/ar/articles`,
          en: `${SITE_URL}/en/articles`,
        },
      },
    },
    {
      url: `${SITE_URL}/en/articles`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
      alternates: {
        languages: {
          ar: `${SITE_URL}/ar/articles`,
          en: `${SITE_URL}/en/articles`,
        },
      },
    },
  ];

  try {
    const { posts } = await listPosts({ status: "published", limit: 500 });
    const articleRoutes: MetadataRoute.Sitemap = [];

    for (const post of posts) {
      const slug = encodeURIComponent(post.slug);
      const lastMod = post.updated_at ? new Date(post.updated_at) : now;

      articleRoutes.push({
        url: `${SITE_URL}/ar/articles/${slug}`,
        lastModified: lastMod,
        changeFrequency: "weekly",
        priority: post.featured ? 0.9 : 0.8,
        alternates: {
          languages: {
            ar: `${SITE_URL}/ar/articles/${slug}`,
            en: `${SITE_URL}/en/articles/${slug}`,
          },
        },
      });

      articleRoutes.push({
        url: `${SITE_URL}/en/articles/${slug}`,
        lastModified: lastMod,
        changeFrequency: "weekly",
        priority: post.featured ? 0.8 : 0.75,
        alternates: {
          languages: {
            ar: `${SITE_URL}/ar/articles/${slug}`,
            en: `${SITE_URL}/en/articles/${slug}`,
          },
        },
      });
    }

    return [...staticRoutes, ...articleRoutes];
  } catch {
    return staticRoutes;
  }
}
