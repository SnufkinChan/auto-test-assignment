import { test, expect } from '../src/fixtures';
import { DECIMAL_ODDS } from '../src/utils/matchers';

/**
 * Use case 2: a fan finds Chess in the sports menu and checks what is on offer.
 * Expected: the Chess page opens and every listed event has bettable odds.
 */

test('Chess can be found in the sports menu and lists events with odds', async ({ page, sportsNavigation, sportPage }) => {
  await page.goto('/en/sports');

  await test.step('open Chess from the "All" sports menu', async () => {
    await sportsNavigation.openSportFromAllMenu('Chess');
  });

  await test.step('Chess page is shown', async () => {
    await expect(page).toHaveURL(/\/en\/sports\/chess$/);
    await expect(page).toHaveTitle(/Chess/);
    await expect(sportPage.title('Chess')).toBeVisible();
  });

  await test.step('each listed event has odds', async () => {
    // Chess events are seasonal: an empty list is "no data", not a bug.
    test.skip((await sportPage.events.count()) === 0, 'No chess events are offered right now');

    for (const event of await sportPage.events.all()) {
      await expect(event.getByTestId('outcome-button').first()).toHaveText(DECIMAL_ODDS);
    }
  });
});
