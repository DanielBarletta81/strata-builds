import process from "node:process";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { Buffer } from "node:buffer";
const { chromium } = await import(
  process.env.STRATA_PLAYWRIGHT_MODULE
    ? pathToFileURL(resolve(process.env.STRATA_PLAYWRIGHT_MODULE)).href
    : "playwright-core"
);
const master = await readFile("public/brand/strata-symbol.svg", "utf8");
const icon = master.replace(
  /<title[^>]*>.*?<\/title>/,
  '<title id="t">STRATA Builds</title><rect width="48" height="48" rx="6" fill="#07131a"/>',
);
await writeFile("src/app/icon.svg", icon);
await mkdir("public/icons", { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.STRATA_CHROMIUM_EXECUTABLE,
  headless: true,
});
const images = new Map();
for (const size of [16, 24, 32, 48, 180, 192, 512]) {
  const page = await browser.newPage({
    viewport: { width: size, height: size },
    deviceScaleFactor: 1,
  });
  await page.setContent(
    `<style>html,body{margin:0;width:100%;height:100%;overflow:hidden}svg{display:block;width:100%;height:100%}</style>${icon}`,
  );
  const png = await page.screenshot({ type: "png", omitBackground: true });
  images.set(size, png);
  await page.close();
}
const rendererVersion = browser.version();
await browser.close();
await writeFile("src/app/apple-icon.png", images.get(180));
for (const size of [192, 512])
  await writeFile(`public/icons/strata-${size}.png`, images.get(size));
const sizes = [16, 32, 48];
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
for (const [i, size] of sizes.entries()) {
  const pos = 6 + 16 * i;
  header[pos] = size;
  header[pos + 1] = size;
  header.writeUInt16LE(1, pos + 4);
  header.writeUInt16LE(32, pos + 6);
  header.writeUInt32LE(images.get(size).length, pos + 8);
  header.writeUInt32LE(offset, pos + 12);
  offset += images.get(size).length;
}
await writeFile(
  "src/app/favicon.ico",
  Buffer.concat([header, ...sizes.map((s) => images.get(s))]),
);
const files = [
  "public/brand/strata-lockup.svg",
  "public/brand/strata-symbol.svg",
  "public/brand/strata-symbol-dark.svg",
  "src/app/icon.svg",
  "src/app/favicon.ico",
  "src/app/apple-icon.png",
  "public/icons/strata-192.png",
  "public/icons/strata-512.png",
];
const assets = [];
for (const file of files) {
  const bytes = await readFile(file);
  assets.push({
    file,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  });
}
await writeFile(
  "public/brand/asset-manifest.json",
  JSON.stringify(
    {
      approvedProposal: "223e22ecc3baaf49d2279591bc6115261cd0c9f3",
      identity: "Refined Concept E; unframed",
      geometry: "Two original filled polygons; unchanged approved coordinates",
      wordmark: {
        font: "Source Sans 3 Semibold",
        upstream: "https://github.com/adobe-fonts/source-sans",
        commit: "87b37a2daaed80fcb8e8ccb0085c4d72ddade12e",
        license: "OFL-1.1; see OFL-SourceSans.txt",
        runtimeFont: false,
      },
      raster: {
        renderer: `Chromium ${rendererVersion}`,
        density: 1,
        icoSizes: sizes,
        appleSize: 180,
        manifestSizes: [192, 512],
        background: "#07131a",
        padding:
          "Original 48-unit master viewBox (4-unit margin); no geometry scaling changes",
      },
      assets,
    },
    null,
    2,
  ) + "\n",
);
process.stdout.write(
  "SVG, ICO 16/32/48, Apple 180 and app 192/512 icons generated from the approved E master.\n",
);
