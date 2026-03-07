import { ZoomInIcon } from "lucide-react";
import Image from "next/image";
import { Radix } from "..";

type ImageShowProps = {
    image: {
        src: string;
        width: number;
        height: number;
    };
    title: string;
    description: string;
    className?: string;
    onClick?: () => void;
};
export function ImageShowEntry({ image, title, className = "", onClick }: ImageShowProps) {
    return (
        <div className={`group pointer-events-auto relative mb-12 inline-block w-full cursor-pointer break-inside-avoid ${className}`} onClick={onClick}>
            <div className="bg-background group-hover:bg-primary/80 group-hover:border-primary/80 transform border p-3 pb-8 shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:-rotate-1 group-hover:shadow-[0_0_20px_var(--color-primary)]">
                <div className="border-foreground/15 group-hover:border-foreground/75 relative overflow-hidden border-2">
                    <Image
                        alt={title}
                        className="rendering-pixelated h-auto w-full scale-100 grayscale-30 transition-all duration-500 group-hover:scale-110 group-hover:grayscale-0"
                        src={image.src}
                        width={image.width}
                        height={image.height}></Image>
                    <div className="bg-background/20 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                        {" "}
                        <ZoomInIcon className="lucide lucide-zoom-in text-foreground h-10 w-10 drop-shadow-md" />
                    </div>
                </div>
                <div className="mt-3 px-1">
                    <div className="bg-foreground/15 group-hover:bg-foreground/75 mb-1 h-2 w-1/2 rounded-full"></div>
                    <div className="bg-foreground/15 group-hover:bg-foreground/75 h-2 w-3/4 rounded-full"></div>
                </div>
                <div className="bg-destructive border-background/50 absolute top-0 left-1/2 z-20 h-4 w-4 -translate-x-1/2 -translate-y-2.5 rounded-full border-2 shadow-[2px_2px_4px_rgba(0,0,0,0.3)] transition-all duration-300"></div>
            </div>
        </div>
    );
}

export function ImageShow({ image, title, description }: ImageShowProps) {
    return (
        <section className="relative">
            <Image
                loading="lazy"
                className="mask-[linear-gradient(to_bottom,black_50%,color-mix(in_srgb,black_10%,transparent)_90%)]"
                alt={title}
                src={image.src}
                width={image.width}
                height={image.height}></Image>
            <section className="absolute bottom-0 left-0 flex flex-col justify-end gap-2 p-4">
                <Radix.DialogTitle>{title}</Radix.DialogTitle>
                <Radix.DialogDescription>{description}</Radix.DialogDescription>
            </section>
        </section>
    );
}
