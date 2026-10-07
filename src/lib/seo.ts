import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

/** Canonical production origin (the apex domain redirects to www). */
export const SITE_URL = "https://www.homelabdeck.dev";

/** Absolute URL for a locale-prefixed path, e.g. ("bg", "/apps") → .../bg/apps. */
export function localeUrl(locale: string, path = ""): string {
  return `${SITE_URL}/${locale}${path}`;
}

/** Canonical + hreflang alternates for a page that exists in every locale. */
export function alternatesFor(
  locale: string,
  path = "",
): NonNullable<Metadata["alternates"]> {
  return {
    canonical: localeUrl(locale, path),
    languages: {
      ...Object.fromEntries(
        routing.locales.map((l) => [l, localeUrl(l, path)]),
      ),
      "x-default": localeUrl(routing.defaultLocale, path),
    },
  };
}

/** Open Graph locale code for a routing locale. */
export function ogLocale(locale: string): string {
  return locale === "bg" ? "bg_BG" : "en_US";
}
