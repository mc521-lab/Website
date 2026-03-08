export type ChangelogItem = {
    version: [number, number, number];
    date: string;
    major: boolean;
    content: string[];
};

export type MilestoneItem = {
    version: [number, number, number];
    date: string;
    title: string;
    description: string[];
};

export type PhotoItem = {
    image: {
        src: string;
        width: number;
        height: number;
    };
    title: string;
    description: string;
};
