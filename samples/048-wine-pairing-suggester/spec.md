# Wine Pairing Suggester Specification

## Goal
Suggest wine pairings for meals with tasting notes, pairing rationale, and options across multiple price points.

## Requirements

1. **Meal Analysis** - Assess dominant flavors, richness, acidity, preparation method
2. **Primary Pairing** - Recommend ideal wine with specific varietal/region
3. **Alternative Options** - Provide 2-3 alternatives at different price points
4. **Pairing Rationale** - Explain why each pairing works (complement vs. contrast)
5. **Tasting Notes** - Describe wine's flavor profile in accessible language
6. **Serving Guidance** - Include serving temperature and glassware
7. **Food Adjustments** - Suggest minor meal tweaks to enhance pairing
8. **Budget Flexibility** - Provide options from $10-$15, $20-$30, $40+
9. **Availability Notes** - Mention widely available bottles when possible
10. **Non-Wine Options** - Include beer or cocktail alternatives for variety

## Output Format

```markdown
# Wine Pairing for [Meal]

## Meal Profile
**Dominant Flavors**: [e.g., umami, acidic, rich, spicy]
**Richness Level**: Light/Medium/Heavy
**Key Ingredients**: [Main proteins, sauces, preparation]

## 🍷 Primary Pairing
**Wine**: [Varietal, Region, Vintage if relevant]
**Price Range**: $$
**Why It Works**: [Complement or contrast explanation]
**Tasting Notes**: [Flavor profile in plain language]
**Serving**: [Temperature, glass type]
**Try**: [2-3 widely available bottles]

## Alternative Pairings

### Budget-Friendly ($10-15)
**Wine**: [Option]
[Same details as primary]

### Mid-Range ($20-30)
**Wine**: [Option]

### Splurge ($40+)
**Wine**: [Option]

## Pro Tips
- [Food adjustment to enhance pairing]
- [What to avoid]
- [Serving suggestions]

## Non-Wine Options
[Beer or cocktail alternatives that work]
```

## Quality Criteria

- **Accuracy**: Pairings follow established somm principles (acid, tannin, weight)
- **Accessibility**: Language is approachable, not pretentious
- **Practicality**: Suggested bottles are findable in decent wine shops
- **Flexibility**: Options across budget and taste preferences
- **Education**: Readers learn pairing principles, not just specific wines
