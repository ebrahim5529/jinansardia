"use client";

import React from "react";
import Loader from "./Loader";

type LoaderSize = "sm" | "md" | "lg";

interface LoadingScreenProps {
  /** نص اختياري أسفل الـ loader */
  message?: string;
  /** حجم الـ loader */
  size?: LoaderSize;
  /** طبقة شفافة فوق المحتوى (غير fullscreen) */
  overlay?: boolean;
  /** ملء الشاشة بالكامل */
  fullScreen?: boolean;
  className?: string;
}

/**
 * شاشة تحميل قابلة لإعادة الاستخدام في كل الصفحات
 * @example
 * // شاشة تحميل كاملة
 * <LoadingScreen fullScreen message="جاري التحميل..." />
 *
 * @example
 * // overlay فوق محتوى الصفحة
 * <LoadingScreen overlay message="جاري الحفظ..." />
 *
 * @example
 * // داخل container
 * <LoadingScreen message="جاري الجلب..." />
 */
export default function LoadingScreen({
  message,
  size = "md",
  overlay = false,
  fullScreen = true,
  className = "",
}: LoadingScreenProps) {
  const baseClasses = "flex flex-col items-center justify-center gap-4";
  const overlayClasses = overlay ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm" : "";
  const fullScreenClasses = fullScreen ? "fixed inset-0 z-[9999]" : "min-h-[200px] w-full";

  return (
    <div
      className={`${baseClasses} ${overlayClasses} ${fullScreenClasses} ${className}`}
      role="status"
      aria-live="polite"
      aria-label={message || "جاري التحميل"}
    >
      <Loader size={size} className="text-brand-500" />
      {message && (
        <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">{message}</p>
      )}
    </div>
  );
}
