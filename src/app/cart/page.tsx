"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Trash2, ArrowRight, ShoppingBag, ShoppingCart, Sparkles, CheckCircle2, ShieldCheck, Truck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function CartPage() {
    const { items, removeItem, updateQuantity, cartTotal, config, isSystemLoading } = useCart();

    if (isSystemLoading) {
        return (
            <div className="min-h-screen bg-[#FAFBFF] py-20 flex justify-center">
                <Loader2 className="animate-spin text-brand-primary" size={40} />
            </div>
        );
    }

    const gstCount = cartTotal * 0.18;
    const finalTotalValue = cartTotal + gstCount;

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-start pt-8 bg-[#FAFBFF] relative overflow-hidden px-6 text-center">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/[0.03] rounded-full blur-[100px] -mr-64 -mt-64" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[100px] -ml-48 -mb-48" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10 flex flex-col items-center max-w-lg"
                >
                    <div className="w-20 h-20 bg-brand-primary/10 rounded-3xl border border-brand-primary/10 flex items-center justify-center mb-6 relative">
                        <ShoppingBag size={32} className="text-brand-primary" />
                    </div>

                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-3 tracking-tight">Your Cart is Currently Empty</h1>
                    <p className="text-slate-500 text-base leading-relaxed mb-8">
                        Don&apos;t let your professional clinics wait. Discover the next era of dental technology and start curating your elite supplies.
                    </p>

                    <Link
                        href="/shop"
                        className="group relative flex items-center gap-4 bg-brand-primary text-white px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/25 hover:-translate-y-1 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            Explore Collection <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFBFF] pb-40 lg:pb-24 relative">
            {/* Background Decor - fixed so they don't affect sticky */}
            <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-brand-primary/[0.03] rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none" />

            {/* Admin Announcement Banner */}
            {config?.shopAnnouncement && (
                <div className="bg-slate-900 text-white py-3 text-center relative z-20">
                    <p className="text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 animate-pulse">
                        <Sparkles size={14} className="text-brand-primary" />
                        {config.shopAnnouncement}
                    </p>
                </div>
            )}

            {/* Gradient Header Card */}
            <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 pt-10 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative w-full mx-2 md:mx-auto rounded-2xl md:rounded-3xl overflow-hidden mt-4 mb-6 bg-white border-2 border-slate-100 shadow-sm"
                >
                    <div className="flex items-center justify-between p-3 md:px-8 md:py-5 gap-4">
                        <div className="flex items-center gap-3 md:gap-6">
                            <BackButton className="w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-50 border-slate-100 text-brand-primary hover:bg-brand-primary hover:text-white transition-all shadow-sm shrink-0" />
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="hidden sm:flex w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-brand-primary/5 items-center justify-center shadow-md shadow-brand-primary/5 shrink-0 border border-brand-primary/10">
                                    <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-brand-primary/60" fill="currentColor" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight">My Cart</h1>
                                        <span className="bg-brand-primary/10 text-brand-primary text-[9px] md:text-xs font-black px-2 py-0.5 md:px-3 md:py-1 rounded-full">{items.length}</span>
                                    </div>
                                    <p className="text-[9px] md:text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">
                                        {config?.maxCartItems && `Limit: ${items.length}/${config.maxCartItems} Items`}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] md:text-sm text-emerald-600 font-black uppercase tracking-widest shrink-0 hidden md:flex backdrop-blur-sm bg-emerald-50/50 px-4 py-2 rounded-full border border-emerald-100">
                            <Sparkles size={14} />
                            Free Shipping
                        </div>
                    </div>
                </motion.div>
            </div>


            <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                    {/* Items Section */}
                    <div className="lg:col-span-8 flex flex-col gap-3">
                        <AnimatePresence mode="popLayout">
                            {items.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                    className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-primary/15 transition-all duration-300 overflow-hidden"
                                >
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4">
                                        {/* Image & Main Info Group */}
                                        <div className="flex items-center gap-4 w-full sm:w-auto flex-1 min-w-0">
                                            {/* Image */}
                                            <Link href={`/product/${item.id}`} className="relative w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shrink-0 group/img">
                                                {item.image ? (
                                                    <Image src={item.image} alt={item.name} fill className="object-contain p-2 group-hover/img:scale-105 transition-transform duration-500" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-3xl font-black text-slate-200">{item.name[0]}</div>
                                                )}
                                            </Link>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest block mb-0.5">{item.category}</span>
                                                <Link href={`/product/${item.id}`}>
                                                    <h3 className="text-sm md:text-base font-bold text-slate-900 hover:text-brand-primary transition-colors line-clamp-1">{item.name}</h3>
                                                </Link>

                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    <span className="text-sm font-black text-slate-900">₹{item.price?.toLocaleString()}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold">/ unit</span>

                                                    {config?.showStockLevel && (
                                                        <span className={cn(
                                                            "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border",
                                                            !item.inStock
                                                                ? "bg-amber-50 text-amber-600 border-amber-100"
                                                                : "bg-emerald-50 text-emerald-600 border-emerald-100"
                                                        )}>
                                                            {item.inStock ? 'Ready for Dispatch' : 'Limited Supply'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions Group (Qty + Subtotal + Delete) */}
                                        <div className="flex flex-row items-center justify-between gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-50 mt-1 sm:mt-0">
                                            {/* Quantity Selector */}
                                            <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 p-0.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] scale-90 sm:scale-100 origin-left">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-brand-primary hover:bg-white rounded-lg transition-all disabled:opacity-30 font-black text-lg"
                                                >
                                                    −
                                                </button>
                                                <span className="w-8 text-center text-xs font-black text-slate-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-brand-primary hover:bg-white rounded-lg transition-all font-black text-lg"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Results: Subtotal & Delete */}
                                            <div className="flex items-center gap-4 shrink-0">
                                                <div className="text-right">
                                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total</p>
                                                    <span className="text-sm md:text-base font-black text-brand-primary">₹{(item.price * item.quantity).toLocaleString()}</span>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100 active:scale-95 group/del shadow-sm hover:shadow-md shrink-0"
                                                    title="Remove Item"
                                                >
                                                    <Trash2 size={16} className="group-hover/del:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary Card */}
                    <div className="lg:col-span-4 lg:self-start lg:sticky lg:top-28">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
                        >
                            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <span className="w-1 h-5 bg-brand-primary rounded-full" /> Order Summary
                            </h2>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">Subtotal</span>
                                    <span className="text-sm font-semibold text-slate-800">₹{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">GST (18%)</span>
                                    <span className="text-sm font-semibold text-slate-800">₹{gstCount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">Shipping</span>
                                    <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1"><Truck size={13} /> Free</span>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-4 mb-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-slate-700">Total</span>
                                    <span className="text-xl font-bold text-brand-primary">₹{finalTotalValue.toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-slate-400 text-right mt-0.5">Incl. all taxes</p>
                            </div>

                            <Link href="/checkout" className="w-full bg-brand-primary hover:bg-brand-dark text-white py-3 rounded-xl font-semibold text-sm transition-all shadow-md shadow-brand-primary/20 active:scale-95 flex items-center justify-center gap-2">
                                Secure Checkout <ArrowRight size={16} />
                            </Link>

                            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
                                <span className="flex items-center gap-1"><ShieldCheck size={12} /> Razorpay Secured</span>
                                <span>•</span>
                                <span>Genuine Products Warranty</span>
                            </div>
                        </motion.div>
                    </div>


                </div>
            </div>
        </div>
    );
}
