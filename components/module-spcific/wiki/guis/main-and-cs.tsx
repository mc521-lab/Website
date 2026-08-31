"use client";

import { Gui } from "@/configs/wiki-ui";
import { GuiPage } from "../gui-page";
import { useSearchParams } from "next/navigation";

const config = [
    Gui.Uicd.P1,
    Gui.Uicd.P2,
    Gui.Uics.Dp,
    Gui.Uics.Sc,
    Gui.Uics.Zy,
    Gui.Uics.Dy,
    Gui.Uics.Md,
    Gui.Uics.Zc,
    Gui.Uics.Diaoyu,
    Gui.Uics.Mt,
    Gui.Uics.Xl,
    Gui.Uics.Hd,
];

export function MainAndCsGui() {
    const searchParams = useSearchParams();
    const current = searchParams.get("current");

    return <GuiPage config={config} initialPageId={current} />;
}
