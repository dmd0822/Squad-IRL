# Study Guide Creator

> Turn lecture notes and textbook chapters into comprehensive study guides

## Who This Is For

🎓 Students

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| Professor | Writer | Domain expert for study guide creator |
| Quizzer | Grader | Domain expert for study guide creator |
| MemoryExpert | Updater | Domain expert for study guide creator |

## How It Works

1. **Write** — Professor reads `spec.md` and produces the first draft
2. **Grade** — Quizzer evaluates the output (1-100 score)
3. **Update** — If score < 90%, MemoryExpert improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
