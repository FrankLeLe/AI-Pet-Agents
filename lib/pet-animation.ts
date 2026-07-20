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
  readonly label: Readonly<{ zh: string; en: string }>;
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
  { key: "idle", label: { zh: "待机", en: "Idle" }, row: 0, frames: 6, durations: [280, 110, 110, 140, 140, 320] },
  { key: "running-right", label: { zh: "向右移动", en: "Move right" }, row: 1, frames: 8, durations: [120, 120, 120, 120, 120, 120, 120, 220] },
  { key: "running-left", label: { zh: "向左移动", en: "Move left" }, row: 2, frames: 8, durations: [120, 120, 120, 120, 120, 120, 120, 220] },
  { key: "waving", label: { zh: "挥手", en: "Wave" }, row: 3, frames: 4, durations: [140, 140, 140, 280] },
  { key: "jumping", label: { zh: "跳跃", en: "Jump" }, row: 4, frames: 5, durations: [140, 140, 140, 140, 280] },
  { key: "failed", label: { zh: "失败", en: "Failed" }, row: 5, frames: 8, durations: [140, 140, 140, 140, 140, 140, 140, 240] },
  { key: "waiting", label: { zh: "等待", en: "Waiting" }, row: 6, frames: 6, durations: [150, 150, 150, 150, 150, 260] },
  { key: "running", label: { zh: "工作中", en: "Working" }, row: 7, frames: 6, durations: [120, 120, 120, 120, 120, 220] },
  { key: "review", label: { zh: "审阅", en: "Review" }, row: 8, frames: 6, durations: [150, 150, 150, 150, 150, 280] },
  { key: "look", label: { zh: "环视", en: "Look around" }, row: 9, frames: 16, durations: [170, 170, 170, 170, 170, 170, 170, 170, 170, 170, 170, 170, 170, 170, 170, 170] },
] as const satisfies readonly AnimationDefinition[];
