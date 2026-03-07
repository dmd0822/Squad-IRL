# Home Maintenance Scheduler

> Generate yearly home maintenance calendar with seasonal tasks

## Who This Is For

🏠 Homeowners

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| Handyman | Writer | Domain expert for home maintenance scheduler |
| Inspector | Grader | Domain expert for home maintenance scheduler |
| Planner | Updater | Domain expert for home maintenance scheduler |

## How It Works

1. **Write** — Handyman reads `spec.md` and produces the first draft
2. **Grade** — Inspector evaluates the output (1-100 score)
3. **Update** — If score < 90%, Planner improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
