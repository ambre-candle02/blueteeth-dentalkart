"use client";

import { motion } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";
import {
    Briefcase,
    Users,
    Sparkles,
    Rocket,
    ShieldCheck,
    Brain,
    Heart,
    Globe,
    ArrowRight,
    MapPin,
    Clock
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CareersPage() {
    const openings = [
        {
            title: "Medical Sales Expert",
            location: "Mumbai / Delhi",
            type: "Full-Time",
            category: "Sales",
            salary: "Competitive",
            icon: <Globe className="text-blue-500" />
        },
        {
            title: "Full Stack Developer",
            location: "Remote / Bangalore",
            type: "Full-Time",
            category: "Engineering",
            salary: "Competitive",
            icon: <Brain className="text-brand-primary" />
        },
        {
            title: "Dental Logistics Manager",
            location: "Gurgaon Hub",
            type: "Full-Time",
            category: "Operations",
            salary: "Competitive",
            icon: <Rocket className="text-emerald-500" />
        }
    ];

    return (
        <div className="min-h-screen bg-[#FAFBFF] pb-24 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/[0.03] rounded-full blur-[120px] -mr-96 -mt-96 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-10 pt-10 relative z-10">
                {/* Unified Premium Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative w-full rounded-2xl md:rounded-[2rem] overflow-hidden mb-10 bg-white border border-slate-100 shadow-xl shadow-slate-200/20"
                >
                    <div className="p-5 md:px-10 md:py-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">
                            <BackButton className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl shrink-0" />
                            <div>
                                <div className="flex items-center gap-3 mb-0.5">
                                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter">Careers at <span className="text-brand-primary">Blueteeth</span></h1>
                                    <Sparkles size={20} className="text-brand-primary animate-pulse hidden md:block" />
                                </div>
                                <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">Shape the Future of Dental Tech</p>
                            </div>
                        </div>

                        <div className="hidden lg:flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ">Active Roles</p>
                                <p className="text-xs font-bold text-slate-900">12 Positions Open</p>
                            </div>
                            <div className="w-px h-8 bg-slate-100" />
                            <div className="text-right">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Growth Rate</p>
                                <p className="text-xs font-bold text-emerald-600">3x Scale YoY</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6 md:space-y-8 text-center sm:text-left"
                    >
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] md:leading-[1.1]">
                                Build the Backbone of <span className="text-brand-primary underline decoration-brand-primary/20 decoration-4 md:decoration-8 underline-offset-4 md:underline-offset-8">Modern Dentistry.</span>
                            </h2>
                            <p className="text-slate-500 text-sm md:text-base lg:text-lg leading-relaxed font-medium max-w-xl mx-auto sm:mx-0">
                                Join a high-speed team that&apos;s revolutionizing dental procurement across India. We&apos;re looking for mission-driven builders, healers, and innovators.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3 justify-center sm:justify-start pt-2">
                            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl border border-slate-100 shadow-sm whitespace-nowrap">
                                <Users size={16} className="text-brand-primary" />
                                <span className="text-[11px] md:text-sm font-bold text-slate-700">50+ Experts</span>
                            </div>
                            <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white rounded-xl border border-slate-100 shadow-sm whitespace-nowrap">
                                <ShieldCheck size={16} className="text-emerald-500" />
                                <span className="text-[11px] md:text-sm font-bold text-slate-700">Health First Culture</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative hidden lg:block"
                    >
                        <div className="aspect-[4/3] bg-gradient-to-br from-[#003399] to-[#001533] rounded-[3rem] shadow-2xl overflow-hidden relative group">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                            <div className="absolute inset-0 p-12 flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div className="w-16 h-1 w-16 bg-brand-primary rounded-full" />
                                    <h3 className="text-3xl font-black text-white leading-tight">Join India&apos;s Fastest Growing Dental Network</h3>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                                    <p className="text-white/70 text-sm font-medium italic mb-2">&ldquo;Working at Blueteeth feels like building the future, one smile at a time.&rdquo;</p>
                                    <p className="text-white font-bold text-sm">— Team Leads</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Benefits Section */}
                <div className="mb-16 md:mb-24">
                    <div className="text-center mb-12 space-y-2">
                        <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em]">Why Blueteeth</h3>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900">Perks & Culture</h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {[
                            { icon: <Heart className="text-red-500" />, title: "Medical Cover", desc: "Comprehensive health & dental cover for you and your family." },
                            { icon: <Briefcase className="text-blue-500" />, title: "Learning Fund", desc: "Annual budget for courses, books, and professional growth." },
                            { icon: <MapPin className="text-emerald-500" />, title: "Hybrid Work", desc: "Balance your life with flexible office and remote options." },
                            { icon: <Rocket className="text-orange-500" />, title: "ESOPs", desc: "Ownership in the company you are building from ground up." }
                        ].map((benefit, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-100 hover:shadow-xl hover:border-brand-primary/10 transition-all group"
                            >
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-brand-primary/5 transition-colors">
                                    {benefit.icon}
                                </div>
                                <h4 className="text-sm md:text-base font-black text-slate-900 mb-2">{benefit.title}</h4>
                                <p className="text-slate-500 text-[10px] md:text-xs font-medium leading-normal">{benefit.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Openings Section */}
                <div className="mb-16 md:mb-24" id="openings">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] mb-2">Join the journey</h3>
                            <h2 className="text-2xl md:text-4xl font-black text-slate-900">Available Openings</h2>
                        </div>
                        <div className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10">
                            Apply at: careers@blueteeth.store
                        </div>
                    </div>

                    <div className="space-y-4">
                        {openings.map((job, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="group p-5 md:p-8 bg-white rounded-2xl md:rounded-[2rem] border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-2xl hover:border-brand-primary/20 transition-all"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-50 group-hover:bg-brand-primary/5 group-hover:border-brand-primary/10 transition-colors">
                                        <div className="scale-110">{job.icon}</div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg md:text-xl font-black text-slate-900 mb-1 group-hover:text-brand-primary transition-colors">{job.title}</h4>
                                        <div className="flex flex-wrap items-center gap-3 gap-y-1">
                                            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                                <MapPin size={10} /> {job.location}
                                            </div>
                                            <div className="w-1 h-1 bg-slate-200 rounded-full hidden sm:block" />
                                            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                                <Clock size={10} /> {job.type}
                                            </div>
                                            <div className="w-1 h-1 bg-slate-200 rounded-full hidden sm:block" />
                                            <div className="text-brand-primary text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-brand-primary/5 rounded-full">
                                                {job.category}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    href={`mailto:careers@blueteeth.store?subject=Application for ${job.title}`}
                                    className="w-full md:w-auto px-8 py-4 bg-slate-50 text-slate-900 rounded-xl md:rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all flex items-center justify-center gap-2"
                                >
                                    Apply Now <ArrowRight size={14} />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Final CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-[#003399] via-[#0047AB] to-[#001F4D] rounded-3xl md:rounded-[3rem] p-8 md:p-16 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-900/40"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/[0.05] rounded-full blur-[100px] -mr-48 -mt-48" />

                    <div className="relative z-10 max-w-3xl mx-auto space-y-6 md:space-y-8">
                        <h2 className="text-2xl md:text-3xl lg:text-5xl font-black text-white leading-tight italic">
                            Don&apos;t see a perfect fit?
                        </h2>
                        <p className="text-blue-100/80 font-medium text-sm md:text-lg leading-relaxed px-4 md:px-0">
                            We are always looking for exceptional talent. If you have a passion for dental technology and logistics, we want to hear from you.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link href="mailto:careers@blueteeth.store" className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-white text-[#003399] rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-50 transition-all shadow-xl active:scale-95">
                                Send General Application
                            </Link>
                            <Link href="/contact" className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-white/10 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/20 hover:bg-white/20 transition-all active:scale-95">
                                Visit Our Office
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
