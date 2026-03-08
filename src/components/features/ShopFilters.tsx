"use client";

import { useState } from "react";
import { ChevronDown, Filter, RotateCcw, Check, Sparkles, Folder, FolderOpen } from "lucide-react";
import { CATEGORIES } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShopFiltersProps {
    price: number;
    setPrice: (val: number) => void;
    selectedCats: string[];
    selectedSubs: string[]; // New: Sub-category tracking
    toggleCat: (cat: string) => void;
    toggleSub: (sub: string) => void; // New: Sub-category toggle
    clearFilters: () => void;
}

export function ShopFilters({ price, setPrice, selectedCats, selectedSubs, toggleCat, toggleSub, clearFilters }: ShopFiltersProps) {
    const [expandedCats, setExpandedCats] = useState<string[]>([]);

    const toggleExpand = (catName: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setExpandedCats(prev =>
            prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
        );
    };

    return (
        <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 pb-5 border-b border-slate-100">
                <div className="flex flex-col">
                    <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                        <Filter size={18} className="text-brand-primary" /> Sector Filters
                    </h3>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Ecosystem Matrix</span>
                </div>
                <button
                    onClick={clearFilters}
                    className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90 group"
                >
                    <RotateCcw size={16} className="transition-transform" />
                </button>
            </div>

            {/* Sections */}
            <div className="space-y-6">
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Clinical Departments</label>
                    <div className="space-y-2">
                        {CATEGORIES.map((cat, idx) => {
                            const isSelected = selectedCats.includes(cat.name);
                            const isExpanded = expandedCats.includes(cat.name);

                            return (
                                <div key={idx} className="space-y-1">
                                    <div
                                        onClick={() => toggleCat(cat.name)}
                                        className={cn(
                                            "flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all border group active:scale-[0.98]",
                                            isSelected ? "bg-brand-primary/5 border-brand-primary/20" : "bg-white border-slate-50 hover:border-slate-200"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-4 h-4 rounded border flex items-center justify-center transition-all",
                                                isSelected ? "bg-brand-primary border-brand-primary" : "border-slate-200"
                                            )}>
                                                {isSelected && <Check size={10} className="text-white stroke-[3]" />}
                                            </div>
                                            <span className={cn("text-[13px] font-bold", isSelected ? "text-brand-primary" : "text-slate-600")}>{cat.name}</span>
                                        </div>
                                        <button
                                            onClick={(e) => toggleExpand(cat.name, e)}
                                            className="p-1 text-slate-400 hover:text-slate-600"
                                        >
                                            <ChevronDown size={14} className={cn("transition-transform duration-300", isExpanded && "rotate-180")} />
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden pl-10 pr-2 space-y-1"
                                            >
                                                {cat.subcategories.map(sub => {
                                                    const subSelected = selectedSubs.includes(sub.name);
                                                    return (
                                                        <label key={sub.name} className="flex items-center gap-3 py-1.5 cursor-pointer group">
                                                            <input
                                                                type="checkbox"
                                                                className="hidden"
                                                                checked={subSelected}
                                                                onChange={() => toggleSub(sub.name)}
                                                            />
                                                            <div className={cn(
                                                                "w-3 h-3 rounded-full border transition-all",
                                                                subSelected ? "bg-brand-primary border-brand-primary scale-125" : "border-slate-300 group-hover:border-slate-400"
                                                            )} />
                                                            <span className={cn("text-[11px] font-bold tracking-tight", subSelected ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600")}>
                                                                {sub.name}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="h-px bg-slate-50" />

                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 block">Budget Spectrum</label>
                    <input
                        type="range"
                        min="0"
                        max="200000"
                        step="1000"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-brand-primary mb-6"
                    />
                    <div className="flex justify-between">
                        <div className="space-y-1">
                            <span className="text-[8px] font-black text-slate-300 uppercase block">Min</span>
                            <span className="text-xs font-black text-slate-900">₹0</span>
                        </div>
                        <div className="space-y-1 text-right">
                            <span className="text-[8px] font-black text-brand-primary/40 uppercase block">Cap</span>
                            <span className="text-xs font-black text-brand-primary">₹{price.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Tip */}
            <div className="mt-12 p-5 bg-brand-primary rounded-3xl text-white relative overflow-hidden shadow-[0_12px_30px_-10px_rgba(0,86,210,0.3)] border border-brand-primary/20">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} className="text-white" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white">Global Sourcing</span>
                    </div>
                    <p className="text-[9px] text-white/80 leading-relaxed font-bold">Refine your matrix to match specific clinical workflows.</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl" />
            </div>
        </div>
    );
}
