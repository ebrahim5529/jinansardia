"use client";

import { BellIcon } from "@/icons";

export default function AdminHeader() {
    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
            <div className="flex items-center gap-4">
                {/* Breadcrumbs or Title could go here dynamically */}
                <h2 className="text-lg font-semibold text-slate-700">مرحباً، المدير العام 👋</h2>
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-slate-500 hover:text-blue-600 transition-colors rounded-full hover:bg-slate-100">
                    <BellIcon className="w-6 h-6" />
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="text-left hidden md:block">
                        <p className="text-sm font-bold text-slate-800">Admin User</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider text-right">Super Admin</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-blue-100 cursor-pointer hover:ring-blue-300 transition-all">
                        AD
                    </div>
                </div>
            </div>
        </header>
    );
}
