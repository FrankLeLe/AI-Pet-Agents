# Repository Guidelines

## Project Structure & Module Organization

`app/` contains the React UI, metadata, and global styles. `worker/` provides the Cloudflare Worker entry point used by vinext. Installable assets live under `public/pets/<pet-id>/`, while downloadable pet and skill archives live in `public/downloads/`; `public/pets/catalog.json` is the gallery index. Integration tests are in `tests/`. The optional Drizzle/D1 layer is under `db/`, with a reference implementation in `examples/d1/`. Build support and deployment configuration live in `build/`, `vite.config.ts`, `next.config.ts`, and `wrangler.jsonc`.

## Build, Test, and Development Commands

Use Node.js 22.13 or newer.

- `npm install` installs locked dependencies from `package-lock.json`.
- `npm run dev` starts the local vinext server at `http://localhost:3000`.
- `npm run build` creates the Cloudflare-compatible production output in `dist/`.
- `npm test` builds the app, then runs all Node integration tests.
- `npm run lint` checks TypeScript, React, and Next.js rules with ESLint.
- `npm run deploy` publishes through Wrangler using `wrangler.jsonc`.
- `npm run db:generate` regenerates Drizzle migrations after schema changes.

## Coding Style & Naming Conventions

Follow the existing TypeScript style: two-space indentation, double quotes, trailing commas in multiline structures, and strict typing. Use `PascalCase` for React components and types, `camelCase` for functions and state, `UPPER_SNAKE_CASE` for shared constant collections, and kebab-case for CSS classes and pet IDs. Keep Chinese and English copy paired when editing user-facing content. Run `npm run lint` before submitting; no separate formatter is configured.

## Testing Guidelines

Tests use `node:test` and `node:assert/strict`. Name new files `*.test.mjs` and place them in `tests/`. Cover rendered metadata, important page copy, removed starter artifacts, and downloadable asset integrity. There is no numeric coverage threshold, but every behavior or asset-contract change should have a focused assertion. When adding a pet, update its manifest, spritesheet, ZIP archive, catalog entry, and package test together.

## Commit & Pull Request Guidelines

The current history uses a short imperative subject (`Launch Codex Pets gallery`). Continue with concise, present-tense messages such as `Add Leo guardian pet`. Pull requests should explain the user-visible change, list verification commands, link any issue, and include desktop/mobile screenshots for UI work. Call out changes to large binaries, deployment configuration, or asset licensing.

## Security & Asset Rules

Never commit API tokens, Cloudflare credentials, or local `.env` files. Pet spritesheets and generated artwork are excluded from the MIT grant; review `ASSET-LICENSE.md` before redistributing or replacing them. Preserve the v2 pet contract: `pet.json` plus `spritesheet.webp`, with `spriteVersionNumber: 2`.
