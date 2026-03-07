# Commission Quote Calculator

> Calculate project quotes that account for time, materials, and experience

## Who This Is For

🎨 Artists

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| Pricer | Writer | Domain expert for commission quote calculator |
| TimeEstimator | Grader | Domain expert for commission quote calculator |
| ValueCommunicator | Updater | Domain expert for commission quote calculator |

## How It Works

1. **Write** — Pricer reads `spec.md` and produces the first draft
2. **Grade** — TimeEstimator evaluates the output (1-100 score)
3. **Update** — If score < 90%, ValueCommunicator improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
