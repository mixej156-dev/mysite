import { expect, test } from "./fixtures";

test("the old converter address opens Swap", async ({ page }) => {
  await page.goto("/tools/converter");
  await expect(page).toHaveURL(/\/swap$/);
});

test("swap: choose what to receive, review and confirm", async ({ page }) => {
  await page.goto("/swap");
  await page.getByLabel("You pay").fill("2");
  await page.getByRole("button", { name: /Asset to receive/ }).click();
  await page.getByRole("dialog", { name: "Receive" }).getByRole("button", { name: /SOL/ }).click();
  await expect(page.locator("output[aria-label='You receive']")).not.toHaveText("0");

  await page.getByRole("button", { name: "Review swap" }).click();
  const review = page.getByRole("dialog", { name: "Review swap" });
  await expect(review).toContainText("2 ETH");
  await expect(review).toContainText("SOL");
  await review.getByRole("button", { name: "Confirm swap" }).click();
  await expect(page.getByRole("dialog", { name: "Swap submitted" })).toBeVisible();
});

test("swap: an amount that can't cover the fees can't be reviewed", async ({ page }) => {
  await page.goto("/swap");
  await page.getByLabel("You pay").fill("0.0000001");
  await expect(page.getByText("This amount doesn’t cover the fees.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Swap unavailable" })).toBeDisabled();
});
