import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const tSite = await getTranslations({ locale, namespace: "site" });
  const link =
    "text-sm text-zinc-600 dark:text-zinc-300 transition-colors hover:text-accent";

  return (
    <footer className="border-t border-black/[.08] bg-zinc-50 dark:border-white/[.12] dark:bg-[#1a1a1a]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-16">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{tSite("title")}</p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/apps" className={link}>{t("apps")}</Link>
          <Link href="/guides" className={link}>{t("guides")}</Link>
          <Link href="/updates" className={link}>{t("updates")}</Link>
          <Link href="/#subscribe" className={link}>{t("newsletter")}</Link>
        </nav>
      </div>
    </footer>
  );
}
