/* global document, getComputedStyle */
import process from "node:process";
import { fileURLToPath, pathToFileURL, URL } from "node:url";
import { resolve } from "node:path";
const { chromium } = await import(
  process.env.STRATA_PLAYWRIGHT_MODULE
    ? pathToFileURL(resolve(process.env.STRATA_PLAYWRIGHT_MODULE)).href
    : "playwright-core"
);
import { writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
const dest = fileURLToPath(new URL("./proposals", import.meta.url));
const origin = process.env.STRATA_REVIEW_ORIGIN ?? "http://127.0.0.1:3257";
const browser = await chromium.launch({
  executablePath: process.env.STRATA_CHROMIUM_EXECUTABLE,
  headless: true,
});
const results = [];
for (const width of [320, 375, 768, 1024, 1440])
  for (const route of ["index", "home", "laboratory"]) {
    const page = await browser.newPage({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    const errors = [],
      assets = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("response", (r) => {
      if (r.status() >= 400) assets.push([r.url(), r.status()]);
    });
    const response = await page.goto(`${origin}/strata-015/${route}.html`, {
      waitUntil: "networkidle",
    });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(response.status(), 200);
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth),
      width,
    );
    await page.keyboard.press("Tab");
    assert.equal(
      await page
        .locator(".skip")
        .evaluate((el) => el === document.activeElement),
      true,
    );
    await page.keyboard.press("Enter");
    assert.equal(
      await page
        .locator("main")
        .evaluate((el) => el === document.activeElement),
      true,
    );
    if (route === "home") {
      const menu = page.locator(".instrument-menu");
      await menu.locator("summary").focus();
      await menu.locator("summary").press("Enter");
      assert.notEqual(await menu.getAttribute("open"), null);
      assert.equal(await menu.getByRole("link").count(), 6);
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth),
        width,
      );
      await page.screenshot({
        path: `${dest}/navigation-${width}.jpg`,
        quality: 85,
        type: "jpeg",
      });
      await menu.locator("summary").press("Enter");
      assert.equal(await menu.getAttribute("open"), null);
    }
    if (route === "laboratory") {
      for (const name of [
        "Plate Reconstruction",
        "Regional Marine Evidence",
        "Open Questions",
        "Platform-to-Basin Transect",
      ]) {
        const b = page.getByRole("button", { name, exact: true });
        await b.focus();
        await b.press("Enter");
        assert.equal(await b.getAttribute("aria-pressed"), "true");
        assert.equal(
          await b.evaluate((el) => getComputedStyle(el).transitionDuration),
          "0s",
        );
        assert.equal(
          await b.evaluate((el) => el.matches(":focus-visible")),
          true,
        );
      }
      assert.equal(
        await page
          .getByText("111 Ma within published age bracket", { exact: true })
          .isVisible(),
        true,
      );
      const details = page.locator("details");
      const summary = details.locator("summary");
      await summary.focus();
      await summary.press("Space");
      assert.equal(await details.getAttribute("open"), null);
      await summary.press("Enter");
      assert.notEqual(await details.getAttribute("open"), null);
      await page.emulateMedia({ reducedMotion: "no-preference" });
      assert.notEqual(
        await page
          .locator("button")
          .first()
          .evaluate((el) => getComputedStyle(el).transitionDuration),
        "0s",
      );
      await page.emulateMedia({ reducedMotion: "reduce" });
    }
    await page.evaluate(() => document.activeElement.blur());
    await page.screenshot({
      path: `${dest}/${route}-${width}.jpg`,
      quality: 82,
      type: "jpeg",
      fullPage: true,
    });
    if (route === "index" && width === 1440)
      await page
        .locator("section")
        .nth(1)
        .screenshot({
          path: dest + "/logo-concepts.jpg",
          type: "jpeg",
          quality: 95,
        });
    assert.deepEqual(errors, []);
    assert.deepEqual(assets, []);
    results.push({
      route,
      width,
      status: 200,
      overflow: false,
      keyboard: true,
      reducedMotion: route === "laboratory" ? "checked" : "emulated",
      consoleErrors: errors,
      brokenAssets: assets,
    });
    await page.close();
  }
await writeFile(
  dest + "/results.json",
  JSON.stringify(
    {
      capturedAt: new Date().toISOString(),
      browser: browser.version(),
      results,
    },
    null,
    2,
  ),
);
await browser.close();
process.stdout.write(
  "15 responsive proposal captures passed; no overflow, broken assets or console errors; keyboard and reduced-motion checks passed.\n",
);
