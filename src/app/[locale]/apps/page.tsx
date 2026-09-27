import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllApps } from "@/lib/apps/loader";
import { getCategoryBySlug } from "@/lib/apps/categories";

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

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16 sm:px-16">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {t("listTitle")}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {t("listSubtitle")}
          </p>
        </div>

        <ul className="flex flex-col gap-4">
          {apps.map((app) => {
            const category = getCategoryBySlug(app.category);
            const tagline = isBg ? app.taglineBg : app.taglineEn;
            const categoryLabel = category
              ? isBg
                ? category.labelBg
                : category.labelEn
              : app.category;

            return (
              <li key={app.slug}>
                <Link
                  href={`/apps/${app.slug}`}
                  className="flex flex-col gap-1 rounded-xl border border-black/[.08] bg-white p-6 transition-colors hover:border-black/[.16] dark:border-white/[.145] dark:bg-[#111] dark:hover:border-white/[.25]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-medium text-black dark:text-zinc-50">
                      {app.name}
                    </h2>
                    <span className="rounded-full bg-black/[.06] px-3 py-1 text-sm text-zinc-700 dark:bg-white/[.08] dark:text-zinc-300">
                      {categoryLabel}
                    </span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {tagline}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
