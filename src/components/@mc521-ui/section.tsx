type SectionTitleProps = {
    title: string;
    description?: string | React.ReactNode;
};
export function SectionTitle({ title, description = undefined }: SectionTitleProps) {
    return (
        <>
            <h2 className="text-foreground drop-shadow-background mb-4 text-4xl font-bold drop-shadow-[4px_4px_0] md:text-5xl">
                <span className="text-primary mr-2">#</span>
                {title}
            </h2>
            {description && <p className="mx-auto max-w-2xl text-lg text-neutral-400">{description}</p>}
            <div className="bg-primary shadow-primary/50 mx-auto mt-6 h-1 w-24 shadow-[0_0_15px]"></div>
        </>
    );
}

export function Section({
    zebra = false,
    id,
    children,
    className = "",
}: {
    zebra?: boolean;
    id: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <section
            className={`${zebra ? "bg-foreground/5" : "bg-foreground/7"} relative flex min-h-96 items-center justify-center py-24 ${className}`}
            id={id}>
            {children}
        </section>
    );
}
