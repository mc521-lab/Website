import { createElement, isValidElement } from "react";
import type { ComponentPropsWithoutRef, ComponentType, ReactNode } from "react";

import { cn } from "@/lib/utils";

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

type WikiHeadingProps = ComponentPropsWithoutRef<"h1">;

function renderHeading(level: 1 | 2 | 3 | 4, children: ReactNode, props: WikiHeadingProps, counts: Map<string, number>) {
    const text = cleanHeadingText(getHeadingText(children));
    const baseId = slugifyWikiHeading(text);
    const occurrence = counts.get(baseId) ?? 0;
    counts.set(baseId, occurrence + 1);

    const id = props.id ?? (occurrence === 0 ? baseId : `${baseId}-${occurrence + 1}`);
    const tagName = `h${level}` as "h1" | "h2" | "h3" | "h4";

    return createElement(tagName, { id, ...props }, children);
}

export function createWikiHeadingComponents(): Record<string, ComponentType<WikiHeadingProps>> {
    const counts = new Map<string, number>();

    return {
        h1: ({ children, ...props }: WikiHeadingProps) => renderHeading(1, children, props, counts),
        h2: ({ children, ...props }: WikiHeadingProps) => renderHeading(2, children, props, counts),
        h3: ({ children, ...props }: WikiHeadingProps) => renderHeading(3, children, props, counts),
        h4: ({ children, ...props }: WikiHeadingProps) => renderHeading(4, children, props, counts),
    };
}

export function WikiToc({ items }: { items: WikiTocItem[] }) {
    if (items.length === 0) {
        return null;
    }

    return (
        <aside className="wiki-toc better-scroll-bar" aria-label="页面目录">
            <div className="wiki-toc-card">
                <h2>目录</h2>
                <nav>
                    <ul className="wiki-toc-list">
                        {items.map((item) => (
                            <li key={item.id} className={cn("wiki-toc-item", `wiki-toc-depth-${item.depth}`)}>
                                <a href={`#${item.id}`} className="wiki-toc-link">
                                    {item.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
}
