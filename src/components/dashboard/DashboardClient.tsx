"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  FileText,
  LogOut,
  ExternalLink,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
} from "lucide-react";
import OverviewTab from "./OverviewTab";
import ArticlesManagerTab from "./ArticlesManagerTab";
import {
  DASHBOARD_USERNAME,
  DASHBOARD_PASSWORD,
} from "@/lib/supabase/config";

const AUTH_STORAGE_KEY = "dr_dalia_dashboard_auth_v1";

type DashboardTab = "overview" | "articles";

function ClinicToothIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} fill="currentColor">
      <path d="M360.751 0c-38.107 0-75.756 14.348-104.746 39.219C227.007 14.345 189.358 0 151.253 0 66.47 0 .056 66.414.056 151.197c0 113.135 74.328 249.149 193.981 354.963 4.34 3.837 9.847 5.84 15.421 5.84 3.235 0 6.493-.675 9.556-2.054 8.347-3.761 13.714-12.066 13.714-21.219V333.576c0-12.833 10.44-23.273 23.273-23.273 12.833 0 23.273 10.44 23.273 23.273v155.152c0 9.152 5.367 17.458 13.712 21.219 8.347 3.761 18.122 2.279 24.979-3.786 58.639-51.859 108.307-114.91 143.633-182.334C440.063 247.383 457.943 186.074 457.943 136.718 511.944 66.414 445.532 0 360.751 0z" />
    </svg>
  );
}

export default function DashboardClient() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");

  // Login form state
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved === "authenticated_drdalia89is") {
        setIsAuthenticated(true);
      }
    } catch {
      // ignore
    } finally {
      setCheckingAuth(false);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    const trimmedUser = username.trim();

    try {
      const res = await fetch("/api/dashboard/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmedUser, password }),
      });

      const data = await res.json();
      if (res.ok && data?.authenticated) {
        try {
          localStorage.setItem(AUTH_STORAGE_KEY, "authenticated_drdalia89is");
        } catch {
          // ignore
        }
        setIsAuthenticated(true);
        setSubmitting(false);
        return;
      }

      // Direct fallback verification
      if (
        trimmedUser === DASHBOARD_USERNAME &&
        password === DASHBOARD_PASSWORD
      ) {
        try {
          localStorage.setItem(AUTH_STORAGE_KEY, "authenticated_drdalia89is");
        } catch {
          // ignore
        }
        setIsAuthenticated(true);
        setSubmitting(false);
        return;
      }

      setErrorMessage(
        data?.error || "اسم المستخدم أو كلمة المرور غير صحيحة"
      );
    } catch {
      if (
        trimmedUser === DASHBOARD_USERNAME &&
        password === DASHBOARD_PASSWORD
      ) {
        try {
          localStorage.setItem(AUTH_STORAGE_KEY, "authenticated_drdalia89is");
        } catch {
          // ignore
        }
        setIsAuthenticated(true);
      } else {
        setErrorMessage("اسم المستخدم أو كلمة المرور غير صحيحة");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = () => {
    setUsername(DASHBOARD_USERNAME);
    setPassword(DASHBOARD_PASSWORD);
    setErrorMessage("");
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      await fetch("/api/dashboard/auth", { method: "DELETE" });
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  if (checkingAuth) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-[#E8F4FB] text-[#06446F] flex items-center justify-center font-tajawal"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl border-4 border-[#06446F]/20 border-t-[#06446F] animate-spin" />
          <p className="text-[#06446F] text-sm font-bold">جاري تحميل لوحة التحكم</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // CLINIC STYLE LOGIN SCREEN (Matches Landing Page: Baby Blue & Navy)
  // No dashes, no periods, doctor-friendly, ultra mobile-first
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-[#E8F4FB] flex items-center justify-center p-4 sm:p-6 font-tajawal relative overflow-hidden"
      >
        {/* Soft cheerful background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#A3DBE4]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#1575B5]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white rounded-3xl sm:rounded-[2rem] border border-sky-100 shadow-xl p-6 sm:p-9 relative">
            {/* Top brand line */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#06446F] via-[#1575B5] to-[#A3DBE4] rounded-t-3xl" />

            {/* Clinic Logo Header */}
            <div className="flex flex-col items-center text-center mb-6 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#06446F] to-[#1575B5] flex items-center justify-center text-white shadow-lg shadow-[#06446F]/25 mb-3.5">
                <ClinicToothIcon className="w-9 h-9" />
              </div>

              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E8F4FB] text-[#06446F] text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#1575B5]" />
                لوحة إدارة العيادة الرسمية
              </span>

              <h1 className="text-xl sm:text-2xl font-black text-[#06446F]">
                عيادة دكتورة داليا عبد الموجود زريع
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                تسجيل الدخول لمتابعة زوار الموقع وإدارة المقالات الطبية
              </p>
            </div>

            {/* Quick Fill Helper */}
            <div className="mb-5 p-3.5 rounded-2xl bg-[#E8F4FB] border border-sky-200/80 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#06446F] flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  بيانات الدخول المعتمدة
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5 truncate" dir="ltr">
                  <span className="font-bold text-[#06446F]">{DASHBOARD_USERNAME}</span> / <span className="font-bold text-[#06446F]">{DASHBOARD_PASSWORD}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleQuickFill}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 text-[#06446F] text-xs font-bold transition-all shadow-xs border border-sky-200 active:scale-95 cursor-pointer"
              >
                تعبئة سريعة
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-bold text-center">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  اسم المستخدم
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="drdalia89is"
                    autoComplete="username"
                    className="w-full pr-11 pl-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:border-[#1575B5] focus:ring-2 focus:ring-[#1575B5]/20 outline-none transition-all"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full pr-11 pl-11 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:bg-white focus:border-[#1575B5] focus:ring-2 focus:ring-[#1575B5]/20 outline-none transition-all"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    aria-label="إظهار أو إخفاء كلمة المرور"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#06446F] to-[#1575B5] hover:from-[#05385c] hover:to-[#116298] text-white font-black text-sm sm:text-base shadow-md shadow-[#06446F]/20 active:scale-98 transition-all disabled:opacity-60 cursor-pointer mt-2"
              >
                {submitting ? "جاري الدخول" : "تسجيل الدخول إلى لوحة التحكم"}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <Link
                href="/ar"
                className="inline-flex items-center gap-1.5 text-[#1575B5] hover:underline font-bold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                العودة للموقع الرئيسي
              </Link>
              <span className="font-medium text-slate-400">بوابة آمنة ومحمية</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // CLINIC AUTHENTICATED DASHBOARD (Landing Page Style: Pure White & Baby Blue)
  // Strictly 2 Pages: 1. Overview (نظرة عامة) | 2. Articles (إدارة المقالات)
  // =========================================================================
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#E8F4FB] text-[#1e293b] font-tajawal flex flex-col lg:flex-row antialiased"
    >
      {/* ------------------------------------------------------------------- */}
      {/* MOBILE STICKY TOPBAR (< lg) */}
      {/* ------------------------------------------------------------------- */}
      <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#06446F] to-[#1575B5] flex items-center justify-center text-white shadow-xs shrink-0">
            <ClinicToothIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="font-black text-sm text-[#06446F] truncate">
              دكتورة داليا زريع
            </h1>
            <p className="text-[10px] text-slate-500 font-bold truncate">
              لوحة التحكم وإدارة العيادة
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/ar"
            target="_blank"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="معاينة الموقع"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------------- */}
      {/* DESKTOP SIDEBAR (>= lg) */}
      {/* ------------------------------------------------------------------- */}
      <aside className="hidden lg:flex w-72 bg-white min-h-screen flex-col justify-between shrink-0 border-l border-sky-100 sticky top-0 h-screen overflow-y-auto shadow-sm">
        <div>
          {/* Clinic Brand Box */}
          <div className="p-6 border-b border-sky-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#06446F] to-[#1575B5] flex items-center justify-center text-white shadow-md shadow-[#06446F]/20 shrink-0">
                <ClinicToothIcon className="w-7 h-7" />
              </div>
              <div className="min-w-0">
                <h1 className="font-black text-base text-[#06446F] leading-tight truncate">
                  دكتورة داليا زريع
                </h1>
                <p className="text-xs text-[#1575B5] font-bold mt-0.5 truncate">
                  استشاري طب وجراحة الأسنان
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Items (ONLY 2 PAGES) */}
          <div className="p-4 space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
              صفحات لوحة التحكم
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-right font-bold text-sm transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-[#06446F] text-white shadow-md shadow-[#06446F]/25"
                  : "text-slate-600 hover:bg-[#E8F4FB] hover:text-[#06446F]"
              }`}
            >
              <BarChart3 className="w-5 h-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="leading-tight">نظرة عامة</div>
                <div
                  className={`text-[11px] font-normal mt-0.5 truncate ${
                    activeTab === "overview" ? "text-sky-100" : "text-slate-400"
                  }`}
                >
                  الزيارات والمسودات
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("articles")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-right font-bold text-sm transition-all cursor-pointer ${
                activeTab === "articles"
                  ? "bg-[#06446F] text-white shadow-md shadow-[#06446F]/25"
                  : "text-slate-600 hover:bg-[#E8F4FB] hover:text-[#06446F]"
              }`}
            >
              <FileText className="w-5 h-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="leading-tight">المقالات</div>
                <div
                  className={`text-[11px] font-normal mt-0.5 truncate ${
                    activeTab === "articles" ? "text-sky-100" : "text-slate-400"
                  }`}
                >
                  النشر والكتابة بالذكاء الاصطناعي
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Desktop Sidebar Bottom */}
        <div className="p-4 border-t border-sky-100 space-y-2.5">
          <Link
            href="/ar"
            target="_blank"
            className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[#E8F4FB] hover:bg-[#d6ecf9] text-[#06446F] text-xs font-bold transition-colors"
          >
            <span>زيارة الموقع الرئيسي</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#1575B5]" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA (Clean Landing Page Style) */}
      {/* ------------------------------------------------------------------- */}
      <main className="flex-1 min-w-0 p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-28 lg:pb-8">
        {/* Page Title */}
        <div className="mb-4 sm:mb-5 px-1">
          <h2 className="text-lg sm:text-2xl font-black text-[#06446F]">
            {activeTab === "overview" ? "نظرة عامة" : "المقالات"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {activeTab === "overview"
              ? "الزيارات والمقالات التي تنتظر موافقتك"
              : "نشر وإخفاء وحذف المقالات، وكتابة مقالات جديدة بالذكاء الاصطناعي"}
          </p>
        </div>

        {/* Render Tab */}
        {activeTab === "overview" ? (
          <OverviewTab />
        ) : (
          <ArticlesManagerTab />
        )}
      </main>

      {/* ------------------------------------------------------------------- */}
      {/* MOBILE BOTTOM DOCK (< lg) */}
      {/* ------------------------------------------------------------------- */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-sky-100 px-3 py-2 shadow-xl safe-area-bottom">
        <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-bold text-xs transition-all ${
              activeTab === "overview"
                ? "bg-[#06446F] text-white shadow-md shadow-[#06446F]/25"
                : "text-slate-600 hover:text-[#06446F] hover:bg-sky-50"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>نظرة عامة</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("articles")}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-bold text-xs transition-all ${
              activeTab === "articles"
                ? "bg-[#06446F] text-white shadow-md shadow-[#06446F]/25"
                : "text-slate-600 hover:text-[#06446F] hover:bg-sky-50"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>المقالات</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
