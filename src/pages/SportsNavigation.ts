import { expect, Locator, Page } from '@playwright/test';

/** Sport category bar under the header: Home, LIVE, favourite sports and "All". */
export class SportsNavigation {
  readonly liveTab: Locator;
  readonly allSportsTab: Locator;

  constructor(private readonly page: Page) {
    this.liveTab = page.getByTestId('category-live-tab-button');
    this.allSportsTab = page.getByTestId('category-all-sports-tab-button');
  }

  /** Opens a sport from the "All" menu. Pass the name in the current language, e.g. "Chess" or "Male". */
  async openSportFromAllMenu(sportName: string): Promise<void> {
    await this.allSportsTab.click();
    const allSports = this.page.getByTestId('all-sports-container');
    await expect(allSports).toBeVisible();
    await allSports.getByRole('link', { name: sportName, exact: true }).click();
  }
}
