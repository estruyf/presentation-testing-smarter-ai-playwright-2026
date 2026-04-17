import { test, expect } from "./fixtures";

test("seed — app loads and shows dashboard", async ({ page }) => {
  await page.goto("/");

  // App shows login screen when no session is active
  await expect(page.locator("#login-screen")).toBeVisible();

  // Both user tiles are present
  await expect(page.locator(".user-tile[data-user='alex']")).toBeVisible();
  await expect(page.locator(".user-tile[data-user='morgan']")).toBeVisible();
});
