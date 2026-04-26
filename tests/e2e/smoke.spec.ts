import { test, expect } from "@playwright/test";

test("homepage loads with title", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/BJL Studios/);
});

test("hero section visible", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toContainText("Mönchengladbach");
});

test("all key sections present", async ({ page }) => {
  await page.goto("/");
  for (const id of ["leistungen", "prozess", "team", "kontakt", "faq"]) {
    const el = page.locator(`#${id}`);
    await expect(el).toBeAttached();
  }
});

test("legal pages reachable", async ({ page }) => {
  await page.goto("/impressum.html");
  await expect(page).toHaveTitle(/Impressum/);
  await page.goto("/datenschutz.html");
  await expect(page).toHaveTitle(/Datenschutz/);
});

test("contact form has honeypot", async ({ page }) => {
  await page.goto("/");
  const honeypot = page.locator('input[name="website"]');
  await expect(honeypot).toHaveCount(1);
});

test("sitemap and robots are served", async ({ page }) => {
  const sitemap = await page.request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const robots = await page.request.get("/robots.txt");
  expect(robots.status()).toBe(200);
});

test("local Tailwind CSS is loaded (no CDN)", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const cdnHits = requests.filter((u) => u.includes("cdn.tailwindcss.com") || u.includes("fonts.googleapis.com"));
  expect(cdnHits).toEqual([]);
});

test("structured data JSON-LD parses", async ({ page }) => {
  await page.goto("/");
  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  for (const s of schemas) {
    expect(() => JSON.parse(s)).not.toThrow();
  }
});
