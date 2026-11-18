import type { Locator, Page } from '@playwright/test';

import { BasePage } from '@pages/base.page';

/** 日程調整 form list (`action=AppointmentFormList`). */
export class AppointmentFormListPage extends BasePage {
  /**
   * Third tab of the list screen, which leads to 共通設定.
   * Recorded positional selector — replace with a role/label locator once the tab label has been
   * copied from the live DOM; the label must not be guessed.
   */
  readonly commonSettingTab: Locator;

  constructor(page: Page) {
    super(page);
    this.commonSettingTab = page.locator('div.fw-tab-btn li:nth-of-type(3) > a');
  }

  async goto(): Promise<void> {
    await this.gotoAction('AppointmentFormList');
  }

  async openCommonSetting(): Promise<void> {
    await this.commonSettingTab.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.assertLanded('Opening 共通設定');
  }
}
