"use client";

import { motion } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";
import {
    Gavel,
    ShieldAlert,
    Scale,
    FileCheck,
    Activity,
    AlertCircle,
    ArrowRight,
    Clock,
    UserCheck,
    CreditCard,
    Container,
    Info,
    CheckCircle2,
    Lock,
    RefreshCcw,
    Zap,
    ShieldCheck
} from "lucide-react";

export default function TermsPage() {
    const legalSections = [
        {
            icon: <UserCheck size={18} />,
            title: "Practitioner Eligibility",
            content: "Exclusively for registered dental professionals (BDS, MDS) and recognized healthcare institutions. Verification required.",
            iconColor: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-100"
        },
        {
            icon: <Scale size={18} />,
            title: "Professional Responsibility",
            content: "Practitioners are responsible for ensuring equipment matches their clinical requirements and legal practice scope.",
            iconColor: "text-emerald-600",
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-100"
        },
        {
            icon: <CreditCard size={18} />,
            title: "Commercial B2B Terms",
            content: "Pricing is optimized for professional procurement. Bulk orders are governed by specific commercial agreements.",
            iconColor: "text-indigo-600",
            bgColor: "bg-indigo-50",
            borderColor: "border-indigo-100"
        },
        {
            icon: <Container size={18} />,
            title: "Supply Chain & Logistics",
            content: "Turn-around times (TAT) are subject to clinical equipment sensitivity. Cold-chain managed under strict protocols.",
            iconColor: "text-amber-600",
            bgColor: "bg-amber-50",
            borderColor: "border-amber-100"
        },
        {
            icon: <Lock size={18} />,
            title: "Intellectual Property",
            content: "All clinical assets and platform features are protected. Unauthorized reproduction is strictly prohibited.",
            iconColor: "text-rose-600",
            bgColor: "bg-rose-50",
            borderColor: "border-rose-100"
        },
        {
            icon: <RefreshCcw size={18} />,
            title: "Returns & Exchanges",
            content: "Consumables are non-returnable once the seal is broken. Equipment returns subject to restocking fees.",
            iconColor: "text-sky-600",
            bgColor: "bg-sky-50",
            borderColor: "border-sky-100"
        }
    ];

    return (
        <div className="min-h-screen bg-[#FAFBFF] pb-16 relative overflow-x-clip">
            {/* Background Aesthetics */}
            <div className="absolute top-0 right-0 w-[400px] md:w-[700px] h-[400px] md:h-[700px] bg-brand-primary/[0.02] rounded-full blur-[80px] md:blur-[110px] pointer-events-none translate-x-1/2 -translate-y-1/2" />

            <div className="max-w-[1240px] mx-auto px-4 sm:px-8 lg:px-10 pt-4 md:pt-8 relative z-10 w-full overflow-x-clip">
                {/* Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0F172A] rounded-[1.25rem] md:rounded-[2.5rem] p-6 sm:p-10 md:p-12 border border-slate-800 shadow-2xl relative overflow-hidden mb-6 md:mb-10"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none rotate-[25deg] hidden lg:block">
                        <Gavel size={300} strokeWidth={1} className="text-white" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-row items-center justify-between gap-4 md:gap-8 mb-8 md:mb-12">
                            <div className="flex items-center gap-4 md:gap-6 w-full">
                                <BackButton className="w-10 h-10 md:w-12 md:h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 shrink-0 shadow-lg shadow-black/20" />
                                <div className="min-w-0">
                                    <div className="flex items-center flex-wrap gap-2 md:gap-3 mb-1">
                                        <h1 className="text-xl md:text-4xl font-black text-white tracking-tight leading-none whitespace-nowrap">Master <span className="text-brand-primary">Terms</span></h1>
                                        <div className="px-1.5 py-0.5 bg-brand-primary/20 border border-brand-primary/30 rounded text-[6px] md:text-[8px] font-black text-brand-primary uppercase tracking-widest whitespace-nowrap">v2026.01</div>
                                    </div>
                                    <p className="text-[8px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.2em] leading-tight break-words">Service Level Agreement for Clinicians</p>
                                </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-full w-fit shrink-0">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                                <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest whitespace-nowrap">Active Now</span>
                            </div>
                        </div>

                        <div className="max-w-2xl space-y-3 md:space-y-4 text-left">
                            <h2 className="text-lg md:text-3xl font-black text-white leading-tight">Professional Governance Protocols.</h2>
                            <p className="text-slate-400 font-medium text-[13px] md:text-lg leading-relaxed">
                                This document outlines the protocols and legal boundaries of the Blueteeth DENTAL STORE ecosystem for clinical professionals.
                            </p>

                            <div className="flex flex-wrap gap-x-5 gap-y-2 pt-4 border-t border-white/5">
                                <div className="flex items-center gap-1.5 text-white/60 text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                                    <ShieldAlert size={12} className="text-brand-primary" /> Regulatory Valid
                                </div>
                                <div className="flex items-center gap-1.5 text-white/60 text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                                    <Zap size={12} className="text-amber-500" /> B2B Optimized
                                </div>
                                <div className="flex items-center gap-1.5 text-white/60 text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                                    <Activity size={12} className="text-emerald-500" /> Verified Hub
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16 overflow-hidden px-1 text-left">
                    {legalSections.map((section, idx) => (
                        <div key={idx} className="relative p-8 md:p-10 bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col items-start text-left">
                            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6 border transition-all ${section.bgColor} ${section.iconColor} ${section.borderColor} group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary`}>
                                {section.icon}
                            </div>
                            <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2">{section.title}</h3>
                            <p className="text-slate-500 font-medium text-[13px] md:text-sm leading-relaxed mb-4">
                                {section.content}
                            </p>
                            <div className="absolute top-8 right-8 text-[8px] md:text-[9px] font-black text-slate-100 uppercase tracking-widest group-hover:text-slate-200 transition-colors">
                                0{idx + 1}
                            </div>
                            <div className="mt-auto pt-4 w-full border-t border-slate-50 flex items-center justify-between text-[7px] md:text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none">
                                <span>Ref: MSG-{idx + 101}</span>
                                <ArrowRight size={12} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Awareness section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.99 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-[#0A1D3D] rounded-xl md:rounded-2xl p-8 md:p-12 text-white relative overflow-hidden text-left shadow-2xl mx-1"
                >
                    <div className="absolute top-0 right-0 p-10 opacity-[0.05] pointer-events-none rotate-[-15deg] hidden lg:block">
                        <FileCheck size={200} className="text-white" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                        <div className="flex-1 space-y-6 min-w-0">
                            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-brand-primary/20 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-widest text-brand-primary border border-brand-primary/10 whitespace-nowrap w-fit">
                                <AlertCircle size={10} /> Compliance
                            </div>
                            <h2 className="text-xl md:text-3xl font-black text-white leading-tight">Clinical Sourcing Act.</h2>
                            <p className="text-white/70 font-medium text-[12px] md:text-base leading-relaxed max-w-2xl">
                                All clinical-grade materials are subject to the D&C Act. Compliance verified by ISO-13485 protocols.
                            </p>
                            <div className="flex flex-row items-center gap-3 pt-1">
                                <button className="px-7 py-3.5 bg-white text-slate-900 rounded-lg font-black uppercase tracking-widest text-[8px] md:text-[9px] hover:shadow-xl transition-all">
                                    Download MSA
                                </button>
                                <button className="px-7 py-3.5 bg-transparent border border-white/20 text-white rounded-lg font-black uppercase tracking-widest text-[8px] md:text-[9px] hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                    Compliance <ArrowRight size={12} />
                                </button>
                            </div>
                        </div>

                        <div className="w-fit shrink-0 bg-white/5 border border-white/10 p-7 rounded-xl backdrop-blur-xl flex flex-col items-center gap-3 text-center">
                            <CheckCircle2 size={40} className="text-emerald-500" />
                            <div>
                                <h4 className="font-black text-lg md:text-xl mb-0.5 leading-none">D&C Compliant</h4>
                                <p className="text-[8px] md:text-[9px] font-bold text-white/40 uppercase tracking-widest">Verified Hub</p>
                            </div>
                        </div>
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
