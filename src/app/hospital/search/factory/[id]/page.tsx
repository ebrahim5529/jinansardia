"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader, StatusBadge, Tabs } from "@/components/shared";
import { t, type Locale } from "@/locales/i18n";

function getCookie(name: string) {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
    return null;
}

type Product = {
    id: string;
    nameAr: string;
    nameEn: string;
    priceSar: number;
    specsAr: string;
    specsEn: string;
    availableQty: number;
    isOffer?: boolean;
};

type Factory = {
    id: string;
    nameAr: string;
    nameEn: string;
    aboutAr: string;
    aboutEn: string;
    phone: string;
    email: string;
    addressAr: string;
    addressEn: string;
    rating?: number;
    products: Product[];
    offers: Product[];
};

export default function HospitalFactoryDetailsPage() {
    const params = useParams<{ id: string }>();
    const factoryId = params?.id;

    const [locale, setLocale] = useState<Locale>("ar");

    useEffect(() => {
        const currentLocale = getCookie("NEXT_LOCALE") as Locale;
        if (currentLocale === "en" || currentLocale === "ar") {
            setLocale(currentLocale);
        }
    }, []);

    const factory = useMemo<Factory>(() => {
        const base: Factory = {
            id: String(factoryId ?? ""),
            nameAr: factoryId === "F-102" ? "مصنع النور" : factoryId === "F-103" ? "مصنع الحياة" : "مصنع الشفاء",
            nameEn: factoryId === "F-102" ? "Al-Noor Factory" : factoryId === "F-103" ? "Al-Hayat Factory" : "Al-Shifa Factory",
            aboutAr: "مصنع متخصص في توريد المستهلكات الطبية وفق معايير جودة عالية.",
            aboutEn: "A factory specialized in supplying medical consumables with high quality standards.",
            phone: "+966 50 000 0000",
            email: "factory@example.com",
            addressAr: "الرياض، المملكة العربية السعودية",
            addressEn: "Riyadh, Saudi Arabia",
            rating: factoryId === "F-103" ? 4.1 : factoryId === "F-102" ? 4.3 : 4.6,
            products: [
                {
                    id: "P-1",
                    nameAr: "قفازات طبية",
                    nameEn: "Medical Gloves",
                    priceSar: 280,
                    specsAr: "لاتكس - 100 قطعة - مقاس متوسط",
                    specsEn: "Latex - 100 pcs - Medium",
                    availableQty: 15000,
                },
                {
                    id: "P-2",
                    nameAr: "معقمات يد",
                    nameEn: "Hand Sanitizer",
                    priceSar: 35,
                    specsAr: "500 مل - كحول 70%",
                    specsEn: "500 ml - 70% alcohol",
                    availableQty: 8000,
                },
                {
                    id: "P-3",
                    nameAr: "شاش طبي",
                    nameEn: "Medical Gauze",
                    priceSar: 18,
                    specsAr: "10×10 - معقم - 50 قطعة",
                    specsEn: "10×10 - Sterile - 50 pcs",
                    availableQty: 0,
                },
            ],
            offers: [
                {
                    id: "O-1",
                    nameAr: "كمامات N95 (عرض)",
                    nameEn: "N95 Masks (Offer)",
                    priceSar: 6.9,
                    specsAr: "عبوة 20 - خصم لمدة محدودة",
                    specsEn: "Pack of 20 - Limited time discount",
                    availableQty: 5000,
                    isOffer: true,
                },
            ],
        };

        return base;
    }, [factoryId]);

    const [activeTab, setActiveTab] = useState<"products" | "offers">("products");

    const factoryName = locale === "ar" ? factory.nameAr : factory.nameEn;
    const about = locale === "ar" ? factory.aboutAr : factory.aboutEn;
    const address = locale === "ar" ? factory.addressAr : factory.addressEn;

    const items = activeTab === "products" ? factory.products : factory.offers;

    return (
        <div className="space-y-6">
            <PageHeader
                title={t(locale, "hospital.factory.title")}
                description={t(locale, "hospital.factory.subtitle")}
                breadcrumbs={[
                    { label: t(locale, "hospital.dashboard.title"), href: "/hospital" },
                    { label: t(locale, "hospital.search.title"), href: "/hospital/search" },
                    { label: factoryName },
                ]}
            />

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-800" />

                    <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{factoryName}</h2>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">{about}</p>
                            </div>

                            {factory.rating !== undefined && (
                                <div className="text-right">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">{t(locale, "hospital.factory.rating")}</div>
                                    <div className="text-xl font-bold text-gray-900 dark:text-white">{factory.rating.toFixed(1)}</div>
                                </div>
                            )}
                        </div>

                        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-sm">
                                <div className="text-gray-600 dark:text-gray-400">{t(locale, "hospital.factory.contact.phone")}</div>
                                <div className="font-medium text-gray-900 dark:text-white">{factory.phone}</div>
                            </div>
                            <div className="text-sm">
                                <div className="text-gray-600 dark:text-gray-400">{t(locale, "hospital.factory.contact.email")}</div>
                                <div className="font-medium text-gray-900 dark:text-white">{factory.email}</div>
                            </div>
                            <div className="text-sm">
                                <div className="text-gray-600 dark:text-gray-400">{t(locale, "hospital.factory.contact.address")}</div>
                                <div className="font-medium text-gray-900 dark:text-white">{address}</div>
                            </div>
                        </div>

                        <div className="mt-5 text-sm text-gray-600 dark:text-gray-400">
                            {t(locale, "hospital.factory.productsCount")}: <span className="font-medium text-gray-900 dark:text-white">{factory.products.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <Tabs
                    tabs={[
                        { id: "products", label: t(locale, "hospital.factory.tabs.products"), count: factory.products.length },
                        { id: "offers", label: t(locale, "hospital.factory.tabs.offers"), count: factory.offers.length },
                    ]}
                    activeTab={activeTab}
                    onChange={(tabId) => setActiveTab(tabId as any)}
                />

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {items.map((p) => {
                            const name = locale === "ar" ? p.nameAr : p.nameEn;
                            const specs = locale === "ar" ? p.specsAr : p.specsEn;
                            const isAvailable = p.availableQty > 0;

                            return (
                                <div
                                    key={p.id}
                                    className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
                                >
                                    <div className="h-32 bg-gray-100 dark:bg-gray-800" />
                                    <div className="p-5 space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{name}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{specs}</p>
                                            </div>
                                            {p.isOffer && (
                                                <StatusBadge label={t(locale, "hospital.factory.badge.offer")} variant="purple" size="sm" />
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">{t(locale, "hospital.factory.card.price")}</div>
                                            <div className="text-lg font-bold text-gray-900 dark:text-white">
                                                {p.priceSar.toLocaleString()} {t(locale, "common.sar")}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                            <span>{t(locale, "hospital.factory.card.availableQty")}</span>
                                            <span>{p.availableQty.toLocaleString()}</span>
                                        </div>

                                        <div className="flex items-center justify-between gap-3">
                                            <StatusBadge
                                                label={
                                                    isAvailable
                                                        ? t(locale, "hospital.search.availability.available")
                                                        : t(locale, "hospital.search.availability.unavailable")
                                                }
                                                variant={isAvailable ? "success" : "gray"}
                                                size="sm"
                                            />

                                            <Link
                                                href={`/hospital/requests/create?factoryId=${encodeURIComponent(factory.id)}&productId=${encodeURIComponent(
                                                    p.id
                                                )}`}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                    isAvailable
                                                        ? "bg-error-600 text-white hover:bg-error-700"
                                                        : "bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed pointer-events-none"
                                                }`}
                                            >
                                                {t(locale, "hospital.factory.card.createOrder")}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {items.length === 0 && (
                        <div className="py-10 text-center">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">{t(locale, "hospital.factory.empty.title")}</h3>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t(locale, "hospital.factory.empty.subtitle")}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
