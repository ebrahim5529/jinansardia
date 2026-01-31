import React from "react";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    text?: string;
    className?: string;
}

const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12"
};

export default function LoadingSpinner({
    size = "md",
    text,
    className = ""
}: LoadingSpinnerProps) {
    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 dark:border-gray-800 border-t-brand-500`} />
            {text && (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    {text}
                </p>
            )}
        </div>
    );
}
