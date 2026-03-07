# Jet Lag Minimizer

> Create pre-trip schedules to minimize jet lag with sleep/light exposure timing

## Who This Is For

✈️ Travelers

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| SleepScientist | Writer | Domain expert for jet lag minimizer |
| Scheduler | Grader | Domain expert for jet lag minimizer |
| TimezoneCalculator | Updater | Domain expert for jet lag minimizer |

## How It Works

1. **Write** — SleepScientist reads `spec.md` and produces the first draft
2. **Grade** — Scheduler evaluates the output (1-100 score)
3. **Update** — If score < 90%, TimezoneCalculator improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
