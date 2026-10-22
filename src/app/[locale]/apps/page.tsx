import { setRequestLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import AppsList, { type AppRow } from "@/components/AppsList";
import { getAllApps } from "@/lib/apps/loader";
import { getCategoryBySlug } from "@/lib/apps/categories";
import { alternatesFor, localeUrl } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "apps" });
  return {
    title: t("listTitle"),
    description: t("listSubtitle"),
    alternates: alternatesFor(locale, "/apps"),
    openGraph: {
      title: t("listTitle"),
      description: t("listSubtitle"),
      url: localeUrl(locale, "/apps"),
    },
  };
}

export default async function AppsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("apps");
  const apps = getAllApps();
  const isBg = locale === "bg";
  const rows: AppRow[] = apps.map((app) => {
    const category = getCategoryBySlug(app.category);
    return {
      slug: app.slug,
      name: app.name,
      tagline: (isBg && app.taglineBg) || app.taglineEn,
      category: app.category,
      categoryLabel: category ? (isBg ? category.labelBg : category.labelEn) : app.category,
    };
  });

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-[#1a1a1a] font-sans">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16 sm:px-16">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl tracking-tight text-black dark:text-zinc-50">
            {t("listTitle")}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-300">
            {t("listSubtitle")}
          </p>
        </div>

        <Suspense>
          <AppsList apps={rows} />
        </Suspense>
      </main>
    </div>
  );
}
