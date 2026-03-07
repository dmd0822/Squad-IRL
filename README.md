# 100 Ways to Use Squad

> Real-world AI automation for real people. No coding problems. Just life problems, solved.

## What Is This?

100 ready-to-run samples showing how [Squad SDK](https://www.npmjs.com/package/@bradygaster/squad-sdk) can automate the things that eat your time. Each sample creates a team of AI agents that collaborate, grade their own work, and iterate until the output is genuinely good.

**Not a single coding problem in sight.** These are for parents, teachers, investors, artists, students, pet owners, foodies, gamers, travelers, and everyone in between.

## The Pattern

Every sample follows the same proven loop:

```
📝 Writer Agent → reads a spec, produces first draft
📊 Grader Agent → evaluates output quality (1-100 score)
🔄 Updater Agent → improves output if grade < 90%
🔁 Repeat until quality threshold is met
```

This is the secret sauce: **self-improving AI teams** that don't stop until the work is actually good.

## Quick Start

```bash
# Pick any sample
cd samples/001-meal-prep-squad

# Install dependencies
npm install

# Run it
npm start
```

## The Samples

### 👩‍👧‍👦 Family & Parenting
| # | Sample | What It Does |
|---|--------|-------------|
| 001 | [meal-prep-squad](samples/001-meal-prep-squad/) | Weekly meal planning with nutrition, budget, and picky eaters |
| 010 | [bedtime-story-generator](samples/010-bedtime-story-generator/) | Custom bedtime stories featuring your kids as heroes |
| 050 | [birthday-party-planner](samples/050-birthday-party-planner/) | Kids' party planning: themes, activities, shopping lists |
| 053 | [screen-time-negotiator](samples/053-screen-time-negotiator/) | Fair screen time agreements that kids actually accept |
| 057 | [chore-chart-builder](samples/057-chore-chart-builder/) | Age-appropriate chore systems with rewards |
| 083 | [kids-allowance-manager](samples/083-kids-allowance-manager/) | Allowance systems that teach financial responsibility |

### 💰 Finance & Investing
| # | Sample | What It Does |
|---|--------|-------------|
| 002 | [expense-categorizer](samples/002-expense-categorizer/) | Auto-categorize monthly spending from bank exports |
| 008 | [portfolio-rebalancer](samples/008-portfolio-rebalancer/) | Analyze holdings, suggest trades for target allocation |
| 013 | [tax-deduction-finder](samples/013-tax-deduction-finder/) | Scan expenses, find missed deductions and credits |
| 019 | [budget-accountability-coach](samples/019-budget-accountability-coach/) | Weekly spending review with tough love |
| 025 | [stock-pitch-generator](samples/025-stock-pitch-generator/) | Research and write investment thesis documents |
| 041 | [crypto-news-digest](samples/041-crypto-news-digest/) | Daily crypto news filtering signal from noise |
| 052 | [rental-property-analyzer](samples/052-rental-property-analyzer/) | Evaluate rentals for ROI, cash flow, hidden costs |
| 065 | [debt-payoff-optimizer](samples/065-debt-payoff-optimizer/) | Optimized debt payoff plans (avalanche/snowball) |

### 🎓 Students & Education
| # | Sample | What It Does |
|---|--------|-------------|
| 003 | [essay-polisher](samples/003-essay-polisher/) | Transform rough drafts into polished essays |
| 004 | [job-application-tailor](samples/004-job-application-tailor/) | Customize resume and cover letter per job posting |
| 011 | [college-app-coach](samples/011-college-app-coach/) | Guide through college apps with timeline and essay help |
| 017 | [study-guide-creator](samples/017-study-guide-creator/) | Turn notes and chapters into study guides |
| 022 | [lecture-notes-summarizer](samples/022-lecture-notes-summarizer/) | Convert messy notes to organized study material |
| 032 | [scholarship-finder](samples/032-scholarship-finder/) | Match to scholarships and draft applications |
| 076 | [group-project-coordinator](samples/076-group-project-coordinator/) | Group project management with task delegation |
| 086 | [career-path-explorer](samples/086-career-path-explorer/) | Career path maps with skills and timelines |
| 093 | [dorm-shopping-list](samples/093-dorm-shopping-list/) | College dorm shopping with budget optimization |

### 🏫 Teachers & Educators
| # | Sample | What It Does |
|---|--------|-------------|
| 033 | [lesson-plan-generator](samples/033-lesson-plan-generator/) | Standards-aligned lesson plans with activities |
| 043 | [parent-email-drafter](samples/043-parent-email-drafter/) | Professional parent emails that build partnerships |
| 049 | [iep-goal-writer](samples/049-iep-goal-writer/) | Measurable IEP goals meeting compliance |
| 062 | [quiz-builder](samples/062-quiz-builder/) | Generate quizzes from lesson content |

### 🏠 Home & Living
| # | Sample | What It Does |
|---|--------|-------------|
| 009 | [home-maintenance-scheduler](samples/009-home-maintenance-scheduler/) | Yearly maintenance calendar with seasonal tasks |
| 021 | [contractor-bid-comparer](samples/021-contractor-bid-comparer/) | Analyze contractor quotes, flag red flags |
| 029 | [room-redesign-planner](samples/029-room-redesign-planner/) | Room makeover plans with layout and shopping list |
| 044 | [moving-checklist-generator](samples/044-moving-checklist-generator/) | Comprehensive moving checklist with timeline |
| 089 | [diy-project-sequencer](samples/089-diy-project-sequencer/) | DIY projects broken into steps with tools and time |
| 091 | [utility-cost-tracker](samples/091-utility-cost-tracker/) | Track utility costs, find savings opportunities |

### 🏃 Fitness & Health
| # | Sample | What It Does |
|---|--------|-------------|
| 006 | [workout-program-designer](samples/006-workout-program-designer/) | Personalized 12-week training plans |
| 055 | [meal-macro-calculator](samples/055-meal-macro-calculator/) | Calculate meal macros, suggest adjustments |
| 072 | [running-training-plan](samples/072-running-training-plan/) | Marathon training with injury prevention |
| 077 | [supplement-stack-optimizer](samples/077-supplement-stack-optimizer/) | Optimize supplement regimens for safety |
| 090 | [fitness-progress-reporter](samples/090-fitness-progress-reporter/) | Weekly fitness reports with insights |
| 099 | [injury-recovery-tracker](samples/099-injury-recovery-tracker/) | Rehab tracking with return-to-activity timeline |

### ✈️ Travel & Transport
| # | Sample | What It Does |
|---|--------|-------------|
| 007 | [itinerary-optimizer](samples/007-itinerary-optimizer/) | Day-by-day travel plans maximizing experiences |
| 028 | [packing-list-generator](samples/028-packing-list-generator/) | Custom packing lists by destination and weather |
| 059 | [road-trip-playlist-builder](samples/059-road-trip-playlist-builder/) | Road trip playlists matching journey pacing |
| 088 | [jet-lag-minimizer](samples/088-jet-lag-minimizer/) | Pre-trip jet lag schedules with sleep timing |
| 095 | [ev-charging-optimizer](samples/095-ev-charging-optimizer/) | EV charging stops with cost/time optimization |
| 096 | [visa-requirement-checker](samples/096-visa-requirement-checker/) | Visa requirements and application checklists |

### 🏪 Small Business
| # | Sample | What It Does |
|---|--------|-------------|
| 005 | [social-media-content-calendar](samples/005-social-media-content-calendar/) | 30 days of on-brand social posts |
| 015 | [newsletter-writer](samples/015-newsletter-writer/) | Transform updates into engaging newsletters |
| 027 | [product-description-generator](samples/027-product-description-generator/) | SEO-optimized product descriptions |
| 030 | [customer-review-responder](samples/030-customer-review-responder/) | Thoughtful responses to customer reviews |
| 038 | [invoice-follow-up-automator](samples/038-invoice-follow-up-automator/) | Polite but firm invoice follow-ups |
| 071 | [competitor-analysis-digest](samples/071-competitor-analysis-digest/) | Weekly competitor monitoring with insights |

### 🎨 Creative & Arts
| # | Sample | What It Does |
|---|--------|-------------|
| 024 | [grant-application-helper](samples/024-grant-application-helper/) | Compelling grants aligned with funder priorities |
| 042 | [closet-capsule-designer](samples/042-closet-capsule-designer/) | Minimalist capsule wardrobes from existing clothes |
| 051 | [artist-statement-generator](samples/051-artist-statement-generator/) | Compelling artist statements for galleries |
| 063 | [commission-quote-calculator](samples/063-commission-quote-calculator/) | Project quotes for time, materials, experience |
| 069 | [creative-block-breaker](samples/069-creative-block-breaker/) | Prompts and exercises to overcome artist's block |
| 081 | [portfolio-website-writer](samples/081-portfolio-website-writer/) | Compelling portfolio website copy |

### 🐕 Pet Owners
| # | Sample | What It Does |
|---|--------|-------------|
| 012 | [pet-health-tracker](samples/012-pet-health-tracker/) | Track vet visits, meds, generate prep notes |
| 040 | [dog-training-plan](samples/040-dog-training-plan/) | Personalized dog training for behavioral goals |
| 074 | [vet-appointment-prep](samples/074-vet-appointment-prep/) | Vet visit prep with symptom logs and questions |

### 🏥 Healthcare
| # | Sample | What It Does |
|---|--------|-------------|
| 058 | [patient-education-simplifier](samples/058-patient-education-simplifier/) | Medical jargon → patient-friendly materials |
| 082 | [insurance-denial-appeal](samples/082-insurance-denial-appeal/) | Insurance denial appeals with documentation |
| 094 | [shift-handoff-notes](samples/094-shift-handoff-notes/) | Comprehensive shift handoff for patient continuity |
| 100 | [medication-reminder-system](samples/100-medication-reminder-system/) | Medication schedules with reminders and refills |

### 🏘️ Community & Social
| # | Sample | What It Does |
|---|--------|-------------|
| 054 | [fundraiser-campaign-writer](samples/054-fundraiser-campaign-writer/) | Fundraiser stories that drive donations |
| 061 | [neighborhood-newsletter](samples/061-neighborhood-newsletter/) | Community newsletters from local happenings |
| 078 | [petition-drafter](samples/078-petition-drafter/) | Compelling petitions for local change |
| 079 | [carpooling-coordinator](samples/079-carpooling-coordinator/) | Carpool schedules balancing fairness |
| 098 | [volunteer-scheduler](samples/098-volunteer-scheduler/) | Volunteer schedules with skill matching |

### 🌱 Environmental
| # | Sample | What It Does |
|---|--------|-------------|
| 034 | [carbon-footprint-tracker](samples/034-carbon-footprint-tracker/) | Personal carbon footprint and reductions |
| 064 | [zero-waste-swap-finder](samples/064-zero-waste-swap-finder/) | Eco-friendly swaps for everyday items |
| 097 | [composting-guide-generator](samples/097-composting-guide-generator/) | Personalized composting guides |

### 📱 Social Media & Content
| # | Sample | What It Does |
|---|--------|-------------|
| 026 | [podcast-episode-summarizer](samples/026-podcast-episode-summarizer/) | Podcast summaries with timestamps |
| 047 | [stream-highlight-clipper](samples/047-stream-highlight-clipper/) | Highlight-worthy gaming stream moments |
| 060 | [instagram-caption-perfecter](samples/060-instagram-caption-perfecter/) | Scroll-stopping captions with hashtags |
| 067 | [influencer-outreach-drafter](samples/067-influencer-outreach-drafter/) | Personalized influencer partnership pitches |
| 087 | [content-repurposer](samples/087-content-repurposer/) | Long-form → platform-specific posts |

### 🍳 Food & Drink
| # | Sample | What It Does |
|---|--------|-------------|
| 018 | [recipe-scaler](samples/018-recipe-scaler/) | Scale recipes up/down, adjust times |
| 036 | [garden-planting-guide](samples/036-garden-planting-guide/) | Personalized garden plans by zone and space |
| 048 | [wine-pairing-suggester](samples/048-wine-pairing-suggester/) | Wine pairings for meals with tasting notes |
| 073 | [grocery-deals-finder](samples/073-grocery-deals-finder/) | Match grocery needs to local deals |
| 084 | [restaurant-review-aggregator](samples/084-restaurant-review-aggregator/) | Restaurant review summaries for decisions |

### 🎮 Gaming & Sports
| # | Sample | What It Does |
|---|--------|-------------|
| 031 | [fantasy-league-analyzer](samples/031-fantasy-league-analyzer/) | Fantasy team analysis with trade suggestions |
| 066 | [tournament-bracket-analyzer](samples/066-tournament-bracket-analyzer/) | Tournament matchup analysis with predictions |
| 080 | [strategy-guide-builder](samples/080-strategy-guide-builder/) | Comprehensive game strategy guides |

### 👵 Seniors & Retirement
| # | Sample | What It Does |
|---|--------|-------------|
| 023 | [memoir-ghostwriter](samples/023-memoir-ghostwriter/) | Interview-based memoir writing |
| 070 | [tech-support-simplifier](samples/070-tech-support-simplifier/) | Tech instructions → simple step-by-step guides |
| 075 | [estate-planning-checklist](samples/075-estate-planning-checklist/) | Comprehensive estate planning task list |
| 085 | [grandkid-gift-finder](samples/085-grandkid-gift-finder/) | Age-appropriate gifts based on trends |

### 👰 Events & Planning
| # | Sample | What It Does |
|---|--------|-------------|
| 014 | [thank-you-note-writer](samples/014-thank-you-note-writer/) | Personalized thank-you notes that feel genuine |
| 020 | [wedding-timeline-builder](samples/020-wedding-timeline-builder/) | Minute-by-minute wedding day schedules |
| 068 | [seating-chart-optimizer](samples/068-seating-chart-optimizer/) | Event seating charts minimizing drama |
| 092 | [vendor-contract-reviewer](samples/092-vendor-contract-reviewer/) | Review vendor contracts for red flags |

### Everyone
| # | Sample | What It Does |
|---|--------|-------------|
| 016 | [dating-profile-optimizer](samples/016-dating-profile-optimizer/) | Polish dating profiles authentically |
| 035 | [side-hustle-validator](samples/035-side-hustle-validator/) | Evaluate side business ideas for market fit |
| 037 | [meditation-script-writer](samples/037-meditation-script-writer/) | Custom guided meditation scripts |
| 039 | [book-club-discussion-guide](samples/039-book-club-discussion-guide/) | Discussion questions for book clubs |
| 045 | [negotiation-script-preparer](samples/045-negotiation-script-preparer/) | Salary/price negotiation scripts |
| 046 | [ab-test-analyzer](samples/046-ab-test-analyzer/) | A/B test analysis with statistical rigor |
| 056 | [dashboard-designer](samples/056-dashboard-designer/) | Effective dashboard layouts for data stories |

## How Squad SDK Works

Squad SDK gives you the building blocks to create AI agent teams:

```typescript
import { CastingEngine, onboardAgent } from '@bradygaster/squad-sdk';

// Cast a team from a themed universe
const engine = new CastingEngine();
const team = engine.castTeam({
  universe: 'usual-suspects',
  teamSize: 3,
  requiredRoles: ['developer', 'tester', 'developer'],
});

// Each agent gets domain-specific prompts
// The review loop ensures quality output
```

## Contributing

Have an idea for sample #101? Open a PR! The pattern is simple:
1. Copy `samples/_template/` to `samples/NNN-your-sample-name/`
2. Fill in the domain-specific content (spec.md, agent prompts)
3. Make it solve a real problem for real people

## License

MIT — see [LICENSE](LICENSE) for details.
