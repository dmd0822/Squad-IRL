# Content Creation Workflow — Squad Edition

A Squad sample that takes a **blog topic** and produces a polished, SEO-optimized article with platform-specific social media snippets and visual content recommendations through a seven-agent content pipeline: research → outline → write → edit → fact-check → social snippets → image suggestions.

## How It Works

1. You provide a topic — type it interactively or load from a file
2. Seven AI agents collaborate in sequence:
   - **Researcher** — gathers facts, statistics, expert perspectives, and fresh angles
   - **Outliner** — designs the structural blueprint: sections, narrative arc, word counts
   - **Writer** — drafts the complete article with consistent voice and engagement
   - **Editor** — polishes grammar, tone, and flow, then optimizes for SEO
   - **Fact-Checker** — verifies claims, statistics, and technical statements; resolves [VERIFY] tags; produces a confidence-rated verification report
   - **Social Snippets** — generates platform-optimized social media posts (Twitter/X, LinkedIn, short-form)
   - **Image Suggestions** — recommends hero images, diagrams, illustrations, data visualizations, and visual elements with detailed specifications and accessibility-ready alt text
3. You get a publish-ready, fact-checked blog post with title, meta description, optimized structure, a complete social media kit, and a comprehensive visual content guide

What would normally take 4+ hours is delivered in under 30 minutes.

## Prerequisites

- Node.js ≥ 20
- GitHub Copilot CLI installed and authenticated

## Setup

```bash
npm install
```

## Usage

### Interactive mode — type your topic

```bash
npm start
```

You'll be prompted to enter a blog topic. Type anything:
> "The rise of AI-powered developer tools in 2026"

### File mode — load a topic brief

```bash
npm start -- content-topics/technical-blog-post.md
npm start -- content-topics/product-launch.md
```

Topic files can include detailed briefs with target audience, tone, angles to cover, and word count targets. Two sample files are included to get you started.

## Sample Topics Included

| File | Description |
|------|-------------|
| `content-topics/technical-blog-post.md` | Technical blog about building multi-agent AI systems with TypeScript |
| `content-topics/product-launch.md` | Product launch announcement for an AI code review tool |

## What You Get

The squad produces a complete, fact-checked article with social media kit and visual content guide including:
- **Optimized title** — keyword-aware, click-worthy
- **Meta description** — 150-160 characters for search engines
- **Full article** — with proper H2/H3 hierarchy, code examples, and engagement hooks
- **Verification report** — confidence-rated fact-check (✅ Verified, ⚠️ Uncertain, ❌ Incorrect)
- **SEO notes** — primary keywords, readability score, internal linking suggestions
- **Social media kit** — Twitter/X single tweet, Twitter/X thread, LinkedIn post, and short-form snippet
- **Visual content guide** — hero image concept, in-article diagrams, data visualizations, social thumbnails, and alt text for all visuals

## Output

Each run automatically saves output to a **dated subfolder** under `output/` with the format:
```
output/YY-MM-DD_Topic_Slug/
  ├── article.md      # Full article + social kit + visual guide
  └── metadata.txt    # Topic, timestamp, cost summary
```

Example: if you write about "The Rise of AI Governance" on Jan 8, 2026, the output lands in:
```
output/26-01-08_The_Rise_Of_AI/
```

The `output/` directory is git-ignored so your generated content stays local.

## Extending This Sample

- 📅 **Content calendar** — batch-produce posts on a schedule
- 🌐 **CMS integration** — connect to WordPress, Ghost, or Medium APIs to publish directly

## Architecture

```
Topic Input → Researcher → Outliner → Writer → Editor → Fact-Checker → Social Snippets → Image Suggestions → Published Article + Social Kit + Visual Guide
                 ↓             ↓          ↓         ↓          ↓              ↓                 ↓
              Facts &      Structure   Full      Polished +  Verified &    Tweets,          Hero image,
              angles       blueprint   draft     SEO-ready   confidence    LinkedIn,        diagrams,
                                                             report        snippets         alt text
```

The squad uses `@bradygaster/squad-sdk` to coordinate agents through GitHub Copilot. Each agent has a detailed charter defining its expertise, output format, and boundaries — ensuring clean collaboration without overlap.
