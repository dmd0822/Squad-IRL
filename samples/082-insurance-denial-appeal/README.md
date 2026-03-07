# Insurance Denial Appeal

> Draft medical insurance denial appeals with supporting documentation

## Who This Is For

🏥 Healthcare/Everyone

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| AdvocateBot | Writer | Domain expert for insurance denial appeal |
| PolicyExpert | Grader | Domain expert for insurance denial appeal |
| AppealWriter | Updater | Domain expert for insurance denial appeal |

## How It Works

1. **Write** — AdvocateBot reads `spec.md` and produces the first draft
2. **Grade** — PolicyExpert evaluates the output (1-100 score)
3. **Update** — If score < 90%, AppealWriter improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
