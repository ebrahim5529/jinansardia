"use client";

import { useState, useEffect } from "react";
import { PlusIcon, TrashBinIcon, PencilIcon } from "@/icons";
import { Modal } from "@/components/ui/modal";
import { LoadingScreen } from "@/components/ui/loader";
import { useModal } from "@/hooks/useModal";
import { toast } from "react-toastify";

interface Category {
    id: string;
    name: string;
    slug: string;
    _count?: {
        posts: number;
    };
}

export default function BlogCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const addModal = useModal();
    const deleteModal = useModal();
    const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    const [formData, setFormData] = useState({ name: "", slug: "" });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/blog/categories");
            const data = await response.json();
            setCategories(data.categories || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("فشل جلب التصنيفات");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const next = { ...prev, [name]: value };
            if (name === "name" && !prev.slug) {
                next.slug = value.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
            }
            return next;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const method = categoryToEdit ? "PATCH" : "POST";
            const body = categoryToEdit ? { id: categoryToEdit.id, ...formData } : formData;

            const response = await fetch("/api/admin/blog/categories", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            if (data.success) {
                toast.success(categoryToEdit ? "تم التحديث بنجاح" : "تمت الإضافة بنجاح");
                fetchCategories();
                closeAddModal();
            } else {
                toast.error(data.error || "فشل الحفظ");
            }
        } catch (error) {
            console.error("Error saving category:", error);
            toast.error("حدث خطأ أثناء الحفظ");
        }
    };

    const closeAddModal = () => {
        addModal.closeModal();
        setCategoryToEdit(null);
        setFormData({ name: "", slug: "" });
    };

    const openEdit = (category: Category) => {
        setCategoryToEdit(category);
        setFormData({ name: category.name, slug: category.slug });
        addModal.openModal();
    };

    const handleDelete = async () => {
        if (!categoryToDelete) return;
        try {
            const response = await fetch(`/api/admin/blog/categories?id=${categoryToDelete.id}`, {
                method: "DELETE",
            });
            const data = await response.json();
            if (data.success) {
                toast.success("تم الحذف بنجاح");
                fetchCategories();
                deleteModal.closeModal();
            } else {
                toast.error(data.error || "فشل الحذف");
            }
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("حدث خطأ أثناء الحذف");
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">تصنيفات المدونة</h2>
                    <p className="text-sm text-gray-500 mt-1">إدارة الأقسام الرئيسية للمحتوى.</p>
                </div>
                <button
                    onClick={addModal.openModal}
                    className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>إضافة تصنيف</span>
                </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <table className="w-full text-right">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">الاسم</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">الرابط (Slug)</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">عدد المقالات</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {loading ? (
                            <tr><td colSpan={4} className="px-6 py-10">
                                <LoadingScreen fullScreen={false} message="جاري تحميل التصنيفات..." className="min-h-[120px] w-full" />
                            </td></tr>
                        ) : categories.length === 0 ? (
                            <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-500">لا توجد تصنيفات.</td></tr>
                        ) : (
                            categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{cat.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{cat.slug}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{cat._count?.posts || 0}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => openEdit(cat)} className="p-2 text-gray-400 hover:text-amber-600"><PencilIcon className="w-5 h-5" /></button>
                                            <button onClick={() => { setCategoryToDelete(cat); deleteModal.openModal(); }} className="p-2 text-gray-400 hover:text-red-600"><TrashBinIcon className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            <Modal isOpen={addModal.isOpen} onClose={closeAddModal} className="max-w-md p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-xl font-bold">{categoryToEdit ? "تعديل التصنيف" : "إضافة تصنيف جديد"}</h3>
                    <div>
                        <label className="block text-sm font-medium mb-1">الاسم</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">الرابط (Slug)</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={closeAddModal} className="px-4 py-2 bg-gray-100 rounded-lg">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg">حفظ</button>
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.closeModal} className="max-w-md p-6">
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-red-600">تأكيد الحذف</h3>
                    <p>هل أنت متأكد من حذف التصنيف <span className="font-bold">{categoryToDelete?.name}</span>؟</p>
                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={deleteModal.closeModal} className="px-4 py-2 bg-gray-100 rounded-lg">إلغاء</button>
                        <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg">تأكيد الحذف</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
