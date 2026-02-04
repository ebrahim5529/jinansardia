"use client";

import { useState, useEffect } from "react";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";
import { TrashBinIcon, EyeIcon } from "@/icons";

interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export default function ContactsPage() {
    const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const viewModal = useModal();
    const deleteModal = useModal();

    useEffect(() => {
        loadSubmissions();
    }, [statusFilter, currentPage]);

    const loadSubmissions = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                status: statusFilter,
                page: currentPage.toString(),
                limit: "20",
            });

            const response = await fetch(`/api/admin/contact-submissions?${params}`);
            const data = await response.json();

            if (response.ok) {
                setSubmissions(data.submissions || []);
                setTotalPages(data.pagination?.totalPages || 1);
                console.log(`Loaded ${data.submissions?.length || 0} submissions`);
            } else {
                const errorMsg = data.error || "Unknown error";
                console.error("Error loading submissions:", errorMsg, data);
                // Show error to user
                if (data.error) {
                    alert(`خطأ في تحميل البيانات: ${data.error}`);
                }
            }
        } catch (error) {
            console.error("Error loading submissions:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const response = await fetch("/api/admin/contact-submissions", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus }),
            });

            if (response.ok) {
                loadSubmissions();
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDelete = async () => {
        if (!selectedSubmission) return;

        try {
            const response = await fetch(
                `/api/admin/contact-submissions?id=${selectedSubmission.id}`,
                { method: "DELETE" }
            );

            if (response.ok) {
                deleteModal.closeModal();
                setSelectedSubmission(null);
                loadSubmissions();
            }
        } catch (error) {
            console.error("Error deleting submission:", error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "read":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
            case "replied":
                return "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400";
            case "archived":
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "pending":
                return "قيد الانتظار";
            case "read":
                return "مقروء";
            case "replied":
                return "تم الرد";
            case "archived":
                return "مؤرشف";
            default:
                return status;
        }
    };

    const filteredSubmissions = submissions.filter(
        (submission) =>
            submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            submission.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    طلبات الاتصال
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    عرض وإدارة طلبات الاتصال من صفحة الموقع
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex flex-wrap items-center gap-4">
                    <input
                        type="text"
                        placeholder="بحث بالاسم، البريد، أو الموضوع..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 min-w-[200px] px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="all">جميع الحالات</option>
                        <option value="pending">قيد الانتظار</option>
                        <option value="read">مقروء</option>
                        <option value="replied">تم الرد</option>
                        <option value="archived">مؤرشف</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">جاري التحميل...</p>
                </div>
            ) : filteredSubmissions.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-12 text-center">
                    <p className="text-gray-600 dark:text-gray-400">لا توجد طلبات اتصال</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-gray-50 dark:bg-gray-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        الاسم
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        البريد الإلكتروني
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        الموضوع
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        الحالة
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        التاريخ
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        إجراءات
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {filteredSubmissions.map((submission) => (
                                    <tr
                                        key={submission.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {submission.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {submission.email}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {submission.subject}
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={submission.status}
                                                onChange={(e) =>
                                                    handleStatusChange(submission.id, e.target.value)
                                                }
                                                className={`px-3 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(
                                                    submission.status
                                                )}`}
                                            >
                                                <option value="pending">قيد الانتظار</option>
                                                <option value="read">مقروء</option>
                                                <option value="replied">تم الرد</option>
                                                <option value="archived">مؤرشف</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(submission.createdAt).toLocaleDateString("ar-SA")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedSubmission(submission);
                                                        viewModal.openModal();
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                                                    title="عرض التفاصيل"
                                                >
                                                    <EyeIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedSubmission(submission);
                                                        deleteModal.openModal();
                                                    }}
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

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                الصفحة {currentPage} من {totalPages}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    السابق
                                </button>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    التالي
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* View Modal */}
            <Modal
                isOpen={viewModal.isOpen}
                onClose={viewModal.closeModal}
                className="max-w-2xl p-5 lg:p-8"
            >
                {selectedSubmission && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            تفاصيل طلب الاتصال
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    الاسم
                                </label>
                                <p className="text-gray-900 dark:text-white mt-1">
                                    {selectedSubmission.name}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    البريد الإلكتروني
                                </label>
                                <p className="text-gray-900 dark:text-white mt-1">
                                    <a
                                        href={`mailto:${selectedSubmission.email}`}
                                        className="text-brand-500 hover:underline"
                                    >
                                        {selectedSubmission.email}
                                    </a>
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    الموضوع
                                </label>
                                <p className="text-gray-900 dark:text-white mt-1">
                                    {selectedSubmission.subject}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    الرسالة
                                </label>
                                <p className="text-gray-900 dark:text-white mt-1 whitespace-pre-wrap">
                                    {selectedSubmission.message}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        الحالة
                                    </label>
                                    <select
                                        value={selectedSubmission.status}
                                        onChange={(e) => {
                                            handleStatusChange(selectedSubmission.id, e.target.value);
                                            setSelectedSubmission({
                                                ...selectedSubmission,
                                                status: e.target.value,
                                            });
                                        }}
                                        className={`mt-1 w-full px-3 py-2 rounded-lg text-sm font-medium ${getStatusColor(
                                            selectedSubmission.status
                                        )}`}
                                    >
                                        <option value="pending">قيد الانتظار</option>
                                        <option value="read">مقروء</option>
                                        <option value="replied">تم الرد</option>
                                        <option value="archived">مؤرشف</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        التاريخ
                                    </label>
                                    <p className="text-gray-900 dark:text-white mt-1 text-sm">
                                        {new Date(selectedSubmission.createdAt).toLocaleString("ar-SA")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                            <a
                                href={`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject}`}
                                className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-medium"
                            >
                                الرد عبر البريد
                            </a>
                            <button
                                onClick={viewModal.closeModal}
                                className="px-4 py-2 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => {
                    deleteModal.closeModal();
                    setSelectedSubmission(null);
                }}
                className="max-w-[520px] p-5 lg:p-8"
            >
                <div className="space-y-4">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">تأكيد الحذف</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        هل أنت متأكد من حذف طلب الاتصال من <span className="font-semibold text-gray-900 dark:text-white">{selectedSubmission?.name}</span>؟
                        <br />
                        <span className="text-error-500 mt-2 block">لا يمكن التراجع عن هذا الإجراء.</span>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                deleteModal.closeModal();
                                setSelectedSubmission(null);
                            }}
                            className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                        >
                            إلغاء
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="px-4 py-2.5 rounded-lg bg-error-600 text-white hover:bg-error-700 transition-colors font-medium"
                        >
                            حذف
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
