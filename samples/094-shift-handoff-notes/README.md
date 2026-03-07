# Shift Handoff Notes

> Create comprehensive shift handoff notes for patient continuity

## Who This Is For

🏥 Healthcare

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| Nurse | Writer | Domain expert for shift handoff notes |
| DetailCapture | Grader | Domain expert for shift handoff notes |
| PriorityHighlighter | Updater | Domain expert for shift handoff notes |

## How It Works

1. **Write** — Nurse reads `spec.md` and produces the first draft
2. **Grade** — DetailCapture evaluates the output (1-100 score)
3. **Update** — If score < 90%, PriorityHighlighter improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
