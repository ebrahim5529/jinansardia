import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET - Get all countries
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const countries = await prisma.country.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { warehouse: true },
        },
      },
    });

    return NextResponse.json({ countries });
  } catch (error: any) {
    console.error("Error fetching countries:", error);
    return NextResponse.json(
      { error: "فشل جلب الدول", details: process.env.NODE_ENV === "development" ? error.message : undefined },
      { status: 500 }
    );
  }
}

// POST - Create a new country
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await req.json();
    const { name, code } = body;

    if (!name) {
      return NextResponse.json({ error: "اسم الدولة مطلوب" }, { status: 400 });
    }

    const country = await prisma.country.create({
      data: { name, code: code || null },
    });

    return NextResponse.json({ success: true, country });
  } catch (error: any) {
    console.error("Error creating country:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "هذه الدولة موجودة بالفعل" }, { status: 400 });
    }
    return NextResponse.json({ error: "فشل إنشاء الدولة" }, { status: 500 });
  }
}

// DELETE - Delete a country
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

    await prisma.country.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "تم حذف الدولة بنجاح" });
  } catch (error: any) {
    console.error("Error deleting country:", error);
    return NextResponse.json({ error: "فشل حذف الدولة" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, code } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });
    }

    const data: any = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json({ error: "اسم الدولة مطلوب" }, { status: 400 });
      }
      data.name = name.trim();
    }

    if (code !== undefined) {
      data.code = code ? String(code) : null;
    }

    const country = await prisma.country.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, country });
  } catch (error: any) {
    console.error("Error updating country:", error);
    if (error.code === "P2002") {
      return NextResponse.json({ error: "هذه الدولة موجودة بالفعل" }, { status: 400 });
    }
    return NextResponse.json({ error: "فشل تحديث الدولة" }, { status: 500 });
  }
}
