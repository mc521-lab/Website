import { createElement, isValidElement } from "react";
import type { ComponentPropsWithoutRef, ComponentType, ReactNode } from "react";

export type WikiTocItem = {
    depth: 2 | 3 | 4;
    title: string;
    id: string;
};

function cleanHeadingText(raw: string): string {
    return raw
        .replace(/<[^>]+>/g, "")
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/[`*_~]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function slugifyWikiHeading(text: string): string {
    const slug = text
        .normalize("NFKC")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-+|-+$/g, "");

    return slug || "section";
}

function getHeadingText(children: ReactNode): string {
    if (children === null || children === undefined || typeof children === "boolean") {
        return "";
    }

    if (typeof children === "string" || typeof children === "number") {
        return String(children);
    }

    if (Array.isArray(children)) {
        return children.map(getHeadingText).join("");
    }

    if (isValidElement<{ children?: ReactNode }>(children)) {
        return getHeadingText(children.props.children);
    }

    return "";
}

export function buildWikiToc(markdown: string): WikiTocItem[] {
    const items: WikiTocItem[] = [];
    const counts = new Map<string, number>();
    let inFence = false;
    let fenceMarker = "";

    for (const rawLine of markdown.split(/\r?\n/)) {
        const line = rawLine.trimEnd();
        const fenceMatch = line.match(/^\s{0,3}(`{3,}|~{3,})(.*)$/);

        if (fenceMatch) {
            const marker = fenceMatch[1][0];
            const markerLength = fenceMatch[1].length;

            if (!inFence) {
                inFence = true;
                fenceMarker = marker.repeat(markerLength);
                continue;
            }

            if (line.trimStart().startsWith(fenceMarker)) {
                inFence = false;
                fenceMarker = "";
            }

            continue;
        }

        if (inFence) {
            continue;
        }

        const match = line.match(/^\s{0,3}(#{2,4})\s+(.+?)\s*#*\s*$/);
        if (!match) {
            continue;
        }

        const depth = match[1].length as 2 | 3 | 4;
        const title = cleanHeadingText(match[2]);
        if (!title) {
            continue;
        }

        const baseId = slugifyWikiHeading(title);
        const occurrence = counts.get(baseId) ?? 0;
        counts.set(baseId, occurrence + 1);

        items.push({
            depth,
            title,
            id: occurrence === 0 ? baseId : `${baseId}-${occurrence + 1}`,
        });
    }

    return items;
}

function renderHeading(
    level: 1 | 2 | 3 | 4,
    children: ReactNode,
    props: ComponentPropsWithoutRef<"h2">,
    counts: Map<string, number>
) {
    const text = cleanHeadingText(getHeadingText(children));
    const baseId = slugifyWikiHeading(text);
    const occurrence = counts.get(baseId) ?? 0;
    counts.set(baseId, occurrence + 1);

    const id = props.id ?? (occurrence === 0 ? baseId : `${baseId}-${occurrence + 1}`);
    const tagName = `h${level}` as "h1" | "h2" | "h3" | "h4";

    return createElement(tagName, { id, ...props }, children);
}

export function createWikiHeadingComponents(): Record<string, ComponentType<any>> {
    const counts = new Map<string, number>();

    return {
        h1: (({ children, ...props }: ComponentPropsWithoutRef<"h1">) => renderHeading(1, children, props, counts)) as ComponentType<any>,
        h2: (({ children, ...props }: ComponentPropsWithoutRef<"h2">) => renderHeading(2, children, props, counts)) as ComponentType<any>,
        h3: (({ children, ...props }: ComponentPropsWithoutRef<"h3">) => renderHeading(3, children, props, counts)) as ComponentType<any>,
        h4: (({ children, ...props }: ComponentPropsWithoutRef<"h4">) => renderHeading(4, children, props, counts)) as ComponentType<any>,
    };
}
