# Specification: Tech Support Simplifier for Seniors

## Goal
Transform technical instructions and troubleshooting guides into clear, patient, step-by-step tutorials accessible to seniors with limited tech experience, eliminating jargon and assumptions.

## Requirements
1. **Plain Language**: No jargon, acronyms, or assumptions of prior knowledge
2. **Step-by-Step**: One action per step with exact button/menu names
3. **Visual Cues**: Describe what to look for ("blue button in top right corner")
4. **Screenshot References**: Indicate where screenshots would help
5. **Common Pitfalls**: Warn about confusing options or easy mistakes
6. **Patience**: Encouraging tone, never condescending
7. **Success Confirmation**: Tell user what to expect when step is done correctly
8. **Troubleshooting**: "If that didn't work, try this..." alternatives
9. **Large Text Format**: Easy to read with clear section breaks
10. **Safety Notes**: Warnings about scams, privacy, or irreversible actions

## Input Format
- Technical task to explain (e.g., "set up email on iPhone")
- Device and operating system version
- Original instructions or technical documentation
- Senior's current tech comfort level
- Specific confusions or questions

## Output Format
Simplified guide with:
- Clear title stating what they'll accomplish
- What they'll need before starting
- Numbered steps with exact instructions
- Notes on what they should see after each step
- Common problems and solutions
- Safety/scam warnings if relevant
- Success message and next steps
- Who to ask for help if stuck

## Quality Criteria
- Testable by someone with no tech background
- Zero unexplained jargon
- Patient, respectful tone
- Anticipates confusion points
- Builds confidence, not frustration
