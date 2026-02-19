import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { type Locale } from "@/locales/i18n";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
        where: { slug },
    });

    if (!post) return { title: "المقال غير موجود" };

    return {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        keywords: post.keywords,
        openGraph: {
            title: post.title,
            description: post.excerpt || undefined,
            images: post.featuredImage ? [{ url: post.featuredImage }] : [],
            type: "article",
            publishedTime: post.publishedAt?.toISOString(),
        },
        alternates: {
            canonical: post.canonicalUrl || undefined,
        },
    };
}

async function getPost(slug: string) {
    return await prisma.blogPost.findUnique({
        where: { slug, status: "published" },
        include: {
            category: true,
            author: true,
            tags: true,
        },
    });
}

async function getRelatedPosts(categoryId?: string, excludeId?: string) {
    if (!categoryId) return [];
    return await prisma.blogPost.findMany({
        where: {
            categoryId,
            id: { not: excludeId },
            status: "published",
        },
        take: 3,
        orderBy: { publishedAt: "desc" },
    });
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    const cookieStore = await cookies();
    const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "en";
    const relatedPosts = await getRelatedPosts(post.categoryId || undefined, post.id);

    return (
        <main className="bg-white min-h-screen">
            <Navbar />

            <article className="pt-32 pb-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
                        <Link href="/" className="hover:text-brand-600">الرئيسية</Link>
                        <i className={`ri-arrow-${locale === 'ar' ? 'left' : 'right'}-s-line text-xs`}></i>
                        <Link href="/blog" className="hover:text-brand-600">المدونة</Link>
                        {post.category && (
                            <>
                                <i className={`ri-arrow-${locale === 'ar' ? 'left' : 'right'}-s-line text-xs`}></i>
                                <Link href={`/blog?category=${post.category.slug}`} className="hover:text-brand-600">
                                    {post.category.name}
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Header */}
                    <header className="mb-12">
                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight rtl:line-height-[1.4]">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-gray-500 border-y border-gray-100 py-6">
                            <div className="flex items-center gap-3">
                                {post.author?.image ? (
                                    <img src={post.author.image} className="w-10 h-10 rounded-full" alt={post.author.name || ""} />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">
                                        {post.author?.name?.charAt(0)}
                                    </div>
                                )}
                                <div className="text-sm">
                                    <p className="font-bold text-gray-900">{post.author?.name}</p>
                                    <p className="text-xs">كاتب محتوى</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <i className="ri-calendar-line text-brand-500"></i>
                                <span>{post.publishedAt?.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <i className="ri-time-line text-brand-500"></i>
                                <span>{Math.ceil(post.content.length / 500)} دقيقة قراءة</span>
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    {post.featuredImage && (
                        <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl shadow-brand-100/50">
                            <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full object-cover max-h-[500px]"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-lg max-w-none dark:prose-invert prose-brand ltr:text-left rtl:text-right font-serif leading-relaxed text-gray-800">
                        {/* Note: In a real app, we'd use a markdown parser here. 
                 For this implementation, we preserve white space and render as text. */}
                        <div className="whitespace-pre-wrap">
                            {post.content}
                        </div>
                    </div>

                    {/* Tags & Share */}
                    <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <span key={tag.id} className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium text-gray-600 uppercase tracking-wider">
                                    #{tag.name}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-gray-400">مشاركة:</span>
                            <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-brand-500 hover:text-white transition-all"><i className="ri-twitter-x-line"></i></a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-brand-500 hover:text-white transition-all"><i className="ri-linkedin-fill"></i></a>
                            <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-brand-500 hover:text-white transition-all"><i className="ri-facebook-fill"></i></a>
                        </div>
                    </div>
                </div>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="bg-gray-50 py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold mb-12 text-center">مقالات ذات صلة</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedPosts.map(p => (
                                <Link key={p.id} href={`/blog/${p.slug}`} className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-brand-100">
                                    <div className="h-40 rounded-xl overflow-hidden mb-4">
                                        <img src={p.featuredImage || ''} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-2">{p.title}</h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <Footer locale={locale} />
        </main>
    );
}
