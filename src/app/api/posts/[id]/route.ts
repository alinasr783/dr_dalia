import { NextRequest, NextResponse } from "next/server";
import {
  getPostByIdOrSlug,
  updatePost,
  deletePost,
  incrementPostViews,
} from "@/lib/supabase/db";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(req.url);
    const post = await getPostByIdOrSlug(id);
    if (!post) {
      return NextResponse.json(
        { success: false, error: "المقال غير موجود | Article not found" },
        { status: 404 }
      );
    }
    if (searchParams.get("trackView") === "1") {
      await incrementPostViews(post.id);
    }
    return NextResponse.json({ success: true, post });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to get post";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const updated = await updatePost(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "المقال غير موجود | Article not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update post";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  return PUT(req, context);
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await deletePost(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "المقال غير موجود | Article not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete post";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
