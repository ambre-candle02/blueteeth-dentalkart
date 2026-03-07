"use client";

import Link from "next/link";
import {
    ArrowLeft, History, Search, Download, ShieldCheck,
    Sparkles, BookOpen, GraduationCap, Users, Award,
    CheckCircle2, Clock, Globe, Briefcase, Video as VideoIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";
import { cn } from "@/lib/utils";

const PAST_EVENTS = [
    {
        id: "past-1",
        title: "Clinical Excellence Summit 2023",
        date: "Nov 12, 2023",
        attendees: "12k+ Doctors",
        category: "Mega Summit",
        faculty: "International Dental Council",
        icon: Globe,
        color: "blue"
    },
    {
        id: "past-2",
        title: "Digital Orthodontics Webinar",
        date: "Jan 05, 2024",
        attendees: "2.4k+ Registered",
        category: "Virtual",
        faculty: "Dr. Sarah Miller, UK",
        icon: VideoIcon,
        color: "emerald"
    },
    {
        id: "past-3",
        title: "Surgical Suturing Masterclass",
        date: "Dec 18, 2023",
        attendees: "800+ Certified",
        category: "Hands-on",
        faculty: "Dr. Roberto Silva",
        icon: Briefcase,
        color: "purple"
    }
];

const COLORS: Record<string, string> = {
    blue: "bg-blue-600",
    emerald: "bg-emerald-600",
    purple: "bg-purple-600"
};

export default function PastEventsPage() {
    const handleDownload = (title: string) => {
        alert(`Initializing secure download for: ${title}\nArchive access granted.`);
    };

    const handleRequestAccess = () => {
        alert("Your request for Historical Archive Access has been forwarded to the Clinical Administration.\nVerification usually takes 2-4 business hours.");
    };

    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-24 font-sans text-slate-900">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-8">

                {/* Integrated Header "Patti" */}
                <header className="mb-10">
                    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative">
                        <div className="absolute top-0 right-0 w-32 h-full bg-slate-900/5 -skew-x-12 transform translate-x-16" />

                        <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                            <BackButton />
                            <div className="h-10 w-px bg-slate-200 hidden md:block" />
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                    Historical Archive <History size={20} className="text-slate-400" />
                                </h1>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1 opacity-70">Verified Deployment History</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 relative z-10">
                            <Link href="/events" className="bg-brand-primary border border-brand-primary/20 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-brand-dark transition-all flex items-center gap-2 group/btn shadow-lg shadow-brand-primary/20">
                                <ArrowLeft size={14} className="group-hover/btn:-translate-x-1 transition-transform" /> Back to Live Portal
                            </Link>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Activity Feed */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between mb-8 px-2">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Concluded Records</h2>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{PAST_EVENTS.length} Operations Verified</span>
                        </div>

                        <AnimatePresence>
                            {PAST_EVENTS.map((event, idx) => {
                                const Icon = event.icon;
                                return (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-white rounded-[2rem] border border-slate-200 p-8 flex flex-col sm:flex-row items-center gap-8 group hover:shadow-2xl hover:border-brand-primary/10 transition-all duration-500 relative overflow-hidden"
                                    >
                                        <div className={cn("absolute left-0 top-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-all duration-500", COLORS[event.color])} />

                                        <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 shadow-sm transition-all duration-500", COLORS[event.color])}>
                                            <Icon size={32} className="text-white" />
                                        </div>

                                        <div className="flex-1 text-center sm:text-left">
                                            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mb-3">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 px-2 py-0.5 rounded-md">{event.category}</span>
                                                <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1">
                                                    <CheckCircle2 size={10} /> Certified
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-black text-slate-900 group-hover:text-brand-primary transition-colors tracking-tight">{event.title}</h3>
                                            <p className="text-[11px] text-slate-500 font-semibold mt-1 uppercase tracking-wider opacity-70">Led by {event.faculty}</p>
                                        </div>

                                        <div className="sm:text-right flex flex-col items-center sm:items-end gap-1 px-6 sm:border-l border-slate-100">
                                            <p className="text-xs font-black text-slate-900">{event.date}</p>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{event.attendees}</p>
                                        </div>

                                        <button
                                            onClick={() => handleDownload(event.title)}
                                            className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-brand-primary hover:bg-white transition-all shadow-sm group-hover:scale-110 active:scale-90 cursor-pointer z-20"
                                            title="Download Records"
                                        >
                                            <Download size={20} />
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {/* End of Registry - Compact Clinical Indigo Vault */}
                        <div className="relative pt-12">
                            <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200" />
                            <div className="relative z-10 w-full px-4 md:px-0">
                                <div className="bg-[#EEF2FF] px-10 py-12 rounded-[3.5rem] border-2 border-[#C7D2FE] flex flex-col items-center text-center w-full shadow-[0_25px_50px_-12px_rgba(99,102,241,0.08)] relative overflow-hidden group">
                                    {/* Decorative Patterns */}
                                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />


                                    <div className="w-20 h-20 bg-white border-[4px] border-[#EEF2FF] rounded-full flex items-center justify-center mb-6 shadow-xl relative z-10">
                                        <div className="w-14 h-14 bg-slate-950 rounded-full flex items-center justify-center text-white shadow-lg shadow-slate-900/30 group-hover:scale-110 transition-transform duration-700">
                                            <ShieldCheck size={24} strokeWidth={2.5} />
                                        </div>
                                    </div>

                                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-[0.4em] mb-4 relative z-10 italic">Registry Index Sealed</h4>
                                    <p className="text-base text-slate-600 font-semibold leading-relaxed max-w-3xl mx-auto relative z-10 opacity-90">
                                        Verified clinical deployment data for cycle <span className="text-brand-primary font-black px-2 py-0.5 bg-white rounded-md shadow-sm border border-indigo-100">2020 - 2024</span> has been committed to the <span className="text-slate-950 font-black underline decoration-brand-primary decoration-2 underline-offset-4">Historical Registry Archive</span>.
                                    </p>

                                    <div className="mt-8 flex items-center gap-4 px-10 py-3.5 bg-emerald-600 text-white rounded-2xl shadow-lg relative z-10 hover:bg-emerald-700 transition-all duration-500">
                                        <div className="relative flex items-center justify-center">
                                            <div className="w-3 h-3 rounded-full bg-white animate-ping absolute opacity-40" />
                                            <div className="w-3 h-3 rounded-full bg-white relative" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Integrity Verified</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Rail */}
                    <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-28">
                        <div className="bg-[#EEF2FF] rounded-[2.5rem] p-10 border-2 border-[#C7D2FE] relative overflow-hidden shadow-sm">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16 opacity-50" />
                            <div className="relative z-10 space-y-8">
                                <div className="w-14 h-14 bg-white border border-indigo-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                                    <ShieldCheck size={32} className="text-brand-primary" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-4 tracking-[-0.03em]">Historical <br /> Verification</h3>
                                    <p className="text-slate-500 text-xs font-semibold leading-relaxed mb-10">Access full study materials and video archives of concluded masterclasses.</p>
                                </div>
                                <button
                                    onClick={handleRequestAccess}
                                    className="w-full py-5 bg-brand-primary text-white rounded-[1.25rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/25 cursor-pointer active:scale-95"
                                >
                                    Request Archive Access
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm group">
                            <div className="flex items-center justify-between mb-10">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academy Impact</h4>
                                <Sparkles size={18} className="text-brand-primary group-hover:animate-spin-slow" />
                            </div>
                            <div className="space-y-10">
                                {[
                                    { val: "125k+", label: "Verified Grads" },
                                    { val: "450+", label: "Masterclasses" },
                                    { val: "98%", label: "Clinical Success" }
                                ].map((stat, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="w-1 h-10 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="w-full h-1/2 bg-brand-primary" />
                                        </div>
                                        <div>
                                            <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.val}</p>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
