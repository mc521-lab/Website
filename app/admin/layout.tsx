import { AdminNavBar } from "@/components/mc521/admin/admin-nav-bar";
import { AuthGuard } from "@/components/mc521/admin/auth-guard";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthGuard>
            <AdminNavBar />
            {children}
        </AuthGuard>
    );
}
