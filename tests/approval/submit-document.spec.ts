/**
 * Approval workflow tests
 *
 * Covers the full submit → review cycle for the Approval Portal.
 * Pre-authenticated as Alex (submitter) via storageState from auth setup.
 */

import { test, expect } from "../fixtures";

test.describe("document submission", () => {
  test("submitter can open the submit form", async ({ page, submitForm }) => {
    await page.goto("/");
    await submitForm.open();

    const modal = page.getByRole("dialog", { name: "Submit document for approval" });
    await expect(
      page.getByRole("heading", { name: "Submit document for approval" })
    ).toBeVisible();
    await expect(modal.getByTestId("doc-title")).toBeVisible();
    await expect(modal.getByTestId("doc-category")).toBeVisible();
  });

  test("submitter can submit a new document", async ({
    page,
    submitForm,
    dashboard,
  }) => {
    await page.goto("/");

    const statBefore = await dashboard.pendingStat.textContent();
    const countBefore = parseInt(statBefore || "0", 10);

    await submitForm.open();
    await submitForm.fill({
      title: "Annual Security Audit Report",
      category: "operations",
      description: "Summary of the annual security audit findings.",
      priority: "high",
    });
    await submitForm.submit();

    // Modal closes
    await expect(
      page.getByRole("heading", { name: "Submit document for approval" })
    ).not.toBeVisible();

    // Stats updated
    const statAfter = await dashboard.pendingStat.textContent();
    expect(parseInt(statAfter || "0", 10)).toBe(countBefore + 1);

    // Document appears in list
    await expect(
      page.getByTestId("document-row").filter({ hasText: "Annual Security Audit Report" })
    ).toBeVisible();
  });

  test("submit form requires a title", async ({ page, submitForm }) => {
    await page.goto("/");
    await submitForm.open();

    const modal = page.getByRole("dialog", { name: "Submit document for approval" });
    // Try submitting without a title
    await modal.getByTestId("btn-submit-form").click();
    await expect(modal.getByTestId("doc-title")).toBeFocused();
  });

  test("submitted document shows as pending", async ({ page, submitForm, dashboard }) => {
    await page.goto("/");
    await submitForm.open();
    await submitForm.fill({ title: "Test Pending Document", category: "hr" });
    await submitForm.submit();

    const row = page.getByTestId("document-row").filter({ hasText: "Test Pending Document" });
    await expect(row.getByTestId("doc-status")).toHaveText("pending");
  });
});

test.describe("document filtering and search", () => {
  test("filter tabs change visible documents", async ({ page, dashboard }) => {
    await page.goto("/");

    await dashboard.filterBy("approved");
    const rows = await dashboard.documentRows.all();
    for (const row of rows) {
      await expect(row.getByTestId("doc-status")).toHaveText("approved");
    }
  });

  test("search filters documents by title", async ({ page, dashboard }) => {
    await page.goto("/");

    await dashboard.search("Budget");
    const rows = await dashboard.documentRows.all();
    expect(rows.length).toBeGreaterThan(0);

    for (const row of rows) {
      const title = await row.getByTestId("doc-title").textContent();
      expect(title?.toLowerCase()).toContain("budget");
    }
  });

  test("empty state shows when no results match search", async ({
    page,
    dashboard,
  }) => {
    await page.goto("/");
    await dashboard.search("xyznonexistentdoc12345");
    await expect(dashboard.emptyState).toBeVisible();
  });
});
