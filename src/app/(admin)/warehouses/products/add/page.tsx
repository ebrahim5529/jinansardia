"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddWarehouseProductPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    interface Warehouse {
        id: string;
        name: string;
        location: string | null;
        country?: { name: string } | null;
    }
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loadingWarehouses, setLoadingWarehouses] = useState(true);

    useEffect(() => {
        fetch("/api/admin/warehouses")
            .then(res => res.json())
            .then(data => {
                if (data.warehouses) setWarehouses(data.warehouses);
            })
            .catch(() => {})
            .finally(() => setLoadingWarehouses(false));
    }, []);

    const categories = [
        "مستهلكات طبية",
        "معدات حماية",
        "أثاث طبي",
        "معدات طبية",
        "أدوات جراحية",
        "مستلزمات المختبر",
    ];

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        price: "",
        status: "active",
        warehouseId: "",
        initialStock: "0",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const [certificates, setCertificates] = useState<File[]>([]);
    const [certPreviews, setCertPreviews] = useState<{ name: string; type: string }[]>([]);
    const [certTypes, setCertTypes] = useState<string[]>([]);

    const certificateTypeOptions = [
        "شهادة ISO",
        "شهادة CE",
        "شهادة FDA",
        "شهادة SFDA",
        "شهادة GMP",
        "شهادة جودة",
        "شهادة مطابقة",
        "أخرى",
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + certificates.length > 10) {
            setErrors(prev => ({ ...prev, certificates: "يمكنك رفع 10 شهادات كحد أقصى" }));
            return;
        }

        const newTypes = files.map(() => "شهادة جودة");
        setCertTypes(prev => [...prev, ...newTypes]);
        setCertificates(prev => [...prev, ...files]);
        setCertPreviews(prev => [...prev, ...files.map(f => ({ name: f.name, type: f.type }))]);
        setErrors(prev => ({ ...prev, certificates: "" }));
    };

    const removeCertificate = (index: number) => {
        setCertificates(prev => prev.filter((_, i) => i !== index));
        setCertPreviews(prev => prev.filter((_, i) => i !== index));
        setCertTypes(prev => prev.filter((_, i) => i !== index));
    };

    const updateCertType = (index: number, type: string) => {
        setCertTypes(prev => prev.map((t, i) => i === index ? type : t));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = "اسم المنتج مطلوب";
        if (!formData.warehouseId) newErrors.warehouseId = "يجب اختيار المستودع";
        if (!formData.category) newErrors.category = "فئة المنتج مطلوبة";
        if (formData.price && (Number.isNaN(Number(formData.price)) || Number(formData.price) < 0)) {
            newErrors.price = "السعر غير صالح";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/admin/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    category: formData.category || null,
                    price: formData.price ? Number(formData.price) : 0,
                    description: formData.description || null,
                }),
            });
            const data = await res.json();
            if (data.success) {
                // Create warehouse stock entry
                if (formData.warehouseId && data.product?.id) {
                    await fetch("/api/admin/warehouse-stock", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            warehouseId: formData.warehouseId,
                            productId: data.product.id,
                            quantity: Number(formData.initialStock) || 0,
                        }),
                    });
                }
                // TODO: Upload certificates to storage and save to DB via /api/admin/certificates
                if (certificates.length > 0) {
                    console.log("Certificates to upload:", certificates);
                    console.log("Certificate types:", certTypes);
                }
                router.push("/warehouses/products");
            } else {
                setErrors({ submit: data.error || "فشل إضافة المنتج" });
                setIsSubmitting(false);
            }
        } catch {
            setErrors({ submit: "فشل الاتصال بالخادم" });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <Link href="/warehouses/products" className="hover:text-brand-500">
                        المنتجات
                    </Link>
                    <span>/</span>
                    <span>إضافة منتج جديد</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    إضافة منتج جديد
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    أدخل معلومات المنتج الجديد
                </p>
            </div>

            {errors.submit && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                    {errors.submit}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        المعلومات الأساسية
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                اسم المنتج <span className="text-error-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.name ? 'border-error-500' : 'border-gray-200 dark:border-gray-800'}`}
                                placeholder="مثال: قفازات طبية"
                            />
                            {errors.name && <p className="mt-1 text-sm text-error-500">{errors.name}</p>}
                        </div>

                        {/* Warehouse */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                المستودع <span className="text-error-500">*</span>
                            </label>
                            <select
                                name="warehouseId"
                                value={formData.warehouseId}
                                onChange={handleInputChange}
                                disabled={loadingWarehouses}
                                className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.warehouseId ? 'border-error-500' : 'border-gray-200 dark:border-gray-800'}`}
                            >
                                <option value="">{loadingWarehouses ? "جاري التحميل..." : "اختر المستودع"}</option>
                                {warehouses.map(w => (
                                    <option key={w.id} value={w.id}>
                                        {w.name}{w.country?.name ? ` — ${w.country.name}` : ""}{w.location ? ` (${w.location})` : ""}
                                    </option>
                                ))}
                            </select>
                            {errors.warehouseId && <p className="mt-1 text-sm text-error-500">{errors.warehouseId}</p>}
                            {!loadingWarehouses && warehouses.length === 0 && (
                                <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
                                    لا توجد مستودعات — <Link href="/warehouses" className="underline hover:text-brand-500">أضف مستودعاً أولاً</Link>
                                </p>
                            )}
                        </div>

                        {/* Initial Stock */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                الكمية الأولية
                            </label>
                            <input
                                type="number"
                                name="initialStock"
                                value={formData.initialStock}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                placeholder="0"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                الفئة <span className="text-error-500">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.category ? 'border-error-500' : 'border-gray-200 dark:border-gray-800'}`}
                            >
                                <option value="">اختر الفئة</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            {errors.category && <p className="mt-1 text-sm text-error-500">{errors.category}</p>}
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
                                <option value="inactive">غير نشط</option>
                            </select>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                السعر (ر.س)
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                step="0.01"
                                min="0"
                                className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.price ? 'border-error-500' : 'border-gray-200 dark:border-gray-800'}`}
                                placeholder="0.00"
                            />
                            {errors.price && <p className="mt-1 text-sm text-error-500">{errors.price}</p>}
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                وصف المنتج
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                                placeholder="وصف تفصيلي للمنتج..."
                            />
                        </div>
                    </div>
                </div>

                {/* Certificates */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        شهادات الجودة
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        أرفق شهادات الجودة والمطابقة الخاصة بالمنتج (PDF, صور)
                    </p>

                    <div>
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                            multiple
                            onChange={handleCertificateChange}
                            className="hidden"
                            id="cert-upload"
                        />
                        <label
                            htmlFor="cert-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                            <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm text-gray-600 dark:text-gray-400">انقر لرفع الشهادات (PDF أو صور) — حتى 10 ملفات</span>
                        </label>
                        {errors.certificates && <p className="mt-1 text-sm text-error-500">{errors.certificates}</p>}

                        {certPreviews.length > 0 && (
                            <div className="mt-4 space-y-3">
                                {certPreviews.map((cert, index) => (
                                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <div className="flex-shrink-0">
                                            {cert.type.includes("pdf") ? (
                                                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{cert.name}</p>
                                        </div>
                                        <select
                                            value={certTypes[index] || "شهادة جودة"}
                                            onChange={(e) => updateCertType(index, e.target.value)}
                                            className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                        >
                                            {certificateTypeOptions.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => removeCertificate(index)}
                                            className="flex-shrink-0 p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center gap-4 justify-end">
                    <Link
                        href="/warehouses/products"
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
                            "حفظ المنتج"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
