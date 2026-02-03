import { ReactNode } from "react";
import clsx from "clsx";

interface KPICardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    trend?: string;
    trendUp?: boolean;
    color?: "blue" | "green" | "purple" | "orange" | "red";
}

export default function KPICard({ title, value, icon, trend, trendUp, color = "blue" }: KPICardProps) {
    const colorStyles = {
        blue: "bg-blue-50 text-blue-600 ring-blue-100",
        green: "bg-emerald-50 text-emerald-600 ring-emerald-100",
        purple: "bg-purple-50 text-purple-600 ring-purple-100",
        orange: "bg-orange-50 text-orange-600 ring-orange-100",
        red: "bg-red-50 text-red-600 ring-red-100",
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-2">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
                </div>
                <div className={clsx("p-3.5 rounded-xl ring-1", colorStyles[color])}>
                    {icon}
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={clsx("font-semibold flex items-center gap-1", trendUp ? "text-emerald-600" : "text-red-500")}>
                        {trendUp ? "↑" : "↓"} {trend}
                    </span>
                    <span className="text-slate-400 mx-1.5 font-light">مقارنة بالشهر الماضي</span>
                </div>
            )}
        </div>
    );
}
