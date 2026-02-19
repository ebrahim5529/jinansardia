import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET - Search all products (for hospitals)
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).accountType !== "HOSPITAL") {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q") || "";
        const category = searchParams.get("category") || "";

        const products = await prisma.product.findMany({
            where: {
                AND: [
                    { status: "active" },
                    {
                        OR: [
                            { name: { contains: query } },
                            { category: { contains: query } },
                            { description: { contains: query } },
                        ],
                    },
                    category ? { category: { equals: category } } : {},
                ],
            },
            include: {
                factory: {
                    select: {
                        factoryName: true,
                        city: true,
                        country: true,
                    }
                }
            } as any,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ products });
    } catch (error: any) {
        console.error("Error searching products:", error);
        return NextResponse.json(
            { error: "فشل البحث عن المنتجات" },
            { status: 500 }
        );
    }
}
