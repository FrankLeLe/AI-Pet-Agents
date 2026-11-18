import type { LocalizedText, PetNeed } from "./pets";
import type { PetEditorialContent } from "./pet-content";
import type { PetSeries } from "./series";

function tr(zh: string, en: string): LocalizedText {
  return { zh, en };
}

export const CAPTAINS = [
  {
    id: "gotei-yamamoto", squad: 1, name: tr("山本元柳斋重国", "Genryusai Shigekuni Yamamoto"),
    atmosphere: "moon", restingScale: 0.988889, restingOffsetY: 0.432692,
    title: tr("炉火旁的点名册", "Roll call by the brazier"), rest: tr("静立听令", "Stand at attention"),
    power: tr("始解 · 流刃若火", "Shikai · Ryujin Jakka"), action: tr("唤起刀焰", "Kindle the blade"),
    effect: tr("木杖旁升起一线火光，流刃若火把白羽织的边沿映成暖金。", "Fire gathers along Ryujin Jakka and lights the hem of the Head Captain’s white haori."),
    vignette: tr("晨雾还没有散，山本已经把点名册摊在桌面。送信的人少带了一张回条，他便让大家先落座，自己用手杖压住被风掀起的纸角。", "The roll book is open before the morning mist has lifted. A messenger is one receipt short."),
    moment: tr("交班的灯还亮着", "The handover lamp"), close: tr("回条到齐以后，最先起身的是山本。他把门边歪斜的草鞋摆回原处，叮嘱值夜的人先吃饭，自己在炉边等下一班来接。", "Yamamoto straightens the sandals by the door and takes the next watch himself while the night shift eats."),
    story: tr("晨雾还没有散，山本已经把点名册摊在桌面。送信的人少带了一张回条，他便让大家先落座，自己用手杖压住被风掀起的纸角。直到廊下传来最后一双草鞋的声音，他才提笔，在那人的名字旁落下一点墨。队员们以为今天的晨训就要开始，他却将茶壶向门口推了推，让赶路的人先暖暖手。回条到齐以后，最先起身的是山本。他把门边歪斜的草鞋摆回原处，叮嘱值夜的人先吃饭，自己在炉边等下一班来接。木杖旁升起一线火光，流刃若火把白羽织的边沿映成暖金。", "The roll book is open before the morning mist has lifted. A messenger is one receipt short. Yamamoto holds the loose paper down with his staff until a final pair of sandals sounds in the corridor. He marks a dot beside the last name and pushes the teapot toward the door. The messenger has time to warm his hands before morning drill. Yamamoto straightens the sandals by the door and takes the next watch himself while the night shift eats. Fire gathers along Ryujin Jakka and lights the hem of the Head Captain’s white haori."),
    traitsZh: ["老练","威严","自律"], traitsEn: ["Seasoned","Commanding","Disciplined"],
    need: "steady", accent: "#e89152", softAccent: "#fbe3c9",
  },
  {
    id: "gotei-soi-fon", squad: 2, name: tr("碎蜂", "Soi Fon"),
    atmosphere: "shield", restingScale: 0.988889, restingOffsetY: 0.432692,
    title: tr("屋檐上的铃", "The bell on the eaves"), rest: tr("收步屏息", "Hold a silent stance"),
    power: tr("始解 · 雀蜂", "Shikai · Suzumebachi"), action: tr("亮出雀蜂", "Reveal Suzumebachi"),
    effect: tr("金色指刺贴合右手，身旁闪出一枚蝶形蜂纹华图样。", "A gold stinger fits over her right middle finger. A butterfly-shaped Homonka emblem flickers beside her."),
    vignette: tr("巡夜交班前，碎蜂听见檐铃多响了一声。她把半掩的窗推开一指宽，沿着屋脊走到风口，发现拴铃的结已经松了。", "One extra chime catches Soi Fon’s ear at the end of the night watch. She opens a window a finger’s width, crosses the roof and finds a loose knot on the wind bell."),
    moment: tr("最后一声铃响", "One last chime"), close: tr("她回到值房，把原先写着风向的那页翻出来，添上巡查经过的时辰。等纸上的墨迹干透，院里的新人也已经睡熟了。", "Back in the guardroom she adds the time to the weather log. By the time the ink dries, the recruit is asleep."),
    story: tr("巡夜交班前，碎蜂听见檐铃多响了一声。她把半掩的窗推开一指宽，沿着屋脊走到风口，发现拴铃的结已经松了。她没有惊动院里的新队士，俯身把绳结重新收紧，又退回刚才的位置等了一阵风。第二次掠过屋檐时，瓦片一点声音也没有。天亮后，值班的人只发现铃绳上多了一个极小的结。她回到值房，把原先写着风向的那页翻出来，添上巡查经过的时辰。等纸上的墨迹干透，院里的新人也已经睡熟了。金色指刺贴合右手，身旁闪出一枚蝶形蜂纹华图样。", "One extra chime catches Soi Fon’s ear at the end of the night watch. She opens a window a finger’s width, crosses the roof and finds a loose knot on the wind bell. She tightens it without waking the recruit below and waits for another gust before returning. At dawn, the only sign of her visit is a neatly doubled knot. Back in the guardroom she adds the time to the weather log. By the time the ink dries, the recruit is asleep. A gold stinger fits over her right middle finger. A butterfly-shaped Homonka emblem flickers beside her."),
    traitsZh: ["敏捷","严谨","警觉"], traitsEn: ["Agile","Exacting","Alert"],
    need: "solve", accent: "#d3a83d", softAccent: "#f7edbf",
  },
  {
    id: "gotei-gin", squad: 3, name: tr("市丸银", "Gin Ichimaru"),
    atmosphere: "moon", restingScale: 0.988889, restingOffsetY: 0.432692,
    title: tr("一枚柿饼", "One dried persimmon"), rest: tr("眯眼微笑", "Smile with narrowed eyes"),
    power: tr("始解 · 神枪", "Shikai · Shinso"), action: tr("伸展神枪", "Extend Shinso"),
    effect: tr("短刃在银色刀光中向前伸长，又收回掌中。", "A slender silver blade extends from the short sword and draws back to his hand."),
    vignette: tr("廊柱上挂着晒好的柿饼。市丸银数了两遍，抬头看一眼正踮脚的新队士，退开半步，露出一直挡在身后的小凳子。", "Persimmons hang from a veranda post. Gin counts them twice and steps aside, revealing a little stool to a recruit who has been stretching on tiptoe."),
    moment: tr("空白的一格", "An empty square"), close: tr("新队士回到柱子前，一个结一个结地点过去。晚风把绳子吹得轻轻摇晃，市丸银已经走远，桌上还剩一枚用纸包好的柿饼。", "The recruit counts the knots one by one. Gin has gone, leaving a final persimmon wrapped in paper on the table."),
    story: tr("廊柱上挂着晒好的柿饼。市丸银数了两遍，抬头看一眼正踮脚的新队士，退开半步，露出一直挡在身后的小凳子。等那人伸手拿了一枚，他才笑着说，方才数的其实是绳子上的结。桌上的记录分明已经写好，却偏偏空着最后一格。他把笔搁在那里，留给发现答案的人自己来填。新队士回到柱子前，一个结一个结地点过去。晚风把绳子吹得轻轻摇晃，市丸银已经走远，桌上还剩一枚用纸包好的柿饼。短刃在银色刀光中向前伸长，又收回掌中。", "Persimmons hang from a veranda post. Gin counts them twice and steps aside, revealing a little stool to a recruit who has been stretching on tiptoe. Once the recruit has taken a fruit, Gin says he was counting knots in the string. His report is already written except for the last square. He leaves the brush across that square. The recruit counts the knots one by one. Gin has gone, leaving a final persimmon wrapped in paper on the table. A slender silver blade extends from the short sword and draws back to his hand."),
    traitsZh: ["从容","敏锐","难测"], traitsEn: ["Easygoing","Perceptive","Elusive"],
    need: "solve", accent: "#a5a2c6", softAccent: "#e8e5f4",
  },
  {
    id: "gotei-unohana", squad: 4, name: tr("卯之花烈", "Retsu Unohana"),
    atmosphere: "spirit", restingScale: 0.988889, restingOffsetY: 0.432692,
    title: tr("替人留一盏灯", "The lamp left burning"), rest: tr("合袖候诊", "Wait with folded sleeves"),
    power: tr("始解 · 肉雫唼", "Shikai · Minazuki"), action: tr("唤出肉雫唼", "Call Minazuki"),
    effect: tr("肉雫唼舒展鳐形的双翼，在四番队队长身边停驻。", "Minazuki spreads its ray-like fins beside the captain of Squad Four."),
    vignette: tr("诊室里只剩下最后一盏灯。卯之花没有催刚从巡逻回来的队员说话，只把凳子往他面前挪了一点。", "One lamp is still lit in the infirmary. Unohana draws a stool closer to the last patrolman."),
    moment: tr("给同伴的茶", "Tea for two"), close: tr("门口的脚步声远了，她重新把布条一卷一卷放回木盒，顺手把灯芯剪短一点。明天有人经过这里，仍会看见同样柔和的那一点光。", "After the footsteps fade she rolls up the spare bandages and trims the wick. The lamp will still be there tomorrow."),
    story: tr("诊室里只剩下最后一盏灯。卯之花没有催刚从巡逻回来的队员说话，只把凳子往他面前挪了一点。那人本来打算把擦伤藏在袖口里，看了看已经备好的清水和干净布条，终于把手放上桌。她替他理好袖口，又把第二张凳子拉近，因为等在门外的同伴也一瘸一拐。临走前，桌面上整整齐齐摆好了两杯茶。门口的脚步声远了，她重新把布条一卷一卷放回木盒，顺手把灯芯剪短一点。明天有人经过这里，仍会看见同样柔和的那一点光。肉雫唼舒展鳐形的双翼，在四番队队长身边停驻。", "One lamp is still lit in the infirmary. Unohana draws a stool closer to the last patrolman. He was going to keep a scrape hidden in his sleeve, but the water and bandages are ready, so he rests his hand on the table. She brings over a second stool for his limping friend in the doorway. Two cups of tea wait by the time they leave. After the footsteps fade she rolls up the spare bandages and trims the wick. The lamp will still be there tomorrow. Minazuki spreads its ray-like fins beside the captain of Squad Four."),
    traitsZh: ["温和","细心","沉着"], traitsEn: ["Gentle","Observant","Composed"],
    need: "comfort", accent: "#73ad91", softAccent: "#e1f1e6",
  },
  {
    id: "gotei-aizen", squad: 5, name: tr("蓝染惣右介", "Sosuke Aizen"),
    atmosphere: "spirit", restingScale: 1.000000, restingOffsetY: 0.000000,
    title: tr("纸上倒影", "A reflection on paper"), rest: tr("扶正眼镜", "Adjust his glasses"),
    power: tr("始解 · 镜花水月", "Shikai · Kyoka Suigetsu"), action: tr("映出幻象", "Cast an illusion"),
    effect: tr("镜光将戴眼镜的队长分作数道相似的身影，再缓缓重合。", "Mirrored images of the bespectacled captain separate and quietly fall back into step."),
    vignette: tr("午后的光正落在桌上一碗清水里。蓝染把写好的字搁在碗边，请送公文的队员读出最后一行。", "Afternoon light falls into a bowl beside Aizen’s writing. He asks a visiting courier to read the final line."),
    moment: tr("镜片上的光", "Light on the lens"), close: tr("下一个人敲门时，水面才刚刚平静下来。他戴回眼镜，把那碗水放到窗下，像整整一个下午都在做一件再平常不过的小事。", "The next knock comes just as the water settles. Aizen replaces his glasses and moves the bowl to the window."),
    story: tr("午后的光正落在桌上一碗清水里。蓝染把写好的字搁在碗边，请送公文的队员读出最后一行。队员俯身看了好一会儿，才发现自己一直在看水里的倒影。蓝染替他把纸转过来，仍是那副温文的笑容。人走以后，他摘下眼镜，用袖口慢慢擦净镜片，桌上的纸早已经换到另一边了。下一个人敲门时，水面才刚刚平静下来。他戴回眼镜，把那碗水放到窗下，像整整一个下午都在做一件再平常不过的小事。镜光将戴眼镜的队长分作数道相似的身影，再缓缓重合。", "Afternoon light falls into a bowl beside Aizen’s writing. He asks a visiting courier to read the final line. Only after leaning close does the courier realize he has been reading the reflection. Aizen turns the paper toward him with a polite smile. When the room is quiet, he cleans his glasses. The sheet is already on the other side of the bowl. The next knock comes just as the water settles. Aizen replaces his glasses and moves the bowl to the window. Mirrored images of the bespectacled captain separate and quietly fall back into step."),
    traitsZh: ["斯文","善察","深藏"], traitsEn: ["Courteous","Observant","Secretive"],
    need: "solve", accent: "#8798cb", softAccent: "#e4eafa",
  },
  {
    id: "gotei-byakuya", squad: 6, name: tr("朽木白哉", "Byakuya Kuchiki"),
    atmosphere: "moon", restingScale: 1.000000, restingOffsetY: 0.000000,
    title: tr("砚旁一瓣花", "A petal by the inkstone"), rest: tr("拢袖静候", "Stand with sleeves folded"),
    power: tr("始解 · 千本樱", "Shikai · Senbonzakura"), action: tr("散落千本樱", "Scatter Senbonzakura"),
    effect: tr("刀身散作细小的刃片，转动时如被光照亮的樱花。", "The blade disperses into tiny fragments that catch the light like moving cherry petals."),
    vignette: tr("一瓣樱花落在尚未干透的文书上。白哉停了笔，用纸角把花瓣轻轻托起，放在砚台旁边。", "A cherry petal lands on wet ink. Byakuya stops writing, lifts the petal with a corner of paper and sets it beside the inkstone."),
    moment: tr("墨迹已干", "When the ink dries"), close: tr("文书被送出门时，庭院里的树又落了几瓣花。白哉从书架里抽出一本旧诗集，把砚台旁的那一瓣夹进上次读到的那页。", "When the letter leaves, he slips the petal into a book of verse at the page where he stopped reading."),
    story: tr("一瓣樱花落在尚未干透的文书上。白哉停了笔，用纸角把花瓣轻轻托起，放在砚台旁边。送信的人以为他要从头再写，已经取来了新纸，他却只在被花遮住的地方补上最后一笔。那一笔与前面的字一样平稳。等墨迹干了，他才折好信笺，起身时白色围巾恰好拂过桌沿，没有带走那瓣花。文书被送出门时，庭院里的树又落了几瓣花。白哉从书架里抽出一本旧诗集，把砚台旁的那一瓣夹进上次读到的那页。刀身散作细小的刃片，转动时如被光照亮的樱花。", "A cherry petal lands on wet ink. Byakuya stops writing, lifts the petal with a corner of paper and sets it beside the inkstone. A messenger brings a fresh sheet, but the captain only adds the missing stroke. It is as steady as the others. He waits for the ink to dry before folding the letter. His white scarf clears the petal as he rises. When the letter leaves, he slips the petal into a book of verse at the page where he stopped reading. The blade disperses into tiny fragments that catch the light like moving cherry petals."),
    traitsZh: ["克制","端正","坚定"], traitsEn: ["Restrained","Precise","Resolute"],
    need: "steady", accent: "#d897b7", softAccent: "#f6e4ec",
  },
  {
    id: "gotei-komamura", squad: 7, name: tr("狛村左阵", "Sajin Komamura"),
    atmosphere: "armor", restingScale: 1.000000, restingOffsetY: 0.000000,
    title: tr("窄门前的一步", "A step at the narrow gate"), rest: tr("立定守望", "Stand watch"),
    power: tr("卍解 · 黑绳天谴明王", "Bankai · Kokujo Tengen Myo'o"), action: tr("召出明王", "Summon the giant"),
    effect: tr("披甲巨人的轮廓从狼首队长身后升起，与他一同立定。", "An armored giant rises behind the wolf-headed captain and settles into his stance."),
    vignette: tr("狛村在窄门前停了下来。临时架起的门框只能让一副担架通过，队员们见他走近，正要把手里的东西放下让路。", "Komamura stops at a gate just wide enough for one stretcher. The carriers start to make way."),
    moment: tr("最后一箱药", "The last medicine chest"), close: tr("等到最后一箱药也进了门，他才松开肩膀，把门闩仔细插回去。轮到自己通过的时候，他依旧侧过身，免得碰倒墙边那盏很小的提灯。", "After the last box goes through he sets the latch and turns sideways once more, careful of the little lantern by the wall."),
    story: tr("狛村在窄门前停了下来。临时架起的门框只能让一副担架通过，队员们见他走近，正要把手里的东西放下让路。他却先侧过肩，用自己的背稳稳撑住被风吹动的门板，让担架和后面的药箱一件件过去。最后那名队员回头时，只看见一双尖耳朵从门框上方露出来。狛村低下头，轻轻朝他点了一下。等到最后一箱药也进了门，他才松开肩膀，把门闩仔细插回去。轮到自己通过的时候，他依旧侧过身，免得碰倒墙边那盏很小的提灯。披甲巨人的轮廓从狼首队长身后升起，与他一同立定。", "Komamura stops at a gate just wide enough for one stretcher. The carriers start to make way. Instead he turns his shoulder and holds the loose gate steady with his back while the stretchers and medicine boxes pass. The last orderly looks up and sees two pointed ears above the lintel. The captain lowers his head and gives him a small nod. After the last box goes through he sets the latch and turns sideways once more, careful of the little lantern by the wall. An armored giant rises behind the wolf-headed captain and settles into his stance."),
    traitsZh: ["忠诚","宽厚","坚毅"], traitsEn: ["Loyal","Generous","Steadfast"],
    need: "comfort", accent: "#b38050", softAccent: "#f3e4d1",
  },
  {
    id: "gotei-shunsui", squad: 8, name: tr("京乐春水", "Shunsui Kyoraku"),
    atmosphere: "moon", restingScale: 1.000000, restingOffsetY: 0.000000,
    title: tr("廊下借半边阴凉", "Half the shade"), rest: tr("扶笠听风", "Lift the brim of his hat"),
    power: tr("始解 · 花天狂骨", "Shikai · Katen Kyokotsu"), action: tr("展开双刀", "Unfold the twin blades"),
    effect: tr("两柄宽刀在花羽织两侧展开，脚边的影子随刀势移动。", "Twin curved blades open on either side of his flowered coat as shadows shift at his feet."),
    vignette: tr("廊柱的影子恰好遮住半张棋盘。京乐春水把斗笠往下一压，叫正忙着抄写的队员坐过来，替他看一眼这步棋。", "A post casts a shadow over half the board. Shunsui tips his straw hat and asks a passing clerk to look at a move."),
    moment: tr("把棋子收好", "Putting the pieces away"), close: tr("远处有人催着交卷，他笑着把最后几枚棋子收回盒里。来客站起来才发现，自己方才一直紧紧握着笔的那只手已经慢慢放松了。", "A call comes from the office. As the visitor gets up, the hand that had been clenched around a pen has finally relaxed."),
    story: tr("廊柱的影子恰好遮住半张棋盘。京乐春水把斗笠往下一压，叫正忙着抄写的队员坐过来，替他看一眼这步棋。那人说自己只剩半刻钟，他就挪开茶杯，露出早已收拢好的棋子。原来留在盘上的只有一局快要结束的残局。等最后一枚棋子落下，太阳刚好绕过柱子，他把阴凉的一边留给了对方。远处有人催着交卷，他笑着把最后几枚棋子收回盒里。来客站起来才发现，自己方才一直紧紧握着笔的那只手已经慢慢放松了。两柄宽刀在花羽织两侧展开，脚边的影子随刀势移动。", "A post casts a shadow over half the board. Shunsui tips his straw hat and asks a passing clerk to look at a move. The clerk has only a few minutes. Shunsui moves his teacup to reveal that most pieces are already put away. There is just one endgame left. By the final move the sunlight has shifted, leaving the visitor the shady seat. A call comes from the office. As the visitor gets up, the hand that had been clenched around a pen has finally relaxed. Twin curved blades open on either side of his flowered coat as shadows shift at his feet."),
    traitsZh: ["洒脱","敏锐","体贴"], traitsEn: ["Relaxed","Perceptive","Considerate"],
    need: "create", accent: "#c9849f", softAccent: "#f6e3eb",
  },
  {
    id: "gotei-tosen", squad: 9, name: tr("东仙要", "Kaname Tosen"),
    atmosphere: "moon", restingScale: 1.012195, restingOffsetY: 2.216229,
    title: tr("听风辨路", "Listening for the path"), rest: tr("侧耳辨音", "Listen for a footstep"),
    power: tr("卍解 · 清虫终式·阎魔蟋蟀", "Bankai · Suzumushi Tsuishiki: Enma Korogi"), action: tr("展开暗域", "Unfold the dark sphere"),
    effect: tr("暗色结界从清虫周围扩展，队长保持安静的立姿。", "A dark field expands around Suzumushi while Tosen holds his ground."),
    vignette: tr("东仙沿石阶走到廊下，在第三块木板前停住了脚步。刚换过的板子发出比昨天更空的回响，跟在后面的队员却只顾低头看路。", "Tosen stops at the third plank on the veranda. The new board rings more hollowly than yesterday."),
    moment: tr("回响的位置", "Where the echo changes"), close: tr("回到队舍以后，他让那名队员自己在图上标出位置。对方重新走了一遍才落笔，这一次，他连木板旁边那根柱子也准确地记住了。", "Back at the barracks he asks his companion to mark the spot. After a second walk the man can even remember the post beside it."),
    story: tr("东仙沿石阶走到廊下，在第三块木板前停住了脚步。刚换过的板子发出比昨天更空的回响，跟在后面的队员却只顾低头看路。东仙把刀收稳，请他站在原地再听一次。一只小雀从屋檐下飞走，四周安静下来，那一点不同终于清楚了。他们把修缮的记号系在栏杆上，沿着剩下的路慢慢走完。回到队舍以后，他让那名队员自己在图上标出位置。对方重新走了一遍才落笔，这一次，他连木板旁边那根柱子也准确地记住了。暗色结界从清虫周围扩展，队长保持安静的立姿。", "Tosen stops at the third plank on the veranda. The new board rings more hollowly than yesterday. His companion has been watching the floor. Tosen steadies his sword and asks him to listen again. A sparrow leaves the eaves and the difference becomes clear. They tie a repair marker to the rail and finish the rest of the walk together. Back at the barracks he asks his companion to mark the spot. After a second walk the man can even remember the post beside it. A dark field expands around Suzumushi while Tosen holds his ground."),
    traitsZh: ["沉静","自律","执着"], traitsEn: ["Quiet","Disciplined","Determined"],
    need: "steady", accent: "#9184bc", softAccent: "#eae5f4",
  },
  {
    id: "gotei-hitsugaya", squad: 10, name: tr("日番谷冬狮郎", "Toshiro Hitsugaya"),
    atmosphere: "frost", restingScale: 1.012195, restingOffsetY: 2.216229,
    title: tr("窗沿上的霜纹", "Frost on the sill"), rest: tr("抬眼巡查", "Survey the room"),
    power: tr("卍解 · 大红莲冰轮丸", "Bankai · Daiguren Hyorinmaru"), action: tr("展开冰翼", "Spread the ice wings"),
    effect: tr("冰沿手臂凝结成龙形，晶莹的冰翼在背后张开。", "Ice gathers into a dragon around his arm and crystalline wings open behind him."),
    vignette: tr("冬狮郎经过资料室时，发现一扇窗没扣紧，吹进来的风把明天的巡查表翻得哗啦作响。他把散页按回日期排好，才发现每张纸角上都画着一小片形状不同的雪花。", "Hitsugaya finds tomorrow’s patrol sheets blowing across the records room. He sorts them by date, then notices a different tiny snowflake drawn on every corner."),
    moment: tr("压在纸角的石头", "A stone for the corner"), close: tr("午后有人来领巡查表，他把纸递过去，特意给那人看了一眼最小的那片雪花。窗扣已修好，一叠文件在桌上安安静静地等着交接。", "At handover he points out the smallest snowflake. The repaired window keeps the remaining sheets in order."),
    story: tr("冬狮郎经过资料室时，发现一扇窗没扣紧，吹进来的风把明天的巡查表翻得哗啦作响。他把散页按回日期排好，才发现每张纸角上都画着一小片形状不同的雪花。原来值班的人担心页码被风吹乱，早就偷偷留了记号。他没有擦掉那些图案，只把最上面那张重新压平，在靠窗的地方放了一块镇纸。午后有人来领巡查表，他把纸递过去，特意给那人看了一眼最小的那片雪花。窗扣已修好，一叠文件在桌上安安静静地等着交接。冰沿手臂凝结成龙形，晶莹的冰翼在背后张开。", "Hitsugaya finds tomorrow’s patrol sheets blowing across the records room. He sorts them by date, then notices a different tiny snowflake drawn on every corner. Someone on duty had already devised a way to identify the pages. He leaves the drawings intact, flattens the top sheet and places a paperweight beside the unlatched window. At handover he points out the smallest snowflake. The repaired window keeps the remaining sheets in order. Ice gathers into a dragon around his arm and crystalline wings open behind him."),
    traitsZh: ["冷静","敏捷","负责"], traitsEn: ["Levelheaded","Quick","Responsible"],
    need: "solve", accent: "#78b8cf", softAccent: "#dceff5",
  },
  {
    id: "gotei-kenpachi", squad: 11, name: tr("更木剑八", "Kenpachi Zaraki"),
    atmosphere: "shield", restingScale: 1.012195, restingOffsetY: 2.216229,
    title: tr("拐过第三个路口", "The third turning"), rest: tr("扛刀等候", "Rest the sword on his shoulder"),
    power: tr("摘下眼罩 · 灵压解放", "Eyepatch Release · Spiritual Pressure"), action: tr("摘下眼罩", "Remove the eyepatch"),
    effect: tr("眼罩解除对力量的压制，金色灵压沿着羽织向外升腾。", "Freed from the eyepatch, golden spiritual pressure rises around his haori."),
    vignette: tr("剑八说自己认得回队舍的路，转了三个弯，眼前又是刚才那口井。他站在井边盯了一会儿，终于朝提着水桶的队员招了招手。", "Kenpachi says he knows the way home. Three turns later he is back at the well."),
    moment: tr("走到队舍门口", "The last few steps"), close: tr("院子里马上有人围过来问他走了多远。他把桶稳稳放在石阶上，伸手往来时的方向比划了一个大圈，门边的新队士也忍不住跟着笑了起来。", "When the squad asks how far he went, he sets the bucket down and traces a great circle in the air. His young guide laughs too."),
    story: tr("剑八说自己认得回队舍的路，转了三个弯，眼前又是刚才那口井。他站在井边盯了一会儿，终于朝提着水桶的队员招了招手。那人不敢开口指出方向，只把水桶换到另一边，空出手指了指巷口。剑八大笑着跟了过去，发梢的铃铛响了一路。快到门前时，他伸手接过水桶，让带路的人先去推门。院子里马上有人围过来问他走了多远。他把桶稳稳放在石阶上，伸手往来时的方向比划了一个大圈，门边的新队士也忍不住跟着笑了起来。眼罩解除对力量的压制，金色灵压沿着羽织向外升腾。", "Kenpachi says he knows the way home. Three turns later he is back at the well. He studies it for a moment and waves to a recruit with a bucket. The recruit switches hands and points toward the lane. Kenpachi laughs and follows, bells ringing in his hair. At the gate he takes the bucket so his guide can open the door. When the squad asks how far he went, he sets the bucket down and traces a great circle in the air. His young guide laughs too. Freed from the eyepatch, golden spiritual pressure rises around his haori."),
    traitsZh: ["豪爽","好胜","直率"], traitsEn: ["Bold","Competitive","Direct"],
    need: "start", accent: "#d6ae47", softAccent: "#f5ebcf",
  },
  {
    id: "gotei-mayuri", squad: 12, name: tr("涅茧利", "Mayuri Kurotsuchi"),
    atmosphere: "spirit", restingScale: 1.012195, restingOffsetY: 2.216229,
    title: tr("一格偏差", "One mark off"), rest: tr("俯身观察", "Inspect the result"),
    power: tr("始解 · 疋杀地藏", "Shikai · Ashisogi Jizo"), action: tr("显现疋杀地藏", "Release Ashisogi Jizo"),
    effect: tr("金色三叉刃从刀柄展开，紫色灵雾沿刃锋翻卷。", "A gold three-pronged blade opens from the hilt, trailing a curl of violet mist."),
    vignette: tr("涅茧利在架子上排了三只小钟，让它们同时开始走动。第一圈结束，最左边的指针比另外两只快了一格。", "Mayuri sets three clocks ticking together. After one circuit the left-hand needle is a mark ahead."),
    moment: tr("把结果写下来", "Record the reading"), close: tr("第二回指针停下，他这才允许队员动笔。桌上的第一列数字完好无损地留着，因为在他看来，弄明白第一次为什么出错，比抄出一张整齐的表格有趣得多。", "Only after the second reading does he allow the assistant to write. The first column stays intact for comparison."),
    story: tr("涅茧利在架子上排了三只小钟，让它们同时开始走动。第一圈结束，最左边的指针比另外两只快了一格。队员正要上前拨正，他却伸手挡住，俯身仔细看了一遍钟底的支架。桌板被垫高了一点点，只有左边那只钟放在接缝处。他把三只钟交换了位置，在记录纸上另外画出一列，等着下一圈的结果。第二回指针停下，他这才允许队员动笔。桌上的第一列数字完好无损地留着，因为在他看来，弄明白第一次为什么出错，比抄出一张整齐的表格有趣得多。金色三叉刃从刀柄展开，紫色灵雾沿刃锋翻卷。", "Mayuri sets three clocks ticking together. After one circuit the left-hand needle is a mark ahead. An assistant reaches to reset it. Mayuri stops him and peers under the stand. Only the left clock sits on the seam between two boards. He swaps their places, draws another column on his recording sheet and waits for the next circuit. Only after the second reading does he allow the assistant to write. The first column stays intact for comparison. A gold three-pronged blade opens from the hilt, trailing a curl of violet mist."),
    traitsZh: ["好奇","挑剔","精密"], traitsEn: ["Curious","Demanding","Precise"],
    need: "create", accent: "#a88bc4", softAccent: "#eee3f4",
  },
  {
    id: "gotei-ukitake", squad: 13, name: tr("浮竹十四郎", "Jushiro Ukitake"),
    atmosphere: "spirit", restingScale: 1.012195, restingOffsetY: 2.216229,
    title: tr("两包糖果", "Two paper parcels"), rest: tr("含笑候客", "Welcome a visitor"),
    power: tr("始解 · 双鱼理", "Shikai · Sogyo no Kotowari"), action: tr("唤出双鱼理", "Release the twin swords"),
    effect: tr("两柄刀由缀着符牌的绳索连起，灵流沿着两端往返。", "A cord hung with plaques joins the two swords as a current of light travels between them."),
    vignette: tr("浮竹把糖果分成两包，给巡逻归来的年轻队员一人一份。其中一个坚持自己没有帮上什么忙，只负责在门边等消息。", "Ukitake divides the sweets between two returning patrolmen. One protests that he only waited by the gate."),
    moment: tr("下一班回来以前", "Before the next watch"), close: tr("新来的队员道谢离开时，桌上那壶茶依然是热的。他把空纸包压平，写上巡逻换班的时辰，放在门旁醒目的地方，好让夜里回来的人也看得见。", "The tea is still warm when the visitors leave. He writes the change of watch on a wrapper and pins it beside the door."),
    story: tr("浮竹把糖果分成两包，给巡逻归来的年轻队员一人一份。其中一个坚持自己没有帮上什么忙，只负责在门边等消息。浮竹便请他把纸包拿稳，另一只手替同伴解开背包的绳结。等到两个人终于都坐下来，他才指指门外，说等在那里的人也守住了一个位置。廊下传来下一班的脚步声，他又从抽屉里找出一张干净的糖纸。新来的队员道谢离开时，桌上那壶茶依然是热的。他把空纸包压平，写上巡逻换班的时辰，放在门旁醒目的地方，好让夜里回来的人也看得见。两柄刀由缀着符牌的绳索连起，灵流沿着两端往返。", "Ukitake divides the sweets between two returning patrolmen. One protests that he only waited by the gate. Ukitake asks him to hold a parcel while his free hand helps untie his friend’s pack. When both men are seated, the captain points to the gate. Someone had to keep that place. More footsteps sound outside and he reaches for another wrapper. The tea is still warm when the visitors leave. He writes the change of watch on a wrapper and pins it beside the door. A cord hung with plaques joins the two swords as a current of light travels between them."),
    traitsZh: ["温厚","耐心","坚定"], traitsEn: ["Kind","Patient","Steadfast"],
    need: "comfort", accent: "#81b7aa", softAccent: "#e1f0ea",
  },
] as const;

const numbers = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三"];
function division(squad: number) {
  if (squad === 1) return tr("一番队队长 · 总队长", "Squad 1 Captain · Head Captain");
  return tr(`${numbers[squad - 1]}番队队长`, `Squad ${squad} Captain`);
}

export const CAPTAIN_PETS = CAPTAINS.map((c) => ({
  id: c.id, category: "bleach" as const, zodiacOrder: null,
  needs: [c.need] satisfies PetNeed[], displayName: c.name, badge: `GOTEI ${c.squad}`,
  accent: c.accent, softAccent: c.softAccent,
}));

function moment(title: LocalizedText, body: LocalizedText) {
  return { titleZh: title.zh, titleEn: title.en, bodyZh: body.zh, bodyEn: body.en };
}

export const CAPTAIN_EDITORIAL: Record<string, PetEditorialContent> = Object.fromEntries(
  CAPTAINS.map((c) => {
    const role = division(c.squad);
    const editorial: PetEditorialContent = {
      zodiacZh: role.zh, zodiacEn: role.en, roleZh: c.traitsZh[1], roleEn: c.traitsEn[1],
      promiseZh: c.title.zh, promiseEn: c.title.en,
      storyTitleZh: c.title.zh, storyTitleEn: c.title.en, storyZh: c.story.zh, storyEn: c.story.en,
      comfortZh: c.vignette.zh, comfortEn: c.vignette.en,
      moments: [moment(c.rest, c.vignette), moment(c.moment, c.close), moment(c.power, c.effect)],
      traitsZh: c.traitsZh, traitsEn: c.traitsEn, matchZh: c.close.zh, matchEn: c.close.en,
    };
    return [c.id, editorial];
  }),
);

export const CAPTAIN_SERIES: PetSeries = {
  id: "gotei-13-captains",
  name: tr("护廷十三队 · 队长名册", "BLEACH · Captains of the Gotei 13"),
  subtitle: tr("尸魂界篇 · 露琪亚救出时期", "Soul Society arc · The rescue of Rukia"),
  status: tr("新系列", "New collection"),
  description: tr("从一番队到十三番队，挑选一位队长，看看日常巡值时的模样，再唤出各自的力量。", "Meet the thirteen captains in squad order. Join one on patrol, then call forth their signature power."),
  selectionTitle: tr("选择一位队长", "Choose your captain"),
  storyTitle: tr("交班时分", "Change of watch"),
  storyChapter: tr("瀞灵廷 · 桌边小记", "Seireitei · A desk-side story"),
  story: tr("一番队的名册翻到新的一页，四番队的诊室还亮着灯。有人在屋檐上听到铃响，有人把散页按日期理好，还有人绕了三个路口才回到队舍。到了交班时分，十三件羽织终于在同一座庭院里碰面。", "A page turns in Squad One’s roll book. A lamp still burns in the infirmary. One captain hears a bell on the roof, another gathers scattered pages, and a third takes three wrong turns on the way back. At the change of watch, thirteen white coats meet in the courtyard."),
  attribution: tr("角色原作：久保带人《BLEACH》。本站 Q 版同人演绎。", "Characters from Tite Kubo’s BLEACH. Chibi fan interpretations by this site."),
  members: CAPTAINS.map((c) => ({
    petId: c.id, name: c.name, zodiac: division(c.squad), role: tr(c.traitsZh[1], c.traitsEn[1]),
    specialty: c.power, vignette: c.vignette,
  })),
};
