import type { PetEditorialContent } from "./pet-content";
import type { Pet, PetNeed } from "./pets";
import type { PetSeries } from "./series";

export const BLEACH_EDITORIAL_CONTENT = {
  "bleach-ichigo": {
    "zodiacZh": "代理死神",
    "zodiacEn": "Substitute Soul Reaper",
    "roleZh": "挺身而出的伙伴",
    "roleEn": "The friend who steps forward",
    "promiseZh": "下一步，我陪你一起走。",
    "promiseEn": "I will take the next step with you.",
    "storyTitleZh": "先迈出那一步",
    "storyTitleEn": "The First Step Forward",
    "storyZh": "一护把斩月背稳的时候，桌边的灯刚刚亮起。他没有急着催谁出发，只是回头看了一眼，确认露琪亚、织姬、雨龙和茶渡都在。面前的事情还没有头绪，他便先从最小的一步开始：站直，深呼吸，再把目光放回眼前。偶尔碰了壁，他也会皱起眉头，低头停上一会儿，但很快又把肩膀挺起来。需要力量时，黑色长衣随灵压展开；回到日常后，他仍然是那个会抬手打招呼、认真听伙伴说话的人。守护不只发生在战斗里，也藏在一句没有说出口的陪伴中。今天还没有走完的路，他愿意陪你接着走。",
    "storyEn": "Ichigo settles Zangetsu on his back as the desk lamp comes on. Before moving, he checks that Rukia, Orihime, Uryu and Chad are close. The day is not clear yet, so he begins with something small: stand straight, take a breath and look at what is in front of him. A setback may draw a frown, but he soon lifts his shoulders again. When strength is needed, spiritual pressure unfurls his black coat. Afterwards he is still the friend who waves hello and listens. Protection lives in ordinary company too, and he is ready to share the road that remains.",
    "comfortZh": "不用一下子做到最好，先把眼前这一步走稳。",
    "comfortEn": "You do not have to get everything right. Give this next step a steady start.",
    "moments": [
      {
        "titleZh": "准备出发",
        "titleEn": "Ready to begin",
        "bodyZh": "把肩膀放松，先选一件眼前能做的小事。",
        "bodyEn": "Relax your shoulders and choose one small thing within reach.",
      },
      {
        "titleZh": "碰到难题",
        "titleEn": "A difficult moment",
        "bodyZh": "停一下也没关系，重新站稳再继续。",
        "bodyEn": "It is fine to pause. Find your footing before continuing.",
      },
      {
        "titleZh": "力量展开",
        "titleEn": "Power unfolds",
        "bodyZh": "灵压收束，天锁斩月带来更坚定的姿态。",
        "bodyEn": "Spiritual pressure gathers into the resolve of Tensa Zangetsu.",
      },
    ],
    "traitsZh": [
      "坚定",
      "热心",
      "直率",
    ],
    "traitsEn": [
      "Resolute",
      "Caring",
      "Direct",
    ],
    "matchZh": "适合准备开工、需要一点勇气，或想有人并肩的时候。",
    "matchEn": "For a fresh start, a little courage or someone standing beside you.",
  },
  "bleach-rukia": {
    "zodiacZh": "袖白雪的持有者",
    "zodiacEn": "Wielder of Sode no Shirayuki",
    "roleZh": "冷静而坚定的伙伴",
    "roleEn": "A quietly resolute friend",
    "promiseZh": "先看清楚，再稳稳向前。",
    "promiseEn": "See clearly, then move with care.",
    "storyTitleZh": "雪落下之前",
    "storyTitleEn": "Before the Snow Settles",
    "storyZh": "露琪亚总会先看清眼前的事情，再决定什么时候出手。到了桌边，这份认真变成了一个小小的点头、一次仔细的侧望，和在你犹豫时耐心停下的脚步。她不喜欢把每个问题都说得很大，也不会因为一点挫折就急着改变方向。有时一护已经准备向前，她还会抬起手，提醒大家再确认一次；等到路真的看清了，她又会毫不迟疑地跟上。白刀轻轻扬起时，寒气把周围变得宁静，雪白的姿态里仍是熟悉的坚定目光。力量收起之后，她整理好衣袖，继续安静站在你身边。今天的节奏可以慢一点，重要的是知道自己正在往哪里走。",
    "storyEn": "Rukia looks carefully before deciding when to act. At the desk, that attention becomes a small nod, a thoughtful glance and a patient pause when you hesitate. She does not make every difficulty sound enormous, nor does one setback send her in a new direction. Sometimes Ichigo is already moving when she raises a hand to check once more. Once the way is clear, she follows without hesitation. Her white blade rises, the air grows quiet, and familiar resolve remains in her snow-white form. When that power settles, she straightens her sleeve and stays beside you. The pace can be gentle when the direction is clear.",
    "comfortZh": "把目光放回眼前，安静也可以很有力量。",
    "comfortEn": "Look at what is in front of you. Quiet can be a kind of strength.",
    "moments": [
      {
        "titleZh": "认真看看",
        "titleEn": "A closer look",
        "bodyZh": "先确认最关键的一处，再慢慢展开。",
        "bodyEn": "Check the important detail before moving on.",
      },
      {
        "titleZh": "需要停顿",
        "titleEn": "A quiet pause",
        "bodyZh": "不必急着回应，留一点时间把想法理顺。",
        "bodyEn": "There is time to let your thoughts settle before answering.",
      },
      {
        "titleZh": "白雪展开",
        "titleEn": "A snowy form",
        "bodyZh": "白霞罚展开，雪白衣袖与寒气一同舒展。",
        "bodyEn": "Hakka no Togame unfolds in white robes and rising cold.",
      },
    ],
    "traitsZh": [
      "冷静",
      "认真",
      "坚定",
    ],
    "traitsEn": [
      "Calm",
      "Attentive",
      "Resolute",
    ],
    "matchZh": "适合梳理思绪、检查细节，或想把步调放稳的时候。",
    "matchEn": "For sorting thoughts, checking details or finding a steadier pace.",
  },
  "bleach-orihime": {
    "zodiacZh": "盾舜六花的持有者",
    "zodiacEn": "Bearer of Shun Shun Rikka",
    "roleZh": "温柔的守护伙伴",
    "roleEn": "A gentle protector",
    "promiseZh": "这里有一处可以安心的位置。",
    "promiseEn": "There is a little room for reassurance here.",
    "storyTitleZh": "留给伙伴的位置",
    "storyTitleEn": "A Place Kept for a Friend",
    "storyZh": "织姬来到桌边时，总会先带来一个明亮的笑容。她听见伙伴说话，会微微侧过头；看见有人有些泄气，就把手轻轻放在身前，认真等对方说完。她并不把温柔理解成什么都不做，而是在需要的时候站稳，给别人留出喘口气的位置。蓝色花夹亮起，三点光沿着双手前方连成护盾，熟悉的长发与白衣仍然清晰可见。等紧张的时刻过去，她便收起力量，恢复轻快的小动作，像是在说今天还有许多值得期待的事情。桌边的这一小段陪伴，不要求你一直有精神，也不催你立刻振作。你愿意重新开始时，她会笑着和你一起抬起头。",
    "storyEn": "Orihime brings a bright smile to the desk. She tilts her head to listen and waits patiently when a friend feels discouraged. To her, kindness is active: it means standing firm and giving someone room to breathe. Her blue flower clips shine, three points connect into a shield before her hands, and her familiar hair and white clothing stay in view. When the tense moment passes, she lets the power settle and returns to her light, cheerful movements. There is still something to look forward to. Her company does not require constant energy or an instant recovery. When you are ready to begin again, she looks up with you.",
    "comfortZh": "累了可以停一小会儿，温柔也会陪你重新开始。",
    "comfortEn": "Rest for a moment if you need to. A kind beginning will still be here.",
    "moments": [
      {
        "titleZh": "打个招呼",
        "titleEn": "A warm hello",
        "bodyZh": "笑着抬起手，给平常的一天一点明亮。",
        "bodyEn": "A cheerful wave brings light to an ordinary day.",
      },
      {
        "titleZh": "安心等候",
        "titleEn": "A reassuring wait",
        "bodyZh": "先把呼吸放慢，再决定下一步。",
        "bodyEn": "Slow your breathing before choosing the next step.",
      },
      {
        "titleZh": "护盾展开",
        "titleEn": "Raise the shield",
        "bodyZh": "三天结盾在身前展开，留下温暖的金色光芒。",
        "bodyEn": "Santen Kesshun opens ahead in a warm golden glow.",
      },
    ],
    "traitsZh": [
      "温柔",
      "开朗",
      "坚韧",
    ],
    "traitsEn": [
      "Gentle",
      "Bright",
      "Resilient",
    ],
    "matchZh": "适合需要安慰、忙碌后的休息，或想温柔开个头的时候。",
    "matchEn": "For reassurance, a pause after a busy stretch or a gentle beginning.",
  },
  "bleach-uryu": {
    "zodiacZh": "灭却师",
    "zodiacEn": "Quincy",
    "roleZh": "专注而精准的伙伴",
    "roleEn": "A focused, precise companion",
    "promiseZh": "看清细节，下一步就会更明确。",
    "promiseEn": "Notice the detail and the next step becomes clearer.",
    "storyTitleZh": "眼镜之后的目光",
    "storyTitleEn": "A Clearer Look",
    "storyZh": "雨龙习惯先整理好自己的状态，再开始面对眼前的问题。到了桌边，他会轻轻推一下眼镜，站定，低头确认，然后换个角度再看一次。他不急着给出答案，更愿意把容易忽略的细节一一找出来。遇到暂时不明白的地方，他会短暂停顿，却不会用更大的动静掩盖疑问。伙伴准备继续时，他总能把目光放回同一个方向。灵子聚拢的片刻，青蓝色几何光翼在背后展开，手甲与脚甲透出清澈的光；而镜片之后，仍是那双熟悉而认真的眼睛。等力量收束，他把衣袖整理平整，回到安静的陪伴中。慢一点看清楚，常常能让接下来的路走得更稳。",
    "storyEn": "Uryu prefers to settle himself before approaching a problem. At the desk he adjusts his glasses, stands still, checks once and looks from another angle. He is less interested in a quick answer than in the detail everyone might have missed. A difficult question earns a quiet pause rather than a dramatic response. When the others move on, he finds the same direction. Spirit particles gather into cyan geometric wings and clear armor around his hands and legs, but the attentive eyes behind his glasses remain familiar. Afterwards he smooths his sleeve and returns to quiet company. Taking time to see clearly can make the road ahead steadier.",
    "comfortZh": "暂时没有答案也没关系，把一处细节看清就很好。",
    "comfortEn": "An answer can wait. Noticing one useful detail is already progress.",
    "moments": [
      {
        "titleZh": "开始专注",
        "titleEn": "Finding focus",
        "bodyZh": "推好眼镜，先把注意力放在一件事上。",
        "bodyEn": "Adjust your glasses and settle on one thing.",
      },
      {
        "titleZh": "再确认一次",
        "titleEn": "One more check",
        "bodyZh": "换个角度，看看有没有遗漏的小线索。",
        "bodyEn": "Try another angle and notice the quiet clue.",
      },
      {
        "titleZh": "完圣体展开",
        "titleEn": "Reveal Vollständig",
        "bodyZh": "青蓝灵子翼与晶体护甲一同显现。",
        "bodyEn": "Cyan spirit wings and crystalline armor emerge together.",
      },
    ],
    "traitsZh": [
      "理性",
      "细致",
      "专注",
    ],
    "traitsEn": [
      "Thoughtful",
      "Meticulous",
      "Focused",
    ],
    "matchZh": "适合专心思考、核对细节，或想把事情看得更清楚的时候。",
    "matchEn": "For focused thought, a careful check or a clearer view of things.",
  },
  "bleach-chad": {
    "zodiacZh": "双臂力量的守护者",
    "zodiacEn": "A protector with powerful arms",
    "roleZh": "沉稳可靠的伙伴",
    "roleEn": "A steady, dependable friend",
    "promiseZh": "不用着急，我会稳稳站在这里。",
    "promiseEn": "Take your time. I will be right here.",
    "storyTitleZh": "安静站在身边",
    "storyTitleEn": "Quietly Beside You",
    "storyZh": "茶渡不常用许多话表达关心，却总能让身边的人知道他在。到了桌边，他会把脚步放稳，轻轻点头，然后安静地等你开始。事情顺利时，他抬起手给一个简单的回应；事情不顺时，他也不会急着催促，只是留在原来的位置，陪你缓过那一小会儿。需要守护的时候，右臂先显现黑红色护甲，左臂随后覆上白色，厚实的姿态依旧保持清楚而稳定。他没有因为力量变大就变得喧闹，反而更认真地看向伙伴所在的方向。等一切安定，他放下双手，重新露出熟悉的平静神情。今天不管走得快还是慢，都可以在这份沉默的陪伴里，找到一点踏实。",
    "storyEn": "Chad rarely needs many words to show that he cares. At the desk he plants his feet, gives a small nod and waits for you to begin. A good moment receives a simple raised hand. A difficult one is met with patient company rather than a demand to hurry. When protection is needed, black-and-red armor forms on his right arm, followed by white armor on his left. His broad stance stays steady. Greater strength does not make him louder; it makes his attention to his friends more deliberate. Once everything settles, he lowers his hands and returns to his familiar calm. Whatever today's pace, there is reassurance in his quiet presence.",
    "comfortZh": "慢慢来也可以，有些陪伴不需要很多话。",
    "comfortEn": "A gentle pace is welcome. Good company does not always need many words.",
    "moments": [
      {
        "titleZh": "稳稳开始",
        "titleEn": "A steady start",
        "bodyZh": "站好，点头，给今天一个踏实的开头。",
        "bodyEn": "Plant your feet and give the day a steady beginning.",
      },
      {
        "titleZh": "耐心等待",
        "titleEn": "Patient company",
        "bodyZh": "不用一直说话，安静待在一起也很好。",
        "bodyEn": "Quiet time together can be enough.",
      },
      {
        "titleZh": "双臂解放",
        "titleEn": "Release both arms",
        "bodyZh": "黑红右臂与白色左臂守在身前，让伙伴安心。",
        "bodyEn": "The black-and-red right arm and white left arm rise to protect his friends.",
      },
    ],
    "traitsZh": [
      "沉稳",
      "可靠",
      "温厚",
    ],
    "traitsEn": [
      "Steady",
      "Dependable",
      "Kind",
    ],
    "matchZh": "适合长时间专心、耐心等待，或想要安稳陪伴的时候。",
    "matchEn": "For a long stretch of focus, a patient wait or reassuring company.",
  },
} as const satisfies Record<string, PetEditorialContent>;

export const BLEACH_PET_DEFINITIONS = [
  {
    "id": "bleach-ichigo",
    "category": "bleach",
    "zodiacOrder": null,
    "needs": [
      "start",
      "steady",
    ],
    "displayName": {
      "zh": "黑崎一护",
      "en": "Ichigo Kurosaki",
    },
    "badge": "BLEACH 01",
    "accent": "#ee793d",
    "softAccent": "#ffe6c9",
  },
  {
    "id": "bleach-rukia",
    "category": "bleach",
    "zodiacOrder": null,
    "needs": [
      "solve",
      "steady",
    ],
    "displayName": {
      "zh": "朽木露琪亚",
      "en": "Rukia Kuchiki",
    },
    "badge": "BLEACH 02",
    "accent": "#8fc4e1",
    "softAccent": "#e3f3fb",
  },
  {
    "id": "bleach-orihime",
    "category": "bleach",
    "zodiacOrder": null,
    "needs": [
      "comfort",
      "start",
    ],
    "displayName": {
      "zh": "井上织姬",
      "en": "Orihime Inoue",
    },
    "badge": "BLEACH 03",
    "accent": "#dc9d64",
    "softAccent": "#fff0d8",
  },
  {
    "id": "bleach-uryu",
    "category": "bleach",
    "zodiacOrder": null,
    "needs": [
      "solve",
      "steady",
    ],
    "displayName": {
      "zh": "石田雨龙",
      "en": "Uryu Ishida",
    },
    "badge": "BLEACH 04",
    "accent": "#5caecc",
    "softAccent": "#e0f4fc",
  },
  {
    "id": "bleach-chad",
    "category": "bleach",
    "zodiacOrder": null,
    "needs": [
      "steady",
      "comfort",
    ],
    "displayName": {
      "zh": "茶渡泰虎",
      "en": "Yasutora Sado",
    },
    "badge": "BLEACH 05",
    "accent": "#ac6257",
    "softAccent": "#f3e2dd",
  },
] as const satisfies readonly {
  id: string;
  category: Pet["category"];
  zodiacOrder: null;
  needs: readonly PetNeed[];
  displayName: { zh: string; en: string };
  badge: string;
  accent: string;
  softAccent: string;
}[];

export const BLEACH_SERIES = {
  "id": "bleach-spirit-squad",
  "name": {
    "zh": "死神 · 灵子小队",
    "en": "BLEACH · Spirit Squad",
  },
  "subtitle": {
    "zh": "五位熟悉的伙伴，一起展开力量",
    "en": "Five familiar friends. A little power by your side.",
  },
  "status": {
    "zh": "全新登场",
    "en": "New arrivals",
  },
  "description": {
    "zh": "《BLEACH》原作人物的 Q 版同人桌宠。陪你度过日常，也能展开各自的守护力量。",
    "en": "Chibi fan companions inspired by the original BLEACH characters. Share everyday moments and discover each friend's protective power.",
  },
  "selectionTitle": {
    "zh": "选择你的同行伙伴",
    "en": "Choose your companion",
  },
  "storyTitle": {
    "zh": "力量收起的时候",
    "en": "When Their Powers Settle",
  },
  "storyChapter": {
    "zh": "桌边小记 · 同人演绎",
    "en": "A desk-side moment · Fan interpretation",
  },
  "story": {
    "zh": "一护先向前走了一步，露琪亚提醒他回头看看。织姬笑着招手，雨龙推好眼镜，茶渡已经在旁边站稳。到了桌边，熟悉的力量也有了安静的一面：一次招呼、一个点头、片刻专注，还有等你准备好再出发的耐心。需要一点气势时，黑色灵压、雪白寒气、金色护盾、青蓝光翼与坚实双臂会依次展开。等光芒散去，他们仍然在原来的位置。每个人守护伙伴的方式不同，却都愿意陪你把今天继续下去。",
    "en": "Ichigo takes the first step, and Rukia reminds him to look back. Orihime waves, Uryu adjusts his glasses, and Chad is already standing steadily beside them. At the desk, their familiar powers have a quieter side: a greeting, a nod, a moment of focus and the patience to wait until you are ready. When the moment calls for it, black spiritual pressure, white frost, a golden shield, cyan wings and powerful arms unfold. As the light settles, they are still there. Each protects a friend in a different way, and each is ready to share the rest of the day.",
  },
  "attribution": {
    "zh": "角色原作：久保带人《BLEACH》。本站 Q 版同人演绎。",
    "en": "Characters from Tite Kubo’s BLEACH. Chibi fan interpretations by this site.",
  },
  "members": [
    {
      "petId": "bleach-ichigo",
      "name": {
        "zh": "黑崎一护",
        "en": "Ichigo Kurosaki",
      },
      "zodiac": {
        "zh": "代理死神",
        "en": "Substitute Soul Reaper",
      },
      "role": {
        "zh": "挺身而出的伙伴",
        "en": "The friend who steps forward",
      },
      "specialty": {
        "zh": "下一步，我陪你一起走。",
        "en": "I will take the next step with you.",
      },
      "vignette": {
        "zh": "一护把斩月背稳，回头确认伙伴都在。遇到难走的一步，他总会先站到前面。",
        "en": "Ichigo settles Zangetsu on his back and checks that everyone is close. When the next step looks difficult, he is the first to move forward.",
      },
    },
    {
      "petId": "bleach-rukia",
      "name": {
        "zh": "朽木露琪亚",
        "en": "Rukia Kuchiki",
      },
      "zodiac": {
        "zh": "袖白雪的持有者",
        "en": "Wielder of Sode no Shirayuki",
      },
      "role": {
        "zh": "冷静而坚定的伙伴",
        "en": "A quietly resolute friend",
      },
      "specialty": {
        "zh": "先看清楚，再稳稳向前。",
        "en": "See clearly, then move with care.",
      },
      "vignette": {
        "zh": "露琪亚把白刀收在身侧，认真观察每一个细节。她的安静，让忙乱也能慢慢有了顺序。",
        "en": "Rukia keeps her white blade close and notices the smallest details. Her calm gives a busy moment room to settle.",
      },
    },
    {
      "petId": "bleach-orihime",
      "name": {
        "zh": "井上织姬",
        "en": "Orihime Inoue",
      },
      "zodiac": {
        "zh": "盾舜六花的持有者",
        "en": "Bearer of Shun Shun Rikka",
      },
      "role": {
        "zh": "温柔的守护伙伴",
        "en": "A gentle protector",
      },
      "specialty": {
        "zh": "这里有一处可以安心的位置。",
        "en": "There is a little room for reassurance here.",
      },
      "vignette": {
        "zh": "织姬笑着招招手，蓝色花夹在长发间轻轻晃动。金色护盾展开时，她想守住的是每一位伙伴的安心。",
        "en": "Orihime waves with a smile, her blue flower clips moving gently with her hair. When her golden shield unfolds, she wants every friend to feel safe.",
      },
    },
    {
      "petId": "bleach-uryu",
      "name": {
        "zh": "石田雨龙",
        "en": "Uryu Ishida",
      },
      "zodiac": {
        "zh": "灭却师",
        "en": "Quincy",
      },
      "role": {
        "zh": "专注而精准的伙伴",
        "en": "A focused, precise companion",
      },
      "specialty": {
        "zh": "看清细节，下一步就会更明确。",
        "en": "Notice the detail and the next step becomes clearer.",
      },
      "vignette": {
        "zh": "雨龙推好眼镜，把纷乱的线索一一看清。青蓝光翼展开后，他依然保持那份克制而认真的专注。",
        "en": "Uryu adjusts his glasses and studies each tangled clue. Even with cyan wings unfolded, his focus stays composed and precise.",
      },
    },
    {
      "petId": "bleach-chad",
      "name": {
        "zh": "茶渡泰虎",
        "en": "Yasutora Sado",
      },
      "zodiac": {
        "zh": "双臂力量的守护者",
        "en": "A protector with powerful arms",
      },
      "role": {
        "zh": "沉稳可靠的伙伴",
        "en": "A steady, dependable friend",
      },
      "specialty": {
        "zh": "不用着急，我会稳稳站在这里。",
        "en": "Take your time. I will be right here.",
      },
      "vignette": {
        "zh": "茶渡的脚步沉稳，招呼也很轻。黑红右臂和白色左臂显现时，他把可靠的守护留在了身前。",
        "en": "Chad moves steadily and greets you quietly. As his black-and-red right arm and white left arm emerge, his protection stays close.",
      },
    },
  ],
} as const satisfies PetSeries;
