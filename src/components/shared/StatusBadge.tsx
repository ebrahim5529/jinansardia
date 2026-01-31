import React from "react";

type BadgeVariant = "success" | "error" | "warning" | "info" | "purple" | "gray";

interface StatusBadgeProps {
    label: string;
    variant: BadgeVariant;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
    success: "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400",
    error: "bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-400",
    warning: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
};

const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
};

export default function StatusBadge({
    label,
    variant,
    size = "md",
    className = ""
}: StatusBadgeProps) {
    return (
        <span
            className={`inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        >
            {label}
        </span>
    );
}
