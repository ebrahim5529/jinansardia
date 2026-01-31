"use client";

import { useState } from "react";
import Link from "next/link";

type OrderStatus = "new" | "inProgress" | "delivered" | "completed";

interface Order {
    id: string;
    hospital: string;
    product: string;
    quantity: number;
    contractDuration: string;
    orderDate: string;
    status: OrderStatus;
}

export default function OrdersPage() {
    const [activeTab, setActiveTab] = useState<"all" | OrderStatus>("all");

    // Mock data
    const orders: Order[] = [
        { id: "ORD-001", hospital: "مستشفى الملك فيصل", product: "قفازات طبية", quantity: 5000, contractDuration: "6 أشهر", orderDate: "2026-01-30", status: "new" },
        { id: "ORD-002", hospital: "مستشفى الحرس الوطني", product: "كمامات N95", quantity: 10000, contractDuration: "12 شهر", orderDate: "2026-01-29", status: "inProgress" },
        { id: "ORD-003", hospital: "مستشفى المملكة", product: "معقمات يد", quantity: 2000, contractDuration: "3 أشهر", orderDate: "2026-01-28", status: "delivered" },
        { id: "ORD-004", hospital: "مستشفى الدمام المركزي", product: "أسرة طبية", quantity: 50, contractDuration: "12 شهر", orderDate: "2026-01-27", status: "inProgress" },
        { id: "ORD-005", hospital: "مستشفى الأمير سلطان", product: "شاش طبي", quantity: 8000, contractDuration: "6 أشهر", orderDate: "2026-01-26", status: "completed" },
        { id: "ORD-006", hospital: "مستشفى الأحساء العام", product: "محاقن طبية", quantity: 15000, contractDuration: "9 أشهر", orderDate: "2026-01-25", status: "new" },
        { id: "ORD-007", hospital: "مستشفى القصيم المركزي", product: "أدوات جراحية", quantity: 200, contractDuration: "12 شهر", orderDate: "2026-01-24", status: "inProgress" },
        { id: "ORD-008", hospital: "مستشفى جدة الوطني", product: "كراسي متحركة", quantity: 30, contractDuration: "6 أشهر", orderDate: "2026-01-23", status: "completed" },
    ];

    const filteredOrders = orders.filter(order => {
        if (activeTab === "all") return true;
        return order.status === activeTab;
    });

    const stats = {
        all: orders.length,
        new: orders.filter(o => o.status === "new").length,
        inProgress: orders.filter(o => o.status === "inProgress").length,
        delivered: orders.filter(o => o.status === "delivered").length,
        completed: orders.filter(o => o.status === "completed").length,
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

    const getStatusDotColor = (status: OrderStatus) => {
        const colorMap = {
            new: "bg-blue-500",
            inProgress: "bg-orange-500",
            delivered: "bg-purple-500",
            completed: "bg-success-500"
        };
        return colorMap[status];
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    إدارة الطلبات
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    متابعة طلبات المستشفيات وحالة التنفيذ
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            إجمالي الطلبات
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stats.all}
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            جديد
                        </p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {stats.new}
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            قيد التنفيذ
                        </p>
                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {stats.inProgress}
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            تم التسليم
                        </p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {stats.delivered}
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            مكتمل
                        </p>
                        <p className="text-2xl font-bold text-success-600 dark:text-success-400">
                            {stats.completed}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
                <button
                    onClick={() => setActiveTab("all")}
                    className={`px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === "all"
                        ? "border-brand-500 text-brand-600 dark:text-brand-400"
                        : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                >
                    الكل ({stats.all})
                </button>
                <button
                    onClick={() => setActiveTab("new")}
                    className={`px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === "new"
                        ? "border-brand-500 text-brand-600 dark:text-brand-400"
                        : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                >
                    جديد ({stats.new})
                </button>
                <button
                    onClick={() => setActiveTab("inProgress")}
                    className={`px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === "inProgress"
                        ? "border-brand-500 text-brand-600 dark:text-brand-400"
                        : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                >
                    قيد التنفيذ ({stats.inProgress})
                </button>
                <button
                    onClick={() => setActiveTab("delivered")}
                    className={`px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === "delivered"
                        ? "border-brand-500 text-brand-600 dark:text-brand-400"
                        : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                >
                    تم التسليم ({stats.delivered})
                </button>
                <button
                    onClick={() => setActiveTab("completed")}
                    className={`px-6 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === "completed"
                        ? "border-brand-500 text-brand-600 dark:text-brand-400"
                        : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                >
                    مكتمل ({stats.completed})
                </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                {filteredOrders.length === 0 ? (
                    <div className="py-12 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">لا توجد طلبات</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {activeTab === "all" ? "لا توجد طلبات حالياً" : `لا توجد طلبات بحالة "${getStatusText(activeTab as OrderStatus)}"`}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="block lg:hidden p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                                                        {order.id}
                                                    </span>
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                        <span className={`h-2 w-2 rounded-full ${getStatusDotColor(order.status)}`} />
                                                        {getStatusText(order.status)}
                                                    </span>
                                                </div>
                                                <div className="mt-2 text-base font-bold text-gray-900 dark:text-white truncate">
                                                    {order.product}
                                                </div>
                                                <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                        <span className="truncate">{order.hospital}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span>{order.orderDate}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                            <div className="rounded-xl bg-gray-50 dark:bg-gray-800/40 p-3">
                                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 11h16M4 15h16M4 19h16" />
                                                    </svg>
                                                    <span>الكمية</span>
                                                </div>
                                                <div className="mt-1 font-semibold text-gray-900 dark:text-white">
                                                    {order.quantity.toLocaleString()}
                                                </div>
                                            </div>
                                            <div className="rounded-xl bg-gray-50 dark:bg-gray-800/40 p-3">
                                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M5 11h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <span>مدة التعاقد</span>
                                                </div>
                                                <div className="mt-1 font-semibold text-gray-900 dark:text-white">
                                                    {order.contractDuration}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <Link
                                                href={`/factory/requests/${order.id}`}
                                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors shadow-sm"
                                            >
                                                عرض التفاصيل
                                                <span className="text-base">←</span>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                                    <tr>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            رقم الطلب
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            المستشفى
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            المنتج
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            الكمية
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            مدة التعاقد
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            تاريخ الطلب
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            الحالة
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                            الإجراءات
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                                                    {order.id}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {order.hospital}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {order.product}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {order.quantity.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {order.contractDuration}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                {order.orderDate}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                                    <span className={`h-2 w-2 rounded-full ${getStatusDotColor(order.status)}`} />
                                                    {getStatusText(order.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link
                                                    href={`/factory/requests/${order.id}`}
                                                    className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 text-sm font-medium"
                                                >
                                                    عرض التفاصيل →
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
