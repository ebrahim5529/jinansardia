"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusIcon, EyeIcon, TrashBinIcon, PencilIcon, DocsIcon } from "@/icons";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";

interface Hospital {
    id: number;
    name: string;
    type: string;
    city: string;
    status: string;
    orders: number;
    date: string;
}

const dummyHospitals: Hospital[] = [
    { id: 101, name: "مستشفى الملك فيصل التخصصي", type: "حكومي", city: "الرياض", status: "نشط", orders: 450, date: "2022-11-10" },
    { id: 102, name: "مستشفى دلة", type: "خاص", city: "الرياض", status: "نشط", orders: 210, date: "2023-03-15" },
    { id: 103, name: "مستشفى السعودي الألماني", type: "خاص", city: "جدة", status: "قيد المراجعة", orders: 0, date: "2023-11-01" },
    { id: 104, name: "مستشفى العيون", type: "حكومي", city: "الظهران", status: "غير نشط", orders: 32, date: "2023-06-20" },
    { id: 105, name: "مجمع عيادات النور", type: "عيادات", city: "مكة المكرمة", status: "نشط", orders: 15, date: "2023-09-05" },
];

export default function HospitalsPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [hospitalToDelete, setHospitalToDelete] = useState<{ id: number; name: string } | null>(null);
    const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
    const deleteModal = useModal();
    const successModal = useModal();
    const viewModal = useModal();
    const [successMessage, setSuccessMessage] = useState("");
    const printRef = useRef<HTMLDivElement>(null);

    const totalOrders = dummyHospitals.reduce((s, h) => s + h.orders, 0);
    const activeCount = dummyHospitals.filter(h => h.status === "نشط").length;
    const pendingCount = dummyHospitals.filter(h => h.status === "قيد المراجعة").length;
    const govCount = dummyHospitals.filter(h => h.type === "حكومي").length;
    const privateCount = dummyHospitals.filter(h => h.type === "خاص" || h.type === "عيادات").length;

    const openView = (hospital: Hospital) => {
        setSelectedHospital(hospital);
        viewModal.openModal();
    };

    const handlePrint = () => {
        if (!printRef.current) return;
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;
        printWindow.document.write(`
            <html dir="rtl"><head><title>تقرير مستشفى</title>
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

    const filteredHospitals = dummyHospitals.filter(h =>
        (h.name.includes(searchTerm) || h.city.includes(searchTerm)) &&
        (typeFilter === "" || h.type === typeFilter)
    );

    const handleDelete = (id: number, name: string) => {
        setHospitalToDelete({ id, name });
        deleteModal.openModal();
    };

    const confirmDelete = async () => {
        if (!hospitalToDelete) return;
        try {
            console.log("Deleting hospital:", hospitalToDelete.id);
            setSuccessMessage(`تم حذف المستشفى "${hospitalToDelete.name}" بنجاح`);
            deleteModal.closeModal();
            successModal.openModal();
            setHospitalToDelete(null);
        } catch (error) {
            console.error("Error deleting hospital:", error);
            deleteModal.closeModal();
            setHospitalToDelete(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "نشط": return "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400";
            case "قيد المراجعة": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">إدارة المستشفيات</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">متابعة حسابات المستشفيات والمنشآت الطبية.</p>
                </div>
                <Link
                    href="/hospitals/add"
                    className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-brand-500/30"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>تسجيل مستشفى</span>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">إجمالي المنشآت</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{dummyHospitals.length}</p>
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
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">منشآت نشطة</p>
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
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">حكومي / خاص</p>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{govCount} <span className="text-gray-400 text-base">/</span> <span className="text-indigo-500">{privateCount}</span></p>
                        </div>
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
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
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-wrap items-center gap-4">
                <input
                    type="text"
                    placeholder="بحث باسم المستشفى أو المدينة..."
                    className="flex-1 min-w-[200px] bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                    className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                >
                    <option value="">جميع الأنواع</option>
                    <option value="حكومي">حكومي</option>
                    <option value="خاص">خاص</option>
                    <option value="عيادات">عيادات</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">اسم المنشأة</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">النوع</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">المدينة</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">الحالة</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">إجمالي الطلبات</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">تاريخ الانضمام</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                            {filteredHospitals.map((hospital) => (
                                <tr key={hospital.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4">#{hospital.id}</td>
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${hospital.type === 'حكومي' ? "bg-success-100 dark:bg-success-900/30 text-success-600" : "bg-purple-100 dark:bg-purple-900/30 text-purple-600"
                                            }`}>
                                            {hospital.name.charAt(0)}
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-white">{hospital.name}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs">{hospital.type}</span>
                                    </td>
                                    <td className="px-6 py-4">{hospital.city}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(hospital.status)}`}>
                                            {hospital.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-semibold">{hospital.orders}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{hospital.date}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => openView(hospital)} className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors" title="عرض التفاصيل">
                                                <EyeIcon className="w-5 h-5" />
                                            </button>
                                            <Link
                                                href={`/hospitals/edit/${hospital.id}`}
                                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                title="تعديل"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(hospital.id, hospital.name)}
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
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => {
                    deleteModal.closeModal();
                    setHospitalToDelete(null);
                }}
                className="max-w-[520px] p-5 lg:p-8"
            >
                <div className="space-y-4">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">تأكيد الحذف</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        هل أنت متأكد من حذف المستشفى <span className="font-semibold text-gray-900 dark:text-white">{hospitalToDelete?.name}</span>؟
                        <br />
                        <span className="text-error-500 mt-2 block">لا يمكن التراجع عن هذا الإجراء.</span>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                deleteModal.closeModal();
                                setHospitalToDelete(null);
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
                {selectedHospital && (
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">تفاصيل المنشأة</h2>
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
                                    href={`/hospitals/edit/${selectedHospital.id}`}
                                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-sm font-medium"
                                >
                                    <PencilIcon className="w-4 h-4" />
                                    تعديل
                                </Link>
                            </div>
                        </div>

                        <div ref={printRef}>
                            <h1 style={{ display: "none" }}>تقرير منشأة: {selectedHospital.name}</h1>
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400 w-40">رقم المنشأة</td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white">#{selectedHospital.id}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">اسم المنشأة</td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{selectedHospital.name}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">النوع</td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white">{selectedHospital.type}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">المدينة</td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white">{selectedHospital.city}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">الحالة</td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedHospital.status)}`}>
                                                {selectedHospital.status}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">إجمالي الطلبات</td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white">{selectedHospital.orders}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">تاريخ الانضمام</td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white">{selectedHospital.date}</td>
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
