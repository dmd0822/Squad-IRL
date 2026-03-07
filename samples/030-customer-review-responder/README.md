# Customer Review Responder

> Draft thoughtful responses to customer reviews (positive and negative)

## Who This Is For

🏪 Small Business

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| CustomerService | Writer | Domain expert for customer review responder |
| ToneManager | Grader | Domain expert for customer review responder |
| ProblemSolver | Updater | Domain expert for customer review responder |

## How It Works

1. **Write** — CustomerService reads `spec.md` and produces the first draft
2. **Grade** — ToneManager evaluates the output (1-100 score)
3. **Update** — If score < 90%, ProblemSolver improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
