import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
test("desktop storefront, filters, product sizes, cart persistence and draft", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "A little closer to the source." }),
  ).toBeVisible();
  await page.waitForTimeout(1800);
  await page.screenshot({ path: "docs/qa/desktop-home.png", fullPage: false });
  await page
    .getByRole("link", { name: "Explore the collection", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("heading", { name: "A taste of somewhere special." }),
  ).toBeVisible();
  await page
    .getByRole("searchbox", { name: "Search products" })
    .fill("apricot");
  await expect(page.locator(".product-card")).toHaveCount(2);
  await page
    .getByRole("searchbox", { name: "Search products" })
    .fill("no-such-fruit");
  await expect(page.getByText("No matches this time.")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator(".product-card")).toHaveCount(5);
  await page.getByRole("button", { name: "Oils", exact: true }).click();
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page.getByRole("button", { name: "All", exact: true }).click();
  await page.getByLabel("Sort by").selectOption("low");
  await expect(page.locator(".product-card").first()).toContainText(
    "Dried apricots",
  );
  await page
    .getByRole("combobox", { name: "Price", exact: true })
    .selectOption("1500");
  await expect(page.locator(".product-card")).toHaveCount(2);
  await page.goto("/#/product/1");
  await expect(
    page.getByRole("heading", { name: "Shilajit resin", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "10 g", exact: true }).click();
  await expect(page).toHaveURL(/product\/1b/);
  await expect(page.locator(".detail-price")).toContainText("1,900");
  await page.goto("/#/product/2");
  await page.getByRole("button", { name: "Zoom product image" }).click();
  await expect(page.locator(".detail-image")).toHaveClass(/zoomed/);
  await page
    .getByRole("button", { name: "Increase Apricot kernel oil" })
    .click();
  await page.getByRole("button", { name: "Add to bag", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".cart-bottom")).toContainText("2,400");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Open bag, 2 items" }).click();
  await expect(page.locator(".cart-bottom")).toContainText("2,400");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Decrease Apricot kernel oil" })
    .click();
  await expect(page.locator(".cart-bottom")).toContainText("1,200");
  await page.getByRole("link", { name: "Review order draft" }).click();
  await expect(
    page.getByRole("heading", { name: "Review your draft." }),
  ).toBeVisible();
  await page.getByLabel("Full name").fill("Preview Tester");
  await page.getByLabel("Email", { exact: true }).fill("preview@example.com");
  await page.getByLabel("Phone number").fill("03001234567");
  await page.getByLabel("City", { exact: true }).fill("Skardu");
  await page
    .getByLabel("Street address")
    .fill("Sample address for local QA only");
  await page.getByRole("button", { name: "Save order draft" }).click();
  await expect(
    page.getByRole("heading", { name: "Your draft is ready." }),
  ).toBeVisible();
  await expect(
    page.getByText(/This is not an order confirmation/),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("skardu-order-draft") || "null").status,
    ),
  ).toBe("draft-only");
  await page.getByRole("button", { name: "Delete this draft" }).click();
  expect(
    await page.evaluate(() => localStorage.getItem("skardu-order-draft")),
  ).toBeNull();
  await page.getByRole("button", { name: "Open bag, 1 items" }).click();
  await page
    .getByRole("button", { name: "Remove Apricot kernel oil", exact: true })
    .click();
  await expect(page.getByText("A little room for good things.")).toBeVisible();
  expect(errors).toEqual([]);
});
test("desktop scroll timeline is reversible; imagery and accessibility", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForTimeout(1800);
  const story = page.locator(".story");
  const top = await story.evaluate(
    (el) => el.getBoundingClientRect().top + scrollY,
  );
  await page.evaluate((y) => window.scrollTo(0, y + 950), top);
  await page.waitForTimeout(1600);
  await expect(page.locator(".story-stepbar")).toBeVisible();
  const after = await page
    .locator(".story-bottle")
    .evaluate((el) => getComputedStyle(el).transform);
  await page.screenshot({ path: "docs/qa/desktop-story.png" });
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
  await page.evaluate((y) => window.scrollTo(0, y - 100), top);
  await page.waitForTimeout(1600);
  const before = await page
    .locator(".story-bottle")
    .evaluate((el) => getComputedStyle(el).transform);
  expect(before).not.toBe(after);
  await expect(page.locator(".story-grid")).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  await fs.writeFile(
    "docs/qa/accessibility-home.json",
    JSON.stringify(axe.violations, null, 2),
  );
  expect(axe.violations).toEqual([]);
  const broken = await page
    .locator("img")
    .evaluateAll((imgs) =>
      imgs
        .filter((i: any) => i.complete && i.naturalWidth === 0)
        .map((i: any) => i.src),
    );
  expect(broken).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
});
test("mobile navigation, cart focus, reduced motion, direct routes and invalid storage", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() =>
    localStorage.setItem(
      "skardu-cart-v2",
      JSON.stringify([
        { id: "2", quantity: -5 },
        { id: "missing", quantity: 5 },
        { id: "1", quantity: 100000 },
      ]),
    ),
  );
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Open bag, 15 items" }),
  ).toBeVisible();
  await page.screenshot({ path: "docs/qa/mobile-home.png", fullPage: true });
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "The collection" })
    .click();
  await expect(page).toHaveURL(/shop/);
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).not.toBeVisible();
  await page.screenshot({ path: "docs/qa/mobile-shop.png", fullPage: true });
  await page.getByRole("button", { name: "Open bag, 15 items" }).click();
  await page.keyboard.press("Tab");
  expect(
    await page.evaluate(
      () => document.activeElement?.closest("dialog") !== null,
    ),
  ).toBeTruthy();
  await page.keyboard.press("Escape");
  for (const route of [
    "about",
    "contact",
    "shipping",
    "privacy",
    "terms",
    "journal",
    "missing-page",
  ]) {
    await page.goto(`/#/${route}`);
    await expect(page.locator("main h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
  }
  await page.goto("/#/product/2");
  await page.screenshot({ path: "docs/qa/mobile-product.png", fullPage: true });
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  await fs.writeFile(
    "docs/qa/accessibility-product.json",
    JSON.stringify(results.violations, null, 2),
  );
  expect(results.violations).toEqual([]);
  await page.goto("/");
  await page.locator(".story").scrollIntoViewIfNeeded();
  await expect(page.locator(".story-stepbar")).toBeVisible();
  expect(await page.locator(".pin-spacer").count()).toBe(0);
});
