import type { Dialog, Locator, Page } from '@playwright/test';

import { actionUrl } from '@config/env';
import { THROTTLED_HEADING } from '@utils/throttle';

/** The app's own not-found body, rendered as `div.fw-mg20` on `index.php` with an unknown action. */
const NOT_FOUND_TEXT = 'ページが見つかりません';

/**
 * How long to wait before asking once more when a read lands on the throttle screen. The block is
 * short-lived; this outlasts it while staying inside a 60s test.
 */
const THROTTLE_BACKOFF_MS = 20_000;

/**
 * Base class for every screen inside the tenant.
 *
 * Holds navigation and the two guards this app needs: `assertLanded` (it answers HTTP 200 even
 * when it refuses you) and `clickThroughDialogs` (its submit buttons raise dialogs). Page objects
 * hold locators and actions only — assertions belong in specs.
 */
export abstract class BasePage {
  readonly page: Page;

  /** Main content area of the admin layout: `<main class="contents">`. */
  readonly main: Locator;

  constructor(page: Page) {
    this.page = page;
    this.main = page.locator('main.contents').first();
  }

  async gotoAction(action: string, params: Record<string, string | number> = {}): Promise<void> {
    const url = actionUrl(action, params);
    await this.page.goto(url);

    // A read can be retried once, taking the app at its word. A submit never is — sending it twice
    // is how two of whatever it creates end up in the tenant.
    if (await this.isThrottled()) {
      console.warn(`[throttle] the app blocked action=${action}; waiting ${THROTTLE_BACKOFF_MS / 1000}s`);
      // Not a stand-in for a condition: there is nothing to poll for, and polling would be more of
      // what caused the block.
      // eslint-disable-next-line playwright/no-wait-for-timeout
      await this.page.waitForTimeout(THROTTLE_BACKOFF_MS);
      await this.page.goto(url);
    }

    await this.assertLanded(`action=${action}`);
  }

  private async isThrottled(): Promise<boolean> {
    if ((await this.main.count()) > 0) {
      return false;
    }
    return (await this.page.getByRole('heading', { name: THROTTLED_HEADING }).count()) > 0;
  }

  /**
   * Fails loudly when a navigation did not land on the screen it asked for.
   *
   * Dead session, unknown action and rate limiting all come back as an ordinary 200 page, so
   * without this a refusal shows up as a locator that finds nothing, several steps later. Only a
   * positive signal throws; a screen this has never seen stays silent rather than failing a good
   * test.
   */
  protected async assertLanded(what: string): Promise<void> {
    if ((await this.main.count()) > 0) {
      return;
    }

    if ((await this.page.locator('#loginForm').count()) > 0) {
      throw new Error(
        `${what} came back as the login screen. The stored session is no longer valid — ` +
          'delete playwright/.auth/<suite>.json and let the setup project log in again.',
      );
    }

    if ((await this.page.locator('div.fw-mg20').filter({ hasText: NOT_FOUND_TEXT }).count()) > 0) {
      throw new Error(`${what} came back as ${NOT_FOUND_TEXT}。 Check the action name and its parameters.`);
    }

    if ((await this.page.getByRole('heading', { name: THROTTLED_HEADING }).count()) > 0) {
      throw new Error(
        `${what} came back as ${THROTTLED_HEADING} — the app is refusing this client for coming at it ` +
          'too fast. Run fewer specs at a time, or leave a gap between runs.',
      );
    }
  }

  /**
   * Clicks a control that submits through the app's `buttonDeSubmit()` helper, accepting every
   * dialog it raises. Those buttons show a JS confirm and leave a beforeunload prompt armed;
   * Playwright dismisses any dialog nobody handles, which cancels the navigation and leaves the
   * page sitting there as if the click had missed. The listener stays attached for the whole
   * submit for that reason.
   */
  protected async clickThroughDialogs(control: Locator): Promise<void> {
    await this.actThroughDialogs(() => control.click());
  }

  /** Same guard for a submit no click triggers, such as an input that posts the form on `change`. */
  protected async actThroughDialogs(act: () => Promise<void>): Promise<void> {
    const acceptDialog = (dialog: Dialog): void => void dialog.accept();

    this.page.on('dialog', acceptDialog);
    try {
      await act();
      await this.page.waitForLoadState('domcontentloaded');
      // A lost double-submit token also surfaces as the login screen, so check after every post.
      await this.assertLanded('This submit');
    } finally {
      this.page.off('dialog', acceptDialog);
    }
  }
}
