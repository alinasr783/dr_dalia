import { NextRequest, NextResponse } from "next/server";
import { DASHBOARD_ADMIN_USER, DASHBOARD_ADMIN_PASS } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

const COOKIE_NAME = "dr_dalia_admin_session";
const SESSION_TOKEN = "drdalia89is_authenticated_session_v1";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (token === SESSION_TOKEN) {
    return NextResponse.json({
      authenticated: true,
      user: {
        username: DASHBOARD_ADMIN_USER,
        name: "د. داليا عبد الموجود زارع",
        role: "مدير النظام",
      },
    });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = String(body?.username || "").trim();
    const password = String(body?.password || "");

    if (username === DASHBOARD_ADMIN_USER && password === DASHBOARD_ADMIN_PASS) {
      const res = NextResponse.json({
        success: true,
        authenticated: true,
        user: {
          username: DASHBOARD_ADMIN_USER,
          name: "د. داليا عبد الموجود زارع",
          role: "مدير النظام",
        },
      });
      res.cookies.set(COOKIE_NAME, SESSION_TOKEN, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      return res;
    }

    return NextResponse.json(
      {
        success: false,
        error: "اسم المستخدم أو كلمة المرور غير صحيحة | Invalid username or password",
      },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "خطأ في تسجيل الدخول" },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(COOKIE_NAME);
  return res;
}
