// theme.config.tsx
import React from "react";

type SidebarItem = {
    title: string;
    href?: string;
    items: SidebarItem[];
};

const themeConfig = {
    logo: "My Wiki",
    project: {
        link: "https://github.com/your-repo",
    },
    sidebar: {
        defaultMenuCollapseLevel: 1,
        render: ({ items }: { items: SidebarItem[] }) => {
            const filtered = items.filter((item) => item.href?.startsWith("/wiki") || item.href?.startsWith("/blog"));

            return (
                <ul>
                    {filtered.map((item) => (
                        <li key={item.href}>
                            <a href={item.href}>{item.title}</a>
                            {item.items?.length > 0 && (
                                <ul>
                                    {item.items.map((sub) => (
                                        <li key={sub.href}>
                                            <a href={sub.href}>{sub.title}</a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            );
        },
    },
};

export default themeConfig;
