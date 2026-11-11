import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import sharp from "sharp";
import { loadPetPowerModule } from "../scripts/load-pet-module.mjs";

test("power timing preserves the authored transition and loops only the awakened sequence", async () => {
  const { POWER_SPRITE, getPowerFrameAtTime } = await loadPetPowerModule();
  const transition = POWER_SPRITE.transformDurations;
  const loop = POWER_SPRITE.awakenedDurations;
  assert.equal(transition.length, 8);
  assert.equal(loop.length, 8);
  assert.ok([...transition, ...loop].every((duration) => duration >= 100));
  assert.equal(transition.reduce((sum, duration) => sum + duration, 0), 2000);
  let elapsed = 0;
  transition.forEach((duration, frame) => {
    assert.deepEqual(getPowerFrameAtTime(elapsed, transition, false), { frame, complete: false });
    assert.deepEqual(getPowerFrameAtTime(elapsed + duration - 1, transition, false), { frame, complete: false });
    elapsed += duration;
  });
  assert.deepEqual(getPowerFrameAtTime(2000, transition, false), { frame: 7, complete: true });
  assert.deepEqual(getPowerFrameAtTime(90000, transition, false), { frame: 7, complete: true });
  assert.deepEqual(getPowerFrameAtTime(-1, transition, false), { frame: 0, complete: false });
  const cycle = loop.reduce((sum, duration) => sum + duration, 0);
  assert.deepEqual(getPowerFrameAtTime(cycle, loop, true), { frame: 0, complete: false });
  assert.deepEqual(getPowerFrameAtTime(cycle * 20 + loop[0], loop, true), { frame: 1, complete: false });
});

test("power labels distinguish Bankai, a protective shield, Vollstandig and arm release", async () => {
  const { PET_POWERS, getPetPower } = await loadPetPowerModule();
  assert.deepEqual(PET_POWERS.map((power) => power.petId), [
    "bleach-ichigo", "bleach-rukia", "bleach-orihime", "bleach-uryu", "bleach-chad",
  ]);
  for (const id of ["bleach-ichigo", "bleach-rukia"]) assert.match(getPetPower(id).name.en, /Bankai/);
  for (const id of ["bleach-orihime", "bleach-uryu", "bleach-chad"]) {
    assert.doesNotMatch(getPetPower(id).name.zh, /卍解/);
    assert.doesNotMatch(getPetPower(id).name.en, /Bankai/);
  }
  assert.match(getPetPower("bleach-orihime").name.zh, /三天结盾/);
  assert.match(getPetPower("bleach-uryu").name.zh, /完圣体/);
  assert.match(getPetPower("bleach-chad").name.zh, /右臂.*左臂/);
  assert.equal(getPetPower("foldlume"), undefined);
});

test("every power strip has eight complete transparent cells and a real change of form", async () => {
  const { PET_POWERS, POWER_SPRITE, getPowerAssetUrl } = await loadPetPowerModule();
  for (const power of PET_POWERS) {
    const sequences = [];
    for (const kind of ["transform", "awakened"]) {
      const bytes = await readFile(new URL(`../public${getPowerAssetUrl(power.petId, kind)}`, import.meta.url));
      const meta = await sharp(bytes).metadata();
      assert.equal(meta.width, POWER_SPRITE.cellWidth * POWER_SPRITE.frames, `${power.petId}/${kind} width`);
      assert.equal(meta.height, POWER_SPRITE.cellHeight);
      assert.equal(meta.hasAlpha, true);
      const frames = [];
      for (let frame = 0; frame < POWER_SPRITE.frames; frame += 1) {
        const cell = sharp(bytes).extract({ left: frame * 384, top: 0, width: 384, height: 416 });
        const alpha = await cell.clone().extractChannel("alpha").raw().toBuffer();
        assert.ok(alpha.some((value) => value > 128), `${power.petId}/${kind}/${frame} must have a character`);
        assert.ok(alpha.some((value) => value === 0), `${power.petId}/${kind}/${frame} must preserve transparency`);
        for (let x = 0; x < 384; x += 1) {
          assert.equal(alpha[x], 0, `${power.petId}/${kind}/${frame} top edge`);
          assert.equal(alpha[415 * 384 + x], 0, `${power.petId}/${kind}/${frame} bottom edge`);
        }
        for (let y = 0; y < 416; y += 1) {
          assert.equal(alpha[y * 384], 0, `${power.petId}/${kind}/${frame} left edge`);
          assert.equal(alpha[y * 384 + 383], 0, `${power.petId}/${kind}/${frame} right edge`);
        }
        frames.push(await cell.webp({ lossless: true }).toBuffer());
      }
      assert.ok(new Set(frames.map((frame) => frame.toString("base64"))).size >= 5, `${power.petId}/${kind} must have authored motion`);
      sequences.push(frames);
    }
    assert.notDeepEqual(sequences[0][0], sequences[0][7], `${power.petId} must visibly unfold power`);
    const preview = await sharp(await readFile(new URL(`../public${getPowerAssetUrl(power.petId, "preview")}`, import.meta.url))).metadata();
    assert.equal(preview.width, 384);
    assert.equal(preview.height, 416);
  }
});

test("everyday and first power poses share their visible height and ground line", async () => {
  const { PET_POWERS } = await loadPetPowerModule();
  const verticalBounds = async (file, width, height) => {
    const alpha = await sharp(await readFile(file)).extract({ left: 0, top: 0, width, height }).extractChannel("alpha").raw().toBuffer();
    let top = height;
    let bottom = 0;
    for (let y = 0; y < height; y += 1) {
      if (alpha.subarray(y * width, (y + 1) * width).some((value) => value > 0)) {
        top = Math.min(top, y);
        bottom = y + 1;
      }
    }
    assert.ok(bottom > top);
    return { top, bottom };
  };
  for (const power of PET_POWERS) {
    const root = new URL(`../public/pets/${power.petId}/`, import.meta.url);
    const [rest, first] = await Promise.all([
      verticalBounds(new URL("preview.webp", root), 192, 208),
      verticalBounds(new URL("abilities/transform.webp", root), 384, 416),
    ]);
    const height = (rest.bottom - rest.top) * 2 * power.restingScale;
    const ground = 416 - (416 - rest.bottom * 2) * power.restingScale + power.restingOffsetY * 4.16;
    assert.ok(Math.abs(height - (first.bottom - first.top)) < 1, `${power.petId} must not change size on activation`);
    assert.ok(Math.abs(ground - first.bottom) < 1, `${power.petId} must not jump vertically on activation`);
  }
});
