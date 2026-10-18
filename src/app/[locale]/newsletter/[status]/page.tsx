import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";

const STATUSES = ["confirmed", "unsubscribed", "invalid"] as const;

export const metadata: Metadata = { robots: { index: false } };

export function generateStaticParams() {
  return STATUSES.map((status) => ({ status }));
}

export default async function NewsletterStatus({
  params,
}: {
  params: Promise<{ locale: string; status: string }>;
}) {
  const { locale, status } = await params;
  if (!(STATUSES as readonly string[]).includes(status)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("newsletter");

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-[#1a1a1a] font-sans">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-16 sm:px-16">
        <h1 className="text-3xl tracking-tight text-black dark:text-zinc-50">{t(`${status}Title`)}</h1>
        <p className="text-zinc-600 dark:text-zinc-300">{t(`${status}Body`)}</p>
        <Link href="/" className="text-accent hover:text-accent-hover">
          {t("home")}
        </Link>
      </main>
    </div>
  );
}
