"use client";
import React from "react";

import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MixedChartOne() {
  const options: ApexOptions = {
    colors: ["#465fff", "#22824E"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "line",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "40%",
        borderRadius: 4,
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
      width: [3, 3],
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
    yaxis: [
      {
        title: {
          text: "الكمية",
        },
        labels: {
          style: {
            colors: "#64748B",
            fontSize: "12px",
          },
        },
      },
      {
        opposite: true,
        title: {
          text: "النسبة المئوية",
        },
        labels: {
          style: {
            colors: "#64748B",
            fontSize: "12px",
          },
        },
      },
    ],
    grid: {
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
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y) {
          if (typeof y !== "undefined") {
            return y.toFixed(0) + " وحدة";
          }
          return y;
        },
      },
    },
  };

  const series = [
    {
      name: "الإنتاج",
      type: "column",
      data: [440, 505, 414, 671, 227, 413, 201, 352],
    },
    {
      name: "معدل النمو",
      type: "line",
      data: [23, 42, 35, 27, 43, 22, 17, 31],
    },
  ];

  return (
    <div className="col-span-12 rounded-xl border border-gray-200 bg-white px-6 pt-5.5 pb-5 dark:border-gray-800 dark:bg-gray-900 sm:px-7.5">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
            الإنتاج ومعدل النمو
          </h5>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            تحليل الإنتاج الشهري ومعدل النمو السنوي
          </p>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartOne">
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={350}
          />
        </div>
      </div>
    </div>
  );
}
