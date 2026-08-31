import { generateGui } from "@/lib/iagui/generate-gui";
import { GuiButtonConfig } from "@/types/iagui";

const palette: Record<string, GuiButtonConfig> = {
    a: { onClick: { action: "navigate", to: "uics_dp" } },
    b: { onClick: { action: "navigate", to: "uics_sc" } },
    c: { onClick: { action: "navigate", to: "uics_zy" } },
    d: { onClick: { action: "navigate", to: "uics_dy" } },
    e: { onClick: { action: "navigate", to: "uics_md" } },
    f: { onClick: { action: "navigate", to: "uics_zc" } },
    g: { onClick: { action: "navigate", to: "uics_diaoyu" } },
    h: { onClick: { action: "navigate", to: "uics_mt" } },
    i: { onClick: { action: "navigate", to: "uics_xl" } },
    j: { onClick: { action: "navigate", to: "uics_hd" } },
    k: { onClick: { action: "navigate", to: "uicd" } },
};

const map = [
    ["a", "a", "#", "#", "#", "#", "#", "f", "f"],
    ["b", "b", "#", "#", "#", "#", "#", "g", "g"],
    ["c", "c", "#", "#", "#", "#", "#", "h", "h"],
    ["d", "d", "#", "#", "#", "#", "#", "i", "i"],
    ["e", "e", "#", "#", "#", "#", "#", "j", "j"],
    ["#", "#", "#", "#", "k", "#", "#", "#", "#"],
];

const createUicsPage = (id: string, location: string, areaDescription: string[] = []) =>
    generateGui({
        id,
        name: `大区传送 / ${location}`,
        descriptions: [
            `这是服务器大区传送菜单用于传送到 ${location} 的页面`,
            "#emptyline",
            "你可以通过两侧的按钮切换你所要传送去的大区",
            `点击中心的图标即可确认传送至 ${location.replace("&", "或")}`,
            "#emptyline",
            "点击最下方中心的按钮来返回到服务器主菜单的第一页",
            "#separator",
            `${location} 简介`,
            "#emptyline",
            ...areaDescription,
        ],
        map: map,
        palette: palette,
    });

export const Dp = createUicsPage("uics_dp", "地皮区", [
    "在这个区域，每一位玩家都可以领取一块属于自己的地皮",
    "#emptyline",
    "第一次进入地皮区的时候，你会复活在地皮公告板前面",
    "务必记得点击左下方的告示牌先领取一个地皮菜单",
    "然后点击右下角的告示牌快速领取一块属于你自己的地皮",
    "#emptyline",
    "#emptyline",
    "(点击左侧交互式菜单的中心进一步了解地皮菜单)",
]);
export const Sc = createUicsPage("uics_sc", "生存一区 & 生存二区", [
    "生存一区和生存二区是不同的地形：",
    "一区 · 宏伟地形 · 边界 ± 50000 格",
    "在生存一区，你可以看到宏伟的山峦、景色优美的树林、蜿蜒曲折的海岸线等壮观场面",
    "二区 · 原版世界 · 边界 ± 20000 格",
    "生存二区专为不适应宏伟地形的玩家和红石玩家准备，这里所有的地形与结构均和原版一致",
    "#emptyline",
    "请注意，无论是生存一区还是二区，均没有开放地狱和末地维度",
    '前往这两个维度请通过菜单左侧的 "地狱" 和 "末地" 按钮打开对应的传送菜单',
    "此外，生存一区 和 生存二区 永不刷新，所以你可以放心地在这里建设你的家园",
    "生存二区 后续会视情况扩张边界",
]);
export const Zy = createUicsPage("uics_zy", "资源区", [
    "这里是原版地形，你可以自由探索世界并收集材料",
    "资源区的边界在距离世界中心 ± 40000 格的地方",
    "#emptyline",
    "资源区 每三个月重置一次，在重置日的前几天，会在玩家群中进行通知",
    "你仍然可以在资源区建设红石机器，但请注意，重置时不会保留你的机器",
    "因此，我们更建议你前往 生存二区 建造红石机器",
]);
export const Dy = createUicsPage("uics_dy", "地狱区", [
    "这里是原版地形，你可以自由探索世界并收集材料",
    "地狱区的边界在距离世界中心 ± 40000 格的地方",
    "#emptyline",
    "地狱区 的下界传送门只与 资源区 互通",
    "在此之外，没有任何限制，地狱基岩上层也是开放的",
    "#emptyline",
    "地狱区 每三个月重置一次，在重置日的前几天，会在玩家群中进行通知",
    "你仍然可以在地狱区建设红石机器，但请注意，重置时不会保留你的机器",
]);
export const Md = createUicsPage("uics_md", "末地区", [
    "这里是原版地形，你可以自由探索世界并收集材料",
    "末地区的边界在距离世界中心 ± 40000 格的地方",
    "#emptyline",
    "末地区 的末地传送门只与 资源区 互通",
    "在此之外，末地区 不可飞行，但可飞行的宠物、坐骑以及原版的鞘翅仍然可用",
    "#emptyline",
    "末地区 每三个月重置一次，在重置日的前几天，会在玩家群中进行通知",
    "你仍然可以在末地区建设红石机器，但请注意，重置时不会保留你的机器",
]);
export const Zc = createUicsPage("uics_zc", "主城区", [
    "这里是服务器的核心大厅，在这里可以与众多 NPC 互动，同时也是 地牢 和 训练场 的入口",
    "#emptyline",
    "在主城区，你可以使用钥匙打开各种抽奖宝箱，向官方商人出售物资获得金币",
    "用金币购买建材和星露谷物品，兑换宠物、坐骑或是精灵",
    "#emptyline",
    "地牢入口的左侧是 RPG 饰品、套装、宝石和材料的锻造 NPC",
    "在右侧可以佩戴你的饰品、往装备上镶嵌宝石、洗炼宝石和饰品、以及购买辅助你挑战地牢的药剂",
    "#emptyline",
    "挂机池 是你晚上睡觉挂机的好去处，在这里每五分钟就能获得一次奖励",
    "当然…… 违反服务器规则的玩家会被关到主城监狱里哦",
]);
export const Diaoyu = createUicsPage("uics_diaoyu", "钓鱼岛", [
    "钓鱼岛只在每天的 13:00 16:00 19:00 22:00 开放",
    "每次开放，同时会举行为期十分钟的钓鱼比赛",
    "在比赛结束十分钟后，钓鱼岛将会关闭",
    "#emptyline",
    "你只需要一根普通钓鱼竿，便有机会钓到各种稀有物品",
    "获得比赛前五名的玩家还会有额外的奖励",
    "具体内容请前往钓鱼岛右键提示牌阅读相关说明",
    "另外，比赛之前不要离开钓鱼岛，否则你无法获得奖励",
    "#emptyline",
    "在这里钓到的鱼获会自动放入钓鱼框中，右键 NPC 即可打开",
    "你可以在另一侧的 NPC 处售卖钓到的鱼，每日最多可以卖 3000 金币",
]);
export const Mt = createUicsPage("uics_mt", "魔塔区", [
    "魔塔区只在每天的 15:00 20:00 开放，每次开放三十分钟",
    "#emptyline",
    "一到四层会在前二十分钟刷新普通怪物",
    "击杀可以获得魔塔币、职业经验、随机宝石等",
    "在最后的十分钟，魔塔五层会刷新三只 Boss",
    "击杀可以获得大量魔塔币和稀有物品",
    "#emptyline",
    "具体的奖励内容可在进入魔塔前的选层菜单中查看",
]);
export const Xl = createUicsPage("uics_xl", "训练场", [
    "训练场是你熟练技能，测试装备的好去处",
    "在训练场，释放技能不需要消耗法力和体力，也没有冷却时间",
    "#emptyline",
    "你可以对着无限刷新的地牢怪物测试你的伤害",
    "亦或是对着训练假人练习定点输出",
    "当然，和其他玩家锻炼 PVP 操作也是可以的",
]);
export const Hd = createUicsPage("uics_hd", "活动区", [
    "活动区会定期举办大型游戏比赛，亦或是提供可单人挑战的小游戏",
    "该区域尚未准备完毕，将在后续完善后面向各位玩家开放",
]);
