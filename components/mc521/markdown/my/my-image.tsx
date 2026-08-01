import Image from "next/image";

export function MyImage({
    src,
    alt,
    width = 1024,
    height = 768,
}: {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
}) {
    return <Image src={src} alt={alt || "Image"} width={width} height={height} />;
}
