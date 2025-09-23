import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },

    devServer: {
        host: "127.30.0.1",
    },

    vite: {
        plugins: [tailwindcss()],
    },

    runtimeConfig: {
        alistUsername: "",
        alistPassword: "",

        public: {
            alistUrl: "",
        },
    },
});

