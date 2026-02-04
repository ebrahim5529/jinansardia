"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusIcon, EyeIcon, TrashBinIcon, PencilIcon, DocsIcon } from "@/icons";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";

const dummyHospitals = [
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
    const deleteModal = useModal();
    const successModal = useModal();
    const [successMessage, setSuccessMessage] = useState("");

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
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors" title="عرض التفاصيل">
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
        </div>
    );
}
