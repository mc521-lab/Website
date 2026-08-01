import Link from "next/link";
import { Shield, Landmark, Gift, MessageSquare, Leaf, Globe } from "lucide-react";
import { IconifyIcon } from "@/components/iconify-icon";

// 1. 数据配置
const features = [
    { title: "纯净生存", sub: "公平 · 友好 · 长久", icon: Leaf, size: 28 },
    { title: "友好社区", sub: "互助 · 温暖 · 和谐", icon: Shield, size: 28 },
    { title: "长期稳定", sub: "稳定运行 · 用心维护", icon: Landmark, size: 28 },
];

const ctas = [
    {
        title: "游戏活动",
        sub: "丰富活动和奖励等你获取",
        icon: Gift,
        link: "#",
        iconBg: "#f2a94d",
    },
    {
        title: "反馈问题",
        sub: "建言献策 · 遇见问题找我们",
        icon: MessageSquare,
        link: "/feedback",
        iconBg: "#e87d2a",
    },
];

type StatusItem =
    | { type: "dot"; text: string; color: string; icon?: never }
    | { type: "icon"; text: string; icon: React.ElementType; color?: never };

const status: StatusItem[] = [
    { type: "icon", text: "版本 1.21.11", icon: Leaf },
    { type: "icon", text: "IP mc521.cc", icon: Globe },
];

// 2. 组件本体
export default function Page() {
    return (
        <section className="relative flex flex-1 flex-col items-center justify-center">
            {/* 核心内容区 */}
            <div className="relative z-10 -mt-6 flex w-full max-w-250 flex-col items-center gap-6 text-center">
                {/* 标题 */}
                <h1 className="font-heading m-0 flex items-center justify-center gap-2 text-[clamp(3.5rem,10vw,6rem)] font-bold sm:gap-3">
                    <IconifyIcon icon="emojione-v1:maple-leaf" className="size-10 -rotate-25" />
                    <span className="text-foreground drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)]">君庭阁</span>
                    <IconifyIcon icon="emojione-v1:maple-leaf" className="size-10 rotate-25" />
                </h1>

                {/* Slogan / 标语 */}
                <p className="font-body text-foreground/90 m-0 -mt-6 mb-6 flex items-center gap-2 text-lg drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-xl">
                    <span className="bg-foreground/40 hidden h-px w-12 sm:block" />
                    <span className="bg-primary h-1.5 w-1.5 rotate-45 opacity-90" />
                    二十余年，同在一片方块天
                    <span className="bg-primary h-1.5 w-1.5 rotate-45 opacity-90" />
                    <span className="bg-foreground/40 hidden h-px w-12 sm:block" />
                </p>

                {/* 特性卡片组 */}
                <div className="mt-1 flex w-full flex-wrap justify-center gap-4">
                    {features.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.title}
                                className="bg-foreground/95 hover:bg-foreground flex w-full max-w-[320px] min-w-55 items-center gap-3 rounded-xl px-5.5 py-4.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-150 hover:-translate-y-0.5 sm:w-auto">
                                <Icon size={item.size} className="text-primary shrink-0" />
                                <div className="text-left leading-tight">
                                    <div className="font-heading text-background text-base font-semibold">{item.title}</div>
                                    <div className="text-background/70 text-sm">{item.sub}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 交互卡片组 (CTA) */}
                <div className="mt-1 flex w-full flex-wrap justify-center gap-4">
                    {ctas.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.title}
                                href={item.link}
                                className="group border-foreground/10 bg-background/70 hover:bg-background/80 flex w-full max-w-[320px] min-w-60 items-center gap-3 rounded-xl border px-5.5 py-4 text-inherit transition-all duration-150 hover:-translate-y-0.5 sm:w-auto">
                                <div
                                    className="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.25)]"
                                    style={{ background: item.iconBg }}>
                                    <Icon size={20} className="text-foreground" />
                                </div>
                                <div className="text-left leading-tight">
                                    <div className="font-heading text-foreground text-base font-semibold">{item.title}</div>
                                    <div className="text-foreground/70 text-sm">{item.sub}</div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* 底部状态栏 */}
            <div className="absolute right-0 bottom-0 left-0 z-10 flex flex-wrap items-center justify-center gap-4 border-t border-white/10 bg-black/40 px-5 py-3 backdrop-blur-md sm:gap-8">
                {status.map((item, idx) => (
                    <div key={idx} className="text-foreground inline-flex items-center gap-2 text-base">
                        {item.type === "dot" && <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />}
                        {item.type === "icon" && item.icon && <item.icon size={16} className="text-primary" />}
                        <span>{item.text}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
