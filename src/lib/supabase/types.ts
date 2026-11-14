export interface ArticleFAQ {
  question: string;
  answer: string;
  question_en?: string;
  answer_en?: string;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  title_en?: string;
  excerpt: string;
  excerpt_en?: string;
  content: string;
  content_en?: string;
  cover_image: string;
  image_alt?: string;
  image_caption?: string;
  category: string;
  category_en?: string;
  tags: string[];
  status: "published" | "draft";
  featured: boolean;
  show_on_homepage: boolean;
  author_name: string;
  author_name_en?: string;
  author_role: string;
  author_role_en?: string;
  author_avatar?: string;
  reading_time: number;
  views: number;
  seo_title?: string;
  seo_description?: string;
  focus_keyword?: string;
  key_takeaways: string[];
  key_takeaways_en?: string[];
  faqs: ArticleFAQ[];
  language: "ar" | "en" | "both";
  published_at: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePostInput {
  slug?: string;
  title: string;
  title_en?: string;
  excerpt?: string;
  excerpt_en?: string;
  content: string;
  content_en?: string;
  cover_image?: string;
  image_alt?: string;
  image_caption?: string;
  category?: string;
  category_en?: string;
  tags?: string[] | string;
  status?: "published" | "draft";
  featured?: boolean;
  show_on_homepage?: boolean;
  author_name?: string;
  author_name_en?: string;
  author_role?: string;
  author_role_en?: string;
  author_avatar?: string;
  reading_time?: number;
  seo_title?: string;
  seo_description?: string;
  focus_keyword?: string;
  key_takeaways?: string[];
  key_takeaways_en?: string[];
  faqs?: ArticleFAQ[];
  language?: "ar" | "en" | "both";
  published_at?: string;
}

export type UpdatePostInput = Partial<CreatePostInput>;

export interface AnalyticsEvent {
  id: string;
  visitor_id: string;
  session_id?: string;
  path: string;
  page_title?: string;
  referrer: string;
  source: string;
  device: "Desktop" | "Mobile" | "Tablet";
  browser?: string;
  country?: string;
  language?: string;
  article_slug?: string | null;
  event_type: "pageview" | "article_view" | "whatsapp_click";
  created_at: string;
}

export interface AnalyticsTimelinePoint {
  date: string;
  label: string;
  visits: number;
  uniqueVisitors: number;
  articleViews: number;
}

export interface AnalyticsReport {
  totalVisits: number;
  uniqueVisitors: number;
  articleViews: number;
  whatsappClicks: number;
  publishedArticlesCount: number;
  draftArticlesCount: number;
  avgDailyVisits: number;
  bounceRate: number;
  timeline: AnalyticsTimelinePoint[];
  sources: { source: string; label: string; count: number; percentage: number }[];
  topPages: { path: string; title: string; views: number; percentage: number }[];
  topArticles: { slug: string; title: string; category: string; views: number }[];
  devices: { device: string; label: string; count: number; percentage: number }[];
  countries: { country: string; label: string; count: number; percentage: number }[];
  recentEvents: AnalyticsEvent[];
}
