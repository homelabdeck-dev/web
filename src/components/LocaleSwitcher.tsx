"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";

export default function LocaleSwitcher({ locales }: { locales: readonly string[] }) {
  const activeLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  return (
    <div className="flex items-center gap-1 rounded-full border border-black/[.08] bg-white p-0.5 text-sm">
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() =>
            router.replace(
              // @ts-expect-error -- pathname is a dynamic route template here
              { pathname, params },
              { locale },
            )
          }
          aria-current={locale === activeLocale}
          className={`rounded-full px-2.5 py-1 font-medium uppercase transition-colors ${
            locale === activeLocale
              ? "bg-accent text-white"
              : "text-zinc-600 hover:text-accent"
          }`}
        >
          {locale}
        </button>
      ))}
    </div>
  );
}
