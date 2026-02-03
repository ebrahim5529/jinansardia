"use client";

import { useState } from "react";
import { PlusIcon, TrashBinIcon, PencilIcon, UserIcon, LockIcon } from "@/icons";
import StatusBadge from "@/components/admin/StatusBadge";
import clsx from "clsx";

const dummyUsers = [
    { id: 501, name: "أحمد محمد", email: "ahmed@admin.com", role: "Super Admin", status: "active", lastLogin: "منذ دقيقة" },
    { id: 502, name: "سارة خالد", email: "sara@factory.com", role: "Factory Manager", status: "active", lastLogin: "منذ ساعتين" },
    { id: 503, name: "مستشفى الأمل", email: "info@alamal.com", role: "Hospital Admin", status: "active", lastLogin: "أمس" },
    { id: 504, name: "موظف مخزن", email: "store@system.com", role: "Warehouse Staff", status: "inactive", lastLogin: "منذ أسبوع" },
];

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = dummyUsers.filter(u => 
        u.name.includes(searchTerm) || u.email.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">المستخدمين والصلاحيات</h2>
                    <p className="text-slate-500 text-sm">إدارة حسابات المسؤولين والموظفين والوصول للنظام.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/30">
                    <PlusIcon className="w-5 h-5" />
                    <span>إضافة مستخدم</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <input 
                    type="text" 
                    placeholder="بحث بالاسم أو البريد الإلكتروني..." 
                    className="w-full md:w-96 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

             {/* Table */}
             <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-right">
                    <thead className="bg-slate-50 text-slate-500 text-sm font-semibold">
                        <tr>
                            <th className="px-6 py-4">المستخدم</th>
                            <th className="px-6 py-4">البريد الإلكتروني</th>
                            <th className="px-6 py-4">الدور (Role)</th>
                            <th className="px-6 py-4">الحالة</th>
                            <th className="px-6 py-4">آخر دخول</th>
                            <th className="px-6 py-4 text-center">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                        <UserIcon className="w-4 h-4" />
                                     </div>
                                     <span className="font-medium">{user.name}</span>
                                </td>
                                <td className="px-6 py-4 font-mono text-sm text-slate-600">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={clsx(
                                        "px-2 py-1 rounded text-xs font-medium",
                                        user.role === 'Super Admin' ? "bg-purple-100 text-purple-700" :
                                        user.role === 'Factory Manager' ? "bg-blue-100 text-blue-700" : 
                                        "bg-slate-100 text-slate-600"
                                    )}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                     <StatusBadge status={user.status} />
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-400">{user.lastLogin}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="تعديل الصلاحيات">
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors" title="إعادة تعيين كلمة المرور">
                                            <LockIcon className="w-4 h-4" />
                                        </button>
                                        {user.role !== 'Super Admin' && (
                                            <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
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
    );
}
