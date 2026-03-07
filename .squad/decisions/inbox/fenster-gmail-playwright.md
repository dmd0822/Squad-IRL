# Decision: Gmail Playwright approach for email-inbox-triage

**By:** Fenster (Core Dev)
**Date:** 2025-07-18
**Requested by:** Brady ("i would just make it a gmail demo")

## What

Replaced the paste-your-emails UX in `email-inbox-triage` with a Playwright-based Gmail scraper. `npm start` now launches a real Chromium browser, navigates to Gmail, waits for the user to log in, scrapes visible inbox rows, and feeds them to the triage squad.

## Key choices

1. **`playwright` (full package) over `playwright-core`** — includes browser management (`npx playwright install chromium`) so users don't need system Chromium
2. **`launchPersistentContext` with `.gmail-session/`** — persists cookies/session between runs so the user only logs in once
3. **Close browser after scraping** — keeps resources free during the (potentially long) triage conversation
4. **Fallback scraping** — if Gmail's dynamic DOM changes and structured selectors (`tr.zA`, `.yW .zF`, `.bog`) fail, fall back to raw `innerText` of row elements
5. **`squad.config.ts` untouched** — the four agents and routing rules already work perfectly for this use case

## Impact

- Users of this sample now get a real-world demo rather than a toy paste-input flow
- Requires one extra setup step: `npx playwright install chromium`
- `.gmail-session/` must be gitignored (handled)
