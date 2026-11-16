import AppIcon from "@/components/AppIcon";
import { Link } from "@/i18n/navigation";
import { getCategoryBySlug } from "@/lib/apps/categories";
import type { AppEntry } from "@/lib/apps/schema";

export default function AppCard({
  app,
  locale,
}: {
  app: AppEntry;
  locale: string;
}) {
  const isBg = locale === "bg";
  const category = getCategoryBySlug(app.category);
  const categoryLabel = category
    ? isBg
      ? category.labelBg
      : category.labelEn
    : app.category;

  return (
    <Link
      href={`/apps/${app.slug}`}
      className="flex h-full flex-col gap-2 rounded-xl border border-black/[.08] bg-white p-5 transition-colors hover:border-accent/40 dark:border-white/[.12] dark:bg-[#20242a]"
    >
      <div className="flex items-center gap-3">
        <AppIcon icon={app.icon} size={36} />
        <h3 className="min-w-0 text-lg font-medium text-black dark:text-zinc-50">
          {app.name}
        </h3>
      </div>
      <span className="self-start rounded-full bg-accent/10 px-3 py-1 text-xs text-accent-hover">
        {categoryLabel}
      </span>
      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        {(isBg && app.taglineBg) || app.taglineEn}
      </p>
    </Link>
  );
}
