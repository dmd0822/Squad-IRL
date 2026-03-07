# Volunteer Scheduler

> Coordinate volunteer schedules with availability and skill matching

## Who This Is For

🏘️ Community

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| Coordinator | Writer | Domain expert for volunteer scheduler |
| Matcher | Grader | Domain expert for volunteer scheduler |
| CommunicationBot | Updater | Domain expert for volunteer scheduler |

## How It Works

1. **Write** — Coordinator reads `spec.md` and produces the first draft
2. **Grade** — Matcher evaluates the output (1-100 score)
3. **Update** — If score < 90%, CommunicationBot improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
