import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Bulgarian was retired 2026-11-01: /bg/* is 301-redirected to /en/* (next.config.ts).
  // BG text stays in the content JSON and messages/bg.json, but is no longer routed.
  locales: ["en"],
  defaultLocale: "en",
});

export type AppLocale = (typeof routing.locales)[number];
