import type { MetadataRoute } from "next";
import { listPosts } from "@/lib/supabase/db";
import { SITE_URL } from "@/lib/supabase/config";
import { SEED_POSTS } from "@/lib/supabase/seedPosts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const brandImages = [
    "https://i.ibb.co/h14mtXMx/IMG-20260728-WA0001.jpg",
    `${SITE_URL}/logo.svg`,
    `${SITE_URL}/opengraph-image`,
  ];

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/ar`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
      images: brandImages,
      alternates: {
        languages: {
          "ar-EG": `${SITE_URL}/ar`,
          ar: `${SITE_URL}/ar`,
          "en-US": `${SITE_URL}/en`,
          en: `${SITE_URL}/en`,
          "x-default": `${SITE_URL}/ar`,
        },
      },
    },
    {
      url: `${SITE_URL}/en`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
      images: brandImages,
      alternates: {
        languages: {
          "ar-EG": `${SITE_URL}/ar`,
          ar: `${SITE_URL}/ar`,
          "en-US": `${SITE_URL}/en`,
          en: `${SITE_URL}/en`,
          "x-default": `${SITE_URL}/ar`,
        },
      },
    },
    {
      url: `${SITE_URL}/ar/articles`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
      images: brandImages,
      alternates: {
        languages: {
          "ar-EG": `${SITE_URL}/ar/articles`,
          ar: `${SITE_URL}/ar/articles`,
          "en-US": `${SITE_URL}/en/articles`,
          en: `${SITE_URL}/en/articles`,
          "x-default": `${SITE_URL}/ar/articles`,
        },
      },
    },
    {
      url: `${SITE_URL}/en/articles`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
      images: brandImages,
      alternates: {
        languages: {
          "ar-EG": `${SITE_URL}/ar/articles`,
          ar: `${SITE_URL}/ar/articles`,
          "en-US": `${SITE_URL}/en/articles`,
          en: `${SITE_URL}/en/articles`,
          "x-default": `${SITE_URL}/ar/articles`,
        },
      },
    },
  ];

  try {
    let postsList = SEED_POSTS;
    try {
      const res = await listPosts({ status: "published", limit: 500 });
      if (res && Array.isArray(res.posts) && res.posts.length > 0) {
        postsList = res.posts;
      }
    } catch {
      postsList = SEED_POSTS;
    }

    const articleRoutes: MetadataRoute.Sitemap = [];

    for (const post of postsList) {
      if (post.status !== "published") continue;

      const slug = encodeURIComponent(post.slug);
      const lastMod = post.updated_at
        ? new Date(post.updated_at)
        : post.published_at
        ? new Date(post.published_at)
        : now;

      const articleImages = [
        post.cover_image,
        post.author_avatar,
      ].filter((img): img is string => typeof img === "string" && img.startsWith("http"));

      articleRoutes.push({
        url: `${SITE_URL}/ar/articles/${slug}`,
        lastModified: lastMod,
        changeFrequency: "weekly",
        priority: post.featured ? 0.9 : 0.8,
        images: articleImages,
        alternates: {
          languages: {
            "ar-EG": `${SITE_URL}/ar/articles/${slug}`,
            ar: `${SITE_URL}/ar/articles/${slug}`,
            "en-US": `${SITE_URL}/en/articles/${slug}`,
            en: `${SITE_URL}/en/articles/${slug}`,
            "x-default": `${SITE_URL}/ar/articles/${slug}`,
          },
        },
      });

      articleRoutes.push({
        url: `${SITE_URL}/en/articles/${slug}`,
        lastModified: lastMod,
        changeFrequency: "weekly",
        priority: post.featured ? 0.85 : 0.75,
        images: articleImages,
        alternates: {
          languages: {
            "ar-EG": `${SITE_URL}/ar/articles/${slug}`,
            ar: `${SITE_URL}/ar/articles/${slug}`,
            "en-US": `${SITE_URL}/en/articles/${slug}`,
            en: `${SITE_URL}/en/articles/${slug}`,
            "x-default": `${SITE_URL}/ar/articles/${slug}`,
          },
        },
      });
    }

    return [...staticRoutes, ...articleRoutes];
  } catch {
    return staticRoutes;
  }
}
