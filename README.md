# Codex Pets

A bilingual, no-login gallery for original Codex Desktop custom pets. The site previews the real v2 spritesheets, provides ready-to-install pet packages, and distributes the Hatch Pet skill for creating and validating new pets.

一个无需登录的中英双语 Codex Desktop 自定义宠物站。网站直接预览真实 v2 spritesheet，提供可安装宠物包，并分发用于创建、修复、校验与打包宠物的 Hatch Pet Skill。

## Included pets

The gallery contains 40 installable v2 companions across four collections and one site guide.

全站包含四个系列和一位网站向导，共 40 只可安装的 v2 伙伴。

| Collection / 系列 | Count / 数量 | Route / 页面 |
| --- | --- | --- |
| 桌角小居民 / Desk Corner Friends | 3 | `/series/desk-corner-friends` |
| 桌面工作小队 / Desktop Work Crew | 12 | `/series/desktop-work-crew` |
| 呼噜事务所 / Cat Companion Club | 12 | `/series/cat-companion-club` |
| 金羽十二星 / Golden Feather Constellation | 12 | `/series/golden-feather-constellation` |
| 星铠团团 / Star-Armor Tuantuan | 1 | `/pets/star-armor-tuantuan` |

Every package contains exactly two install files:

```text
<pet-id>/
├─ pet.json
└─ spritesheet.webp
```

The spritesheets use the v2 `8 × 11` atlas contract (`1536 × 2288`, `192 × 208` per cell), with nine standard animation states and sixteen look directions.

## Local development

Requirements: Node.js `22.13.0` or newer and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production build:

```bash
npm run build
```

## Repository layout

```text
app/                 Site UI and metadata
public/pets/         Installable pet manifests and spritesheets
public/downloads/    Ready-to-extract pet and skill archives
public/og-series.png Social preview artwork
docs/releases/       Accepted asset hashes and release provenance
wrangler.jsonc       Production Cloudflare deployment configuration
```

## Installing a pet

Extract a pet archive into `${CODEX_HOME:-$HOME/.codex}/pets` (or `%USERPROFILE%\.codex\pets` on Windows when `CODEX_HOME` is not set), then fully restart Codex Desktop. The final manifest path must be:

```text
.codex/pets/<pet-id>/pet.json
```

Codex Desktop compatibility can vary by version. This repository is an independent project and is not an official OpenAI pet library.

## Hatch Pet Skill

Download `public/downloads/hatch-pet.zip` and extract it into `${CODEX_HOME:-$HOME/.codex}/skills`. After restarting Codex, invoke `$hatch-pet` to create or repair a Codex v2 pet with the skill's generation, structural validation, animation QA, and packaging workflow.

## Deployment

The app is built with vinext for Cloudflare Workers-compatible ESM output and is published through Cloudflare. Source and pet data are managed in this GitHub repository.

After artwork passes v2 validation and independent visual review, copy the approved manifest, spritesheet and preview into `public/pets/<pet-id>/`. Each website ZIP must contain a single `<pet-id>/` folder with exactly `pet.json` and `spritesheet.webp`. Update pet/series copy, release hashes and focused tests together; then run `npm run lint` and `npm test`, commit and push the verified source to GitHub, and run `npm run deploy`. Verify the live collection, detail/install pages and ZIP SHA-256 before considering publication complete. Never replace bytes behind an already published immutable download URL.

作品通过 v2 校验与独立视觉验收后，将定稿同步到公开素材、系列目录和下载包，更新版本哈希及测试；执行 lint 和测试后提交并推送 GitHub，再部署到 Cloudflare。线上页面和下载包校验通过后才算发布完成。已发布的不可变下载地址必须保留原始文件内容。

## License

Site source code is licensed under the MIT License. Pet artwork, spritesheets, and generated social artwork are excluded from the MIT grant; see [ASSET-LICENSE.md](./ASSET-LICENSE.md).
