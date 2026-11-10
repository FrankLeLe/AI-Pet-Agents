import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

const desktopWorkPets = {
  "desk-compiler-mole-mazai": "码仔 · 编译鼹鼠",
  "desk-test-beetle-diandian": "点点 · 测试甲虫",
  "desk-review-owl-jiaojiao": "校校 · 审阅猫头鹰",
  "desk-search-hound-xiuxiu": "嗅嗅 · 搜索猎犬",
  "desk-plan-beaver-gege": "格格 · 规划海狸",
  "desk-deploy-pigeon-yundi": "云递 · 部署信鸽",
  "desk-memory-squirrel-licun": "栗存 · 记忆松鼠",
  "desk-data-octopus-duoduo": "多多 · 数据章鱼",
  "desk-design-red-panda-caiwei": "彩尾 · 设计小熊猫",
  "desk-security-hedgehog-dundun": "盾盾 · 安全刺猬",
  "desk-waiting-sloth-manman": "慢慢 · 等待树懒",
  "desk-debug-salamander-huohua": "火花 · 调试火蜥蜴",
};

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(new URL(path, "https://localhost/"), {
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

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  return (await import(workerUrl.href)).default;
}

test("server-renders the complete Codex Pets landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="zh-CN"/i);
  assert.match(html, /<title>Codex Pets｜给 Codex 选一位会动的伙伴<\/title>/i);
  assert.match(html, /CODEX PETS/);
  assert.match(html, /星轨向导/);
  assert.match(html, /金羽十二星/);
  assert.match(html, /十二星座守护鸭系列/);
  assert.match(html, /星轨纪事/);
  assert.match(html, /呼噜事务所/);
  assert.match(html, /Q版品种猫/);
  assert.match(html, /桌面工作小队/);
  assert.match(html, /preview\.webp/);
  assert.doesNotMatch(html, /spritesheet\.webp/);
  assert.match(html, /https:\/\/aipetsagent\.com\/og-series\.png/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Building your site/i);
});

test("features the desktop work crew in both home editions and preserves older collections", async () => {
  const [zhResponse, enResponse] = await Promise.all([
    render("/?lang=zh"),
    render("/?lang=en"),
  ]);
  assert.equal(zhResponse.status, 200);
  assert.equal(enResponse.status, 200);

  const [zhHtml, enHtml] = await Promise.all([
    zhResponse.text(),
    enResponse.text(),
  ]);

  assert.equal((zhHtml.match(/<h1\b/g) ?? []).length, 1);
  assert.match(zhHtml, /<h2[^>]*>呼噜事务所<\/h2>/);
  assert.match(zhHtml, /<h2[^>]*>金羽十二星<\/h2>/);
  assert.match(zhHtml, /<h2[^>]*>桌面工作小队<\/h2>/);
  assert.ok(
    zhHtml.indexOf("桌面工作小队") < zhHtml.indexOf("呼噜事务所"),
    "the newly launched work crew should appear before earlier collections",
  );
  assert.match(zhHtml, /href="#characters"/);
  assert.match(zhHtml, /id="characters"/);
  assert.match(zhHtml, /href="\/pets\/cat-ragdoll-yunduo\?lang=zh"/);
  assert.match(zhHtml, /href="\/pets\/cat-abyssinian-hongsha\?lang=zh"/);
  for (const id of Object.keys(desktopWorkPets)) {
    assert.ok(zhHtml.includes(`href="/pets/${id}?lang=zh"`), `${id} needs a homepage entry`);
    assert.ok(enHtml.includes(`href="/pets/${id}?lang=en"`), `${id} needs an English homepage entry`);
  }
  assert.equal((zhHtml.match(/href="#characters"/g) ?? []).length, 1);
  assert.match(zhHtml, /星铠团团/);
  assert.match(zhHtml, /button[^>]*aria-label="点击星铠团团打个招呼"/);
  assert.match(zhHtml, /安静陪一会/);
  assert.match(zhHtml, /轻快去探路/);
  assert.match(zhHtml, /他们的故事/);
  assert.match(zhHtml, /读故事/);
  assert.ok(
    zhHtml.indexOf('id="characters"') < zhHtml.indexOf("他们的故事"),
    "character selection should appear before the optional story",
  );
  assert.equal(
    (
      zhHtml.match(
        /href="\/series\/cat-companion-club\?lang=zh#story"/g,
      ) ?? []
    ).length,
    1,
  );
  assert.doesNotMatch(
    zhHtml,
    /先试玩，喜欢再安装|选宠<\/li>|试玩<\/li>|安装<\/li>|安装前先看清楚|无需登录，免费下载|只添加宠物文件，不改 Codex 设置/,
  );

  assert.equal((enHtml.match(/<h1\b/g) ?? []).length, 1);
  assert.match(enHtml, /<html[^>]*lang="en"/i);
  assert.match(enHtml, /rel="canonical" href="https:\/\/aipetsagent\.com\/\?lang=en"/);
  assert.match(enHtml, /hrefLang="zh-CN" href="https:\/\/aipetsagent\.com\/\?lang=zh"/);
  assert.match(enHtml, /<h2[^>]*>The Purr Bureau<\/h2>/);
  assert.match(enHtml, /<h2[^>]*>Golden Feather Constellation<\/h2>/);
  assert.equal((enHtml.match(/href="#characters"/g) ?? []).length, 1);
  assert.match(enHtml, /aria-label="Click Star-Armor Tuantuan to say hello"/);
  assert.match(enHtml, /Quiet company/);
  assert.match(enHtml, /Explore with ease/);
  assert.doesNotMatch(
    enHtml,
    /Try one first, then install|CHOOSE · PREVIEW · INSTALL|Know before you install|No account, free download|Adds only pet files/,
  );
});

test("gives hatch users one short state-driven Codex path", async () => {
  const [zhResponse, enResponse, hatchSource, hatchStyles] = await Promise.all([
    render("/hatch?lang=zh"),
    render("/hatch?lang=en"),
    readFile(new URL("../app/hatch/HatchExperience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/hatch/hatch.module.css", import.meta.url), "utf8"),
  ]);

  assert.equal(zhResponse.status, 200);
  assert.equal(enResponse.status, 200);

  const [zhHtml, enHtml] = await Promise.all([
    zhResponse.text(),
    enResponse.text(),
  ]);

  assert.equal((zhHtml.match(/<h1\b/g) ?? []).length, 1);
  assert.match(zhHtml, /带你的宠物回家/);
  assert.match(zhHtml, /创造您的宠物/);
  assert.match(zhHtml, /第一次使用/);
  assert.match(zhHtml, /已经装好/);
  assert.match(zhHtml, /data-hatch-mode="first"/);
  assert.match(zhHtml, /data-copy-state="idle"/);
  assert.match(zhHtml, /复制，去 Codex 安装/);
  assert.match(zhHtml, /查看安装内容与来源/);
  assert.match(zhHtml, /选择一个动作试试/);
  assert.match(zhHtml, /先试玩已有宠物/);
  assert.match(zhHtml, /\/pets\/star-armor-tuantuan\/web\/animations\/idle\.webp/);
  assert.doesNotMatch(
    zhHtml,
    /装一次，以后|附图发一句就能开始|你现在到哪一步|把造宠能力装进 Codex|你只需要做三件事|暂时不想自己做|不要粘贴到终端/,
  );

  assert.match(enHtml, /BRING YOUR PET HOME/);
  assert.match(enHtml, /CREATE YOUR PET/);
  assert.match(enHtml, /First time/);
  assert.match(enHtml, /Already installed/);
  assert.match(enHtml, /COPY TO INSTALL IN CODEX/);
  assert.match(enHtml, /TRY A FINISHED PET/);
  assert.doesNotMatch(
    enHtml,
    /INSTALL ONCE\. ATTACH AN IMAGE|WHERE ARE YOU NOW|YOU ONLY DO THREE THINGS|NOT READY TO MAKE YOUR OWN/,
  );

  assert.match(hatchSource, /6bfce72ca689966918c3bb85c68007914a27f54c/);
  assert.match(hatchSource, /eca94ccace67c739ecc687986e096ba1f3d2a3d43233ff38c18918e516bc578f/);
  assert.match(hatchSource, /setCopyState\(didCopy \? "success" : "error"\)/);
  assert.match(hatchSource, /data-copy-state=\{copyState\}/);
  assert.doesNotMatch(hatchSource, /InstallCommandPanel/);
  assert.doesNotMatch(hatchStyles, /white-space:\s*nowrap|threeThings|promptPreview|modeHeading/);
});

test("server-renders the guide and the series hierarchy without fixed roster copy", async () => {
  const response = await render("/pets?lang=zh");
  assert.equal(response.status, 200);

  const html = await response.text();
  const previewReferences = html.match(/preview\.webp/g) ?? [];
  assert.ok(previewReferences.length >= 13);
  assert.doesNotMatch(html, /spritesheet\.webp/);
  assert.match(html, /星铠团团/);
  assert.match(html, /星轨向导/);
  assert.doesNotMatch(html, /先选系列，再看角色|安装入口|找到合适的安装方式/);
  assert.match(html, /白羊·金翎/);
  assert.match(html, /双鱼·梦鳍/);
  assert.match(html, /金羽十二星/);
  assert.match(html, /呼噜事务所/);
  assert.match(html, /云朵/);
  assert.match(html, /红砂/);
  assert.match(html, /横向滑动查看更多角色/);
  assert.doesNotMatch(html, /13 份性格|ROSTER \/ 13|为你找到 13/);
  assert.ok(
    html.indexOf("呼噜事务所") < html.indexOf("金羽十二星"),
    "the newest collection should appear first in the series catalog",
  );
  assert.ok(
    html.indexOf("金羽十二星") < html.lastIndexOf("星铠团团"),
    "the series catalog should appear before the secondary Tuantuan guide card",
  );
});

test("keeps newly launched pets first on the install page", async () => {
  const response = await render("/install?lang=zh");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.ok(
    html.indexOf("云朵") < html.indexOf("白羊·金翎"),
    "newly launched cats should appear before the classic guardian ducks",
  );
  assert.ok(
    html.indexOf("红砂") < html.indexOf("星铠团团"),
    "the site guide should not displace the newly launched collection",
  );
});

test("gives every pet page a product profile and an on-demand action playground", async () => {
  const response = await render("/pets/star-armor-tuantuan?lang=zh");
  assert.equal(response.status, 200);
  assert.equal(
    response.headers.get("cache-control"),
    "public, max-age=0, must-revalidate",
  );
  assert.equal(
    response.headers.get("cloudflare-cdn-cache-control"),
    "public, max-age=3600, stale-while-revalidate=86400, stale-if-error=86400",
  );
  assert.equal(
    response.headers.get("strict-transport-security"),
    "max-age=31536000; includeSubDomains",
  );

  const html = await response.text();
  assert.match(html, /星轨向导/);
  assert.match(html, /团团的第一班岗/);
  assert.match(html, /PET PLAYGROUND/);
  assert.match(html, /在等你/);
  assert.match(html, /先玩一下/);
  assert.match(html, /一起玩会儿/);
  assert.match(html, /带回 Codex/);
  assert.ok(
    html.indexOf('href="#playground"') <
      html.indexOf('href="/install/star-armor-tuantuan?lang=zh#codex-install"'),
    "the preview action should appear before installation",
  );
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
  assert.match(html, /Try it now/);
  assert.match(html, /PLAY TOGETHER/);
  assert.match(html, /Bring to Codex/);
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
  assert.match(html, /痛快开个头/);
  assert.match(html, /横向滑动查看更多角色/);
  assert.doesNotMatch(html, /ROSTER|spritesheet\.webp/);
  assert.match(
    html,
    /href="\/series\/golden-feather-constellation\?lang=en"/,
    "the language switch should stay on the current series",
  );
  assert.match(
    html,
    /href="\/pets\?lang=zh"[^>]*aria-current="page"/,
    "the parent pet index should remain active on a series page",
  );
  assert.ok(
    html.indexOf('id="characters"') < html.indexOf('id="story"'),
    "character selection should appear before the long-form series story",
  );
});

test("renders the chibi breed cat collection and its independent product journey", async () => {
  const [seriesResponse, petResponse, installResponse] = await Promise.all([
    render("/series/cat-companion-club?lang=zh"),
    render("/pets/cat-ragdoll-yunduo?lang=zh"),
    render("/install/cat-ragdoll-yunduo?lang=zh"),
  ]);
  [seriesResponse, petResponse, installResponse].forEach((response) =>
    assert.equal(response.status, 200),
  );

  const [seriesHtml, petHtml, installHtml] = await Promise.all([
    seriesResponse.text(),
    petResponse.text(),
    installResponse.text(),
  ]);

  assert.match(seriesHtml, /呼噜事务所/);
  assert.match(seriesHtml, /窗台值班簿/);
  for (const name of ["云朵", "银饼", "蓝圆圆", "林王", "海盐", "松露", "雪糕", "金豹", "雾蓝", "卷卷", "月光", "红砂"]) {
    assert.match(seriesHtml, new RegExp(name));
  }
  assert.match(petHtml, /软垫陪伴猫/);
  assert.match(petHtml, /同系列伙伴/);
  assert.match(installHtml, /云朵/);
  assert.match(installHtml, /cat-ragdoll-yunduo\.zip/);
});

test("exposes all twelve desktop companions through the series, index and installation routes", async () => {
  const [seriesResponse, englishResponse, indexResponse, sitemapResponse] = await Promise.all([
    render("/series/desktop-work-crew?lang=zh"),
    render("/series/desktop-work-crew?lang=en"),
    render("/pets?lang=zh"),
    render("/sitemap.xml"),
  ]);
  for (const response of [seriesResponse, englishResponse, indexResponse, sitemapResponse]) {
    assert.equal(response.status, 200);
  }
  const [seriesHtml, englishHtml, indexHtml, sitemap] = await Promise.all([
    seriesResponse.text(), englishResponse.text(), indexResponse.text(), sitemapResponse.text(),
  ]);
  assert.match(seriesHtml, /桌面工作小队/);
  assert.match(seriesHtml, /id="story"/);
  assert.match(englishHtml, /<html[^>]*lang="en"/);
  assert.match(indexHtml, /href="\/series\/desktop-work-crew\?lang=zh"/);
  assert.ok(indexHtml.indexOf("桌面工作小队") < indexHtml.indexOf("呼噜事务所"));
  assert.ok(sitemap.includes("https://aipetsagent.com/series/desktop-work-crew"));

  for (const [id, name] of Object.entries(desktopWorkPets)) {
    for (const html of [seriesHtml, indexHtml]) {
      assert.ok(html.includes(`href="/pets/${id}?lang=zh"`), `${id} needs a reachable detail page`);
      assert.ok(html.includes(name.split(" · ")[0]), `${id} needs its authored character name`);
    }
    assert.ok(englishHtml.includes(`href="/pets/${id}?lang=en"`));
    assert.ok(sitemap.includes(`https://aipetsagent.com/pets/${id}`));
    assert.ok(sitemap.includes(`https://aipetsagent.com/install/${id}`));
    const [detailResponse, installResponse] = await Promise.all([
      render(`/pets/${id}?lang=zh`),
      render(`/install/${id}?lang=zh`),
    ]);
    assert.equal(detailResponse.status, 200, id);
    assert.equal(installResponse.status, 200, id);
    const [detailHtml, installHtml] = await Promise.all([detailResponse.text(), installResponse.text()]);
    assert.ok(detailHtml.includes(name), `${id} detail must use its full published name`);
    assert.match(detailHtml, /同系列伙伴/);
    assert.ok(installHtml.includes(name));
    assert.ok(installHtml.includes(`/downloads/${id}.zip`));
    assert.match(installHtml, /data-install-method="codex"/);
    assert.match(installHtml, /data-install-method="zip"/);
  }
});

test("keeps page and card slogans short across the main journey", async () => {
  const routes = [
    "/?lang=zh",
    "/series/golden-feather-constellation?lang=zh",
    "/pets/aries-ramcrest-duck?lang=zh",
    "/install?lang=zh",
    "/install/aries-ramcrest-duck?lang=zh",
    "/help?lang=zh",
    "/help?lang=en",
  ];
  const responses = await Promise.all(routes.map((route) => render(route)));
  responses.forEach((response) => assert.equal(response.status, 200));
  const [home, series, pet, installIndex, installDetail, help, helpEnglish] =
    await Promise.all(responses.map((response) => response.text()));

  assert.match(home, /让等待有个伴/);
  assert.match(home, /挑一只陪你今天/);
  assert.match(series, /找一位合拍的守护鸭/);
  assert.match(series, /痛快开个头/);
  assert.match(pet, /一起玩会儿/);
  assert.match(pet, /同系列伙伴/);
  assert.match(installIndex, /选一位伙伴/);
  assert.match(installIndex, /全部伙伴/);
  assert.match(installDetail, /用 Codex 安装/);
  assert.match(help, /宠物没出现？/);
  assert.match(help, /常见问题/);
  assert.match(help, /文件结构/);
  assert.match(help, /素材授权/);
  assert.match(helpEnglish, /PET MISSING?/);
  assert.match(helpEnglish, /CHECK 3/);

  const combined = [
    home,
    series,
    pet,
    installIndex,
    installDetail,
    help,
    helpEnglish,
  ].join("\n");
  assert.ok(
    (combined.match(/data-copy-role="page-headline"/g) ?? []).length >= 3,
    "top-level routes should mark their primary headline",
  );
  assert.ok(
    (combined.match(/data-copy-role="card-headline"/g) ?? []).length >= 8,
    "major cards should mark the copy that must stay concise",
  );
  assert.doesNotMatch(
    combined,
    /让每一次等待，都有个会动的伙伴|每位角色，各守一段星轨|把「[^」]+」带回 Codex|问题不藏在盔甲里|两个文件，结构要准确/,
  );
});

test("keeps responsive product actions free of internal funnel copy", async () => {
  const [
    petDetailPage,
    petPlayground,
    homeCss,
    seriesCss,
    installCss,
    siteChromeCss,
    globals,
  ] = await Promise.all([
    readFile(new URL("../app/pets/[petId]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/_components/PetPlayground.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/home.module.css", import.meta.url), "utf8"),
    readFile(new URL("../app/series/[seriesId]/series.module.css", import.meta.url), "utf8"),
    readFile(new URL("../app/install/[petId]/install.module.css", import.meta.url), "utf8"),
    readFile(new URL("../app/_components/site-chrome.module.css", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.doesNotMatch(petDetailPage, /className=\{styles\.petDescription\}>\{story\}/);
  assert.doesNotMatch(petPlayground, /喜欢这个动作|下一步只需|Like this motion|Next, just/);
  assert.match(petPlayground, /isAwake \? \(/);
  assert.match(petPlayground, /带\$\{petName\}回 Codex/);
  assert.match(petPlayground, /#codex-install/);
  assert.doesNotMatch(homeCss, /\.heroCopy h1\s*\{[^}]*white-space:\s*nowrap/s);
  assert.doesNotMatch(homeCss, /\.seriesCopy h2\s*\{[^}]*white-space:\s*nowrap/s);
  assert.doesNotMatch(seriesCss, /\.heroCopy h1\s*\{[^}]*white-space:\s*nowrap/s);
  assert.doesNotMatch(installCss, /\.heroCopy h1\s*\{[^}]*white-space:\s*nowrap/s);
  assert.match(
    siteChromeCss,
    /@media \(max-width: 340px\)[\s\S]*?\.primaryNav a\s*\{[^}]*overflow-wrap:\s*normal;[^}]*word-break:\s*normal;/,
  );
  assert.match(globals, /--page-width:\s*1440px/);
});

test("enables Worker response caching while keeping existing assets on the direct edge path", async () => {
  const [wrangler, staticHeaders] = await Promise.all([
    readFile(new URL("../wrangler.jsonc", import.meta.url), "utf8"),
    readFile(new URL("../public/_headers", import.meta.url), "utf8"),
  ]);

  assert.match(wrangler, /"cache"\s*:\s*\{[^}]*"enabled"\s*:\s*true/s);
  assert.doesNotMatch(wrangler, /"run_worker_first"/);
  assert.match(staticHeaders, /\/assets\/\*[\s\S]*max-age=31536000, immutable/);
  assert.match(staticHeaders, /Strict-Transport-Security: max-age=31536000; includeSubDomains/);
  assert.match(staticHeaders, /\/pets\/\*/);
  assert.match(
    staticHeaders,
    /\/downloads\/\*[\s\S]*Cache-Control: public, max-age=0, must-revalidate/,
  );
  assert.match(
    staticHeaders,
    /\/downloads\/\*[\s\S]*Cloudflare-CDN-Cache-Control: public, max-age=604800, stale-while-revalidate=2592000, stale-if-error=2592000/,
  );
  assert.match(staticHeaders, /\/api\/v1\/\*/);
});

test("ships crawler metadata and restores deferred hash targets", async () => {
  const [robots, navigationEnhancements, siteChrome] = await Promise.all([
    readFile(new URL("../public/robots.txt", import.meta.url), "utf8"),
    readFile(new URL("../app/_components/NavigationEnhancements.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/_components/SiteChrome.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(robots, /Sitemap: https:\/\/aipetsagent\.com\/sitemap\.xml/);
  assert.match(navigationEnhancements, /window\.location\.hash/);
  assert.match(navigationEnhancements, /window\.location\.search/);
  assert.match(navigationEnhancements, /searchParams\.set\("lang", nextLanguage\)/);
  assert.match(navigationEnhancements, /scrollIntoView/);
  assert.match(navigationEnhancements, /focus\(\{ preventScroll: true \}\)/);
  assert.match(navigationEnhancements, /hashchange/);
  assert.match(siteChrome, /HashScrollRestorer/);
  assert.match(siteChrome, /DocumentLanguage/);
  assert.match(siteChrome, /\{ href: "\/install", zh: "安装", en: "Install" \}/);
});

test("leaves HTTPS redirects to the edge", async () => {
  const worker = await loadWorker();
  const executionContext = {
    waitUntil() {},
    passThroughOnException() {},
  };
  const env = {
    ASSETS: {
      fetch: async () => new Response("Not found", { status: 404 }),
    },
  };

  const edgeManagedRedirect = await worker.fetch(
    new Request("http://aipetsagent.com/pets?lang=zh"),
    env,
    executionContext,
  );
  assert.equal(edgeManagedRedirect.status, 200);
  assert.equal(edgeManagedRedirect.headers.get("location"), null);

  const rscResponse = await worker.fetch(
    new Request(
      "https://aipetsagent.com/pets/star-armor-tuantuan.rsc?lang=zh&_rsc",
      {
        headers: {
          accept: "text/x-component",
          rsc: "1",
        },
      },
    ),
    env,
    executionContext,
  );
  assert.equal(rscResponse.status, 200);
  assert.match(rscResponse.headers.get("content-type") ?? "", /^text\/x-component\b/i);
  assert.equal(
    rscResponse.headers.get("cache-control"),
    "public, max-age=0, must-revalidate",
  );
  assert.equal(
    rscResponse.headers.get("cloudflare-cdn-cache-control"),
    "public, max-age=3600, stale-while-revalidate=86400, stale-if-error=86400",
  );
});

test("localizes metadata and canonical URLs for every pet installation page", async () => {
  const catalog = JSON.parse(await readFile(new URL("../public/api/v1/catalog.json", import.meta.url), "utf8"));
  assert.equal(catalog.pets.length, 37);

  for (const pet of catalog.pets) {
    for (const language of ["zh", "en"]) {
      const path = `/install/${pet.id}?lang=${language}`;
      const response = await render(path);
      assert.equal(response.status, 200, path);
      const html = await response.text();
      const heading = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? "";
      const name = heading.replace(/<span\b[^>]*>[\s\S]*?<\/span>/, "").replace(/<[^>]*>/g, "").trim();
      assert.ok(name.length > 0, `${path} must identify its pet`);
      const title = language === "zh" ? `安装 ${name}｜Codex Pets` : `Install ${name} | Codex Pets`;
      assert.ok(html.includes(`<title>${title}</title>`), `${path} must localize its pet-specific title`);
      assert.ok(html.includes(`rel="canonical" href="https://aipetsagent.com${path}"`), `${path} must canonicalize to itself`);
      for (const [locale, targetLanguage] of [["zh-CN", "zh"], ["en", "en"]]) {
        assert.ok(html.includes(`hrefLang="${locale}" href="https://aipetsagent.com/install/${pet.id}?lang=${targetLanguage}"`), `${path} must link its ${locale} edition`);
      }
      assert.ok(html.includes(`property="og:title" content="${title}"`));
      assert.ok(html.includes(`property="og:url" content="https://aipetsagent.com${path}"`));
      assert.ok(html.includes(`property="og:locale" content="${language === "en" ? "en_US" : "zh_CN"}"`));
      assert.ok(html.includes(`name="twitter:title" content="${title}"`));
      assert.match(html, language === "en" ? /Copy the installation prompt or download the pet ZIP/ : /复制安装指令或下载宠物 ZIP/);
    }
  }
});

test("renders one primary Codex action and keeps manual ZIP installation secondary", async () => {
  const [response, englishResponse, installChoices] = await Promise.all([
    render("/install/aries-ramcrest-duck?lang=zh"),
    render("/install/aries-ramcrest-duck?lang=en"),
    readFile(new URL("../app/_components/InstallChoices.tsx", import.meta.url), "utf8"),
  ]);
  assert.equal(response.status, 200);
  assert.equal(englishResponse.status, 200);

  const html = await response.text();
  const englishHtml = await englishResponse.text();
  assert.match(html, /data-install-method="codex"/);
  assert.match(html, /data-priority="primary"/);
  assert.match(html, /data-copy-state="idle"/);
  assert.match(html, /data-install-method="zip"/);
  assert.match(html, /data-priority="secondary"/);
  assert.match(html, /href="\/downloads\/aries-ramcrest-duck\.zip"[^>]*download/);
  assert.match(html, /复制给 Codex/);
  assert.match(englishHtml, /Copy for Codex/);
  assert.match(html, /href="#codex-install"/);
  assert.match(html, /id="codex-install"/);
  assert.ok(
    html.indexOf('href="#codex-install"') < html.indexOf('id="install-routes"'),
    "the hero should expose the Codex-assisted route before the detailed install cards",
  );
  assert.match(html, /1a559b86621a992abf2691d5e429cdf0b13d2716/);
  assert.match(html, /fe8374142c5cf7e0203556b1376f5b403f02ce2674bc38575b165b903bcdd916/);
  assert.ok(
    html.indexOf('data-install-method="codex"') < html.indexOf('data-install-method="zip"'),
    "the primary Codex action should appear before folded manual installation",
  );
  assert.doesNotMatch(
    `${html}${englishHtml}`,
    /推荐新用户|约 30 秒|约 1–2 分钟|完成标准|四步|Recommended for new users|ABOUT 30 SECONDS|SUCCESS CHECK|FOLLOW THESE 4 STEPS/,
  );
  assert.match(installChoices, /data-copy-state=\{promptCopied/);
  assert.match(installChoices, /role="status"/);
  assert.match(installChoices, /role="alert"/);
  assert.match(installChoices, /open=\{copyFailed === "prompt"\}/);
});

test("removes all temporary starter preview infrastructure", async () => {
  const [page, homeExperience, spritePet, spritePetCss, petData, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/_components/HomeExperience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/_components/SpritePet.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/_components/sprite-pet.module.css", import.meta.url), "utf8"),
    readFile(new URL("../lib/pets.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /HomeExperience/);
  assert.match(homeExperience, /href="#characters"/);
  assert.match(homeExperience, /series\.map\(\(collection, index\)/);
  assert.match(homeExperience, /featured=\{index === 0\}/);
  assert.match(homeExperience, /HomeSeriesSection/);
  assert.match(homeExperience, /onClick=\{showNextGuideDemo\}/);
  assert.doesNotMatch(homeExperience, /pickRandomMember|Math\.random\(\)/);
  assert.match(homeExperience, /member\.specialty/);
  assert.match(homeExperience, /onKeyDown=\{handleMemberKeys\}/);
  assert.match(spritePet, /web\/animations\/\$\{animation\}\.webp/);
  assert.match(
    spritePet,
    /preloadAnimations\s*=\s*\[\]/,
    "SpritePet should accept a persistent preload set",
  );
  assert.match(
    spritePet,
    /\.\.\.preloadAnimations[\s\S]*?\.\.\.readyAnimations/,
    "preloaded and decoded actions should stay in the rendered layer set",
  );
  assert.match(
    spritePet,
    /renderedAnimations\.map\(\(layerAnimation\) =>/,
    "SpritePet should keep one persistent DOM layer per rendered action",
  );
  assert.match(
    spritePet,
    /key=\{`\$\{petId\}-\$\{layerAnimation\}`\}/,
    "action layer keys must remain stable across requests",
  );
  assert.match(
    spritePet,
    /className=\{styles\.spriteFallback\}[\s\S]*web\/preview\.webp/,
    "a local preview should remain behind cold animation loads",
  );
  assert.match(
    spritePet,
    /const prepareLayer = useCallback\([\s\S]*?typeof image\.decode[\s\S]*?image\.decode\(\)/,
    "the mounted DOM image should decode before becoming ready",
  );
  assert.match(
    spritePet,
    /onLoad=\{\(event\) => onReady\(animation, event\.currentTarget\)\}/,
    "the stable layer component should forward its mounted image to the decode path",
  );
  assert.match(spritePet, /onReady=\{prepareLayer\}/);
  assert.match(spritePet, /requestAnimationFrame\(tick\)/);
  assert.match(spritePet, /cancelAnimationFrame\(frameRequest\)/);
  assert.match(
    spritePet,
    /if \(node\.complete && node\.naturalWidth > 0\) \{[\s\S]*?prepareLayer\(layerAnimation, node\)/,
    "an already-loaded DOM layer should still enter the decode path during hydration",
  );
  assert.match(spritePet, /data-requested-animation=\{animation\}/);
  assert.match(spritePet, /data-motion-target=\{animation\}/);
  assert.match(spritePet, /data-status=\{motionStatus\}/);
  assert.match(spritePet, /aria-busy=\{motionStatus === "loading"\}/);
  assert.match(
    spritePet,
    /const motionStatus = requestedFailed[\s\S]*?\? "error"[\s\S]*?\? "loading"[\s\S]*?: "ready"/,
    "motion status should expose loading, ready, and terminal error states",
  );
  assert.match(
    spritePet,
    /onError=\{\(event\) => onFailed\(animation, event\.currentTarget\)\}/,
    "failed action layers should leave loading state through the error path",
  );
  assert.match(spritePet, /onFailed=\{markLayerFailed\}/);
  assert.match(
    spritePet,
    /if \(now >= deadline\) \{[\s\S]*?frame = \(frame \+ 1\) % displayedConfig\.frames;[\s\S]*?deadline = now \+/,
    "the animation clock should advance exactly one authored frame per tick",
  );
  assert.doesNotMatch(
    spritePet,
    /\bdo\s*\{[\s\S]*?\}\s*while\s*\(now\s*>=\s*deadline\)/,
    "the animation clock must not catch up by skipping authored frames",
  );
  const spriteLayerRules = [
    ...spritePetCss.matchAll(/(?:^|\n)\s*[^\n{]*\.spriteLayer[^\n{]*\{([^}]*)\}/g),
  ];
  assert.ok(spriteLayerRules.length >= 2, "SpritePet should define base and active layer rules");
  for (const [, declarations] of spriteLayerRules) {
    assert.doesNotMatch(
      declarations,
      /\btransition\s*:/,
      "sprite layers must switch atomically without opacity transitions",
    );
  }
  assert.match(
    spritePetCss,
    /\.spriteFallback\s*\{[^}]*width:\s*100%;[^}]*transition:\s*opacity\b[^}]*\}/s,
    "the initial preview fallback should retain its fade-out",
  );
  assert.match(
    spritePetCss,
    /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{[\s\S]*?\.spriteFallback\s*\{[^}]*transition:\s*none;?[^}]*\}/,
    "reduced-motion should disable the fallback fade",
  );
  assert.match(petData, /star-armor-tuantuan/);
  assert.match(layout, /export const metadata/);
  assert.match(layout, /og-series\.png/);
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
});

test("ships thirty-seven valid v2 pet packages and their downloads", async () => {
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
    ...Object.keys(desktopWorkPets),
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
    assert.ok(spritesheet.size > 1_500_000);
    assert.ok(preview.size > 20_000 && preview.size < 100_000);
    assert.ok(archive.size > 1_500_000);
  }

  const catalog = JSON.parse(
    await readFile(new URL("../public/pets/catalog.json", import.meta.url), "utf8"),
  );
  const skillArchive = await stat(
    new URL("../public/downloads/hatch-pet.zip", import.meta.url),
  );
  const socialCard = await stat(new URL("../public/og-series.png", import.meta.url));

  assert.equal(catalog.pets.length, 37);
  assert.equal(catalog.format.spriteVersionNumber, 2);
  assert.ok(skillArchive.size > 50_000);
  assert.ok(socialCard.size > 500_000);
});
