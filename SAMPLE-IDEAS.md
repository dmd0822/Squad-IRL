# Real-World Squad Use Cases

> Each is technically unique. Each solves a problem people actually have. Each shows multi-agent collaboration visibly.

---

## 1. ✅ Email Inbox Triage
**Problem:** Marketing emails, receipts, newsletters, and actual work get mixed together. People spend 30 mins/day just sorting.

**How it works:** 
- Classifier agent: Reads email subjects/previews, routes to category (Work, Shopping, Newsletters, Alerts)
- Summarizer agent: Creates 1-line summaries of long emails
- Action agent: Suggests responses or actions ("Approve PO?", "Skip newsletter?")
- User sees: Priority list with suggested actions, can approve/reject in bulk

**Tech:** Email API integration, prompt routing, confidence scoring with fallback to user

**Why it's compelling:** This is a problem EVERYONE has. The agent team makes the inbox feel organized in minutes, not hours.

---

## 2. ✅ Receipt Scanner & Expense Report Builder
**Problem:** Expense reports require manual entry, and receipts get lost. Finance teams spend hours matching receipts to claims.

**How it works:**
- Scanner agent: Uses OCR on receipt images, extracts vendor, amount, date, category
- Matcher agent: Compares receipt to transaction history, finds duplicates
- Classifier agent: Assigns GL codes and department based on vendor/amount patterns
- Approver agent: Flags unusual expenses (wrong category, unusual amount) for human review
- User sees: Pre-filled expense report with categorized receipts, takes 2 minutes vs. 20

**Tech:** Image processing (Tesseract/Claude vision), accounting system APIs, SQLite expense DB

**Why it's compelling:** CFOs hate expense workflows. This makes them frictionless. Teams get reimbursed faster.

---

## 3. ✅ Social Media Content Manager
**Problem:** Creating, scheduling, and monitoring posts across platforms takes hours daily. Engagement opportunities get missed.

**How it works:**
- Content agent: Generates post ideas from content calendar, writes 3 variations per theme
- Platform agent: Optimizes for Twitter, LinkedIn, Instagram (different tone, hashtags, length)
- Timing agent: Checks historical engagement data, suggests best post times per platform
- Monitor agent: Watches for mentions/replies, flags urgent comments for human review
- User sees: Weekly content calendar with pre-written variants, suggestions on what to approve/schedule

**Tech:** Social API integrations (Twitter, LinkedIn, Instagram), engagement analytics DB, scheduling queue

**Why it's compelling:** Social media managers waste time on formatting. This gives them back 10 hours/week.

---

## 4. ✅ Price Monitor & Deal Finder (Playwright)
**Problem:** Users want notifications when specific products drop below target prices, but checking 20+ sites manually is impossible.

**How it works:**
- Monitor agent: Uses Playwright to browse Target, Amazon, BestBuy, stores, capture current prices
- Comparator agent: Compares prices across sites, tracks historical trends
- Deal agent: Scores deals (discount %, stock level, shipping), identifies hot items
- Notifier agent: Sends alerts with links, historical price graphs, competitor prices
- User sees: Daily email with curated deals below their targets, with one-click purchase links

**Tech:** Playwright for logged-in browsing + price history scraping, SQLite time-series DB, email delivery

**Why it's compelling:** Deal hunters need this. It's the difference between paying full price and knowing when to buy.

---

## 5. ✅ Appointment Scheduling Coordinator
**Problem:** Scheduling across 3+ people's calendars manually takes 10+ emails. Timezone confusion causes missed meetings.

**How it works:**
- Calendar agent: Fetches availability from Google Calendar/Outlook for all participants
- Timezone agent: Converts suggestions to each person's timezone, flags awkward times
- Conflict agent: Checks for double-bookings, suggests buffer times between meetings
- Proposer agent: Generates 5 time slots ranked by convenience for all participants
- Booker agent: Once approved, creates events, sends invites, adds to all calendars

**Tech:** Google Calendar API, Outlook API, timezone library, meeting room reservation system

**Why it's compelling:** This kills the "let me check my calendar" loop. Meetings get booked in 3 messages instead of 15.

---

## 6. ✅ Customer Support Ticket Router & Responder
**Problem:** Support tickets get routed wrong, response times vary wildly, common questions answered manually 100x/day.

**How it works:**
- Classifier agent: Reads ticket, assigns priority (critical, high, medium, low) and category (billing, technical, account)
- Lookup agent: Searches knowledge base for similar issues, retrieves solutions
- Generator agent: If solution exists, drafts response using template; if not, flags for expert
- Router agent: Routes to appropriate team (L1 support, engineering, billing) based on complexity
- Quality agent: Reviews drafted response for tone, accuracy, completeness before sending

**Tech:** Ticket system API, knowledge base search (vector DB or full-text), NLU for intent detection

**Why it's compelling:** Support teams can close 30% more tickets with agent assistance. Response time drops by 50%.

---

## 7. ✅ Contract Review & Risk Analysis
**Problem:** Reading and extracting key terms from 20-page contracts takes hours. Risky clauses get missed.

**How it works:**
- Parser agent: Extracts key sections (payment terms, termination, liability, confidentiality)
- Analyzer agent: Compares terms against company risk thresholds (payment window > 60 days? flag it)
- Negotiation agent: Suggests alternative language for high-risk clauses with templates
- Precedent agent: Compares this contract to prior agreements, highlights divergence
- Summary agent: Creates 1-page summary with red/yellow/green risk scores
- User sees: Contract dashboard showing risk zones, suggested edits, 5-minute review instead of 2 hours

**Tech:** PDF parsing (pdfplumber), legal clause templates, vector DB for precedent matching, risk scoring rules

**Why it's compelling:** Legal reviews are a bottleneck. This lets companies move faster without taking stupid risks.

---

## 8. ✅ Travel Itinerary Planner (Playwright)
**Problem:** Planning a trip requires checking flights, hotels, attractions, reviews across 10+ sites. Fragmented bookings get confusing.

**How it works:**
- Flight agent: Uses Playwright to search Kayak/Google Flights for dates/price/connections, compares options
- Hotel agent: Browses Booking, Airbnb, captures availability, reviews, prices for target dates/location
- Activity agent: Researches attractions, restaurants, events for destination using web search + Google Maps
- Itinerary agent: Creates day-by-day schedule optimizing travel time, meal times, rest
- Budget agent: Tracks total cost, suggests alternatives if over budget
- User sees: Complete itinerary with all bookings, maps, directions, dining reservations in one document

**Tech:** Playwright browser automation (logged-in sessions), Google Maps API, web scraping, itinerary templating

**Why it's compelling:** Trip planning is stressful. This removes decision fatigue and gives you a complete, optimized itinerary.

---

## 9. ✅ Content Creation Workflow (Multi-Agent)
**Problem:** Writing blog posts, guides, or documentation is slow. Writers need research, outlines, editing, SEO help, publishing.

**How it works:**
- Research agent: Gathers information from web sources, academic papers, competitor content on topic
- Outline agent: Creates structure, suggests sections, determines depth based on target audience
- Writer agent: Drafts content section by section, maintains voice consistency
- SEO agent: Optimizes for keywords, suggests internal links, checks readability scores
- Editor agent: Checks grammar, tone, flow, flags unclear sections
- Publisher agent: Formats for blog platform, creates metadata, schedules publication
- User sees: Finished, published post that took 30 mins instead of 4 hours

**Tech:** Web search APIs, LLM multi-turn prompting with context passing, blog platform APIs, SEO analysis tools

**Why it's compelling:** Content creators can ship 10x more with this workflow. Quality stays high, speed becomes competitive advantage.

---

## 10. ✅ Real Estate Investment Analyzer (Playwright)
**Problem:** Finding good rental properties requires checking listings, running comps, analyzing neighborhoods, calculating ROI. Takes days per property.

**How it works:**
- Scraper agent: Uses Playwright to browse Zillow, Redfin, MLS for listing data, photos, taxes, HOA fees
- Comp agent: Finds comparable properties sold in last 6 months, calculates market valuation
- Tenant agent: Checks rental market data, estimates rental income for property type/location
- Neighborhood agent: Analyzes crime data, school ratings, transit, job growth trends
- Financial agent: Calculates cap rate, cash-on-cash return, 30-year NPV with different loan scenarios
- Risk agent: Flags potential issues (flood zones, declining areas, tenant demand soft)
- User sees: Investment scorecard with all metrics, ranked list of top opportunities, ready to make offers

**Tech:** Playwright for MLS access, real estate data APIs, neighborhood data APIs, financial modeling calculations

**Why it's compelling:** Real estate investors spend 20+ hours analyzing each deal. This does it in 15 minutes. Better deals get identified faster.

---

## 11. ✅ Bug Triage Automation
**Problem:** Bug reports are often vague, duplicated, or missing repro steps. QA teams spend hours sorting before engineers can start.

**How it works:**
- Parser agent: Extracts system info, error logs, steps to reproduce from bug report
- Duplicate agent: Searches closed/open bugs for similarity, flags potential duplicates
- Environment agent: Checks if issue is reproducible in current version, checks if already fixed
- Priority agent: Scores based on impact (crashes vs. UI issue), affected users, environment (prod vs. dev)
- Assignee agent: Suggests best engineer based on code ownership, past expertise on similar bugs
- Reproduction agent: Attempts to reproduce based on provided steps, generates detailed repro case for engineers
- User sees: Triage queue pre-sorted by priority, duplicates flagged, reproducible issues front-lined

**Tech:** Log parsing, code ownership file analysis, version control queries, test case template generation

**Why it's compelling:** Engineers can focus on fixing bugs, not hunting down details. QA teams stay organized.

---

## 12. ✅ Job Application Orchestrator (Playwright)
**Problem:** Job hunting requires tracking applications across 20+ sites, customizing resumes, managing interviews, following up. It's a full-time job.

**How it works:**
- Tracker agent: Uses Playwright to log into job boards, tracks application status, deadlines
- Matcher agent: Scores jobs against preferences (location, salary, tech stack, company size)
- Customizer agent: Tailors resume and cover letter to each job description, highlights relevant experience
- Researcher agent: Investigates company (news, reviews, recent funding, team), prepares interview talking points
- Calendar agent: Manages interview scheduling, prep deadlines, follow-up reminders
- Follow-up agent: Generates personalized follow-up emails at strategic intervals
- User sees: Weekly dashboard of applications, next interview dates, customized materials ready to submit

**Tech:** Playwright for job board automation, resume parsing/templating, company research APIs, calendar integration

**Why it's compelling:** Job hunting is exhausting. This system manages logistics so candidates focus on interviews and fit.

---

## 13. ✅ Meeting Recap & Action Item Generator
**Problem:** After meetings, someone spends 1 hour creating recap, extracting action items, sending followups. Decisions get lost in chat.

**How it works:**
- Transcriber agent: Converts meeting recording to text with speaker identification
- Summarizer agent: Creates executive summary, highlights decisions made
- Action agent: Identifies action items, extracts owner, deadline, dependency chains
- Context agent: Links action items to discussion, adds relevant quotes for context
- Notifier agent: Sends individualized recaps to attendees, notifications to action item owners
- Tracker agent: Adds items to project management system, links to relevant docs
- User sees: Post-meeting, everyone gets recap + their action items in their inbox, nothing gets lost

**Tech:** Meeting recording APIs (Zoom, Teams), Whisper transcription, speaker diarization, project management API integrations

**Why it's compelling:** Meetings are where decisions happen. This keeps teams aligned and accountable.

---

## 14. ✅ Inventory Management & Reordering System
**Problem:** Manual inventory checks waste time. Stockouts happen because reordering is delayed. Overstock wastes capital.

**How it works:**
- Monitor agent: Regularly checks inventory levels across locations (warehouse system integrations)
- Predictor agent: Uses historical sales data to forecast demand, predicts when items will run out
- Pricing agent: Checks supplier costs, monitors market prices, finds best deals
- Reorder agent: Creates purchase orders automatically when stock hits trigger levels, optimizes order size
- Alert agent: Notifies warehouse of incoming shipments, alerts if supplier delay risks stockout
- Analytics agent: Provides dashboard of inventory health, identifies slow movers, suggests discontinuation
- User sees: Fully automated reordering, zero manual checks, optimized spend, stockouts prevented

**Tech:** Warehouse management system APIs, demand forecasting (time series), supplier pricing APIs, PO automation

**Why it's compelling:** Inventory management is tedious and error-prone. Automation reduces waste and prevents lost sales.

---

## 15. ✅ A/B Test Orchestrator
**Problem:** Running A/B tests requires coordination: variant creation, traffic splitting, metrics collection, statistical analysis. Takes weeks to get results.

**How it works:**
- Design agent: Creates variant based on experiment hypothesis, generates design mockups for approval
- Implementation agent: Deploys variant to staging, prepares for traffic splitting
- Traffic agent: Monitors traffic split, ensures statistical validity (sample size, balance)
- Metrics agent: Collects experiment metrics continuously, runs statistical tests (p-value, confidence intervals)
- Alert agent: Flags early wins/losses so experiments can stop early, prevents wasting traffic on losers
- Analyzer agent: Once test concludes, interprets results, suggests next experiments
- User sees: Test running in background, automatic alerts on key milestones, conclusions with confidence scores

**Tech:** Feature flag system integration, metrics collection (Datadog/New Relic), statistical analysis libraries, workflow DAG

**Why it's compelling:** Experimentation is how products improve. This removes friction and speeds up learning cycles.

---

## 16. ✅ Policy Compliance & Audit Automation
**Problem:** Compliance audits require manual document review against policies. Takes 2+ weeks and is error-prone.

**How it works:**
- Policy agent: Ingests compliance framework (GDPR, SOC2, HIPAA), extracts key requirements
- Document agent: Collects evidence documents (access logs, data retention policies, incident reports)
- Analyzer agent: Checks each document against policy requirements, flags gaps or inconsistencies
- Evidence agent: Links evidence to each policy requirement, creates audit trail
- Risk agent: Scores compliance posture, prioritizes highest-risk gaps for remediation
- Report agent: Generates audit report with findings, evidence, and remediation roadmap
- User sees: Compliance audit complete in days instead of weeks, with clear roadmap to fix gaps

**Tech:** Document parsing, policy template matching, vector DB for evidence retrieval, compliance scoring rules

**Why it's compelling:** Compliance is mandatory but painful. This makes audits fast, reliable, and defensible.

---

## 17. ✅ Realtor Home Sales Package Builder (Playwright)
**Problem:** Real estate agents spend hours manually building comparable sales (comps), market analyses, and listing presentations for each property. Research is scattered across multiple sites (Redfin, Zillow, MLS).

**How it works:**
- Market Scanner agent: Uses Playwright to scrape Redfin and Zillow for local listings by area, captures recent sales data, pricing trends
- Comp Analyst agent: Identifies comparable properties sold in last 6 months, calculates price per sqft, adjusts for features, generates comps summary
- Presentation Builder agent: Assembles polished sales package with key stats, market trends, comparable sales charts, and property details
- Neighborhood Profiler agent: Researches schools, transit, amenities, walkability, employment centers, adds context to market positioning
- User sees: Complete market-ready sales package ready for client presentation (rankings, comp analysis, links to each property), assembled in 20 mins vs. 2+ hours

**Tech:** Playwright for Redfin/Zillow browsing, real estate data aggregation, PDF generation for presentation, SQLite for market trend storage

**Why it's compelling:** Realtors who can prep comps faster close more deals. This is the difference between having a competitive edge and losing to other agents.

---

## 18. ✅ LinkedIn Monitor & Engagement Tracker (Playwright)
**Problem:** Promoting a product on LinkedIn means checking daily for new comments, mentions, connection requests, and messages. Most days there's nothing actionable, but missing a post about your product costs engagement opportunities.

**How it works:**
- Scraper: Uses Playwright to open LinkedIn in a real browser, navigates to notifications and messaging
- Notification Classifier agent: Categorizes each item (connection request, comment, mention, message, post reaction)
- Relevance Scorer agent: Identifies items related to your product/brand (e.g., mentions of "Squad"), scores importance
- Action Advisor agent: Recommends what to do — respond, like, connect, ignore — with reasoning
- Link Generator agent: Outputs direct LinkedIn URLs for each actionable item so you can click straight through
- User sees: Terminal report with prioritized engagement opportunities, each with a clickable link to take action

**Tech:** Playwright browser automation (persistent LinkedIn session), DOM scraping for notifications/messages/posts, Squad SDK with squad.config.ts, streaming responses

**Why it's compelling:** LinkedIn engagement is time-sensitive — responding within hours matters. This cuts daily LinkedIn checking from 15 minutes of scrolling to 2 minutes of focused action. Perfect for founders and DevRel people promoting products.

---

## 19. 🚧 MTG Commander Deck Builder (Playwright)
**Problem:** Magic: The Gathering Commander players spend hours researching cards across multiple sites (TCGPlayer, EDHREC) to build 100-card Commander decks. Finding the right synergies, maintaining proper mana curves, and balancing land counts is tedious and error-prone.

**How it works:**
- Card Scout agent: Uses Playwright to scrape EDHREC and TCGPlayer for card data based on the user's commander or theme choice
- Deck Architect agent: Builds a balanced 100-card deck structure, selects cards from the scouted data
- Synergy Analyst agent: Evaluates card interactions, flags synergies and combos, rates deck coherence
- Budget Advisor agent: Checks card prices, suggests budget alternatives, calculates total deck cost
- User sees: Complete Commander deck saved as JSON, with synergy notes and price breakdown
- Follow-up loop: Users can issue modification commands ("swap 5 blue sources for more creatures") and the squad reads the saved deck, makes changes, and saves the updated version

**Tech:** Playwright for EDHREC/TCGPlayer browsing, JSON deck files on disk, Squad SDK with conversational follow-up loop, streaming responses

**Why it's compelling:** Commander is the most popular MTG format. Building decks is the most time-consuming part. This turns hours of card research into minutes of conversation, plus the ability to iterate via natural language commands.

---

## Summary

**Legend:** ✅ Built & working | 🚧 In progress

**18 use cases fully built, 1 in progress — all with clean TypeScript builds:**
- ✅ 18/19 samples complete — 1 in progress
- ❌ 4 ideas reviewed and dropped by team (Podcast Transcription, Competitive Intelligence Monitor, Medical Appointment & Insurance Verification, E-Commerce Personalization)
- ✅ 7 with Playwright browser automation (Price Monitor, Travel Planner, Real Estate, Job Tracker, Realtor Sales Package, LinkedIn Monitor, MTG Commander Deck Builder)
- ✅ 5 with file/text-based analysis (Receipt Scanner with OCR, Contract Review, Support Tickets, Compliance Checker, Inventory Manager)
- ✅ 4 with text input interaction (Appointment Scheduler, Content Creation, Meeting Recap, Social Media Manager)
- ✅ 1 with conversational deck modification loop (MTG Commander Deck Builder)
- ✅ 1 with GitHub CLI integration (Bug Triage)
- ✅ 1 with experiment brief input (A/B Test Orchestrator)
- ✅ 1 with OCR image scanning (Receipt Scanner — tesseract.js for receipt photos + hotel folio itemization)
- ✅ Multiple interaction models (automation, human-in-the-loop, real-time monitoring, scheduled batch)
- ✅ Real problems that real people face daily, with immediate value proposition

Each demonstrates why multi-agent collaboration is necessary: no single agent can handle the full workflow. The coordination, handoff, and context-passing between agents is visible to users as a powerful, time-saving system.
