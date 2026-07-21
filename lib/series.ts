import type { Language, LocalizedText, Pet } from "./pets";
import { getPetById } from "./pets";

export type SeriesMemberProfile = {
  readonly petId: string;
  readonly name: LocalizedText;
  readonly zodiac: LocalizedText;
  readonly role: LocalizedText;
  readonly specialty: LocalizedText;
  readonly vignette: LocalizedText;
};

export type PetSeries = {
  readonly id: string;
  readonly name: LocalizedText;
  readonly subtitle: LocalizedText;
  readonly status: LocalizedText;
  readonly description: LocalizedText;
  readonly storyTitle: LocalizedText;
  readonly storyChapter: LocalizedText;
  readonly story: LocalizedText;
  readonly members: readonly SeriesMemberProfile[];
};

export const GUIDE_PET_ID = "star-armor-tuantuan";

export const GUIDE_PROFILE = {
  name: { zh: "星铠团团", en: "Star-Armor Tuantuan" },
  title: { zh: "团团向导", en: "Tuantuan Guide" },
  role: { zh: "本站向导", en: "Site guide" },
  description: {
    zh: "负责带路、演示动作，也会在你选好角色后送你去安装。",
    en: "Your guide to the collections, live actions, and the quickest way to install a companion.",
  },
  storyTitle: { zh: "团团的第一班岗", en: "Tuantuan's First Watch" },
  story: {
    zh: "星轨重新亮起那天，团团把导航灯搬到了入口。它不替任何角色做决定，只负责把系列、动作和安装路径摆在你面前。每当新的伙伴抵达，团团都会为它留下一枚清楚的路标。",
    en: "When the star route lit up again, Tuantuan moved the navigation lamp to the entrance. It never chooses a character for you; it simply keeps every collection, action, and install route easy to find. Each new arrival gets a clear signpost of its own.",
  },
} as const;

const GOLDEN_FEATHER_MEMBERS = [
  {
    petId: "aries-ramcrest-duck",
    name: { zh: "白羊·金翎", en: "Aries · Giltcrest" },
    zodiac: { zh: "白羊座守护鸭", en: "Aries guardian duck" },
    role: { zh: "开路先锋", en: "Trail opener" },
    specialty: { zh: "把空白拆成第一步", en: "Turns a blank page into a first move" },
    vignette: {
      zh: "金翎总在航线还没画完时先迈出一步。它留下的爪印不一定笔直，却足够让整支队伍知道从哪里出发。",
      en: "Giltcrest moves before the route is fully drawn. Its first footprints are not always straight, but they give the whole crew somewhere to begin.",
    },
  },
  {
    petId: "taurus-bullguard-duck",
    name: { zh: "金牛·鎏甲", en: "Taurus · Goldguard" },
    zodiac: { zh: "金牛座守护鸭", en: "Taurus guardian duck" },
    role: { zh: "稳阵守卫", en: "Steady guard" },
    specialty: { zh: "让长任务稳稳推进", en: "Keeps long tasks moving at a steady pace" },
    vignette: {
      zh: "鎏甲守着星轨最重的一段。风再大，它也会把今天该完成的一格推到终点。",
      en: "Goldguard holds the heaviest stretch of the route. However hard the wind blows, it carries today's one essential step across the line.",
    },
  },
  {
    petId: "gemini-twincrest-duck",
    name: { zh: "双子·镜辉", en: "Gemini · Twinshine" },
    zodiac: { zh: "双子座守护鸭", en: "Gemini guardian duck" },
    role: { zh: "双线谋士", en: "Two-track tactician" },
    specialty: { zh: "在两条思路间快速切换", en: "Switches cleanly between two lines of thought" },
    vignette: {
      zh: "镜辉把每个难题照成两面，再从反光里找到第三条路。它的答案很少只有一种。",
      en: "Twinshine reflects every problem from two sides, then looks for a third path in the glare. Its answers rarely come in just one form.",
    },
  },
  {
    petId: "cancer-shellguard-duck",
    name: { zh: "巨蟹·月甲", en: "Cancer · Moonshell" },
    zodiac: { zh: "巨蟹座守护鸭", en: "Cancer guardian duck" },
    role: { zh: "归巢护卫", en: "Harbor keeper" },
    specialty: { zh: "守住你的专注边界", en: "Keeps a clear boundary around focused work" },
    vignette: {
      zh: "月甲把散落的草稿收进背甲，等风停后再一份份归还。未完成的东西，在它这里不会丢。",
      en: "Moonshell gathers loose drafts beneath its armor and returns them when the wind settles. Unfinished work is never lost on its watch.",
    },
  },
  {
    petId: "leo-manehelm-duck",
    name: { zh: "狮子·焰冠", en: "Leo · Flamecrest" },
    zodiac: { zh: "狮子座守护鸭", en: "Leo guardian duck" },
    role: { zh: "领航旗手", en: "Signal bearer" },
    specialty: { zh: "给关键时刻一点气势", en: "Brings momentum to the moment that matters" },
    vignette: {
      zh: "焰冠负责在作品准备亮相时升起信号旗。它知道，完成之后还要有勇气让别人看见。",
      en: "Flamecrest raises the signal flag when work is ready to be seen. Finishing matters; so does the nerve to show it.",
    },
  },
  {
    petId: "virgo-lotuscrest-duck",
    name: { zh: "处女·莲冠", en: "Virgo · Lotuscrest" },
    zodiac: { zh: "处女座守护鸭", en: "Virgo guardian duck" },
    role: { zh: "精准整备", en: "Precision keeper" },
    specialty: { zh: "把细节整理到位", en: "Puts the important details in order" },
    vignette: {
      zh: "莲冠会校准松动的零件，也会留下恰到好处的余量。整齐是为了让作品顺畅运转。",
      en: "Lotuscrest calibrates loose parts and leaves exactly enough breathing room. Order is there to keep the work moving smoothly.",
    },
  },
  {
    petId: "libra-balanceguard-duck",
    name: { zh: "天秤·衡羽", en: "Libra · Balancewing" },
    zodiac: { zh: "天秤座守护鸭", en: "Libra guardian duck" },
    role: { zh: "权衡裁决", en: "Choice arbiter" },
    specialty: { zh: "为复杂选择找到平衡", en: "Finds balance inside a difficult choice" },
    vignette: {
      zh: "衡羽从不催促天平立刻停下。它先看清两边真正的重量，再把选择交还给你。",
      en: "Balancewing never rushes the scales to settle. It reveals the true weight on each side, then returns the choice to you.",
    },
  },
  {
    petId: "scorpio-stingtalon-duck",
    name: { zh: "天蝎·赤尾", en: "Scorpio · Redstinger" },
    zodiac: { zh: "天蝎座守护鸭", en: "Scorpio guardian duck" },
    role: { zh: "深潜侦察", en: "Deep-scan scout" },
    specialty: { zh: "找到藏在问题里的线索", en: "Finds the clue hidden inside the problem" },
    vignette: {
      zh: "赤尾沿着最安静的管线巡查，专门捕捉那些几乎听不见的异常。真正的线索常藏在深处。",
      en: "Redstinger patrols the quietest lines for anomalies that are almost impossible to hear. The useful clue is often buried deep.",
    },
  },
  {
    petId: "sagittarius-arrowwing-duck",
    name: { zh: "射手·逐星", en: "Sagittarius · Starstride" },
    zodiac: { zh: "射手座守护鸭", en: "Sagittarius guardian duck" },
    role: { zh: "远征箭手", en: "Far-route archer" },
    specialty: { zh: "把远目标拉近一格", en: "Pulls a far goal one step closer" },
    vignette: {
      zh: "逐星不把箭射向终点，而是射向下一处能落脚的灯。远路因此有了清晰的节奏。",
      en: "Starstride aims not at the finish, but at the next lamp within reach. That is how a distant route gains rhythm.",
    },
  },
  {
    petId: "capricorn-goathorn-duck",
    name: { zh: "摩羯·岩角", en: "Capricorn · Stonehorn" },
    zodiac: { zh: "摩羯座守护鸭", en: "Capricorn guardian duck" },
    role: { zh: "峰线攀登", en: "Ridgeline climber" },
    specialty: { zh: "一步步越过最难的坡", en: "Crosses the hardest slope one ledge at a time" },
    vignette: {
      zh: "岩角把陡坡凿成台阶，并在每一级刻下日期。看不见山顶时，它只看下一阶。",
      en: "Stonehorn cuts steep slopes into steps and dates every ledge. When the summit disappears, it looks only for the next foothold.",
    },
  },
  {
    petId: "aquarius-vesselwing-duck",
    name: { zh: "水瓶·流晶", en: "Aquarius · Flowglass" },
    zodiac: { zh: "水瓶座守护鸭", en: "Aquarius guardian duck" },
    role: { zh: "破格发明", en: "Pattern breaker" },
    specialty: { zh: "用新角度改写旧问题", en: "Reframes an old problem from a new angle" },
    vignette: {
      zh: "流晶把旧航道里的水引向新容器。它最擅长的不是更用力，而是换一种流法。",
      en: "Flowglass redirects old currents into new vessels. Its talent is not pushing harder, but finding a different way to flow.",
    },
  },
  {
    petId: "pisces-fintail-duck",
    name: { zh: "双鱼·梦鳍", en: "Pisces · Dreamfin" },
    zodiac: { zh: "双鱼座守护鸭", en: "Pisces guardian duck" },
    role: { zh: "梦境航行", en: "Dream navigator" },
    specialty: { zh: "给创意留一条柔软航线", en: "Keeps a gentle route open for new ideas" },
    vignette: {
      zh: "梦鳍把还没有名字的灵感装进小瓶，等潮汐合适时再打开。模糊的念头也值得一条航线。",
      en: "Dreamfin bottles ideas that do not yet have names and opens them when the tide is right. Even a hazy thought deserves a route.",
    },
  },
] as const satisfies readonly SeriesMemberProfile[];

export const PET_SERIES = [
  {
    id: "golden-feather-constellation",
    name: { zh: "金羽十二星", en: "Golden Feather Constellation" },
    subtitle: { zh: "十二星座守护鸭系列", en: "Zodiac Guardian Duck Series" },
    status: { zh: "当前开放", en: "Now available" },
    description: {
      zh: "每位守护鸭都有独立职责；挑一个与你当前任务最合拍的角色。",
      en: "Each guardian has a distinct role. Pick the one that fits the work in front of you.",
    },
    storyTitle: { zh: "星轨纪事", en: "Chronicle of the Star Route" },
    storyChapter: { zh: "序章：长夜熄灯", en: "Prologue: When the Night Went Dark" },
    story: {
      zh: "长夜第一次覆盖星铠港时，金羽沿着熄灭的星轨散落。白羊点亮起点，金牛守住余火，双子把失联的讯号分成两路。它们各自守护一段路，也会在彼此经过的桌面留下星痕。等最后一枚金羽归位，新的航线便从任务栏亮起。",
      en: "When the long night first covered Aster Harbor, golden feathers scattered along the darkened star route. Aries lit the start, Taurus guarded the remaining flame, and Gemini split a lost signal in two. Each guardian kept a different stretch of the route, leaving a trace wherever another had passed. When the final feather returned, a new course lit up from the taskbar.",
    },
    members: GOLDEN_FEATHER_MEMBERS,
  },
] as const satisfies readonly PetSeries[];

export type PetWithProfile = {
  readonly pet: Pet;
  readonly profile: SeriesMemberProfile;
};

export function getSeriesById(seriesId: string) {
  return PET_SERIES.find((series) => series.id === seriesId);
}

export function getSeriesForPet(petId: string) {
  return PET_SERIES.find((series) =>
    series.members.some((member) => member.petId === petId),
  );
}

export function getMemberProfile(petId: string) {
  return PET_SERIES.flatMap((series) => series.members).find(
    (member) => member.petId === petId,
  );
}

export function getSeriesPets(series: PetSeries): PetWithProfile[] {
  return series.members.flatMap((profile) => {
    const pet = getPetById(profile.petId);
    return pet ? [{ pet, profile }] : [];
  });
}

export function getProductName(pet: Pet, language: Language) {
  if (pet.id === GUIDE_PET_ID) return GUIDE_PROFILE.name[language];
  return getMemberProfile(pet.id)?.name[language] ?? pet.displayName[language];
}
