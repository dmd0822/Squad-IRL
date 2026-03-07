# Birthday Party Planner

> Plan kids' birthday parties with themes, activities, shopping lists, and timeline

## Who This Is For

👩‍👧‍👦 Parents

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| PartyPlanner | Writer | Domain expert for birthday party planner |
| ActivityExpert | Grader | Domain expert for birthday party planner |
| BudgetBoss | Updater | Domain expert for birthday party planner |

## How It Works

1. **Write** — PartyPlanner reads `spec.md` and produces the first draft
2. **Grade** — ActivityExpert evaluates the output (1-100 score)
3. **Update** — If score < 90%, BudgetBoss improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
