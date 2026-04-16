# Healer prompt (copy into Copilot Chat — Agent Mode)

> Switch to **Agent Mode** in Copilot Chat before running this.
> Select the **healer** agent from the agent picker.

---

```
@healer Fix the failing tests in tests/approval/broken-for-healer.spec.ts

Run the tests first to see the exact failures.
Then inspect the live app to find the correct current selectors.
Patch only the broken locators — do not change test logic or assertions.
Re-run after patching to confirm everything passes.
```

---

## What the Healer will do

1. Run `tests/approval/broken-for-healer.spec.ts` with trace enabled
2. Read the error messages — which locators failed?
3. Open `http://localhost:3000` with Playwright MCP tools
4. Navigate to the relevant screen and inspect the accessibility snapshot
5. Find the current selector for the same element
6. Patch the test file — only the broken lines
7. Re-run to confirm green

## The broken locators in this file

| What it was | What it should be |
|---|---|
| `getByRole("button", { name: "New request" })` | `getByRole("button", { name: "+ Submit document" })` |
| `page.locator(".submit-modal")` | `page.getByRole("heading", { name: "Submit document for approval" })` |
| `page.locator("#doc-name")` | `page.getByTestId("doc-title")` |
| `page.locator("#doc-type")` | `page.getByTestId("doc-category")` |
| `page.locator(".submit-btn")` | `page.getByTestId("btn-submit-form")` |

> These are revealed to the audience **after** the Healer runs — not before.
