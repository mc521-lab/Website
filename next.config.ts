import type { NextConfig } from "next";
import nextra from "nextra";

const withNextra = nextra({
    search: false,
});

const nextConfig: NextConfig = withNextra({
    turbopack: {
        resolveAlias: {
            "next-mdx-import-source-file": "@/hooks/mdx-components.ts",
        },
    },
});

export default nextConfig;
