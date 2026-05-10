import { Mc521 } from "@/components";

const ECOSYSTEM_DATA = [
    {
        src: "/images/ecosystem/vc-zc.webp",
        title: "主城区",
        tag: "核心枢纽",
        description: "主城承载交易与社交，是服务器运转的中心。",
    },
    {
        src: "/images/ecosystem/vc-ziyuan.webp",
        title: "资源区",
        tag: "挖掘积累",
        description: "该区定期重置，可以随机传送，随意收集资源。",
    },
    {
        src: "/images/ecosystem/vc-dipi.webp",
        title: "地皮区",
        tag: "安居乐业",
        description: "玩家可以免费领取地皮，建造自己的小家。",
    },
    {
        src: "/images/ecosystem/vc-diaoyu.webp",
        title: "钓鱼区",
        tag: "休闲养老",
        description: "每日多场钓鱼竞赛，挑战自己的钓鱼技能。",
    },
    {
        src: "/images/ecosystem/vc-mota.webp",
        title: "魔塔区",
        tag: "刷材圣地",
        description: "魔塔构筑高效稳定的资源产出循环。",
    },
    {
        src: "/images/ecosystem/vc-fuben.webp",
        title: "副本区",
        tag: "挑战极限",
        description: "提供独特的游戏体验，测试玩家的技能与策略。",
    },
    {
        src: "/images/ecosystem/vc-youxi.webp",
        title: "游戏区",
        tag: "娱乐竞技",
        description: "有着多样玩法与轻竞技，是玩家放松与互动的舞台。",
    },
    {
        src: "/images/ecosystem/more.webp",
        title: "更多...",
        tag: "敬请期待",
        description: "我们会不断开发新内容，让每位玩家都能找到自己的归属！",
    },
];

export function EcoSystem() {
    return (
        <Mc521.Section id="ecosystem">
            <div className="flex h-[210vh] w-full max-w-4/5 flex-col items-center justify-center lg:max-w-3/5">
                <Mc521.SectionTitle title="分区介绍" />
                <div className="mt-12 grid h-full w-full grid-rows-9 gap-x-6 gap-y-4 lg:grid-cols-2 lg:grid-rows-5">
                    <Mc521.ImageCard src="/images/ecosystem/vc-sc.webp" className="lg:col-span-2" title="生存区" tag="探险刺激">
                        宏伟的地形在生存区中铺展开，高耸的山脉、蜿蜒的河流和密林深处的阴影，仿佛每一步都隐藏着未知的冒险与挑战。
                    </Mc521.ImageCard>
                    {ECOSYSTEM_DATA.map((item, index) => (
                        <Mc521.ImageCard key={index} src={item.src} title={item.title} tag={item.tag}>
                            {item.description}
                        </Mc521.ImageCard>
                    ))}
                </div>
            </div>
        </Mc521.Section>
    );
}
