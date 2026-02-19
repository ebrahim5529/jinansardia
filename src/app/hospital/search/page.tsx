"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function HospitalSearchPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const url = new URL("/api/hospital/products", window.location.origin);
            if (searchQuery) url.searchParams.append("q", searchQuery);
            if (categoryFilter) url.searchParams.append("category", categoryFilter);

            const res = await fetch(url.toString());
            const data = await res.json();
            if (data.products) {
                setProducts(data.products);
            }
        } catch (error) {
            toast.error("فشل البحث عن المنتجات");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, categoryFilter]);

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    البحث عن منتجات طبية
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    استكشف المنتجات والمعدات المتاحة من جميع المصانع
                </p>
            </div>

            {/* Search & Filters */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <i className="ri-search-line absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
                        <input
                            type="text"
                            placeholder="ابحث باسم المنتج أو الفئة..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pr-12 pl-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 transition-all text-gray-900 dark:text-white outline-none"
                        />
                    </div>
                    <div className="md:w-64">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full px-4 py-3.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 transition-all text-gray-900 dark:text-white outline-none appearance-none"
                        >
                            <option value="">جميع الفئات</option>
                            <option value="مستهلكات طبية">مستهلكات طبية</option>
                            <option value="معدات طبية">معدات طبية</option>
                            <option value="أثاث طبي">أثاث طبي</option>
                            <option value="معدات حماية">معدات حماية</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-xl hover:border-brand-500/30 transition-all duration-300 flex flex-col h-full"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <span className="px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-semibold rounded-full">
                                    {product.category || "غير محدد"}
                                </span>
                                <span className={`flex items-center gap-1.5 text-sm font-medium ${product.status === "active" ? "text-success-600" : "text-gray-500"}`}>
                                    <span className={`w-2 h-2 rounded-full ${product.status === "active" ? "bg-success-600 animate-pulse" : "bg-gray-400"}`}></span>
                                    {product.status === "active" ? "متاح" : "غير متوفر"}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-brand-600 transition-colors">
                                {product.name}
                            </h3>

                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
                                {product.description || "لا يوجد وصف لهذا المنتج"}
                            </p>

                            <div className="space-y-4 mb-5 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <i className="ri-building-2-line text-lg text-brand-500"></i>
                                    <span className="font-semibold">{product.factory?.factoryName || "مصنع مجهول"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <i className="ri-map-pin-2-line text-lg text-brand-500"></i>
                                    <span>{product.factory?.city}, {product.factory?.country}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                                <div className="text-2xl font-black text-brand-600 dark:text-brand-400">
                                    {product.price} <span className="text-sm font-medium text-gray-500">ريال</span>
                                </div>
                                <button className="p-2.5 bg-gray-50 dark:bg-gray-800 hover:bg-brand-500 hover:text-white rounded-xl transition-all duration-300 group/btn shadow-sm">
                                    <i className="ri-shopping-cart-2-line text-xl"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 py-20 text-center">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="ri-search-eye-line text-4xl text-gray-400"></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">لم نجد أي منتجات</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                        جرب البحث بكلمات أخرى أو اختر فئة مختلفة
                    </p>
                </div>
            )}
        </div>
    );
}
