import { NextResponse } from "next/server";
import { listPosts } from "@/lib/supabase/db";
import { SITE_URL } from "@/lib/supabase/config";
import { SEED_POSTS } from "@/lib/supabase/seedPosts";

function escapeXml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  let posts = SEED_POSTS;
  try {
    const res = await listPosts({ status: "published", limit: 50 });
    if (res && Array.isArray(res.posts) && res.posts.length > 0) {
      posts = res.posts;
    }
  } catch {
    posts = SEED_POSTS;
  }

  const published = posts.filter((p) => p.status === "published");
  const buildDate = new Date().toUTCString();

  const itemsXml = published
    .map((post) => {
      const url = `${SITE_URL}/ar/articles/${encodeURIComponent(post.slug)}`;
      const pubDate = new Date(post.published_at).toUTCString();
      const title = escapeXml(post.title);
      const description = escapeXml(post.excerpt);
      const author = escapeXml(post.author_name || "د. داليا عبد الموجود زارع");
      const category = escapeXml(post.category);

      return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${description}</description>
      <category>${category}</category>
      <author>drdalia89is@gmail.com (${author})</author>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join("\n");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>عيادة د. داليا عبد الموجود زارع لطب وجراحة الأسنان | مقالات طب الأسنان بدون ألم</title>
    <link>${SITE_URL}/ar/articles</link>
    <description>الموسوعة الطبية والمقالات الموثوقة في زراعة الأسنان، ابتسامة هوليود، طب أسنان الأطفال، وعلاج العصب بدون ألم من د. داليا عبد الموجود زارع استشاري طب وجراحة الفم والأسنان بالقصر العيني.</description>
    <language>ar-eg</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <managingEditor>drdalia89is@gmail.com (د. داليا عبد الموجود زارع)</managingEditor>
    <webMaster>drdalia89is@gmail.com (د. داليا عبد الموجود زارع)</webMaster>
${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
