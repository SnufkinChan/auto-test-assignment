import { test, expect } from '../src/fixtures';

/**
 * Use case 4: an Estonian speaker lands on the English site, switches to Estonian
 * and finds Chess, which is "Male" in Estonian.
 * Expected: the whole site switches language (URL, <html lang>, labels) and stays switched.
 */

test('switch from English to Estonian and find "Male" (chess)', async ({ page, header, sportsNavigation, sportPage }) => {
  await test.step('start on the English site', async () => {
    await page.goto('/en/');
    await expect(page).toHaveURL(/\/en(\/|$)/);
    await expect(header.languageButton).toHaveText('EN');
  });

  await test.step('switch language to Estonian', async () => {
    await header.switchLanguage(/Eesti/);

    await expect(page).toHaveURL(/\/et(\/|$)/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'et');
    await expect(header.languageButton).toHaveText('ET');
    await expect(sportsNavigation.allSportsTab).toHaveText('Kõik'); // "All"
  });

  await test.step('language survives a reload', async () => {
    await page.reload();
    await expect(header.languageButton).toHaveText('ET');
  });

  await test.step('find "Male" (chess) in the sports menu', async () => {
    await sportsNavigation.openSportFromAllMenu('Male');
    await expect(page).toHaveURL(/\/et\/sport\/male$/);
    await expect(sportPage.title('Male')).toBeVisible();
  });
});
