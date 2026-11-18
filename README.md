# rv-rmm-playwright-qa-haihaimail

End-to-end tests for RMM (配配メール / Haihai Mail), built on Playwright and TypeScript with a page-object model.

Two suites run on **two different environments**:

| Suite             | Project        | Specs                 | Env file            | Data                     |
| ----------------- | -------------- | --------------------- | ------------------- | ------------------------ |
| Important test    | `important`    | `tests/important/`    | `.env.important`    | `src/data/important/`    |
| All Function test | `all-function` | `tests/all-function/` | `.env.all-function` | `src/data/all-function/` |

Page objects, components and fixtures are shared by both suites. Environment, accounts and precondition data are
per suite.

## Requirements

- Node.js 20 or newer
- Network access to both test hosts
- An account per suite. **Read the lockout warning in `.env.example` before the first run.**

## Setup

```bash
npm install
npx playwright install chromium   # only if the browser is not cached yet
```

Then, for each suite (`important`, `all-function`):

1. Fill `BASE_URL` in `.env.<suite>` — `https://<host>/<tenant>/`, with the tenant path and a trailing slash.
2. Create the data files from the examples and fill them in:

   ```bash
   cp src/data/<suite>/users.example.json         src/data/<suite>/users.json
   cp src/data/<suite>/preconditions.example.json src/data/<suite>/preconditions.json
   ```

   `users.json` is a list of accounts keyed by `role`. The setup project logs in as `admin`.

All of these files are git-ignored; only the `*.example.json` files and `.env.example` are committed.

## Running

```bash
npm run test:important      # Important test
npm run test:all-function   # All Function test
npm test                    # both
npm run test:ui             # Playwright UI mode
npm run test:debug          # step through with the inspector
npm run report              # open the last HTML report

npm run typecheck
npm run lint
npm run format
```

Each suite has its own `setup-<suite>` project that logs in once and saves the session to
`playwright/.auth/<suite>.json`; the suite's tests depend on it, so it runs first and workers never touch the
login form.

`workers` is 1 because the app keeps its double-submit token in the tenant session. To run the two suites side
by side, use two terminals — they target different environments.

## Layout

```
src/
  config/env.ts        suite list, per-suite BASE_URL, storage-state path, actionUrl()
  data/                getUser(suite, role), getPreconditions(suite) + <suite>/*.example.json
  fixtures/            the `test` and `expect` every spec imports; TestOptions (suite, runId)
  pages/               page objects — locators and actions, no assertions
    <feature>/<screen>.page.ts
  components/          reusable chrome (global nav)
  utils/               small shared helpers
tests/
  setup/auth.setup.ts  logs in once per suite
  important/           Important test specs, one folder per feature
  all-function/        All Function test specs, one folder per feature
```

Path aliases (`tsconfig.json`): `@pages/*`, `@components/*`, `@fixtures/*`, `@data/*`, `@config/*`, `@utils/*`.

Rules for writing page objects and specs are in [CONTRIBUTING.md](./CONTRIBUTING.md); the short version for an
agent is in [CLAUDE.md](./CLAUDE.md).

## Things about this app that shape the tests

- **Every refusal is an HTTP 200.** A dead session, a misspelt action and rate limiting all render an ordinary
  page. `BasePage.assertLanded` names which one happened.
- **The app rate-limits.** Hit it hard enough and it answers 「問題が発生したようです。」. A read waits once and
  retries; a submit never does.
- **Submit buttons raise dialogs.** A JS confirm plus an armed beforeunload prompt; use `clickThroughDialogs`.
- **The admin UI ships no `data-testid`.** Roles, labels and the template's stable `name` attributes are what we
  have.
- **Routing is `index.php?action=<X>`.** Go straight to an action with `gotoAction` instead of clicking menus.
