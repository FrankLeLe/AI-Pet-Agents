import { mkdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

import { loadPetModule } from "./load-pet-module.mjs";

const WEBP_OPTIONS = {
  quality: 85,
  alphaQuality: 100,
  effort: 5,
  smartSubsample: true,
};
const CONCURRENCY = 3;
const generatorInputMtime = Math.max(
  ...(
    await Promise.all(
      [
        import.meta.url,
        new URL("../lib/pet-animation.ts", import.meta.url),
        new URL("../lib/pets.ts", import.meta.url),
      ].map(async (path) => (await stat(fileURLToPath(path))).mtimeMs),
    )
  ),
);
const publicRoot = new URL("../public/", import.meta.url);
const petModule = await loadPetModule();
const { cellWidth, cellHeight, columns } = petModule.SPRITE_FORMAT;

async function isFresh(sourcePath, outputPath) {
  try {
    const [source, output] = await Promise.all([
      stat(sourcePath),
      stat(outputPath),
    ]);
    return output.mtimeMs >= Math.max(source.mtimeMs, generatorInputMtime);
  } catch {
    return false;
  }
}

async function encodePreview(petId) {
  const sourcePath = fileURLToPath(
    new URL(`pets/${petId}/preview.webp`, publicRoot),
  );
  const outputPath = fileURLToPath(
    new URL(`pets/${petId}/web/preview.webp`, publicRoot),
  );

  if (!(await isFresh(sourcePath, outputPath))) {
    await sharp(sourcePath).webp(WEBP_OPTIONS).toFile(outputPath);
  }
}

async function encodeAnimation(petId, animation) {
  const sourcePath = fileURLToPath(
    new URL(`pets/${petId}/spritesheet.webp`, publicRoot),
  );
  const outputPath = fileURLToPath(
    new URL(
      `pets/${petId}/web/animations/${animation.key}.webp`,
      publicRoot,
    ),
  );

  if (await isFresh(sourcePath, outputPath)) return;

  const segmentCount = Math.ceil(animation.frames / columns);
  const segments = await Promise.all(
    Array.from({ length: segmentCount }, async (_, segmentIndex) => {
      const frames = Math.min(
        columns,
        animation.frames - segmentIndex * columns,
      );
      const input = await sharp(sourcePath)
        .extract({
          left: 0,
          top: (animation.row + segmentIndex) * cellHeight,
          width: frames * cellWidth,
          height: cellHeight,
        })
        .toBuffer();

      return {
        input,
        left: segmentIndex * columns * cellWidth,
        top: 0,
      };
    }),
  );

  await sharp({
    create: {
      width: animation.frames * cellWidth,
      height: cellHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(segments)
    .webp(WEBP_OPTIONS)
    .toFile(outputPath);
}

async function buildPet(pet) {
  const webRoot = new URL(`pets/${pet.id}/web/animations/`, publicRoot);
  await mkdir(webRoot, { recursive: true });
  await encodePreview(pet.id);
  await Promise.all(
    petModule.ANIMATIONS.map((animation) =>
      encodeAnimation(pet.id, animation),
    ),
  );
}

const queue = [...petModule.PETS];
await Promise.all(
  Array.from(
    { length: Math.min(CONCURRENCY, queue.length) },
    async () => {
      while (queue.length > 0) {
        const pet = queue.shift();
        if (pet) await buildPet(pet);
      }
    },
  ),
);

console.log(
  `Built lightweight web previews and animation strips for ${petModule.PETS.length} pets.`,
);
