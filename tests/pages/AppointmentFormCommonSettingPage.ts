import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AppointmentFormCommonSettingPage extends BasePage {
  // Navigation
  readonly editButton: Locator = this.page.locator('div.fw-tab-content a');

  // View mode — text fields
  readonly bookingCountPerPersonText: Locator = this.page.locator(
    'div.fw-tab-content table:nth-of-type(1) tbody tr:nth-of-type(1) td',
  );
  readonly bookingCountKeywordsText: Locator = this.page.locator(
    'div.fw-tab-content table:nth-of-type(1) tbody tr:nth-of-type(2) td',
  );
  readonly availableSlotKeywordsText: Locator = this.page.locator(
    'div.fw-tab-content table:nth-of-type(2) tbody tr:nth-of-type(3) td',
  );

  async clickEdit(): Promise<void> {
    await this.editButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getBookingCountPerPerson(): Promise<string> {
    return (await this.bookingCountPerPersonText.textContent()) ?? '';
  }

  async getBookingCountKeywords(): Promise<string> {
    return (await this.bookingCountKeywordsText.textContent()) ?? '';
  }

  async getAvailableSlotKeywords(): Promise<string> {
    return (await this.availableSlotKeywordsText.textContent()) ?? '';
  }

  async isAfterBusinessHoursEnabled(): Promise<boolean> {
    const body = (await this.page.locator('body').textContent()) ?? '';
    return body.includes('「終日」の予定は');
  }

  async isNoScheduleEnabled(): Promise<boolean> {
    const body = (await this.page.locator('body').textContent()) ?? '';
    return body.includes('「予定なし」の予定は');
  }

  async isOnPage(): Promise<boolean> {
    return this.page.url().includes('AppointmentFormCommonSetting');
  }
}
