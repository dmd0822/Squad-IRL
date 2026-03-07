# Wedding Timeline Builder

> Create minute-by-minute wedding day schedules for all vendors

## Who This Is For

👰 Event Planners

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| Coordinator | Writer | Domain expert for wedding timeline builder |
| LogisticsExpert | Grader | Domain expert for wedding timeline builder |
| BufferBuilder | Updater | Domain expert for wedding timeline builder |

## How It Works

1. **Write** — Coordinator reads `spec.md` and produces the first draft
2. **Grade** — LogisticsExpert evaluates the output (1-100 score)
3. **Update** — If score < 90%, BufferBuilder improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
