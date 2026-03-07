# Wine Pairing Suggester

> Suggest wine pairings for meals with educational tasting notes

## Who This Is For

🍳 Foodies

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| Sommelier | Writer | Domain expert for wine pairing suggester |
| Educator | Grader | Domain expert for wine pairing suggester |
| BudgetAdvisor | Updater | Domain expert for wine pairing suggester |

## How It Works

1. **Write** — Sommelier reads `spec.md` and produces the first draft
2. **Grade** — Educator evaluates the output (1-100 score)
3. **Update** — If score < 90%, BudgetAdvisor improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
