import { expect, test } from "./fixtures";

test("the dashboard sends a signed-out visitor to the login page", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
});

test("any email and password log in and open the dashboard; logging out ends the session", async ({ page }) => {
  await page.goto("/login");
  const form = page.getByRole("form", { name: "Log in" });
  await form.getByLabel("Email").fill("sam@example.com");
  await form.getByLabel("Password", { exact: true }).fill("anything-123");
  await form.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.goto("/dashboard/settings");
  await page.getByRole("tab", { name: "Account" }).click();
  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).not.toHaveURL(/\/dashboard/);
  expect(await page.evaluate(() => localStorage.getItem("demo_session"))).toBeNull();
});
