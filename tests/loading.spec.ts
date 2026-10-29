import { test, expect } from "@playwright/test";

test("a failed initial application download keeps a visible reload screen", async ({ page }) => {
  await page.route("**/index.tsx", (route) => route.abort());
  await page.goto("/?v=old#/shop");
  await expect(page.getByRole("link", { name: "Reload store", exact: true })).toBeVisible();
  await expect(page.locator(".store-boot")).toBeVisible();
  await page.unroute("**/index.tsx");
  await page.getByRole("link", { name: "Reload store", exact: true }).click();
  await expect(page).toHaveURL(/\?reload=\d+#\/shop$/);
  await expect(page.getByRole("heading", { name: "Shop the collection." })).toBeVisible();
});

test("failed route downloads preserve navigation and can recover", async ({ page }) => {
  await page.route("**/components/ShopPages.tsx*", (route) => route.abort());
  await page.goto("/#/shop");
  await expect(page.getByRole("heading", { name: "This page couldn’t load." })).toBeVisible();
  await expect(page.locator(".store-header")).toBeVisible();
  await page.getByRole("link", { name: "Back to home", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Good things, from the mountains." })).toBeVisible();
  await page.unroute("**/components/ShopPages.tsx*");
  await page.reload();
  await page.getByRole("link", { name: "Shop the collection", exact: true }).first().click();
  await expect(page.getByRole("heading", { name: "Shop the collection." })).toBeVisible();
});

test("browsers without newer dialog and media APIs still open the store and bag", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(HTMLDialogElement.prototype, "showModal", { value: undefined, configurable: true });
    Object.defineProperty(HTMLDialogElement.prototype, "close", { value: undefined, configurable: true });
    const original = window.matchMedia.bind(window);
    window.matchMedia = (query) => {
      const preference = original(query);
      Object.defineProperty(preference, "addEventListener", { value: undefined, configurable: true });
      return preference;
    };
    Object.defineProperty(window, "IntersectionObserver", { value: undefined, configurable: true });
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Good things, from the mountains." })).toBeVisible();
  await page.getByRole("button", { name: "Open bag, 0 items" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("button", { name: "Close bag", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Open bag, 0 items" })).toBeFocused();
});
