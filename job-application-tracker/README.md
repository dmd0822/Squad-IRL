# Job Application Tracker

A Squad sample showing 5 AI agents managing a job search pipeline — Kanban board, follow-up coaching, interview prep, salary research, and offer comparison.

## Agents

| Agent | Role | What it does |
|-------|------|--------------|
| **Pipeline Manager** | Kanban Board | Maintains applications across stages: Applied → Phone Screen → Technical → Onsite → Offer → Accepted/Rejected |
| **Follow-up Coach** | Communication | Identifies stale applications, drafts follow-up emails with specific talking points |
| **Interview Prep** | Research | For upcoming interviews, generates 5 likely questions + talking points |
| **Salary Researcher** | Compensation | Analyzes comp data for each role — base, equity, bonus ranges by level and location |
| **Decision Advisor** | Strategy | Creates weighted comparison matrix across comp, growth, culture, commute, benefits |

## Data

- **8 job applications** across various companies and stages
- **Salary ranges** by role, level, and location
- **Supplier rankings** and interview question databases

## Run

```bash
npm install && npm start
```

No external APIs required — all data is generated internally.
