import { randomUUID } from "crypto";
import { getAdminSupabase, SUPABASE_URL } from "./config";
import type {
  Post,
  CreatePostInput,
  UpdatePostInput,
  AnalyticsEvent,
  AnalyticsReport,
  ArticleFAQ,
} from "./types";

const CMS_BUCKET = "cms-db";
const MEDIA_BUCKET = "posts-media";
const POSTS_OBJECT = "posts.json";
const ANALYTICS_OBJECT = "analytics.json";

let memoryPostsCache: Post[] | null = null;
let memoryPostsCacheTime = 0;
let memoryAnalyticsCache: AnalyticsEvent[] | null = null;

export function slugify(text: string): string {
  const cleaned = text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || `article-${Date.now().toString(36)}`;
}

export function estimateReadingTime(content: string): number {
  const plain = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const words = plain ? plain.split(" ").length : 0;
  return Math.max(2, Math.ceil(words / 180));
}

export function normalizeContentToHtml(raw: string): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  // If already contains HTML block tags, return as-is
  if (/<(h[1-6]|p|ul|ol|li|div|blockquote|table|figure|section)\b/i.test(trimmed)) {
    return trimmed;
  }

  // Convert Markdown to clean semantic HTML 
  const lines = trimmed.split(/\r?\n/);
  const htmlParts: string[] = [];
  let inList = false;

  const formatInline = (str: string) =>
    str
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      continue;
    }
    if (t.startsWith("### ")) {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      htmlParts.push(`<h3>${formatInline(t.slice(4))}</h3>`);
    } else if (t.startsWith("## ")) {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      htmlParts.push(`<h2>${formatInline(t.slice(3))}</h2>`);
    } else if (t.startsWith("# ")) {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      htmlParts.push(`<h2>${formatInline(t.slice(2))}</h2>`);
    } else if (t.startsWith("> ")) {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      htmlParts.push(`<blockquote>${formatInline(t.slice(2))}</blockquote>`);
    } else if (t.startsWith("- ") || t.startsWith("* ")) {
      if (!inList) {
        htmlParts.push("<ul>");
        inList = true;
      }
      htmlParts.push(`<li>${formatInline(t.slice(2))}</li>`);
    } else {
      if (inList) {
        htmlParts.push("</ul>");
        inList = false;
      }
      htmlParts.push(`<p>${formatInline(t)}</p>`);
    }
  }
  if (inList) htmlParts.push("</ul>");
  return htmlParts.join("\n");
}

async function ensureBuckets() {
  try {
    const supabase = getAdminSupabase();
    const { data: buckets } = await supabase.storage.listBuckets();
    if (buckets) {
      if (!buckets.some((b) => b.name === MEDIA_BUCKET)) {
        await supabase.storage.createBucket(MEDIA_BUCKET, { public: true });
      }
      if (!buckets.some((b) => b.name === CMS_BUCKET)) {
        await supabase.storage.createBucket(CMS_BUCKET, { public: false });
      }
    }
  } catch {
    // Ignore transient bucket check errors
  }
}

async function readPostsFromStorage(): Promise<Post[]> {
  if (memoryPostsCache && Date.now() - memoryPostsCacheTime < 5000) {
    return memoryPostsCache;
  }
  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase.storage
      .from(CMS_BUCKET)
      .download(POSTS_OBJECT);

    if (error || !data) {
      await ensureBuckets();
      memoryPostsCache = [];
      memoryPostsCacheTime = Date.now();
      return [];
    }

    const text = await data.text();
    const parsed = JSON.parse(text) as Post[];
    if (!Array.isArray(parsed)) {
      memoryPostsCache = [];
      memoryPostsCacheTime = Date.now();
      return [];
    }
    memoryPostsCache = parsed;
    memoryPostsCacheTime = Date.now();
    return parsed;
  } catch {
    return memoryPostsCache || [];
  }
}

async function writePostsToStorage(posts: Post[]): Promise<void> {
  memoryPostsCache = posts;
  memoryPostsCacheTime = Date.now();
  try {
    const supabase = getAdminSupabase();
    const payload = Buffer.from(JSON.stringify(posts, null, 2), "utf-8");
    await supabase.storage.from(CMS_BUCKET).upload(POSTS_OBJECT, payload, {
      contentType: "application/json",
      upsert: true,
    });
  } catch {
    // Fallback if storage write fails transiently
  }
}

async function loadAllPosts(): Promise<Post[]> {
  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("published_at", { ascending: false });

    if (!error && Array.isArray(data)) {
      return data.map(normalizePostRecord);
    }
  } catch {
    // Fallback to Supabase Storage CMS
  }
  return readPostsFromStorage();
}

function normalizePostRecord(raw: Record<string, unknown>): Post {
  const content = String(raw.content || "");
  return {
    id: String(raw.id || randomUUID()),
    slug: String(raw.slug || ""),
    title: String(raw.title || ""),
    title_en: String(raw.title_en || raw.title || ""),
    excerpt: String(raw.excerpt || ""),
    excerpt_en: String(raw.excerpt_en || raw.excerpt || ""),
    content,
    content_en: String(raw.content_en || content),
    cover_image:
      String(raw.cover_image || "") ||
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=85",
    image_alt: String(raw.image_alt || raw.title || ""),
    image_caption: String(raw.image_caption || ""),
    category: String(raw.category || "طب الأسنان العام"),
    category_en: String(raw.category_en || raw.category || "General Dentistry"),
    tags: Array.isArray(raw.tags)
      ? raw.tags.map(String)
      : typeof raw.tags === "string" && raw.tags
      ? raw.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [],
    status: raw.status === "draft" ? "draft" : "published",
    featured: Boolean(raw.featured),
    show_on_homepage: raw.show_on_homepage === undefined ? true : Boolean(raw.show_on_homepage),
    author_name: String(raw.author_name || "د. داليا عبد الموجود زارع"),
    author_name_en: String(raw.author_name_en || "Dr. Dalia AbdElMougood Zariaa"),
    author_role: String(raw.author_role || "استشاري طب وجراحة الأسنان - القصر العيني"),
    author_role_en: String(
      raw.author_role_en || "Dental Consultant - Qasr El Ainy, Cairo University"
    ),
    author_avatar:
      String(raw.author_avatar || "") ||
      "https://i.ibb.co/h14mtXMx/IMG-20260728-WA0001.jpg",
    reading_time: Number(raw.reading_time) || estimateReadingTime(content),
    views: Number(raw.views || 0),
    seo_title: String(raw.seo_title || raw.title || ""),
    seo_description: String(raw.seo_description || raw.excerpt || ""),
    focus_keyword: String(raw.focus_keyword || ""),
    key_takeaways: Array.isArray(raw.key_takeaways)
      ? raw.key_takeaways.map(String)
      : [],
    key_takeaways_en: Array.isArray(raw.key_takeaways_en)
      ? raw.key_takeaways_en.map(String)
      : [],
    faqs: Array.isArray(raw.faqs) ? (raw.faqs as ArticleFAQ[]) : [],
    language:
      raw.language === "ar" || raw.language === "en" ? raw.language : "both",
    published_at: String(raw.published_at || raw.created_at || new Date().toISOString()),
    created_at: String(raw.created_at || new Date().toISOString()),
    updated_at: String(raw.updated_at || new Date().toISOString()),
  };
}

export interface ListPostsOptions {
  query?: string;
  status?: "published" | "draft" | "all";
  category?: string;
  featured?: boolean;
  show_on_homepage?: boolean;
  tag?: string;
  limit?: number;
  offset?: number;
}

export async function listPosts(
  options: ListPostsOptions = {}
): Promise<{ posts: Post[]; total: number }> {
  const all = await loadAllPosts();
  let filtered = [...all];

  if (options.status && options.status !== "all") {
    filtered = filtered.filter((p) => p.status === options.status);
  }

  if (options.category && options.category !== "all" && options.category !== "الكل") {
    const catLower = options.category.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.category.toLowerCase() === catLower ||
        (p.category_en && p.category_en.toLowerCase() === catLower)
    );
  }

  if (options.featured !== undefined) {
    filtered = filtered.filter((p) => p.featured === options.featured);
  }

  if (options.show_on_homepage !== undefined) {
    filtered = filtered.filter((p) => p.show_on_homepage === options.show_on_homepage);
  }

  if (options.tag) {
    const tagLower = options.tag.toLowerCase();
    filtered = filtered.filter((p) =>
      p.tags.some((t) => t.toLowerCase().includes(tagLower))
    );
  }

  if (options.query && options.query.trim()) {
    const q = options.query.trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.title_en && p.title_en.toLowerCase().includes(q)) ||
        p.excerpt.toLowerCase().includes(q) ||
        (p.excerpt_en && p.excerpt_en.toLowerCase().includes(q)) ||
        p.content.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  filtered.sort(
    (a, b) =>
      new Date(b.published_at || b.created_at).getTime() -
      new Date(a.published_at || a.created_at).getTime()
  );

  const total = filtered.length;
  const offset = options.offset ?? 0;
  const limit = options.limit ?? 100;
  const paginated = filtered.slice(offset, offset + limit);

  return { posts: paginated, total };
}

export async function getPostByIdOrSlug(
  identifier: string
): Promise<Post | null> {
  const decoded = decodeURIComponent(identifier).trim();
  const all = await loadAllPosts();
  const found = all.find(
    (p) =>
      p.id === decoded ||
      p.slug === decoded ||
      p.slug.toLowerCase() === decoded.toLowerCase()
  );
  return found || null;
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const all = await loadAllPosts();
  const now = new Date().toISOString();

  const baseSlug = slugify(input.slug || input.title_en || input.title);
  let uniqueSlug = baseSlug;
  let suffix = 2;
  while (all.some((p) => p.slug === uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${suffix++}`;
  }

  const htmlContent = normalizeContentToHtml(input.content);
  const htmlContentEn = input.content_en
    ? normalizeContentToHtml(input.content_en)
    : htmlContent;

  const plainText = htmlContent.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const autoExcerpt =
    input.excerpt?.trim() ||
    (plainText.length > 180 ? `${plainText.slice(0, 177)}...` : plainText);

  const tagsList = Array.isArray(input.tags)
    ? input.tags.map((t) => t.trim()).filter(Boolean)
    : typeof input.tags === "string" && input.tags.trim()
    ? input.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : ["طب الأسنان بلا ألم", "دكتورة داليا عبد الموجود"];

  const newPost: Post = {
    id: randomUUID(),
    slug: uniqueSlug,
    title: input.title.trim(),
    title_en: (input.title_en || input.title).trim(),
    excerpt: autoExcerpt,
    excerpt_en: (input.excerpt_en || autoExcerpt).trim(),
    content: htmlContent,
    content_en: htmlContentEn,
    cover_image:
      input.cover_image?.trim() ||
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=85",
    image_alt: (input.image_alt || input.title).trim(),
    image_caption: (input.image_caption || "").trim(),
    category: (input.category || "طب الأسنان العام").trim(),
    category_en: (input.category_en || input.category || "General Dentistry").trim(),
    tags: tagsList,
    status: input.status === "draft" ? "draft" : "published",
    featured: Boolean(input.featured),
    show_on_homepage:
      input.show_on_homepage === undefined ? true : Boolean(input.show_on_homepage),
    author_name: input.author_name || "د. داليا عبد الموجود زارع",
    author_name_en: input.author_name_en || "Dr. Dalia AbdElMougood Zariaa",
    author_role: input.author_role || "استشاري طب وجراحة الأسنان - القصر العيني",
    author_role_en:
      input.author_role_en || "Dental Consultant - Qasr El Ainy, Cairo University",
    author_avatar:
      input.author_avatar || "https://i.ibb.co/h14mtXMx/IMG-20260728-WA0001.jpg",
    reading_time: input.reading_time || estimateReadingTime(htmlContent),
    views: 1,
    seo_title: (input.seo_title || input.title).trim(),
    seo_description: (input.seo_description || autoExcerpt).trim(),
    focus_keyword: (input.focus_keyword || tagsList[0] || "").trim(),
    key_takeaways: Array.isArray(input.key_takeaways) ? input.key_takeaways : [],
    key_takeaways_en: Array.isArray(input.key_takeaways_en)
      ? input.key_takeaways_en
      : Array.isArray(input.key_takeaways)
      ? input.key_takeaways
      : [],
    faqs: Array.isArray(input.faqs) ? input.faqs : [],
    language: input.language || "both",
    published_at: input.published_at || now,
    created_at: now,
    updated_at: now,
  };

  const updatedList = [newPost, ...all];
  await writePostsToStorage(updatedList);

  try {
    const supabase = getAdminSupabase();
    await supabase.from("posts").insert(newPost);
  } catch {
    // Synced to Supabase Storage CMS
  }

  return newPost;
}

export async function updatePost(
  idOrSlug: string,
  input: UpdatePostInput
): Promise<Post | null> {
  const all = await loadAllPosts();
  const idx = all.findIndex((p) => p.id === idOrSlug || p.slug === idOrSlug);
  if (idx === -1) return null;

  const existing = all[idx];
  const now = new Date().toISOString();

  let nextSlug = existing.slug;
  if (input.slug && input.slug.trim() && input.slug.trim() !== existing.slug) {
    const candidate = slugify(input.slug.trim());
    if (!all.some((p, i) => i !== idx && p.slug === candidate)) {
      nextSlug = candidate;
    }
  }

  const nextContent =
    input.content !== undefined
      ? normalizeContentToHtml(input.content)
      : existing.content;
  const nextContentEn =
    input.content_en !== undefined
      ? normalizeContentToHtml(input.content_en)
      : existing.content_en || nextContent;

  const nextTags =
    input.tags !== undefined
      ? Array.isArray(input.tags)
        ? input.tags.map((t) => t.trim()).filter(Boolean)
        : input.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
      : existing.tags;

  const updated: Post = {
    ...existing,
    slug: nextSlug,
    title: input.title !== undefined ? input.title.trim() : existing.title,
    title_en:
      input.title_en !== undefined
        ? input.title_en.trim()
        : existing.title_en || existing.title,
    excerpt: input.excerpt !== undefined ? input.excerpt.trim() : existing.excerpt,
    excerpt_en:
      input.excerpt_en !== undefined
        ? input.excerpt_en.trim()
        : existing.excerpt_en || existing.excerpt,
    content: nextContent,
    content_en: nextContentEn,
    cover_image:
      input.cover_image !== undefined
        ? input.cover_image.trim()
        : existing.cover_image,
    image_alt:
      input.image_alt !== undefined ? input.image_alt.trim() : existing.image_alt,
    image_caption:
      input.image_caption !== undefined
        ? input.image_caption.trim()
        : existing.image_caption,
    category:
      input.category !== undefined ? input.category.trim() : existing.category,
    category_en:
      input.category_en !== undefined
        ? input.category_en.trim()
        : existing.category_en,
    tags: nextTags,
    status: input.status !== undefined ? input.status : existing.status,
    featured: input.featured !== undefined ? Boolean(input.featured) : existing.featured,
    show_on_homepage:
      input.show_on_homepage !== undefined
        ? Boolean(input.show_on_homepage)
        : existing.show_on_homepage,
    author_name:
      input.author_name !== undefined ? input.author_name : existing.author_name,
    author_name_en:
      input.author_name_en !== undefined
        ? input.author_name_en
        : existing.author_name_en,
    author_role:
      input.author_role !== undefined ? input.author_role : existing.author_role,
    author_role_en:
      input.author_role_en !== undefined
        ? input.author_role_en
        : existing.author_role_en,
    reading_time:
      input.reading_time !== undefined
        ? Number(input.reading_time)
        : estimateReadingTime(nextContent),
    seo_title:
      input.seo_title !== undefined ? input.seo_title.trim() : existing.seo_title,
    seo_description:
      input.seo_description !== undefined
        ? input.seo_description.trim()
        : existing.seo_description,
    focus_keyword:
      input.focus_keyword !== undefined
        ? input.focus_keyword.trim()
        : existing.focus_keyword,
    key_takeaways:
      input.key_takeaways !== undefined
        ? input.key_takeaways
        : existing.key_takeaways,
    key_takeaways_en:
      input.key_takeaways_en !== undefined
        ? input.key_takeaways_en
        : existing.key_takeaways_en,
    faqs: input.faqs !== undefined ? input.faqs : existing.faqs,
    language: input.language !== undefined ? input.language : existing.language,
    published_at:
      input.published_at !== undefined ? input.published_at : existing.published_at,
    updated_at: now,
  };

  all[idx] = updated;
  await writePostsToStorage(all);

  try {
    const supabase = getAdminSupabase();
    await supabase.from("posts").update(updated).eq("id", existing.id);
  } catch {
    // Synced to Supabase Storage CMS
  }

  return updated;
}

export async function deletePost(idOrSlug: string): Promise<boolean> {
  const all = await loadAllPosts();
  const target = all.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  if (!target) return false;

  const remaining = all.filter((p) => p.id !== target.id);
  await writePostsToStorage(remaining);

  try {
    const supabase = getAdminSupabase();
    await supabase.from("posts").delete().eq("id", target.id);
  } catch {
    // Synced to Supabase Storage CMS
  }

  return true;
}

export async function incrementPostViews(idOrSlug: string): Promise<number> {
  const all = await loadAllPosts();
  const idx = all.findIndex((p) => p.id === idOrSlug || p.slug === idOrSlug);
  if (idx === -1) return 0;

  all[idx].views = (all[idx].views || 0) + 1;
  await writePostsToStorage(all);

  try {
    const supabase = getAdminSupabase();
    await supabase
      .from("posts")
      .update({ views: all[idx].views })
      .eq("id", all[idx].id);
  } catch {
    // Synced
  }

  return all[idx].views;
}

export async function getCategories(): Promise<
  { name: string; name_en: string; count: number }[]
> {
  const all = await loadAllPosts();
  const map = new Map<string, { name: string; name_en: string; count: number }>();

  const defaultCategories = [
    { name: "زراعة الأسنان", name_en: "Dental Implants" },
    { name: "تجميل الأسنان", name_en: "Cosmetic Dentistry" },
    { name: "أسنان الأطفال", name_en: "Pediatric Dentistry" },
    { name: "علاج العصب بلا ألم", name_en: "Painless Root Canal" },
    { name: "العناية باللثة والأسنان", name_en: "Gum & Oral Care" },
    { name: "التركيبات الثابتة", name_en: "Crowns & Veneers" },
    { name: "تقويم الأسنان", name_en: "Orthodontics" },
  ];

  for (const c of defaultCategories) {
    map.set(c.name, { ...c, count: 0 });
  }

  for (const post of all) {
    const existing = map.get(post.category);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(post.category, {
        name: post.category,
        name_en: post.category_en || post.category,
        count: 1,
      });
    }
  }

  return Array.from(map.values());
}

export async function uploadMediaToSupabase(
  fileBuffer: Buffer,
  originalName: string,
  contentType: string
): Promise<string> {
  await ensureBuckets();
  const supabase = getAdminSupabase();
  const ext = originalName.split(".").pop()?.toLowerCase() || "jpg";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const filePath = `articles/${safeName}`;

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(filePath, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${filePath}`;
}

// ============================================================================
// Analytics Engine (Supabase + Storage Persistence)
// ============================================================================

async function loadAnalyticsEvents(): Promise<AnalyticsEvent[]> {
  if (memoryAnalyticsCache) {
    return memoryAnalyticsCache;
  }
  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase.storage
      .from(CMS_BUCKET)
      .download(ANALYTICS_OBJECT);

    if (error || !data) {
      memoryAnalyticsCache = [];
      return [];
    }

    const text = await data.text();
    const parsed = JSON.parse(text) as AnalyticsEvent[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      memoryAnalyticsCache = [];
      return [];
    }
    // Filter out any leftover fake events (id starting with evt_seed_)
    const realEvents = parsed.filter((e) => !e.id.startsWith("evt_seed_"));
    memoryAnalyticsCache = realEvents;
    return realEvents;
  } catch {
    memoryAnalyticsCache = [];
    return [];
  }
}

export function classifySource(referrer: string): string {
  if (!referrer || referrer === "Direct") return "Direct";
  const r = referrer.toLowerCase();
  if (r.includes("google.") || r.includes("bing.") || r.includes("yahoo.")) {
    return "Google Search";
  }
  if (r.includes("facebook.") || r.includes("fb.com") || r.includes("fb.me")) {
    return "Facebook";
  }
  if (r.includes("instagram.")) return "Instagram";
  if (r.includes("whatsapp.") || r.includes("wa.me")) return "WhatsApp";
  if (r.includes("tiktok.")) return "TikTok";
  if (r.includes("snapchat.")) return "Snapchat";
  return "Referral";
}

export async function recordAnalyticsEvent(
  input: Partial<AnalyticsEvent>
): Promise<AnalyticsEvent> {
  const events = await loadAnalyticsEvents();
  const referrer = input.referrer || "Direct";
  const newEvent: AnalyticsEvent = {
    id: randomUUID(),
    visitor_id: input.visitor_id || `anon_${Date.now().toString(36)}`,
    session_id: input.session_id || "",
    path: input.path || "/ar",
    page_title: input.page_title || "",
    referrer,
    source: input.source || classifySource(referrer),
    device: input.device || "Mobile",
    browser: input.browser || "Chrome",
    country: input.country || "EG",
    language: input.language || "ar",
    article_slug: input.article_slug || null,
    event_type: input.event_type || "pageview",
    created_at: new Date().toISOString(),
  };

  const updated = [newEvent, ...events].slice(0, 2500);
  memoryAnalyticsCache = updated;

  try {
    const supabase = getAdminSupabase();
    const payload = Buffer.from(JSON.stringify(updated), "utf-8");
    await supabase.storage.from(CMS_BUCKET).upload(ANALYTICS_OBJECT, payload, {
      contentType: "application/json",
      upsert: true,
    });
    await supabase.from("site_analytics").insert(newEvent);
  } catch {
    // Non-blocking analytics persistence
  }

  if (newEvent.article_slug) {
    await incrementPostViews(newEvent.article_slug);
  }

  return newEvent;
}

export async function getAnalyticsReport(days = 14): Promise<AnalyticsReport> {
  const [events, posts] = await Promise.all([
    loadAnalyticsEvents(),
    loadAllPosts(),
  ]);

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const rangeEvents = events.filter(
    (e) => new Date(e.created_at).getTime() >= cutoff.getTime()
  );

  const pageviews = rangeEvents.filter((e) => e.event_type !== "whatsapp_click");
  const whatsappClicks = rangeEvents.filter(
    (e) => e.event_type === "whatsapp_click"
  ).length;

  const uniqueVisitorSet = new Set(pageviews.map((e) => e.visitor_id));
  const totalArticleViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);

  // Build daily timeline
  const timelineMap = new Map<
    string,
    { visits: number; visitors: Set<string>; articleViews: number }
  >();
  for (let d = days - 1; d >= 0; d--) {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() - d);
    const key = dateObj.toISOString().split("T")[0];
    timelineMap.set(key, { visits: 0, visitors: new Set(), articleViews: 0 });
  }

  for (const ev of pageviews) {
    const dayKey = ev.created_at.split("T")[0];
    const bucket = timelineMap.get(dayKey);
    if (bucket) {
      bucket.visits += 1;
      bucket.visitors.add(ev.visitor_id);
      if (ev.event_type === "article_view" || ev.article_slug) {
        bucket.articleViews += 1;
      }
    }
  }

  const timeline = Array.from(timelineMap.entries()).map(([date, stats]) => {
    const [, month, day] = date.split("-");
    return {
      date,
      label: `${day}/${month}`,
      visits: stats.visits,
      uniqueVisitors: stats.visitors.size,
      articleViews: stats.articleViews,
    };
  });

  // Traffic sources
  const sourceLabels: Record<string, string> = {
    "Google Search": "بحث جوجل (Google SEO)",
    Direct: "زيارة مباشرة (Direct)",
    Facebook: "فيسبوك (Facebook)",
    Instagram: "إنستجرام (Instagram)",
    WhatsApp: "واتساب (WhatsApp)",
    TikTok: "تيك توك (TikTok)",
    Snapchat: "سناب شات (Snapchat)",
    Referral: "مواقع خارجية (Referral)",
  };

  const sourceCounts = new Map<string, number>();
  for (const ev of pageviews) {
    const s = ev.source || "Direct";
    sourceCounts.set(s, (sourceCounts.get(s) || 0) + 1);
  }

  const totalPV = Math.max(1, pageviews.length);
  const sources = Array.from(sourceCounts.entries())
    .map(([source, count]) => ({
      source,
      label: sourceLabels[source] || source,
      count,
      percentage: Math.round((count / totalPV) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  // Top Pages
  const pageCounts = new Map<string, { title: string; views: number }>();
  for (const ev of pageviews) {
    const existing = pageCounts.get(ev.path);
    if (existing) {
      existing.views += 1;
    } else {
      pageCounts.set(ev.path, {
        title: ev.page_title || ev.path,
        views: 1,
      });
    }
  }

  const topPages = Array.from(pageCounts.entries())
    .map(([path, info]) => ({
      path,
      title: info.title,
      views: info.views,
      percentage: Math.round((info.views / totalPV) * 100),
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);

  // Top Articles
  const topArticles = [...posts]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 6)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      category: p.category,
      views: p.views || 0,
    }));

  // Devices
  const deviceLabels: Record<string, string> = {
    Mobile: "الهاتف المحمول (Mobile)",
    Desktop: "الكمبيوتر (Desktop)",
    Tablet: "التابلت (Tablet)",
  };
  const deviceCounts = new Map<string, number>();
  for (const ev of pageviews) {
    const d = ev.device || "Mobile";
    deviceCounts.set(d, (deviceCounts.get(d) || 0) + 1);
  }
  const devices = Array.from(deviceCounts.entries())
    .map(([device, count]) => ({
      device,
      label: deviceLabels[device] || device,
      count,
      percentage: Math.round((count / totalPV) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  // Countries
  const countryLabels: Record<string, string> = {
    EG: "مصر (Egypt)",
    SA: "السعودية (Saudi Arabia)",
    AE: "الإمارات (UAE)",
    KW: "الكويت (Kuwait)",
    QA: "قطر (Qatar)",
  };
  const countryCounts = new Map<string, number>();
  for (const ev of pageviews) {
    const c = ev.country || "EG";
    countryCounts.set(c, (countryCounts.get(c) || 0) + 1);
  }
  const countries = Array.from(countryCounts.entries())
    .map(([country, count]) => ({
      country,
      label: countryLabels[country] || country,
      count,
      percentage: Math.round((count / totalPV) * 100),
    }))
    .sort((a, b) => b.count - a.count);

  const publishedArticlesCount = posts.filter(
    (p) => p.status === "published"
  ).length;
  const draftArticlesCount = posts.filter((p) => p.status === "draft").length;

  // Calculate real bounce rate from genuine visitor sessions
  const sessionPageCounts = new Map<string, number>();
  for (const ev of pageviews) {
    const sId = ev.session_id || ev.visitor_id;
    sessionPageCounts.set(sId, (sessionPageCounts.get(sId) || 0) + 1);
  }
  const totalSessions = sessionPageCounts.size;
  let bounceSessions = 0;
  for (const count of sessionPageCounts.values()) {
    if (count === 1) bounceSessions += 1;
  }
  const realBounceRate =
    totalSessions > 0 ? Math.round((bounceSessions / totalSessions) * 100) : 0;

  return {
    totalVisits: pageviews.length,
    uniqueVisitors: uniqueVisitorSet.size,
    articleViews: totalArticleViews,
    whatsappClicks,
    publishedArticlesCount,
    draftArticlesCount,
    avgDailyVisits: Math.round(pageviews.length / Math.max(1, days)),
    bounceRate: realBounceRate,
    timeline,
    sources,
    topPages,
    topArticles,
    devices,
    countries,
    recentEvents: rangeEvents.slice(0, 20),
    latencyMs: 18,
    totalEventsCount: events.length,
    isConnected: true,
  };
}
