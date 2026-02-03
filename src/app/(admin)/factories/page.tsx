"use client";

import { useState } from "react";
import { GridIcon, PlusIcon, MoreDotIcon, EyeIcon, TrashBinIcon, PencilIcon } from "@/icons";
import StatusBadge from "@/components/admin/StatusBadge";
import Link from "next/link";

const dummyFactories = [
    { id: 1, name: "مصنع الرياض للمنسوجات", city: "الرياض", status: "active", products: 45, orders: 120, date: "2023-01-15" },
    { id: 2, name: "مصنع جدة للصناعات الدوائية", city: "جدة", status: "active", products: 120, orders: 340, date: "2023-02-20" },
    { id: 3, name: "مصنع الشرقية للبلاستيك", city: "الدمام", status: "pending", products: 0, orders: 0, date: "2023-10-05" },
    { id: 4, name: "مصنع القصيم للتمور", city: "بريدة", status: "inactive", products: 12, orders: 5, date: "2023-05-12" },
    { id: 5, name: "مصنع تبوك للأسمنت", city: "تبوك", status: "banned", products: 8, orders: 1, date: "2023-08-01" },
];

export default function FactoriesPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredFactories = dummyFactories.filter(f =>
        f.name.includes(searchTerm) || f.city.includes(searchTerm)
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">إدارة المصانع</h2>
                    <p className="text-slate-500 text-sm">عرض والتحكم في حسابات المصانع المسجلة في النظام.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/30">
                    <PlusIcon className="w-5 h-5" />
                    <span>إضافة مصنع جديد</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                <input
                    type="text"
                    placeholder="بحث باسم المصنع أو المدينة..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">كل الحالات</option>
                    <option value="active">نشط</option>
                    <option value="pending">قيد المراجعة</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-right">
                    <thead className="bg-slate-50 text-slate-500 text-sm font-semibold">
                        <tr>
                            <th className="px-6 py-4">#</th>
                            <th className="px-6 py-4">اسم المصنع</th>
                            <th className="px-6 py-4">المدينة</th>
                            <th className="px-6 py-4">الحالة</th>
                            <th className="px-6 py-4">المنتجات / الطلبات</th>
                            <th className="px-6 py-4">تاريخ التسجيل</th>
                            <th className="px-6 py-4 text-center">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                        {filteredFactories.map((factory) => (
                            <tr key={factory.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">#{factory.id}</td>
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                        {factory.name.charAt(0)}
                                    </div>
                                    <span className="font-medium">{factory.name}</span>
                                </td>
                                <td className="px-6 py-4">{factory.city}</td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={factory.status} />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="flex items-center gap-1"><GridIcon className="w-4 h-4 text-slate-400" /> {factory.products}</span>
                                        <span className="flex items-center gap-1"><span className="w-1 h-1 bg-slate-300 rounded-full"></span> {factory.orders} طلب</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">{factory.date}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="عرض التفاصيل">
                                            <EyeIcon className="w-5 h-5" />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="تعديل">
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="إيقاف">
                                            <TrashBinIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredFactories.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        لا توجد مصانع مطابقة للبحث.
                    </div>
                )}
            </div>
        </div>
    );
}
