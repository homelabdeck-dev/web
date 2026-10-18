"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export type AppRow = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  categoryLabel: string;
};

export default function AppsList({ apps }: { apps: AppRow[] }) {
  const t = useTranslations("panel");
  const category = useSearchParams().get("category");
  const shown = category ? apps.filter((a) => a.category === category) : apps;
  const label = category ? apps.find((a) => a.category === category)?.categoryLabel : null;

  return (
    <>
      {label && (
        <p className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
          {t("filter", { category: label })}
          <Link href="/apps" className="text-accent hover:text-accent-hover">{t("clear")}</Link>
        </p>
      )}
      <ul className="flex flex-col gap-4">
        {shown.map((app) => (
          <li key={app.slug}>
            <Link
              href={`/apps/${app.slug}`}
              className="flex flex-col gap-1 rounded-xl border border-black/[.08] dark:border-white/[.12] bg-white dark:bg-[#20242a] p-6 transition-colors hover:border-accent/40"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-medium text-black dark:text-zinc-50">{app.name}</h2>
                <span className="rounded-full bg-accent/10 px-3 py-1 text-sm text-accent-hover">{app.categoryLabel}</span>
              </div>
              <p className="text-zinc-600 dark:text-zinc-300">{app.tagline}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
