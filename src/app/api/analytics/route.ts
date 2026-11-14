import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsReport, recordAnalyticsEvent } from "@/lib/supabase/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = Number(searchParams.get("days") || 14);
    const report = await getAnalyticsReport(
      Number.isFinite(days) && days > 0 ? days : 14
    );
    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load analytics";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = await recordAnalyticsEvent(body);
    return NextResponse.json({
      success: true,
      event,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to record event";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
