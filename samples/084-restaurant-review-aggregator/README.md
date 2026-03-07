# Restaurant Review Aggregator

> Summarize restaurant reviews into decision-making guides

## Who This Is For

🍳 Foodies

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| ReviewReader | Writer | Domain expert for restaurant review aggregator |
| TrendSpotter | Grader | Domain expert for restaurant review aggregator |
| RecommendationEngine | Updater | Domain expert for restaurant review aggregator |

## How It Works

1. **Write** — ReviewReader reads `spec.md` and produces the first draft
2. **Grade** — TrendSpotter evaluates the output (1-100 score)
3. **Update** — If score < 90%, RecommendationEngine improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
