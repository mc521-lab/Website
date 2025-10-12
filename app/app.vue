<script setup lang="ts">
    import { ref } from "vue";
    import "~/assets/main.css";
    import AlertItem from "~/components/AlertItem.vue";
    import type { CardNavItem } from "~/types/CardNav";

    // Vercel
    import { Analytics as VercelAnalytics } from "@vercel/analytics/nuxt";
    import { SpeedInsights as VercelSpeedInsights } from "@vercel/speed-insights/nuxt";

    const eventbus = useEventBus();
    const alerts = ref<{ id: number; message: string; level: "info" | "success" | "warning" | "error" }[]>([]);
    let idCounter = 0;

    eventbus.on("notify", (e) => {
        alerts.value.push({ id: idCounter++, ...e });
    });

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
                { label: "官方 Wiki", ariaLabel: "君庭阁官方 Wiki", href: "/wiki" },
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
    <VuebitsComponentsCardNav
        :items="items"
        buttonText="立即加入"
        baseColor="var(--color-base-100)"
        menuColor="var(--color-base-content)"
        buttonBgColor="var(--color-base-300)"
        buttonTextColor="var(--color-base-content)"
        ease="power3.out" />
    <div class="backdrop-blur-sm bg-black/10">
        <NuxtPage />
        <div class="toast">
            <AlertItem v-for="a in alerts" :key="a.id" :message="a.message" :level="a.level" />
        </div>
    </div>
    <VercelAnalytics />
    <VercelSpeedInsights />
</template>
