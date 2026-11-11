import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import { inflateRawSync } from "node:zlib";
import sharp from "sharp";
import { loadPetModule, loadPetReleaseModule } from "../scripts/load-pet-module.mjs";

// Accepted final atlases, including the independently reviewed repair revisions.
const desktopWorkAtlasHashes = {
  "desk-compiler-mole-mazai": "c788f6d9992f9732dee97572cf8536f689143e3e16d5bfbe72c9a352492673ce",
  "desk-test-beetle-diandian": "287e2109dceb79222627ebaf64fd3f154578ef50f4f8b619520dd79c4faf22de",
  "desk-review-owl-jiaojiao": "e60e504c7920d8ffe53de9c399cb43a0cf262ae767ee1ec96ce4404ea7d01c2b",
  "desk-search-hound-xiuxiu": "9db49545d1012ad3a8605cff6bf126a05b6fafb9e50d05e7299ca564b1ead773",
  "desk-plan-beaver-gege": "dceefa917e498c61ce23f10e424808f3f0c446d5960410b2a2369c07714a6be3",
  "desk-deploy-pigeon-yundi": "9313c7bc9e5dffb856eee09ecbb37faf56d8971b1b8038c4f93e0b456f445328",
  "desk-memory-squirrel-licun": "7a2789d8567d4cb2702981d0d789f4588c5f9b2b5ca8b3d58f2b56961c1f8ba1",
  "desk-data-octopus-duoduo": "039e52d808b284931b348fbe0b0c283987a767db8699764fe0b5aba7046e1a11",
  "desk-design-red-panda-caiwei": "3071f346086b1e145a57da8dfef0e092133980ca256726fdd4c33aaf14d08243",
  "desk-security-hedgehog-dundun": "8c7ecc9fbc5799ba244cb7911a8f7616b283fafedcbf23d34884d600729e6a0b",
  "desk-waiting-sloth-manman": "72019df5bb0028230472e817af513c6c11e3e850a2fe219e37ce2e837b7b9cdf",
  "desk-debug-salamander-huohua": "6eb908da023781a505a102a7749062fa85c55625150245f56597b75be7b4b317",
};

const deskCornerIds = [
  "foldlume", "eavie", "mendmoth", "dewbert", "spriggle", "bloomble",
  "quillip", "inklet", "buttonbud", "spoolie", "crumbit", "thimblet",
];

const expectedIds = [
  "star-armor-tuantuan",
  "aries-ramcrest-duck",
  "taurus-bullguard-duck",
  "gemini-twincrest-duck",
  "cancer-shellguard-duck",
  "leo-manehelm-duck",
  "virgo-lotuscrest-duck",
  "libra-balanceguard-duck",
  "scorpio-stingtalon-duck",
  "sagittarius-arrowwing-duck",
  "capricorn-goathorn-duck",
  "aquarius-vesselwing-duck",
  "pisces-fintail-duck",
  "cat-ragdoll-yunduo",
  "cat-american-shorthair-yinbing",
  "cat-british-shorthair-lanyuanyuan",
  "cat-maine-coon-linwang",
  "cat-siamese-haiyan",
  "cat-norwegian-forest-songlu",
  "cat-persian-xuegao",
  "cat-bengal-jinbao",
  "cat-russian-blue-wulan",
  "cat-devon-rex-juanjuan",
  "cat-sphynx-yueguang",
  "cat-abyssinian-hongsha",
  ...Object.keys(desktopWorkAtlasHashes),
  ...deskCornerIds,
];

const expectedAnimationKeys = [
  "idle",
  "running-right",
  "running-left",
  "waving",
  "jumping",
  "failed",
  "waiting",
  "running",
  "review",
  "look",
];

async function readJson(relativePath) {
  return JSON.parse(
    await readFile(new URL(relativePath, import.meta.url), "utf8"),
  );
}

function assertLocalizedText(value, label) {
  assert.equal(typeof value, "object", `${label} must be an object`);
  assert.equal(typeof value.zh, "string", `${label}.zh must be a string`);
  assert.equal(typeof value.en, "string", `${label}.en must be a string`);
  assert.ok(value.zh.trim().length > 0, `${label}.zh must not be empty`);
  assert.ok(value.en.trim().length > 0, `${label}.en must not be empty`);
}

function readZipEntries(archive) {
  const endSignature = 0x06054b50;
  const centralSignature = 0x02014b50;
  const localSignature = 0x04034b50;
  const minimumEndOffset = Math.max(0, archive.length - 65_557);
  let endOffset = -1;

  for (let offset = archive.length - 22; offset >= minimumEndOffset; offset -= 1) {
    if (archive.readUInt32LE(offset) === endSignature) {
      endOffset = offset;
      break;
    }
  }

  assert.notEqual(endOffset, -1, "ZIP end-of-central-directory record is missing");
  const entryCount = archive.readUInt16LE(endOffset + 10);
  let offset = archive.readUInt32LE(endOffset + 16);
  const entries = new Map();

  for (let index = 0; index < entryCount; index += 1) {
    assert.equal(archive.readUInt32LE(offset), centralSignature, "ZIP central directory is malformed");
    const compressionMethod = archive.readUInt16LE(offset + 10);
    const compressedSize = archive.readUInt32LE(offset + 20);
    const uncompressedSize = archive.readUInt32LE(offset + 24);
    const nameLength = archive.readUInt16LE(offset + 28);
    const extraLength = archive.readUInt16LE(offset + 30);
    const commentLength = archive.readUInt16LE(offset + 32);
    const localOffset = archive.readUInt32LE(offset + 42);
    const rawName = archive.subarray(offset + 46, offset + 46 + nameLength).toString("utf8");
    const name = rawName.replaceAll("\\", "/");

    assert.equal(name.startsWith("/"), false, `${rawName} must be a relative ZIP path`);
    assert.equal(/^[A-Za-z]:\//.test(name), false, `${rawName} must not use a drive path`);
    assert.equal(name.split("/").includes(".."), false, `${rawName} must not traverse directories`);

    assert.equal(archive.readUInt32LE(localOffset), localSignature, `${name} has no local ZIP header`);
    const localNameLength = archive.readUInt16LE(localOffset + 26);
    const localExtraLength = archive.readUInt16LE(localOffset + 28);
    const dataOffset = localOffset + 30 + localNameLength + localExtraLength;
    const compressed = archive.subarray(dataOffset, dataOffset + compressedSize);
    let content;

    if (compressionMethod === 0) {
      content = compressed;
    } else if (compressionMethod === 8) {
      content = inflateRawSync(compressed);
    } else {
      assert.fail(`${name} uses unsupported ZIP compression method ${compressionMethod}`);
    }

    assert.equal(content.length, uncompressedSize, `${name} has an invalid uncompressed size`);
    assert.equal(entries.has(name), false, `${name} is duplicated in the ZIP`);
    entries.set(name, content);
    offset += 46 + nameLength + extraLength + commentLength;
  }

  return entries;
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function loadBuiltWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  return (await import(workerUrl.href)).default;
}

test("keeps the TypeScript catalog and static v1 API in sync", async () => {
  const [catalog, petModule] = await Promise.all([
    readJson("../public/api/v1/catalog.json"),
    loadPetModule(),
  ]);

  assert.equal(catalog.schemaVersion, 1);
  assert.deepEqual(catalog.languages, ["zh", "en"]);
  assert.deepEqual(catalog.spriteFormat, petModule.SPRITE_FORMAT);
  assert.deepEqual(catalog.animations, petModule.ANIMATIONS);
  assert.deepEqual(catalog.pets, petModule.PETS);
  assert.deepEqual(catalog.pets.map((pet) => pet.id), expectedIds);
  assert.deepEqual(
    catalog.animations.map((animation) => animation.key),
    expectedAnimationKeys,
  );
  for (const animation of petModule.ANIMATIONS) {
    assert.equal(
      animation.durations.length,
      animation.frames,
      `${animation.key} must define exactly one duration per authored frame`,
    );
  }
  assert.equal(new Set(expectedIds).size, catalog.pets.length);
});

test("publishes a self-consistent detail document for every pet", async () => {
  const catalog = await readJson("../public/api/v1/catalog.json");
  const animationsByKey = new Map(
    catalog.animations.map((animation) => [animation.key, animation]),
  );

  assert.equal(catalog.spriteFormat.cellWidth, 192);
  assert.equal(catalog.spriteFormat.cellHeight, 208);

  for (const pet of catalog.pets) {
    assert.match(pet.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assertLocalizedText(pet.displayName, `${pet.id}.displayName`);
    assertLocalizedText(pet.tagline, `${pet.id}.tagline`);
    assertLocalizedText(pet.description, `${pet.id}.description`);
    assert.equal(pet.personalityTags.length, 3);
    pet.personalityTags.forEach((tag, index) => {
      assertLocalizedText(tag, `${pet.id}.personalityTags[${index}]`);
    });

    assert.equal(pet.status, "published");
    assert.equal(pet.spriteVersionNumber, 2);
    assert.equal(pet.manifestPath, `/pets/${pet.id}/pet.json`);
    assert.equal(pet.spritesheetPath, `/pets/${pet.id}/spritesheet.webp`);
    assert.equal(pet.previewPath, `/pets/${pet.id}/preview.webp`);
    assert.equal(pet.downloadPath, `/downloads/${pet.id}.zip`);
    assert.equal(pet.detailPath, `/api/v1/pets/${pet.id}.json`);

    const [detail, manifest, spritesheet, preview, archive] = await Promise.all([
      readJson(`../public/api/v1/pets/${pet.id}.json`),
      readJson(`../public/pets/${pet.id}/pet.json`),
      stat(new URL(`../public/pets/${pet.id}/spritesheet.webp`, import.meta.url)),
      stat(new URL(`../public/pets/${pet.id}/preview.webp`, import.meta.url)),
      stat(new URL(`../public/downloads/${pet.id}.zip`, import.meta.url)),
    ]);

    assert.equal(detail.schemaVersion, catalog.schemaVersion);
    assert.deepEqual(detail.languages, catalog.languages);
    assert.deepEqual(detail.spriteFormat, catalog.spriteFormat);
    assert.deepEqual(detail.animationKeys, expectedAnimationKeys);
    assert.deepEqual(detail.pet, pet);

    assert.equal(manifest.id, pet.id);
    assert.equal(manifest.displayName, pet.displayName.zh);
    assert.equal(manifest.spriteVersionNumber, pet.spriteVersionNumber);
    assert.equal(manifest.spritesheetPath, "spritesheet.webp");
    assert.ok(spritesheet.size > 0);
    assert.ok(preview.size > 0 && preview.size < 100_000);
    assert.ok(archive.size > 0);
    const [atlasMetadata, previewMetadata] = await Promise.all([
      sharp(await readFile(new URL(`../public/pets/${pet.id}/spritesheet.webp`, import.meta.url))).metadata(),
      sharp(await readFile(new URL(`../public/pets/${pet.id}/preview.webp`, import.meta.url))).metadata(),
    ]);
    assert.equal(atlasMetadata.width, 1536, `${pet.id} must have eight sprite columns`);
    assert.equal(atlasMetadata.height, 2288, `${pet.id} must have eleven v2 rows`);
    assert.equal(atlasMetadata.hasAlpha, true, `${pet.id} atlas must preserve transparency`);
    assert.equal(previewMetadata.width, 192, `${pet.id} preview must match one sprite cell`);
    assert.equal(previewMetadata.height, 208);
    assert.equal(previewMetadata.hasAlpha, true);
    const webPreview = await stat(
      new URL(`../public/pets/${pet.id}/web/preview.webp`, import.meta.url),
    );
    assert.ok(
      webPreview.size < preview.size,
      `${pet.id} web preview must be smaller than its source`,
    );
    for (const animationKey of expectedAnimationKeys) {
      const animation = animationsByKey.get(animationKey);
      assert.ok(animation, `${animationKey} animation metadata is missing`);
      const stripUrl = new URL(
        `../public/pets/${pet.id}/web/animations/${animationKey}.webp`,
        import.meta.url,
      );
      const [strip, metadata] = await Promise.all([
        stat(stripUrl),
        sharp(await readFile(stripUrl)).metadata(),
      ]);
      assert.ok(
        strip.size < 250_000,
        `${pet.id}/${animationKey} web strip exceeds the 250KB budget`,
      );
      assert.equal(
        metadata.width,
        animation.frames * 192,
        `${pet.id}/${animationKey} web strip width must contain exactly ${animation.frames} frames`,
      );
      assert.equal(
        metadata.height,
        208,
        `${pet.id}/${animationKey} web strip height must match one sprite cell`,
      );
    }
    assert.equal(pet.editorial.moments.length, 3);
    assert.equal(pet.editorial.traitsZh.length, 3);
    assert.equal(pet.editorial.traitsEn.length, 3);
    assert.ok(pet.editorial.storyZh.length >= 180);
    assert.ok(pet.editorial.storyEn.length >= 300);
  }
});

test("publishes the accepted desktop work revisions with unmodified idle previews", async () => {
  const { PETS } = await loadPetModule();
  assert.deepEqual(
    PETS.filter((pet) => pet.category === "desktop-work").map((pet) => pet.id),
    Object.keys(desktopWorkAtlasHashes),
  );

  for (const [id, expectedHash] of Object.entries(desktopWorkAtlasHashes)) {
    const [atlas, preview] = await Promise.all([
      readFile(new URL(`../public/pets/${id}/spritesheet.webp`, import.meta.url)),
      readFile(new URL(`../public/pets/${id}/preview.webp`, import.meta.url)),
    ]);
    assert.equal(sha256(atlas), expectedHash, `${id} must use the accepted final revision`);
    const metadata = await sharp(atlas).metadata();
    assert.equal(metadata.width, 1536);
    assert.equal(metadata.height, 2288);
    assert.equal(metadata.hasAlpha, true);
    const [idlePixels, previewPixels] = await Promise.all([
      sharp(atlas).extract({ left: 0, top: 0, width: 192, height: 208 }).ensureAlpha().raw().toBuffer(),
      sharp(preview).ensureAlpha().raw().toBuffer(),
    ]);
    assert.deepEqual(previewPixels, idlePixels, `${id} preview must preserve the authored idle frame`);
  }
});

test("publishes twelve distinct desk corner friends with complete v2 motion and exact idle previews", async () => {
  const { PETS, ANIMATIONS } = await loadPetModule();
  const expected = [
    { id: "foldlume", zh: "折灯", en: "Foldlume", kind: "折纸灯精灵", needs: ["start", "steady", "comfort"] },
    { id: "eavie", zh: "檐豆", en: "Eavie", kind: "叶屋蜗牛", needs: ["create", "start", "comfort"] },
    { id: "mendmoth", zh: "补补", en: "Mendmoth", kind: "暖毯蛾", needs: ["comfort", "steady"] },
    { id: "dewbert", zh: "露团", en: "Dewbert", kind: "露珠团子", needs: ["comfort", "start"] },
    { id: "spriggle", zh: "芽团", en: "Spriggle", kind: "嫩芽团子", needs: ["steady", "start"] },
    { id: "bloomble", zh: "绒朵", en: "Bloomble", kind: "绒绒雏菊", needs: ["create", "comfort"] },
    { id: "quillip", zh: "纸啾", en: "Quillip", kind: "折纸小雀", needs: ["create", "start"] },
    { id: "inklet", zh: "墨点", en: "Inklet", kind: "墨滴小章鱼", needs: ["solve", "steady"] },
    { id: "buttonbud", zh: "扣扣", en: "Buttonbud", kind: "纽扣小熊", needs: ["start", "comfort"] },
    { id: "spoolie", zh: "线眠", en: "Spoolie", kind: "线轴睡鼠", needs: ["solve", "steady", "comfort"] },
    { id: "crumbit", zh: "酥角", en: "Crumbit", kind: "黄油饼角", needs: ["comfort", "steady"] },
    { id: "thimblet", zh: "顶顶", en: "Thimblet", kind: "顶针小龟", needs: ["start", "comfort", "steady"] },
  ];
  assert.deepEqual(
    PETS.filter((pet) => pet.category === "desk-corner").map((pet) => pet.id),
    expected.map((pet) => pet.id),
  );
  const atlasHashes = new Set();
  const rowFrameCounts = [6, 8, 8, 4, 5, 8, 6, 6, 6, 8, 8];

  for (const identity of expected) {
    const pet = PETS.find((candidate) => candidate.id === identity.id);
    assert.deepEqual(pet.displayName, { zh: identity.zh, en: identity.en });
    assert.deepEqual(pet.needs, identity.needs);
    assert.equal(pet.editorial.zodiacZh, identity.kind);
    const [atlas, preview] = await Promise.all([
      readFile(new URL(`../public/pets/${pet.id}/spritesheet.webp`, import.meta.url)),
      readFile(new URL(`../public/pets/${pet.id}/preview.webp`, import.meta.url)),
    ]);
    atlasHashes.add(sha256(atlas));
    const { data, info } = await sharp(atlas).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.equal(info.width, 1536);
    assert.equal(info.height, 2288);
    assert.equal(info.channels, 4);

    for (const [row, frameCount] of rowFrameCounts.entries()) {
      for (let column = 0; column < 8; column += 1) {
        let artworkPixels = 0;
        let transparentPixels = 0;
        for (let y = row * 208; y < (row + 1) * 208; y += 1) {
          for (let x = column * 192; x < (column + 1) * 192; x += 1) {
            const alpha = data[(y * info.width + x) * 4 + 3];
            if (alpha > 0) artworkPixels += 1;
            else transparentPixels += 1;
          }
        }
        const label = `${pet.id} row ${row}, column ${column}`;
        if (column < frameCount) {
          assert.ok(artworkPixels > 50, `${label} is missing its authored pose`);
          assert.ok(transparentPixels > 0, `${label} must not have an opaque background`);
        } else {
          assert.equal(artworkPixels, 0, `${label} must remain unused and transparent`);
        }
      }
    }

    for (const animation of ANIMATIONS) {
      const frameHashes = new Set();
      for (let frame = 0; frame < animation.frames; frame += 1) {
        const cell = await sharp(atlas).extract({
          left: (frame % 8) * 192,
          top: (animation.row + Math.floor(frame / 8)) * 208,
          width: 192,
          height: 208,
        }).ensureAlpha().raw().toBuffer();
        frameHashes.add(sha256(cell));
      }
      assert.ok(frameHashes.size > 1, `${pet.id}/${animation.key} must not repeat a single static pose`);
    }

    const [idlePixels, previewPixels] = await Promise.all([
      sharp(atlas).extract({ left: 0, top: 0, width: 192, height: 208 }).ensureAlpha().raw().toBuffer(),
      sharp(preview).ensureAlpha().raw().toBuffer(),
    ]);
    assert.deepEqual(previewPixels, idlePixels, `${pet.id} preview must preserve the final idle pose`);
  }
  assert.equal(atlasHashes.size, expected.length, "each original character needs its own authored atlas");
});

test("preserves the legacy pet release namespace and rejects unknown release identities", async () => {
  const releaseModule = await loadPetReleaseModule();
  const legacyCommit = "1a559b86621a992abf2691d5e429cdf0b13d2716";
  assert.equal(releaseModule.PET_RELEASE_COMMIT, legacyCommit);
  const legacyIds = expectedIds.filter((id) => !deskCornerIds.includes(id));
  assert.equal(legacyIds.length, 37);
  for (const id of legacyIds) {
    assert.ok(releaseModule.getPetRelease(id), `${id} must keep its existing release metadata`);
    assert.equal(releaseModule.getPetReleaseCommit(id), legacyCommit, `${id} must keep its original namespace`);
    assert.equal(releaseModule.getPetPackageUrl(id), `https://aipetsagent.com/downloads/${legacyCommit}/${id}.zip`);
  }
  for (const id of ["not-a-pet", "constructor", "toString", "__proto__"]) {
    assert.equal(releaseModule.getPetRelease(id), undefined, `${id} must not resolve as a known release`);
    assert.equal(releaseModule.buildCodexInstallPrompt(id, id, "en"), "");
  }
});

test("requires an explicit new asset commit for desk corner pet downloads", async () => {
  const releaseModule = await loadPetReleaseModule();
  const originalCornerCommit = "e5f86f8ac08565eb40d4b216bd261f816eb0cc89";
  for (const id of deskCornerIds) {
    const release = releaseModule.getPetRelease(id);
    assert.ok(release, `${id} needs its final archive metadata before publication`);
    assert.equal(typeof release.releaseCommit, "string", `${id} must explicitly identify its asset commit`);
    assert.match(release.releaseCommit, /^[0-9a-f]{40}$/);
    assert.notEqual(release.releaseCommit, releaseModule.PET_RELEASE_COMMIT, `${id} did not exist in the legacy release`);
    if (["foldlume", "eavie", "mendmoth"].includes(id)) {
      assert.equal(release.releaseCommit, originalCornerCommit, `${id} must keep its published asset namespace`);
    } else {
      assert.notEqual(release.releaseCommit, originalCornerCommit, `${id} must point to its own expansion assets`);
    }
    assert.equal(releaseModule.getPetReleaseCommit(id), release.releaseCommit);
    assert.equal(releaseModule.getPetPackageUrl(id), `https://aipetsagent.com/downloads/${release.releaseCommit}/${id}.zip`);
    for (const language of ["zh", "en"]) {
      assert.ok(releaseModule.buildCodexInstallPrompt(id, id, language).includes(releaseModule.getPetPackageUrl(id)));
    }
  }
});

test("pins every install archive to its published size and SHA-256", async () => {
  const releaseModule = await loadPetReleaseModule();
  assert.equal(releaseModule.PET_RELEASE_COMMIT, "1a559b86621a992abf2691d5e429cdf0b13d2716");

  for (const id of expectedIds) {
    const archiveUrl = new URL(`../public/downloads/${id}.zip`, import.meta.url);
    const [archive, archiveStat, publishedManifest, publishedSpritesheet] = await Promise.all([
      readFile(archiveUrl),
      stat(archiveUrl),
      readFile(new URL(`../public/pets/${id}/pet.json`, import.meta.url)),
      readFile(new URL(`../public/pets/${id}/spritesheet.webp`, import.meta.url)),
    ]);
    const expectedRelease = releaseModule.PET_RELEASES[id];
    const releaseCommit = releaseModule.getPetReleaseCommit(id);

    assert.ok(expectedRelease, `${id} release metadata is missing`);
    assert.equal(expectedRelease.sizeBytes, archiveStat.size, `${id} size changed`);
    assert.equal(
      expectedRelease.sha256,
      sha256(archive),
      `${id} SHA-256 changed`,
    );
    assert.match(
      releaseModule.getPetPackageUrl(id),
      new RegExp(`^https://aipetsagent\\.com/downloads/${releaseCommit}/${id}\\.zip$`),
    );
    assert.doesNotMatch(releaseModule.getPetPackageUrl(id), /github/i);

    const installPrompt = releaseModule.buildCodexInstallPrompt(id, id, "en");
    assert.match(installPrompt, new RegExp(releaseCommit));
    assert.match(installPrompt, new RegExp(expectedRelease.sha256));
    assert.match(installPrompt, new RegExp(`CODEX_HOME/pets/${id}`));
    assert.match(installPrompt, /containing only pet\.json and spritesheet\.webp/);
    assert.match(installPrompt, /stop and ask me before replacing anything/);
    assert.match(installPrompt, /Never overwrite silently/);
    assert.match(installPrompt, /Do not install executables/);

    const entries = readZipEntries(archive);
    assert.deepEqual(
      [...entries.keys()].sort(),
      [`${id}/pet.json`, `${id}/spritesheet.webp`],
      `${id} ZIP must contain only the installable v2 pet folder`,
    );
    assert.deepEqual(
      JSON.parse(entries.get(`${id}/pet.json`).toString("utf8")),
      JSON.parse(publishedManifest.toString("utf8")),
      `${id} ZIP manifest differs from the published manifest`,
    );
    assert.equal(
      sha256(entries.get(`${id}/spritesheet.webp`)),
      sha256(publishedSpritesheet),
      `${id} ZIP spritesheet differs from the published spritesheet`,
    );
  }
});

test("keeps the hatch-pet skill archive scoped and installable", async () => {
  const archive = await readFile(
    new URL("../public/downloads/hatch-pet.zip", import.meta.url),
  );
  const entries = readZipEntries(archive);
  const paths = [...entries.keys()];

  assert.ok(paths.length > 0);
  assert.ok(paths.every((path) => path.startsWith("hatch-pet/")));
  assert.ok(paths.every((path) => !path.split("/").includes("..")));
  assert.ok(entries.has("hatch-pet/SKILL.md"));
  assert.ok(entries.has("hatch-pet/agents/openai.yaml"));
  assert.ok(entries.has("hatch-pet/references/codex-pet-contract.md"));
  assert.ok(entries.has("hatch-pet/scripts/validate_atlas.py"));
});

test("serves static assets first and reserves the Worker for versioned ZIP aliases", async () => {
  const [wrangler, staticHeaders, workerSource] = await Promise.all([
    readFile(new URL("../wrangler.jsonc", import.meta.url), "utf8"),
    readFile(new URL("../public/_headers", import.meta.url), "utf8"),
    readFile(new URL("../worker/index.ts", import.meta.url), "utf8"),
  ]);

  assert.match(wrangler, /"cache"\s*:\s*\{[\s\S]*"enabled"\s*:\s*true/);
  assert.doesNotMatch(wrangler, /"cross_version_cache"\s*:\s*true/);
  assert.doesNotMatch(wrangler, /"run_worker_first"/);
  assert.match(workerSource, /getPetReleaseCommit\(petId\)/);
  assert.match(workerSource, /Boolean\(getPetRelease\(petId\)\)/);
  assert.match(workerSource, /resolveDownloadTarget/);
  assert.match(workerSource, /VERSIONED_DOWNLOAD_CACHE = "public, max-age=31536000, immutable"/);
  assert.match(workerSource, /sliceByteStream/);
  assert.match(workerSource, /new TransformStream<Uint8Array, Uint8Array>/);
  assert.match(workerSource, /headers\.set\("Accept-Ranges", "bytes"\)/);
  assert.doesNotMatch(workerSource, /assetResponse\.arrayBuffer\(\)/);
  assert.doesNotMatch(workerSource, /handleImageOptimization|env\.IMAGES|D1Database/);
  assert.match(workerSource, /const isRscResponse = contentType\.includes\("text\/x-component"\)/);
  assert.match(workerSource, /!isRscResponse/);
  assert.match(
    staticHeaders,
    /\/downloads\/\*[\s\S]*Cache-Control: public, max-age=0, must-revalidate/,
  );
  assert.match(
    staticHeaders,
    /\/downloads\/\*[\s\S]*Cloudflare-CDN-Cache-Control: public, max-age=604800, stale-while-revalidate=2592000, stale-if-error=2592000/,
  );
  assert.match(staticHeaders, /\/downloads\/\*[\s\S]*Content-Disposition: attachment/);
  assert.match(staticHeaders, /\/downloads\/\*[\s\S]*Accept-Ranges: bytes/);
  assert.match(
    staticHeaders,
    /\/pets\/\*[\s\S]*Cache-Control: public, max-age=3600, stale-while-revalidate=86400/,
  );
  assert.match(
    staticHeaders,
    /\/pets\/\*[\s\S]*Cloudflare-CDN-Cache-Control: public, max-age=604800, stale-while-revalidate=2592000, stale-if-error=2592000/,
  );
});

test("rewrites pinned ZIP aliases and streams ranges without buffering the archive", async () => {
  const worker = await loadBuiltWorker();
  const assetBytes = new Uint8Array(4_096).map((_, index) => index % 251);
  let pulledBytes = 0;
  let fetchedAssetUrl = "";
  const body = new ReadableStream({
    pull(controller) {
      if (pulledBytes >= assetBytes.length) {
        controller.close();
        return;
      }

      const nextOffset = Math.min(pulledBytes + 128, assetBytes.length);
      controller.enqueue(assetBytes.slice(pulledBytes, nextOffset));
      pulledBytes = nextOffset;
    },
  });
  const partial = await worker.fetch(
    new Request("https://aipetsagent.com/downloads/1a559b86621a992abf2691d5e429cdf0b13d2716/aries-ramcrest-duck.zip", {
      headers: { range: "bytes=128-383" },
    }),
    {
      ASSETS: {
        fetch: async (assetRequest) => {
          fetchedAssetUrl = assetRequest.url;
          return new Response(body, {
            headers: {
              "content-length": String(assetBytes.length),
              "content-type": "application/zip",
              etag: '"test-release"',
            },
          });
        },
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(partial.status, 206);
  assert.equal(partial.headers.get("accept-ranges"), "bytes");
  assert.equal(partial.headers.get("content-range"), "bytes 128-383/4096");
  assert.equal(partial.headers.get("content-length"), "256");
  assert.equal(partial.headers.get("cache-control"), "public, max-age=31536000, immutable");
  assert.equal(
    partial.headers.get("cloudflare-cdn-cache-control"),
    "public, max-age=31536000, immutable",
  );
  assert.equal(partial.headers.get("content-disposition"), 'attachment; filename="aries-ramcrest-duck.zip"');
  assert.equal(new URL(fetchedAssetUrl).pathname, "/downloads/aries-ramcrest-duck.zip");
  assert.equal(new URL(fetchedAssetUrl).search, "");
  assert.deepEqual(
    new Uint8Array(await partial.arrayBuffer()),
    assetBytes.slice(128, 384),
  );
  assert.ok(pulledBytes < assetBytes.length, "a small range must not consume the full ZIP body");
});

test("rejects stale or malformed versioned ZIP aliases before touching asset storage", async () => {
  const worker = await loadBuiltWorker();
  let assetFetches = 0;
  const env = {
    ASSETS: {
      fetch: async () => {
        assetFetches += 1;
        return new Response("unexpected");
      },
    },
  };
  const context = { waitUntil() {}, passThroughOnException() {} };
  const paths = [
    "/downloads/0000000000000000000000000000000000000000/aries-ramcrest-duck.zip",
    "/downloads/not-a-commit/aries-ramcrest-duck.zip",
    "/downloads/1a559b86621a992abf2691d5e429cdf0b13d2716/example.zip",
    "/downloads/1a559b86621a992abf2691d5e429cdf0b13d2716/constructor.zip",
    "/downloads/1a559b86621a992abf2691d5e429cdf0b13d2716/hatch-pet.zip",
  ];

  for (const path of paths) {
    const response = await worker.fetch(new Request(`https://aipetsagent.com${path}`), env, context);
    assert.equal(response.status, 404, path);
    assert.equal(response.headers.get("cache-control"), "private, no-store");
  }
  assert.equal(assetFetches, 0);
});

test("serves each new pet only within its own release namespace", async () => {
  const [worker, releaseModule] = await Promise.all([loadBuiltWorker(), loadPetReleaseModule()]);
  const context = { waitUntil() {}, passThroughOnException() {} };

  for (const id of deskCornerIds) {
    const release = releaseModule.getPetRelease(id);
    assert.ok(release?.releaseCommit, `${id} needs final release metadata`);
    const archive = await readFile(new URL(`../public/downloads/${id}.zip`, import.meta.url));
    let fetches = 0;
    const env = {
      ASSETS: {
        fetch: async (request) => {
          fetches += 1;
          assert.equal(new URL(request.url).pathname, `/downloads/${id}.zip`);
          return new Response(archive, {
            headers: {
              "content-length": String(archive.length),
              "content-type": "application/zip",
              etag: `"${release.sha256}"`,
            },
          });
        },
      },
    };
    const validUrl = releaseModule.getPetPackageUrl(id);
    const response = await worker.fetch(new Request(validUrl), env, context);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "public, max-age=31536000, immutable");
    assert.equal(sha256(new Uint8Array(await response.arrayBuffer())), release.sha256);
    for (const wrongUrl of [
      validUrl.replace(release.releaseCommit, releaseModule.PET_RELEASE_COMMIT),
      validUrl.replace(
        release.releaseCommit,
        releaseModule.getPetReleaseCommit(["foldlume", "eavie", "mendmoth"].includes(id) ? "dewbert" : "foldlume"),
      ),
      validUrl.replace(release.releaseCommit, "0000000000000000000000000000000000000000"),
      validUrl.replace(`${id}.zip`, "aries-ramcrest-duck.zip"),
      validUrl.replace(`${id}.zip`, "hatch-pet.zip"),
      validUrl.replace(`${id}.zip`, "unknown-pet.zip"),
    ]) {
      const rejected = await worker.fetch(new Request(wrongUrl), env, context);
      assert.equal(rejected.status, 404, wrongUrl);
    }
    assert.equal(fetches, 1, "wrong release aliases must not reach asset storage");
  }
});

test("serves the pinned Hatch skill archive and restricts its release namespace", async () => {
  const worker = await loadBuiltWorker();
  const archive = await readFile(new URL("../public/downloads/hatch-pet.zip", import.meta.url));
  const pinnedUrl = "https://aipetsagent.com/downloads/6bfce72ca689966918c3bb85c68007914a27f54c/hatch-pet.zip";
  const expectedSha256 = "eca94ccace67c739ecc687986e096ba1f3d2a3d43233ff38c18918e516bc578f";
  let fetches = 0;
  const env = {
    ASSETS: {
      fetch: async (request) => {
        fetches += 1;
        assert.equal(new URL(request.url).pathname, "/downloads/hatch-pet.zip");
        return new Response(archive, {
          headers: {
            "content-length": String(archive.length),
            "content-type": "application/zip",
            etag: `"${expectedSha256}"`,
          },
        });
      },
    },
  };
  const context = { waitUntil() {}, passThroughOnException() {} };
  const full = await worker.fetch(new Request(pinnedUrl), env, context);
  assert.equal(full.status, 200);
  assert.equal(sha256(new Uint8Array(await full.arrayBuffer())), expectedSha256);
  assert.equal(full.headers.get("cache-control"), "public, max-age=31536000, immutable");

  const partial = await worker.fetch(
    new Request(pinnedUrl, { headers: { range: "bytes=0-255" } }), env, context,
  );
  assert.equal(partial.status, 206);
  assert.equal(partial.headers.get("content-range"), `bytes 0-255/${archive.length}`);
  assert.deepEqual(new Uint8Array(await partial.arrayBuffer()), new Uint8Array(archive.subarray(0, 256)));

  const wrongFile = await worker.fetch(
    new Request(pinnedUrl.replace("hatch-pet.zip", "desk-compiler-mole-mazai.zip")), env, context,
  );
  assert.equal(wrongFile.status, 404);
  assert.equal(fetches, 2, "the skill release must not expose pet ZIPs or touch storage for invalid aliases");
});

test("advanced install commands stop on conflicts and never force an overwrite", async () => {
  const installPanel = await readFile(
    new URL("../app/_components/InstallCommandPanel.tsx", import.meta.url),
    "utf8",
  );

  assert.match(installPanel, /Test-Path -LiteralPath \$target/);
  assert.match(installPanel, /\[ -e "\$target" \]/);
  assert.doesNotMatch(installPanel, /Expand-Archive[^\n]*-Force/);
  assert.doesNotMatch(installPanel, /unzip -o/);
});
