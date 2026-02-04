"use client";
import React from "react";

import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function AreaChartOne() {
  const options: ApexOptions = {
    colors: ["#465fff", "#DF243B"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "area",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 3,
      colors: ["#09743b", "#e24053"],
    },
    xaxis: {
      categories: [
        "يناير",
        "فبراير",
        "مارس",
        "أبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#64748B",
          fontSize: "12px",
        },
      },
    },
    grid: {
      borderColor: "#E5E7EB",
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontSize: "14px",
      fontWeight: "400",
      markers: {
        size: 12,
        offsetX: -4,
      },
      itemMargin: {
        horizontal: 16,
        vertical: 8,
      },
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  };

  const series = [
    {
      name: "الإيرادات",
      data: [31, 40, 28, 51, 42, 109, 100, 120, 80, 90, 110, 130],
    },
    {
      name: "التكاليف",
      data: [11, 32, 45, 32, 34, 52, 41, 31, 45, 32, 34, 52],
    },
  ];

  return (
    <div className="col-span-12 rounded-xl border border-gray-200 bg-white px-6 pt-5.5 pb-5 dark:border-gray-800 dark:bg-gray-900 sm:px-7.5 xl:col-span-8">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
            الإيرادات والتكاليف
          </h5>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            مقارنة بين الإيرادات والتكاليف الشهرية
          </p>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartOne">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
}
