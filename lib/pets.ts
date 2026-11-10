import {
  PET_EDITORIAL_CONTENT,
  type PetEditorialContent,
} from "./pet-content";
import { SPRITE_FORMAT } from "./pet-animation";

export {
  ANIMATIONS,
  ANIMATION_KEYS,
  SPRITE_FORMAT,
  type AnimationDefinition,
  type AnimationKey,
} from "./pet-animation";

export const LANGUAGES = ["zh", "en"] as const;

export type Language = (typeof LANGUAGES)[number];

export type LocalizedText = Readonly<Record<Language, string>>;

export const PET_NEEDS = ["start", "steady", "solve", "create", "comfort"] as const;

export type PetNeed = (typeof PET_NEEDS)[number];

export type Pet = {
  readonly id: string;
  readonly status: "published";
  readonly category: "bronze-cat" | "zodiac-duck" | "breed-cat" | "desktop-work" | "desk-corner";
  readonly zodiacOrder: number | null;
  readonly needs: readonly PetNeed[];
  readonly displayName: LocalizedText;
  readonly tagline: LocalizedText;
  readonly description: LocalizedText;
  readonly personalityTags: readonly LocalizedText[];
  readonly editorial: PetEditorialContent;
  readonly badge: string;
  readonly accent: string;
  readonly softAccent: string;
  readonly spriteVersionNumber: typeof SPRITE_FORMAT.spriteVersionNumber;
  readonly spritesheetPath: string;
  readonly previewPath: string;
  readonly manifestPath: string;
  readonly downloadPath: string;
  readonly detailPath: string;
};

const PET_DEFINITIONS = [
  {
    id: "star-armor-tuantuan",
    category: "bronze-cat",
    zodiacOrder: null,
    needs: ["comfort", "start"],
    displayName: { zh: "星铠团团", en: "Star-Armor Tuantuan" },
    badge: "BRONZE 00",
    accent: "#4b68ff",
    softAccent: "#dfe5ff",
  },
  {
    id: "aries-ramcrest-duck",
    category: "zodiac-duck",
    zodiacOrder: 1,
    needs: ["start"],
    displayName: { zh: "白羊金翎鸭", en: "Aries Ramcrest Duck" },
    badge: "ARIES 01",
    accent: "#ff6b58",
    softAccent: "#ffd8d2",
  },
  {
    id: "taurus-bullguard-duck",
    category: "zodiac-duck",
    zodiacOrder: 2,
    needs: ["steady"],
    displayName: { zh: "金牛鎏甲鸭", en: "Taurus Bullguard Duck" },
    badge: "TAURUS 02",
    accent: "#3db98d",
    softAccent: "#c9f5e5",
  },
  {
    id: "gemini-twincrest-duck",
    category: "zodiac-duck",
    zodiacOrder: 3,
    needs: ["solve", "create"],
    displayName: { zh: "双子镜辉鸭", en: "Gemini Twincrest Duck" },
    badge: "GEMINI 03",
    accent: "#ffce43",
    softAccent: "#fff0ad",
  },
  {
    id: "cancer-shellguard-duck",
    category: "zodiac-duck",
    zodiacOrder: 4,
    needs: ["comfort"],
    displayName: { zh: "巨蟹甲壳鸭", en: "Cancer Shellguard Duck" },
    badge: "CANCER 04",
    accent: "#ff9c84",
    softAccent: "#ffe0d7",
  },
  {
    id: "leo-manehelm-duck",
    category: "zodiac-duck",
    zodiacOrder: 5,
    needs: ["create", "start"],
    displayName: { zh: "狮子鬃焰鸭", en: "Leo Manehelm Duck" },
    badge: "LEO 05",
    accent: "#ff9f2f",
    softAccent: "#ffe3b8",
  },
  {
    id: "virgo-lotuscrest-duck",
    category: "zodiac-duck",
    zodiacOrder: 6,
    needs: ["solve", "steady"],
    displayName: { zh: "处女莲冠鸭", en: "Virgo Lotuscrest Duck" },
    badge: "VIRGO 06",
    accent: "#6ecba8",
    softAccent: "#d7f4e8",
  },
  {
    id: "libra-balanceguard-duck",
    category: "zodiac-duck",
    zodiacOrder: 7,
    needs: ["solve", "steady"],
    displayName: { zh: "天秤衡光鸭", en: "Libra Balanceguard Duck" },
    badge: "LIBRA 07",
    accent: "#a68cff",
    softAccent: "#e7e0ff",
  },
  {
    id: "scorpio-stingtalon-duck",
    category: "zodiac-duck",
    zodiacOrder: 8,
    needs: ["solve"],
    displayName: { zh: "天蝎针尾鸭", en: "Scorpio Stingtalon Duck" },
    badge: "SCORPIO 08",
    accent: "#c75272",
    softAccent: "#f3d4dc",
  },
  {
    id: "sagittarius-arrowwing-duck",
    category: "zodiac-duck",
    zodiacOrder: 9,
    needs: ["create", "start"],
    displayName: { zh: "人马箭翼鸭", en: "Sagittarius Arrowwing Duck" },
    badge: "SAGITTARIUS 09",
    accent: "#4da7dc",
    softAccent: "#d4ecf8",
  },
  {
    id: "capricorn-goathorn-duck",
    category: "zodiac-duck",
    zodiacOrder: 10,
    needs: ["steady"],
    displayName: { zh: "摩羯岩角鸭", en: "Capricorn Goathorn Duck" },
    badge: "CAPRICORN 10",
    accent: "#b88754",
    softAccent: "#ecdbc7",
  },
  {
    id: "aquarius-vesselwing-duck",
    category: "zodiac-duck",
    zodiacOrder: 11,
    needs: ["create", "solve"],
    displayName: { zh: "宝瓶澜甲鸭", en: "Aquarius Vesselwing Duck" },
    badge: "AQUARIUS 11",
    accent: "#39b8c8",
    softAccent: "#cff2f4",
  },
  {
    id: "pisces-fintail-duck",
    category: "zodiac-duck",
    zodiacOrder: 12,
    needs: ["create", "comfort"],
    displayName: { zh: "双鱼鳍辉鸭", en: "Pisces Fintail Duck" },
    badge: "PISCES 12",
    accent: "#d36bc0",
    softAccent: "#f4d8ee",
  },
  {
    id: "cat-ragdoll-yunduo",
    category: "breed-cat",
    zodiacOrder: null,
    needs: ["comfort", "steady"],
    displayName: { zh: "云朵", en: "Yunduo" },
    badge: "RAGDOLL 01",
    accent: "#8ca9dc",
    softAccent: "#e5ecf8",
  },
  {
    id: "cat-american-shorthair-yinbing",
    category: "breed-cat",
    zodiacOrder: null,
    needs: ["solve", "start"],
    displayName: { zh: "银饼", en: "Yinbing" },
    badge: "AMERICAN SHORTHAIR 02",
    accent: "#7d8797",
    softAccent: "#e4e7ec",
  },
  {
    id: "cat-british-shorthair-lanyuanyuan",
    category: "breed-cat",
    zodiacOrder: null,
    needs: ["steady", "comfort"],
    displayName: { zh: "蓝圆圆", en: "Lan Yuanyuan" },
    badge: "BRITISH SHORTHAIR 03",
    accent: "#7589a3",
    softAccent: "#dfe7f0",
  },
  {
    id: "cat-maine-coon-linwang",
    category: "breed-cat",
    zodiacOrder: null,
    needs: ["steady", "solve"],
    displayName: { zh: "林王", en: "Linwang" },
    badge: "MAINE COON 04",
    accent: "#91684d",
    softAccent: "#eadbcf",
  },
  {
    id: "cat-siamese-haiyan",
    category: "breed-cat",
    zodiacOrder: null,
    needs: ["start", "comfort"],
    displayName: { zh: "海盐", en: "Haiyan" },
    badge: "SIAMESE 05",
    accent: "#705f6c",
    softAccent: "#e8dfe4",
  },
  {
    id: "cat-norwegian-forest-songlu",
    category: "breed-cat",
    zodiacOrder: null,
    needs: ["solve", "steady"],
    displayName: { zh: "松露", en: "Songlu" },
    badge: "NORWEGIAN FOREST 06",
    accent: "#806c50",
    softAccent: "#e9e0d2",
  },
  {
    id: "cat-persian-xuegao",
    category: "breed-cat",
    zodiacOrder: null,
    needs: ["comfort"],
    displayName: { zh: "雪糕", en: "Xuegao" },
    badge: "PERSIAN 07",
    accent: "#c693af",
    softAccent: "#f6e5ee",
  },
  {
    id: "cat-bengal-jinbao",
    category: "breed-cat",
    zodiacOrder: null,
    needs: ["start", "create"],
    displayName: { zh: "金豹", en: "Jinbao" },
    badge: "BENGAL 08",
    accent: "#cf8d32",
    softAccent: "#f5e1bd",
  },
  {
    id: "cat-russian-blue-wulan",
    category: "breed-cat",
    zodiacOrder: null,
    needs: ["solve", "comfort"],
    displayName: { zh: "雾蓝", en: "Wulan" },
    badge: "RUSSIAN BLUE 09",
    accent: "#667d94",
    softAccent: "#dce6ef",
  },
  {
    id: "cat-devon-rex-juanjuan",
    category: "breed-cat",
    zodiacOrder: null,
    needs: ["create", "start"],
    displayName: { zh: "卷卷", en: "Juanjuan" },
    badge: "DEVON REX 10",
    accent: "#a87968",
    softAccent: "#eedfd8",
  },
  {
    id: "cat-sphynx-yueguang",
    category: "breed-cat",
    zodiacOrder: null,
    needs: ["comfort", "steady"],
    displayName: { zh: "月光", en: "Yueguang" },
    badge: "SPHYNX 11",
    accent: "#c78f98",
    softAccent: "#f4dfe3",
  },
  {
    id: "cat-abyssinian-hongsha",
    category: "breed-cat",
    zodiacOrder: null,
    needs: ["start", "create"],
    displayName: { zh: "红砂", en: "Hongsha" },
    badge: "ABYSSINIAN 12",
    accent: "#b86743",
    softAccent: "#f1d8cc",
  },
  {
    id: "desk-compiler-mole-mazai",
    category: "desktop-work",
    zodiacOrder: null,
    needs: [
      "steady",
      "start",
    ],
    displayName: {
      zh: "码仔 · 编译鼹鼠",
      en: "Mazai · Compiler Mole",
    },
    badge: "BUILD 01",
    accent: "#aa773b",
    softAccent: "#f0dfc7",
  },
  {
    id: "desk-test-beetle-diandian",
    category: "desktop-work",
    zodiacOrder: null,
    needs: [
      "solve",
      "steady",
    ],
    displayName: {
      zh: "点点 · 测试甲虫",
      en: "Diandian · Testing Beetle",
    },
    badge: "TEST 02",
    accent: "#168b90",
    softAccent: "#d4eeee",
  },
  {
    id: "desk-review-owl-jiaojiao",
    category: "desktop-work",
    zodiacOrder: null,
    needs: [
      "solve",
      "steady",
    ],
    displayName: {
      zh: "校校 · 审阅猫头鹰",
      en: "Jiaojiao · Review Owl",
    },
    badge: "REVIEW 03",
    accent: "#726391",
    softAccent: "#e5dff0",
  },
  {
    id: "desk-search-hound-xiuxiu",
    category: "desktop-work",
    zodiacOrder: null,
    needs: [
      "solve",
      "start",
    ],
    displayName: {
      zh: "嗅嗅 · 搜索猎犬",
      en: "Xiuxiu · Search Hound",
    },
    badge: "SEARCH 04",
    accent: "#d88a32",
    softAccent: "#f7e7ce",
  },
  {
    id: "desk-plan-beaver-gege",
    category: "desktop-work",
    zodiacOrder: null,
    needs: [
      "steady",
      "start",
    ],
    displayName: {
      zh: "格格 · 规划海狸",
      en: "Gege · Planning Beaver",
    },
    badge: "PLAN 05",
    accent: "#6e906a",
    softAccent: "#e0ecda",
  },
  {
    id: "desk-deploy-pigeon-yundi",
    category: "desktop-work",
    zodiacOrder: null,
    needs: [
      "start",
      "steady",
    ],
    displayName: {
      zh: "云递 · 部署信鸽",
      en: "Yundi · Deployment Pigeon",
    },
    badge: "DEPLOY 06",
    accent: "#6d8eaa",
    softAccent: "#dfeaf1",
  },
  {
    id: "desk-memory-squirrel-licun",
    category: "desktop-work",
    zodiacOrder: null,
    needs: [
      "steady",
      "comfort",
    ],
    displayName: {
      zh: "栗存 · 记忆松鼠",
      en: "Licun · Memory Squirrel",
    },
    badge: "MEMORY 07",
    accent: "#b87335",
    softAccent: "#f1dfc6",
  },
  {
    id: "desk-data-octopus-duoduo",
    category: "desktop-work",
    zodiacOrder: null,
    needs: [
      "solve",
      "steady",
    ],
    displayName: {
      zh: "多多 · 数据章鱼",
      en: "Duoduo · Data Octopus",
    },
    badge: "DATA 08",
    accent: "#4965cb",
    softAccent: "#dfe4fa",
  },
  {
    id: "desk-design-red-panda-caiwei",
    category: "desktop-work",
    zodiacOrder: null,
    needs: [
      "create",
      "solve",
    ],
    displayName: {
      zh: "彩尾 · 设计小熊猫",
      en: "Caiwei · Design Red Panda",
    },
    badge: "DESIGN 09",
    accent: "#cf753d",
    softAccent: "#f6dfce",
  },
  {
    id: "desk-security-hedgehog-dundun",
    category: "desktop-work",
    zodiacOrder: null,
    needs: [
      "steady",
      "comfort",
    ],
    displayName: {
      zh: "盾盾 · 安全刺猬",
      en: "Dundun · Security Hedgehog",
    },
    badge: "SECURITY 10",
    accent: "#526782",
    softAccent: "#e0e7ef",
  },
  {
    id: "desk-waiting-sloth-manman",
    category: "desktop-work",
    zodiacOrder: null,
    needs: [
      "comfort",
      "steady",
    ],
    displayName: {
      zh: "慢慢 · 等待树懒",
      en: "Manman · Waiting Sloth",
    },
    badge: "WAIT 11",
    accent: "#8b9274",
    softAccent: "#e7eadc",
  },
  {
    id: "desk-debug-salamander-huohua",
    category: "desktop-work",
    zodiacOrder: null,
    needs: [
      "solve",
      "start",
    ],
    displayName: {
      zh: "火花 · 调试火蜥蜴",
      en: "Huohua · Debugging Salamander",
    },
    badge: "DEBUG 12",
    accent: "#bd5945",
    softAccent: "#f3d9d1",
  },
  {
    id: "foldlume",
    category: "desk-corner",
    zodiacOrder: null,
    needs: ["start", "steady", "comfort"],
    displayName: { zh: "折灯", en: "Foldlume" },
    badge: "LIGHT 01",
    accent: "#b96d22",
    softAccent: "#f6e4cb",
  },
  {
    id: "eavie",
    category: "desk-corner",
    zodiacOrder: null,
    needs: ["create", "start", "comfort"],
    displayName: { zh: "檐豆", en: "Eavie" },
    badge: "HOME 02",
    accent: "#426b52",
    softAccent: "#e3ebd8",
  },
  {
    id: "mendmoth",
    category: "desk-corner",
    zodiacOrder: null,
    needs: ["comfort", "steady"],
    displayName: { zh: "补补", en: "Mendmoth" },
    badge: "WARMTH 03",
    accent: "#526d83",
    softAccent: "#e3eaf0",
  },
] as const satisfies readonly {
  id: string;
  category: Pet["category"];
  zodiacOrder: number | null;
  needs: readonly PetNeed[];
  displayName: LocalizedText;
  badge: string;
  accent: string;
  softAccent: string;
}[];

export type PetId = (typeof PET_DEFINITIONS)[number]["id"];

export const PETS = PET_DEFINITIONS.map((definition) => {
  const editorial = PET_EDITORIAL_CONTENT[definition.id];

  return {
    ...definition,
    status: "published" as const,
    tagline: { zh: editorial.promiseZh, en: editorial.promiseEn },
    description: { zh: editorial.comfortZh, en: editorial.comfortEn },
    personalityTags: editorial.traitsZh.map((zh, index) => ({
      zh,
      en: editorial.traitsEn[index] ?? editorial.traitsEn[0],
    })),
    editorial,
    spriteVersionNumber: SPRITE_FORMAT.spriteVersionNumber,
    spritesheetPath: `/pets/${definition.id}/spritesheet.webp`,
    previewPath: `/pets/${definition.id}/preview.webp`,
    manifestPath: `/pets/${definition.id}/pet.json`,
    downloadPath: `/downloads/${definition.id}.zip`,
    detailPath: `/api/v1/pets/${definition.id}.json`,
  };
}) satisfies readonly Pet[];

export const DEFAULT_PET_ID: PetId = "star-armor-tuantuan";

export function getPetById(id: string): Pet | undefined {
  return PETS.find((pet) => pet.id === id);
}

export function isPetId(id: string): id is PetId {
  return PETS.some((pet) => pet.id === id);
}
