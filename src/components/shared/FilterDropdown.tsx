import React from "react";

interface FilterOption {
    value: string;
    label: string;
}

interface FilterDropdownProps {
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    label?: string;
    className?: string;
}

export default function FilterDropdown({
    value,
    onChange,
    options,
    label,
    className = ""
}: FilterDropdownProps) {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                </label>
            )}
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
