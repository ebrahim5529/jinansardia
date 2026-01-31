"use client";
import React from "react";

import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function PieChartOne() {
  const options: ApexOptions = {
    colors: ["#465fff", "#9CB9FF", "#DF243B", "#22824E"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "pie",
      height: 320,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: "Total",
              fontSize: "22px",
              fontWeight: "600",
              color: "#64748B",
            },
            value: {
              show: true,
              fontSize: "16px",
              fontWeight: "400",
              color: "#64748B",
            },
          },
        },
      },
    },
    labels: ["المنتجات النشطة", "المنتجات غير النشطة", "العروض", "الطلبات"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      position: "bottom",
      fontSize: "14px",
      fontWeight: "400",
      horizontalAlign: "center",
      markers: {
        size: 12,
        offsetX: -4,
      },
      itemMargin: {
        horizontal: 8,
        vertical: 8,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
            height: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const series = [245, 85, 12, 150];

  return (
    <div className="col-span-12 rounded-xl border border-gray-200 bg-white px-6 pt-5.5 pb-5 dark:border-gray-800 dark:bg-gray-900 sm:px-7.5 xl:col-span-4">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
            توزيع المنتجات
          </h5>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartOne" className="-ml-3.5">
          <ReactApexChart
            options={options}
            series={series}
            type="pie"
            height={320}
          />
        </div>
      </div>
    </div>
  );
}
