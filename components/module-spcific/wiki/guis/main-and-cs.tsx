"use client";

import { InteractiveGui, type InteractiveGuiProps } from "../interactive-gui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

import { Uicd, Uicd2 } from "@/configs/wiki-ui/cd";
import { UicsDiaoyu, UicsDp, UicsDy, UicsHd, UicsMd, UicsMt, UicsSc, UicsXl, UicsZc, UicsZy } from "@/configs/wiki-ui/uics";

const config = [Uicd, Uicd2, UicsDp, UicsSc, UicsZy, UicsDy, UicsMd, UicsZc, UicsDiaoyu, UicsMt, UicsXl, UicsHd];
const pageName: Record<string, string> = {
    uicd: "主菜单 / 第一页",
    uicd2: "主菜单 / 第二页",
    uics_dp: "大区传送 / 地皮区",
    uics_sc: "大区传送 / 生存一区 & 生存二区",
    uics_zy: "大区传送 / 资源区",
    uics_dy: "大区传送 / 地狱区",
    uics_md: "大区传送 / 末地区",
    uics_zc: "大区传送 / 主城区",
    uics_diaoyu: "大区传送 / 钓鱼岛",
    uics_mt: "大区传送 / 魔塔区",
    uics_xl: "大区传送 / 训练场",
    uics_hd: "大区传送 / 活动区",
};

function GuiDescriptions({ page }: { page: keyof typeof pageName }) {
    switch (page) {
        case "uicd":
            return (
                <>
                    这是服务器主菜单的第一页
                    <br />
                    在这一页上，你可以找到 公会系统、大区传送、水晶商城、全球市场、玩家地标 和 职业系统 的入口
                </>
            );
        case "uicd2":
        case "uics_dp":
        case "uics_sc":
        case "uics_zy":
        case "uics_dy":
        case "uics_md":
        case "uics_zc":
        case "uics_diaoyu":
        case "uics_mt":
        case "uics_xl":
        case "uics_hd":
    }
}

export function MainAndCsGui() {
    const [currentUi, setCurrentUi] = useState<string>(config[0].id);

    return (
        <>
            <div className="hidden h-[64dvh] w-full grid-cols-3 gap-4 overflow-hidden p-0 py-1 lg:grid">
                <InteractiveGui
                    ui={config as InteractiveGuiProps["ui"]}
                    className="origin-top-left! scale-113!"
                    onGuiUpdate={(cui) => setCurrentUi(cui.id)}
                />
                <Card className="col-span-2 h-full w-full">
                    <CardHeader>
                        <CardTitle>当前页面：{pageName[currentUi]}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <GuiDescriptions page={currentUi} />
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
