import { NextRequest, NextResponse } from "next/server";
import { uploadMediaToSupabase } from "@/lib/supabase/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json(
        { success: false, error: "لم يتم اختيار ملف | No file provided" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const publicUrl = await uploadMediaToSupabase(
      buffer,
      file.name || "image.jpg",
      file.type || "image/jpeg"
    );

    return NextResponse.json({
      success: true,
      url: publicUrl,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
