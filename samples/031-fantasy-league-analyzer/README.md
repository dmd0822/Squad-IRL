# Fantasy League Analyzer

> Weekly fantasy team analysis with trade suggestions and lineup optimization

## Who This Is For

🎮 Gamers/Sports

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| Scout | Writer | Domain expert for fantasy league analyzer |
| StatNerd | Grader | Domain expert for fantasy league analyzer |
| MatchupExpert | Updater | Domain expert for fantasy league analyzer |

## How It Works

1. **Write** — Scout reads `spec.md` and produces the first draft
2. **Grade** — StatNerd evaluates the output (1-100 score)
3. **Update** — If score < 90%, MatchupExpert improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
