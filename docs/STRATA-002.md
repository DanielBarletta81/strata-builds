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

Next.js 14 is outside its support window. Next.js 16.4.6 is a stable release on the active LTS line. Next.js 16 uses Turbopack by default, removes `next lint`, and updates the generated TypeScript configuration. The app uses the App Router and has no synchronous request APIs that require migration. The JavaScript configuration and Node tests use ES modules. The existing pages and layout keep their markup, and the typed robots and sitemap handlers retain their output. ESLint runs separately with the official Next.js plugin and compatible JavaScript, TypeScript, and React Hooks rules. [Next.js support policy](https://nextjs.org/support-policy) · [Next.js release](https://github.com/vercel/next.js/releases/tag/v16.4.6) · [Upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16)

## Custom domain

Read-only checks on November 20, 2026 found the following.

| Layer | Evidence |
| --- | --- |
| DNS | Bluehost nameservers `ns1.bluehost.com` and `ns2.bluehost.com` are authoritative. The apex resolves to `66.235.200.146`, and `www` is a CNAME to the apex. |
| Ownership verification | Vercel reported `domainOwnership: not-found` in `daniel-barlettas-projects`. Access to the registrar and DNS zone remains unverified. |
| Vercel assignment | `vercel domains verify` reported `project_domain_missing` and invalid DNS for project `strata-builds_v1.0`. The production deployment is Ready and lists only Vercel aliases. |
| Security rules | The apex and `www` returned Cloudflare HTTP 403 with `cf-mitigated: challenge`. The apex sitemap was challenged and robots returned 404. The exact rule and account were unavailable from these responses. |
| Application routing | The default Vercel alias returned 200 for the home page, Atlas, Studio, robots, and sitemap. The crawler metadata still advertises the intended custom domain. |

For a separately approved domain change, confirm access to the Bluehost zone, attach the intended hostnames to the Vercel project, and use the records Vercel reports for that assignment. Preserve the existing mail records when changing web records. Recheck ownership, TLS, and the five public routes after DNS propagates. [Vercel domain troubleshooting](https://vercel.com/docs/domains/troubleshooting) · [Vercel deployment](https://vercel.com/daniel-barlettas-projects/strata-builds_v1.0/BWMtsmz8kZ8P364vpYeDYF5bGwPj)

## Proposed file boundaries

| Path | Ownership |
| --- | --- |
| `src/features/atlas/` | Atlas map, panels, imports, and labeled demo fixtures. The App Router entry stays in `src/app/atlas/page.tsx`. |
| `src/features/signals/` | NOAA observation views, provenance, and the validated source adapter. Keep upstream fetching in server-only modules. |
| `src/features/observatory/` | Observatory workflows and compositions that consume feature interfaces. |
| `src/features/deep-time/` | Deep-time scenes, timescale data, and controls. |
| `src/components/ui/` | Domain-independent components once more than one feature needs them. |
| `src/lib/science/` | Pure scientific transformations with fixtures when multiple features have a common contract. |

Create each path when its first implementation lands. For STRATA-003, bring the existing Microsat Atlas map and composition panel into `/atlas` using a pinned upstream revision and the explicitly labeled synthetic demo. Include coastline attribution and a keyboard-accessible data table. Verify the plotted counts, phone layout, and keyboard navigation together.
