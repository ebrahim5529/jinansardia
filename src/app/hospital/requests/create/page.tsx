"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/shared";
import { t, type Locale } from "@/locales/i18n";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
}

type ContractDuration = "1m" | "3m" | "6m" | "1y";

export default function HospitalCreateOrderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const factoryId = searchParams.get("factoryId") ?? "F-101";
  const productId = searchParams.get("productId") ?? "P-1";

  const [locale, setLocale] = useState<Locale>("ar");

  useEffect(() => {
    const currentLocale = getCookie("NEXT_LOCALE") as Locale;
    if (currentLocale === "en" || currentLocale === "ar") {
      setLocale(currentLocale);
    }
  }, []);

  const factory = useMemo(
    () => ({
      id: factoryId,
      nameAr: factoryId === "F-102" ? "مصنع النور" : factoryId === "F-103" ? "مصنع الحياة" : "مصنع الشفاء",
      nameEn: factoryId === "F-102" ? "Al-Noor Factory" : factoryId === "F-103" ? "Al-Hayat Factory" : "Al-Shifa Factory",
    }),
    [factoryId]
  );

  const product = useMemo(
    () => ({
      id: productId,
      nameAr: productId === "P-2" ? "معقمات يد" : productId === "P-3" ? "شاش طبي" : "قفازات طبية",
      nameEn: productId === "P-2" ? "Hand Sanitizer" : productId === "P-3" ? "Medical Gauze" : "Medical Gloves",
      specsAr: "مواصفات مختصرة للمنتج",
      specsEn: "Short product specifications",
      priceSar: productId === "P-2" ? 35 : productId === "P-3" ? 18 : 280,
      imageUrl: "",
      minOrder: 100,
    }),
    [productId]
  );

  const [quantity, setQuantity] = useState<number>(100);
  const [duration, setDuration] = useState<ContractDuration>("3m");
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [notes, setNotes] = useState<string>("");

  const cost = useMemo(() => {
    const q = Number.isFinite(quantity) ? quantity : 0;
    const unit = product.priceSar;
    return {
      unit,
      subtotal: q * unit,
    };
  }, [product.priceSar, quantity]);

  const [errors, setErrors] = useState<{ quantity?: string; startDate?: string }>(() => ({}));

  const validate = () => {
    const next: { quantity?: string; startDate?: string } = {};

    if (!quantity || quantity < product.minOrder) {
      next.quantity = t(locale, "hospital.requests.create.validation.quantityMin");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const chosen = new Date(startDate);
    chosen.setHours(0, 0, 0, 0);
    if (Number.isNaN(chosen.getTime()) || chosen.getTime() < today.getTime()) {
      next.startDate = t(locale, "hospital.requests.create.validation.startDateMin");
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    router.push("/hospital/requests");
  };

  const factoryName = locale === "ar" ? factory.nameAr : factory.nameEn;
  const productName = locale === "ar" ? product.nameAr : product.nameEn;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t(locale, "hospital.requests.create.title")}
        description={t(locale, "hospital.requests.create.subtitle")}
        breadcrumbs={[
          { label: t(locale, "hospital.dashboard.title"), href: "/hospital" },
          { label: t(locale, "hospital.requests.current.title"), href: "/hospital/requests" },
          { label: t(locale, "hospital.requests.create.title") },
        ]}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t(locale, "hospital.requests.create.sections.factory")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t(locale, "hospital.requests.create.factoryName")}</div>
                <div className="font-medium text-gray-900 dark:text-white">{factoryName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t(locale, "hospital.requests.create.factoryId")}</div>
                <div className="font-medium text-gray-900 dark:text-white">{factory.id}</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t(locale, "hospital.requests.create.sections.product")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t(locale, "hospital.requests.create.productName")}</div>
                <div className="font-medium text-gray-900 dark:text-white">{productName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t(locale, "hospital.requests.create.unitPrice")}</div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {product.priceSar.toLocaleString()} {t(locale, "common.sar")}
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">{t(locale, "hospital.requests.create.specs")}</div>
                <div className="font-medium text-gray-900 dark:text-white">{locale === "ar" ? product.specsAr : product.specsEn}</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t(locale, "hospital.requests.create.sections.order")}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t(locale, "hospital.requests.create.quantity")} ({t(locale, "hospital.requests.create.minOrder")}: {product.minOrder})
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                {errors.quantity && <div className="mt-2 text-sm text-error-600">{errors.quantity}</div>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t(locale, "hospital.requests.create.duration")}</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value as ContractDuration)}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="1m">{t(locale, "hospital.requests.create.duration.1m")}</option>
                  <option value="3m">{t(locale, "hospital.requests.create.duration.3m")}</option>
                  <option value="6m">{t(locale, "hospital.requests.create.duration.6m")}</option>
                  <option value="1y">{t(locale, "hospital.requests.create.duration.1y")}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t(locale, "hospital.requests.create.startDate")}</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                {errors.startDate && <div className="mt-2 text-sm text-error-600">{errors.startDate}</div>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t(locale, "hospital.requests.create.notes")}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={submit}
                className="px-6 py-2.5 bg-error-600 text-white rounded-lg hover:bg-error-700 transition-colors font-medium"
              >
                {t(locale, "hospital.requests.create.submit")}
              </button>
              <button
                onClick={() => router.back()}
                className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                {t(locale, "hospital.requests.create.cancel")}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t(locale, "hospital.requests.create.cost.title")}</h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>{t(locale, "hospital.requests.create.cost.unitPrice")}</span>
                <span>
                  {cost.unit.toLocaleString()} {t(locale, "common.sar")}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>{t(locale, "hospital.requests.create.cost.quantity")}</span>
                <span>{quantity.toLocaleString()}</span>
              </div>
              <div className="h-px bg-gray-200 dark:bg-gray-800" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{t(locale, "hospital.requests.create.cost.total")}</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {cost.subtotal.toLocaleString()} {t(locale, "common.sar")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
