"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  Star,
  CheckCircle2,
  FileText,
  Sparkles,
  Upload,
  Copy,
  Check,
  X,
  ExternalLink,
  RefreshCw,
  Bot,
  Globe,
  HelpCircle,
  ListChecks,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  Quote,
  Image as ImageIcon,
  Link as LinkIcon,
  AlertTriangle,
  Home,
} from "lucide-react";
import type { Post, ArticleFAQ } from "@/lib/supabase/types";
import { MCP_TOOLS_SUMMARY } from "@/lib/mcp";

const DEFAULT_CATEGORIES = [
  { ar: "زراعة الأسنان", en: "Dental Implants" },
  { ar: "تجميل الأسنان", en: "Cosmetic Dentistry" },
  { ar: "أسنان الأطفال", en: "Pediatric Dentistry" },
  { ar: "علاج العصب بلا ألم", en: "Painless Root Canal" },
  { ar: "العناية باللثة والأسنان", en: "Gum & Oral Care" },
  { ar: "التركيبات الثابتة", en: "Crowns & Veneers" },
  { ar: "تقويم الأسنان", en: "Orthodontics" },
  { ar: "طب الأسنان العام", en: "General Dentistry" },
];

interface FormState {
  id?: string;
  title: string;
  title_en: string;
  slug: string;
  excerpt: string;
  excerpt_en: string;
  content: string;
  content_en: string;
  cover_image: string;
  image_alt: string;
  image_caption: string;
  category: string;
  category_en: string;
  tags: string;
  status: "published" | "draft";
  featured: boolean;
  show_on_homepage: boolean;
  reading_time: number;
  seo_title: string;
  seo_description: string;
  focus_keyword: string;
  key_takeaways: string[];
  faqs: ArticleFAQ[];
}

const EMPTY_FORM: FormState = {
  title: "",
  title_en: "",
  slug: "",
  excerpt: "",
  excerpt_en: "",
  content: "",
  content_en: "",
  cover_image:
    "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=85",
  image_alt: "",
  image_caption: "",
  category: "زراعة الأسنان",
  category_en: "Dental Implants",
  tags: "طب الأسنان بلا ألم, عيادة أسنان المعادي, دكتورة داليا عبد الموجود",
  status: "published",
  featured: false,
  show_on_homepage: true,
  reading_time: 4,
  seo_title: "",
  seo_description: "",
  focus_keyword: "",
  key_takeaways: [
    "إجراء طبي آمن ومريح بالكامل بدون ألم في عيادة د. داليا عبد الموجود زارع.",
  ],
  faqs: [
    {
      question: "هل الإجراء مؤلم؟",
      answer:
        "لا على الإطلاق، يتم الإجراء تحت تخدير موضعي متطور يضمن راحة المريض التامة بدون أي ألم.",
    },
  ],
};

function generateClientSlug(text: string): string {
  return (
    text
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, "-")
      .replace(/[^\p{L}\p{N}-]+/gu, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "") || `article-${Date.now().toString(36)}`
  );
}

export default function ArticlesManagerTab() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploadingCover, setUploadingCover] = useState<boolean>(false);
  const [uploadingInline, setUploadingInline] = useState<boolean>(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft" | "featured"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Modals
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorTab, setEditorTab] = useState<
    "content" | "media" | "takeaways" | "seo"
  >("content");
  const [previewMode, setPreviewMode] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [mcpModalOpen, setMcpModalOpen] = useState(false);
  const [mcpCopiedKey, setMcpCopiedKey] = useState<string | null>(null);
  const [mcpStatus, setMcpStatus] = useState<{
    testing: boolean;
    online?: boolean;
    message?: string;
  }>({ testing: false });

  const contentTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const inlineImageInputRef = useRef<HTMLInputElement | null>(null);
  const coverImageInputRef = useRef<HTMLInputElement | null>(null);

  const showNotice = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3500);
    },
    []
  );

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts?status=all&limit=200");
      const data = await res.json();
      if (data?.success && Array.isArray(data.posts)) {
        setPosts(data.posts);
      }
    } catch {
      showNotice("تعذر تحميل المقالات", "error");
    } finally {
      setLoading(false);
    }
  }, [showNotice]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (statusFilter === "published" && p.status !== "published") return false;
      if (statusFilter === "draft" && p.status !== "draft") return false;
      if (statusFilter === "featured" && !p.featured) return false;
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const hit =
          p.title.toLowerCase().includes(q) ||
          (p.title_en && p.title_en.toLowerCase().includes(q)) ||
          p.slug.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q));
        if (!hit) return false;
      }
      return true;
    });
  }, [posts, statusFilter, categoryFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = posts.length;
    const published = posts.filter((p) => p.status === "published").length;
    const drafts = posts.filter((p) => p.status === "draft").length;
    const featured = posts.filter((p) => p.featured).length;
    const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
    return { total, published, drafts, featured, totalViews };
  }, [posts]);

  const openCreateEditor = () => {
    setForm(EMPTY_FORM);
    setEditorTab("content");
    setPreviewMode(false);
    setEditorOpen(true);
  };

  const openEditEditor = (post: Post) => {
    setForm({
      id: post.id,
      title: post.title || "",
      title_en: post.title_en || "",
      slug: post.slug || "",
      excerpt: post.excerpt || "",
      excerpt_en: post.excerpt_en || "",
      content: post.content || "",
      content_en: post.content_en || "",
      cover_image: post.cover_image || "",
      image_alt: post.image_alt || "",
      image_caption: post.image_caption || "",
      category: post.category || "زراعة الأسنان",
      category_en: post.category_en || "Dental Implants",
      tags: (post.tags || []).join(", "),
      status: post.status || "published",
      featured: Boolean(post.featured),
      show_on_homepage: post.show_on_homepage !== false,
      reading_time: post.reading_time || 4,
      seo_title: post.seo_title || post.title || "",
      seo_description: post.seo_description || post.excerpt || "",
      focus_keyword: post.focus_keyword || "",
      key_takeaways:
        post.key_takeaways && post.key_takeaways.length > 0
          ? post.key_takeaways
          : [""],
      faqs:
        post.faqs && post.faqs.length > 0
          ? post.faqs
          : [{ question: "", answer: "" }],
    });
    setEditorTab("content");
    setPreviewMode(false);
    setEditorOpen(true);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      showNotice("يرجى إدخال عنوان المقال", "error");
      return;
    }
    if (!form.content.trim()) {
      showNotice("يرجى إدخال محتوى المقال", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        slug:
          form.slug.trim() ||
          generateClientSlug(form.title_en || form.title),
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        key_takeaways: form.key_takeaways.map((k) => k.trim()).filter(Boolean),
        faqs: form.faqs.filter(
          (f) => f.question.trim() && f.answer.trim()
        ),
      };

      const isEdit = Boolean(form.id);
      const url = isEdit ? `/api/posts/${form.id}` : "/api/posts";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "فشل حفظ المقال");
      }

      showNotice(
        isEdit
          ? "تم تحديث المقال بنجاح في Supabase!"
          : "تم إنشاء ونشر المقال بنجاح في Supabase!"
      );
      setEditorOpen(false);
      await loadPosts();
    } catch (err) {
      showNotice(
        err instanceof Error ? err.message : "حدث خطأ أثناء حفظ المقال",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleQuickToggle = async (
    post: Post,
    field: "status" | "featured" | "show_on_homepage"
  ) => {
    const nextValue =
      field === "status"
        ? post.status === "published"
          ? "draft"
          : "published"
        : !post[field];

    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: nextValue }),
      });
      const data = await res.json();
      if (data?.success && data.post) {
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? data.post : p))
        );
        showNotice("تم تحديث حالة المقال بنجاح");
      }
    } catch {
      showNotice("تعذر تحديث المقال", "error");
    }
  };

  const handleDuplicate = async (post: Post) => {
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${post.title} (نسخة)`,
          title_en: post.title_en ? `${post.title_en} (Copy)` : "",
          slug: `${post.slug}-copy-${Date.now().toString(36).slice(-4)}`,
          excerpt: post.excerpt,
          excerpt_en: post.excerpt_en,
          content: post.content,
          content_en: post.content_en,
          cover_image: post.cover_image,
          image_alt: post.image_alt,
          image_caption: post.image_caption,
          category: post.category,
          category_en: post.category_en,
          tags: post.tags,
          status: "draft",
          featured: false,
          show_on_homepage: post.show_on_homepage,
          seo_title: post.seo_title,
          seo_description: post.seo_description,
          focus_keyword: post.focus_keyword,
          key_takeaways: post.key_takeaways,
          faqs: post.faqs,
        }),
      });
      const data = await res.json();
      if (data?.success) {
        showNotice("تم تكرار المقال كمسودة بنجاح");
        await loadPosts();
      }
    } catch {
      showNotice("تعذر تكرار المقال", "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/posts/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data?.success) {
        setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        showNotice("تم حذف المقال نهائياً من Supabase");
      }
    } catch {
      showNotice("تعذر حذف المقال", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/posts/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data?.success && data.url) {
        setForm((prev) => ({ ...prev, cover_image: data.url }));
        showNotice("تم رفع صورة الغلاف إلى Supabase Storage بنجاح!");
      } else {
        throw new Error(data?.error || "فشل رفع الصورة");
      }
    } catch (err) {
      showNotice(
        err instanceof Error ? err.message : "فشل رفع الصورة",
        "error"
      );
    } finally {
      setUploadingCover(false);
      e.target.value = "";
    }
  };

  const handleInlineImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingInline(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/posts/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data?.success && data.url) {
        insertFormattingTag(
          `\n<figure><img src="${data.url}" alt="${
            form.title || "صورة طبية"
          }" /><figcaption>${form.title || ""}</figcaption></figure>\n`,
          ""
        );
        showNotice("تم رفع وإدراج الصورة داخل المقال!");
      }
    } catch {
      showNotice("فشل رفع الصورة", "error");
    } finally {
      setUploadingInline(false);
      e.target.value = "";
    }
  };

  const insertFormattingTag = (prefix: string, suffix: string) => {
    const el = contentTextareaRef.current;
    if (!el) {
      setForm((prev) => ({
        ...prev,
        content: `${prev.content}${prefix}${suffix}`,
      }));
      return;
    }
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const selected = form.content.slice(start, end) || "النص هنا";
    const nextContent =
      form.content.slice(0, start) +
      prefix +
      selected +
      suffix +
      form.content.slice(end);
    setForm((prev) => ({ ...prev, content: nextContent }));
  };

  // SEO Score Calculator
  const seoEvaluation = useMemo(() => {
    const checks = [
      {
        label: "عنوان المقال يحتوي على طول مثالي (30 - 75 حرفاً)",
        passed: form.title.trim().length >= 25 && form.title.trim().length <= 85,
      },
      {
        label: "ملخص ووصف الميتا للـ SEO مضاف (80 - 170 حرفاً)",
        passed:
          (form.seo_description || form.excerpt).trim().length >= 60,
      },
      {
        label: "الكلمة المفتاحية الرئيسية محددة وموجودة في العنوان أو المحتوى",
        passed:
          Boolean(form.focus_keyword.trim()) &&
          (form.title.includes(form.focus_keyword.trim()) ||
            form.content.includes(form.focus_keyword.trim())),
      },
      {
        label: "المحتوى غني ومقسم بعناوين فرعية (H2 / H3)",
        passed: /<h[23]|##\s/i.test(form.content) && form.content.length > 300,
      },
      {
        label: "صورة الغلاف والنص البديل (Alt Text) مضافان لتحسين ظهور الصور في جوجل",
        passed: Boolean(form.cover_image.trim()) && Boolean(form.image_alt.trim()),
      },
      {
        label: "الأسئلة الشائعة (FAQ Schema) مضافة لتصدر نتائج البحث الغنية",
        passed: form.faqs.some((f) => f.question.trim() && f.answer.trim()),
      },
    ];
    const passedCount = checks.filter((c) => c.passed).length;
    const score = Math.round((passedCount / checks.length) * 100);
    return { score, checks };
  }, [form]);

  const mcpEndpointUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/mcp`
      : "https://drdalia-dental.com/api/mcp";

  const mcpConfigJson = JSON.stringify(
    {
      mcpServers: {
        "dr-dalia-articles": {
          url: mcpEndpointUrl,
          type: "http",
        },
      },
    },
    null,
    2
  );

  const agentPromptText = `أنت كاتب محتوى طبي وخبير SEO متخصص لعيادة د. داليا عبد الموجود زارع (استشاري طب وجراحة الأسنان بالقصر العيني - المعادي، القاهرة).
استخدم أدوات MCP المتصلة (dr-dalia-articles):
1. استدعِ أولاً أداة get_clinic_seo_context و list_categories لمعرفة خدمات العيادة والكلمات المفتاحية والتصنيفات.
2. اكتب مقالاً طبياً شاملاً ومتوافقاً مع معايير SEO بنسبة 100% ومقسماً بعناوين <h2> و <h3> ونقاط key_takeaways وأسئلة شائعة faqs.
3. استخدم أداة create_article لإضافة المقال ونشره مباشرة في قاعدة بيانات Supabase الخاصة بالموقع.`;

  const copyText = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setMcpCopiedKey(key);
      setTimeout(() => setMcpCopiedKey(null), 2000);
    } catch {
      // Ignore
    }
  };

  const testMcpConnection = async () => {
    setMcpStatus({ testing: true });
    try {
      const res = await fetch("/api/mcp?info=1");
      const data = await res.json();
      if (data?.status === "online") {
        setMcpStatus({
          testing: false,
          online: true,
          message: `متصل بنجاح! الخادم (${data.name}) جاهز ويحتوي على ${data.tools?.length || 7} أدوات فعالة مربوطة بـ Supabase.`,
        });
      } else {
        setMcpStatus({
          testing: false,
          online: false,
          message: "استجابة غير متوقعة من الخادم",
        });
      }
    } catch {
      setMcpStatus({
        testing: false,
        online: false,
        message: "تعذر الاتصال بنقطة النهاية",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 left-5 z-[100] px-5 py-3.5 rounded-2xl shadow-xl font-bold text-xs md:text-sm flex items-center gap-2.5 transition-all ${
            toast.type === "error"
              ? "bg-red-600 text-white"
              : "bg-brand-primary text-white border border-brand-accent"
          }`}
        >
          <Sparkles className="w-4 h-4 text-brand-accent shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header & Primary Actions */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-brand-primary flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-action" />
            <span>إدارة المقالات الطبية (CMS & SEO)</span>
          </h1>
          <p className="text-xs md:text-sm text-foreground/60 mt-1">
            إضافة وتعديل وحذف المقالات، تحسين محركات البحث (SEO)، والربط مع وكيل الذكاء الاصطناعي عبر MCP
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMcpModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-accent/25 text-brand-primary hover:bg-brand-accent/40 font-bold text-xs md:text-sm transition-colors cursor-pointer border border-brand-accent"
          >
            <Bot className="w-4 h-4 text-brand-action" />
            <span>ربط وكيل الذكاء الاصطناعي (MCP)</span>
          </button>

          <button
            type="button"
            onClick={openCreateEditor}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white hover:bg-brand-action font-bold text-xs md:text-sm shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مقال جديد</span>
          </button>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white rounded-2xl border border-border p-4 shadow-sm">
          <span className="text-xs text-foreground/55 font-semibold">
            إجمالي المقالات
          </span>
          <div className="text-2xl font-extrabold text-brand-primary mt-1">
            {stats.total}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-border p-4 shadow-sm">
          <span className="text-xs text-emerald-600 font-semibold">
            منشور (Published)
          </span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {stats.published}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-border p-4 shadow-sm">
          <span className="text-xs text-amber-600 font-semibold">
            مسودات (Drafts)
          </span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">
            {stats.drafts}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-border p-4 shadow-sm">
          <span className="text-xs text-brand-action font-semibold">
            مقالات مميزة (Featured)
          </span>
          <div className="text-2xl font-extrabold text-brand-action mt-1">
            {stats.featured}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-border p-4 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-xs text-foreground/55 font-semibold">
            إجمالي المشاهدات
          </span>
          <div className="text-2xl font-extrabold text-brand-primary mt-1">
            {stats.totalViews}
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-border p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-foreground/45 absolute top-1/2 -translate-y-1/2 right-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في المقالات بالعنوان، الـ Slug، الكلمات المفتاحية..."
            className="w-full rounded-xl bg-background/70 border border-border pr-10 pl-4 py-2.5 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "الكل" },
            { id: "published", label: "منشور" },
            { id: "draft", label: "مسودة" },
            { id: "featured", label: "مميز" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                setStatusFilter(
                  tab.id as "all" | "published" | "draft" | "featured"
                )
              }
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-brand-primary text-white"
                  : "bg-background text-foreground/70 hover:bg-brand-accent/25"
              }`}
            >
              {tab.label}
            </button>
          ))}

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl bg-background border border-border px-3 py-2 text-xs font-bold text-brand-primary focus:outline-none"
          >
            <option value="all">جميع التصنيفات</option>
            {DEFAULT_CATEGORIES.map((c) => (
              <option key={c.ar} value={c.ar}>
                {c.ar}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={loadPosts}
            className="p-2 rounded-xl bg-background border border-border text-brand-primary hover:bg-brand-accent/20 cursor-pointer"
            title="تحديث"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Articles Table / List */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {loading && posts.length === 0 ? (
          <div className="p-12 text-center text-sm text-foreground/60">
            جاري تحميل المقالات من Supabase...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-base font-bold text-brand-primary">
              لا توجد مقالات مطابقة للبحث
            </p>
            <button
              type="button"
              onClick={openCreateEditor}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء أول مقال</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-background/80 border-b border-border text-[11px] font-extrabold text-foreground/60 uppercase">
                  <th className="py-3.5 px-4">المقال</th>
                  <th className="py-3.5 px-3">التصنيف</th>
                  <th className="py-3.5 px-3">الحالة</th>
                  <th className="py-3.5 px-3">الظهور</th>
                  <th className="py-3.5 px-3">المشاهدات</th>
                  <th className="py-3.5 px-3">التاريخ</th>
                  <th className="py-3.5 px-4 text-left">إجراءات التحكم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs md:text-sm">
                {filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-brand-accent/5 transition-colors"
                  >
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
                          <Image
                            src={post.cover_image}
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-brand-primary line-clamp-1">
                            {post.title}
                          </p>
                          <p
                            className="text-[11px] text-foreground/50 truncate"
                            dir="ltr"
                          >
                            /{post.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg bg-brand-primary/10 text-brand-primary text-xs font-bold">
                        {post.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleQuickToggle(post, "status")}
                        className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                          post.status === "published"
                            ? "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25"
                            : "bg-amber-500/15 text-amber-700 hover:bg-amber-500/25"
                        }`}
                      >
                        {post.status === "published" ? "منشور" : "مسودة"}
                      </button>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleQuickToggle(post, "featured")}
                          title="تمييز المقال في الأعلى"
                          className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                            post.featured
                              ? "bg-amber-400/20 border-amber-400 text-amber-600"
                              : "border-border text-foreground/35 hover:text-foreground/70"
                          }`}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleQuickToggle(post, "show_on_homepage")
                          }
                          title="إظهار في الصفحة الرئيسية"
                          className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                            post.show_on_homepage !== false
                              ? "bg-brand-primary/10 border-brand-primary/30 text-brand-primary"
                              : "border-border text-foreground/35 hover:text-foreground/70"
                          }`}
                        >
                          <Home className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap font-bold text-foreground/75">
                      <span className="inline-flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-brand-action" />
                        {post.views}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap text-xs text-foreground/60">
                      {new Date(post.published_at).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/ar/articles/${post.slug}`}
                          target="_blank"
                          className="p-2 rounded-xl bg-background hover:bg-brand-accent/30 text-brand-primary transition-colors"
                          title="معاينة المقال"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEditEditor(post)}
                          className="p-2 rounded-xl bg-brand-primary/10 hover:bg-brand-primary hover:text-white text-brand-primary transition-colors cursor-pointer"
                          title="تعديل المقال"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(post)}
                          className="p-2 rounded-xl bg-background hover:bg-brand-accent/30 text-foreground/70 transition-colors cursor-pointer"
                          title="تكرار المقال"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(post)}
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-600 hover:text-white text-red-600 transition-colors cursor-pointer"
                          title="حذف المقال"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* Full Rich Article Editor Modal */}
      {/* ===================================================================== */}
      {editorOpen && (
        <div className="fixed inset-0 z-[80] bg-black/55 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-brand-primary text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-brand-accent" />
                <h2 className="text-base md:text-lg font-extrabold">
                  {form.id ? "تعديل المقال الطبي" : "إضافة مقال طبي جديد"}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-bold">
                  تقييم الـ SEO: {seoEvaluation.score}%
                </span>
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Editor Sub-Tabs */}
            <div className="px-6 py-2.5 bg-background border-b border-border flex flex-wrap items-center gap-2">
              {[
                { id: "content", label: "1. المحتوى والتنسيق", icon: FileText },
                { id: "media", label: "2. الصورة والتصنيف والنشر", icon: ImageIcon },
                {
                  id: "takeaways",
                  label: "3. النقاط الرئيسية والأسئلة الشائعة",
                  icon: ListChecks,
                },
                { id: "seo", label: "4. تحسين محركات البحث (SEO)", icon: Globe },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() =>
                    setEditorTab(
                      t.id as "content" | "media" | "takeaways" | "seo"
                    )
                  }
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    editorTab === t.id
                      ? "bg-brand-primary text-white shadow-sm"
                      : "bg-white text-foreground/70 hover:bg-brand-accent/25 border border-border"
                  }`}
                >
                  <t.icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Editor Form Body */}
            <form
              onSubmit={handleSaveArticle}
              className="flex-1 overflow-y-auto p-6 space-y-6"
            >
              {editorTab === "content" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-brand-primary">
                        عنوان المقال (بالعربية) *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setForm((prev) => ({
                            ...prev,
                            title: val,
                            slug: prev.slug || generateClientSlug(val),
                          }));
                        }}
                        placeholder="مثال: الدليل الشامل لزراعة الأسنان بدون ألم"
                        className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground/70">
                        عنوان المقال بالإنجليزية (اختياري)
                      </label>
                      <input
                        type="text"
                        value={form.title_en}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            title_en: e.target.value,
                          }))
                        }
                        placeholder="Complete Guide to Painless Dental Implants"
                        dir="ltr"
                        className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      />
                    </div>
                  </div>

                  {/* Slug */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-brand-primary">
                        الرابط الدائم للمقال (SEO Slug)
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            slug: generateClientSlug(
                              prev.title_en || prev.title
                            ),
                          }))
                        }
                        className="text-[11px] font-bold text-brand-action hover:underline cursor-pointer"
                      >
                        توليد تلقائي من العنوان
                      </button>
                    </div>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, slug: e.target.value }))
                      }
                      dir="ltr"
                      placeholder="painless-dental-implants-guide"
                      className="w-full rounded-xl border border-border px-3.5 py-2 text-xs font-mono bg-background/50 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>

                  {/* Excerpt */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-brand-primary">
                        ملخص المقال (Excerpt - بالعربية)
                      </label>
                      <textarea
                        rows={2}
                        value={form.excerpt}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            excerpt: e.target.value,
                          }))
                        }
                        placeholder="ملخص جذاب يظهر في بطاقة المقال وفي محركات البحث..."
                        className="w-full rounded-xl border border-border p-3 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground/70">
                        ملخص المقال بالإنجليزية (اختياري)
                      </label>
                      <textarea
                        rows={2}
                        dir="ltr"
                        value={form.excerpt_en}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            excerpt_en: e.target.value,
                          }))
                        }
                        placeholder="Short English summary..."
                        className="w-full rounded-xl border border-border p-3 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      />
                    </div>
                  </div>

                  {/* Rich Formatting Toolbar + Content Editor */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="text-xs font-bold text-brand-primary">
                        محتوى المقال الكامل (يدعم HTML و Markdown) *
                      </label>
                      <button
                        type="button"
                        onClick={() => setPreviewMode((p) => !p)}
                        className="px-3 py-1 rounded-lg bg-brand-accent/25 text-brand-primary text-xs font-bold hover:bg-brand-accent/40 cursor-pointer"
                      >
                        {previewMode ? "العودة للتحرير" : "معاينة التنسيق الحي"}
                      </button>
                    </div>

                    {/* Formatting Toolbar */}
                    <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-background border border-border">
                      <button
                        type="button"
                        onClick={() => insertFormattingTag("<h2>", "</h2>")}
                        className="p-2 rounded-lg hover:bg-white text-brand-primary text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        title="عنوان رئيسي H2"
                      >
                        <Heading2 className="w-4 h-4" />
                        <span>H2</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormattingTag("<h3>", "</h3>")}
                        className="p-2 rounded-lg hover:bg-white text-brand-primary text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        title="عنوان فرعي H3"
                      >
                        <Heading3 className="w-4 h-4" />
                        <span>H3</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          insertFormattingTag("<strong>", "</strong>")
                        }
                        className="p-2 rounded-lg hover:bg-white text-brand-primary cursor-pointer"
                        title="خط عريض"
                      >
                        <Bold className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormattingTag("<em>", "</em>")}
                        className="p-2 rounded-lg hover:bg-white text-brand-primary cursor-pointer"
                        title="خط مائل"
                      >
                        <Italic className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          insertFormattingTag(
                            "<ul>\n  <li>",
                            "</li>\n  <li>نقطة إضافية</li>\n</ul>"
                          )
                        }
                        className="p-2 rounded-lg hover:bg-white text-brand-primary cursor-pointer"
                        title="قائمة نقطية"
                      >
                        <List className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          insertFormattingTag("<blockquote>", "</blockquote>")
                        }
                        className="p-2 rounded-lg hover:bg-white text-brand-primary cursor-pointer"
                        title="اقتباس أو نصيحة طبية"
                      >
                        <Quote className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          insertFormattingTag(
                            '<a href="https://wa.me/201112521494">',
                            "</a>"
                          )
                        }
                        className="p-2 rounded-lg hover:bg-white text-brand-primary cursor-pointer"
                        title="إدراج رابط"
                      >
                        <LinkIcon className="w-4 h-4" />
                      </button>

                      <input
                        ref={inlineImageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleInlineImageUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => inlineImageInputRef.current?.click()}
                        disabled={uploadingInline}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-border hover:bg-brand-accent/20 text-brand-primary text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>
                          {uploadingInline
                            ? "جاري الرفع..."
                            : "رفع صورة داخل المقال"}
                        </span>
                      </button>
                    </div>

                    {previewMode ? (
                      <div
                        className="min-h-[280px] p-6 rounded-2xl border border-border bg-background/30 prose max-w-none space-y-4 [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-brand-primary [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-brand-action [&_blockquote]:border-s-4 [&_blockquote]:border-brand-action [&_blockquote]:bg-brand-accent/15 [&_blockquote]:p-4 [&_blockquote]:rounded-xl"
                        dangerouslySetInnerHTML={{ __html: form.content }}
                      />
                    ) : (
                      <textarea
                        ref={contentTextareaRef}
                        rows={11}
                        required
                        value={form.content}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        placeholder="اكتب محتوى المقال هنا (يمكنك استخدام أزرار التنسيق أعلاه أو كتابة HTML أو Markdown)..."
                        className="w-full rounded-2xl border border-border p-4 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      />
                    )}
                  </div>
                </div>
              )}

              {editorTab === "media" && (
                <div className="space-y-6">
                  {/* Cover Image Upload & URL */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    <div className="md:col-span-7 space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-brand-primary">
                          صورة الغلاف (رفع مباشر إلى Supabase أو رابط URL)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={form.cover_image}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                cover_image: e.target.value,
                              }))
                            }
                            dir="ltr"
                            placeholder="https://..."
                            className="flex-1 rounded-xl border border-border px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-primary"
                          />
                          <input
                            ref={coverImageInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleCoverUpload}
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => coverImageInputRef.current?.click()}
                            disabled={uploadingCover}
                            className="px-4 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-action inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
                          >
                            <Upload className="w-4 h-4" />
                            <span>
                              {uploadingCover ? "جاري الرفع..." : "رفع صورة"}
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-brand-primary">
                          النص البديل للصورة (Image Alt Text - مهم جداً للـ SEO)
                        </label>
                        <input
                          type="text"
                          value={form.image_alt}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              image_alt: e.target.value,
                            }))
                          }
                          placeholder="وصف للصورة يتضمن الكلمة المفتاحية..."
                          className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground/70">
                          تعليق أسفل الصورة (Image Caption - اختياري)
                        </label>
                        <input
                          type="text"
                          value={form.image_caption}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              image_caption: e.target.value,
                            }))
                          }
                          placeholder="تعليق توضيحي يظهر أسفل صورة المقال..."
                          className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-5">
                      <div className="relative h-52 w-full rounded-2xl overflow-hidden bg-muted border border-border">
                        {form.cover_image ? (
                          <Image
                            src={form.cover_image}
                            alt={form.image_alt || form.title || "Preview"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center text-xs text-foreground/45">
                            لا توجد صورة محددة
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Category & Tags */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-brand-primary">
                        التصنيف الطبي
                      </label>
                      <select
                        value={form.category}
                        onChange={(e) => {
                          const found = DEFAULT_CATEGORIES.find(
                            (c) => c.ar === e.target.value
                          );
                          setForm((prev) => ({
                            ...prev,
                            category: e.target.value,
                            category_en: found ? found.en : prev.category_en,
                          }));
                        }}
                        className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm bg-white"
                      >
                        {DEFAULT_CATEGORIES.map((c) => (
                          <option key={c.ar} value={c.ar}>
                            {c.ar} ({c.en})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-brand-primary">
                        الكلمات المفتاحية والوسوم (مفصولة بفاصلة ,)
                      </label>
                      <input
                        type="text"
                        value={form.tags}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, tags: e.target.value }))
                        }
                        placeholder="زراعة الأسنان, تجميل الأسنان, عيادة أسنان المعادي..."
                        className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm"
                      />
                    </div>
                  </div>

                  {/* Publishing Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <label className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-background/40 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.status === "published"}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            status: e.target.checked ? "published" : "draft",
                          }))
                        }
                        className="w-4 h-4 accent-brand-primary"
                      />
                      <div>
                        <p className="text-xs font-bold text-brand-primary">
                          نشر المقال فوراً
                        </p>
                        <p className="text-[11px] text-foreground/55">
                          إلغاء التحديد يحفظه كمسودة
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-background/40 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            featured: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 accent-brand-primary"
                      />
                      <div>
                        <p className="text-xs font-bold text-brand-primary">
                          مقال مميز (Featured)
                        </p>
                        <p className="text-[11px] text-foreground/55">
                          يظهر في صدارة صفحة المقالات
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-background/40 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.show_on_homepage}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            show_on_homepage: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 accent-brand-primary"
                      />
                      <div>
                        <p className="text-xs font-bold text-brand-primary">
                          عرض في الصفحة الرئيسية
                        </p>
                        <p className="text-[11px] text-foreground/55">
                          يظهر في قسم المقالات بالرئيسية
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {editorTab === "takeaways" && (
                <div className="space-y-6">
                  {/* Key Takeaways */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs md:text-sm font-extrabold text-brand-primary flex items-center gap-1.5">
                        <ListChecks className="w-4 h-4 text-brand-action" />
                        <span>أهم النقاط المستفادة (Key Takeaways)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            key_takeaways: [...prev.key_takeaways, ""],
                          }))
                        }
                        className="text-xs font-bold text-brand-action hover:underline cursor-pointer"
                      >
                        + إضافة نقطة جديدة
                      </button>
                    </div>
                    <div className="space-y-2">
                      {form.key_takeaways.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => {
                              const next = [...form.key_takeaways];
                              next[idx] = e.target.value;
                              setForm((prev) => ({
                                ...prev,
                                key_takeaways: next,
                              }));
                            }}
                            placeholder={`النقطة المستفادة رقم ${idx + 1}...`}
                            className="flex-1 rounded-xl border border-border px-3.5 py-2 text-xs md:text-sm"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                key_takeaways: prev.key_takeaways.filter(
                                  (_, i) => i !== idx
                                ),
                              }))
                            }
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FAQs Builder */}
                  <div className="space-y-3 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs md:text-sm font-extrabold text-brand-primary flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-brand-action" />
                          <span>
                            الأسئلة الشائعة حول المقال (تولد FAQPage Schema في جوجل)
                          </span>
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            faqs: [...prev.faqs, { question: "", answer: "" }],
                          }))
                        }
                        className="text-xs font-bold text-brand-action hover:underline cursor-pointer"
                      >
                        + إضافة سؤال شائع
                      </button>
                    </div>

                    <div className="space-y-3">
                      {form.faqs.map((faq, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl border border-border bg-background/40 space-y-2.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-brand-primary">
                              سؤال #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  faqs: prev.faqs.filter((_, i) => i !== idx),
                                }))
                              }
                              className="text-xs text-red-500 hover:underline cursor-pointer"
                            >
                              حذف السؤال
                            </button>
                          </div>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => {
                              const next = [...form.faqs];
                              next[idx] = {
                                ...next[idx],
                                question: e.target.value,
                              };
                              setForm((prev) => ({ ...prev, faqs: next }));
                            }}
                            placeholder="اكتب السؤال الشائع هنا..."
                            className="w-full rounded-xl border border-border bg-white px-3.5 py-2 text-xs md:text-sm"
                          />
                          <textarea
                            rows={2}
                            value={faq.answer}
                            onChange={(e) => {
                              const next = [...form.faqs];
                              next[idx] = {
                                ...next[idx],
                                answer: e.target.value,
                              };
                              setForm((prev) => ({ ...prev, faqs: next }));
                            }}
                            placeholder="اكتب الإجابة الطبية الواضحة هنا..."
                            className="w-full rounded-xl border border-border bg-white p-3 text-xs md:text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {editorTab === "seo" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-brand-primary">
                        الكلمة المفتاحية المستهدفة (Focus Keyword)
                      </label>
                      <input
                        type="text"
                        value={form.focus_keyword}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            focus_keyword: e.target.value,
                          }))
                        }
                        placeholder="مثال: زراعة الأسنان بدون ألم"
                        className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-brand-primary">
                        عنوان الميتا للـ SEO (Meta Title)
                      </label>
                      <input
                        type="text"
                        value={form.seo_title}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            seo_title: e.target.value,
                          }))
                        }
                        placeholder={
                          form.title ||
                          "عنوان المقال في نتائج بحث جوجل | د. داليا عبد الموجود"
                        }
                        className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-brand-primary">
                      وصف الميتا للـ SEO (Meta Description - يفضل 140 إلى 165 حرفاً)
                    </label>
                    <textarea
                      rows={3}
                      value={form.seo_description}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          seo_description: e.target.value,
                        }))
                      }
                      placeholder={
                        form.excerpt || "وصف المقال كما سيظهر في محرك بحث جوجل..."
                      }
                      className="w-full rounded-xl border border-border p-3 text-sm"
                    />
                  </div>

                  {/* Google SERP Live Preview */}
                  <div className="rounded-2xl border border-border bg-background/50 p-5 space-y-2">
                    <span className="text-[11px] font-bold text-foreground/50 uppercase">
                      معاينة حية لظهور المقال في نتائج بحث جوجل (Google SERP Preview)
                    </span>
                    <div className="bg-white rounded-xl p-4 border border-border space-y-1">
                      <p className="text-xs text-emerald-700 truncate" dir="ltr">
                        https://drdalia-dental.com/ar/articles/
                        {form.slug || "article-slug"}
                      </p>
                      <h4 className="text-base md:text-lg font-bold text-[#1a0dab] line-clamp-1">
                        {form.seo_title ||
                          form.title ||
                          "عنوان المقال الطبي | د. داليا عبد الموجود زارع"}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {form.seo_description ||
                          form.excerpt ||
                          "وصف المقال الطبي سيظهر هنا في نتائج بحث جوجل لجذب الباحثين عن علاج الأسنان بدون ألم..."}
                      </p>
                    </div>
                  </div>

                  {/* SEO Checklist */}
                  <div className="rounded-2xl border border-border p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-brand-primary">
                        قائمة فحص جودة الـ SEO للمقال
                      </span>
                      <span className="text-sm font-extrabold text-brand-action">
                        {seoEvaluation.score}%
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {seoEvaluation.checks.map((chk, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
                            chk.passed
                              ? "bg-emerald-500/10 text-emerald-800"
                              : "bg-amber-500/10 text-amber-800"
                          }`}
                        >
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 ${
                              chk.passed ? "text-emerald-600" : "text-amber-500"
                            }`}
                          />
                          <span>{chk.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-border text-xs md:text-sm font-bold text-foreground/70 hover:bg-background cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-7 py-2.5 rounded-xl bg-brand-primary text-white text-xs md:text-sm font-bold hover:bg-brand-action shadow-md transition-all cursor-pointer disabled:opacity-60"
                >
                  {saving
                    ? "جاري الحفظ في Supabase..."
                    : form.id
                    ? "حفظ التعديلات"
                    : "نشر وحفظ المقال في Supabase"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* Delete Confirmation Modal */}
      {/* ===================================================================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[90] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl border border-border p-6 shadow-2xl space-y-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-brand-primary">
                تأكيد حذف المقال
              </h3>
              <p className="text-xs md:text-sm text-foreground/70">
                هل أنت متأكد من حذف مقال{" "}
                <strong className="text-brand-primary">
                  &ldquo;{deleteTarget.title}&rdquo;
                </strong>{" "}
                نهائياً من قاعدة بيانات Supabase؟
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 rounded-xl border border-border text-xs font-bold cursor-pointer"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 text-xs font-bold cursor-pointer"
              >
                نعم، احذف المقال
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MCP AI Agent Integration Modal */}
      {/* ===================================================================== */}
      {mcpModalOpen && (
        <div className="fixed inset-0 z-[85] bg-black/55 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-6 py-4 bg-brand-primary text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Bot className="w-5 h-5 text-brand-accent" />
                <div>
                  <h2 className="text-base md:text-lg font-extrabold">
                    ربط وكيل الذكاء الاصطناعي لكتابة المقالات (MCP Server)
                  </h2>
                  <p className="text-[11px] text-brand-accent/90">
                    متصل مباشرة بمشروع Supabase: dr dalia (ksaxugyvzeudupnakrwk)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMcpModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs md:text-sm">
              {/* Endpoint Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-brand-primary">
                    1. رابط خادم الـ MCP المباشر (Streamable HTTP Endpoint)
                  </span>
                  <button
                    type="button"
                    onClick={testMcpConnection}
                    disabled={mcpStatus.testing}
                    className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 font-bold text-xs hover:bg-emerald-500/25 cursor-pointer"
                  >
                    {mcpStatus.testing
                      ? "جاري الفحص..."
                      : "اختبار اتصال الـ MCP الآن"}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={mcpEndpointUrl}
                    dir="ltr"
                    className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2.5 font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => copyText("url", mcpEndpointUrl)}
                    className="px-4 py-2.5 rounded-xl bg-brand-primary text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {mcpCopiedKey === "url" ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>نسخ الرابط</span>
                      </>
                    )}
                  </button>
                </div>

                {mcpStatus.message && (
                  <div
                    className={`p-3 rounded-xl font-bold text-xs ${
                      mcpStatus.online
                        ? "bg-emerald-500/15 text-emerald-800"
                        : "bg-red-500/15 text-red-700"
                    }`}
                  >
                    {mcpStatus.message}
                  </div>
                )}
              </div>

              {/* MCP Config JSON */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-brand-primary">
                    2. إعدادات الربط (Claude / Cursor / Windsurf / Cline / .mcp.json)
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText("json", mcpConfigJson)}
                    className="text-xs font-bold text-brand-action hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    {mcpCopiedKey === "json" ? "تم نسخ الكود!" : "نسخ كود JSON"}
                  </button>
                </div>
                <pre
                  dir="ltr"
                  className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto"
                >
                  {mcpConfigJson}
                </pre>
              </div>

              {/* Ready AI Prompt */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-brand-primary">
                    3. برومبت جاهز لتوجيه الـ Agent لكتابة المقالات وإضافتها في Supabase
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText("prompt", agentPromptText)}
                    className="text-xs font-bold text-brand-action hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    {mcpCopiedKey === "prompt"
                      ? "تم نسخ البرومبت!"
                      : "نسخ البرومبت"}
                  </button>
                </div>
                <div className="p-4 rounded-2xl bg-brand-accent/15 border border-brand-accent text-brand-primary text-xs leading-relaxed whitespace-pre-line">
                  {agentPromptText}
                </div>
              </div>

              {/* Available Tools */}
              <div className="space-y-2.5">
                <span className="font-extrabold text-brand-primary block">
                  4. الأدوات المتاحة للـ Agent داخل خادم الـ MCP ({MCP_TOOLS_SUMMARY.length} أدوات):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MCP_TOOLS_SUMMARY.map((tool) => (
                    <div
                      key={tool.name}
                      className="p-3 rounded-xl border border-border bg-background/50 space-y-1"
                    >
                      <code
                        dir="ltr"
                        className="text-xs font-extrabold text-brand-action block"
                      >
                        {tool.name}
                      </code>
                      <p className="text-[11px] font-bold text-brand-primary">
                        {tool.title}
                      </p>
                      <p className="text-[11px] text-foreground/65">
                        {tool.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
