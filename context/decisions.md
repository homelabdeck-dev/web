# Project Decisions

This file records finalized decisions that will affect future work in HomeLab Deck Web.

| Date | Decision | Rationale | Status | Affected Areas |
|---|---|---|---|---|
| 2026-09-27 | Integrated Project Memory System | Improve agent context efficiency and lower token usage | active | Root documentation & context |
| 2026-09-27 | Use Tailwind CSS v4 & Next.js 16 | Modern styling & latest React 19 App Router standard | active | UI & styling |
| 2026-09-27 | Site forced to light theme only; removed all `dark:` Tailwind variants and the `prefers-color-scheme: dark` CSS override | Starting baseline is light-only; a dedicated toggle can reintroduce dark mode later if needed | active | `globals.css`, `src/app/[locale]/page.tsx`, `apps/page.tsx`, `apps/[slug]/page.tsx` |
