import { test, expect } from '../src/fixtures';

/**
 * Use case 1: a visitor who is NOT registered tries to log in with email + password.
 * Expected: login is refused, an error is shown, and the visitor stays logged out.
 */

test.describe('Login with email and password', () => {
  test.beforeEach(async ({ page, authModal }) => {
    await page.goto('/en/sports');
    await authModal.openEmailLogin();
  });

  test('empty form shows "required" errors and does not log in', async ({ header, authModal }) => {
    await authModal.loginButton.click();

    await expect(authModal.root.getByText('Email is required')).toBeVisible();
    await expect(authModal.root.getByText('Password is required')).toBeVisible();
    await expect(header.signupButton).toBeVisible(); // still logged out
  });

  test('unregistered user is refused', async ({ header, authModal, credentials }) => {
    test.skip(!credentials, 'No credentials: set LOGIN_EMAIL/LOGIN_PASSWORD or create credentials1.json');

    await test.step('submit email and password', async () => {
      await authModal.logIn(credentials!);
    });

    await test.step('login is refused with an error message', async () => {
      // Exact wording not confirmed yet. Tighten this regex to the real message after the first green run.
      await expect(authModal.root.getByText(/invalid|incorrect|wrong|not found|does not exist|failed/i)).toBeVisible();
    });

    await test.step('visitor is still logged out', async () => {
      await expect(authModal.emailForm).toBeVisible();
      await expect(header.signupButton).toBeVisible();
    });
  });
});
