# Triage Recommendations - Bug Triage Squad

## Issue #271: feat: rename workstreams → SubSquads (community decision)

**Action:** Schedule for Next Sprint

**Why:** Community-driven decision with wide scope requires planning for backward compatibility strategy and coordinated changes across multiple systems.

**Suggested Area:** DevEx (cross-functional: impacts CLI, SDK, docs)

**Info Needed:** N/A (decision already made, scope is clear)

**Suggested Labels:**
- `type:feature`
- `area:breaking-change`
- `priority:p1`

**Notes:** This is a major refactoring that should be planned as a sprint goal. Consider creating subtasks for each affected area (CLI, SDK, config, docs, blog, tests). Deprecation timeline should be established upfront.

---

## Issue #266: Recipes & Advanced Scenarios (recipes.html) shows 403 error page

**Action:** Fix Now

**Why:** Documentation is broken with clear fix identified, affecting users immediately, and already has assignees working on it.

**Suggested Area:** Docs

**Info Needed:** N/A (problem and solution are clear)

**Suggested Labels:**
- ✅ Already well-labeled (type:bug, priority:p2, status:in-progress)
- Consider adding: `good-first-issue` (if not already assigned) or `area:docs`

**Notes:** Simple fix - update link from 403 page to correct GitHub markdown file. Should be resolved quickly.

---

## Issue #261: feat: CommunicationAdapter — platform-agnostic agent-human communication

**Action:** Needs Info

**Why:** Proposal is in-review but lacks implementation details, acceptance criteria, and team consensus on architectural approach.

**Suggested Area:** Backend / DevEx

**Info Needed:**
- What are the specific adapter interfaces/methods required?
- Which communication platforms should be supported in v1?
- Does this require breaking changes to existing code?
- What's the migration path for current ad-hoc implementations?
- Has the proposal in discussion #242 been accepted?

**Suggested Labels:**
- `type:feature`
- `needs:rfc`
- `area:architecture`

**Notes:** Move from in-review to needs-info until architectural consensus is reached. Consider requesting formal RFC or design doc.

---

## Issue #260: Explore: GitHub.com-based Squad experience

**Action:** Schedule for Next Sprint (as discovery/spike work)

**Why:** Research task with defined options provides strategic value but needs time-boxed investigation before committing to implementation.

**Suggested Area:** DevEx / Infrastructure

**Info Needed:**
- What's the success criteria for this exploration?
- What's the time budget for investigation (suggest 1-2 days)?
- Are there specific user scenarios to validate?

**Suggested Labels:**
- ✅ Keep `type:feature` and `status:backlog`
- Add: `needs:spike` or `investigation`

**Notes:** Convert to a time-boxed spike (1-2 sprint days) to evaluate feasibility of each option. Output should be a recommendation doc, not implementation.

---

## Issue #259: Investigate: VS Code crash during Squad execution

**Action:** Fix Now (prioritize investigation)

**Why:** Crashes are critical user experience issues that block users from running Squad; already assigned and may indicate broader stability problems.

**Suggested Area:** Infrastructure / DevEx

**Info Needed:**
- Can the crash be reproduced consistently?
- Are there crash logs/dumps available?
- Which VS Code version(s) are affected (only nightly or stable too)?
- What Squad operations trigger the crash?
- Is this Windows/Mac/Linux specific?

**Suggested Labels:**
- ✅ Keep `type:bug` and `priority:p2`
- Consider upgrading to: `priority:p1` (crashes should be P1)
- Add: `area:stability`

**Notes:** Consider bumping to P1 since crashes are critical. Request detailed reproduction steps and environment info. Check if terminal flicker (#254) provides clues.

---

## Summary

| Issue | Action | Priority | Assignees Needed |
|-------|--------|----------|-----------------|
| #271 (SubSquads rename) | Schedule for Next Sprint | P1 | Yes (multi-person) |
| #266 (Recipes 403) | Fix Now | P2 | Already assigned ✅ |
| #261 (CommunicationAdapter) | Needs Info | P2 | On hold |
| #260 (GitHub.com experience) | Schedule for Next Sprint | P3 | Yes (1 person, spike) |
| #259 (VS Code crash) | Fix Now | P1→P2 | Already assigned ✅ |

**Immediate Actions (Fix Now):** #266, #259
**Next Sprint Planning:** #271, #260
**Blocked on Info:** #261
