import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  listPosts,
  getPostByIdOrSlug,
  createPost,
  updatePost,
  deletePost,
  getCategories,
  uploadMediaToSupabase,
} from "@/lib/supabase/db";
import { SITE_URL } from "@/lib/supabase/config";

function successResult(data: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify({ success: true, data }, null, 2),
      },
    ],
  };
}

function errorResult(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify({ success: false, error: message }, null, 2),
      },
    ],
    isError: true,
  };
}

const faqSchema = z.object({
  question: z.string().describe("السؤال الشائع بالعربية | FAQ question in Arabic"),
  answer: z.string().describe("الإجابة بالعربية | FAQ answer in Arabic"),
  question_en: z.string().optional().describe("FAQ question in English (optional)"),
  answer_en: z.string().optional().describe("FAQ answer in English (optional)"),
});

export const MCP_TOOLS_SUMMARY = [
  {
    name: "create_article",
    title: "إنشاء مقال جديد في Supabase | Create Article",
    description:
      "إضافة مقال طبي جديد متوافق مع محركات البحث SEO في قاعدة بيانات Supabase الخاصة بعيادة د. داليا عبد الموجود زارع",
  },
  {
    name: "list_articles",
    title: "عرض والبحث في المقالات | List & Search Articles",
    description:
      "البحث في مقالات الموقع واسترجاعها مع إمكانية التصفية حسب الحالة أو التصنيف أو الكلمات المفتاحية",
  },
  {
    name: "get_article",
    title: "جلب تفاصيل مقال | Get Article Details",
    description: "جلب كافة تفاصيل ومحتوى مقال محدد باستخدام المعرف ID أو الرابط الدائم Slug",
  },
  {
    name: "update_article",
    title: "تعديل مقال موجود | Update Article",
    description: "تحديث محتوى أو بيانات أو إعدادات SEO لمقال موجود في Supabase",
  },
  {
    name: "delete_article",
    title: "حذف مقال | Delete Article",
    description: "حذف مقال نهائياً من قاعدة بيانات Supabase باستخدام المعرف أو Slug",
  },
  {
    name: "upload_article_image",
    title: "رفع صورة للمقال | Upload Article Image",
    description: "رفع صورة (base64 أو رابط https) إلى مساحة تخزين الموقع وإرجاع رابط عام لاستخدامه كغلاف أو داخل المحتوى",
  },
  {
    name: "list_categories",
    title: "عرض تصنيفات المقالات | List Categories",
    description: "استرجاع قائمة التصنيفات الطبية المعتمدة في الموقع مع عدد المقالات في كل تصنيف",
  },
  {
    name: "get_clinic_seo_context",
    title: "دليل كتابة المقالات والـ SEO للعيادة | Clinic & SEO Writing Context",
    description:
      "جلب بيانات عيادة د. داليا عبد الموجود زارع والخدمات والكلمات المفتاحية المستهدفة ومعايير كتابة المقالات الطبية المتصدرة لنتائج البحث",
  },
];

export function createMcpServer(): McpServer {
  const server = new McpServer(
    {
      name: "dr-dalia-articles-mcp",
      version: "1.1.0",
    },
    {
      instructions:
        "خادم MCP الرسمي لإدارة وكتابة مقالات عيادة د. داليا عبد الموجود زارع لطب وجراحة الأسنان بلا ألم (القصر العيني - المعادي، القاهرة). يتيح لوكلاء الذكاء الاصطناعي (AI Agents) إنشاء وتعديل وحذف والبحث في المقالات مباشرة داخل Supabase مع تحسين كامل لمحركات البحث (SEO). | Official MCP Server for Dr. Dalia AbdElMougood Zariaa Painless Dental Clinic (Maadi, Cairo). Allows AI Agents to create, update, delete, and search SEO-optimized dental articles directly in Supabase. Call get_clinic_seo_context before writing. Use status 'draft' to send an article to the dashboard for review, or 'published' to publish immediately.",
    }
  );

  server.registerTool(
    "list_articles",
    {
      title: "عرض والبحث في المقالات | List & Search Articles",
      description:
        "البحث في مقالات الموقع واسترجاع قائمة المقالات من Supabase مع دعم الفلترة حسب النص، التصنيف، الحالة (published/draft/all)، والتمييز.",
      inputSchema: {
        query: z
          .string()
          .optional()
          .describe("نص البحث في العنوان أو الملخص أو المحتوى | Search query"),
        status: z
          .enum(["published", "draft", "all"])
          .optional()
          .default("all")
          .describe("حالة المقال: published أو draft أو all"),
        category: z.string().optional().describe("التصنيف الطبي | Category filter"),
        featured: z.boolean().optional().describe("المقالات المميزة فقط | Featured only"),
        tag: z.string().optional().describe("تصفية حسب وسم | Filter by tag"),
        limit: z.coerce.number().int().min(1).max(100).optional().default(20),
        offset: z.coerce.number().int().min(0).optional().default(0),
      },
    },
    async (args) => {
      try {
        const { posts, total } = await listPosts(args);
        return successResult({
          total,
          count: posts.length,
          articles: posts.map((p) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            title_en: p.title_en,
            excerpt: p.excerpt,
            category: p.category,
            status: p.status,
            featured: p.featured,
            views: p.views,
            reading_time: p.reading_time,
            tags: p.tags,
            url_ar: `${SITE_URL}/ar/articles/${p.slug}`,
            url_en: `${SITE_URL}/en/articles/${p.slug}`,
            published_at: p.published_at,
          })),
        });
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.registerTool(
    "get_article",
    {
      title: "جلب تفاصيل مقال | Get Article Details",
      description:
        "جلب كافة تفاصيل ومحتوى مقال محدد من Supabase باستخدام المعرف (id) أو الرابط الدائم (slug).",
      inputSchema: {
        id_or_slug: z
          .string()
          .min(1)
          .describe("معرف المقال (UUID) أو الرابط الدائم (slug) | Article ID or slug"),
      },
    },
    async ({ id_or_slug }) => {
      try {
        const post = await getPostByIdOrSlug(id_or_slug);
        if (!post) {
          return errorResult(`المقال غير موجود | Article not found: ${id_or_slug}`);
        }
        return successResult({
          ...post,
          url_ar: `${SITE_URL}/ar/articles/${post.slug}`,
          url_en: `${SITE_URL}/en/articles/${post.slug}`,
        });
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.registerTool(
    "create_article",
    {
      title: "إنشاء مقال جديد في Supabase | Create Article",
      description:
        "إنشاء ونشر مقال طبي جديد مباشرة في قاعدة بيانات Supabase الخاصة بموقع د. داليا عبد الموجود زارع. يقبل المحتوى بصيغة HTML أو Markdown ويحوله تلقائياً إلى تنسيق غني متوافق مع SEO.",
      inputSchema: {
        title: z
          .string()
          .min(3)
          .describe("عنوان المقال بالعربية (أو اللغة الأساسية) | Article title (required)"),
        title_en: z
          .string()
          .optional()
          .describe("عنوان المقال بالإنجليزية (اختياري) | English title (optional)"),
        slug: z
          .string()
          .optional()
          .describe(
            "الرابط الدائم للـ SEO بالإنجليزية مثل painless-teeth-whitening (يتولد تلقائياً إن تُرك فارغاً)"
          ),
        excerpt: z
          .string()
          .optional()
          .describe("ملخص قصير للمقال يظهر في البطاقات ومحركات البحث | Short summary/excerpt"),
        excerpt_en: z
          .string()
          .optional()
          .describe("ملخص المقال بالإنجليزية (اختياري) | English excerpt"),
        content: z
          .string()
          .min(20)
          .describe(
            "محتوى المقال الكامل (يدعم HTML مثل <h2>, <h3>, <p>, <ul>, <li>, <blockquote> أو Markdown) | Full article content in HTML or Markdown"
          ),
        content_en: z
          .string()
          .optional()
          .describe("محتوى المقال بالإنجليزية (اختياري - HTML أو Markdown) | English content"),
        cover_image: z
          .string()
          .optional()
          .describe("رابط صورة الغلاف (HTTPS URL) | Cover image URL"),
        image_alt: z
          .string()
          .optional()
          .describe("النص البديل للصورة لتحسين الـ SEO | Image alt text for SEO"),
        image_caption: z
          .string()
          .optional()
          .describe("وصف أسفل الصورة | Image caption"),
        category: z
          .string()
          .optional()
          .default("طب الأسنان العام")
          .describe(
            "تصنيف المقال (مثل: زراعة الأسنان، تجميل الأسنان، أسنان الأطفال، علاج العصب بلا ألم، العناية باللثة والأسنان، التركيبات الثابتة)"
          ),
        category_en: z
          .string()
          .optional()
          .describe("تصنيف المقال بالإنجليزية (مثل: Dental Implants, Cosmetic Dentistry)"),
        tags: z
          .union([z.array(z.string()), z.string()])
          .optional()
          .describe("الكلمات المفتاحية والوسوم (مصفوفة أو نص مفصول بفواصل) | Tags array or CSV"),
        status: z
          .enum(["published", "draft"])
          .optional()
          .default("published")
          .describe("حالة النشر: published (منشور فوراً) أو draft (مسودة)"),
        featured: z
          .boolean()
          .optional()
          .default(false)
          .describe("تمييز المقال في أعلى صفحة المقالات | Featured article"),
        show_on_homepage: z
          .boolean()
          .optional()
          .default(true)
          .describe("إظهار المقال في قسم المقالات بالصفحة الرئيسية | Show on landing page"),
        seo_title: z
          .string()
          .optional()
          .describe("عنوان الميتا للـ SEO (يظهر في نتائج جوجل) | Meta title for Google"),
        seo_description: z
          .string()
          .optional()
          .describe("وصف الميتا للـ SEO (150-160 حرفاً) | Meta description for Google"),
        focus_keyword: z
          .string()
          .optional()
          .describe("الكلمة المفتاحية الرئيسية المستهدفة | Primary SEO focus keyword"),
        key_takeaways: z
          .array(z.string())
          .optional()
          .describe("أهم النقاط المستفادة في بداية المقال (مصفوفة جمل) | Key takeaways list"),
        key_takeaways_en: z
          .array(z.string())
          .optional()
          .describe("Key takeaways in English (optional)"),
        faqs: z
          .array(faqSchema)
          .optional()
          .describe(
            "الأسئلة الشائعة وإجاباتها (تُولد تلقائياً FAQPage JSON-LD Schema لتصدر نتائج جوجل)"
          ),
        language: z
          .enum(["ar", "en", "both"])
          .optional()
          .default("both")
          .describe("لغة المقال: ar أو en أو both"),
      },
    },
    async (args) => {
      try {
        const created = await createPost(args);
        return successResult({
          message: "تم إنشاء المقال وحفظه في Supabase بنجاح | Article created in Supabase",
          article: created,
          url_ar: `${SITE_URL}/ar/articles/${created.slug}`,
          url_en: `${SITE_URL}/en/articles/${created.slug}`,
        });
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.registerTool(
    "update_article",
    {
      title: "تعديل مقال موجود | Update Article",
      description:
        "تعديل بيانات أو محتوى أو إعدادات الـ SEO لمقال موجود في Supabase باستخدام المعرف (id) أو الرابط الدائم (slug).",
      inputSchema: {
        id_or_slug: z
          .string()
          .min(1)
          .describe("معرف المقال أو الـ slug المراد تعديله | Target article ID or slug"),
        title: z.string().optional(),
        title_en: z.string().optional(),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        excerpt_en: z.string().optional(),
        content: z.string().optional(),
        content_en: z.string().optional(),
        cover_image: z.string().optional(),
        image_alt: z.string().optional(),
        image_caption: z.string().optional(),
        category: z.string().optional(),
        category_en: z.string().optional(),
        tags: z.union([z.array(z.string()), z.string()]).optional(),
        status: z.enum(["published", "draft"]).optional(),
        featured: z.boolean().optional(),
        show_on_homepage: z.boolean().optional(),
        seo_title: z.string().optional(),
        seo_description: z.string().optional(),
        focus_keyword: z.string().optional(),
        key_takeaways: z.array(z.string()).optional(),
        key_takeaways_en: z.array(z.string()).optional(),
        faqs: z.array(faqSchema).optional(),
        language: z.enum(["ar", "en", "both"]).optional(),
      },
    },
    async ({ id_or_slug, ...updates }) => {
      try {
        const updated = await updatePost(id_or_slug, updates);
        if (!updated) {
          return errorResult(`المقال غير موجود | Article not found: ${id_or_slug}`);
        }
        return successResult({
          message: "تم تحديث المقال في Supabase بنجاح | Article updated in Supabase",
          article: updated,
          url_ar: `${SITE_URL}/ar/articles/${updated.slug}`,
          url_en: `${SITE_URL}/en/articles/${updated.slug}`,
        });
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.registerTool(
    "delete_article",
    {
      title: "حذف مقال | Delete Article",
      description: "حذف مقال نهائياً من قاعدة بيانات Supabase باستخدام المعرف (id) أو الـ slug.",
      inputSchema: {
        id_or_slug: z
          .string()
          .min(1)
          .describe("معرف المقال أو الـ slug المراد حذفه | Article ID or slug to delete"),
      },
    },
    async ({ id_or_slug }) => {
      try {
        const deleted = await deletePost(id_or_slug);
        if (!deleted) {
          return errorResult(`المقال غير موجود | Article not found: ${id_or_slug}`);
        }
        return successResult({
          message: "تم حذف المقال من Supabase بنجاح | Article deleted from Supabase",
          id_or_slug,
        });
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.registerTool(
    "upload_article_image",
    {
      title: "رفع صورة للمقال | Upload Article Image",
      description:
        "يرفع صورة إلى مساحة تخزين الموقع (Supabase Storage) ويرجع رابطاً عاماً (url) يمكن استخدامه في cover_image أو داخل محتوى المقال <img src>. أرسل image_base64 أو image_url (واحد منهما فقط). الحد الأقصى 8MB. | Uploads an image (base64 or https URL) and returns a public URL.",
      inputSchema: {
        image_base64: z
          .string()
          .optional()
          .describe("محتوى الصورة بصيغة base64 (يقبل data:image/...;base64, أيضاً)"),
        image_url: z
          .string()
          .url()
          .optional()
          .describe("رابط https لصورة ليتم نسخها إلى مساحة تخزين الموقع"),
        filename: z
          .string()
          .optional()
          .describe("اسم الملف مع الامتداد مثل cover.jpg (اختياري)"),
      },
    },
    async ({ image_base64, image_url, filename }) => {
      try {
        const MAX_BYTES = 8 * 1024 * 1024;
        let buffer: Buffer;
        let contentType = "image/jpeg";

        if (image_base64) {
          const match = image_base64.match(/^data:([^;]+);base64,([\s\S]*)$/);
          if (match) contentType = match[1];
          buffer = Buffer.from(match ? match[2] : image_base64, "base64");
        } else if (image_url) {
          if (!image_url.startsWith("https://")) {
            return errorResult("يجب أن يبدأ الرابط بـ https:// | image_url must be https");
          }
          const res = await fetch(image_url);
          if (!res.ok) {
            return errorResult(`تعذر تحميل الصورة (${res.status}) | Failed to fetch image`);
          }
          contentType = res.headers.get("content-type")?.split(";")[0] || contentType;
          buffer = Buffer.from(await res.arrayBuffer());
        } else {
          return errorResult("أرسل image_base64 أو image_url | Provide image_base64 or image_url");
        }

        if (!contentType.startsWith("image/")) {
          return errorResult(`الملف ليس صورة (${contentType}) | Not an image`);
        }
        if (buffer.length === 0 || buffer.length > MAX_BYTES) {
          return errorResult("حجم الصورة غير صالح (الحد الأقصى 8MB) | Invalid image size (max 8MB)");
        }

        const ext = contentType.split("/")[1]?.replace("jpeg", "jpg").replace("+xml", "") || "jpg";
        const url = await uploadMediaToSupabase(buffer, filename || `image.${ext}`, contentType);
        return successResult({ url, content_type: contentType, bytes: buffer.length });
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.registerTool(
    "list_categories",
    {
      title: "عرض تصنيفات المقالات | List Categories",
      description: "استرجاع كافة تصنيفات المقالات الطبية وعدد المقالات في كل تصنيف",
      inputSchema: {},
    },
    async () => {
      try {
        const categories = await getCategories();
        return successResult({ categories });
      } catch (error) {
        return errorResult(error);
      }
    }
  );

  server.registerTool(
    "get_clinic_seo_context",
    {
      title: "دليل كتابة المقالات والـ SEO للعيادة | Clinic & SEO Context",
      description:
        "يرجع معلومات عيادة د. داليا عبد الموجود زارع والخدمات الطبية والكلمات المفتاحية وإرشادات كتابة المقالات الطبية المتصدرة لمحركات البحث",
      inputSchema: {},
    },
    async () => {
      return successResult({
        clinic: {
          doctor_ar: "د. داليا عبد الموجود زارع",
          doctor_en: "Dr. Dalia AbdElMougood Zariaa",
          credentials_ar:
            "استشاري طب وجراحة الأسنان خريجة كلية طب الأسنان القصر العيني خبرة أكثر من 20 عاماً",
          credentials_en:
            "Dental Consultant - Faculty of Dentistry, Qasr El Ainy, Cairo University - 20+ Years Experience",
          specialty_slogan_ar: "طب أسنان بلا ألم (Painless Dentistry)",
          address_ar: "45 شارع النصر، المعادي، محافظة القاهرة، مصر",
          address_en: "45 Al Nasr Street, Maadi, Cairo Governorate, Egypt",
          phone: "+201112521494",
          whatsapp: "https://wa.me/201112521494",
        },
        recommended_categories: [
          { ar: "زراعة الأسنان", en: "Dental Implants" },
          { ar: "تجميل الأسنان", en: "Cosmetic Dentistry" },
          { ar: "أسنان الأطفال", en: "Pediatric Dentistry" },
          { ar: "علاج العصب بلا ألم", en: "Painless Root Canal" },
          { ar: "العناية باللثة والأسنان", en: "Gum & Oral Care" },
          { ar: "التركيبات الثابتة", en: "Crowns & Veneers" },
          { ar: "تقويم الأسنان", en: "Orthodontics" },
        ],
        target_seo_keywords: [
          "دكتورة داليا عبد الموجود زارع",
          "عيادة أسنان في المعادي",
          "طبيب أسنان بدون ألم",
          "زراعة الأسنان بدون ألم في مصر",
          "علاج أسنان الأطفال بدون خوف",
          "ابتسامة هوليود وفينيرز إيماكس",
          "حشو العصب بدون ألم في جلسة واحدة",
          "توريد اللثة بالليزر في المعادي",
          "تركيبات الزركونيا والإيماكس",
        ],
        writing_guidelines: [
          "قسّم المقال إلى عناوين فرعية واضحة باستخدام <h2> و <h3> تتضمن الكلمات المفتاحية",
          "أضف 3 إلى 4 نقاط في حقل key_takeaways لتلخيص المقال للقارئ السريع",
          "أضف 2 إلى 4 أسئلة شائعة في حقل faqs ليتم توليد FAQPage Schema تلقائياً في جوجل",
          "اجعل الرابط الدائم (slug) باللغة الإنجليزية واضحاً ومختصراً",
        ],
      });
    }
  );

  return server;
}
