"use client";

import { Truck, ShieldCheck, Clock, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
    {
        icon: Truck,
        title: "Free Shipping",
        desc: "On orders above ₹5000",
        bg: "bg-blue-50",
        border: "border-blue-100",
        text: "text-blue-600",
    },
    {
        icon: ShieldCheck,
        title: "Genuine Products",
        desc: "100% Authentic Quality",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
        text: "text-emerald-600",
    },
    {
        icon: Clock,
        title: "Fast Delivery",
        desc: "Dispatched within 24hrs",
        bg: "bg-orange-50",
        border: "border-orange-100",
        text: "text-orange-500",
    },
    {
        icon: CreditCard,
        title: "Secure Payment",
        desc: "100% Secure Checkout",
        bg: "bg-purple-50",
        border: "border-purple-100",
        text: "text-purple-600",
    },
];

export function TrustStrip() {
    return (
        <div className="bg-white border-y border-slate-100/50 py-8 relative z-10">
            <div className="max-w-[1920px] w-full mx-auto px-8 sm:px-12 lg:px-16 xl:px-20">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                    {FEATURES.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className="flex items-center justify-center lg:justify-start gap-4 group"
                        >
                            <div className={`w-12 h-12 rounded-full ${feature.bg} border ${feature.border} flex items-center justify-center ${feature.text} group-hover:scale-110 transition-all duration-300 shadow-sm`}>
                                <feature.icon size={22} className="stroke-[1.5]" />
                            </div>
                            <div className="flex flex-col">
                                <h4 className="font-semibold text-[14px] md:text-[15px] text-slate-800 leading-snug">{feature.title}</h4>
                                <p className={`text-[12px] md:text-[13px] font-medium mt-0.5 ${feature.text}`}>{feature.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
