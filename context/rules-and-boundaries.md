# Rules and Boundaries

This file contains permanent rules, boundaries, and prohibitions that must always be taken into account in the project.

## Mandatory Rules

- Maintain TypeScript strict type safety throughout the codebase.
- Use Next.js 16 App Router conventions and React 19 Server Components where appropriate.
- Ensure all user-facing strings are properly localized using `next-intl` (`messages/`).
- Use existing npm scripts (`npm run dev`, `npm run build`, `npm run lint`).
- Preserve the auto-generated Next.js rules block in `AGENTS.md`.

## Do's and Don'ts (Things to Avoid)

- Do not use deprecated Next.js APIs or legacy Pages Router patterns.
- Do not hardcode strings directly in UI components; extract them to `messages/` for i18n support.
- Do not commit broken TypeScript types or ESLint errors.

## Verification Commands

- **Development Server**: `npm run dev`
- **Typecheck & Build**: `npm run build`
- **Linting**: `npm run lint`
