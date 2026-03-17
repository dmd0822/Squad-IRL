// ─── Content Creation Workflow — Squad Edition ───────────────────────────────
// Takes a blog topic (typed or loaded from a file) and produces a polished,
// SEO-optimized article with platform-specific social media snippets and visual content recommendations through a
// seven-agent pipeline: Researcher, Outliner, Writer, Editor, Fact-Checker, Social Snippets, and Image Suggestions.

import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { SquadClient } from '@bradygaster/squad-sdk/client';
import type { SquadSession, SquadSessionConfig } from '@bradygaster/squad-sdk/adapter';
import type { SquadSessionEvent, SquadSessionEventHandler } from '@bradygaster/squad-sdk/adapter';
import squadConfig from './squad.config.js';
import { initSquadTelemetry, RuntimeEventBus as EventBus, CostTracker, recordTokenUsage } from '@bradygaster/squad-sdk';

// Model pricing (USD per 1M tokens) — used instead of SDK-reported cost
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  'claude-sonnet-4.5': { input: 3, output: 15 },
  'claude-haiku-4.5': { input: 0.80, output: 4 },
  'claude-opus-4.5': { input: 15, output: 75 },
  'gpt-4o': { input: 2.50, output: 10 },
};

function estimateCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing = MODEL_PRICING[model] ?? MODEL_PRICING['claude-sonnet-4.5'];
  return (inputTokens * pricing.input + outputTokens * pricing.output) / 1_000_000;
}

// Initialize telemetry pipeline: EventBus → OTel spans + metrics + CostTracker
const eventBus = new EventBus();
const telemetry = initSquadTelemetry({ eventBus });
const costTracker = new CostTracker();
costTracker.wireToEventBus(eventBus);

// ═══════════════════════════════════════════════════════════════════════════════
// ANSI helpers
// ═══════════════════════════════════════════════════════════════════════════════

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  white: '\x1b[37m',
};

function banner(): void {
  console.log();
  console.log(`${C.cyan}${C.bold}  ✍️  Content Creation Workflow — Squad Edition${C.reset}`);
  console.log(`${C.dim}  ─────────────────────────────────────────────${C.reset}`);
  console.log(`${C.dim}  Give us a topic, get a polished blog post.${C.reset}`);
  console.log(`${C.dim}  Seven specialists: Researcher · Outliner · Writer · Editor · Fact-Checker · Social Snippets · Image Suggestions${C.reset}`);
  console.log();
}

/**
 * Extract the human-readable content from a squad response.
 * The response may be a string, or an event object with data.content.
 */
function extractContent(result: unknown): string | null {
  if (typeof result === 'string') return result;
  if (!result || typeof result !== 'object') return null;

  const obj = result as Record<string, any>;

  // Event shape: { data: { content: "..." } }
  if (obj.data?.content && typeof obj.data.content === 'string') {
    return obj.data.content;
  }

  // Direct content shape: { content: "..." }
  if (obj.content && typeof obj.content === 'string') {
    return obj.content;
  }

  // Message shape: { message: "..." }
  if (obj.message && typeof obj.message === 'string') {
    return obj.message;
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Topic input — from file or interactive prompt
// ═══════════════════════════════════════════════════════════════════════════════

async function loadTopicFromFile(filePath: string): Promise<string> {
  const resolved = resolve(filePath);
  if (!existsSync(resolved)) {
    throw new Error(`File not found: ${resolved}`);
  }
  const content = await readFile(resolved, 'utf-8');
  const trimmed = content.trim();
  if (!trimmed) {
    throw new Error(`File is empty: ${resolved}`);
  }
  return trimmed;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Output folder helpers
// ═══════════════════════════════════════════════════════════════════════════════

function formatDatePrefix(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

function topicToSlug(topic: string): string {
  // Take first few words, title case, join with underscores
  const words = topic
    .replace(/[^a-zA-Z0-9\s]/g, '')  // remove special chars
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 5)  // first 5 words max
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
  
  const slug = words.join('_');
  return slug.slice(0, 50);  // cap at 50 chars
}

// ═══════════════════════════════════════════════════════════════════════════════
// Build system prompt from squad config
// ═══════════════════════════════════════════════════════════════════════════════

function buildSystemPrompt(topic: string): string {
  const config = squadConfig;
  const teamName = config.team?.name ?? 'Content Creation Squad';
  const teamDesc = config.team?.description ?? '';
  const projectCtx = config.team?.projectContext ?? '';

  const agentDescriptions = (config.agents ?? []).map((a: any) => {
    const name = a.name ?? 'agent';
    const role = a.role ?? '';
    const charter = (a.charter ?? '').trim();
    return `### ${name} — ${role}\n${charter}`;
  }).join('\n\n');

  const routingRules = (config.routing?.rules ?? []).map((r: any) => {
    const agents = (r.agents ?? []).join(', ');
    return `- Pattern: "${r.pattern}" → ${agents} (${r.description ?? ''})`;
  }).join('\n');

  return `You are the **${teamName}**.

${teamDesc}

${projectCtx}

## Your Agents

${agentDescriptions}

## Routing Rules

${routingRules}

## The Topic

The user wants a blog post on the following topic:

> ${topic}

## Instructions

You are a content creation assistant powered by a squad of specialists.
Coordinate all seven specialists to produce a complete, polished blog post with social media snippets and visual content recommendations:

1. **Researcher** goes first — gather facts, statistics, examples, and fresh angles on the topic
2. **Outliner** designs the structure — sections, narrative arc, word count targets, content elements
3. **Writer** drafts the complete article following the outline, maintaining voice and engagement
4. **Editor** polishes grammar, tone, and flow, then optimizes for SEO with keywords, meta description, and readability
5. **Fact-Checker** verifies all claims, statistics, and technical statements, resolves any [VERIFY] tags, and produces a confidence-rated verification report
6. **Social Snippets** generates platform-specific social media posts from the verified article: a single tweet, a Twitter/X thread, a LinkedIn post, and a generic short-form snippet
7. **Image Suggestions** recommends hero images, diagrams, illustrations, data visualizations, and visual elements with detailed specifications and accessibility-ready alt text

Produce the FULL content pipeline in one response. The final output should be a publish-ready, fact-checked blog post with:
- Optimized title
- Meta description
- Complete article with proper heading hierarchy
- Verification report with confidence levels (✅ Verified, ⚠️ Uncertain, ❌ Incorrect)
- SEO notes (primary keywords, readability score)
- Social media kit: Twitter/X single tweet, Twitter/X thread, LinkedIn post, and short-form snippet
- Visual content guide: hero image concept, in-article diagrams, data visualizations, social thumbnails, and alt text for all visuals

Be thorough, creative, and produce genuinely useful content. Quality over speed.`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Send a message and stream the response
// ═══════════════════════════════════════════════════════════════════════════════

async function sendAndStream(
  client: SquadClient,
  session: SquadSession,
  prompt: string,
): Promise<string> {
  console.log();
  console.log(`${C.dim}  ─────────────────────────────────────────────${C.reset}`);

  let receivedContent = false;
  let capturedContent = '';

  const deltaHandler: SquadSessionEventHandler = (event: SquadSessionEvent) => {
    const content = (event as any).content ?? (event as any).data?.content ?? '';
    if (content) {
      if (!receivedContent) process.stdout.write(`${C.white}`);
      receivedContent = true;
      capturedContent += content;
      process.stdout.write(content);
    }
  };

  session.on('message_delta', deltaHandler);

  try {
    if (session.sendAndWait) {
      const result = await session.sendAndWait({ prompt }, 600_000);
      session.off('message_delta', deltaHandler);

      if (receivedContent) {
        process.stdout.write(`${C.reset}\n`);
      } else if (result) {
        const text = extractContent(result);
        if (text) {
          capturedContent = text;
          console.log(`${C.white}${text}${C.reset}`);
        } else {
          console.log(`${C.yellow}  (Received a response but couldn't parse it.)${C.reset}`);
        }
      } else {
        console.log(`${C.yellow}  (No response — the squad may still be thinking.)${C.reset}`);
      }
    } else {
      await client.sendMessage(session, { prompt });

      await new Promise<void>((resolve) => {
        const check = () => {
          session.off('idle', check);
          session.off('turn_end', check);
          resolve();
        };
        session.on('idle', check);
        session.on('turn_end', check);
        setTimeout(resolve, 600_000);
      });

      session.off('message_delta', deltaHandler);
      if (receivedContent) {
        process.stdout.write(`${C.reset}\n`);
      } else {
        console.log(`${C.yellow}  (No response received.)${C.reset}`);
      }
    }
  } catch (err: any) {
    session.off('message_delta', deltaHandler);
    if (receivedContent) process.stdout.write(`${C.reset}\n`);
    throw err;
  }

  return capturedContent;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════════════════════

async function main(): Promise<void> {
  banner();

  const rl = createInterface({ input: stdin, output: stdout });

  // 1. Get the topic — from CLI arg (file path) or interactive prompt
  let topic: string;
  const filePath = process.argv[2];

  if (filePath) {
    console.log(`${C.magenta}  📂 Loading topic from: ${filePath}${C.reset}`);
    try {
      topic = await loadTopicFromFile(filePath);
      console.log(`${C.green}  ✓ Loaded topic (${topic.length} characters)${C.reset}`);
    } catch (err: any) {
      console.error(`${C.red}${C.bold}  Failed to load topic file.${C.reset}`);
      console.error(`${C.dim}  ${err?.message ?? err}${C.reset}`);
      console.error();
      console.error(`${C.yellow}  Usage:${C.reset}`);
      console.error(`${C.dim}    npm start                                        ${C.reset}${C.dim}(type topic interactively)${C.reset}`);
      console.error(`${C.dim}    npm start -- content-topics/technical-blog-post.md${C.reset}`);
      console.error(`${C.dim}    npm start -- content-topics/product-launch.md     ${C.reset}`);
      rl.close();
      process.exit(1);
    }
  } else {
    console.log(`${C.dim}  Tip: You can also load a topic file:${C.reset}`);
    console.log(`${C.dim}    npm start -- content-topics/technical-blog-post.md${C.reset}`);
    console.log();
    topic = await rl.question(`${C.cyan}  📝 What should the blog post be about?\n  ${C.bold}> ${C.reset}`);
    topic = topic.trim();

    if (!topic) {
      console.log(`${C.yellow}  No topic provided. Exiting.${C.reset}`);
      rl.close();
      return;
    }
  }

  console.log();
  console.log(`${C.green}  ✓ Topic: ${C.bold}${topic.length > 120 ? topic.slice(0, 117) + '...' : topic}${C.reset}`);

  // Suppress noisy CLI subprocess warnings (e.g., Node.js experimental SQLite)
  const origStderrWrite = process.stderr.write.bind(process.stderr);
  process.stderr.write = (chunk: any, ...args: any[]) => {
    const str = typeof chunk === 'string' ? chunk : chunk.toString();
    if (str.includes('[CLI subprocess]') || str.includes('ExperimentalWarning')) {
      return true;
    }
    return origStderrWrite(chunk, ...args);
  };

  // 2. Connect to the Squad
  console.log();
  console.log(`${C.magenta}  Connecting to your content creation squad...${C.reset}`);

  let client: SquadClient;
  let session: SquadSession;

  try {
    client = new SquadClient({
      cwd: process.cwd(),
      autoReconnect: true,
    });

    await client.connect();

    const sessionConfig: SquadSessionConfig = {
      model: 'claude-sonnet-4.5',
      streaming: true,
      systemMessage: {
        mode: 'append' as const,
        content: buildSystemPrompt(topic),
      },
      onPermissionRequest: () => ({ kind: 'approved' as const }),
    };

    session = await client.createSession(sessionConfig);

    // Forward session usage events to the EventBus for cost tracking + OTel spans
    session.on('usage', ((event: any) => {
      const inputTokens = typeof event.inputTokens === 'number' ? event.inputTokens : 0;
      const outputTokens = typeof event.outputTokens === 'number' ? event.outputTokens : 0;
      const model = event.model ?? 'unknown';
      const cost = estimateCost(model, inputTokens, outputTokens);

      // Fire OTel metric counters (squad.tokens.input, .output, .cost)
      recordTokenUsage({
        type: 'usage',
        sessionId: session.sessionId,
        model,
        inputTokens,
        outputTokens,
        estimatedCost: cost,
        timestamp: new Date(),
      });

      // Forward to EventBus → CostTracker + OTel spans
      eventBus.emit({
        type: 'session:message',
        sessionId: session.sessionId,
        payload: { inputTokens, outputTokens, model, estimatedCost: cost },
        timestamp: new Date(),
      });
    }) as SquadSessionEventHandler);

    console.log(`${C.green}  ✓ Connected! Your content squad is ready.${C.reset}`);
  } catch (err: any) {
    const msg = err?.message ?? String(err);

    if (msg.includes('ECONNREFUSED') || msg.includes('spawn') || msg.includes('not found') || msg.includes('ENOENT')) {
      console.error();
      console.error(`${C.red}${C.bold}  Could not connect to the Copilot CLI.${C.reset}`);
      console.error(`${C.yellow}  Make sure GitHub Copilot is installed and running:${C.reset}`);
      console.error(`${C.dim}    1. Install: npm install -g @github/copilot${C.reset}`);
      console.error(`${C.dim}    2. Authenticate: copilot auth login${C.reset}`);
      console.error(`${C.dim}    3. Try again: npm start${C.reset}`);
    } else {
      console.error();
      console.error(`${C.red}  Connection failed: ${msg}${C.reset}`);
    }

    rl.close();
    process.exit(1);
  }

  // 3. Send the topic to the squad for content creation
  let articleContent = '';
  try {
    console.log();
    console.log(`${C.dim}  Sending topic to the squad — research → outline → write → edit → fact-check → social snippets → image suggestions...${C.reset}`);
    articleContent = await sendAndStream(client, session, `Create a complete, polished blog post on this topic: ${topic}`);
  } catch (err: any) {
    console.error(`${C.red}  Error: ${err?.message ?? err}${C.reset}`);
  }

  // 4. Save output to dated subfolder
  if (articleContent.trim()) {
    try {
      const outputDirName = `${formatDatePrefix()}_${topicToSlug(topic)}`;
      const outputDir = resolve('output', outputDirName);
      await mkdir(outputDir, { recursive: true });

      // Save the article
      await writeFile(resolve(outputDir, 'article.md'), articleContent, 'utf-8');

      // Save metadata
      const summary = costTracker.getSummary();
      const metadata = [
        `Topic: ${topic}`,
        `Date: ${new Date().toISOString()}`,
        `Pipeline: research → outline → write → edit → fact-check → social snippets → image suggestions`,
        '',
        '## Cost Summary',
        costTracker.formatSummary(),
      ].join('\n');
      await writeFile(resolve(outputDir, 'metadata.txt'), metadata, 'utf-8');

      console.log();
      console.log(`${C.green}  📁 Output saved to: ${C.bold}output\\${outputDirName}\\${C.reset}`);
      console.log(`${C.dim}     ├── article.md (full article + social kit + visual guide)${C.reset}`);
      console.log(`${C.dim}     └── metadata.txt (topic, cost summary)${C.reset}`);
    } catch (saveErr: any) {
      console.error(`${C.yellow}  ⚠️  Could not save output: ${saveErr?.message ?? saveErr}${C.reset}`);
    }
  }

  // Cleanup
  console.log();
  console.log(`${C.green}  ✅ Fact-checked blog post + social media kit + visual content guide created!${C.reset}`);
  console.log();
  console.log(`${C.cyan}  💡 This sample is just the beginning. You could extend it to:${C.reset}`);
  console.log(`${C.dim}     • Create a content calendar that produces posts on a schedule${C.reset}`);
  console.log(`${C.dim}     • Connect to your CMS API to publish directly to WordPress/Ghost/Medium${C.reset}`);
  console.log();
  console.log(`${C.white}  Great content isn't written — it's engineered.${C.reset}`);
  console.log(`${C.white}  See the README for ideas, or just start hacking!${C.reset}`);
  console.log();

  // Cost summary
  const summary = costTracker.getSummary();
  if (summary.totalInputTokens > 0 || summary.totalOutputTokens > 0) {
    console.log(`${C.cyan}${C.bold}  📊 Token & Cost Summary${C.reset}`);
    console.log(`${C.dim}  ─────────────────────────────────────────────${C.reset}`);
    console.log(`${C.white}  ${costTracker.formatSummary().split('\n').join(`\n  `)}${C.reset}`);
    console.log();
  }

  await telemetry.shutdown();

  try {
    await session.close();
  } catch { /* session may already be closed */ }

  try {
    await client.disconnect();
  } catch { /* best effort */ }

  rl.close();
}

main().catch((err) => {
  console.error(`${C.red}  Fatal error: ${err?.message ?? err}${C.reset}`);
  process.exit(1);
});
