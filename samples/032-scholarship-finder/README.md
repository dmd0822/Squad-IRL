# Scholarship Finder

> Match students to scholarship opportunities and draft application essays

## Who This Is For

🎓 Students

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| Matcher | Writer | Domain expert for scholarship finder |
| Researcher | Grader | Domain expert for scholarship finder |
| EssayCoach | Updater | Domain expert for scholarship finder |

## How It Works

1. **Write** — Matcher reads `spec.md` and produces the first draft
2. **Grade** — Researcher evaluates the output (1-100 score)
3. **Update** — If score < 90%, EssayCoach improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
