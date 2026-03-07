# Fitness Progress Reporter

> Generate weekly fitness progress reports with insights and adjustments

## Who This Is For

🏃 Fitness

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| Analyst | Writer | Domain expert for fitness progress reporter |
| Motivator | Grader | Domain expert for fitness progress reporter |
| ProgramAdjuster | Updater | Domain expert for fitness progress reporter |

## How It Works

1. **Write** — Analyst reads `spec.md` and produces the first draft
2. **Grade** — Motivator evaluates the output (1-100 score)
3. **Update** — If score < 90%, ProgramAdjuster improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
