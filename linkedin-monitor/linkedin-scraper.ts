// ─── LinkedIn Scraper — Playwright-based notification & message reader ────────
// Launches a headful Chromium browser, navigates to LinkedIn, waits for the
// user to log in, then scrapes notifications and messages into structured items.

import { chromium, type Browser, type Page } from 'playwright';
import { resolve } from 'node:path';

export interface LinkedInItem {
  type: 'notification' | 'message' | 'connection_request';
  from: string;
  preview: string;
  timestamp: string;
  url: string;
  unread: boolean;
  category: string; // 'comment', 'like', 'share', 'mention', 'connection', 'message', 'other'
}

const USER_DATA_DIR = resolve(import.meta.dirname ?? '.', '.linkedin-session');
const LINKEDIN_URL = 'https://www.linkedin.com';
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
 * Navigate to LinkedIn. Returns once navigation completes (or throws on timeout).
 */
export async function navigateToLinkedIn(page: Page): Promise<void> {
  await page.goto(LINKEDIN_URL, { waitUntil: 'domcontentloaded', timeout: LOAD_TIMEOUT_MS });
}

/**
 * Categorise a notification based on its action text.
 */
function categoriseNotification(text: string): { category: string; type: LinkedInItem['type'] } {
  const lower = text.toLowerCase();
  if (lower.includes('connect') || lower.includes('accepted your invitation') || lower.includes('connection request')) {
    return { category: 'connection', type: 'connection_request' };
  }
  if (lower.includes('commented')) return { category: 'comment', type: 'notification' };
  if (lower.includes('liked') || lower.includes('reacted')) return { category: 'like', type: 'notification' };
  if (lower.includes('shared') || lower.includes('reposted')) return { category: 'share', type: 'notification' };
  if (lower.includes('mentioned') || lower.includes('tagged')) return { category: 'mention', type: 'notification' };
  if (lower.includes('endorsed')) return { category: 'endorsement', type: 'notification' };
  if (lower.includes('viewed your profile') || lower.includes('appeared in')) return { category: 'profile_view', type: 'notification' };
  if (lower.includes('posted') || lower.includes('published')) return { category: 'post', type: 'notification' };
  if (lower.includes('job') || lower.includes('hiring') || lower.includes('applied')) return { category: 'job', type: 'notification' };
  return { category: 'other', type: 'notification' };
}

/**
 * Scrape the notifications page (linkedin.com/notifications).
 * LinkedIn's DOM is heavily obfuscated and changes frequently. We try multiple
 * selector strategies with fallbacks.
 */
export async function scrapeNotifications(page: Page): Promise<LinkedInItem[]> {
  await page.goto(`${LINKEDIN_URL}/notifications/`, {
    waitUntil: 'domcontentloaded',
    timeout: LOAD_TIMEOUT_MS,
  });

  // Wait for dynamic content to load
  await page.waitForTimeout(3000);

  const items = await page.evaluate(() => {
    const results: {
      from: string;
      preview: string;
      timestamp: string;
      url: string;
      unread: boolean;
      actionText: string;
    }[] = [];

    // Strategy 1: LinkedIn notification cards (nt-card class or similar containers)
    const cardSelectors = [
      '.nt-card',
      'div[data-finite-scroll-hotkey-item]',
      '.notification-card',
      'article.nt-card',
      'div.nt-card__text-content',
    ];

    let cards: Element[] = [];
    for (const sel of cardSelectors) {
      const found = document.querySelectorAll(sel);
      if (found.length > 0) {
        cards = Array.from(found);
        break;
      }
    }

    // Strategy 2: broader container selectors
    if (cards.length === 0) {
      const containers = document.querySelectorAll(
        '[class*="notification"] article, [class*="notification"] [class*="card"], .scaffold-layout__list-item'
      );
      if (containers.length > 0) {
        cards = Array.from(containers);
      }
    }

    for (const card of cards) {
      const el = card as HTMLElement;

      // Extract the primary text content
      const textEl =
        el.querySelector('.nt-card__text--3-line') ??
        el.querySelector('.nt-card__text') ??
        el.querySelector('[class*="notification"] p') ??
        el.querySelector('p');

      const fullText = textEl?.textContent?.trim() ?? el.innerText?.trim() ?? '';
      if (!fullText || fullText.length < 5) continue;

      // Extract actor name (usually the first bold/strong element or link text)
      const actorEl =
        el.querySelector('.nt-card__text strong') ??
        el.querySelector('strong') ??
        el.querySelector('a[class*="name"]') ??
        el.querySelector('.notification-card__actor-name');
      const from = actorEl?.textContent?.trim() ?? '';

      // Extract timestamp
      const timeEl =
        el.querySelector('.nt-card__time-ago') ??
        el.querySelector('time') ??
        el.querySelector('[class*="time-ago"]') ??
        el.querySelector('.notification-card__time-ago');
      const timestamp = timeEl?.textContent?.trim() ?? '';

      // Extract URL — look for the primary link in the card
      const linkEl =
        el.querySelector('a[href*="linkedin.com"]') ??
        el.closest('a[href*="linkedin.com"]') ??
        el.querySelector('a[href]');
      let url = '';
      if (linkEl) {
        const href = linkEl.getAttribute('href') ?? '';
        if (href.startsWith('http')) {
          url = href;
        } else if (href.startsWith('/')) {
          url = `https://www.linkedin.com${href}`;
        }
      }

      // Check unread status
      const unread =
        el.classList.contains('nt-card--unread') ||
        el.querySelector('.nt-card--unread') !== null ||
        el.querySelector('[class*="unread"]') !== null ||
        el.getAttribute('class')?.includes('unread') === true;

      results.push({
        from,
        preview: fullText.slice(0, 300),
        timestamp,
        url,
        unread,
        actionText: fullText,
      });
    }

    // Fallback: if structured selectors yielded nothing, grab raw list item text
    if (results.length === 0) {
      const genericItems = document.querySelectorAll(
        'section[class*="notification"] li, .scaffold-layout__list li, [role="list"] [role="listitem"]'
      );
      for (const item of genericItems) {
        const text = (item as HTMLElement).innerText?.trim() ?? '';
        if (text && text.length > 15) {
          const linkEl = item.querySelector('a[href]');
          let url = '';
          if (linkEl) {
            const href = linkEl.getAttribute('href') ?? '';
            url = href.startsWith('http')
              ? href
              : href.startsWith('/')
                ? `https://www.linkedin.com${href}`
                : '';
          }

          results.push({
            from: '',
            preview: text.slice(0, 300),
            timestamp: '',
            url,
            unread: false,
            actionText: text,
          });
        }
      }
    }

    return results;
  });

  return items.map((item) => {
    const { category, type } = categoriseNotification(item.actionText);
    return {
      type,
      from: item.from,
      preview: item.preview,
      timestamp: item.timestamp,
      url: item.url || `${LINKEDIN_URL}/notifications/`,
      unread: item.unread,
      category,
    };
  });
}

/**
 * Scrape the messaging page (linkedin.com/messaging).
 * Extracts message threads with sender, preview, timestamp, and thread URL.
 */
export async function scrapeMessages(page: Page): Promise<LinkedInItem[]> {
  await page.goto(`${LINKEDIN_URL}/messaging/`, {
    waitUntil: 'domcontentloaded',
    timeout: LOAD_TIMEOUT_MS,
  });

  // Wait for dynamic content to load
  await page.waitForTimeout(3000);

  const items = await page.evaluate(() => {
    const results: {
      from: string;
      preview: string;
      timestamp: string;
      url: string;
      unread: boolean;
    }[] = [];

    // Strategy 1: messaging thread list items
    const threadSelectors = [
      'li.msg-conversation-listitem',
      '.msg-conversation-listitem',
      'li[class*="msg-conversation"]',
      '.msg-conversations-container__convo-item-link',
    ];

    let threads: Element[] = [];
    for (const sel of threadSelectors) {
      const found = document.querySelectorAll(sel);
      if (found.length > 0) {
        threads = Array.from(found);
        break;
      }
    }

    // Strategy 2: broader selectors
    if (threads.length === 0) {
      const containers = document.querySelectorAll(
        '[class*="messaging"] li, [class*="msg-conversation"] li, [role="list"] [role="listitem"]'
      );
      if (containers.length > 0) {
        threads = Array.from(containers);
      }
    }

    for (const thread of threads) {
      const el = thread as HTMLElement;

      // Sender name
      const nameEl =
        el.querySelector('.msg-conversation-listitem__participant-names') ??
        el.querySelector('.msg-conversation-card__participant-names') ??
        el.querySelector('[class*="participant-name"]') ??
        el.querySelector('h3') ??
        el.querySelector('span[class*="name"]');
      const from = nameEl?.textContent?.trim() ?? '';

      // Last message preview
      const previewEl =
        el.querySelector('.msg-conversation-listitem__message-snippet') ??
        el.querySelector('.msg-conversation-card__message-snippet') ??
        el.querySelector('[class*="message-snippet"]') ??
        el.querySelector('p');
      const preview = previewEl?.textContent?.trim() ?? '';

      // Timestamp
      const timeEl =
        el.querySelector('.msg-conversation-listitem__time-stamp') ??
        el.querySelector('.msg-conversation-card__time-stamp') ??
        el.querySelector('time') ??
        el.querySelector('[class*="time-stamp"]');
      const timestamp = timeEl?.textContent?.trim() ?? '';

      // Thread URL
      const linkEl =
        el.querySelector('a[href*="/messaging/thread/"]') ??
        el.querySelector('a[href*="messaging"]') ??
        el.querySelector('a[href]');
      let url = '';
      if (linkEl) {
        const href = linkEl.getAttribute('href') ?? '';
        if (href.startsWith('http')) {
          url = href;
        } else if (href.startsWith('/')) {
          url = `https://www.linkedin.com${href}`;
        }
      }

      // Unread indicator
      const unread =
        el.classList.contains('msg-conversation-listitem--unread') ||
        el.querySelector('[class*="unread"]') !== null ||
        el.querySelector('.notification-badge') !== null ||
        el.getAttribute('class')?.includes('unread') === true;

      if (from || preview) {
        results.push({ from, preview: preview.slice(0, 300), timestamp, url, unread });
      }
    }

    // Fallback: raw text extraction
    if (results.length === 0) {
      const genericItems = document.querySelectorAll(
        '[class*="messaging"] [role="listitem"], [class*="msg"] li'
      );
      for (const item of genericItems) {
        const text = (item as HTMLElement).innerText?.trim() ?? '';
        if (text && text.length > 10) {
          const linkEl = item.querySelector('a[href]');
          let url = '';
          if (linkEl) {
            const href = linkEl.getAttribute('href') ?? '';
            url = href.startsWith('http')
              ? href
              : href.startsWith('/')
                ? `https://www.linkedin.com${href}`
                : '';
          }

          results.push({
            from: '',
            preview: text.slice(0, 300),
            timestamp: '',
            url,
            unread: false,
          });
        }
      }
    }

    return results;
  });

  return items.map((item) => ({
    type: 'message' as const,
    from: item.from,
    preview: item.preview,
    timestamp: item.timestamp,
    url: item.url || `${LINKEDIN_URL}/messaging/`,
    unread: item.unread,
    category: 'message',
  }));
}

/**
 * Format scraped notifications and messages into a prompt for the AI squad.
 */
export function formatItemsForPrompt(
  notifications: LinkedInItem[],
  messages: LinkedInItem[],
): string {
  const total = notifications.length + messages.length;

  if (total === 0) {
    return 'I couldn\'t read any items from LinkedIn. The pages may still be loading or the DOM may have changed.';
  }

  const lines: string[] = [
    `Triage these ${total} LinkedIn items (${notifications.length} notifications, ${messages.length} messages):\n`,
  ];

  if (notifications.length > 0) {
    lines.push('## Notifications\n');
    for (let i = 0; i < notifications.length; i++) {
      const n = notifications[i]!;
      const unreadTag = n.unread ? ' [UNREAD]' : '';
      const categoryTag = ` [${n.category}]`;
      lines.push(
        `${i + 1}. From: ${n.from || '(unknown)'}${unreadTag}${categoryTag}\n` +
        `   Preview: ${n.preview}\n` +
        `   Time: ${n.timestamp || '(unknown)'}\n` +
        `   Link: ${n.url}`
      );
    }
  }

  if (messages.length > 0) {
    lines.push('\n## Messages\n');
    for (let i = 0; i < messages.length; i++) {
      const m = messages[i]!;
      const unreadTag = m.unread ? ' [UNREAD]' : '';
      lines.push(
        `${notifications.length + i + 1}. From: ${m.from || '(unknown)'}${unreadTag}\n` +
        `   Preview: ${m.preview}\n` +
        `   Time: ${m.timestamp || '(unknown)'}\n` +
        `   Link: ${m.url}`
      );
    }
  }

  lines.push('\nFor EVERY item, include the direct LinkedIn URL so I can click through and take action.');

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
