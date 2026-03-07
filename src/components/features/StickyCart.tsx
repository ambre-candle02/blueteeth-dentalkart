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
                    className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-xl z-40 md:hidden"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <p className="font-bold text-slate-900 truncate">{product.name}</p>
                            <p className="text-brand-primary font-bold">₹{product.price.toLocaleString()}</p>
                        </div>
                        <button
                            onClick={() => {
                                const { toast } = require("sonner");
                                addItem(product);
                                toast.success(`Added ${product.name} to cart`);
                            }}
                            className="bg-brand-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-dark transition-colors flex items-center gap-2"
                        >
                            <ShoppingCart size={18} />
                            Add
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
