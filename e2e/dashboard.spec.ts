import { expect, signIn, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await signIn(page);
});

test("stake: pick a pool and an amount, confirm, and the position is added", async ({ page }) => {
  await page.goto("/dashboard/stake");
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem("demo_portfolio") ?? "null"));
  const form = page.getByRole("form", { name: "New stake" });
  await form.getByRole("radio").first().check({ force: true });
  await form.getByLabel("Amount to stake").fill("1");
  await form.getByRole("checkbox").click();
  await form.getByRole("button", { name: "Review stake" }).click();

  const dialog = page.getByRole("dialog", { name: "Confirm stake" });
  await dialog.getByRole("button", { name: /^Stake / }).click();
  await expect(dialog).toBeHidden();

  const after = await page.evaluate(() => JSON.parse(localStorage.getItem("demo_portfolio") ?? "null"));
  const count = (s: { positions: unknown[] } | null) => s?.positions.length ?? 0;
  expect(after).not.toBeNull();
  expect(count(after)).toBeGreaterThan(count(before) || 0);
  expect(after.activity[0].type).toBe("stake");
});

test("withdraw: send funds to an address and see the pending transfer", async ({ page }) => {
  await page.goto("/dashboard/wallet");
  await page.getByRole("button", { name: "Withdraw" }).first().click();

  const dialog = page.getByRole("dialog", { name: "Withdraw" });
  await dialog.getByLabel("Amount").fill("0.1");
  await dialog.getByLabel("Withdrawal address").fill("0x52908400098527886e0f7030069857d2e4169ee7");
  await dialog.getByLabel("Two-factor code").fill("123456");
  await dialog.getByRole("button", { name: "Withdraw" }).click();
  await expect(dialog).toBeHidden();

  const state = await page.evaluate(() => JSON.parse(localStorage.getItem("demo_portfolio") ?? "null"));
  expect(state.activity[0]).toMatchObject({ type: "withdraw", ticker: "ETH", amount: 0.1, status: "pending" });
});
