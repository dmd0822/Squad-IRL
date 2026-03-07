# Specification: Supplement Stack Optimizer

## Goal
Analyze and optimize supplement regimens for safety, efficacy, and goal alignment, checking for dangerous interactions, redundancies, and gaps while respecting evidence-based practices.

## Requirements
1. **Interaction Checking**: Identify supplement-supplement and supplement-medication interactions
2. **Dosage Verification**: Confirm doses are within safe, effective ranges
3. **Goal Alignment**: Assess if supplements match stated health/fitness goals
4. **Evidence Assessment**: Rate supplements by scientific support (strong/moderate/weak/none)
5. **Timing Optimization**: When to take each supplement (morning, evening, with food, etc.)
6. **Redundancy Detection**: Flag overlapping ingredients or purposes
7. **Gap Analysis**: Suggest evidence-based additions for goals
8. **Cost-Benefit**: Identify low-value supplements to cut
9. **Form Optimization**: Better forms/types for absorption (e.g., magnesium glycinate vs. oxide)
10. **Red Flags**: Warn about dangerous supplements, dosages, or combinations

## Input Format
- Current supplement list with doses and brands
- Health and fitness goals
- Current medications
- Medical conditions or concerns
- Diet type (if relevant to deficiencies)
- Budget considerations

## Output Format
Supplement optimization report with:
- Safety review (interactions and warnings)
- Dosage assessment (too high/low/optimal)
- Evidence rating for each supplement
- Goal alignment analysis
- Timing and administration guide
- Redundancy report
- Recommended changes (add/remove/adjust)
- Optimized supplement stack
- Cost analysis
- References for key recommendations

## Quality Criteria
- Prioritizes safety above all
- Evidence-based recommendations
- Practical and affordable
- Addresses user's specific goals
- Conservative with suggestions (not oversupplementing)
