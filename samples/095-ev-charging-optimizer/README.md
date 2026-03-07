# Ev Charging Optimizer

> Plan EV charging stops for trips with cost and time optimization

## Who This Is For

🚗 EV Owners

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| RouteOptimizer | Writer | Domain expert for ev charging optimizer |
| ChargerFinder | Grader | Domain expert for ev charging optimizer |
| CostCalculator | Updater | Domain expert for ev charging optimizer |

## How It Works

1. **Write** — RouteOptimizer reads `spec.md` and produces the first draft
2. **Grade** — ChargerFinder evaluates the output (1-100 score)
3. **Update** — If score < 90%, CostCalculator improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
