"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { ChevronDownIcon } from "@/icons";

export default function CreateBlogPostPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [tags, setTags] = useState<{ id: string; name: string }[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        featuredImage: "",
        status: "draft",
        categoryId: "",
        selectedTags: [] as string[],
        metaTitle: "",
        metaDescription: "",
        keywords: "",
        canonicalUrl: "",
    });

    useEffect(() => {
        fetchMetadata();
    }, []);

    const fetchMetadata = async () => {
        try {
            const [catRes, tagRes] = await Promise.all([
                fetch("/api/admin/blog/categories"),
                fetch("/api/admin/blog/tags"),
            ]);
            const catData = await catRes.json();
            const tagData = await tagRes.json();
            setCategories(catData.categories || []);
            setTags(tagData.tags || []);
        } catch (error) {
            console.error("Error fetching metadata:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const newData = { ...prev, [name]: value };
            // Auto-generate slug from title
            if (name === "title" && !prev.slug) {
                newData.slug = value
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/\s+/g, "-");
            }
            return newData;
        });
    };

    const handleTagToggle = (tagId: string) => {
        setFormData((prev) => ({
            ...prev,
            selectedTags: prev.selectedTags.includes(tagId)
                ? prev.selectedTags.filter((id) => id !== tagId)
                : [...prev.selectedTags, tagId],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.slug || !formData.content) {
            toast.error("يرجى ملء الحقول الأساسية (العنوان، الرابط، المحتوى)");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch("/api/admin/blog/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    tags: formData.selectedTags,
                }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("تم إنشاء المقال بنجاح");
                router.push("/blog/posts");
            } else {
                toast.error(data.error || "فشل إنشاء المقال");
            }
        } catch (error) {
            console.error("Error creating post:", error);
            toast.error("حدث خطأ أثناء الحفظ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">إضافة مقال جديد</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Link href="/blog/posts" className="hover:text-brand-600 transition-colors">المقالات</Link>
                        <span>/</span>
                        <span>إضافة مقال</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-8 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30 disabled:opacity-50"
                    >
                        {loading ? "جاري الحفظ..." : "نشر المقال"}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">عنوان المقال</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="أدخل عنوان المقال..."
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-lg font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">رابط المقال (Slug)</label>
                            <div className="flex items-center">
                                <span className="bg-gray-100 dark:bg-gray-800 border border-l-0 border-gray-200 dark:border-gray-700 px-4 py-2 rounded-r-lg text-gray-500 text-sm">/blog/</span>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-l-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ملخص المقال</label>
                            <textarea
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleChange}
                                rows={3}
                                placeholder="وصف قصير يظهر في صفحة المدونة..."
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">محتوى المقال</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                rows={15}
                                placeholder="اكتب محتوى المقال هنا..."
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-serif"
                            />
                            <p className="text-xs text-gray-400 mt-2">يمكنك استخدام Markdown لتنسيق المحتوى.</p>
                        </div>
                    </div>

                    {/* SEO Section */}
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
                            <svg className="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            تحسين محركات البحث (SEO)
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meta Title</label>
                                <input
                                    type="text"
                                    name="metaTitle"
                                    value={formData.metaTitle}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meta Description</label>
                                <textarea
                                    name="metaDescription"
                                    value={formData.metaDescription}
                                    onChange={handleChange}
                                    rows={2}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الكلمات المفتاحية (Keywords)</label>
                                <input
                                    type="text"
                                    name="keywords"
                                    value={formData.keywords}
                                    onChange={handleChange}
                                    placeholder="كلمة 1, كلمة 2..."
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    {/* Publishing Settings */}
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-4">
                        <h3 className="font-bold text-gray-900 dark:text-white">إعدادات النشر</h3>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">حالة المقال</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="draft">مسودة</option>
                                <option value="published">منشور</option>
                                <option value="scheduled">مجدول</option>
                                <option value="archived">مؤرشف</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">التصنيف</label>
                            <select
                                name="categoryId"
                                value={formData.categoryId}
                                onChange={handleChange}
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="">اختر تصنيف...</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-4">
                        <h3 className="font-bold text-gray-900 dark:text-white">الصورة البارزة</h3>
                        <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg p-4 text-center">
                            {formData.featuredImage ? (
                                <div className="space-y-2">
                                    <img src={formData.featuredImage} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, featuredImage: "" }))}
                                        className="text-xs text-red-500 hover:underline"
                                    >
                                        حذف الصورة
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-xs text-gray-500">أدخل رابط الصورة</p>
                                    <input
                                        type="text"
                                        name="featuredImage"
                                        value={formData.featuredImage}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-4">
                        <h3 className="font-bold text-gray-900 dark:text-white">الوسوم (Tags)</h3>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => handleTagToggle(tag.id)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${formData.selectedTags.includes(tag.id)
                                            ? "bg-brand-600 text-white"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    {tag.name}
                                </button>
                            ))}
                            {tags.length === 0 && <p className="text-xs text-gray-500 italic">لا توجد وسوم متاحة.</p>}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
