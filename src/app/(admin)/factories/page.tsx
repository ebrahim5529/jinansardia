"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GridIcon, PlusIcon, EyeIcon, TrashBinIcon, PencilIcon } from "@/icons";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";

interface Factory {
    id: number;
    name: string;
    city: string;
    status: string;
    products: number;
    orders: number;
    date: string;
}

const dummyFactories: Factory[] = [
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
    const [selectedFactory, setSelectedFactory] = useState<Factory | null>(null);
    const deleteModal = useModal();
    const successModal = useModal();
    const viewModal = useModal();
    const [successMessage, setSuccessMessage] = useState("");
    const printRef = useRef<HTMLDivElement>(null);

    const totalProducts = dummyFactories.reduce((s, f) => s + f.products, 0);
    const totalOrders = dummyFactories.reduce((s, f) => s + f.orders, 0);
    const activeCount = dummyFactories.filter(f => f.status === "نشط").length;
    const pendingCount = dummyFactories.filter(f => f.status === "قيد المراجعة").length;
    const inactiveCount = dummyFactories.filter(f => f.status !== "نشط" && f.status !== "قيد المراجعة").length;

    const openView = (factory: Factory) => {
        setSelectedFactory(factory);
        viewModal.openModal();
    };

    const handlePrint = () => {
        if (!printRef.current) return;
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;
        printWindow.document.write(`
            <html dir="rtl"><head><title>تقرير مصنع</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 40px; color: #1a1a1a; }
                h1 { font-size: 24px; margin-bottom: 8px; }
                .subtitle { color: #666; margin-bottom: 24px; }
                table { width: 100%; border-collapse: collapse; margin-top: 16px; }
                th, td { padding: 10px 16px; text-align: right; border-bottom: 1px solid #e5e5e5; }
                th { background: #f9fafb; font-weight: 600; font-size: 13px; color: #555; }
                td { font-size: 14px; }
                .badge { padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
                .print-date { color: #999; font-size: 12px; margin-top: 32px; }
            </style></head><body>
            ${printRef.current.innerHTML}
            <p class="print-date">تاريخ الطباعة: ${new Date().toLocaleDateString("ar-SA")} — ${new Date().toLocaleTimeString("ar-SA")}</p>
            </body></html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">إجمالي المصانع</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{dummyFactories.length}</p>
                        </div>
                        <div className="bg-brand-100 dark:bg-brand-900/30 p-3 rounded-lg">
                            <svg className="w-6 h-6 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">مصانع نشطة</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeCount}</p>
                        </div>
                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">قيد المراجعة / غير نشط</p>
                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{pendingCount} <span className="text-gray-400 text-base">/</span> <span className="text-gray-500">{inactiveCount}</span></p>
                        </div>
                        <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
                            <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">إجمالي المنتجات</p>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalProducts}</p>
                        </div>
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">إجمالي الطلبات</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalOrders}</p>
                        </div>
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </div>
                </div>
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
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => openView(factory)} className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors" title="عرض التفاصيل">
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

            {/* View Details Modal */}
            <Modal
                isOpen={viewModal.isOpen}
                onClose={viewModal.closeModal}
                className="max-w-2xl w-full p-6 mx-4"
            >
                {selectedFactory && (
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">تفاصيل المصنع</h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrint}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    طباعة تقرير
                                </button>
                                <Link
                                    href={`/factories/edit/${selectedFactory.id}`}
                                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                                >
                                    <PencilIcon className="w-4 h-4" />
                                    تعديل
                                </Link>
                            </div>
                        </div>

                        <div ref={printRef}>
                            <h1 style={{ display: "none" }}>تقرير مصنع: {selectedFactory.name}</h1>
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400 w-40">رقم المصنع</td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white">#{selectedFactory.id}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">اسم المصنع</td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{selectedFactory.name}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">المدينة</td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white">{selectedFactory.city}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">الحالة</td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedFactory.status)}`}>
                                                {selectedFactory.status}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">عدد المنتجات</td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white">{selectedFactory.products}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">عدد الطلبات</td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white">{selectedFactory.orders}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">تاريخ التسجيل</td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white">{selectedFactory.date}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
