"use client";

import { useState, useEffect } from "react";
import BarChartOne from "@/components/charts/bar/BarChartOne";
import LineChartOne from "@/components/charts/line/LineChartOne";
import PieChartOne from "@/components/charts/pie/PieChartOne";
import AreaChartOne from "@/components/charts/area/AreaChartOne";
import MixedChartOne from "@/components/charts/mixed/MixedChartOne";

export default function FactoryDashboard() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Mock data - في المستقبل ستأتي من API
    const stats = {
        totalProducts: 245,
        activeOffers: 12,
        newOrders: 8,
        inProgressOrders: 15,
        completedOrders: 127
    };

    const recentOrders = [
        { id: "ORD-001", hospital: "مستشفى الملك فيصل", product: "قفازات طبية", quantity: 5000, status: "جديد", orderDate: "2026-01-30" },
        { id: "ORD-002", hospital: "مستشفى الحرس الوطني", product: "كمامات N95", quantity: 10000, status: "قيد التنفيذ", orderDate: "2026-01-29" },
        { id: "ORD-003", hospital: "مستشفى المملكة", product: "معقمات يد", quantity: 2000, status: "تم التسليم للمخزن", orderDate: "2026-01-28" },
        { id: "ORD-004", hospital: "مستشفى الدمام المركزي", product: "أسرة طبية", quantity: 50, status: "قيد التنفيذ", orderDate: "2026-01-27" },
        { id: "ORD-005", hospital: "مستشفى الأمير سلطان", product: "شاش طبي", quantity: 8000, status: "مكتمل", orderDate: "2026-01-26" }
    ];

    const formatNumber = (num: number) => {
        if (!isMounted) return num.toLocaleString('en-US');
        return num.toLocaleString();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "جديد": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
            case "قيد التنفيذ": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
            case "تم التسليم للمخزن": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
            case "مكتمل": return "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400";
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
        }
    };

    if (!isMounted) {
        return (
            <div className="p-6 space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    لوحة تحكم المصنع
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    نظرة عامة على نشاط المصنع والطلبات
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Total Products */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                إجمالي المنتجات
                            </p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {stats.totalProducts}
                            </p>
                        </div>
                        <div className="bg-brand-100 dark:bg-brand-900/30 p-3 rounded-lg">
                            <svg className="w-8 h-8 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Active Offers */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                العروض النشطة
                            </p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {stats.activeOffers}
                            </p>
                        </div>
                        <div className="bg-success-100 dark:bg-success-900/30 p-3 rounded-lg">
                            <svg className="w-8 h-8 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* New Orders */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                طلبات جديدة
                            </p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {stats.newOrders}
                            </p>
                        </div>
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* In Progress Orders */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                قيد التنفيذ
                            </p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {stats.inProgressOrders}
                            </p>
                        </div>
                        <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
                            <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Completed Orders */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                طلبات مكتملة
                            </p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {stats.completedOrders}
                            </p>
                        </div>
                        <div className="bg-success-100 dark:bg-success-900/30 p-3 rounded-lg">
                            <svg className="w-8 h-8 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Chart */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            المبيعات الشهرية
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            إجمالي المبيعات خلال الأشهر الستة الماضية
                        </p>
                    </div>
                    <BarChartOne />
                </div>

                {/* Orders Trend Chart */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            اتجاه الطلبات
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            عدد الطلبات الجديدة والمكتملة
                        </p>
                    </div>
                    <LineChartOne />
                </div>
            </div>

            {/* Additional Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product Distribution Pie Chart */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            توزيع المنتجات
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            حسب الفئات والحالة
                        </p>
                    </div>
                    <PieChartOne />
                </div>

                {/* Revenue vs Costs Area Chart */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 lg:col-span-2">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            الإيرادات والتكاليف
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            مقارنة شهرية بين الإيرادات والتكاليف
                        </p>
                    </div>
                    <AreaChartOne />
                </div>
            </div>

            {/* Production Analysis */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        تحليل الإنتاج
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        الإنتاج الشهري ومعدل النمو السنوي
                    </p>
                </div>
                <MixedChartOne />
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                آخر الطلبات
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                آخر 5 طلبات واردة من المستشفيات
                            </p>
                        </div>
                        <a
                            href="/factory/requests"
                            className="px-4 py-2 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                        >
                            عرض الكل ←
                        </a>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    رقم الطلب
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    اسم المستشفى
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    المنتج
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    الكمية
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    الحالة
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    تاريخ الطلب
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                                            {order.id}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900 dark:text-white">
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
                                            {formatNumber(order.quantity)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                        {order.orderDate}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
