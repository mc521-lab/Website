"use client";

import * as React from "react";
import { useToc, slugify, type TocItem } from "../../wiki/toc-context";

interface HeadingProps {
    level: 1 | 2 | 3;
    children?: React.ReactNode;
    className?: string;
}

type HeadingHTMLElement = HTMLHeadingElement;

function Heading({
    level,
    children,
    className,
    ...props
}: HeadingProps & Omit<React.HTMLAttributes<HeadingHTMLElement>, "children">) {
    const { register, unregister } = useToc();
    const ref = React.useRef<HeadingHTMLElement>(null);
    const [resolvedId, setResolvedId] = React.useState<string | null>(null);

    const text = React.useMemo(() => {
        return React.Children.toArray(children)
            .map((c) => (typeof c === "string" ? c : ""))
            .join("")
            .trim();
    }, [children]);

    const baseId = React.useMemo(() => {
        const slug = slugify(text);
        return slug || `heading-${level}`;
    }, [text, level]);

    React.useEffect(() => {
        if (level === 1) return;
        const item: TocItem = { id: baseId, text: text || baseId, level };
        const registered = register(item);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setResolvedId(registered.id);

        if (registered.id !== baseId) {
            if (ref.current) {
                ref.current.id = registered.id;
            }
        }

        return () => unregister(registered.id);
    }, [baseId, text, level, register, unregister]);

    return React.createElement(
        `h${level}`,
        {
            ref,
            id: resolvedId ?? baseId,
            className,
            ...props,
        },
        children
    );
}

export function H1(props: React.ComponentProps<"h1">) {
    return <Heading level={1} {...props} />;
}

export function H2(props: React.ComponentProps<"h2">) {
    return <Heading level={2} {...props} />;
}

export function H3(props: React.ComponentProps<"h3">) {
    return <Heading level={3} {...props} />;
}
