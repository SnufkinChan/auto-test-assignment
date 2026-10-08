import { expect, Locator, Page } from '@playwright/test';
import { Credentials } from '../config/env';
import { Header } from './Header';

/** Login / sign-up dialog. */
export class AuthModal {
  readonly root: Locator;
  readonly emailForm: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page, private readonly header: Header) {
    this.root = page.getByTestId('auth-modal');
    this.emailForm = this.root.getByTestId('sign-in-form-email');
    this.emailInput = this.root.getByTestId('email-input');
    this.passwordInput = this.root.getByTestId('password-input');
    this.loginButton = this.root.getByTestId('auth-login-button');
  }

  /** Opens the dialog on the Login tab with the email + password method selected. */
  async openEmailLogin(): Promise<void> {
    await this.header.signupButton.click();
    await this.root.getByTestId('login-tab-button').click();
    await this.root.getByTestId('email-option-button').click();
    await expect(this.emailForm).toBeVisible();
  }

  async logIn({ email, password }: Credentials): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
