"use client";

import { Star, Quote, ArrowRight } from "lucide-react";
import { TESTIMONIALS } from "@/lib/data";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Testimonials() {
    return (
        <section className="pt-8 pb-24 bg-white relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -ml-48 -mb-48 pointer-events-none" />

            <div className="max-w-[1920px] w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 pb-4 border-b border-slate-200 gap-4"
                >
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-6 rounded-full bg-brand-primary/80" />
                            <h2 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
                                Trusted by Professionals
                            </h2>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium pl-4">
                            Join thousands of dental clinics across India that rely on Blueteeth.
                        </p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t, idx) => {

                        return (
                            <motion.div
                                key={t.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="relative bg-blue-50/40 p-8 md:p-10 rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-blue-100 group flex flex-col h-full overflow-hidden block transition-transform duration-300 hover:scale-[1.02]"
                            >
                                {/* Decorative Quote Icon */}
                                <Quote className={`absolute top-6 right-6 w-24 h-24 text-blue-500/10 z-0 pointer-events-none`} fill="currentColor" />

                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="flex gap-1 mb-6">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={cn(
                                                    "transition-transform group-hover:scale-110",
                                                    i < Math.floor(t.rating) ? "text-yellow-400 fill-yellow-400" : "text-slate-200"
                                                )}
                                                style={{ transitionDelay: `${i * 50}ms` }}
                                            />
                                        ))}
                                    </div>

                                    <blockquote className="text-[15px] font-medium text-slate-700 mb-8 leading-relaxed flex-grow">
                                        &quot;{t.text}&quot;
                                    </blockquote>

                                    <div className="pt-6 flex items-center gap-4 mt-auto">
                                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-lg shadow-sm">
                                            {t.name[0]}
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="font-bold text-blue-600 text-[15px] leading-tight">{t.name}</h4>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
