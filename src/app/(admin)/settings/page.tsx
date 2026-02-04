"use client";

import { useState } from "react";

export default function SettingsPage() {
    const [isSaving, setIsSaving] = useState(false);

    // General Settings
    const [generalSettings, setGeneralSettings] = useState({
        siteName: "JinanSardia",
        siteUrl: "https://jinansardia.com",
        timezone: "Asia/Riyadh",
        language: "ar",
        dateFormat: "DD/MM/YYYY",
        timeFormat: "24h",
    });

    const handleGeneralChange = (field: string, value: any) => {
        setGeneralSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setTimeout(() => {
            console.log("Saving general settings:", generalSettings);
            alert("تم حفظ الإعدادات بنجاح!");
            setIsSaving(false);
        }, 1500);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    الإعدادات العامة
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    إدارة إعدادات النظام الأساسية
                </p>
            </div>

            {/* General Settings */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                اسم الموقع
                            </label>
                            <input
                                type="text"
                                value={generalSettings.siteName}
                                onChange={(e) => handleGeneralChange("siteName", e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                رابط الموقع
                            </label>
                            <input
                                type="url"
                                value={generalSettings.siteUrl}
                                onChange={(e) => handleGeneralChange("siteUrl", e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                المنطقة الزمنية
                            </label>
                            <select
                                value={generalSettings.timezone}
                                onChange={(e) => handleGeneralChange("timezone", e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                                <option value="Asia/Dubai">دبي (GMT+4)</option>
                                <option value="Asia/Kuwait">الكويت (GMT+3)</option>
                                <option value="Asia/Qatar">قطر (GMT+3)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                اللغة الافتراضية
                            </label>
                            <select
                                value={generalSettings.language}
                                onChange={(e) => handleGeneralChange("language", e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="ar">العربية</option>
                                <option value="en">English</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                تنسيق التاريخ
                            </label>
                            <select
                                value={generalSettings.dateFormat}
                                onChange={(e) => handleGeneralChange("dateFormat", e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                تنسيق الوقت
                            </label>
                            <select
                                value={generalSettings.timeFormat}
                                onChange={(e) => handleGeneralChange("timeFormat", e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="24h">24 ساعة</option>
                                <option value="12h">12 ساعة</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-6 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {isSaving ? "جاري الحفظ..." : "حفظ الإعدادات"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
