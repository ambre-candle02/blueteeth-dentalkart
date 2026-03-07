'use client';

import { useSession, signOut } from "next-auth/react";
import { User, Mail, Phone, LogOut, Package, Heart, Settings, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";


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
                    className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 max-w-lg w-full text-center relative z-10"
                >
                    <div className="w-24 h-24 bg-brand-primary/10 rounded-[2rem] flex items-center justify-center text-brand-primary mx-auto mb-8 shadow-inner shadow-brand-primary/5">
                        <Lock className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Professional Portal</h1>
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
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden"
                >
                    {/* Header/Cover */}
                    <div className="h-32 bg-gradient-to-r from-brand-primary to-brand-dark"></div>

                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="p-1 bg-white rounded-2xl shadow-lg border border-slate-100">
                                <div className="w-24 h-24 bg-brand-light/50 rounded-xl flex items-center justify-center text-brand-primary">
                                    <User className="w-12 h-12" />
                                </div>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors border border-red-100"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* User Info */}
                            <div className="md:col-span-1 space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 capitalize">{user.name}</h1>
                                    <p className="text-slate-500 text-sm">Member since 2026</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <Mail className="w-4 h-4 text-brand-primary" />
                                        <span className="text-sm truncate">{user.email}</span>
                                    </div>
                                    {(user as any).mobile && (
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <Phone className="w-4 h-4 text-brand-primary" />
                                            <span className="text-sm">{(user as any).mobile}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

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
                </motion.div>
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
