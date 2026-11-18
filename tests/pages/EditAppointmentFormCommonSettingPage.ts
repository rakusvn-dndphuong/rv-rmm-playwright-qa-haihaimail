import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class EditAppointmentFormCommonSettingPage extends BasePage {
  readonly bookingCountPerPersonSelect: Locator = this.page.locator(
    '#inputForm table:nth-of-type(1) tr:nth-of-type(1) select',
  );
  readonly bookingCountKeywordsTextarea: Locator = this.page.locator(
    '#inputForm table:nth-of-type(1) textarea',
  );
  readonly availableSlotKeywordsTextarea: Locator = this.page.locator(
    '#inputForm table:nth-of-type(2) textarea',
  );
  readonly afterBusinessHoursCheckbox: Locator = this.page.locator(
    '#inputForm table:nth-of-type(2) tr:nth-of-type(1) label > input[type="checkbox"]',
  );
  readonly noScheduleCheckbox: Locator = this.page.locator(
    '#inputForm table:nth-of-type(2) tr:nth-of-type(2) label > input[type="checkbox"]',
  );
  readonly saveButton: Locator = this.page.locator('#inputForm li:nth-of-type(1) > input');

  async selectBookingCountPerPerson(value: number): Promise<void> {
    await this.bookingCountPerPersonSelect.selectOption({ label: String(value) });
  }

  async fillBookingCountKeywords(value: string): Promise<void> {
    await this.bookingCountKeywordsTextarea.fill(value);
  }

  async fillAvailableSlotKeywords(value: string): Promise<void> {
    await this.availableSlotKeywordsTextarea.fill(value);
  }

  async checkAfterBusinessHours(): Promise<void> {
    await this.afterBusinessHoursCheckbox.check({ force: true });
  }

  async uncheckAfterBusinessHours(): Promise<void> {
    await this.afterBusinessHoursCheckbox.uncheck({ force: true });
  }

  async checkNoSchedule(): Promise<void> {
    await this.noScheduleCheckbox.check({ force: true });
  }

  async uncheckNoSchedule(): Promise<void> {
    await this.noScheduleCheckbox.uncheck({ force: true });
  }

  async toggleAfterBusinessHoursCheckbox(): Promise<void> {
    await this.afterBusinessHoursCheckbox.click();
  }

  async toggleNoScheduleCheckbox(): Promise<void> {
    await this.noScheduleCheckbox.click();
  }

  async clickSave(): Promise<void> {
    await this.saveButton.click({ force: true });
    await this.page.waitForLoadState('domcontentloaded');
  }

  async isOnPage(): Promise<boolean> {
    return this.page.url().includes('EditAppointmentFormCommonSetting');
  }
}
