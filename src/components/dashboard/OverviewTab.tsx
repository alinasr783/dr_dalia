"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Eye,
  FileText,
  MessageCircle,
  RefreshCw,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ExternalLink,
  Clock,
  BarChart3,
  CheckCircle2,
  Edit3,
  Sparkles,
  Check,
  AlertCircle,
} from "lucide-react";
import type { AnalyticsReport, Post } from "@/lib/supabase/types";

type OverviewTabProps = {
  onEditPostRequest?: (post: Post) => void;
};

export default function OverviewTab({ onEditPostRequest }: OverviewTabProps) {
  const [days, setDays] = useState<number>(14);
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [draftPosts, setDraftPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const fetchOverviewData = useCallback(async (selectedDays: number) => {
    setLoading(true);
    try {
      const [analyticsRes, postsRes] = await Promise.all([
        fetch(`/api/analytics?days=${selectedDays}`, { cache: "no-store" }),
        fetch("/api/posts?status=draft&limit=20", { cache: "no-store" }),
      ]);

      const analyticsData = await analyticsRes.json();
      if (analyticsData?.success && analyticsData.report) {
        setReport(analyticsData.report);
      }

      const postsData = await postsRes.json();
      if (postsData?.success && Array.isArray(postsData.posts)) {
        setDraftPosts(postsData.posts);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverviewData(days);
  }, [days, fetchOverviewData]);

  // One-click quick approve & publish for drafts
  const handleApprovePublish = async (post: Post) => {
    setApprovingId(post.id);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "published" }),
      });
      const data = await res.json();
      if (data?.success) {
        setDraftPosts((prev) => prev.filter((p) => p.id !== post.id));
        setNoticeMessage("تمت الموافقة ونشر المقال بنجاح");
        setTimeout(() => setNoticeMessage(null), 4000);
        // refresh report numbers
        fetchOverviewData(days);
      }
    } catch {
      setNoticeMessage("تعذر نشر المقال حالياً");
      setTimeout(() => setNoticeMessage(null), 4000);
    } finally {
      setApprovingId(null);
    }
  };

  const maxTimelineVisits = Math.max(
    1,
    ...(report?.timeline.map((t) => t.visits) || [1])
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Toast Notice */}
      {noticeMessage && (
        <div className="fixed bottom-5 left-5 z-50 px-5 py-3 rounded-2xl bg-[#06446F] text-white text-xs sm:text-sm font-bold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{noticeMessage}</span>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TOP BAR & DATE FILTER */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-sky-100 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#06446F] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#1575B5]" />
            <span>نظرة عامة على أداء الموقع</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            متابعة إحصائيات الزوار وطلبات الحجز والمقالات التي تحتاج موافقة للنشر
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-[#E8F4FB] p-1 rounded-2xl">
            {[
              { label: "اليوم", value: 1 },
              { label: "آخر 7 أيام", value: 7 },
              { label: "آخر 30 يوم", value: 30 },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDays(opt.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  days === opt.value
                    ? "bg-[#06446F] text-white shadow-xs"
                    : "text-[#06446F] hover:bg-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => fetchOverviewData(days)}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-[#E8F4FB] text-[#06446F] hover:bg-[#d6ecf9] transition-colors cursor-pointer"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4 SUMMARY METRIC CARDS (Landing Page Colors) */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Visits */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-sky-100 p-4 sm:p-5 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              إجمالي زيارات الموقع
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#E8F4FB] text-[#06446F] flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-[#06446F]">
              {loading && !report ? "..." : report?.totalVisits ?? 0}
            </div>
            <p className="text-[11px] text-[#1575B5] font-bold mt-1">
              معدل {report?.avgDailyVisits ?? 0} زيارة يومياً
            </p>
          </div>
        </div>

        {/* Card 2: Unique Visitors */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-sky-100 p-4 sm:p-5 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              الزوار المهتمون
            </span>
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#1575B5] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-[#06446F]">
              {loading && !report ? "..." : report?.uniqueVisitors ?? 0}
            </div>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              زائر مميز خلال هذه الفترة
            </p>
          </div>
        </div>

        {/* Card 3: Article Views */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-sky-100 p-4 sm:p-5 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              قراءات المقالات
            </span>
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-[#06446F]">
              {loading && !report ? "..." : report?.articleViews ?? 0}
            </div>
            <p className="text-[11px] text-[#1575B5] font-bold mt-1">
              {report?.publishedArticlesCount ?? 0} مقال منشور حالياً
            </p>
          </div>
        </div>

        {/* Card 4: WhatsApp Clicks */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-sky-100 p-4 sm:p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">
              طلبات حجز الواتساب
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-[#06446F]">
              {loading && !report ? "..." : report?.whatsappClicks ?? 0}
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">
              تواصلوا لحجز موعد بالعيادة
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* PENDING DRAFTS SECTION (Review & Approve Feature) */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-sky-100 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#06446F]">
                المقالات التي بانتظار موافقتك للنشر
              </h3>
              {draftPosts.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                  {draftPosts.length} مسودة
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              يمكنك مراجعة المسودات وتعديلها أو الموافقة عليها مباشرة لتنشر في الموقع فوراً
            </p>
          </div>
        </div>

        {draftPosts.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {draftPosts.map((post) => (
              <div
                key={post.id}
                className="py-4 first:pt-1 last:pb-1 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors rounded-xl px-2"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#E8F4FB] text-[#06446F] font-bold">
                        {post.category}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold">
                        مسودة
                      </span>
                    </div>
                    <h4 className="font-extrabold text-[#06446F] text-sm truncate">
                      {post.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => onEditPostRequest?.(post)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#06446F] text-xs font-bold transition-all cursor-pointer active:scale-95"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تعديل المقال</span>
                  </button>

                  <button
                    type="button"
                    disabled={approvingId === post.id}
                    onClick={() => handleApprovePublish(post)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-60"
                  >
                    {approvingId === post.id ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>موافقة ونشر الآن</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center rounded-2xl bg-[#E8F4FB]/50 border border-sky-100">
            <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-[#06446F]">
              جميع المقالات منشورة وجاهزة ولا توجد مسودات معلقة حالياً
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              عند إضافة مقال جديد كمسودة أو كتابته بواسطة المساعد الذكي سيظهر هنا لمراجعتك
            </p>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* TIMELINE CHART (Clean Bar Chart) */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-sky-100 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#06446F] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#1575B5]" />
              <span>معدل الزيارات اليومية</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              متابعة عدد الزوار اليومي وقراءات المقالات
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-[#06446F]" />
              زيارات الموقع
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-[#1575B5]" />
              قراءات المقالات
            </span>
          </div>
        </div>

        <div className="h-48 sm:h-56 flex items-end gap-1.5 sm:gap-2.5 pt-4 pb-2 px-1 border-b border-sky-100 overflow-x-auto no-scrollbar">
          {report?.timeline && report.timeline.length > 0 ? (
            report.timeline.map((point) => {
              const visitHeightPct = Math.max(
                6,
                Math.round((point.visits / maxTimelineVisits) * 100)
              );
              const articleHeightPct = Math.max(
                point.articleViews > 0 ? 6 : 0,
                Math.round((point.articleViews / maxTimelineVisits) * 100)
              );

              return (
                <div
                  key={point.date}
                  className="flex-1 min-w-[28px] sm:min-w-[36px] flex flex-col items-center gap-1 group relative h-full justify-end"
                >
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 z-20 pointer-events-none bg-[#06446F] text-white text-[11px] font-bold px-2 py-1 rounded-xl shadow-lg whitespace-nowrap">
                    {point.visits} زيارة
                  </div>

                  <div className="w-full flex items-end justify-center gap-0.5 h-full">
                    <div
                      style={{ height: `${visitHeightPct}%` }}
                      className="w-full max-w-[16px] sm:max-w-[20px] rounded-t-lg bg-gradient-to-t from-[#06446F] to-[#1575B5] group-hover:to-sky-400 transition-all"
                    />
                    {articleHeightPct > 0 && (
                      <div
                        style={{ height: `${articleHeightPct}%` }}
                        className="w-1.5 sm:w-2 rounded-t-md bg-[#A3DBE4] transition-all"
                      />
                    )}
                  </div>

                  <span className="text-[10px] sm:text-xs text-slate-400 font-mono mt-1 text-center truncate w-full">
                    {point.label}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
              سيظهر المخطط البياني تلقائياً مع تصفح زوار العيادة
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2 COLUMNS: Traffic Sources & Devices */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Sources */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-sky-100 p-4 sm:p-6 shadow-xs">
          <h3 className="text-base font-black text-[#06446F] flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-[#1575B5]" />
            <span>من أين يأتي زوار العيادة</span>
          </h3>

          <div className="space-y-3">
            {report?.sources && report.sources.length > 0 ? (
              report.sources.map((src) => (
                <div key={src.source} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>{src.label}</span>
                    <span className="text-[#06446F]">
                      {src.count} ({src.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${Math.max(4, src.percentage)}%` }}
                      className="h-full rounded-full bg-[#1575B5]"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                يتم رصد مصدر كل زائر تلقائياً فور دخوله الموقع
              </div>
            )}
          </div>
        </div>

        {/* Devices */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-sky-100 p-4 sm:p-6 shadow-xs">
          <h3 className="text-base font-black text-[#06446F] flex items-center gap-2 mb-4">
            <Smartphone className="w-5 h-5 text-[#1575B5]" />
            <span>أجهزة الزوار</span>
          </h3>

          <div className="space-y-3">
            {report?.devices && report.devices.length > 0 ? (
              report.devices.map((dev) => {
                const Icon =
                  dev.device === "Mobile"
                    ? Smartphone
                    : dev.device === "Tablet"
                    ? Tablet
                    : Monitor;

                return (
                  <div key={dev.device} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Icon className="w-4 h-4 text-[#1575B5]" />
                        {dev.label}
                      </span>
                      <span className="text-[#06446F]">
                        {dev.count} ({dev.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        style={{ width: `${Math.max(4, dev.percentage)}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-[#1575B5] to-[#A3DBE4]"
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                يتم تحديد نوع الهاتف أو الكمبيوتر لكل زائر مباشرة
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* MOST READ ARTICLES */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-sky-100 p-4 sm:p-6 shadow-xs">
        <h3 className="text-base font-black text-[#06446F] flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-[#1575B5]" />
          <span>أكثر المقالات قراءة</span>
        </h3>

        <div className="divide-y divide-slate-100">
          {report?.topArticles && report.topArticles.length > 0 ? (
            report.topArticles.map((art) => (
              <div
                key={art.slug}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#06446F] truncate">
                    {art.title}
                  </p>
                  <span className="inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded-md bg-[#E8F4FB] text-[#06446F] font-bold">
                    {art.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1 rounded-xl bg-sky-50 text-[#1575B5] text-xs font-bold">
                    {art.views} قراءة
                  </span>
                  <Link
                    href={`/ar/articles/${art.slug}`}
                    target="_blank"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#06446F] transition-colors"
                    title="معاينة المقال"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
              ستظهر هنا المقالات الأكثر قراءة وتفاعلاً من قبل المرضى
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
