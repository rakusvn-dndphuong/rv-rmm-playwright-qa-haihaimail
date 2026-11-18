import type { Locator, Page } from '@playwright/test';

/**
 * Tenant login screen. The form has proper `<label for>` elements, so `getByLabel` works.
 *
 * Does not extend `BasePage`: its guards assume a logged-in layout, and this is the one screen
 * where `main.contents` is expected to be absent.
 */
export class LoginPage {
  readonly page: Page;
  readonly loginIdInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  /** The login form itself. Still seeing it after a submit means we never got inside. */
  readonly form: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginIdInput = page.getByLabel('ログインID');
    this.passwordInput = page.getByLabel('パスワード');
    this.submitButton = page.getByRole('button', { name: 'ログイン' });
    this.form = page.locator('#loginForm');
  }

  /** Resolves against the project's `baseURL`, which already carries the tenant path. */
  async goto(): Promise<void> {
    await this.page.goto('index.php');
  }

  /** Goes through the real form: the template embeds a double-submit token that changes on every load. */
  async login(loginId: string, password: string): Promise<void> {
    await this.loginIdInput.fill(loginId);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
