"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Load ApexCharts dynamically as it relies on window object
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function OrdersChart() {
    const options: ApexOptions = {
        chart: {
            type: 'area',
            height: 350,
            toolbar: { show: false },
            fontFamily: 'inherit'
        },
        colors: ['#3b82f6', '#10b981'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 2 },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.4,
                opacityTo: 0.05,
                stops: [0, 90, 100]
            }
        },
        xaxis: {
            categories: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو'],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: { style: { colors: '#94a3b8' } }
        },
        yaxis: {
            labels: { style: { colors: '#94a3b8' } }
        },
        grid: {
            borderColor: '#f1f5f9',
            strokeDashArray: 4,
        },
        tooltip: {
            theme: 'light',
            y: { formatter: (val) => `${val} طلب` }
        },
        legend: { position: 'top', horizontalAlign: 'right' }
    };

    const series = [
        { name: 'الطلبات المكتملة', data: [31, 40, 28, 51, 42, 109, 100] },
        { name: 'الطلبات الجديدة', data: [11, 32, 45, 32, 34, 52, 41] }
    ];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">تحليل الطلبات الشهرية</h3>
            <div dir="ltr">
                <ReactApexChart options={options} series={series} type="area" height={350} />
            </div>
        </div>
    );
}

export function StatusChart() {
    const options: ApexOptions = {
        chart: { type: 'donut', fontFamily: 'inherit' },
        labels: ['قيد التنفيذ', 'مكتملة', 'ملغاة', 'قيد الانتظار'],
        colors: ['#3b82f6', '#10b981', '#ef4444', '#f59e0b'],
        plotOptions: {
            pie: { donut: { size: '65%' } }
        },
        legend: { position: 'bottom' },
        dataLabels: { enabled: false }
    };

    const series = [44, 55, 13, 33];

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
            <h3 className="text-lg font-bold text-slate-800 mb-4">حالة النظام</h3>
            <div dir="ltr" className="flex items-center justify-center">
                <ReactApexChart options={options} series={series} type="donut" height={320} />
            </div>
        </div>
    );
}
