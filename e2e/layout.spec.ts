import { expect, signIn, test } from "./fixtures";

/* No page may scroll sideways on a 375 px phone */
const PUBLIC = [
  "/",
  "/staking",
  "/staking/eth",
  "/portfolio",
  "/swap",
  "/tools",
  "/tools/calculator",
  "/tools/compare",
  "/validators",
  "/fees",
  "/learn",
  "/about",
  "/team",
  "/security",
  "/blog",
  "/docs",
  "/faq",
  "/contact",
  "/login",
  "/register",
];
const DASHBOARD = [
  "/dashboard",
  "/dashboard/stake",
  "/dashboard/positions",
  "/dashboard/wallet",
  "/dashboard/settings",
];

test.use({ viewport: { width: 375, height: 812 } });

async function expectNoSideScroll(page: import("@playwright/test").Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

for (const path of PUBLIC) {
  test(`no horizontal scroll at 375: ${path}`, async ({ page }) => {
    await page.goto(path, { waitUntil: "networkidle" });
    await expectNoSideScroll(page);
  });
}

for (const path of DASHBOARD) {
  test(`no horizontal scroll at 375: ${path}`, async ({ page }) => {
    await signIn(page);
    await page.goto(path, { waitUntil: "networkidle" });
    await expect(page.locator("main")).toBeVisible();
    await expectNoSideScroll(page);
  });
}
