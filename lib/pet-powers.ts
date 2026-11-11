type PowerText = Readonly<{ zh: string; en: string }>;

export type PetPower = {
  readonly petId: string;
  readonly name: PowerText;
  readonly action: PowerText;
  readonly description: PowerText;
  readonly restingName: PowerText;
  readonly color: string;
  readonly atmosphere: "moon" | "frost" | "shield" | "spirit" | "armor";
  readonly restingScale: number;
  readonly restingOffsetY: number;
};

export const POWER_SPRITE = {
  cellWidth: 384,
  cellHeight: 416,
  frames: 8,
  transformDurations: [180, 220, 240, 240, 240, 240, 240, 400],
  awakenedDurations: [200, 140, 140, 160, 180, 160, 180, 240],
} as const;

export const PET_POWERS: readonly PetPower[] = [
  {
    petId: "bleach-ichigo",
    name: { zh: "卍解 · 天锁斩月", en: "Bankai · Tensa Zangetsu" },
    action: { zh: "卍解", en: "Unleash Bankai" },
    description: {
      zh: "灵压收束，黑色长衣随之展开。一护握住天锁斩月，把守护的决心留在你身边。",
      en: "Spiritual pressure gathers as the black coat unfurls. Ichigo takes up Tensa Zangetsu, ready to stand beside you.",
    },
    restingName: { zh: "始解 · 斩月", en: "Shikai · Zangetsu" },
    color: "#ff7858",
    atmosphere: "moon",
    restingScale: 1.068452,
    restingOffsetY: 1.290636,
  },
  {
    petId: "bleach-rukia",
    name: { zh: "卍解 · 白霞罚", en: "Bankai · Hakka no Togame" },
    action: { zh: "卍解", en: "Unleash Bankai" },
    description: {
      zh: "寒气沿着白刀升起，露琪亚换上如雪的姿态。片刻安静，也能有坚定的力量。",
      en: "Cold rises along the white blade as Rukia takes on a snow-white form. A quiet moment can hold remarkable resolve.",
    },
    restingName: { zh: "袖白雪", en: "Sode no Shirayuki" },
    color: "#a1e7ff",
    atmosphere: "frost",
    restingScale: 0.909091,
    restingOffsetY: -1.660839,
  },
  {
    petId: "bleach-orihime",
    name: { zh: "盾舜六花 · 三天结盾", en: "Shun Shun Rikka · Santen Kesshun" },
    action: { zh: "展开护盾", en: "Raise the shield" },
    description: {
      zh: "花夹亮起，金色护盾在双手前展开。织姬用温柔而坚定的方式，留出一处安心的位置。",
      en: "Her flower clips light up and a golden shield unfolds before her hands. Orihime makes a little room for reassurance.",
    },
    restingName: { zh: "温柔守候", en: "A gentle watch" },
    color: "#ffd676",
    atmosphere: "shield",
    restingScale: 1.074405,
    restingOffsetY: 1.319254,
  },
  {
    petId: "bleach-uryu",
    name: { zh: "灭却师完圣体", en: "Quincy Vollständig" },
    action: { zh: "展开完圣体", en: "Reveal Vollständig" },
    description: {
      zh: "灵子凝成青蓝光翼，手甲与脚甲逐渐显现。雨龙推好眼镜，让每一步都更清晰。",
      en: "Spirit particles form cyan wings as crystalline armor appears. Uryu adjusts his glasses and finds a precise way forward.",
    },
    restingName: { zh: "灭却师", en: "Quincy" },
    color: "#61d7ff",
    atmosphere: "spirit",
    restingScale: 1.059524,
    restingOffsetY: 1.007326,
  },
  {
    petId: "bleach-chad",
    name: { zh: "巨人右臂 · 恶魔左臂", en: "Brazo Derecha de Gigante · Brazo Izquierda del Diablo" },
    action: { zh: "双臂解放", en: "Release both arms" },
    description: {
      zh: "黑红右臂与白色左臂依次显现。茶渡稳稳站定，用沉默而可靠的守护回应你。",
      en: "The black-and-red right arm and white left arm emerge in turn. Chad plants his feet and answers with steady protection.",
    },
    restingName: { zh: "沉稳同行", en: "A steady companion" },
    color: "#f3967c",
    atmosphere: "armor",
    restingScale: 0.909091,
    restingOffsetY: -1.660839,
  },
];

export function getPetPower(petId: string): PetPower | undefined {
  return PET_POWERS.find((power) => power.petId === petId);
}

export function getPowerAssetUrl(petId: string, asset: "transform" | "awakened" | "preview") {
  return `/pets/${petId}/abilities/${asset}.webp`;
}

export function getPowerFrameAtTime(
  elapsed: number,
  durations: readonly number[],
  loop: boolean,
): { frame: number; complete: boolean } {
  const total = durations.reduce((sum, duration) => sum + duration, 0);
  const time = Math.max(0, elapsed);
  if (!loop && time >= total) return { frame: durations.length - 1, complete: true };
  let remaining = loop ? time % total : time;
  for (let frame = 0; frame < durations.length; frame += 1) {
    if (remaining < durations[frame]) return { frame, complete: false };
    remaining -= durations[frame];
  }
  return { frame: 0, complete: false };
}
