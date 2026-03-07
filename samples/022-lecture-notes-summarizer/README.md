# Lecture Notes Summarizer

> Convert messy lecture notes into organized study material with key concepts

## Who This Is For

🎓 Students

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| Librarian | Writer | Domain expert for lecture notes summarizer |
| ConceptExtractor | Grader | Domain expert for lecture notes summarizer |
| QuizMaker | Updater | Domain expert for lecture notes summarizer |

## How It Works

1. **Write** — Librarian reads `spec.md` and produces the first draft
2. **Grade** — ConceptExtractor evaluates the output (1-100 score)
3. **Update** — If score < 90%, QuizMaker improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
