"use client";

import { useSearchParams } from "next/navigation";
import { Gui } from "@/configs/wiki-ui";
import { GuiPage } from "../gui-page";

const config = [
    Gui.Uigh.Root,
    Gui.Uigh.View,
    Gui.Uigh.Pvp,
    Gui.Uigh.Sj,
    Gui.Uigh.Stone,
    Gui.Uigh.Member,
    Gui.Uigh.Cygl,
    Gui.Uigh.Title,
    Gui.Uigh.Bank,
    Gui.Uigh.Shop,
    Gui.Uigh.Qd,
    Gui.Uigh.Task,
    Gui.Uigh.Notice
];

export function PlayerguildGui() {
    const searchParams = useSearchParams();
    const current = searchParams.get("current");

    return <GuiPage config={config} initialPageId={current} />;
}
