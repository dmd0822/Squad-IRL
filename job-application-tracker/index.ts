// Job Application Tracker — 5 AI agents managing a job search pipeline

// ─── Helpers ────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const fmt = (n: number) => '$' + n.toLocaleString('en-US');

function bar(value: number, max: number, width: number = 24): string {
  const filled = Math.round((value / max) * width);
  return '█'.repeat(Math.min(filled, width)) + '░'.repeat(Math.max(width - filled, 0));
}

const c = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m',
  cyan: '\x1b[36m', magenta: '\x1b[35m', white: '\x1b[37m',
  bgGreen: '\x1b[42m', bgYellow: '\x1b[43m', bgRed: '\x1b[41m',
};

function pad(s: string, len: number): string {
  const stripped = s.replace(/\x1b\[[0-9;]*m/g, '');
  return s + ' '.repeat(Math.max(0, len - stripped.length));
}

function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

function daysAgoStr(days: number): string {
  const d = new Date(); d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

// ─── Data Model ─────────────────────────────────────────────────────────────

type Stage = 'applied' | 'phone-screen' | 'technical' | 'onsite' | 'offer' | 'accepted' | 'rejected';

interface Application {
  id: number;
  company: string;
  role: string;
  location: string;
  stage: Stage;
  appliedDate: string;
  lastContact: string;
  salary: { min: number; max: number };
  notes: string;
  contactName: string;
  contactEmail: string;
}

interface SalaryData {
  role: string;
  level: string;
  location: string;
  base: { p25: number; p50: number; p75: number };
  equity: { p25: number; p50: number; p75: number };
  bonus: { p25: number; p50: number; p75: number };
}

interface OfferDetail {
  company: string;
  base: number;
  equity: number;
  bonus: number;
  benefits: number;
  growth: number;
  culture: number;
  commute: number;
  remotePolicy: string;
}

const today = new Date().toISOString().slice(0, 10);

const applications: Application[] = [
  {
    id: 1, company: 'Acme Corp', role: 'Senior Frontend Engineer', location: 'San Francisco',
    stage: 'offer', appliedDate: daysAgoStr(45), lastContact: daysAgoStr(2),
    salary: { min: 155000, max: 190000 },
    notes: 'Strong React + TypeScript team. Series C startup, 200 employees.',
    contactName: 'Sarah Chen', contactEmail: 'sarah.chen@acmecorp.io',
  },
  {
    id: 2, company: 'TechNova', role: 'Full Stack Developer', location: 'Remote',
    stage: 'technical', appliedDate: daysAgoStr(20), lastContact: daysAgoStr(10),
    salary: { min: 130000, max: 165000 },
    notes: 'Node + React stack. Coding challenge completed — awaiting system design round.',
    contactName: 'Marcus Rivera', contactEmail: 'mrivera@technova.dev',
  },
  {
    id: 3, company: 'DataStream', role: 'Staff Engineer', location: 'New York',
    stage: 'phone-screen', appliedDate: daysAgoStr(12), lastContact: daysAgoStr(9),
    salary: { min: 190000, max: 240000 },
    notes: 'Data infrastructure team. Phone screen with hiring manager scheduled.',
    contactName: 'Priya Patel', contactEmail: 'ppatel@datastream.com',
  },
  {
    id: 4, company: 'CloudPeak', role: 'Platform Engineer', location: 'Seattle',
    stage: 'onsite', appliedDate: daysAgoStr(30), lastContact: daysAgoStr(4),
    salary: { min: 160000, max: 200000 },
    notes: 'Kubernetes-heavy. Onsite loop: 4 rounds including architecture deep dive.',
    contactName: 'James Kowalski', contactEmail: 'jkowalski@cloudpeak.io',
  },
  {
    id: 5, company: 'PixelForge', role: 'UI/UX Engineer', location: 'Austin',
    stage: 'applied', appliedDate: daysAgoStr(5), lastContact: daysAgoStr(5),
    salary: { min: 120000, max: 155000 },
    notes: 'Design-systems focused team. Applied via referral from college friend.',
    contactName: 'Dana Morales', contactEmail: 'dmorales@pixelforge.co',
  },
  {
    id: 6, company: 'NeuralPath', role: 'ML Engineer', location: 'San Francisco',
    stage: 'offer', appliedDate: daysAgoStr(50), lastContact: daysAgoStr(1),
    salary: { min: 180000, max: 230000 },
    notes: 'AI/ML platform team. Offer letter received — equity package under review.',
    contactName: 'Anika Johansson', contactEmail: 'ajohansson@neuralpath.ai',
  },
  {
    id: 7, company: 'GreenByte', role: 'DevOps Engineer', location: 'Denver',
    stage: 'rejected', appliedDate: daysAgoStr(60), lastContact: daysAgoStr(35),
    salary: { min: 135000, max: 170000 },
    notes: 'Rejected after final round. Feedback: wanted more Terraform experience.',
    contactName: 'Tom Nguyen', contactEmail: 'tnguyen@greenbyte.dev',
  },
  {
    id: 8, company: 'Quantum Labs', role: 'Backend Engineer', location: 'Boston',
    stage: 'applied', appliedDate: daysAgoStr(3), lastContact: daysAgoStr(3),
    salary: { min: 145000, max: 185000 },
    notes: 'Distributed systems team. Applied to principal-level opening.',
    contactName: 'Elena Ruiz', contactEmail: 'eruiz@quantumlabs.io',
  },
];

const salaryDatabase: SalaryData[] = [
  { role: 'Senior Frontend Engineer', level: 'Senior', location: 'San Francisco',
    base: { p25: 140000, p50: 165000, p75: 195000 },
    equity: { p25: 30000, p50: 55000, p75: 90000 },
    bonus: { p25: 10000, p50: 20000, p75: 35000 } },
  { role: 'Full Stack Developer', level: 'Mid-Senior', location: 'Remote',
    base: { p25: 120000, p50: 145000, p75: 170000 },
    equity: { p25: 10000, p50: 25000, p75: 50000 },
    bonus: { p25: 5000, p50: 12000, p75: 22000 } },
  { role: 'Staff Engineer', level: 'Staff', location: 'New York',
    base: { p25: 185000, p50: 215000, p75: 250000 },
    equity: { p25: 60000, p50: 100000, p75: 160000 },
    bonus: { p25: 20000, p50: 35000, p75: 55000 } },
  { role: 'Platform Engineer', level: 'Senior', location: 'Seattle',
    base: { p25: 155000, p50: 178000, p75: 205000 },
    equity: { p25: 40000, p50: 70000, p75: 110000 },
    bonus: { p25: 12000, p50: 22000, p75: 38000 } },
  { role: 'UI/UX Engineer', level: 'Mid', location: 'Austin',
    base: { p25: 110000, p50: 132000, p75: 155000 },
    equity: { p25: 8000, p50: 18000, p75: 35000 },
    bonus: { p25: 5000, p50: 10000, p75: 18000 } },
  { role: 'ML Engineer', level: 'Senior', location: 'San Francisco',
    base: { p25: 175000, p50: 205000, p75: 240000 },
    equity: { p25: 50000, p50: 90000, p75: 150000 },
    bonus: { p25: 15000, p50: 30000, p75: 50000 } },
  { role: 'DevOps Engineer', level: 'Mid-Senior', location: 'Denver',
    base: { p25: 125000, p50: 148000, p75: 175000 },
    equity: { p25: 10000, p50: 22000, p75: 40000 },
    bonus: { p25: 5000, p50: 12000, p75: 20000 } },
  { role: 'Backend Engineer', level: 'Senior', location: 'Boston',
    base: { p25: 140000, p50: 162000, p75: 190000 },
    equity: { p25: 25000, p50: 50000, p75: 85000 },
    bonus: { p25: 10000, p50: 18000, p75: 30000 } },
];

const colAdjust: Record<string, number> = {
  'San Francisco': 1.0, 'New York': 0.97, 'Seattle': 0.93,
  'Boston': 0.90, 'Austin': 0.82, 'Denver': 0.84, 'Remote': 0.88,
};

// ─── Agent 1: Pipeline Manager ─────────────────────────────────────────────

async function agentPipelineManager(): Promise<void> {
  console.log(`\n${c.bold}${c.cyan}╔══════════════════════════════════════════════════════════════════════════════╗${c.reset}`);
  console.log(`${c.bold}${c.cyan}║  🗂️  AGENT 1 — PIPELINE MANAGER                                           ║${c.reset}`);
  console.log(`${c.bold}${c.cyan}╚══════════════════════════════════════════════════════════════════════════════╝${c.reset}`);
  await sleep(400);

  const stageOrder: Stage[] = ['applied', 'phone-screen', 'technical', 'onsite', 'offer', 'rejected'];
  const stageLabels: Record<Stage, string> = {
    'applied': 'APPLIED', 'phone-screen': 'PHONE SCR', 'technical': 'TECHNICAL',
    'onsite': 'ONSITE', 'offer': 'OFFER', 'rejected': 'REJECTED', 'accepted': 'ACCEPTED',
  };
  const stageColors: Record<Stage, string> = {
    'applied': c.cyan, 'phone-screen': c.yellow, 'technical': c.yellow,
    'onsite': c.yellow, 'offer': c.green, 'rejected': c.red, 'accepted': c.green,
  };

  const columns: Record<Stage, Application[]> = {
    'applied': [], 'phone-screen': [], 'technical': [],
    'onsite': [], 'offer': [], 'rejected': [], 'accepted': [],
  };
  for (const app of applications) columns[app.stage].push(app);

  const colWidth = 16;
  const cols = stageOrder;
  const maxRows = Math.max(...cols.map(s => columns[s].length), 1);

  console.log(`\n  ${c.dim}Scanning pipeline...${c.reset}`);
  await sleep(500);

  // Header
  let headerLine = '┌' + cols.map(() => '─'.repeat(colWidth)).join('┬') + '┐';
  console.log(`  ${headerLine}`);
  await sleep(100);

  let labelLine = '│';
  for (const stage of cols) {
    const count = columns[stage].length;
    const label = `${stageLabels[stage]}(${count})`;
    const color = stageColors[stage];
    labelLine += `${color}${c.bold}` + label.padStart(Math.floor((colWidth + label.length) / 2)).padEnd(colWidth) + `${c.reset}│`;
  }
  console.log(`  ${labelLine}`);
  console.log(`  ${'├' + cols.map(() => '─'.repeat(colWidth)).join('┼') + '┤'}`);
  await sleep(200);

  // Rows
  for (let row = 0; row < maxRows; row++) {
    let rowLine = '│';
    for (const stage of cols) {
      const app = columns[stage][row];
      if (app) {
        const name = app.company.length > colWidth - 2 ? app.company.slice(0, colWidth - 3) + '…' : app.company;
        const color = stageColors[stage];
        rowLine += ` ${color}${name}${c.reset}` + ' '.repeat(Math.max(0, colWidth - name.length - 1)) + '│';
      } else {
        rowLine += ' '.repeat(colWidth) + '│';
      }
    }
    console.log(`  ${rowLine}`);
    await sleep(150);
  }

  console.log(`  ${'└' + cols.map(() => '─'.repeat(colWidth)).join('┴') + '┘'}`);
  await sleep(300);

  // Pipeline Statistics
  console.log(`\n  ${c.bold}Pipeline Statistics${c.reset}`);
  console.log(`  ${'─'.repeat(50)}`);

  const active = applications.filter(a => a.stage !== 'rejected');
  const totalDays = active.reduce((sum, a) => sum + daysBetween(a.appliedDate, today), 0);
  const avgDays = Math.round(totalDays / active.length);

  const stages: Stage[] = ['applied', 'phone-screen', 'technical', 'onsite', 'offer'];
  for (let i = 0; i < stages.length - 1; i++) {
    const from = columns[stages[i]].length + columns[stages[i + 1]].length +
      (i + 2 < stages.length ? stages.slice(i + 1).reduce((s, st) => s + columns[st].length, 0) : 0);
    const total = applications.filter(a => a.stage !== 'rejected').length;
    const toCount = stages.slice(i + 1).reduce((s, st) => s + columns[st].length, 0);
    const rate = total > 0 ? Math.round((toCount / total) * 100) : 0;
    console.log(`  ${stageLabels[stages[i]]} → ${stageLabels[stages[i + 1]]}: ${c.bold}${rate}%${c.reset} conversion`);
    await sleep(100);
  }

  console.log(`\n  Total applications: ${c.bold}${applications.length}${c.reset}`);
  console.log(`  Active pipeline:    ${c.bold}${active.length}${c.reset}`);
  console.log(`  Offers received:    ${c.bold}${c.green}${columns['offer'].length}${c.reset}`);
  console.log(`  Avg days in pipe:   ${c.bold}${avgDays} days${c.reset}`);
}

// ─── Agent 2: Follow-up Coach ───────────────────────────────────────────────

async function agentFollowUpCoach(): Promise<void> {
  console.log(`\n${c.bold}${c.yellow}╔══════════════════════════════════════════════════════════════════════════════╗${c.reset}`);
  console.log(`${c.bold}${c.yellow}║  📧  AGENT 2 — FOLLOW-UP COACH                                            ║${c.reset}`);
  console.log(`${c.bold}${c.yellow}╚══════════════════════════════════════════════════════════════════════════════╝${c.reset}`);
  await sleep(400);

  const activeApps = applications.filter(a => !['rejected', 'accepted'].includes(a.stage));

  console.log(`\n  ${c.dim}Analyzing contact recency for ${activeApps.length} active applications...${c.reset}`);
  await sleep(500);

  // Staleness report
  console.log(`\n  ${c.bold}Contact Recency Report${c.reset}`);
  console.log(`  ${'─'.repeat(62)}`);
  console.log(`  ${pad('Company', 18)} ${pad('Last Contact', 14)} ${pad('Days Ago', 10)} Status`);
  console.log(`  ${'─'.repeat(62)}`);

  for (const app of activeApps) {
    const daysSince = daysBetween(app.lastContact, today);
    const stale = daysSince > 7;
    const statusIcon = stale ? `${c.red}⚠ STALE${c.reset}` : `${c.green}✓ Fresh${c.reset}`;
    console.log(`  ${pad(app.company, 18)} ${pad(app.lastContact, 14)} ${pad(String(daysSince), 10)} ${statusIcon}`);
    await sleep(120);
  }

  // Draft follow-up emails for stale apps
  const staleApps = activeApps.filter(a => daysBetween(a.lastContact, today) > 7);

  if (staleApps.length === 0) {
    console.log(`\n  ${c.green}All applications have recent contact. No follow-ups needed!${c.reset}`);
    return;
  }

  console.log(`\n  ${c.bold}${c.yellow}Found ${staleApps.length} stale application(s) — drafting follow-up emails...${c.reset}`);
  await sleep(500);

  const emailTemplates: Record<string, { subject: string; body: string }> = {
    'TechNova': {
      subject: 'Following up — Full Stack Developer technical round',
      body: [
        `Dear Marcus,`,
        ``,
        `I hope this message finds you well. I wanted to follow up on our conversation`,
        `about the Full Stack Developer position. I really enjoyed the coding challenge`,
        `and discussing TechNova's Node + React architecture — especially the approach`,
        `to micro-frontends you mentioned during our initial call.`,
        ``,
        `Since we last spoke, I've been diving deeper into your open-source middleware`,
        `library and have some ideas about the caching layer optimization we discussed.`,
        `I'm excited about the opportunity to contribute to TechNova's platform at scale.`,
        ``,
        `Could you share an update on the timeline for the system design round? I'm`,
        `flexible on scheduling and happy to accommodate the team's availability.`,
        ``,
        `Best regards`,
      ].join('\n'),
    },
    'DataStream': {
      subject: 'Quick check-in — Staff Engineer phone screen',
      body: [
        `Hi Priya,`,
        ``,
        `I wanted to touch base regarding the Staff Engineer role on the data`,
        `infrastructure team. Our initial conversation about DataStream's real-time`,
        `pipeline architecture was fascinating — particularly the migration from batch`,
        `to streaming processing you described.`,
        ``,
        `I've been reviewing DataStream's recent blog posts on your new event-driven`,
        `architecture, and I'm impressed by the scale of data your platform handles.`,
        `My experience leading the migration at my current company from Kafka to Pulsar`,
        `would translate well to the challenges your team is tackling.`,
        ``,
        `Do you have any updates on next steps for the phone screen? I'd love to`,
        `continue our discussion about the team's technical roadmap.`,
        ``,
        `Warm regards`,
      ].join('\n'),
    },
  };

  for (const app of staleApps) {
    const template = emailTemplates[app.company];
    if (!template) continue;
    const daysSince = daysBetween(app.lastContact, today);

    console.log(`\n  ${c.bold}${c.cyan}┌${'─'.repeat(72)}┐${c.reset}`);
    console.log(`  ${c.bold}${c.cyan}│${c.reset} ${c.bold}To:${c.reset} ${app.contactName} <${app.contactEmail}>${' '.repeat(Math.max(0, 72 - 5 - app.contactName.length - app.contactEmail.length - 3))}${c.bold}${c.cyan}│${c.reset}`);
    console.log(`  ${c.bold}${c.cyan}│${c.reset} ${c.bold}Re:${c.reset} ${pad(template.subject, 68)}${c.bold}${c.cyan}│${c.reset}`);
    console.log(`  ${c.bold}${c.cyan}│${c.reset} ${c.dim}${pad(`${daysSince} days since last contact — ${app.stage} stage`, 68)}${c.reset}${c.bold}${c.cyan}│${c.reset}`);
    console.log(`  ${c.bold}${c.cyan}├${'─'.repeat(72)}┤${c.reset}`);
    await sleep(200);

    for (const line of template.body.split('\n')) {
      console.log(`  ${c.bold}${c.cyan}│${c.reset} ${pad(line, 70)}${c.bold}${c.cyan}│${c.reset}`);
      await sleep(50);
    }
    console.log(`  ${c.bold}${c.cyan}└${'─'.repeat(72)}┘${c.reset}`);
    await sleep(300);
  }
}

// ─── Agent 3: Interview Prep ────────────────────────────────────────────────

async function agentInterviewPrep(): Promise<void> {
  console.log(`\n${c.bold}${c.magenta}╔══════════════════════════════════════════════════════════════════════════════╗${c.reset}`);
  console.log(`${c.bold}${c.magenta}║  🎯  AGENT 3 — INTERVIEW PREP                                             ║${c.reset}`);
  console.log(`${c.bold}${c.magenta}╚══════════════════════════════════════════════════════════════════════════════╝${c.reset}`);
  await sleep(400);

  const interviewApps = applications.filter(a =>
    ['phone-screen', 'technical', 'onsite'].includes(a.stage)
  );

  console.log(`\n  ${c.dim}Preparing interview kits for ${interviewApps.length} upcoming interviews...${c.reset}`);
  await sleep(500);

  interface PrepCard {
    app: Application;
    companySummary: string;
    techStack: string[];
    recentNews: string;
    questions: { q: string; points: string[] }[];
  }

  const prepCards: PrepCard[] = [
    {
      app: applications.find(a => a.company === 'TechNova')!,
      companySummary: 'TechNova is a Series B startup (450 employees) building developer productivity tools. Known for their open-source middleware and strong remote culture with engineers across 12 countries.',
      techStack: ['React 18', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS Lambda'],
      recentNews: 'Raised $80M Series B in Q3; launched real-time collaboration features.',
      questions: [
        { q: 'Design a real-time collaborative editing system for code',
          points: ['Operational Transform vs CRDT tradeoffs', 'WebSocket architecture at scale', 'Conflict resolution strategies'] },
        { q: 'How would you optimize a Node.js API experiencing high latency under load?',
          points: ['Connection pooling and query optimization', 'Caching layers (Redis, CDN)', 'Horizontal scaling with load balancers'] },
        { q: 'Walk through your approach to migrating a monolith to microservices',
          points: ['Strangler fig pattern', 'Domain-driven decomposition', 'Shared database challenges'] },
        { q: 'How do you ensure frontend performance in a large React application?',
          points: ['Code splitting and lazy loading', 'React.memo and useMemo patterns', 'Bundle analysis with webpack-bundle-analyzer'] },
        { q: 'Describe your testing strategy for a full-stack feature',
          points: ['Unit → Integration → E2E testing pyramid', 'Contract testing for API boundaries', 'Snapshot testing for UI components'] },
      ],
    },
    {
      app: applications.find(a => a.company === 'DataStream')!,
      companySummary: 'DataStream is a public data infrastructure company (2,200 employees) specializing in real-time analytics. Their platform processes 4TB of events per second across Fortune 500 clients.',
      techStack: ['Java', 'Apache Kafka', 'Apache Flink', 'Kubernetes', 'Terraform', 'Snowflake'],
      recentNews: 'Launched streaming SQL engine; acquired DataMesh startup for $120M.',
      questions: [
        { q: 'Design a system that processes 1M events/second with exactly-once semantics',
          points: ['Kafka partitioning and consumer group rebalancing', 'Idempotent writes and deduplication', 'Checkpoint-based recovery in Flink'] },
        { q: 'How would you handle schema evolution in a distributed event pipeline?',
          points: ['Schema registry with backward/forward compatibility', 'Avro vs Protobuf tradeoffs', 'Dead-letter queues for malformed events'] },
        { q: 'Describe your experience leading technical migrations at scale',
          points: ['Phased rollout with feature flags', 'Dual-write patterns and data validation', 'Stakeholder communication and rollback plans'] },
        { q: 'How do you approach capacity planning for data infrastructure?',
          points: ['Load testing and traffic modeling', 'Cost-per-query optimization', 'Auto-scaling policies and resource quotas'] },
        { q: 'Walk through debugging a production latency spike in a distributed system',
          points: ['Distributed tracing with Jaeger/Zipkin', 'Correlating metrics, logs, and traces', 'GC tuning and thread pool analysis'] },
      ],
    },
    {
      app: applications.find(a => a.company === 'CloudPeak')!,
      companySummary: 'CloudPeak is a cloud-native infrastructure company (800 employees) building the next-gen PaaS. Known for Kubernetes expertise and open-source contributions to the CNCF ecosystem.',
      techStack: ['Go', 'Kubernetes', 'Istio', 'Prometheus', 'ArgoCD', 'Terraform'],
      recentNews: 'Released multi-cloud orchestration platform; SOC 2 Type II certified.',
      questions: [
        { q: 'Design a multi-tenant Kubernetes platform with strong isolation guarantees',
          points: ['Namespace vs cluster-level isolation', 'Network policies and service mesh mTLS', 'Resource quotas and limit ranges per tenant'] },
        { q: 'How would you implement zero-downtime deployments across multiple regions?',
          points: ['Blue-green vs canary vs rolling deployments', 'Global load balancing and DNS failover', 'Database migration strategies'] },
        { q: 'Describe your approach to building an internal developer platform',
          points: ['Golden paths and service templates', 'Self-service provisioning with guardrails', 'Platform-as-product mindset'] },
        { q: 'How do you handle secrets management in a Kubernetes environment?',
          points: ['Sealed Secrets vs Vault integration', 'RBAC and audit logging for secret access', 'Rotation policies and emergency revocation'] },
        { q: 'Walk through your incident response process for a platform outage',
          points: ['Runbooks and automated diagnostics', 'Communication protocols and status pages', 'Blameless post-mortems and action items'] },
      ],
    },
  ];

  for (const card of prepCards) {
    const stageLabel = card.app.stage.toUpperCase().replace('-', ' ');
    console.log(`\n  ${c.bold}${c.magenta}┌${'─'.repeat(74)}┐${c.reset}`);
    console.log(`  ${c.bold}${c.magenta}│${c.reset} ${c.bold}${pad(`${card.app.company} — ${card.app.role}`, 60)}${c.reset}${pad(`[${stageLabel}]`, 12)}${c.bold}${c.magenta}│${c.reset}`);
    console.log(`  ${c.bold}${c.magenta}├${'─'.repeat(74)}┤${c.reset}`);
    await sleep(200);

    console.log(`  ${c.bold}${c.magenta}│${c.reset} ${c.bold}Company Research${c.reset}${' '.repeat(58)}${c.bold}${c.magenta}│${c.reset}`);
    const summaryLines = wrapText(card.companySummary, 72);
    for (const line of summaryLines) {
      console.log(`  ${c.bold}${c.magenta}│${c.reset} ${c.dim}${pad(line, 72)}${c.reset}${c.bold}${c.magenta}│${c.reset}`);
    }
    await sleep(100);

    console.log(`  ${c.bold}${c.magenta}│${c.reset}${' '.repeat(74)}${c.bold}${c.magenta}│${c.reset}`);
    console.log(`  ${c.bold}${c.magenta}│${c.reset} ${c.bold}Tech Stack:${c.reset} ${pad(card.techStack.join(', '), 61)}${c.bold}${c.magenta}│${c.reset}`);
    console.log(`  ${c.bold}${c.magenta}│${c.reset} ${c.bold}Recent News:${c.reset} ${pad(card.recentNews, 60)}${c.bold}${c.magenta}│${c.reset}`);
    console.log(`  ${c.bold}${c.magenta}│${c.reset}${' '.repeat(74)}${c.bold}${c.magenta}│${c.reset}`);
    console.log(`  ${c.bold}${c.magenta}│${c.reset} ${c.bold}Likely Interview Questions${c.reset}${' '.repeat(48)}${c.bold}${c.magenta}│${c.reset}`);
    await sleep(150);

    for (let i = 0; i < card.questions.length; i++) {
      const qBlock = card.questions[i];
      console.log(`  ${c.bold}${c.magenta}│${c.reset} ${c.cyan}${pad(`  ${i + 1}. ${qBlock.q}`, 72)}${c.reset}${c.bold}${c.magenta}│${c.reset}`);
      for (const point of qBlock.points) {
        console.log(`  ${c.bold}${c.magenta}│${c.reset} ${c.dim}${pad(`     • ${point}`, 72)}${c.reset}${c.bold}${c.magenta}│${c.reset}`);
      }
      await sleep(100);
    }

    console.log(`  ${c.bold}${c.magenta}└${'─'.repeat(74)}┘${c.reset}`);
    await sleep(400);
  }
}

function wrapText(text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if (current.length + word.length + 1 > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = current ? current + ' ' + word : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// ─── Agent 4: Salary Researcher ─────────────────────────────────────────────

async function agentSalaryResearcher(): Promise<void> {
  console.log(`\n${c.bold}${c.green}╔══════════════════════════════════════════════════════════════════════════════╗${c.reset}`);
  console.log(`${c.bold}${c.green}║  💰  AGENT 4 — SALARY RESEARCHER                                          ║${c.reset}`);
  console.log(`${c.bold}${c.green}╚══════════════════════════════════════════════════════════════════════════════╝${c.reset}`);
  await sleep(400);

  const activeApps = applications.filter(a => a.stage !== 'rejected');

  console.log(`\n  ${c.dim}Compiling compensation data for ${activeApps.length} active roles...${c.reset}`);
  await sleep(500);

  const maxBase = Math.max(...salaryDatabase.map(s => s.base.p75));

  for (const app of activeApps) {
    const data = salaryDatabase.find(s => s.role === app.role && s.location === app.location);
    if (!data) continue;

    console.log(`\n  ${c.bold}${app.company} — ${app.role} (${app.location})${c.reset}`);
    console.log(`  ${c.dim}Level: ${data.level} | COL Adjustment: ${((colAdjust[app.location] ?? 1.0) * 100).toFixed(0)}%${c.reset}`);
    console.log(`  ${'─'.repeat(58)}`);
    await sleep(200);

    // Base salary bars
    console.log(`  ${c.bold}Base Salary${c.reset}`);
    const baseEntries = [
      { label: 'P25', value: data.base.p25 },
      { label: 'P50', value: data.base.p50 },
      { label: 'P75', value: data.base.p75 },
    ];
    for (const entry of baseEntries) {
      const barStr = bar(entry.value, maxBase, 28);
      console.log(`    ${pad(entry.label, 4)} ${c.green}${pad(fmt(entry.value), 10)}${c.reset} ${barStr}`);
      await sleep(80);
    }

    if (app.stage === 'offer') {
      const offerBase = Math.round((app.salary.min + app.salary.max) / 2);
      const barStr = bar(offerBase, maxBase, 28);
      console.log(`    ${c.bold}${pad('Offr', 4)} ${c.yellow}${pad(fmt(offerBase), 10)}${c.reset} ${barStr} ◄`);
    }
    await sleep(100);

    // Equity & Bonus table
    console.log(`\n    ${pad('', 8)} ${pad('Equity', 14)} ${pad('Bonus', 14)} ${pad('Total Comp', 14)}`);
    console.log(`    ${'─'.repeat(54)}`);
    const percentiles: Array<'p25' | 'p50' | 'p75'> = ['p25', 'p50', 'p75'];
    const pLabels = ['P25', 'P50', 'P75'];
    for (let i = 0; i < percentiles.length; i++) {
      const p = percentiles[i];
      const total = data.base[p] + data.equity[p] + data.bonus[p];
      console.log(`    ${pad(pLabels[i], 8)} ${pad(fmt(data.equity[p]), 14)} ${pad(fmt(data.bonus[p]), 14)} ${c.bold}${pad(fmt(total), 14)}${c.reset}`);
      await sleep(60);
    }
    await sleep(200);
  }

  // Location COL Summary
  console.log(`\n  ${c.bold}Cost-of-Living Adjustment Factors${c.reset}`);
  console.log(`  ${'─'.repeat(42)}`);
  for (const [loc, factor] of Object.entries(colAdjust).sort((a, b) => b[1] - a[1])) {
    const pct = (factor * 100).toFixed(0);
    const barStr = bar(factor, 1.0, 20);
    console.log(`  ${pad(loc, 18)} ${pad(`${pct}%`, 6)} ${barStr}`);
    await sleep(60);
  }
}

// ─── Agent 5: Decision Advisor ──────────────────────────────────────────────

async function agentDecisionAdvisor(): Promise<void> {
  console.log(`\n${c.bold}${c.white}${c.bgGreen}╔══════════════════════════════════════════════════════════════════════════════╗${c.reset}`);
  console.log(`${c.bold}${c.white}${c.bgGreen}║  ⚖️  AGENT 5 — DECISION ADVISOR                                           ║${c.reset}`);
  console.log(`${c.bold}${c.white}${c.bgGreen}╚══════════════════════════════════════════════════════════════════════════════╝${c.reset}`);
  await sleep(400);

  const offers = applications.filter(a => a.stage === 'offer');
  if (offers.length < 2) {
    console.log(`\n  ${c.dim}Need 2+ offers to run comparison. Currently ${offers.length} offer(s).${c.reset}`);
    return;
  }

  console.log(`\n  ${c.dim}Analyzing ${offers.length} competing offers...${c.reset}`);
  await sleep(500);

  const offerDetails: OfferDetail[] = [
    {
      company: 'Acme Corp', base: 170000, equity: 60000, bonus: 25000,
      benefits: 7, growth: 7, culture: 8, commute: 35, remotePolicy: 'Hybrid 3/2',
    },
    {
      company: 'NeuralPath', base: 195000, equity: 110000, bonus: 35000,
      benefits: 8, growth: 9, culture: 7, commute: 45, remotePolicy: 'Hybrid 2/3',
    },
  ];

  // Offer summary cards
  for (const offer of offerDetails) {
    const totalComp = offer.base + offer.equity + offer.bonus;
    console.log(`\n  ${c.bold}${c.cyan}┌${'─'.repeat(40)}┐${c.reset}`);
    console.log(`  ${c.bold}${c.cyan}│${c.reset} ${c.bold}${pad(offer.company, 38)}${c.reset}${c.bold}${c.cyan}│${c.reset}`);
    console.log(`  ${c.bold}${c.cyan}├${'─'.repeat(40)}┤${c.reset}`);
    console.log(`  ${c.bold}${c.cyan}│${c.reset}  Base:       ${pad(fmt(offer.base), 24)}${c.bold}${c.cyan}│${c.reset}`);
    console.log(`  ${c.bold}${c.cyan}│${c.reset}  Equity:     ${pad(fmt(offer.equity), 24)}${c.bold}${c.cyan}│${c.reset}`);
    console.log(`  ${c.bold}${c.cyan}│${c.reset}  Bonus:      ${pad(fmt(offer.bonus), 24)}${c.bold}${c.cyan}│${c.reset}`);
    console.log(`  ${c.bold}${c.cyan}│${c.reset}  ${c.bold}Total Comp: ${c.green}${pad(fmt(totalComp), 24)}${c.reset}${c.bold}${c.cyan}│${c.reset}`);
    console.log(`  ${c.bold}${c.cyan}│${c.reset}  Remote:     ${pad(offer.remotePolicy, 24)}${c.bold}${c.cyan}│${c.reset}`);
    console.log(`  ${c.bold}${c.cyan}│${c.reset}  Commute:    ${pad(`${offer.commute} min`, 24)}${c.bold}${c.cyan}│${c.reset}`);
    console.log(`  ${c.bold}${c.cyan}└${'─'.repeat(40)}┘${c.reset}`);
    await sleep(300);
  }

  // Weighted comparison matrix
  console.log(`\n  ${c.bold}Weighted Comparison Matrix${c.reset}`);
  await sleep(300);

  interface Category { name: string; weight: number; scores: Record<string, number> }

  const acme = offerDetails[0];
  const neural = offerDetails[1];

  const acmeTotalComp = acme.base + acme.equity + acme.bonus;
  const neuralTotalComp = neural.base + neural.equity + neural.bonus;
  const maxComp = Math.max(acmeTotalComp, neuralTotalComp);
  const acmeCompScore = Math.round((acmeTotalComp / maxComp) * 100);
  const neuralCompScore = Math.round((neuralTotalComp / maxComp) * 100);

  const categories: Category[] = [
    { name: 'Compensation', weight: 35, scores: { 'Acme Corp': acmeCompScore, 'NeuralPath': neuralCompScore } },
    { name: 'Growth', weight: 20, scores: { 'Acme Corp': acme.growth * 10, 'NeuralPath': neural.growth * 10 } },
    { name: 'Culture', weight: 20, scores: { 'Acme Corp': acme.culture * 10, 'NeuralPath': neural.culture * 10 } },
    { name: 'Work-Life Bal.', weight: 15, scores: {
        'Acme Corp': Math.round(100 - (acme.commute / 60) * 30),
        'NeuralPath': Math.round(100 - (neural.commute / 60) * 30),
      } },
    { name: 'Benefits', weight: 10, scores: { 'Acme Corp': acme.benefits * 10, 'NeuralPath': neural.benefits * 10 } },
  ];

  const colW1 = 20;
  const colW2 = 16;
  const colW3 = 16;
  const colW4 = 10;

  console.log(`\n  ┌${'─'.repeat(colW1)}┬${'─'.repeat(colW2)}┬${'─'.repeat(colW3)}┬${'─'.repeat(colW4)}┐`);
  console.log(`  │${c.bold}${pad(' Category (Wt)', colW1)}${c.reset}│${c.bold}${pad(' Acme Corp', colW2)}${c.reset}│${c.bold}${pad(' NeuralPath', colW3)}${c.reset}│${c.bold}${pad(' Weight', colW4)}${c.reset}│`);
  console.log(`  ├${'─'.repeat(colW1)}┼${'─'.repeat(colW2)}┼${'─'.repeat(colW3)}┼${'─'.repeat(colW4)}┤`);
  await sleep(200);

  let acmeTotal = 0;
  let neuralTotal = 0;

  for (const cat of categories) {
    const acmeScore = cat.scores['Acme Corp'];
    const neuralScore = cat.scores['NeuralPath'];
    const acmeWeighted = (acmeScore * cat.weight) / 100;
    const neuralWeighted = (neuralScore * cat.weight) / 100;
    acmeTotal += acmeWeighted;
    neuralTotal += neuralWeighted;

    const nameStr = ` ${cat.name}`;
    const acmeStr = ` ${acmeScore} → ${acmeWeighted.toFixed(1)}`;
    const neuralStr = ` ${neuralScore} → ${neuralWeighted.toFixed(1)}`;
    const wtStr = `  ${cat.weight}%`;

    const acmeColor = acmeScore >= neuralScore ? c.green : c.dim;
    const neuralColor = neuralScore >= acmeScore ? c.green : c.dim;

    console.log(`  │${pad(nameStr, colW1)}│${acmeColor}${pad(acmeStr, colW2)}${c.reset}│${neuralColor}${pad(neuralStr, colW3)}${c.reset}│${pad(wtStr, colW4)}│`);
    await sleep(150);
  }

  console.log(`  ├${'─'.repeat(colW1)}┼${'─'.repeat(colW2)}┼${'─'.repeat(colW3)}┼${'─'.repeat(colW4)}┤`);
  const acmeTotalColor = acmeTotal >= neuralTotal ? c.green + c.bold : c.dim;
  const neuralTotalColor = neuralTotal >= acmeTotal ? c.green + c.bold : c.dim;
  console.log(`  │${c.bold}${pad(' TOTAL', colW1)}${c.reset}│${acmeTotalColor}${pad(` ${acmeTotal.toFixed(1)}`, colW2)}${c.reset}│${neuralTotalColor}${pad(` ${neuralTotal.toFixed(1)}`, colW3)}${c.reset}│${pad('  100%', colW4)}│`);
  console.log(`  └${'─'.repeat(colW1)}┴${'─'.repeat(colW2)}┴${'─'.repeat(colW3)}┴${'─'.repeat(colW4)}┘`);
  await sleep(500);

  // Recommendation
  const winner = neuralTotal > acmeTotal ? neural : acme;
  const loser = winner === neural ? acme : neural;
  const winnerTotal = Math.max(acmeTotal, neuralTotal);
  const loserTotal = Math.min(acmeTotal, neuralTotal);
  const margin = (winnerTotal - loserTotal).toFixed(1);

  console.log(`\n  ${c.bold}${c.green}╔${'═'.repeat(72)}╗${c.reset}`);
  console.log(`  ${c.bold}${c.green}║${c.reset} ${c.bold}RECOMMENDATION${c.reset}${' '.repeat(58)}${c.bold}${c.green}║${c.reset}`);
  console.log(`  ${c.bold}${c.green}╠${'═'.repeat(72)}╣${c.reset}`);

  const recLines = [
    `${winner.company} edges ahead with a weighted score of ${winnerTotal.toFixed(1)} vs`,
    `${loser.company}'s ${loserTotal.toFixed(1)} (margin: +${margin} points).`,
    ``,
    `Key advantages for ${winner.company}:`,
    `  • Total compensation: ${fmt(winner.base + winner.equity + winner.bonus)}/year`,
    `  • ${winner === neural ? 'Stronger growth trajectory in AI/ML space' : 'Better culture fit and work-life balance'}`,
    `  • ${winner === neural ? 'Higher equity upside with pre-IPO stock' : 'Shorter commute and established product-market fit'}`,
    ``,
    `Consider negotiating with ${loser.company} — their ${loser === acme ? 'culture score' : 'benefits package'}`,
    `is competitive and a comp bump could change the outcome.`,
  ];

  for (const line of recLines) {
    console.log(`  ${c.bold}${c.green}║${c.reset} ${pad(line, 72)}${c.bold}${c.green}║${c.reset}`);
    await sleep(80);
  }
  console.log(`  ${c.bold}${c.green}╚${'═'.repeat(72)}╝${c.reset}`);
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.clear();
  console.log(`${c.bold}${c.cyan}`);
  console.log(`  ╔════════════════════════════════════════════════════════════════════════╗`);
  console.log(`  ║                                                                        ║`);
  console.log(`  ║   🏢  J O B   A P P L I C A T I O N   T R A C K E R                   ║`);
  console.log(`  ║                                                                        ║`);
  console.log(`  ║   5 AI Agents • 8 Applications • Full Pipeline Intelligence            ║`);
  console.log(`  ║                                                                        ║`);
  console.log(`  ╚════════════════════════════════════════════════════════════════════════╝`);
  console.log(`${c.reset}`);
  await sleep(800);

  console.log(`  ${c.dim}Initializing agent swarm...${c.reset}`);
  await sleep(500);

  await agentPipelineManager();
  await sleep(600);

  await agentFollowUpCoach();
  await sleep(600);

  await agentInterviewPrep();
  await sleep(600);

  await agentSalaryResearcher();
  await sleep(600);

  await agentDecisionAdvisor();
  await sleep(400);

  // Summary Footer
  console.log(`\n${c.bold}${c.cyan}╔══════════════════════════════════════════════════════════════════════════════╗${c.reset}`);
  console.log(`${c.bold}${c.cyan}║  ✅  ALL AGENTS COMPLETE                                                   ║${c.reset}`);
  console.log(`${c.bold}${c.cyan}╠══════════════════════════════════════════════════════════════════════════════╣${c.reset}`);
  const activeCount = applications.filter(a => !['rejected', 'accepted'].includes(a.stage)).length;
  const offerCount = applications.filter(a => a.stage === 'offer').length;
  const staleCount = applications.filter(a => {
    if (['rejected', 'accepted'].includes(a.stage)) return false;
    return daysBetween(a.lastContact, today) > 7;
  }).length;
  const interviewCount = applications.filter(a => ['phone-screen', 'technical', 'onsite'].includes(a.stage)).length;

  const summaryLines = [
    `Pipeline:     ${activeCount} active applications across ${new Set(applications.map(a => a.stage)).size} stages`,
    `Follow-ups:   ${staleCount} stale application(s) needing attention`,
    `Interviews:   ${interviewCount} upcoming — prep kits generated`,
    `Offers:       ${offerCount} competing offers analyzed`,
    `Recommended:  NeuralPath — ML Engineer (weighted score advantage)`,
  ];

  for (const line of summaryLines) {
    console.log(`${c.bold}${c.cyan}║${c.reset}  ${pad(line, 76)}${c.bold}${c.cyan}║${c.reset}`);
  }
  console.log(`${c.bold}${c.cyan}╚══════════════════════════════════════════════════════════════════════════════╝${c.reset}\n`);
}

main().catch(console.error);
