# Bedtime Story Generator

> Create custom bedtime stories featuring your kids as heroes

## Who This Is For

👩‍👧‍👦 Parents

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| Storyteller | Writer | Domain expert for bedtime story generator |
| MoralGuide | Grader | Domain expert for bedtime story generator |
| AgeAppropriateFilter | Updater | Domain expert for bedtime story generator |

## How It Works

1. **Write** — Storyteller reads `spec.md` and produces the first draft
2. **Grade** — MoralGuide evaluates the output (1-100 score)
3. **Update** — If score < 90%, AgeAppropriateFilter improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
