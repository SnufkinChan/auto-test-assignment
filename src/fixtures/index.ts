import { test as base } from '@playwright/test';
import { Credentials, loadCredentials } from '../config/env';
import { AuthModal } from '../pages/AuthModal';
import { Header } from '../pages/Header';
import { LivePage } from '../pages/LivePage';
import { SideMenu } from '../pages/SideMenu';
import { SportPage } from '../pages/SportPage';
import { SportsNavigation } from '../pages/SportsNavigation';

type Fixtures = {
  header: Header;
  sideMenu: SideMenu;
  authModal: AuthModal;
  sportsNavigation: SportsNavigation;
  sportPage: SportPage;
  livePage: LivePage;
  /** Unregistered user's credentials, or undefined when none are configured. */
  credentials: Credentials | undefined;
  /** Automatic: fails the test immediately (instead of a timeout) when Cloudflare blocks the page. */
  failFastWhenBlocked: void;
};

/**
 * Tests import `test` from here instead of '@playwright/test' and simply ask for what they need:
 *   test('...', async ({ header, sportPage }) => { ... })
 */
export const test = base.extend<Fixtures>({
  header: async ({ page }, use) => use(new Header(page)),
  sideMenu: async ({ page, header }, use) => use(new SideMenu(page, header)),
  authModal: async ({ page, header }, use) => use(new AuthModal(page, header)),
  sportsNavigation: async ({ page }, use) => use(new SportsNavigation(page)),
  sportPage: async ({ page }, use) => use(new SportPage(page)),
  livePage: async ({ page }, use) => use(new LivePage(page)),
  credentials: async ({}, use) => use(loadCredentials()),

  failFastWhenBlocked: [
    async ({ page }, use) => {
      page.on('response', async (response) => {
        const isPageLoad = response.request().isNavigationRequest() && response.frame() === page.mainFrame();
        // Cloudflare marks its challenge pages with this header.
        if (isPageLoad && response.headers()['cf-mitigated'] === 'challenge') {
          const rayId = response.headers()['cf-ray'] ?? 'unknown';
          await page.close({
            reason: `Blocked by Cloudflare bot challenge (Ray ID ${rayId}): test traffic is not allow-listed on ${response.url()}`,
          });
        }
      });
      await use();
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
