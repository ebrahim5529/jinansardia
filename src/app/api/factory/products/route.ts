import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET - Get products for the logged-in factory
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).accountType !== "FACTORY") {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const factory = await prisma.factory.findUnique({
            where: { userId: (session.user as any).id },
        });

        if (!factory) {
            return NextResponse.json({ error: "المصنع غير موجود" }, { status: 404 });
        }

        const products = await prisma.product.findMany({
            where: { factoryId: factory.id } as any,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ products });
    } catch (error: any) {
        console.error("Error fetching factory products:", error);
        return NextResponse.json(
            { error: "فشل جلب المنتجات" },
            { status: 500 }
        );
    }
}

// POST - Create a new product for the factory
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).accountType !== "FACTORY") {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const factory = await prisma.factory.findUnique({
            where: { userId: (session.user as any).id },
        });

        if (!factory) {
            return NextResponse.json({ error: "المصنع غير موجود" }, { status: 404 });
        }

        const body = await req.json();
        const { name, category, price, description, stock } = body;

        if (!name || !name.trim()) {
            return NextResponse.json({ error: "اسم المنتج مطلوب" }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name: name.trim(),
                category: category || null,
                price: Number(price) || 0,
                description: description || null,
                factoryId: factory.id,
                // If there's a stock field in warehouseStock, we might need to handle it separately.
                // But for simplicity of CRUD, let's assume product table has what we need or add stock if needed.
                // The original mock had 'stock'. Prisma schema had product price, description, status.
                // WarehouseStock is separate.
            },
        });

        return NextResponse.json({ success: true, product });
    } catch (error: any) {
        console.error("Error creating factory product:", error);
        return NextResponse.json({ error: "فشل إنشاء المنتج" }, { status: 500 });
    }
}

// PATCH - Update a product
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).accountType !== "FACTORY") {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const body = await req.json();
        const { id, name, category, price, description, status } = body;

        if (!id) {
            return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });
        }

        // Verify product belongs to factory
        const factory = await prisma.factory.findUnique({
            where: { userId: (session.user as any).id },
        });

        const existingProduct = await prisma.product.findFirst({
            where: { id, factoryId: factory?.id },
        });

        if (!existingProduct) {
            return NextResponse.json({ error: "المنتج غير موجود أو غير تابع لك" }, { status: 404 });
        }

        const product = await prisma.product.update({
            where: { id },
            data: {
                name: name ? name.trim() : undefined,
                category: category !== undefined ? category : undefined,
                price: price !== undefined ? Number(price) : undefined,
                description: description !== undefined ? description : undefined,
                status: status !== undefined ? status : undefined,
            },
        });

        return NextResponse.json({ success: true, product });
    } catch (error: any) {
        console.error("Error updating factory product:", error);
        return NextResponse.json({ error: "فشل تحديث المنتج" }, { status: 500 });
    }
}

// DELETE - Delete a product
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).accountType !== "FACTORY") {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });
        }

        const factory = await prisma.factory.findUnique({
            where: { userId: (session.user as any).id },
        });

        const existingProduct = await prisma.product.findFirst({
            where: { id, factoryId: factory?.id },
        });

        if (!existingProduct) {
            return NextResponse.json({ error: "المنتج غير موجود أو غير تابع لك" }, { status: 404 });
        }

        await prisma.product.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error deleting factory product:", error);
        return NextResponse.json({ error: "فشل حذف المنتج" }, { status: 500 });
    }
}
