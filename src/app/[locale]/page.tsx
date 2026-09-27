import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-6 py-32 px-16 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
          {t("heading")}
        </h1>
        <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          {t("subheading")}
        </p>
        <Link
          href="/apps"
          className="mt-4 flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-background font-medium transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          {t("cta")}
        </Link>
      </main>
    </div>
  );
}
