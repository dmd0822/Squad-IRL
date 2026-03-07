# Recipe Scaler

> Scale recipes up/down and adjust cooking times/temps accordingly

## Who This Is For

🍳 Foodies

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| Chef | Writer | Domain expert for recipe scaler |
| MathWiz | Grader | Domain expert for recipe scaler |
| TimingExpert | Updater | Domain expert for recipe scaler |

## How It Works

1. **Write** — Chef reads `spec.md` and produces the first draft
2. **Grade** — MathWiz evaluates the output (1-100 score)
3. **Update** — If score < 90%, TimingExpert improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
