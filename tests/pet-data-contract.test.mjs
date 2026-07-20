import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const expectedIds = [
  "star-armor-tuantuan",
  "gemini-twincrest-duck",
  "aries-ramcrest-duck",
  "taurus-bullguard-duck",
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

async function importPetModule() {
  const source = await readFile(
    new URL("../lib/pets.ts", import.meta.url),
    "utf8",
  );
  const result = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
    reportDiagnostics: true,
  });
  const errors = (result.diagnostics ?? []).filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  );

  assert.deepEqual(errors, [], "lib/pets.ts must transpile without errors");

  const encoded = Buffer.from(result.outputText).toString("base64");
  return import(`data:text/javascript;base64,${encoded}`);
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
    importPetModule(),
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
    assert.equal(pet.downloadPath, `/downloads/${pet.id}.zip`);
    assert.equal(pet.detailPath, `/api/v1/pets/${pet.id}.json`);

    const [detail, manifest, spritesheet, archive] = await Promise.all([
      readJson(`../public/api/v1/pets/${pet.id}.json`),
      readJson(`../public/pets/${pet.id}/pet.json`),
      stat(new URL(`../public/pets/${pet.id}/spritesheet.webp`, import.meta.url)),
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
    assert.ok(archive.size > 2_000_000);
  }
});
