"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GridIcon, PlusIcon, EyeIcon, TrashBinIcon, PencilIcon } from "@/icons";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";

const dummyFactories = [
    { id: 1, name: "مصنع الرياض للمنسوجات", city: "الرياض", status: "نشط", products: 45, orders: 120, date: "2023-01-15" },
    { id: 2, name: "مصنع جدة للصناعات الدوائية", city: "جدة", status: "نشط", products: 120, orders: 340, date: "2023-02-20" },
    { id: 3, name: "مصنع الشرقية للبلاستيك", city: "الدمام", status: "قيد المراجعة", products: 0, orders: 0, date: "2023-10-05" },
    { id: 4, name: "مصنع القصيم للتمور", city: "بريدة", status: "غير نشط", products: 12, orders: 5, date: "2023-05-12" },
    { id: 5, name: "مصنع تبوك للأسمنت", city: "تبوك", status: "محظور", products: 8, orders: 1, date: "2023-08-01" },
];

export default function FactoriesPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [factoryToDelete, setFactoryToDelete] = useState<{ id: number; name: string } | null>(null);
    const deleteModal = useModal();
    const successModal = useModal();
    const [successMessage, setSuccessMessage] = useState("");

    const filteredFactories = dummyFactories.filter(f =>
        f.name.includes(searchTerm) || f.city.includes(searchTerm)
    );

    const handleDelete = (id: number, name: string) => {
        setFactoryToDelete({ id, name });
        deleteModal.openModal();
    };

    const confirmDelete = async () => {
        if (!factoryToDelete) return;
        try {
            console.log("Deleting factory:", factoryToDelete.id);
            setSuccessMessage(`تم حذف المصنع "${factoryToDelete.name}" بنجاح`);
            deleteModal.closeModal();
            successModal.openModal();
            setFactoryToDelete(null);
        } catch (error) {
            console.error("Error deleting factory:", error);
            deleteModal.closeModal();
            setFactoryToDelete(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "نشط": return "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400";
            case "قيد المراجعة": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
            case "غير نشط": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
            case "محظور": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة المصانع</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">عرض والتحكم في حسابات المصانع المسجلة في النظام.</p>
                </div>
                <Link
                    href="/factories/add"
                    className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-brand-500/30"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>إضافة مصنع جديد</span>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex items-center gap-4">
                <input
                    type="text"
                    placeholder="بحث باسم المصنع أو المدينة..."
                    className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">اسم المصنع</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">المدينة</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">الحالة</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">المنتجات / الطلبات</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">تاريخ التسجيل</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                            {filteredFactories.map((factory) => (
                                <tr key={factory.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4">#{factory.id}</td>
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                                            {factory.name.charAt(0)}
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-white">{factory.name}</span>
                                    </td>
                                    <td className="px-6 py-4">{factory.city}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(factory.status)}`}>
                                            {factory.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="flex items-center gap-1"><GridIcon className="w-4 h-4 text-gray-400" /> {factory.products}</span>
                                            <span className="flex items-center gap-1"><span className="w-1 h-1 bg-gray-300 rounded-full"></span> {factory.orders} طلب</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{factory.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors" title="عرض التفاصيل">
                                                <EyeIcon className="w-5 h-5" />
                                            </button>
                                            <Link
                                                href={`/factories/edit/${factory.id}`}
                                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                title="تعديل"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(factory.id, factory.name)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="حذف"
                                            >
                                                <TrashBinIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredFactories.length === 0 && (
                        <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                            لا توجد مصانع مطابقة للبحث.
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => {
                    deleteModal.closeModal();
                    setFactoryToDelete(null);
                }}
                className="max-w-[520px] p-5 lg:p-8"
            >
                <div className="space-y-4">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">تأكيد الحذف</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        هل أنت متأكد من حذف المصنع <span className="font-semibold text-gray-900 dark:text-white">{factoryToDelete?.name}</span>؟
                        <br />
                        <span className="text-error-500 mt-2 block">لا يمكن التراجع عن هذا الإجراء.</span>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                deleteModal.closeModal();
                                setFactoryToDelete(null);
                            }}
                            className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                        >
                            إلغاء
                        </button>
                        <button
                            type="button"
                            onClick={confirmDelete}
                            className="px-4 py-2.5 rounded-lg bg-error-600 text-white hover:bg-error-700 transition-colors font-medium"
                        >
                            حذف
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Success Modal */}
            <Modal
                isOpen={successModal.isOpen}
                onClose={successModal.closeModal}
                className="max-w-[520px] p-5 lg:p-8"
            >
                <div className="space-y-4">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">تم بنجاح</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{successMessage}</div>
                    <div className="flex items-center justify-end">
                        <button
                            type="button"
                            onClick={successModal.closeModal}
                            className="px-4 py-2.5 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors font-medium"
                        >
                            موافق
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
