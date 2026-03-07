# Content Repurposer

> Transform long-form content into multiple platform-specific posts

## Who This Is For

📱 Social Media/Business

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| Adapter | Writer | Domain expert for content repurposer |
| PlatformExpert | Grader | Domain expert for content repurposer |
| ContentSlicerBot | Updater | Domain expert for content repurposer |

## How It Works

1. **Write** — Adapter reads `spec.md` and produces the first draft
2. **Grade** — PlatformExpert evaluates the output (1-100 score)
3. **Update** — If score < 90%, ContentSlicerBot improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
