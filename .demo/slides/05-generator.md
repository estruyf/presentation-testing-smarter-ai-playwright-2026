---
layout: default
transition: slideLeft
---

# The Generator

*"Turn this spec into passing tests."*

**Input:** the Markdown plan from `specs/`

**What it does:**
- Opens the app with Playwright MCP tools
- Verifies every selector exists in the live DOM before writing an assertion
- Produces TypeScript using your fixtures and page objects
- Runs each generated file immediately — fixes any issues before finishing

**Key point:** tests pass on the **first run** because the Generator verified selectors live.

```typescript
// Generated output — live-verified locators
await page.getByTestId("doc-title").fill("Q1 Compliance Report");
await page.getByTestId("doc-category").selectOption("legal");
await page.getByTestId("btn-submit-form").click();
```

