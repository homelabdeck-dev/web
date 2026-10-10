import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAppBySlug } from "@/lib/apps/loader";
import { getAllWeeklyNotes } from "@/lib/weekly";
import { getAllGuides } from "@/lib/guides";
import AppCard from "@/components/AppCard";
import { alternatesFor, localeUrl } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: alternatesFor(locale),
    openGraph: { url: localeUrl(locale) },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const isBg = locale === "bg";
  const notes = getAllWeeklyNotes();
  const guides = getAllGuides();

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-[#1a1a1a] font-sans">
      <section className="mx-auto flex w-full max-w-[1080px] flex-col items-center justify-center gap-6 px-6 pb-16 pt-10 text-center sm:px-16 sm:pb-20 sm:pt-14">
        <span className="rounded-full bg-accent/10 px-4 py-1 text-sm font-medium text-accent-hover">
          {t("eyebrow")}
        </span>
        <h1 className="max-w-[1080px] font-medium tracking-tight text-balance text-black dark:text-zinc-50 text-3xl sm:text-4xl md:text-5xl md:font-normal lg:text-6xl xl:text-7xl">
          {t("heading")}
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          {t("subheading")}
        </p>

        <form className="mt-6 flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            name="email"
            placeholder={t("subscribePlaceholder")}
            aria-label={t("subscribePlaceholder")}
            className="h-12 w-full shrink-0 rounded-full sm:flex-1 border border-black/[.08] bg-white px-5 text-black placeholder:text-zinc-500 focus:border-accent focus:outline-none dark:border-white/[.12] dark:bg-[#20242a] dark:text-zinc-50 dark:placeholder:text-zinc-400"
          />
          <button
            type="button"
            className="h-12 w-full rounded-full bg-accent sm:w-auto px-6 font-medium text-white transition-colors hover:bg-accent-hover"
          >
            {t("subscribeButton")}
          </button>
        </form>
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 pb-24 sm:px-16">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl tracking-tight text-black dark:text-zinc-50">
            {t("latestTitle")}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300">{t("latestSubtitle")}</p>
        </div>
        {notes.map((note) => (
          <article key={note.slug} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <time className="text-sm text-zinc-500 dark:text-zinc-400" dateTime={note.date}>
                {note.date}
              </time>
              <h3 className="text-xl font-medium text-black dark:text-zinc-50">
                {isBg ? note.titleBg : note.titleEn}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                {isBg ? note.summaryBg : note.summaryEn}
              </p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {note.apps.flatMap((slug) => getAppBySlug(slug) ?? []).map((app) => (
                <li key={app.slug}>
                  <AppCard app={app} locale={locale} />
                </li>
              ))}
            </ul>
            <Link
              href={`/updates/${note.slug}`}
              className="self-start text-sm font-medium text-accent transition-colors hover:text-accent-hover"
            >
              {t("latestReadMore")} →
            </Link>
          </article>
        ))}
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 pb-24 sm:px-16">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl tracking-tight text-black dark:text-zinc-50">
            {t("guidesTitle")}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-300">{t("guidesSubtitle")}</p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {guides.map((guide) => (
            <li key={guide.slug}>
              <Link
                href={`/guides/${guide.slug}`}
                className="flex h-full flex-col gap-2 rounded-xl border border-black/[.08] bg-white p-5 transition-colors hover:border-accent/40 dark:border-white/[.12] dark:bg-[#20242a]"
              >
                <h3 className="text-lg font-medium text-black dark:text-zinc-50">
                  {isBg ? guide.titleBg : guide.titleEn}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  {isBg ? guide.descriptionBg : guide.descriptionEn}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
