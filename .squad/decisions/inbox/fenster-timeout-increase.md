# Decision: Increase Sample Timeout from 5min to 10min

**Date:** 2026-03-09  
**Author:** Fenster  
**Status:** Implemented  

## Context

Brady hit a timeout error running the content-creation sample. The hardcoded 5-minute timeout (300_000ms) wasn't sufficient for multi-agent LLM workflows, especially complex pipelines like content-creation which chains 4 agents sequentially (Researcher → Outliner → Writer → Editor).

## Decision

Increased the timeout from 300_000ms (5 minutes) to 600_000ms (10 minutes) across all 19 sample applications.

## Changes

Updated all 19 sample `index.ts` files:
- ab-test-orchestrator
- appointment-scheduler
- bug-triage
- compliance-checker
- content-creation
- contract-reviewer
- gmail
- inventory-manager
- job-application-tracker
- linkedin-monitor
- meeting-recap
- mtg-commander-deck-builder
- price-monitor
- real-estate-analyzer
- realtor-sales-package
- receipt-scanner
- social-media-manager
- support-ticket-router
- travel-planner

Each file has two timeout occurrences that were updated:
1. `session.sendAndWait({ prompt }, 300_000)` → `600_000`
2. `setTimeout(resolve, 300_000)` → `600_000` (fallback path)

## Rationale

- Multi-agent workflows with sequential coordination naturally take longer than single-agent interactions
- Complex content creation pipelines (research, outline, write, edit) can easily exceed 5 minutes
- Doubling the timeout to 10 minutes provides comfortable headroom while still catching genuinely stuck sessions
- Consistent timeout across all samples prevents similar issues in other multi-agent workflows

## Alternatives Considered

- **Make timeout configurable per-sample:** Rejected as premature optimization. 10 minutes works for all samples.
- **Increase only content-creation:** Rejected. Other samples have similar multi-agent patterns and could hit the same issue.

## Impact

- Users running complex multi-agent samples will no longer encounter premature timeout errors
- No breaking changes — this is a pure timeout increase
- All samples continue to work exactly as before, just with more patience
