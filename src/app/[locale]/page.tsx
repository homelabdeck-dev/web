import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
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

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
      <section className="flex flex-col items-center justify-center gap-6 px-6 py-24 text-center sm:px-16 sm:py-32">
        <span className="rounded-full bg-accent/10 px-4 py-1 text-sm font-medium text-accent-hover">
          {t("eyebrow")}
        </span>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-black dark:text-zinc-50 sm:text-5xl">
          {t("heading")}
        </h1>
        <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          {t("subheading")}
        </p>
        <Link
          href="/apps"
          className="mt-4 flex h-12 items-center justify-center rounded-full bg-accent px-6 text-white font-medium transition-colors hover:bg-accent-hover"
        >
          {t("cta")}
        </Link>

        <form className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            name="email"
            placeholder={t("subscribePlaceholder")}
            aria-label={t("subscribePlaceholder")}
            className="h-12 flex-1 rounded-full border border-black/[.08] bg-white px-5 text-black placeholder:text-zinc-500 focus:border-accent focus:outline-none dark:border-white/[.12] dark:bg-[#20242a] dark:text-zinc-50 dark:placeholder:text-zinc-400"
          />
          <button
            type="button"
            className="h-12 rounded-full bg-accent px-6 font-medium text-white transition-colors hover:bg-accent-hover"
          >
            {t("subscribeButton")}
          </button>
        </form>
      </section>
    </div>
  );
}
