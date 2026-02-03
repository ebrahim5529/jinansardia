"use client";

import { useState } from "react";
import { PlusIcon, EyeIcon, TrashBinIcon, PencilIcon, DocsIcon } from "@/icons";
import StatusBadge from "@/components/admin/StatusBadge";
import clsx from "clsx";

const dummyHospitals = [
    { id: 101, name: "مستشفى الملك فيصل التخصصي", type: "حكومي", city: "الرياض", status: "active", orders: 450, date: "2022-11-10" },
    { id: 102, name: "مستشفى دلة", type: "خاص", city: "الرياض", status: "active", orders: 210, date: "2023-03-15" },
    { id: 103, name: "مستشفى السعودي الألماني", type: "خاص", city: "جدة", status: "pending", orders: 0, date: "2023-11-01" },
    { id: 104, name: "مستشفى العيون", type: "حكومي", city: "الظهران", status: "inactive", orders: 32, date: "2023-06-20" },
    { id: 105, name: "مجمع عيادات النور", type: "عيادات", city: "مكة المكرمة", status: "active", orders: 15, date: "2023-09-05" },
];

export default function HospitalsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("");

    const filteredHospitals = dummyHospitals.filter(h => 
        (h.name.includes(searchTerm) || h.city.includes(searchTerm)) &&
        (typeFilter === "" || h.type === typeFilter)
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">إدارة المستشفيات</h2>
                    <p className="text-slate-500 text-sm">متابعة حسابات المستشفيات والمنشآت الطبية.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/30">
                    <PlusIcon className="w-5 h-5" />
                    <span>تسجيل مستشفى</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
                <input 
                    type="text" 
                    placeholder="بحث باسم المستشفى أو المدينة..." 
                    className="flex-1 min-w-[200px] bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                    className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                >
                    <option value="">جميع الأنواع</option>
                    <option value="حكومي">حكومي</option>
                    <option value="خاص">خاص</option>
                    <option value="عيادات">عيادات</option>
                </select>
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
                            <th className="px-6 py-4">اسم المنشأة</th>
                            <th className="px-6 py-4">النوع</th>
                            <th className="px-6 py-4">المدينة</th>
                            <th className="px-6 py-4">الحالة</th>
                            <th className="px-6 py-4">إجمالي الطلبات</th>
                            <th className="px-6 py-4">تاريخ الانضمام</th>
                            <th className="px-6 py-4 text-center">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                        {filteredHospitals.map((hospital) => (
                            <tr key={hospital.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">#{hospital.id}</td>
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <div className={clsx(
                                        "w-10 h-10 rounded-lg flex items-center justify-center font-bold",
                                        hospital.type === 'حكومي' ? "bg-emerald-100 text-emerald-600" : "bg-purple-100 text-purple-600"
                                    )}>
                                        {hospital.name.charAt(0)}
                                    </div>
                                    <span className="font-medium">{hospital.name}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{hospital.type}</span>
                                </td>
                                <td className="px-6 py-4">{hospital.city}</td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={hospital.status} />
                                </td>
                                <td className="px-6 py-4 font-semibold">{hospital.orders}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{hospital.date}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="عرض التفاصيل">
                                            <EyeIcon className="w-5 h-5" />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="تعديل">
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                        <button className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="التراخيص">
                                            <DocsIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredHospitals.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        لا توجد مستشفيات مطابقة للبحث.
                    </div>
                )}
            </div>
        </div>
    );
}
