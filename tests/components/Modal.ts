import { Locator, Page } from '@playwright/test';

export class Modal {
  readonly container: Locator;
  readonly closeButton: Locator;
  readonly title: Locator;

  constructor(private readonly page: Page) {
    this.container = page.getByRole('dialog');
    this.closeButton = this.container.getByRole('button', { name: /close/i });
    this.title = this.container.getByRole('heading');
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }

  async isVisible(): Promise<boolean> {
    return this.container.isVisible();
  }

  async getTitle(): Promise<string> {
    return this.title.innerText();
  }
}
