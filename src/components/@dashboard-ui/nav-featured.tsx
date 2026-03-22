"use client";

import { Radix } from "@/components";

export function NavFeatured({
    name,
    items,
}: {
    name: string;
    items: {
        name: string;
        url: string;
        icon: React.ReactNode;
    }[];
}) {
    return (
        <Radix.SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <Radix.SidebarGroupLabel>{name}</Radix.SidebarGroupLabel>
            <Radix.SidebarMenu>
                {items.map((item) => (
                    <Radix.SidebarMenuItem key={item.name}>
                        <Radix.SidebarMenuButton asChild variant={location.pathname === item.url ? "primary" : "default"}>
                            <a href={item.url}>
                                {item.icon}
                                <span>{item.name}</span>
                            </a>
                        </Radix.SidebarMenuButton>
                    </Radix.SidebarMenuItem>
                ))}
            </Radix.SidebarMenu>
        </Radix.SidebarGroup>
    );
}
