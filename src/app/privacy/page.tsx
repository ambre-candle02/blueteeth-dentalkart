"use client";

import { motion } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";
import {
    ShieldCheck,
    Lock,
    Eye,
    Database,
    HardDrive,
    Users,
    Globe,
    Mail,
    ChevronRight,
    Search,
    Clock,
    FileText
} from "lucide-react";

export default function PrivacyPage() {
    const sections = [
        {
            icon: <Database size={18} />,
            title: "Data Collection",
            content: "We collect essentials for clinical operations and professional certifications.",
            iconColor: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-100"
        },
        {
            icon: <Lock size={18} />,
            title: "Professional Security",
            content: "Transactions are encrypted using enterprise-grade SSL/TLS protocols.",
            iconColor: "text-emerald-600",
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-100"
        },
        {
            icon: <Eye size={18} />,
            title: "Usage Transparency",
            content: "Data is used only for logistics and personalized clinical offers.",
            iconColor: "text-amber-600",
            bgColor: "bg-amber-50",
            borderColor: "border-amber-100"
        },
        {
            icon: <Users size={18} />,
            title: "Stakeholder Access",
            content: "Authorized personnel and logistics partners have specific access.",
            iconColor: "text-purple-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-100"
        }
    ];

    return (
        <div className="min-h-screen bg-[#FAFBFF] pb-16 relative overflow-x-clip">
            {/* Background Aesthetics */}
            <div className="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-brand-primary/[0.03] rounded-full blur-[80px] md:blur-[100px] pointer-events-none translate-x-1/4 -translate-y-1/4" />

            <div className="max-w-[1240px] mx-auto px-4 sm:px-8 lg:px-10 pt-4 md:pt-8 relative z-10 w-full overflow-x-clip">
                {/* Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[1.25rem] md:rounded-[2rem] p-6 sm:p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/20 mb-6 md:mb-8 overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none rotate-12 hidden md:block">
                        <ShieldCheck size={250} strokeWidth={1} className="text-brand-primary" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex flex-row items-center justify-between gap-5 mb-8 md:mb-10">
                            <div className="flex items-center gap-4 md:gap-6 w-full">
                                <BackButton className="w-10 h-10 md:w-12 md:h-12 border-slate-200 shrink-0 shadow-sm" />
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h1 className="text-xl md:text-4xl font-black text-slate-900 tracking-tight whitespace-nowrap">Privacy <span className="text-brand-primary">Shield</span></h1>
                                        <ShieldCheck size={24} className="text-brand-primary hidden sm:block" />
                                    </div>
                                    <p className="text-[7px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Data Protection Protocol v4.0</p>
                                </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 bg-slate-50 border border-slate-100 rounded-full shrink-0">
                                <Clock size={12} className="text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Updated: Mar 08</span>
                            </div>
                        </div>

                        <div className="max-w-3xl text-left space-y-4">
                            <h2 className="text-lg md:text-2xl font-black text-slate-900 leading-tight">Global Standards, Precision.</h2>
                            <p className="text-slate-500 font-medium text-[13px] md:text-lg leading-relaxed">
                                At Blueteeth DENTAL STORE, your data is as sensitive as your clinical procedures. Built on transparency and trust.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <div className="px-4 py-2 bg-brand-primary/5 rounded-lg border border-brand-primary/10 flex items-center gap-2">
                                    <Lock size={12} className="text-brand-primary" />
                                    <span className="text-[8px] md:text-[9px] font-black text-brand-primary uppercase tracking-widest leading-none">AES-256 SSL</span>
                                </div>
                                <div className="px-4 py-2 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center gap-2">
                                    <ShieldCheck size={12} className="text-emerald-600" />
                                    <span className="text-[8px] md:text-[9px] font-black text-emerald-700 uppercase tracking-widest leading-none">HIPAA Hub</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Grid Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 md:mb-12 text-left">
                    {sections.map((section, idx) => (
                        <div key={idx} className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col items-start">
                            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6 border transition-all ${section.bgColor} ${section.iconColor} ${section.borderColor} group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary`}>
                                {section.icon}
                            </div>
                            <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2">{section.title}</h3>
                            <p className="text-slate-500 font-medium text-[13px] md:text-sm leading-relaxed mb-4">
                                {section.content}
                            </p>
                            <div className="w-full pt-4 border-t border-slate-50 flex items-center justify-between text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none">
                                <span>Section 0{idx + 1}</span>
                                <ChevronRight size={12} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact Section */}
                <div className="bg-[#0A1D3D] rounded-xl md:rounded-2xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 text-left shadow-2xl mx-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.05] pointer-events-none rotate-[-15deg] hidden lg:block">
                        <ShieldCheck size={200} className="text-white" />
                    </div>

                    <div className="space-y-4 flex-1 relative z-10">
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-brand-primary/20 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-widest text-brand-primary border border-brand-primary/10 whitespace-nowrap w-fit">
                            <FileText size={10} /> Contact Hub
                        </div>
                        <h4 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">Privacy concerns?</h4>
                        <p className="text-white/70 font-medium text-[12px] md:text-base leading-relaxed max-w-xl">
                            Our Legal Data Protection Officer is here to assist with any clinical security inquiries.
                        </p>
                    </div>
                    <a
                        href="mailto:privacy@blueteeth.store"
                        className="bg-brand-primary text-white px-7 py-3.5 rounded-lg font-black uppercase tracking-widest text-[8px] md:text-[9px] hover:bg-white hover:text-brand-primary transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-3 group shrink-0 w-full md:w-auto justify-center relative z-10"
                    >
                        <Mail size={16} className="group-hover:-rotate-12 transition-transform" /> Contact Legal
                    </a>
                </div>
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
