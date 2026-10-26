import { test, expect } from "@playwright/test";

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`ingredient hero plays without controls on ${viewport.name}`, async ({ page }, testInfo) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    const hero = page.locator(".hero");
    const video = hero.locator("video");
    await expect(video).toHaveAttribute("data-playing", "true");
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => ({
      playing: !element.paused,
      muted: element.muted,
      loop: element.loop,
      inline: element.playsInline,
      controls: element.controls,
      width: element.videoWidth,
    }))).toEqual({ playing: true, muted: true, loop: true, inline: true, controls: false, width: 1280 });
    const start = await video.evaluate((element: HTMLVideoElement) => element.currentTime);
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeGreaterThan(start + 0.2);
    await expect(hero.getByRole("button")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "A little closer to the source." })).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.waitForTimeout(1800);
    await page.screenshot({ path: testInfo.outputPath(`hero-video-${viewport.name}.png`) });

    // Cross the end of the actual file to confirm that playback loops.
    await video.evaluate((element: HTMLVideoElement) => { element.currentTime = element.duration - 0.15; });
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime)).toBeLessThan(1);
    await expect.poll(() => video.evaluate((element: HTMLVideoElement) => !element.paused)).toBe(true);

    if (viewport.name === "desktop") {
      await page.evaluate(() => window.scrollTo(0, innerHeight * 2));
      await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.paused)).toBe(true);
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect.poll(() => video.evaluate((element: HTMLVideoElement) => !element.paused)).toBe(true);
      await expect(hero).toBeInViewport({ ratio: 0.99 });
    }
    await hero.getByRole("link", { name: "Explore the collection", exact: true }).click();
    await expect(page.getByRole("heading", { name: "A taste of somewhere special." })).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("reduced motion uses the still without downloading video and responds to changes", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const videoRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("hero-apricot-almond.mp4")) videoRequests.push(request.url());
  });
  await page.goto("/");
  const poster = page.locator(".hero-media-visual img");
  await expect.poll(() => poster.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth === 1280)).toBe(true);
  await expect(page.locator(".hero video")).toHaveCount(0);
  await page.screenshot({ path: testInfo.outputPath("hero-video-reduced-motion.png") });
  expect(videoRequests).toEqual([]);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator(".hero video")).toHaveAttribute("data-playing", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".hero video")).toHaveCount(0);
  await expect(poster).toBeVisible();
});

test("a failed video leaves a usable hero with its poster", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.route("**/videos/hero-apricot-almond.mp4", (route) => route.abort());
  await page.goto("/");
  const video = page.locator(".hero video");
  await expect(video).toHaveCSS("opacity", "0");
  await expect.poll(() => page.locator(".hero-media-visual img").evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  await page.getByRole("link", { name: "Explore the collection", exact: true }).click();
  await expect(page.getByRole("heading", { name: "A taste of somewhere special." })).toBeVisible();
});
