# Project Decisions

This file records finalized decisions that will affect future work in HomeLab Deck Web.

| Date | Decision | Rationale | Status | Affected Areas |
|---|---|---|---|---|
| 2026-09-27 | Integrated Project Memory System | Improve agent context efficiency and lower token usage | active | Root documentation & context |
| 2026-09-27 | Use Tailwind CSS v4 & Next.js 16 | Modern styling & latest React 19 App Router standard | active | UI & styling |
| 2026-09-27 | Site forced to light theme only; removed all `dark:` Tailwind variants and the `prefers-color-scheme: dark` CSS override | Starting baseline is light-only; a dedicated toggle can reintroduce dark mode later if needed | active | `globals.css`, `src/app/[locale]/page.tsx`, `apps/page.tsx`, `apps/[slug]/page.tsx` |
| 2026-10-03 | Dropped Nextcloud from the catalog (removed `src/content/apps/nextcloud.json`) | Nextcloud cannot be installed in an LXC container in the user's homelab, so real Proof-of-Work screenshots cannot be produced; entries without proof contradict the site's core value | active | `src/content/apps/` |
| 2026-10-10 | Added the `ai-audio` category (AI & Audio) and the Applio entry (voice conversion, RVC-based). Its compose snippet pins `torchvision==0.26.0` and `pedalboard==0.9.16` after tests on the homelab (upstream Dockerfile is out of date) | Catalog had no AI category; snippet was build-tested and served HTTP 200 with CUDA before publishing | active | `src/lib/apps/categories.ts`, `src/content/apps/applio.json` |
| 2026-10-10 | Reintroduced dark mode: `ThemeToggle` (sun/moon, localStorage `theme`, falls back to system preference) replaced the EN/BG `LocaleSwitcher` in the navbar at the user's explicit request; `dark:` variants via class-based `@custom-variant`. Locales stay reachable by URL (/en, /bg) | User asked to rework the language switcher into a light/dark toggle; supersedes the 2026-09-27 light-only decision | active | `ThemeToggle.tsx`, `Navbar.tsx`, `globals.css`, `layout.tsx` |
