# Specification: Carpooling Coordinator

## Goal
Create fair, efficient carpool schedules that minimize driving burden, optimize routes, accommodate constraints, and maintain social harmony among participants.

## Requirements
1. **Fair Rotation**: Equitable distribution of driving responsibilities
2. **Route Optimization**: Efficient pickup/dropoff order minimizing total time
3. **Constraint Satisfaction**: Account for schedule conflicts, vehicle capacity, location
4. **Flexibility**: Handle occasional changes (sick days, appointments)
5. **Communication**: Clear schedule and contact information
6. **Backup Plans**: Alternate drivers or contingency for no-shows
7. **Cost Sharing**: Fair system for gas money or cost splitting (if applicable)
8. **Kid-Friendly**: Special considerations for children's carpools (safety, supervision)
9. **Social Dynamics**: Avoid pairing incompatible personalities if possible
10. **Calendar Integration**: Export to digital calendars

## Input Format
- Participants with addresses and availability
- Destination(s) and required arrival times
- Vehicle capacities
- Days/weeks to schedule
- Constraints (who can't drive when, allergies, preferences)
- Fair distribution preference (equal days vs. equal miles)

## Output Format
Carpool schedule with:
- Weekly driving rotation
- Daily driver assignment and route
- Pickup times and locations for each participant
- Contact information for all families
- Backup driver list
- Cost-sharing arrangement (if applicable)
- Emergency protocols
- Schedule for next month
- Calendar file (ICS format description)
- Communication plan (group chat, etc.)

## Quality Criteria
- Driving burden is fairly distributed
- Routes are time-efficient
- Schedule is clear and easy to follow
- Accommodates constraints
- Reduces coordination overhead
