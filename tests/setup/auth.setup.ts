import { requireBaseUrl, storageStateOf } from '@config/env';
import { DEFAULT_ROLE, getUser } from '@data/index';
import { expect, test as setup } from '@fixtures/index';

/**
 * Logs in exactly once per suite and saves the session to disk.
 *
 * Workers must not log in on their own. The app locks an account after a few bad passwords and the
 * lock can last hours (the `AccountLockSetting` screen), so several workers hammering the login
 * form is the fastest way to lose the test environment for the day.
 *
 * Runs once for each suite project (`setup-important`, `setup-all-function`); `suite` comes from
 * the project, so each run logs in to its own environment and writes its own session file.
 */
setup('authenticate tenant user', async ({ page, loginPage, suite }) => {
  // Fail with a message that says which file to fill in, before any browser work.
  requireBaseUrl(suite);
  const user = getUser(suite, DEFAULT_ROLE);

  await loginPage.goto();
  await expect(loginPage.form).toBeVisible();

  await loginPage.login(user.username, user.password);

  // A vanished login form is the reliable signal that we got in — a failed login re-renders the
  // same screen with an error message rather than navigating anywhere.
  await expect(loginPage.form).toBeHidden();

  await page.context().storageState({ path: storageStateOf(suite) });
});
