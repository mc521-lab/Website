<script setup lang="ts">
    import CardNav, { type CardNavItem } from "~/components/vuebits/components/CardNav.vue";

    const items: CardNavItem[] = [
        {
            label: "服务器",
            bgColor: "color-mix(in oklch, var(--color-primary) 20%, var(--color-base-300))",
            textColor: "var(--color-base-content)",
            links: [{ label: "1.21.8 趣味生存", ariaLabel: "关于 1.21.8 趣味生存服务器的那些事", href: "/servers/1.21.8" }],
        },
        {
            label: "工具",
            bgColor: "color-mix(in oklch, var(--color-secondary) 20%, var(--color-base-300))",
            textColor: "var(--color-base-content)",
            links: [
                { label: "官方 Wiki", ariaLabel: "君庭阁官方 Wiki", href: "https://www.yuque.com/u29304293/cc", target: "_blank" },
                { label: "实用工具", ariaLabel: "我们自己开发的小工具", href: "/utils" },
            ],
        },
        {
            label: "关于我们",
            bgColor: "color-mix(in oklch, var(--color-accent) 20%, var(--color-base-300))",
            textColor: "var(--color-base-content)",
            links: [
                { label: "工作人员", ariaLabel: "遇到问题时请联系工作人员", href: "/about/staff" },
                { label: "社交媒体", ariaLabel: "在各大平台关注我们", href: "/about/social-media" },
            ],
        },
    ];
</script>

<template>
    <CardNav
        :items="items"
        buttonText="立即加入"
        baseColor="var(--color-base-100)"
        menuColor="var(--color-base-content)"
        buttonBgColor="var(--color-base-300)"
        buttonTextColor="var(--color-base-content)"
        ease="power3.out" />
    <slot></slot>
</template>
