import { Radix } from "..";

type CardProps = {
    title: string;
    children: React.ReactNode;
    className?: string;
    hasTitleIcon?: boolean;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};
export function Card({ title, children, className, Icon, hasTitleIcon }: CardProps) {
    return (
        <Radix.Card
            className={`${className} bg-foreground/10 hover:border-primary group relative border-2 border-neutral-800 px-5 py-8 transition-all duration-300`}>
            <Radix.CardHeader>
                {hasTitleIcon && (
                    <div className="text-primary mb-4 flex h-14 w-14 items-center justify-center border border-neutral-700 bg-neutral-900 transition-transform group-hover:scale-110">
                        <Icon />
                    </div>
                )}
                <Radix.CardTitle className="text-2xl font-bold">{title}</Radix.CardTitle>
            </Radix.CardHeader>
            {children}
            <div className="absolute top-1 right-1 p-2 opacity-10 transition-all duration-300 group-hover:opacity-20">
                <Icon className="size-16" />
            </div>
        </Radix.Card>
    );
}

type ImageCardProps = {
    children: React.ReactNode;
    className?: string;
    src: string;
    title: string;
    tag: string;
};
export function ImageCard({ children, className, src, title, tag }: ImageCardProps) {
    return (
        <Radix.Card
            className={`${className} bg-foreground/10 hover:border-primary/70 group relative h-full w-full border-6 border-neutral-800 px-5 py-8 transition-all duration-300`}>
            <div className="absolute bottom-16 z-3 w-[calc(100%-40px)]">
                <Radix.CardTitle className="text-foreground mt-48 mb-3 translate-y-14 text-2xl font-bold tracking-wide drop-shadow-md transition-all duration-300 group-hover:translate-y-0 sm:text-3xl">
                    {title}
                </Radix.CardTitle>
                <section className="absolute flex h-0 w-full translate-y-14 flex-col gap-2 overflow-hidden opacity-0 transition-all duration-300 group-hover:h-14 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex w-full gap-1">
                        <span className="bg-primary aspect-square size-2"></span>
                        <span className="bg-primary/60 aspect-square size-2"></span>
                        <span className="bg-primary/30 aspect-square size-2"></span>
                        <span className="bg-muted/50 ml-2 w-full"></span>
                    </div>
                    <span className="mt-3 text-sm opacity-50">{children}</span>
                </section>
            </div>
            <div className="border-foreground/25 bg-background/80 text-primary absolute top-3 right-3 z-3 translate-y-0 border px-3 py-1 text-xs tracking-widest uppercase opacity-100 backdrop-blur-sm transition-all duration-300 lg:-translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                {tag}
            </div>
            <div className="from-background/5 to-background absolute top-0 left-0 z-2 h-full w-full bg-linear-to-b backdrop-blur-[2px]"></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt="card-background"
                className="ease absolute top-0 left-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
            />
        </Radix.Card>
    );
}
