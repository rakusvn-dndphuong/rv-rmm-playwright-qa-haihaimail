import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { AppData } from '../common/AppData';

/**
 * Tạo LoginPage kế thừa từ BasePage (gán locator và các hành vi riêng của trang Login)
 */

export class LoginPage extends BasePage {
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly submitButton: Locator;
  private readonly errorMessage: Locator;            
    constructor(page: Page) {
    super(page);
    this.usernameField = page.locator('#username');
    this.passwordField = page.locator('#password');
    this.submitButton = page.locator('#submit');
    this.errorMessage = page.locator('#error');
  } 

  /** Mở trang login */

  async openLoginPage(): Promise<void> {
    await this.navigateToPage(AppData.login.url);
  } 

  /** Thực hiện login với username & password */

  async performLogin(username: string, password: string): Promise<void> {
    await this.inputText(this.usernameField, username);
    await this.inputText(this.passwordField, password);
    await this.clickElement(this.submitButton);
  }
  
  async verifyInvalidUsernameError(): Promise<void> {
    await this.errorMessage.isVisible();
    await this.assertElementText(this.errorMessage, 'Your username is invalid!');
  }

  async verifyInvalidPasswordError(): Promise<void> {
    await this.errorMessage.isVisible();
    await this.assertElementText(this.errorMessage, 'Your password is invalid!');
  }
}