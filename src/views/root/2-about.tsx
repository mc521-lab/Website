import { Mc521, Radix } from "@/components";
import { ServerIcon } from "lucide-react";

export function About() {
    return (
        <Mc521.Section id="about">
            <div className="flex w-full max-w-4/5 flex-col items-center justify-center lg:max-w-3/5">
                <Mc521.SectionTitle title="服务器介绍" />
                <Mc521.Card title="关于服务器" className="mt-12 w-full" Icon={ServerIcon}>
                    <Radix.CardContent className="space-y-4 text-lg leading-relaxed opacity-50">
                        君庭阁我的世界服务器 (MC521 Minecraft Server)
                        <br />
                        重度 RPG 体验与生存乐趣并存，轻松冒险为核心，纯粹公益、优化极致。
                        <br />
                        无论是偏爱挖矿建房的养老玩家、热衷制造大型机器的红石大佬，还是喜欢解锁技能挑战精英怪的冒险玩家，亦或是想通过自由交易实现财富自由的经营玩家，都能在此找到归属。
                    </Radix.CardContent>
                </Mc521.Card>
            </div>
        </Mc521.Section>
    );
}
