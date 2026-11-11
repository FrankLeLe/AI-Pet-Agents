export const PET_RELEASE_COMMIT = "1a559b86621a992abf2691d5e429cdf0b13d2716";
export const PET_RELEASE_ORIGIN = "https://aipetsagent.com";

type PetRelease = {
  readonly sizeBytes: number;
  readonly sha256: string;
  readonly releaseCommit?: string;
};

export const PET_RELEASES: Readonly<Record<string, PetRelease>> = {
  "bleach-ichigo": {
    sizeBytes: 1_534_593,
    sha256: "87799a35d4da173994d8a7562f053a5aecd294756a7447fe58aebdd6ac8fd3f3",
    releaseCommit: "03a3b0ef46fb59cb0924e75efdcbfabcbac2fc44",
  },
  "bleach-rukia": {
    sizeBytes: 1_554_117,
    sha256: "beb1fcd1656bc57d83d229fed670095715cd06db59dd6e92644d3b6cf22dba9f",
    releaseCommit: "03a3b0ef46fb59cb0924e75efdcbfabcbac2fc44",
  },
  "bleach-orihime": {
    sizeBytes: 1_430_734,
    sha256: "5cb06bd06b84247b8cd6678261cb9e82cb99ca3317b368840395192772a8fc5f",
    releaseCommit: "03a3b0ef46fb59cb0924e75efdcbfabcbac2fc44",
  },
  "bleach-uryu": {
    sizeBytes: 1_146_899,
    sha256: "e1427a3a86247b18a8e4901ad16569db7e46000190675d33135c499dcfd2a7a7",
    releaseCommit: "03a3b0ef46fb59cb0924e75efdcbfabcbac2fc44",
  },
  "bleach-chad": {
    sizeBytes: 1_721_174,
    sha256: "30274f360cf12b0b402e128d60383fd3a82e0b124758b46ef62ed96a703d4dd4",
    releaseCommit: "03a3b0ef46fb59cb0924e75efdcbfabcbac2fc44",
  },
  dewbert: {
    sizeBytes: 1_127_611,
    sha256: "1b3f796830534eae9a3a39511d939811242e350d465994d1e39427026b9aac1b",
    releaseCommit: "3f88605eddbf066bf38041cf258ddc18cf54d00f",
  },
  spriggle: {
    sizeBytes: 1_438_167,
    sha256: "44dd057907789e256dc71ddaaf1c755622184761aee0c488a728ee98a25ff6f1",
    releaseCommit: "3f88605eddbf066bf38041cf258ddc18cf54d00f",
  },
  bloomble: {
    sizeBytes: 1_509_244,
    sha256: "2c8ec06ba479beb66e4b9d1ffb458ded869fa7edf56baad2eb136c4784de0883",
    releaseCommit: "3f88605eddbf066bf38041cf258ddc18cf54d00f",
  },
  quillip: {
    sizeBytes: 1_881_091,
    sha256: "a7fc0a6ad4d0d98ad9ec61e71a7c60e1931ab44c240da67260c6c63677e58ff5",
    releaseCommit: "3f88605eddbf066bf38041cf258ddc18cf54d00f",
  },
  inklet: {
    sizeBytes: 1_749_380,
    sha256: "46d75d6fe17c3bbe7f331daacc4c840e4aaae01ec04481499098f90396c29f6c",
    releaseCommit: "3f88605eddbf066bf38041cf258ddc18cf54d00f",
  },
  buttonbud: {
    sizeBytes: 1_708_735,
    sha256: "5d94dac8713685c39b0f082fa31ceeb269ea342a279fb781983a38bf600dd1bd",
    releaseCommit: "3f88605eddbf066bf38041cf258ddc18cf54d00f",
  },
  spoolie: {
    sizeBytes: 1_539_461,
    sha256: "19abbce04120853a8d2a5926cea4d3286dc1b48b7949583bb476668f3ad95064",
    releaseCommit: "3f88605eddbf066bf38041cf258ddc18cf54d00f",
  },
  crumbit: {
    sizeBytes: 1_707_742,
    sha256: "0d1436e1fdfe355db1879bce1900bbe69e1243cbdb3e0b900748fec6e3e15bd8",
    releaseCommit: "3f88605eddbf066bf38041cf258ddc18cf54d00f",
  },
  thimblet: {
    sizeBytes: 1_817_436,
    sha256: "834ae76027d8f1ba248253628da96c217f6b7249af890fb3380ea9d02b8a9c1d",
    releaseCommit: "3f88605eddbf066bf38041cf258ddc18cf54d00f",
  },
  foldlume: {
    sizeBytes: 1_976_324,
    sha256: "541de43ba9c7831642a6a0bcc6eb271f6ce40f48171c43251251707826a6dd75",
    releaseCommit: "e5f86f8ac08565eb40d4b216bd261f816eb0cc89",
  },
  eavie: {
    sizeBytes: 1_808_042,
    sha256: "52ded776286d3f9c373aa3e36bcdc4f94feaa0d6e55b6dd87e810821dd056b77",
    releaseCommit: "e5f86f8ac08565eb40d4b216bd261f816eb0cc89",
  },
  mendmoth: {
    sizeBytes: 1_635_416,
    sha256: "958e81d4d048f2b1b35ea5c9aedea50094f22dbd6a57f4879b395572835d9b66",
    releaseCommit: "e5f86f8ac08565eb40d4b216bd261f816eb0cc89",
  },
  "star-armor-tuantuan": {
    sizeBytes: 2_939_542,
    sha256: "5e3766f059eeb89ec023a96c148023849f1ef3dfcad525a823f4521cf2a6562b",
  },
  "aries-ramcrest-duck": {
    sizeBytes: 3_615_269,
    sha256: "fe8374142c5cf7e0203556b1376f5b403f02ce2674bc38575b165b903bcdd916",
  },
  "taurus-bullguard-duck": {
    sizeBytes: 3_308_246,
    sha256: "97022e7eb11f347dd196cc12f50d0ff03b3ca54736813869e12677d4c3dfcfb5",
  },
  "gemini-twincrest-duck": {
    sizeBytes: 3_105_385,
    sha256: "7ce452af8771f844f0caad8285573fc39ef172bf8af80776c34773f3735760e5",
  },
  "cancer-shellguard-duck": {
    sizeBytes: 3_340_735,
    sha256: "dc198282969a461342749788f8d32eb7bf1043c49d6f158e941406e41562f29b",
  },
  "leo-manehelm-duck": {
    sizeBytes: 3_251_003,
    sha256: "163b79a76dc3cb776a061f1db9bd354088b4e840c076756f8f5703155b46abcf",
  },
  "virgo-lotuscrest-duck": {
    sizeBytes: 3_104_970,
    sha256: "56223890e5d36ef79b3db843b634cb22845784579fd20e283a55b0a57477997e",
  },
  "libra-balanceguard-duck": {
    sizeBytes: 3_264_909,
    sha256: "f3504d7f8053610cd17c686a90f171cdba108d13e6259d5acacf1b6bd3be3d01",
  },
  "scorpio-stingtalon-duck": {
    sizeBytes: 3_286_772,
    sha256: "2f20c1d00b195ae4d2252a53bd46939ed9487e8ca058d132e7ab3fd157c3a98b",
  },
  "sagittarius-arrowwing-duck": {
    sizeBytes: 3_732_518,
    sha256: "1762f3e1db1dc3fe62e9c368ad211528d85025ae5a8a6bc297bfef86b3755348",
  },
  "capricorn-goathorn-duck": {
    sizeBytes: 3_232_238,
    sha256: "526948211242154a631276163103284458efeaae7370164f3a11ed7b159b8c83",
  },
  "aquarius-vesselwing-duck": {
    sizeBytes: 3_288_564,
    sha256: "94bb816fcf68152ea03ddf7dc613b28f974038328dac430a250ec5d10a8ef897",
  },
  "pisces-fintail-duck": {
    sizeBytes: 3_364_313,
    sha256: "739d91bebca68bd6c3d72822169286a0d6ceb6dcc85dfb83fb60c267f4eb7401",
  },
  "cat-ragdoll-yunduo": {
    sizeBytes: 2_697_452,
    sha256: "83b38032fcb109ce7fd0b73f36757becff7814690b1922532fdc4ea183360fb3",
  },
  "cat-american-shorthair-yinbing": {
    sizeBytes: 2_642_651,
    sha256: "83a38ed31a53e7b5a9838078a09ac07afc0ac0c7703605f3ee010621feafde89",
  },
  "cat-british-shorthair-lanyuanyuan": {
    sizeBytes: 2_307_659,
    sha256: "ca0de8be2145e64c4815d6ed39e9a8251cfc86f25c0b4fa00b82416c4f5fbf09",
  },
  "cat-maine-coon-linwang": {
    sizeBytes: 3_026_843,
    sha256: "70800adf8a3b6155de9ece0c759d417fb6738fb351f3c65fe4742aeb6ce9f8be",
  },
  "cat-siamese-haiyan": {
    sizeBytes: 2_383_103,
    sha256: "31a2b1a4d6e624888228c9f88837539b0b362a9d0b262ef4d4149ebaed311456",
  },
  "cat-norwegian-forest-songlu": {
    sizeBytes: 2_836_583,
    sha256: "c165a59214218356ef6cc8e03426e3c103324cb80f23d11260ad48d1ed396898",
  },
  "cat-persian-xuegao": {
    sizeBytes: 2_278_456,
    sha256: "bcca52f6e5c15ab2118d55c9b0a9a43bc20b3a93d5cf96c7643e1fb9a2d6bac7",
  },
  "cat-bengal-jinbao": {
    sizeBytes: 2_806_723,
    sha256: "2dd3a5b7b0c42e86787fec7b4314af3e82fdfd5bc859e22b8ff4f7dac5e64f1d",
  },
  "cat-russian-blue-wulan": {
    sizeBytes: 1_965_776,
    sha256: "d8c8dddebe868dfcce68d15ae77af8f7140b5be8bd2b2e57c9ba512f0f9757dd",
  },
  "cat-devon-rex-juanjuan": {
    sizeBytes: 2_404_721,
    sha256: "d7a12830a2cd939cbdc29194ccdff647630ae8d880c38318c4714f44a10f5e31",
  },
  "cat-sphynx-yueguang": {
    sizeBytes: 2_309_607,
    sha256: "bee2d515af16542e094d0410dd7f91b65cc1802e99de0aa345202d0b2e65441d",
  },
  "cat-abyssinian-hongsha": {
    sizeBytes: 2_397_090,
    sha256: "ce5823222c45db1f5d9038d1bff144e53bea36041d35f29a7d80a23ad159bbdb",
  },
  "desk-compiler-mole-mazai": {
    sizeBytes: 2_732_606,
    sha256: "f084e5b25a3fb0093c777bcd5e6bf52cb83e46752f8365c4859ed78ddefe9b31",
  },
  "desk-test-beetle-diandian": {
    sizeBytes: 2_542_146,
    sha256: "2ea6044466238a878ac476b691ad23a31cfedd1450db339f3df09b88bb1877e5",
  },
  "desk-review-owl-jiaojiao": {
    sizeBytes: 2_794_931,
    sha256: "d2200ab2a0a4afe3409aa4770a55360d8fe5cfb89a0da16698f5e8e7e530af99",
  },
  "desk-search-hound-xiuxiu": {
    sizeBytes: 2_671_269,
    sha256: "094542938e54f47a0f7c7d5fc77be19ad3c18cd97dedfd8c546576449e5105d0",
  },
  "desk-plan-beaver-gege": {
    sizeBytes: 2_597_794,
    sha256: "813a82448717c6967e877718ee5790c09aaf43dc79fd529e3361c809be75e879",
  },
  "desk-deploy-pigeon-yundi": {
    sizeBytes: 2_700_115,
    sha256: "f84fd2621d27f8029df528ba252a1e541d66d9a0c2cdc5276524470fbc5a46ab",
  },
  "desk-memory-squirrel-licun": {
    sizeBytes: 2_821_570,
    sha256: "6b9cdf388dac1740809470ff25803e75b3f0fc25b905a15bef3e5a913d01131a",
  },
  "desk-data-octopus-duoduo": {
    sizeBytes: 2_822_736,
    sha256: "9166af1dbb2383e118f1ae06ba618ae9e5d099db96ec37725b4800d0cae1fc8b",
  },
  "desk-design-red-panda-caiwei": {
    sizeBytes: 3_141_370,
    sha256: "85e1ffa2a8389a7584ae65de4ffa34a53eda426e553240e09264bdc6752bb115",
  },
  "desk-security-hedgehog-dundun": {
    sizeBytes: 2_960_013,
    sha256: "0c019015117e7f687f055760cc0e6c97b8e0a578860bdea3f0b5f826618fe14b",
  },
  "desk-waiting-sloth-manman": {
    sizeBytes: 2_307_211,
    sha256: "7fa865f7226e23e09720d73df63245fb53d1943d21571515e852301a6d9b1df2",
  },
  "desk-debug-salamander-huohua": {
    sizeBytes: 2_360_299,
    sha256: "1670329124c842612fcfe54a31a88cb0a470645eae64b11312a74da61b120867",
  },
};

export function getPetRelease(petId: string) {
  return Object.hasOwn(PET_RELEASES, petId) ? PET_RELEASES[petId] : undefined;
}

export function getPetReleaseCommit(petId: string) {
  return getPetRelease(petId)?.releaseCommit ?? PET_RELEASE_COMMIT;
}

export function getPetPackageUrl(petId: string) {
  return `${PET_RELEASE_ORIGIN}/downloads/${getPetReleaseCommit(petId)}/${petId}.zip`;
}

export function buildCodexInstallPrompt(
  petId: string,
  petName: string,
  language: "zh" | "en",
) {
  const release = getPetRelease(petId);
  if (!release) return "";
  const packageUrl = getPetPackageUrl(petId);

  if (language === "en") {
    return `Install the Codex desktop companion “${petName}” for me.

Safety rules (follow every item):
1. Download only this immutable ZIP: ${packageUrl}
2. Verify SHA-256 exactly: ${release.sha256}
3. Resolve CODEX_HOME first; if it is not set, use ~/.codex. Only inspect or write CODEX_HOME/pets/${petId}. Do not modify any other folder.
4. Before extracting, verify the ZIP has one top-level ${petId}/ folder containing only pet.json and spritesheet.webp.
5. If CODEX_HOME/pets/${petId} already exists, stop and ask me before replacing anything. Never overwrite silently.
6. After installation, list the files you wrote and remind me to fully quit and reopen Codex Desktop.

Do not install executables, run scripts from the archive, or change my Codex configuration.`;
  }

  return `请为我安装 Codex 桌面伙伴「${petName}」。

安全边界（每一项都必须遵守）：
1. 只从这个固定版本地址下载 ZIP：${packageUrl}
2. 严格校验 SHA-256：${release.sha256}
3. 先解析 CODEX_HOME；若未设置则使用 ~/.codex。只允许检查或写入 CODEX_HOME/pets/${petId}，不要修改其他目录。
4. 解压前确认 ZIP 只有一个顶层 ${petId}/ 文件夹，里面只能有 pet.json 和 spritesheet.webp。
5. 如果 CODEX_HOME/pets/${petId} 已存在，停止并先询问我。禁止静默覆盖。
6. 安装完成后列出实际写入的文件，并提醒我完整退出再重新打开 Codex Desktop。

不要安装可执行文件，不要运行压缩包里的脚本，也不要更改我的 Codex 配置。`;
}
