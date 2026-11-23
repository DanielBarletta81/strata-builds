/* global document, window */
import process from "node:process";
import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL, URL } from "node:url";
import { resolve } from "node:path";
const { chromium } = await import(
  process.env.STRATA_PLAYWRIGHT_MODULE
    ? pathToFileURL(resolve(process.env.STRATA_PLAYWRIGHT_MODULE)).href
    : "playwright-core"
);
const browser = await chromium.launch({
  executablePath: process.env.STRATA_CHROMIUM_EXECUTABLE,
  headless: true,
});
const origin = process.env.STRATA_REVIEW_ORIGIN ?? "http://127.0.0.1:3257";
const dest = fileURLToPath(new URL("./proposals/", import.meta.url));
const results = [];
for (const density of [1, 2])
  for (const width of [320, 375, 649, 768, 1440])
    for (const concept of ["e", "d"]) {
      const page = await browser.newPage({
        viewport: { width, height: 1000 },
        deviceScaleFactor: density,
        reducedMotion: "reduce",
      });
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });
      page.on("response", (r) => {
        if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
      });
      assert.equal(
        (
          await page.goto(`${origin}/strata-015/home.html`, {
            waitUntil: "networkidle",
          })
        ).status(),
        200,
      );
      await page.locator(".brand img").evaluate((img, c) => {
        img.src = `assets/final-${c}-color.svg`;
      }, concept);
      await page.locator(".brand img").evaluate((img) => img.decode());
      await page.locator(".hero-art img").evaluate((img,c) => { img.src = `assets/concept-${c}.svg`; },concept);
      await page.locator(".hero-art img").evaluate(img => img.decode());
      await page.evaluate(() => document.fonts.ready);
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth),
        width,
      );
      const bounds = await page.locator(".brand img").boundingBox();
      assert.ok(bounds.width >= 232 && bounds.height >= 44);
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
      const summary = page.locator(".instrument-menu summary");
      await summary.focus();
      await summary.press("Enter");
      assert.notEqual(
        await page.locator(".instrument-menu").getAttribute("open"),
        null,
      );
      assert.equal(await page.locator(".menu-links a").count(), 6);
      assert.equal(
        await summary.evaluate((el) => el.matches(":focus-visible")),
        true,
      );
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth),
        width,
      );
      await summary.press("Space");
      assert.equal(
        await page.locator(".instrument-menu").getAttribute("open"),
        null,
      );
      await page.evaluate(() => document.activeElement.blur());
      await page.evaluate(() => window.scrollTo(0, 0));
      const box = await page.locator(".wrap").first().boundingBox();
      await page.screenshot({
        path: `${dest}final-nav-${concept}-${width}${density === 2 ? "-2x" : ""}.png`,
        clip: { x: 0, y: box.y, width, height: box.height },
      });
      if (width === 1440 && density === 1)
        await page.screenshot({
          path: `${dest}final-home-${concept}-1440.png`,
        });
      assert.deepEqual(errors, []);
      results.push({
        concept,
        width,
        density,
        overflow: false,
        keyboard: true,
        errors,
      });
      await page.close();
    }
for (const width of [320, 375, 649, 768, 1440]) {
  const page = await browser.newPage({
    viewport: { width, height: 1000 },
    reducedMotion: "reduce",
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("response", (r) => {
    if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
  });
  assert.equal(
    (
      await page.goto(`${origin}/strata-015/identity-final.html`, {
        waitUntil: "networkidle",
      })
    ).status(),
    200,
  );
  await page.evaluate(() => document.fonts.ready);
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth),
    width,
  );
  for (const img of await page.locator("img").all())
    assert.equal(
      await img.evaluate((el) => el.complete && el.naturalWidth > 0),
      true,
    );
  for (const img of await page.locator(".native-sizes img").all())
    assert.equal(
      await img.evaluate((el) => el.getBoundingClientRect().width),
      Number(await img.getAttribute("width")),
    );
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  assert.equal(
    await page.locator("main").evaluate((el) => el === document.activeElement),
    true,
  );
  await page.screenshot({
    path: `${dest}final-board-${width}.png`,
    fullPage: true,
  });
  if (width === 1440)
    await page
      .locator("#marks")
      .screenshot({ path: `${dest}final-identity-comparison.png` });
  assert.deepEqual(errors, []);
  results.push({
    board: true,
    width,
    overflow: false,
    loadedImages: true,
    nativeSymbolSizes: true,
    keyboard: true,
    errors,
  });
  await page.close();
}
await writeFile(
  `${dest}final-identity-results.json`,
  JSON.stringify(
    {
      capturedAt: new Date().toISOString(),
      browser: browser.version(),
      results,
    },
    null,
    2,
  ) + "\n",
);
await browser.close();
process.stdout.write(
  "20 navigation checks (E/D × five widths × 1x/2x) and five comparison-board checks passed.\n",
);
