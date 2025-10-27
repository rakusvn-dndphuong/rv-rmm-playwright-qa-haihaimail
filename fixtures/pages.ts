import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import { test as baseTest } from '@playwright/test';

/**
 * Fixture "pages" — tạo sẵn đối tượng Page Object để inject vào test
 */
export const test = baseTest.extend<{
  loginPage: LoginPage;
  homePage: HomePage;
}>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);  
    await use(loginPage);
  },
    homePage: async ({ page }, use) => {    
    const homePage = new HomePage(page);
    await use(homePage);
  },
});
export { expect } from '@playwright/test';

