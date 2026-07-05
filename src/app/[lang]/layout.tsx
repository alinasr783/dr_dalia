type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function LangLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  const isRtl = lang === "ar";

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className={isRtl ? "font-tajawal" : "font-jua"}>
      {children}
    </div>
  );
}
