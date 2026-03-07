"use client";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Trash2, ShoppingCart, Heart, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { BackButton } from "@/components/ui/BackButton";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function WishlistPage() {
    const { items, removeFromWishlist } = useWishlist();
    const { addItem } = useCart();
    const [addedIds, setAddedIds] = useState<string[]>([]);

    const handleAddToCart = (product: any) => {
        addItem(product);
        setAddedIds(prev => [...prev, product.id]);
        setTimeout(() => setAddedIds(prev => prev.filter(id => id !== product.id)), 2000);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-16 md:py-24">
            <div className="max-w-[1000px] mx-auto px-6 md:px-12 relative z-10">

                {/* Clean Professional Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative w-full rounded-[2rem] overflow-hidden mb-12 bg-white border border-slate-200 shadow-xl shadow-slate-200/40"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-8 gap-6">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                            <BackButton className="w-12 h-12 rounded-2xl bg-slate-50 border-slate-100 text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-sm" />
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-brand-primary/5 flex items-center justify-center shadow-md shadow-brand-primary/5 shrink-0 border border-brand-primary/10">
                                    <Heart size={24} className="text-brand-primary/50" fill="currentColor" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Wishlist</h1>
                                        <span className="bg-brand-primary/10 text-brand-primary text-xs font-black px-3 py-1 rounded-full">{items.length}</span>
                                    </div>
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-1">Products saved for later</p>
                                </div>
                            </div>
                        </div>

                        {items.length > 0 && (
                            <Link href="/shop" className="px-6 py-3 rounded-xl bg-brand-primary text-white text-xs font-bold hover:bg-brand-dark transition-all shadow-md shadow-brand-primary/20">
                                + Browse More
                            </Link>
                        )}
                    </div>
                </motion.div>

                {items.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-32 bg-white rounded-[2rem] border border-slate-200 shadow-sm"
                    >
                        <div className="relative w-28 h-28 mx-auto mb-8">
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                className="absolute inset-0 bg-brand-primary/5 rounded-full blur-3xl opacity-40"
                            />
                            <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center shadow-lg border border-brand-primary/5">
                                <Heart size={48} className="text-brand-primary/40 transition-transform group-hover:scale-105" fill="currentColor" strokeWidth={1.5} />
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Wishlist is empty</h2>
                        <p className="text-slate-500 text-sm mb-8 max-w-xs mx-auto">Your saved items will appear here for easy access later.</p>
                        <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-black text-white bg-brand-primary hover:bg-brand-dark px-10 py-4 rounded-xl transition-all shadow-lg shadow-brand-primary/25">
                            Browse Products
                        </Link>
                    </motion.div>
                ) : (
                    <div className="flex flex-col gap-6">
                        <AnimatePresence>
                            {items.map((item: any, idx: number) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                    key={item.id}
                                    className="bg-white p-6 rounded-[1.75rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-8 hover:shadow-xl hover:border-brand-primary/10 transition-all duration-500 group"
                                >
                                    {/* Image */}
                                    <Link
                                        href={`/product/${item.id}`}
                                        className="relative w-full md:w-36 h-36 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shrink-0"
                                    >
                                        {item.images?.[0] ? (
                                            <Image src={item.images[0]} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-200 text-3xl font-black">{item.name[0]}</div>
                                        )}
                                        <div className="absolute top-2 left-2 bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">In Stock</div>
                                    </Link>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em] mb-1">{item.category}</div>
                                        <Link href={`/product/${item.id}`}>
                                            <h3 className="text-lg font-bold text-slate-900 hover:text-brand-primary transition-colors line-clamp-1">{item.name}</h3>
                                        </Link>
                                        <div className="flex items-center gap-4 mt-3">
                                            <span className="text-xl font-black text-slate-900">₹{item.price?.toLocaleString()}</span>
                                            {item.originalPrice > item.price && (
                                                <span className="text-sm text-slate-400 line-through">₹{item.originalPrice?.toLocaleString()}</span>
                                            )}
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-medium mt-2">Delivery: Authorized Logistics Sync</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                                        <button
                                            onClick={() => handleAddToCart(item)}
                                            className={cn(
                                                "flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
                                                addedIds.includes(item.id)
                                                    ? "bg-emerald-500 text-white"
                                                    : "bg-brand-primary text-white hover:bg-brand-dark shadow-sm hover:shadow-lg hover:shadow-brand-primary/20"
                                            )}
                                        >
                                            {addedIds.includes(item.id)
                                                ? <><CheckCircle2 size={16} /> Added</>
                                                : <><ShoppingCart size={16} /> Add to Cart</>
                                            }
                                        </button>
                                        <button
                                            onClick={() => removeFromWishlist(item.id)}
                                            className="w-12 h-12 rounded-xl text-red-500 bg-red-50 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all border border-red-100"
                                            title="Remove"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
