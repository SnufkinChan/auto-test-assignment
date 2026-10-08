import { Locator, Page } from '@playwright/test';

/** The LIVE betting page and the match panel with its video stream. */
export class LivePage {
  readonly root: Locator;
  readonly matches: Locator;
  /** Embedded video player opened by a match's "Watch live" button. */
  readonly streamPlayer: Locator;

  constructor(private readonly page: Page) {
    this.root = page.getByTestId('live-page');
    this.matches = page.getByTestId('match-container');
    this.streamPlayer = page.getByTestId('sidebet-preview-container').locator('iframe');
  }

  async filterBySport(sportName: string): Promise<void> {
    await this.root.getByRole('link', { name: sportName, exact: true }).click();
  }

  /**
   * Live matches of a game that can be watched. Games have no test id of their own,
   * so they are recognised by their league link, e.g. "/counter-strike" in /esports/counter-strike-2/...
   */
  watchableMatches(leagueUrlPart: string): Locator {
    return this.matches
      .filter({ has: this.page.locator(`a[href*="${leagueUrlPart}"]`) })
      .filter({ has: this.watchLiveButton() });
  }

  watchLiveButton(within: Locator | Page = this.page): Locator {
    return within.getByRole('button', { name: /watch live/i });
  }
}
