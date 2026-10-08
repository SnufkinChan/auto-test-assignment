import { Locator, Page } from '@playwright/test';
import { test, expect } from '../src/fixtures';
import { HELP_CENTER_URL } from '../src/utils/matchers';

/**
 * Use case 5: the hamburger side menu and the other navigation entry points lead to the same place.
 *
 * Note: the top bar has no Help Center link. Help Center is reachable from the side menu
 * and from the account panel on the left of pages like /en/promotions, so those two are compared instead.
 */

/** Clicks an entry that opens a new tab; returns that tab's URL and closes it. */
async function urlOfNewTabOpenedBy(page: Page, entry: Locator): Promise<string> {
  const newTab = page.waitForEvent('popup');
  await entry.click();
  const tab = await newTab;
  const url = tab.url();
  await tab.close();
  return url;
}

test.describe('Side menu navigation matches other entry points', () => {
  test('Promotions: top bar and side menu open the same page', async ({ page, header, sideMenu }) => {
    await page.goto('/en/sports');
    await header.promotionsLink.click();
    await expect(page).toHaveURL(/\/en\/promotions$/);
    const viaTopBar = { url: page.url(), title: await page.title() };

    await page.goto('/en/sports');
    await sideMenu.open();
    await sideMenu.promotions.click();

    await expect(page).toHaveURL(viaTopBar.url);
    await expect(page).toHaveTitle(viaTopBar.title);
    await expect(sideMenu.root).toBeHidden(); // menu closes after navigating
  });

  test('Help Center: side menu and account panel open the same help site', async ({ page, sideMenu }) => {
    await page.goto('/en/promotions');

    await sideMenu.open();
    const viaSideMenu = await urlOfNewTabOpenedBy(page, sideMenu.helpCenter);

    // With the side menu closed, the only Help Center entry left is the account panel's.
    const viaAccountPanel = await urlOfNewTabOpenedBy(page, page.getByTestId('faq-button'));

    expect(viaSideMenu).toMatch(HELP_CENTER_URL);
    expect(viaAccountPanel).toBe(viaSideMenu);
  });
});
