// ─── Job Scraper — Playwright-based job listing reader ────────────────────────
// Launches a headful Chromium browser, lets the user navigate to any job board
// (Indeed, LinkedIn Jobs, etc.), then scrapes the visible listings into
// structured objects.

import { chromium, type Browser, type Page } from 'playwright';
import { resolve } from 'node:path';

export interface JobListing {
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  url: string;
}

const USER_DATA_DIR = resolve(import.meta.dirname ?? '.', '.jobs-session');
const LOAD_TIMEOUT_MS = 120_000;

/**
 * Launch a headful Chromium browser with a persistent profile so the user
 * doesn't have to re-authenticate every run.
 */
export async function launchBrowser(): Promise<{ browser: Browser; page: Page }> {
  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    viewport: { width: 1280, height: 900 },
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const page = context.pages()[0] ?? await context.newPage();
  return { browser: context.browser()!, page };
}

/**
 * Navigate to Indeed search results for the given query.
 *
 * Uses direct URL navigation to bypass Indeed's autocomplete dropdown,
 * which intercepts Enter keypresses on the search form. Falls back to
 * the form-fill approach if direct navigation doesn't yield results.
 */
export async function navigateToJobBoard(page: Page, searchQuery: string): Promise<void> {
  const resultsSelector = '.jobsearch-ResultsList, .job_seen_beacon, [id="mosaic-jobResults"]';
  const searchUrl = `https://www.indeed.com/jobs?q=${encodeURIComponent(searchQuery)}`;

  await page.goto(searchUrl, {
    waitUntil: 'domcontentloaded',
    timeout: LOAD_TIMEOUT_MS,
  });

  try {
    await page.waitForSelector(resultsSelector, { timeout: 8_000 });
    return;
  } catch {
    // Direct URL didn't surface results — fall back to form interaction
  }

  await page.goto('https://www.indeed.com', {
    waitUntil: 'domcontentloaded',
    timeout: LOAD_TIMEOUT_MS,
  });

  const searchInput = page.locator(
    '#text-input-what, input[name="q"], input[id*="what"], input[placeholder*="Job title"]',
  ).first();
  await searchInput.waitFor({ state: 'visible', timeout: 15_000 });
  await searchInput.click();
  await searchInput.fill(searchQuery);
  await page.waitForTimeout(1500);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5000);
}

/**
 * Scrape visible job listings from the current page.
 *
 * Job boards have wildly different DOMs. We try Indeed-style selectors first,
 * then LinkedIn Jobs, then fall back to generic heuristics that work on most
 * boards with card/list layouts.
 */
export async function scrapeJobListings(page: Page): Promise<JobListing[]> {
  // Give the page a moment to finish rendering dynamic content
  await page.waitForTimeout(2000);

  const currentUrl = page.url();

  const listings = await page.evaluate((pageUrl: string) => {
    const results: {
      title: string;
      company: string;
      location: string;
      salary: string;
      description: string;
      url: string;
    }[] = [];

    // ── Strategy 1: Indeed ──
    const indeedCards = document.querySelectorAll('.job_seen_beacon, .jobsearch-ResultsList > li, .resultContent');
    if (indeedCards.length > 0) {
      for (const card of indeedCards) {
        const titleEl =
          card.querySelector('h2.jobTitle a') ??
          card.querySelector('.jobTitle a') ??
          card.querySelector('a[data-jk]') ??
          card.querySelector('h2 a');
        const title = titleEl?.textContent?.trim() ?? '';

        const companyEl =
          card.querySelector('[data-testid="company-name"]') ??
          card.querySelector('.companyName') ??
          card.querySelector('.company');
        const company = companyEl?.textContent?.trim() ?? '';

        const locationEl =
          card.querySelector('[data-testid="text-location"]') ??
          card.querySelector('.companyLocation') ??
          card.querySelector('.location');
        const location = locationEl?.textContent?.trim() ?? '';

        const salaryEl =
          card.querySelector('.salary-snippet-container') ??
          card.querySelector('[class*="salary"]') ??
          card.querySelector('.estimated-salary');
        const salary = salaryEl?.textContent?.trim() ?? '';

        const snippetEl =
          card.querySelector('.job-snippet') ??
          card.querySelector('[class*="snippet"]') ??
          card.querySelector('.heading6');
        const description = snippetEl?.textContent?.trim() ?? '';

        let url = '';
        if (titleEl) {
          const href = titleEl.getAttribute('href') ?? '';
          if (href.startsWith('http')) {
            url = href;
          } else if (href.startsWith('/')) {
            url = `https://www.indeed.com${href}`;
          }
        }

        if (title || company) {
          results.push({ title, company, location, salary, description, url });
        }
      }
    }

    // ── Strategy 2: LinkedIn Jobs ──
    if (results.length === 0) {
      const linkedinCards = document.querySelectorAll(
        '.jobs-search-results__list-item, .job-card-container, .base-search-card'
      );
      for (const card of linkedinCards) {
        const titleEl =
          card.querySelector('.base-search-card__title') ??
          card.querySelector('.job-card-list__title') ??
          card.querySelector('h3') ??
          card.querySelector('a[class*="job-card"]');
        const title = titleEl?.textContent?.trim() ?? '';

        const companyEl =
          card.querySelector('.base-search-card__subtitle') ??
          card.querySelector('.job-card-container__company-name') ??
          card.querySelector('h4');
        const company = companyEl?.textContent?.trim() ?? '';

        const locationEl =
          card.querySelector('.job-search-card__location') ??
          card.querySelector('.job-card-container__metadata-item') ??
          card.querySelector('[class*="location"]');
        const location = locationEl?.textContent?.trim() ?? '';

        const salaryEl = card.querySelector('[class*="salary"], [class*="compensation"]');
        const salary = salaryEl?.textContent?.trim() ?? '';

        const snippetEl = card.querySelector('.job-card-list__insight, [class*="snippet"]');
        const description = snippetEl?.textContent?.trim() ?? '';

        const linkEl =
          card.querySelector('a[href*="/jobs/"]') ??
          card.querySelector('a[href]');
        let url = '';
        if (linkEl) {
          const href = linkEl.getAttribute('href') ?? '';
          if (href.startsWith('http')) {
            url = href;
          } else if (href.startsWith('/')) {
            url = `https://www.linkedin.com${href}`;
          }
        }

        if (title || company) {
          results.push({ title, company, location, salary, description, url });
        }
      }
    }

    // ── Strategy 3: Generic card/list heuristic ──
    if (results.length === 0) {
      const genericCards = document.querySelectorAll(
        '[class*="job-card"], [class*="job-listing"], [class*="JobCard"], ' +
        '[class*="jobCard"], article[class*="job"], [data-testid*="job"]'
      );
      for (const card of genericCards) {
        const el = card as HTMLElement;
        const headingEl = el.querySelector('h2, h3, h4, a[href]');
        const title = headingEl?.textContent?.trim() ?? '';

        const allText = el.innerText ?? '';
        const lines = allText.split('\n').map((l: string) => l.trim()).filter(Boolean);

        const company = lines[1] ?? '';
        const location = lines.find((l: string) =>
          /\b(remote|hybrid|onsite|city|state|,\s*[A-Z]{2})\b/i.test(l)
        ) ?? '';
        const salary = lines.find((l: string) =>
          /\$[\d,]+|salary|per\s+(hour|year|annum)/i.test(l)
        ) ?? '';
        const description = lines.slice(2, 5).join(' ').slice(0, 200);

        const linkEl = el.querySelector('a[href]');
        let url = '';
        if (linkEl) {
          const href = linkEl.getAttribute('href') ?? '';
          if (href.startsWith('http')) {
            url = href;
          } else if (href.startsWith('/')) {
            try { url = new URL(href, window.location.origin).href; } catch { /* skip */ }
          }
        }

        if (title) {
          results.push({ title, company, location, salary, description, url });
        }
      }
    }

    // ── Fallback: raw row/card text extraction ──
    if (results.length === 0) {
      const allCards = document.querySelectorAll(
        'article, [role="listitem"], li[class*="result"], div[class*="result"]'
      );
      for (const card of allCards) {
        const text = (card as HTMLElement).innerText?.trim() ?? '';
        if (text && text.length > 30 && text.length < 2000) {
          const linkEl = card.querySelector('a[href]');
          let url = '';
          if (linkEl) {
            const href = linkEl.getAttribute('href') ?? '';
            if (href.startsWith('http')) {
              url = href;
            } else if (href.startsWith('/')) {
              try { url = new URL(href, window.location.origin).href; } catch { /* skip */ }
            }
          }

          results.push({
            title: text.slice(0, 120),
            company: '',
            location: '',
            salary: '',
            description: '',
            url: url || pageUrl,
          });
        }
      }
    }

    return results;
  }, currentUrl);

  return listings;
}

/**
 * Format scraped job listings into a prompt suitable for the analysis squad.
 */
export function formatListingsForPrompt(
  listings: JobListing[],
  userPreferences: string,
): string {
  if (listings.length === 0) {
    return 'I couldn\'t read any job listings from the page. It may still be loading or the DOM structure may be unsupported.';
  }

  const lines: string[] = [
    `Analyze these ${listings.length} job listings I found while searching:\n`,
  ];

  if (userPreferences.trim()) {
    lines.push(`## My Preferences\n${userPreferences.trim()}\n`);
  }

  lines.push('## Job Listings\n');

  for (let i = 0; i < listings.length; i++) {
    const j = listings[i]!;
    const parts: string[] = [`${i + 1}. **${j.title || '(untitled)'}**`];
    if (j.company) parts.push(`   Company: ${j.company}`);
    if (j.location) parts.push(`   Location: ${j.location}`);
    if (j.salary) parts.push(`   Salary: ${j.salary}`);
    if (j.description) parts.push(`   Description: ${j.description}`);
    if (j.url) parts.push(`   URL: ${j.url}`);
    lines.push(parts.join('\n'));
  }

  lines.push(
    '\nFor EVERY listing, include the URL so I can click through and apply.'
  );

  return lines.join('\n');
}

/**
 * Close the browser gracefully.
 */
export async function closeBrowser(page: Page): Promise<void> {
  try {
    const context = page.context();
    await context.close();
  } catch {
    // best effort — browser may already be closed by user
  }
}
