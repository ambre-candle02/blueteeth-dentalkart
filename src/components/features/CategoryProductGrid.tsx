"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useState } from "react";

interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    originalPrice: number;
    rating: number;
    reviews: number;
    image?: string;
    [key: string]: any;
}

interface Props {
    products: Product[];
}

export function CategoryProductGrid({ products }: Props) {
    const { addItem } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [addedIds, setAddedIds] = useState<string[]>([]);

    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        addItem(product as any, 1);
        setAddedIds(prev => [...prev, product.id]);
        setTimeout(() => setAddedIds(prev => prev.filter(id => id !== product.id)), 1500);
    };

    const handleWishlist = (e: React.MouseEvent, product: Product) => {
        e.preventDefault();
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product as any);
        }
    };

    if (products.length === 0) return null;

    return (
        <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product, idx) => {
                    const discount = product.originalPrice > product.price
                        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                        : 0;
                    const isAdded = addedIds.includes(product.id);
                    const wishlisted = isInWishlist(product.id);

                    return (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.03 }}
                        >
                            <Link href={`/product/${product.id}`} className="group block h-full">
                                <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:border-brand-primary/20 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">

                                    {/* Image */}
                                    <div className="relative aspect-square bg-slate-50 overflow-hidden">
                                        {product.image ? (
                                            <Image src={product.image} alt={product.name} fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">No Image</div>
                                        )}

                                        {/* Discount Badge */}
                                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                                            {discount > 0 && (
                                                <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{discount}% OFF</span>
                                            )}
                                            {product.rating >= 4.9 && (
                                                <span className="bg-brand-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full">Top Pick</span>
                                            )}
                                        </div>

                                        {/* Wishlist Heart - top right */}
                                        <button
                                            onClick={(e) => handleWishlist(e, product)}
                                            className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${wishlisted
                                                ? "bg-red-500 text-white scale-110"
                                                : "bg-white/90 text-slate-400 hover:text-red-500 hover:bg-white"
                                                }`}
                                            title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                                        >
                                            <Heart size={13} className={wishlisted ? "fill-white" : ""} />
                                        </button>
                                    </div>

                                    {/* Info */}
                                    <div className="p-3 flex flex-col flex-1">
                                        <div className="text-[10px] text-brand-primary font-black uppercase tracking-widest mb-1">{product.category}</div>
                                        <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">{product.name}</h3>

                                        {/* Stars */}
                                        <div className="flex items-center gap-0.5 mb-3">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={10} className={i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-200"} />
                                            ))}
                                            <span className="text-[10px] text-slate-400 ml-1">({product.reviews})</span>
                                        </div>

                                        {/* Price + Cart */}
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
                                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 text-sm font-bold ${isAdded ? "bg-emerald-500 text-white" : "bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white"}`}
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
    );
}
