"use client";

import { useState } from "react";

export default function NotificationsSettingsPage() {
    const [isSaving, setIsSaving] = useState(false);

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        orderNotifications: true,
        userNotifications: true,
        systemNotifications: true,
    });

    const handleNotificationToggle = (key: string) => {
        setNotificationSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setTimeout(() => {
            console.log("Saving notification settings:", notificationSettings);
            alert("تم حفظ الإعدادات بنجاح!");
            setIsSaving(false);
        }, 1500);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    إعدادات الإشعارات
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    إدارة تفضيلات الإشعارات للنظام
                </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    إعدادات الإشعارات
                </h2>

                <div className="space-y-4">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {key === "emailNotifications" && "الإشعارات عبر البريد الإلكتروني"}
                                    {key === "smsNotifications" && "الإشعارات عبر SMS"}
                                    {key === "pushNotifications" && "الإشعارات الفورية"}
                                    {key === "orderNotifications" && "إشعارات الطلبات"}
                                    {key === "userNotifications" && "إشعارات المستخدمين"}
                                    {key === "systemNotifications" && "إشعارات النظام"}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {key === "emailNotifications" && "تلقي الإشعارات عبر البريد الإلكتروني"}
                                    {key === "smsNotifications" && "تلقي الإشعارات عبر الرسائل النصية"}
                                    {key === "pushNotifications" && "تلقي الإشعارات الفورية في المتصفح"}
                                    {key === "orderNotifications" && "إشعارات عند إنشاء أو تحديث الطلبات"}
                                    {key === "userNotifications" && "إشعارات عند تسجيل مستخدمين جدد"}
                                    {key === "systemNotifications" && "إشعارات النظام المهمة"}
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={value}
                                    onChange={() => handleNotificationToggle(key)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                            </label>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 mt-6 border-t border-gray-200 dark:border-gray-800">
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
    );
}
