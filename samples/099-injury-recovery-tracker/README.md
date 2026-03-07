# Injury Recovery Tracker

> Track rehab exercises and progress with return-to-activity timeline

## Who This Is For

🏃 Fitness/Health

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| PhysioGuide | Writer | Domain expert for injury recovery tracker |
| ProgressMonitor | Grader | Domain expert for injury recovery tracker |
| TimelineBuilder | Updater | Domain expert for injury recovery tracker |

## How It Works

1. **Write** — PhysioGuide reads `spec.md` and produces the first draft
2. **Grade** — ProgressMonitor evaluates the output (1-100 score)
3. **Update** — If score < 90%, TimelineBuilder improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
