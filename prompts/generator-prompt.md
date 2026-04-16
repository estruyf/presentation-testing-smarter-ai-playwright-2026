# Generator prompt (copy into Copilot Chat — Agent Mode)

> Switch to **Agent Mode** in Copilot Chat before running this.
> Select the **generator** agent from the agent picker.

---

```
@generator Generate Playwright tests from specs/approval-workflow.md

Use tests/seed.spec.ts as the style reference.
Import fixtures from tests/fixtures.ts — use the page object helpers where possible.

For the approver persona tests, add:
  import { STORAGE_STATE_APPROVER } from "../../playwright.config";
  test.use({ storageState: STORAGE_STATE_APPROVER });

Verify every selector live before writing it.
Run each generated test file after creating it to confirm it passes.

Output:
  tests/approval/submit-document.spec.ts
  tests/approval/review-document.spec.ts
  tests/approval/dashboard-filters.spec.ts
```

---

## What the Generator will do

1. Read `specs/approval-workflow.md` scenario by scenario
2. Open `http://localhost:3000` with Playwright MCP tools
3. Navigate to each screen and verify `data-testid` attributes exist
4. Write TypeScript test files using the project fixtures
5. Run each file immediately after writing it — fix any issues before moving on

## Locator strategy it follows

1. `getByTestId(...)` — primary (all testids are documented in the spec)
2. `getByRole(...)` — for buttons and interactive elements
3. `getByLabel(...)` — for form fields without testids
