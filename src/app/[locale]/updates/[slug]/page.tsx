import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getAppBySlug } from "@/lib/apps/loader";
import { getAllWeeklyNotes, getWeeklyNote } from "@/lib/weekly";
import AppCard from "@/components/AppCard";
import { SITE_URL, alternatesFor, localeUrl } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllWeeklyNotes().map((note) => ({ locale, slug: note.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const note = getWeeklyNote(slug);
  if (!note) return {};
  const isBg = locale === "bg";
  const title = `${isBg ? note.titleBg : note.titleEn} — HomelabDeck`;
  const description = isBg ? note.summaryBg : note.summaryEn;

  return {
    title,
    description,
    alternates: alternatesFor(locale, `/updates/${slug}`),
    openGraph: {
      type: "article",
      title,
      description,
      url: localeUrl(locale, `/updates/${slug}`),
      publishedTime: note.date,
    },
  };
}

export default async function UpdateDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const note = getWeeklyNote(slug);
  if (!note) {
    notFound();
  }

  const t = await getTranslations("updates");
  const isBg = locale === "bg";
  const title = isBg ? note.titleBg : note.titleEn;
  const paragraphs = isBg ? note.bodyBg : note.bodyEn;
  const apps = note.apps.flatMap((s) => getAppBySlug(s) ?? []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: isBg ? note.summaryBg : note.summaryEn,
    datePublished: note.date,
    inLanguage: locale,
    url: localeUrl(locale, `/updates/${slug}`),
    publisher: { "@type": "Organization", name: "HomelabDeck", url: SITE_URL },
  };

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16 sm:px-16">
        <Link
          href="/updates"
          className="text-sm font-medium text-accent transition-colors hover:text-accent-hover"
        >
          ← {t("back")}
        </Link>
        <article className="flex flex-col gap-4">
          <time
            className="text-sm text-zinc-500 dark:text-zinc-400"
            dateTime={note.date}
          >
            {note.date}
          </time>
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {title}
          </h1>
          {paragraphs.map((p, i) => (
            <p key={i} className="text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              {p}
            </p>
          ))}
        </article>
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
            {t("addedApps")}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {apps.map((app) => (
              <li key={app.slug}>
                <AppCard app={app} locale={locale} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
