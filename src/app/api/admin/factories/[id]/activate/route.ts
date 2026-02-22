import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const accountType = (session?.user as any)?.accountType;

    if (!session || accountType !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { isActive } = body;

    if (typeof isActive !== "boolean") {
      return NextResponse.json({ message: "Invalid isActive value" }, { status: 400 });
    }

    // Find factory by id
    const factory = await prisma.factory.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!factory) {
      return NextResponse.json({ message: "Factory not found" }, { status: 404 });
    }

    // Update user's isActive status
    // Using type assertion until Prisma client is regenerated
    const updatedUser = await prisma.user.update({
      where: { id: factory.userId },
      data: { isActive } as any,
      select: {
        id: true,
        email: true,
      },
    });
    
    const userWithActive = updatedUser as typeof updatedUser & { isActive: boolean };
    userWithActive.isActive = isActive;

    return NextResponse.json({
      message: `Factory ${isActive ? "activated" : "deactivated"} successfully`,
      user: userWithActive,
    });
  } catch (error) {
    console.error("Error updating factory status:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

