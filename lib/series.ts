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
  readonly selectionTitle: LocalizedText;
  readonly storyTitle: LocalizedText;
  readonly storyChapter: LocalizedText;
  readonly story: LocalizedText;
  readonly members: readonly SeriesMemberProfile[];
};

export const GUIDE_PET_ID = "star-armor-tuantuan";

export const GUIDE_PROFILE = {
  name: { zh: "星铠团团", en: "Star-Armor Tuantuan" },
  title: { zh: "本站形象官", en: "Official site guide" },
  role: { zh: "星轨向导", en: "Star guide" },
  description: {
    zh: "它守在星轨入口，也记得每位伙伴的故事。点一点，它会先跟你打招呼。",
    en: "It waits at the star-route entrance and remembers every companion’s story. Give it a tap and it will wave hello.",
  },
  storyTitle: { zh: "团团的第一班岗", en: "Tuantuan's First Watch" },
  story: {
    zh: "星轨重新亮起那天，团团把导航灯搬到了入口。每当新的伙伴抵达，它都会记住对方的名字、脾气和那段还没讲完的旅程。夜深以后，最后一盏灯总会为晚归的人留着。",
    en: "When the star route lit up again, Tuantuan moved the navigation lamp to the entrance. It remembers every new companion’s name, temperament, and unfinished journey. Late at night, it always leaves the last light on for anyone still finding their way home.",
  },
} as const;

const GOLDEN_FEATHER_MEMBERS = [
  {
    petId: "aries-ramcrest-duck",
    name: { zh: "白羊·金翎", en: "Aries · Giltcrest" },
    zodiac: { zh: "白羊座守护鸭", en: "Aries guardian duck" },
    role: { zh: "开路先锋", en: "Trail opener" },
    specialty: { zh: "痛快开个头", en: "Start with momentum" },
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
    specialty: { zh: "稳稳做事", en: "Work at a steady pace" },
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
    specialty: { zh: "换个角度想", en: "See another angle" },
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
    specialty: { zh: "安静做会儿事", en: "Find quiet focus" },
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
    specialty: { zh: "带着气势亮相", en: "Show up boldly" },
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
    specialty: { zh: "把细节理顺", en: "Keep details tidy" },
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
    specialty: { zh: "从容做选择", en: "Choose with balance" },
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
    specialty: { zh: "看见细微异常", en: "Spot quiet signals" },
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
    specialty: { zh: "轻快走长路", en: "Keep moving lightly" },
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
    specialty: { zh: "一步一步来", en: "One steady step" },
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
    specialty: { zh: "换个新思路", en: "Try a fresh angle" },
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
    specialty: { zh: "留住一点想象", en: "Keep ideas afloat" },
    vignette: {
      zh: "梦鳍把还没有名字的灵感装进小瓶，等潮汐合适时再打开。模糊的念头也值得一条航线。",
      en: "Dreamfin bottles ideas that do not yet have names and opens them when the tide is right. Even a hazy thought deserves a route.",
    },
  },
] as const satisfies readonly SeriesMemberProfile[];

const CAT_COMPANION_MEMBERS = [
  {
    petId: "cat-ragdoll-yunduo",
    name: { zh: "云朵", en: "Yunduo" },
    zodiac: { zh: "布偶猫", en: "Ragdoll" },
    role: { zh: "软垫陪伴猫", en: "Quiet corner companion" },
    specialty: { zh: "安静陪一会", en: "Quiet company" },
    vignette: {
      zh: "云朵喜欢守在窗口最安静的位置。工作告一段落时，它会把尾巴拢好，给你留出一块不必说话的地方。",
      en: "Yunduo keeps the quietest spot beside the window. When work pauses, it curls its tail aside and leaves you a place where nothing needs to be said.",
    },
  },
  {
    petId: "cat-american-shorthair-yinbing",
    name: { zh: "银饼", en: "Yinbing" },
    zodiac: { zh: "美国短毛猫", en: "American Shorthair" },
    role: { zh: "桌面巡查猫", en: "Desktop scout" },
    specialty: { zh: "顺手查一遍", en: "Check once more" },
    vignette: {
      zh: "银饼听得见桌面上最小的动静。它会沿着文件边缘走一圈，把值得再看一眼的地方停在你面前。",
      en: "Yinbing hears the smallest sound on the desk. It circles the edge of every file and pauses beside anything worth one more look.",
    },
  },
  {
    petId: "cat-british-shorthair-lanyuanyuan",
    name: { zh: "蓝圆圆", en: "Lan Yuanyuan" },
    zodiac: { zh: "英国短毛猫", en: "British Shorthair" },
    role: { zh: "稳场坐镇猫", en: "Steady desk keeper" },
    specialty: { zh: "稳稳坐下来", en: "Settle in steadily" },
    vignette: {
      zh: "蓝圆圆往桌面一坐，四周就像慢了半拍。事情再多，也可以从离爪边最近的一件开始。",
      en: "When Lan Yuanyuan settles on the desk, the room seems to slow by half a beat. However much there is to do, the nearest task is enough to begin.",
    },
  },
  {
    petId: "cat-maine-coon-linwang",
    name: { zh: "林王", en: "Linwang" },
    zodiac: { zh: "缅因猫", en: "Maine Coon" },
    role: { zh: "高处守望猫", en: "High-perch watcher" },
    specialty: { zh: "守住大场面", en: "Hold the big picture" },
    vignette: {
      zh: "林王常在最高的书架上值班。它看得见全局，却总会先替你守住眼前最重要的一块。",
      en: "Linwang keeps watch from the highest shelf. It sees the whole room, yet always guards the one piece that matters most right now.",
    },
  },
  {
    petId: "cat-siamese-haiyan",
    name: { zh: "海盐", en: "Haiyan" },
    zodiac: { zh: "暹罗猫", en: "Siamese" },
    role: { zh: "对话应答猫", en: "Responsive companion" },
    specialty: { zh: "有事就回应", en: "Answer right away" },
    vignette: {
      zh: "海盐从不让一句呼唤掉在地上。你敲下新的问题，它便竖起耳朵，把安静的房间重新接上线。",
      en: "Haiyan never lets a call fall unanswered. The moment you type a new question, its ears rise and the quiet room feels connected again.",
    },
  },
  {
    petId: "cat-norwegian-forest-songlu",
    name: { zh: "松露", en: "Songlu" },
    zodiac: { zh: "挪威森林猫", en: "Norwegian Forest Cat" },
    role: { zh: "林间观察猫", en: "Quiet forest observer" },
    specialty: { zh: "慢慢看清楚", en: "See it clearly" },
    vignette: {
      zh: "松露习惯先听风，再决定往哪里走。复杂的事情到了它面前，会慢慢显出枝干和方向。",
      en: "Songlu listens to the wind before choosing a path. In front of its patient gaze, tangled things begin to reveal their branches and direction.",
    },
  },
  {
    petId: "cat-persian-xuegao",
    name: { zh: "雪糕", en: "Xuegao" },
    zodiac: { zh: "波斯猫", en: "Persian" },
    role: { zh: "休息提醒猫", en: "Gentle rest keeper" },
    specialty: { zh: "先松口气", en: "Take a breather" },
    vignette: {
      zh: "雪糕会在忙乱之间占住一小块空白。它不催你继续，只提醒肩膀可以先放下来。",
      en: "Xuegao occupies one small pause inside a busy day. It does not urge you onward; it simply reminds your shoulders to drop.",
    },
  },
  {
    petId: "cat-bengal-jinbao",
    name: { zh: "金豹", en: "Jinbao" },
    zodiac: { zh: "孟加拉猫", en: "Bengal" },
    role: { zh: "敏捷追踪猫", en: "Quick-response tracker" },
    specialty: { zh: "马上追上去", en: "Catch up fast" },
    vignette: {
      zh: "金豹总能看见刚刚闪过的机会。光标滚远、灵感溜走之前，它已经轻快地追了上去。",
      en: "Jinbao spots an opportunity the instant it moves. Before the cursor rolls away or an idea slips past, it is already in pursuit.",
    },
  },
  {
    petId: "cat-russian-blue-wulan",
    name: { zh: "雾蓝", en: "Wulan" },
    zodiac: { zh: "俄罗斯蓝猫", en: "Russian Blue" },
    role: { zh: "细节观察猫", en: "Detail watcher" },
    specialty: { zh: "留意小变化", en: "Notice small changes" },
    vignette: {
      zh: "雾蓝不抢着给答案，只在旁边安静看一会儿。最细微的变化，常常会先映进它的绿眼睛。",
      en: "Wulan does not rush to answer; it watches quietly for a while. The smallest change is often the first thing reflected in its green eyes.",
    },
  },
  {
    petId: "cat-devon-rex-juanjuan",
    name: { zh: "卷卷", en: "Juanjuan" },
    zodiac: { zh: "德文卷毛猫", en: "Devon Rex" },
    role: { zh: "灵感捣蛋猫", en: "Playful idea stirrer" },
    specialty: { zh: "换个玩法", en: "Try another way" },
    vignette: {
      zh: "卷卷最爱把笔直的路线拨出一个弯。原本卡住的想法，常在它的小恶作剧后多出一种玩法。",
      en: "Juanjuan loves nudging straight paths into curves. A stuck idea often gains another way forward after one of its small pranks.",
    },
  },
  {
    petId: "cat-sphynx-yueguang",
    name: { zh: "月光", en: "Yueguang" },
    zodiac: { zh: "斯芬克斯猫", en: "Sphynx" },
    role: { zh: "暖席陪伴猫", en: "Warm-seat companion" },
    specialty: { zh: "暖暖贴一下", en: "Stay close and warm" },
    vignette: {
      zh: "月光会找到键盘余温还没散去的位置。夜里只剩一个窗口亮着时，它让桌面不再显得冷清。",
      en: "Yueguang finds the place where warmth still lingers beside the keyboard. When only one window remains lit, the desk no longer feels lonely.",
    },
  },
  {
    petId: "cat-abyssinian-hongsha",
    name: { zh: "红砂", en: "Hongsha" },
    zodiac: { zh: "阿比西尼亚猫", en: "Abyssinian" },
    role: { zh: "轻装探路猫", en: "Nimble path finder" },
    specialty: { zh: "轻快去探路", en: "Explore with ease" },
    vignette: {
      zh: "红砂总在门缝刚亮时迈出第一步。它不保证前方没有岔路，只会把新鲜的脚印留给后来的人。",
      en: "Hongsha steps out as soon as light appears beneath the door. It promises no path without forks, only fresh pawprints for whoever follows.",
    },
  },
] as const satisfies readonly SeriesMemberProfile[];

const DESKTOP_WORK_MEMBERS = [
  {
    petId: "desk-compiler-mole-mazai",
    name: {
      zh: "码仔 · 编译鼹鼠",
      en: "Mazai · Compiler Mole",
    },
    zodiac: {
      zh: "编译鼹鼠",
      en: "Compiler Mole",
    },
    role: {
      zh: "稳步拼装员",
      en: "Steady Assembler",
    },
    specialty: {
      zh: "一小步一小步，陪你把想法拼成形。",
      en: "One small step at a time, keep your idea taking shape.",
    },
    vignette: {
      zh: "桌面工作小队第一次集合时，码仔抱着两半还没扣上的琥珀搭扣，站在一堆没有顺序的零件旁。",
      en: "At the crew's first gathering, Mazai stood beside a pile of unconnected pieces, holding the two halves of an amber clasp.",
    },
  },
  {
    petId: "desk-test-beetle-diandian",
    name: {
      zh: "点点 · 测试甲虫",
      en: "Diandian · Testing Beetle",
    },
    zodiac: {
      zh: "测试甲虫",
      en: "Testing Beetle",
    },
    role: {
      zh: "细节巡检员",
      en: "Detail Scout",
    },
    specialty: {
      zh: "不急着画句号，陪你多看一个角落。",
      en: "Before calling it done, give one more corner a careful look.",
    },
    vignette: {
      zh: "点点的青绿色背甲上嵌着四颗珊瑚色小凸点。",
      en: "Four coral dots sit on Diandian's teal shell.",
    },
  },
  {
    petId: "desk-review-owl-jiaojiao",
    name: {
      zh: "校校 · 审阅猫头鹰",
      en: "Jiaojiao · Review Owl",
    },
    zodiac: {
      zh: "审阅猫头鹰",
      en: "Review Owl",
    },
    role: {
      zh: "耐心阅稿员",
      en: "Patient Reader",
    },
    specialty: {
      zh: "慢慢看一遍，让好作品更清楚一点。",
      en: "Take a patient second look and let the work become clearer.",
    },
    vignette: {
      zh: "校校总把圆圆的眼镜擦得很亮，却从不急着给一页草稿下结论。",
      en: "Jiaojiao keeps its round spectacles bright but never rushes to judge a draft.",
    },
  },
  {
    petId: "desk-search-hound-xiuxiu",
    name: {
      zh: "嗅嗅 · 搜索猎犬",
      en: "Xiuxiu · Search Hound",
    },
    zodiac: {
      zh: "搜索猎犬",
      en: "Search Hound",
    },
    role: {
      zh: "好奇寻迹员",
      en: "Curious Tracker",
    },
    specialty: {
      zh: "线索藏得再小，也值得停下来闻一闻。",
      en: "Even a small clue deserves a curious pause.",
    },
    vignette: {
      zh: "嗅嗅最先到达一个陌生地方的，通常是那只圆圆的鼻子。",
      en: "Xiuxiu usually arrives at an unfamiliar place nose first, with orange ears following a moment later.",
    },
  },
  {
    petId: "desk-plan-beaver-gege",
    name: {
      zh: "格格 · 规划海狸",
      en: "Gege · Planning Beaver",
    },
    zodiac: {
      zh: "规划海狸",
      en: "Planning Beaver",
    },
    role: {
      zh: "小步规划员",
      en: "Small-Step Planner",
    },
    specialty: {
      zh: "先划出今天这一格，再慢慢走向远处。",
      en: "Choose today's small square before looking farther ahead.",
    },
    vignette: {
      zh: "格格的宽尾巴上有一排浅浅的小格子，它总喜欢坐稳以后，才开始用前爪比划接下来的安排。",
      en: "Shallow squares run across Gege's broad tail.",
    },
  },
  {
    petId: "desk-deploy-pigeon-yundi",
    name: {
      zh: "云递 · 部署信鸽",
      en: "Yundi · Deployment Pigeon",
    },
    zodiac: {
      zh: "部署信鸽",
      en: "Deployment Pigeon",
    },
    role: {
      zh: "可靠送达员",
      en: "Reliable Courier",
    },
    specialty: {
      zh: "快到终点的时候，陪你把最后一步走稳。",
      en: "Near the finish, keep the final step steady.",
    },
    vignette: {
      zh: "云递有一条亮眼的橙色背带，圆角小胶囊总贴在它背后。",
      en: "Yundi wears an orange harness with a rounded capsule secured close to its back.",
    },
  },
  {
    petId: "desk-memory-squirrel-licun",
    name: {
      zh: "栗存 · 记忆松鼠",
      en: "Licun · Memory Squirrel",
    },
    zodiac: {
      zh: "记忆松鼠",
      en: "Memory Squirrel",
    },
    role: {
      zh: "细心收藏员",
      en: "Thoughtful Keeper",
    },
    specialty: {
      zh: "重要的小事，值得给它留一个位置。",
      en: "Give the small things that matter a place to stay.",
    },
    vignette: {
      zh: "栗存背着一个薄荷绿的橡果小包，走到哪里都会先摸摸肩带，确认它还贴在身边。",
      en: "Licun carries a mint-green acorn pack and checks its straps wherever it goes.",
    },
  },
  {
    petId: "desk-data-octopus-duoduo",
    name: {
      zh: "多多 · 数据章鱼",
      en: "Duoduo · Data Octopus",
    },
    zodiac: {
      zh: "数据章鱼",
      en: "Data Octopus",
    },
    role: {
      zh: "节拍整理员",
      en: "Rhythm Keeper",
    },
    specialty: {
      zh: "事情再多，也可以一次理清一条线。",
      en: "Even with plenty to consider, follow one thread at a time.",
    },
    vignette: {
      zh: "多多有八只短短的触手，却并不喜欢同时把所有东西举到空中。",
      en: "Duoduo has eight short arms but does not try to lift everything at once.",
    },
  },
  {
    petId: "desk-design-red-panda-caiwei",
    name: {
      zh: "彩尾 · 设计小熊猫",
      en: "Caiwei · Design Red Panda",
    },
    zodiac: {
      zh: "设计小熊猫",
      en: "Design Red Panda",
    },
    role: {
      zh: "清楚表达员",
      en: "Clarity Maker",
    },
    specialty: {
      zh: "少一点拥挤，让真正重要的东西被看见。",
      en: "Make a little room for what really matters.",
    },
    vignette: {
      zh: "彩尾的尾巴上只有三段醒目的颜色：珊瑚橙、青绿和暖黄。",
      en: "Caiwei's tail carries just three bright bands: coral, teal, and warm yellow.",
    },
  },
  {
    petId: "desk-security-hedgehog-dundun",
    name: {
      zh: "盾盾 · 安全刺猬",
      en: "Dundun · Security Hedgehog",
    },
    zodiac: {
      zh: "安全刺猬",
      en: "Security Hedgehog",
    },
    role: {
      zh: "温柔守望员",
      en: "Gentle Watchkeeper",
    },
    specialty: {
      zh: "留意边界，也给自己留一份安心。",
      en: "Notice the boundaries and leave yourself room for peace of mind.",
    },
    vignette: {
      zh: "盾盾身上的铜色小刺并不尖锐，它常把前爪轻轻放在奶油色护领旁，认真看着来来往往的伙伴。",
      en: "Dundun's copper spines are softly rounded.",
    },
  },
  {
    petId: "desk-waiting-sloth-manman",
    name: {
      zh: "慢慢 · 等待树懒",
      en: "Manman · Waiting Sloth",
    },
    zodiac: {
      zh: "等待树懒",
      en: "Waiting Sloth",
    },
    role: {
      zh: "安心陪伴员",
      en: "Quiet Companion",
    },
    specialty: {
      zh: "结果还没来，也可以先好好呼吸。",
      en: "While the result is on its way, take a comfortable breath.",
    },
    vignette: {
      zh: "慢慢的淡紫色颈枕总安稳地搭在肩上，长长的手臂摆动起来，像一句没有催促的招呼。",
      en: "A pale-lilac pillow rests on Manman's shoulders, and its long arms move like an unhurried greeting.",
    },
  },
  {
    petId: "desk-debug-salamander-huohua",
    name: {
      zh: "火花 · 调试火蜥蜴",
      en: "Huohua · Debugging Salamander",
    },
    zodiac: {
      zh: "调试火蜥蜴",
      en: "Debugging Salamander",
    },
    role: {
      zh: "耐心探因员",
      en: "Patient Investigator",
    },
    specialty: {
      zh: "先抓住一个变化，再慢慢走近原因。",
      en: "Start with one change and work your way toward the cause.",
    },
    vignette: {
      zh: "火花背上的鳍脊连成一道柔软的弧线，颜色从暗红慢慢过渡到琥珀橙。",
      en: "Huohua's soft dorsal frill forms one continuous curve, shading from deep ember to amber.",
    },
  },
] as const satisfies readonly SeriesMemberProfile[];

const DESK_CORNER_MEMBERS = [
  {
    petId: "foldlume",
    name: { zh: "折灯", en: "Foldlume" },
    zodiac: { zh: "折纸灯精灵", en: "Paper Lantern Spirit" },
    role: { zh: "留灯的小伙伴", en: "Keeper of a Little Light" },
    specialty: { zh: "给下一步留一点亮", en: "A little light for the next step" },
    vignette: {
      zh: "折灯头顶总有一个不太服帖的小折角。受挫时它会低一低头，再把杏色的光慢慢撑开。",
      en: "One little corner on Foldlume's head never lies quite flat. After a setback, it dips for a moment, then gently opens its apricot light again.",
    },
  },
  {
    petId: "eavie",
    name: { zh: "檐豆", en: "Eavie" },
    zodiac: { zh: "叶屋蜗牛", en: "Leaf-House Snail" },
    role: { zh: "带着家探路", en: "At Home on the Trail" },
    specialty: { zh: "安心探一个新角落", en: "Explore one new corner" },
    vignette: {
      zh: "檐豆把砖红门帘整理好，短短的触角就先探了出去。它走得慢，却总能带回来一个新发现。",
      en: "Once the terracotta curtain is straight, Eavie's short antennae peek outside. It moves slowly and always returns with something new to share.",
    },
  },
  {
    petId: "mendmoth",
    name: { zh: "补补", en: "Mendmoth" },
    zodiac: { zh: "暖毯蛾", en: "Blanket Moth" },
    role: { zh: "温柔收尾员", en: "A Gentle Wrap-Up Friend" },
    specialty: { zh: "给心情一个软着陆", en: "A soft landing for the day" },
    vignette: {
      zh: "补补把灰蓝翅膀收成一条小毯子，左翼的暖黄补丁仍露在外面。照顾别人前，它也会轻轻拍拍自己。",
      en: "Mendmoth folds gray-blue wings into a small blanket, leaving the warm-yellow patch on its left wing visible. It gives itself a gentle pat, too.",
    },
  },
  {
    petId: "dewbert",
    name: {
      zh: "露团",
      en: "Dewbert",
    },
    zodiac: {
      zh: "露珠团子",
      en: "Dewdrop Companion",
    },
    role: {
      zh: "清晨的小呼吸",
      en: "A Fresh Little Breath",
    },
    specialty: {
      zh: "先放松，再开始",
      en: "A calm breath before you begin",
    },
    vignette: {
      zh: "露团把蓝蓝的身体轻轻撑开，再慢慢放松。它总给忙碌的开头，留一口从容的气。",
      en: "Dewbert rises with a small breath, then softly settles. Every busy beginning gets a little room to breathe.",
    },
  },
  {
    petId: "spriggle",
    name: {
      zh: "芽团",
      en: "Spriggle",
    },
    zodiac: {
      zh: "嫩芽团子",
      en: "Little Root Sprout",
    },
    role: {
      zh: "小进步收藏家",
      en: "Keeper of Small Steps",
    },
    specialty: {
      zh: "每天长一点点",
      en: "Grow a little every day",
    },
    vignette: {
      zh: "芽团头上的两片叶子总比昨天舒展一点。它把每一次小小的坚持，都当作值得收藏的阳光。",
      en: "Spriggle's two leaves open a little more each day. Every small effort becomes another bit of sunshine to keep.",
    },
  },
  {
    petId: "bloomble",
    name: {
      zh: "绒朵",
      en: "Bloomble",
    },
    zodiac: {
      zh: "绒绒雏菊",
      en: "Plush Daisy",
    },
    role: {
      zh: "小小庆祝家",
      en: "Little Celebration Friend",
    },
    specialty: {
      zh: "为小成果开心",
      en: "Celebrate the little wins",
    },
    vignette: {
      zh: "绒朵不用等到最后一刻才开心。看见一丁点进展，它的六片软花瓣就会轻轻晃起来。",
      en: "Bloomble never waits for the very end to be happy. A little progress is enough to set its six soft petals swaying.",
    },
  },
  {
    petId: "quillip",
    name: {
      zh: "纸啾",
      en: "Quillip",
    },
    zodiac: {
      zh: "折纸小雀",
      en: "Folded-Paper Finch",
    },
    role: {
      zh: "轻快报喜员",
      en: "Bearer of Little Good News",
    },
    specialty: {
      zh: "让灵感轻轻落下",
      en: "Give a new idea a place to land",
    },
    vignette: {
      zh: "纸啾沿着纸边轻快小跑，把蓝色折翼收得整整齐齐。每次回来，它只带一个最想告诉你的新点子。",
      en: "Quillip trots along the page with neatly folded blue wings. Each return brings one new idea it cannot wait to share.",
    },
  },
  {
    petId: "inklet",
    name: {
      zh: "墨点",
      en: "Inklet",
    },
    zodiac: {
      zh: "墨滴小章鱼",
      en: "Inkdrop Octopod",
    },
    role: {
      zh: "安静专注员",
      en: "Quiet Focus Friend",
    },
    specialty: {
      zh: "慢慢理清思绪",
      en: "Let your thoughts settle into place",
    },
    vignette: {
      zh: "墨点总先把四只小脚放稳，再认真看一眼。散开的思绪到了它身边，会慢慢找到同一个起点。",
      en: "Inklet plants four little feet before taking a careful look. Scattered thoughts slowly find a shared beginning beside it.",
    },
  },
  {
    petId: "buttonbud",
    name: {
      zh: "扣扣",
      en: "Buttonbud",
    },
    zodiac: {
      zh: "纽扣小熊",
      en: "Button-Coat Bear",
    },
    role: {
      zh: "耐心重启员",
      en: "Patient Fresh-Start Friend",
    },
    specialty: {
      zh: "重新扣好第一步",
      en: "Fasten the first step again",
    },
    vignette: {
      zh: "扣扣会先拍拍橙色的纽扣外套，再试着站起来。重新出发的时候，它从来不催你快一点。",
      en: "Buttonbud pats its orange button coat, then tries standing up again. It never hurries a fresh start.",
    },
  },
  {
    petId: "spoolie",
    name: {
      zh: "线眠",
      en: "Spoolie",
    },
    zodiac: {
      zh: "线轴睡鼠",
      en: "Thread-Spool Dormouse",
    },
    role: {
      zh: "思绪整理员",
      en: "A Gentle Thought Untangler",
    },
    specialty: {
      zh: "把纷乱慢慢理顺",
      en: "Find the thread through a busy day",
    },
    vignette: {
      zh: "线眠把淡紫色线圈收得稳稳的，竖起圆耳朵听你慢慢说。它相信，越是打结的时候，越不用使劲拉。",
      en: "Spoolie keeps its lavender threads snug and listens with round ears. A tangled moment calls for patience, not a harder pull.",
    },
  },
  {
    petId: "crumbit",
    name: {
      zh: "酥角",
      en: "Crumbit",
    },
    zodiac: {
      zh: "黄油饼角",
      en: "Butter-Biscuit Friend",
    },
    role: {
      zh: "休息提醒员",
      en: "Little Break-Time Friend",
    },
    specialty: {
      zh: "给今天留点甜",
      en: "Save a little sweetness for today",
    },
    vignette: {
      zh: "酥角会在大家忙得忘了时间时，慢慢伸一个懒腰。它想给每个认真的日子，留一小块甜。",
      en: "Crumbit stretches whenever the others lose track of time. Every earnest day deserves a little patch of sweetness.",
    },
  },
  {
    petId: "thimblet",
    name: {
      zh: "顶顶",
      en: "Thimblet",
    },
    zodiac: {
      zh: "顶针小龟",
      en: "Thimble Turtle",
    },
    role: {
      zh: "慢慢尝试员",
      en: "A Brave Little Try",
    },
    specialty: {
      zh: "带着安心向前走",
      en: "Take a small brave step",
    },
    vignette: {
      zh: "顶顶从薄荷色的小壳里探出圆脑袋，先看看，再走一步。它慢慢地告诉你：安心和勇敢可以同时带着。",
      en: "Thimblet peeks from its mint shell, looks around, and takes one step. Reassurance and courage can come along together.",
    },
  },
] as const satisfies readonly SeriesMemberProfile[];

export const PET_SERIES = [
  {
    id: "desk-corner-friends",
    name: { zh: "桌角小居民", en: "Desk Corner Friends" },
    subtitle: { zh: "十二位小邻居，一个暖暖的桌角", en: "Twelve little neighbors, one cozy corner" },
    status: { zh: "新上线", en: "Just launched" },
    description: {
      zh: "从清晨的一口气到夜晚的一盏灯，总有一位伙伴懂你的步调。",
      en: "From a morning breath to an evening light, find a companion who shares your pace.",
    },
    selectionTitle: { zh: "认识你的桌角邻居", en: "Meet your corner neighbors" },
    storyTitle: { zh: "桌角还亮着", en: "The Corner Is Still Lit" },
    storyChapter: { zh: "第二章：桌角多了九个位置", en: "Chapter Two: Nine More Places at the Desk" },
    story: {
      zh: "折灯第一次亮起来时，只照到了桌边一小块空白。檐豆背着叶屋慢慢路过，发现那里刚好可以停一停；补补把翅膀收好，坐在灯光最柔和的地方。它们没有约定一定要完成什么，只约好在对方回来时留个位置。折灯让下一步看得清，檐豆把小小的新鲜事带回来，补补给不顺利的一天一个软着陆。后来，桌角又多了九个位置。露团带来清晨的一口气，芽团记住每天的小进步，绒朵为刚完成的一点点摇起花瓣。纸啾送来新点子，墨点陪大家专心，扣扣守着重新开始的人。线眠慢慢理顺纷乱，酥角留出休息的空隙，顶顶陪朋友试着迈向陌生的地方。十二位小居民，不必拥有同一种节奏，也能把每一天陪得暖暖的。",
      en: "When Foldlume first lit up, it reached only a small blank space at the edge of the desk. Eavie passed with its leaf house and found just enough room to pause. Mendmoth folded its wings and settled where the glow was softest. They made no promise to finish everything; they only promised to leave a place for one another's return. Foldlume makes the next step visible, Eavie brings back little discoveries, and Mendmoth gives a difficult day somewhere soft to land. Nine more places appeared in the corner. Dewbert brought a morning breath, Spriggle noticed small steps, and Bloomble celebrated each little finish. Quillip delivered fresh ideas, Inklet made room for focus, and Buttonbud kept company with fresh starts. Spoolie untangled busy thoughts, Crumbit saved time for rest, and Thimblet accompanied the first brave step into somewhere unfamiliar. Twelve neighbors can share a warm day without moving at the same pace.",
    },
    members: DESK_CORNER_MEMBERS,
  },
  {
    id: "desktop-work-crew",
    name: {
      zh: "桌面工作小队",
      en: "Desktop Work Crew",
    },
    subtitle: {
      zh: "十二种工作节奏，十二位桌面伙伴",
      en: "Twelve work rhythms, twelve desktop companions",
    },
    status: {
      zh: "新上线",
      en: "Just launched",
    },
    description: {
      zh: "从开始动手到安心等待，挑一位合拍的动物伙伴陪你工作。",
      en: "From first steps to patient waits, find an animal companion for your working day.",
    },
    selectionTitle: {
      zh: "找一位懂你节奏的伙伴",
      en: "Find a companion for your rhythm",
    },
    storyTitle: {
      zh: "同一张桌子的十二班岗",
      en: "Twelve Watches Around One Desk",
    },
    storyChapter: {
      zh: "第一章：今天也一起开工",
      en: "Chapter One: Another Day Together",
    },
    story: {
      zh: "清晨，码仔合拢背心搭扣，格格在尾巴上比划今天的小计划。嗅嗅先探出鼻子，点点沿着熟悉的节拍走过，校校还在认真看最后一行。栗存收好值得记住的小事，多多让忙碌有了顺序，彩尾为拥挤的画面留出空白。盾盾守着边界，火花追着变化，云递准备送出今天的成果。灯暗下来的时候，慢慢挪了挪颈枕，给还在等待的伙伴留一个位置。它们用各自的小动作和性格，陪你度过忙碌与等待，让同一张桌子上的一天更有温度。",
      en: "In the morning, Mazai fastens a vest clasp while Gege measures out a small plan. Xiuxiu leads with a curious nose, Diandian follows a familiar rhythm, and Jiaojiao gives the final line another look. Licun keeps a few worthwhile memories, Duoduo brings order to the busy moments, and Caiwei makes room in a crowded picture. Dundun watches the boundaries, Huohua follows a change, and Yundi prepares to carry the day's little achievements. As the light dims, Manman adjusts its neck pillow and leaves a comfortable place for whoever is still waiting. Through busy moments and quiet waits, their little movements and personalities make a day around the same desk feel warmer.",
    },
    members: DESKTOP_WORK_MEMBERS,
  },
  {
    id: "cat-companion-club",
    name: { zh: "呼噜事务所", en: "The Purr Bureau" },
    subtitle: { zh: "Q版品种猫", en: "Chibi Breed Cats" },
    status: { zh: "新上线", en: "Just launched" },
    description: {
      zh: "挑一只合拍的猫，陪你工作一会儿。",
      en: "Pick a cat that suits your pace.",
    },
    selectionTitle: { zh: "挑一只陪你今天", en: "Choose today's companion" },
    storyTitle: { zh: "窗台值班簿", en: "The Window-Seat Log" },
    storyChapter: { zh: "第一章：灯亮之后", en: "Chapter One: When the Light Came On" },
    story: {
      zh: "每天夜里，Codex 窗口亮起后，猫咪们便从各自熟悉的角落来到同一排窗台。云朵守着安静，银饼检查动静，金豹先追上滚远的光标。它们不替你完成工作，只在等待、思考和完成之间，留下呼噜、脚步和一盏没关的灯。每只猫都有自己的节奏，偶尔也会在别人的故事里经过。",
      en: "Each night, when the Codex window lights up, the cats arrive from their own familiar corners and settle along the same sill. Yunduo keeps the quiet, Yinbing checks every small sound, and Jinbao chases the cursor that rolls too far. They do not do the work for you; they simply leave purrs, pawsteps, and one warm light between waiting, thinking, and finishing. Each cat keeps a rhythm of its own, occasionally wandering through another cat's story.",
    },
    members: CAT_COMPANION_MEMBERS,
  },
  {
    id: "golden-feather-constellation",
    name: { zh: "金羽十二星", en: "Golden Feather Constellation" },
    subtitle: { zh: "十二星座守护鸭系列", en: "Zodiac Guardian Duck Series" },
    status: { zh: "经典系列", en: "Classic collection" },
    description: {
      zh: "每只守护鸭都有自己的脾气和气质，选一位与你合拍的桌面伙伴。",
      en: "Each guardian duck brings a different personality to your desk. Choose the one that feels like your kind of company.",
    },
    selectionTitle: { zh: "找一位合拍的守护鸭", en: "Find your zodiac companion" },
    storyTitle: { zh: "星轨纪事", en: "Chronicle of the Star Route" },
    storyChapter: { zh: "序章：长夜熄灯", en: "Prologue: When the Night Went Dark" },
    story: {
      zh: "长夜第一次覆盖星铠港时，金羽沿着熄灭的星轨散落。白羊点亮起点，金牛守住余火，双子把失联的讯号分成两路。它们各自守护一段路，也会在彼此经过的桌面留下星痕。等最后一枚金羽归位，新的航线便从任务栏亮起。",
      en: "When the long night first covered Aster Harbor, golden feathers scattered along the darkened star route. Aries lit the start, Taurus guarded the remaining flame, and Gemini split a lost signal in two. Each guardian kept a different stretch of the route, leaving a trace wherever another had passed. When the final feather returned, a new course lit up from the taskbar.",
    },
    members: GOLDEN_FEATHER_MEMBERS,
  },
] as const satisfies readonly PetSeries[];

export const FEATURED_SERIES_ID = "desk-corner-friends";

export function getFeaturedSeries() {
  return getSeriesById(FEATURED_SERIES_ID) ?? PET_SERIES[0];
}

export function getEditorialSeries() {
  const featured = getFeaturedSeries();
  return featured
    ? [featured, ...PET_SERIES.filter((series) => series.id !== featured.id)]
    : [...PET_SERIES];
}

export function getEditorialPetIds() {
  return [
    ...getEditorialSeries().flatMap((series) =>
      series.members.map((member) => member.petId),
    ),
    GUIDE_PET_ID,
  ];
}

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

export function getMemberProfile(petId: string): SeriesMemberProfile | undefined {
  return PET_SERIES.flatMap<SeriesMemberProfile>((series) => series.members).find(
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
