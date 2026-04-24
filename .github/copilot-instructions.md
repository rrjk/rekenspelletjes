# GitHub Copilot Instructions

## Project overview

This repository contains a collection of primary-school web math games built with TypeScript, HTML, Rollup, and Lit/web components.

## Key commands

- `npm install` — install dependencies
- `npm run start` — start the local development server
- `npm test` — run Jest tests
- `npm run lint` — run type checking, ESLint, and Prettier checks
- `npm run format` — auto-format source files
- `npm run build` — build all packages and game bundles

## Project structure

- `package.json` — core scripts, dependencies, and tooling
- `tsconfig.json` — TypeScript configuration
- `eslint.config.mjs` — ESLint rules
- `rollup.config.ts` — root Rollup config
- `Rekenspelletjes/` — many HTML game pages and a dedicated Rollup build
- `s/`, `t/`, `Stats/` — additional build targets with own Rollup configs

## Editing guidance

- Keep changes small and focused: one game or one shared utility at a time.
- Use existing TypeScript/HTML patterns rather than introducing new frameworks.
- Prefer updating existing game HTML files under `Rekenspelletjes/` when changing UI behavior.
- Respect the current build and lint flow; use the package scripts rather than custom ad hoc commands.

## Testing and quality

- `npm test` is the test entrypoint.
- `npm run lint` includes `tsc`, `eslint`, and `prettier` checks.
- `npm run format` will fix formatting issues for `.ts` files.

## Notes for Copilot

- This repo does not currently contain an existing agent or instructions file beyond this one.
- Focus on changes that preserve the classic browser-based game experience and avoid changing unrelated build tooling.
- Do not add dependencies unless they are clearly needed and compatible with the existing Rollup/TypeScript setup.

## Suggested follow-up customizations

- Create a dedicated prompt for editing or extending a specific game under `Rekenspelletjes/`.
- Create a lint/fix helper for repository-wide formatting and build validation.
