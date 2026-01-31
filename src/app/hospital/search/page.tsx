"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FilterDropdown, PageHeader, SearchBar, StatusBadge } from "@/components/shared";
import { t, type Locale } from "@/locales/i18n";

function getCookie(name: string) {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
}

type SortBy = "priceAsc" | "specs" | "leadTime";
type Availability = "available" | "unavailable";

type SearchResult = {
    factoryId: string;
    factoryNameAr: string;
    factoryNameEn: string;
    productNameAr: string;
    productNameEn: string;
    category: string;
    priceSar: number;
    imageUrl?: string;
    specsSummaryAr: string;
    specsSummaryEn: string;
    leadTimeDays: number;
    availability: Availability;
    rating?: number;
};

export default function HospitalSearch() {
    const [locale, setLocale] = useState<Locale>("ar");

    useEffect(() => {
        const currentLocale = getCookie("NEXT_LOCALE") as Locale;
        if (currentLocale === "en" || currentLocale === "ar") {
            setLocale(currentLocale);
        }
    }, []);

    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");
    const [sortBy, setSortBy] = useState<SortBy>("priceAsc");

    const results = useMemo<SearchResult[]>(
        () => [
            {
                factoryId: "F-101",
                factoryNameAr: "مصنع الشفاء",
                factoryNameEn: "Al-Shifa Factory",
                productNameAr: "كمامات N95",
                productNameEn: "N95 Masks",
                category: "PPE",
                priceSar: 7.5,
                imageUrl:
                    "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=1200&q=80",
                specsSummaryAr: "مستوى ترشيح عالي - عبوة 20",
                specsSummaryEn: "High filtration - Pack of 20",
                leadTimeDays: 7,
                availability: "available",
                rating: 4.6,
            },
            {
                factoryId: "F-102",
                factoryNameAr: "مصنع النور",
                factoryNameEn: "Al-Noor Factory",
                productNameAr: "قفازات طبية",
                productNameEn: "Medical Gloves",
                category: "Consumables",
                priceSar: 280,
                imageUrl:
                    "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=1200&q=80",
                specsSummaryAr: "لاتكس - مقاس متوسط - 100 قطعة",
                specsSummaryEn: "Latex - Medium - 100 pcs",
                leadTimeDays: 10,
                availability: "available",
                rating: 4.2,
            },
            {
                factoryId: "F-103",
                factoryNameAr: "مصنع الحياة",
                factoryNameEn: "Al-Hayat Factory",
                productNameAr: "شاش طبي",
                productNameEn: "Medical Gauze",
                category: "Consumables",
                priceSar: 18,
                imageUrl:
                    "https://images.unsplash.com/photo-1587370560942-ad2a04eabb6d?auto=format&fit=crop&w=1200&q=80",
                specsSummaryAr: "معقم - قياس 10×10 - 50 قطعة",
                specsSummaryEn: "Sterile - 10×10 - 50 pcs",
                leadTimeDays: 14,
                availability: "unavailable",
            },
        ],
        []
    );

    const categoryOptions = useMemo(
        () => [
            { value: "all", label: t(locale, "hospital.search.filters.category.all") },
            { value: "Consumables", label: t(locale, "hospital.search.filters.category.consumables") },
            { value: "PPE", label: t(locale, "hospital.search.filters.category.ppe") },
        ],
        [locale]
    );

    const sortOptions = useMemo(
        () => [
            { value: "priceAsc", label: t(locale, "hospital.search.filters.sort.priceAsc") },
            { value: "specs", label: t(locale, "hospital.search.filters.sort.specs") },
            { value: "leadTime", label: t(locale, "hospital.search.filters.sort.leadTime") },
        ],
        [locale]
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        const byQuery = (item: SearchResult) => {
            if (!q) return true;
            const product = (locale === "ar" ? item.productNameAr : item.productNameEn).toLowerCase();
            const factory = (locale === "ar" ? item.factoryNameAr : item.factoryNameEn).toLowerCase();
            return product.includes(q) || factory.includes(q);
        };

        const byCategory = (item: SearchResult) => category === "all" || item.category === category;

        const sorted = [...results].filter((x) => byQuery(x) && byCategory(x));
        if (sortBy === "priceAsc") {
            sorted.sort((a, b) => a.priceSar - b.priceSar);
        } else if (sortBy === "leadTime") {
            sorted.sort((a, b) => a.leadTimeDays - b.leadTimeDays);
        } else {
            sorted.sort((a, b) => (a.specsSummaryEn ?? "").localeCompare(b.specsSummaryEn ?? ""));
        }

        return sorted;
    }, [category, locale, query, results, sortBy]);

    const availabilityLabel = (value: Availability) =>
        value === "available"
            ? t(locale, "hospital.search.availability.available")
            : t(locale, "hospital.search.availability.unavailable");

    const availabilityVariant = (value: Availability) => (value === "available" ? "success" : "gray");

    return (
        <div className="space-y-6">
            <PageHeader
                title={t(locale, "hospital.search.title")}
                description={t(locale, "hospital.search.subtitle")}
            />

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <SearchBar
                            value={query}
                            onChange={setQuery}
                            placeholder={t(locale, "hospital.search.filters.queryPlaceholder")}
                        />
                    </div>
                    <div className="lg:w-64">
                        <FilterDropdown
                            value={category}
                            onChange={setCategory}
                            options={categoryOptions}
                            label={t(locale, "hospital.search.filters.category.label")}
                        />
                    </div>
                    <div className="lg:w-64">
                        <FilterDropdown
                            value={sortBy}
                            onChange={(v) => setSortBy(v as SortBy)}
                            options={sortOptions}
                            label={t(locale, "hospital.search.filters.sort.label")}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((item) => {
                    const factoryName = locale === "ar" ? item.factoryNameAr : item.factoryNameEn;
                    const productName = locale === "ar" ? item.productNameAr : item.productNameEn;
                    const specsSummary = locale === "ar" ? item.specsSummaryAr : item.specsSummaryEn;

                    return (
                        <div
                            key={`${item.factoryId}-${item.productNameEn}`}
                            className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden"
                        >
                            <div className="relative h-36 bg-gray-100 dark:bg-gray-800">
                                {item.imageUrl ? (
                                    <Image
                                        src={item.imageUrl}
                                        alt={productName}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                        priority={false}
                                    />
                                ) : null}
                            </div>
                            <div className="p-5 space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            {productName}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {factoryName}
                                        </p>
                                    </div>
                                    <StatusBadge
                                        label={availabilityLabel(item.availability)}
                                        variant={availabilityVariant(item.availability)}
                                        size="sm"
                                    />
                                </div>

                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {specsSummary}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {t(locale, "hospital.search.card.unitPrice")}
                                    </div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                                        {item.priceSar.toLocaleString()} {t(locale, "common.sar")}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>{t(locale, "hospital.search.card.leadTime")}</span>
                                    <span>
                                        {item.leadTimeDays} {t(locale, "hospital.search.card.days")}
                                    </span>
                                </div>

                                <Link
                                    href={`/hospital/search/factory/${item.factoryId}`}
                                    className="mt-2 block w-full text-center px-4 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-medium"
                                >
                                    {t(locale, "hospital.search.card.viewDetails")}
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-10 text-center">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {t(locale, "hospital.search.empty.title")}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {t(locale, "hospital.search.empty.subtitle")}
                    </p>
                </div>
            )}
        </div>
    );
}
