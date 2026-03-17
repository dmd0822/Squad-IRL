# Decision: Add Fact-Checker agent to content-creation sample

**Decided by:** Fenster  
**Date:** 2026-03-17  
**Status:** Implemented

## Context

The content-creation sample had a five-agent pipeline (Research → Outline → Write → Edit → Social Snippets) with Fact-Checker listed as a future extension idea. Adding it as a built-in sixth agent creates a quality gate between editing and social amplification.

## Decision

- Added `factChecker` agent (role: "Verification Specialist") to the content-creation sample between Editor and Social Snippets
- Pipeline is now: Research → Outline → Write → Edit → **Fact-Check** → Social Snippets
- The agent resolves `[VERIFY]` tags left by the Writer, produces a confidence-rated verification report (✅ Verified / ⚠️ Uncertain / ❌ Incorrect), and outputs a corrected article
- Removed Fact-Checker from the "Extending This Sample" section since it's now built-in

## Rationale

Fact-checking before social amplification prevents incorrect claims from being promoted across platforms. The Writer already flags uncertain claims with `[VERIFY]` tags — the Fact-Checker resolves these systematically.

## Files Changed

- `content-creation/squad.config.ts` — new agent definition, team config, routing, ceremony, squad export
- `content-creation/index.ts` — banner, system prompt, progress messages, completion tips
- `content-creation/README.md` — pipeline docs, architecture diagram, What You Get, Extending section
