import { GemQualityFeature } from "./types";

export function formatValue(value: number | [number, number | null]): string {
    if (typeof value === "number") {
        return String(value);
    }
    if (Array.isArray(value)) {
        const [min, max] = value;
        if (max === null) {
            return `${min} ~ ?`;
        }
        return `${min} ~ ${max}`;
    }
    return String(value);
}

export function getQualityBadgeColor(qualityId: GemQualityFeature["id"]): string {
    switch (qualityId.toLowerCase()) {
        case "s":
            return "#FFD700";
        case "a":
            return "#FF6B6B";
        case "b":
            return "#4ECDC4";
        case "c":
            return "#95A5A6";
        default:
            return "#95A5A6";
    }
}

export function getQualityGlow(qualityId: GemQualityFeature["id"]): string {
    switch (qualityId.toLowerCase()) {
        case "s":
            return "0 0 12px rgba(255, 215, 0, 0.4)";
        case "a":
            return "0 0 10px rgba(255, 107, 107, 0.35)";
        case "b":
            return "0 0 8px rgba(78, 205, 196, 0.3)";
        case "c":
            return "0 0 6px rgba(149, 165, 166, 0.25)";
        default:
            return "none";
    }
}
