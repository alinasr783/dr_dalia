import { NextRequest, NextResponse } from "next/server";
import { listPosts, createPost, getCategories } from "@/lib/supabase/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || searchParams.get("query") || undefined;
    const statusParam = searchParams.get("status");
    const status =
      statusParam === "published" || statusParam === "draft" || statusParam === "all"
        ? statusParam
        : "all";
    const category = searchParams.get("category") || undefined;
    const featuredParam = searchParams.get("featured");
    const featured =
      featuredParam === "true" ? true : featuredParam === "false" ? false : undefined;
    const homepageParam = searchParams.get("homepage");
    const show_on_homepage =
      homepageParam === "true" ? true : homepageParam === "false" ? false : undefined;
    const tag = searchParams.get("tag") || undefined;
    const limit = searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : undefined;
    const offset = searchParams.get("offset")
      ? Number(searchParams.get("offset"))
      : undefined;

    const [{ posts, total }, categories] = await Promise.all([
      listPosts({
        query,
        status,
        category,
        featured,
        show_on_homepage,
        tag,
        limit,
        offset,
      }),
      getCategories(),
    ]);

    return NextResponse.json({
      success: true,
      posts,
      total,
      categories,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch posts";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body?.title || !String(body.title).trim()) {
      return NextResponse.json(
        { success: false, error: "عنوان المقال مطلوب | Article title is required" },
        { status: 400 }
      );
    }
    const post = await createPost(body);
    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create post";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
