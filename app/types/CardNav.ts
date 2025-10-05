export type CardNavLink = {
    label: string;
    href?: string;
    ariaLabel: string;
    target?: string;
};

export type CardNavItem = {
    label: string;
    bgColor: string;
    textColor: string;
    links: CardNavLink[];
};

export interface CardNavProps {
    logoAlt?: string;
    items: CardNavItem[];
    buttonText: string;
    className?: string;
    ease?: string;
    baseColor?: string;
    menuColor?: string;
    buttonBgColor?: string;
    buttonTextColor?: string;
}
