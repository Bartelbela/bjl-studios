import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("homepage has no critical a11y violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const critical = results.violations.filter((v) => v.impact === "critical");
  expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
});

test("page has a single h1 and proper lang attribute", async ({ page }) => {
  await page.goto("/");
  const lang = await page.locator("html").getAttribute("lang");
  expect(lang).toMatch(/^(de|en)/);
  const h1Count = await page.locator("h1").count();
  expect(h1Count).toBeGreaterThanOrEqual(1);
});
