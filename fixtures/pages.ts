import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import { test as baseTest, expect } from '@playwright/test';


/**
 * Fixture "pages" — tạo sẵn đối tượng Page Object để inject vào test
 */

// Khai báo kiểu dữ liệu cho các fixture

type PagesFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
};

// Mở rộng fixture của Playwright và gắn kiểu PagesFixtures

export const test = baseTest.extend<PagesFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
});

// Export expect để dùng trong file test

export { expect };
