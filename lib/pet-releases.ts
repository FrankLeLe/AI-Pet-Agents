export const PET_RELEASE_COMMIT = "6bfce72ca689966918c3bb85c68007914a27f54c";
export const PET_RELEASE_REPOSITORY = "https://github.com/FrankLeLe/AI-Pet-Agents";

type PetRelease = {
  readonly sizeBytes: number;
  readonly sha256: string;
};

export const PET_RELEASES: Readonly<Record<string, PetRelease>> = {
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
};

export function getPetRelease(petId: string) {
  return PET_RELEASES[petId];
}

export function getPetPackageUrl(petId: string) {
  return `https://raw.githubusercontent.com/FrankLeLe/AI-Pet-Agents/${PET_RELEASE_COMMIT}/public/downloads/${petId}.zip`;
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
