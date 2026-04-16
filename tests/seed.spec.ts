/**
 * Seed test — used as the bootstrap context for Playwright Test Agents.
 *
 * The Planner agent runs this test first to:
 *  - Execute global setup (auth, fixtures, webServer)
 *  - Understand custom fixtures available in the suite
 *  - Use as a style example for all generated tests
 *
 * Keep this test minimal. It should navigate to the app and confirm
 * it renders, nothing more.
 */

import { test, expect } from "./fixtures";

test("seed — app loads and shows dashboard", async ({ page }) => {
  await page.goto("/");

  // App shows login screen when no session is active
  await expect(page.locator("#login-screen")).toBeVisible();

  // Both user tiles are present
  await expect(page.locator(".user-tile[data-user='alex']")).toBeVisible();
  await expect(page.locator(".user-tile[data-user='morgan']")).toBeVisible();
});
