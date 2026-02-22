"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GridIcon, PlusIcon, EyeIcon, TrashBinIcon, PencilIcon } from "@/icons";
import { Modal } from "@/components/ui/modal";
import { LoadingScreen } from "@/components/ui/loader";
import { useModal } from "@/hooks/useModal";

interface Factory {
    id: string;
    userId: string;
    factoryName: string;
    city: string;
    country: string;
    email: string;
    name: string | null;
    isActive: boolean;
    productsCount: number;
    createdAt: string;
}

export default function FactoriesPage() {
    const router = useRouter();
    const [factories, setFactories] = useState<Factory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [factoryToDelete, setFactoryToDelete] = useState<{ id: string; name: string } | null>(null);
    const [factoryToToggle, setFactoryToToggle] = useState<{ id: string; name: string; isActive: boolean } | null>(null);
    const [selectedFactory, setSelectedFactory] = useState<Factory | null>(null);
    const deleteModal = useModal();
    const toggleModal = useModal();
    const successModal = useModal();
    const viewModal = useModal();
    const [successMessage, setSuccessMessage] = useState("");
    const printRef = useRef<HTMLDivElement>(null);

    const fetchFactories = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/factories");
            if (!res.ok) throw new Error("Failed to fetch factories");
            const data = await res.json();
            if (data.factories) setFactories(data.factories);
        } catch (error) {
            console.error("Error fetching factories:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFactories();
    }, [fetchFactories]);

    const totalProducts = factories.reduce((s, f) => s + f.productsCount, 0);
    const activeCount = factories.filter(f => f.isActive).length;
    const pendingCount = factories.filter(f => !f.isActive).length;

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

    const filteredFactories = factories.filter(f =>
        f.factoryName.includes(searchTerm) || f.city.includes(searchTerm) || f.email.includes(searchTerm)
    );

    const handleDelete = (id: string, name: string) => {
        setFactoryToDelete({ id, name });
        deleteModal.openModal();
    };

    const handleToggleActive = (factory: Factory) => {
        setFactoryToToggle({ id: factory.id, name: factory.factoryName, isActive: factory.isActive });
        toggleModal.openModal();
    };

    const confirmToggle = async () => {
        if (!factoryToToggle) return;
        try {
            const res = await fetch(`/api/admin/factories/${factoryToToggle.id}/activate`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !factoryToToggle.isActive }),
            });

            if (!res.ok) throw new Error("Failed to update factory status");

            setSuccessMessage(`تم ${factoryToToggle.isActive ? "تعطيل" : "تفعيل"} المصنع "${factoryToToggle.name}" بنجاح`);
            toggleModal.closeModal();
            successModal.openModal();
            setFactoryToToggle(null);
            await fetchFactories();
        } catch (error) {
            console.error("Error updating factory status:", error);
            toggleModal.closeModal();
            setFactoryToToggle(null);
        }
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

    const getStatusColor = (isActive: boolean) => {
        return isActive
            ? "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400"
            : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("ar-SA");
    };

    if (loading) {
        return (
            <LoadingScreen
                fullScreen={false}
                overlay
                message="جاري تحميل المصانع..."
                className="min-h-[400px] rounded-xl"
            />
        );
    }

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">إجمالي المصانع</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{factories.length}</p>
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
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">قيد المراجعة</p>
                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{pendingCount}</p>
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
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex items-center gap-4">
                <input
                    type="text"
                    placeholder="بحث باسم المصنع أو المدينة أو البريد الإلكتروني..."
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
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">البريد الإلكتروني</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">حالة التفعيل</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">المنتجات</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">تاريخ التسجيل</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                            {filteredFactories.map((factory, index) => (
                                <tr key={factory.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4">#{index + 1}</td>
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                                            {factory.factoryName.charAt(0)}
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-white">{factory.factoryName}</span>
                                    </td>
                                    <td className="px-6 py-4">{factory.city}</td>
                                    <td className="px-6 py-4 text-sm">{factory.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(factory.isActive)}`}>
                                            {factory.isActive ? "مفعل" : "قيد المراجعة"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-sm">
                                            <GridIcon className="w-4 h-4 text-gray-400" /> {factory.productsCount}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(factory.createdAt)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => openView(factory)} className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors" title="عرض التفاصيل">
                                                <EyeIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleToggleActive(factory)}
                                                className={`p-2 rounded-lg transition-colors ${
                                                    factory.isActive
                                                        ? "text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                                                        : "text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                }`}
                                                title={factory.isActive ? "تعطيل" : "تفعيل"}
                                            >
                                                {factory.isActive ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                )}
                                            </button>
                                            <Link
                                                href={`/factories/edit/${factory.id}`}
                                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                title="تعديل"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(factory.id, factory.factoryName)}
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
                            {factories.length === 0 ? "لا توجد مصانع مسجلة." : "لا توجد مصانع مطابقة للبحث."}
                        </div>
                    )}
                </div>
            </div>

            {/* Toggle Active Modal */}
            <Modal
                isOpen={toggleModal.isOpen}
                onClose={() => {
                    toggleModal.closeModal();
                    setFactoryToToggle(null);
                }}
                className="max-w-[520px] p-5 lg:p-8"
            >
                <div className="space-y-4">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {factoryToToggle?.isActive ? "تعطيل المصنع" : "تفعيل المصنع"}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        هل أنت متأكد من {factoryToToggle?.isActive ? "تعطيل" : "تفعيل"} المصنع{" "}
                        <span className="font-semibold text-gray-900 dark:text-white">{factoryToToggle?.name}</span>؟
                    </div>
                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                toggleModal.closeModal();
                                setFactoryToToggle(null);
                            }}
                            className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                        >
                            إلغاء
                        </button>
                        <button
                            type="button"
                            onClick={confirmToggle}
                            className={`px-4 py-2.5 rounded-lg text-white transition-colors font-medium ${
                                factoryToToggle?.isActive
                                    ? "bg-orange-600 hover:bg-orange-700"
                                    : "bg-success-600 hover:bg-success-700"
                            }`}
                        >
                            {factoryToToggle?.isActive ? "تعطيل" : "تفعيل"}
                        </button>
                    </div>
                </div>
            </Modal>

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
                            <h1 style={{ display: "none" }}>تقرير مصنع: {selectedFactory.factoryName}</h1>
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400 w-40">اسم المصنع</td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{selectedFactory.factoryName}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">المدينة</td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white">{selectedFactory.city}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">البلد</td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white">{selectedFactory.country}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">البريد الإلكتروني</td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white">{selectedFactory.email}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">حالة التفعيل</td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedFactory.isActive)}`}>
                                                {selectedFactory.isActive ? "مفعل" : "قيد المراجعة"}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">عدد المنتجات</td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white">{selectedFactory.productsCount}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">تاريخ التسجيل</td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white">{formatDate(selectedFactory.createdAt)}</td>
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

