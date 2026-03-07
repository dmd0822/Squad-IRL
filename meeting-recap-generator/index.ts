// Meeting Recap Generator — 5 AI agents process a meeting transcript

// ── Helpers ──────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function padRight(s: string, len: number): string {
  return s.length >= len ? s.slice(0, len) : s + " ".repeat(len - s.length);
}

function padLeft(s: string, len: number): string {
  return s.length >= len ? s.slice(0, len) : " ".repeat(len - s.length) + s;
}

function bar(value: number, max: number, width: number): string {
  const filled = Math.round((value / max) * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
}

function wrapText(text: string, width: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (current.length + word.length + 1 > width && current.length > 0) {
      lines.push(current);
      current = word;
    } else {
      current = current.length === 0 ? word : current + " " + word;
    }
  }
  if (current.length > 0) lines.push(current);
  return lines;
}

// ANSI colors
const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const MAGENTA = "\x1b[35m";
const CYAN = "\x1b[36m";
const WHITE = "\x1b[37m";
const BG_BLUE = "\x1b[44m";
const BG_GREEN = "\x1b[42m";
const BG_YELLOW = "\x1b[43m";
const BG_RED = "\x1b[41m";

// ── Data Model ───────────────────────────────────────────────────────

interface Speaker {
  name: string;
  title: string;
  email: string;
}

interface TranscriptEntry {
  timestamp: string;
  speaker: string;
  text: string;
  topic: string;
}

interface TopicSegment {
  topic: string;
  startTime: string;
  endTime: string;
  duration: number;
  speakers: string[];
}

interface Decision {
  id: number;
  description: string;
  proposedBy: string;
  approvedBy: string[];
  topic: string;
  timestamp: string;
}

interface ActionItem {
  id: string;
  description: string;
  assignee: string;
  deadline: string;
  priority: "high" | "medium" | "low";
  topic: string;
  status: string;
}

interface MeetingSummary {
  title: string;
  date: string;
  duration: string;
  attendees: string[];
  tldr: string;
  paragraphs: string[];
}

// ── Meeting Data ─────────────────────────────────────────────────────

const speakers: Speaker[] = [
  { name: "Sarah Chen", title: "VP Product", email: "sarah.chen@company.com" },
  { name: "Marcus Johnson", title: "Engineering Lead", email: "marcus.j@company.com" },
  { name: "Priya Patel", title: "Design Director", email: "priya.p@company.com" },
  { name: "David Kim", title: "Finance Manager", email: "david.k@company.com" },
  { name: "Lisa Torres", title: "Customer Success Lead", email: "lisa.t@company.com" },
];

const speakerMap = new Map(speakers.map((s) => [s.name, s]));

const transcript: TranscriptEntry[] = [
  // Opening & Agenda (0:00 – 2:00)
  { timestamp: "00:00:12", speaker: "Sarah Chen", text: "Good morning everyone, thanks for joining. Let's get the Q3 product planning session started. We've got a packed agenda today covering the Q2 retro, customer feedback, roadmap proposals, budget, and the v2.0 launch timeline.", topic: "Opening & Agenda" },
  { timestamp: "00:00:45", speaker: "Sarah Chen", text: "I'd like to keep us on track — we have about 45 minutes. Marcus, you'll kick us off with the Q2 retrospective, then Lisa will cover customer feedback. After that we'll get into the meaty stuff: roadmap, budget, and launch dates.", topic: "Opening & Agenda" },
  { timestamp: "00:01:18", speaker: "Marcus Johnson", text: "Sounds good. I've got the Q2 metrics pulled up and ready to share.", topic: "Opening & Agenda" },
  { timestamp: "00:01:35", speaker: "Lisa Torres", text: "Same here. I've compiled the latest NPS data and the top customer requests from the last quarter.", topic: "Opening & Agenda" },

  // Q2 Retrospective (2:00 – 8:00)
  { timestamp: "00:02:15", speaker: "Marcus Johnson", text: "Alright, Q2 retrospective. We shipped three major features: the real-time analytics dashboard, the team collaboration module, and the API rate limiting system. All three are live in production and performing well.", topic: "Q2 Retrospective" },
  { timestamp: "00:02:58", speaker: "Marcus Johnson", text: "On the flip side, we missed two deadlines. The mobile push notifications slipped by three weeks due to platform compatibility issues, and the SSO integration took an extra two weeks because of unexpected SAML edge cases.", topic: "Q2 Retrospective" },
  { timestamp: "00:03:40", speaker: "Sarah Chen", text: "What were the root causes for those slips? Was it estimation issues or scope creep?", topic: "Q2 Retrospective" },
  { timestamp: "00:04:05", speaker: "Marcus Johnson", text: "Mostly estimation. We underestimated the complexity of supporting both iOS and Android notification channels simultaneously. For SSO, the SAML spec has a lot of vendor-specific quirks we didn't account for.", topic: "Q2 Retrospective" },
  { timestamp: "00:04:52", speaker: "Priya Patel", text: "From the design side, we completed 28 design reviews and shipped updated component libraries. The design system adoption rate is now at 85% across all product surfaces.", topic: "Q2 Retrospective" },
  { timestamp: "00:05:30", speaker: "David Kim", text: "Budget-wise, Q2 came in 4% under budget thanks to the cloud cost optimization Marcus's team did. That gives us a bit of extra room for Q3.", topic: "Q2 Retrospective" },
  { timestamp: "00:06:10", speaker: "Lisa Torres", text: "Customer-facing metrics were strong. Support ticket volume dropped 12% after the analytics dashboard launch since customers can self-serve more data now.", topic: "Q2 Retrospective" },
  { timestamp: "00:07:15", speaker: "Sarah Chen", text: "Great work all around. Let's carry that momentum forward. Lisa, take us through the customer feedback.", topic: "Q2 Retrospective" },

  // Customer Feedback Review (8:00 – 15:00)
  { timestamp: "00:08:05", speaker: "Lisa Torres", text: "Sure. Our NPS score improved from 42 to 51 this quarter, which is a significant jump. The biggest drivers were the analytics dashboard and improved API documentation.", topic: "Customer Feedback Review" },
  { timestamp: "00:08:48", speaker: "Lisa Torres", text: "The top five customer requests are: number one, a customizable dashboard with drag-and-drop widgets. Number two, improved mobile experience. Three, better API versioning. Four, role-based access controls. Five, webhook integrations.", topic: "Customer Feedback Review" },
  { timestamp: "00:09:35", speaker: "Sarah Chen", text: "The customizable dashboard aligns perfectly with what we've been discussing for Q3. How urgent is the mobile experience request?", topic: "Customer Feedback Review" },
  { timestamp: "00:10:02", speaker: "Lisa Torres", text: "Very urgent for our enterprise customers. Three of our top ten accounts have flagged it as a blocker for expanding their user base. Mobile users currently account for 30% of logins but the experience is subpar.", topic: "Customer Feedback Review" },
  { timestamp: "00:10:55", speaker: "Priya Patel", text: "I've been doing an informal audit of the mobile experience and honestly, it needs a ground-up redesign rather than incremental fixes. The current responsive approach just doesn't cut it for complex workflows.", topic: "Customer Feedback Review" },
  { timestamp: "00:11:40", speaker: "Marcus Johnson", text: "A full mobile redesign is a big undertaking. If we're going to do that alongside the dashboard work, we'll need to sequence them carefully or bring on more people.", topic: "Customer Feedback Review" },
  { timestamp: "00:12:25", speaker: "Lisa Torres", text: "On the churn side, we lost 8 accounts last quarter. Exit interviews showed that 5 of those cited lack of API flexibility and 3 cited the mobile experience. We really need to address both.", topic: "Customer Feedback Review" },
  { timestamp: "00:13:10", speaker: "David Kim", text: "Those 8 accounts represented about $340K in annual recurring revenue. That's not insignificant.", topic: "Customer Feedback Review" },
  { timestamp: "00:13:55", speaker: "Sarah Chen", text: "Agreed, we can't ignore those numbers. Let's keep this in mind when we discuss the roadmap priorities. The data clearly shows API and mobile as the two critical areas.", topic: "Customer Feedback Review" },
  { timestamp: "00:14:30", speaker: "Lisa Torres", text: "One more thing — I'd like to set up a beta testing program with our enterprise customers so we can get early feedback on whatever we build for Q3. That's worked well for competitors.", topic: "Customer Feedback Review" },

  // Q3 Roadmap Proposals (15:00 – 25:00)
  { timestamp: "00:15:15", speaker: "Sarah Chen", text: "Okay, let's dive into the Q3 roadmap. We have four proposed features on the table: the customizable dashboard, mobile app redesign, API v2 with improved versioning, and the webhook integration system.", topic: "Q3 Roadmap Proposals" },
  { timestamp: "00:16:00", speaker: "Marcus Johnson", text: "From an engineering perspective, the API v2 work is foundational. A lot of the other features, including webhooks and even the dashboard customization, will benefit from a cleaner API layer underneath.", topic: "Q3 Roadmap Proposals" },
  { timestamp: "00:16:45", speaker: "Priya Patel", text: "For the dashboard, I'm proposing a phased approach. Phase one would be the layout customization and core widgets, phase two adds the drag-and-drop builder. That way we can ship value incrementally.", topic: "Q3 Roadmap Proposals" },
  { timestamp: "00:17:30", speaker: "Sarah Chen", text: "I like that phased approach. It lets us get something in customers' hands quickly while we iterate on the more complex interactions.", topic: "Q3 Roadmap Proposals" },
  { timestamp: "00:18:30", speaker: "Sarah Chen", text: "Let's go with the phased rollout approach for the new dashboard. Marcus, Priya — are you both on board with that?", topic: "Q3 Roadmap Proposals" },
  { timestamp: "00:18:55", speaker: "Marcus Johnson", text: "Absolutely, phased rollout makes sense from an engineering standpoint too. We can validate the data layer before building the full editor.", topic: "Q3 Roadmap Proposals" },
  { timestamp: "00:19:15", speaker: "Priya Patel", text: "Agreed. I'll start on the phase one mockups right away.", topic: "Q3 Roadmap Proposals" },
  { timestamp: "00:20:00", speaker: "Marcus Johnson", text: "Here's a tough call — I think we should push the mobile app redesign to Q4 to focus on API improvements this quarter. The API work unblocks webhooks and the dashboard, and frankly our mobile traffic doesn't justify the investment right now.", topic: "Q3 Roadmap Proposals" },
  { timestamp: "00:20:45", speaker: "Lisa Torres", text: "I'm a bit concerned about that given the enterprise feedback, but I understand the technical rationale. If we commit to Q4 for mobile, I can manage those customer expectations.", topic: "Q3 Roadmap Proposals" },
  { timestamp: "00:21:15", speaker: "Sarah Chen", text: "Let's do it. We push the mobile app redesign to Q4 to focus on API improvements this quarter. Everyone agree?", topic: "Q3 Roadmap Proposals" },
  { timestamp: "00:21:40", speaker: "Priya Patel", text: "That works. I can use the freed-up design cycles to audit the current design system for mobile consistency so we're ready to hit the ground running in Q4.", topic: "Q3 Roadmap Proposals" },
  { timestamp: "00:22:15", speaker: "Lisa Torres", text: "I'd like to propose that we partner with the three enterprise customers who raised mobile concerns for beta testing. That way they're involved early and feel heard even though we're deferring the full redesign.", topic: "Q3 Roadmap Proposals" },
  { timestamp: "00:22:50", speaker: "Sarah Chen", text: "Excellent idea. Let's partner with the three enterprise customers for beta testing. Lisa, can you set that up?", topic: "Q3 Roadmap Proposals" },
  { timestamp: "00:23:10", speaker: "Lisa Torres", text: "Absolutely. I'll reach out to them within the next ten days to get the program set up.", topic: "Q3 Roadmap Proposals" },
  { timestamp: "00:24:00", speaker: "Marcus Johnson", text: "So to summarize our Q3 focus: phased dashboard rollout, API v2, and webhooks. Mobile deferred to Q4. I'll create a detailed technical spec for the dashboard by next Friday.", topic: "Q3 Roadmap Proposals" },

  // Budget Discussion (25:00 – 32:00)
  { timestamp: "00:25:10", speaker: "David Kim", text: "Let's talk budget. We have $580K allocated for Q3 product development. After accounting for existing headcount and infrastructure costs, we have about $180K in flexible spending.", topic: "Budget Discussion" },
  { timestamp: "00:25:55", speaker: "David Kim", text: "I'm proposing we allocate $120K from the Q3 budget for two new engineering hires. With the API v2 work and the dashboard project running in parallel, Marcus's team is stretched thin.", topic: "Budget Discussion" },
  { timestamp: "00:26:40", speaker: "Marcus Johnson", text: "I really need those two engineers. Ideally one senior backend developer for the API work and one full-stack developer for the dashboard. Without them, something has to give.", topic: "Budget Discussion" },
  { timestamp: "00:27:20", speaker: "Sarah Chen", text: "The hiring makes sense. David, what's the remaining $60K earmarked for?", topic: "Budget Discussion" },
  { timestamp: "00:27:50", speaker: "David Kim", text: "I'd recommend $35K for additional cloud infrastructure to support the v2 staging environment, and $25K as a contingency buffer. Given Q2's slippage, having a buffer seems prudent.", topic: "Budget Discussion" },
  { timestamp: "00:28:35", speaker: "Sarah Chen", text: "Alright, let's approve the $120K allocation for the two new engineering hires. David, can you get the job descriptions posted by end of this week?", topic: "Budget Discussion" },
  { timestamp: "00:29:00", speaker: "David Kim", text: "Will do. I'll work with Marcus on the role requirements and get them posted on all our channels.", topic: "Budget Discussion" },
  { timestamp: "00:30:15", speaker: "Priya Patel", text: "Do we have budget for any design tooling upgrades? Our Figma enterprise license is up for renewal and the new tier has better prototyping features that would speed up the dashboard work.", topic: "Budget Discussion" },
  { timestamp: "00:30:50", speaker: "David Kim", text: "That should fit within our existing tooling budget. Send me the quote and I'll get it approved separately.", topic: "Budget Discussion" },
  { timestamp: "00:31:30", speaker: "Marcus Johnson", text: "One more thing on budget — the staging environment for v2.0 is going to need dedicated resources. Can we get that spun up within the $35K infrastructure allocation?", topic: "Budget Discussion" },

  // Launch Timeline (32:00 – 40:00)
  { timestamp: "00:32:15", speaker: "Marcus Johnson", text: "On the launch timeline — I'm proposing August 15th as our target for the v2.0 release. That gives us roughly 10 weeks from now, which is tight but doable if we get those two new hires onboarded quickly.", topic: "Launch Timeline" },
  { timestamp: "00:33:00", speaker: "Priya Patel", text: "August 15th works for design. Phase one mockups can be ready in two weeks, and we'll iterate on phase two designs while engineering builds phase one.", topic: "Launch Timeline" },
  { timestamp: "00:33:45", speaker: "Sarah Chen", text: "What are the biggest risks to that timeline?", topic: "Launch Timeline" },
  { timestamp: "00:34:20", speaker: "Marcus Johnson", text: "Three main risks: hiring timeline for the two engineers, API backward compatibility testing which always takes longer than expected, and third-party webhook provider integrations that depend on external documentation.", topic: "Launch Timeline" },
  { timestamp: "00:35:05", speaker: "Lisa Torres", text: "From the customer side, we need at least three weeks of beta testing before a general release. So the beta would need to start by late July.", topic: "Launch Timeline" },
  { timestamp: "00:35:50", speaker: "Marcus Johnson", text: "That's tight. I'll need to have the CI/CD pipeline for the v2.0 staging environment up within two weeks so we can start continuous integration early.", topic: "Launch Timeline" },
  { timestamp: "00:36:30", speaker: "Sarah Chen", text: "Let's set August 15th as the hard deadline for the v2.0 launch. Marcus, can your team commit to that?", topic: "Launch Timeline" },
  { timestamp: "00:36:55", speaker: "Marcus Johnson", text: "With the two new hires and the phased approach, yes. I'm committing to August 15th. But I want it on record that if hiring slips past two weeks, we need to revisit.", topic: "Launch Timeline" },
  { timestamp: "00:37:40", speaker: "Priya Patel", text: "I'll have the full design specification ready well before the beta. My team can also support QA with visual regression testing during the beta phase.", topic: "Launch Timeline" },
  { timestamp: "00:38:25", speaker: "David Kim", text: "From a budget perspective, the August 15th date works. It gives us time to process the new hires and allocate infrastructure spending gradually.", topic: "Launch Timeline" },
  { timestamp: "00:39:10", speaker: "Lisa Torres", text: "I'll coordinate the beta program timeline with Marcus to make sure we have enough testing runway. I also want to schedule a follow-up NPS survey targeting the churned customers to gauge if our Q3 improvements change their minds.", topic: "Launch Timeline" },

  // Action Items & Wrap-up (40:00 – 44:30)
  { timestamp: "00:40:05", speaker: "Sarah Chen", text: "Great discussion everyone. Let me summarize our action items. Marcus, you're creating the detailed technical spec for the new dashboard — that's due next Friday. High priority.", topic: "Wrap-up & Action Items" },
  { timestamp: "00:40:45", speaker: "Sarah Chen", text: "Priya, you'll do the design mockups for the dashboard phased rollout, due in two weeks. Also, please audit the current design system for mobile consistency by end of month — that'll prep us for Q4.", topic: "Wrap-up & Action Items" },
  { timestamp: "00:41:20", speaker: "Sarah Chen", text: "David, post the job descriptions for the two engineering roles by end of this week. Lisa, set up the beta program with our enterprise customers within ten days, and schedule that follow-up NPS survey for churned customers by next week.", topic: "Wrap-up & Action Items" },
  { timestamp: "00:42:00", speaker: "Sarah Chen", text: "Marcus, also get the CI/CD pipeline for the v2.0 staging environment set up within two weeks. And I'll send the updated Q3 roadmap to leadership by Monday.", topic: "Wrap-up & Action Items" },
  { timestamp: "00:42:45", speaker: "Marcus Johnson", text: "Got it. Dashboard spec by Friday, CI/CD pipeline in two weeks. I'll get started on both today.", topic: "Wrap-up & Action Items" },
  { timestamp: "00:43:15", speaker: "Lisa Torres", text: "Beta program and NPS survey — both on my list. I'll send a status update by end of next week.", topic: "Wrap-up & Action Items" },
  { timestamp: "00:43:50", speaker: "Priya Patel", text: "Mockups and design audit — I'm on it. I'll share initial sketches in our next design sync.", topic: "Wrap-up & Action Items" },
  { timestamp: "00:44:15", speaker: "Sarah Chen", text: "Perfect. Excellent meeting everyone. We've got a clear direction for Q3 and solid ownership on every action item. Let's reconvene in two weeks to check progress. Meeting adjourned.", topic: "Wrap-up & Action Items" },
];

const topicSegments: TopicSegment[] = [
  { topic: "Opening & Agenda", startTime: "00:00:00", endTime: "00:02:00", duration: 2, speakers: ["Sarah Chen", "Marcus Johnson", "Lisa Torres"] },
  { topic: "Q2 Retrospective", startTime: "00:02:00", endTime: "00:08:00", duration: 6, speakers: ["Marcus Johnson", "Sarah Chen", "Priya Patel", "David Kim", "Lisa Torres"] },
  { topic: "Customer Feedback Review", startTime: "00:08:00", endTime: "00:15:00", duration: 7, speakers: ["Lisa Torres", "Sarah Chen", "Priya Patel", "Marcus Johnson", "David Kim"] },
  { topic: "Q3 Roadmap Proposals", startTime: "00:15:00", endTime: "00:25:00", duration: 10, speakers: ["Sarah Chen", "Marcus Johnson", "Priya Patel", "Lisa Torres"] },
  { topic: "Budget Discussion", startTime: "00:25:00", endTime: "00:32:00", duration: 7, speakers: ["David Kim", "Sarah Chen", "Marcus Johnson", "Priya Patel"] },
  { topic: "Launch Timeline", startTime: "00:32:00", endTime: "00:40:00", duration: 8, speakers: ["Marcus Johnson", "Sarah Chen", "Priya Patel", "David Kim", "Lisa Torres"] },
  { topic: "Wrap-up & Action Items", startTime: "00:40:00", endTime: "00:44:30", duration: 4.5, speakers: ["Sarah Chen", "Marcus Johnson", "Lisa Torres", "Priya Patel"] },
];

const decisions: Decision[] = [
  { id: 1, description: "Phased rollout approach for the new dashboard", proposedBy: "Sarah Chen", approvedBy: ["Marcus Johnson", "Priya Patel"], topic: "Q3 Roadmap Proposals", timestamp: "00:18:30" },
  { id: 2, description: "Allocate $120K from Q3 budget for two new engineering hires", proposedBy: "David Kim", approvedBy: ["Sarah Chen"], topic: "Budget Discussion", timestamp: "00:28:35" },
  { id: 3, description: "Push mobile app redesign to Q4 to focus on API improvements", proposedBy: "Marcus Johnson", approvedBy: ["Sarah Chen", "Priya Patel", "Lisa Torres"], topic: "Q3 Roadmap Proposals", timestamp: "00:21:15" },
  { id: 4, description: "Partner with 3 enterprise customers for beta testing", proposedBy: "Lisa Torres", approvedBy: ["Sarah Chen"], topic: "Q3 Roadmap Proposals", timestamp: "00:22:50" },
  { id: 5, description: "Set August 15th as the hard deadline for v2.0 launch", proposedBy: "Sarah Chen", approvedBy: ["Marcus Johnson"], topic: "Launch Timeline", timestamp: "00:36:30" },
];

const actionItems: ActionItem[] = [
  { id: "A1", description: "Create detailed technical spec for new dashboard", assignee: "Marcus Johnson", deadline: "Next Friday", priority: "high", topic: "Q3 Roadmap Proposals", status: "pending" },
  { id: "A2", description: "Design mockups for dashboard phased rollout", assignee: "Priya Patel", deadline: "2 weeks", priority: "high", topic: "Q3 Roadmap Proposals", status: "pending" },
  { id: "A3", description: "Set up enterprise beta testing program", assignee: "Lisa Torres", deadline: "10 days", priority: "high", topic: "Q3 Roadmap Proposals", status: "pending" },
  { id: "A4", description: "Post job descriptions for 2 engineering roles", assignee: "David Kim", deadline: "End of week", priority: "medium", topic: "Budget Discussion", status: "pending" },
  { id: "A5", description: "Send updated Q3 roadmap to leadership", assignee: "Sarah Chen", deadline: "Monday", priority: "medium", topic: "Wrap-up & Action Items", status: "pending" },
  { id: "A6", description: "Set up CI/CD pipeline for v2.0 staging environment", assignee: "Marcus Johnson", deadline: "2 weeks", priority: "medium", topic: "Launch Timeline", status: "pending" },
  { id: "A7", description: "Audit current design system for mobile consistency", assignee: "Priya Patel", deadline: "End of month", priority: "low", topic: "Q3 Roadmap Proposals", status: "pending" },
  { id: "A8", description: "Schedule follow-up NPS survey for churned customers", assignee: "Lisa Torres", deadline: "Next week", priority: "medium", topic: "Launch Timeline", status: "pending" },
];

// ── Agent 1: Transcript Analyzer ─────────────────────────────────────

async function runTranscriptAnalyzer(): Promise<void> {
  console.log(`\n${BOLD}${BG_BLUE}${WHITE} AGENT 1 — TRANSCRIPT ANALYZER ${RESET}`);
  console.log(`${DIM}  Analyzing speaker participation and topic flow...${RESET}\n`);
  await sleep(400);

  // Word counts per speaker
  const wordCounts = new Map<string, number>();
  for (const entry of transcript) {
    const count = entry.text.split(/\s+/).length;
    wordCounts.set(entry.speaker, (wordCounts.get(entry.speaker) || 0) + count);
  }
  const totalWords = Array.from(wordCounts.values()).reduce((a, b) => a + b, 0);

  console.log(`  ${BOLD}${CYAN}Speaker Participation${RESET}`);
  console.log(`  ${DIM}${"─".repeat(62)}${RESET}`);

  const sortedSpeakers = speakers.slice().sort((a, b) => (wordCounts.get(b.name) || 0) - (wordCounts.get(a.name) || 0));
  const maxWords = Math.max(...Array.from(wordCounts.values()));

  for (const speaker of sortedSpeakers) {
    const count = wordCounts.get(speaker.name) || 0;
    const pct = ((count / totalWords) * 100).toFixed(1);
    const barStr = bar(count, maxWords, 28);
    console.log(`  ${padRight(speaker.name, 18)} ${barStr}  ${padLeft(pct, 5)}%  ${DIM}(${speaker.title})${RESET}`);
    await sleep(200);
  }

  console.log(`\n  ${DIM}Total: ${totalWords} words across ${transcript.length} entries${RESET}`);

  // Topic timeline
  await sleep(300);
  console.log(`\n  ${BOLD}${CYAN}Topic Timeline${RESET}`);
  console.log(`  ${DIM}${"─".repeat(62)}${RESET}`);

  for (const seg of topicSegments) {
    const timeLabel = seg.startTime.slice(0, 5);
    const durLabel = seg.duration % 1 === 0 ? `${seg.duration} min` : `${seg.duration} min`;
    const speakerList = seg.speakers.slice(0, 3).map((s) => s.split(" ")[0]).join(", ");
    const extra = seg.speakers.length > 3 ? ` +${seg.speakers.length - 3}` : "";
    console.log(`  ${YELLOW}${timeLabel}${RESET} ──┤ ${padRight(seg.topic, 24)} │ ${padLeft(durLabel, 7)} ▪ ${speakerList}${extra}`);
    await sleep(150);
  }

  // Speaker interaction matrix
  await sleep(300);
  console.log(`\n  ${BOLD}${CYAN}Speaker Interaction Matrix${RESET}`);
  console.log(`  ${DIM}  (who speaks after whom — sequential response counts)${RESET}`);
  console.log(`  ${DIM}${"─".repeat(62)}${RESET}`);

  const interactions = new Map<string, Map<string, number>>();
  for (const s of speakers) {
    interactions.set(s.name, new Map());
  }
  for (let i = 1; i < transcript.length; i++) {
    const prev = transcript[i - 1].speaker;
    const curr = transcript[i].speaker;
    if (prev !== curr) {
      const inner = interactions.get(curr)!;
      inner.set(prev, (inner.get(prev) || 0) + 1);
    }
  }

  const shortNames = speakers.map((s) => s.name.split(" ")[0]);
  console.log(`  ${padRight("", 12)} ${shortNames.map((n) => padLeft(n.slice(0, 7), 8)).join("")}`);
  console.log(`  ${padRight("", 12)} ${"─".repeat(8 * shortNames.length)}`);

  for (const speaker of speakers) {
    const row = shortNames.map((_, j) => {
      const other = speakers[j].name;
      const count = interactions.get(speaker.name)?.get(other) || 0;
      return padLeft(count === 0 ? "·" : String(count), 8);
    }).join("");
    console.log(`  ${padRight(speaker.name.split(" ")[0], 12)} ${row}`);
  }
  console.log(`  ${DIM}  (row = responder, column = previous speaker)${RESET}`);
}

// ── Agent 2: Decision Extractor ──────────────────────────────────────

async function runDecisionExtractor(): Promise<void> {
  console.log(`\n${BOLD}${BG_GREEN}${WHITE} AGENT 2 — DECISION EXTRACTOR ${RESET}`);
  console.log(`${DIM}  Scanning transcript for decisions and approvals...${RESET}\n`);
  await sleep(400);

  const boxWidth = 60;

  for (const d of decisions) {
    const header = ` DECISION #${d.id} `;
    const headerPad = boxWidth - 2 - header.length;
    const topBorder = `┌─${header}${"─".repeat(headerPad)}┐`;

    const lines: string[] = [];
    const descLines = wrapText(d.description, boxWidth - 4);
    for (const line of descLines) {
      lines.push(line);
    }
    lines.push("");
    lines.push(`Proposed by: ${d.proposedBy}`);
    lines.push(`Approved by: ${d.approvedBy.join(", ")}`);
    lines.push(`Topic:       ${d.topic}`);
    lines.push(`Timestamp:   ${d.timestamp}`);

    console.log(`  ${GREEN}${topBorder}${RESET}`);
    for (const line of lines) {
      const padded = padRight(line, boxWidth - 4);
      console.log(`  ${GREEN}│${RESET} ${BOLD}${padded}${RESET} ${GREEN}│${RESET}`);
    }
    console.log(`  ${GREEN}└${"─".repeat(boxWidth - 2)}┘${RESET}`);
    console.log();
    await sleep(300);
  }

  // Decision count by topic
  console.log(`  ${BOLD}${GREEN}Decisions by Topic${RESET}`);
  console.log(`  ${DIM}${"─".repeat(40)}${RESET}`);
  const topicCounts = new Map<string, number>();
  for (const d of decisions) {
    topicCounts.set(d.topic, (topicCounts.get(d.topic) || 0) + 1);
  }
  for (const [topic, count] of topicCounts) {
    console.log(`  ${padRight(topic, 28)} ${BOLD}${count}${RESET} decision${count > 1 ? "s" : ""}`);
  }
  console.log(`  ${DIM}${"─".repeat(40)}${RESET}`);
  console.log(`  ${BOLD}Total: ${decisions.length} decisions${RESET}`);
}

// ── Agent 3: Action Item Generator ───────────────────────────────────

async function runActionItemGenerator(): Promise<void> {
  console.log(`\n${BOLD}${BG_YELLOW}${WHITE} AGENT 3 — ACTION ITEM GENERATOR ${RESET}`);
  console.log(`${DIM}  Extracting and prioritizing action items...${RESET}\n`);
  await sleep(400);

  const sorted = actionItems.slice().sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  const colW = { id: 4, desc: 42, assignee: 18, deadline: 12, priority: 10 };
  const totalW = colW.id + colW.desc + colW.assignee + colW.deadline + colW.priority + 16;

  const hSep = `  ┌${"─".repeat(colW.id + 2)}┬${"─".repeat(colW.desc + 2)}┬${"─".repeat(colW.assignee + 2)}┬${"─".repeat(colW.deadline + 2)}┬${"─".repeat(colW.priority + 2)}┐`;
  const mSep = `  ├${"─".repeat(colW.id + 2)}┼${"─".repeat(colW.desc + 2)}┼${"─".repeat(colW.assignee + 2)}┼${"─".repeat(colW.deadline + 2)}┼${"─".repeat(colW.priority + 2)}┤`;
  const bSep = `  └${"─".repeat(colW.id + 2)}┴${"─".repeat(colW.desc + 2)}┴${"─".repeat(colW.assignee + 2)}┴${"─".repeat(colW.deadline + 2)}┴${"─".repeat(colW.priority + 2)}┘`;

  const fmtRow = (id: string, desc: string, assignee: string, deadline: string, prio: string) =>
    `  │ ${padRight(id, colW.id)} │ ${padRight(desc, colW.desc)} │ ${padRight(assignee, colW.assignee)} │ ${padRight(deadline, colW.deadline)} │ ${padRight(prio, colW.priority)} │`;

  const priorityEmoji = { high: `${RED}🔴 HIGH${RESET}`, medium: `${YELLOW}🟡 MED${RESET} `, low: `${GREEN}🟢 LOW${RESET} ` };

  console.log(hSep);
  console.log(fmtRow("ID", "Action Item", "Assignee", "Deadline", "Priority"));
  console.log(mSep);

  for (const item of sorted) {
    // Priority display without ANSI for padding calc
    const prioDisplay = item.priority === "high" ? "🔴 HIGH" : item.priority === "medium" ? "🟡 MED" : "🟢 LOW";
    console.log(fmtRow(item.id, item.description, item.assignee, item.deadline, prioDisplay));
    await sleep(200);
  }
  console.log(bSep);

  // Per-person summary
  await sleep(300);
  console.log(`\n  ${BOLD}${YELLOW}Action Items by Person${RESET}`);
  console.log(`  ${DIM}${"─".repeat(40)}${RESET}`);

  const byPerson = new Map<string, ActionItem[]>();
  for (const item of actionItems) {
    if (!byPerson.has(item.assignee)) byPerson.set(item.assignee, []);
    byPerson.get(item.assignee)!.push(item);
  }
  for (const [person, items] of byPerson) {
    console.log(`  ${BOLD}${person}${RESET}: ${items.length} item${items.length > 1 ? "s" : ""}`);
    for (const it of items) {
      const icon = it.priority === "high" ? "🔴" : it.priority === "medium" ? "🟡" : "🟢";
      console.log(`    ${icon} ${it.description} (${it.deadline})`);
    }
  }

  // Priority breakdown
  const high = actionItems.filter((i) => i.priority === "high").length;
  const medium = actionItems.filter((i) => i.priority === "medium").length;
  const low = actionItems.filter((i) => i.priority === "low").length;
  console.log(`\n  ${DIM}Priority breakdown: ${RED}${high} high${RESET}${DIM}, ${YELLOW}${medium} medium${RESET}${DIM}, ${GREEN}${low} low${RESET}`);
}

// ── Agent 4: Summary Writer ──────────────────────────────────────────

async function runSummaryWriter(): Promise<void> {
  console.log(`\n${BOLD}${BG_RED}${WHITE} AGENT 4 — SUMMARY WRITER ${RESET}`);
  console.log(`${DIM}  Composing executive summary...${RESET}\n`);
  await sleep(400);

  const summary: MeetingSummary = {
    title: "Q3 Product Planning Meeting",
    date: "June 12, 2025",
    duration: "45 minutes",
    attendees: speakers.map((s) => `${s.name} (${s.title})`),
    tldr: "The team committed to a phased dashboard rollout and API v2 for Q3, deferred mobile redesign to Q4, approved $120K for two new engineering hires, and set August 15th as the v2.0 hard launch deadline.",
    paragraphs: [
      "The Q3 Product Planning Meeting convened five senior leaders — Sarah Chen (VP Product), Marcus Johnson (Engineering Lead), Priya Patel (Design Director), David Kim (Finance Manager), and Lisa Torres (Customer Success Lead) — for a comprehensive 45-minute session covering the Q2 retrospective, customer feedback analysis, Q3 roadmap prioritization, budget allocation, and launch timeline planning. The meeting followed a strong Q2 where the team shipped three major features while navigating two deadline slips due to estimation challenges.",
      "Five key decisions shaped the Q3 strategy. The team adopted a phased rollout approach for the new customizable dashboard, allowing incremental value delivery. They made the strategic call to defer the mobile app redesign to Q4, redirecting engineering focus to API v2 improvements that unblock multiple downstream features. The finance team secured approval for $120K to hire two additional engineers, addressing capacity constraints. An enterprise beta testing program was greenlit to maintain customer engagement, and August 15th was set as the hard deadline for the v2.0 launch.",
      "The team left with eight clearly assigned action items spanning technical specifications, design mockups, hiring, and customer outreach. Critical-path items include Marcus Johnson's dashboard technical spec due next Friday and Lisa Torres's enterprise beta program setup within ten days. The team will reconvene in two weeks to assess progress against the August 15th launch target, with particular attention to the hiring timeline as the key risk factor identified during the discussion.",
    ],
  };

  const boxWidth = 72;
  const innerWidth = boxWidth - 4;

  console.log(`  ${MAGENTA}╔${"═".repeat(boxWidth - 2)}╗${RESET}`);
  console.log(`  ${MAGENTA}║${RESET} ${BOLD}EXECUTIVE SUMMARY${RESET}${" ".repeat(boxWidth - 21)}${MAGENTA}║${RESET}`);
  console.log(`  ${MAGENTA}║${RESET} ${DIM}${summary.title} — ${summary.date}${RESET}${" ".repeat(boxWidth - 2 - summary.title.length - summary.date.length - 5)}${MAGENTA}║${RESET}`);
  console.log(`  ${MAGENTA}╠${"═".repeat(boxWidth - 2)}╣${RESET}`);

  for (let pi = 0; pi < summary.paragraphs.length; pi++) {
    const wrappedLines = wrapText(summary.paragraphs[pi], innerWidth);
    for (const line of wrappedLines) {
      const padded = padRight(line, innerWidth);
      console.log(`  ${MAGENTA}║${RESET} ${padded} ${MAGENTA}║${RESET}`);
    }
    if (pi < summary.paragraphs.length - 1) {
      console.log(`  ${MAGENTA}║${RESET}${" ".repeat(boxWidth - 2)}${MAGENTA}║${RESET}`);
    }
    await sleep(300);
  }

  console.log(`  ${MAGENTA}╠${"═".repeat(boxWidth - 2)}╣${RESET}`);
  console.log(`  ${MAGENTA}║${RESET} ${BOLD}${CYAN}TL;DR${RESET}${" ".repeat(boxWidth - 8)}${MAGENTA}║${RESET}`);

  const tldrLines = wrapText(summary.tldr, innerWidth);
  for (const line of tldrLines) {
    const padded = padRight(line, innerWidth);
    console.log(`  ${MAGENTA}║${RESET} ${padded} ${MAGENTA}║${RESET}`);
  }

  console.log(`  ${MAGENTA}╚${"═".repeat(boxWidth - 2)}╝${RESET}`);
}

// ── Agent 5: Follow-up Drafter ───────────────────────────────────────

async function runFollowUpDrafter(): Promise<void> {
  console.log(`\n${BOLD}${BG_BLUE}${WHITE} AGENT 5 — FOLLOW-UP DRAFTER ${RESET}`);
  console.log(`${DIM}  Drafting follow-up email for all attendees...${RESET}\n`);
  await sleep(400);

  const today = "June 12, 2025";
  const emailWidth = 70;
  const innerW = emailWidth - 4;

  const toList = speakers.map((s) => s.email).join("; ");
  const subject = `Meeting Recap: Q3 Product Planning — ${today}`;

  const emailLines: string[] = [];

  emailLines.push(`To:      ${toList}`);
  emailLines.push(`Subject: ${subject}`);
  emailLines.push(`Date:    ${today}`);
  emailLines.push("─".repeat(innerW));
  emailLines.push("");
  emailLines.push("Hi team,");
  emailLines.push("");

  const introPara = "Thank you all for a productive Q3 Product Planning session today. Below is a summary of our key decisions and action items for your reference. Please review and let me know if I've missed anything.";
  emailLines.push(...wrapText(introPara, innerW));
  emailLines.push("");

  emailLines.push("KEY DECISIONS");
  emailLines.push("─".repeat(14));
  for (const d of decisions) {
    const wrappedDesc = wrapText(`${d.id}. ${d.description} (proposed by ${d.proposedBy})`, innerW - 3);
    for (let i = 0; i < wrappedDesc.length; i++) {
      emailLines.push(i === 0 ? `  ${wrappedDesc[i]}` : `     ${wrappedDesc[i]}`);
    }
  }
  emailLines.push("");

  emailLines.push("ACTION ITEMS");
  emailLines.push("─".repeat(12));

  const byPerson = new Map<string, ActionItem[]>();
  for (const item of actionItems) {
    if (!byPerson.has(item.assignee)) byPerson.set(item.assignee, []);
    byPerson.get(item.assignee)!.push(item);
  }

  for (const [person, items] of byPerson) {
    const speaker = speakerMap.get(person);
    emailLines.push(`  ${person} (${speaker?.title ?? ""}):`);
    for (const it of items) {
      const prioTag = it.priority === "high" ? "[HIGH]" : it.priority === "medium" ? "[MED]" : "[LOW]";
      const wrappedItem = wrapText(`• ${it.description} — due: ${it.deadline} ${prioTag}`, innerW - 4);
      for (const line of wrappedItem) {
        emailLines.push(`    ${line}`);
      }
    }
    emailLines.push("");
  }

  emailLines.push("NEXT MEETING");
  emailLines.push("─".repeat(12));
  emailLines.push(...wrapText("Let's reconvene in two weeks (June 26, 2025) to review progress against the August 15th launch deadline. I'll send a calendar invite shortly.", innerW));
  emailLines.push("");
  emailLines.push(...wrapText("If you have any questions or need to flag a risk before then, don't hesitate to reach out.", innerW));
  emailLines.push("");
  emailLines.push("Best regards,");
  emailLines.push("Sarah Chen");
  emailLines.push("VP Product");

  // Render email
  console.log(`  ${BLUE}┌${"─".repeat(emailWidth - 2)}┐${RESET}`);
  console.log(`  ${BLUE}│${RESET} ${BOLD}📧  FOLLOW-UP EMAIL${RESET}${" ".repeat(emailWidth - 23)}${BLUE}│${RESET}`);
  console.log(`  ${BLUE}├${"─".repeat(emailWidth - 2)}┤${RESET}`);

  for (const line of emailLines) {
    const padded = padRight(line, innerW);
    console.log(`  ${BLUE}│${RESET} ${padded} ${BLUE}│${RESET}`);
  }

  console.log(`  ${BLUE}└${"─".repeat(emailWidth - 2)}┘${RESET}`);
}

// ── Main Flow ────────────────────────────────────────────────────────

async function main(): Promise<void> {
  // Header banner
  console.log();
  console.log(`${BOLD}${BG_BLUE}${WHITE}${"═".repeat(66)}${RESET}`);
  console.log(`${BOLD}${BG_BLUE}${WHITE}  MEETING RECAP GENERATOR                                         ${RESET}`);
  console.log(`${BOLD}${BG_BLUE}${WHITE}  5 AI Agents • Transcript Analysis • Actionable Output           ${RESET}`);
  console.log(`${BOLD}${BG_BLUE}${WHITE}${"═".repeat(66)}${RESET}`);
  console.log();
  console.log(`  ${BOLD}Meeting:${RESET}  Q3 Product Planning Meeting`);
  console.log(`  ${BOLD}Date:${RESET}     June 12, 2025`);
  console.log(`  ${BOLD}Duration:${RESET} 45 minutes`);
  console.log(`  ${BOLD}Attendees:${RESET}`);
  for (const s of speakers) {
    console.log(`    • ${s.name} — ${s.title} (${s.email})`);
  }

  // Transcript scroll preview
  await sleep(300);
  console.log(`\n${DIM}  Processing transcript (${transcript.length} entries across ${topicSegments.length} topics)...${RESET}\n`);

  const previewEntries = [0, 4, 12, 22, 34, 41];
  for (const idx of previewEntries) {
    const entry = transcript[idx];
    const truncated = entry.text.length > 70 ? entry.text.slice(0, 67) + "..." : entry.text;
    console.log(`  ${DIM}[${entry.timestamp}]${RESET} ${BOLD}${entry.speaker}:${RESET} ${DIM}${truncated}${RESET}`);
    await sleep(200);
  }
  console.log(`  ${DIM}... and ${transcript.length - previewEntries.length} more entries${RESET}`);

  // Run agents
  await sleep(400);
  await runTranscriptAnalyzer();
  await sleep(500);
  await runDecisionExtractor();
  await sleep(500);
  await runActionItemGenerator();
  await sleep(500);
  await runSummaryWriter();
  await sleep(500);
  await runFollowUpDrafter();

  // Footer
  console.log();
  console.log(`${BOLD}${BG_BLUE}${WHITE}${"═".repeat(66)}${RESET}`);
  console.log(`${BOLD}${BG_BLUE}${WHITE}  Meeting processed by 5 agents                                   ${RESET}`);
  console.log(`${BOLD}${BG_BLUE}${WHITE}  ${decisions.length} decisions • ${actionItems.length} action items • ${transcript.length} transcript entries analyzed  ${RESET}`);
  console.log(`${BOLD}${BG_BLUE}${WHITE}${"═".repeat(66)}${RESET}`);
  console.log();
}

main().catch(console.error);
