# Writing tests in this repo

Read this before your first pull request. It is short on purpose.

## Which suite

| Suite             | Folder                | Project        |
| ----------------- | --------------------- | -------------- |
| Important test    | `tests/important/`    | `important`    |
| All Function test | `tests/all-function/` | `all-function` |

- A spec lives in exactly one suite's folder. Never import one suite's spec from the other; shared logic goes
  into a page object or a helper.
- Pages, components and fixtures are shared. URLs, accounts and precondition data are not — never hardcode
  them. Navigation uses the project's `baseURL`, accounts come from `getUser(suite, role)`, preconditions from
  `getPreconditions(suite)`. The `suite` value comes from the `suite` fixture.

## Locators

Pick the first one that works, in this order:

1. `getByRole('button', { name: '登録' })`
2. `getByLabel('ログインID')`
3. `getByText('配信完了')`
4. `locator('#id')` or `locator('[name="max_appts_per_assignee"]')`
5. `nth()`, `first()`, CSS descent — last resort, and it needs a comment saying why

The admin UI ships no `data-testid`. Smarty templates give many stable `name` attributes; reaching for one is
fine when nothing above it fits.

**Never invent a Japanese label.** Copy it from the live DOM or from the product's `template/ja_JP/*.tpl`. A
label that "looks about right" is how a suite ends up green against a screen that does not exist.

## Page objects

```ts
export class AppointmentFormListPage extends BasePage {
  readonly commonSettingTab: Locator;

  constructor(page: Page) {
    super(page);
    this.commonSettingTab = page.locator('div.fw-tab-btn li:nth-of-type(3) > a');
  }

  async openCommonSetting(): Promise<void> {
    await this.commonSettingTab.click();
  }
}
```

- Live in `src/pages/<feature>/<screen>.page.ts`, class named `<Screen>Page`.
- Hold locators and actions. **No `expect` inside a page object** — assertions belong in specs, where a reader
  can see what the test claims. Predicates are not assertions, but prefer asserting on the locator in the spec.
- Extend `BasePage` for `page`, `main`, `gotoAction()` and `clickThroughDialogs()`. `LoginPage` is the one
  exception.
- Register every new page object in `src/fixtures/index.ts`.
- No `force: true` — ESLint will stop you. A control that needs it points at the wrong locator.
- Public methods get a JSDoc line when the behaviour is not obvious from the name.

### Navigating

Use `gotoAction('AppointmentFormList')` rather than clicking down menus. It retries a throttled read once and
fails loudly when the app turned you away.

### Submitting a form

Use `clickThroughDialogs(control)` for anything that submits. The app's buttons raise a JS confirm and leave a
beforeunload prompt armed; Playwright dismisses whatever nobody handles, so a plain `.click()` cancels the
navigation and the page just sits there looking like the click missed.

## Specs

```ts
import { expect, test } from '@fixtures/index';

test.describe('appointment common setting', () => {
  test('every field survives a save and can be put back', async ({ appointmentSetting }) => {
    // ...
  });
});
```

- Import `test` and `expect` from `@fixtures/index`, never from `@playwright/test`. That is what wires page
  objects, `suite` and `dataNamespace` into the test.
- Specs sit in `tests/<suite>/<feature>/`, named `<Feature>.<aspect>.spec.ts` — `smoke`, `flow`, `validation`,
  `error`.
- Test titles in English, one clear claim each.
- Authentication is a given. Do not write login steps; the setup project handles it.
- Do not pass `page` and build a page object by hand — take the fixture.

## Assertions

Only web-first assertions:

```ts
await expect(page.getByText('登録が完了しました')).toBeVisible(); // yes
expect(await page.getByText('登録が完了しました').isVisible()).toBe(true); // no
```

The second form reads the value once and never waits, which is how a passing test starts failing at random.
For values that arrive late — counters, batch results — use `expect.poll` with a generous timeout, or assert on
something observable immediately. `waitForTimeout` is banned and ESLint will stop you.

## Test data

Every worker shares one tenant account, so tests carve out their own space rather than their own login. Take the
`dataNamespace` fixture and prefix anything you create with it:

```ts
test('...', async ({ dataNamespace }) => {
  const name = `${dataNamespace}_form_01`;
});
```

- Only touch rows carrying your own prefix.
- Tenant-wide settings are borrowed, not owned: read the original, change it, and restore it in a `finally`, so
  a failed assertion cannot leave the environment changed.
- Anything that sweeps the whole tenant cannot run alongside other tests. Keep it in its own file and say so in a
  comment.
- Accounts and precondition data live in `src/data/<suite>/*.json` (git-ignored); commit only the
  `*.example.json` shape.

## Before you push

```bash
npm run typecheck && npm run lint && npm run format:check
```

Nothing reaches `main` without a second pair of eyes. A spec is not a test asset until someone other than its
author has approved it — hand-written or generated, and generated code needs the review more, not less.
