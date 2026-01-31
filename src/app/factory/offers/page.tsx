"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Offer {
    id: string;
    name: string;
    description: string;
    discount: number;
    discountType: "percentage" | "fixed";
    productsCount: number;
    startDate: string;
    endDate: string;
    status: "active" | "expired";
}

export default function OffersPage() {
    const [filter, setFilter] = useState<"all" | "active" | "expired">("all");

    // Mock data
    const offers: Offer[] = [
        {
            id: "OFF-001",
            name: "عرض الشتاء على المستهلكات الطبية",
            description: "خصم كبير على جميع المستهلكات الطبية",
            discount: 25,
            discountType: "percentage",
            productsCount: 12,
            startDate: "2026-01-15",
            endDate: "2026-02-15",
            status: "active"
        },
        {
            id: "OFF-002",
            name: "عرض الأسرة الطبية",
            description: "خصم 2000 ريال على جميع الأسرة الطبية",
            discount: 2000,
            discountType: "fixed",
            productsCount: 5,
            startDate: "2026-01-20",
            endDate: "2026-02-28",
            status: "active"
        },
        {
            id: "OFF-003",
            name: "عرض نهاية السنة",
            description: "عرض خاص على معدات الحماية",
            discount: 15,
            discountType: "percentage",
            productsCount: 8,
            startDate: "2025-12-01",
            endDate: "2026-01-01",
            status: "expired"
        },
    ];

    const filteredOffers = offers.filter(offer => {
        if (filter === "all") return true;
        return offer.status === filter;
    });

    const stats = {
        all: offers.length,
        active: offers.filter(o => o.status === "active").length,
        expired: offers.filter(o => o.status === "expired").length,
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        إدارة العروض
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        إنشاء وإدارة عروض المصنع الخاصة
                    </p>
                </div>
                <Link
                    href="/factory/offers/add"
                    className="flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-medium shadow-sm"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    إنشاء عرض جديد
                </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800">
                <button
                    onClick={() => setFilter("all")}
                    className={`px-6 py-3 font-medium border-b-2 transition-colors ${filter === "all"
                        ? "border-brand-500 text-brand-600 dark:text-brand-400"
                        : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                >
                    الكل ({stats.all})
                </button>
                <button
                    onClick={() => setFilter("active")}
                    className={`px-6 py-3 font-medium border-b-2 transition-colors ${filter === "active"
                        ? "border-brand-500 text-brand-600 dark:text-brand-400"
                        : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                >
                    نشط ({stats.active})
                </button>
                <button
                    onClick={() => setFilter("expired")}
                    className={`px-6 py-3 font-medium border-b-2 transition-colors ${filter === "expired"
                        ? "border-brand-500 text-brand-600 dark:text-brand-400"
                        : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                >
                    منتهي ({stats.expired})
                </button>
            </div>

            {/* Offers Grid */}
            {filteredOffers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOffers.map((offer) => (
                        <OfferCard key={offer.id} offer={offer} />
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 py-12">
                    <div className="text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">لا توجد عروض</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {filter === "all" ? "لم يتم إنشاء أي عروض بعد" : `لا توجد عروض ${filter === "active" ? "نشطة" : "منتهية"}`}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

function OfferCard({ offer }: { offer: Offer }) {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        if (offer.status === "expired") return;

        const calculateTimeLeft = () => {
            const end = new Date(offer.endDate).getTime();
            const now = new Date().getTime();
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft("منتهي");
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            setTimeLeft(`${days} يوم ${hours} ساعة ${minutes} دقيقة`);
        };

        calculateTimeLeft();
        const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [offer.endDate, offer.status]);

    const getStatusColor = (status: string) => {
        return status === "active"
            ? "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400"
            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {offer.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {offer.description}
                        </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(offer.status)}`}>
                        {offer.status === "active" ? "نشط" : "منتهي"}
                    </span>
                </div>

                {/* Discount Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-lg font-bold">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    خصم {offer.discount}{offer.discountType === "percentage" ? "%" : " ريال"}
                </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
                {/* Products Count */}
                <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <span>{offer.productsCount} منتج</span>
                    </div>
                </div>

                {/* Dates */}
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>من {offer.startDate} إلى {offer.endDate}</span>
                    </div>
                </div>

                {/* Countdown */}
                {offer.status === "active" && timeLeft && (
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium">متبقي: {timeLeft}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex items-center gap-2">
                <Link
                    href={`/factory/offers/edit/${offer.id}`}
                    className="flex-1 px-4 py-2 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                    تعديل
                </Link>
                <button className="px-4 py-2 bg-error-50 dark:bg-error-900/20 text-error-600 dark:text-error-400 rounded-lg hover:bg-error-100 dark:hover:bg-error-900/30 transition-colors text-sm font-medium">
                    إيقاف
                </button>
            </div>
        </div>
    );
}
