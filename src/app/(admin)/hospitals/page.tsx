"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusIcon, EyeIcon, TrashBinIcon, PencilIcon } from "@/icons";
import { Modal } from "@/components/ui/modal";
import { LoadingScreen } from "@/components/ui/loader";
import { useModal } from "@/hooks/useModal";

interface Hospital {
    id: string;
    userId: string;
    hospitalName: string;
    facilityType: "GOVERNMENT" | "PRIVATE" | "CHARITY";
    city: string;
    country: string;
    email: string;
    name: string | null;
    isActive: boolean;
    createdAt: string;
}

const facilityTypeLabels: Record<string, string> = {
    GOVERNMENT: "حكومي",
    PRIVATE: "خاص",
    CHARITY: "خيري",
};

export default function HospitalsPage() {
    const router = useRouter();
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [hospitalToDelete, setHospitalToDelete] = useState<{ id: string; name: string } | null>(null);
    const [hospitalToToggle, setHospitalToToggle] = useState<{ id: string; name: string; isActive: boolean } | null>(null);
    const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
    const deleteModal = useModal();
    const toggleModal = useModal();
    const successModal = useModal();
    const viewModal = useModal();
    const [successMessage, setSuccessMessage] = useState("");
    const printRef = useRef<HTMLDivElement>(null);

    const fetchHospitals = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/hospitals");
            if (!res.ok) throw new Error("Failed to fetch hospitals");
            const data = await res.json();
            if (data.hospitals) setHospitals(data.hospitals);
        } catch (error) {
            console.error("Error fetching hospitals:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHospitals();
    }, [fetchHospitals]);

    const activeCount = hospitals.filter(h => h.isActive).length;
    const pendingCount = hospitals.filter(h => !h.isActive).length;
    const govCount = hospitals.filter(h => h.facilityType === "GOVERNMENT").length;
    const privateCount = hospitals.filter(h => h.facilityType === "PRIVATE" || h.facilityType === "CHARITY").length;

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

    const filteredHospitals = hospitals.filter(h =>
        (h.hospitalName.includes(searchTerm) || h.city.includes(searchTerm) || h.email.includes(searchTerm)) &&
        (typeFilter === "" || h.facilityType === typeFilter)
    );

    const handleDelete = (id: string, name: string) => {
        setHospitalToDelete({ id, name });
        deleteModal.openModal();
    };

    const handleToggleActive = (hospital: Hospital) => {
        setHospitalToToggle({ id: hospital.id, name: hospital.hospitalName, isActive: hospital.isActive });
        toggleModal.openModal();
    };

    const confirmToggle = async () => {
        if (!hospitalToToggle) return;
        try {
            const res = await fetch(`/api/admin/hospitals/${hospitalToToggle.id}/activate`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !hospitalToToggle.isActive }),
            });

            if (!res.ok) throw new Error("Failed to update hospital status");

            setSuccessMessage(`تم ${hospitalToToggle.isActive ? "تعطيل" : "تفعيل"} المستشفى "${hospitalToToggle.name}" بنجاح`);
            toggleModal.closeModal();
            successModal.openModal();
            setHospitalToToggle(null);
            await fetchHospitals();
        } catch (error) {
            console.error("Error updating hospital status:", error);
            toggleModal.closeModal();
            setHospitalToToggle(null);
        }
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
                message="جاري تحميل المستشفيات..."
                className="min-h-[400px] rounded-xl"
            />
        );
    }

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
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{hospitals.length}</p>
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
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-wrap items-center gap-4">
                <input
                    type="text"
                    placeholder="بحث باسم المستشفى أو المدينة أو البريد الإلكتروني..."
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
                    <option value="GOVERNMENT">حكومي</option>
                    <option value="PRIVATE">خاص</option>
                    <option value="CHARITY">خيري</option>
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
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">البريد الإلكتروني</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">حالة التفعيل</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">تاريخ الانضمام</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                            {filteredHospitals.map((hospital, index) => (
                                <tr key={hospital.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4">#{index + 1}</td>
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                                            hospital.facilityType === 'GOVERNMENT' 
                                                ? "bg-success-100 dark:bg-success-900/30 text-success-600" 
                                                : "bg-purple-100 dark:bg-purple-900/30 text-purple-600"
                                        }`}>
                                            {hospital.hospitalName.charAt(0)}
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-white">{hospital.hospitalName}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs">
                                            {facilityTypeLabels[hospital.facilityType]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{hospital.city}</td>
                                    <td className="px-6 py-4 text-sm">{hospital.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(hospital.isActive)}`}>
                                            {hospital.isActive ? "مفعل" : "قيد المراجعة"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(hospital.createdAt)}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-1">
                                            <button onClick={() => openView(hospital)} className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors" title="عرض التفاصيل">
                                                <EyeIcon className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleToggleActive(hospital)}
                                                className={`p-2 rounded-lg transition-colors ${
                                                    hospital.isActive
                                                        ? "text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                                                        : "text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                                }`}
                                                title={hospital.isActive ? "تعطيل" : "تفعيل"}
                                            >
                                                {hospital.isActive ? (
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
                                                href={`/hospitals/edit/${hospital.id}`}
                                                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                title="تعديل"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(hospital.id, hospital.hospitalName)}
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
                    {filteredHospitals.length === 0 && (
                        <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                            {hospitals.length === 0 ? "لا توجد مستشفيات مسجلة." : "لا توجد مستشفيات مطابقة للبحث."}
                        </div>
                    )}
                </div>
            </div>

            {/* Toggle Active Modal */}
            <Modal
                isOpen={toggleModal.isOpen}
                onClose={() => {
                    toggleModal.closeModal();
                    setHospitalToToggle(null);
                }}
                className="max-w-[520px] p-5 lg:p-8"
            >
                <div className="space-y-4">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {hospitalToToggle?.isActive ? "تعطيل المستشفى" : "تفعيل المستشفى"}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        هل أنت متأكد من {hospitalToToggle?.isActive ? "تعطيل" : "تفعيل"} المستشفى{" "}
                        <span className="font-semibold text-gray-900 dark:text-white">{hospitalToToggle?.name}</span>؟
                    </div>
                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                toggleModal.closeModal();
                                setHospitalToToggle(null);
                            }}
                            className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                        >
                            إلغاء
                        </button>
                        <button
                            type="button"
                            onClick={confirmToggle}
                            className={`px-4 py-2.5 rounded-lg text-white transition-colors font-medium ${
                                hospitalToToggle?.isActive
                                    ? "bg-orange-600 hover:bg-orange-700"
                                    : "bg-success-600 hover:bg-success-700"
                            }`}
                        >
                            {hospitalToToggle?.isActive ? "تعطيل" : "تفعيل"}
                        </button>
                    </div>
                </div>
            </Modal>

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
                            <h1 style={{ display: "none" }}>تقرير منشأة: {selectedHospital.hospitalName}</h1>
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400 w-40">اسم المنشأة</td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">{selectedHospital.hospitalName}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">النوع</td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white">{facilityTypeLabels[selectedHospital.facilityType]}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">المدينة</td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white">{selectedHospital.city}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">البلد</td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white">{selectedHospital.country}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">البريد الإلكتروني</td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white">{selectedHospital.email}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">حالة التفعيل</td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedHospital.isActive)}`}>
                                                {selectedHospital.isActive ? "مفعل" : "قيد المراجعة"}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">تاريخ الانضمام</td>
                                        <td className="py-3 px-4 text-gray-900 dark:text-white">{formatDate(selectedHospital.createdAt)}</td>
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
