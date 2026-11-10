import { mkdir, writeFile } from "node:fs/promises";

import { loadPetModule } from "./load-pet-module.mjs";

const publicUrl = new URL("../public/", import.meta.url);
const apiPetUrl = new URL("api/v1/pets/", publicUrl);

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

const petModule = await loadPetModule();
const updatedAt = "2026-11-11";
const apiCatalog = {
  schemaVersion: 1,
  updatedAt,
  languages: petModule.LANGUAGES,
  spriteFormat: petModule.SPRITE_FORMAT,
  animations: petModule.ANIMATIONS,
  pets: petModule.PETS,
};
const downloadCatalog = {
  schemaVersion: 1,
  updatedAt,
  format: petModule.SPRITE_FORMAT,
  pets: petModule.PETS.map((pet) => ({
    id: pet.id,
    category: pet.category,
    zodiacOrder: pet.zodiacOrder,
    displayName: pet.displayName,
    preview: pet.previewPath,
    download: pet.downloadPath,
  })),
};

await mkdir(apiPetUrl, { recursive: true });
await Promise.all([
  writeFile(new URL("api/v1/catalog.json", publicUrl), json(apiCatalog)),
  writeFile(new URL("pets/catalog.json", publicUrl), json(downloadCatalog)),
  ...petModule.PETS.map((pet) =>
    writeFile(
      new URL(`${pet.id}.json`, apiPetUrl),
      json({
        schemaVersion: 1,
        updatedAt,
        languages: petModule.LANGUAGES,
        spriteFormat: petModule.SPRITE_FORMAT,
        animationKeys: petModule.ANIMATION_KEYS,
        pet,
      }),
    ),
  ),
]);

console.log(`Synced catalogs for ${petModule.PETS.length} pets.`);
