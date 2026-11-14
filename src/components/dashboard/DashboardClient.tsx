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
      // ignore storage errors
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
        className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center font-tajawal"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl border-2 border-[#0EA5E9] border-t-transparent animate-spin" />
          <p className="text-slate-300 text-sm">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] flex items-center justify-center p-4 font-tajawal relative overflow-hidden"
      >
        {/* Decorative ambient glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#0EA5E9]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#0284C7]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-slate-100 p-8 sm:p-10 relative z-10">
          {/* Clinic Brand Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center shadow-lg shadow-[#0EA5E9]/30 mb-4">
              <svg
                viewBox="0 0 64 64"
                className="w-9 h-9 text-white"
                fill="currentColor"
              >
                <path d="M21.5 10C14.5 10 10 15.5 10 23c0 5.6 2.3 11 4.1 16.1 1.7 4.8 3.2 11.4 5.7 13.9 1.9 1.9 4.3 1.2 5.4-1.3 1.1-2.5 2.3-7.7 4.6-7.7h4.4c2.3 0 3.5 5.2 4.6 7.7 1.1 2.5 3.5 3.2 5.4 1.3 2.5-2.5 4-9.1 5.7-13.9C51.7 34 54 28.6 54 23c0-7.5-4.5-13-11.5-13-4.2 0-7.3 2.2-10.5 2.2S25.7 10 21.5 10z" />
              </svg>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#0284C7] text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              لوحة الإدارة الرسمية
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900">
              عيادة د. داليا عبد الموجود زريع
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              سجّل الدخول للوصول إلى تقارير الأداء وإدارة المقالات الطبية
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium text-center">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                اسم المستخدم
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="أدخل اسم المستخدم"
                  autoComplete="username"
                  className="w-full pr-11 pl-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20 outline-none transition-all"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pr-11 pl-11 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:bg-white focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20 outline-none transition-all"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] hover:from-[#0284C7] hover:to-[#0369A1] text-white font-bold text-sm shadow-lg shadow-[#0EA5E9]/25 transition-all disabled:opacity-60 cursor-pointer"
            >
              {submitting ? "جاري التحقق..." : "تسجيل الدخول إلى لوحة التحكم"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link
              href="/ar"
              className="inline-flex items-center gap-1.5 text-[#0284C7] hover:underline font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              العودة للموقع الرئيسي
            </Link>
            <span>Supabase Cloud Connected</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#F8FAFC] text-slate-900 font-tajawal flex flex-col lg:flex-row"
    >
      {/* Sidebar (Desktop) & Topbar (Mobile) */}
      <aside className="w-full lg:w-72 bg-[#0F172A] text-white lg:min-h-screen flex flex-col justify-between shrink-0 border-b lg:border-b-0 lg:border-l border-slate-800">
        <div>
          {/* Brand Logo */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between lg:block">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] flex items-center justify-center shadow-lg shadow-[#0EA5E9]/25 shrink-0">
                <svg
                  viewBox="0 0 64 64"
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                >
                  <path d="M21.5 10C14.5 10 10 15.5 10 23c0 5.6 2.3 11 4.1 16.1 1.7 4.8 3.2 11.4 5.7 13.9 1.9 1.9 4.3 1.2 5.4-1.3 1.1-2.5 2.3-7.7 4.6-7.7h4.4c2.3 0 3.5 5.2 4.6 7.7 1.1 2.5 3.5 3.2 5.4 1.3 2.5-2.5 4-9.1 5.7-13.9C51.7 34 54 28.6 54 23c0-7.5-4.5-13-11.5-13-4.2 0-7.3 2.2-10.5 2.2S25.7 10 21.5 10z" />
                </svg>
              </div>
              <div>
                <h1 className="font-extrabold text-base text-white leading-tight">
                  د. داليا زريع
                </h1>
                <p className="text-xs text-sky-400 font-medium mt-0.5">
                  لوحة إدارة العيادة والمحتوى
                </p>
              </div>
            </div>

            {/* Mobile Quick Logout */}
            <button
              onClick={handleLogout}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-red-500/20 text-slate-300 hover:text-red-300 text-xs font-bold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              خروج
            </button>
          </div>

          {/* ONLY TWO PAGES NAVIGATION */}
          <div className="p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2.5">
              القائمة الرئيسية (صفحتان فقط)
            </div>
            <nav className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-right font-bold text-sm transition-all cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white shadow-lg shadow-[#0EA5E9]/25"
                    : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                }`}
              >
                <BarChart3 className="w-5 h-5 shrink-0" />
                <div>
                  <div className="leading-none">نظرة عامة</div>
                  <div
                    className={`text-[11px] font-normal mt-1 hidden sm:block ${
                      activeTab === "overview"
                        ? "text-sky-100"
                        : "text-slate-400"
                    }`}
                  >
                    تقارير الزوار ومصادرهم والـ Timeline
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("articles")}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-right font-bold text-sm transition-all cursor-pointer ${
                  activeTab === "articles"
                    ? "bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] text-white shadow-lg shadow-[#0EA5E9]/25"
                    : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                }`}
              >
                <FileText className="w-5 h-5 shrink-0" />
                <div>
                  <div className="leading-none">إدارة المقالات</div>
                  <div
                    className={`text-[11px] font-normal mt-1 hidden sm:block ${
                      activeTab === "articles"
                        ? "text-sky-100"
                        : "text-slate-400"
                    }`}
                  >
                    إضافة، تعديل، حذف، SEO والـ MCP
                  </div>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom Info & Links (Desktop) */}
        <div className="hidden lg:block p-4 border-t border-slate-800/80 space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              متصل بـ Supabase & MCP
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              المشروع: <span className="text-slate-200 font-mono">dr dalia</span>
              <br />
              المستخدم النشط:{" "}
              <span className="text-slate-200 font-mono">drdalia89is</span>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/ar/articles"
              target="_blank"
              className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-colors"
            >
              <span>معاينة صفحة المقالات</span>
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
            </Link>
            <Link
              href="/ar"
              target="_blank"
              className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-colors"
            >
              <span>الموقع الرئيسي</span>
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

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Top contextual bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-white rounded-2xl p-4 sm:px-6 border border-slate-200/80 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                {activeTab === "overview"
                  ? "نظرة عامة — تقرير أداء الموقع والزيارات"
                  : "إدارة المقالات — نظام النشر المتقدم والـ MCP"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {activeTab === "overview"
                ? "إحصائيات الزوار، مصادر الزيارات، الخط الزمني (Timeline)، وأكثر المقالات والصفحات قراءة"
                : "تحكم كامل في المقالات (إضافة، تعديل، حذف، SEO، الأسئلة الشائعة، وربط الـ AI Agent عبر MCP)"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === "overview" ? (
              <button
                type="button"
                onClick={() => setActiveTab("articles")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs sm:text-sm font-bold shadow-sm transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                إدارة المقالات
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                <BarChart3 className="w-4 h-4" />
                عرض تقرير الزوار
              </button>
            )}
          </div>
        </div>

        {/* Active Tab Content */}
        {activeTab === "overview" ? <OverviewTab /> : <ArticlesManagerTab />}
      </main>
    </div>
  );
}
