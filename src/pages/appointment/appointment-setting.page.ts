import type { Locator, Page } from '@playwright/test';

import { BasePage } from '@pages/base.page';

/** Everything 日程調整の共通設定 holds. */
export type AppointmentCommonSetting = {
  /** 担当者の予約受付件数, 1 to 20. */
  maxPerAssignee: string;
  /** 予約判定キーワード — titles carrying one of these count towards the daily limit. */
  countingKeywords: string[];
  /** 「終日」の予定は、予約受付が可能な空き時間とみなす */
  fullDayIsFree: boolean;
  /** 「予定なし」の予定は、予約受付が可能な空き時間とみなす */
  noPlanIsFree: boolean;
  /** 空き時間キーワード — titles carrying one of these count as free time. */
  excludingKeywords: string[];
};

/**
 * 日程調整の共通設定 (`action=AppointmentFormCommonSetting`) and its editor
 * (`action=EditAppointmentFormCommonSetting`).
 *
 * Tenant-wide, so a spec that changes anything here owes the tenant the old values back.
 *
 * Values are read off the editor rather than the view screen: the view prints them as prose while
 * the editor holds them in fields that can be read back exactly, which a round-trip needs.
 */
export class AppointmentSettingPage extends BasePage {
  readonly maxPerAssignee: Locator;
  readonly countingKeywords: Locator;
  readonly fullDayIsFree: Locator;
  readonly noPlanIsFree: Locator;
  readonly excludingKeywords: Locator;
  readonly saveButton: Locator;
  readonly editLink: Locator;

  constructor(page: Page) {
    super(page);
    this.maxPerAssignee = page.locator('select[name="max_appts_per_assignee"]');
    this.countingKeywords = page.locator('textarea[name="counting_keyword_list"]');
    // Each checkbox is shadowed by a hidden input of the same name carrying the unchecked value,
    // so the type has to be part of the selector or the locator matches two elements.
    this.fullDayIsFree = page.locator('input[type=checkbox][name="is_full_day_available"]');
    this.noPlanIsFree = page.locator('input[type=checkbox][name="is_free_available"]');
    this.excludingKeywords = page.locator('textarea[name="excluding_keyword_list"]');
    this.saveButton = page.locator('input[type=button][value="保存"]');
    this.editLink = page.getByRole('link', { name: '編集' }).first();
  }

  async goto(): Promise<void> {
    await this.gotoAction('AppointmentFormCommonSetting');
  }

  async gotoEdit(): Promise<void> {
    await this.gotoAction('EditAppointmentFormCommonSetting');
  }

  /** Reads the editor's current values. Assumes the editor is open. */
  async read(): Promise<AppointmentCommonSetting> {
    return {
      maxPerAssignee: await this.maxPerAssignee.inputValue(),
      countingKeywords: toLines(await this.countingKeywords.inputValue()),
      fullDayIsFree: await this.fullDayIsFree.isChecked(),
      noPlanIsFree: await this.noPlanIsFree.isChecked(),
      excludingKeywords: toLines(await this.excludingKeywords.inputValue()),
    };
  }

  /** Fills every field and saves. Assumes the editor is open. */
  async save(values: AppointmentCommonSetting): Promise<void> {
    await this.maxPerAssignee.selectOption(values.maxPerAssignee);
    await this.countingKeywords.fill(values.countingKeywords.join('\n'));
    await this.fullDayIsFree.setChecked(values.fullDayIsFree);
    await this.noPlanIsFree.setChecked(values.noPlanIsFree);
    await this.excludingKeywords.fill(values.excludingKeywords.join('\n'));
    await this.clickThroughDialogs(this.saveButton);
  }
}

function toLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}
