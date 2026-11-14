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
} from "lucide-react";
import type { AnalyticsReport } from "@/lib/supabase/types";

export default function OverviewTab() {
  const [days, setDays] = useState<number>(14);
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchReport = useCallback(async (selectedDays: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?days=${selectedDays}`);
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

  const maxTimelineVisits = Math.max(
    1,
    ...(report?.timeline.map((t) => t.visits) || [1])
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-border p-5 shadow-sm">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-brand-primary flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand-action" />
            <span>نظرة عامة على أداء الموقع</span>
          </h1>
          <p className="text-xs md:text-sm text-foreground/60 mt-1">
            تقرير مباشر لعدد الزوار، مصادر الزيارات، الخط الزمني، وأداء المقالات الطبية
          </p>
        </div>

        <div className="flex items-center gap-2">
          {[
            { label: "آخر 7 أيام", value: 7 },
            { label: "آخر 14 يوم", value: 14 },
            { label: "آخر 30 يوم", value: 30 },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setDays(opt.value)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                days === opt.value
                  ? "bg-brand-primary text-white shadow-sm"
                  : "bg-background text-foreground/70 hover:bg-brand-accent/25"
              }`}
            >
              {opt.label}
            </button>
          ))}

          <button
            type="button"
            onClick={() => fetchReport(days)}
            disabled={loading}
            className="p-2.5 rounded-xl bg-brand-accent/20 text-brand-primary hover:bg-brand-primary hover:text-white transition-colors cursor-pointer"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white border border-border p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground/60">
              إجمالي الزيارات (Total Visits)
            </span>
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-brand-primary">
              {loading && !report ? "..." : report?.totalVisits ?? 0}
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              بمتوسط {report?.avgDailyVisits ?? 0} زيارة يومياً
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-border p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground/60">
              الزوار الفريدون (Unique Visitors)
            </span>
            <div className="w-10 h-10 rounded-xl bg-brand-action/10 text-brand-action flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-brand-primary">
              {loading && !report ? "..." : report?.uniqueVisitors ?? 0}
            </div>
            <p className="text-[11px] text-foreground/55 mt-1">
              زائر فريد خلال آخر {days} يوم
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-border p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground/60">
              مشاهدات المقالات (Article Views)
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-brand-primary">
              {loading && !report ? "..." : report?.articleViews ?? 0}
            </div>
            <p className="text-[11px] text-foreground/55 mt-1">
              عبر {report?.publishedArticlesCount ?? 0} مقالات منشورة
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-border p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-foreground/60">
              نقرات حجز واتساب (WhatsApp CTA)
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-emerald-600">
              {loading && !report ? "..." : report?.whatsappClicks ?? 0}
            </div>
            <p className="text-[11px] text-foreground/55 mt-1">
              تحويل مباشر للتواصل مع العيادة
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="rounded-2xl bg-white border border-border p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base md:text-lg font-extrabold text-brand-primary">
              الخط الزمني للزيارات (Visits Timeline)
            </h2>
            <p className="text-xs text-foreground/60">
              توزيع الزيارات اليومية والزوار الفريدين خلال آخر {days} يوم
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="inline-flex items-center gap-1.5 text-brand-primary">
              <span className="w-3 h-3 rounded-sm bg-brand-primary inline-block" />
              إجمالي الزيارات
            </span>
            <span className="inline-flex items-center gap-1.5 text-brand-action">
              <span className="w-3 h-3 rounded-sm bg-brand-accent inline-block" />
              الزوار الفريدون
            </span>
          </div>
        </div>

        <div className="h-60 pt-6 pb-2 px-2 flex items-end gap-2 sm:gap-3 overflow-x-auto border-b border-border">
          {(report?.timeline || []).map((point) => {
            const visitHeightPercent = Math.max(
              8,
              Math.round((point.visits / maxTimelineVisits) * 100)
            );
            const uniqueHeightPercent = Math.max(
              5,
              Math.round((point.uniqueVisitors / maxTimelineVisits) * 100)
            );
            return (
              <div
                key={point.date}
                className="flex-1 min-w-[34px] h-full flex flex-col justify-end items-center group relative"
              >
                {/* Hover Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap z-10 pointer-events-none shadow">
                  {point.date}: {point.visits} زيارة ({point.uniqueVisitors} زائر)
                </div>

                <span className="text-[10px] font-bold text-foreground/60 mb-1">
                  {point.visits}
                </span>

                <div className="w-full max-w-[32px] h-[160px] flex items-end justify-center gap-1">
                  <div
                    className="w-1/2 rounded-t-md bg-brand-primary transition-all duration-500 group-hover:bg-brand-action"
                    style={{ height: `${visitHeightPercent}%` }}
                  />
                  <div
                    className="w-1/2 rounded-t-md bg-brand-accent transition-all duration-500"
                    style={{ height: `${uniqueHeightPercent}%` }}
                  />
                </div>

                <span className="text-[10px] font-semibold text-foreground/60 mt-2">
                  {point.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Traffic Sources & Devices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Traffic Sources */}
        <div className="lg:col-span-7 rounded-2xl bg-white border border-border p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base md:text-lg font-extrabold text-brand-primary flex items-center gap-2">
                <Share2 className="w-5 h-5 text-brand-action" />
                <span>مصادر الزوار (Traffic Sources)</span>
              </h2>
              <p className="text-xs text-foreground/60">
                من أين يأتي الزوار إلى موقع عيادة د. داليا؟
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {(report?.sources || []).map((src) => (
              <div key={src.source} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <span className="font-bold text-foreground/85">{src.label}</span>
                  <span className="font-extrabold text-brand-primary">
                    {src.count} زيارة ({src.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-background overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-action transition-all duration-500"
                    style={{ width: `${Math.max(4, src.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Devices & Geo */}
        <div className="lg:col-span-5 rounded-2xl bg-white border border-border p-6 shadow-sm space-y-6">
          <div className="space-y-4">
            <h2 className="text-base md:text-lg font-extrabold text-brand-primary flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-brand-action" />
              <span>الأجهزة المستخدمة (Devices)</span>
            </h2>
            <div className="space-y-3">
              {(report?.devices || []).map((dev) => {
                const Icon =
                  dev.device === "Desktop"
                    ? Monitor
                    : dev.device === "Tablet"
                    ? Tablet
                    : Smartphone;
                return (
                  <div
                    key={dev.device}
                    className="flex items-center justify-between p-3 rounded-xl bg-background/60 border border-border/60"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-brand-action" />
                      <span className="text-xs font-bold text-foreground/85">
                        {dev.label}
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-brand-primary">
                      {dev.count} ({dev.percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-border">
            <h3 className="text-sm font-extrabold text-brand-primary flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-action" />
              <span>أعلى الدول (Top Locations)</span>
            </h3>
            <div className="space-y-2">
              {(report?.countries || []).map((c) => (
                <div
                  key={c.country}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-foreground/75">
                    {c.label}
                  </span>
                  <span className="font-bold text-brand-primary">
                    {c.count} ({c.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Articles & Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Articles */}
        <div className="rounded-2xl bg-white border border-border p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base md:text-lg font-extrabold text-brand-primary flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-action" />
              <span>أكثر المقالات قراءة</span>
            </h2>
            <Link
              href="/ar/articles"
              target="_blank"
              className="text-xs font-bold text-brand-action hover:underline inline-flex items-center gap-1"
            >
              <span>صفحة المقالات</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border">
            {(report?.topArticles || []).map((art, i) => (
              <div
                key={art.slug}
                className="py-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-brand-primary/10 text-brand-primary text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <Link
                      href={`/ar/articles/${art.slug}`}
                      target="_blank"
                      className="text-xs md:text-sm font-bold text-brand-primary hover:text-brand-action line-clamp-1"
                    >
                      {art.title}
                    </Link>
                    <span className="text-[11px] text-foreground/50">
                      {art.category}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-brand-accent/20 text-brand-primary text-xs font-extrabold shrink-0 inline-flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {art.views}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Visitor Activity Timeline */}
        <div className="rounded-2xl bg-white border border-border p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base md:text-lg font-extrabold text-brand-primary flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-action" />
              <span>سجل آخر الزيارات (Live Activity)</span>
            </h2>
          </div>

          <div className="divide-y divide-border max-h-[320px] overflow-y-auto">
            {(report?.recentEvents || []).slice(0, 8).map((ev) => (
              <div
                key={ev.id}
                className="py-2.5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-bold text-foreground/85 truncate">
                    {ev.page_title || ev.path}
                  </p>
                  <p className="text-[11px] text-foreground/55">
                    المصدر: <span className="font-semibold">{ev.source}</span> •{" "}
                    {ev.device}
                  </p>
                </div>
                <span className="text-[11px] text-foreground/50 shrink-0" dir="ltr">
                  {new Date(ev.created_at).toLocaleTimeString("ar-EG", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
