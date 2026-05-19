export interface MaterialData {
    id: string;
    name: string;
    quality: string;
    type: string;
    description: string;
    effect: string;
    source: string;
}

export interface MaterialsIndex {
    materials: MaterialData[];
}
