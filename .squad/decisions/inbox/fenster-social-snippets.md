# Decision: Content-creation sample expanded to 5-agent pipeline

**By:** Fenster (Core Dev)
**Date:** 2026-03-10
**Scope:** content-creation sample only

## What

Added a 5th agent — **Social Snippets** (Social Media Specialist) — to the content-creation sample pipeline. The agent runs after the Editor and generates platform-optimized social media posts from the finished article.

## Pipeline (updated)

Research → Outline → Write → Edit → **Social Snippets**

## Output additions

- Twitter/X single tweet (≤280 chars)
- Twitter/X thread (4-7 tweets, hook → insights → CTA)
- LinkedIn post (800-1,300 chars, professional tone)
- Generic short-form snippet (<300 chars, for newsletters/shares)

## Why

Social amplification is the natural next step after article creation. Building it into the pipeline eliminates a manual step and ensures social content is derived from the actual article (not hallucinated separately).

## Impact

- `content-creation/squad.config.ts` — new agent + routing + ceremony update
- `content-creation/index.ts` — banner, system prompt, hints updated
- `content-creation/README.md` — docs updated, "social snippets" removed from extension ideas (now built in)
- No breaking changes — existing prompts work identically, new agent is additive
