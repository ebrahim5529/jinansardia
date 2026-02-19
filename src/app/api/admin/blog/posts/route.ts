import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET - Get all blog posts
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const where: any = {};
        if (status) {
            where.status = status;
        }

        const posts = await prisma.blogPost.findMany({
            where,
            include: {
                category: true,
                author: {
                    select: {
                        name: true,
                        email: true,
                    }
                },
                tags: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ posts });
    } catch (error: any) {
        console.error("Error fetching blog posts:", error);
        return NextResponse.json(
            { error: "فشل جلب المقالات", details: process.env.NODE_ENV === "development" ? error.message : undefined },
            { status: 500 }
        );
    }
}

// POST - Create a new blog post
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const body = await req.json();
        const {
            title, slug, excerpt, content, featuredImage,
            status, publishedAt, categoryId, tags,
            metaTitle, metaDescription, keywords, canonicalUrl
        } = body;

        if (!title || !slug || !content) {
            return NextResponse.json({ error: "العنوان، الرابط، والمحتوى مطلوبين" }, { status: 400 });
        }

        // Check if slug already exists
        const existingPost = await prisma.blogPost.findUnique({
            where: { slug }
        });

        if (existingPost) {
            return NextResponse.json({ error: "هذا الرابط (Slug) مستخدم بالفعل" }, { status: 400 });
        }

        const post = await prisma.blogPost.create({
            data: {
                title,
                slug,
                excerpt,
                content,
                featuredImage,
                status: status || "draft",
                publishedAt: publishedAt ? new Date(publishedAt) : (status === "published" ? new Date() : null),
                metaTitle,
                metaDescription,
                keywords,
                canonicalUrl,
                authorId: (session.user as any).id,
                categoryId: categoryId || null,
                tags: tags ? {
                    connect: tags.map((id: string) => ({ id }))
                } : undefined,
            },
            include: {
                category: true,
                tags: true,
            }
        });

        return NextResponse.json({ success: true, post });
    } catch (error: any) {
        console.error("Error creating blog post:", error);
        return NextResponse.json({
            error: "فشل إنشاء المقال",
            details: process.env.NODE_ENV === "development" ? error.message : undefined
        }, { status: 500 });
    }
}

// PATCH - Update a blog post
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
        }

        const body = await req.json();
        const {
            id, title, slug, excerpt, content, featuredImage,
            status, publishedAt, categoryId, tags,
            metaTitle, metaDescription, keywords, canonicalUrl
        } = body;

        if (!id) {
            return NextResponse.json({ error: "المعرف مطلوب" }, { status: 400 });
        }

        // Check if slug exists for another post
        if (slug) {
            const existingPost = await prisma.blogPost.findFirst({
                where: {
                    slug,
                    NOT: { id }
                }
            });

            if (existingPost) {
                return NextResponse.json({ error: "هذا الرابط (Slug) مستخدم بالفعل في مقال آخر" }, { status: 400 });
            }
        }

        const updateData: any = {
            title,
            slug,
            excerpt,
            content,
            featuredImage,
            status,
            metaTitle,
            metaDescription,
            keywords,
            canonicalUrl,
            categoryId: categoryId || null,
        };

        if (publishedAt) {
            updateData.publishedAt = new Date(publishedAt);
        } else if (status === "published") {
            const currentPost = await prisma.blogPost.findUnique({ where: { id } });
            if (currentPost && !currentPost.publishedAt) {
                updateData.publishedAt = new Date();
            }
        }

        if (tags) {
            updateData.tags = {
                set: tags.map((id: string) => ({ id }))
            };
        }

        const post = await prisma.blogPost.update({
            where: { id },
            data: updateData,
            include: {
                category: true,
                tags: true,
            }
        });

        return NextResponse.json({ success: true, post });
    } catch (error: any) {
        console.error("Error updating blog post:", error);
        return NextResponse.json({ error: "فشل تحديث المقال" }, { status: 500 });
    }
}

// DELETE - Delete a blog post
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

        await prisma.blogPost.delete({ where: { id } });

        return NextResponse.json({ success: true, message: "تم حذف المقال بنجاح" });
    } catch (error: any) {
        console.error("Error deleting blog post:", error);
        return NextResponse.json({ error: "فشل حذف المقال" }, { status: 500 });
    }
}
