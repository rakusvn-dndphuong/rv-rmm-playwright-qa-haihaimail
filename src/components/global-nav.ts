import type { Locator, Page } from '@playwright/test';

/**
 * Primary navigation bar of the tenant (`<ul class="fw-gnavi-blue">`).
 *
 * Each action/label pair was read verbatim from the live DOM of `index.php?action=Home`. Labels are
 * hard-coded in the `.tpl` templates and drift between releases, so this is the one file to touch
 * when the product moves to a new version.
 */
export const GLOBAL_NAV = {
  home: { action: 'Home', label: 'ホーム' },
  groupMail: { action: 'GroupHome', label: 'グループ配信' },
  spotMail: { action: 'SpotMailList', label: 'スポット配信' },
  stepMail: { action: 'StepMailHome', label: 'ステップメール' },
  customerDatabase: { action: 'CustHome', label: '顧客データベース' },
  appointment: { action: 'AppointmentFormList', label: '日程調整' },
  inquiryForm: { action: 'InquiryFormList', label: 'フォーム' },
  popup: { action: 'PopupList', label: 'ポップアップ' },
  coupon: { action: 'CouponList', label: 'クーポン' },
  mailHistory: { action: 'MailList', label: '配信履歴' },
  report: { action: 'ReportHome', label: 'レポート' },
  settings: { action: 'MasterManagement', label: '各種設定' },
} as const;

export type GlobalNavKey = keyof typeof GLOBAL_NAV;

export class GlobalNav {
  readonly root: Locator;

  constructor(page: Page) {
    this.root = page.locator('ul.fw-gnavi-blue');
  }

  item(key: GlobalNavKey): Locator {
    return this.root.getByRole('link', { name: GLOBAL_NAV[key].label, exact: true });
  }

  async open(key: GlobalNavKey): Promise<void> {
    await this.item(key).click();
  }
}
