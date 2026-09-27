import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllApps } from "@/lib/apps/loader";
import { categories } from "@/lib/apps/categories";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const appCount = getAllApps().length;
  const categoryCount = categories.length;

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans">
      <section className="flex flex-col items-center justify-center gap-6 px-6 py-24 text-center sm:px-16 sm:py-32">
        <span className="rounded-full bg-accent/10 px-4 py-1 text-sm font-medium text-accent-hover">
          {t("eyebrow")}
        </span>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-black sm:text-5xl">
          {t("heading")}
        </h1>
        <p className="max-w-md text-lg leading-8 text-zinc-600">
          {t("subheading")}
        </p>
        <Link
          href="/apps"
          className="mt-4 flex h-12 items-center justify-center rounded-full bg-accent px-6 text-white font-medium transition-colors hover:bg-accent-hover"
        >
          {t("cta")}
        </Link>

        <dl className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          <div className="flex flex-col items-center">
            <dt className="text-3xl font-semibold tracking-tight text-accent">
              {appCount}
            </dt>
            <dd className="text-sm text-zinc-600">{t("statsApps")}</dd>
          </div>
          <div className="flex flex-col items-center">
            <dt className="text-3xl font-semibold tracking-tight text-accent">
              {categoryCount}
            </dt>
            <dd className="text-sm text-zinc-600">{t("statsCategories")}</dd>
          </div>
          <div className="flex flex-col items-center">
            <dt className="text-3xl font-semibold tracking-tight text-accent">
              2
            </dt>
            <dd className="text-sm text-zinc-600">{t("statsLanguages")}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
