import { expect, Locator, Page } from '@playwright/test';

/** Top bar shown on every page. */
export class Header {
  readonly root: Locator;
  readonly promotionsLink: Locator;
  readonly languageButton: Locator;
  readonly signupButton: Locator;
  readonly menuButton: Locator;

  constructor(private readonly page: Page) {
    this.root = page.getByTestId('header');
    this.promotionsLink = this.root.getByRole('link', { name: 'Promotions' });
    this.languageButton = this.root.getByTestId('language-button');
    this.signupButton = this.root.getByTestId('signup-button');
    this.menuButton = this.root.getByTestId('menu-button');
  }

  /** Picks a language by its name as listed in the menu, e.g. /Eesti/. */
  async switchLanguage(languageName: RegExp): Promise<void> {
    await this.languageButton.click();
    const languageMenu = this.page.getByTestId('language-menu');
    await expect(languageMenu).toBeVisible();
    await languageMenu.getByRole('button', { name: languageName }).click();
  }
}
