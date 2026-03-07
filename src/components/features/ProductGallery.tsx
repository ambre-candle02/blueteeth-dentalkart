"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Product } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export function ProductGallery({ product }: { product: Product }) {
    const [activeImage, setActiveImage] = useState(0);
    const dbImages = product.images?.map(img => img.url) || [];
    if (dbImages.length === 0 && product.image) {
        dbImages.push(product.image);
    }

    const images = [
        dbImages[0] || null,
        dbImages[1] || null,
        dbImages[2] || null,
        dbImages[3] || null
    ];

    return (
        <div className="flex flex-col gap-6 w-full max-w-xl">
            <div className="relative aspect-square bg-[#F8FAFF] rounded-[2.5rem] overflow-hidden flex items-center justify-center p-10 md:p-14 border border-slate-100 group cursor-zoom-in shadow-[0_20px_60px_rgba(0,86,210,0.05)] hover:shadow-[0_30px_80px_rgba(0,86,210,0.08)] transition-all duration-700">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/[0.02] via-transparent to-brand-primary/[0.02]" />
                <div className="absolute inset-0 border-[8px] border-white/40 rounded-[2.5rem] pointer-events-none" />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeImage}
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.05, y: -10 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 w-full h-full flex items-center justify-center"
                    >
                        {images[activeImage] ? (
                            <img
                                src={images[activeImage]!}
                                alt={`${product.name} view ${activeImage + 1}`}
                                className="w-full h-full object-contain drop-shadow-2xl"
                            />
                        ) : (
                            <div className="text-slate-200 text-[120px] font-black select-none opacity-40 group-hover:opacity-60 transition-all duration-700 drop-shadow-2xl transform group-hover:scale-105">
                                {product.name[0]}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {product.originalPrice && (
                    <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-xl shadow-lg shadow-brand-primary/5 border border-brand-primary/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Elite Choice</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-4 gap-4 px-4">
                {images.map((img, idx) => (
                    <motion.button
                        key={idx}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "aspect-square rounded-2xl border-2 flex items-center justify-center bg-white transition-all shadow-sm",
                            activeImage === idx
                                ? "border-brand-primary ring-4 ring-brand-primary/10"
                                : "border-transparent hover:border-slate-200"
                        )}
                        onClick={() => setActiveImage(idx)}
                    >
                        <div className={cn(
                            "w-full h-full rounded-xl transition-all overflow-hidden flex items-center justify-center p-1",
                            activeImage === idx ? "bg-brand-primary/10" : "bg-slate-50"
                        )}>
                            {img ? (
                                <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-contain rounded-lg" />
                            ) : (
                                <div className={cn(
                                    "w-full h-full flex items-center justify-center text-[10px] font-black transition-colors",
                                    activeImage === idx ? "text-brand-primary" : "text-slate-400"
                                )}>
                                    0{idx + 1}
                                </div>
                            )}
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
