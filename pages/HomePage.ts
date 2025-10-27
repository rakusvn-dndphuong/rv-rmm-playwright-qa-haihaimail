import { Page, Locator, expect } from '@playwright/test';
import { LoginPage } from './LoginPage';


/**
 * HomePage — màn hình sau khi login thành công
 */

    export class HomePage extends LoginPage {
        private readonly successHeader: Locator;
        private readonly logoutButton: Locator;
        constructor(page: Page) {
            super(page);
            this.successHeader = page.locator('h1');
            this.logoutButton = page.locator('text=Log out');
      }

      /** Xác minh login thành công */

      async verifyLoginSuccess(): Promise<void> {
        await this.assertUrlContains('https://practicetestautomation.com/logged-in-successfully/');
        await this.assertElementText(this.successHeader, 'Logged In Successfully');
        await expect(this.logoutButton).toBeVisible();
    } 
}

      


