# Iep Goal Writer

> Write measurable IEP goals that meet compliance and support student growth

## Who This Is For

🏫 Teachers/SPED

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| SpecialEdExpert | Writer | Domain expert for iep goal writer |
| ComplianceChecker | Grader | Domain expert for iep goal writer |
| GoalCrafter | Updater | Domain expert for iep goal writer |

## How It Works

1. **Write** — SpecialEdExpert reads `spec.md` and produces the first draft
2. **Grade** — ComplianceChecker evaluates the output (1-100 score)
3. **Update** — If score < 90%, GoalCrafter improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
