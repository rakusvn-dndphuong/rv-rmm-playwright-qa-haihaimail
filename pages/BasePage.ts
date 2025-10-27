import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage — lớp cha chứa các hành vi chung cho tất cả Page (mở trang, click, fill, verify…)
 */
export class BasePage {
  protected readonly browserPage: Page;

  constructor(pwPage: Page) {
    this.browserPage = pwPage;
}

  /** Mở trang bằng URL */
  
  async navigateToPage(url: string): Promise<void> {
    await this.browserPage.goto(url);
  }

  /** Click vào phần tử */

  async clickElement(locator: Locator): Promise<void> {
    await locator.click();
  }

  /** Điền text vào input field */
  
  async inputText(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }

  /** Kiểm tra URL hiện tại có chứa chuỗi mong đợi */

  async assertUrlContains(expected: string | RegExp): Promise<void> {
    await expect(this.browserPage).toHaveURL(expected);
  }

  /** Kiểm tra nội dung text của phần tử */

  async assertElementText(locator: Locator, expectedText: string | RegExp): Promise<void> {
    await expect(locator).toHaveText(expectedText);
  }
}	