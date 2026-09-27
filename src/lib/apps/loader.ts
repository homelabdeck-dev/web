import "server-only";

import fs from "node:fs";
import path from "node:path";
import type { AppEntry } from "./schema";

const CONTENT_DIR = path.join(process.cwd(), "src/content/apps");

/**
 * Reads and parses every `<slug>.json` file under `src/content/apps`.
 * Safe to call at build time (SSG) — pure Node `fs`, no fetch/network.
 */
export function getAllApps(): AppEntry[] {
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".json"));

  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
      return JSON.parse(raw) as AppEntry;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Returns a single app entry by slug, or `undefined` if it doesn't exist. */
export function getAppBySlug(slug: string): AppEntry | undefined {
  const filePath = path.join(CONTENT_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    return undefined;
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as AppEntry;
}

/** Returns every available app slug (for `generateStaticParams`). */
export function getAllAppSlugs(): string[] {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(/\.json$/, ""));
}
