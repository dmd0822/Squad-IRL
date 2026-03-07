# Meeting Recap Generator

A Squad sample showing 5 AI agents processing a simulated 45-minute meeting transcript to produce actionable output — speaker analysis, decisions, action items, summary, and follow-up email.

## Agents

| Agent | Role | What it does |
|-------|------|--------------|
| **Transcript Analyzer** | Speaker Analysis | Identifies speakers, calculates talk-time percentages, maps topic segments |
| **Decision Extractor** | Decision Finder | Finds all decisions made, with who proposed and who approved |
| **Action Item Generator** | Task Extraction | Extracts action items with assignee, deadline, and priority |
| **Summary Writer** | Executive Summary | Creates 3-paragraph summary + 1-sentence TL;DR |
| **Follow-up Drafter** | Communication | Generates a follow-up email ready to send to all attendees |

## Data

- **Simulated 45-minute meeting** — Q3 Product Planning meeting with 5 participants
- **42 transcript entries** across topics: roadmap review, budget, hiring, launch timeline, customer feedback

## Run

```bash
npm install && npm start
```

No external APIs required — all data is generated internally.
