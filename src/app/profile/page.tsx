'use client';

import { useSession, signOut } from "next-auth/react";
import { User, Mail, Phone, LogOut, Package, Heart, Settings, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BackButton } from "@/components/ui/BackButton";


export default function ProfilePage() {
    const { data: session, status } = useSession();
    // No redirect - we want users to see their profile dashboard

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
            </div>
        );
    }

    if (!session || !session.user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFBFF] px-4 overflow-hidden relative">
                {/* Background Accents */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -ml-64 -mb-64" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-slate-100 max-w-lg w-full text-center relative z-10"
                >
                    <div className="w-24 h-24 bg-brand-primary/10 rounded-[2rem] flex items-center justify-center text-brand-primary mx-auto mb-8 shadow-inner shadow-brand-primary/5">
                        <Lock className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mb-4 tracking-tight whitespace-nowrap">Professional Portal</h1>
                    <p className="text-slate-500 font-medium mb-10 text-lg leading-relaxed">
                        To protect sensitive medical pricing and clinic data, please authenticate your professional account.
                    </p>
                    <Link
                        href="/login"
                        className="flex items-center justify-center gap-3 w-full bg-brand-primary text-white py-5 rounded-2xl font-black text-lg hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20 active:scale-[0.98]"
                    >
                        Access Dashboard <ArrowRight className="w-5 h-5" />
                    </Link>

                    <div className="mt-8 pt-8 border-t border-slate-50">
                        <p className="text-sm text-slate-400 font-medium">New clinic in town? <Link href="/register" className="text-brand-primary font-bold hover:underline">Join the network</Link></p>
                    </div>
                </motion.div>
            </div>
        );
    }

    const user = session.user;

    if (!user) return null; // Safety bail-out

    return (
        <div className="min-h-screen bg-[#FAFBFF] py-6 md:py-16 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                {/* Unified Premium Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative w-full rounded-2xl md:rounded-[2.5rem] overflow-hidden mb-8 bg-white border border-slate-100 shadow-xl shadow-slate-200/30"
                >
                    <div className="p-5 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                            <BackButton className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl shrink-0" />
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-primary/5 rounded-xl md:rounded-2xl flex items-center justify-center text-brand-primary border border-brand-primary/10 shadow-inner">
                                    <User className="w-6 h-6 md:w-8 md:h-8" />
                                </div>
                                <div className="min-w-0">
                                    <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter truncate capitalize">{user.name}</h1>
                                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 mt-0.5">Established 2026 • Verified Professional</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                        >
                            <LogOut className="w-4 h-4" />
                            Secure Exit
                        </button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* User Metadata Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-1 space-y-6"
                    >
                        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Transmission Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                        <Mail className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="text-xs font-bold truncate">{user.email}</span>
                                </div>
                                {(user as any).mobile && (
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                                            <Phone className="w-4 h-4 text-emerald-600" />
                                        </div>
                                        <span className="text-xs font-bold">{(user as any).mobile}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-brand-primary to-brand-dark rounded-2xl text-white shadow-xl shadow-brand-primary/20 relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                                <User className="w-24 h-24" />
                            </div>
                            <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Clinic Status</h3>
                            <p className="text-lg font-black tracking-tight">Active Duty</p>
                            <div className="mt-4 flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest bg-white/20 w-fit px-2 py-1 rounded-md">
                                <Lock size={10} /> Tier 1 Encryption
                            </div>
                        </div>
                    </motion.div>

                    {/* Dashboard Stats/Links */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ProfileCard
                            icon={<Package className="w-6 h-6 text-orange-500" />}
                            title="My Orders"
                            description="View tracking & history"
                            href="/orders"
                        />
                        <ProfileCard
                            icon={<Heart className="w-6 h-6 text-red-500" />}
                            title="Wishlist"
                            description="Your saved items"
                            href="/wishlist"
                        />
                        <ProfileCard
                            icon={<Settings className="w-6 h-6 text-slate-500" />}
                            title="Account Settings"
                            description="Manage your profile"
                            href="/settings"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileCard({ icon, title, description, href }: { icon: any, title: string, description: string, href: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-4 p-4 rounded-2xl bg-brand-primary/[0.02] border border-brand-primary/10 hover:border-brand-primary/30 hover:bg-brand-primary/[0.05] transition-all group"
        >
            <div className="p-3 bg-white rounded-xl shadow-sm border border-brand-primary/5 transition-transform group-hover:scale-105">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
                <p className="text-slate-500 text-xs">{description}</p>
            </div>
        </Link>
    );
}
