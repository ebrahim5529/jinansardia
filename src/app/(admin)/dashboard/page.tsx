import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";

import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const accountType = (session?.user as any)?.accountType as string | undefined;
  if (!session || accountType !== "ADMIN") {
    redirect("/admin-login");
  }

  return <DashboardClient />;
}
