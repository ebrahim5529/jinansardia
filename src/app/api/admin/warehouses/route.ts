import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET - Get all warehouses with country and stock info
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const countryId = searchParams.get("countryId");

    const where = countryId ? { countryId } : {};

    const warehouses = await prisma.warehouse.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        country: true,
        stocks: {
          include: {
            product: true,
          },
        },
        _count: {
          select: { stocks: true },
        },
      },
    });

    return NextResponse.json({ warehouses });
  } catch (error: any) {
    console.error("Error fetching warehouses:", error);
    return NextResponse.json(
      { error: "فشل جلب المستودعات", details: process.env.NODE_ENV === "development" ? error.message : undefined },
      { status: 500 }
    );
  }
}

// POST - Create a new warehouse
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await req.json();
    const { name, location, countryId } = body;

    if (!name || typeof name !== "string" || !name.trim() || !countryId) {
      return NextResponse.json({ error: "اسم المستودع والدولة مطلوبان" }, { status: 400 });
    }

    const warehouse = await prisma.warehouse.create({
      data: { name: name.trim(), location: location ? String(location) : null, countryId },
      include: { country: true },
    });

    return NextResponse.json({ success: true, warehouse });
  } catch (error: any) {
    console.error("Error creating warehouse:", error);
    return NextResponse.json({ error: "فشل إنشاء المستودع" }, { status: 500 });
  }
}

// PATCH - Update a warehouse
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, location, countryId } = body;

    if (!id) {
      return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });
    }

    const data: any = {};
    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json({ error: "اسم المستودع مطلوب" }, { status: 400 });
      }
      data.name = name.trim();
    }
    if (location !== undefined) data.location = location ? String(location) : null;
    if (countryId !== undefined) data.countryId = countryId;

    const warehouse = await prisma.warehouse.update({
      where: { id },
      data,
      include: { country: true },
    });

    return NextResponse.json({ success: true, warehouse });
  } catch (error: any) {
    console.error("Error updating warehouse:", error);
    return NextResponse.json({ error: "فشل تحديث المستودع" }, { status: 500 });
  }
}

// DELETE - Delete a warehouse
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

    await prisma.warehouse.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "تم حذف المستودع بنجاح" });
  } catch (error: any) {
    console.error("Error deleting warehouse:", error);
    return NextResponse.json({ error: "فشل حذف المستودع" }, { status: 500 });
  }
}
