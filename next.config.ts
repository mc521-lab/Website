import type { NextConfig } from "next";

const isDev = process.argv.indexOf("dev") !== -1;
const isBuild = process.argv.indexOf("build") !== -1;

if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
    process.env.VELITE_STARTED = "1";
    import("velite").then((m) => m.build({ watch: isDev, clean: !isDev }));
}

const nextConfig: NextConfig = {
    // For my local cross-device development :)
    allowedDevOrigins: ["192.168.137.244", "local.frp.yuns-lab.tech"],
    images: {
        remotePatterns: [{ protocol: "https", hostname: "beian.mps.gov.cn" }],
    },
};

export default nextConfig;
