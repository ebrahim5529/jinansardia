"use client";

import React from "react";

type LoaderSize = "sm" | "md" | "lg";

const sizeMap: Record<LoaderSize, string> = {
  sm: "w-[30px]",
  md: "w-[45px]",
  lg: "w-[60px]",
};

export default function Loader({ size = "md", className = "" }: { size?: LoaderSize; className?: string }) {
  return (
    <div
      className={`loader ${sizeMap[size]} aspect-square ${className}`}
      role="status"
      aria-label="جاري التحميل"
    />
  );
}
