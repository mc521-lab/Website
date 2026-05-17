export interface GemFeature {
    id: string;
    name: string;
}

export interface GemQualityFeature {
    id: string;
    value: number | [number, number | null];
}

export interface GemQuality {
    id: string;
    name: string;
    description: string;
    features: GemQualityFeature[];
}

export interface GemData {
    id: string;
    name: string;
    symbolColor: string;
    description: string;
    image: string | null;
    features: GemFeature[];
    qualitys: GemQuality[];
}

export interface GemManifestCategory {
    id: string;
    type: string;
    name: string;
    entries: string[];
}

export interface GemManifest {
    version: string;
    categories: GemManifestCategory[];
}
