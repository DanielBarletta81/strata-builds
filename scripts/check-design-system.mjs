/* global document, window, getComputedStyle, PerformanceObserver, URL, performance */
import process from "node:process";
import assert from "node:assert/strict";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
const { chromium } = await import(
  process.env.STRATA_PLAYWRIGHT_MODULE
    ? pathToFileURL(resolve(process.env.STRATA_PLAYWRIGHT_MODULE)).href
    : "playwright-core"
);
const browser = await chromium.launch({
  executablePath: process.env.STRATA_CHROMIUM_EXECUTABLE,
  headless: true,
});
const origin = process.env.STRATA_APP_ORIGIN ?? "http://127.0.0.1:3260";
const baseline = process.env.STRATA_BASELINE_ORIGIN ?? "http://127.0.0.1:3258";
const dest = "docs/strata-015/implementation";
await mkdir(dest, { recursive: true });
const routes = [
  "/",
  "/deep-time#tethys",
  "/signals",
  "/atlas",
  "/orbital",
  "/oceanography",
  "/frontier",
  "/studio",
  "/orbital/voyager",
  "/oceanography/pawtuxet",
  "/frontier/reconciliation",
  "/research/bass-2003",
  "/design-system",
];
const widths = [320, 375, 649, 768, 1024, 1440];
const results = [];
const metrics = async (page) =>
  page.locator("main").evaluate((main) => {
    const rect = main.getBoundingClientRect();
    return {
      text: main.innerText,
      links: [...main.querySelectorAll("a")].map((a) => a.getAttribute("href")),
      elements: [main, ...main.querySelectorAll("*")].map((el) => {
        const s = getComputedStyle(el),
          r = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          color: s.color,
          background: s.backgroundColor,
          font: s.fontFamily,
          size: s.fontSize,
          weight: s.fontWeight,
          lineHeight: s.lineHeight,
          width: Math.round(r.width * 10) / 10,
          height: Math.round(r.height * 10) / 10,
          x: Math.round((r.x - rect.x) * 10) / 10,
        };
      }),
    };
  });
async function load(url, width) {
  const page = await browser.newPage({
    viewport: { width, height: 1000 },
    reducedMotion: "reduce",
  });
  const errors = [],
    failures = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (
      m.type() === "error" &&
      !(url.startsWith(baseline) && m.location().url.endsWith("/favicon.ico"))
    )
      errors.push(m.text() + " " + m.location().url);
  });
  page.on("response", (r) => {
    if (
      r.status() >= 400 &&
      !(url.startsWith(baseline) && r.url().endsWith("/favicon.ico"))
    )
      failures.push([r.url(), r.status()]);
  });
  await page.clock.setFixedTime(new Date("2026-11-14T00:57:19Z"));
  await page.addInitScript(() => {
    window.__strataCLS = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries())
        if (!e.hadRecentInput) window.__strataCLS += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  const response = await page.goto(url, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200, url);
  if (url.includes("/signals"))
    await page
      .getByText("Loading NOAA observations", { exact: false })
      .waitFor({ state: "hidden" });
  if (url.includes("/deep-time")) {
    const action = page.getByRole("button", {
      name: "Select 111 Ma in the timeline",
      exact: true,
    });
    if (await action.isVisible()) await action.click();
    await page
      .getByRole("group", { name: "Seaway evidence layers" })
      .waitFor({ state: "visible" });
  }
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator("main").count(), 1, url);
  assert.equal(await page.locator("h1").count(), 1, url);
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth),
    width,
    `overflow ${url} ${width}`,
  );
  return { page, errors, failures };
}
if (process.env.STRATA_A11Y_ONLY) {
  try {
    await supplemental();
  } finally {
    await browser.close();
  }
  process.exit(0);
}
try {
  if (!process.env.STRATA_INTERACTIONS_ONLY)
    for (const width of widths)
      for (const route of routes.filter(
        (route) =>
          !process.env.STRATA_ROUTE_FILTER ||
          route === process.env.STRATA_ROUTE_FILTER,
      )) {
        const name =
          route === "/"
            ? "home"
            : route.split("#")[0].slice(1).replaceAll("/", "-");
        const { page, errors, failures } = await load(origin + route, width);
        const cls = await page.evaluate(() => window.__strataCLS);
        const fonts = await page.evaluate(
          () =>
            performance
              .getEntriesByType("resource")
              .filter((r) => /\.(woff2?|ttf|otf)(\?|$)/.test(r.name)).length,
        );
        assert.equal(fonts, 0);
        await page.getByRole("link", { name: "Skip to content" }).focus();
        await page.keyboard.press("Enter");
        assert.equal(
          await page
            .locator("#main-content")
            .evaluate((el) => el === document.activeElement),
          true,
        );
        const nav = page.getByRole("navigation", {
          name: "Primary",
          exact: true,
        });
        const summary = nav.locator("summary");
        await summary.focus();
        await summary.press("Enter");
        assert.notEqual(
          await nav.locator("details").getAttribute("open"),
          null,
        );
        assert.equal(await nav.getByRole("link").count(), 12);
        assert.equal(
          await page.evaluate(() => document.documentElement.scrollWidth),
          width,
        );
        assert.equal(
          await summary.evaluate((el) => el.matches(":focus-visible")),
          true,
        );
        if (route != "/design-system")
          assert.equal(
            await nav.locator('a[aria-current="page"]').getAttribute("href"),
            route.split("#")[0],
          );
        await summary.press("Escape");
        assert.equal(await nav.locator("details").getAttribute("open"), null);
        assert.equal(
          await summary.evaluate((el) => el === document.activeElement),
          true,
        );
        await page.evaluate(() => {
          document.activeElement.blur();
          window.scrollTo(0, 0);
        });
        for (const img of await page.locator("img").all())
          if (await img.isVisible()) {
            await img.evaluate((el) => el.decode());
            assert.equal(
              await img.evaluate((el) => el.complete && el.naturalWidth > 0),
              true,
            );
          }
        await page.screenshot({
          path: `${dest}/after-${name}-${width}.jpg`,
          type: "jpeg",
          quality: 82,
          fullPage: route === "/" || route === "/design-system",
        });
        let comparison = "not applicable";
        if (route != "/design-system") {
          const prior = await load(baseline + route, width);
          await prior.page.evaluate(() => window.scrollTo(0, 0));
          await prior.page.screenshot({
            path: `${dest}/before-${name}-${width}.jpg`,
            type: "jpeg",
            quality: 82,
          });
          if (route !== "/") {
            const before = await metrics(prior.page),
              after = await metrics(page);
            if (JSON.stringify(before) !== JSON.stringify(after)) {
              await writeFile(
                `${dest}/difference-${name}-${width}.json`,
                JSON.stringify({ before, after }, null, 2),
              );
            }
            assert.ok(
              JSON.stringify(after) === JSON.stringify(before),
              `scientific canvas changed ${route} ${width}; see difference JSON`,
            );
            comparison =
              "exact text, source links, computed color/type and element dimensions";
            if ([375, 1440].includes(width)) {
              await prior.page.locator("main").screenshot({
                path: `${dest}/canvas-before-${name}-${width}.png`,
              });
              await page.locator("main").screenshot({
                path: `${dest}/canvas-after-${name}-${width}.png`,
              });
            }
          }
          assert.deepEqual(prior.errors, []);
          assert.deepEqual(prior.failures, []);
          await prior.page.close();
        }
        if (route === "/design-system") {
          for (const value of ["Comparison", "Limitations", "Overview"]) {
            const button = page.getByRole("button", {
              name: value,
              exact: true,
            });
            await button.focus();
            await button.press("Space");
            assert.equal(await button.getAttribute("aria-pressed"), "true");
            assert.equal(
              await button.evaluate(
                (el) => getComputedStyle(el).transitionDuration,
              ),
              "0s",
            );
          }
          const disclosure = page.getByText(
            "Inspect this example’s provenance",
            { exact: true },
          );
          await disclosure.focus();
          await disclosure.press("Enter");
          assert.notEqual(
            await page.locator("main details").getAttribute("open"),
            null,
          );
          await page.emulateMedia({ reducedMotion: "no-preference" });
          assert.notEqual(
            await page
              .getByRole("button", { name: "Overview", exact: true })
              .evaluate((el) => getComputedStyle(el).transitionDuration),
            "0s",
          );
        }
        assert.deepEqual(errors, [], route);
        assert.deepEqual(failures, [], route);
        results.push({
          route,
          width,
          status: 200,
          overflow: false,
          keyboard: true,
          consoleErrors: errors,
          failedResources: failures,
          fontDownloads: fonts,
          layoutShift: cls,
          canvasComparison: comparison,
        });
        process.stdout.write(`PASS ${width} ${route}\n`);
        await page.close();
      }
  if (!process.env.STRATA_ROUTE_FILTER) await interactions();
  if (process.env.STRATA_ROUTE_FILTER) {
    const previous = JSON.parse(
      await readFile(`${dest}/browser-results.json`, "utf8"),
    );
    results.push(
      ...previous.results.filter(
        (row) => row.route !== process.env.STRATA_ROUTE_FILTER,
      ),
    );
  }
  if (!process.env.STRATA_INTERACTIONS_ONLY)
    await writeFile(
      `${dest}/browser-results.json`,
      JSON.stringify(
        {
          capturedAt: new Date().toISOString(),
          browser: browser.version(),
          baseline: "7690b59f4525516bff95c7bb633b41272739f76a",
          fixture:
            "Deterministic NOAA fetch stub; fixed 2026-11-14 client/server clock. Screenshots are regression fixtures, not live observations.",
          results,
        },
        null,
        2,
      ) + "\n",
    );
} finally {
  await browser.close();
}

async function interactions() {
  const interactionResults = [];
  for (const width of widths) {
    const { page, errors, failures } = await load(
      origin + "/deep-time#tethys",
      width,
    );
    assert.equal(await page.locator("#deep-time-event").inputValue(), "tethys");
    const layers = page.getByRole("group", { name: "Seaway evidence layers" });
    for (const name of [
      "Plate Reconstruction",
      "Regional Marine Evidence",
      "Open Questions",
      "Platform-to-Basin Transect",
    ]) {
      const b = layers.getByRole("button", { name, exact: true });
      await b.focus();
      await b.press("Enter");
      assert.equal(await b.getAttribute("aria-pressed"), "true");
      assert.equal(
        await b.evaluate((el) => el === document.activeElement),
        true,
      );
    }
    const settings = page.getByRole("group", {
      name: "Depositional environments",
    });
    const selected = [];
    for (let setting = 0; setting < 3; setting++) {
      await settings.getByRole("button").nth(setting).focus();
      await page.keyboard.press("Enter");
      const observations = page.getByRole("group", {
        name: "Reported observations",
      });
      for (
        let record = 0;
        record < (await observations.getByRole("button").count());
        record++
      ) {
        const b = observations.getByRole("button").nth(record);
        await b.focus();
        await b.press("Enter");
        assert.equal(await b.getAttribute("aria-pressed"), "true");
        const inspector = page.locator("[data-transect-record]");
        selected.push(await inspector.getAttribute("data-transect-record"));
        assert.ok((await inspector.getByRole("link").count()) > 0);
        const disclosure = inspector.locator("summary");
        await disclosure.focus();
        await disclosure.press("Enter");
        assert.notEqual(
          await inspector.locator("details").getAttribute("open"),
          null,
        );
      }
    }
    assert.equal(new Set(selected).size, 9);
    await page
      .getByRole("button", { name: "Planktonic fossil zone", exact: true })
      .click();
    const inspector = page.locator('[data-transect-record="rischi-biozone"]');
    assert.equal(
      await inspector
        .getByText("111 Ma within published age bracket", { exact: true })
        .isVisible(),
      true,
    );
    await inspector.locator("summary").focus();
    await page.keyboard.press("Enter");
    const text = await inspector.innerText();
    assert.ok(text.includes("±0.203 kyr"));
    assert.ok(text.includes("±0.203 Ma"));
    await inspector.screenshot({
      path: `${dest}/fossil-inspector-${width}.png`,
    });
    await page
      .getByRole("button", {
        name: "Leenhardt organic-rich shale",
        exact: true,
      })
      .click();
    assert.ok(
      (await page.locator("[data-transect-record]").innerText()).includes(
        "111.40",
      ),
    );
    const other = await page
      .locator("#deep-time-event option")
      .first()
      .getAttribute("value");
    await page.locator("#deep-time-event").selectOption(other);
    assert.equal(
      await page.locator("[data-tethys-unavailable]").isVisible(),
      true,
    );
    await page
      .getByRole("button", {
        name: "Select 111 Ma in the timeline",
        exact: true,
      })
      .click();
    assert.equal(await page.locator("#deep-time-event").inputValue(), "tethys");
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth),
      width,
    );
    assert.deepEqual(errors, []);
    assert.deepEqual(failures, []);
    interactionResults.push({
      width,
      entryBehavior:
        "Baseline opens liquid-water; use existing Select 111 Ma control",
      selectedAgeMa: 111,
      views: 4,
      selectableRecords: selected,
      fossilLabel: true,
      bothUncertaintyValues: true,
      sourceDisclosure: true,
      leenhardt: true,
      unsupportedAge: true,
      keyboard: true,
    });
    await page.close();
  }
  // Verify actual client navigation as well as direct route loads.
  const navPage = await load(origin + "/", 375);
  const nav = navPage.page.getByRole("navigation", {
    name: "Primary",
    exact: true,
  });
  await nav.locator("summary").click();
  await nav
    .getByRole("link", { name: "Pawtuxet observations", exact: true })
    .click();
  await navPage.page.waitForURL("**/oceanography/pawtuxet");
  assert.equal(await navPage.page.locator("main").count(), 1);
  assert.equal(await nav.locator("details").getAttribute("open"), null);
  assert.equal(
    await nav.locator('a[aria-current="page"]').getAttribute("href"),
    "/oceanography/pawtuxet",
  );
  await navPage.page.close();
  // Actual native CSS sizes, both symbol polarities and the fixed-background favicon.
  for (const density of [1, 2]) {
    const page = await browser.newPage({
      viewport: { width: 700, height: 440 },
      deviceScaleFactor: density,
    });
    let html =
      "<style>body{margin:0;font:16px system-ui}section{padding:24px;display:flex;gap:32px;align-items:center;height:220px;box-sizing:border-box}section:first-child{background:#07131a;color:#eaf5f3}section:last-child{background:#eaf5f3;color:#07131a}figure{margin:0;text-align:center}img{display:block;margin:0 auto 12px}</style>";
    for (const theme of ["dark", "light"]) {
      html += "<section>";
      for (const size of [16, 24, 32, 48])
        html += `<figure><img src="${origin}/brand/strata-symbol${theme === "light" ? "-dark" : ""}.svg" width="${size}" height="${size}" alt="">${size}px</figure>`;
      for (const size of [16, 24, 32, 48])
        html += `<figure><img src="${origin}/icon.svg" width="${size}" height="${size}" alt="">${size}px icon</figure>`;
      html += "</section>";
    }
    await page.setContent(html, { waitUntil: "networkidle" });
    for (const img of await page.locator("img").all()) {
      await img.evaluate((el) => el.decode());
      assert.equal(
        await img.evaluate((el) => el.getBoundingClientRect().width),
        Number(await img.getAttribute("width")),
      );
    }
    await page.screenshot({ path: `${dest}/icons-native-${density}x.png` });
    await page.close();
  }
  await writeFile(
    `${dest}/interaction-results.json`,
    JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        browser: browser.version(),
        results: interactionResults,
        nativeIcons: {
          sizes: [16, 24, 32, 48],
          densities: [1, 2],
          backgrounds: ["dark", "light"],
        },
        clientNavigation: "Home → Pawtuxet via menu passed",
      },
      null,
      2,
    ) + "\n",
  );
  process.stdout.write(
    "Deep Time interactions passed at six widths; nine records, four views, uncertainty and unsupported-age checks; icon specimens captured.\n",
  );
}
async function supplemental() {
  const rows = [];
  for (const width of widths)
    for (const route of ["/", "/design-system"]) {
      const { page, errors, failures } = await load(origin + route, width);
      const cold = await page.evaluate(() => ({
        cls: window.__strataCLS,
        resources: performance
          .getEntriesByType("resource")
          .map((r) => ({
            name: new URL(r.name).pathname,
            encodedBytes: r.encodedBodySize,
            transferBytes: r.transferSize,
          })),
        paint: performance
          .getEntriesByType("paint")
          .map((p) => ({ name: p.name, startTime: p.startTime })),
      }));
      assert.ok(cold.cls <= 0.1, `CLS ${route}`);
      await page.reload({ waitUntil: "networkidle" });
      const warm = await page.evaluate(() => ({
        cls: window.__strataCLS,
        resources: performance
          .getEntriesByType("resource")
          .map((r) => ({
            name: new URL(r.name).pathname,
            encodedBytes: r.encodedBodySize,
            transferBytes: r.transferSize,
          })),
      }));
      await page.evaluate(() => {
        document.documentElement.style.fontSize = "200%";
      });
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth),
        width,
        `200% text ${route} ${width}`,
      );
      await page.evaluate(() => {
        document.documentElement.style.fontSize = "";
      });
      await page.addStyleTag({
        content:
          "body * {line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important} p{margin-bottom:2em!important}",
      });
      assert.equal(
        await page.evaluate(() => document.documentElement.scrollWidth),
        width,
        `text spacing ${route} ${width}`,
      );
      if (width === 320)
        await page.screenshot({
          path: `${dest}/text-spacing-${route === "/" ? "home" : "showcase"}-320.png`,
          fullPage: true,
        });
      // A real forward tab sequence reaches the footer rather than cycling in a menu.
      await page.goto(origin + route, { waitUntil: "networkidle" });
      await page.getByRole("link", { name: "Skip to content" }).focus();
      const visited = [];
      for (let n = 0; n < 50; n++) {
        await page.keyboard.press("Tab");
        const focus = await page.evaluate(() => ({
          text: document.activeElement?.textContent,
          footer: !!document.activeElement?.closest("footer"),
        }));
        visited.push(focus.text);
        if (focus.footer) break;
      }
      assert.equal(
        await page.evaluate(() => !!document.activeElement?.closest("footer")),
        true,
      );
      assert.deepEqual(errors, []);
      assert.deepEqual(failures, []);
      rows.push({
        route,
        width,
        textEnlargement200Percent: true,
        textSpacing: true,
        keyboardReachesFooter: true,
        cold,
        warm,
      });
      await page.close();
    }
  await writeFile(
    `${dest}/accessibility-performance.json`,
    JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        browser: browser.version(),
        note: "Local Chromium lab measurements, not production field performance. Browser zoom and human screen-reader/physical-device checks are not claimed.",
        results: rows,
      },
      null,
      2,
    ) + "\n",
  );
  process.stdout.write(
    "Text enlargement, spacing, footer keyboard access and cold/warm load checks passed for new pages at six widths.\n",
  );
}
