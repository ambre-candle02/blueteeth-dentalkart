"use client";

import Link from "next/link";
import { Gift, Zap, Percent, Clock, ChevronRight, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const OFFERS = [
    {
        title: "Buy 2 Get 1 Free",
        desc: "Applicable on all premium composite kits and bonding agents.",
        code: "COMP3FOR2",
        color: "blue",
        icon: Gift,
        expiry: "Ends in 3 days",
        href: "/shop?query=composite"
    },
    {
        title: "Free Scaler Tip",
        desc: "Receive a specialized ultrasonic tip with any scaler unit purchase.",
        code: "SCALERPLUS",
        color: "purple",
        icon: Zap,
        expiry: "Limited stock",
        href: "/shop?query=scaler"
    },
    {
        title: "Flat ₹500 Offset",
        desc: "Welcome bonus for new clinical registrations over ₹5000.",
        code: "NEWCLINIC",
        color: "emerald",
        icon: Percent,
        expiry: "First order only",
        href: "/shop"
    },
    {
        title: "Volume Discount",
        desc: "Extra 5% off on bulk orders of examination gloves and masks.",
        code: "BULKSAVE",
        color: "orange",
        icon: Sparkles,
        expiry: "Ongoing",
        href: "/shop?query=glove"
    }
];

const STYLES: Record<string, { bg: string, text: string, border: string, btn: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", btn: "bg-blue-600" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100", btn: "bg-purple-600" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", btn: "bg-emerald-600" },
    orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100", btn: "bg-orange-600" }
};

export default function FreebiesPage() {
    return (
        <div className="min-h-screen bg-[#FAFBFF] py-8">
            <div className="max-w-[1500px] w-full mx-auto px-6 sm:px-10 lg:px-14">

                {/* Compact Header (The "Patti") */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-12">
                    <div className="relative p-7 md:p-9 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-primary/[0.02] to-transparent pointer-events-none" />

                        <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                            <div className="w-16 h-16 rounded-[22px] bg-brand-primary flex items-center justify-center shadow-[0_12px_24px_rgba(0,100,255,0.15)] shrink-0">
                                <Gift size={28} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-1">Clinic Rewards</h1>
                                <p className="text-sm text-slate-500 font-medium leading-tight">Exclusive perks and promotional benefits for dental practices.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 relative z-10">
                            <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-600/20 border border-emerald-500">
                                <ShieldCheck size={16} className="text-white" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest leading-none">Verified Offers</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Offers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {OFFERS.map((offer, idx) => {
                        const style = STYLES[offer.color];
                        const Icon = offer.icon;

                        return (
                            <motion.div
                                key={offer.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative"
                            >
                                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm", style.bg, style.text)}>
                                        <Icon size={24} />
                                    </div>

                                    <div className="mb-auto">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={cn("text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-opacity-10", style.bg, style.text)}>
                                                Active Offer
                                            </span>
                                            <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                                <Clock size={10} /> {offer.expiry}
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-primary transition-colors">{offer.title}</h3>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">{offer.desc}</p>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-slate-50">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Promo Code</span>
                                            <span className="text-xs font-black text-slate-900 tracking-wider font-mono">{offer.code}</span>
                                        </div>
                                        <Link
                                            href={offer.href}
                                            className={cn("w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white transition-all shadow-lg active:scale-95", style.btn, `shadow-${offer.color}-600/20`)}
                                        >
                                            Redeem Now <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Trust Footer Section */}
                <div className="p-10 md:p-14 bg-white rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.02)] flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[radial-gradient(#0056D2_1px,transparent_1px)] [background-size:20px_20px]" />

                    <div className="max-w-xl relative z-10 text-center lg:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">Terms & Conditions Apply</h2>
                        <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed mb-6">
                            Promotion applies to clinical practitioners only. Coupons cannot be combined with other ongoing membership discounts. Free gifts are subject to availability at the time of dispatch.
                        </p>
                        <button className="flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all mx-auto lg:mx-0">
                            View detailed policy <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 lg:max-w-md">
                        <div className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 text-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Satisfied Dentists</p>
                            <p className="text-2xl font-bold text-slate-900">12,500+</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-slate-50/50 border border-slate-100 text-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Offers Delivered</p>
                            <p className="text-2xl font-bold text-slate-900">8,900+</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
