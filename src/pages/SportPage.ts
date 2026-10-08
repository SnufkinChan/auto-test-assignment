import { Locator, Page } from '@playwright/test';

/** A single sport's page, e.g. /en/sports/chess. */
export class SportPage {
  readonly root: Locator;
  /** Events grouped under leagues/tournaments. */
  readonly events: Locator;

  constructor(page: Page) {
    this.root = page.getByTestId('sport-category-page');
    this.events = this.root.getByTestId('league-container').getByTestId('match-container');
  }

  /** The sport name shown at the top of the page (rendered as plain text, not a heading). */
  title(sportName: string): Locator {
    return this.root.getByText(sportName, { exact: true });
  }
}
