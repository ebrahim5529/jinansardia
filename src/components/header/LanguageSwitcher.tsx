"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Locale = "en" | "ar";

const LanguageSwitcher = () => {
    const [locale, setLocale] = useState<Locale>("ar");
    const router = useRouter();

    useEffect(() => {
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(";").shift();
            return null;
        };
        const current = getCookie("NEXT_LOCALE") as Locale;
        if (current) setLocale(current);
    }, []);

    const switchLocale = async (newLocale: Locale) => {
        try {
            await fetch('/api/locale', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ locale: newLocale }),
            });
            window.location.reload();
        } catch (error) {
            console.error("Failed to switch locale:", error);
            // Fallback to cookie setting
            document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
            window.location.reload();
        }
    };

    return (
        <div className="relative inline-block border-2 border-brand-500 rounded-lg p-1">
            <button
                onClick={() => switchLocale(locale === "en" ? "ar" : "en")}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-gray-800 bg-white hover:bg-gray-100 rounded-md transition-all dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 shadow-md"
            >
                {locale === "en" ? (
                    <span className="flex items-center gap-2">
                        <span className="text-xl">🇺🇸</span>
                        <span>EN</span>
                    </span>
                ) : (
                    <span className="flex items-center gap-2">
                        <span className="text-xl">🇸🇦</span>
                        <span>AR</span>
                    </span>
                )}
            </button>
        </div>
    );
};

export default LanguageSwitcher;
