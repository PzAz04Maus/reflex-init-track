# Reflex Engine — Copilot Workspace Instructions

## Project Status
This workspace is a TypeScript monorepo implementing substantial parts of the Reflex Engine, including engine rules, sandbox UI, logistics/inventory data, and Foundry-facing packaging.

Treat the project as a fresh, unreleased implementation.
Default to clean architecture and minimal compatibility baggage unless the user explicitly requests legacy support.

## Package Layout
The current source of truth is package-based.

- `packages/reflex-framework/`
  - Canonical engine primitives
  - Combat types, selectors, state helpers, reducers, math/calc support

- `packages/reflex-core/`
  - Primary rules package

- `packages/reflex-ui`
  - UI for debug, sandbox and players/gm, mock state, Foundry-facing UI glue, compatibility re-exports from `reflex-framework`

- `packages/reflex-logistics/`
  - Inventory model, equipment/container logic, weapon catalogs, ammunition, armor, clothing, attachments, electronics
  - Keep logistics/domain content here rather than drifting it into core/framework

- `packages/reflex-mods/`
  - Extension/mod support package

- `packages/reflex-system/`
  - System integration and packaging layer

- `dev/`
  - Durable local-network-visible archive folder for notes, references, and Copilot session summaries

- `dev/copilot-logs/`
  - Dedicated subfolder for Copilot session summaries and archived Copilot artifacts so `dev/` stays usable for other shared references

## Legacy Package Rule
`packages/reflex-init/` is legacy compatibility surface only.

- Do not add new implementation there unless the user explicitly asks for legacy compatibility work
- Prefer removal of stale legacy dependencies over adding wrappers, unless compatibility work is explicitly requested
- If a stale `reflex-init` path causes editor issues, fix the root import/config path first; only add a shim when explicitly requested

## Dependency Direction
Prefer this dependency flow:

- `reflex-core -> reflex-framework`
- `reflex-logistics -> reflex-core`
- `reflex-mods -> reflex-core` or lower-level packages as needed
- `reflex-system -> core/framework/logistics` as integration requires

Avoid:

- `reflex-framework -> reflex-core`
- `reflex-framework -> reflex-logistics`
- new circular dependencies

## Coding Priorities
When assisting in this repo, optimize for:

- strict typing
- pure functions and explicit state transitions
- straightforward refactors without legacy scaffolding by default
- small composable modules
- thin UI layers
- stable exported APIs
- explicit, intentional migrations with minimal temporary compatibility layers

Avoid:

- reviving deleted architecture just to satisfy stale imports
- duplicating the same rule logic across `reflex-framework`, `reflex-core`, and legacy wrappers
- adding legacy wrappers/shims "just in case" for unreleased codepaths
- putting rules in button handlers or Foundry event handlers
- class-heavy designs when plain typed objects and functions are enough

## Import Guidance
- Within the same package, prefer relative imports over self-import aliases when touching existing code. This reduces refactor breakage.
- Across packages, use the package export path when it is a real supported boundary.
- If a file exists only as a compatibility wrapper, re-export the canonical module instead of copying code.

## Foundry Guidance
- Foundry packaging and runtime assets should follow the active `reflex-core` implementation, not the removed `reflex-init` package.
- Foundry v13 APIs use `ApplicationV2.DEFAULT_OPTIONS`, not `defaultOptions`.
- Keep Foundry-specific reads/writes isolated from pure engine logic.

## Logistics Catalog Ingestion
- When adding or normalizing `packages/reflex-logistics/` catalog items, treat `source` as provenance only. Do not put mechanics, exceptions, rule summaries, or descriptive notes into `source`.
- Book-derived catalog items should include human-readable citations in `source` with both the book identity and page number, for example: `Source: Twilight 2013 Core OEF PDF p.224`.
- Prefer single-book files when practical. If a whole file or table comes from one page in one book, define a shared `SRC` constant and reuse it. Only use per-item mixed `source` arrays when the actual source material is mixed across books or pages.
- Mechanics, special rules, exceptions, and lookup-driven behavior belong in `traits`. Use stable trait keys that roll/test logic can interpret later; do not rely on prose in `source` for rule execution.
- If a note is explanatory but not mechanical, keep it in `description` rather than `source`.
- For tool or equipment interactions that may modify tests later, use `traits` as lookup keys and keep the behavior in the rule or roll layer. Do not encode executable numeric effects as ad hoc prose in `traits`.
- Use structured `power` data only when the source provides concrete battery, rechargeable, or AC details that match existing helpers. Keep literal source text in `powerRequirement` when that wording matters.
- Unpowered items may still include runtime or duration data when the stat block supports a plausible value. If the source does not support a plausible runtime, leave runtime-related fields empty for later refactoring rather than inventing data.
- For new catalog ingestion work, default checklist: verify exact book and page, add citation-first `source`, move mechanics into `traits`, keep non-mechanical prose in `description`, and avoid adding compatibility wrappers or duplicate catalogs.

## Validation Commands
Use these commands as the standard validation path:

- Repo type-check: `npx tsc -p tsconfig.json --noEmit`
- Repo build: `npm run build`
- Logistics tests: `npm run -w reflex-logistics test`

Current known environment note:

- `npm install` may fail in this environment due workspace protocol handling, so prefer working with existing dependencies unless the user explicitly asks to fix package manager/install behavior.

## Testing Guidance
- Prefer tests for pure rule/state logic over UI snapshot tests
- Preserve deterministic test data
- When fixing refactors, run the narrowest affected test path plus repo-wide type-check

## Problems Hygiene
When files/packages are removed or renamed:

- update tsconfig paths/import boundaries first if the editor is still tracking old paths; add compatibility wrappers/shims only when explicitly requested
- prefer removing stale imports at the root cause instead of suppressing errors
- do not assume the Problems tab reflects current disk state until type-check has been rerun

## Copilot Session Logging
For substantial work sessions, maintain a human-readable session log in `dev/copilot-logs/`.

Use this convention:

- File name: `dev/copilot-logs/YYYY-MM-DD-copilot-session-HHMM.md`
- Include: goal, key edits, validation commands, results, open risks, and next steps
- If the user requests a transcript, maintain `dev/copilot-logs/YYYY-MM-DD-copilot-transcript-HHMM.md` and append each user/assistant turn verbatim from the point transcript capture starts

Important limitation:

- If a VS Code Copilot artifact path is explicitly available and the user wants it archived, use `npm run archive:copilot-log -- "<path>"` to copy it into `dev/copilot-logs/`
- Prefer the raw debug-log directory when it exists; otherwise a session-resource path is an acceptable fallback archive source
- Do not claim to automatically persist VS Code's raw internal Copilot debug logs unless an explicit artifact path was available and that copy operation was actually performed
- The default behavior should be to save a clean session summary, not an opaque internal debug dump

Transcript persistence workflow (when requested):

- Revisit-able chat state is typically stored under VS Code workspace storage in `chatSessions/*.jsonl` and `chatEditingSessions/<session-id>/`
- If the user asks for maximum local preservation, archive the relevant `chatSessions` jsonl and matching `chatEditingSessions` folder into `dev/copilot-logs/` alongside the session summary
- Mark any historical backfill as partial reconstruction unless explicit verbatim records were available

## Maintenance Rule
If the repo architecture changes materially, update this file in the same session so future assistance follows the new package boundaries and workflows.
