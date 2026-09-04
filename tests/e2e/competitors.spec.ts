import { test, expect } from "@playwright/test";

test.describe("Competitors page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "admin@example.com");
    await page.fill('input[type="password"]', "test-only-password-not-for-production");
    await page.click('button[type="submit"]');
    await page.waitForURL("/", { timeout: 30000 });
    await page.goto("/competitors");
    await page.waitForLoadState("networkidle");
  });

  test("shows Inteligencia Competitiva heading", async ({ page }) => {
    const main = page.locator("main");
    await expect(main.locator("h1")).toContainText("Inteligencia Competitiva");
  });

  test("displays weekly summary cards for each client", async ({ page }) => {
    await expect(page.getByText("Resumen Semanal")).toBeVisible();
    // Three client summary cards
    await expect(page.getByText("Northstar").first()).toBeVisible();
    await expect(page.getByText("Aurora").first()).toBeVisible();
    await expect(page.getByText("Atlas").first()).toBeVisible();
  });

  test("displays competitor ad cards with headline text", async ({ page }) => {
    await expect(page.getByText("Anuncios Recientes")).toBeVisible();
    // Check for specific ad headlines from mock data
    await expect(page.getByText("Tu dinero puede trabajar por ti").first()).toBeVisible();
    await expect(page.getByText("Copia a los mejores traders de Mexico").first()).toBeVisible();
  });

  test("displays AI recommendations section", async ({ page }) => {
    await expect(page.getByText("Recomendaciones AI")).toBeVisible();
  });

  test("displays format distribution section", async ({ page }) => {
    await expect(page.getByText("Formatos Dominantes")).toBeVisible();
  });

  test("shows active and stopped status chips", async ({ page }) => {
    await expect(page.getByText("Activo").first()).toBeVisible();
    await expect(page.getByText("Detenido").first()).toBeVisible();
  });

  test("page content has no NaN or undefined values", async ({ page }) => {
    await page.waitForTimeout(500);
    const content = await page.locator("main").textContent();
    expect(content).not.toContain("NaN");
    expect(content).not.toContain("undefined");
  });
});
