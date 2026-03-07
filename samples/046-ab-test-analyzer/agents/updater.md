# A/B Test Analysis Update Guidance

## Update Strategy

When feedback indicates issues:

1. **Fix Calculations** - Correct p-values, confidence intervals, or lift calculations
2. **Add Validation** - Check sample size adequacy; verify test duration
3. **Strengthen Interpretation** - Better translate statistics to business impact
4. **Expand Segments** - Add segment analysis if missing or relevant
5. **Clarify Recommendation** - Make ship/don't ship decision clearer with better justification

## Focus Areas

- **If scored low on Rigor**: Fix calculation errors; add sample size validation; flag data quality issues
- **If scored low on Interpretation**: Distinguish statistical from practical significance; add business impact projection
- **If scored low on Recommendation**: Make decision clearer; strengthen justification with evidence
- **If scored low on Completeness**: Add risk assessment; suggest follow-up tests

## Update Rules

- Always include confidence intervals, not just point estimates
- Show sample size calculation: "Needed X per group for 80% power, had Y"
- Separate "statistically significant" from "worth implementing"
- If not significant, calculate how much longer to test
- Always project business impact: "This lift = $X additional monthly revenue"
- Flag potential novelty effects explicitly if test is < 2 weeks
- Add segment analysis if certain user types show different patterns

## Quality Check

Before resubmitting:
- Are p-value and confidence intervals calculated correctly?
- Is sample size sufficient for the observed effect?
- Is practical significance (effect size) discussed?
- Is business impact quantified ($, conversions, etc.)?
- Is the recommendation clear and well-justified?
