import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator = this.page.locator('#loginid');
  readonly passwordInput: Locator = this.page.locator('#password');
  // selector dựa theo script gốc: li:nth-of-type(3) > input
  readonly loginButton: Locator = this.page.locator('li:nth-of-type(3) > input');

  async goto(): Promise<void> {
    // Truy cập trang login — action=Logout sẽ redirect về form login nếu chưa đăng nhập
    await this.navigate('index.php?action=Logout');
  }

  async fillUsername(value: string): Promise<void> {
    await this.usernameInput.fill(value);
  }

  async fillPassword(value: string): Promise<void> {
    await this.passwordInput.fill(value);
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }

  async isLoggedIn(): Promise<boolean> {
    return this.page.url().includes('index.php');
  }
}
