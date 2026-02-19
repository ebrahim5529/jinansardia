import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    try {
        const where = {
            status: "published",
            ...(category && { category: { slug: category } }),
        };

        const [posts, total] = await Promise.all([
            prisma.blogPost.findMany({
                where,
                include: {
                    category: { select: { name: true, slug: true } },
                    author: { select: { name: true, image: true } },
                    tags: { select: { name: true } },
                },
                orderBy: { publishedAt: "desc" },
                take: limit,
                skip,
            }),
            prisma.blogPost.count({ where }),
        ]);

        return NextResponse.json({
            posts,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: page,
            },
            success: true,
        });
    } catch (error) {
        console.error("Error fetching public posts:", error);
        return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
}
