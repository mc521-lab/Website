// 表格
export function Table({ children }: { children: React.ReactNode }) {
    return (
        <div className="my-6 overflow-x-auto">
            <table className="w-full border-collapse text-sm">{children}</table>
        </div>
    );
}

export function Thead({ children }: { children: React.ReactNode }) {
    return <thead className="bg-neutral-900">{children}</thead>;
}

export function Tbody({ children }: { children: React.ReactNode }) {
    return <tbody>{children}</tbody>;
}

export function Tr({ children }: { children: React.ReactNode }) {
    return <tr className="border-b border-neutral-800">{children}</tr>;
}

export function Th({ children }: { children: React.ReactNode }) {
    return <th className="px-4 py-3 text-left font-semibold text-neutral-200">{children}</th>;
}

export function Td({ children }: { children: React.ReactNode }) {
    return <td className="px-4 py-3 text-neutral-300">{children}</td>;
}
