import Link from "next/link";
import { Shield, Landmark, Gift, MessageSquare, Leaf, Globe } from "lucide-react";
import { IconifyIcon } from "@/components/iconify-icon";

const features = [
    { title: "纯净生存", sub: "公平 · 友好 · 长久", icon: Leaf, size: 26 },
    { title: "友好社区", sub: "互助 · 温暖 · 和谐", icon: Shield, size: 26 },
    { title: "长期稳定", sub: "稳定运行 · 用心维护", icon: Landmark, size: 26 },
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
        link: "#",
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

export default function Page() {
    return (
        <section className="relative flex min-h-[calc(100dvh-68px)] flex-1 flex-col items-center justify-center overflow-hidden px-5">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-[42%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-300/8 blur-3xl" />
                <div className="absolute left-1/2 top-[58%] h-56 w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/6 blur-3xl" />
            </div>

            <div className="relative z-10 flex w-full max-w-6xl flex-col items-center pb-20 pt-8 text-center sm:pb-24 md:pt-0">
                <h1 className="m-0 flex items-center justify-center gap-2 font-heading text-[clamp(3.3rem,9vw,6.2rem)] font-bold leading-none sm:gap-3">
                    <IconifyIcon icon="emojione-v1:maple-leaf" className="size-9 -rotate-25 drop-shadow-[0_6px_16px_rgba(0,0,0,0.35)] sm:size-10" />
                    <span className="text-white drop-shadow-[0_6px_28px_rgba(0,0,0,0.5)]">君庭阁</span>
                    <IconifyIcon icon="emojione-v1:maple-leaf" className="size-9 rotate-25 drop-shadow-[0_6px_16px_rgba(0,0,0,0.35)] sm:size-10" />
                </h1>

                <p className="m-0 mt-4 flex items-center gap-2 text-base text-white/90 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] sm:mt-5 sm:text-xl">
                    <span className="hidden h-px w-12 bg-white/35 sm:block" />
                    <span className="h-1.5 w-1.5 rotate-45 bg-amber-400 opacity-90" />
                    二十余年，同在一片方块天
                    <span className="h-1.5 w-1.5 rotate-45 bg-amber-400 opacity-90" />
                    <span className="hidden h-px w-12 bg-white/35 sm:block" />
                </p>

                <div className="mt-10 flex w-full flex-wrap items-center justify-center gap-4 lg:gap-5">
                    {features.map((item) => {
                        const Icon = item.icon;
                        return (
                            <div
                                key={item.title}
                                className="flex w-full max-w-[320px] min-w-0 items-center gap-3 rounded-2xl border border-black/5 bg-white/95 px-5 py-4 text-left shadow-[0_10px_28px_rgba(0,0,0,0.18)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,0,0,0.22)] sm:w-[280px]">
                                <Icon size={item.size} className="shrink-0 text-amber-500" />
                                <div className="leading-tight">
                                    <div className="font-heading text-base font-semibold text-[#151515]">{item.title}</div>
                                    <div className="mt-1 text-sm text-[#151515]/65">{item.sub}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-5 flex w-full flex-wrap items-center justify-center gap-4 lg:gap-5">
                    {ctas.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.title}
                                href={item.link}
                                className="group flex w-full max-w-[320px] min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-[#080b10]/72 px-5 py-4 text-inherit shadow-[0_10px_24px_rgba(0,0,0,0.22)] backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:bg-[#0b1016]/78 hover:shadow-[0_16px_36px_rgba(0,0,0,0.28)] sm:w-[300px]">
                                <div
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full shadow-[0_6px_16px_rgba(0,0,0,0.28)]"
                                    style={{ background: item.iconBg }}>
                                    <Icon size={20} className="text-white" />
                                </div>
                                <div className="text-left leading-tight">
                                    <div className="font-heading text-base font-semibold text-white">{item.title}</div>
                                    <div className="mt-1 text-sm text-white/72">{item.sub}</div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-black/28 px-5 py-3 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-2">
                    {status.map((item, idx) => (
                        <div key={idx} className="inline-flex items-center gap-2 text-sm text-white/92 sm:text-base">
                            {item.type === "dot" && <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />}
                            {item.type === "icon" && item.icon && <item.icon size={16} className="text-amber-400" />}
                            <span>{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
