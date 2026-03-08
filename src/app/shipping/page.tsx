"use client";

import { motion } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";
import {
    Truck,
    Box,
    ShieldCheck,
    Clock,
    Globe,
    MapPin,
    CheckCircle2,
    AlertCircle,
    ArrowUpRight,
    Search,
    Package,
    Navigation,
    Anchor,
    Plane,
    Wrench
} from "lucide-react";

export default function ShippingPage() {
    const deliveryFeatures = [
        {
            icon: <Clock size={16} />,
            title: "Priority TAT",
            subtitle: "Clinicians, time is sterile. Standard supplies are dispatched within 24 hours.",
            badge: "Fast Track",
            iconColor: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-100"
        },
        {
            icon: <Wrench size={16} />,
            title: "Expert Setup",
            subtitle: "Dental chairs include free professional installation.",
            badge: "Expert Service",
            iconColor: "text-emerald-600",
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-100"
        },
        {
            icon: <ShieldCheck size={16} />,
            title: "Fragile Protocol",
            subtitle: "Equipment travels via specialized medical logistics.",
            badge: "Safety Plus",
            iconColor: "text-indigo-600",
            bgColor: "bg-indigo-50",
            borderColor: "border-indigo-100"
        }
    ];

    const logisticsSteps = [
        {
            icon: <Box size={20} />,
            title: "Clinical Packaging",
            content: "All instruments and consumables are packaged in moisture-resistant seals to ensure sterilization.",
            iconColor: "text-rose-600",
            bgColor: "bg-rose-50",
            borderColor: "border-rose-100"
        },
        {
            icon: <Package size={20} />,
            title: "Transit Network",
            content: "Strategic hubs in Mumbai, Delhi, and Bangalore to minimize delivery bottlenecks.",
            iconColor: "text-amber-600",
            bgColor: "bg-amber-50",
            borderColor: "border-amber-100"
        },
        {
            icon: <MapPin size={20} />,
            title: "Last-Mile Tracking",
            content: "Receive real-time telemetry on your equipment across 28,000+ pin codes in India.",
            iconColor: "text-sky-600",
            bgColor: "bg-sky-50",
            borderColor: "border-sky-100"
        }
    ];

    return (
        <div className="min-h-screen bg-[#FAFBFF] pb-16 relative overflow-x-clip">
            {/* Background Aesthetics */}
            <div className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-brand-primary/[0.03] rounded-full blur-[100px] md:blur-[140px] pointer-events-none translate-x-1/4 -translate-y-1/4" />

            <div className="max-w-[1240px] mx-auto px-4 sm:px-8 lg:px-10 pt-4 md:pt-8 relative z-10 w-full overflow-x-clip">
                {/* Hero Card */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[1rem] md:rounded-[2rem] p-6 sm:p-8 md:p-12 border border-slate-100 shadow-2xl relative overflow-hidden mb-6 md:mb-10 shadow-slate-200/40"
                >
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none rotate-6 hidden lg:block">
                        <Truck size={300} strokeWidth={1} className="text-brand-primary" />
                    </div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between gap-8 md:gap-12">
                        <div className="max-w-2xl space-y-4 md:space-y-6">
                            <div className="flex flex-row items-center gap-4 md:gap-6">
                                <BackButton className="w-10 h-10 md:w-12 md:h-12 border-slate-200 shrink-0 shadow-sm" />
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <h1 className="text-xl md:text-4xl font-black text-slate-900 tracking-tight leading-none whitespace-nowrap">Priority <span className="text-brand-primary">Logistics</span></h1>
                                        <Truck size={24} className="text-brand-primary hidden md:block" />
                                    </div>
                                    <p className="text-[7px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none pt-0.5">Dispatch Protocol v3.0</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-left">
                                <h2 className="text-lg md:text-2xl font-black text-slate-800 leading-tight">Delivering Clinical Excellence.</h2>
                                <p className="text-slate-500 font-medium text-[13px] md:text-base leading-relaxed max-w-xl">
                                    Blueteeth DENTAL STORE operates one of the most sophisticated healthcare supply chains in the nation.
                                </p>
                            </div>
                        </div>

                        <div className="w-full lg:w-[450px] space-y-3">
                            {deliveryFeatures.map((feat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-slate-50 border border-slate-100 p-4 rounded-xl md:p-5 md:rounded-2xl flex items-center gap-4 md:gap-5 group hover:bg-white hover:shadow-xl transition-all"
                                >
                                    <div className={`w-9 h-9 md:w-11 md:h-11 rounded-lg shadow-sm flex items-center justify-center shrink-0 border transition-all ${feat.bgColor} ${feat.iconColor} ${feat.borderColor} group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary`}>
                                        {feat.icon}
                                    </div>
                                    <div className="min-w-0 text-left flex-1">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h4 className="font-black text-slate-900 text-[11px] md:text-sm">{feat.title}</h4>
                                            <span className="text-[6px] md:text-[7px] font-black bg-brand-primary/10 text-brand-primary px-1.5 py-0.5 rounded-full uppercase tracking-tighter whitespace-nowrap">{feat.badge}</span>
                                        </div>
                                        <p className="text-[10px] md:text-[11px] text-slate-400 font-medium leading-tight line-clamp-1 truncate">{feat.subtitle}</p>
                                    </div>
                                    <ArrowUpRight size={14} className="text-slate-200 shrink-0 group-hover:text-brand-primary transition-colors" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Sub-Policy Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16 overflow-hidden px-1 text-left">
                    {logisticsSteps.map((step, idx) => (
                        <div key={idx} className="relative p-8 bg-white rounded-[1rem] md:rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col items-start text-left">
                            <div className={`w-11 h-11 md:w-13 md:h-13 rounded-xl flex items-center justify-center mb-6 border transition-all ${step.bgColor} ${step.iconColor} ${step.borderColor} group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary`}>
                                {step.icon}
                            </div>
                            <h3 className="text-base md:text-lg font-black text-slate-900 mb-2">{step.title}</h3>
                            <p className="text-slate-500 font-medium text-[12px] md:text-[13px] leading-relaxed mb-4">
                                {step.content}
                            </p>
                            <div className="absolute top-6 right-6 text-[8px] font-black text-slate-100 uppercase tracking-widest group-hover:text-slate-200 transition-colors">
                                0{idx + 1}
                            </div>
                            <div className="mt-auto pt-4 w-full border-t border-slate-50 flex items-center justify-between text-[7px] font-black text-slate-300 uppercase tracking-widest">
                                <span>Transit Module T-0{idx + 7}</span>
                                <CheckCircle2 size={10} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Awareness Box - REFINED: BLUE PREMIUM COLOR, SQUARE SHAPE, LESS HEIGHT */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.99 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-[#0A1D3D] rounded-xl md:rounded-2xl p-6 sm:p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-12 shadow-2xl mx-1"
                >
                    <div className="flex-1 space-y-6 md:space-y-8 min-w-0">
                        <div className="space-y-2 md:space-y-3 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-brand-primary/20 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-widest text-brand-primary border border-brand-primary/10 whitespace-nowrap w-fit">
                                <AlertCircle size={10} /> Transparency
                            </div>
                            <h2 className="text-xl md:text-3xl font-black tracking-tight leading-tight">No Hidden Logistics Costs.</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 overflow-hidden text-left">
                            <div className="space-y-1.5 md:space-y-2">
                                <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-2 mb-1 text-slate-300 flex items-center gap-2 justify-start leading-none">
                                    <Navigation size={10} className="text-brand-primary" /> Metro Network
                                </h4>
                                <p className="text-[11px] md:text-[12px] text-slate-400 font-medium leading-relaxed">
                                    Tier-1 cities enjoy priority dispatch. Standard shipping is complimentary on clinic restocks.
                                </p>
                            </div>
                            <div className="space-y-1.5 md:space-y-2">
                                <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-2 mb-1 text-slate-400 flex items-center gap-2 justify-start leading-none">
                                    <Anchor size={10} className="text-brand-primary" /> Reach
                                </h4>
                                <p className="text-[11px] md:text-[12px] text-slate-400 font-medium leading-relaxed">
                                    Our reach extends to 28,000+ pin codes, covering nationwide dental clinics.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-[280px] flex flex-col items-center gap-3 md:gap-4 shrink-0 bg-white/5 p-6 md:p-8 rounded-xl border border-white/5 backdrop-blur-md">
                        <div className="relative">
                            <CheckCircle2 size={32} className="text-emerald-500 md:size-40" />
                            <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full" />
                        </div>
                        <div className="text-center">
                            <h4 className="text-sm md:text-base font-black mb-0.5 leading-none tracking-tight whitespace-nowrap text-white">Verified Dispatch</h4>
                            <p className="text-[7px] md:text-[8px] font-bold text-white/40 uppercase tracking-widest">Clinical Standard Hub</p>
                        </div>
                        <button className="w-full px-6 py-3 bg-brand-primary text-white rounded-lg font-black uppercase tracking-widest text-[8px] md:text-[9px] shadow-lg shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all">
                            Track Order
                        </button>
                    </div>
                </motion.div>
            </div>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
