import { MyImage } from "../html/media";

export function MyImageWithTooltip({
    src,
    alt,
    width,
    height,
    tooltip,
}: {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    tooltip?: string;
}) {
    return (
        <div className="relative w-fit" style={{ width, height }}>
            <MyImage src={src} alt={alt} width={width} height={height} className="mt-6 mb-0" />
            <span className="absolute -bottom-1 w-full translate-y-full text-center text-sm opacity-50">{tooltip || alt}</span>
        </div>
    );
}
