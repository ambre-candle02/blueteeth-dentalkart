"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Heart, Eye, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    product: Product;
}

import { motion } from "framer-motion";

export function ProductCard({ product }: ProductCardProps) {
    const router = useRouter();
    const { addItem } = useCart();
    const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

    const isInWish = isInWishlist(product.id);
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isInWish) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const isAvailable = product.stockStatus
        ? product.stockStatus === "in-stock"
        : product.inStock !== false;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const { toast } = require("sonner");

        if (!isAvailable) {
            toast.error("This product is currently out of stock");
            return;
        }

        addItem(product);
        toast.success(`${product.name} added to cart!`);
    };

    return (
        <motion.div
            initial={false}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="group relative bg-white border border-blue-100 rounded-3xl overflow-hidden shadow-md transition-all duration-200 hover:shadow-xl hover:border-blue-200"
        >
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                {discount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg shadow-red-500/20 uppercase tracking-tighter">
                        -{discount}% ECO-SAVE
                    </span>
                )}
                {product.stockStatus === 'coming-soon' ? (
                    <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg shadow-amber-500/20 uppercase tracking-tighter">
                        COMING SOON
                    </span>
                ) : (product.stockStatus === 'out-of-stock' || product.inStock === false) && (
                    <span className="bg-slate-900 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg shadow-slate-900/20 uppercase tracking-tighter">
                        OUT OF STOCK
                    </span>
                )}
            </div>


            {/* Wishlist Button */}
            < button
                onClick={handleWishlist}
                className={
                    cn(
                        "absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm transition-colors hover:bg-brand-light",
                        isInWish ? "text-red-500" : "text-slate-400 hover:text-red-500"
                    )
                }
            >
                <Heart size={18} fill={isInWish ? "currentColor" : "none"} />
            </button >

            {/* Image Area */}
            <div
                className="cursor-pointer active:opacity-80 transition-opacity"
                onClick={() => router.push(`/product/${product.id}`)}
            >
                <div className="relative h-48 w-full bg-slate-50 p-5 flex items-center justify-center">
                    {product.image ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-contain group-hover:scale-105 transition-transform duration-500 p-2"
                                loading="lazy"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                            No Image
                        </div>
                    )}

                    {/* Quick View Overlay - Simplified for mobile performance */}
                    <div className="absolute inset-0 bg-slate-900/10 md:bg-black/20 md:backdrop-blur-[2px] flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hidden md:flex">
                        <button
                            className="bg-white/80 backdrop-blur-sm text-slate-700 w-10 h-10 rounded-full flex items-center justify-center hover:bg-brand-light hover:text-brand-primary transition-all duration-300 shadow-sm hover:scale-110"
                            title="Quick View"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/product/${product.id}`);
                            }}
                        >
                            <Eye size={20} />
                        </button>
                        <button
                            onClick={handleAddToCart}
                            className="bg-white/80 backdrop-blur-sm text-slate-700 w-10 h-10 rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all duration-300 shadow-sm hover:scale-110"
                            title="Add to Cart"
                        >
                            <ShoppingCart size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-center gap-1.5 mb-2.5">
                    <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn("w-3 h-3", i < Math.floor(product.rating) ? "fill-current" : "opacity-20")} />
                        ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{product.rating}</span>
                </div>

                <Link href={`/product/${product.id}`}>
                    <h3 className="font-bold text-slate-900 mb-1.5 line-clamp-2 hover:text-brand-primary transition-colors h-11 text-sm leading-snug">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{product.category}</p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex flex-col">
                        <span className="text-xl font-black text-slate-900">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                            <span className="text-xs text-slate-400 line-through font-medium">₹{product.originalPrice.toLocaleString()}</span>
                        )}
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={!isAvailable}
                        className={cn(
                            "p-2.5 rounded-xl transition-all duration-300 transform shadow-sm",
                            isAvailable
                                ? "bg-brand-light text-brand-primary hover:bg-brand-primary hover:text-white active:scale-95"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        )}
                    >
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
