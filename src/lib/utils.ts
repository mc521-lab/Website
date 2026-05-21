import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const transformTo = (id: string) => {
    // 移除 # 前缀
    const targetId = id.startsWith("#") ? id.slice(1) : id;

    // 使用 requestAnimationFrame 确保 DOM 已更新
    requestAnimationFrame(() => {
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            // 如果元素不存在，尝试延迟查找（应对懒加载情况）
            setTimeout(() => {
                const delayedElement = document.getElementById(targetId);
                if (delayedElement) {
                    delayedElement.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 100);
        }
    });
};

export function openCentered(url: string, width = 600, height = 400) {
    const screenLeft = window.screenLeft ?? window.screenX;
    const screenTop = window.screenTop ?? window.screenY;

    const screenWidth = window.innerWidth ?? screen.width;
    const screenHeight = window.innerHeight ?? screen.height;

    const left = screenLeft + (screenWidth - width) / 2;
    const top = screenTop + (screenHeight - height) / 2;

    const features = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;

    return window.open(url, "_blank", features);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertNullsToString(obj: any): any {
    if (obj === null) return "null";

    if (Array.isArray(obj)) {
        return obj.map(convertNullsToString);
    }

    if (typeof obj === "object") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newObj: Record<string, any> = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                newObj[key] = convertNullsToString(obj[key]);
            }
        }
        return newObj;
    }

    return obj;
}

export async function copyToClipboard(text: string) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            throw new Error("Clipboard API not available");
        }
    } catch {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        // 防止页面跳动
        textarea.style.position = "fixed";
        textarea.style.top = "-9999px";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            document.execCommand("copy");
        } finally {
            document.body.removeChild(textarea);
        }
    }
}

export function getCardImageRelativeUrl(specificUrl: string) {
    return `/wiki/itemwiki/${specificUrl}`;
}