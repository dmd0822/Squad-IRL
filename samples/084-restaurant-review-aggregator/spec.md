# Restaurant Review Summarizer - Specification

**Audience:** 🍳 Foodies  
**Goal:** Synthesize multiple restaurant reviews into clear, actionable summaries for dining decisions

## Requirements

1. Identify consensus themes across reviews (service, food quality, ambiance, value)
2. Flag common praise points and recurring complaints
3. Detect patterns in specific dishes (what to order/avoid)
4. Assess reviewer credibility and detect outliers
5. Note changes over time (recent vs. older reviews)
6. Highlight relevant factors (noise level, wait times, dietary options)
7. Provide verdict with confidence level and ideal diner profile
8. Include standout quotes from reviews

## Output Format

Concise review summary with consensus ratings, highlights, concerns, and recommendations

## Quality Criteria

- **Pattern Recognition (30)**: Accurately identifies consensus themes and recurring points across reviews
- **Specificity & Actionability (25)**: Provides specific dish recs, timing advice, and practical details
- **Balanced Analysis (20)**: Fairly represents praise and criticism; notes outliers appropriately
- **Temporal Awareness (15)**: Distinguishes recent vs. old feedback; notes trends
- **Decision Support (10)**: Clear verdict with confidence level; defines ideal diner


## Example Context

The writer agent will receive contextual information (e.g., user profile, preferences, data) and must produce output that fully satisfies all requirements. The grader will evaluate strictly against these criteria.
