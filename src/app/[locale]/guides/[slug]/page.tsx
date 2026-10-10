import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getAppBySlug } from "@/lib/apps/loader";
import { getAllGuides, getGuide } from "@/lib/guides";
import { SITE_URL, alternatesFor, localeUrl } from "@/lib/seo";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllGuides().map((guide) => ({ locale, slug: guide.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  const isBg = locale === "bg";
  const title = `${isBg ? guide.titleBg : guide.titleEn} — HomelabDeck`;
  const description = isBg ? guide.descriptionBg : guide.descriptionEn;

  return {
    title,
    description,
    alternates: alternatesFor(locale, `/guides/${slug}`),
    openGraph: {
      type: "article",
      title,
      description,
      url: localeUrl(locale, `/guides/${slug}`),
      publishedTime: guide.date,
      ...(guide.image && {
        images: [{ url: guide.image, width: 1200, height: 630, alt: isBg ? guide.titleBg : guide.titleEn }],
      }),
    },
    ...(guide.image && { twitter: { card: "summary_large_image" as const } }),
  };
}

function formatRam(ramMb: number | undefined): string {
  if (!ramMb) return "—";
  return ramMb >= 1024 ? `~${ramMb / 1024} GB` : `~${ramMb} MB`;
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const guide = getGuide(slug);
  if (!guide) {
    notFound();
  }

  const t = await getTranslations("guides");
  const isBg = locale === "bg";
  const title = isBg ? guide.titleBg : guide.titleEn;
  const rows = guide.rows.flatMap((row) => {
    const app = getAppBySlug(row.app);
    return app ? [{ ...row, app }] : [];
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: isBg ? guide.descriptionBg : guide.descriptionEn,
    datePublished: guide.date,
    inLanguage: locale,
    url: localeUrl(locale, `/guides/${slug}`),
    publisher: { "@type": "Organization", name: "HomelabDeck", url: SITE_URL },
  };

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-[#1a1a1a] font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 py-16 sm:px-16">
        <Link
          href="/guides"
          className="text-sm font-medium text-accent transition-colors hover:text-accent-hover"
        >
          ← {t("back")}
        </Link>
        <article className="flex flex-col gap-4">
          <time className="text-sm text-zinc-500 dark:text-zinc-400" dateTime={guide.date}>
            {guide.date}
          </time>
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-4xl">
            {title}
          </h1>
          {(isBg ? guide.introBg : guide.introEn).map((p, i) => (
            <p key={i} className="text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              {p}
            </p>
          ))}
        </article>

        {rows.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
            {t("comparison")}
          </h2>
          <div className="overflow-x-auto rounded-xl border border-black/[.08] bg-white dark:border-white/[.12] dark:bg-[#20242a]">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-black/[.08] text-zinc-500 dark:border-white/[.12] dark:text-zinc-400">
                  <th className="px-4 py-3 font-medium">{t("colInstead")}</th>
                  <th className="px-4 py-3 font-medium">{t("colSelfHost")}</th>
                  <th className="px-4 py-3 font-medium">{t("colRam")}</th>
                  <th className="px-4 py-3 font-medium">{t("colLicense")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ insteadOf, app }) => (
                  <tr
                    key={app.slug}
                    className="border-b border-black/[.06] last:border-0 dark:border-white/[.08]"
                  >
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{insteadOf}</td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/apps/${app.slug}`}
                        className="font-medium text-black underline transition-colors hover:text-accent dark:text-zinc-50"
                      >
                        {app.name}
                      </Link>
                      <div className="text-zinc-500 dark:text-zinc-400">
                        {isBg ? app.taglineBg : app.taglineEn}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-zinc-700 dark:text-zinc-300">
                      {formatRam(app.compatibility.resourceFootprint.ramMb)}
                    </td>
                    <td className="px-4 py-3 text-zinc-700 dark:text-zinc-300">{app.license}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{t("ramNote")}</p>
        </section>
        )}

        {guide.sections.map((section) => {
          const items = isBg ? section.bg : section.en;
          const ListTag = section.kind === "steps" ? "ol" : "ul";
          return (
            <section key={section.headingEn} className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
                {isBg ? section.headingBg : section.headingEn}
              </h2>
              {section.kind === "text" ? (
                items.map((item, i) => (
                  <p key={i} className="text-lg leading-8 text-zinc-600 dark:text-zinc-300">
                    {item}
                  </p>
                ))
              ) : (
                <ListTag
                  className={`flex flex-col gap-2 pl-6 text-lg leading-8 text-zinc-600 dark:text-zinc-300 ${
                    section.kind === "steps" ? "list-decimal" : "list-disc"
                  }`}
                >
                  {items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ListTag>
              )}
            </section>
          );
        })}

        <section className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
          <Link href="/apps" className="text-accent transition-colors hover:text-accent-hover">
            {t("ctaApps")} →
          </Link>
          <Link href="/updates" className="text-accent transition-colors hover:text-accent-hover">
            {t("ctaUpdates")} →
          </Link>
        </section>
      </main>
    </div>
  );
}
