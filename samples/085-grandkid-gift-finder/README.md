# Grandkid Gift Finder

> Suggest age-appropriate gifts for grandchildren based on trends and interests

## Who This Is For

👵 Seniors

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| GiftExpert | Writer | Domain expert for grandkid gift finder |
| TrendWatcher | Grader | Domain expert for grandkid gift finder |
| AgeAppropriateFilter | Updater | Domain expert for grandkid gift finder |

## How It Works

1. **Write** — GiftExpert reads `spec.md` and produces the first draft
2. **Grade** — TrendWatcher evaluates the output (1-100 score)
3. **Update** — If score < 90%, AgeAppropriateFilter improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
