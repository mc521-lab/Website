import { MessageCircleMoreIcon } from "lucide-react";
import { Radix } from "..";
import Link from "next/link";

function FooterTitle({ children }: { children: React.ReactNode }) {
    return <h3 className="border-primary text-foreground mb-4 border-l-4 pl-3 text-lg font-bold">{children}</h3>;
}

export function Footer() {
    return (
        <footer className="relative flex min-h-102 items-center justify-center py-16" id="join">
            <div className="flex w-full max-w-4/5 lg:max-w-3/5 flex-col items-center justify-center">
                <section className="text-foreground/75 grid lg:grid-cols-3 gap-16">
                    <div>
                        <FooterTitle>关于我们</FooterTitle>
                        这是一个致力于提供最纯粹、最有趣Minecraft体验的社区。我们拥有专业的开发团队和热情的管理组，期待你的加入。
                    </div>
                    <div>
                        <FooterTitle>联系我们</FooterTitle>
                        <span className="flex items-center gap-2">
                            <MessageCircleMoreIcon className="text-primary size-5 -translate-y-px" />
                            QQ群: 5587557
                        </span>
                    </div>
                    <div className="text-sm">
                        <FooterTitle>免责声明</FooterTitle>
                        这不是 Mojang AB 的官方产品，不与 Mojang AB 相关联。
                        <br />
                        Minecraft 是 Mojang AB 的商标。
                    </div>
                </section>
                <Radix.Separator className="mt-16 lg:mt-32 mb-8" />
                <section className="grid w-full text-sm">
                    <div>
                        <span className="text-foreground/50">© 2025 君庭阁 保留所有权利. | &nbsp;</span>
                        <Link
                            href="https://beian.miit.gov.cn/"
                            target="_blank"
                            className="text-foreground/50 hover:text-primary hover:underline">
                            陕 ICP 备 2022008445 号
                        </Link>
                        <span className="text-foreground/50">&nbsp;| 陕公网安备 61092602000117 号</span>
                    </div>
                    <div className="text-foreground/50">Designed with ❤️ by LingyunAwA</div>
                </section>
            </div>
        </footer>
    );
}
