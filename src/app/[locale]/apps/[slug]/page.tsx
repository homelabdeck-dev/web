import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getAllAppSlugs, getAppBySlug } from "@/lib/apps/loader";
import { getCategoryBySlug } from "@/lib/apps/categories";
import ScreenshotGallery from "@/components/ScreenshotGallery";
import { SITE_URL, alternatesFor, localeUrl } from "@/lib/seo";

export function generateStaticParams() {
  const slugs = getAllAppSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const app = getAppBySlug(slug);
  if (!app) return {};

  const title = `${app.name} — HomelabDeck`;
  const description = locale === "bg" ? app.descriptionBg : app.descriptionEn;
  const cover = app.screenshots[0];

  return {
    title,
    description,
    alternates: alternatesFor(locale, `/apps/${slug}`),
    openGraph: {
      title,
      description,
      url: localeUrl(locale, `/apps/${slug}`),
      ...(cover && {
        images: [
          {
            url: `/screenshots/${slug}/${cover.filename}`,
            alt: locale === "bg" ? cover.altBg : cover.altEn,
          },
        ],
      }),
    },
  };
}

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const app = getAppBySlug(slug);
  if (!app) {
    notFound();
  }

  const t = await getTranslations("apps");
  const isBg = locale === "bg";
  const category = getCategoryBySlug(app.category);
  const categoryLabel = category
    ? isBg
      ? category.labelBg
      : category.labelEn
    : app.category;
  const description = isBg ? app.descriptionBg : app.descriptionEn;
  const tagline = isBg ? app.taglineBg : app.taglineEn;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    description,
    url: localeUrl(locale, `/apps/${slug}`),
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Linux",
    sameAs: [app.officialWebsiteUrl, app.officialRepoUrl],
    image: app.screenshots.map(
      (shot) => `${SITE_URL}/screenshots/${slug}/${shot.filename}`,
    ),
    offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
  };

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16 sm:px-16">
        <Link
          href="/apps"
          className="text-sm text-zinc-600 dark:text-zinc-300 underline transition-colors hover:text-accent"
        >
          ← {t("backToApps")}
        </Link>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
              {app.name}
            </h1>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-sm text-accent-hover">
              {categoryLabel}
            </span>
          </div>
          <p className="text-lg text-zinc-600 dark:text-zinc-300">
            {tagline}
          </p>
          <p className="text-zinc-700 dark:text-zinc-300">{description}</p>
        </div>

        <section className="flex flex-col gap-2 rounded-xl border border-black/[.08] dark:border-white/[.12] bg-white dark:bg-[#20242a] p-6">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">
                {t("license")}
              </dt>
              <dd className="font-medium text-black dark:text-zinc-50">
                {app.license}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">
                {t("githubStars")}
              </dt>
              <dd className="font-medium text-black dark:text-zinc-50">
                {app.githubStars.toLocaleString(locale)}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">
                {t("officialWebsite")}
              </dt>
              <dd>
                <a
                  className="font-medium text-black dark:text-zinc-50 underline transition-colors hover:text-accent"
                  href={app.officialWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {app.officialWebsiteUrl}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">
                {t("officialRepo")}
              </dt>
              <dd>
                <a
                  className="font-medium text-black dark:text-zinc-50 underline transition-colors hover:text-accent"
                  href={app.officialRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {app.officialRepoUrl}
                </a>
              </dd>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-2 rounded-xl border border-black/[.08] dark:border-white/[.12] bg-white dark:bg-[#20242a] p-6">
          <h2 className="text-lg font-medium text-black dark:text-zinc-50">
            {t("compatibility")}
          </h2>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">
                {t("architectures")}
              </dt>
              <dd className="font-medium text-black dark:text-zinc-50">
                {app.compatibility.architectures.join(", ")}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">
                {t("database")}
              </dt>
              <dd className="font-medium text-black dark:text-zinc-50">
                {app.compatibility.database.kind}
              </dd>
            </div>
            <div className="max-w-md">
              <dt className="text-zinc-500 dark:text-zinc-400">
                {t("resourceFootprint")}
              </dt>
              <dd className="font-medium text-black dark:text-zinc-50">
                {app.compatibility.resourceFootprint.ramMb} MB RAM ·{" "}
                {app.compatibility.resourceFootprint.cpuCores} CPU
              </dd>
              <dd className="text-zinc-600 dark:text-zinc-300">
                {app.compatibility.resourceFootprint.notes}
              </dd>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-medium text-black dark:text-zinc-50">
            {t("gallery")}
          </h2>
          <ScreenshotGallery
            slug={app.slug}
            closeLabel={t("close")}
            screenshots={app.screenshots.map((shot) => ({
              filename: shot.filename,
              label: shot.label,
              alt: isBg ? shot.altBg : shot.altEn,
            }))}
          />
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-medium text-black dark:text-zinc-50">
            {t("deployment")}
          </h2>
          <pre className="overflow-x-auto rounded-xl bg-black dark:bg-[#20242a] p-4 text-sm text-zinc-100">
            <code>{app.dockerComposeSnippet}</code>
          </pre>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-medium text-black dark:text-zinc-50">
            {t("alternativeTo")}
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300">
            {app.alternativeTo.join(", ")}
          </p>
        </section>
      </main>
    </div>
  );
}
