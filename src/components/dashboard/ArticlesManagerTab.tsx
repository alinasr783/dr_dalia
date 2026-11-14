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
} from "lucide-react";
import type { Post, ArticleFAQ } from "@/lib/supabase/types";

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
  tags: "طب أسنان، دكتورة داليا عبد الموجود",
  status: "published",
  featured: false,
  show_on_homepage: true,
  reading_time: 4,
  seo_title: "",
  seo_description: "",
  focus_keyword: "",
  key_takeaways: [""],
  faqs: [{ question: "", answer: "" }],
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

export default function ArticlesManagerTab({
  initialEditingPost,
}: {
  initialEditingPost?: Post | null;
}) {
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
  const [assistantModalOpen, setAssistantModalOpen] = useState(false);
  const [assistantCopied, setAssistantCopied] = useState(false);

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

  // Handle edit request from overview tab
  useEffect(() => {
    if (initialEditingPost) {
      openEditEditor(initialEditingPost);
    }
  }, [initialEditingPost]);

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      if (statusFilter === "published" && p.status !== "published") return false;
      if (statusFilter === "draft" && p.status !== "draft") return false;
      if (statusFilter === "featured" && !p.featured) return false;

      if (
        categoryFilter !== "all" &&
        p.category !== categoryFilter &&
        p.category_en !== categoryFilter
      ) {
        return false;
      }

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
        key_takeaways: form.key_takeaways.filter((t) => t.trim().length > 0),
        faqs: form.faqs.filter(
          (f) => f.question.trim().length > 0 && f.answer.trim().length > 0
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
        isEdit ? "تم حفظ تعديلات المقال بنجاح" : "تم إنشاء ونشر المقال بنجاح"
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
    try {
      const update: Partial<Post> = {};
      if (field === "status") {
        update.status = post.status === "published" ? "draft" : "published";
      } else if (field === "featured") {
        update.featured = !post.featured;
      } else if (field === "show_on_homepage") {
        update.show_on_homepage = !post.show_on_homepage;
      }

      // Optimistic update
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, ...update } : p))
      );

      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });
      const data = await res.json();
      if (!data?.success) {
        await loadPosts();
        showNotice("تعذر تحديث المقال", "error");
      } else {
        showNotice("تم تحديث حالة المقال بنجاح");
      }
    } catch {
      await loadPosts();
      showNotice("تعذر تحديث المقال", "error");
    }
  };

  const handleDuplicate = async (post: Post) => {
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `نسخة من ${post.title}`,
          title_en: post.title_en ? `Copy of ${post.title_en}` : "",
          slug: `${post.slug}-copy-${Date.now().toString(36)}`,
          excerpt: post.excerpt,
          excerpt_en: post.excerpt_en,
          content: post.content,
          content_en: post.content_en,
          cover_image: post.cover_image,
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
        showNotice("تم إنشاء نسخة من المقال بنجاح");
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
        showNotice("تم حذف المقال بنجاح");
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
        showNotice("تم رفع صورة الغلاف بنجاح");
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
        showNotice("تم إدراج الصورة داخل المقال بنجاح");
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
        content: prev.content + prefix + suffix,
      }));
      return;
    }
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const selected = form.content.slice(start, end);
    const replacement = `${prefix}${selected || ""}${suffix}`;
    const newContent =
      form.content.slice(0, start) + replacement + form.content.slice(end);

    setForm((prev) => ({ ...prev, content: newContent }));
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selected.length
      );
    }, 50);
  };

  const seoEvaluation = useMemo(() => {
    const titleLen = form.seo_title.trim().length || form.title.trim().length;
    const descLen =
      form.seo_description.trim().length || form.excerpt.trim().length;
    const wordCount = form.content
      .replace(/<[^>]*>/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    const kw = form.focus_keyword.trim().toLowerCase();

    let score = 0;
    const checks: { label: string; passed: boolean }[] = [];

    const titleOk = titleLen >= 30 && titleLen <= 65;
    if (titleOk) score += 20;
    checks.push({
      label: "طول عنوان المقال مناسب لمحركات البحث بين 30 و 65 حرف",
      passed: titleOk,
    });

    const descOk = descLen >= 110 && descLen <= 170;
    if (descOk) score += 20;
    checks.push({
      label: "وصف المقال مناسب بين 110 و 170 حرف",
      passed: descOk,
    });

    const wordsOk = wordCount >= 300;
    if (wordsOk) score += 20;
    checks.push({
      label: "المحتوى غني ومفصل أكثر من 300 كلمة",
      passed: wordsOk,
    });

    const hasImages =
      Boolean(form.cover_image) || /<img\b/i.test(form.content);
    if (hasImages) score += 15;
    checks.push({
      label: "يحتوي المقال على صور توضيحية للمرضى",
      passed: hasImages,
    });

    const hasFaqs = form.faqs.some(
      (f) => f.question.trim().length > 0 && f.answer.trim().length > 0
    );
    if (hasFaqs) score += 15;
    checks.push({
      label: "يحتوي على أسئلة شائعة لإفادة الزائر",
      passed: hasFaqs,
    });

    const kwOk =
      Boolean(kw) &&
      (form.title.toLowerCase().includes(kw) ||
        form.content.toLowerCase().includes(kw));
    if (kwOk) score += 10;
    checks.push({
      label: "الكلمة المفتاحية مذكورة في العنوان والمحتوى",
      passed: kwOk,
    });

    return { score: Math.min(100, score), checks };
  }, [form]);

  const copyAssistantLink = () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/api/mcp` : "/api/mcp";
    navigator.clipboard.writeText(url);
    setAssistantCopied(true);
    showNotice("تم نسخ رابط المساعد الذكي بنجاح");
    setTimeout(() => setAssistantCopied(false), 3000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Toast Notice */}
      {toast && (
        <div
          className={`fixed bottom-5 left-5 z-50 px-5 py-3 rounded-2xl shadow-xl font-bold text-xs sm:text-sm flex items-center gap-2 ${
            toast.type === "error"
              ? "bg-red-600 text-white"
              : "bg-[#06446F] text-white"
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#A3DBE4] shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* HEADER & ACTIONS (Landing Page Style) */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-sky-100 p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-base sm:text-lg font-black text-[#06446F] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#1575B5]" />
            <span>إدارة ونشر المقالات الطبية</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            إضافة وتعديل مقالات العيادة ومشاركتها مع زوار الموقع والمرضى
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setAssistantModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#E8F4FB] text-[#06446F] hover:bg-[#d6ecf9] font-bold text-xs sm:text-sm transition-all cursor-pointer border border-sky-200 active:scale-95"
          >
            <Bot className="w-4 h-4 text-[#1575B5]" />
            <span>المساعد الذكي لكتابة المقالات</span>
          </button>

          <button
            type="button"
            onClick={openCreateEditor}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#06446F] hover:bg-[#1575B5] text-white font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مقال جديد</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* STATS STRIP */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-sky-100 p-4 shadow-xs">
          <span className="text-xs font-bold text-slate-500">
            إجمالي المقالات
          </span>
          <div className="text-2xl font-black text-[#06446F] mt-1">
            {stats.total}
          </div>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl border border-sky-100 p-4 shadow-xs">
          <span className="text-xs font-bold text-emerald-600">
            المقالات المنشورة
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {stats.published}
          </div>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl border border-sky-100 p-4 shadow-xs">
          <span className="text-xs font-bold text-amber-600">
            المسودات المعلقة
          </span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {stats.drafts}
          </div>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl border border-sky-100 p-4 shadow-xs">
          <span className="text-xs font-bold text-[#1575B5]">
            المقالات المميزة
          </span>
          <div className="text-2xl font-black text-[#1575B5] mt-1">
            {stats.featured}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* SEARCH & FILTERS */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-sky-100 p-3 sm:p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 right-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في المقالات بالعنوان أو التصنيف"
            className="w-full rounded-2xl bg-slate-50 border border-slate-200 pr-10 pl-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1575B5]/20 focus:border-[#1575B5] transition-all"
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
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-[#06446F] text-white shadow-xs"
                  : "bg-[#E8F4FB] text-[#06446F] hover:bg-[#d6ecf9]"
              }`}
            >
              {tab.label}
            </button>
          ))}

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl bg-[#E8F4FB] border border-sky-200 px-3 py-1.5 sm:py-2 text-xs font-bold text-[#06446F] focus:outline-none"
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
            className="p-2 rounded-xl bg-[#E8F4FB] text-[#06446F] hover:bg-[#d6ecf9] cursor-pointer transition-colors"
            title="تحديث قائمة المقالات"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* ARTICLES LIST: Mobile Cards (< md) & Desktop Table (>= md) */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-sky-100 shadow-xs overflow-hidden">
        {loading && posts.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            جاري تحميل المقالات
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-base font-bold text-[#06446F]">
              لا توجد مقالات مطابقة للبحث
            </p>
            <button
              type="button"
              onClick={openCreateEditor}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#06446F] text-white text-xs font-bold cursor-pointer hover:bg-[#1575B5] transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة أول مقال</span>
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Cards View (< md) */}
            <div className="block md:hidden divide-y divide-slate-100">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 space-y-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative w-20 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs">
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#E8F4FB] text-[#06446F] font-bold">
                          {post.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuickToggle(post, "status")}
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold transition-colors cursor-pointer ${
                            post.status === "published"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {post.status === "published" ? "منشور" : "مسودة"}
                        </button>
                        {post.featured && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-600 font-bold flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            مميز
                          </span>
                        )}
                      </div>
                      <h4 className="font-extrabold text-[#06446F] text-sm leading-snug line-clamp-2">
                        {post.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100/80">
                    <span className="flex items-center gap-1 text-[#1575B5] font-bold">
                      <Eye className="w-3.5 h-3.5" />
                      {post.views || 0} قراءة
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(post.published_at).toLocaleDateString("ar-EG")}
                    </span>
                  </div>

                  {/* Touch Friendly Action Buttons on Mobile */}
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => openEditEditor(post)}
                      className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-[#E8F4FB] hover:bg-[#d6ecf9] text-[#06446F] text-xs font-bold transition-all active:scale-95 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>تعديل</span>
                    </button>
                    <Link
                      href={`/ar/articles/${post.slug}`}
                      target="_blank"
                      className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>معاينة</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDuplicate(post)}
                      className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(post)}
                      className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all active:scale-95 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-sky-100 text-[11px] font-extrabold text-slate-500 uppercase">
                    <th className="py-3.5 px-4">المقال</th>
                    <th className="py-3.5 px-3">التصنيف</th>
                    <th className="py-3.5 px-3">الحالة</th>
                    <th className="py-3.5 px-3">الظهور</th>
                    <th className="py-3.5 px-3">المشاهدات</th>
                    <th className="py-3.5 px-3">التاريخ</th>
                    <th className="py-3.5 px-4 text-left">إجراءات التحكم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100 text-xs md:text-sm">
                  {filteredPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-3.5 px-4 max-w-md">
                        <div className="flex items-center gap-3">
                          <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            <Image
                              src={post.cover_image}
                              alt={post.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-[#06446F] line-clamp-1">
                              {post.title}
                            </p>
                            <p
                              className="text-[11px] text-slate-400 truncate"
                              dir="ltr"
                            >
                              /{post.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-xl bg-[#E8F4FB] text-[#06446F] text-xs font-bold">
                          {post.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleQuickToggle(post, "status")}
                          className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                            post.status === "published"
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-amber-50 text-amber-700 hover:bg-amber-100"
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
                            className={`p-1.5 rounded-xl border cursor-pointer transition-colors ${
                              post.featured
                                ? "bg-amber-50 border-amber-300 text-amber-600"
                                : "border-slate-200 text-slate-300 hover:text-slate-500"
                            }`}
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#E8F4FB] text-[#06446F] text-xs font-bold">
                          <Eye className="w-3.5 h-3.5 text-[#1575B5]" />
                          {post.views || 0}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap text-xs text-slate-500">
                        {new Date(post.published_at).toLocaleDateString("ar-EG")}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/ar/articles/${post.slug}`}
                            target="_blank"
                            className="p-2 rounded-xl bg-[#E8F4FB] hover:bg-[#d6ecf9] text-[#06446F] transition-colors"
                            title="معاينة المقال"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => openEditEditor(post)}
                            className="p-2 rounded-xl bg-[#06446F] hover:bg-[#1575B5] text-white transition-colors cursor-pointer"
                            title="تعديل المقال"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicate(post)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                            title="نسخ المقال"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(post)}
                            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
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
          </>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* ARTICLE EDITOR MODAL (Landing Page Style & Mobile Friendly) */}
      {/* ------------------------------------------------------------------- */}
      {editorOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl h-full sm:h-auto sm:max-h-[92vh] rounded-none sm:rounded-3xl border-0 sm:border border-sky-100 shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-[#06446F] to-[#1575B5] text-white flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-[#A3DBE4]" />
                <h2 className="text-base sm:text-lg font-black">
                  {form.id ? "تعديل المقال الطبي" : "إضافة مقال طبي جديد"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/20 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-Tabs */}
            <div className="px-4 py-2.5 bg-[#E8F4FB] border-b border-sky-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {[
                { id: "content", label: "محتوى المقال والصور", icon: FileText },
                {
                  id: "takeaways",
                  label: "الأسئلة الشائعة والنقاط الهامة",
                  icon: ListChecks,
                },
                { id: "seo", label: "الظهور في محرك بحث جوجل", icon: Eye },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() =>
                    setEditorTab(t.id as "content" | "takeaways" | "seo")
                  }
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    editorTab === t.id
                      ? "bg-[#06446F] text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-sky-50"
                  }`}
                >
                  <t.icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Form Content */}
            <form
              onSubmit={handleSaveArticle}
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5"
            >
              {/* Tab 1: Content & Images */}
              {editorTab === "content" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#06446F] mb-1.5">
                      عنوان المقال بالعربية
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
                      className="w-full rounded-2xl border border-sky-200 px-3.5 py-3 text-sm focus:border-[#1575B5] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#06446F] mb-1.5">
                        تصنيف المقال
                      </label>
                      <select
                        value={form.category}
                        onChange={(e) => {
                          const cat = DEFAULT_CATEGORIES.find(
                            (c) => c.ar === e.target.value
                          );
                          setForm((prev) => ({
                            ...prev,
                            category: e.target.value,
                            category_en: cat?.en || e.target.value,
                          }));
                        }}
                        className="w-full rounded-2xl border border-sky-200 px-3.5 py-3 text-sm focus:border-[#1575B5] focus:outline-none bg-white"
                      >
                        {DEFAULT_CATEGORIES.map((c) => (
                          <option key={c.ar} value={c.ar}>
                            {c.ar}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#06446F] mb-1.5">
                        حالة المقال
                      </label>
                      <select
                        value={form.status}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            status: e.target.value as "published" | "draft",
                          }))
                        }
                        className="w-full rounded-2xl border border-sky-200 px-3.5 py-3 text-sm focus:border-[#1575B5] focus:outline-none bg-white"
                      >
                        <option value="published">منشور ومتاح للزوار</option>
                        <option value="draft">مسودة معلقة للمراجعة</option>
                      </select>
                    </div>
                  </div>

                  {/* Cover Image */}
                  <div>
                    <label className="block text-xs font-bold text-[#06446F] mb-1.5">
                      صورة غلاف المقال
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="relative w-full sm:w-36 h-24 rounded-2xl overflow-hidden bg-slate-100 border border-sky-200 shrink-0">
                        {form.cover_image ? (
                          <Image
                            src={form.cover_image}
                            alt={form.title || "غلاف المقال"}
                            fill
                            className="object-cover"
                            sizes="144px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                            بدون صورة
                          </div>
                        )}
                      </div>

                      <div className="flex-1 w-full space-y-2">
                        <input
                          type="text"
                          value={form.cover_image}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              cover_image: e.target.value,
                            }))
                          }
                          placeholder="رابط الصورة المباشر"
                          className="w-full rounded-2xl border border-sky-200 px-3 py-2 text-xs focus:border-[#1575B5] focus:outline-none"
                          dir="ltr"
                        />

                        <div className="flex items-center gap-2">
                          <input
                            ref={coverImageInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleCoverUpload}
                            className="hidden"
                          />
                          <button
                            type="button"
                            disabled={uploadingCover}
                            onClick={() => coverImageInputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#E8F4FB] text-[#06446F] hover:bg-[#d6ecf9] text-xs font-bold cursor-pointer transition-colors disabled:opacity-60"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>
                              {uploadingCover
                                ? "جاري رفع الصورة"
                                : "رفع صورة من جهازك"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-xs font-bold text-[#06446F] mb-1.5">
                      مقدمة أو نبذة مختصرة عن المقال
                    </label>
                    <textarea
                      rows={2}
                      value={form.excerpt}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, excerpt: e.target.value }))
                      }
                      placeholder="ملخص قصير يشرح فكرة المقال في سطرين"
                      className="w-full rounded-2xl border border-sky-200 p-3 text-sm focus:border-[#1575B5] focus:outline-none"
                    />
                  </div>

                  {/* Rich Content Editor */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-[#06446F]">
                        محتوى المقال الكامل
                      </label>
                      <button
                        type="button"
                        onClick={() => setPreviewMode(!previewMode)}
                        className="text-xs font-bold text-[#1575B5] hover:underline cursor-pointer"
                      >
                        {previewMode ? "العودة للتحرير" : "معاينة الشكل النهائي"}
                      </button>
                    </div>

                    {/* Formatting Toolbar */}
                    {!previewMode && (
                      <div className="flex flex-wrap items-center gap-1 p-2 bg-[#E8F4FB] rounded-t-2xl border border-b-0 border-sky-200">
                        <button
                          type="button"
                          onClick={() =>
                            insertFormattingTag("<h2>", "</h2>\n")
                          }
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-sky-50 text-xs font-bold text-[#06446F] flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <Heading2 className="w-3.5 h-3.5" />
                          <span>عنوان رئيسي</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            insertFormattingTag("<h3>", "</h3>\n")
                          }
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-sky-50 text-xs font-bold text-[#06446F] flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <Heading3 className="w-3.5 h-3.5" />
                          <span>عنوان فرعي</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            insertFormattingTag("<strong>", "</strong>")
                          }
                          className="p-1.5 rounded-lg bg-white hover:bg-sky-50 text-[#06446F] cursor-pointer shadow-2xs"
                          title="نص عريض"
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormattingTag("<em>", "</em>")}
                          className="p-1.5 rounded-lg bg-white hover:bg-sky-50 text-[#06446F] cursor-pointer shadow-2xs"
                          title="نص مائل"
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            insertFormattingTag("<ul>\n  <li>", "</li>\n</ul>\n")
                          }
                          className="p-1.5 rounded-lg bg-white hover:bg-sky-50 text-[#06446F] cursor-pointer shadow-2xs"
                          title="قائمة نقاط"
                        >
                          <List className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            insertFormattingTag("<blockquote>", "</blockquote>\n")
                          }
                          className="p-1.5 rounded-lg bg-white hover:bg-sky-50 text-[#06446F] cursor-pointer shadow-2xs"
                          title="اقتباس طبي"
                        >
                          <Quote className="w-3.5 h-3.5" />
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
                          disabled={uploadingInline}
                          onClick={() => inlineImageInputRef.current?.click()}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-sky-50 text-xs font-bold text-[#06446F] flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-[#1575B5]" />
                          <span>
                            {uploadingInline ? "جاري الرفع" : "إدراج صورة بالداخل"}
                          </span>
                        </button>
                      </div>
                    )}

                    {previewMode ? (
                      <div
                        className="w-full rounded-2xl border border-sky-200 p-5 min-h-[260px] bg-white prose prose-sky max-w-none text-slate-800"
                        dangerouslySetInnerHTML={{ __html: form.content }}
                      />
                    ) : (
                      <textarea
                        ref={contentTextareaRef}
                        rows={10}
                        required
                        value={form.content}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            content: e.target.value,
                          }))
                        }
                        placeholder="اكتب محتوى المقال هنا ويمكنك استخدام أزرار التنسيق بالأعلى لإضافة عناوين ونقاط وصور"
                        className="w-full rounded-b-2xl border border-sky-200 p-4 text-sm focus:border-[#1575B5] focus:outline-none font-sans leading-relaxed"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Key Takeaways & FAQs */}
              {editorTab === "takeaways" && (
                <div className="space-y-6">
                  {/* Takeaways */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#06446F]">
                          النقاط الرئيسية الهامة في المقال
                        </h4>
                        <p className="text-xs text-slate-500">
                          صندوق خلاصة سريع يظهر في بداية المقال لراحة القارئ
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            key_takeaways: [...prev.key_takeaways, ""],
                          }))
                        }
                        className="px-3 py-1.5 rounded-xl bg-[#E8F4FB] text-[#06446F] text-xs font-bold hover:bg-[#d6ecf9] cursor-pointer"
                      >
                        + إضافة نقطة
                      </button>
                    </div>

                    <div className="space-y-2">
                      {form.key_takeaways.map((point, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={point}
                            onChange={(e) => {
                              const updated = [...form.key_takeaways];
                              updated[idx] = e.target.value;
                              setForm((prev) => ({
                                ...prev,
                                key_takeaways: updated,
                              }));
                            }}
                            placeholder={`النقطة الرئيسية ${idx + 1}`}
                            className="flex-1 rounded-xl border border-sky-200 px-3 py-2.5 text-xs sm:text-sm focus:border-[#1575B5] focus:outline-none"
                          />
                          {form.key_takeaways.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = form.key_takeaways.filter(
                                  (_, i) => i !== idx
                                );
                                setForm((prev) => ({
                                  ...prev,
                                  key_takeaways: updated,
                                }));
                              }}
                              className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FAQs */}
                  <div className="space-y-3 pt-4 border-t border-sky-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#06446F]">
                          الأسئلة الشائعة وإجاباتها
                        </h4>
                        <p className="text-xs text-slate-500">
                          تظهر في نهاية المقال وتفيد جداً في ثقة المرضى وظهور المقال في جوجل
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            faqs: [...prev.faqs, { question: "", answer: "" }],
                          }))
                        }
                        className="px-3 py-1.5 rounded-xl bg-[#E8F4FB] text-[#06446F] text-xs font-bold hover:bg-[#d6ecf9] cursor-pointer"
                      >
                        + إضافة سؤال
                      </button>
                    </div>

                    <div className="space-y-3">
                      {form.faqs.map((faq, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-[#E8F4FB]/50 border border-sky-100 space-y-2 relative"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#06446F]">
                              سؤال {idx + 1}
                            </span>
                            {form.faqs.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = form.faqs.filter(
                                    (_, i) => i !== idx
                                  );
                                  setForm((prev) => ({
                                    ...prev,
                                    faqs: updated,
                                  }));
                                }}
                                className="text-slate-400 hover:text-red-600 transition-colors p-1"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => {
                              const updated = [...form.faqs];
                              updated[idx] = {
                                ...updated[idx],
                                question: e.target.value,
                              };
                              setForm((prev) => ({ ...prev, faqs: updated }));
                            }}
                            placeholder="اكتب السؤال هنا"
                            className="w-full rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs sm:text-sm focus:border-[#1575B5] focus:outline-none"
                          />
                          <textarea
                            rows={2}
                            value={faq.answer}
                            onChange={(e) => {
                              const updated = [...form.faqs];
                              updated[idx] = {
                                ...updated[idx],
                                answer: e.target.value,
                              };
                              setForm((prev) => ({ ...prev, faqs: updated }));
                            }}
                            placeholder="اكتب الإجابة الطبية الواضحة هنا"
                            className="w-full rounded-xl border border-sky-200 bg-white p-2.5 text-xs sm:text-sm focus:border-[#1575B5] focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Google Search Visibility */}
              {editorTab === "seo" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#06446F] mb-1.5">
                      الكلمة الأساسية التي يبحث عنها المريض
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
                      className="w-full rounded-2xl border border-sky-200 px-3.5 py-2.5 text-sm focus:border-[#1575B5] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#06446F] mb-1.5">
                      عنوان المقال في نتائج بحث جوجل
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
                      placeholder={form.title || "عنوان المقال في جوجل"}
                      className="w-full rounded-2xl border border-sky-200 px-3.5 py-2.5 text-sm focus:border-[#1575B5] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#06446F] mb-1.5">
                      وصف المقال في نتائج بحث جوجل
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
                      placeholder={form.excerpt || "وصف مختصر يظهر في جوجل"}
                      className="w-full rounded-2xl border border-sky-200 p-3 text-sm focus:border-[#1575B5] focus:outline-none"
                    />
                  </div>

                  {/* Google Preview Card */}
                  <div className="p-4 rounded-2xl bg-[#E8F4FB]/50 border border-sky-100 space-y-1.5">
                    <span className="text-[11px] font-bold text-[#06446F]">
                      معاينة شكل المقال في محرك بحث جوجل
                    </span>
                    <div className="bg-white rounded-xl p-3 border border-sky-100 space-y-1">
                      <div className="text-xs text-emerald-700 truncate" dir="ltr">
                        https://drdalia-dental.com/ar/articles/{form.slug || "article"}
                      </div>
                      <div className="text-sm font-bold text-blue-700 hover:underline cursor-pointer truncate">
                        {form.seo_title || form.title || "عنوان المقال الطبي"}
                      </div>
                      <div className="text-xs text-slate-600 line-clamp-2">
                        {form.seo_description ||
                          form.excerpt ||
                          "وصف المقال التوضيحي الذي سيقرأه الزائر في نتائج البحث"}
                      </div>
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="p-4 rounded-2xl bg-white border border-sky-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#06446F]">
                        مدى جاهزية المقال لمحركات البحث
                      </span>
                      <span className="text-xs font-black text-[#1575B5]">
                        {seoEvaluation.score}%
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {seoEvaluation.checks.map((chk, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium ${
                            chk.passed
                              ? "bg-emerald-50 text-emerald-800"
                              : "bg-slate-50 text-slate-600"
                          }`}
                        >
                          <CheckCircle2
                            className={`w-3.5 h-3.5 shrink-0 ${
                              chk.passed ? "text-emerald-600" : "text-slate-300"
                            }`}
                          />
                          <span>{chk.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Sticky Save Bar on Mobile */}
              <div className="sticky bottom-0 bg-white/95 backdrop-blur-md pt-3.5 pb-2 border-t border-sky-100 flex items-center justify-between gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="px-4 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-2xl bg-[#06446F] hover:bg-[#1575B5] active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-[#06446F]/20 transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>جاري حفظ المقال</span>
                    </>
                  ) : form.id ? (
                    <span>حفظ التعديلات</span>
                  ) : (
                    <span>نشر وحفظ المقال الآن</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ------------------------------------------------------------------- */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl border border-sky-100 p-6 shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-[#06446F]">
                تأكيد حذف المقال
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                هل أنت متأكد من حذف مقال{" "}
                <strong className="text-[#06446F]">
                  &ldquo;{deleteTarget.title}&rdquo;
                </strong>{" "}
                نهائياً من الموقع
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold cursor-pointer hover:bg-slate-100"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 rounded-2xl bg-red-600 text-white hover:bg-red-700 text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* AI ASSISTANT MODAL (Simple & Doctor-Friendly) */}
      {/* ------------------------------------------------------------------- */}
      {assistantModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-sky-100 shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-[#E8F4FB] text-[#06446F] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#1575B5]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#06446F]">
                    المساعد الذكي لكتابة المقالات
                  </h3>
                  <p className="text-xs text-slate-500">
                    ربط ذكي لكتابة مقالات طبية جديدة ومراجعتها
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAssistantModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#E8F4FB]/50 border border-sky-100 space-y-3 text-xs text-slate-700 leading-relaxed">
              <p>
                يمكنك ربط أي مساعد ذكاء اصطناعي لكتابة مقالات طبية متخصصة وإضافتها كمسودات في لوحة التحكم لمراجعتها والموافقة عليها بضغطة واحدة
              </p>

              <div>
                <span className="block text-[11px] font-bold text-[#06446F] mb-1">
                  رابط المساعد الخاص بموقعك
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={
                      typeof window !== "undefined"
                        ? `${window.location.origin}/api/mcp`
                        : "/api/mcp"
                    }
                    dir="ltr"
                    className="flex-1 rounded-xl bg-white border border-sky-200 px-3 py-2 text-xs font-mono text-slate-700"
                  />
                  <button
                    type="button"
                    onClick={copyAssistantLink}
                    className="px-3.5 py-2 rounded-xl bg-[#06446F] hover:bg-[#1575B5] text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    {assistantCopied ? "تم النسخ" : "نسخ الرابط"}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAssistantModalOpen(false)}
              className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#06446F] text-xs font-bold transition-colors cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
