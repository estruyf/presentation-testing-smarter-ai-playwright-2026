import { test as base, expect, Page } from "@playwright/test";

// --- Page Object: Login page ---
export class LoginPage {
  constructor(readonly page: Page) {}

  async loginAs(user: "alex" | "morgan") {
    await this.page.goto("/");
    await this.page
      .locator(`.user-tile[data-user="${user}"]`)
      .click();
    await expect(this.page.locator("#app-screen")).toBeVisible();
  }
}

// --- Page Object: Dashboard ---
export class DashboardPage {
  constructor(readonly page: Page) {}

  get pendingStat() {
    return this.page.getByTestId("stat-pending");
  }
  get approvedStat() {
    return this.page.getByTestId("stat-approved");
  }
  get rejectedStat() {
    return this.page.getByTestId("stat-rejected");
  }
  get documentRows() {
    return this.page.getByTestId("document-row");
  }
  get emptyState() {
    return this.page.getByTestId("empty-state");
  }
  get searchInput() {
    return this.page.getByTestId("search-input");
  }

  async filterBy(status: "all" | "pending" | "approved" | "rejected") {
    await this.page.locator(`.tab[data-filter="${status}"]`).click();
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }

  async clickReview(docTitle: string) {
    const row = this.page
      .getByTestId("document-row")
      .filter({ hasText: docTitle });
    await row.getByTestId("btn-review").click();
  }
}

// --- Page Object: Submit form ---
export class SubmitForm {
  constructor(readonly page: Page) {}

  async open() {
    await this.page.getByRole("button", { name: "+ Submit document" }).click();
  }

  async fill(opts: {
    title: string;
    category: string;
    description?: string;
    priority?: "low" | "normal" | "high";
  }) {
    const modal = this.page.getByRole("dialog", { name: "Submit document for approval" });
    await modal.getByTestId("doc-title").fill(opts.title);
    await modal.getByTestId("doc-category").selectOption(opts.category);
    if (opts.description) {
      await modal.getByTestId("doc-description").fill(opts.description);
    }
    if (opts.priority && opts.priority !== "normal") {
      await modal.locator(`input[name="priority"][value="${opts.priority}"]`).check();
    }
  }

  async submit() {
    const modal = this.page.getByRole("dialog", { name: "Submit document for approval" });
    await modal.getByTestId("btn-submit-form").click();
  }
}

// --- Page Object: Review modal ---
export class ReviewModal {
  constructor(readonly page: Page) {}

  get title() {
    return this.page.getByTestId("review-title");
  }
  get status() {
    return this.page.getByTestId("review-status");
  }

  async addComment(comment: string) {
    await this.page.getByTestId("review-comment").fill(comment);
  }

  async approve() {
    await this.page.getByTestId("btn-approve").click();
  }

  async reject() {
    await this.page.getByTestId("btn-reject").click();
  }
}

// --- Custom fixtures ---
type CustomFixtures = {
  loginPage: LoginPage;
  dashboard: DashboardPage;
  submitForm: SubmitForm;
  reviewModal: ReviewModal;
};

export const test = base.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboard: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  submitForm: async ({ page }, use) => {
    await use(new SubmitForm(page));
  },
  reviewModal: async ({ page }, use) => {
    await use(new ReviewModal(page));
  },
});

export { expect };
