import { test, expect } from '@playwright/test';

test('Positive Login test', async ({ page }) => {
  // 1. open page
  await page.goto('https://practicetestautomation.com/practice-test-login/');

  // 2. Type username and password
  await page.locator('#username').fill('student');
  await page.locator('#password').fill('Password123');

  // const usernameField = page.locator('#username');
  // await usernameField.click();
  // await usernameField.fill('student');

  // const passwordField = page.locator('#password');
  // await passwordField.click();
  // await passwordField.fill('Password123');

  // 3. Click on Submit button
  await page.locator('#submit').click();

  // 4. Assert new page URL contains '/logged-in-successfully/'
  const currentURL = page.url();
  expect(currentURL).toContain('practicetestautomation.com/logged-in-successfully');

  // 5. Assert new page contains expected text
  const successMessage = await page.locator('h1').textContent();
  expect(successMessage).toContain('Logged In Successfully');

  // 6. Assert that Log out button is visible on the new page
  const logoutButton = page.locator('text=Log out');
  await expect(logoutButton).toBeVisible();
  //await expect(page.locator('a[href="https://practicetestautomation.com/practice-test-login/"]')).toBeVisible();  

});

