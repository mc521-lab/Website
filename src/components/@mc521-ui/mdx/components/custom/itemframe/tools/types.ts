export interface ToolEnchant {
    name: string;
    level: number;
}

export interface ToolData {
    id: string;
    name: string;
    category: string;
    material: string;
    quality: string;
    type: string;
    description: string;
    unbreakable?: boolean;
    trial?: boolean;
    maxDurability?: number;
    timeLimit?: string;
    enchants: ToolEnchant[];
}

export interface ToolCategory {
    id: string;
    name: string;
    icon: string;
}

export interface ToolsIndex {
    version: string;
    type: string;
    categories: ToolCategory[];
    tools: ToolData[];
}

export interface ResolvedTool extends ToolData {
    categoryName?: string;
    categoryIcon?: string;
}
