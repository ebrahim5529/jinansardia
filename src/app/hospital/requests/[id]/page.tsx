"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { PageHeader, StatusBadge } from "@/components/shared";
import { t, type Locale } from "@/locales/i18n";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
}

type OrderStatus = "new" | "inProgress" | "warehouse" | "completed";

type TimelineStep = {
  id: string;
  titleKey: string;
  date?: string;
  done: boolean;
};

type OrderDetails = {
  id: string;
  status: OrderStatus;
  orderDate: string;
  contractDuration: string;
  startDate: string;
  factory: {
    nameAr: string;
    nameEn: string;
    phone: string;
    email: string;
    addressAr: string;
    addressEn: string;
  };
  items: {
    productAr: string;
    productEn: string;
    quantity: number;
    priceSar: number;
  }[];
  notes: { by: string; date: string; text: string }[];
  timeline: TimelineStep[];
};

function statusVariant(status: OrderStatus): "info" | "warning" | "purple" | "success" {
  switch (status) {
    case "new":
      return "info";
    case "inProgress":
      return "warning";
    case "warehouse":
      return "purple";
    case "completed":
      return "success";
  }
}

export default function HospitalOrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const orderId = params?.id ?? "";

  const [locale, setLocale] = useState<Locale>("ar");

  useEffect(() => {
    const currentLocale = getCookie("NEXT_LOCALE") as Locale;
    if (currentLocale === "en" || currentLocale === "ar") {
      setLocale(currentLocale);
    }
  }, []);

  const order = useMemo<OrderDetails>(() => {
    const status: OrderStatus = orderId === "ORD-1038" ? "completed" : orderId === "ORD-1041" ? "warehouse" : orderId === "ORD-1039" ? "new" : "inProgress";

    const steps: TimelineStep[] = [
      { id: "submitted", titleKey: "hospital.orderDetails.timeline.submitted", date: "2026-01-27", done: true },
      { id: "factoryAccepted", titleKey: "hospital.orderDetails.timeline.factoryAccepted", date: status === "new" ? undefined : "2026-01-28", done: status !== "new" },
      { id: "inProgress", titleKey: "hospital.orderDetails.timeline.inProgress", date: status === "new" ? undefined : status === "warehouse" || status === "completed" ? "2026-01-29" : "2026-01-29", done: status !== "new" },
      { id: "deliveredToWarehouse", titleKey: "hospital.orderDetails.timeline.deliveredToWarehouse", date: status === "warehouse" || status === "completed" ? "2026-01-30" : undefined, done: status === "warehouse" || status === "completed" },
      { id: "readyToWithdraw", titleKey: "hospital.orderDetails.timeline.readyToWithdraw", date: status === "completed" ? "2026-01-31" : undefined, done: status === "completed" },
    ];

    return {
      id: orderId,
      status,
      orderDate: "2026-01-27",
      contractDuration: status === "completed" ? "3 months" : "6 months",
      startDate: "2026-02-01",
      factory: {
        nameAr: "مصنع الشفاء",
        nameEn: "Al-Shifa Factory",
        phone: "+966 50 000 0000",
        email: "factory@example.com",
        addressAr: "الرياض، المملكة العربية السعودية",
        addressEn: "Riyadh, Saudi Arabia",
      },
      items: [
        {
          productAr: "كمامات N95",
          productEn: "N95 Masks",
          quantity: 5000,
          priceSar: 7.5,
        },
      ],
      notes: [
        { by: "System", date: "2026-01-27", text: "Order created" },
      ],
      timeline: steps,
    };
  }, [orderId]);

  const statusText = (status: OrderStatus) => {
    if (status === "new") return t(locale, "hospital.orders.status.new");
    if (status === "inProgress") return t(locale, "hospital.orders.status.inProgress");
    if (status === "warehouse") return t(locale, "hospital.orders.status.warehouse");
    return t(locale, "hospital.orders.status.completed");
  };

  const factoryName = locale === "ar" ? order.factory.nameAr : order.factory.nameEn;
  const address = locale === "ar" ? order.factory.addressAr : order.factory.addressEn;

  const total = useMemo(() => order.items.reduce((sum, it) => sum + it.quantity * it.priceSar, 0), [order.items]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t(locale, "hospital.orderDetails.title")}
        description={`${t(locale, "hospital.orderDetails.orderId")}: ${order.id}`}
        breadcrumbs={[
          { label: t(locale, "hospital.dashboard.title"), href: "/hospital" },
          { label: t(locale, "hospital.requests.current.title"), href: "/hospital/requests" },
          { label: order.id },
        ]}
      />

      <div className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
        <div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{t(locale, "hospital.orderDetails.orderId")}</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{order.id}</div>
        </div>
        <StatusBadge label={statusText(order.status)} variant={statusVariant(order.status)} size="lg" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t(locale, "hospital.orderDetails.sections.orderInfo")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t(locale, "hospital.orderDetails.orderDate")}</div>
                <div className="font-medium text-gray-900 dark:text-white">{order.orderDate}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t(locale, "hospital.orderDetails.contractDuration")}</div>
                <div className="font-medium text-gray-900 dark:text-white">{order.contractDuration}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t(locale, "hospital.orderDetails.startDate")}</div>
                <div className="font-medium text-gray-900 dark:text-white">{order.startDate}</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t(locale, "hospital.orderDetails.sections.factoryInfo")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t(locale, "hospital.orderDetails.factoryName")}</div>
                <div className="font-medium text-gray-900 dark:text-white">{factoryName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t(locale, "hospital.orderDetails.factoryPhone")}</div>
                <div className="font-medium text-gray-900 dark:text-white">{order.factory.phone}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t(locale, "hospital.orderDetails.factoryEmail")}</div>
                <div className="font-medium text-gray-900 dark:text-white">{order.factory.email}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t(locale, "hospital.orderDetails.factoryAddress")}</div>
                <div className="font-medium text-gray-900 dark:text-white">{address}</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t(locale, "hospital.orderDetails.sections.items")}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t(locale, "hospital.orderDetails.table.product")}
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t(locale, "hospital.orderDetails.table.quantity")}
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t(locale, "hospital.orderDetails.table.price")}
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t(locale, "hospital.orderDetails.table.total")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {order.items.map((it, idx) => {
                    const productName = locale === "ar" ? it.productAr : it.productEn;
                    const rowTotal = it.quantity * it.priceSar;
                    return (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{productName}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{it.quantity.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {it.priceSar.toLocaleString()} {t(locale, "common.sar")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {rowTotal.toLocaleString()} {t(locale, "common.sar")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t(locale, "hospital.orderDetails.total")}</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {total.toLocaleString()} {t(locale, "common.sar")}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t(locale, "hospital.orderDetails.sections.notes")}</h2>
            <div className="space-y-3">
              {order.notes.map((n, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{n.by}</span>
                    <span>{n.date}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">{n.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t(locale, "hospital.orderDetails.sections.timeline")}</h2>
            <div className="space-y-4">
              {order.timeline.map((step) => (
                <div key={step.id} className="flex items-start gap-3">
                  <div
                    className={`mt-1 w-3 h-3 rounded-full ${step.done ? "bg-success-500" : "bg-gray-300 dark:bg-gray-700"}`}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{t(locale, step.titleKey)}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{step.date ?? t(locale, "hospital.orderDetails.timeline.pending")}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
