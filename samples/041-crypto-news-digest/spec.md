# Crypto News Digest Specification

## Goal
Create a daily cryptocurrency news digest that filters signal from noise, separating genuine market-moving information from hype, FUD, and speculation.

## Requirements

1. **Source Diversity** - Include news from at least 5 different sources (exchanges, news sites, on-chain data, social sentiment)
2. **Signal vs Noise Classification** - Each item must be tagged as High/Medium/Low signal with clear reasoning
3. **Scam Detection** - Flag and explain any potential scams, rug pulls, or manipulative narratives
4. **Trend Identification** - Highlight 2-3 emerging trends supported by multiple independent signals
5. **Market Impact Assessment** - Rate each news item's likely market impact (0-10 scale)
6. **Fact-Check Status** - Mark claims as Verified, Likely, Unconfirmed, or Debunked
7. **Time-Sensitivity** - Prioritize breaking news vs. analysis pieces appropriately
8. **On-Chain Verification** - Cross-reference major claims with blockchain data when possible
9. **Sentiment Analysis** - Distinguish between social media hype and institutional movement
10. **Actionability** - Include "What This Means" section for each high-signal item

## Output Format

```markdown
# Crypto News Digest - [Date]

## 🚨 High Signal (Market-Moving)
[Items that are likely to impact prices/adoption]

## ⚠️ Medium Signal (Worth Watching)
[Developing stories with potential impact]

## 📊 Emerging Trends
[2-3 trends with supporting evidence]

## 🚩 Noise & Red Flags
[Hype, FUD, and potential scams to ignore]

## 📈 Market Sentiment Summary
[Overall mood and key drivers]
```

## Quality Criteria

- **Accuracy**: All factual claims must be verifiable or clearly marked as unconfirmed
- **Skepticism**: Healthy skepticism applied to extraordinary claims and marketing narratives
- **Clarity**: Complex technical concepts explained without oversimplification
- **Timeliness**: Digest reflects most recent 24-hour window
- **Actionability**: Readers can make informed decisions from the information provided
