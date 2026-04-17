---
layout: default
transition: slideLeft
---


# Pre-authenticated sessions

Log in once. Every test reuses the session.

```typescript
// auth.setup.ts — runs once before the whole suite
setup("authenticate as submitter (Alex Chen)", async ({ page }) => {
  await page.goto("/");
  await page.locator(".user-tile[data-user='alex']").click();
  await expect(page.locator("#app-screen")).toBeVisible();

  await page.context().storageState({ path: STORAGE_STATE_SUBMITTER });
});
```

```typescript
// playwright.config.ts — switch persona with one line
test.use({ storageState: STORAGE_STATE_APPROVER });
```

**Benefits:** no login page overhead, no auth flakiness, instant persona switching

