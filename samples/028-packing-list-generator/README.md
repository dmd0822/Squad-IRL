# Packing List Generator

> Custom packing lists based on destination, duration, weather, and activities

## Who This Is For

✈️ Travelers

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| TravelPro | Writer | Domain expert for packing list generator |
| WeatherAnalyst | Grader | Domain expert for packing list generator |
| MinimalistCoach | Updater | Domain expert for packing list generator |

## How It Works

1. **Write** — TravelPro reads `spec.md` and produces the first draft
2. **Grade** — WeatherAnalyst evaluates the output (1-100 score)
3. **Update** — If score < 90%, MinimalistCoach improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
