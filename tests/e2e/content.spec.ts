import { test, expect } from "@playwright/test";

test.describe("Content Calendar page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "admin@example.com");
    await page.fill('input[type="password"]', "test-only-password-not-for-production");
    await page.click('button[type="submit"]');
    await page.waitForURL("/", { timeout: 30000 });
    await page.goto("/content");
    await page.waitForLoadState("networkidle");
  });

  test("shows Calendario de Contenido heading", async ({ page }) => {
    const main = page.locator("main");
    await expect(main.locator("h1")).toContainText("Calendario de Contenido");
  });

  test("calendar grid shows day columns", async ({ page }) => {
    await expect(page.getByText("Lun")).toBeVisible();
    await expect(page.getByText("Mar").first()).toBeVisible();
    await expect(page.getByText("Mie")).toBeVisible();
    await expect(page.getByText("Jue")).toBeVisible();
    await expect(page.getByText("Vie")).toBeVisible();
    await expect(page.getByText("Sab")).toBeVisible();
    await expect(page.getByText("Dom")).toBeVisible();
  });

  test("content cards are visible with platform badges", async ({ page }) => {
    // Check for platform badges
    await expect(page.getByText("Instagram").first()).toBeVisible();
    await expect(page.getByText("Facebook").first()).toBeVisible();
  });

  test("content cards display status chips", async ({ page }) => {
    await expect(page.getByText("Publicado").first()).toBeVisible();
  });

  test("client filter tabs are visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Todos" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Northstar" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Aurora" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Atlas" })).toBeVisible();
  });

  test("AI content generator section is visible", async ({ page }) => {
    await expect(
      page.getByText("Generar Contenido con IA")
    ).toBeVisible();
    await expect(page.getByText("Generar").first()).toBeVisible();
  });

  test("organic metrics sidebar is visible", async ({ page }) => {
    await expect(
      page.getByText("Metricas de Contenido Organico")
    ).toBeVisible();
  });

  test("page content has no NaN or undefined values", async ({ page }) => {
    await page.waitForTimeout(500);
    const content = await page.locator("main").textContent();
    expect(content).not.toContain("NaN");
    expect(content).not.toContain("undefined");
  });
});
