"use client";

import { useState, useEffect } from "react";
import { BoltIcon } from "@/icons";

interface FooterSettings {
    description: string;
    email: string;
    phone: string;
    address: string;
    copyright: string;
    links: Array<{ label: string; url: string }>;
    social: {
        linkedin?: string;
        twitter?: string;
        facebook?: string;
    };
}

export default function WebsiteSettingsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("footer");
    const [successMessage, setSuccessMessage] = useState("");

    const [footerSettings, setFooterSettings] = useState<FooterSettings>({
        description: "",
        email: "",
        phone: "",
        address: "",
        copyright: "",
        links: [
            { label: "", url: "" },
            { label: "", url: "" },
            { label: "", url: "" },
            { label: "", url: "" },
        ],
        social: {
            linkedin: "",
            twitter: "",
            facebook: "",
        },
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await fetch("/api/admin/website-settings");
            const data = await response.json();

            if (response.ok) {
                setFooterSettings({
                    description: data["footer.description"] || "",
                    email: data["footer.email"] || "",
                    phone: data["footer.phone"] || "",
                    address: data["footer.address"] || "",
                    copyright: data["footer.copyright"] || "",
                    links: JSON.parse(data["footer.links"] || "[]"),
                    social: JSON.parse(data["footer.social"] || "{}"),
                });
            }
        } catch (error) {
            console.error("Error loading settings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFooterChange = (field: keyof FooterSettings, value: any) => {
        setFooterSettings((prev) => ({ ...prev, [field]: value }));
    };

    const handleLinkChange = (index: number, field: "label" | "url", value: string) => {
        const newLinks = [...footerSettings.links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        handleFooterChange("links", newLinks);
    };

    const handleSocialChange = (platform: string, value: string) => {
        handleFooterChange("social", {
            ...footerSettings.social,
            [platform]: value,
        });
    };

    const addLink = () => {
        handleFooterChange("links", [...footerSettings.links, { label: "", url: "" }]);
    };

    const removeLink = (index: number) => {
        const newLinks = footerSettings.links.filter((_, i) => i !== index);
        handleFooterChange("links", newLinks);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSuccessMessage("");

        try {
            const settings = {
                "footer.description": footerSettings.description,
                "footer.email": footerSettings.email,
                "footer.phone": footerSettings.phone,
                "footer.address": footerSettings.address,
                "footer.copyright": footerSettings.copyright,
                "footer.links": JSON.stringify(footerSettings.links),
                "footer.social": JSON.stringify(footerSettings.social),
            };

            const response = await fetch("/api/admin/website-settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ settings }),
            });

            if (response.ok) {
                setSuccessMessage("تم حفظ الإعدادات بنجاح!");
                setTimeout(() => setSuccessMessage(""), 3000);
            } else {
                const error = await response.json();
                alert(error.error || "فشل حفظ الإعدادات");
            }
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("فشل حفظ الإعدادات");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">جاري التحميل...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    إعدادات الموقع
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    إدارة محتوى الموقع ومعلومات Footer
                </p>
            </div>

            {successMessage && (
                <div className="bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg p-4 text-success-800 dark:text-success-300">
                    {successMessage}
                </div>
            )}

            {/* Footer Settings */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    إعدادات Footer
                </h2>

                <div className="space-y-6">
                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            وصف الشركة
                        </label>
                        <textarea
                            value={footerSettings.description}
                            onChange={(e) => handleFooterChange("description", e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            placeholder="وصف الشركة..."
                        />
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                البريد الإلكتروني
                            </label>
                            <input
                                type="email"
                                value={footerSettings.email}
                                onChange={(e) => handleFooterChange("email", e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                placeholder="info@jinansardia.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                رقم الهاتف
                            </label>
                            <input
                                type="tel"
                                value={footerSettings.phone}
                                onChange={(e) => handleFooterChange("phone", e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                placeholder="+86 531 8888 9999"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                العنوان
                            </label>
                            <input
                                type="text"
                                value={footerSettings.address}
                                onChange={(e) => handleFooterChange("address", e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                placeholder="Jinan, Shandong Province, China"
                            />
                        </div>
                    </div>

                    {/* Copyright */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            نص حقوق النشر
                        </label>
                        <input
                            type="text"
                            value={footerSettings.copyright}
                            onChange={(e) => handleFooterChange("copyright", e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                            placeholder="© 2024 JinanSardia. All rights reserved."
                        />
                    </div>

                    {/* Quick Links */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                الروابط السريعة
                            </label>
                            <button
                                onClick={addLink}
                                className="text-sm text-brand-500 hover:text-brand-600 font-medium"
                            >
                                + إضافة رابط
                            </button>
                        </div>
                        <div className="space-y-3">
                            {footerSettings.links.map((link, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={link.label}
                                        onChange={(e) => handleLinkChange(index, "label", e.target.value)}
                                        placeholder="نص الرابط"
                                        className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                    <input
                                        type="url"
                                        value={link.url}
                                        onChange={(e) => handleLinkChange(index, "url", e.target.value)}
                                        placeholder="URL"
                                        className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                    {footerSettings.links.length > 1 && (
                                        <button
                                            onClick={() => removeLink(index)}
                                            className="px-3 py-2 text-error-600 hover:bg-error-50 dark:hover:bg-error-900/20 rounded-lg transition-colors"
                                        >
                                            حذف
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Social Media Links */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                            روابط وسائل التواصل الاجتماعي
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">LinkedIn</label>
                                <input
                                    type="url"
                                    value={footerSettings.social.linkedin || ""}
                                    onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    placeholder="https://linkedin.com/company/..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">Twitter</label>
                                <input
                                    type="url"
                                    value={footerSettings.social.twitter || ""}
                                    onChange={(e) => handleSocialChange("twitter", e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    placeholder="https://twitter.com/..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">Facebook</label>
                                <input
                                    type="url"
                                    value={footerSettings.social.facebook || ""}
                                    onChange={(e) => handleSocialChange("facebook", e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    placeholder="https://facebook.com/..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
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
