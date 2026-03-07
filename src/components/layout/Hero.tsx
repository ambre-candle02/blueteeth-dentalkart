"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Hero() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    // Parallax effect for the hero content
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <div ref={ref} className="relative min-h-[65vh] md:min-h-[85vh] w-full bg-slate-900 flex flex-col justify-center pt-12 md:pt-16 pb-12 overflow-hidden isolating">

            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-90 mix-blend-screen mix-blend-normal"
            >
                <source src="https://res.cloudinary.com/dmw5efwf5/video/upload/v1772822530/media-hub/zqglbnfmhhtn12phsnjs.mp4" type="video/mp4" />
            </video>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/60 to-slate-900/90 z-10 pointer-events-none backdrop-blur-[1px]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-brand-primary/30 blur-[120px] rounded-full pointer-events-none z-10" />


            <div className="relative z-20 container mx-auto px-8 sm:px-12 lg:px-16 xl:px-20 max-w-[1600px] w-full flex flex-col items-center text-center -mt-12 md:-mt-16">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm text-white text-[11px] md:text-sm font-bold uppercase tracking-[0.2em] mb-8">
                        <span className="flex h-2.5 w-2.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-400"></span>
                        </span>
                        The Next Era of Oral Care
                    </div>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.12] tracking-tight max-w-5xl drop-shadow-lg"
                >
                    Premium Dental Tech. <br className="hidden md:block" />
                    <span className="text-blue-400 drop-shadow-md relative inline-block">
                        Smart Procurement.
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    className="text-base md:text-xl text-slate-200 mb-10 max-w-3xl leading-relaxed font-medium drop-shadow-md"
                >
                    Equip your practice with state-of-the-art instruments, eco-sustainable supplies, and flawless design. Built exclusively for elite clinics.
                </motion.p>

                {/* Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 items-center mb-16"
                >
                    <Link
                        href="/shop"
                        className="group flex items-center justify-center gap-2 bg-brand-primary/90 hover:bg-brand-primary text-white text-[15px] font-semibold px-8 py-4 rounded-full transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto backdrop-blur-sm border border-brand-primary/50"
                    >
                        Browse Catalog <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/new-clinic-setup"
                        className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-[15px] font-semibold px-8 py-4 rounded-full border border-white/20 hover:border-white/40 transition-all shadow-lg w-full sm:w-auto backdrop-blur-md"
                    >
                        Learn About Clinic Setup
                    </Link>
                </motion.div>

            </div>
        </div>
    );
}
