import Image from "next/image";
import { Radix } from "..";

export function OwnerCard() {
    return (
        <div className="group bg-muted hover:border-primary/50 shadow-primary/10 relative w-80 border border-neutral-700 p-1 shadow-[0_0_64px] transition-colors duration-300">
            <div className="border-primary absolute -top-1 -left-1 h-3 w-3 border-t-2 border-l-2"></div>
            <div className="border-primary absolute -top-1 -right-1 h-3 w-3 border-t-2 border-r-2"></div>
            <div className="border-primary absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2"></div>
            <div className="border-primary absolute -right-1 -bottom-1 h-3 w-3 border-r-2 border-b-2"></div>
            <div className="relative flex flex-col items-center gap-5 overflow-hidden border border-neutral-800 bg-[#1f1f1f] p-6">
                <div className="via-primary absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent to-transparent opacity-20"></div>
                <div className="relative">
                    <div className="border-foreground/15 bg-background/10 h-28 w-28 border-2 p-1">
                        <Image
                            alt="Founder"
                            className="rendering-pixelated h-full w-full object-cover object-top grayscale-25 transition-all duration-500 group-hover:grayscale-0"
                            src="/images/CC.webp"
                            width={100}
                            height={100}></Image>
                    </div>
                </div>
                <div className="space-y-1 text-center">
                    <h3 className="text-foreground group-hover:text-primary text-2xl font-bold tracking-wide transition-colors">CC</h3>
                    <Radix.Badge variant="default">创始人</Radix.Badge>
                </div>
            </div>
        </div>
    );
}

export function MemberCard({ name, position, image }: { name: string; position: string[]; image: string }) {
    return (
        <div className="group bg-foreground/3 relative">
            <div className="border-foreground/10 group-hover:border-foreground/20 absolute inset-0 border transition-colors duration-300"></div>
            <div className="bg-primary absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"></div>
            <div className="relative flex items-center gap-4 p-5">
                <div className="border-foreground/15 bg-background/10 size-16 border-2 p-1">
                    <Image
                        alt={name}
                        className="rendering-pixelated size-14 object-cover object-top"
                        src={image}
                        width={100}
                        height={100}></Image>
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between">
                        <h4 className="text-foreground/80 group-hover:text-foreground truncate text-2xl font-bold transition-colors">{name}</h4>
                    </div>
                    {position.map((pos) => (
                        <Radix.Badge key={pos} variant="outline" className="border-primary mr-2">
                            {pos}
                        </Radix.Badge>
                    ))}
                </div>
            </div>
        </div>
    );
}
