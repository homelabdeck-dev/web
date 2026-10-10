import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ThemeToggle from "./ThemeToggle";

export default async function Navbar({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const tSite = await getTranslations({ locale, namespace: "site" });

  return (
    <header className="sticky top-0 z-40 border-b border-black/[.08] dark:border-white/[.12] bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4 sm:px-16">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-black dark:text-zinc-50 transition-colors hover:text-accent"
        >
          {tSite("title")}
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:text-accent"
          >
            {t("home")}
          </Link>
          <Link
            href="/apps"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:text-accent"
          >
            {t("apps")}
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
