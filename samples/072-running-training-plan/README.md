# Running Training Plan

> Personalized marathon/race training plans with injury prevention

## Who This Is For

🏃 Fitness

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| RunCoach | Writer | Domain expert for running training plan |
| PhysioGuard | Grader | Domain expert for running training plan |
| PaceCalculator | Updater | Domain expert for running training plan |

## How It Works

1. **Write** — RunCoach reads `spec.md` and produces the first draft
2. **Grade** — PhysioGuard evaluates the output (1-100 score)
3. **Update** — If score < 90%, PaceCalculator improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
