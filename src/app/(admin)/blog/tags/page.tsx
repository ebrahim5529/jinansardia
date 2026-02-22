"use client";

import { useState, useEffect } from "react";
import { PlusIcon, TrashBinIcon } from "@/icons";
import { Modal } from "@/components/ui/modal";
import { LoadingScreen } from "@/components/ui/loader";
import { useModal } from "@/hooks/useModal";
import { toast } from "react-toastify";

interface Tag {
    id: string;
    name: string;
}

export default function BlogTagsPage() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const addModal = useModal();
    const deleteModal = useModal();
    const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
    const [tagName, setTagName] = useState("");

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/blog/tags");
            const data = await response.json();
            setTags(data.tags || []);
        } catch (error) {
            console.error("Error fetching tags:", error);
            toast.error("فشل جلب الوسوم");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tagName) return;
        try {
            const response = await fetch("/api/admin/blog/tags", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: tagName }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success("تمت الإضافة بنجاح");
                fetchTags();
                setTagName("");
                addModal.closeModal();
            } else {
                toast.error(data.error || "فشل الإضافة");
            }
        } catch (error) {
            console.error("Error saving tag:", error);
            toast.error("حدث خطأ أثناء الحفظ");
        }
    };

    const handleDelete = async () => {
        if (!tagToDelete) return;
        try {
            const response = await fetch(`/api/admin/blog/tags?id=${tagToDelete.id}`, {
                method: "DELETE",
            });
            const data = await response.json();
            if (data.success) {
                toast.success("تم الحذف بنجاح");
                fetchTags();
                deleteModal.closeModal();
            } else {
                toast.error(data.error || "فشل الحذف");
            }
        } catch (error) {
            console.error("Error deleting tag:", error);
            toast.error("حدث خطأ أثناء الحذف");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">وسوم المدونة (Tags)</h2>
                    <p className="text-sm text-gray-500 mt-1">إضافة وإدارة الكلمات المفتاحية للمقالات.</p>
                </div>
                <button
                    onClick={addModal.openModal}
                    className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>إضافة وسم</span>
                </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex flex-wrap gap-3">
                    {loading ? (
                        <LoadingScreen fullScreen={false} message="جاري تحميل الوسوم..." className="min-h-[120px] w-full rounded-lg" />
                    ) : tags.length === 0 ? (
                        <p className="text-gray-500">لا توجد وسوم مضافة.</p>
                    ) : (
                        tags.map((tag) => (
                            <div
                                key={tag.id}
                                className="group flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 transition-all hover:border-brand-300"
                            >
                                <span className="text-sm font-medium text-gray-700 dark:text-white">{tag.name}</span>
                                <button
                                    onClick={() => { setTagToDelete(tag); deleteModal.openModal(); }}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <TrashBinIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Add Modal */}
            <Modal isOpen={addModal.isOpen} onClose={addModal.closeModal} className="max-w-md p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-xl font-bold">إضافة وسم جديد</h3>
                    <div>
                        <label className="block text-sm font-medium mb-1">اسم الوسم</label>
                        <input
                            type="text"
                            value={tagName}
                            onChange={(e) => setTagName(e.target.value)}
                            placeholder="مثال: Next.js"
                            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white"
                            autoFocus
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={addModal.closeModal} className="px-4 py-2 bg-gray-100 rounded-lg">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg">حفظ</button>
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.closeModal} className="max-w-md p-6">
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-red-600">تأكيد الحذف</h3>
                    <p>هل أنت متأكد من رغبتك في حذف الوسم <span className="font-bold">{tagToDelete?.name}</span>؟</p>
                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={deleteModal.closeModal} className="px-4 py-2 bg-gray-100 rounded-lg">إلغاء</button>
                        <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg">تأكيد الحذف</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
