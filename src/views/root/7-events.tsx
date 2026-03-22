import { Mc521 } from "@/components";

export function Events() {
    return (
        <Mc521.Section id="events" zebra>
            <div className="flex w-full max-w-3/4 flex-col items-center justify-center">
                <Mc521.SectionTitle title="社区活动" description="当前社区正在进行的限时活动与任务" />
                <span className="mt-12 text-center opacity-50">暂无数据</span>
            </div>
        </Mc521.Section>
    );
}
