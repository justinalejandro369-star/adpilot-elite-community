import { test, expect } from "@playwright/test";

test.describe("Client detail page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "admin@example.com");
    await page.fill('input[type="password"]', "test-only-password-not-for-production");
    await page.click('button[type="submit"]');
    await page.waitForURL("/", { timeout: 30000 });
  });

  test("Northstar page loads with MXN currency", async ({ page }) => {
    await page.goto("/client/northstar");
    const main = page.locator("main");
    await expect(main.locator("h1")).toContainText("Northstar");
    await expect(main.getByText("MXN").first()).toBeVisible();
  });

  test("Atlas page loads with USD currency", async ({ page }) => {
    await page.goto("/client/atlas");
    const main = page.locator("main");
    await expect(main.locator("h1")).toContainText("Atlas");
    await expect(main.getByText("USD").first()).toBeVisible();
  });

  test("shows metric cards on client page", async ({ page }) => {
    await page.goto("/client/northstar");
    const main = page.locator("main");
    await expect(main.getByText("Gasto").first()).toBeVisible();
    await expect(main.getByText("ROAS").first()).toBeVisible();
  });

  test("tabs work on client page", async ({ page }) => {
    await page.goto("/client/northstar");
    // Tabs are now custom buttons
    await expect(page.getByRole("button", { name: "Tendencias" })).toBeVisible();
    await page.getByText("Campanas").first().click();
    // After clicking Campanas tab, the campaign table should be visible
    await expect(page.getByRole("button", { name: /Gasto/ })).toBeVisible();
  });

  test("no NaN values on client page", async ({ page }) => {
    await page.goto("/client/aurora");
    await page.waitForTimeout(500);
    const content = await page.locator("main").textContent();
    expect(content).not.toContain("NaN");
  });
});
