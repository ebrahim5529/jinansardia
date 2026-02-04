"use client";

import { useState, useMemo } from "react";
import { PageHeader, SearchBar, StatusBadge } from "@/components/shared";
import { t, type Locale } from "@/locales/i18n";

function getCookie(name: string) {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
}

interface WarehouseItem {
    id: string;
    productNameAr: string;
    productNameEn: string;
    factoryNameAr: string;
    factoryNameEn: string;
    orderId: string;
    quantity: number;
    availableQuantity: number;
    unitPrice: number;
    receivedDate: string;
    expiryDate?: string;
    status: "available" | "reserved" | "expired" | "low_stock";
    location: string;
    category: string;
}

export default function HospitalWarehouse() {
    const [locale, setLocale] = useState<Locale>("ar");
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState<"all" | WarehouseItem["status"]>("all");

    // Mock warehouse data
    const warehouseItems = useMemo<WarehouseItem[]>(
        () => [
            {
                id: "WH-001",
                productNameAr: "كمامات N95",
                productNameEn: "N95 Masks",
                factoryNameAr: "مصنع الشفاء",
                factoryNameEn: "Al-Shifa Factory",
                orderId: "ORD-1042",
                quantity: 5000,
                availableQuantity: 3200,
                unitPrice: 7.5,
                receivedDate: "2026-01-30",
                expiryDate: "2027-01-30",
                status: "available",
                location: "A-12-B",
                category: "PPE"
            },
            {
                id: "WH-002",
                productNameAr: "قفازات طبية",
                productNameEn: "Medical Gloves",
                factoryNameAr: "مصنع النور",
                factoryNameEn: "Al-Noor Factory",
                orderId: "ORD-1041",
                quantity: 12000,
                availableQuantity: 8500,
                unitPrice: 280,
                receivedDate: "2026-01-29",
                expiryDate: "2027-07-29",
                status: "available",
                location: "B-05-C",
                category: "Consumables"
            },
            {
                id: "WH-003",
                productNameAr: "معقمات يد",
                productNameEn: "Hand Sanitizer",
                factoryNameAr: "مصنع الحياة",
                factoryNameEn: "Al-Hayat Factory",
                orderId: "ORD-1039",
                quantity: 800,
                availableQuantity: 150,
                unitPrice: 35,
                receivedDate: "2026-01-28",
                expiryDate: "2026-12-28",
                status: "low_stock",
                location: "C-08-A",
                category: "Consumables"
            },
            {
                id: "WH-004",
                productNameAr: "شاش طبي",
                productNameEn: "Medical Gauze",
                factoryNameAr: "مصنع السلام",
                factoryNameEn: "Al-Salam Factory",
                orderId: "ORD-1038",
                quantity: 3000,
                availableQuantity: 0,
                unitPrice: 18,
                receivedDate: "2026-01-27",
                status: "reserved",
                location: "A-03-D",
                category: "Consumables"
            },
            {
                id: "WH-005",
                productNameAr: "محاقن طبية",
                productNameEn: "Medical Syringes",
                factoryNameAr: "مصنع المدينة",
                factoryNameEn: "Al-Madina Factory",
                orderId: "ORD-1036",
                quantity: 15000,
                availableQuantity: 12000,
                unitPrice: 2,
                receivedDate: "2026-01-25",
                expiryDate: "2027-01-25",
                status: "available",
                location: "D-15-E",
                category: "Consumables"
            },
        ],
        []
    );

    const stats = useMemo(() => {
        const total = warehouseItems.reduce((sum, item) => sum + item.quantity, 0);
        const available = warehouseItems.reduce((sum, item) => sum + item.availableQuantity, 0);
        const reserved = warehouseItems.reduce((sum, item) => sum + (item.quantity - item.availableQuantity), 0);
        const lowStock = warehouseItems.filter(item => item.status === "low_stock").length;
        const expired = warehouseItems.filter(item => item.status === "expired").length;

        return { total, available, reserved, lowStock, expired };
    }, [warehouseItems]);

    const filteredItems = useMemo(() => {
        const q = search.trim().toLowerCase();
        return warehouseItems.filter(item => {
            const matchesSearch = !q || 
                item.productNameAr.toLowerCase().includes(q) ||
                item.productNameEn.toLowerCase().includes(q) ||
                item.factoryNameAr.toLowerCase().includes(q) ||
                item.factoryNameEn.toLowerCase().includes(q) ||
                item.orderId.toLowerCase().includes(q) ||
                item.location.toLowerCase().includes(q);
            
            const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
            const matchesStatus = statusFilter === "all" || item.status === statusFilter;

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [warehouseItems, search, categoryFilter, statusFilter]);

    const getStatusVariant = (status: WarehouseItem["status"]): "success" | "warning" | "error" | "purple" => {
        switch (status) {
            case "available": return "success";
            case "low_stock": return "warning";
            case "reserved": return "purple";
            case "expired": return "error";
        }
    };

    const getStatusLabel = (status: WarehouseItem["status"]) => {
        if (status === "available") return locale === "ar" ? "متاح" : "Available";
        if (status === "low_stock") return locale === "ar" ? "مخزون منخفض" : "Low Stock";
        if (status === "reserved") return locale === "ar" ? "محجوز" : "Reserved";
        return locale === "ar" ? "منتهي" : "Expired";
    };

    const categories = useMemo(() => {
        const unique = Array.from(new Set(warehouseItems.map(item => item.category)));
        return unique;
    }, [warehouseItems]);

    return (
        <div className="space-y-6">
            <PageHeader
                title={locale === "ar" ? "المخزن" : "Warehouse"}
                description={locale === "ar" ? "إدارة مخزون المستشفى والمنتجات المتاحة" : "Manage hospital inventory and available products"}
            />

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {locale === "ar" ? "إجمالي الكمية" : "Total Quantity"}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stats.total.toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {locale === "ar" ? "متاح" : "Available"}
                        </p>
                        <p className="text-2xl font-bold text-success-600 dark:text-success-400">
                            {stats.available.toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {locale === "ar" ? "محجوز" : "Reserved"}
                        </p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {stats.reserved.toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {locale === "ar" ? "مخزون منخفض" : "Low Stock"}
                        </p>
                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {stats.lowStock}
                        </p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {locale === "ar" ? "منتهي" : "Expired"}
                        </p>
                        <p className="text-2xl font-bold text-error-600 dark:text-error-400">
                            {stats.expired}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-1">
                        <SearchBar
                            value={search}
                            onChange={setSearch}
                            placeholder={locale === "ar" ? "ابحث عن منتج، مصنع، أو موقع..." : "Search product, factory, or location..."}
                        />
                    </div>
                    <div className="lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {locale === "ar" ? "الفئة" : "Category"}
                        </label>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                            <option value="all">{locale === "ar" ? "كل الفئات" : "All Categories"}</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {locale === "ar" ? "الحالة" : "Status"}
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                            <option value="all">{locale === "ar" ? "كل الحالات" : "All Statuses"}</option>
                            <option value="available">{locale === "ar" ? "متاح" : "Available"}</option>
                            <option value="low_stock">{locale === "ar" ? "مخزون منخفض" : "Low Stock"}</option>
                            <option value="reserved">{locale === "ar" ? "محجوز" : "Reserved"}</option>
                            <option value="expired">{locale === "ar" ? "منتهي" : "Expired"}</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Warehouse Items Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {locale === "ar" ? "رقم المخزون" : "Stock ID"}
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {locale === "ar" ? "المنتج" : "Product"}
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {locale === "ar" ? "المصنع" : "Factory"}
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {locale === "ar" ? "الكمية الإجمالية" : "Total Qty"}
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {locale === "ar" ? "المتاح" : "Available"}
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {locale === "ar" ? "السعر" : "Price"}
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {locale === "ar" ? "الموقع" : "Location"}
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    {locale === "ar" ? "الحالة" : "Status"}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {filteredItems.map((item) => {
                                const productName = locale === "ar" ? item.productNameAr : item.productNameEn;
                                const factoryName = locale === "ar" ? item.factoryNameAr : item.factoryNameEn;
                                const usagePercentage = ((item.quantity - item.availableQuantity) / item.quantity) * 100;

                                return (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                                                {item.id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white block">
                                                    {productName}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {locale === "ar" ? "طلب" : "Order"}: {item.orderId}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {factoryName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {item.quantity.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {item.availableQuantity.toLocaleString()}
                                                </span>
                                                <div className="mt-1 w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                                    <div
                                                        className="bg-brand-600 h-1.5 rounded-full"
                                                        style={{ width: `${usagePercentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {item.unitPrice.toLocaleString()} {locale === "ar" ? "ريال" : "SAR"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {item.location}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge
                                                label={getStatusLabel(item.status)}
                                                variant={getStatusVariant(item.status)}
                                                size="sm"
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredItems.length === 0 && (
                    <div className="py-12 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6m16 0H4" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                            {locale === "ar" ? "لا توجد منتجات" : "No products found"}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {locale === "ar" ? "لم يتم العثور على منتجات مطابقة للبحث" : "No products match your search criteria"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
