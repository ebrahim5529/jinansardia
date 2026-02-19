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

        const tags = await prisma.blogTag.findMany({
            orderBy: { name: "asc" },
        });

        return NextResponse.json({ tags });
    } catch (error: any) {
        console.error("Error fetching tags:", error);
        return NextResponse.json({ error: "فشل جلب الوسوم" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const body = await req.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json({ error: "الاسم مطلوب" }, { status: 400 });
        }

        const tag = await prisma.blogTag.create({
            data: { name }
        });

        return NextResponse.json({ success: true, tag });
    } catch (error: any) {
        console.error("Error creating tag:", error);
        return NextResponse.json({ error: "فشل إنشاء الوسم" }, { status: 500 });
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

        await prisma.blogTag.delete({ where: { id } });

        return NextResponse.json({ success: true, message: "تم حذف الوسم بنجاح" });
    } catch (error: any) {
        console.error("Error deleting tag:", error);
        return NextResponse.json({ error: "فشل حذف الوسم" }, { status: 500 });
    }
}
