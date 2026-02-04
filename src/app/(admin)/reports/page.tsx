"use client";

import { useState } from "react";
import { PageIcon, DownloadIcon } from "@/icons";

interface ReportData {
    period: string;
    totalOrders: number;
    totalRevenue: number;
    activeFactories: number;
    activeHospitals: number;
    newUsers: number;
    completedOrders: number;
    pendingOrders: number;
}

export default function ReportsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState("month");
    const [selectedReport, setSelectedReport] = useState("overview");

    // Mock data
    const reportData: ReportData = {
        period: "يناير 2026",
        totalOrders: 1245,
        totalRevenue: 2450000,
        activeFactories: 45,
        activeHospitals: 32,
        newUsers: 28,
        completedOrders: 1180,
        pendingOrders: 65
    };

    const monthlyData = [
        { month: "يناير", orders: 1245, revenue: 2450000 },
        { month: "فبراير", orders: 1320, revenue: 2600000 },
        { month: "مارس", orders: 1180, revenue: 2300000 },
        { month: "أبريل", orders: 1450, revenue: 2800000 },
        { month: "مايو", orders: 1520, revenue: 2950000 },
        { month: "يونيو", orders: 1380, revenue: 2700000 },
    ];

    const topFactories = [
        { name: "مصنع الرياض للمستلزمات", orders: 320, revenue: 650000 },
        { name: "مصنع جدة للصناعات", orders: 285, revenue: 580000 },
        { name: "مصنع الشرقية", orders: 240, revenue: 490000 },
        { name: "مصنع القصيم", orders: 195, revenue: 380000 },
    ];

    const topHospitals = [
        { name: "مستشفى الملك فيصل", orders: 450, amount: 920000 },
        { name: "مستشفى دلة", orders: 320, amount: 680000 },
        { name: "مستشفى السعودي الألماني", orders: 280, amount: 560000 },
        { name: "مستشفى العيون", orders: 195, amount: 420000 },
    ];

    const handleExport = (format: "pdf" | "excel") => {
        console.log(`Exporting report as ${format}`);
        // API call here
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">التقارير والإحصائيات</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">عرض وتحليل بيانات النظام</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="week">آخر أسبوع</option>
                        <option value="month">آخر شهر</option>
                        <option value="quarter">آخر ربع سنة</option>
                        <option value="year">آخر سنة</option>
                    </select>
                    <button
                        onClick={() => handleExport("pdf")}
                        className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium flex items-center gap-2"
                    >
                        <DownloadIcon className="w-5 h-5" />
                        <span>تصدير PDF</span>
                    </button>
                    <button
                        onClick={() => handleExport("excel")}
                        className="px-4 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-medium flex items-center gap-2"
                    >
                        <DownloadIcon className="w-5 h-5" />
                        <span>تصدير Excel</span>
                    </button>
                </div>
            </div>

            {/* Report Type Tabs */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-1">
                <div className="flex gap-2">
                    {[
                        { id: "overview", label: "نظرة عامة" },
                        { id: "orders", label: "الطلبات" },
                        { id: "factories", label: "المصانع" },
                        { id: "hospitals", label: "المستشفيات" },
                        { id: "users", label: "المستخدمين" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setSelectedReport(tab.id)}
                            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                                selectedReport === tab.id
                                    ? "bg-brand-500 text-white"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Report */}
            {selectedReport === "overview" && (
                <div className="space-y-6">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">إجمالي الطلبات</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{reportData.totalOrders.toLocaleString()}</p>
                                    <p className="text-xs text-success-600 dark:text-success-400 mt-1">↑ 12% من الشهر الماضي</p>
                                </div>
                                <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center">
                                    <PageIcon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">إجمالي الإيرادات</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{reportData.totalRevenue.toLocaleString()} ر.س</p>
                                    <p className="text-xs text-success-600 dark:text-success-400 mt-1">↑ 8% من الشهر الماضي</p>
                                </div>
                                <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">المصانع النشطة</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{reportData.activeFactories}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">من أصل 50 مصنع</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">المستشفيات النشطة</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{reportData.activeHospitals}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">من أصل 40 مستشفى</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Monthly Orders Chart */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">الطلبات الشهرية</h3>
                            <div className="space-y-4">
                                {monthlyData.map((data, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">{data.month}</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">{data.orders} طلب</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                                            <div
                                                className="bg-brand-500 h-2 rounded-full"
                                                style={{ width: `${(data.orders / 1600) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Revenue Chart */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">الإيرادات الشهرية</h3>
                            <div className="space-y-4">
                                {monthlyData.map((data, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">{data.month}</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">{(data.revenue / 1000).toFixed(0)}K ر.س</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                                            <div
                                                className="bg-success-500 h-2 rounded-full"
                                                style={{ width: `${(data.revenue / 3000000) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Top Performers */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Factories */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">أفضل المصانع</h3>
                            <div className="space-y-4">
                                {topFactories.map((factory, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center font-bold text-brand-600 dark:text-brand-400">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{factory.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{factory.orders} طلب</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{factory.revenue.toLocaleString()} ر.س</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Hospitals */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">أفضل المستشفيات</h3>
                            <div className="space-y-4">
                                {topHospitals.map((hospital, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{hospital.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{hospital.orders} طلب</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{hospital.amount.toLocaleString()} ر.س</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Orders Report */}
            {selectedReport === "orders" && (
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">تقرير الطلبات</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400">الطلبات المكتملة</p>
                            <p className="text-2xl font-bold text-success-600 dark:text-success-400 mt-2">{reportData.completedOrders}</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400">الطلبات قيد الانتظار</p>
                            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-2">{reportData.pendingOrders}</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm text-gray-500 dark:text-gray-400">معدل الإتمام</p>
                            <p className="text-2xl font-bold text-brand-600 dark:text-brand-400 mt-2">
                                {((reportData.completedOrders / reportData.totalOrders) * 100).toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Other reports can be added here */}
        </div>
    );
}
