"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Sparkles,
  X,
  ExternalLink,
  RefreshCw,
  KeyRound,
  AlertTriangle,
  Wand2,
} from "lucide-react";
import type { Post } from "@/lib/supabase/types";

type StatusFilter = "all" | "published" | "draft";

export default function ArticlesManagerTab() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);

  // AI activation modal (activation key is checked locally only, no real AI connection)
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

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
    const q = searchQuery.trim().toLowerCase();
    return posts.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        (p.title_en || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q)
      );
    });
  }, [posts, statusFilter, searchQuery]);

  const counts = useMemo(
    () => ({
      all: posts.length,
      published: posts.filter((p) => p.status === "published").length,
      draft: posts.filter((p) => p.status === "draft").length,
    }),
    [posts]
  );

  const handleToggle = async (post: Post, field: "status" | "featured") => {
    const update: Partial<Post> =
      field === "status"
        ? { status: post.status === "published" ? "draft" : "published" }
        : { featured: !post.featured };

    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, ...update } : p))
    );

    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });
      const data = await res.json();
      if (!data?.success) throw new Error();
      showNotice("تم التحديث");
    } catch {
      await loadPosts();
      showNotice("تعذر تحديث المقال", "error");
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
        showNotice("تم حذف المقال");
      } else {
        showNotice("تعذر حذف المقال", "error");
      }
    } catch {
      showNotice("تعذر حذف المقال", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const openAiModal = () => {
    setApiKey("");
    setAiError(null);
    setShowKey(false);
    setAiModalOpen(true);
  };

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim() || verifying) return;
    setAiError(null);
    setVerifying(true);
    // Simulated verification: no request is sent anywhere, every key is rejected.
    setTimeout(() => {
      setVerifying(false);
      setAiError("مفتاح التفعيل غير صحيح، تأكد من المفتاح وحاول مرة أخرى");
    }, 2200 + Math.random() * 1300);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {toast && (
        <div
          className={`fixed bottom-24 lg:bottom-5 left-5 z-[60] px-5 py-3 rounded-2xl shadow-xl font-bold text-xs sm:text-sm ${
            toast.type === "error" ? "bg-red-600 text-white" : "bg-[#06446F] text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* AI writing card */}
      <div className="bg-gradient-to-l from-[#06446F] to-[#1575B5] rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
            <Wand2 className="w-6 h-6 text-[#A3DBE4]" />
          </div>
          <div>
            <h3 className="font-black text-base sm:text-lg">
              كتابة مقال جديد بالذكاء الاصطناعي
            </h3>
            <p className="text-xs sm:text-sm text-sky-100 mt-0.5">
              المقالات الجديدة تُكتب بمساعدة الذكاء الاصطناعي فقط
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={openAiModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#06446F] hover:bg-sky-50 font-black text-sm shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Sparkles className="w-4 h-4 text-[#1575B5]" />
          <span>ابدأ الكتابة</span>
        </button>
      </div>

      {/* Search & filters */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-sky-100 p-3 sm:p-4 shadow-xs flex flex-col md:flex-row md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 right-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن مقال"
            className="w-full rounded-2xl bg-slate-50 border border-slate-200 pr-10 pl-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1575B5]/20 focus:border-[#1575B5] transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          {(
            [
              { id: "all", label: "الكل" },
              { id: "published", label: "منشور" },
              { id: "draft", label: "مسودة" },
            ] as { id: StatusFilter; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-[#06446F] text-white"
                  : "bg-[#E8F4FB] text-[#06446F] hover:bg-[#d6ecf9]"
              }`}
            >
              {tab.label} ({counts[tab.id]})
            </button>
          ))}

          <button
            type="button"
            onClick={loadPosts}
            className="p-2 rounded-xl bg-[#E8F4FB] text-[#06446F] hover:bg-[#d6ecf9] cursor-pointer transition-colors"
            title="تحديث"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Articles list */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-sky-100 shadow-xs overflow-hidden">
        {loading && posts.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            جاري تحميل المقالات
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center text-sm font-bold text-[#06446F]">
            لا توجد مقالات
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filteredPosts.map((post) => {
              const published = post.status === "published";
              return (
                <li
                  key={post.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      {post.cover_image && (
                        <Image
                          src={post.cover_image}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-[#06446F] text-sm line-clamp-1">
                        {post.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] text-slate-500">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold ${
                            published
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {published ? "منشور" : "مسودة"}
                        </span>
                        {post.category && <span>{post.category}</span>}
                        <span className="inline-flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleToggle(post, "status")}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        published
                          ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      }`}
                    >
                      {published ? "إخفاء" : "نشر"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggle(post, "featured")}
                      title={post.featured ? "إلغاء التمييز" : "تمييز المقال"}
                      className={`p-2 rounded-xl border cursor-pointer transition-colors ${
                        post.featured
                          ? "bg-amber-50 border-amber-300 text-amber-500"
                          : "border-slate-200 text-slate-300 hover:text-slate-500"
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                    <Link
                      href={`/ar/articles/${post.slug}`}
                      target="_blank"
                      className="p-2 rounded-xl bg-[#E8F4FB] hover:bg-[#d6ecf9] text-[#06446F] transition-colors"
                      title="معاينة"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(post)}
                      className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl border border-sky-100 p-6 shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-[#06446F]">حذف المقال؟</h3>
              <p className="text-sm text-slate-600">
                سيتم حذف &ldquo;{deleteTarget.title}&rdquo; نهائياً
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
                className="px-6 py-2.5 rounded-2xl bg-red-600 text-white hover:bg-red-700 text-xs font-bold cursor-pointer transition-colors"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI activation modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleActivate}
            className="bg-white w-full max-w-md rounded-3xl border border-sky-100 shadow-xl p-6 space-y-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#E8F4FB] flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-[#1575B5]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#06446F]">
                    تفعيل الكتابة الذكية
                  </h3>
                  <p className="text-xs text-slate-500">
                    أدخل مفتاح التفعيل للمتابعة
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAiModalOpen(false)}
                disabled={verifying}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 cursor-pointer disabled:opacity-50"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setAiError(null);
                }}
                disabled={verifying}
                placeholder="API Key"
                autoComplete="off"
                spellCheck={false}
                dir="ltr"
                className={`w-full rounded-2xl bg-slate-50 border pl-11 pr-4 py-3.5 text-sm font-mono text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all disabled:opacity-60 ${
                  aiError
                    ? "border-red-300 focus:ring-red-200"
                    : "border-slate-200 focus:ring-[#1575B5]/20 focus:border-[#1575B5]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                aria-label="إظهار أو إخفاء المفتاح"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {aiError && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-bold text-center">
                {aiError}
              </div>
            )}

            <button
              type="submit"
              disabled={verifying || !apiKey.trim()}
              className="w-full py-3.5 rounded-2xl bg-[#06446F] hover:bg-[#1575B5] text-white font-black text-sm transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {verifying ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>جاري التحقق من المفتاح</span>
                </>
              ) : (
                <span>تفعيل</span>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
