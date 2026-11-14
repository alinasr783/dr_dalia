"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const VISITOR_KEY = "dr_dalia_visitor_id";
const SESSION_KEY = "dr_dalia_session_id";

function getOrCreateVisitorId(): string {
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

function getOrCreateSessionId(): string {
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

function detectDevice(): "Desktop" | "Mobile" | "Tablet" {
  if (typeof navigator === "undefined") return "Mobile";
  const ua = navigator.userAgent || "";
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "Tablet";
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/i.test(ua)) {
    return "Mobile";
  }
  return "Desktop";
}

export default function AnalyticsTracker({
  articleSlug,
}: {
  articleSlug?: string;
}) {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/dashboard")) return;

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
    }, 600);

    return () => clearTimeout(timer);
  }, [pathname, articleSlug]);

  return null;
}
