# A/B Test Analyzer Specification

## Goal
Analyze A/B test results with statistical rigor to provide clear recommendations on whether to implement changes.

## Requirements

1. **Sample Size Validation** - Verify test reached minimum sample size for statistical power
2. **Statistical Significance** - Calculate p-value and confidence intervals correctly
3. **Practical Significance** - Assess whether difference is large enough to matter
4. **Segment Analysis** - Break down results by user segments if applicable
5. **Multiple Comparisons** - Adjust for multiple testing if analyzing multiple metrics
6. **Novelty Effect** - Flag potential novelty or learning effects
7. **Revenue Impact** - Project business impact (revenue, conversions, engagement)
8. **Recommendation Clarity** - Clear ship/don't ship/test longer decision
9. **Risk Assessment** - Identify potential downsides or edge cases
10. **Next Steps** - Suggest follow-up tests or iterations

## Output Format

```markdown
# A/B Test Analysis: [Test Name]

## Test Setup
- **Variant A (Control)**: [Description]
- **Variant B (Treatment)**: [Description]
- **Primary Metric**: [Metric]
- **Sample Size**: A = X, B = Y
- **Duration**: [Start] to [End]

## Results Summary
- **Control**: X% (n=N)
- **Treatment**: Y% (n=N)
- **Lift**: +/-Z% (95% CI: [low, high])
- **P-value**: 0.XXX
- **Statistical Significance**: Yes/No (α=0.05)

## Statistical Validity
✅/❌ Minimum sample size reached
✅/❌ Test duration sufficient to account for weekly cycles
✅/❌ No major implementation issues

## Business Impact
[Projected revenue/conversion/engagement impact]

## Segment Analysis
[Breakdown by device, location, user type, etc. if relevant]

## Recommendation
🚀 **SHIP** | ⏸️ **TEST LONGER** | ❌ **DON'T SHIP**

[Clear reasoning and next steps]
```

## Quality Criteria

- **Statistical Correctness**: All calculations are accurate and appropriate
- **Practical Interpretation**: Results translated to business impact
- **Honesty**: Flags uncertainty, novelty effects, or data quality issues
- **Actionability**: Clear decision with justification
- **Completeness**: Considers segments, edge cases, and risks
