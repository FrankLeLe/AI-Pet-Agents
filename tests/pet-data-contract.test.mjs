import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import { loadPetModule, loadPetReleaseModule } from "../scripts/load-pet-module.mjs";

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
  assert.equal(new Set(expectedIds).size, catalog.pets.length);
});

test("publishes a self-consistent detail document for every pet", async () => {
  const catalog = await readJson("../public/api/v1/catalog.json");

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
    assert.ok(spritesheet.size > 2_000_000);
    assert.ok(preview.size > 20_000 && preview.size < 100_000);
    assert.ok(archive.size > 2_000_000);
    const webPreview = await stat(
      new URL(`../public/pets/${pet.id}/web/preview.webp`, import.meta.url),
    );
    assert.ok(
      webPreview.size < preview.size,
      `${pet.id} web preview must be smaller than its source`,
    );
    for (const animationKey of expectedAnimationKeys) {
      const strip = await stat(
        new URL(
          `../public/pets/${pet.id}/web/animations/${animationKey}.webp`,
          import.meta.url,
        ),
      );
      assert.ok(
        strip.size < 300_000,
        `${pet.id}/${animationKey} web strip exceeds the 300KB budget`,
      );
    }
    assert.equal(pet.editorial.moments.length, 3);
    assert.equal(pet.editorial.traitsZh.length, 3);
    assert.equal(pet.editorial.traitsEn.length, 3);
    assert.ok(pet.editorial.storyZh.length >= 180);
    assert.ok(pet.editorial.storyEn.length >= 300);
  }
});

test("pins every install archive to its published size and SHA-256", async () => {
  const releaseModule = await loadPetReleaseModule();
  assert.equal(releaseModule.PET_RELEASE_COMMIT, "6bfce72ca689966918c3bb85c68007914a27f54c");

  for (const id of expectedIds) {
    const archiveUrl = new URL(`../public/downloads/${id}.zip`, import.meta.url);
    const [archive, archiveStat] = await Promise.all([
      readFile(archiveUrl),
      stat(archiveUrl),
    ]);
    const expectedRelease = releaseModule.PET_RELEASES[id];

    assert.ok(expectedRelease, `${id} release metadata is missing`);
    assert.equal(expectedRelease.sizeBytes, archiveStat.size, `${id} size changed`);
    assert.equal(
      expectedRelease.sha256,
      createHash("sha256").update(archive).digest("hex"),
      `${id} SHA-256 changed`,
    );
    assert.match(releaseModule.getPetPackageUrl(id), new RegExp(`${releaseModule.PET_RELEASE_COMMIT}.+${id}\\.zip$`));
  }
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
