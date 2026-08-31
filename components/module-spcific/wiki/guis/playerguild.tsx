"use client";

import { useSearchParams } from "next/navigation";
import { Gui } from "@/configs/wiki-ui";
import { GuiPage } from "../gui-page";

const config = [Gui.Uigh.Root, Gui.Uigh.View, Gui.Uigh.Pvp, Gui.Uigh.Sj, Gui.Uigh.Stone];

export function PlayerguildGui() {
    const searchParams = useSearchParams();
    const current = searchParams.get("current");

    return <GuiPage config={config} initialPageId={current} />;
}
