import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "admin@example.com");
    await page.fill('input[type="password"]', "test-only-password-not-for-production");
    await page.click('button[type="submit"]');
    await page.waitForURL("/", { timeout: 30000 });
  });

  test("shows Panel General heading", async ({ page }) => {
    const main = page.locator("main");
    await expect(main.locator("h1")).toContainText("Panel General");
  });

  test("displays client links in summary table", async ({ page }) => {
    const main = page.locator("main");
    await expect(main.locator('a[href="/client/northstar"]').first()).toBeVisible();
    await expect(main.locator('a[href="/client/aurora"]').first()).toBeVisible();
    await expect(main.locator('a[href="/client/atlas"]').first()).toBeVisible();
  });

  test("displays global metric cards", async ({ page }) => {
    await expect(page.getByText("Inversion Total")).toBeVisible();
    await expect(page.getByText("ROAS Global")).toBeVisible();
    // "Ventas" and "Leads" appear in multiple places, use first()
    await expect(page.getByText("Ventas").first()).toBeVisible();
    await expect(page.getByText("Leads").first()).toBeVisible();
  });

  test("displays alerts panel", async ({ page }) => {
    await expect(page.getByText("Centro de Alertas AI")).toBeVisible();
  });

  test("metric values are not NaN", async ({ page }) => {
    await page.waitForTimeout(500);
    const content = await page.locator("main").textContent();
    expect(content).not.toContain("NaN");
    expect(content).not.toContain("undefined");
  });
});
