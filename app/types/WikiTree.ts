export interface ITreeData {
    title: string;
    slug: string;
    index: number;
    children?: Array<ITreeData>;
}
