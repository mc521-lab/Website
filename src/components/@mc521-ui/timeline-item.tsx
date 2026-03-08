import { CalendarIcon } from "lucide-react";

type TimelineItemProps = {
    version: string;
    date: string;
    major: boolean;
    content: string[];
    dir: "left" | "right";
};

export function TimelineItem({ version, date, major, content, dir }: TimelineItemProps) {
    const isLeft = dir === "left";

    return (
        <div className={`relative flex flex-col items-start gap-8 md:${isLeft ? "flex-row-reverse" : "flex-row"}`}>
            <div className="border-muted/50 bg-primary absolute left-4 z-10 mt-6 h-3 w-3 -translate-x-1.5 transform border-2 shadow-[0_0_10px_var(--color-primary)] md:left-1/2 md:-translate-x-1.5"></div>

            <div className={`mt-4 flex flex-col justify-center pl-12 md:w-1/2 md:pl-0 ${isLeft ? "md:text-left" : "md:text-right"}`}>
                <span className="text-primary text-xl font-bold">{version}</span>

                <span className={`text-foreground/50 flex items-center gap-2 text-sm ${isLeft ? "md:justify-start" : "md:justify-end"}`}>
                    <span className={`flex items-center gap-2 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}>
                        <CalendarIcon className="size-3" />
                        {date}
                    </span>
                </span>

                <div className={`mt-2 ${isLeft ? "md:mr-auto" : "md:ml-auto"}`}>
                    <span
                        className={`border-foreground/30 bg-muted text-foreground/75 rounded border px-2 py-1 text-xs font-bold tracking-wider uppercase ${
                            major && "border-primary/50 bg-primary/10! text-primary!"
                        }`}>
                        {major ? "Major Update" : "Patch Update"}
                    </span>
                </div>
            </div>

            <div className="w-full pl-12 md:w-1/2 md:pl-0">
                <div className="group bg-muted/75 hover:border-primary/30 border-muted relative rounded-sm border p-6 transition-all">
                    <ul className="space-y-3">
                        {content.length > 0 ? (
                            content.map((item, i) => (
                                <li key={i} className="text-foreground flex items-start gap-3 text-sm leading-relaxed">
                                    <div className="bg-primary h-1.5 w-1.5 shrink-0 translate-y-[9.5px]"></div>
                                    <span className="flex-1">{item}</span>
                                </li>
                            ))
                        ) : (
                            <li className="text-foreground flex items-start gap-3 text-sm leading-relaxed">
                                <div className="bg-primary h-1.5 w-1.5 shrink-0 translate-y-[9.5px]"></div>
                                <span className="flex-1 line-through opacity-75">&nbsp;管理员忘了写更新条目啦，快去提醒他一下&nbsp;</span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
