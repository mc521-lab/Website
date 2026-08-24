export function formatNumber(n: number | undefined | null, digits = 2): string {
    if (n === undefined || n === null) return "—";
    if (Number.isInteger(n)) return String(n);
    return n.toFixed(digits).replace(/\.?0+$/, "");
}

export function formatRange(min: number | undefined, max: number | undefined): string {
    if (min === undefined && max === undefined) return "—";
    if (min === max || max === undefined) return formatNumber(min);
    if (min === undefined) return formatNumber(max);
    return `${formatNumber(min)} ~ ${formatNumber(max)}`;
}

export function formatPercent(n: number | undefined | null): string {
    if (n === undefined || n === null) return "—";
    if (n <= 1) return `${formatNumber(n * 100, 1)}%`;
    return `${formatNumber(n, 1)}%`;
}
