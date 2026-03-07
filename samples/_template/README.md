# {{SAMPLE_NAME}}

> {{ONE_LINE_DESCRIPTION}}

## The Problem

{{DETAILED_PROBLEM_DESCRIPTION}}

## Who This Is For

{{TARGET_AUDIENCE}}

## What the Squad Does

This sample creates a team of AI agents that work together to {{WHAT_THEY_DO}}.

### The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| {{AGENT_1}} | Writer | {{WHAT_AGENT_1_DOES}} |
| {{AGENT_2}} | Grader | {{WHAT_AGENT_2_DOES}} |
| {{AGENT_3}} | Updater | {{WHAT_AGENT_3_DOES}} |

## How It Works

1. **Write** — The Writer agent reads `spec.md` and produces the first draft
2. **Grade** — The Grader agent evaluates the output (1-100 score)
3. **Update** — If score < 90%, the Updater agent improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory:
- `draft-v{N}.md` — Each iteration's draft
- `grade-v{N}.md` — Each iteration's grade
- `final-report.md` — Summary of the review loop
