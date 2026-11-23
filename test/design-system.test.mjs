import { URL } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import hashes from "./fixtures/strata-015-source-hashes.json" with { type: "json" };
import {
  routeIsCurrent,
  instrumentIsActive,
} from "../src/components/shell/navigation.ts";
const read = (path) => readFileSync(new URL("../" + path, import.meta.url));
test("all protected scientific records, fixtures and instrument pages match approved production", () => {
  assert.equal(hashes.baseline, "7690b59f4525516bff95c7bb633b41272739f76a");
  for (const [path, expected] of Object.entries(hashes.files))
    assert.equal(
      createHash("sha256").update(read(path)).digest("hex"),
      expected,
      path,
    );
});
test("navigation identifies exact pages and nested instruments without false prefixes", () => {
  assert.equal(routeIsCurrent("/orbital/voyager", "/orbital"), false);
  assert.equal(routeIsCurrent("/orbital/voyager", "/orbital/voyager"), true);
  assert.equal(instrumentIsActive("/orbital/voyager"), true);
  assert.equal(instrumentIsActive("/research/bass-2003"), true);
  assert.equal(instrumentIsActive("/orbitally"), false);
  assert.equal(instrumentIsActive("/studio"), false);
});
test("identity assets preserve approved geometry and declared hashes", () => {
  const paths = (s) =>
    [...s.matchAll(/<path[^>]* d="([^"]+)"/g)].map((m) => m[1]);
  const approved = paths(
    read("docs/strata-015/assets/concept-e.svg").toString(),
  );
  for (const file of [
    "public/brand/strata-symbol.svg",
    "public/brand/strata-symbol-dark.svg",
    "public/brand/strata-lockup.svg",
    "src/app/icon.svg",
  ])
    assert.deepEqual(paths(read(file).toString()).slice(0, 2), approved, file);
  const manifest = JSON.parse(read("public/brand/asset-manifest.json"));
  for (const { file, sha256 } of manifest.assets)
    assert.equal(
      createHash("sha256").update(read(file)).digest("hex"),
      sha256,
      file,
    );
});
test("raster exports have real dimensions and favicon contains three PNG entries", () => {
  for (const [file, size] of [
    ["src/app/apple-icon.png", 180],
    ["public/icons/strata-192.png", 192],
    ["public/icons/strata-512.png", 512],
  ]) {
    const b = read(file);
    assert.equal(b.toString("hex", 0, 8), "89504e470d0a1a0a");
    assert.equal(b.readUInt32BE(16), size);
    assert.equal(b.readUInt32BE(20), size);
  }
  const ico = read("src/app/favicon.ico");
  assert.equal(ico.readUInt16LE(2), 1);
  assert.equal(ico.readUInt16LE(4), 3);
  for (const [i, size] of [16, 32, 48].entries()) {
    const p = 6 + i * 16;
    assert.equal(ico[p], size);
    assert.equal(ico[p + 1], size);
    const offset = ico.readUInt32LE(p + 12);
    assert.equal(ico.toString("hex", offset, offset + 8), "89504e470d0a1a0a");
    assert.equal(ico.readUInt32BE(offset + 16), size);
  }
});
test("semantic text, actions and control boundaries meet their contrast thresholds", () => {
  const css = read("src/styles/tokens.css").toString();
  const tokens = Object.fromEntries(
    [...css.matchAll(/--strata-([\w-]+):\s*([^;]+);/g)].map((m) => [
      m[1],
      m[2].trim(),
    ]),
  );
  const color = (n) =>
    tokens[n].startsWith("var(") ? color(tokens[n].slice(13, -1)) : tokens[n];
  const lum = (h) =>
    [0.2126, 0.7152, 0.0722].reduce((total, w, i) => {
      const c = parseInt(h.slice(1 + i * 2, 3 + i * 2), 16) / 255;
      return (
        total + w * (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
      );
    }, 0);
  const ratio = (a, b) => {
    const [hi, lo] = [lum(color(a)), lum(color(b))].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  };
  for (const bg of ["bg", "surface", "surface-secondary", "surface-raised"])
    for (const fg of [
      "text",
      "text-secondary",
      "text-subdued",
      "action",
      "evidence-observed",
      "evidence-interpretation",
      "evidence-modeled",
      "evidence-synthetic",
      "evidence-unresolved",
      "success",
      "warning",
      "error",
      "info",
    ])
      assert.ok(ratio(fg, bg) >= 4.5, `${fg}/${bg}`);
  for (const bg of ["bg", "surface", "surface-raised", "selected"])
    for (const fg of ["focus", "control-border"])
      assert.ok(ratio(fg, bg) >= 3, `${fg}/${bg}`);
  for (const bg of ["action", "action-hover", "action-pressed"])
    assert.ok(ratio("bg", bg) >= 4.5, bg);
  assert.ok(ratio("text", "selected") >= 4.5);
});
