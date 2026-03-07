# Jet Lag Minimizer - Specification

**Audience:** ✈️ Travelers  
**Goal:** Create personalized jet lag mitigation schedules with sleep, light exposure, and activity timing

## Requirements

1. Calculate timezone shift and direction (east vs. west)
2. Provide pre-departure adjustment schedule (3-7 days before)
3. Detail sleep timing adjustments based on circadian science
4. Specify light exposure timing (bright light, darkness)
5. Include melatonin timing if appropriate
6. Schedule activities for the first 2-3 days at destination
7. Provide meal timing recommendations
8. Adjust for flight duration and layovers

## Output Format

Day-by-day schedule with sleep times, light exposure, activities, and supplement timing

## Quality Criteria

- **Scientific Accuracy (30)**: Based on circadian science; light/sleep timing is correct for direction
- **Practicality (25)**: Schedule is realistic and implementable for real travelers
- **Completeness (20)**: Covers pre-departure, flight, and arrival phases; includes all key factors
- **Personalization (15)**: Accounts for specific flight details and timezone math
- **Clarity (10)**: Easy to follow day-by-day; clear action items


## Example Context

The writer agent will receive contextual information (e.g., user profile, preferences, data) and must produce output that fully satisfies all requirements. The grader will evaluate strictly against these criteria.
