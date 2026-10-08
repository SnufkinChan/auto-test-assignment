import { expect, Locator, Page } from '@playwright/test';
import { Header } from './Header';

/** The hamburger side menu (drawer) opened from the top bar. */
export class SideMenu {
  readonly root: Locator;
  readonly promotions: Locator;
  readonly helpCenter: Locator;

  constructor(page: Page, private readonly header: Header) {
    this.root = page.getByTestId('sidebar');
    this.promotions = this.root.getByTestId('promotions-button');
    this.helpCenter = this.root.getByTestId('faq-button');
  }

  async open(): Promise<void> {
    await this.header.menuButton.click();
    await expect(this.root).toBeVisible();
  }
}
