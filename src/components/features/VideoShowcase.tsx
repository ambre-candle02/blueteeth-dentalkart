"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Volume2, VolumeX, ChevronLeft, ChevronRight } from "lucide-react";

// Placeholder high-quality royalty-free video URLs for the immersive vibe
const SHOWCASES = [
    {
        id: "eco",
        title: "Eco-Sustainable Care",
        subtitle: "The Future is Zero Waste",
        description: "Discover our premium range of biodegradable bamboo brushes and sustainable oral hygiene products. Good for your patients, better for the planet.",
        videoUrl: "https://videos.pexels.com/video-files/4201732/4201732-uhd_2732_1440_25fps.mp4", // Nature/Eco vibe
        link: "/category/eco-sustainable",
        align: "right"
    },
    {
        id: "chairs",
        title: "Advanced Dental Chairs",
        subtitle: "Ergonomic Excellence",
        description: "Experience unparalleled ergonomic comfort and cutting-edge technology. Setup your clinic with chairs designed for 21st-century dentistry.",
        videoUrl: "https://videos.pexels.com/video-files/4488346/4488346-uhd_2732_1440_25fps.mp4", // Medical/Tech vibe
        link: "/category/dental-chairs",
        align: "left"
    },
    {
        id: "instruments",
        title: "Precision Instruments",
        subtitle: "Flawless Details",
        description: "Master crafted composites, burrs, and scalers for the finest detail work. When precision is not an option, but an absolute requirement.",
        videoUrl: "https://videos.pexels.com/video-files/7578550/7578550-uhd_2560_1440_30fps.mp4", // Clean Lab vibe
        link: "/category/instruments",
        align: "right"
    },
    {
        id: "setup",
        title: "Complete Clinic Setup",
        subtitle: "Ready to Launch",
        description: "From X-Ray sensors to complete sterilization units, we provide end-to-end setups so you can focus purely on your practice.",
        videoUrl: "https://videos.pexels.com/video-files/3201594/3201594-uhd_2560_1440_25fps.mp4", // Clean Tech vibe
        link: "/new-clinic-setup",
        align: "left"
    }
];

export function VideoShowcase() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMuted, setIsMuted] = useState(true);

    // Auto-play interval
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % SHOWCASES.length);
        }, 8000); // Change slide every 8 seconds
        return () => clearInterval(timer);
    }, []);

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % SHOWCASES.length);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + SHOWCASES.length) % SHOWCASES.length);

    const showcase = SHOWCASES[currentIndex];
    const isLeft = showcase.align === "left";

    return (
        <section className="bg-black text-white relative w-full h-[80vh] min-h-[600px] overflow-hidden flex items-center border-b border-white/10 group">

            <AnimatePresence mode="wait">
                <motion.div
                    key={showcase.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* Background Video */}
                    <video
                        key={showcase.videoUrl} // Force reload when url changes
                        autoPlay
                        loop
                        muted={isMuted}
                        playsInline
                        className="w-full h-full object-cover opacity-60"
                    >
                        <source src={showcase.videoUrl} type="video/mp4" />
                    </video>

                    {/* Gradient Masks */}
                    <div className={`absolute inset-0 bg-gradient-to-${isLeft ? 'r' : 'l'} from-slate-950 via-slate-900/60 to-transparent pointer-events-none hidden md:block`} />
                    <div className="absolute inset-0 bg-slate-950/70 md:hidden pointer-events-none" />
                </motion.div>
            </AnimatePresence>

            {/* Content Area */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full max-w-[1600px] h-full flex items-center pointer-events-none">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`content-${showcase.id}`}
                        initial={{ opacity: 0, x: isLeft ? -50 : 50, filter: "blur(10px)" }}
                        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={`w-full max-w-xl flex flex-col pointer-events-auto ${isLeft ? "ml-0" : "ml-auto"}`}
                    >
                        <h4 className="text-brand-primary text-sm font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-brand-primary"></span>
                            {showcase.subtitle}
                        </h4>
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-[1.1] drop-shadow-xl">
                            {showcase.title}
                        </h2>
                        <p className="text-slate-300 text-lg md:text-xl leading-relaxed font-light mb-10 drop-shadow-md">
                            {showcase.description}
                        </p>

                        <div className="flex items-center gap-4 sm:gap-6">
                            <Link
                                href={showcase.link}
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-brand-primary hover:text-white transition-all duration-300 shadow-xl hover:shadow-brand-primary/50"
                            >
                                Discover More <ArrowRight size={20} />
                            </Link>

                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center bg-black/40 backdrop-blur-md hover:bg-white/20 transition-all text-white"
                                aria-label={isMuted ? "Unmute Video" : "Mute Video"}
                            >
                                {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="absolute bottom-8 left-0 right-0 z-20 container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] flex items-center justify-between pointer-events-none">

                {/* Dots indicator */}
                <div className="flex gap-3 pointer-events-auto">
                    {SHOWCASES.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-1.5 transition-all duration-500 rounded-full ${idx === currentIndex ? "w-12 bg-brand-primary" : "w-4 bg-white/30 hover:bg-white/60"
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>

                {/* Arrows */}
                <div className="flex gap-4 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={handlePrev}
                        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-black/40 backdrop-blur-md hover:bg-white hover:text-black transition-all text-white"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-black/40 backdrop-blur-md hover:bg-white hover:text-black transition-all text-white"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

            </div>

            {/* Large Number Indicator */}
            <div className="absolute top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none font-black text-[25rem] z-0 right-10 leading-none hidden lg:block select-none">
                0{currentIndex + 1}
            </div>
        </section>
    );
}
