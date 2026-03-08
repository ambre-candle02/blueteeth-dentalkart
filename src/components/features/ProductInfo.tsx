"use client";

import { useState } from "react";
import { Star, Heart, Share2, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function ProductInfo({ product }: { product: Product }) {
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useCart();
    const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

    const isInWish = isInWishlist(product.id);

    const handleWishlist = () => {
        if (isInWish) removeFromWishlist(product.id);
        else addToWishlist(product);
    };

    const handleAddToCart = () => {
        const { toast } = require("sonner");
        addItem(product, quantity);
        toast.success(`Added ${quantity} x ${product.name} to cart`);
    };

    const isAvailable = product.stockStatus
        ? product.stockStatus === "in-stock"
        : product.inStock !== false;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-full"
        >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                    <span className="inline-flex items-center text-[9px] md:text-[11px] font-bold text-brand-primary bg-brand-primary/5 px-3 md:px-4 py-1.5 md:py-2 rounded-xl uppercase tracking-widest leading-none whitespace-nowrap border border-brand-primary/10 transition-colors hover:bg-brand-primary/10">
                        {product.category}
                    </span>
                    {isAvailable && (
                        <span className="inline-flex items-center text-[9px] md:text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 md:px-3 py-1 md:py-1.5 rounded-full uppercase tracking-wider leading-none whitespace-nowrap border border-emerald-100/50">
                            <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                            In Stock
                        </span>
                    )}
                </div>
                <div className="flex gap-2 absolute md:relative top-0 right-0 md:top-auto md:right-auto">
                    <button
                        onClick={handleWishlist}
                        className="p-1.5 md:p-2 rounded-full transition-all border border-brand-primary/10 bg-brand-primary/[0.03] shadow-sm hover:shadow-md hover:border-brand-primary/30 hover:bg-white group"
                    >
                        <div className={cn(
                            "bg-brand-primary/[0.08] border border-brand-primary/10 shadow-sm p-1 md:p-1.5 rounded-full group-hover:bg-brand-primary/20 transition-colors flex items-center justify-center",
                            isInWish ? "text-red-500" : "text-brand-primary"
                        )}>
                            <Heart fill={isInWish ? "currentColor" : "none"} size={14} className="md:w-[16px] md:h-[16px] transition-transform group-active:scale-90" />
                        </div>
                    </button>
                    <button className="p-1.5 md:p-2 rounded-full transition-all border border-brand-primary/10 bg-brand-primary/[0.03] shadow-sm hover:shadow-md hover:border-brand-primary/30 hover:bg-white group">
                        <div className="bg-brand-primary/[0.08] border border-brand-primary/10 shadow-sm p-1 md:p-1.5 rounded-full group-hover:bg-brand-primary/20 transition-colors flex items-center justify-center text-brand-primary">
                            <Share2 size={14} className="md:w-[16px] md:h-[16px]" />
                        </div>
                    </button>
                </div>
            </div>

            <h1 className="text-xl md:text-3xl font-black text-slate-900 mb-3 leading-tight tracking-tight mt-4 md:mt-0">
                {product.name}
            </h1>

            <div className="flex items-center gap-8 mb-8 pb-8 border-b border-slate-100/60">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-yellow-400 text-yellow-900 px-3 py-1.5 rounded-lg shadow-sm">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-black text-sm">{product.rating}</span>
                    </div>
                </div>
                <div className="h-10 w-px bg-slate-100" />
                <div className="flex flex-col">
                    <span className="text-base font-black text-slate-800 tracking-tight">{product.reviews} Reviews</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[2px]">Verified Global Rating</span>
                </div>
            </div>

            <div className="mb-8 p-6 bg-[#FAFBFF] rounded-3xl border border-blue-50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl -mr-12 -mt-12" />
                <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
                        ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400 line-through text-base font-medium opacity-60">
                                ₹{product.originalPrice.toLocaleString()}
                            </span>
                            <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-lg shadow-emerald-500/10">
                                Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                            </span>
                        </div>
                    )}
                </div>
                <p className="text-[10px] text-brand-primary/60 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-2 rounded-full bg-brand-primary/20" />
                    Taxes Included • Insurance Covered
                </p>
            </div>

            <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-6 md:mb-8 font-medium italic border-l-4 border-brand-primary/30 pl-4 md:pl-6 py-1 bg-slate-50/50 rounded-r-2xl">
                &quot;{product.description || "Crafted for precision, this elite professional series unit redefines clinical excellence."}&quot;
            </p>

            <div className="mt-auto space-y-6">
                <div className="flex gap-3 p-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center bg-slate-50 rounded-xl p-0.5 shadow-inner border border-slate-100 flex-shrink-0">
                        <button
                            className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm text-slate-900 font-black rounded-lg transition-all disabled:opacity-30"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                        >
                            -
                        </button>
                        <div className="w-10 text-center font-black text-slate-900 text-base">{quantity}</div>
                        <button
                            className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm text-slate-900 font-black rounded-lg transition-all"
                            onClick={() => setQuantity(quantity + 1)}
                        >
                            +
                        </button>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={!isAvailable}
                        className="flex-1 bg-brand-primary text-white font-black text-sm py-3.5 rounded-xl hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 relative overflow-hidden group/btn"
                    >
                        <span className="relative z-10">{isAvailable ? "Secure Order Now" : "Out of Stock"}</span>
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-blue-50 border border-blue-100 transition-all hover:bg-blue-100 group/item">
                        <Truck size={16} className="text-blue-600 transition-transform group-hover/item:scale-110" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-blue-800 text-center">Express</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-emerald-50 border border-emerald-100 transition-all hover:bg-emerald-100 group/item">
                        <ShieldCheck size={16} className="text-emerald-600 transition-transform group-hover/item:scale-110" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-800 text-center">Warranty</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-purple-50 border border-purple-100 transition-all hover:bg-purple-100 group/item">
                        <RefreshCw size={16} className="text-purple-600 transition-transform group-hover/item:scale-110" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-purple-800 text-center">Returns</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
