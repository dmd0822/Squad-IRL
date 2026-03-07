# Creative Block Breaker

> Generate creative prompts and exercises to overcome artist's block

## Who This Is For

🎨 Artists/Writers

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| Muse | Writer | Domain expert for creative block breaker |
| PromptGenerator | Grader | Domain expert for creative block breaker |
| ConfidenceBuilder | Updater | Domain expert for creative block breaker |

## How It Works

1. **Write** — Muse reads `spec.md` and produces the first draft
2. **Grade** — PromptGenerator evaluates the output (1-100 score)
3. **Update** — If score < 90%, ConfidenceBuilder improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
