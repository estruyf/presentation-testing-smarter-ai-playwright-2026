import { defineConfig, devices } from "@playwright/test";
import path from "path";

export const STORAGE_STATE_SUBMITTER = path.join(__dirname, ".auth/submitter.json");
export const STORAGE_STATE_APPROVER = path.join(__dirname, ".auth/approver.json");

export default defineConfig({
  timeout: 5000,
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html", { open: "never" }],
    ["json", { outputFile: "test-results/results.json" }],
    ["list"],
  ],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },
  projects: [
    // Setup: create auth sessions for both personas
    {
      name: "auth-setup",
      testMatch: /auth\.setup\.ts/,
    },

    // Main test suite (depends on auth being done)
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: STORAGE_STATE_SUBMITTER,
      },
      dependencies: ["auth-setup"],
      testIgnore: /auth\.setup\.ts/,
    },
  ],
  webServer: {
    command: "npx serve apps/approval-portal -l 3000",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
