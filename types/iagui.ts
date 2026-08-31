export interface PageConfig {
    id: string;
    name: string;
    descriptions: string[];
    igconfig: GuiConfig;
}

export interface GuiConfig {
    id: string;
    image?: string;
    buttons: Record<number, GuiButtonConfig | null>;
    overlapStyle?: React.CSSProperties;
}

export interface GuiButtonConfig {
    content?: React.ReactElement;
    onClick?: GuiButtonClickEvent;
}

export type GuiButtonClickEvent = GuiButtonClickEventNavigate | GuiButtonClickEventRedirect | GuiButtonClickEventCustom;

export interface GuiButtonClickEventNavigate {
    action: "navigate";
    to: string;
}
export interface GuiButtonClickEventRedirect {
    action: "redirect";
    href: string;
}
export interface GuiButtonClickEventCustom {
    action: "custom";
    fn: (idx: number) => void;
}
