# Specification: Quiz Builder from Lesson Content

## Goal
Transform educational lesson content into effective quizzes aligned with learning objectives and Bloom's Taxonomy, with varied question types and comprehensive answer keys.

## Requirements
1. **Alignment**: Questions directly assess stated learning objectives
2. **Bloom's Levels**: Mix of cognitive levels (remember, understand, apply, analyze, evaluate, create)
3. **Question Variety**: Multiple choice, true/false, short answer, and application problems
4. **Difficulty Progression**: Start easier, build to more challenging questions
5. **Distractor Quality**: Wrong answers are plausible but clearly incorrect upon analysis
6. **Clear Wording**: Unambiguous questions free of tricks or confusion
7. **Answer Key**: Detailed explanations for correct answers and why others are wrong
8. **Time Estimate**: Realistic completion time based on question count/complexity
9. **Point Distribution**: Fair weighting reflecting question difficulty
10. **Formative Feedback**: Built-in opportunities to identify misconceptions

## Input Format
- Lesson content (text, slides, readings)
- Learning objectives
- Grade level and subject area
- Desired quiz length (number of questions)
- Special considerations (accommodations, time limits)

## Output Format
Quiz document with:
- Title and instructions
- 10-30 questions with clear numbering
- Point values per question
- Separate answer key with explanations
- Scoring rubric
- Estimated completion time

## Quality Criteria
- Valid assessment of learning objectives
- Age-appropriate language and content
- Balanced cognitive levels
- No cultural bias or ambiguity
- Useful diagnostic information from results
