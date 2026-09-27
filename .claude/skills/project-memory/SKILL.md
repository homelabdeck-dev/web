---
name: project-memory
description: Use to safely update or audit project context and resource records when the user says "update memory", "audit context", "audit resources", or equivalent expressions.
---

# Project Memory

This skill has three modes of operation:

1. Updating memory
2. Auditing context
3. Auditing resources

Select the mode closest to the user's expression. If the request is ambiguous, ask which operation is desired.

## Shared Principles

- First read `CLAUDE.md` and `context/README.md` in the project root.
- Record only finalized project information that will be reused in the future into permanent context.
- Do not add temporary ideas, rejected options, and unverified assumptions to permanent context.
- Do not unilaterally change goals, rules, decisions, or boundaries that the user has not explicitly finalized.
- Do not copy entire chat histories or long conversation summaries into context files.
- Do not create unnecessary new files when a suitable existing file is available.
- Obtain confirmation from the user prior to deletions, extensive rewrites, or operations changing meaning.
- At the end of the operation, briefly report the made and suggested changes along with file paths.

## Updating Memory

When the user says "update memory":

1. Identify finalized goals, decisions, rules, boundaries, and permanent project information in the current conversation.
2. Compare these against existing information in the `context/README.md` map.
3. Record finalized information into the relevant existing context file.
4. List ambiguous information whose permanence is uncertain separately and ask the user.
5. Create a new file only if there is a separate topic that does not fit into any existing files.
6. If you create, move, rename, change the purpose of, or delete a file, update the `context/README.md` map in the same operation.
7. Do not modify the main map if only file content changed and its purpose remained the same.
8. Do not touch `resource-index.md` unless a new resource was added by the user.
9. Finally, report which permanent information was recorded into which file.

## Auditing Context

When the user says "audit context":

1. Examine the `context/README.md` map and the context files shown on the map.
2. Identify context files missing from the map, no longer existing, moved, or renamed.
3. List contradictions between files, duplicated information, and records that may have lost currency.
4. Check whether temporary ideas inadvertently entered permanent context.
5. Perform clear and risk-free map path corrections.
6. Present recommendations to the user before applying corrections that would change project meaning, goals, or decisions.
7. Do not perform deletion operations without explicit approval.
8. At the end of the audit, summarize findings under headers `fixed`, `pending approval`, and `information required`.

## Auditing Resources

When the user says "audit resources":

1. Read `context/resources/README.md` and `resource-index.md`.
2. Compare actual resources in `documents/`, `data/`, `images/`, and `audio-and-video/` folders against the index.
3. Do not treat `.gitkeep` files preserving empty folders as actual resources.
4. Check whether `links.md` records have corresponding entries in the resource index.
5. Identify resources missing from the index, path-changed, deleted, or duplicated.
6. List missing details in resources' type, date, period, origin point, usage purpose, and status information.
7. Do not modify the content of original resources.
8. Do not guess accuracy or currency of resources; report suspicious cases to the user.
9. Fix clear path and record errors; ask for approval for resource deletion or meaning changes.
10. At the end of the audit, summarize changes made and decisions expected from the user.
