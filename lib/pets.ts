export const LANGUAGES = ["zh", "en"] as const;

export type Language = (typeof LANGUAGES)[number];

export type LocalizedText = Readonly<Record<Language, string>>;

export const ANIMATION_KEYS = [
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
] as const;

export type AnimationKey = (typeof ANIMATION_KEYS)[number];

export type AnimationDefinition = {
  readonly key: AnimationKey;
  readonly label: LocalizedText;
  readonly row: number;
  readonly frames: number;
  readonly durations: readonly number[];
};

export const SPRITE_FORMAT = {
  spriteVersionNumber: 2,
  atlasWidth: 1536,
  atlasHeight: 2288,
  columns: 8,
  rows: 11,
  cellWidth: 192,
  cellHeight: 208,
} as const;

export const ANIMATIONS = [
  {
    key: "idle",
    label: { zh: "待机", en: "Idle" },
    row: 0,
    frames: 6,
    durations: [280, 110, 110, 140, 140, 320],
  },
  {
    key: "running-right",
    label: { zh: "向右移动", en: "Move right" },
    row: 1,
    frames: 8,
    durations: [120, 120, 120, 120, 120, 120, 120, 220],
  },
  {
    key: "running-left",
    label: { zh: "向左移动", en: "Move left" },
    row: 2,
    frames: 8,
    durations: [120, 120, 120, 120, 120, 120, 120, 220],
  },
  {
    key: "waving",
    label: { zh: "挥手", en: "Wave" },
    row: 3,
    frames: 4,
    durations: [140, 140, 140, 280],
  },
  {
    key: "jumping",
    label: { zh: "跳跃", en: "Jump" },
    row: 4,
    frames: 5,
    durations: [140, 140, 140, 140, 280],
  },
  {
    key: "failed",
    label: { zh: "失败", en: "Failed" },
    row: 5,
    frames: 8,
    durations: [140, 140, 140, 140, 140, 140, 140, 240],
  },
  {
    key: "waiting",
    label: { zh: "等待", en: "Waiting" },
    row: 6,
    frames: 6,
    durations: [150, 150, 150, 150, 150, 260],
  },
  {
    key: "running",
    label: { zh: "工作中", en: "Working" },
    row: 7,
    frames: 6,
    durations: [120, 120, 120, 120, 120, 220],
  },
  {
    key: "review",
    label: { zh: "审阅", en: "Review" },
    row: 8,
    frames: 6,
    durations: [150, 150, 150, 150, 150, 280],
  },
  {
    key: "look",
    label: { zh: "环视", en: "Look around" },
    row: 9,
    frames: 16,
    durations: [170, 170, 170, 170, 170, 170, 170, 170, 170, 170, 170, 170, 170, 170, 170, 170],
  },
] as const satisfies readonly AnimationDefinition[];

export type Pet = {
  readonly id: string;
  readonly status: "published";
  readonly displayName: LocalizedText;
  readonly tagline: LocalizedText;
  readonly description: LocalizedText;
  readonly personalityTags: readonly LocalizedText[];
  readonly badge: string;
  readonly accent: string;
  readonly softAccent: string;
  readonly spriteVersionNumber: typeof SPRITE_FORMAT.spriteVersionNumber;
  readonly spritesheetPath: string;
  readonly manifestPath: string;
  readonly downloadPath: string;
  readonly detailPath: string;
};

export const PETS = [
  {
    id: "star-armor-tuantuan",
    status: "published",
    displayName: { zh: "星铠团团", en: "Star-Armor Tuantuan" },
    tagline: {
      zh: "披着星光，陪你把难题走完。",
      en: "Armored in starlight for every hard problem.",
    },
    description: {
      zh: "穿着原创星座铠甲、勇敢又软萌的猫科星界守护宠物。",
      en: "A brave, soft-hearted feline guardian in original constellation armor.",
    },
    personalityTags: [
      { zh: "勇敢", en: "Brave" },
      { zh: "软萌", en: "Soft-hearted" },
      { zh: "守护型", en: "Protective" },
    ],
    badge: "HERO 01",
    accent: "#4b68ff",
    softAccent: "#dfe5ff",
    spriteVersionNumber: 2,
    spritesheetPath: "/pets/star-armor-tuantuan/spritesheet.webp",
    manifestPath: "/pets/star-armor-tuantuan/pet.json",
    downloadPath: "/downloads/star-armor-tuantuan.zip",
    detailPath: "/api/v1/pets/star-armor-tuantuan.json",
  },
  {
    id: "gemini-twincrest-duck",
    status: "published",
    displayName: { zh: "双子镜辉鸭", en: "Gemini Twincrest Duck" },
    tagline: {
      zh: "灵光一闪时，它总在你身边。",
      en: "Beside you whenever an idea sparks.",
    },
    description: {
      zh: "原创双子座黄金甲守护鸭，明亮、灵动，随时准备加入 Codex。",
      en: "A bright, nimble Gemini guardian duck in original golden armor.",
    },
    personalityTags: [
      { zh: "灵动", en: "Nimble" },
      { zh: "好奇", en: "Curious" },
      { zh: "点子多", en: "Inventive" },
    ],
    badge: "TWIN 02",
    accent: "#ffce43",
    softAccent: "#fff0ad",
    spriteVersionNumber: 2,
    spritesheetPath: "/pets/gemini-twincrest-duck/spritesheet.webp",
    manifestPath: "/pets/gemini-twincrest-duck/pet.json",
    downloadPath: "/downloads/gemini-twincrest-duck.zip",
    detailPath: "/api/v1/pets/gemini-twincrest-duck.json",
  },
  {
    id: "aries-ramcrest-duck",
    status: "published",
    displayName: { zh: "白羊金翎鸭", en: "Aries Ramcrest Duck" },
    tagline: {
      zh: "先出发，再把难题一个个撞开。",
      en: "Start boldly, then break through each problem.",
    },
    description: {
      zh: "原创白羊座黄金甲守护鸭，热情、勇敢，又萌态十足。",
      en: "A spirited Aries guardian duck in original golden armor.",
    },
    personalityTags: [
      { zh: "热情", en: "Spirited" },
      { zh: "果断", en: "Decisive" },
      { zh: "行动派", en: "Action-first" },
    ],
    badge: "RAM 03",
    accent: "#ff6b58",
    softAccent: "#ffd8d2",
    spriteVersionNumber: 2,
    spritesheetPath: "/pets/aries-ramcrest-duck/spritesheet.webp",
    manifestPath: "/pets/aries-ramcrest-duck/pet.json",
    downloadPath: "/downloads/aries-ramcrest-duck.zip",
    detailPath: "/api/v1/pets/aries-ramcrest-duck.json",
  },
  {
    id: "taurus-bullguard-duck",
    status: "published",
    displayName: { zh: "金牛鎏甲鸭", en: "Taurus Bullguard Duck" },
    tagline: {
      zh: "不催你，只稳稳陪你做到最后。",
      en: "Never rushing you, always staying to the end.",
    },
    description: {
      zh: "原创金牛座黄金甲守护鸭，稳重、可靠，是桌面的耐心搭子。",
      en: "A steady Taurus guardian duck in original golden armor.",
    },
    personalityTags: [
      { zh: "稳重", en: "Steady" },
      { zh: "可靠", en: "Reliable" },
      { zh: "有耐心", en: "Patient" },
    ],
    badge: "BULL 04",
    accent: "#38b98c",
    softAccent: "#c9f5e5",
    spriteVersionNumber: 2,
    spritesheetPath: "/pets/taurus-bullguard-duck/spritesheet.webp",
    manifestPath: "/pets/taurus-bullguard-duck/pet.json",
    downloadPath: "/downloads/taurus-bullguard-duck.zip",
    detailPath: "/api/v1/pets/taurus-bullguard-duck.json",
  },
] as const satisfies readonly Pet[];

export type PetId = (typeof PETS)[number]["id"];

export const DEFAULT_PET_ID: PetId = "star-armor-tuantuan";

export function getPetById(id: string): Pet | undefined {
  return PETS.find((pet) => pet.id === id);
}

export function isPetId(id: string): id is PetId {
  return PETS.some((pet) => pet.id === id);
}

