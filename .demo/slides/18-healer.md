---
layout: default
transition: slideLeft
---


# The Healer

*"Fix the broken test. Don't touch anything else."*

**Healing process:**
1. Runs the failing test with `--trace=on`
2. Reads the error — which locator failed, which line
3. Opens the live app with Playwright MCP tools
4. Inspects the current accessibility snapshot
5. Finds the element that serves the same semantic role
6. Patches only the broken locator — nothing else changes
7. Re-runs to confirm green

**Locator priority the Healer follows:**
`getByTestId` → `getByRole` → `getByLabel` → `getByText` → CSS (last resort)

> If the feature was removed, the Healer marks the test `test.skip()` with a comment.
> It won't silently delete a test.

