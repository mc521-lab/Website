import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    turbopack: {},

    // 性能优化：压缩和缓存
    compress: true,
    poweredByHeader: false,
    generateEtags: true,

    // 图片优化
    images: {
        formats: ["image/avif", "image/webp"],
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30天
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },

    // HTTP 响应头优化
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-DNS-Prefetch-Control",
                        value: "on",
                    },
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains; preload",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "origin-when-cross-origin",
                    },
                ],
            },
            {
                source: "/api/(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=60, stale-while-revalidate=300",
                    },
                ],
            },
            {
                source: "/videos/(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
            {
                source: "/fonts/(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable",
                    },
                ],
            },
        ];
    },

    // 重定向规则
    async redirects() {
        return [];
    },
};

export default nextConfig;
