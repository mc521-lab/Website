import { randInt } from "three/src/math/MathUtils.js";
import { Separator } from "@/components/ui/separator";
import { GuiConfig, PageConfig } from "@/types/iagui";
import { useState } from "react";
import { InteractiveGui } from "./interactive-gui";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

function GuiDescriptions({ descriptions }: { descriptions: string[] }) {
    if (descriptions.length === 0) {
        return null;
    }
    return (
        <div className="text-muted-foreground space-y-2 text-sm leading-6">
            {descriptions.map((description) => {
                const id = randInt(0, 100000);
                const key = `${description.slice(0, 5)}-${id}`;

                switch (description) {
                    case "#emptyline":
                        return <br key={key} />;
                    case "#separator":
                        return <Separator className="my-8" key={key} />;
                    default:
                        return (
                            <p className="my-0!" key={key}>
                                {description}
                            </p>
                        );
                }
            })}
        </div>
    );
}

export function GuiPage({
    config,
    initialPageId = null,
}: {
    config: PageConfig[];
    initialPageId: string | null;
}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [currentUi, setCurrentUi] = useState(initialPageId ?? config[0].id);
    const currentPage = config.find((page) => page.id === currentUi) ?? config[0];
    const guiConfig = config.map((page) => page.igconfig) as GuiConfig[];

    const handleGuiUpdate = (gC: GuiConfig) => {
        setCurrentUi(gC.id);

        const params = new URLSearchParams(searchParams.toString());
        params.set("current", gC.id);
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <>
            <div className="hidden h-[64dvh] w-full grid-cols-3 gap-4 overflow-hidden p-0 py-1 lg:grid">
                <InteractiveGui
                    ui={guiConfig}
                    initialPageId={initialPageId}
                    onGuiUpdate={handleGuiUpdate}
                />
                <Card className="col-span-2 h-full w-full">
                    <CardHeader>
                        <CardTitle>当前页面：{currentPage.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <GuiDescriptions descriptions={currentPage.descriptions} />
                    </CardContent>
                </Card>
            </div>
            <Card className="h-full w-full lg:hidden">
                <CardHeader>
                    <CardTitle>提示</CardTitle>
                </CardHeader>
                <CardContent>此页面只能在电脑上浏览，请切换你的设备</CardContent>
            </Card>
        </>
    );
}
