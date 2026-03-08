# Project Context

- **Owner:** Brady
- **Project:** squad-sdk — the programmable multi-agent runtime for GitHub Copilot (v1 replatform)
- **Stack:** TypeScript (strict mode, ESM-only), Node.js ≥20, @github/copilot-sdk, Vitest, esbuild
- **Created:** 2026-02-21



## Learnings

### From Beta (carried forward)
- Tiered response modes (Direct/Lightweight/Standard/Full) — spawn templates vary by complexity
- Silent success detection: 6-line RESPONSE ORDER block prevents ~7-10% of background spawns from returning no text
- Skills system architecture: SKILL.md lifecycle with confidence progression (low → medium → high)
- Spawn template design: charter inline, history read, decisions read — ceremony varies by tier
- Coordinator prompt structure: squad.agent.md is the authoritative governance file
- respawn-prompt.md is the team DNA — owned by Verbal, reviewed by Keaton

### #241: Coordinator Session — Routing LLM Prompt + Parser
- Created `src/cli/shell/coordinator.ts` with three exports: `buildCoordinatorPrompt()`, `parseCoordinatorResponse()`, `formatConversationContext()`
- Prompt assembles from team.md (roster) + routing.md (rules) — graceful fallback if either is missing
- Response parser handles three routing modes: DIRECT (answer inline), ROUTE (single agent), MULTI (fan-out)
- Removed unused `resolveSquad` import from the task spec — kept imports clean for strict mode
- Exported all functions and types from `src/cli/shell/index.ts`
- PR #286 → bradygaster/dev

### #313: Remote Squad Mode — Coordinator Awareness
- Updated `.github/agents/squad.agent.md` Worktree Awareness section with third resolution strategy: remote squad mode via `.squad/config.json` `teamRoot` field
- Added `PROJECT_ROOT` variable to spawn template alongside `TEAM_ROOT`, with scope explanation (identity vs. project-local paths)
- Updated "Passing the team root to agents" section to describe dual-path passing in remote vs. local mode
- Added @copilot incompatibility note — remote mode is local-dev only
- Kept changes minimal: three targeted sections modified, no structural changes to existing content

### 2026-02-24T17-25-08Z : Team consensus on public readiness
📌 Full team assessment complete. All 7 agents: 🟡 Ready with caveats. Consensus: ship after 3 must-fixes (LICENSE, CI workflow, debug console.logs). No blockers to public source release. See .squad/log/2026-02-24T17-25-08Z-public-readiness-assessment.md and .squad/decisions.md for details.

### Rock-Paper-Scissors Sample — Prompt Architecture
- Created `samples/rock-paper-scissors/prompts.ts` with 10 player strategies and scorekeeper prompt
- **The Learner (Sherlock 🔍)** is the key demo agent — prompt instructs LLM to analyze opponent play history, detect patterns (frequency bias, sequences, cycles), predict next move, and counter strategically with reasoning
- Two-line response format for The Learner: [analysis sentence] + [move]. Makes logs showcase actual LLM pattern recognition
- Deterministic agents (Rocky, Edward, Papyrus) have absolute prompts: "ALWAYS throw X. Never deviate."
- Cycler uses modulo arithmetic in prompt: "Round % 3 == 1 → rock" (teaches LLM stateful behavior)
- Creative agents: Echo (copycat), Rebel (contrarian — intentionally loses), Poker (bluffer with fake tells)
- Scorekeeper prompt: entertaining commentary + mental leaderboard tracking + personality-driven announcements
- Design principle: prompts are code. Precision over prose. Each must be robust against LLM drift.

## 📌 Team Update (2026-03-03T00:00:50Z)

**Session:** RPS Sample Complete — Verbal, Fenster, Kujan, McManus collaboration

Multi-agent build of Rock-Paper-Scissors game with 10 AI strategies, Docker infrastructure, and full documentation. Fenster (Coordinator) identified and resolved 3 integration bugs (ID mismatch, move parsing, history semantics). Sample ready for use.

### Skill: history-hygiene (2026-03-04)
Created `.squad/skills/history-hygiene/SKILL.md` to codify lesson from Kobayashi v0.6.0 incident. Core rule: record final outcomes to history, not intermediate requests or reversed decisions. One read = one truth. No cross-referencing required. Team learned hard way that stale history entries poison future spawns. Formal intervention: Keaton rewrote charter guardrails, Fenster corrected 19 entries.

---

## History Audit — 2026-03-03

**Audit Results:** 0 corrections. File is clean.

**Checked for:**
- ✓ No conflicting entries
- ✓ No stale or reversed decisions
- ✓ No v0.6.0 target references (v0.6.0 appears only as historical incident context, which is correct)
- ✓ No intermediate states recorded as final (all entries document outcomes)
- ✓ All future-spawn-readable: no cross-reference dependencies

**Timeline integrity:** Forward-moving (2026-02-21 → 2026-03-04), no reversals.

**Note:** v0.6.0 reference in history-hygiene entry is correct as-written — it documents the *Kobayashi incident* that taught the team the skill itself. No change needed.

### LinkedIn Monitor Sample — Squad Config Design
- Created `linkedin-monitor/squad.config.ts` with 4 agents: Notification Classifier, Engagement Scorer, Action Advisor, Summary Reporter
- Followed gmail/squad.config.ts pattern exactly: same imports, section structure, defineSquad export shape
- Key design choice: Action Advisor charter has a **CRITICAL** section mandating direct LinkedIn URLs with every recommendation — the UX is "see it, click it, act on it"
- Engagement Scorer incorporates LinkedIn-specific dynamics: early-comment amplification, creator-to-creator weighting, decay rates on comment threads vs. connection requests
- Summary Reporter uses fixed output template (📊 Daily Briefing) with counts, priority groups (🔴/🟡/🟢), and time estimates — scannable in 10 seconds
- Classifier has explicit Squad-mention detection as a first-class field, not just a tag — product mentions surface regardless of notification type
- Routing: 5 rules — 4 direct routes for individual agents, 1 full-tier catch-all for "triage|check|linkedin|monitor|everything" (priority 10)
- Model: claude-sonnet-4.5 preferred, claude-haiku-4.5 fallback — consistent with gmail sample



📌 Team update (2026-03-08T13:21:18Z): LinkedIn Monitor sample completed — full TypeScript implementation, four-agent squad.config.ts, URL-first action design pattern — decided by Fenster and Verbal

### Contract Reviewer Sample — Full Rewrite from Hardcoded to Real Squad
- Replaced hardcoded 1000+ line demo with real file-based Squad sample following gmail gold standard
- Created `contract-reviewer/squad.config.ts` with 4 agents: Clause Extractor, Risk Assessor, Negotiation Advisor, Summary Reporter
- **Charter quality showcase**: Each charter is 35-50 lines with domain-specific legal knowledge, calibrated benchmarks (Net 30 payment, 12-month liability cap, 99.9% SLA), explicit output formats, and strict role boundaries
- Risk Assessor charter includes quantitative industry benchmarks — not vague "this could be concerning" but "industry standard is 12-month cap; this is 3 months"
- Negotiation Advisor produces ready-to-insert redline language with fallback positions and leverage analysis
- Summary Reporter follows a fixed template: risk heatmap table, top 3 concerns, action items, sign/negotiate/walk recommendation
- Created `contract-reader.ts` as a clean file-reading module: validates extension (.txt/.md), size (500KB max), empty files. Falls back to stdin paste if no file provided
- Created `sample-contract.md`: a deliberately vendor-hostile 15-clause SaaS agreement packed with red flags (3-month liability cap, 24-month non-compete, perpetual data license, unilateral amendments, asymmetric termination)
- Pattern: read-only analysis, streaming responses, ANSI terminal output, banner, extension ideas, same SquadClient connection flow as gmail/linkedin-monitor
- Model: claude-sonnet-4.5 preferred, claude-haiku-4.5 fallback — consistent with all samples
- Routing: 5 rules — 4 direct routes for individual agents, 1 full-tier catch-all for "review|analyze|contract|everything"
- TypeScript strict mode, clean `npx tsc --noEmit`, zero errors

### Content Creation Workflow Sample — Full Pipeline Build
- Created `content-creation/` sample: 7 files (squad.config.ts, index.ts, package.json, tsconfig.json, README.md, 2 topic files)
- **4 agents**: Researcher (facts/stats/angles), Outliner (structure/blueprint), Writer (draft with voice), Editor (polish + SEO — combines editorial and SEO into one agent for demo simplicity)
- **Text-input pattern**: follows contract-reviewer's file-based input approach — accepts CLI arg for topic file OR interactive readline prompt
- Dropped Publisher agent (original spec had 6) — 4 agents keeps the demo focused; SEO merged into Editor
- `content-topics/` directory with 2 sample briefs: technical blog post (multi-agent AI systems) and product launch (code review tool) — both include audience, tone, angle guidance, and word count targets
- Charter quality: each agent has 40-60 line charters with specific output formats, expertise lists, style guidelines, and explicit role boundaries preventing overlap
- System prompt embeds topic directly — no follow-up loop needed, squad produces full pipeline in one response
- Closing inspiration message pattern: "Great content isn't written — it's engineered."
- `npx tsc --noEmit` clean, zero errors, TypeScript strict mode



### 📌 Team update (2026-03-08T14:54:25Z): Content Creation sample uses 4 agents (not 6) — decided by Verbal
- SEO merged into Editor phase for natural workflow integration
- Publisher dropped (API/OAuth complexity without demo benefit)
- 4-agent pattern consistent with gmail, linkedin-monitor, contract-reviewer samples
- Aspirational spec (6 agents) remains in SAMPLE-IDEAS.md; implementation uses practical 4-agent design
- Future extension: Publisher and Fact-Checker agents can be added

### MTG Commander Deck Builder Sample — Squad Config Design
- Created `mtg-commander-deck-builder/squad.config.ts` with 4 agents: Card Scout, Deck Architect, Synergy Analyst, Budget Advisor
- Followed gmail/squad.config.ts pattern exactly: same imports, section structure, defineSquad export shape
- **Domain depth showcase**: Every charter embeds real Commander format knowledge — commander tax, color identity edge cases (hybrid mana, Phyrexian mana, color indicators), mana curve distribution benchmarks (10-12 one-drops, 14-16 two-drops), ramp/draw/interaction ratio targets (8-12/8-10/8-12)
- Deck Architect charter distinguishes NEW deck builds vs. MODIFY flows — modification requires surgical swaps maintaining exactly 100 cards
- Synergy Analyst charter covers full combo taxonomy: 2-card combos, multi-card chains, value engines, infinite combos (with playgroup disclaimer), and anti-synergies/nombos
- Budget Advisor uses tiered upgrade path (Tier 1/2/3) and honest trade-off language ("you lose X, you save Y") — no shame, every price point valid
- Routing: 6 rules — 4 direct routes for individual agents, 1 full-tier for new deck builds, 1 dual-agent route for modifications (Deck Architect + Synergy Analyst)
- Dual-agent modification route is new pattern: changes need both structural validation AND synergy re-check
- Model: claude-sonnet-4.5 preferred, claude-haiku-4.5 fallback — consistent with all samples
- On-demand ceremony: "deck-review" — all 4 agents evaluate card selection, balance, synergies, and budget

📌 Team update (2026-03-08T16:10:04Z): Conversation loop pattern established for samples with persistent artifacts (deck files, reports, documents). Supports iterative user modification. — decided by Fenster
