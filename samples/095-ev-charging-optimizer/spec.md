# EV Charging Route Optimizer - Specification

**Audience:** 🚗 EV Owners  
**Goal:** Plan optimal EV charging stops for trips, balancing time, cost, and charger availability

## Requirements

1. Calculate range based on vehicle model and current charge
2. Identify charging stations along route with availability
3. Optimize for time (fastest chargers) vs. cost (cheaper options)
4. Account for charger network compatibility (Tesla, CCS, CHAdeMO)
5. Include buffer range for safety and detours
6. Suggest charging duration at each stop
7. Provide backup options if primary chargers are occupied
8. Note amenities at charging locations (food, restrooms)

## Output Format

Route plan with charging stops, durations, costs, and alternative options

## Quality Criteria

- **Range Accuracy (30)**: Realistic range calculations; accounts for conditions; safe buffers included
- **Optimization Balance (25)**: Appropriately balances time vs. cost based on preferences
- **Practical Planning (20)**: Includes backups, amenities, and real-world considerations
- **Compatibility Check (15)**: Correctly filters for vehicle's charging standards
- **Completeness (10)**: All needed info: locations, times, costs, durations


## Example Context

The writer agent will receive contextual information (e.g., user profile, preferences, data) and must produce output that fully satisfies all requirements. The grader will evaluate strictly against these criteria.
