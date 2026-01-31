import React from "react";

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: {
        label: string;
        icon?: React.ReactNode;
        onClick: () => void;
    };
    breadcrumbs?: { label: string; href?: string }[];
}

export default function PageHeader({
    title,
    description,
    action,
    breadcrumbs
}: PageHeaderProps) {
    return (
        <div className="mb-6">
            {breadcrumbs && breadcrumbs.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={index}>
                            {crumb.href ? (
                                <a href={crumb.href} className="hover:text-brand-500">
                                    {crumb.label}
                                </a>
                            ) : (
                                <span>{crumb.label}</span>
                            )}
                            {index < breadcrumbs.length - 1 && <span>/</span>}
                        </React.Fragment>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-gray-600 dark:text-gray-400">
                            {description}
                        </p>
                    )}
                </div>

                {action && (
                    <button
                        onClick={action.onClick}
                        className="px-6 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors font-medium flex items-center gap-2"
                    >
                        {action.icon}
                        {action.label}
                    </button>
                )}
            </div>
        </div>
    );
}
