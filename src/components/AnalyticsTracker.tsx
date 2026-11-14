"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const VISITOR_KEY = "dr_dalia_visitor_id";
const SESSION_KEY = "dr_dalia_session_id";

export function getOrCreateVisitorId(): string {
  try {
    let vid = localStorage.getItem(VISITOR_KEY);
    if (!vid) {
      vid = `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem(VISITOR_KEY, vid);
    }
    return vid;
  } catch {
    return `v_${Date.now().toString(36)}`;
  }
}

export function getOrCreateSessionId(): string {
  try {
    let sid = sessionStorage.getItem(SESSION_KEY);
    if (!sid) {
      sid = `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return "";
  }
}

export function detectDevice(): "Desktop" | "Mobile" | "Tablet" {
  if (typeof navigator === "undefined") return "Mobile";
  const ua = navigator.userAgent || "";
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "Tablet";
  if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/i.test(
      ua
    )
  ) {
    return "Mobile";
  }
  return "Desktop";
}

export function trackWhatsAppConversion(pagePath?: string) {
  try {
    const visitor_id = getOrCreateVisitorId();
    const session_id = getOrCreateSessionId();
    const device = detectDevice();
    const path = pagePath || (typeof window !== "undefined" ? window.location.pathname : "/ar");

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitor_id,
        session_id,
        path,
        page_title: "حجز موعد عبر الواتساب",
        referrer: typeof document !== "undefined" ? document.referrer || "Direct" : "Direct",
        device,
        language: path.startsWith("/en") ? "en" : "ar",
        event_type: "whatsapp_click",
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // ignore
  }
}

export default function AnalyticsTracker({
  articleSlug,
}: {
  articleSlug?: string;
}) {
  const pathname = usePathname();
  const trackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/dashboard")) return;

    // Prevent duplicate firing on same pathname in same component lifecycle
    const trackerKey = `${pathname}:${articleSlug || ""}`;
    if (trackedPathRef.current === trackerKey) return;
    trackedPathRef.current = trackerKey;

    const timer = setTimeout(() => {
      const visitor_id = getOrCreateVisitorId();
      const session_id = getOrCreateSessionId();
      const referrer =
        typeof document !== "undefined" && document.referrer
          ? document.referrer
          : "Direct";
      const page_title =
        typeof document !== "undefined" ? document.title : pathname;
      const device = detectDevice();
      const language = pathname.startsWith("/en") ? "en" : "ar";

      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitor_id,
          session_id,
          path: pathname,
          page_title,
          referrer,
          device,
          language,
          article_slug: articleSlug || null,
          event_type: articleSlug ? "article_view" : "pageview",
        }),
      }).catch(() => {});
    }, 450);

    return () => clearTimeout(timer);
  }, [pathname, articleSlug]);

  // Global listener for clicks on WhatsApp booking links
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const anchor = target.closest("a");
      if (
        anchor &&
        anchor.href &&
        (anchor.href.includes("wa.me") ||
          anchor.href.includes("whatsapp.com") ||
          anchor.getAttribute("data-analytics") === "whatsapp")
      ) {
        trackWhatsAppConversion(pathname);
      }
    };

    document.addEventListener("click", handleDocumentClick, { passive: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [pathname]);

  return null;
}
