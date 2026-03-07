"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    LayoutGrid, ChevronRight, Layers, Box,
    Stethoscope, Scissors, Syringe, Activity, Smile, Leaf,
    ArrowRight, ShieldCheck
} from "lucide-react";
import { CATEGORIES } from "@/lib/data";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, any> = {
    "Equipment": Stethoscope,
    "Instruments": Scissors,
    "Consumables": Syringe,
    "Endodontics": Activity,
    "Oral Care": Smile,
    "Eco-Sustainable": Leaf
};

const COLOR_MAP: Record<string, { bg: string, text: string, accent: string }> = {
    "Equipment": { bg: "bg-blue-100/60", text: "text-blue-600", accent: "bg-blue-600" },
    "Instruments": { bg: "bg-purple-100/60", text: "text-purple-600", accent: "bg-purple-600" },
    "Consumables": { bg: "bg-emerald-100/60", text: "text-emerald-600", accent: "bg-emerald-600" },
    "Endodontics": { bg: "bg-orange-100/60", text: "text-orange-600", accent: "bg-orange-600" },
    "Oral Care": { bg: "bg-pink-100/60", text: "text-pink-600", accent: "bg-pink-600" },
    "Eco-Sustainable": { bg: "bg-teal-100/60", text: "text-teal-600", accent: "bg-teal-600" }
};

export default function CollectionPage() {
    return (
        <div className="min-h-screen bg-[#FAFBFF] pb-20">
            {/* Header Section - More Compact */}
            <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Product Collections</h1>
                            <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                {CATEGORIES.length} Categories
                            </span>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Explore our premium range of dental supplies and professional equipment.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-600/20 border border-emerald-500">
                            <ShieldCheck size={16} className="text-white" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Quality Guaranteed</span>
                        </div>
                        <Link href="/shop" className="px-6 py-2.5 bg-brand-primary text-white text-[11px] font-bold rounded-xl hover:bg-brand-dark transition-all uppercase tracking-widest shadow-lg shadow-brand-primary/15">
                            Shop All
                        </Link>
                    </div>
                </div>

                {/* Grid Layout - 3 per row, much more compact than long vertical sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {CATEGORIES.map((category, idx) => {
                        const Icon = ICON_MAP[category.name] || Box;
                        const styles = COLOR_MAP[category.name] || COLOR_MAP["Equipment"];

                        return (
                            <motion.div
                                key={category.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group h-full"
                            >
                                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col overflow-hidden">
                                    {/* Card Header */}
                                    <div className="p-8 pb-4">
                                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform", styles.bg, styles.text)}>
                                            <Icon size={24} strokeWidth={2.5} />
                                        </div>
                                        <h2 className="text-2xl font-bold text-slate-900 mb-2">{category.name}</h2>
                                        <p className="text-sm text-slate-400 font-medium mb-6">Professional {category.name.toLowerCase()} for your clinic.</p>
                                    </div>

                                    {/* Subcategories List - Integrated in card to save vertical space */}
                                    <div className="px-8 flex-1">
                                        <div className="space-y-1 mb-8">
                                            {category.subcategories.slice(0, 5).map(sub => (
                                                <Link
                                                    key={sub.name}
                                                    href={sub.href}
                                                    className="flex items-center justify-between group/item py-2.5 px-3 rounded-xl hover:bg-slate-50 transition-colors"
                                                >
                                                    <span className="text-sm font-semibold text-slate-600 group-hover/item:text-brand-primary transition-colors">{sub.name}</span>
                                                    <ChevronRight size={14} className="text-slate-300 group-hover/item:text-brand-primary transition-all group-hover/item:translate-x-1" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="p-8 pt-0 mt-auto">
                                        <Link
                                            href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                                            className={cn("w-full py-4.5 rounded-[1.25rem] flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest transition-all border border-transparent shadow-sm", styles.bg, styles.text, "hover:bg-white hover:border-slate-100 hover:shadow-md hover:-translate-y-0.5")}
                                        >
                                            Explore Collection <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom Trust Section - Simplified */}
                <div className="mt-24 p-10 md:p-14 bg-white rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.02)] flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden group">
                    {/* Subtle Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[radial-gradient(#0056D2_1px,transparent_1px)] [background-size:20px_20px]" />

                    <div className="max-w-xl text-center md:text-left relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100">
                            <ShieldCheck size={12} strokeWidth={3} /> Certified Clinical Partner
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">Professional Dental Solutions</h2>
                        <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">
                            Every product in our collection undergoes rigorous quality checks. We partner with the world's leading medical innovators to bring excellence to your practice.
                        </p>
                    </div>

                    <div className="flex flex-wrap lg:flex-nowrap items-center justify-center lg:justify-end gap-4 md:gap-6 relative z-10 w-full lg:w-auto">
                        {[
                            { name: "3M ESPE", color: "blue" },
                            { name: "Dentsply Sirona", color: "purple" },
                            { name: "Ivoclar", color: "emerald" },
                            { name: "GC India", color: "rose" }
                        ].map(brand => {
                            const tints: Record<string, string> = {
                                blue: "bg-blue-50 border-blue-100/50 text-blue-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-100",
                                purple: "bg-purple-50 border-purple-100/50 text-purple-500 hover:text-purple-600 hover:border-purple-200 hover:bg-purple-100",
                                emerald: "bg-emerald-50 border-emerald-100/50 text-emerald-500 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-100",
                                rose: "bg-rose-50 border-rose-100/50 text-rose-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-100"
                            };
                            return (
                                <div
                                    key={brand.name}
                                    className={`px-5 py-3 rounded-2xl border font-bold text-[13px] tracking-tight transition-all cursor-default whitespace-nowrap shadow-sm hover:shadow-md hover:-translate-y-0.5 ${tints[brand.color]}`}
                                >
                                    {brand.name}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
