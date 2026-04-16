/**
 * Review and approval tests
 *
 * Covers the approver workflow: opening pending documents,
 * approving, and rejecting.
 *
 * Note: This suite uses the approver storage state (Morgan Lee).
 * To run with the approver session, pass:
 *   --project=chromium and ensure playwright.config has the approver project.
 *
 * Demo talking point:
 *   We switch persona simply by pointing to a different storageState file.
 *   No login code in the tests themselves.
 */

import { test, expect } from "../fixtures";
import { STORAGE_STATE_APPROVER } from "../../playwright.config";

// Override storageState for this test file
test.use({ storageState: STORAGE_STATE_APPROVER });

test.describe("review workflow (approver)", () => {
  test("approver sees pending documents with review button", async ({
    page,
  }) => {
    await page.goto("/");

    const pendingRow = page
      .getByTestId("document-row")
      .filter({ has: page.getByTestId("btn-review") })
      .first();

    await expect(pendingRow).toBeVisible();
    await expect(pendingRow.getByTestId("doc-status")).toHaveText("pending");
  });

  test("approver can open review modal for a pending document", async ({
    page,
    dashboard,
    reviewModal,
  }) => {
    await page.goto("/");
    await dashboard.clickReview("Q4 Budget Report");

    await expect(
      page.getByRole("heading", { name: "Review document" })
    ).toBeVisible();
    await expect(reviewModal.title).toHaveText("Q4 Budget Report");
    await expect(reviewModal.status).toHaveText("pending");

    // Action buttons visible
    await expect(page.getByTestId("btn-approve")).toBeVisible();
    await expect(page.getByTestId("btn-reject")).toBeVisible();
  });

  test("approver can approve a document", async ({
    page,
    dashboard,
    reviewModal,
  }) => {
    await page.goto("/");
    await dashboard.clickReview("Remote Work Policy Update");

    await reviewModal.addComment("Looks good, aligns with new company strategy.");
    await reviewModal.approve();

    // Modal closes
    await expect(
      page.getByRole("heading", { name: "Review document" })
    ).not.toBeVisible();

    // Document status updated in list
    const row = page
      .getByTestId("document-row")
      .filter({ hasText: "Remote Work Policy Update" });
    await expect(row.getByTestId("doc-status")).toHaveText("approved");
  });

  test("approver can reject a document with a comment", async ({
    page,
    dashboard,
    reviewModal,
  }) => {
    await page.goto("/");
    await dashboard.clickReview("Q4 Budget Report");

    await reviewModal.addComment("Needs CFO sign-off before approval.");
    await reviewModal.reject();

    const row = page
      .getByTestId("document-row")
      .filter({ hasText: "Q4 Budget Report" });
    await expect(row.getByTestId("doc-status")).toHaveText("rejected");
  });

  test("approved stats counter increments after approval", async ({
    page,
    dashboard,
    reviewModal,
  }) => {
    await page.goto("/");

    const before = parseInt(
      (await dashboard.approvedStat.textContent()) || "0",
      10
    );

    await dashboard.clickReview("Remote Work Policy Update");
    await reviewModal.approve();

    const after = parseInt(
      (await dashboard.approvedStat.textContent()) || "0",
      10
    );
    expect(after).toBe(before + 1);
  });
});
