import { Mc521 } from "@/components";
import { useMcStatus } from "@/hook/use-server-status";
import { navigateTo } from "@/lib/utils";
import { Gamepad2Icon, ChevronDownIcon, BookOpenIcon } from "lucide-react";
import { useEffect } from "react";

export function Home() {
    const { status, loading, fetchStatus } = useMcStatus("mc521.cc");
    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    return (
        <section className="relative h-screen" id="home">
            <div className="absolute top-0 left-0 z-3 flex h-full w-full flex-col items-center justify-center">
                <h1 className="text-foreground mb-6 text-6xl font-bold drop-shadow-[6px_6px_0_#000] md:text-8xl">
                    <span className="text-primary">MC</span>521
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-3xl leading-relaxed text-neutral-300 md:text-4xl">二十余年，同在一片方块天</p>
                <div className="flex gap-4">
                    <Mc521.HomeButton text="开始游戏" onClick={() => navigateTo("#join")}>
                        <Gamepad2Icon />
                    </Mc521.HomeButton>
                    <Mc521.HomeButton theme="light" text="查看百科" onClick={() => (location.href = "/wiki")}>
                        <BookOpenIcon />
                    </Mc521.HomeButton>
                </div>
                {!loading && <Mc521.OnlineIndicator online={status.online ?? 0} error={status.error} />}
            </div>
            <ChevronDownIcon className="animate-float-y absolute bottom-16 left-1/2 z-3 size-10 -translate-x-1/2 opacity-50" />
            <div className="from-background/75 via-background/50 to-background absolute z-2 h-full w-full bg-linear-to-b via-50% backdrop-blur-xs"></div>
            <video className="absolute top-0 left-0 h-full w-full object-cover" src="/videos/mc-background-video.webm" autoPlay loop muted />
        </section>
    );
}
