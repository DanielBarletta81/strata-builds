# STRATA-002 — Stabilization and release foundation

## Runtime

| Dependency | Selected version |
| --- | --- |
| Node.js | 24.22.3 LTS |
| npm | 11.19.1, bundled with the selected Node.js release |
| Next.js | 16.4.6 |
| React and React DOM | 19.3.1 |
| TypeScript | 5.9.3 |
| ESLint | 10.15.0 |

Node.js 24 has Vercel runtime support. Local development and CI use the exact Node patch in `.nvmrc`. Vercel selects the Node major through `package.json` and manages its patch level. TypeScript stays at 5.9.3, the version already resolved by the prior local lockfile. [Node release](https://nodejs.org/en/blog/release/v24.22.3) · [Vercel Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)

Next.js 14 is outside its support window. Next.js 16.4.6 is a stable release on the active LTS line. Next.js 16 uses Turbopack by default, removes `next lint`, and updates the generated TypeScript configuration. The app uses the App Router and has no synchronous request APIs that require migration. The JavaScript configuration and Node tests use ES modules. The existing page routes keep their content, and the typed robots and sitemap handlers retain their output. ESLint runs separately with the official Next.js plugin and compatible JavaScript, TypeScript, and React Hooks rules. [Next.js support policy](https://nextjs.org/support-policy) · [Next.js release](https://github.com/vercel/next.js/releases/tag/v16.4.6) · [Upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16)

## Closeout verification

A clean install on the pinned Node.js and npm versions passed lint, typecheck, 2 unit tests, the production build, and 5 route smoke tests. See [PR #1](https://github.com/DanielBarletta81/strata-builds/pull/1) for hosted checks.

Chromium 158 rendered the local production build for `/`, `/atlas`, and `/studio`.

| Width | Homepage cards | Result |
| --- | --- | --- |
| 375 px | One column | Pages fit the viewport and a touch-emulated browser navigated through the card and shared links. |
| 768 px | Two columns | Pages fit the viewport and text and cards remained readable. |
| 1440 px | Two columns | Pages fit the viewport and the card hover and keyboard focus styles rendered. |
| 320 px | One column | The homepage no longer has the 12 px overflow measured before the fix. |

Tab and Shift+Tab followed the shared navigation and card order at all four widths. Enter opened the focused route. The visible focus outline is 2 px, the card transition duration drops from 0.2 s to zero with reduced motion, and the placeholder text contrast rose from approximately 2.85:1 to 5.74:1 on white. This browser check did not include a physical device or screen reader.

## Hosting closeout

Authenticated Vercel CLI and public DNS checks on November 20, 2026 identified project `strata-builds_v1.0` (`prj_TFkNvPFvwMcVx69LJCjmXgjeAOqL`) in scope `daniel-barlettas-projects`. Its Vercel alias serves the hub. Both custom hostnames returned a Cloudflare challenge from this environment.

| Hostname | Vercel assignment and ownership | Public DNS |
| --- | --- | --- |
| `strata-builds.tech` | Assigned, verified, and owned in the current Vercel scope. Vercel reports an invalid DNS configuration and no ownership challenge. | A record `66.235.200.146` |
| `www.strata-builds.tech` | The parent domain belongs to the current Vercel scope. The `www` hostname has no project assignment or issued ownership challenge. | CNAME to `strata-builds.tech.` |

The apex assignment is newer than the previous audit. Registrar and Bluehost zone access remain unverified. After separate approval, assign `www` in Vercel and refresh its verification result. If Vercel issues a TXT challenge for `www`, use the exact hostname and value it supplies after assignment.

### Proposed Bluehost changes

| Host | Type | Action | Current Vercel recommendation |
| --- | --- | --- | --- |
| `@` | A | Replace `66.235.200.146` with these two records | `216.198.79.1` and `64.29.17.1` |
| `www` | CNAME | Replace `strata-builds.tech.` after Vercel assignment and confirmation | `b094cd09d5954a21.vercel-dns-017.com.` |

Retain the Bluehost nameservers and mail records. The MX record points to `mail.strata-builds.tech`, which has its own A record. Review the existing SPF `a` mechanism with the mail operator before switching the apex, since that mechanism follows the apex A records. After cutover, recheck Vercel verification, HTTPS, and the five public routes. [Vercel custom-domain guide](https://vercel.com/docs/domains/set-up-custom-domain) · [Bluehost DNS editor](https://www.bluehost.com/help/article/dns-management-add-edit-or-delete-dns-entries)

## Proposed file boundaries

| Path | Ownership |
| --- | --- |
| `src/features/atlas/` | Atlas map, panels, imports, and labeled demo fixtures. The App Router entry stays in `src/app/atlas/page.tsx`. |
| `src/features/signals/` | NOAA observation views, provenance, and the validated source adapter. Keep upstream fetching in server-only modules. |
| `src/features/observatory/` | Observatory workflows and compositions that consume feature interfaces. |
| `src/features/deep-time/` | Deep-time scenes, timescale data, and controls. |
| `src/components/ui/` | Domain-independent components once more than one feature needs them. |
| `src/lib/science/` | Pure scientific transformations with fixtures when multiple features have a common contract. |

Create each path when its first implementation lands.

## STRATA-003 preparation

Use Microsat Atlas commit [`591b3b8afd1650028a5fbc68c08576e9c2a92a96`](https://github.com/DanielBarletta81/microsat-atlas/tree/591b3b8afd1650028a5fbc68c08576e9c2a92a96), verified as the remote default-branch HEAD on November 20, 2026. Its only change over the audited source commit `b6b0b2363cc712129ba42d5bb9b2bfd44be15115` is the README.

- **Map:** `src/components/CoastMap.jsx`, its projection helpers in `src/lib/geo.js`, and the simplified U.S. Census coastline in `src/data/coast.json`.
- **Composition:** `CompositionPanel` from `src/components/Panels.jsx` and the applicable rules in `src/app/atlas.module.css`. Use `src/components/AtlasApp.jsx` as the reference for passing the same samples and assignment colors to the map and panel.
- **Demo and inspection:** `src/data/demo.js` and `src/data/rng.js`, plus an accessible records table tied to every plotted sample. Preserve the synthetic label and coastline attribution. The existing table caps displayed source rows at 300.
- **Deferred:** CSV/TSV and paste inputs, additional analytical panels, and any real Chesapeake Bay genetics integration. Check source and asset permissions before transferring code or data. The pinned tree has no repository-level license file.

After approval, start from updated `main` on a separate branch. Verify that map, composition panel, and table use the same records, and check phone layout and keyboard navigation.
