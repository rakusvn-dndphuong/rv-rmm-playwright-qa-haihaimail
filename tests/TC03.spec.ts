import { test, expect } from '@playwright/test';

test('Negative password test', async ({ page }) => {
  // 1. open page
  await page.goto('https://practicetestautomation.com/practice-test-login/');

  // 2. Type valid username and invalid password
  await page.locator('#username').fill('student');
  await page.locator('#password').fill('incorrectPassword');

  // 3. Click on Submit button
  await page.locator('#submit').click();

  // 4. Assert error message is visible
  const errorMessage = page.locator('#error');
  await expect(errorMessage).toBeVisible();

  // 5. Assert error message text
  await expect(errorMessage).toHaveText('Your password is invalid!');
});
