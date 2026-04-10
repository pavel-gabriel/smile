# tests/

All test files live here.

## Structure

Mirror the `src/` directory structure where possible:

```
tests/
  unit/           # Pure unit tests — no I/O, no network
  integration/    # Tests that involve DB, filesystem, or internal service calls
  e2e/            # End-to-end tests via browser or HTTP client
  fixtures/       # Shared test data, mocks, factories
  helpers/        # Shared test utilities
```

## Conventions

- Test files are named `*.test.ts` (or `.js`, `.py`, etc. depending on stack).
- Each test file mirrors a source file: `src/services/auth.ts` → `tests/unit/services/auth.test.ts`.
- Integration tests should use a separate test database or isolated environment — never the dev or prod database.
- E2E tests should be runnable in CI without manual setup.

## Running tests

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# All tests
npm run test:all
```

_Update these commands to match the actual project's test runner._

## Expectations per Claude Code session

- Every new feature task must include tests.
- Every bug fix should include a regression test.
- Do not mark a task complete if related tests are failing.
- If test coverage drops, flag it — do not silently leave gaps.
