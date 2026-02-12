"use client";

import { useEffect, useState } from "react";
import AreaChartOne from "@/components/charts/area/AreaChartOne";
import BarChartOne from "@/components/charts/bar/BarChartOne";
import LineChartOne from "@/components/charts/line/LineChartOne";
import PieChartOne from "@/components/charts/pie/PieChartOne";
import MixedChartOne from "@/components/charts/mixed/MixedChartOne";
import { GridIcon, PlusIcon, TaskIcon, UserIcon } from "@/icons";

export default function DashboardClient() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const stats = {
    factories: 24,
    hospitals: 56,
    totalOrders: 1245,
    newUsers: 12,
  };

  if (!isMounted) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          لوحة تحكم الأدمن
        </h1>
        <p className="text-gray-600 dark:text-gray-400">نظرة شاملة على أداء النظام</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">المصانع المسجلة</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.factories}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <GridIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">المستشفيات النشطة</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.hospitals}</p>
            </div>
            <div className="bg-success-100 dark:bg-success-900/30 p-3 rounded-lg">
              <PlusIcon className="w-8 h-8 text-success-600 dark:text-success-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">إجمالي الطلبات</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
              <TaskIcon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">مستخدمين جدد</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.newUsers}</p>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
              <UserIcon className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">الإيرادات والتكاليف</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">مقارنة بين الإيرادات والتكاليف الشهرية</p>
            </div>
            <AreaChartOne />
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <PieChartOne />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">الطلبات الشهرية</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">إجمالي الطلبات لكل شهر</p>
            </div>
            <BarChartOne />
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">اتجاهات المبيعات والإيرادات</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">تحليل المبيعات والإيرادات على مدار السنة</p>
            </div>
            <LineChartOne />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <MixedChartOne />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">آخر النشاطات</h2>
        </div>
        <div className="p-6 space-y-4">
          {[
            { text: 'طلب جديد #1024 من مستشفى "الأمل"', time: "منذ 2 ساعة", status: "pending" },
            { text: 'تسجيل مصنع "الخليج للأدوية"', time: "منذ 5 ساعات", status: "active" },
            { text: "اكتمال طلب #998", time: "أمس", status: "completed" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    item.status === "active"
                      ? "bg-green-500"
                      : item.status === "pending"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                  }`}
                ></div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{item.text}</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
