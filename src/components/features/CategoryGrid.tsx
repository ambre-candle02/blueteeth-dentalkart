"use client";

import Link from "next/link";
import { ArrowRight, Stethoscope, Scissors, Syringe, Activity, Smile, Leaf } from "lucide-react";
import { CATEGORIES } from "@/lib/data";
import { motion } from "framer-motion";

const CATEGORY_STYLES: Record<string, { icon: any, color: string, bgDefault: string, bgHover: string, borderDefault: string, borderHover: string }> = {
    "Equipment": { icon: Stethoscope, color: "text-blue-600", bgDefault: "bg-blue-500/15", bgHover: "group-hover:bg-blue-500/30", borderDefault: "border-blue-500/30", borderHover: "group-hover:border-blue-500/50" },
    "Instruments": { icon: Scissors, color: "text-purple-600", bgDefault: "bg-purple-500/15", bgHover: "group-hover:bg-purple-500/30", borderDefault: "border-purple-500/30", borderHover: "group-hover:border-purple-500/50" },
    "Consumables": { icon: Syringe, color: "text-emerald-600", bgDefault: "bg-emerald-500/15", bgHover: "group-hover:bg-emerald-500/30", borderDefault: "border-emerald-500/30", borderHover: "group-hover:border-emerald-500/50" },
    "Endodontics": { icon: Activity, color: "text-orange-600", bgDefault: "bg-orange-500/15", bgHover: "group-hover:bg-orange-500/30", borderDefault: "border-orange-500/30", borderHover: "group-hover:border-orange-500/50" },
    "Oral Care": { icon: Smile, color: "text-pink-600", bgDefault: "bg-pink-500/15", bgHover: "group-hover:bg-pink-500/30", borderDefault: "border-pink-500/30", borderHover: "group-hover:border-pink-500/50" },
    "Eco-Sustainable": { icon: Leaf, color: "text-teal-600", bgDefault: "bg-teal-500/15", bgHover: "group-hover:bg-teal-500/30", borderDefault: "border-teal-500/30", borderHover: "group-hover:border-teal-500/50" }
};

export function CategoryGrid() {
    return (
        <section className="pt-8 pb-16 bg-white">
            <div className="max-w-[1600px] w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-4 border-b border-slate-200 gap-4"
                >
                    <div className="flex flex-col gap-1.5 w-full md:w-auto mb-4 md:mb-0">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-6 rounded-full bg-brand-primary/80" />
                            <h2 className="text-xl md:text-2xl font-semibold text-slate-800 tracking-tight">Shop By Category</h2>
                        </div>
                        <p className="text-[13px] text-slate-600 font-medium pl-4">Explore premium dental supplies and advanced equipment</p>
                    </div>
                    <Link href="/shop" className="group relative flex items-center gap-3 text-sm font-black text-white bg-brand-primary hover:bg-brand-dark px-6 py-3 rounded-xl transition-all duration-500 shrink-0 shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/30 hover:-translate-y-1 overflow-hidden">
                        <span className="relative z-10 flex items-center gap-2">
                            View All <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Link>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {CATEGORIES.map((cat, idx) => {
                        const style = CATEGORY_STYLES[cat.name] || { icon: Smile, color: "text-slate-600", bgDefault: "bg-slate-500/15", bgHover: "group-hover:bg-slate-500/30", borderDefault: "border-slate-500/30", borderHover: "group-hover:border-slate-500/50" };
                        const Icon = style.icon;

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Link
                                    href={`/category/${cat.name.toLowerCase()}`}
                                    className={`group relative flex flex-col items-center justify-center p-8 h-48 rounded-[2rem] border shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-500 ${style.bgDefault} ${style.bgHover} ${style.borderDefault} ${style.borderHover} hover:shadow-[0_15px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 block`}
                                >
                                    <div className={`w-14 h-14 rounded-full bg-white flex items-center justify-center ${style.color} group-hover:scale-110 transition-transform duration-500 shadow-sm group-hover:shadow-md`}>
                                        <Icon size={24} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-slate-800 font-semibold text-[15px] mt-4 mb-1 text-center transition-colors">{cat.name}</h3>
                                    <p className="text-slate-400 text-[11px] font-medium tracking-wider uppercase">
                                        {cat.subcategories.length} Collections
                                    </p>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
