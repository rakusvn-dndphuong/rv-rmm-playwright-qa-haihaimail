# rv-rmm-playwright-qa-haihaimail — agent router

Short on purpose. Detail lives in `README.md` (setup, layout) and `CONTRIBUTING.md` (how to write tests); read
them when the task needs them, not before.

## Overview

End-to-end suite for **RMM (配配メール / Haihai Mail)**, Playwright + TypeScript, page-object model. Two suites
on two different environments: **Important test** (`tests/important/`, project `important`) and **All Function
test** (`tests/all-function/`, project `all-function`). Pages, components and fixtures are shared; BASE_URL,
accounts and precondition data are per suite.

## Setup (first run)

```text
npm install
# fill BASE_URL in .env.important / .env.all-function
# copy src/data/<suite>/*.example.json to users.json / preconditions.json and fill them in
npx playwright install chromium
```

## Verification commands

```text
Lint/type  : npm run typecheck && npm run lint && npm run format:check
Run suite  : npm run test:important | npm run test:all-function
Run 1 spec : npx playwright test --project=<suite> tests/<suite>/<feature>/<File>.spec.ts
Debug      : npm run test:ui | npm run trace test-results/<dir>/trace.zip
```

## Hard constraints (MUST / MUST NOT)

- **MUST NOT invent a Japanese label.** Copy it from the live DOM or the product's `template/ja_JP/*.tpl`.
- **MUST route every submit through `clickThroughDialogs`** (the app's buttons raise a confirm and arm a
  beforeunload prompt; a plain click cancels the navigation).
- **MUST import `test` / `expect` from `@fixtures/index`**, never from `@playwright/test`, in specs.
- **MUST NOT put `expect` in a page object**, and **MUST NOT use `force: true` or `waitForTimeout`**.
- **MUST NOT hardcode a URL or an account.** Use `baseURL`, `getUser(suite, role)`, `getPreconditions(suite)`.
- **MUST NOT import a spec from the other suite.**
- **MUST namespace created data** with `dataNamespace` and clean it up even when the test fails; restore
  tenant-wide settings in a `finally`.
- **MUST NOT assert a batched counter** (display counts, reaction counts) — they lag.
- **MUST NOT commit** `.env.*`, `src/data/*/users.json`, `src/data/*/preconditions.json`, or leave `.only`,
  `console.log`, `debugger` in a commit.
- **MUST NOT run against an environment without checking the account** — the app locks accounts after a few bad
  passwords, for hours.

## Things about this app that will surprise you

1. **Every refusal is an HTTP 200** — dead session, misspelt action and rate limiting all render an ordinary
   page. `BasePage.assertLanded` names which one happened.
2. **The app rate-limits** (「問題が発生したようです。」). A read waits once and retries; a submit does not.
3. **`workers: 1`** — one tenant session, one double-submit token.

## Definition of done

The spec passes **twice** against its suite's environment, the environment is back to its baseline,
`typecheck` + `lint` + `format:check` are green, and someone other than the author has reviewed it.
