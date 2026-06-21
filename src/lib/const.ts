export enum ItemQuality {
    D = "D",
    C = "C",
    B = "B",
    A = "A",
    S = "S",
}

export const itemQualityColors: Record<string, string> = {
    [ItemQuality.D]: "#8b7e6b",
    [ItemQuality.C]: "#63bbd0",
    [ItemQuality.B]: "#eb507e",
    [ItemQuality.A]: "#fbda41",
    [ItemQuality.S]: "#d42517",
};
