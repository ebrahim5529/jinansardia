import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET - Get stock for a warehouse
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const warehouseId = searchParams.get("warehouseId");

    const where = warehouseId ? { warehouseId } : {};

    const stocks = await prisma.warehouseStock.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: {
        product: true,
        warehouse: {
          include: { country: true },
        },
      },
    });

    return NextResponse.json({ stocks });
  } catch (error: any) {
    console.error("Error fetching warehouse stock:", error);
    return NextResponse.json(
      { error: "فشل جلب المخزون", details: process.env.NODE_ENV === "development" ? error.message : undefined },
      { status: 500 }
    );
  }
}

// POST - Add product to warehouse stock
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await req.json();
    const { warehouseId, productId, quantity } = body;

    if (!warehouseId || !productId) {
      return NextResponse.json({ error: "المستودع والمنتج مطلوبان" }, { status: 400 });
    }

    const numericQuantity = quantity === undefined || quantity === null ? 0 : Number(quantity);
    if (!Number.isInteger(numericQuantity) || numericQuantity < 0) {
      return NextResponse.json({ error: "الكمية غير صالحة" }, { status: 400 });
    }

    const stock = await prisma.warehouseStock.upsert({
      where: {
        warehouseId_productId: { warehouseId, productId },
      },
      update: {
        quantity: numericQuantity,
      },
      create: {
        warehouseId,
        productId,
        quantity: numericQuantity,
      },
      include: {
        product: true,
        warehouse: true,
      },
    });

    return NextResponse.json({ success: true, stock });
  } catch (error: any) {
    console.error("Error adding warehouse stock:", error);
    return NextResponse.json({ error: "فشل إضافة المخزون" }, { status: 500 });
  }
}

// PATCH - Update stock quantity
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await req.json();
    const { id, quantity } = body;

    if (!id || quantity === undefined) {
      return NextResponse.json({ error: "المعرف والكمية مطلوبان" }, { status: 400 });
    }

    const numericQuantity = Number(quantity);
    if (!Number.isInteger(numericQuantity) || numericQuantity < 0) {
      return NextResponse.json({ error: "الكمية غير صالحة" }, { status: 400 });
    }

    const stock = await prisma.warehouseStock.update({
      where: { id },
      data: { quantity: numericQuantity },
      include: {
        product: true,
        warehouse: true,
      },
    });

    return NextResponse.json({ success: true, stock });
  } catch (error: any) {
    console.error("Error updating warehouse stock:", error);
    return NextResponse.json({ error: "فشل تحديث المخزون" }, { status: 500 });
  }
}

// DELETE - Remove product from warehouse stock
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

    await prisma.warehouseStock.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "تم حذف المخزون بنجاح" });
  } catch (error: any) {
    console.error("Error deleting warehouse stock:", error);
    return NextResponse.json({ error: "فشل حذف المخزون" }, { status: 500 });
  }
}
