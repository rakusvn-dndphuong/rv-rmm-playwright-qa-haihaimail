import { BasePage } from '@pages/base.page';

/** ホーム (`action=Home`), the screen right after login. */
export class HomePage extends BasePage {
  async goto(): Promise<void> {
    await this.gotoAction('Home');
  }
}
