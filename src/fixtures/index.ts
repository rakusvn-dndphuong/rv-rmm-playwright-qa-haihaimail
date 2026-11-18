import { test as base, expect } from '@playwright/test';

import { GlobalNav } from '@components/global-nav';
import { AppointmentFormListPage } from '@pages/appointment/appointment-form-list.page';
import { AppointmentSettingPage } from '@pages/appointment/appointment-setting.page';
import { HomePage } from '@pages/home.page';
import { LoginPage } from '@pages/login.page';

import type { TestOptions } from './options';

type PageFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
  globalNav: GlobalNav;
  appointmentFormList: AppointmentFormListPage;
  appointmentSetting: AppointmentSettingPage;
  /**
   * Prefix for every piece of data this test creates.
   *
   * Every worker shares one tenant account, so tests carve out their own space rather than their
   * own login: a test only ever touches rows carrying its own prefix.
   */
  dataNamespace: string;
};

export const test = base.extend<TestOptions & PageFixtures>({
  suite: ['important', { option: true }],
  runId: ['local', { option: true }],

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  globalNav: async ({ page }, use) => {
    await use(new GlobalNav(page));
  },

  appointmentFormList: async ({ page }, use) => {
    await use(new AppointmentFormListPage(page));
  },

  appointmentSetting: async ({ page }, use) => {
    await use(new AppointmentSettingPage(page));
  },

  dataNamespace: async ({ suite, runId }, use, testInfo) => {
    await use(`e2e_${suite}_${runId}_w${testInfo.parallelIndex}`);
  },
});

export { expect };
