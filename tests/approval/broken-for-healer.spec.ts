/**
 * DEMO: Broken test for the Healer agent demo
 *
 * This test was written against the "old" version of the approval portal
 * where the submit button was labelled "New request" instead of
 * "+ Submit document".
 *
 * Use this file to demonstrate the Healer agent:
 *   1. Run the tests — they fail
 *   2. Ask the Healer: "Fix the failing tests in tests/approval/broken-for-healer.spec.ts"
 *   3. Watch the agent replay the failing steps, inspect the current DOM,
 *      and patch the locators automatically
 *   4. Run again — green
 *
 * The Healer will find that:
 *   - "New request" → "+ Submit document"
 *   - ".submit-btn" → [data-testid="btn-submit-form"]
 *   - "#doc-name" → [data-testid="doc-title"]
 */

import { test, expect } from "../fixtures";

test.describe("submit flow (broken — for healer demo)", () => {
  test("submitter can open the new request form", async ({ page }) => {
    await page.goto("/");

    // OLD locator — button was renamed in the latest UI update
    await page.getByRole("button", { name: "New request" }).click();

    await expect(page.locator(".submit-modal")).toBeVisible();
  });

  test("submitter can fill and send a request", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "New request" }).click();

    // OLD selectors from a previous version of the form
    await page.locator("#doc-name").fill("Broken Test Document");
    await page.locator("#doc-type").selectOption("finance");
    await page.locator(".submit-btn").click();

    await expect(
      page.getByTestId("document-row").filter({ hasText: "Broken Test Document" })
    ).toBeVisible();
  });
});
