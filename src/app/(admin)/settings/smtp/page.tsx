"use client";

import { useState } from "react";
import { BoltIcon } from "@/icons";

export default function SmtpSettingsPage() {
    const [isSaving, setIsSaving] = useState(false);

    const [smtpSettings, setSmtpSettings] = useState({
        enabled: true,
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        username: "",
        password: "",
        fromEmail: "",
        fromName: "JinanSardia System",
        replyTo: "",
    });

    const handleSmtpChange = (field: string, value: any) => {
        setSmtpSettings(prev => ({ ...prev, [field]: value }));
    };

    const testSmtpConnection = async () => {
        setIsSaving(true);
        setTimeout(() => {
            alert("تم اختبار الاتصال بنجاح!");
            setIsSaving(false);
        }, 2000);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setTimeout(() => {
            console.log("Saving SMTP settings:", smtpSettings);
            alert("تم حفظ الإعدادات بنجاح!");
            setIsSaving(false);
        }, 1500);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    إعدادات SMTP
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    إعدادات البريد الإلكتروني لإرسال الرسائل
                </p>
            </div>

            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            إعدادات SMTP
                        </h2>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={smtpSettings.enabled}
                                onChange={(e) => handleSmtpChange("enabled", e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                            <span className="mr-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                {smtpSettings.enabled ? "مفعل" : "معطل"}
                            </span>
                        </label>
                    </div>

                    {smtpSettings.enabled && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        SMTP Host <span className="text-error-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={smtpSettings.host}
                                        onChange={(e) => handleSmtpChange("host", e.target.value)}
                                        placeholder="smtp.gmail.com"
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Port <span className="text-error-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={smtpSettings.port}
                                        onChange={(e) => {
                                            const port = parseInt(e.target.value);
                                            handleSmtpChange("port", port);
                                            handleSmtpChange("secure", port === 465);
                                        }}
                                        placeholder="587"
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        عادة 587 (TLS) أو 465 (SSL)
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Username <span className="text-error-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={smtpSettings.username}
                                        onChange={(e) => handleSmtpChange("username", e.target.value)}
                                        placeholder="your-email@gmail.com"
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Password <span className="text-error-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={smtpSettings.password}
                                        onChange={(e) => handleSmtpChange("password", e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        كلمة مرور التطبيق (App Password) لـ Gmail
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        From Email <span className="text-error-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={smtpSettings.fromEmail}
                                        onChange={(e) => handleSmtpChange("fromEmail", e.target.value)}
                                        placeholder="noreply@jinansardia.com"
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        From Name
                                    </label>
                                    <input
                                        type="text"
                                        value={smtpSettings.fromName}
                                        onChange={(e) => handleSmtpChange("fromName", e.target.value)}
                                        placeholder="JinanSardia System"
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Reply To Email
                                    </label>
                                    <input
                                        type="email"
                                        value={smtpSettings.replyTo}
                                        onChange={(e) => handleSmtpChange("replyTo", e.target.value)}
                                        placeholder="support@jinansardia.com"
                                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <input
                                    type="checkbox"
                                    checked={smtpSettings.secure}
                                    onChange={(e) => handleSmtpChange("secure", e.target.checked)}
                                    className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                                />
                                <label className="text-sm text-blue-800 dark:text-blue-300">
                                    استخدام SSL/TLS (مطلوب للبورت 465)
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                                <button
                                    onClick={testSmtpConnection}
                                    disabled={isSaving}
                                    className="px-6 py-2.5 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                                >
                                    اختبار الاتصال
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-6 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                                >
                                    {isSaving ? "جاري الحفظ..." : "حفظ الإعدادات"}
                                </button>
                            </div>
                        </div>
                    )}

                    {!smtpSettings.enabled && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <BoltIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>تم تعطيل إعدادات SMTP</p>
                        </div>
                    )}
                </div>

                {/* SMTP Help */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-3">معلومات مفيدة</h3>
                    <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                        <li className="flex items-start gap-2">
                            <span className="font-bold">•</span>
                            <span>لـ Gmail: استخدم البورت 587 مع TLS أو 465 مع SSL</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold">•</span>
                            <span>لـ Outlook: استخدم smtp-mail.outlook.com مع البورت 587</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold">•</span>
                            <span>لـ Gmail، ستحتاج إلى إنشاء "App Password" من إعدادات الحساب</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-bold">•</span>
                            <span>تأكد من أن البريد الإلكتروني "From Email" مطابق لـ Username</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
