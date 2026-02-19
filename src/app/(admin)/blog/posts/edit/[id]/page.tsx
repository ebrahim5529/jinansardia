"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

export default function EditBlogPostPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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
        if (id) {
            fetchPostAndMetadata();
        }
    }, [id]);

    const fetchPostAndMetadata = async () => {
        try {
            setLoading(true);
            const [postRes, catRes, tagRes] = await Promise.all([
                fetch(`/api/admin/blog/posts`), // This needs to be filtered by ID, but since our API currently returns all, we find it. Ideally, API should support [id].
                fetch("/api/admin/blog/categories"),
                fetch("/api/admin/blog/tags"),
            ]);

            const postData = await postRes.json();
            const catData = await catRes.json();
            const tagData = await tagRes.json();

            setCategories(catData.categories || []);
            setTags(tagData.tags || []);

            const post = postData.posts?.find((p: any) => p.id === id);
            if (post) {
                setFormData({
                    title: post.title,
                    slug: post.slug,
                    excerpt: post.excerpt || "",
                    content: post.content,
                    featuredImage: post.featuredImage || "",
                    status: post.status,
                    categoryId: post.categoryId || "",
                    selectedTags: post.tags?.map((t: any) => t.id) || [],
                    metaTitle: post.metaTitle || "",
                    metaDescription: post.metaDescription || "",
                    keywords: post.keywords || "",
                    canonicalUrl: post.canonicalUrl || "",
                });
            } else {
                toast.error("لم يتم العثور على المقال");
                router.push("/blog/posts");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("فشل جلب البيانات");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
        try {
            setSaving(true);
            const response = await fetch("/api/admin/blog/posts", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    ...formData,
                    tags: formData.selectedTags,
                }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("تم تحديث المقال بنجاح");
                router.push("/blog/posts");
            } else {
                toast.error(data.error || "فشل تحديث المقال");
            }
        } catch (error) {
            console.error("Error updating post:", error);
            toast.error("حدث خطأ أثناء الحفظ");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6 text-center text-gray-500">جاري التحميل...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">تعديل المقال</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Link href="/blog/posts" className="hover:text-brand-600 transition-colors">المقالات</Link>
                        <span>/</span>
                        <span>تعديل</span>
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
                        disabled={saving}
                        className="px-8 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30 disabled:opacity-50"
                    >
                        {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
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
                                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-serif"
                            />
                        </div>
                    </div>

                    {/* SEO Section */}
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-2 flex items-center gap-2">
                            SEO الإعدادات
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
                        </div>
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-4">
                        <h3 className="font-bold text-gray-900 dark:text-white">إعدادات النشر</h3>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase">حالة المقال</label>
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
                            <label className="block text-xs font-medium text-gray-500 mb-2 uppercase">التصنيف</label>
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

                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 space-y-4">
                        <h3 className="font-bold text-gray-900 dark:text-white">الصورة البارزة</h3>
                        <div className="border border-gray-200 dark:border-gray-800 p-2 rounded-lg">
                            <input
                                type="text"
                                name="featuredImage"
                                value={formData.featuredImage}
                                onChange={handleChange}
                                placeholder="رابط الصورة..."
                                className="w-full text-xs bg-transparent focus:outline-none"
                            />
                        </div>
                        {formData.featuredImage && (
                            <img src={formData.featuredImage} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
}
