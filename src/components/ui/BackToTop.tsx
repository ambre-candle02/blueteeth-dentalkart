"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={scrollToTop}
                    className={cn(
                        "fixed bottom-[170px] md:bottom-28 right-4 md:right-6 z-50 p-2.5 md:p-3 rounded-full shadow-lg transition-colors",
                        "bg-brand-primary text-white hover:bg-brand-dark"
                    )}
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="w-5 h-5 md:w-6 md:h-6" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
