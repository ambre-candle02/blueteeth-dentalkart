"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Product } from "@/types";
import { ProductCard } from "@/components/features/ProductCard";
import { cn } from "@/lib/utils";

interface ProductRowProps {
    title: string;
    products: Product[];
    viewAllLink?: string;
    sectionClassName?: string;
    headerClassName?: string;
    showBadge?: boolean;
}

export function ProductRow({ title, products, viewAllLink, sectionClassName, headerClassName, showBadge }: ProductRowProps) {
    if (!products.length) return null;

    return (
        <section className={cn("py-12 relative overflow-hidden", sectionClassName)}>
            {/* Background elements for premium feel */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/[0.02] rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/[0.02] rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />

            <div className="max-w-[1600px] w-full mx-auto px-6 sm:px-12 lg:px-16 xl:px-20 relative z-10">

                {/* Premium Section Header */}
                <div className={cn("mb-8", headerClassName)}>
                    <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 pb-6 border-b border-slate-100 relative">
                        {/* Decorative background for header */}
                        <div className="absolute bottom-0 left-0 w-32 h-1 bg-brand-primary rounded-full transform translate-y-1/2" />

                        {/* Left: Badge + Title + Accent Line */}
                        <div className="flex flex-col items-center md:items-start gap-3">
                            {showBadge && (
                                <div className="flex items-center gap-2.5 bg-brand-primary/[0.05] border border-brand-primary/10 px-4 py-1.5 rounded-full mb-2">
                                    <Sparkles className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
                                    <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em]">
                                        Tailored Selection
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-4">
                                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{title}</h2>
                            </div>
                            <p className="text-sm text-slate-500 font-medium md:pl-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary/40" />
                                {products.length} elite product{products.length !== 1 ? "s" : ""} curated for your professional needs
                            </p>
                        </div>

                        {/* Right: View All CTA */}
                        {viewAllLink && (
                            <Link
                                href={viewAllLink}
                                className="group relative flex items-center gap-3 text-sm font-black text-white bg-brand-primary hover:bg-brand-dark px-6 py-3 rounded-xl transition-all duration-500 shrink-0 shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/30 hover:-translate-y-1 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    View Full Catalog
                                    <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {products.slice(0, 4).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
