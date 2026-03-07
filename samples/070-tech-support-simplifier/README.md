# Tech Support Simplifier

> Translate tech instructions into step-by-step guides with screenshots

## Who This Is For

👵 Seniors/Everyone

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| TechExplainer | Writer | Domain expert for tech support simplifier |
| PatientTeacher | Grader | Domain expert for tech support simplifier |
| JargonEliminator | Updater | Domain expert for tech support simplifier |

## How It Works

1. **Write** — TechExplainer reads `spec.md` and produces the first draft
2. **Grade** — PatientTeacher evaluates the output (1-100 score)
3. **Update** — If score < 90%, JargonEliminator improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
