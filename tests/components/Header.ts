import { Locator, Page } from '@playwright/test';

export class Header {
  readonly navBar: Locator;
  readonly logoLink: Locator;
  readonly scheduleAdjustmentLink: Locator;

  constructor(private readonly page: Page) {
    this.navBar = page.getByRole('navigation');
    this.logoLink = page.getByRole('link', { name: /logo/i });
    this.scheduleAdjustmentLink = page.locator('li:nth-of-type(6) > a');
  }

  async clickLogo(): Promise<void> {
    await this.logoLink.click();
  }

  async clickScheduleAdjustment(): Promise<void> {
    await this.scheduleAdjustmentLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async isVisible(): Promise<boolean> {
    return this.navBar.isVisible();
  }
}
