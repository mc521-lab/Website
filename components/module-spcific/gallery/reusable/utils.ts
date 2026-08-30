export function formatNumber(n: number | undefined | null, indicator = "", digits = 2): string {
    if (n === undefined || n === null) return "—";
    if (Number.isInteger(n)) return `${indicator}${String(n)}`;
    return `${indicator}${n.toFixed(digits).replace(/\.?0+$/, "")}`;
}

export function formatRange(min: number | undefined, max: number | undefined): string {
    if (min === undefined && max === undefined) return "—";
    if (min === max || max === undefined) return formatNumber(min);
    if (min === undefined) return formatNumber(max);
    return `${formatNumber(min)} ~ ${formatNumber(max)}`;
}

export function formatPercent(n: number | undefined | null, indicator = "", isDecimal = false): string {
    if (n === undefined || n === null) return "—";
    if (n <= 1 && isDecimal) return `${formatNumber(n * 100, indicator, 1)}%`;
    return `${formatNumber(n, indicator, 1)}%`;
}
