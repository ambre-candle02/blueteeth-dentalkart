"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Package, Users, Settings, LogOut, Crown, Calendar, Images, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    const sidebarContent = (
        <div className="p-8 flex-1 overflow-y-auto">
            <Link href="/" className="flex items-center gap-4 mb-12 px-1 group">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-700 rounded-[1rem] flex items-center justify-center text-white font-bold text-sm shadow-xl shadow-blue-500/30 group-hover:scale-110 transition-transform ring-4 ring-blue-100">
                    BT
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900 leading-tight">Blueteeth</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Control Panel</span>
                </div>
            </Link>

            <nav className="space-y-1.5">
                <div className="px-3 mb-5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic opacity-60">Operations</span>
                </div>
                <SidebarLink href="/admin" icon={<LayoutDashboard size={18} />} label="Analytics" color="blue" active={pathname === "/admin"} />
                <SidebarLink href="/admin/orders" icon={<ShoppingBag size={18} />} label="Order Flow" color="emerald" active={pathname === "/admin/orders"} />
                <SidebarLink href="/admin/products" icon={<Package size={18} />} label="Repository" color="purple" active={pathname?.startsWith("/admin/products")} />

                <div className="px-3 mt-10 mb-5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic opacity-60">Management</span>
                </div>
                <SidebarLink href="/admin/users" icon={<Users size={18} />} label="Identities" color="indigo" active={pathname?.startsWith("/admin/users")} />
                <SidebarLink href="/admin/membership" icon={<Crown size={18} />} label="Clinical Tiers" color="amber" active={pathname === "/admin/membership"} />
                <SidebarLink href="/admin/events" icon={<Calendar size={18} />} label="Academy Events" color="rose" active={pathname?.startsWith("/admin/events")} />
                <SidebarLink href="/admin/gallery" icon={<Images size={18} />} label="Media Vault" color="teal" active={pathname === "/admin/gallery"} />
                <SidebarLink href="/admin/settings" icon={<Settings size={18} />} label="System Config" color="slate" active={pathname === "/admin/settings"} />
            </nav>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-68 bg-white border-r border-slate-200 sticky top-0 h-screen flex-col shadow-sm z-20">
                {sidebarContent}
                <LogoutButton />
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 w-72 h-full bg-white z-50 lg:hidden flex flex-col shadow-2xl"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                <X size={24} />
                            </button>
                            {sidebarContent}
                            <LogoutButton />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

function SidebarLink({ href, icon, label, color, active }: { href: string; icon: React.ReactNode; label: string; color: string; active?: boolean }) {
    const colorStyles: Record<string, string> = {
        blue: "text-blue-600 bg-blue-100/50 border-blue-200/50",
        emerald: "text-emerald-600 bg-emerald-100/50 border-emerald-200/50",
        purple: "text-purple-600 bg-purple-100/50 border-purple-200/50",
        indigo: "text-indigo-600 bg-indigo-100/50 border-indigo-200/50",
        amber: "text-amber-600 bg-amber-100/50 border-amber-200/50",
        slate: "text-slate-600 bg-slate-100/50 border-slate-200/50",
        rose: "text-rose-600 bg-rose-100/50 border-rose-200/50",
        teal: "text-teal-600 bg-teal-100/50 border-teal-200/50",
    };

    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-slate-900 rounded-2xl transition-all group border border-transparent",
                active ? "bg-slate-50 text-slate-900 shadow-sm border-slate-200" : "hover:bg-white hover:shadow-md hover:border-white/20"
            )}
        >
            <div className={cn(
                "w-10 h-10 rounded-[0.8rem] flex items-center justify-center border transition-all shadow-sm group-hover:scale-110",
                colorStyles[color]
            )}>
                {icon}
            </div>
            <span className="text-[13px] font-bold tracking-tight transition-transform group-hover:translate-x-1 uppercase tracking-widest text-[10px]">{label}</span>
        </Link>
    );
}

function LogoutButton() {
    return (
        <div className="p-8 border-t border-slate-100 mt-auto">
            <button
                onClick={async () => {
                    const { signOut } = await import("next-auth/react");
                    await signOut({ callbackUrl: "/" });
                }}
                className="w-full flex items-center justify-center gap-3 py-4 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 rounded-2xl transition-all font-black text-[10px] uppercase tracking-[0.15em] border border-rose-500/10 hover:border-rose-500/30 group shadow-sm"
            >
                <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                Terminate Session
            </button>
        </div>
    );
}
