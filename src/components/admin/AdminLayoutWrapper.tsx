"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { Menu, Bell, Search, User } from "lucide-react";
import { usePathname } from "next/navigation";

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    // Close sidebar when navigating on mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    return (
        <div className="flex min-h-screen bg-slate-50/50 text-slate-700 font-sans tracking-tight">
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 min-w-0 flex flex-col">
                {/* Mobile Top Header */}
                <header className="lg:hidden h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-xs ring-2 ring-blue-200 shadow-lg shadow-blue-500/30">
                            BT
                        </div>
                        <span className="text-xs font-black text-slate-900 uppercase">Control</span>
                    </div>

                    <div className="w-10" /> {/* Spacer for balance */}
                </header>

                <main className="flex-1 bg-slate-50/30 backdrop-blur-3xl">
                    {children}
                </main>
            </div>
        </div>
    );
}
