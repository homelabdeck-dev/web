# Project Summary

This file explains what the project is, why it exists, its scope, tech stack, and current state.

## Project Name

HomeLab Deck Web (`homelabdeck-dev/web`)

## Short Description

Web interface frontend for HomeLab Deck built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and `next-intl` internationalization.

## Main Objective

Provide a modern, responsive, and internationalized web dashboard interface for managing HomeLab services and infrastructure.

## Tech Stack & Core Dependencies

- **Framework**: Next.js `16.3.6` (App Router)
- **UI Library**: React `19.2.8` & React DOM `19.2.8`
- **Styling**: Tailwind CSS `v4` (`@tailwindcss/postcss`)
- **Localization**: `next-intl` `^4.14.7`
- **Language**: TypeScript `^5`

## Included in Scope

- Web application pages, layout, and UI components in `src/`
- Internationalization dictionary and locale messages in `messages/`
- Frontend development, build scripts, and linting

## Excluded from Scope

- Backend server infrastructure logic (unless specified)
- Modifying auto-generated Next.js rules in `AGENTS.md`

## Current State

- Fresh Next.js 16 app structure bootstrapped with TypeScript & Tailwind CSS v4.
- Configured with `next-intl` for i18n support.

## Important Locations

- `src/` — Next.js App Router code and components
- `messages/` — Locale strings and translation files
- `public/` — Static assets
