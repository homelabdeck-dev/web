import "server-only";

import fs from "node:fs";
import path from "node:path";

export interface WeeklyNote {
  slug: string;
  date: string;
  titleEn: string;
  titleBg: string;
  summaryEn: string;
  summaryBg: string;
  bodyEn: string[];
  bodyBg: string[];
  /** Slugs of apps from `src/content/apps` featured in this note. */
  apps: string[];
}

const DIR = path.join(process.cwd(), "src/content/weekly");

/** All weekly notes, newest first. */
export function getAllWeeklyNotes(): WeeklyNote[] {
  return fs
    .readdirSync(DIR)
    .filter((file) => file.endsWith(".json"))
    .map(
      (file) =>
        JSON.parse(fs.readFileSync(path.join(DIR, file), "utf-8")) as WeeklyNote,
    )
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function getWeeklyNote(slug: string): WeeklyNote | undefined {
  return getAllWeeklyNotes().find((note) => note.slug === slug);
}
