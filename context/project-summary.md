# Project Summary

This file explains what the project is, why it exists, its scope, tech stack, and current state.

## Project Name

HomelabDeck Web (`homelabdeck-dev/web`)

## Short Description

Fast, multilingual directory site for self-hosted software and HomeLab/infrastructure apps, live at `homelabdeck.dev`. Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and `next-intl` internationalization.

## Main Objective

Catalog self-hosted applications with real Proof-of-Work evidence (dashboard/settings screenshots, resource footprint, compatibility matrix, ready-to-use `docker-compose.yml`) so HomeLab enthusiasts and self-hosters can evaluate an app before deploying it — not a dashboard for managing infrastructure.

## Tech Stack & Core Dependencies

- **Framework**: Next.js `16.3.6` (App Router)
- **UI Library**: React `19.2.8` & React DOM `19.2.8`
- **Styling**: Tailwind CSS `v4` (`@tailwindcss/postcss`)
- **Localization**: `next-intl` `^4.14.7`
- **Language**: TypeScript `^5`
- **Hosting/CI**: GitHub + Vercel (Jamstack, SSG/SSR); domain via Cloudflare (DNS & HSTS)

## Included in Scope

- Web application pages, layout, and UI components in `src/`
- App catalog entries as JSON in `src/content/apps/` (name, category, license, compatibility, screenshots, docker-compose, alternatives, EN/BG copy)
- Proof-of-Work screenshots in `public/screenshots/<slug>/` (WebP)
- Internationalization dictionary and locale messages in `messages/` (English + Bulgarian)
- Frontend development, build scripts, and linting

## Excluded from Scope

- Backend server infrastructure logic (unless specified)
- Modifying auto-generated Next.js rules in `AGENTS.md`

## Current State

- Live in production at `homelabdeck.dev` (Vercel), live as of 2026-10-07.
- App catalog holds 19 entries: applio, audiobookshelf, casaos, freshrss, gitea, grafana, home-assistant, immich, jellyfin, memos, n8n, nginx-proxy-manager, paperless-ngx, pi-hole, portainer, uptime-kuma, vaultwarden, vikunja, wiki-js.
- All 19 entries have their 3-screenshot Proof-of-Work gallery published in `public/screenshots/<slug>/`.
- Light/dark theme toggle in navbar (2026-10-10, replaced the language switcher; EN/BG still reachable via /en, /bg URLs) — see `decisions.md`.

## Important Locations

- `src/app/[locale]/` — routed pages (home, apps list, app detail)
- `src/content/apps/*.json` — one file per catalog entry, source of truth for screenshot filenames
- `public/screenshots/<slug>/` — published Proof-of-Work WebP images
- `messages/` — Locale strings and translation files
- `public/` — Static assets
