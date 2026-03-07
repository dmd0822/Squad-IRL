# Essay Polisher

> Transform rough drafts into polished essays that meet rubric requirements

## Who This Is For

🎓 Students

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| Editor | Writer | Domain expert for essay polisher |
| CriticBot | Grader | Domain expert for essay polisher |
| StyleGuide | Updater | Domain expert for essay polisher |

## How It Works

1. **Write** — Editor reads `spec.md` and produces the first draft
2. **Grade** — CriticBot evaluates the output (1-100 score)
3. **Update** — If score < 90%, StyleGuide improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
