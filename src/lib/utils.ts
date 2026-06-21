import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// 平滑滚动到指定选择器元素
export function transformTo(selector: string) {
    document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
}
