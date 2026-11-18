import type { Suite } from '@config/env';

/**
 * Options passed from `playwright.config.ts` down into tests.
 *
 * Kept apart from `fixtures/index.ts` so the config file can import the type without pulling in
 * the whole page-object tree.
 */
export type TestOptions = {
  /** Which suite (and therefore which environment) this project runs. Set per project. */
  suite: Suite;

  /**
   * Identifier for one run, computed once in the main process and handed to every worker. Used as
   * a prefix for generated test data so two runs never step on each other.
   */
  runId: string;
};
