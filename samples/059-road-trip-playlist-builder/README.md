# Road Trip Playlist Builder

> Curate road trip playlists that match journey pacing and passenger preferences

## Who This Is For

🚗 Travelers/Commuters

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| DJ | Writer | Domain expert for road trip playlist builder |
| MoodMatcher | Grader | Domain expert for road trip playlist builder |
| FlowBuilder | Updater | Domain expert for road trip playlist builder |

## How It Works

1. **Write** — DJ reads `spec.md` and produces the first draft
2. **Grade** — MoodMatcher evaluates the output (1-100 score)
3. **Update** — If score < 90%, FlowBuilder improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
