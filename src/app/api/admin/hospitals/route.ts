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

    const hospitals = await prisma.hospital.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const hospitalsWithStats = hospitals.map((hospital) => {
      const userWithActive = hospital.user as typeof hospital.user & { isActive?: boolean };
      return {
        id: hospital.id,
        userId: hospital.userId,
        hospitalName: hospital.hospitalName,
        facilityType: hospital.facilityType,
        city: hospital.city,
        country: hospital.country,
        email: hospital.user.email,
        name: hospital.user.name,
        isActive: userWithActive.isActive ?? false,
        createdAt: hospital.createdAt,
      };
    });

    return NextResponse.json({ hospitals: hospitalsWithStats });
  } catch (error) {
    console.error("Error fetching hospitals:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

