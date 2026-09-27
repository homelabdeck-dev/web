import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import LocaleSwitcher from "./LocaleSwitcher";

export default async function Navbar({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const tSite = await getTranslations({ locale, namespace: "site" });

  return (
    <header className="sticky top-0 z-40 border-b border-black/[.08] bg-zinc-50/90 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4 sm:px-16">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-black"
        >
          {tSite("title")}
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-black"
          >
            {t("home")}
          </Link>
          <Link
            href="/apps"
            className="text-sm font-medium text-zinc-700 transition-colors hover:text-black"
          >
            {t("apps")}
          </Link>
          <LocaleSwitcher locales={routing.locales} />
        </nav>
      </div>
    </header>
  );
}
