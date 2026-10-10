import "server-only";

import fs from "node:fs";
import path from "node:path";

export interface GuideSection {
  kind: "list" | "steps" | "text";
  headingEn: string;
  headingBg: string;
  en: string[];
  bg: string[];
}

export interface Guide {
  slug: string;
  date: string;
  titleEn: string;
  titleBg: string;
  descriptionEn: string;
  descriptionBg: string;
  /** Optional Open Graph image, path under /public (1200x630). */
  image?: string;
  introEn: string[];
  introBg: string[];
  /** Comparison rows: the SaaS being replaced and the catalog app slug. */
  rows: { insteadOf: string; app: string }[]; // may be empty (no table)
  sections: GuideSection[];
}

const DIR = path.join(process.cwd(), "src/content/guides");

/** All guides, newest first. */
export function getAllGuides(): Guide[] {
  return fs
    .readdirSync(DIR)
    .filter((file) => file.endsWith(".json"))
    .map(
      (file) =>
        JSON.parse(fs.readFileSync(path.join(DIR, file), "utf-8")) as Guide,
    )
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function getGuide(slug: string): Guide | undefined {
  return getAllGuides().find((guide) => guide.slug === slug);
}
