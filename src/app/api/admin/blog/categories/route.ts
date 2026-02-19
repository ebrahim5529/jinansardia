import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const categories = await prisma.blogCategory.findMany({
            include: {
                _count: {
                    select: { posts: true }
                }
            },
            orderBy: { name: "asc" },
        });

        return NextResponse.json({ categories });
    } catch (error: any) {
        console.error("Error fetching categories:", error);
        return NextResponse.json({ error: "فشل جلب التصنيفات" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const body = await req.json();
        const { name, slug } = body;

        if (!name || !slug) {
            return NextResponse.json({ error: "الاسم والرابط مطلوبين" }, { status: 400 });
        }

        const category = await prisma.blogCategory.create({
            data: { name, slug }
        });

        return NextResponse.json({ success: true, category });
    } catch (error: any) {
        console.error("Error creating category:", error);
        return NextResponse.json({ error: "فشل إنشاء التصنيف" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const body = await req.json();
        const { id, name, slug } = body;

        if (!id) {
            return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });
        }

        const category = await prisma.blogCategory.update({
            where: { id },
            data: { name, slug }
        });

        return NextResponse.json({ success: true, category });
    } catch (error: any) {
        console.error("Error updating category:", error);
        return NextResponse.json({ error: "فشل تحديث التصنيف" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });
        }

        await prisma.blogCategory.delete({ where: { id } });

        return NextResponse.json({ success: true, message: "تم حذف التصنيف بنجام" });
    } catch (error: any) {
        console.error("Error deleting category:", error);
        return NextResponse.json({ error: "فشل حذف التصنيف" }, { status: 500 });
    }
}
