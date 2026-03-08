"use client";

import { motion } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";
import { ShieldCheck, Truck, Cpu, Users, Building2, Sparkles, Award, Target } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function AboutPage() {
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
                                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter">About <span className="text-brand-primary">Blueteeth DENTAL STORE</span></h1>
                                    <Sparkles size={20} className="text-brand-primary animate-pulse hidden md:block" />
                                </div>
                                <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">The Future of Dental Procurement</p>
                            </div>
                        </div>

                        <div className="hidden lg:flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ">Verified Network</p>
                                <p className="text-xs font-bold text-slate-900">12,000+ Professionals</p>
                            </div>
                            <div className="w-px h-8 bg-slate-100" />
                            <div className="text-right">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Platform Auth</p>
                                <p className="text-xs font-bold text-emerald-600">Tier-1 Encrypted</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Hero Story Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 md:mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                                Empowering India&apos;s <span className="text-brand-primary underline decoration-brand-primary/20 decoration-8 underline-offset-4">Clinics</span> with Precision Technology.
                            </h2>
                            <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
                                Founded in 2024, Blueteeth Dental Store emerged with a singular vision: To bridge the gap between world-class dental innovation and practitioners across India.
                            </p>
                            <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
                                We aren&apos;t just an e-commerce platform. We are the digital logistics backbone for over 5,000 clinics, ensuring quality healthcare never pauses.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-primary/10 transition-all group overflow-hidden relative">
                                <div className="relative z-10">
                                    <Target className="text-brand-primary mb-3 group-hover:scale-110 transition-transform" />
                                    <h4 className="font-bold text-slate-900 mb-1">Our Mission</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">Democratizing access to high-end dental instruments with transparent pricing and rapid deployment.</p>
                                </div>
                                <div className="absolute bottom-0 right-0 opacity-[0.03] blur-sm translate-x-1/2 translate-y-1/2">
                                    <div className="w-32 h-32 relative">
                                        <Image src="/images/dental_innovation.png" alt="Innovation" fill className="object-cover rounded-full" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-primary/10 transition-all group">
                                <Users className="text-emerald-500 mb-3 group-hover:scale-110 transition-transform" />
                                <h4 className="font-bold text-slate-900 mb-1">Our Community</h4>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium">Building a collaborative network where feedback from clinics drives our inventory selection.</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Decorative Image/Box area */}
                        <div className="aspect-[4/3] md:aspect-square bg-[#001533] rounded-3xl md:rounded-[3rem] border-2 border-slate-100 shadow-2xl overflow-hidden relative group">
                            {/* Professional Background Image */}
                            <Image
                                src="/images/dental_logistics_hub.png"
                                alt="Blueteeth Hub"
                                fill
                                className="object-cover opacity-50 group-hover:scale-110 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#001533] via-[#001533]/40 to-transparent" />

                            <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-end">
                                <Building2 size={40} className="text-brand-primary mb-6" />
                                <h3 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight">The Blueteeth Hub</h3>
                                <div className="space-y-4 w-full">
                                    <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "95%" }}
                                            transition={{ duration: 1.5 }}
                                            className="h-full bg-brand-primary"
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] font-black uppercase text-white tracking-widest">
                                        <span>Logistics Efficiency</span>
                                        <span className="text-brand-primary">95% Systemic Rate</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Floating elements */}
                        <div className="absolute -top-6 -right-6 p-6 bg-emerald-500 text-white rounded-[2rem] shadow-xl shadow-emerald-500/20 hidden md:block">
                            <ShieldCheck size={24} />
                        </div>
                        <div className="absolute -bottom-6 -left-6 p-6 bg-brand-primary text-white rounded-[2rem] shadow-xl shadow-brand-primary/20 hidden md:block">
                            <Award size={24} />
                        </div>
                    </motion.div>
                </div>

                {/* Core Pillars Section */}
                <div className="mb-16 md:mb-20">
                    <div className="text-center mb-12 space-y-2">
                        <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em]">Core Technology</h3>
                        <h2 className="text-2xl md:text-4xl font-black text-slate-900">Why the Network Trusts Us</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { icon: <ShieldCheck className="text-blue-500" />, title: "Authorized Chains", desc: "Every product is sourced directly from OEM authorized distributors with valid warranty trails." },
                            { icon: <Truck className="text-emerald-500" />, title: "Rapid Fulfillment", desc: "Proprietary logistics sync with tier-1 carriers ensures deliveries in T+2 working days across metros." },
                            { icon: <Cpu className="text-brand-primary" />, title: "AI-Powered Procurement", desc: "Our platform learns your clinical consumption patterns to suggest smart re-stock intervals." }
                        ].map((pillar, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-100 hover:shadow-2xl hover:border-brand-primary/15 transition-all group"
                            >
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-5 md:mb-6 border border-slate-50 group-hover:bg-brand-primary/5 group-hover:border-brand-primary/10 transition-colors">
                                    <div className="scale-90">{pillar.icon}</div>
                                </div>
                                <h4 className="text-lg font-black text-slate-900 mb-3">{pillar.title}</h4>
                                <p className="text-slate-500 text-[13px] font-medium leading-relaxed">{pillar.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-[#003399] via-[#0047AB] to-[#001F4D] rounded-3xl md:rounded-[3rem] p-8 md:p-16 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-900/40"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/[0.05] rounded-full blur-[100px] -mr-48 -mt-48" />

                    <div className="relative z-10 max-w-3xl mx-auto space-y-6 md:space-y-8">
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight italic">
                            &ldquo;Committed to the SMILE of those who build smiles.&rdquo;
                        </h2>
                        <p className="text-blue-100/80 font-medium text-base md:text-lg leading-relaxed px-4 md:px-0">
                            Ready to transform your clinical operations? Join 12,000+ professionals in the Blueteeth network today.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link href="/shop" className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-white text-[#003399] rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-50 transition-all shadow-xl active:scale-95">
                                Explore Products
                            </Link>
                            <Link href="/contact" className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 bg-white/10 text-white rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/20 hover:bg-white/20 transition-all active:scale-95">
                                Partner Consultation
                            </Link>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
