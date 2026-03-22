import { Mc521, Radix } from "@/components";
import { CpuIcon, HardDriveIcon, ShieldIcon, CircleGaugeIcon } from "lucide-react";

export function Device() {
    return (
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
    );
}
