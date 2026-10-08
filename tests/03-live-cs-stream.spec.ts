import { test, expect } from '../src/fixtures';
import { KNOWN_STREAM_HOSTS } from '../src/utils/matchers';

/**
 * Use case 3: a fan finds a LIVE Counter-Strike match and gets its stream URL.
 * Expected: "Watch live" opens the match with an embedded player that has a valid https stream URL.
 */

test('live Counter-Strike match exposes a stream URL', async ({ page, sportsNavigation, livePage }) => {
  await page.goto('/en/sports');

  await test.step('go to LIVE > Esports', async () => {
    await sportsNavigation.liveTab.click();
    await livePage.filterBySport('Esports');
    await expect(page).toHaveURL(/\/en\/sports\/live\/esports/);
    await expect(livePage.matches.first()).toBeVisible();
  });

  const liveCsMatches = livePage.watchableMatches('/counter-strike');
  test.skip((await liveCsMatches.count()) === 0, 'No live Counter-Strike match with a stream right now');

  await test.step('open the stream of the first live CS match', async () => {
    await livePage.watchLiveButton(liveCsMatches.first()).click();
    await expect(page).toHaveURL(/matchId=\d+/);
  });

  await test.step('read and validate the stream URL', async () => {
    await expect(livePage.streamPlayer).toHaveAttribute('src', /^https:\/\//);

    const streamUrl = (await livePage.streamPlayer.getAttribute('src'))!;
    expect(new URL(streamUrl).hostname).toMatch(KNOWN_STREAM_HOSTS);

    await test.info().attach('stream-url', { body: streamUrl, contentType: 'text/plain' });
  });
});
