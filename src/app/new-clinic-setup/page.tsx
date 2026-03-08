"use client";

import { ClinicWizard } from "@/components/features/ClinicWizard/ClinicWizard";
import Link from "next/link";
import { ArrowLeft, Stethoscope, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function NewClinicSetupPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] py-16 md:py-24">
            <div className="max-w-[1000px] mx-auto px-4 md:px-12 relative z-10">

                {/* Restored Substantial "Patti" Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative w-full mx-auto rounded-2xl overflow-hidden mb-8 bg-white/90 backdrop-blur-md border-[1.5px] border-slate-200 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)]"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-10 gap-4 relative z-10">
                        {/* Solid Accent Bar */}
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-primary" />

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <Link
                                href="/"
                                className="w-12 h-12 rounded-xl bg-white border border-slate-100 text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-sm flex items-center justify-center group shrink-0"
                            >
                                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
                            </Link>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-brand-primary/5 flex items-center justify-center shrink-0 border border-brand-primary/10 shadow-sm">
                                    <Stethoscope size={24} className="text-brand-primary" strokeWidth={2.5} />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none uppercase whitespace-nowrap">Clinic <span className="text-brand-primary">Setup</span></h1>
                                        <span className="hidden md:flex items-center gap-1 bg-brand-primary/10 text-brand-primary text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter border border-brand-primary/5">
                                            Active Protocol
                                        </span>
                                    </div>
                                    <p className="text-[8px] md:text-[11px] font-black uppercase tracking-wider md:tracking-[0.2em] text-slate-400 mt-1 md:mt-2 whitespace-nowrap opacity-60">
                                        Implementation Matrix v.2026
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:flex items-center gap-6 border-l-2 border-slate-50 pl-10">
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</span>
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50" />
                                </div>
                                <span className="text-xs font-black text-slate-900 tracking-tighter uppercase italic">Configuration Engine Primed</span>
                            </div>
                        </div>
                    </div>
                </motion.div>


                <ClinicWizard />
            </div>
        </div>
    );
}
