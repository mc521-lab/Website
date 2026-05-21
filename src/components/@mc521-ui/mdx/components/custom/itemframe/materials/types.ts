export interface MaterialData {
    id: string;
    name: string;
    quality: string;
    type: string;
    description: string;
    effect: string;
    source: string;
    image?: string | null;
}

export interface MaterialsIndex {
    materials: MaterialData[];
}
