import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export default async function HospitalAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const accountType = (session?.user as any)?.accountType;
  const userId = (session?.user as any)?.id;

  if (!session || accountType !== "HOSPITAL") {
    redirect("/signin");
  }

  // Check if account is active
  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Type assertion until Prisma client is regenerated
    const userWithActive = user as typeof user & { isActive?: boolean };
    if (userWithActive && userWithActive.isActive === false) {
      redirect("/account-pending");
    }
  }

  return <>{children}</>;
}

