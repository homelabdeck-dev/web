<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Codex Compatibility Instructions

In this project, the main instruction file is `CLAUDE.md`.

- Before starting any task, completely read and apply the `CLAUDE.md` file in the project root.
- Then use the `context/README.md` map referenced by `CLAUDE.md`.
- Conduct project context, resource management, memory updates, authority boundaries, and verification rules according to the definitions in `CLAUDE.md`.
- When the user says "update memory", "audit context", or "audit resources", use the `.agents/skills/project-memory/SKILL.md` skill.
- This file is only a Codex compatibility layer; do not duplicate detailed project information or `CLAUDE.md` content here.

## Additional Codex-specific instructions

<!--
Leave this section empty unless truly necessary.
Only add instructions that are specific to Codex and should not be in CLAUDE.md.
-->
