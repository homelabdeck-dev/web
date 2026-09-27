/**
 * Data schema for HomelabDeck app directory entries.
 *
 * Every self-hosted app catalogued on homelabdeck.dev is described by an
 * `AppEntry` object. Entries are stored as JSON files under
 * `src/content/apps/<slug>.json` and loaded at build time via
 * `src/lib/apps/loader.ts`.
 */

/** Supported CPU architectures for container images / binaries. */
export type Architecture = "amd64" | "arm64";

/** Common database backends used by self-hosted apps. */
export type DatabaseKind =
  | "SQLite"
  | "PostgreSQL"
  | "MySQL"
  | "MariaDB"
  | "Stateless"
  | "Other";

/**
 * Database requirement of an app. `kind` is a constrained enum-like value
 * for filtering/UI, `label` carries free text detail (e.g. version
 * constraints or "Other" specifics).
 */
export interface DatabaseRequirement {
  kind: DatabaseKind;
  label: string;
}

/** Approximate resource footprint for a typical single-user/home deployment. */
export interface ResourceFootprint {
  /** Recommended minimum RAM in megabytes. */
  ramMb: number;
  /** Recommended minimum CPU cores (can be fractional, e.g. 0.5). */
  cpuCores: number;
  /** Free-form notes, e.g. "Scales with library size" or "ML features need more RAM". */
  notes: string;
}

/** Compatibility matrix describing where/how an app can run. */
export interface CompatibilityMatrix {
  architectures: Architecture[];
  database: DatabaseRequirement;
  resourceFootprint: ResourceFootprint;
}

/**
 * A single "Proof of Work" screenshot in the gallery. Only the structure is
 * defined here — actual image assets are added separately and referenced by
 * `filename` (expected under `/public/screenshots/<slug>/<filename>`).
 */
export interface Screenshot {
  /** Short label, e.g. "Dashboard", "Settings", "Resource Usage". */
  label: string;
  /** Image filename (relative to the app's screenshot folder). */
  filename: string;
  /** English alt text. */
  altEn: string;
  /** Bulgarian alt text. */
  altBg: string;
}

/** Full app directory entry. */
export interface AppEntry {
  // --- Metadata ---
  name: string;
  slug: string;
  category: string;
  license: string;
  officialRepoUrl: string;
  officialWebsiteUrl: string;
  githubStars: number;
  /** ISO 8601 timestamp of when `githubStars` (and other live data) was last refreshed. */
  updatedAt: string;

  // --- Compatibility Matrix ---
  compatibility: CompatibilityMatrix;

  // --- Proof of Work Gallery ---
  screenshots: Screenshot[];

  // --- Deployment ---
  /** Valid docker-compose.yml content demonstrating a ready-to-use deployment. */
  dockerComposeSnippet: string;

  // --- Positioning ---
  /** Commercial SaaS products this app is a self-hosted alternative to. */
  alternativeTo: string[];

  // --- Localized content ---
  descriptionEn: string;
  descriptionBg: string;
  taglineEn: string;
  taglineBg: string;
}
