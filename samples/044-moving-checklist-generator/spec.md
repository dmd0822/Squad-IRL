# Moving Checklist Generator Specification

## Goal
Generate a comprehensive, timeline-based moving checklist customized to the user's move date, distance, and household complexity.

## Requirements

1. **Timeline Customization** - Checklist spans 8 weeks before move to 2 weeks after, adjusted to user's move date
2. **Distance Adaptation** - Tasks differ for local vs. long-distance vs. international moves
3. **Household Complexity** - Adjust for apartment vs. house, number of bedrooms, kids, pets
4. **Category Organization** - Group tasks by: Admin/Legal, Utilities, Packing, Cleaning, Moving Day, Post-Move
5. **Priority Tagging** - Mark tasks as Critical, Important, or Nice-to-Have
6. **Lead Time Warnings** - Flag tasks requiring advance booking (movers, storage, etc.)
7. **Hidden Tasks** - Include often-forgotten tasks (change voter registration, pet records, etc.)
8. **Cost Estimates** - Provide ballpark costs for major expenses (movers, supplies, deposits)
9. **Digital/Physical Split** - Separate digital tasks (address changes) from physical (packing)
10. **Emergency Plan** - Include moving day essentials box and troubleshooting tips

## Output Format

```markdown
# Moving Checklist - [From] to [To] on [Date]

## 8 Weeks Before
### Admin & Legal
- [ ] 🔴 Task (Est. cost, lead time needed)
### Packing & Decluttering
- [ ] 🟡 Task

## 6 Weeks Before
...

## Moving Day
### Morning
- [ ] 🔴 Critical task
### During Move
...

## Week 1 After Move
...

## Moving Day Essentials Box
[List of items to keep with you]

## Common Pitfalls & Solutions
[Top 5 things people forget + fixes]
```

## Quality Criteria

- **Completeness**: Covers all major and minor moving tasks
- **Customization**: Reflects user's specific move type and household
- **Timing**: Tasks are sequenced logically with appropriate lead times
- **Practicality**: Estimates and advice match real-world moving experiences
- **Stress Reduction**: Organization reduces overwhelm through clear structure
