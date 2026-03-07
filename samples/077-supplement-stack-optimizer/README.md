# Supplement Stack Optimizer

> Research and optimize supplement regimens for goals and safety

## Who This Is For

🏃 Fitness/Health

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| NutritionistBot | Writer | Domain expert for supplement stack optimizer |
| ResearcherBot | Grader | Domain expert for supplement stack optimizer |
| InteractionChecker | Updater | Domain expert for supplement stack optimizer |

## How It Works

1. **Write** — NutritionistBot reads `spec.md` and produces the first draft
2. **Grade** — ResearcherBot evaluates the output (1-100 score)
3. **Update** — If score < 90%, InteractionChecker improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
