import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const homeTitle = "Good things, from the mountains.";
const shopTitle = "Shop the collection.";

async function expectHeaderVisible(page: Page) {
  const header = page.locator(".store-header");
  await expect(header).toBeVisible();
  await expect.poll(() => header.evaluate((element) => {
    const box = element.getBoundingClientRect();
    return box.top >= -1 && box.bottom <= innerHeight;
  })).toBe(true);
  await expect(header.getByRole("link", { name: "Skardu Organic home" })).toBeVisible();
  await expect(header.getByRole("button", { name: /Open bag/ })).toBeVisible();
}

async function expectNoOverflow(page: Page) {
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

test("storefront, filters, product sizes, cart persistence and order draft", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: homeTitle })).toBeVisible();
  await expect(page.getByRole("heading", { name: "The everyday collection" })).toBeVisible();
  await expect(page.locator(".product-card")).toHaveCount(4);
  await expect(page.locator(".product-card").first()).toContainText("Rs.");
  await expect(page.locator(".store-header .official-logo img")).toHaveAttribute("src", /brand\/official-logo\.png$/);
  await page.locator("main img").evaluateAll((elements) => elements.forEach((element) => (element as HTMLImageElement).loading = "eager"));
  await expect.poll(() => page.locator("main img").evaluateAll((elements) => elements.filter((element) => !(element as HTMLImageElement).complete || !(element as HTMLImageElement).naturalWidth).length)).toBe(0);
  await page.screenshot({ path: testInfo.outputPath("desktop-storefront.png"), fullPage: true });
  await page.getByRole("link", { name: "Shop the collection", exact: true }).first().click();
  await expect(page.getByRole("heading", { name: shopTitle })).toBeVisible();
  await page.getByRole("searchbox", { name: "Search products" }).fill("apricot");
  await expect(page.locator(".product-card")).toHaveCount(2);
  await page.getByRole("searchbox", { name: "Search products" }).fill("no-such-fruit");
  await expect(page.getByText("No matches this time.")).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator(".product-card")).toHaveCount(5);
  await page.getByRole("button", { name: "Oils", exact: true }).click();
  await expect(page.locator(".product-card")).toHaveCount(1);
  await page.getByRole("button", { name: "All", exact: true }).click();
  await page.getByLabel("Sort by").selectOption("low");
  await expect(page.locator(".product-card").first()).toContainText("Dried apricots");
  await page.getByRole("combobox", { name: "Price", exact: true }).selectOption("1500");
  await expect(page.locator(".product-card")).toHaveCount(2);
  await page.goto("/#/product/1");
  await expect(page.getByRole("heading", { name: "Shilajit resin", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "10 g", exact: true }).click();
  await expect(page).toHaveURL(/product\/1b/);
  await expect(page.locator(".detail-price")).toContainText("1,900");
  await page.goto("/#/product/2");
  await page.getByRole("button", { name: "Zoom product image" }).click();
  await expect(page.locator(".detail-image")).toHaveClass(/zoomed/);
  await page.getByRole("button", { name: "Increase Apricot kernel oil" }).click();
  await page.getByRole("button", { name: "Add to bag", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".cart-bottom")).toContainText("2,400");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Open bag, 2 items" }).click();
  await expect(page.locator(".cart-bottom")).toContainText("2,400");
  await page.getByRole("dialog").getByRole("button", { name: "Decrease Apricot kernel oil" }).click();
  await expect(page.locator(".cart-bottom")).toContainText("1,200");
  await page.getByRole("link", { name: "Review order draft" }).click();
  await expect(page.getByRole("heading", { name: "Review your draft." })).toBeVisible();
  await page.getByLabel("Full name").fill("Preview Tester");
  await page.getByLabel("Email", { exact: true }).fill("preview@example.com");
  await page.getByLabel("Phone number").fill("03001234567");
  await page.getByLabel("City", { exact: true }).fill("Skardu");
  await page.getByLabel("Street address").fill("Sample address for local QA only");
  await page.getByRole("button", { name: "Save order draft" }).click();
  await expect(page.getByRole("heading", { name: "Your draft is ready." })).toBeVisible();
  await expect(page.getByText(/This is not an order confirmation/)).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("skardu-order-draft") || "null").status)).toBe("draft-only");
  await page.getByRole("button", { name: "Delete this draft" }).click();
  expect(await page.evaluate(() => localStorage.getItem("skardu-order-draft"))).toBeNull();
  await page.getByRole("button", { name: "Open bag, 1 items" }).click();
  await page.getByRole("button", { name: "Remove Apricot kernel oil", exact: true }).click();
  await expect(page.getByText("A little room for good things.")).toBeVisible();
  expect(errors).toEqual([]);
});

test("header category links, search and homepage quick add work", async ({ page }) => {
  await page.goto("/");
  const navigation = page.getByRole("navigation", { name: "Main navigation" });
  for (const [label, count] of [["Dry fruits", 2], ["Apricot oil", 1], ["Shilajit", 2]] as const) {
    await navigation.getByRole("link", { name: label, exact: true }).click();
    await expect(page.getByRole("heading", { name: shopTitle })).toBeVisible();
    await expect(page.locator(".product-card")).toHaveCount(count);
    await expect(navigation.getByRole("link", { name: label, exact: true })).toHaveAttribute("aria-current", "page");
  }
  await page.getByRole("button", { name: "Oils", exact: true }).click();
  await expect(navigation.getByRole("link", { name: "Apricot oil", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(navigation.locator('a[aria-current="page"]')).toHaveCount(1);
  await page.getByRole("combobox", { name: "Price", exact: true }).selectOption("2000");
  await page.getByLabel("Sort by").selectOption("name");
  await navigation.getByRole("link", { name: "Dry fruits", exact: true }).click();
  await expect(page.getByRole("combobox", { name: "Price", exact: true })).toHaveValue("2000");
  await expect(page.getByLabel("Sort by")).toHaveValue("name");
  await expect(page.locator(".product-card")).toHaveCount(2);
  await expect(navigation.getByRole("link", { name: "Dry fruits", exact: true })).toHaveAttribute("aria-current", "page");
  await page.getByRole("searchbox", { name: "Search products" }).fill("apricot");
  await expect(page.getByRole("searchbox", { name: "Search the store" })).toHaveValue("apricot");
  await page.getByRole("searchbox", { name: "Search the store" }).fill("almond");
  await page.getByRole("button", { name: "Submit search", exact: true }).click();
  await expect(page.locator(".product-card")).toHaveCount(1);
  await expect(page.locator(".product-card")).toContainText("Whole almonds");
  await expect(navigation.getByRole("link", { name: "Shop all", exact: true })).toHaveAttribute("aria-current", "page");
  await page.setViewportSize({ width: 320, height: 740 });
  await page.getByRole("link", { name: "Skardu Organic home" }).first().click();
  await page.getByRole("button", { name: "Add Dried apricots 500 g to bag" }).click();
  const notification = page.locator(".cart-announcement > span");
  await expect(notification).toBeVisible();
  await expect(notification).toContainText("Dried apricots");
  await expect.poll(() => notification.evaluate((element) => {
    const box = element.getBoundingClientRect();
    return box.left >= 0 && box.right <= innerWidth && box.top >= 0 && box.bottom <= innerHeight;
  })).toBe(true);
  await page.getByRole("button", { name: "Dismiss bag notification" }).click();
  await expect(notification).toHaveCount(0);
  await page.getByRole("button", { name: "Open bag, 1 items" }).click();
  await expect(page.locator(".cart-items")).toContainText("Dried apricots");
  await expect(page.locator(".cart-bottom")).toContainText("950");
});

test("accessible commerce controls and the narrative moved to Our story", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: homeTitle })).toBeVisible();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "A little closer to the source." })).toHaveCount(0);
  for (const [route, name] of [["/", "home"], ["/#/product/2", "product"]]) {
    await page.goto(route);
    await expect(page.locator("main h1")).toBeVisible();
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    await testInfo.attach(`accessibility-${name}.json`, { body: JSON.stringify(results.violations, null, 2), contentType: "application/json" });
    expect(results.violations).toEqual([]);
  }
  await page.goto("/#/about");
  await expect(page.getByRole("heading", { name: "A little closer to the source." })).toBeVisible();
  await expect(page.locator(".brand-story")).toBeVisible();
  await expect(page.getByRole("heading", { name: "One fruit. A whole new story." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "High mountains. Deep roots." })).toBeVisible();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  const images = page.locator("main img");
  await images.evaluateAll((elements) => elements.forEach((element) => (element as HTMLImageElement).loading = "eager"));
  await expect.poll(() => images.evaluateAll((elements) => elements.filter((element) => !(element as HTMLImageElement).complete || !(element as HTMLImageElement).naturalWidth).length)).toBe(0);
  await expectNoOverflow(page);
});

test("responsive storefront, shop, product and story keep navigation visible", async ({ page }, testInfo) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const viewport of [
    { width: 320, height: 740 },
    { width: 360, height: 740 }, { width: 390, height: 844 },
    { width: 768, height: 1024 }, { width: 1024, height: 768 },
    { width: 844, height: 390 },
    { width: 1440, height: 900 }, { width: 1920, height: 1080 },
  ]) {
    await page.setViewportSize(viewport);
    for (const route of ["/", "/#/shop", "/#/product/2", "/#/about"]) {
      await page.goto(route);
      await expect(page.locator("main h1")).toBeVisible();
      await expectHeaderVisible(page);
      await expectNoOverflow(page);
      if (route === "/#/product/2" && viewport.width <= 800) {
        const gallery = await page.locator(".product-detail > div").first().boundingBox();
        const details = await page.locator(".detail-copy").boundingBox();
        expect(gallery).not.toBeNull();
        expect(details).not.toBeNull();
        expect(gallery!.width).toBeGreaterThan(viewport.width * 0.8);
        expect(details!.width).toBeGreaterThan(viewport.width * 0.8);
        expect(details!.y).toBeGreaterThanOrEqual(gallery!.y + gallery!.height);
      }
      await page.evaluate(() => window.scrollTo(0, 1000));
      await expectHeaderVisible(page);
      await expectNoOverflow(page);
    }
    if (viewport.width === 390) {
      await page.goto("/");
      await page.screenshot({ path: testInfo.outputPath("mobile-storefront.png"), fullPage: true });
    }
    if (viewport.width <= 1024) {
      await page.goto("/");
      await page.getByRole("button", { name: "Open menu" }).click();
      const navigation = page.getByRole("navigation", { name: "Mobile navigation" });
      await expect(navigation).toBeVisible();
      await expectNoOverflow(page);
      await page.getByRole("button", { name: "Close menu" }).click();
      await expect(navigation).not.toBeVisible();
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.keyboard.press("Escape");
      await expect(navigation).not.toBeVisible();
      await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
      await page.getByRole("button", { name: "Open menu" }).click();
      await navigation.getByRole("link", { name: "Shop all", exact: true }).click();
      await expect(page.getByRole("heading", { name: shopTitle })).toBeVisible();
      await expect(navigation).not.toBeVisible();
    }
    const searchToggle = page.getByRole("button", { name: "Search the collection" });
    if (await searchToggle.isVisible()) await searchToggle.click();
    await page.getByRole("searchbox", { name: "Search the store" }).fill("apricot");
    await page.getByRole("button", { name: "Submit search", exact: true }).click();
    await expect(page.locator(".product-card")).toHaveCount(2);
    await expectNoOverflow(page);
  }
});

test("mobile cart focus, direct routes and invalid storage remain safe", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => localStorage.setItem("skardu-cart-v2", JSON.stringify([
    { id: "2", quantity: -5 }, { id: "missing", quantity: 5 }, { id: "1", quantity: 100000 },
  ])));
  await page.goto("/");
  await page.getByRole("button", { name: "Open bag, 15 items" }).click();
  await page.keyboard.press("Tab");
  expect(await page.evaluate(() => document.activeElement?.closest("dialog") !== null)).toBeTruthy();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  for (const route of ["contact", "shipping", "privacy", "terms", "journal", "missing-page"]) {
    await page.goto(`/#/${route}`);
    await expect(page.locator("main h1")).toBeVisible();
    await expectHeaderVisible(page);
    await expectNoOverflow(page);
  }
});
