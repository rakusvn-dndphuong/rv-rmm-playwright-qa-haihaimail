import {test} from '../fixtures/pages';
import { AppData } from '../common/AppData';

/**
 * Test case 1: Positive LogIn test
 */

test.describe('Positive Login Test', () => {
  test('Test case 1: Positive Login Test', async ({ loginPage, homePage }) => {
    // 1. Open login page
    await loginPage.openLoginPage();
    // 2. Perform login with valid username & password
    await loginPage.performLogin(AppData.login.VALID_USERNAME, AppData.login.VALID_PASSWORD);
    // 3. Verify URL contains '/logged-in-successfully/'
    // 4. Verify page contains expected text 'Logged In Successfully'
    await homePage.verifyLoginSuccess();
  });
});

test.describe('Negative Login Test', () => {
  test('Test case 2: Negative username test', async ({ loginPage}) => {
    // 1. Open login page  
    await loginPage.openLoginPage();
    // 2. Perform login with invalid username & valid password
    await loginPage.performLogin(AppData.login.INVALID_USERNAME, AppData.login.VALID_PASSWORD);
    // 3. Verify error message is displayed
    await loginPage.verifyInvalidUsernameError();
  });

  test('Test case 3: Negative password test', async ({ loginPage}) => {
    // 1. Open login page  
    await loginPage.openLoginPage();
    // 2. Perform login with valid username & invalid password
    await loginPage.performLogin(AppData.login.VALID_USERNAME, AppData.login.INVALID_PASSWORD);
    // 3. Verify error message is displayed
    await loginPage.verifyInvalidPasswordError();
  });
});

