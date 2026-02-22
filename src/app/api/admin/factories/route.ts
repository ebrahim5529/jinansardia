import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const accountType = (session?.user as any)?.accountType;

    if (!session || accountType !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const factories = await prisma.factory.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
          },
        },
        products: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const factoriesWithStats = factories.map((factory) => {
      const userWithActive = factory.user as typeof factory.user & { isActive?: boolean };
      return {
        id: factory.id,
        userId: factory.userId,
        factoryName: factory.factoryName,
        city: factory.city,
        country: factory.country,
        email: factory.user.email,
        name: factory.user.name,
        isActive: userWithActive.isActive ?? false,
        productsCount: factory.products.length,
        createdAt: factory.createdAt,
      };
    });

    return NextResponse.json({ factories: factoriesWithStats });
  } catch (error) {
    console.error("Error fetching factories:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

