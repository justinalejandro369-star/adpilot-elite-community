import { test, expect } from "@playwright/test";

// Login helper
async function login(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.fill('input[type="email"]', "admin@example.com");
  await page.fill('input[type="password"]', "test-only-password-not-for-production");
  await page.click('button[type="submit"]');
  await page.waitForURL("/", { timeout: 20000 });
}

test.describe("Attribution Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("loads with correct heading", async ({ page }) => {
    await page.goto("/attribution");
    await expect(
      page.getByRole("heading", { name: "Atribucion y Rentabilidad" })
    ).toBeVisible();
  });

  test("funnel visualization is visible", async ({ page }) => {
    await page.goto("/attribution");
    await expect(
      page.getByRole("heading", { name: "Embudo de Conversion" })
    ).toBeVisible();
    // First funnel step
    await expect(page.getByRole("main").getByText("Ad Click")).toBeVisible();
    // Last funnel step
    await expect(page.getByRole("main").getByText("Upsell")).toBeVisible();
  });

  test("platform revenue cards are visible", async ({ page }) => {
    await page.goto("/attribution");
    await expect(page.getByText("Hotmart").first()).toBeVisible();
    await expect(page.getByText("Skool").first()).toBeVisible();
    await expect(page.getByText("Go High Level").first()).toBeVisible();
  });

  test("ROAS Real section is visible", async ({ page }) => {
    await page.goto("/attribution");
    await expect(page.getByText("ROAS Real").first()).toBeVisible();
  });

  test("multi-touch attribution table is visible", async ({ page }) => {
    await page.goto("/attribution");
    await expect(
      page.getByText("Atribucion Multi-Toque")
    ).toBeVisible();
    await expect(
      page.getByText("Secuencia de Contacto")
    ).toBeVisible();
    await expect(
      page.getByText("Anuncio Frio → Retargeting → Compra")
    ).toBeVisible();
  });
});

test.describe("Client Portal (no auth)", () => {
  test("loads without authentication", async ({ page }) => {
    await page.goto("/portal/northstar");
    await expect(page.getByText("Northstar")).toBeVisible();
    await expect(
      page.getByText("Tu Resumen de Inversion")
    ).toBeVisible();
  });

  test("shows the main multiplier text", async ({ page }) => {
    await page.goto("/portal/northstar");
    await expect(
      page.getByText("Por cada $1 que inviertes")
    ).toBeVisible();
  });

  test("shows revenue numbers without NaN", async ({ page }) => {
    await page.goto("/portal/northstar");
    // Check that the invested number is visible and not NaN
    const invested = page.getByText("$39,854");
    await expect(invested).toBeVisible();
    // Check generated
    const generated = page.getByText("$176,361");
    await expect(generated).toBeVisible();
    // Ensure no NaN anywhere
    const body = await page.textContent("body");
    expect(body).not.toContain("NaN");
  });

  test("Quiero Invertir Mas button is visible", async ({ page }) => {
    await page.goto("/portal/northstar");
    const button = page.getByTestId("invest-more-button");
    await expect(button).toBeVisible();

    // Click it and check scaling proposal appears
    await button.click();
    await expect(
      page.getByText("Propuesta de Escalamiento")
    ).toBeVisible();
  });
});
