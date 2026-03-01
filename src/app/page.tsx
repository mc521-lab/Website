"use client";

import { Mc521, Radix } from "@/components";
import { useMcStatus } from "@/hook/use-server-status";
import { navigateTo } from "@/lib/utils";
import {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    BookOpenIcon,
    ChevronDownIcon,
    CircleGaugeIcon,
    CopyCheckIcon,
    CopyIcon,
    CpuIcon,
    Gamepad2Icon,
    HardDriveIcon,
    MessageCircleMoreIcon,
    ServerIcon,
    ShieldIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

const ECOSYSTEM_DATA = [
    {
        src: "/images/vc-zc.webp",
        title: "主城区",
        tag: "核心枢纽",
        description: "主城承载交易与社交，是服务器运转的中心。",
    },
    {
        src: "/images/vc-ziyuan.webp",
        title: "资源区",
        tag: "挖掘积累",
        description: "该区定期重置，可以随机传送，随意收集资源。",
    },
    {
        src: "/images/vc-dipi.webp",
        title: "地皮区",
        tag: "安居乐业",
        description: "玩家可以免费领取地皮，建造自己的小家。",
    },
    {
        src: "/images/vc-diaoyu.webp",
        title: "钓鱼区",
        tag: "休闲养老",
        description: "每日多场钓鱼竞赛，挑战自己的钓鱼技能。",
    },
    {
        src: "/images/vc-mota.webp",
        title: "魔塔区",
        tag: "刷材圣地",
        description: "魔塔区构筑高效稳定的资源产出循环。",
    },
    {
        src: "/images/vc-fuben.webp",
        title: "副本区",
        tag: "挑战极限",
        description: "副本区提供独特的游戏体验，测试玩家的技能与策略。",
    },
    {
        src: "/images/vc-youxi.webp",
        title: "游戏区",
        tag: "娱乐竞技",
        description: "游戏区提供多样玩法与轻竞技，是玩家放松与互动的舞台。",
    },
    {
        src: "/images/more.webp",
        title: "更多...",
        tag: "敬请期待",
        description: "我们会不断开发新内容，让每位玩家都能找到自己的归属！",
    },
];

const TEAMMEMBER_DATA = [
    {
        name: "LingyunAwA",
        position: ["技术", "客服"],
        image: "/images/LingyunAwA.webp",
    },
    {
        name: "FBK_Lynn",
        position: ["小游戏主管", "副本主管"],
        image: "/images/FBK_Lynn.webp",
    },
];

const daysSince = (d: string) => Math.floor((new Date().getTime() - new Date(d).getTime()) / 86400000);

export default function Page() {
    const runningDays = daysSince("2026-02-26");

    const [isCopied, setCopied] = useState(false);

    const { status, loading, fetchStatus } = useMcStatus("mc521.cc");
    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    const onCopyServerIp = () => {
        navigator.clipboard.writeText("mc521.cc");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="pixel-font h-full w-screen">
            <section className="relative h-screen" id="home">
                <div className="absolute top-0 left-0 z-3 flex h-full w-full flex-col items-center justify-center">
                    <h1 className="text-foreground mb-6 text-6xl font-bold drop-shadow-[6px_6px_0_#000] md:text-8xl">
                        <span className="text-primary">MC</span>521
                    </h1>
                    <p className="mx-auto mb-10 max-w-2xl text-3xl leading-relaxed text-neutral-300 md:text-4xl">轻松 舒适 纯粹 多元 公益</p>
                    <div className="flex gap-4">
                        <Mc521.HomeButton text="开始游戏" onClick={() => navigateTo("#join")}>
                            <Gamepad2Icon />
                        </Mc521.HomeButton>
                        {/* <Mc521.HomeButton theme="light" text="查看百科">
                            <BookOpenIcon />
                        </Mc521.HomeButton> */}
                    </div>
                    {!loading && (
                        <div className="bg-background/40 mt-8 flex items-center gap-3 border border-neutral-700 px-6 py-4 backdrop-blur-sm">
                            <span className="relative flex h-3 w-3">
                                {!status.error ? (
                                    <>
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                                    </>
                                ) : (
                                    <span className="bg-destructive relative inline-flex h-3 w-3 rounded-full"></span>
                                )}
                            </span>
                            <span className="flex -translate-y-px items-center">
                                当前在线：<span className="text-primary ml-1 text-xl font-bold">{status.online}</span>&nbsp;人
                            </span>
                        </div>
                    )}
                </div>
                <ChevronDownIcon className="animate-float-y absolute bottom-16 left-1/2 z-3 size-10 -translate-x-1/2 opacity-50" />
                <div className="from-background/75 via-background/50 to-background absolute z-2 h-full w-full bg-linear-to-b via-50% backdrop-blur-xs"></div>
                <video
                    className="absolute top-0 left-0 h-full w-full object-cover"
                    src="/videos/mc-background-video.webm"
                    autoPlay
                    loop
                    muted
                />
            </section>
            <Mc521.Section id="about">
                <div className="flex w-full max-w-3/5 flex-col items-center justify-center">
                    <Mc521.SectionTitle title="服务器介绍" />
                    <Mc521.Card title="关于服务器" className="mt-12 w-full" Icon={ServerIcon}>
                        <Radix.CardContent className="space-y-4 text-lg leading-relaxed opacity-50">
                            君庭阁我的世界服务器 (MC521 Minecraft Server)
                            <br />
                            重度RPG体验与生存乐趣并存，轻松冒险为核心，纯粹公益、优化极致。
                            <br />
                            无论是偏爱挖矿建房的养老玩家、热衷制造大型机器的红石大佬，还是喜欢解锁技能挑战精英怪的冒险玩家，亦或是想通过自由交易实现财富自由的经营玩家，都能在此找到归属。
                        </Radix.CardContent>
                    </Mc521.Card>
                </div>
            </Mc521.Section>
            <Mc521.Section id="device" zebra>
                <div className="flex w-full max-w-3/4 flex-col items-center justify-center">
                    <Mc521.SectionTitle title="硬核配置" description="为了最流畅的游戏体验，我们不惜成本打造顶尖基础设施" />
                    <div className="grid grid-cols-4 gap-x-4">
                        <Mc521.Card hasTitleIcon title="极致性能" className="mt-12 w-full" Icon={CpuIcon}>
                            <Radix.CardContent className="space-y-4 text-base leading-relaxed opacity-50">
                                搭载 R9-7950X 高频处理器，拒绝卡顿
                            </Radix.CardContent>
                        </Mc521.Card>
                        <Mc521.Card hasTitleIcon title="高速读写" className="mt-12 w-full" Icon={HardDriveIcon}>
                            <Radix.CardContent className="space-y-4 text-base leading-relaxed opacity-50">
                                企业级 NVMe SSD 阵列，秒级加载
                            </Radix.CardContent>
                        </Mc521.Card>
                        <Mc521.Card hasTitleIcon title="专业防御" className="mt-12 w-full" Icon={ShieldIcon}>
                            <Radix.CardContent className="space-y-4 text-base leading-relaxed opacity-50">
                                使用高防服务器，保障服务器 24h 稳定运行
                            </Radix.CardContent>
                        </Mc521.Card>
                        <Mc521.Card hasTitleIcon title="低延迟" className="mt-12 w-full" Icon={CircleGaugeIcon}>
                            <Radix.CardContent className="space-y-4 text-base leading-relaxed opacity-50">
                                专线网络优化，平均延迟 &lt; 30ms
                            </Radix.CardContent>
                        </Mc521.Card>
                    </div>
                </div>
            </Mc521.Section>
            <Mc521.Section id="ecosystem">
                <div className="flex h-[210vh] w-full max-w-3/5 flex-col items-center justify-center">
                    <Mc521.SectionTitle title="分区介绍" />
                    <div className="mt-12 grid h-full w-full grid-cols-2 grid-rows-5 gap-x-6 gap-y-4">
                        <Mc521.ImageCard src="/images/vc-sc.webp" className="col-span-2" title="生存区" tag="探险刺激">
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
            <Mc521.Section id="team" zebra>
                <div className="flex w-full max-w-3/5 flex-col items-center justify-center">
                    <Mc521.SectionTitle title="管理团队" />
                    <div className="mt-12 flex w-full flex-col items-center">
                        <Mc521.OwnerCard />
                        <div className="relative flex h-16 w-full flex-col items-center overflow-hidden">
                            <div className="relative h-full w-px bg-neutral-700">
                                <div className="absolute top-0 left-1/2 h-8 w-1 -translate-x-1/2 animate-[drop_2s_infinite] bg-linear-to-b from-transparent to-yellow-500/50 blur-[2px]"></div>
                            </div>
                        </div>
                        <div className="relative mb-8 hidden h-px w-[80%] bg-neutral-700 md:block">
                            <div className="absolute top-0 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-neutral-600 bg-[#1f1f1f]"></div>
                        </div>
                        <div className="grid w-full grid-cols-2 gap-x-12">
                            {TEAMMEMBER_DATA.map((item, index) => (
                                <Mc521.MemberCard key={index} name={item.name} position={item.position} image={item.image} />
                            ))}
                        </div>
                    </div>
                </div>
            </Mc521.Section>
            <Mc521.Section id="photos">
                <div className="flex w-full max-w-3/4 flex-col items-center justify-center">
                    <Mc521.SectionTitle title="光影时刻" description="记录社区内的每一个精彩瞬间" />
                    <span className="mt-12 text-center opacity-50">暂无数据</span>
                </div>
            </Mc521.Section>
            <Mc521.Section id="events" zebra>
                <div className="flex w-full max-w-3/4 flex-col items-center justify-center">
                    <Mc521.SectionTitle title="社区活动" description="当前社区正在进行的限时活动与任务" />
                    <span className="mt-12 text-center opacity-50">暂无数据</span>
                </div>
            </Mc521.Section>
            <Mc521.Section id="milestones">
                <div className="flex w-full max-w-3/4 flex-col items-center justify-center">
                    <Mc521.SectionTitle title="发展历程" description="点击时间节点或拖动查看记录" />
                    <span className="mt-12 text-center opacity-50">暂无数据</span>
                </div>
            </Mc521.Section>
            <Mc521.Section id="changelog" zebra>
                <div className="flex w-full max-w-3/4 flex-col items-center justify-center">
                    <Mc521.SectionTitle title="更新日志" description={`累计 0 条更新 · 过去 ${runningDays} 天持续更新`} />
                    <span className="mt-12 text-center opacity-50">暂无数据</span>
                </div>
            </Mc521.Section>
            <section className="bg-primary relative flex min-h-96 items-center justify-center py-24" id="join">
                <div className="flex w-full max-w-4xl flex-col items-center justify-center">
                    <div className="border-background bg-foreground mx-auto w-full border-4 p-8 shadow-[12px_12px_0_rgba(0,0,0,0.8)] md:p-12">
                        <div className="mb-10 text-center">
                            <h2 className="text-background mb-4 text-4xl font-bold">准备好加入了吗？</h2>
                            <p className="text-background/75">加入我们的 QQ 群！获取社区最新活动、下载客户端或寻找搭子！</p>
                        </div>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <h3 className="text-background flex items-center gap-2 text-xl font-bold">
                                    <ServerIcon className="translate-y-px" />
                                    社区信息
                                </h3>
                                <div
                                    className="group hover:border-background border-background/35 bg-background/5 text-background flex cursor-pointer items-center justify-between border-2 border-dashed p-4"
                                    onClick={onCopyServerIp}>
                                    <div>
                                        <p className="text-background/50 text-xs uppercase">服务器地址</p>
                                        <p className="text-lg font-bold">mc521.cc</p>
                                    </div>
                                    {isCopied ? (
                                        <CopyCheckIcon className="text-background/50 group-hover:text-background" />
                                    ) : (
                                        <CopyIcon className="text-background/50 group-hover:text-background" />
                                    )}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-background flex items-center gap-2 text-xl font-bold">官方社群</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <a
                                        href="https://qm.qq.com/q/nLEPToNgpq"
                                        target="_blank"
                                        className="relative flex items-center justify-center gap-4 border-b-4 border-blue-700 bg-blue-500 p-3 font-bold text-white transition-colors hover:bg-blue-600 active:translate-y-1 active:border-b-0">
                                        <MessageCircleMoreIcon />
                                        玩家交流群
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Mc521.Footer />
        </div>
    );
}
