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
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
} from "lucide-react";
import OverviewTab from "./OverviewTab";
import ArticlesManagerTab from "./ArticlesManagerTab";
import {
  DASHBOARD_USERNAME,
  DASHBOARD_PASSWORD,
} from "@/lib/supabase/config";

const AUTH_STORAGE_KEY = "dr_dalia_dashboard_auth_v1";

type DashboardTab = "overview" | "articles";

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

      // Direct verification fallback
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
        className="min-h-screen bg-[#070B14] text-white flex items-center justify-center font-tajawal"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl border-2 border-sky-500/20 border-t-sky-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
            </div>
          </div>
          <p className="text-slate-400 text-sm font-medium">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // LUXURY CLINICAL LOGIN SCREEN (Mobile-Optimized & Ultra-Modern)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-[#070B14] text-white flex items-center justify-center p-4 sm:p-6 font-tajawal relative overflow-hidden select-none"
      >
        {/* Dynamic ambient backdrop glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-sky-500/15 via-blue-600/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-gradient-to-tr from-cyan-500/10 via-emerald-500/5 to-transparent rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Glass Card */}
          <div className="bg-[#0F172A]/80 backdrop-blur-2xl rounded-3xl sm:rounded-[2rem] border border-slate-700/60 shadow-2xl shadow-black/60 p-6 sm:p-9 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-600" />

            {/* Brand Header */}
            <div className="flex flex-col items-center text-center mb-7">
              <div className="relative mb-3.5 group">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 opacity-60 blur-md group-hover:opacity-100 transition duration-500" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-xl">
                  <svg
                    viewBox="0 0 64 64"
                    className="w-9 h-9 text-white"
                    fill="currentColor"
                  >
                    <path d="M21.5 10C14.5 10 10 15.5 10 23c0 5.6 2.3 11 4.1 16.1 1.7 4.8 3.2 11.4 5.7 13.9 1.9 1.9 4.3 1.2 5.4-1.3 1.1-2.5 2.3-7.7 4.6-7.7h4.4c2.3 0 3.5 5.2 4.6 7.7 1.1 2.5 3.5 3.2 5.4 1.3 2.5-2.5 4-9.1 5.7-13.9C51.7 34 54 28.6 54 23c0-7.5-4.5-13-11.5-13-4.2 0-7.3 2.2-10.5 2.2S25.7 10 21.5 10z" />
                  </svg>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>لوحة التحكم وإدارة المحتوى</span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                عيادة د. داليا عبد الموجود زريع
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs">
                إدارة المقالات الطبية، التقارير الحقيقية، والربط الذكي مع الـ MCP
              </p>
            </div>

            {/* Quick Fill Credentials Banner (Mobile friendly 1-tap) */}
            <div className="mb-6 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-sky-950/40 via-slate-900/60 to-slate-900/40 border border-sky-500/30 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-sky-300 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                  بيانات تسجيل الدخول المعتمدة:
                </div>
                <div className="text-[11px] text-slate-300 font-mono mt-0.5 truncate" dir="ltr">
                  User: <span className="text-sky-400 font-bold">{DASHBOARD_USERNAME}</span> • Pass: <span className="text-sky-400 font-bold">{DASHBOARD_PASSWORD}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleQuickFill}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 hover:text-white text-xs font-bold transition-all border border-sky-500/30 active:scale-95 cursor-pointer"
              >
                تعبئة سريعة
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs sm:text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
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
                    className="w-full pr-11 pl-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
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
                    className="w-full pr-11 pl-11 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
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
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-400 hover:to-blue-500 active:scale-[0.98] text-white font-extrabold text-sm sm:text-base shadow-lg shadow-sky-500/25 transition-all disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>جاري التحقق من الدخول...</span>
                  </>
                ) : (
                  <>
                    <span>تسجيل الدخول إلى لوحة التحكم</span>
                    <Sparkles className="w-4 h-4 text-sky-200" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <Link
                href="/ar"
                className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-medium transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                معاينة الموقع
              </Link>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Supabase Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED DASHBOARD (Ultra Mobile-Friendly: Bottom Dock + Sticky Topbar)
  // Strictly TWO PAGES: 1. Overview (نظرة عامة) | 2. Articles (إدارة المقالات)
  // =========================================================================
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#F8FAFC] text-slate-900 font-tajawal flex flex-col lg:flex-row antialiased"
    >
      {/* ------------------------------------------------------------------- */}
      {/* MOBILE STICKY TOPBAR (<lg) */}
      {/* ------------------------------------------------------------------- */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#0B1120] text-white border-b border-slate-800/80 px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 shrink-0">
            <svg viewBox="0 0 64 64" className="w-5 h-5" fill="currentColor">
              <path d="M21.5 10C14.5 10 10 15.5 10 23c0 5.6 2.3 11 4.1 16.1 1.7 4.8 3.2 11.4 5.7 13.9 1.9 1.9 4.3 1.2 5.4-1.3 1.1-2.5 2.3-7.7 4.6-7.7h4.4c2.3 0 3.5 5.2 4.6 7.7 1.1 2.5 3.5 3.2 5.4 1.3 2.5-2.5 4-9.1 5.7-13.9C51.7 34 54 28.6 54 23c0-7.5-4.5-13-11.5-13-4.2 0-7.3 2.2-10.5 2.2S25.7 10 21.5 10z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="font-extrabold text-sm text-white leading-tight truncate">
              د. داليا عبد الموجود زريع
            </h1>
            <div className="flex items-center gap-1.5 text-[10px] text-sky-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>لوحة التحكم الذكية</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/ar"
            target="_blank"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white transition-colors"
            title="معاينة الموقع"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 hover:text-red-200 transition-colors"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ------------------------------------------------------------------- */}
      {/* DESKTOP SIDEBAR (>=lg) */}
      {/* ------------------------------------------------------------------- */}
      <aside className="hidden lg:flex w-72 bg-[#0B1120] text-white min-h-screen flex-col justify-between shrink-0 border-l border-slate-800/80 sticky top-0 h-screen overflow-y-auto">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800/80">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 shrink-0">
                <svg viewBox="0 0 64 64" className="w-7 h-7" fill="currentColor">
                  <path d="M21.5 10C14.5 10 10 15.5 10 23c0 5.6 2.3 11 4.1 16.1 1.7 4.8 3.2 11.4 5.7 13.9 1.9 1.9 4.3 1.2 5.4-1.3 1.1-2.5 2.3-7.7 4.6-7.7h4.4c2.3 0 3.5 5.2 4.6 7.7 1.1 2.5 3.5 3.2 5.4 1.3 2.5-2.5 4-9.1 5.7-13.9C51.7 34 54 28.6 54 23c0-7.5-4.5-13-11.5-13-4.2 0-7.3 2.2-10.5 2.2S25.7 10 21.5 10z" />
                </svg>
              </div>
              <div className="min-w-0">
                <h1 className="font-black text-base text-white leading-tight truncate">
                  د. داليا عبد الموجود
                </h1>
                <p className="text-xs text-sky-400 font-medium mt-0.5 truncate">
                  استشاري طب وجراحة الأسنان
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Items (STRICTLY 2 PAGES) */}
          <div className="p-4 space-y-1">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-2">
              القائمة الرئيسية (صفحتان فقط)
            </div>

            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-right font-bold text-sm transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
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
                  تقرير الزوار الحقيقي ومصادرهم
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("articles")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-right font-bold text-sm transition-all cursor-pointer ${
                activeTab === "articles"
                  ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
              }`}
            >
              <FileText className="w-5 h-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="leading-tight">إدارة المقالات</div>
                <div
                  className={`text-[11px] font-normal mt-0.5 truncate ${
                    activeTab === "articles" ? "text-sky-100" : "text-slate-400"
                  }`}
                >
                  إضافة، تعديل، حذف، SEO والـ MCP
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Desktop Bottom Box */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Supabase Live
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono">
                Real-Time
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
              المشروع: <span className="text-slate-200">dr dalia</span>
              <br />
              المستخدم: <span className="text-slate-200">drdalia89is</span>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/ar"
              target="_blank"
              className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-colors"
            >
              <span>معاينة الموقع الحي</span>
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </aside>

      {/* ------------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA */}
      {/* ------------------------------------------------------------------- */}
      <main className="flex-1 min-w-0 p-3.5 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-28 lg:pb-8">
        {/* Top contextual header card */}
        <div className="mb-5 sm:mb-6 flex flex-wrap items-center justify-between gap-3 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <h2 className="text-base sm:text-xl font-black text-slate-900 truncate">
                {activeTab === "overview"
                  ? "نظرة عامة — تقرير أداء الموقع والزيارات الحقيقية"
                  : "إدارة المقالات — نظام النشر الطبي والـ MCP"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 truncate">
              {activeTab === "overview"
                ? "إحصائيات حقيقية مباشرة ومسجلة من زوار الموقع في Supabase"
                : "تحكم كامل في المقالات الطبية، صور السحابة، محركات البحث (SEO)، والـ AI Agent"}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeTab === "overview" ? (
              <button
                type="button"
                onClick={() => setActiveTab("articles")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <FileText className="w-4 h-4" />
                <span>إدارة المقالات</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-95"
              >
                <BarChart3 className="w-4 h-4" />
                <span>تقرير الزوار</span>
              </button>
            )}
          </div>
        </div>

        {/* Render Tab Content */}
        {activeTab === "overview" ? <OverviewTab /> : <ArticlesManagerTab />}
      </main>

      {/* ------------------------------------------------------------------- */}
      {/* MOBILE BOTTOM DOCK (FIXED APP-LIKE DOCK <lg) */}
      {/* ------------------------------------------------------------------- */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0B1120]/95 backdrop-blur-xl border-t border-slate-800/90 px-3 py-2 shadow-2xl safe-area-bottom">
        <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-bold text-xs transition-all ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
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
                ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/25"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>إدارة المقالات</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
