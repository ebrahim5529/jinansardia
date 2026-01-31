"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function FactoryCurrencySettingsPage() {
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
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    try {
      const savedCurrency = window.localStorage.getItem("factory.settings.currency");
      if (savedCurrency) {
        setCurrency(savedCurrency);
      }
    } catch {
      setCurrency("SAR");
    }
  }, []);

  const save = async () => {
    setIsSaving(true);
    try {
      window.localStorage.setItem("factory.settings.currency", currency);
    } finally {
      setTimeout(() => setIsSaving(false), 400);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <Link href="/factory/settings" className="hover:text-brand-500">
            الإعدادات
          </Link>
          <span>/</span>
          <span>العملة</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">إعدادات العملة</h1>
        <p className="text-gray-600 dark:text-gray-400">اختر العملة المستخدمة في التسعير</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">العملة</h2>
          <button
            type="button"
            onClick={save}
            disabled={isSaving}
            className="px-6 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSaving ? "جاري الحفظ..." : "حفظ"}
          </button>
        </div>

        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">اختر العملة</label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          {currencyOptions.map((opt) => (
            <option key={opt.code} value={opt.code}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
