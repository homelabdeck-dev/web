import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAllApps } from "@/lib/apps/loader";
import { localeUrl } from "@/lib/seo";

function entry(path: string, lastModified?: Date): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, localeUrl(l, path)]),
  );
  return routing.locales.map((locale) => ({
    url: localeUrl(locale, path),
    ...(lastModified && { lastModified }),
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const apps = getAllApps();
  const newest = new Date(
    Math.max(...apps.map((app) => new Date(app.updatedAt).getTime())),
  );

  return [
    ...entry("", newest),
    ...entry("/apps", newest),
    ...apps.flatMap((app) =>
      entry(`/apps/${app.slug}`, new Date(app.updatedAt)),
    ),
  ];
}
