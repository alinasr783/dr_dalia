import { redirect } from "next/navigation";

export default async function RootArticleSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/ar/articles/${slug}`);
}
