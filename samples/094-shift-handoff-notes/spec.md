# Shift Handoff Notes Generator - Specification

**Audience:** 🏥 Healthcare  
**Goal:** Generate comprehensive, prioritized shift handoff notes for seamless patient care continuity

## Requirements

1. Organize by patient with key identifiers
2. Highlight critical/urgent items first (safety, pending orders, changes)
3. Summarize current condition and recent changes
4. Note pending tasks and follow-ups needed
5. Include important labs, meds, or procedures upcoming
6. Flag pain management or comfort needs
7. Mention family communication issues or concerns
8. Use standardized format (e.g., SBAR-style) for consistency

## Output Format

Structured handoff notes organized by priority with patient summaries and action items

## Quality Criteria

- **Patient Safety Focus (30)**: Critical info is highlighted; nothing dangerous is buried or missed
- **Completeness (25)**: All key aspects covered: condition, tasks, orders, concerns
- **Prioritization (20)**: Urgent items are clearly flagged; information is well-organized
- **Clarity & Conciseness (15)**: Easy to read quickly; no unnecessary detail but nothing critical omitted
- **Standardization (10)**: Follows consistent format (SBAR or similar); professional tone


## Example Context

The writer agent will receive contextual information (e.g., user profile, preferences, data) and must produce output that fully satisfies all requirements. The grader will evaluate strictly against these criteria.
