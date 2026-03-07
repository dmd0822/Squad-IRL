# Portfolio Rebalancer — Specification

## Goal
Analyze current investment holdings against target allocation and recommend specific trades to rebalance, considering tax implications.

## Target Audience
DIY investors

## Requirements
1. Current vs target allocation comparison by asset class
2. Drift analysis showing which positions are over/underweight
3. Specific trade recommendations (buy/sell X shares of Y)
4. Tax-loss harvesting opportunities identified
5. Wash sale rule compliance check
6. Impact of recommended trades on overall allocation
7. Transaction cost estimates
8. Rebalancing frequency recommendation

## Output Format
Allocation snapshot, drift analysis table, recommended trades with rationale, tax considerations, and projected post-rebalance allocation

## Quality Criteria
- Math is precise
- Tax implications considered
- Trade sizes are practical
- Target allocation achieved within 2%
