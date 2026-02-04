"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusIcon, TrashBinIcon, PencilIcon, UserIcon, LockIcon } from "@/icons";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";

const dummyUsers = [
    { id: 501, name: "أحمد محمد", email: "ahmed@admin.com", role: "Super Admin", status: "نشط", lastLogin: "منذ دقيقة" },
    { id: 502, name: "سارة خالد", email: "sara@factory.com", role: "Factory Manager", status: "نشط", lastLogin: "منذ ساعتين" },
    { id: 503, name: "مستشفى الأمل", email: "info@alamal.com", role: "Hospital Admin", status: "نشط", lastLogin: "أمس" },
    { id: 504, name: "موظف مخزن", email: "store@system.com", role: "Warehouse Staff", status: "غير نشط", lastLogin: "منذ أسبوع" },
];

export default function UsersPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [userToDelete, setUserToDelete] = useState<{ id: number; name: string } | null>(null);
    const deleteModal = useModal();
    const successModal = useModal();
    const [successMessage, setSuccessMessage] = useState("");

    const filteredUsers = dummyUsers.filter(u =>
        u.name.includes(searchTerm) || u.email.includes(searchTerm)
    );

    const handleDelete = (id: number, name: string) => {
        setUserToDelete({ id, name });
        deleteModal.openModal();
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        try {
            // API call here
            console.log("Deleting user:", userToDelete.id);
            setSuccessMessage(`تم حذف المستخدم "${userToDelete.name}" بنجاح`);
            deleteModal.closeModal();
            successModal.openModal();
            setUserToDelete(null);
        } catch (error) {
            console.error("Error deleting user:", error);
            deleteModal.closeModal();
            setUserToDelete(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "نشط": return "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400";
            case "غير نشط": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">المستخدمين والصلاحيات</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">إدارة حسابات المسؤولين والموظفين والوصول للنظام.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/users/permissions"
                        className="px-4 py-2.5 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium flex items-center gap-2"
                    >
                        <LockIcon className="w-5 h-5" />
                        <span>الصلاحيات والأدوار</span>
                    </Link>
                    <Link
                        href="/users/add"
                        className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-brand-500/30"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>إضافة مستخدم</span>
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <input
                    type="text"
                    placeholder="بحث بالاسم أو البريد الإلكتروني..."
                    className="w-full md:w-96 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">المستخدم</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">البريد الإلكتروني</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">الدور (Role)</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">الحالة</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">آخر دخول</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                            <UserIcon className="w-4 h-4" />
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'Super Admin' ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400" :
                                                user.role === 'Factory Manager' ? "bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400" :
                                                    "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">{user.lastLogin}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link
                                                href={`/users/edit/${user.id}`}
                                                className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                                                title="تعديل"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                            </Link>
                                            <button className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors" title="إعادة تعيين كلمة المرور">
                                                <LockIcon className="w-4 h-4" />
                                            </button>
                                            {user.role !== 'Super Admin' && (
                                                <button
                                                    onClick={() => handleDelete(user.id, user.name)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="حذف"
                                                >
                                                    <TrashBinIcon className="w-4 h-4" />
                                                </button>
                                            )}
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
                    setUserToDelete(null);
                }}
                className="max-w-[520px] p-5 lg:p-8"
            >
                <div className="space-y-4">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">تأكيد الحذف</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        هل أنت متأكد من حذف المستخدم <span className="font-semibold text-gray-900 dark:text-white">{userToDelete?.name}</span>؟
                        <br />
                        <span className="text-error-500 mt-2 block">لا يمكن التراجع عن هذا الإجراء.</span>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                deleteModal.closeModal();
                                setUserToDelete(null);
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
