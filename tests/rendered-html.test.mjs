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
  assert.match(html, /<title>Codex Pets｜给 Codex 选一位会动的伙伴<\/title>/i);
  assert.match(html, /CODEX PETS/);
  assert.match(html, /团团向导/);
  assert.match(html, /金羽十二星/);
  assert.match(html, /星轨纪事/);
  assert.match(html, /preview\.webp/);
  assert.doesNotMatch(html, /spritesheet\.webp/);
  assert.match(html, /https:\/\/aipetsagent\.com\/og-series\.png/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Building your site/i);
});

test("server-renders the guide and the series hierarchy without fixed roster copy", async () => {
  const response = await render("/pets?lang=zh");
  assert.equal(response.status, 200);

  const html = await response.text();
  const previewReferences = html.match(/preview\.webp/g) ?? [];
  assert.ok(previewReferences.length >= 13);
  assert.doesNotMatch(html, /spritesheet\.webp/);
  assert.match(html, /星铠团团/);
  assert.match(html, /白羊·金翎/);
  assert.match(html, /双鱼·梦鳍/);
  assert.match(html, /金羽十二星/);
  assert.match(html, /横向滑动查看更多角色/);
  assert.doesNotMatch(html, /13 份性格|ROSTER \/ 13|为你找到 13/);
  assert.ok(
    html.indexOf("从一个世界开始") < html.indexOf("团团向导"),
    "the series catalog should appear before the secondary Tuantuan guide card",
  );
});

test("gives every pet page a product profile and an on-demand action playground", async () => {
  const response = await render("/pets/star-armor-tuantuan?lang=zh");
  assert.equal(response.status, 200);
  assert.equal(
    response.headers.get("cache-control"),
    "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
  );

  const html = await response.text();
  assert.match(html, /团团向导/);
  assert.match(html, /团团的第一班岗/);
  assert.match(html, /ACTION PLAYGROUND/);
  assert.match(html, /选择一个动作开始试玩/);
  assert.match(html, /preview\.webp/);
  assert.doesNotMatch(html, /spritesheet\.webp/);
});

test("renders the English pet edition with localized metadata", async () => {
  const response = await render("/pets/star-armor-tuantuan?lang=en");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<title>Star-Armor Tuantuan \| Codex Pets character<\/title>/);
  assert.match(html, /lang="en"/);
  assert.match(html, /Tuantuan&#x27;s First Watch|Tuantuan's First Watch/);
  assert.doesNotMatch(html, /spritesheet\.webp/);
});

test("renders a series page with independent character entries and shared story", async () => {
  const response = await render("/series/golden-feather-constellation?lang=zh");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /金羽十二星/);
  assert.match(html, /星轨纪事/);
  assert.match(html, /白羊·金翎/);
  assert.match(html, /金牛·鎏甲/);
  assert.match(html, /把空白拆成第一步/);
  assert.match(html, /横向滑动查看更多角色/);
  assert.doesNotMatch(html, /ROSTER|spritesheet\.webp/);
  assert.ok(
    html.indexOf('id="characters"') < html.indexOf('id="story"'),
    "character selection should appear before the long-form series story",
  );
});

test("keeps mobile conversion paths ahead of supporting explanation", async () => {
  const [installPage, petDetailPage, homeCss, seriesCss, installCss, globals] = await Promise.all([
    readFile(new URL("../app/install/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/pets/[petId]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/home.module.css", import.meta.url), "utf8"),
    readFile(new URL("../app/series/[seriesId]/series.module.css", import.meta.url), "utf8"),
    readFile(new URL("../app/install/[petId]/install.module.css", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.ok(
    installPage.indexOf("styles.contentSection") < installPage.indexOf("styles.stepsSection"),
    "character install choices should appear before the three-step explanation",
  );
  assert.doesNotMatch(petDetailPage, /className=\{styles\.petDescription\}>\{story\}/);
  assert.doesNotMatch(homeCss, /\.seriesHeader h1\s*\{[^}]*white-space:\s*nowrap/s);
  assert.doesNotMatch(seriesCss, /\.heroCopy h1\s*\{[^}]*white-space:\s*nowrap/s);
  assert.doesNotMatch(installCss, /\.heroCopy h1\s*\{[^}]*white-space:\s*nowrap/s);
  assert.match(globals, /--page-width:\s*1440px/);
});

test("offers manual and Codex-assisted installation with pinned safety boundaries", async () => {
  const response = await render("/install/aries-ramcrest-duck?lang=zh");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /下载 ZIP，自己安装/);
  assert.match(html, /让 Codex 帮我安装/);
  assert.match(html, /复制给 Codex/);
  assert.match(html, /href="#codex-install"/);
  assert.match(html, /id="codex-install"/);
  assert.ok(
    html.indexOf('href="#codex-install"') < html.indexOf('id="install-routes"'),
    "the hero should expose the Codex-assisted route before the detailed install cards",
  );
  assert.match(html, /6bfce72ca689966918c3bb85c68007914a27f54c/);
  assert.match(html, /fe8374142c5cf7e0203556b1376f5b403f02ce2674bc38575b165b903bcdd916/);
  assert.match(html, /禁止静默覆盖/);
  assert.match(html, /pets\/aries-ramcrest-duck\/pet\.json/);
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
  assert.match(homeExperience, /series.*motion.*install/s);
  assert.match(spritePet, /spritesheet\.webp/);
  assert.match(petData, /star-armor-tuantuan/);
  assert.match(layout, /export const metadata/);
  assert.match(layout, /og-series\.png/);
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
  const socialCard = await stat(new URL("../public/og-series.png", import.meta.url));

  assert.equal(catalog.pets.length, 13);
  assert.equal(catalog.format.spriteVersionNumber, 2);
  assert.ok(skillArchive.size > 50_000);
  assert.ok(socialCard.size > 500_000);
});
