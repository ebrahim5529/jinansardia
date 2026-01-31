"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PageHeader, StatCard, StatusBadge } from "@/components/shared";
import { t, type Locale } from "@/locales/i18n";
import BarChartOne from "@/components/charts/bar/BarChartOne";
import LineChartOne from "@/components/charts/line/LineChartOne";
import PieChartOne from "@/components/charts/pie/PieChartOne";
import AreaChartOne from "@/components/charts/area/AreaChartOne";
import MixedChartOne from "@/components/charts/mixed/MixedChartOne";

function getCookie(name: string) {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
}

type OrderStatus = "new" | "inProgress" | "completed" | "warehouse";

function statusVariant(status: OrderStatus): "info" | "warning" | "success" | "purple" {
    switch (status) {
        case "new":
            return "info";
        case "inProgress":
            return "warning";
        case "warehouse":
            return "purple";
        case "completed":
            return "success";
    }
}

export default function HospitalDashboard() {
    const [locale, setLocale] = useState<Locale>("ar");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const currentLocale = getCookie("NEXT_LOCALE") as Locale;
        if (currentLocale === "en" || currentLocale === "ar") {
            setLocale(currentLocale);
        }
    }, []);

    const formatNumber = (num: number) => {
        if (!isMounted) return num.toLocaleString('en-US');
        return num.toLocaleString();
    };

    const stats = useMemo(
        () => ({
            activeOrders: 12,
            inProgressOrders: 6,
            completedOrders: 28,
            availableWarehouseQty: 1450,
            totalContracts: 9,
        }),
        []
    );

    const recentOrders = useMemo(
        () =>
            [
                {
                    id: "ORD-1042",
                    factoryName: locale === "ar" ? "مصنع الشفاء" : "Al-Shifa Factory",
                    product: locale === "ar" ? "كمامات N95" : "N95 Masks",
                    quantity: 5000,
                    status: "inProgress" as const,
                    orderDate: "2026-01-29",
                },
                {
                    id: "ORD-1041",
                    factoryName: locale === "ar" ? "مصنع النور" : "Al-Noor Factory",
                    product: locale === "ar" ? "قفازات طبية" : "Medical Gloves",
                    quantity: 12000,
                    status: "warehouse" as const,
                    orderDate: "2026-01-28",
                },
                {
                    id: "ORD-1039",
                    factoryName: locale === "ar" ? "مصنع الحياة" : "Al-Hayat Factory",
                    product: locale === "ar" ? "معقمات يد" : "Hand Sanitizer",
                    quantity: 800,
                    status: "new" as const,
                    orderDate: "2026-01-27",
                },
                {
                    id: "ORD-1038",
                    factoryName: locale === "ar" ? "مصنع السلام" : "Al-Salam Factory",
                    product: locale === "ar" ? "شاش طبي" : "Medical Gauze",
                    quantity: 3000,
                    status: "completed" as const,
                    orderDate: "2026-01-26",
                },
                {
                    id: "ORD-1036",
                    factoryName: locale === "ar" ? "مصنع المدينة" : "Al-Madina Factory",
                    product: locale === "ar" ? "محاقن طبية" : "Medical Syringes",
                    quantity: 15000,
                    status: "completed" as const,
                    orderDate: "2026-01-25",
                },
            ],
        [locale]
    );

    const statusText = (status: OrderStatus) => {
        if (status === "new") return t(locale, "hospital.orders.status.new");
        if (status === "inProgress") return t(locale, "hospital.orders.status.inProgress");
        if (status === "warehouse") return t(locale, "hospital.orders.status.warehouse");
        return t(locale, "hospital.orders.status.completed");
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
        <div className="space-y-6">
            <PageHeader
                title={t(locale, "hospital.dashboard.title")}
                description={t(locale, "hospital.dashboard.subtitle")}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
                <StatCard
                    title={t(locale, "hospital.dashboard.stats.activeOrders")}
                    value={stats.activeOrders}
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    }
                    iconBgColor="bg-brand-100 dark:bg-brand-900/30"
                    iconColor="text-brand-600 dark:text-brand-400"
                />
                <StatCard
                    title={t(locale, "hospital.dashboard.stats.inProgressOrders")}
                    value={stats.inProgressOrders}
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    iconBgColor="bg-orange-100 dark:bg-orange-900/30"
                    iconColor="text-orange-600 dark:text-orange-400"
                />
                <StatCard
                    title={t(locale, "hospital.dashboard.stats.completedOrders")}
                    value={stats.completedOrders}
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    iconBgColor="bg-success-100 dark:bg-success-900/30"
                    iconColor="text-success-600 dark:text-success-400"
                />
                <StatCard
                    title={t(locale, "hospital.dashboard.stats.availableWarehouse")}
                    value={stats.availableWarehouseQty}
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4" />
                        </svg>
                    }
                    iconBgColor="bg-purple-100 dark:bg-purple-900/30"
                    iconColor="text-purple-600 dark:text-purple-400"
                />
                <StatCard
                    title={t(locale, "hospital.dashboard.stats.totalContracts")}
                    value={stats.totalContracts}
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 9H7a2 2 0 01-2-2V5a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z" />
                        </svg>
                    }
                    iconBgColor="bg-blue-100 dark:bg-blue-900/30"
                    iconColor="text-blue-600 dark:text-blue-400"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Orders Chart */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            إحصائيات الطلبات
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            توزيع الطلبات حسب الحالة
                        </p>
                    </div>
                    <BarChartOne />
                </div>

                {/* Warehouse Inventory Chart */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            حركة المخزون
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            الوارد والصادر من المخزون
                        </p>
                    </div>
                    <LineChartOne />
                </div>
            </div>

            {/* Additional Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Department Distribution Pie Chart */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            توزيع الأقسام
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            حسب عدد الطلبات لكل قسم
                        </p>
                    </div>
                    <PieChartOne />
                </div>

                {/* Budget vs Actual Area Chart */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 lg:col-span-2">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            الميزانية مقابل الفعلي
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            مقارنة بين الميزانية المخططة والإنفاق الفعلي
                        </p>
                    </div>
                    <AreaChartOne />
                </div>
            </div>

            {/* Department Performance */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        أداء الأقسام
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        عدد الطلبات ومعدل الإنجاز لكل قسم
                    </p>
                </div>
                <MixedChartOne />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {t(locale, "hospital.dashboard.recentOrders.title")}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {t(locale, "hospital.dashboard.recentOrders.subtitle")}
                            </p>
                        </div>
                        <Link
                            href="/hospital/requests"
                            className="px-4 py-2 text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                        >
                            {t(locale, "hospital.dashboard.viewAll")} {locale === "ar" ? "←" : "→"}
                        </Link>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t(locale, "hospital.dashboard.table.orderId")}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t(locale, "hospital.dashboard.table.factory")}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t(locale, "hospital.dashboard.table.product")}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t(locale, "hospital.dashboard.table.quantity")}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t(locale, "hospital.dashboard.table.status")}
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t(locale, "hospital.dashboard.table.date")}
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
                                            {order.factoryName}
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
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {order.orderDate}
                                        </span>
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
