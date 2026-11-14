import { redirect } from "next/navigation";

export default async function LangPostsRedirect({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  redirect(`/${lang === "en" ? "en" : "ar"}/articles`);
}
