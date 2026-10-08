# Epicbet critical use cases: Playwright tests

End-to-end tests for https://epicbet.com in **TypeScript + Playwright**, run in an unauthenticated state,
on Chromium and Firefox, locally and in GitHub Actions.

> **Status:** production currently serves a Cloudflare bot challenge to the test browsers, so runs fail fast
> with `Blocked by Cloudflare bot challenge (Ray ID …)`. See [Known blocker](#known-blocker-cloudflare).
> Flows and selectors were verified manually on the live site on 2026-10-08.

## Scenarios

| # | Spec | Use case | Why it is critical | Main checks |
|---|------|----------|--------------------|-------------|
| 1 | `01-login.spec.ts` | Unregistered user tries email + password login | Auth is the gate to money; it must refuse unknown users clearly | Empty form → "required" errors. Unknown user → error shown, still logged out |
| 2 | `02-chess.spec.ts` | Find Chess via the "All" sports menu | Sport discovery → betting is the core funnel | URL, title, page name; every event has decimal odds |
| 3 | `03-live-cs-stream.spec.ts` | Find a live Counter-Strike match and get its stream URL | Live betting + streaming is a key engagement feature | "Watch live" opens a player; `src` is https on a known streaming host (attached to the report) |
| 4 | `04-language-et-chess.spec.ts` | EN → ET, then find "Male" (chess) | Localisation for a core market (Estonia) | URL `/et/`, `<html lang="et">`, translated labels, persists after reload, `/et/sport/male` |
| 5 | `05-navigation-parity.spec.ts` | Side menu vs other navigation | Broken navigation silently loses users | Promotions: top bar ≡ side menu. Help Center: side menu ≡ account panel |

Notes from the requirement review:
- The top bar has **no Help Center link**, so for Help Center the side menu is compared with the account panel instead.
- Live data (chess events, live CS matches) comes and goes. With nothing to test, a test is **skipped with a reason**,
  so "no data" and "broken feature" stay distinguishable in the report.

## Project structure

```
src/
  config/env.ts        Environment settings (BASE_URL, HEADLESS, credentials, UA marker) in one place
  pages/               Page objects: Header, SideMenu, AuthModal, SportsNavigation, SportPage, LivePage
  fixtures/index.ts    Custom `test`: injects page objects + credentials, fails fast when blocked by Cloudflare
  utils/matchers.ts    Shared patterns (odds format, known stream hosts, Help Center URL)
tests/
  setup/consent.setup.ts   Runs once per browser: declines cookies, saves browser state
  01…05-*.spec.ts          The scenarios
.github/workflows/playwright.yml   CI pipeline
```

- **Page objects + fixtures:** tests ask for what they need (`async ({ header, sportPage }) => …`) and read like test cases.
  When the UI changes, a selector is fixed in one page object, not in every test.
- **Selectors:** the site's `data-testid` attributes first, then roles/text. Test IDs don't change with
  language, which is why the same page objects drive the English and Estonian flows.
- **No hard waits:** only web-first `expect(...)` assertions, which retry until they pass or time out.
- **Readable reports:** steps are wrapped in `test.step`, so the HTML report reads like a test case.

## Running locally

```bash
npm ci
npx playwright install chromium firefox
cp credentials1.example.json credentials1.json   # unregistered email + any password (git-ignored)

npm test                 # both browsers
npm run test:chromium
npm run test:firefox
npm run ui               # interactive mode
npm run report           # open the last HTML report
npm run typecheck
```

### Configuration

| Variable | Default | Purpose |
|----------|---------|---------|
| `BASE_URL` | `https://epicbet.com` | Point the suite at another environment (e.g. staging) |
| `HEADLESS` | off | `1` / `true` runs without a browser window |
| `LOGIN_EMAIL`, `LOGIN_PASSWORD` | – | Unregistered test user (CI secrets). Falls back to `credentials1.json` |

As the brief asks, every browser appends `SisuTestAssignment` to its User-Agent, and tests run with 1 worker.

## CI (GitHub Actions)

`.github/workflows/playwright.yml` runs on push to `main`, on pull requests, daily at 06:00 UTC, and on demand
("Run workflow" button).
- One job per browser (Chromium, Firefox), run **one after the other** to keep load on production low.
- Steps: `npm ci` → type check → install browser → run tests under `xvfb` (virtual display, headed like locally).
- Reports: HTML report artifact per browser. On failure, traces, screenshots and videos are uploaded as well.
  Failures also appear as inline annotations on the commit or PR.
- To enable the login test in CI, add repository secrets `LOGIN_EMAIL` and `LOGIN_PASSWORD`
  (an email that is **not** registered). Without them, that test is skipped with a reason.

To debug a CI failure: download the `test-results-<browser>` artifact, then `npx playwright show-trace <trace.zip>`.

## Known blocker: Cloudflare

- Production answers test browsers with Cloudflare's "Performing security verification" page (`cf-mitigated: challenge`).
  The `failFastWhenBlocked` fixture detects this and fails the test immediately with the Cloudflare **Ray ID**,
  instead of 60-second timeouts.
- The brief's `SisuTestAssignment` User-Agent marker is verified to reach the site (request header and
  `navigator.userAgent`), but the challenge still appears. Sending it as an `X-Test-Traffic` / `X-Sisu-Test` header
  made no difference, and ticking the check by hand returns "Verification failed".
- The suite deliberately does not try to evade bot detection. Once test traffic is allow-listed, or `BASE_URL` points
  at a non-challenged environment, it needs no further changes.

## Other findings

- **Accessibility:** the login method buttons (email, Smart-ID, Google…) are icon-only with no accessible name,
  and sport page titles are plain `<div>`s, not headings.
- `data-testid="modal"` is reused for different dialogs (the all-sports menu and the match panel).
- The login error wording for an unknown user is not pinned yet (the test accepts a few likely wordings).
  Tighten it after the first unblocked run.
