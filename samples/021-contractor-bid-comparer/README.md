# Contractor Bid Comparer

> Analyze multiple contractor quotes and flag red flags or missing items

## Who This Is For

🏠 Homeowners

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| Inspector | Writer | Domain expert for contractor bid comparer |
| PriceAnalyst | Grader | Domain expert for contractor bid comparer |
| RedFlagDetector | Updater | Domain expert for contractor bid comparer |

## How It Works

1. **Write** — Inspector reads `spec.md` and produces the first draft
2. **Grade** — PriceAnalyst evaluates the output (1-100 score)
3. **Update** — If score < 90%, RedFlagDetector improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
