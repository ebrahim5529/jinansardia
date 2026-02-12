import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET - Get all products
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "فشل جلب المنتجات", details: process.env.NODE_ENV === "development" ? error.message : undefined },
      { status: 500 }
    );
  }
}

// POST - Create a new product
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await req.json();
    const { name, category, price, description } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "اسم المنتج مطلوب" }, { status: 400 });
    }

    if (price !== undefined && price !== null) {
      const numericPrice = Number(price);
      if (Number.isNaN(numericPrice) || numericPrice < 0) {
        return NextResponse.json({ error: "السعر غير صالح" }, { status: 400 });
      }
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        category: category || null,
        price: price || 0,
        description: description || null,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "فشل إنشاء المنتج" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, category, price, description, status } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });
    }

    const data: any = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json({ error: "اسم المنتج مطلوب" }, { status: 400 });
      }
      data.name = name.trim();
    }

    if (category !== undefined) {
      data.category = category ? String(category) : null;
    }

    if (price !== undefined) {
      const numericPrice = Number(price);
      if (Number.isNaN(numericPrice) || numericPrice < 0) {
        return NextResponse.json({ error: "السعر غير صالح" }, { status: 400 });
      }
      data.price = numericPrice;
    }

    if (description !== undefined) {
      data.description = description ? String(description) : null;
    }

    if (status !== undefined) {
      data.status = String(status);
    }

    const product = await prisma.product.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "فشل تحديث المنتج" }, { status: 500 });
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

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "تم حذف المنتج بنجاح" });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "فشل حذف المنتج" }, { status: 500 });
  }
}
