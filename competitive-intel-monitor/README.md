# Competitive Intel Monitor

A Squad sample showing 6 AI agents monitoring 4 competitors and producing a competitive intelligence briefing with positioning maps, sentiment analysis, and threat ratings.

## Agents

| Agent | Role | What it does |
|-------|------|--------------|
| **Product Scanner** | Feature Tracker | Tracks feature releases and changelog entries across competitors |
| **Pricing Analyst** | Cost Analysis | Compares pricing tiers, calculates price-per-feature ratios |
| **Review Miner** | Sentiment Analysis | Analyzes customer review sentiment with positive/negative/neutral breakdown |
| **Social Listener** | Social Intel | Tracks social media mentions, identifies trending topics |
| **Market Positioner** | Strategic Mapping | Creates 2D positioning map (price vs features) as ASCII scatter plot |
| **Briefing Writer** | Executive Summary | Synthesizes all intel into a briefing with threat/opportunity ratings |

## Data

- **4 competitors** — CompeteX, RivalTech, MarketEdge, StartupZ
- **Your company** — OurProduct (the reference point)
- Feature lists, pricing tiers, customer reviews, social mentions

## Run

```bash
npm install && npm start
```

No external APIs required — all data is generated internally.
