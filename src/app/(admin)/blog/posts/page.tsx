"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusIcon, EyeIcon, TrashBinIcon, PencilIcon, ListIcon } from "@/icons";
import { Modal } from "@/components/ui/modal";
import { LoadingScreen } from "@/components/ui/loader";
import { useModal } from "@/hooks/useModal";
import { toast } from "react-toastify";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    status: string;
    publishedAt: string | null;
    category: { name: string } | null;
    author: { name: string } | null;
    createdAt: string;
}

export default function BlogPostsPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [postToDelete, setPostToDelete] = useState<{ id: string; title: string } | null>(null);
    const deleteModal = useModal();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/blog/posts");
            const data = await response.json();
            if (data.posts) {
                setPosts(data.posts);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            toast.error("فشل جلب المقالات");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: string, title: string) => {
        setPostToDelete({ id, title });
        deleteModal.openModal();
    };

    const confirmDelete = async () => {
        if (!postToDelete) return;
        try {
            const response = await fetch(`/api/admin/blog/posts?id=${postToDelete.id}`, {
                method: "DELETE",
            });
            const data = await response.json();
            if (data.success) {
                toast.success(`تم حذف المقال "${postToDelete.title}" بنجاح`);
                setPosts(posts.filter((p) => p.id !== postToDelete.id));
                deleteModal.closeModal();
            } else {
                toast.error(data.error || "فشل حذف المقال");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.error("حدث خطأ أثناء الحذف");
        }
    };

    const filteredPosts = posts.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "published": return "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400";
            case "draft": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
            case "scheduled": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
            case "archived": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "published": return "منشور";
            case "draft": return "مسودة";
            case "scheduled": return "مجدول";
            case "archived": return "مؤرشف";
            default: return status;
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة المدونة</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">عرض وتحرير المقالات المنشورة في الموقع.</p>
                </div>
                <Link
                    href="/blog/posts/create"
                    className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-brand-500/30"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>إضافة مقال جديد</span>
                </Link>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">إجمالي المقالات</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{posts.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">منشور</p>
                    <p className="text-2xl font-bold text-success-600">{posts.filter(p => p.status === 'published').length}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">مسودة</p>
                    <p className="text-2xl font-bold text-gray-500">{posts.filter(p => p.status === 'draft').length}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">مجدول</p>
                    <p className="text-2xl font-bold text-blue-600">{posts.filter(p => p.status === 'scheduled').length}</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <input
                    type="text"
                    placeholder="بحث في المقالات..."
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">المقال</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">التصنيف</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">الحالة</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">الكاتب</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">تاريخ النشر</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 p-0">
                                        <LoadingScreen fullScreen={false} message="جاري تحميل المقالات..." className="min-h-[200px] w-full" />
                                    </td>
                                </tr>
                            ) : filteredPosts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">لا توجد مقالات لعرضها.</td>
                                </tr>
                            ) : (
                                filteredPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white truncate max-w-xs" title={post.title}>{post.title}</div>
                                            <div className="text-xs text-gray-400 mt-1">/{post.slug}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{post.category?.name || "بدون تصنيف"}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                                                {getStatusLabel(post.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{post.author?.name || "مجهول"}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("ar-SA") : "غير محدد"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link href={`/blog/${post.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-brand-600 rounded-lg transition-colors">
                                                    <EyeIcon className="w-5 h-5" />
                                                </Link>
                                                <Link href={`/blog/posts/edit/${post.id}`} className="p-2 text-gray-400 hover:text-amber-600 rounded-lg transition-colors">
                                                    <PencilIcon className="w-5 h-5" />
                                                </Link>
                                                <button onClick={() => handleDelete(post.id, post.title)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors">
                                                    <TrashBinIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => {
                    deleteModal.closeModal();
                    setPostToDelete(null);
                }}
                className="max-w-[500px] p-6 lg:p-8"
            >
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">تأكيد حذف المقال</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        هل أنت متأكد من رغبتك في حذف المقال <span className="font-semibold">{postToDelete?.title}</span>؟
                        هذا الإجراء لا يمكن التراجع عنه.
                    </p>
                    <div className="flex items-center justify-end gap-3 mt-6">
                        <button
                            onClick={() => deleteModal.closeModal()}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        >
                            تأكيد السذف
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
