import { expect, Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  protected async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async expectTitle(title: RegExp | string): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async waitForURL(pattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(pattern);
  }
}
