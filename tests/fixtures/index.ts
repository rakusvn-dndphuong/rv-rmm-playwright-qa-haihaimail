import { test as base } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { AppointmentFormListPage } from '../pages/AppointmentFormListPage';
import { AppointmentFormCommonSettingPage } from '../pages/AppointmentFormCommonSettingPage';
import { EditAppointmentFormCommonSettingPage } from '../pages/EditAppointmentFormCommonSettingPage';
import { Header } from '../components/Header';
import { Modal } from '../components/Modal';

type Fixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  appointmentFormListPage: AppointmentFormListPage;
  appointmentFormCommonSettingPage: AppointmentFormCommonSettingPage;
  editAppointmentFormCommonSettingPage: EditAppointmentFormCommonSettingPage;
  header: Header;
  modal: Modal;
};

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  appointmentFormListPage: async ({ page }, use) => {
    await use(new AppointmentFormListPage(page));
  },
  appointmentFormCommonSettingPage: async ({ page }, use) => {
    await use(new AppointmentFormCommonSettingPage(page));
  },
  editAppointmentFormCommonSettingPage: async ({ page }, use) => {
    await use(new EditAppointmentFormCommonSettingPage(page));
  },
  header: async ({ page }, use) => {
    await use(new Header(page));
  },
  modal: async ({ page }, use) => {
    await use(new Modal(page));
  },
});

export { expect } from '@playwright/test';
