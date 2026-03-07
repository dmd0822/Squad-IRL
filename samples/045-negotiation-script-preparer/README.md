# Negotiation Script Preparer

> Prepare for salary/price negotiations with scripts and counterargument prep

## Who This Is For

Everyone

## The Team

| Agent | Role | What They Do |
|-------|------|-------------|
| Negotiator | Writer | Domain expert for negotiation script preparer |
| ResearchBot | Grader | Domain expert for negotiation script preparer |
| ConfidenceBuilder | Updater | Domain expert for negotiation script preparer |

## How It Works

1. **Write** — Negotiator reads `spec.md` and produces the first draft
2. **Grade** — ResearchBot evaluates the output (1-100 score)
3. **Update** — If score < 90%, ConfidenceBuilder improves the output
4. **Repeat** — Loop continues until quality threshold is met

## Running This Sample

```bash
npm install
npm start
```

## Output

Results are saved in the `output/` directory.
