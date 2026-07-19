# Codex Pets

A bilingual, no-login gallery for original Codex Desktop custom pets. The site previews the real v2 spritesheets, provides ready-to-install pet packages, and distributes the Hatch Pet skill for creating and validating new pets.

一个无需登录的中英双语 Codex Desktop 自定义宠物站。网站直接预览真实 v2 spritesheet，提供可安装宠物包，并分发用于创建、修复、校验与打包宠物的 Hatch Pet Skill。

## Included pets

| ID | Display name | Format |
| --- | --- | --- |
| `star-armor-tuantuan` | 星铠团团 / Star-Armor Tuantuan | Codex pet v2 |
| `gemini-twincrest-duck` | 双子镜辉鸭 / Gemini Twincrest Duck | Codex pet v2 |
| `aries-ramcrest-duck` | 白羊金翎鸭 / Aries Ramcrest Duck | Codex pet v2 |
| `taurus-bullguard-duck` | 金牛鎏甲鸭 / Taurus Bullguard Duck | Codex pet v2 |

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
public/og.png        Social preview artwork
.openai/hosting.json Sites deployment metadata
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

## License

Site source code is licensed under the MIT License. Pet artwork, spritesheets, and generated social artwork are excluded from the MIT grant; see [ASSET-LICENSE.md](./ASSET-LICENSE.md).
