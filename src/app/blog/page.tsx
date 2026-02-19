import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { t, type Locale } from "@/locales/i18n";

async function getPosts(categorySlug?: string) {
    const where = {
        status: "published",
        ...(categorySlug && { category: { slug: categorySlug } }),
    };

    return await prisma.blogPost.findMany({
        where,
        include: {
            category: true,
            author: true,
        },
        orderBy: { publishedAt: "desc" },
    });
}

async function getCategories() {
    return await prisma.blogCategory.findMany({
        include: {
            _count: {
                select: { posts: { where: { status: "published" } } },
            },
        },
    });
}

export default async function BlogIndexPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const { category: categorySlug } = await searchParams;
    const cookieStore = await cookies();
    const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale) || "en";

    const [posts, categories] = await Promise.all([
        getPosts(categorySlug),
        getCategories(),
    ]);

    const activeCategory = categories.find((c) => c.slug === categorySlug);

    return (
        <main className="bg-white min-h-screen">
            <Navbar />

            {/* Hero Section */}
            <section className="bg-gray-50 border-b border-gray-100 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 font-display">
                        {locale === 'ar' ? 'المدونة والتقارير' : 'Blog & Reports'}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        {locale === 'ar'
                            ? 'اكتشف أحدث المقالات والتقارير التقنية حول سلاسل الإمداد في القطاع الطبي والصناعي.'
                            : 'Discover the latest articles and technical reports on supply chains in the medical and industrial sectors.'}
                    </p>
                </div>
            </section>

            {/* Filter Section */}
            <section className="py-8 sticky top-24 bg-white/80 backdrop-blur-md z-40 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/blog"
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!categorySlug
                                    ? "bg-brand-500 text-white shadow-lg shadow-brand-200"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {locale === 'ar' ? 'الكل' : 'All'}
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/blog?category=${cat.slug}`}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${categorySlug === cat.slug
                                        ? "bg-brand-500 text-white shadow-lg shadow-brand-200"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {cat.name}
                                <span className="ms-2 opacity-60 text-xs">({cat._count.posts})</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Posts Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {posts.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4 text-gray-200">
                                <i className="ri-article-line"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">
                                {locale === 'ar' ? 'لا توجد مقالات في هذا القسم بعد' : 'No articles in this section yet'}
                            </h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <article key={post.id} className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-brand-100 transition-all duration-500 ltr:text-left rtl:text-right">
                                    <Link href={`/blog/${post.slug}`} className="relative h-56 overflow-hidden">
                                        {post.featuredImage ? (
                                            <img
                                                src={post.featuredImage}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-brand-50 flex items-center justify-center">
                                                <i className="ri-image-2-line text-4xl text-brand-200"></i>
                                            </div>
                                        )}
                                        <div className="absolute top-4 start-4">
                                            <span className="bg-white/90 backdrop-blur-sm text-brand-600 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                                                {post.category?.name || (locale === 'ar' ? 'عام' : 'General')}
                                            </span>
                                        </div>
                                    </Link>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                                            <span className="flex items-center gap-1">
                                                <i className="ri-calendar-line"></i>
                                                {post.publishedAt?.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}
                                            </span>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            <span className="flex items-center gap-1">
                                                <i className="ri-user-line"></i>
                                                {post.author?.name}
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-600 transition-colors line-clamp-2">
                                            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                                        </h2>
                                        <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                                            {post.excerpt}
                                        </p>
                                        <Link
                                            href={`/blog/${post.slug}`}
                                            className="mt-auto flex items-center gap-2 text-brand-600 font-bold text-sm group-hover:gap-4 transition-all"
                                        >
                                            {locale === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                                            <i className={`${locale === 'ar' ? 'ri-arrow-left-line' : 'ri-arrow-right-line'}`}></i>
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer locale={locale} />
        </main>
    );
}
