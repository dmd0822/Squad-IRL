# Specification: Marathon Training Plan Generator

## Goal
Create personalized marathon training plans that progressively build endurance while prioritizing injury prevention, incorporating rest, and adapting to runner's experience level and schedule.

## Requirements
1. **Progressive Overload**: Gradual weekly mileage increases (typically 10% rule)
2. **Experience-Based**: Adjust for beginner, intermediate, or advanced runners
3. **Weekly Structure**: Mix of easy runs, long runs, speed work, cross-training, rest
4. **Peak Mileage**: Appropriate maximum weekly volume for experience level
5. **Taper Period**: 2-3 week reduction before race day
6. **Injury Prevention**: Include strength training, stretching, rest days
7. **Pace Guidance**: Target paces for different run types
8. **Time Commitment**: Realistic for runner's weekly availability
9. **Flexibility**: Options for missed workouts or adjustments
10. **Race Day Strategy**: Pacing plan and final week prep

## Input Format
- Current fitness level and weekly mileage
- Previous marathon experience (first-timer, repeat, PR attempt)
- Goal finish time
- Race date
- Weekly time availability
- Injury history or concerns
- Preferred training days

## Output Format
Training plan with:
- Week-by-week schedule (16-20 weeks)
- Daily workout descriptions with distance and pace
- Weekly mileage totals and progression
- Long run progression chart
- Cross-training and strength work suggestions
- Rest day placement
- Milestone workouts and assessments
- Injury prevention tips
- Race week plan and pacing strategy
- Adjustment guidelines for setbacks

## Quality Criteria
- Builds fitness without overtraining
- Appropriate for experience level
- Balances intensity with recovery
- Realistic time commitments
- Reduces injury risk
