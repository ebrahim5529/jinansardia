import AdminShell from "@/layout/AdminShell";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    const accountType = (session?.user as any)?.accountType as string | undefined;

    if (!session || accountType !== "ADMIN") {
        redirect("/admin-login");
    }

    return <AdminShell>{children}</AdminShell>;
}
