"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Product {
    id: string;
    name: string;
    price: number;
}

export default function EditOfferPage() {
    const router = useRouter();
    const params = useParams();
    const offerId = params.id as string;

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock existing offer data - في الواقع سيتم جلبه من API
    const [formData, setFormData] = useState({
        name: "عرض الشتاء على المستهلكات الطبية",
        description: "خصم كبير على جميع المستهلكات الطبية",
        discountType: "percentage" as "percentage" | "fixed",
        discountValue: "25",
        startDate: "2026-01-15",
        endDate: "2026-02-15",
        status: "active",
        createdAt: "2026-01-10",
        updatedAt: "2026-01-28"
    });

    const [selectedProducts, setSelectedProducts] = useState<string[]>(["PRD-001", "PRD-002", "PRD-003"]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Mock products - سيتم جلبها من API
    const availableProducts: Product[] = [
        { id: "PRD-001", name: "قفازات طبية", price: 250 },
        { id: "PRD-002", name: "كمامات N95", price: 8 },
        { id: "PRD-003", name: "معقمات يد", price: 35 },
        { id: "PRD-004", name: "أسرة طبية", price: 12000 },
        { id: "PRD-005", name: "شاش طبي", price: 15 },
        { id: "PRD-007", name: "محاقن طبية", price: 2 },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const toggleProduct = (productId: string) => {
        setSelectedProducts(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
        if (errors.products) {
            setErrors(prev => ({ ...prev, products: "" }));
        }
    };

    const calculateDiscountedPrice = (originalPrice: number) => {
        if (!formData.discountValue) return originalPrice;

        const discount = parseFloat(formData.discountValue);
        if (formData.discountType === "percentage") {
            return originalPrice - (originalPrice * discount / 100);
        }
        return originalPrice - discount;
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = "اسم العرض مطلوب";
        if (selectedProducts.length === 0) newErrors.products = "يجب اختيار منتج واحد على الأقل";
        if (!formData.discountValue || parseFloat(formData.discountValue) <= 0)
            newErrors.discountValue = "قيمة الخصم يجب أن تكون أكبر من صفر";
        if (formData.discountType === "percentage" && parseFloat(formData.discountValue) > 100)
            newErrors.discountValue = "نسبة الخصم لا يمكن أن تتجاوز 100%";
        if (!formData.startDate) newErrors.startDate = "تاريخ البداية مطلوب";
        if (!formData.endDate) newErrors.endDate = "تاريخ النهاية مطلوب";
        if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate)
            newErrors.endDate = "تاريخ النهاية يجب أن يكون بعد تاريخ البداية";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);

        setTimeout(() => {
            console.log("Updated offer data:", { ...formData, products: selectedProducts });
            router.push("/factory/offers");
        }, 1500);
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <Link href="/factory/offers" className="hover:text-brand-500">
                        العروض
                    </Link>
                    <span>/</span>
                    <span>تعديل عرض</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    تعديل العرض #{offerId}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    تعديل معلومات العرض
                </p>
            </div>

            {/* Metadata */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>تاريخ الإنشاء: {formData.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>آخر تحديث: {formData.updatedAt}</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        المعلومات الأساسية
                    </h2>

                    <div className="space-y-6">
                        {/* Offer Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                اسم العرض <span className="text-error-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.name ? 'border-error-500' : 'border-gray-200 dark:border-gray-800'
                                    }`}
                                placeholder="مثال: عرض الشتاء على المستهلكات الطبية"
                            />
                            {errors.name && <p className="mt-1 text-sm text-error-500">{errors.name}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                وصف العرض
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                                placeholder="وصف تفصيلي للعرض..."
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                الحالة
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="active">نشط</option>
                                <option value="expired">غير نشط</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Discount Settings */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        إعدادات الخصم
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Discount Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                نوع الخصم <span className="text-error-500">*</span>
                            </label>
                            <select
                                name="discountType"
                                value={formData.discountType}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="percentage">نسبة مئوية (%)</option>
                                <option value="fixed">سعر ثابت (ريال)</option>
                            </select>
                        </div>

                        {/* Discount Value */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                قيمة الخصم <span className="text-error-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="discountValue"
                                    value={formData.discountValue}
                                    onChange={handleInputChange}
                                    step={formData.discountType === "percentage" ? "1" : "0.01"}
                                    className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.discountValue ? 'border-error-500' : 'border-gray-200 dark:border-gray-800'
                                        }`}
                                    placeholder="0"
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                    {formData.discountType === "percentage" ? "%" : "ريال"}
                                </span>
                            </div>
                            {errors.discountValue && <p className="mt-1 text-sm text-error-500">{errors.discountValue}</p>}
                        </div>
                    </div>
                </div>

                {/* Duration */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        مدة العرض
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                تاريخ البداية <span className="text-error-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.startDate ? 'border-error-500' : 'border-gray-200 dark:border-gray-800'
                                    }`}
                            />
                            {errors.startDate && <p className="mt-1 text-sm text-error-500">{errors.startDate}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                تاريخ النهاية <span className="text-error-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.endDate ? 'border-error-500' : 'border-gray-200 dark:border-gray-800'
                                    }`}
                            />
                            {errors.endDate && <p className="mt-1 text-sm text-error-500">{errors.endDate}</p>}
                        </div>
                    </div>
                </div>

                {/* Product Selection */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        المنتجات المشمولة
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        اختر المنتجات التي سيشملها العرض ({selectedProducts.length} محدد)
                    </p>
                    {errors.products && <p className="mb-4 text-sm text-error-500">{errors.products}</p>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableProducts.map((product) => {
                            const isSelected = selectedProducts.includes(product.id);
                            const discountedPrice = calculateDiscountedPrice(product.price);

                            return (
                                <div
                                    key={product.id}
                                    onClick={() => toggleProduct(product.id)}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${isSelected
                                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                                        : 'border-gray-200 dark:border-gray-800 hover:border-brand-300'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => { }}
                                                    className="w-5 h-5 text-brand-600 rounded focus:ring-brand-500"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {product.id}
                                                    </p>
                                                </div>
                                            </div>
                                            {isSelected && formData.discountValue && (
                                                <div className="mt-3 mr-7 flex items-center gap-3">
                                                    <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                                        {product.price} ريال
                                                    </span>
                                                    <span className="text-lg font-bold text-brand-600 dark:text-brand-400">
                                                        {discountedPrice.toFixed(2)} ريال
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center gap-4 justify-end">
                    <Link
                        href="/factory/offers"
                        className="px-6 py-2.5 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                    >
                        إلغاء
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                جاري الحفظ...
                            </>
                        ) : (
                            "حفظ التغييرات"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
