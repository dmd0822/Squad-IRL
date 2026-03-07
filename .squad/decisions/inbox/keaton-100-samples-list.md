# Decision: 100 Real-World Squad SDK Sample List

**Date:** 2026-03-05  
**Decider:** Keaton (Lead)  
**Status:** ✅ Decided

## Context

Brady requested a master list of 100 sample use cases demonstrating Squad SDK's value to everyday users solving real-world problems (not coding problems). This list will guide sample implementation and marketing messaging.

## Decision

Created `samples/MASTER-LIST.md` with 100 diverse automation samples following these principles:

1. **No coding problems** — Every sample solves a problem regular humans face in daily life
2. **Diverse audiences** — 20+ demographics covered (parents, finance, students, homeowners, business, artists, fitness, travelers, seniors, environmental, pets, social media, gamers, foodies, events, teachers, healthcare, community, cars)
3. **Writer → Grader → Updater pattern** — Each sample uses 3-5 collaborative agents with quality gates
4. **Prioritized by impact** — High-value automations listed first

## Key Samples

**Top Impact:**
- meal-prep-squad (parents)
- expense-categorizer (finance)
- essay-polisher (students)
- job-application-tailor (everyone)
- social-media-content-calendar (business)

**Creative Differentiation:**
- screen-time-negotiator (parents)
- dating-profile-optimizer (everyone)
- seating-chart-optimizer (event planners)
- jet-lag-minimizer (travelers)
- creative-block-breaker (artists)

**Underserved Markets:**
- medication-reminder-system (seniors)
- iep-goal-writer (special ed)
- insurance-denial-appeal (healthcare)
- tech-support-simplifier (seniors)

## Why This Matters

Squad SDK's competitive advantage is **collaborative AI teams with quality gates**, not single-shot LLM outputs. Each sample demonstrates:
- Self-improving loops (iterate until grade ≥ 90%)
- Domain expertise (agents with specialized knowledge)
- Human-in-the-loop (users guide, agents execute)
- Reusable patterns (adapt to specific needs)

## Next Steps

1. Prioritize top 10-20 samples for initial implementation
2. Create sample directories with `charter.md` and `README.md`
3. Use samples in marketing/documentation to show Squad SDK solving real problems

## Alternatives Considered

- **Coding-focused samples** — Rejected: Squad SDK's market opportunity is broader than dev tools
- **Smaller list (20-30 samples)** — Rejected: 100 creates comprehensive "Squad SDK can do anything" perception
- **Generic sample names** — Rejected: Memorable names (meal-prep-squad, not food-planner) aid adoption

## Impact

- Marketing can message Squad SDK as "automation for everyone, not just developers"
- Sample diversity shows breadth of use cases (horizontal platform play)
- Quality gate pattern differentiates from ChatGPT/Claude single-shot tools
- Provides clear implementation roadmap for sample library
