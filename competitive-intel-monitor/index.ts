// Competitive Intel Monitor — 6 AI agents produce a competitive intelligence briefing

// ── Helpers ───────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const fmt = (n: number) => `$${n.toLocaleString("en-US")}`;
const pct = (n: number) => `${Math.round(n * 100)}%`;
const bar = (score: number, width = 20) => {
  const filled = Math.round((score / 100) * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
};

// ANSI colours
const RST = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const MAGENTA = "\x1b[35m";
const WHITE = "\x1b[37m";
const BLUE = "\x1b[34m";
const BG_GREEN = "\x1b[42m";
const BG_YELLOW = "\x1b[43m";
const BG_RED = "\x1b[41m";
const BG_BLUE = "\x1b[44m";
const BG_CYAN = "\x1b[46m";

const divider = (ch = "─", len = 72) => DIM + ch.repeat(len) + RST;
const say = (msg: string) => console.log(msg);

// ── Data Interfaces ──────────────────────────────────────────────────────────

interface Competitor {
  name: string;
  founded: number;
  employees: number;
  funding: string;
  description: string;
}

interface Feature {
  name: string;
  category: string;
  hasIt: Record<string, boolean>;
  releasedDate: string;
}

interface PricingTier {
  tierName: string;
  monthlyPrice: number;
  features: string[];
  limits: Record<string, number | string>;
}

interface Review {
  source: string;
  rating: number;
  sentiment: "positive" | "negative" | "neutral";
  text: string;
  date: string;
}

interface SocialMention {
  platform: string;
  content: string;
  sentiment: "positive" | "negative" | "neutral";
  reach: number;
  date: string;
}

interface PositionData {
  name: string;
  priceScore: number;
  featureScore: number;
}

// ── Competitor Data ──────────────────────────────────────────────────────────

const competitors: Competitor[] = [
  { name: "CompeteX", founded: 2012, employees: 500, funding: "$50M Series C", description: "Established enterprise player with a full-suite platform" },
  { name: "RivalTech", founded: 2017, employees: 120, funding: "$15M Series A", description: "Mid-market challenger with aggressive pricing strategy" },
  { name: "MarketEdge", founded: 2015, employees: 60, funding: "$8M Series A", description: "Niche specialist focused on deep analytics capabilities" },
  { name: "StartupZ", founded: 2022, employees: 25, funding: "$3M Seed", description: "New disruptor offering rock-bottom pricing to gain market share" },
];

const ourCompany: Competitor = {
  name: "OurProduct", founded: 2016, employees: 200, funding: "$25M Series B",
  description: "Balanced platform with strong integrations and growing AI features",
};

const allNames = [ourCompany.name, ...competitors.map((c) => c.name)];

// ── Features ─────────────────────────────────────────────────────────────────

const features: Feature[] = [
  { name: "Real-time Collaboration", category: "Core", releasedDate: "2023-03", hasIt: { OurProduct: true, CompeteX: true, RivalTech: true, MarketEdge: false, StartupZ: false } },
  { name: "REST API Access", category: "Developer", releasedDate: "2022-01", hasIt: { OurProduct: true, CompeteX: true, RivalTech: true, MarketEdge: true, StartupZ: true } },
  { name: "Advanced Analytics", category: "Intelligence", releasedDate: "2023-06", hasIt: { OurProduct: true, CompeteX: true, RivalTech: false, MarketEdge: true, StartupZ: false } },
  { name: "SSO / SAML", category: "Security", releasedDate: "2022-09", hasIt: { OurProduct: true, CompeteX: true, RivalTech: true, MarketEdge: false, StartupZ: false } },
  { name: "Custom Workflows", category: "Automation", releasedDate: "2023-11", hasIt: { OurProduct: true, CompeteX: true, RivalTech: false, MarketEdge: false, StartupZ: false } },
  { name: "Mobile App", category: "Platform", releasedDate: "2023-01", hasIt: { OurProduct: true, CompeteX: true, RivalTech: true, MarketEdge: false, StartupZ: true } },
  { name: "3rd-Party Integrations", category: "Ecosystem", releasedDate: "2022-06", hasIt: { OurProduct: true, CompeteX: true, RivalTech: true, MarketEdge: true, StartupZ: false } },
  { name: "Custom Reporting", category: "Intelligence", releasedDate: "2023-04", hasIt: { OurProduct: true, CompeteX: true, RivalTech: true, MarketEdge: true, StartupZ: false } },
  { name: "AI Features", category: "Intelligence", releasedDate: "2024-01", hasIt: { OurProduct: true, CompeteX: true, RivalTech: false, MarketEdge: true, StartupZ: false } },
  { name: "White-Label", category: "Enterprise", releasedDate: "2023-08", hasIt: { OurProduct: false, CompeteX: true, RivalTech: false, MarketEdge: false, StartupZ: false } },
  { name: "SLA Guarantee", category: "Enterprise", releasedDate: "2022-03", hasIt: { OurProduct: true, CompeteX: true, RivalTech: false, MarketEdge: false, StartupZ: false } },
  { name: "Dedicated Support", category: "Service", releasedDate: "2022-07", hasIt: { OurProduct: true, CompeteX: true, RivalTech: true, MarketEdge: false, StartupZ: false } },
];

// ── Pricing ──────────────────────────────────────────────────────────────────

const pricing: Record<string, PricingTier[]> = {
  OurProduct: [
    { tierName: "Starter", monthlyPrice: 29, features: ["REST API Access", "Mobile App", "Custom Reporting"], limits: { users: 5, storage: "5 GB" } },
    { tierName: "Pro", monthlyPrice: 79, features: ["REST API Access", "Mobile App", "Custom Reporting", "Real-time Collaboration", "Advanced Analytics", "3rd-Party Integrations", "SSO / SAML"], limits: { users: 50, storage: "50 GB" } },
    { tierName: "Enterprise", monthlyPrice: 199, features: ["REST API Access", "Mobile App", "Custom Reporting", "Real-time Collaboration", "Advanced Analytics", "3rd-Party Integrations", "SSO / SAML", "Custom Workflows", "AI Features", "SLA Guarantee", "Dedicated Support"], limits: { users: "Unlimited", storage: "500 GB" } },
  ],
  CompeteX: [
    { tierName: "Starter", monthlyPrice: 49, features: ["REST API Access", "Mobile App", "Custom Reporting"], limits: { users: 3, storage: "2 GB" } },
    { tierName: "Pro", monthlyPrice: 129, features: ["REST API Access", "Mobile App", "Custom Reporting", "Real-time Collaboration", "Advanced Analytics", "3rd-Party Integrations", "SSO / SAML", "AI Features"], limits: { users: 25, storage: "100 GB" } },
    { tierName: "Enterprise", monthlyPrice: 349, features: ["REST API Access", "Mobile App", "Custom Reporting", "Real-time Collaboration", "Advanced Analytics", "3rd-Party Integrations", "SSO / SAML", "AI Features", "Custom Workflows", "White-Label", "SLA Guarantee", "Dedicated Support"], limits: { users: "Unlimited", storage: "1 TB" } },
  ],
  RivalTech: [
    { tierName: "Starter", monthlyPrice: 19, features: ["REST API Access", "Mobile App"], limits: { users: 10, storage: "10 GB" } },
    { tierName: "Pro", monthlyPrice: 49, features: ["REST API Access", "Mobile App", "Custom Reporting", "Real-time Collaboration", "3rd-Party Integrations", "SSO / SAML", "Dedicated Support"], limits: { users: 100, storage: "100 GB" } },
    { tierName: "Enterprise", monthlyPrice: 129, features: ["REST API Access", "Mobile App", "Custom Reporting", "Real-time Collaboration", "3rd-Party Integrations", "SSO / SAML", "Dedicated Support"], limits: { users: "Unlimited", storage: "500 GB" } },
  ],
  MarketEdge: [
    { tierName: "Starter", monthlyPrice: 39, features: ["REST API Access", "Advanced Analytics"], limits: { users: 3, storage: "5 GB" } },
    { tierName: "Pro", monthlyPrice: 99, features: ["REST API Access", "Advanced Analytics", "Custom Reporting", "3rd-Party Integrations", "AI Features"], limits: { users: 20, storage: "50 GB" } },
    { tierName: "Enterprise", monthlyPrice: 249, features: ["REST API Access", "Advanced Analytics", "Custom Reporting", "3rd-Party Integrations", "AI Features"], limits: { users: 50, storage: "200 GB" } },
  ],
  StartupZ: [
    { tierName: "Starter", monthlyPrice: 0, features: ["REST API Access"], limits: { users: 2, storage: "1 GB" } },
    { tierName: "Pro", monthlyPrice: 15, features: ["REST API Access", "Mobile App"], limits: { users: 20, storage: "20 GB" } },
    { tierName: "Enterprise", monthlyPrice: 49, features: ["REST API Access", "Mobile App"], limits: { users: 100, storage: "100 GB" } },
  ],
};

// ── Reviews ──────────────────────────────────────────────────────────────────

const reviews: Record<string, Review[]> = {
  CompeteX: [
    { source: "G2", rating: 4, sentiment: "positive", text: "Incredibly comprehensive platform with every feature we needed for enterprise deployment.", date: "2024-01-15" },
    { source: "Capterra", rating: 3, sentiment: "neutral", text: "Solid product but the learning curve is steep and onboarding took weeks.", date: "2024-02-03" },
    { source: "TrustRadius", rating: 2, sentiment: "negative", text: "Way too expensive for what you get. The pricing model feels exploitative.", date: "2024-01-28" },
    { source: "G2", rating: 5, sentiment: "positive", text: "The white-label option is a game-changer for our agency clients.", date: "2024-03-10" },
    { source: "Capterra", rating: 3, sentiment: "neutral", text: "Good for large teams, overkill for small businesses. Support is average.", date: "2024-02-20" },
    { source: "G2", rating: 2, sentiment: "negative", text: "UI feels dated compared to newer competitors. Needs a major refresh.", date: "2024-03-05" },
    { source: "TrustRadius", rating: 4, sentiment: "positive", text: "Reliable and stable — we've never had downtime in 2 years of use.", date: "2024-01-12" },
    { source: "G2", rating: 1, sentiment: "negative", text: "Customer support is terrible. Waited 3 days for a response to a critical issue.", date: "2024-03-18" },
    { source: "Capterra", rating: 4, sentiment: "positive", text: "The integrations ecosystem is best-in-class, connects to everything.", date: "2024-02-14" },
    { source: "TrustRadius", rating: 3, sentiment: "neutral", text: "Enterprise features are strong, but mobile app lags behind desktop.", date: "2024-01-22" },
  ],
  RivalTech: [
    { source: "G2", rating: 5, sentiment: "positive", text: "Amazing value for the price. We switched from CompeteX and saved 60%.", date: "2024-02-10" },
    { source: "Capterra", rating: 4, sentiment: "positive", text: "Clean UI and fast onboarding, our team was productive in day one.", date: "2024-01-25" },
    { source: "G2", rating: 4, sentiment: "positive", text: "The collaboration features are smooth and intuitive. Great for remote teams.", date: "2024-03-01" },
    { source: "TrustRadius", rating: 3, sentiment: "neutral", text: "Good product but missing advanced analytics that we need for reporting.", date: "2024-02-18" },
    { source: "Capterra", rating: 2, sentiment: "negative", text: "No AI features at all. Feels like they're behind the curve on innovation.", date: "2024-03-12" },
    { source: "G2", rating: 5, sentiment: "positive", text: "Best bang for your buck in the market, period.", date: "2024-01-30" },
    { source: "TrustRadius", rating: 3, sentiment: "neutral", text: "Decent for mid-size teams but lacks enterprise-grade features.", date: "2024-02-25" },
    { source: "Capterra", rating: 4, sentiment: "positive", text: "Support team is responsive and actually helpful. Rare in this space.", date: "2024-03-08" },
    { source: "G2", rating: 2, sentiment: "negative", text: "Custom workflows are non-existent. Had to build workarounds for basic automation.", date: "2024-01-18" },
    { source: "TrustRadius", rating: 4, sentiment: "positive", text: "Rapid feature releases — they ship something new every two weeks.", date: "2024-03-15" },
  ],
  MarketEdge: [
    { source: "G2", rating: 5, sentiment: "positive", text: "The analytics depth is unmatched. Perfect for data-driven decision making.", date: "2024-02-05" },
    { source: "Capterra", rating: 4, sentiment: "positive", text: "AI-powered insights are genuinely useful, not just marketing fluff.", date: "2024-01-20" },
    { source: "TrustRadius", rating: 2, sentiment: "negative", text: "No mobile app in 2024? Seriously limits usability for field teams.", date: "2024-03-02" },
    { source: "G2", rating: 3, sentiment: "neutral", text: "Excellent at what it does, but the scope is too narrow for a primary tool.", date: "2024-02-15" },
    { source: "Capterra", rating: 1, sentiment: "negative", text: "No SSO support means it's a non-starter for enterprise security requirements.", date: "2024-01-10" },
    { source: "G2", rating: 5, sentiment: "positive", text: "If you need deep analytics, nothing else comes close. Worth every penny.", date: "2024-03-20" },
    { source: "TrustRadius", rating: 2, sentiment: "negative", text: "Limited integrations make it hard to fit into our existing workflow.", date: "2024-02-28" },
    { source: "Capterra", rating: 4, sentiment: "positive", text: "The reporting engine is the best I've used in 15 years of business software.", date: "2024-01-08" },
  ],
  StartupZ: [
    { source: "G2", rating: 4, sentiment: "positive", text: "Free tier is actually usable! Great for small teams getting started.", date: "2024-03-10" },
    { source: "Capterra", rating: 3, sentiment: "neutral", text: "Very basic feature set, but the price is right for bootstrapped startups.", date: "2024-02-22" },
    { source: "G2", rating: 2, sentiment: "negative", text: "Outages are frequent. Lost work twice last month due to server issues.", date: "2024-01-15" },
    { source: "TrustRadius", rating: 3, sentiment: "neutral", text: "Good starting point but you'll outgrow it fast. No analytics or reporting.", date: "2024-03-05" },
    { source: "Capterra", rating: 5, sentiment: "positive", text: "Love the simplicity. No bloat, just the basics done right.", date: "2024-02-10" },
    { source: "G2", rating: 1, sentiment: "negative", text: "No integrations, no SSO, no workflows — hard to take seriously for business use.", date: "2024-01-28" },
    { source: "Capterra", rating: 4, sentiment: "positive", text: "Mobile app is surprisingly polished for such a young company.", date: "2024-03-18" },
    { source: "TrustRadius", rating: 2, sentiment: "negative", text: "Support is just a chatbot. When you need a human, nobody's home.", date: "2024-02-05" },
  ],
  OurProduct: [
    { source: "G2", rating: 5, sentiment: "positive", text: "Perfect balance of features and price. Switched from CompeteX with no regrets.", date: "2024-02-12" },
    { source: "Capterra", rating: 4, sentiment: "positive", text: "AI features are impressive and actually save us time on daily tasks.", date: "2024-01-30" },
    { source: "TrustRadius", rating: 4, sentiment: "positive", text: "Great integrations ecosystem and solid customer support team.", date: "2024-03-08" },
    { source: "G2", rating: 3, sentiment: "neutral", text: "Good product overall, but white-label would make it perfect for our agency.", date: "2024-02-25" },
    { source: "Capterra", rating: 5, sentiment: "positive", text: "Best onboarding experience we've had. Team adopted it within hours.", date: "2024-01-18" },
    { source: "G2", rating: 4, sentiment: "positive", text: "The workflow automation is powerful. Eliminated hours of manual work.", date: "2024-03-14" },
    { source: "TrustRadius", rating: 3, sentiment: "neutral", text: "Enterprise tier is fairly priced. Wish the Pro tier had a few more features.", date: "2024-02-08" },
    { source: "Capterra", rating: 4, sentiment: "positive", text: "Consistent improvements every month. This team clearly listens to users.", date: "2024-03-22" },
    { source: "G2", rating: 5, sentiment: "positive", text: "SLA guarantee gives us confidence for mission-critical deployments.", date: "2024-01-05" },
    { source: "TrustRadius", rating: 2, sentiment: "negative", text: "Mobile app could use work — it's functional but feels like an afterthought.", date: "2024-03-01" },
  ],
};

// ── Social Mentions ──────────────────────────────────────────────────────────

const socialMentions: Record<string, SocialMention[]> = {
  CompeteX: [
    { platform: "Twitter/X", content: "Just renewed our CompeteX enterprise license. Pricey but reliable. #SaaS", sentiment: "neutral", reach: 1200, date: "2024-03-20" },
    { platform: "LinkedIn", content: "CompeteX announced white-label partnerships with 3 major agencies.", sentiment: "positive", reach: 8500, date: "2024-03-18" },
    { platform: "Reddit", content: "Anyone else frustrated by CompeteX's pricing? $349/mo for enterprise is insane.", sentiment: "negative", reach: 3400, date: "2024-03-15" },
    { platform: "Twitter/X", content: "CompeteX UI redesign leaked — looks much better. About time!", sentiment: "positive", reach: 5200, date: "2024-03-12" },
    { platform: "HackerNews", content: "CompeteX API docs are actually excellent. Wish more SaaS companies did this.", sentiment: "positive", reach: 2800, date: "2024-03-10" },
    { platform: "LinkedIn", content: "CompeteX laying off 50 engineers? Not a great sign for product development.", sentiment: "negative", reach: 12000, date: "2024-03-08" },
    { platform: "Twitter/X", content: "Our team loves CompeteX for collaboration, but the price keeps going up.", sentiment: "neutral", reach: 900, date: "2024-03-05" },
  ],
  RivalTech: [
    { platform: "Twitter/X", content: "Switched to RivalTech from CompeteX — saving $200/mo with no feature loss. 🔥", sentiment: "positive", reach: 4500, date: "2024-03-22" },
    { platform: "LinkedIn", content: "RivalTech CEO on stage at SaaStr talking about 3x growth in 2024.", sentiment: "positive", reach: 15000, date: "2024-03-19" },
    { platform: "Reddit", content: "RivalTech is great value but I really need AI features. Any timeline?", sentiment: "neutral", reach: 2100, date: "2024-03-16" },
    { platform: "Twitter/X", content: "RivalTech just shipped weekly updates for the 10th consecutive week. Impressive velocity.", sentiment: "positive", reach: 3200, date: "2024-03-13" },
    { platform: "ProductHunt", content: "RivalTech Pro tier is the best deal in SaaS right now. Launched today!", sentiment: "positive", reach: 7800, date: "2024-03-10" },
    { platform: "HackerNews", content: "Is RivalTech sustainable at these prices? Feels like they're burning cash.", sentiment: "negative", reach: 4100, date: "2024-03-07" },
    { platform: "Twitter/X", content: "RivalTech support fixed our issue in under 30 minutes. That's unheard of.", sentiment: "positive", reach: 1800, date: "2024-03-04" },
    { platform: "LinkedIn", content: "RivalTech hiring 40 engineers — big product push coming this quarter.", sentiment: "positive", reach: 6200, date: "2024-03-01" },
  ],
  MarketEdge: [
    { platform: "Twitter/X", content: "MarketEdge analytics are in a league of their own. Nothing else compares.", sentiment: "positive", reach: 2200, date: "2024-03-21" },
    { platform: "LinkedIn", content: "MarketEdge partnership with Snowflake opens up massive data pipeline capabilities.", sentiment: "positive", reach: 9500, date: "2024-03-17" },
    { platform: "Reddit", content: "MarketEdge is great for analytics but terrible for everything else. Very one-dimensional.", sentiment: "negative", reach: 1800, date: "2024-03-14" },
    { platform: "Twitter/X", content: "Wish MarketEdge had a mobile app. It's 2024 and I can't check dashboards on my phone.", sentiment: "negative", reach: 3100, date: "2024-03-11" },
    { platform: "HackerNews", content: "MarketEdge AI insights actually predicted our Q1 trend correctly. Impressive stuff.", sentiment: "positive", reach: 5600, date: "2024-03-08" },
    { platform: "LinkedIn", content: "MarketEdge expanding into predictive analytics — could be a game-changer for niche.", sentiment: "positive", reach: 4200, date: "2024-03-05" },
  ],
  StartupZ: [
    { platform: "Twitter/X", content: "StartupZ free tier is perfect for our 2-person side project. 🚀", sentiment: "positive", reach: 800, date: "2024-03-23" },
    { platform: "ProductHunt", content: "StartupZ just launched on PH! Simple, cheap, and it works. #1 Product of the Day!", sentiment: "positive", reach: 22000, date: "2024-03-20" },
    { platform: "Reddit", content: "StartupZ went down for 4 hours today. Third outage this month. Unacceptable.", sentiment: "negative", reach: 5600, date: "2024-03-17" },
    { platform: "Twitter/X", content: "StartupZ is basically a toy. Fine for personal use, not for real business.", sentiment: "negative", reach: 2400, date: "2024-03-14" },
    { platform: "HackerNews", content: "StartupZ team is 25 people and growing fast. Scrappy underdog story.", sentiment: "positive", reach: 3800, date: "2024-03-11" },
    { platform: "LinkedIn", content: "StartupZ raised $3M seed — will they survive the SaaS shakeout?", sentiment: "neutral", reach: 4500, date: "2024-03-08" },
    { platform: "Twitter/X", content: "The simplicity of StartupZ is underrated. Not everyone needs 50 features.", sentiment: "positive", reach: 1500, date: "2024-03-05" },
  ],
  OurProduct: [
    { platform: "Twitter/X", content: "OurProduct's new AI features are legit. Saved our team 5 hours this week alone.", sentiment: "positive", reach: 3600, date: "2024-03-22" },
    { platform: "LinkedIn", content: "OurProduct Series B success story — from 50 to 200 employees in 18 months.", sentiment: "positive", reach: 11000, date: "2024-03-18" },
    { platform: "Reddit", content: "Honest review of OurProduct: solid all-rounder but needs white-label option.", sentiment: "neutral", reach: 2900, date: "2024-03-15" },
    { platform: "Twitter/X", content: "OurProduct's integrations just work. Connected Slack, Jira, and Salesforce in minutes.", sentiment: "positive", reach: 4200, date: "2024-03-12" },
    { platform: "HackerNews", content: "OurProduct API rate limits are generous. Great for building custom tooling.", sentiment: "positive", reach: 3100, date: "2024-03-09" },
    { platform: "ProductHunt", content: "OurProduct launched workflow automation — looks like a Zapier-killer for their niche.", sentiment: "positive", reach: 8800, date: "2024-03-06" },
    { platform: "LinkedIn", content: "OurProduct is our go-to recommendation for mid-market teams. Great balance.", sentiment: "positive", reach: 5400, date: "2024-03-03" },
  ],
};

// ── Agent 1: Product Scanner ─────────────────────────────────────────────────

async function agentProductScanner(): Promise<void> {
  say(`\n${BG_CYAN}${BOLD} 📡 AGENT 1 — PRODUCT SCANNER ${RST}`);
  say(`${CYAN}   Role: Feature Tracker${RST}`);
  say(divider());
  await sleep(300);

  // Feature comparison matrix
  say(`\n${BOLD}Feature Comparison Matrix${RST}\n`);
  const colW = 13;
  const nameW = 24;
  const header = "Feature".padEnd(nameW) + allNames.map((n) => n.padStart(colW)).join("");
  say(`  ${DIM}${header}${RST}`);
  say(`  ${"─".repeat(nameW)}${"─".repeat(colW * allNames.length)}`);

  for (const f of features) {
    const cells = allNames.map((n) => {
      const has = f.hasIt[n];
      const sym = has ? `${GREEN}✓${RST}` : `${RED}✗${RST}`;
      // Pad accounting for ANSI codes: the visible symbol is 1 char wide
      return " ".repeat(colW - 1) + sym;
    }).join("");
    say(`  ${f.name.padEnd(nameW)}${cells}`);
    await sleep(100);
  }

  // Feature counts
  say(`\n${BOLD}Feature Count per Company${RST}\n`);
  for (const name of allNames) {
    const count = features.filter((f) => f.hasIt[name]).length;
    const colour = name === "OurProduct" ? CYAN : WHITE;
    say(`  ${colour}${name.padEnd(14)}${RST} ${bar(Math.round((count / features.length) * 100), 24)} ${count}/${features.length}`);
    await sleep(80);
  }

  // Feature gaps & advantages
  say(`\n${BOLD}Feature Gaps${RST} ${DIM}(competitors have, we don't)${RST}`);
  const gaps = features.filter((f) => !f.hasIt["OurProduct"] && competitors.some((c) => f.hasIt[c.name]));
  for (const g of gaps) {
    const who = competitors.filter((c) => g.hasIt[c.name]).map((c) => c.name);
    say(`  ${RED}✗${RST} ${g.name} — offered by ${who.join(", ")}`);
  }

  say(`\n${BOLD}Feature Advantages${RST} ${DIM}(we have, some competitors don't)${RST}`);
  const advantages = features.filter((f) => f.hasIt["OurProduct"] && competitors.some((c) => !f.hasIt[c.name]));
  for (const a of advantages) {
    const missing = competitors.filter((c) => !a.hasIt[c.name]).map((c) => c.name);
    say(`  ${GREEN}✓${RST} ${a.name} — missing from ${missing.join(", ")}`);
  }

  // Release timeline
  say(`\n${BOLD}Recent Feature Releases${RST}\n`);
  const sorted = [...features].sort((a, b) => b.releasedDate.localeCompare(a.releasedDate));
  for (const f of sorted.slice(0, 6)) {
    const who = allNames.filter((n) => f.hasIt[n]);
    say(`  ${DIM}${f.releasedDate}${RST}  ${f.name.padEnd(24)} ${DIM}→${RST} ${who.join(", ")}`);
    await sleep(60);
  }
}

// ── Agent 2: Pricing Analyst ─────────────────────────────────────────────────

async function agentPricingAnalyst(): Promise<void> {
  say(`\n${BG_YELLOW}${BOLD} 💰 AGENT 2 — PRICING ANALYST ${RST}`);
  say(`${YELLOW}   Role: Cost Analysis${RST}`);
  say(divider());
  await sleep(300);

  const tiers = ["Starter", "Pro", "Enterprise"] as const;

  // Pricing comparison table
  say(`\n${BOLD}Pricing Comparison (Monthly)${RST}\n`);
  const cW = 14;
  say(`  ${"Tier".padEnd(12)}${allNames.map((n) => n.padStart(cW)).join("")}`);
  say(`  ${"─".repeat(12)}${"─".repeat(cW * allNames.length)}`);

  for (const tier of tiers) {
    const cells = allNames.map((n) => {
      const t = pricing[n].find((p) => p.tierName === tier);
      const price = t ? (t.monthlyPrice === 0 ? "Free" : fmt(t.monthlyPrice) + "/mo") : "N/A";
      return price.padStart(cW);
    }).join("");
    say(`  ${tier.padEnd(12)}${cells}`);
    await sleep(150);
  }

  // Price-per-feature ratio
  say(`\n${BOLD}Price-per-Feature Ratio${RST} ${DIM}(lower = better value)${RST}\n`);
  say(`  ${"Company".padEnd(14)} ${"Starter".padStart(10)} ${"Pro".padStart(10)} ${"Enterprise".padStart(12)}`);
  say(`  ${"─".repeat(14)} ${"─".repeat(10)} ${"─".repeat(10)} ${"─".repeat(12)}`);

  for (const name of allNames) {
    const ratios = tiers.map((tier) => {
      const w = tier === "Enterprise" ? 12 : 10;
      const t = pricing[name].find((p) => p.tierName === tier);
      if (!t || t.monthlyPrice === 0) return (t && t.monthlyPrice === 0 ? "Free" : "N/A").padStart(w);
      const ratio = t.monthlyPrice / t.features.length;
      return fmt(Math.round(ratio * 100) / 100).padStart(w);
    });
    const colour = name === "OurProduct" ? CYAN : WHITE;
    say(`  ${colour}${name.padEnd(14)}${RST} ${ratios.join(" ")}`);
    await sleep(100);
  }

  // Value scores
  say(`\n${BOLD}Value Score${RST} ${DIM}(features / price × 100, higher = better)${RST}\n`);
  const valueScores: { name: string; score: number }[] = [];
  for (const name of allNames) {
    const proTier = pricing[name].find((p) => p.tierName === "Pro");
    if (proTier && proTier.monthlyPrice > 0) {
      const score = Math.round((proTier.features.length / proTier.monthlyPrice) * 100);
      valueScores.push({ name, score });
    }
  }
  valueScores.sort((a, b) => b.score - a.score);
  const maxScore = Math.max(...valueScores.map((v) => v.score));

  for (const v of valueScores) {
    const normalized = Math.round((v.score / maxScore) * 100);
    const colour = v.name === "OurProduct" ? CYAN : v.score === maxScore ? GREEN : WHITE;
    say(`  ${colour}${v.name.padEnd(14)}${RST} ${bar(normalized, 30)} ${v.score}`);
    await sleep(100);
  }

  // Pricing opportunities
  say(`\n${BOLD}Pricing Insights${RST}\n`);
  const ourPro = pricing["OurProduct"].find((p) => p.tierName === "Pro")!;
  for (const comp of competitors) {
    const theirPro = pricing[comp.name].find((p) => p.tierName === "Pro");
    if (theirPro) {
      const diff = ourPro.monthlyPrice - theirPro.monthlyPrice;
      if (diff > 0) {
        say(`  ${YELLOW}▲${RST} We are ${fmt(diff)}/mo more than ${comp.name} at Pro tier`);
      } else if (diff < 0) {
        say(`  ${GREEN}▼${RST} We are ${fmt(Math.abs(diff))}/mo less than ${comp.name} at Pro tier`);
      }
    }
  }
}

// ── Agent 3: Review Miner ────────────────────────────────────────────────────

async function agentReviewMiner(): Promise<void> {
  say(`\n${BG_GREEN}${BOLD} 📊 AGENT 3 — REVIEW MINER ${RST}`);
  say(`${GREEN}   Role: Sentiment Analysis${RST}`);
  say(divider());
  await sleep(300);

  say(`\n${BOLD}Sentiment Analysis Dashboard${RST}\n`);

  for (const name of allNames) {
    const rv = reviews[name];
    const avgRating = rv.reduce((s, r) => s + r.rating, 0) / rv.length;
    const pos = rv.filter((r) => r.sentiment === "positive").length;
    const neu = rv.filter((r) => r.sentiment === "neutral").length;
    const neg = rv.filter((r) => r.sentiment === "negative").length;
    const total = rv.length;

    const posPct = pos / total;
    const neuPct = neu / total;
    const negPct = neg / total;

    // ASCII sentiment bar
    const barW = 30;
    const posChars = Math.round(posPct * barW);
    const neuChars = Math.round(neuPct * barW);
    const negChars = barW - posChars - neuChars;

    const sentBar = `${GREEN}${"█".repeat(posChars)}${RST}${YELLOW}${"█".repeat(neuChars)}${RST}${RED}${"█".repeat(Math.max(0, negChars))}${RST}`;

    // Star rating
    const fullStars = Math.floor(avgRating);
    const halfStar = avgRating - fullStars >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    const stars = "★".repeat(fullStars) + (halfStar ? "½" : "") + "☆".repeat(emptyStars);

    const colour = name === "OurProduct" ? CYAN : WHITE;
    say(`  ${colour}${name.padEnd(14)}${RST} ${sentBar}  ${GREEN}Pos:${pct(posPct).padStart(4)}${RST} ${DIM}|${RST} ${YELLOW}Neu:${pct(neuPct).padStart(4)}${RST} ${DIM}|${RST} ${RED}Neg:${pct(negPct).padStart(4)}${RST}  ${YELLOW}${stars}${RST} ${avgRating.toFixed(1)}`);
    await sleep(200);
  }

  // Themes per competitor
  say(`\n${BOLD}Key Themes by Competitor${RST}\n`);

  const themeMap: Record<string, { positive: string[]; negative: string[] }> = {
    CompeteX: {
      positive: ["Comprehensive features", "Reliable uptime", "Strong integrations"],
      negative: ["Expensive pricing", "Dated UI", "Slow support"],
    },
    RivalTech: {
      positive: ["Great value / pricing", "Fast onboarding", "Responsive support"],
      negative: ["No AI features", "Missing enterprise capabilities", "Sustainability concerns"],
    },
    MarketEdge: {
      positive: ["Deep analytics", "AI insights", "Strong reporting"],
      negative: ["No mobile app", "No SSO", "Limited integrations"],
    },
    StartupZ: {
      positive: ["Free tier", "Simplicity", "Growing fast"],
      negative: ["Frequent outages", "Missing features", "Poor support"],
    },
    OurProduct: {
      positive: ["Good balance", "AI features", "Fast adoption"],
      negative: ["No white-label", "Mobile app needs work", "Pro tier gaps"],
    },
  };

  for (const name of allNames) {
    const themes = themeMap[name];
    const colour = name === "OurProduct" ? CYAN : WHITE;
    say(`  ${colour}${BOLD}${name}${RST}`);
    say(`    ${GREEN}+${RST} ${themes.positive.join("  •  ")}`);
    say(`    ${RED}-${RST} ${themes.negative.join("  •  ")}`);
    say("");
    await sleep(150);
  }

  // Common complaints word cloud
  say(`${BOLD}Common Complaint Frequency${RST}\n`);
  const complaints = [
    { word: "expensive", count: 8 },
    { word: "missing features", count: 7 },
    { word: "slow support", count: 6 },
    { word: "outages", count: 5 },
    { word: "no mobile", count: 4 },
    { word: "dated UI", count: 4 },
    { word: "no AI", count: 3 },
    { word: "no SSO", count: 3 },
    { word: "limited integrations", count: 2 },
  ];
  for (const c of complaints) {
    const bWidth = Math.round((c.count / 8) * 25);
    say(`  ${c.word.padEnd(22)} ${RED}${"▓".repeat(bWidth)}${RST} ${DIM}(${c.count} mentions)${RST}`);
    await sleep(60);
  }
}

// ── Agent 4: Social Listener ─────────────────────────────────────────────────

async function agentSocialListener(): Promise<void> {
  say(`\n${BG_BLUE}${BOLD} 📱 AGENT 4 — SOCIAL LISTENER ${RST}`);
  say(`${BLUE}   Role: Social Intel${RST}`);
  say(divider());
  await sleep(300);

  // Buzz scores
  say(`\n${BOLD}Competitor Buzz Scores${RST} ${DIM}(volume × avg_reach × sentiment_weight)${RST}\n`);

  const buzzData: { name: string; score: number; volume: number; reach: number; sentAvg: number }[] = [];

  for (const name of allNames) {
    const mentions = socialMentions[name];
    const volume = mentions.length;
    const totalReach = mentions.reduce((s, m) => s + m.reach, 0);
    const avgReach = totalReach / volume;
    const sentimentWeight = mentions.reduce((s, m) => {
      return s + (m.sentiment === "positive" ? 1.5 : m.sentiment === "neutral" ? 1.0 : 0.5);
    }, 0) / volume;
    const buzzScore = Math.round((volume * avgReach * sentimentWeight) / 1000);
    buzzData.push({ name, score: buzzScore, volume, reach: totalReach, sentAvg: sentimentWeight });
  }

  buzzData.sort((a, b) => b.score - a.score);
  const maxBuzz = Math.max(...buzzData.map((b) => b.score));

  for (const b of buzzData) {
    const normalized = Math.round((b.score / maxBuzz) * 100);
    const colour = b.name === "OurProduct" ? CYAN : b.score === maxBuzz ? MAGENTA : WHITE;
    say(`  ${colour}${b.name.padEnd(14)}${RST} ${bar(normalized, 30)} ${String(b.score).padStart(5)} pts  ${DIM}(${b.volume} mentions, ${(b.reach / 1000).toFixed(1)}k reach)${RST}`);
    await sleep(150);
  }

  // Recent mentions timeline
  say(`\n${BOLD}Recent Social Timeline${RST} ${DIM}(last 10 high-reach mentions)${RST}\n`);

  const allMentions: (SocialMention & { company: string })[] = [];
  for (const name of allNames) {
    for (const m of socialMentions[name]) {
      allMentions.push({ ...m, company: name });
    }
  }
  allMentions.sort((a, b) => b.date.localeCompare(a.date));

  for (const m of allMentions.slice(0, 10)) {
    const sentIcon = m.sentiment === "positive" ? `${GREEN}▲${RST}` : m.sentiment === "negative" ? `${RED}▼${RST}` : `${YELLOW}●${RST}`;
    const reachStr = m.reach >= 10000 ? `${MAGENTA}${BOLD}🔥 ${(m.reach / 1000).toFixed(0)}k${RST}` : `${DIM}${(m.reach / 1000).toFixed(1)}k${RST}`;
    say(`  ${DIM}${m.date}${RST} ${sentIcon} ${m.company.padEnd(12)} ${DIM}[${m.platform}]${RST} ${reachStr}  ${m.content.substring(0, 60)}${m.content.length > 60 ? "…" : ""}`);
    await sleep(100);
  }

  // Viral/high-reach flags
  say(`\n${BOLD}Viral Mentions${RST} ${DIM}(reach > 10k)${RST}\n`);
  const viral = allMentions.filter((m) => m.reach > 10000);
  if (viral.length === 0) {
    say(`  ${DIM}No viral mentions detected.${RST}`);
  } else {
    for (const m of viral) {
      const sentColour = m.sentiment === "positive" ? GREEN : m.sentiment === "negative" ? RED : YELLOW;
      say(`  ${MAGENTA}🔥${RST} ${m.company.padEnd(12)} ${sentColour}${m.sentiment.padEnd(9)}${RST} ${BOLD}${(m.reach / 1000).toFixed(0)}k reach${RST}  ${m.platform}`);
      say(`     ${DIM}"${m.content}"${RST}`);
      await sleep(100);
    }
  }
}

// ── Agent 5: Market Positioner ───────────────────────────────────────────────

async function agentMarketPositioner(): Promise<void> {
  say(`\n${BG_RED}${BOLD} 🗺️  AGENT 5 — MARKET POSITIONER ${RST}`);
  say(`${RED}   Role: Strategic Mapping${RST}`);
  say(divider());
  await sleep(300);

  // Calculate position data
  const positions: PositionData[] = [];
  for (const name of allNames) {
    const tiers = pricing[name];
    const proTier = tiers.find((t) => t.tierName === "Pro");
    const entTier = tiers.find((t) => t.tierName === "Enterprise");
    const avgPrice = proTier && entTier ? (proTier.monthlyPrice + entTier.monthlyPrice) / 2 : 50;
    const featureCount = features.filter((f) => f.hasIt[name]).length;

    // Normalize: price 0-350 → 0-100, features 0-12 → 0-100
    const priceScore = Math.round((avgPrice / 350) * 100);
    const featureScore = Math.round((featureCount / 12) * 100);
    positions.push({ name, priceScore, featureScore });
  }

  say(`\n${BOLD}Market Positioning Map${RST} ${DIM}(Price vs Features)${RST}\n`);

  const plotW = 50;
  const plotH = 20;
  const grid: string[][] = [];

  // Initialize grid
  for (let y = 0; y < plotH; y++) {
    grid.push(new Array(plotW).fill(" "));
  }

  // Place competitors on grid
  const symbols: Record<string, string> = {
    OurProduct: `${CYAN}◆${RST}`,
    CompeteX: `${RED}■${RST}`,
    RivalTech: `${GREEN}▲${RST}`,
    MarketEdge: `${MAGENTA}●${RST}`,
    StartupZ: `${YELLOW}★${RST}`,
  };
  const symbolsPlain: Record<string, string> = {
    OurProduct: "◆",
    CompeteX: "■",
    RivalTech: "▲",
    MarketEdge: "●",
    StartupZ: "★",
  };

  const placed: { name: string; px: number; py: number }[] = [];
  for (const pos of positions) {
    const px = Math.min(plotW - 1, Math.max(0, Math.round((pos.priceScore / 100) * (plotW - 1))));
    const py = Math.min(plotH - 1, Math.max(0, plotH - 1 - Math.round((pos.featureScore / 100) * (plotH - 1))));
    grid[py][px] = symbols[pos.name];
    placed.push({ name: pos.name, px, py });
  }

  // Y-axis label and grid
  say(`  ${BOLD}Features${RST}`);
  say(`  ${DIM}100%${RST} ┌${"─".repeat(plotW)}┐`);

  for (let y = 0; y < plotH; y++) {
    const yLabel = y === plotH - 1 ? "  0% " : "     ";
    let hasAnsi = false;
    for (const cell of grid[y]) {
      if (cell.includes("\x1b")) { hasAnsi = true; break; }
    }
    // Build row handling ANSI-coded characters
    let row = "";
    for (const cell of grid[y]) {
      if (cell.includes("\x1b")) {
        row += cell;
      } else if (cell === " ") {
        // Add faint grid dots at intervals
        row += (y % 5 === 0) ? `${DIM}·${RST}` : " ";
      } else {
        row += cell;
      }
    }
    say(`${yLabel}│${row}│`);
    await sleep(40);
  }

  say(`     └${"─".repeat(plotW)}┘`);
  say(`      ${DIM}0%${" ".repeat(plotW - 6)}100%${RST}`);
  say(`      ${"".padStart(Math.round(plotW / 2) - 3)}${BOLD}Price →${RST}`);

  // Legend
  say(`\n  ${BOLD}Legend${RST}`);
  for (const pos of positions) {
    const sym = symbolsPlain[pos.name];
    const colour = pos.name === "OurProduct" ? CYAN : WHITE;
    say(`    ${symbols[pos.name]}  ${colour}${pos.name.padEnd(14)}${RST} ${DIM}Price: ${pos.priceScore}%  Features: ${pos.featureScore}%${RST}`);
  }

  // Competitive distances
  say(`\n${BOLD}Competitive Distance from OurProduct${RST} ${DIM}(Euclidean in 2D space)${RST}\n`);
  const ourPos = positions.find((p) => p.name === "OurProduct")!;
  const distances: { name: string; dist: number }[] = [];
  for (const pos of positions) {
    if (pos.name === "OurProduct") continue;
    const dist = Math.sqrt(Math.pow(pos.priceScore - ourPos.priceScore, 2) + Math.pow(pos.featureScore - ourPos.featureScore, 2));
    distances.push({ name: pos.name, dist: Math.round(dist * 10) / 10 });
  }
  distances.sort((a, b) => a.dist - b.dist);

  for (const d of distances) {
    const threat = d.dist < 20 ? `${RED}CLOSE${RST}` : d.dist < 40 ? `${YELLOW}MODERATE${RST}` : `${GREEN}DISTANT${RST}`;
    say(`  ${d.name.padEnd(14)} distance: ${String(d.dist).padStart(5)}  ${threat}`);
    await sleep(100);
  }
}

// ── Agent 6: Briefing Writer ─────────────────────────────────────────────────

async function agentBriefingWriter(): Promise<void> {
  say(`\n${BG_RED}${BOLD} 📋 AGENT 6 — BRIEFING WRITER ${RST}`);
  say(`${RED}   Role: Executive Summary${RST}`);
  say(divider());
  await sleep(400);

  const today = new Date().toISOString().split("T")[0];

  say("");
  say(`  ${"═".repeat(60)}`);
  say(`  ${BOLD}${CYAN}   COMPETITIVE INTELLIGENCE BRIEFING${RST}`);
  say(`  ${DIM}   Prepared: ${today}  |  Classification: INTERNAL${RST}`);
  say(`  ${"═".repeat(60)}`);
  await sleep(300);

  // Market overview
  say(`\n  ${BOLD}MARKET OVERVIEW${RST}`);
  say(`  ${DIM}${"─".repeat(56)}${RST}`);
  say(`  The competitive SaaS landscape shows increasing price pressure from`);
  say(`  value-oriented challengers (RivalTech, StartupZ) while established`);
  say(`  players (CompeteX) maintain position through feature breadth. OurProduct`);
  say(`  occupies a strong mid-market position with competitive AI capabilities.`);
  await sleep(300);

  // Threat assessment
  say(`\n  ${BOLD}THREAT ASSESSMENT${RST}`);
  say(`  ${DIM}${"─".repeat(56)}${RST}`);

  interface ThreatEntry { name: string; level: string; icon: string; vector: string; weakness: string }
  const threats: ThreatEntry[] = [
    { name: "RivalTech", level: "HIGH", icon: "🔴", vector: "Aggressive pricing undercutting our Pro tier by 38%", weakness: "No AI features, no custom workflows" },
    { name: "CompeteX", level: "MEDIUM", icon: "🟡", vector: "Enterprise dominance with white-label capabilities", weakness: "Overpriced, dated UI, layoffs signal instability" },
    { name: "MarketEdge", level: "LOW", icon: "🟢", vector: "Superior analytics depth in niche segment", weakness: "No mobile, no SSO, limited market breadth" },
    { name: "StartupZ", level: "LOW", icon: "🟢", vector: "Free tier capturing early-stage market share", weakness: "Reliability issues, minimal feature set" },
  ];

  say(`\n  ${"Competitor".padEnd(14)} ${"Threat".padEnd(10)} ${"Primary Vector".padEnd(42)} Weakness`);
  say(`  ${"─".repeat(14)} ${"─".repeat(10)} ${"─".repeat(42)} ${"─".repeat(30)}`);

  for (const t of threats) {
    const levelColour = t.level === "HIGH" ? RED : t.level === "MEDIUM" ? YELLOW : GREEN;
    say(`  ${t.name.padEnd(14)} ${t.icon} ${levelColour}${t.level.padEnd(7)}${RST} ${t.vector.substring(0, 42).padEnd(42)} ${DIM}${t.weakness}${RST}`);
    await sleep(200);
  }

  // Opportunities
  say(`\n  ${BOLD}${GREEN}OPPORTUNITIES${RST}`);
  say(`  ${DIM}${"─".repeat(56)}${RST}`);
  say(`  ${GREEN}●${RST} RivalTech's lack of AI features creates a differentiation window —`);
  say(`    double down on AI-powered automation to widen the gap.`);
  say(`  ${GREEN}●${RST} CompeteX pricing ($349 enterprise) leaves room to win enterprise`);
  say(`    deals with our $199 tier — emphasize 43% cost savings.`);
  say(`  ${GREEN}●${RST} MarketEdge and StartupZ both lack core features (SSO, workflows)`);
  say(`    making them easy targets for competitive displacement campaigns.`);
  await sleep(300);

  // Risks
  say(`\n  ${BOLD}${RED}RISKS${RST}`);
  say(`  ${DIM}${"─".repeat(56)}${RST}`);
  say(`  ${RED}●${RST} RivalTech's 3x growth trajectory and aggressive hiring (40 engineers)`);
  say(`    could close the feature gap within 6-12 months.`);
  say(`  ${RED}●${RST} CompeteX's white-label capability locks in agency clients —`);
  say(`    we risk losing this segment entirely without a competing offering.`);
  say(`  ${RED}●${RST} StartupZ's Product Hunt virality (22k reach) signals strong brand`);
  say(`    awareness among early adopters, our future pipeline.`);
  await sleep(300);

  // Recommended actions
  say(`\n  ${BOLD}${CYAN}RECOMMENDED ACTIONS${RST}`);
  say(`  ${DIM}${"─".repeat(56)}${RST}`);
  say(`  ${CYAN}1.${RST} ${BOLD}Launch white-label offering by Q3${RST} — neutralizes CompeteX's`);
  say(`     sole enterprise advantage and opens the agency revenue channel.`);
  say(`  ${CYAN}2.${RST} ${BOLD}Create "Switch from RivalTech" campaign${RST} — target their users`);
  say(`     with a comparison landing page highlighting AI + workflows.`);
  say(`  ${CYAN}3.${RST} ${BOLD}Improve mobile app experience${RST} — our most-cited negative`);
  say(`     in reviews; fixing this removes a competitive talking point.`);
  await sleep(300);

  // Bottom line
  say(`\n  ${"═".repeat(60)}`);
  say(`  ${BOLD}BOTTOM LINE:${RST} OurProduct holds a strong mid-market position with`);
  say(`  the best balance of price, features, and AI capabilities — but`);
  say(`  RivalTech's growth and CompeteX's white-label moat require`);
  say(`  immediate strategic action in the next two quarters.`);
  say(`  ${"═".repeat(60)}`);
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.clear();

  say(`${BOLD}${CYAN}`);
  say(`  ╔══════════════════════════════════════════════════════════════╗`);
  say(`  ║           COMPETITIVE INTELLIGENCE MONITOR                  ║`);
  say(`  ║           ─────────────────────────────────                  ║`);
  say(`  ║     6 AI Agents  •  4 Competitors  •  1 Briefing            ║`);
  say(`  ╚══════════════════════════════════════════════════════════════╝${RST}`);
  say("");

  say(`${DIM}Initializing competitive intelligence gathering...${RST}`);
  await sleep(400);

  say(`\n${BOLD}Targets:${RST}`);
  for (const comp of competitors) {
    say(`  ${MAGENTA}▸${RST} ${comp.name.padEnd(14)} ${DIM}${comp.description}${RST}`);
    await sleep(150);
  }
  say(`  ${CYAN}▸${RST} ${ourCompany.name.padEnd(14)} ${DIM}(reference — ${ourCompany.description})${RST}`);
  await sleep(400);

  say(`\n${DIM}Deploying 6 intelligence agents...${RST}\n`);
  await sleep(300);

  // Run all agents sequentially
  await agentProductScanner();
  await sleep(500);

  await agentPricingAnalyst();
  await sleep(500);

  await agentReviewMiner();
  await sleep(500);

  await agentSocialListener();
  await sleep(500);

  await agentMarketPositioner();
  await sleep(500);

  await agentBriefingWriter();
  await sleep(400);

  // Footer
  say(`\n${DIM}${"─".repeat(72)}${RST}`);
  say(`${DIM}Competitive Intel Monitor — All 6 agents completed successfully.${RST}`);
  say(`${DIM}${allNames.length} companies analyzed  •  ${features.length} features tracked  •  ${Object.values(reviews).flat().length} reviews mined${RST}`);
  say(`${DIM}${Object.values(socialMentions).flat().length} social mentions processed  •  Report generated ${new Date().toISOString()}${RST}`);
  say(`${DIM}${"─".repeat(72)}${RST}\n`);
}

main().catch(console.error);
