"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    PieChartIcon,
    GridIcon,
    BoxIcon,
    TaskIcon,
    UserIcon,
    DocsIcon,
    BoltIcon,
    PlusIcon,
} from "@/icons";
import clsx from "clsx";

const menuItems = [
    { name: "لوحة التحكم", path: "/dashboard", icon: <PieChartIcon className="w-5 h-5" /> },
    { name: "المصانع", path: "/factories", icon: <GridIcon className="w-5 h-5" /> },
    { name: "المستشفيات", path: "/hospitals", icon: <PlusIcon className="w-5 h-5" /> }, // Plus represents Medical/Hospital
    { name: "الطلبات", path: "/orders", icon: <TaskIcon className="w-5 h-5" /> },
    { name: "المخزن", path: "/warehouse", icon: <BoxIcon className="w-5 h-5" /> },
    { name: "المستخدمين", path: "/users", icon: <UserIcon className="w-5 h-5" /> },
    { name: "التقارير", path: "/reports", icon: <DocsIcon className="w-5 h-5" /> },
    { name: "الإعدادات", path: "/settings", icon: <BoltIcon className="w-5 h-5" /> },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col shadow-xl fixed right-0 top-0 z-50">
            <div className="p-6 border-b border-slate-700 flex items-center justify-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                    لوحة الأدمن
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium",
                                isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <span className={clsx("transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")}>
                                {item.icon}
                            </span>
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="bg-slate-800/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 text-center">Admin System v1.0</p>
                </div>
            </div>
        </aside>
    );
}
