# Carpooling Coordinator

> Organize carpool schedules that balance fairness and logistics

## Who This Is For

🚗 Commuters/Parents

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| Scheduler | Writer | Domain expert for carpooling coordinator |
| RouteOptimizer | Grader | Domain expert for carpooling coordinator |
| FairnessJudge | Updater | Domain expert for carpooling coordinator |

## How It Works

1. **Write** — Scheduler reads `spec.md` and produces the first draft
2. **Grade** — RouteOptimizer evaluates the output (1-100 score)
3. **Update** — If score < 90%, FairnessJudge improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
