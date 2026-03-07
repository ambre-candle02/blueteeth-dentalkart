"use client";

import { PRODUCTS } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart, TrendingUp, Heart, ChevronDown, Sparkles, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function BestSellersPage() {
    const [sortBy, setSortBy] = useState("popular");

    const bestSellers = [...PRODUCTS].sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        if (sortBy === "rating") return b.rating - a.rating;
        return b.reviews - a.reviews; // popular (default)
    });

    const { addItem } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [addedIds, setAddedIds] = useState<string[]>([]);

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
        <div className="bg-[#FAFBFF] min-h-screen py-8">
            <div className="max-w-[1500px] w-full mx-auto px-6 sm:px-10 lg:px-14">

                {/* Unified Premium Header (The "Patti") */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mb-10">
                    <div className="relative p-7 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-primary/[0.02] to-transparent pointer-events-none" />

                        <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                            {/* Dynamic Client-side Back Button */}
                            <BackButton />

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">Best Sellers</h1>
                                    <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Top {bestSellers.length} Picks</span>
                                </div>
                                <p className="text-sm text-slate-400 font-medium">Clinically preferred products by dentists across India.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto relative z-10">
                            <div className="relative group/sort flex-1 md:flex-initial">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full appearance-none bg-brand-primary text-white px-8 py-3.5 pr-14 rounded-2xl text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-brand-primary/10 cursor-pointer hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20"
                                >
                                    <option value="popular">Sort: Popularity</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Highest Rated</option>
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" size={16} />
                            </div>

                            <div className="hidden xl:flex items-center gap-2 px-5 py-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-600/20 border border-emerald-500">
                                <TrendingUp size={16} className="text-white" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Trending Now</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {bestSellers.map((product, idx) => {
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
                                transition={{ delay: idx * 0.05 }}
                                className="group"
                            >
                                <Link href={`/product/${product.id}`} className="block h-full">
                                    <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-brand-primary/20 h-full flex flex-col hover:-translate-y-1">

                                        {/* Image wrapper with object-contain to match cart and product page fixes */}
                                        <div className="relative aspect-square bg-white p-4">
                                            {product.image ? (
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300 text-sm italic">No Image</div>
                                            )}

                                            {/* Labels */}
                                            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                                                {discount > 0 && (
                                                    <span className="bg-red-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-lg shadow-sm">{discount}% OFF</span>
                                                )}
                                                {idx < 3 && (
                                                    <span className="bg-orange-500 text-white text-[9px] font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1 uppercase tracking-tighter">
                                                        <Star size={10} className="fill-white" /> Top {idx + 1}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Wishlist */}
                                            <button
                                                onClick={(e) => handleWishlist(e, product)}
                                                className={cn(
                                                    "absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 z-10",
                                                    wishlisted ? "bg-red-500 text-white scale-110" : "bg-white text-slate-400 hover:text-red-500 hover:bg-white"
                                                )}
                                            >
                                                <Heart size={16} className={wishlisted ? "fill-white" : ""} />
                                            </button>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 pt-2 flex flex-col flex-1">
                                            <div className="text-[10px] text-brand-primary font-bold uppercase tracking-[0.2em] mb-2">{product.category}</div>
                                            <h3 className="font-bold text-slate-800 text-sm leading-tight mb-3 line-clamp-2 group-hover:text-brand-primary transition-colors">{product.name}</h3>

                                            <div className="flex items-center gap-1 mb-4">
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={11} className={i < Math.floor(product.rating) ? "fill-current" : "fill-slate-200 text-slate-200"} />
                                                    ))}
                                                </div>
                                                <span className="text-[11px] text-slate-400 font-bold ml-1">{product.reviews} reviews</span>
                                            </div>

                                            <div className="mt-auto flex items-center justify-between">
                                                <div>
                                                    <div className="text-lg font-bold text-slate-900">₹{product.price.toLocaleString()}</div>
                                                    {product.originalPrice > product.price && (
                                                        <div className="text-[11px] text-slate-400 line-through">₹{product.originalPrice.toLocaleString()}</div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={(e) => handleAddToCart(e, product)}
                                                    className={cn(
                                                        "w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md",
                                                        isAdded ? "bg-emerald-500 text-white scale-90" : "bg-brand-primary text-white hover:bg-brand-dark hover:scale-105"
                                                    )}
                                                >
                                                    {isAdded ? <Sparkles size={18} /> : <ShoppingCart size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Trust Section */}
                <div className="mt-20 p-10 md:p-14 bg-white rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.02)] flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.01] pointer-events-none bg-[radial-gradient(#0056D2_1px,transparent_1px)] [background-size:20px_20px]" />

                    <div className="max-w-xl text-center md:text-left relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100">
                            <Sparkles size={12} strokeWidth={3} /> Certified Clinical Choice
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">Preferred by Professionals</h2>
                        <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">
                            These products are the most frequently ordered items by dental clinics nationwide. High performance and reliability guaranteed.
                        </p>
                    </div>

                    <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-6 relative z-10">
                        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 text-center flex-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Satisfied Clinicians</p>
                            <p className="text-2xl font-bold text-slate-900">50,000+</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 text-center flex-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Orders Fulfilled</p>
                            <p className="text-2xl font-bold text-slate-900">120,000+</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
