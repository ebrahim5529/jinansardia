"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FactoryCategoriesSettingsPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    try {
      const savedCategoriesRaw = window.localStorage.getItem("factory.settings.categories");
      if (savedCategoriesRaw) {
        const parsed = JSON.parse(savedCategoriesRaw);
        if (Array.isArray(parsed)) {
          setCategories(parsed.filter((x) => typeof x === "string"));
          return;
        }
      }

      setCategories([
        "مستهلكات طبية",
        "معدات حماية",
        "أثاث طبي",
        "معدات طبية",
        "أدوات جراحية",
        "مستلزمات المختبر",
      ]);
    } catch {
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

  const save = async () => {
    setIsSaving(true);
    try {
      window.localStorage.setItem("factory.settings.categories", JSON.stringify(categories));
    } finally {
      setTimeout(() => setIsSaving(false), 400);
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
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <Link href="/factory/settings" className="hover:text-brand-500">
            الإعدادات
          </Link>
          <span>/</span>
          <span>الفئات</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">إعدادات الفئات</h1>
        <p className="text-gray-600 dark:text-gray-400">إضافة وحذف فئات المنتجات</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">الفئات</h2>
          <button
            type="button"
            onClick={save}
            disabled={isSaving}
            className="px-6 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isSaving ? "جاري الحفظ..." : "حفظ"}
          </button>
        </div>

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
              <div
                key={`${cat}-${index}`}
                className="flex items-center justify-between gap-3 px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg"
              >
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
  );
}
