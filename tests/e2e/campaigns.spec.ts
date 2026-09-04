import { test, expect } from "@playwright/test";

test.describe("Campaigns page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "admin@example.com");
    await page.fill('input[type="password"]', "test-only-password-not-for-production");
    await page.click('button[type="submit"]');
    await page.waitForURL("/", { timeout: 30000 });
  });

  test("campaigns page loads for Northstar", async ({ page }) => {
    await page.goto("/client/northstar/campaigns");
    await expect(page.locator("h1")).toContainText("Campanas");
  });

  test("campaign table has sortable columns", async ({ page }) => {
    await page.goto("/client/northstar/campaigns");
    await expect(page.getByRole("button", { name: /Gasto/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /ROAS/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /CTR/ })).toBeVisible();
  });

  test("campaigns show active campaign count", async ({ page }) => {
    await page.goto("/client/northstar/campaigns");
    await expect(page.getByText(/campanas activas/).first()).toBeVisible();
  });
});
