import { redirect } from "next/navigation";

export default async function LangPostSlugRedirect({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  redirect(`/${lang === "en" ? "en" : "ar"}/articles/${slug}`);
}
