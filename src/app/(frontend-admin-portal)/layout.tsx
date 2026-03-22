import { Radix } from "@/components";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return <Radix.TooltipProvider>{children}</Radix.TooltipProvider>;
}
