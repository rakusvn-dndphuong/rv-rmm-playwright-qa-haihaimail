import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AppointmentFormListPage extends BasePage {
  readonly commonSettingTab: Locator = this.page.locator('div.fw-tab-btn li:nth-of-type(3) > a');

  async clickCommonSettingTab(): Promise<void> {
    await this.commonSettingTab.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async isOnPage(): Promise<boolean> {
    return this.page.url().includes('AppointmentFormList');
  }
}
