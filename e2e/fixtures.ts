import { test as base, type Page } from "@playwright/test";

/** Pages start with the cookie notice answered and the dashboard tour done, so neither covers the page */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => {
      localStorage.setItem("cookie_consent", "all");
      localStorage.setItem("dashboard_tour", "done");
    });
    await use(page);
  },
});

export { expect } from "@playwright/test";

/** A signed-in session, as the login form would leave it */
export async function signIn(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem(
      "demo_session",
      JSON.stringify({ name: "Alex", email: "alex@example.com", createdAt: "2026-01-01T00:00:00.000Z" }),
    );
  });
}
