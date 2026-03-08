"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

export function StickyCart({ product }: { product: Product }) {
    const [isVisible, setIsVisible] = useState(false);
    const { addItem } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            // Show when scrolled past 600px (approx where add to cart button goes out of view)
            setIsVisible(scrollY > 600);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isAvailable = product.stockStatus
        ? product.stockStatus === "in-stock"
        : product.inStock !== false;

    if (!isAvailable) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-5 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] z-40 md:hidden"
                >
                    <div className="flex items-center gap-4 max-w-md mx-auto">
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 truncate text-sm">{product.name}</p>
                            <p className="text-brand-primary font-black text-lg">₹{product.price.toLocaleString()}</p>
                        </div>
                        <button
                            onClick={() => {
                                const { toast } = require("sonner");
                                addItem(product);
                                toast.success(`Added ${product.name} to cart`);
                            }}
                            className="bg-brand-primary text-white px-8 py-3.5 rounded-2xl font-black text-sm hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2 active:scale-95"
                        >
                            <ShoppingCart size={16} />
                            Add
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
