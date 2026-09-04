import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "admin@example.com");
    await page.fill('input[type="password"]', "test-only-password-not-for-production");
    await page.click('button[type="submit"]');
    await page.waitForURL("/", { timeout: 30000 });
  });

  test("top nav links navigate to client pages", async ({ page }) => {
    // Navigate via Clientes page
    await page.click('a[href="/clients"]');
    await expect(page).toHaveURL(/\/clients/);

    await page.click('a[href="/client/northstar"]');
    await expect(page).toHaveURL(/\/client\/northstar/);
    await expect(page.locator("main h1")).toContainText("Northstar");
  });

  test("top nav Panel General link returns to home", async ({ page }) => {
    await page.goto("/client/northstar");
    await page.click('a[href="/"]');
    await expect(page).toHaveURL("/");
    await expect(page.locator("main h1")).toContainText("Panel General");
  });

  test("top nav Reportes link works", async ({ page }) => {
    await page.click('a[href="/reports"]');
    await expect(page).toHaveURL(/\/reports/);
    await expect(page.locator("main h1")).toContainText("Reporte Comparativo WoW");
  });
});

test.describe("Login", () => {
  test("redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("shows error on wrong credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "wrong@email.com");
    await page.fill('input[type="password"]', "wrongpass");
    await page.click('button[type="submit"]');
    await expect(page.getByText("Credenciales incorrectas")).toBeVisible();
  });

  test("login page shows AdPilot Elite brand", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("AdPilot Elite")).toBeVisible();
  });
});
