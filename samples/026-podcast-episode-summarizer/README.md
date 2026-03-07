# Podcast Episode Summarizer

> Listen to podcasts and generate actionable summaries with timestamps

## Who This Is For

📱 Content/Everyone

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| Listener | Writer | Domain expert for podcast episode summarizer |
| KeyPointExtractor | Grader | Domain expert for podcast episode summarizer |
| ActionItemFinder | Updater | Domain expert for podcast episode summarizer |

## How It Works

1. **Write** — Listener reads `spec.md` and produces the first draft
2. **Grade** — KeyPointExtractor evaluates the output (1-100 score)
3. **Update** — If score < 90%, ActionItemFinder improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
