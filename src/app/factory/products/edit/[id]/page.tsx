"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock existing product data - في الواقع سيتم جلبه من API
    const [formData, setFormData] = useState({
        name: "قفازات طبية",
        description: "قفازات طبية عالية الجودة، مناسبة للاستخدام الطبي",
        category: "مستهلكات طبية",
        price: "250",
        minOrder: "1000",
        stock: "15000",
        status: "active",
        createdAt: "2026-01-15",
        updatedAt: "2026-01-28"
    });

    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([
        "/api/placeholder/200/200", // Mock existing images
        "/api/placeholder/200/200",
    ]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [certificates, setCertificates] = useState<File[]>([]);
    const [certPreviews, setCertPreviews] = useState<{ name: string; type: string }[]>([]);
    const [certTypes, setCertTypes] = useState<string[]>([]);
    const [existingCerts, setExistingCerts] = useState<{ id: string; type: string; fileUrl: string }[]>([
        { id: "cert-1", type: "شهادة ISO", fileUrl: "/certificates/iso-cert.pdf" },
        { id: "cert-2", type: "شهادة SFDA", fileUrl: "/certificates/sfda-cert.pdf" },
    ]);

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

    const [currency, setCurrency] = useState<string>("SAR");
    const [categories, setCategories] = useState<string[]>([
        "مستهلكات طبية",
        "معدات حماية",
        "أثاث طبي",
        "معدات طبية",
        "أدوات جراحية",
        "مستلزمات المختبر",
    ]);

    useEffect(() => {
        try {
            const savedCurrency = window.localStorage.getItem("factory.settings.currency");
            if (savedCurrency) {
                setCurrency(savedCurrency);
            }

            const savedCategoriesRaw = window.localStorage.getItem("factory.settings.categories");
            if (savedCategoriesRaw) {
                const parsed = JSON.parse(savedCategoriesRaw);
                if (Array.isArray(parsed)) {
                    setCategories(parsed.filter((x) => typeof x === "string"));
                }
            }
        } catch {
            setCurrency("SAR");
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const totalImages = existingImages.length + images.length + files.length;

        if (totalImages > 5) {
            setErrors(prev => ({ ...prev, images: "يمكنك رفع 5 صور كحد أقصى" }));
            return;
        }

        setImages(prev => [...prev, ...files]);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });

        setErrors(prev => ({ ...prev, images: "" }));
    };

    const removeNewImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleCertificateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + certificates.length + existingCerts.length > 10) {
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

    const removeExistingCert = (index: number) => {
        setExistingCerts(prev => prev.filter((_, i) => i !== index));
    };

    const updateCertType = (index: number, type: string) => {
        setCertTypes(prev => prev.map((t, i) => i === index ? type : t));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = "اسم المنتج مطلوب";
        if (!formData.category) newErrors.category = "فئة المنتج مطلوبة";
        if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = "السعر يجب أن يكون أكبر من صفر";
        if (!formData.minOrder || parseInt(formData.minOrder) <= 0) newErrors.minOrder = "الحد الأدنى يجب أن يكون أكبر من صفر";
        if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = "الكمية يجب أن تكون صفر أو أكبر";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            console.log("Updated product data:", formData);
            console.log("New images:", images);
            console.log("Remaining existing images:", existingImages);
            console.log("New certificates:", certificates);
            console.log("Certificate types:", certTypes);
            console.log("Remaining existing certs:", existingCerts);
            router.push("/factory/products?updated=1");
        }, 1500);
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <Link href="/factory/products" className="hover:text-brand-500">
                        المنتجات
                    </Link>
                    <span>/</span>
                    <span>تعديل منتج</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    تعديل المنتج #{productId}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    تعديل معلومات المنتج
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Metadata */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
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
                                className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.name ? 'border-error-500' : 'border-gray-200 dark:border-gray-800'
                                    }`}
                            />
                            {errors.name && <p className="mt-1 text-sm text-error-500">{errors.name}</p>}
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
                                className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.category ? 'border-error-500' : 'border-gray-200 dark:border-gray-800'
                                    }`}
                            >
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
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing & Stock */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        التسعير والمخزون
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                سعر الوحدة ({currency}) <span className="text-error-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                step="0.01"
                                className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.price ? 'border-error-500' : 'border-gray-200 dark:border-gray-800'
                                    }`}
                            />
                            {errors.price && <p className="mt-1 text-sm text-error-500">{errors.price}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                الحد الأدنى للطلب <span className="text-error-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="minOrder"
                                value={formData.minOrder}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.minOrder ? 'border-error-500' : 'border-gray-200 dark:border-gray-800'
                                    }`}
                            />
                            {errors.minOrder && <p className="mt-1 text-sm text-error-500">{errors.minOrder}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                الكمية المتاحة <span className="text-error-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.stock ? 'border-error-500' : 'border-gray-200 dark:border-gray-800'
                                    }`}
                            />
                            {errors.stock && <p className="mt-1 text-sm text-error-500">{errors.stock}</p>}
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                        صور المنتج
                    </h2>

                    <div>
                        {/* Existing Images */}
                        {existingImages.length > 0 && (
                            <div className="mb-4">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الصور الحالية</p>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {existingImages.map((img, index) => (
                                        <div key={index} className="relative group">
                                            <div className="w-full h-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(index)}
                                                className="absolute top-2 left-2 p-1 bg-error-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            إضافة صور جديدة
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="hidden"
                            id="image-upload"
                        />
                        <label
                            htmlFor="image-upload"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                            <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span className="text-sm text-gray-600 dark:text-gray-400">انقر لرفع صور جديدة</span>
                        </label>
                        {errors.images && <p className="mt-1 text-sm text-error-500">{errors.images}</p>}

                        {/* New Image Previews */}
                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={preview}
                                            alt={`New ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-800"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(index)}
                                            className="absolute top-2 left-2 p-1 bg-error-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
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
                        {/* Existing Certificates */}
                        {existingCerts.length > 0 && (
                            <div className="mb-4">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">الشهادات الحالية</p>
                                <div className="space-y-3">
                                    {existingCerts.map((cert, index) => (
                                        <div key={cert.id} className="flex items-center gap-4 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{cert.type}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{cert.fileUrl}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeExistingCert(index)}
                                                className="flex-shrink-0 p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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
                            <span className="text-sm text-gray-600 dark:text-gray-400">انقر لرفع شهادات جديدة (PDF أو صور)</span>
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
                        href="/factory/products"
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
                                <svg className="animate-spin h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
