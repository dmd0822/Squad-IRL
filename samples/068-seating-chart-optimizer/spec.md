# Specification: Seating Chart Optimizer

## Goal
Create event seating arrangements that maximize guest comfort and enjoyment while minimizing social friction, accommodating special needs, and respecting relationship dynamics.

## Requirements
1. **Guest Relationships**: Map friendships, conflicts, family dynamics, and preferences
2. **Constraint Satisfaction**: Account for physical needs (accessibility, child seating, elderly)
3. **Conversation Compatibility**: Group people with shared interests or compatible personalities
4. **Conflict Avoidance**: Separate guests with known tensions or awkward history
5. **Social Mixing**: Balance familiar groups with opportunities for new connections
6. **VIP Placement**: Strategic seating for honored guests, speakers, or hosts
7. **Table Capacity**: Respect venue's table sizes and room layout
8. **Optimize Flow**: Consider proximity to entrances, restrooms, dance floor
9. **Cultural Sensitivity**: Honor cultural or religious seating customs
10. **Flexibility**: Provide alternatives if constraints are impossible to satisfy

## Input Format
- Guest list with relationships and notes
- Table count and sizes (e.g., 10 tables of 8)
- Known conflicts or must-sit-together groups
- Special needs (wheelchair access, child supervision)
- VIP guests and their preferences
- Venue layout (optional)

## Output Format
Seating chart with:
- Table assignments for each guest
- Table-by-table guest lists
- Rationale for key placement decisions
- Flagged potential issues (unavoidable minor conflicts)
- Visual diagram (text-based or ASCII)
- Alternative arrangements if needed
- Notes for hosts on sensitive placements

## Quality Criteria
- No major conflicts seated together
- Balanced social dynamics at each table
- Special needs accommodated
- Guests feel valued by placement
- Practical to implement
