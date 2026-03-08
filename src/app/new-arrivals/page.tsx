"use client";

import { PRODUCTS } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, Sparkles, Heart, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useState } from "react";

export default function NewArrivalsPage() {
    const [sortBy, setSortBy] = useState("newest");
    const { addItem } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [addedIds, setAddedIds] = useState<string[]>([]);

    const newArrivals = [...PRODUCTS].reverse().sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return 0;
    });

    const handleAddToCart = (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        addItem({ ...product, quantity: 1 });
        setAddedIds(prev => [...prev, product.id]);
        setTimeout(() => setAddedIds(prev => prev.filter(id => id !== product.id)), 1500);
    };

    const handleWishlist = (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        if (isInWishlist(product.id)) removeFromWishlist(product.id);
        else addToWishlist(product);
    };

    return (
        <div className="bg-[#FAFBFF] min-h-screen py-10 relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none" />

            <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 relative z-10">
                {/* NEW — Gradient Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden mb-6 md:mb-8 bg-brand-primary/[0.04] border border-brand-primary/10 shadow-sm"
                >
                    <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between p-3 sm:px-6 sm:py-3.5 gap-3 sm:gap-4">
                        {/* Left */}
                        <div className="flex items-center justify-start gap-3 sm:gap-4 w-full sm:w-auto">
                            <BackButton className="bg-white/80 shrink-0 w-10 h-10 md:w-12 md:h-12 shadow-sm rounded-xl" />
                            <div className="hidden xs:flex w-8 h-8 md:w-10 md:h-10 rounded-xl bg-brand-primary items-center justify-center shadow-md shadow-brand-primary/20 shrink-0">
                                <Sparkles size={14} className="text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-lg md:text-xl font-black text-brand-dark tracking-tight">New Arrivals</h1>
                                    <span className="bg-brand-primary text-white text-[10px] md:text-xs font-black px-2 py-0.5 rounded-full">{newArrivals.length}</span>
                                </div>
                                <p className="text-[10px] md:text-[11px] text-slate-500 mt-0.5">Fresh products, just added</p>
                            </div>
                        </div>

                        {/* Right — Sort */}
                        <div className="relative w-full sm:w-auto shrink-0 mt-1 sm:mt-0">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none w-full sm:w-auto bg-brand-primary text-white text-center sm:text-left px-5 py-2 md:py-2.5 pr-8 sm:pr-10 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary/40 shadow-md hover:bg-brand-dark transition-all cursor-pointer"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price-low">Price: Low → High</option>
                                <option value="price-high">Price: High → Low</option>
                                <option value="rating">Top Rated</option>
                            </select>
                            <ChevronDown className="absolute right-4 sm:right-3 top-1/2 -translate-y-1/2 text-white/80 w-4 h-4 pointer-events-none" />
                        </div>
                    </div>
                </motion.div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                    {newArrivals.map((product, idx) => {
                        const discount = product.originalPrice > product.price
                            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                            : 0;
                        const isAdded = addedIds.includes(product.id);
                        const wishlisted = isInWishlist(product.id);

                        return (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.025, duration: 0.4 }}
                            >
                                <Link href={`/product/${product.id}`} className="group block h-full">
                                    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:border-brand-primary/20 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">

                                        <div className="relative aspect-square bg-slate-50 overflow-hidden">
                                            {product.image ? (
                                                <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">No Image</div>
                                            )}

                                            {/* Left badges */}
                                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                                                <span className="bg-brand-primary text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">NEW</span>
                                                {discount > 0 && (
                                                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{discount}% OFF</span>
                                                )}
                                            </div>

                                            {/* Wishlist heart */}
                                            <button
                                                onClick={(e) => handleWishlist(e, product)}
                                                className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${wishlisted ? "bg-red-500 text-white scale-110" : "bg-white/90 text-slate-400 hover:text-red-500"}`}
                                                title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                                            >
                                                <Heart size={12} className={wishlisted ? "fill-white" : ""} />
                                            </button>
                                        </div>

                                        <div className="p-3 flex flex-col flex-1">
                                            <div className="text-[10px] text-brand-primary font-black uppercase tracking-widest mb-1">{product.category}</div>
                                            <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">{product.name}</h3>

                                            <div className="flex items-center gap-0.5 mb-3">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={10} className={i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-200"} />
                                                ))}
                                                <span className="text-[10px] text-slate-400 ml-1">({product.reviews})</span>
                                            </div>

                                            <div className="mt-auto flex items-center justify-between">
                                                <div>
                                                    <span className="text-base font-black text-slate-900">₹{product.price.toLocaleString()}</span>
                                                    {product.originalPrice > product.price && (
                                                        <span className="text-xs text-slate-400 line-through block">₹{product.originalPrice.toLocaleString()}</span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={(e) => handleAddToCart(e, product)}
                                                    title="Add to Cart"
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 font-bold ${isAdded ? "bg-emerald-500 text-white" : "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white"}`}
                                                >
                                                    {isAdded ? "✓" : <ShoppingCart size={13} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
