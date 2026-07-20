import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(new URL(path, "http://localhost/"), {
      headers: { accept: "text/html", host: "localhost" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the complete Codex Pets landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="zh-CN"/i);
  assert.match(html, /<title>Codex Pets｜会回应工作的桌面搭子<\/title>/i);
  assert.match(html, /CODEX PETS/);
  assert.match(html, /它会跟上 Codex 的每一次忙碌/);
  assert.match(html, /HATCH PET SKILL/);
  assert.match(html, /preview\.webp/);
  assert.doesNotMatch(html, /spritesheet\.webp/);
  assert.match(html, /https:\/\/aipetsagent\.com\/og-v2\.png/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Building your site/i);
});

test("server-renders all thirteen lightweight roster cards", async () => {
  const response = await render("/pets?lang=zh");
  assert.equal(response.status, 200);

  const html = await response.text();
  const previewReferences = html.match(/preview\.webp/g) ?? [];
  assert.ok(previewReferences.length >= 13);
  assert.doesNotMatch(html, /spritesheet\.webp/);
  assert.match(html, /星铠团团/);
  assert.match(html, /白羊金翎鸭/);
  assert.match(html, /双鱼鳍辉鸭/);
  assert.match(html, /13 份性格，13 种回应/);
});

test("gives every pet page an editorial story and an on-demand playground", async () => {
  const response = await render("/pets/star-armor-tuantuan?lang=zh");
  assert.equal(response.status, 200);
  assert.equal(
    response.headers.get("cache-control"),
    "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
  );

  const html = await response.text();
  assert.match(html, /青铜见习守护猫/);
  assert.match(html, /一副由半途计划长成的青铜星铠/);
  assert.match(html, /LIVE PLAYGROUND/);
  assert.match(html, /选择一个状态唤醒它/);
  assert.match(html, /preview\.webp/);
  assert.doesNotMatch(html, /spritesheet\.webp/);
});

test("renders the English pet edition with localized metadata", async () => {
  const response = await render("/pets/star-armor-tuantuan?lang=en");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>Star-Armor Tuantuan \| Codex Pets character story<\/title>/);
  assert.match(html, /lang="en"/);
  assert.match(html, /The Bronze Armor Built From Second Chances/);
  assert.doesNotMatch(html, /spritesheet\.webp/);
});

test("removes all temporary starter preview infrastructure", async () => {
  const [page, homeExperience, spritePet, petData, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/_components/HomeExperience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/_components/SpritePet.tsx", import.meta.url), "utf8"),
    readFile(new URL("../lib/pets.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /HomeExperience/);
  assert.match(homeExperience, /work.*wait.*done/s);
  assert.match(spritePet, /spritesheet\.webp/);
  assert.match(petData, /star-armor-tuantuan/);
  assert.match(layout, /export const metadata/);
  assert.match(layout, /og-v2\.png/);
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
});

test("ships thirteen valid v2 pet packages and their downloads", async () => {
  const expected = [
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

  for (const id of expected) {
    const petRoot = new URL(`../public/pets/${id}/`, import.meta.url);
    const manifest = JSON.parse(await readFile(new URL("pet.json", petRoot), "utf8"));
    const spritesheet = await stat(new URL("spritesheet.webp", petRoot));
    const preview = await stat(new URL("preview.webp", petRoot));
    const archive = await stat(new URL(`../public/downloads/${id}.zip`, import.meta.url));

    assert.equal(manifest.id, id);
    assert.equal(manifest.spriteVersionNumber, 2);
    assert.equal(manifest.spritesheetPath, "spritesheet.webp");
    assert.ok(spritesheet.size > 2_000_000);
    assert.ok(preview.size > 20_000 && preview.size < 100_000);
    assert.ok(archive.size > 2_000_000);
  }

  const catalog = JSON.parse(
    await readFile(new URL("../public/pets/catalog.json", import.meta.url), "utf8"),
  );
  const skillArchive = await stat(
    new URL("../public/downloads/hatch-pet.zip", import.meta.url),
  );
  const socialCard = await stat(new URL("../public/og-v2.png", import.meta.url));

  assert.equal(catalog.pets.length, 13);
  assert.equal(catalog.format.spriteVersionNumber, 2);
  assert.ok(skillArchive.size > 50_000);
  assert.ok(socialCard.size > 500_000);
});
