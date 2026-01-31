"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { EmptyState, PageHeader, SearchBar, StatCard, StatusBadge, Tabs } from "@/components/shared";
import { t, type Locale } from "@/locales/i18n";

function getCookie(name: string) {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
}

type OrderStatus = "new" | "inProgress" | "warehouse" | "completed";

type OrderRow = {
    id: string;
    factoryNameAr: string;
    factoryNameEn: string;
    productAr: string;
    productEn: string;
    quantity: number;
    status: OrderStatus;
    orderDate: string;
    updatedAt: string;
};

function statusVariant(status: OrderStatus): "info" | "warning" | "purple" | "success" {
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

export default function HospitalRequests() {
    const [locale, setLocale] = useState<Locale>("ar");

    useEffect(() => {
        const currentLocale = getCookie("NEXT_LOCALE") as Locale;
        if (currentLocale === "en" || currentLocale === "ar") {
            setLocale(currentLocale);
        }
    }, []);

    const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all");
    const [search, setSearch] = useState("");

    const orders = useMemo<OrderRow[]>(
        () => [
            {
                id: "ORD-1042",
                factoryNameAr: "مصنع الشفاء",
                factoryNameEn: "Al-Shifa Factory",
                productAr: "كمامات N95",
                productEn: "N95 Masks",
                quantity: 5000,
                status: "inProgress",
                orderDate: "2026-01-29",
                updatedAt: "2026-01-30",
            },
            {
                id: "ORD-1041",
                factoryNameAr: "مصنع النور",
                factoryNameEn: "Al-Noor Factory",
                productAr: "قفازات طبية",
                productEn: "Medical Gloves",
                quantity: 12000,
                status: "warehouse",
                orderDate: "2026-01-28",
                updatedAt: "2026-01-30",
            },
            {
                id: "ORD-1039",
                factoryNameAr: "مصنع الحياة",
                factoryNameEn: "Al-Hayat Factory",
                productAr: "معقمات يد",
                productEn: "Hand Sanitizer",
                quantity: 800,
                status: "new",
                orderDate: "2026-01-27",
                updatedAt: "2026-01-27",
            },
            {
                id: "ORD-1038",
                factoryNameAr: "مصنع السلام",
                factoryNameEn: "Al-Salam Factory",
                productAr: "شاش طبي",
                productEn: "Medical Gauze",
                quantity: 3000,
                status: "completed",
                orderDate: "2026-01-26",
                updatedAt: "2026-01-29",
            },
        ],
        []
    );

    const stats = useMemo(() => {
        const count = (s: OrderStatus) => orders.filter((o) => o.status === s).length;
        return {
            new: count("new"),
            inProgress: count("inProgress"),
            warehouse: count("warehouse"),
            all: orders.length,
        };
    }, [orders]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        const byTab = (o: OrderRow) => activeTab === "all" || o.status === activeTab;

        const bySearch = (o: OrderRow) => {
            if (!q) return true;
            const factory = (locale === "ar" ? o.factoryNameAr : o.factoryNameEn).toLowerCase();
            const product = (locale === "ar" ? o.productAr : o.productEn).toLowerCase();
            return o.id.toLowerCase().includes(q) || factory.includes(q) || product.includes(q);
        };

        return orders.filter((o) => byTab(o) && bySearch(o));
    }, [activeTab, locale, orders, search]);

    const statusText = (status: OrderStatus) => {
        if (status === "new") return t(locale, "hospital.orders.status.new");
        if (status === "inProgress") return t(locale, "hospital.orders.status.inProgress");
        if (status === "warehouse") return t(locale, "hospital.orders.status.warehouse");
        return t(locale, "hospital.orders.status.completed");
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title={t(locale, "hospital.requests.current.title")}
                description={t(locale, "hospital.requests.current.subtitle")}
                action={{
                    label: t(locale, "hospital.requests.current.create"),
                    onClick: () => {
                        window.location.href = "/hospital/requests/create";
                    },
                }}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    title={t(locale, "hospital.requests.stats.new")}
                    value={stats.new}
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    }
                    iconBgColor="bg-blue-100 dark:bg-blue-900/30"
                    iconColor="text-blue-600 dark:text-blue-400"
                />
                <StatCard
                    title={t(locale, "hospital.requests.stats.inProgress")}
                    value={stats.inProgress}
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    iconBgColor="bg-orange-100 dark:bg-orange-900/30"
                    iconColor="text-orange-600 dark:text-orange-400"
                />
                <StatCard
                    title={t(locale, "hospital.requests.stats.warehouse")}
                    value={stats.warehouse}
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4" />
                        </svg>
                    }
                    iconBgColor="bg-purple-100 dark:bg-purple-900/30"
                    iconColor="text-purple-600 dark:text-purple-400"
                />
                <StatCard
                    title={t(locale, "hospital.requests.stats.all")}
                    value={stats.all}
                    icon={
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                    }
                    iconBgColor="bg-brand-100 dark:bg-brand-900/30"
                    iconColor="text-brand-600 dark:text-brand-400"
                />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <SearchBar
                                value={search}
                                onChange={setSearch}
                                placeholder={t(locale, "hospital.requests.search.placeholder")}
                            />
                        </div>
                    </div>
                </div>

                <Tabs
                    tabs={[
                        { id: "all", label: t(locale, "hospital.requests.tabs.all"), count: stats.all },
                        { id: "new", label: t(locale, "hospital.orders.status.new"), count: stats.new },
                        { id: "inProgress", label: t(locale, "hospital.orders.status.inProgress"), count: stats.inProgress },
                        { id: "warehouse", label: t(locale, "hospital.orders.status.warehouse"), count: stats.warehouse },
                    ]}
                    activeTab={activeTab}
                    onChange={(tabId) => setActiveTab(tabId as any)}
                />

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t(locale, "hospital.requests.table.orderId")}
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t(locale, "hospital.requests.table.factory")}
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t(locale, "hospital.requests.table.product")}
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t(locale, "hospital.requests.table.quantity")}
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t(locale, "hospital.requests.table.status")}
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t(locale, "hospital.requests.table.orderDate")}
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t(locale, "hospital.requests.table.updatedAt")}
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {t(locale, "hospital.requests.table.actions")}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {filtered.map((o) => (
                                <tr key={o.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-brand-600 dark:text-brand-400">{o.id}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {locale === "ar" ? o.factoryNameAr : o.factoryNameEn}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {locale === "ar" ? o.productAr : o.productEn}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{o.quantity.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge label={statusText(o.status)} variant={statusVariant(o.status)} size="sm" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{o.orderDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{o.updatedAt}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link
                                            href={`/hospital/requests/${o.id}`}
                                            className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 text-sm font-medium"
                                        >
                                            {t(locale, "hospital.requests.table.viewDetails")} {locale === "ar" ? "←" : "→"}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <EmptyState
                        title={t(locale, "hospital.requests.empty.title")}
                        description={t(locale, "hospital.requests.empty.subtitle")}
                    />
                )}
            </div>
        </div>
    );
}
