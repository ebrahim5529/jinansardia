"use client";

import { useEffect, useMemo, useState } from "react";

export default function SettingsPage() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const currencyOptions = useMemo(
        () => [
            { code: "SAR", label: "ريال سعودي (SAR)" },
            { code: "AED", label: "درهم إماراتي (AED)" },
            { code: "KWD", label: "دينار كويتي (KWD)" },
            { code: "QAR", label: "ريال قطري (QAR)" },
            { code: "USD", label: "دولار أمريكي (USD)" },
            { code: "EUR", label: "يورو (EUR)" },
        ],
        [],
    );

    const [currency, setCurrency] = useState<string>("SAR");
    const [categories, setCategories] = useState<string[]>([]);
    const [newCategory, setNewCategory] = useState<string>("");
    const [isSavingSettings, setIsSavingSettings] = useState(false);

    const [notifications, setNotifications] = useState({
        newOrders: true,
        orderUpdates: true,
        offerExpiry: false,
        emailNotifications: true,
        smsNotifications: false
    });

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsChangingPassword(true);

        setTimeout(() => {
            console.log("Password changed");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setIsChangingPassword(false);
        }, 1500);
    };

    const handleNotificationToggle = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

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
            } else {
                setCategories([
                    "مستهلكات طبية",
                    "معدات حماية",
                    "أثاث طبي",
                    "معدات طبية",
                    "أدوات جراحية",
                    "مستلزمات المختبر",
                ]);
            }
        } catch {
            setCurrency("SAR");
            setCategories([
                "مستهلكات طبية",
                "معدات حماية",
                "أثاث طبي",
                "معدات طبية",
                "أدوات جراحية",
                "مستلزمات المختبر",
            ]);
        }
    }, []);

    const saveSettings = async () => {
        setIsSavingSettings(true);
        try {
            window.localStorage.setItem("factory.settings.currency", currency);
            window.localStorage.setItem("factory.settings.categories", JSON.stringify(categories));
        } finally {
            setTimeout(() => setIsSavingSettings(false), 400);
        }
    };

    const addCategory = () => {
        const trimmed = newCategory.trim();
        if (!trimmed) return;
        if (categories.some((c) => c.trim() === trimmed)) return;
        setCategories((prev) => [...prev, trimmed]);
        setNewCategory("");
    };

    const removeCategory = (index: number) => {
        setCategories((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    الإعدادات
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    إدارة حساب المستخدم وأمانه
                </p>
            </div>

            {/* Account Settings */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    الحساب
                </h2>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        البريد الإلكتروني
                    </label>
                    <input
                        type="email"
                        value="info@alamal-medical.com"
                        disabled
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        لتغيير البريد الإلكتروني، يرجى التواصل مع الدعم الفني
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        إعدادات المتجر
                    </h2>
                    <button
                        type="button"
                        onClick={saveSettings}
                        disabled={isSavingSettings}
                        className="px-6 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        {isSavingSettings ? "جاري الحفظ..." : "حفظ الإعدادات"}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div id="currency">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            العملة
                        </label>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                            {currencyOptions.map((opt) => (
                                <option key={opt.code} value={opt.code}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div id="categories">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            الفئات
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                placeholder="أضف فئة جديدة"
                            />
                            <button
                                type="button"
                                onClick={addCategory}
                                className="px-4 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-medium"
                            >
                                إضافة
                            </button>
                        </div>
                        <div className="mt-4 space-y-2">
                            {categories.length === 0 ? (
                                <div className="text-sm text-gray-500 dark:text-gray-400">لا توجد فئات</div>
                            ) : (
                                categories.map((cat, index) => (
                                    <div key={`${cat}-${index}`} className="flex items-center justify-between gap-3 px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg">
                                        <div className="text-sm text-gray-900 dark:text-white">{cat}</div>
                                        <button
                                            type="button"
                                            onClick={() => removeCategory(index)}
                                            className="px-3 py-1.5 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors font-medium"
                                        >
                                            حذف
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    الأمان
                </h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            كلمة المرور الحالية
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            كلمة المرور الجديدة
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            تأكيد كلمة المرور
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                        className="px-6 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        {isChangingPassword ? "جاري التغيير..." : "تغيير كلمة المرور"}
                    </button>
                </form>
            </div>

            {/* Notifications Settings */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    الإشعارات
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">إشعارات الطلبات الجديدة</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">تلقي إشعار عند استلام طلب جديد</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifications.newOrders}
                                onChange={() => handleNotificationToggle('newOrders')}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">إشعارات تحديث الطلبات</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">تلقي إشعار عند تحديث حالة الطلب</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifications.orderUpdates}
                                onChange={() => handleNotificationToggle('orderUpdates')}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">إشعارات انتهاء العروض</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">تلقي إشعار قبل انتهاء العرض بيومين</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifications.offerExpiry}
                                onChange={() => handleNotificationToggle('offerExpiry')}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">إشعارات البريد الإلكتروني</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">إرسال الإشعارات عبر البريد الإلكتروني</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifications.emailNotifications}
                                onChange={() => handleNotificationToggle('emailNotifications')}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between py-3">
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white">إشعارات الرسائل النصية</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">إرسال الإشعارات عبر SMS</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifications.smsNotifications}
                                onChange={() => handleNotificationToggle('smsNotifications')}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-xl p-6">
                <h2 className="text-xl font-bold text-error-900 dark:text-error-200 mb-4">
                    المنطقة الخطرة
                </h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-error-900 dark:text-error-200">إيقاف الحساب</p>
                        <p className="text-sm text-error-700 dark:text-error-300 mt-1">
                            إيقاف الحساب بشكل مؤقت حتى إعادة التفعيل
                        </p>
                    </div>
                    <button className="px-4 py-2 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors font-medium">
                        إيقاف الحساب
                    </button>
                </div>
            </div>
        </div>
    );
}
