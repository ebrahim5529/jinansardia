"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { EmptyState, FilterDropdown, PageHeader, SearchBar, StatusBadge } from "@/components/shared";
import { t, type Locale } from "@/locales/i18n";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
}

type ClosedStatus = "completed" | "canceled" | "expired";

type HistoryRow = {
  id: string;
  factoryNameAr: string;
  factoryNameEn: string;
  productAr: string;
  productEn: string;
  quantity: number;
  deliveredAt: string;
  closedStatus: ClosedStatus;
};

function statusVariant(status: ClosedStatus): "success" | "error" | "gray" {
  switch (status) {
    case "completed":
      return "success";
    case "canceled":
      return "error";
    case "expired":
      return "gray";
  }
}

export default function HospitalOrderHistoryPage() {
  const [locale, setLocale] = useState<Locale>("ar");

  useEffect(() => {
    const currentLocale = getCookie("NEXT_LOCALE") as Locale;
    if (currentLocale === "en" || currentLocale === "ar") {
      setLocale(currentLocale);
    }
  }, []);

  const [search, setSearch] = useState("");
  const [factoryFilter, setFactoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<ClosedStatus | "all">("all");

  const rows = useMemo<HistoryRow[]>(
    () => [
      {
        id: "ORD-1012",
        factoryNameAr: "مصنع النور",
        factoryNameEn: "Al-Noor Factory",
        productAr: "قفازات طبية",
        productEn: "Medical Gloves",
        quantity: 10000,
        deliveredAt: "2025-12-20",
        closedStatus: "completed",
      },
      {
        id: "ORD-1008",
        factoryNameAr: "مصنع الحياة",
        factoryNameEn: "Al-Hayat Factory",
        productAr: "شاش طبي",
        productEn: "Medical Gauze",
        quantity: 2500,
        deliveredAt: "2025-12-05",
        closedStatus: "expired",
      },
      {
        id: "ORD-1003",
        factoryNameAr: "مصنع السلام",
        factoryNameEn: "Al-Salam Factory",
        productAr: "معقمات يد",
        productEn: "Hand Sanitizer",
        quantity: 500,
        deliveredAt: "2025-11-18",
        closedStatus: "canceled",
      },
    ],
    []
  );

  const factoryOptions = useMemo(() => {
    const options = [
      { value: "all", label: t(locale, "hospital.requests.history.filters.factory.all") },
      { value: "Al-Noor Factory", label: locale === "ar" ? "مصنع النور" : "Al-Noor Factory" },
      { value: "Al-Hayat Factory", label: locale === "ar" ? "مصنع الحياة" : "Al-Hayat Factory" },
      { value: "Al-Salam Factory", label: locale === "ar" ? "مصنع السلام" : "Al-Salam Factory" },
    ];

    return options;
  }, [locale]);

  const statusOptions = useMemo(
    () => [
      { value: "all", label: t(locale, "hospital.requests.history.filters.status.all") },
      { value: "completed", label: t(locale, "hospital.requests.history.status.completed") },
      { value: "canceled", label: t(locale, "hospital.requests.history.status.canceled") },
      { value: "expired", label: t(locale, "hospital.requests.history.status.expired") },
    ],
    [locale]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    const bySearch = (r: HistoryRow) => {
      if (!q) return true;
      const factory = (locale === "ar" ? r.factoryNameAr : r.factoryNameEn).toLowerCase();
      const product = (locale === "ar" ? r.productAr : r.productEn).toLowerCase();
      return r.id.toLowerCase().includes(q) || factory.includes(q) || product.includes(q);
    };

    const byFactory = (r: HistoryRow) => {
      if (factoryFilter === "all") return true;
      return r.factoryNameEn === factoryFilter;
    };

    const byStatus = (r: HistoryRow) => statusFilter === "all" || r.closedStatus === statusFilter;

    return rows.filter((r) => bySearch(r) && byFactory(r) && byStatus(r));
  }, [factoryFilter, locale, rows, search, statusFilter]);

  const statusLabel = (s: ClosedStatus) => {
    if (s === "completed") return t(locale, "hospital.requests.history.status.completed");
    if (s === "canceled") return t(locale, "hospital.requests.history.status.canceled");
    return t(locale, "hospital.requests.history.status.expired");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t(locale, "hospital.requests.history.title")}
        description={t(locale, "hospital.requests.history.subtitle")}
      />

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SearchBar value={search} onChange={setSearch} placeholder={t(locale, "hospital.requests.history.search.placeholder")} />
          <FilterDropdown
            value={factoryFilter}
            onChange={setFactoryFilter}
            options={factoryOptions}
            label={t(locale, "hospital.requests.history.filters.factory.label")}
          />
          <FilterDropdown
            value={statusFilter}
            onChange={(v) => setStatusFilter(v as any)}
            options={statusOptions}
            label={t(locale, "hospital.requests.history.filters.status.label")}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t(locale, "hospital.requests.history.table.orderId")}
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t(locale, "hospital.requests.history.table.factory")}
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t(locale, "hospital.requests.history.table.product")}
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t(locale, "hospital.requests.history.table.quantity")}
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t(locale, "hospital.requests.history.table.deliveredAt")}
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t(locale, "hospital.requests.history.table.closedStatus")}
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t(locale, "hospital.requests.history.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-brand-600 dark:text-brand-400">{r.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{locale === "ar" ? r.factoryNameAr : r.factoryNameEn}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{locale === "ar" ? r.productAr : r.productEn}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 dark:text-gray-400">{r.quantity.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{r.deliveredAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge label={statusLabel(r.closedStatus)} variant={statusVariant(r.closedStatus)} size="sm" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/hospital/requests/${r.id}`}
                      className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 text-sm font-medium"
                    >
                      {t(locale, "hospital.requests.history.table.viewDetails")} {locale === "ar" ? "←" : "→"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <EmptyState title={t(locale, "hospital.requests.history.empty.title")} description={t(locale, "hospital.requests.history.empty.subtitle")} />
        )}
      </div>
    </div>
  );
}
