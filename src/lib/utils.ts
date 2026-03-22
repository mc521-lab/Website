import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const navigateTo = (id: string) => {
    const element = document.getElementById(id.slice(1));
    if (element) {
        element.scrollIntoView({ behavior: "smooth" });
    }
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
