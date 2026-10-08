import { test as setup, expect } from '../../src/fixtures';
import { storageStateFor } from '../../src/config/env';

/**
 * Runs once per browser before the tests: declines non-essential cookies
 * (so the banner never covers elements) and saves that state for every test.
 */
setup('decline cookies and save browser state', async ({ page, browserName }) => {
  await page.goto('/en/');

  const denyCookies = page.getByRole('button', { name: 'Deny' });
  await denyCookies.click();
  await expect(denyCookies).toBeHidden();

  await page.context().storageState({ path: storageStateFor(browserName) });
});
