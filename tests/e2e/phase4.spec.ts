import { test, expect } from "@playwright/test";

// Login helper — reuse auth pattern from playwright config env vars
async function login(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.fill('input[type="email"]', "admin@example.com");
  await page.fill('input[type="password"]', "test-only-password-not-for-production");
  await page.click('button[type="submit"]');
  await page.waitForURL("/", { timeout: 30000 });
}

test.describe("Campaign Creation Wizard", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("loads with wizard step 1", async ({ page }) => {
    await page.goto("/campaigns/new");
    await expect(page.getByTestId("step-1").last()).toBeVisible();
    await expect(page.getByText("Configuracion de Campana")).toBeVisible();
  });

  test("can navigate between wizard steps", async ({ page }) => {
    await page.goto("/campaigns/new");

    // Step 1 visible
    await expect(page.getByTestId("step-1")).toBeVisible();

    // Go to step 2
    await page.getByTestId("next-button").click();
    await expect(page.getByTestId("step-2")).toBeVisible();

    // Click next on step 2 triggers copy generation (loading state)
    await page.getByTestId("next-button").click();

    // Wait for copies to finish generating (they appear after loading)
    await page.waitForTimeout(3000);

    // Now that copies are generated, click next again to go to step 3
    await page.getByTestId("next-button").click();
    await expect(page.getByTestId("step-3")).toBeVisible({ timeout: 5000 });

    // Go to step 4
    await page.getByTestId("next-button").click();
    await expect(page.getByTestId("step-4")).toBeVisible({ timeout: 5000 });

    // Verify launch button is present
    await expect(page.getByTestId("launch-button")).toBeVisible();
  });
});

test.describe("AI Copilot", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("loads with welcome message", async ({ page }) => {
    await page.goto("/copilot");
    await expect(page.getByTestId("chat-messages").first()).toBeVisible();
    await expect(
      page.getByRole("main").getByText("Hola Operator! Soy tu copilot de AdPilot")
    ).toBeVisible();
  });

  test("can type a message and see a response", async ({ page }) => {
    await page.goto("/copilot");

    // Type a message
    const input = page.getByTestId("chat-input");
    await input.fill("¿Como esta Northstar?");
    await page.getByTestId("send-button").click();

    // The community build keeps external AI disabled by default. The UI should
    // still surface the API response as a second, explicit assistant message.
    const aiMessages = page.getByTestId("ai-message");
    await expect(aiMessages).toHaveCount(2);
  });
});

test.describe("Budget Optimizer", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("loads with recommendation cards", async ({ page }) => {
    await page.goto("/optimize");
    await expect(
      page.getByRole("heading", { name: "Optimizador de Presupuesto" })
    ).toBeVisible();
    await expect(
      page.getByRole("main").getByTestId("recommendation-cards")
    ).toBeVisible();

    // Should have 5 recommendation cards
    const cards = page.getByRole("main").getByTestId("recommendation-card");
    await expect(cards).toHaveCount(5);
  });

  test("recommendation cards have approve/reject buttons", async ({
    page,
  }) => {
    await page.goto("/optimize");

    // Check that first card has action buttons
    const approveButtons = page.getByTestId("approve-button");
    const rejectButtons = page.getByTestId("reject-button");

    await expect(approveButtons.first()).toBeVisible();
    await expect(rejectButtons.first()).toBeVisible();

    // Click approve on first card
    await approveButtons.first().click();

    // Verify the card status changed
    await expect(page.getByText("Aprobado").first()).toBeVisible();
  });
});
