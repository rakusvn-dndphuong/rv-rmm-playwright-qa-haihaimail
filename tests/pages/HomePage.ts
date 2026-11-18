import { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly heroHeading: Locator = this.page.getByRole('heading', { level: 1 });

  async goto(): Promise<void> {
    await this.navigate('/');
  }
}
