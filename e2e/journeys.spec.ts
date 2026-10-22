import { expect, test } from "./fixtures";

test("a new visitor who stakes from a pool page signs up and lands on the stake form for that pool", async ({
  page,
}) => {
  await page.goto("/staking/eth");
  await page.getByRole("link", { name: "Stake ETH" }).first().click();
  await expect(page).toHaveURL(/\/login\?next=/);

  await page.getByRole("link", { name: "Create an account" }).click();
  await expect(page).toHaveURL(/\/register\?next=/);
  const form = page.getByRole("form", { name: "Create an account" });
  await form.getByLabel("Full name").fill("Sam Lee");
  await form.getByLabel("Email").fill("sam@example.com");
  await form.getByLabel("Password", { exact: true }).fill("a-long-password");
  await form.getByRole("checkbox").click();
  await form.getByRole("button", { name: /Create account/ }).click();

  await expect(page).toHaveURL(/\/verify-email\?next=/);
  await page.getByLabel("Confirmation code").fill("123456");
  await expect(page).toHaveURL(/\/dashboard\/stake\?pool=eth$/);
});

test("the calculator hands its pool and amount to the stake form", async ({ page }) => {
  await page.goto("/tools/calculator");
  const stake = page.getByRole("link", { name: "Stake ETH" });
  await expect(stake).toHaveAttribute("href", "/dashboard/stake?pool=eth&amount=10");
  await expect(page.getByRole("link", { name: "View Ethereum pool" })).toHaveAttribute("href", "/staking/eth");
});

test("swapping into a staking asset points on to its pool", async ({ page }) => {
  await page.goto("/swap");
  await page.getByRole("button", { name: /Asset to receive/ }).click();
  await page.getByRole("dialog", { name: "Receive" }).getByRole("button", { name: /SOL/ }).click();
  await expect(page.getByRole("link", { name: /Stake SOL at est\./ })).toHaveAttribute("href", "/staking/sol");

  await page.getByRole("button", { name: "Review swap" }).click();
  await page.getByRole("dialog", { name: "Review swap" }).getByRole("button", { name: "Confirm swap" }).click();
  await expect(
    page.getByRole("dialog", { name: "Swap submitted" }).getByRole("link", { name: "Stake SOL" }),
  ).toHaveAttribute("href", "/staking/sol");
});
