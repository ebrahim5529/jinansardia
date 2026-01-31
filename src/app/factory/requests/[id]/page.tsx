"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type OrderStatus = "new" | "inProgress" | "delivered" | "completed";

export default function OrderDetailsPage() {
    const params = useParams();
    const orderId = params.id as string;

    const [newNote, setNewNote] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("inProgress");

    // Mock order data
    const order = {
        id: orderId,
        hospital: {
            name: "مستشفى الملك فيصل",
            phone: "+966 11 234 5678",
            email: "procurement@kfh.sa",
            address: "طريق الملك فهد، الرياض 11564"
        },
        product: "قفازات طبية",
        quantity: 5000,
        price: 250,
        total: 1250000,
        contractDuration: "6 أشهر",
        orderDate: "2026-01-30",
        expectedDelivery: "2026-02-15",
        status: "inProgress" as OrderStatus,
        notes: [
            { id: 1, author: "أحمد محمد", text: "تم استلام الطلب وجاري التحضير", date: "2026-01-30 10:30" },
            { id: 2, author: "سارة علي", text: "تم البدء في التصنيع", date: "2026-01-31 14:20" }
        ],
        timeline: [
            { status: "new", date: "2026-01-30 10:15", description: "تم استلام الطلب" },
            { status: "inProgress", date: "2026-01-31 14:20", description: "بدء التنفيذ" }
        ]
    };

    const getStatusText = (status: OrderStatus) => {
        const statusMap = {
            new: "جديد",
            inProgress: "قيد التنفيذ",
            delivered: "تم التسليم للمخزن",
            completed: "مكتمل"
        };
        return statusMap[status];
    };


    const getStatusColor = (status: OrderStatus) => {
        const colorMap = {
            new: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
            inProgress: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
            delivered: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
            completed: "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400"
        };
        return colorMap[status];
    };


    const handleUpdateStatus = () => {
        console.log("Update status to:", selectedStatus);
        // API call here
    };

    const handleAddNote = () => {
        if (!newNote.trim()) return;
        console.log("Add note:", newNote);
        setNewNote("");
        // API call here
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <Link href="/factory/requests" className="hover:text-brand-500">
                            الطلبات
                        </Link>
                        <span>/</span>
                        <span>تفاصيل الطلب</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        الطلب #{order.id}
                    </h1>
                </div>
                <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Information */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            معلومات الطلب
                        </h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">رقم الطلب</p>
                                <p className="font-medium text-gray-900 dark:text-white">{order.id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">تاريخ الطلب</p>
                                <p className="font-medium text-gray-900 dark:text-white">{order.orderDate}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">مدة التعاقد</p>
                                <p className="font-medium text-gray-900 dark:text-white">{order.contractDuration}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">التسليم المتوقع</p>
                                <p className="font-medium text-gray-900 dark:text-white">{order.expectedDelivery}</p>
                            </div>
                        </div>
                    </div>

                    {/* Hospital Information */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            معلومات المستشفى
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">اسم المستشفى</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{order.hospital.name}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">رقم الهاتف</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{order.hospital.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">البريد الإلكتروني</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{order.hospital.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">العنوان</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{order.hospital.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                تفاصيل المنتجات
                            </h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800/50 border-y border-gray-200 dark:border-gray-800">
                                    <tr>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">المنتج</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">الكمية</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">السعر</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">الإجمالي</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-gray-200 dark:border-gray-800">
                                        <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{order.product}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{order.quantity.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{order.price.toLocaleString()} ريال</td>
                                        <td className="px-6 py-4 text-gray-900 dark:text-white font-bold">{order.total.toLocaleString()} ريال</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-gray-900 dark:text-white">المجموع الكلي</span>
                                <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">{order.total.toLocaleString()} ريال</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            ملاحظات الطلب
                        </h2>

                        {/* Existing Notes */}
                        <div className="space-y-4 mb-6">
                            {order.notes.map((note) => (
                                <div key={note.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-gray-900 dark:text-white">{note.author}</span>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{note.date}</span>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300">{note.text}</p>
                                </div>
                            ))}
                        </div>

                        {/* Add Note */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                إضافة ملاحظة جديدة
                            </label>
                            <textarea
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none mb-3"
                                placeholder="اكتب ملاحظة..."
                            />
                            <button
                                onClick={handleAddNote}
                                className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-sm font-medium"
                            >
                                إضافة ملاحظة
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Update Status */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            تحديث الحالة
                        </h2>
                        <div className="space-y-4">
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="new">جديد</option>
                                <option value="inProgress">قيد التنفيذ</option>
                                <option value="delivered">تم التسليم للمخزن</option>
                                <option value="completed">مكتمل</option>
                            </select>
                            <button
                                onClick={handleUpdateStatus}
                                className="w-full px-4 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-medium"
                            >
                                تحديث الحالة
                            </button>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                            سجل التغييرات
                        </h2>
                        <div className="space-y-4">
                            {order.timeline.map((event, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-3 h-3 rounded-full ${index === order.timeline.length - 1 ? 'bg-brand-500' : 'bg-gray-300 dark:bg-gray-700'}`} />
                                        {index < order.timeline.length - 1 && (
                                            <div className="w-0.5 h-12 bg-gray-200 dark:bg-gray-800" />
                                        )}
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <p className="font-medium text-gray-900 dark:text-white mb-1">
                                            {event.description}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {event.date}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
