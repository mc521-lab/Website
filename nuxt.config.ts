import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },

    // App 全局配置
    app: {
        head: {
            title: "君庭阁 · 我的世界服务器",
            htmlAttrs: {
                // 中文
                lang: "zh-CN",
            },
            meta: [
                // 字符编码
                { charset: "utf-8" },
                // 视口控制
                { name: "viewport", content: "width=device-width, initial-scale=1" },
                // SEO 优化
                { name: "og:title", content: "君庭阁 · 我的世界服务器" },
                { name: "og:description", content: "君庭阁 · 我的世界服务器" },
                { name: "og:type", content: "website" },
                { name: "og:url", content: "https://mc521.cc/" },
                { name: "og:site_name", content: "君庭阁 · 我的世界服务器" },
                { name: "og:locale", content: "zh_CN" },
            ],
            link: [
                // 网站图标
                { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
            ],
        },
    },

    // 运行时配置
    modules: ["@nuxt/content", "@nuxt/icon"],
    runtimeConfig: {
        // 仅后端 EnvZ
        alistUsername: "",
        alistPassword: "",
        // 公开 Env
        public: {
            alistUrl: "",
        },
    },

    // 开发与构建设置
    devServer: {
        // Local Dev
        // host: "127.30.0.1",
        // LAN Dev (with Mobile Emulator)
        host: "0.0.0.0",
        port: 3000,
    },
    vite: {
        plugins: [tailwindcss()],
    },
    // nitro: {
    //     preset: "node-server", // 用 Vercel 了，不再指定为 node-server
    // },
});

