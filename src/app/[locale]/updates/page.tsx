import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllWeeklyNotes } from "@/lib/weekly";
import { alternatesFor, localeUrl } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "updates" });
  return {
    title: t("listTitle"),
    description: t("listSubtitle"),
    alternates: alternatesFor(locale, "/updates"),
    openGraph: {
      title: t("listTitle"),
      description: t("listSubtitle"),
      url: localeUrl(locale, "/updates"),
    },
  };
}

export default async function UpdatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("updates");
  const isBg = locale === "bg";
  const notes = getAllWeeklyNotes();

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
        <ul className="flex flex-col gap-4">
          {notes.map((note) => (
            <li key={note.slug}>
              <Link
                href={`/updates/${note.slug}`}
                className="flex flex-col gap-2 rounded-xl border border-black/[.08] bg-white p-6 transition-colors hover:border-accent/40 dark:border-white/[.12] dark:bg-[#20242a]"
              >
                <time
                  className="text-sm text-zinc-500 dark:text-zinc-400"
                  dateTime={note.date}
                >
                  {note.date}
                </time>
                <h2 className="text-xl font-medium text-black dark:text-zinc-50">
                  {isBg ? note.titleBg : note.titleEn}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-300">
                  {isBg ? note.summaryBg : note.summaryEn}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
