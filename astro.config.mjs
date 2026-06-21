// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
    security: {
        checkOrigin: false,
    },
    integrations: [
        starlight({
            title: "君庭阁 Wiki",
            customCss: ["./src/styles/global.css"],
            social: [{ icon: "github", label: "GitHub", href: "https://github.com/withastro/starlight" }],
            components: {
                ThemeSelect: "./src/components/starlight/ThemeSelect.astro",
                MobileMenuToggle: "./src/components/starlight/MobileMenuToggle.astro",
                Pagination: "./src/components/starlight/Pagination.astro",
                TwoColumnContent: "./src/components/starlight/TwoColumnContent.astro",
                PageSidebar: "./src/components/starlight/PageSidebar.astro",
            },
            sidebar: [
                {
                    label: "新手指南",
                    items: [
                        { slug: "wiki/beginner/common-commands" },
                        { slug: "wiki/beginner/how-to-claim-land" },
                        { slug: "wiki/beginner/how-to-change-skin" },
                        { slug: "wiki/beginner/how-to-earn-money" },
                        { slug: "wiki/beginner/how-to-bind-bilibili" },
                        { slug: "wiki/beginner/how-to-create-quickshop" },
                    ],
                },
                {
                    label: "公会系统",
                    items: [
                        { slug: "wiki/playerguard/update" },
                        { slug: "wiki/playerguard/stone" },
                        { slug: "wiki/playerguard/maintainance-funds" },
                        { slug: "wiki/playerguard/common-questions" },
                    ],
                },
                {
                    label: "规章制度",
                    items: [
                        { slug: "wiki/rules/basic" },
                        { slug: "wiki/rules/adjudication" },
                        { slug: "wiki/rules/punishment" },
                        { slug: "wiki/rules/policy" },
                    ],
                },
                {
                    label: "内容图鉴",
                    items: [
                        { slug: "wiki/item/gems" },
                        { slug: "wiki/item/jewelries" },
                        { slug: "wiki/item/equipment" },
                        { slug: "wiki/item/weapons" },
                        { slug: "wiki/item/tools" },
                        { slug: "wiki/item/enchantments" },
                        { slug: "wiki/item/materials" },
                    ],
                },
            ],
        }),
        react(),
    ],

    vite: {
        plugins: [tailwindcss()],
    },
});
