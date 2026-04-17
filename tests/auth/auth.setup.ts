/**
 * Auth setup — runs once before the main test suite.
 *
 * Creates two reusable session files:
 *   .auth/submitter.json  (Alex Chen — submitter role)
 *   .auth/approver.json   (Morgan Lee — approver role)
 *
 * Demo talking point:
 *   Rather than logging in at the start of every test, we authenticate
 *   once, save the session to disk, and reuse it across the entire suite.
 *   Zero login pages = faster tests + no flakiness from auth flows.
 */

import { test as setup, expect } from "@playwright/test";
import { STORAGE_STATE_SUBMITTER, STORAGE_STATE_APPROVER } from "../../playwright.config";
import path from "path";
import fs from "fs";

// Ensure .auth directory exists
const authDir = path.join(process.cwd(), ".auth");
if (!fs.existsSync(authDir)) fs.mkdirSync(authDir);

setup("authenticate as submitter (Alex Chen)", async ({ page }) => {
  await page.goto("/");
  await page.locator(".user-tile[data-user='alex']").click();
  await expect(page.locator("#app-screen")).toBeVisible();

  // Persist the session state
  await page.context().storageState({ path: STORAGE_STATE_SUBMITTER });
});

setup("authenticate as approver (Morgan Lee)", async ({ page }) => {
  await page.goto("/");
  await page.locator(".user-tile[data-user='morgan']").click();
  await expect(page.locator("#app-screen")).toBeVisible();

  await page.context().storageState({ path: STORAGE_STATE_APPROVER });
});
