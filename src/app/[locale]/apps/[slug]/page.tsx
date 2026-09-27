import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { getAllAppSlugs, getAppBySlug } from "@/lib/apps/loader";
import { getCategoryBySlug } from "@/lib/apps/categories";
import ScreenshotGallery from "@/components/ScreenshotGallery";

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

  return {
    title: `${app.name} — HomelabDeck`,
    description: locale === "bg" ? app.descriptionBg : app.descriptionEn,
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

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16 sm:px-16">
        <Link
          href="/apps"
          className="text-sm text-zinc-600 underline"
        >
          ← {t("backToApps")}
        </Link>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-black">
              {app.name}
            </h1>
            <span className="rounded-full bg-black/[.06] px-3 py-1 text-sm text-zinc-700">
              {categoryLabel}
            </span>
          </div>
          <p className="text-lg text-zinc-600">
            {tagline}
          </p>
          <p className="text-zinc-700">{description}</p>
        </div>

        <section className="flex flex-col gap-2 rounded-xl border border-black/[.08] bg-white p-6">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div>
              <dt className="text-zinc-500">
                {t("license")}
              </dt>
              <dd className="font-medium text-black">
                {app.license}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">
                {t("githubStars")}
              </dt>
              <dd className="font-medium text-black">
                {app.githubStars.toLocaleString(locale)}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">
                {t("officialWebsite")}
              </dt>
              <dd>
                <a
                  className="font-medium text-black underline"
                  href={app.officialWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {app.officialWebsiteUrl}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">
                {t("officialRepo")}
              </dt>
              <dd>
                <a
                  className="font-medium text-black underline"
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

        <section className="flex flex-col gap-2 rounded-xl border border-black/[.08] bg-white p-6">
          <h2 className="text-lg font-medium text-black">
            {t("compatibility")}
          </h2>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div>
              <dt className="text-zinc-500">
                {t("architectures")}
              </dt>
              <dd className="font-medium text-black">
                {app.compatibility.architectures.join(", ")}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">
                {t("database")}
              </dt>
              <dd className="font-medium text-black">
                {app.compatibility.database.kind}
              </dd>
            </div>
            <div className="max-w-md">
              <dt className="text-zinc-500">
                {t("resourceFootprint")}
              </dt>
              <dd className="font-medium text-black">
                {app.compatibility.resourceFootprint.ramMb} MB RAM ·{" "}
                {app.compatibility.resourceFootprint.cpuCores} CPU
              </dd>
              <dd className="text-zinc-600">
                {app.compatibility.resourceFootprint.notes}
              </dd>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-medium text-black">
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
          <h2 className="text-lg font-medium text-black">
            {t("deployment")}
          </h2>
          <pre className="overflow-x-auto rounded-xl bg-black p-4 text-sm text-zinc-100">
            <code>{app.dockerComposeSnippet}</code>
          </pre>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-medium text-black">
            {t("alternativeTo")}
          </h2>
          <p className="text-zinc-700">
            {app.alternativeTo.join(", ")}
          </p>
        </section>
      </main>
    </div>
  );
}
