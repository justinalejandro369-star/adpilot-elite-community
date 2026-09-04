import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // NextAuth's credentials flow writes session cookies; serial execution keeps
  // authentication tests deterministic locally and in CI.
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
    env: {
      DATA_SOURCE: "mock",
      NEXTAUTH_SECRET: "test-only-nextauth-secret-not-for-production",
      NEXTAUTH_URL: "http://localhost:3000",
      ADMIN_EMAIL: "admin@example.com",
      ADMIN_PASSWORD: "test-only-password-not-for-production",
      ENABLE_PUBLIC_PORTALS: "true",
    },
  },
});
