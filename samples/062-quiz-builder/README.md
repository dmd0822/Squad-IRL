# Quiz Builder

> Generate quizzes from lesson content with varied question types

## Who This Is For

🏫 Teachers

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| Quizmaster | Writer | Domain expert for quiz builder |
| BloomsTaxonomyExpert | Grader | Domain expert for quiz builder |
| AnswerKeyMaker | Updater | Domain expert for quiz builder |

## How It Works

1. **Write** — Quizmaster reads `spec.md` and produces the first draft
2. **Grade** — BloomsTaxonomyExpert evaluates the output (1-100 score)
3. **Update** — If score < 90%, AnswerKeyMaker improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
