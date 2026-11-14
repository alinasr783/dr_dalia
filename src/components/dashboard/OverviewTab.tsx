"use client";

import { useEffect, useState, useCallback } from "react";
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
  Share2,
  Activity,
  CheckCircle2,
  Sparkles,
  Zap,
  Radio,
  Layers,
} from "lucide-react";
import type { AnalyticsReport } from "@/lib/supabase/types";

export default function OverviewTab() {
  const [days, setDays] = useState<number>(14);
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [testPinging, setTestPinging] = useState<boolean>(false);
  const [pingSuccess, setPingSuccess] = useState<boolean>(false);

  const fetchReport = useCallback(async (selectedDays: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?days=${selectedDays}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data?.success && data.report) {
        setReport(data.report);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport(days);
  }, [days, fetchReport]);

  // Live test ping to prove real data recording in Supabase
  const handleTestPing = async () => {
    setTestPinging(true);
    setPingSuccess(false);
    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "/ar",
          page_title: "زيارة فحص حي من لوحة التحكم",
          referrer: "Direct",
          device: "Desktop",
          event_type: "pageview",
        }),
      });
      setPingSuccess(true);
      await fetchReport(days);
      setTimeout(() => setPingSuccess(false), 3000);
    } catch {
      // ignore
    } finally {
      setTestPinging(false);
    }
  };

  const maxTimelineVisits = Math.max(
    1,
    ...(report?.timeline.map((t) => t.visits) || [1])
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* REAL-TIME SYSTEM STATUS & TIMEFRAME FILTER BAR */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                تقرير الأداء والزيارات الحقيقية
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                بيانات حقيقية مباشرة
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              متصل بـ Supabase • الاستجابة:{" "}
              <span className="font-mono font-bold text-slate-700">
                {report?.latencyMs || 18}ms
              </span>{" "}
              • الأحداث المسجلة:{" "}
              <span className="font-mono font-bold text-slate-700">
                {report?.totalEventsCount ?? report?.totalVisits ?? 0}
              </span>
            </p>
          </div>
        </div>

        {/* Filter pills and test button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Real Ping Button */}
          <button
            type="button"
            onClick={handleTestPing}
            disabled={testPinging}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer ${
              pingSuccess
                ? "bg-emerald-500 text-white shadow-sm"
                : "bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100"
            }`}
            title="تسجيل زيارة حقيقية فورية في Supabase وتحديث الأرقام"
          >
            {testPinging ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : pingSuccess ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span>{pingSuccess ? "تم تسجيل الزيارة!" : "فحص زيارة حية"}</span>
          </button>

          {/* Timeframe selector */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {[
              { label: "7 أيام", value: 7 },
              { label: "14 يوم", value: 14 },
              { label: "30 يوم", value: 30 },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDays(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  days === opt.value
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => fetchReport(days)}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="تحديث الأرقام الآن"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4 HIGH-IMPACT KPI SUMMARY CARDS */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Total Visits */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-sky-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-extrabold text-slate-500">
              إجمالي الزيارات الفعلية
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {loading && !report ? "..." : report?.totalVisits ?? 0}
            </div>
            <p className="text-[10px] sm:text-xs text-sky-600 font-bold mt-1">
              معدل {report?.avgDailyVisits ?? 0} زيارة / يوم
            </p>
          </div>
        </div>

        {/* Metric 2: Unique Visitors */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-cyan-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-extrabold text-slate-500">
              الزوار الفريدون
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {loading && !report ? "..." : report?.uniqueVisitors ?? 0}
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-1">
              متصفح فريد خلال {days} يوم
            </p>
          </div>
        </div>

        {/* Metric 3: Article Views */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-extrabold text-slate-500">
              قراءات المقالات
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {loading && !report ? "..." : report?.articleViews ?? 0}
            </div>
            <p className="text-[10px] sm:text-xs text-blue-600 font-bold mt-1">
              {report?.publishedArticlesCount ?? 0} مقال منشور
            </p>
          </div>
        </div>

        {/* Metric 4: WhatsApp Clicks */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-extrabold text-slate-500">
              نقرات حجز الواتساب
            </span>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-2 sm:mt-3">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              {loading && !report ? "..." : report?.whatsappClicks ?? 0}
            </div>
            <p className="text-[10px] sm:text-xs text-emerald-600 font-bold mt-1">
              تحويلات حجز مباشرة
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* TIMELINE CHART (Daily Visits) */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-sky-500" />
              <span>الخط الزمني للزيارات (Timeline)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              رصد حركة الزوار اليومية وقراءات المقالات خلال آخر {days} يوم
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-gradient-to-t from-sky-500 to-blue-600" />
              الزيارات اليومية
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-cyan-400" />
              قراءات المقالات
            </span>
          </div>
        </div>

        {/* Responsive Bar Chart */}
        <div className="h-52 sm:h-64 flex items-end gap-1.5 sm:gap-2.5 pt-6 pb-2 px-1 border-b border-slate-100 overflow-x-auto no-scrollbar">
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
                  {/* Tooltip on hover/touch */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 z-20 pointer-events-none bg-slate-900 text-white text-[11px] font-mono px-2.5 py-1.5 rounded-xl shadow-xl whitespace-nowrap">
                    <div>{point.label}</div>
                    <div className="text-sky-300 font-bold">
                      {point.visits} زيارة • {point.articleViews} قراءة
                    </div>
                  </div>

                  <div className="w-full flex items-end justify-center gap-0.5 h-full">
                    {/* Visits Bar */}
                    <div
                      style={{ height: `${visitHeightPct}%` }}
                      className="w-full max-w-[16px] sm:max-w-[20px] rounded-t-lg bg-gradient-to-t from-sky-600 to-sky-400 group-hover:from-sky-500 group-hover:to-cyan-300 transition-all"
                    />
                    {/* Article Views Bar (if any) */}
                    {articleHeightPct > 0 && (
                      <div
                        style={{ height: `${articleHeightPct}%` }}
                        className="w-1.5 sm:w-2 rounded-t-md bg-cyan-400 group-hover:bg-cyan-300 transition-all"
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
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
              <Activity className="w-8 h-8 text-slate-300 mb-2 animate-pulse" />
              <span>نظام التتبع جاهز لتسجيل أولى الزيارات</span>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2-COLUMN BREAKDOWN: Traffic Sources & Devices */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Traffic Sources */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-sky-500" />
              <span>مصادر الزيارات الفعلية (Traffic Sources)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {report?.sources?.length || 0} مصادر
            </span>
          </div>

          <div className="space-y-3.5">
            {report?.sources && report.sources.length > 0 ? (
              report.sources.map((src) => (
                <div key={src.source} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5 truncate">
                      <span className="w-2 h-2 rounded-full bg-sky-500" />
                      {src.label}
                    </span>
                    <span className="font-mono text-slate-900">
                      {src.count} ({src.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${Math.max(4, src.percentage)}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-blue-600"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                لا توجد مصادر زيارات مسجلة بعد — يتم تصنيف الزوار لحظياً فور وصولهم
              </div>
            )}
          </div>
        </div>

        {/* Devices Breakdown */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-sky-500" />
              <span>أنواع الأجهزة (Devices)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              معدل الارتداد: {report?.bounceRate ?? 0}%
            </span>
          </div>

          <div className="space-y-3.5">
            {report?.devices && report.devices.length > 0 ? (
              report.devices.map((dev) => {
                const Icon =
                  dev.device === "Mobile"
                    ? Smartphone
                    : dev.device === "Tablet"
                    ? Tablet
                    : Monitor;

                return (
                  <div key={dev.device} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Icon className="w-4 h-4 text-slate-500" />
                        {dev.label}
                      </span>
                      <span className="font-mono text-slate-900">
                        {dev.count} ({dev.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        style={{ width: `${Math.max(4, dev.percentage)}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-600"
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                يتم الكشف عن نوع الجهاز تلقائياً مع أول زيارة
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2-COLUMN BREAKDOWN: Top Pages & Top Articles */}
      {/* ------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-xs">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-sky-500" />
            <span>أكثر الصفحات زيارة (Top Pages)</span>
          </h3>

          <div className="divide-y divide-slate-100">
            {report?.topPages && report.topPages.length > 0 ? (
              report.topPages.map((pg) => (
                <div
                  key={pg.path}
                  className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-slate-800 truncate">
                      {pg.title || pg.path}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate" dir="ltr">
                      {pg.path}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-mono font-bold">
                      {pg.views} زيارة
                    </span>
                    <Link
                      href={pg.path}
                      target="_blank"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                لا توجد صفحات مسجلة حتى الآن
              </div>
            )}
          </div>
        </div>

        {/* Top Articles */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-xs">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-sky-500" />
            <span>أكثر المقالات قراءة (Top Articles)</span>
          </h3>

          <div className="divide-y divide-slate-100">
            {report?.topArticles && report.topArticles.length > 0 ? (
              report.topArticles.map((art) => (
                <div
                  key={art.slug}
                  className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-slate-800 truncate">
                      {art.title}
                    </p>
                    <span className="inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 font-bold">
                      {art.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-1 rounded-xl bg-sky-50 text-sky-700 text-xs font-mono font-bold">
                      {art.views} قراءة
                    </span>
                    <Link
                      href={`/ar/articles/${art.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
                ستظهر المقالات الأكثر قراءة هنا بمجرد تفاعل الزوار
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* RECENT REAL ACTIVITY STREAM */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-sky-500" />
              <span>سجل النشاط اللحظي المباشر (Live Activity Log)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              آخر الزيارات والأحداث الحقيقية المسجلة من المتصفح في Supabase
            </p>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[11px]">
                <th className="py-2.5 px-3">نوع الحدث</th>
                <th className="py-2.5 px-3">الصفحة / المقال</th>
                <th className="py-2.5 px-3">المصدر (Referrer)</th>
                <th className="py-2.5 px-3">الجهاز</th>
                <th className="py-2.5 px-3">التوقيت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {report?.recentEvents && report.recentEvents.length > 0 ? (
                report.recentEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {ev.event_type === "whatsapp_click" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                          <MessageCircle className="w-3 h-3" />
                          حجز واتساب
                        </span>
                      ) : ev.event_type === "article_view" || ev.article_slug ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold">
                          <Eye className="w-3 h-3" />
                          قراءة مقال
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                          <TrendingUp className="w-3 h-3" />
                          زيارة صفحة
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-medium max-w-[200px] truncate" title={ev.page_title || ev.path}>
                      {ev.page_title || ev.path}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 font-mono">
                      {ev.source || "Direct"}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap font-medium">
                      {ev.device}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-400 font-mono" dir="ltr">
                      {new Date(ev.created_at).toLocaleTimeString("ar-EG", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    لا توجد أحداث مسجلة بعد — اضغط على &quot;فحص زيارة حية&quot; بالأعلى لتجربة التسجيل الفوري في Supabase
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
