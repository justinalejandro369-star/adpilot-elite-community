import { test, expect } from "@playwright/test";

test.describe("Briefing page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "admin@example.com");
    await page.fill('input[type="password"]', "test-only-password-not-for-production");
    await page.click('button[type="submit"]');
    await page.waitForURL("/", { timeout: 30000 });
    await page.goto("/briefing");
  });

  test("shows Briefing Diario heading", async ({ page }) => {
    const main = page.locator("main");
    await expect(main.locator("h1")).toContainText("Briefing Diario");
  });

  test("shows today's date in Spanish", async ({ page }) => {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
    ];
    const now = new Date();
    const currentMonth = months[now.getMonth()];
    await expect(page.getByText(currentMonth).first()).toBeVisible();
  });

  test("priority filter chips are visible", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Urgente/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Importante/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Informativo/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Todas/i })).toBeVisible();
  });

  test("news items with titles and priority badges are visible", async ({ page }) => {
    await expect(page.getByText("URGENTE").first()).toBeVisible();
    await expect(page.getByText("IMPORTANTE").first()).toBeVisible();
    await expect(page.getByText("INFORMATIVO").first()).toBeVisible();
    // Check a specific news title is present
    await expect(
      page.getByText("Meta actualiza el algoritmo").first()
    ).toBeVisible();
  });

  test("category section Meta Ads is visible", async ({ page }) => {
    await expect(
      page.getByText("Meta Ads y Facebook").first()
    ).toBeVisible();
  });

  test("weekly summary sidebar is visible", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Top 5 de la Semana" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Tendencia de la Semana" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Recurso Destacado" })).toBeVisible();
  });

  test("no NaN or undefined values on page", async ({ page }) => {
    await page.waitForTimeout(500);
    const content = await page.locator("main").textContent();
    expect(content).not.toContain("NaN");
    expect(content).not.toContain("undefined");
  });
});
