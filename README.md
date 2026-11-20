# Strata Builds

Design, data, structure — visualizations and digital products from D.C. Barletta.

## Structure

- `/` — Hub landing page and project showcase
- `/studio` — Strata Works portfolio placeholder
- `/atlas` — Microsat Atlas placeholder

## Getting started

Use Node.js 24.22.3 and its bundled npm 11.19.1. The Node version is recorded in `.nvmrc`.

```bash
nvm use
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:routes
```

`npm run test:routes` starts the production build on a temporary loopback port and checks the pages, shared layout, robots response, and sitemap. Run `npm start` to serve the build locally. The same quality checks run on pull requests.

Vercel hosts the application from GitHub `main`. The runtime migration, custom-domain diagnosis, and proposed feature boundaries are recorded in [STRATA-002](docs/STRATA-002.md).
