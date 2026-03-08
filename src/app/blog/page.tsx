"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/ui/BackButton";
import {
    Sparkles,
    Calendar,
    User,
    ArrowRight,
    Search,
    TrendingUp,
    Bookmark,
    Share2,
    Clock,
    CheckCircle2,
    ArrowUpRight,
    Star,
    LayoutGrid,
    Bell,
    Mail
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [bookmarked, setBookmarked] = useState<number[]>([]);
    const [subscribed, setSubscribed] = useState(false);
    const [email, setEmail] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const categories = ["All", "Technology", "Clinical", "Management", "Reviews", "Trends"];

    const allPosts = [
        {
            id: 1,
            title: "The AI Revolution in Dental Radiology: Diagnostics of 2026",
            excerpt: "How neural networks are detecting micro-fractures that human eyes often miss, and why every clinic needs an AI assistant.",
            image: "/images/dental_ai_radiology.png",
            author: "Dr. Aryan Sharma",
            date: "Mar 05, 2026",
            readTime: "8 min read",
            category: "Technology",
            featured: true
        },
        {
            id: 2,
            title: "Modern Ergonomics: Beyond Just the Dental Chair",
            excerpt: "Addressing practitioner fatigue through bio-mechanical equipment synchronization and clinic workflow design.",
            image: "/images/modern_clinic_tech.png",
            author: "Priya Varma",
            date: "Mar 02, 2026",
            readTime: "6 min read",
            category: "Management",
            featured: false
        },
        {
            id: 3,
            title: "Nano-Technology in Restorative Dentistry",
            excerpt: "Exploring the cellular level repair of enamel using synthetic nano-particles and the end of traditional fillings.",
            image: "/images/dental_nano_tech.png",
            author: "Dr. Rohan Gupta",
            date: "Feb 28, 2026",
            readTime: "12 min read",
            category: "Clinical",
            featured: false
        },
        {
            id: 4,
            title: "Review: Precision-X Digital Sensor Series",
            excerpt: "Comparing the latest intra-oral sensors for image clarity, software compatibility, and long-term durability.",
            image: "/images/dental_ai_radiology.png",
            author: "Clinical Review Team",
            date: "Mar 01, 2026",
            readTime: "10 min read",
            category: "Reviews",
            featured: false
        },
        {
            id: 5,
            title: "2026 Dental Market: The Rise of Bio-Compatible 3D Printing",
            excerpt: "Analyzing the industry shift towards in-house crown production using advanced biological resins.",
            image: "/images/featured_blog.png",
            author: "Market Insights",
            date: "Feb 25, 2026",
            readTime: "7 min read",
            category: "Trends",
            featured: false
        }
    ];

    const filteredPosts = useMemo(() => {
        return allPosts.filter(post => {
            const matchesCategory = activeCategory === "All" || post.category === activeCategory;
            const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    // To prevent the "glitch" of hero section disappearing, 
    // we always treat the first result of ANY category as the hero.
    const heroPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
    const gridPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

    const toggleBookmark = (id: number) => {
        setBookmarked(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
    };

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.includes("@")) {
            setSubscribed(true);
            setTimeout(() => setSubscribed(false), 5000);
            setEmail("");
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFBFF] pb-24 relative overflow-hidden">
            {/* Background Decor - Reduced Opacity to avoid overkill */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/[0.02] rounded-full blur-[120px] -mr-96 -mt-96 pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-10 pt-6 relative z-10">
                {/* Unified Premium Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative w-full rounded-2xl md:rounded-[1.5rem] overflow-hidden mb-6 bg-white border border-slate-100 shadow-lg shadow-slate-200/5"
                >
                    <div className="p-3.5 md:px-8 md:py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 md:gap-5 w-full md:w-auto">
                            <BackButton className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl shrink-0" />
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h1 className="text-base md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter">Dental <span className="text-brand-primary">Pulse</span></h1>
                                    <Sparkles size={16} className="text-brand-primary animate-pulse hidden md:block" />
                                </div>
                                <p className="text-[7px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 truncate">Scientific Hub for Practitioners</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 focus-within:border-brand-primary/30 focus-within:bg-white transition-all">
                            <Search size={14} className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search insights..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none outline-none text-[10px] md:text-[11px] font-bold text-slate-900 w-full md:w-40 placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Categories Scroll */}
                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-3 no-scrollbar scroll-smooth">
                    <div className="flex items-center gap-2 py-1">
                        {categories.map((cat, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                    "px-4 md:px-6 py-2 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap active:scale-95",
                                    activeCategory === cat
                                        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                                        : "bg-white text-slate-500 border border-slate-100 hover:border-brand-primary/30"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Hero Section - Persistent to prevent "Glitchy" unmounting */}
                <div className="relative min-h-[500px] mb-12">
                    <AnimatePresence mode="wait">
                        {heroPost ? (
                            <motion.div
                                key={heroPost.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                                className="relative w-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/30 border border-slate-100/50"
                            >
                                <div className="aspect-[3/4.5] sm:aspect-video md:aspect-[21/8] min-h-[500px] sm:min-h-[400px] md:min-h-[380px] relative">
                                    <Image
                                        src={heroPost.image}
                                        alt="Hero"
                                        fill
                                        priority
                                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#001533] via-[#001533]/85 sm:via-[#001533]/40 to-transparent" />

                                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-14 lg:p-16 flex flex-col justify-end">
                                        <div className="max-w-3xl space-y-4 md:space-y-6">
                                            <div className="flex items-center gap-3">
                                                <span className="px-3 py-1 bg-brand-primary text-white text-[7px] md:text-[9px] font-black uppercase tracking-widest rounded-full">
                                                    {heroPost.category} Insight
                                                </span>
                                                <div className="flex items-center gap-1.5 text-white/40 text-[7px] md:text-[9px] font-bold uppercase tracking-widest">
                                                    <Star size={10} className="text-brand-primary" fill="currentColor" /> Featured
                                                </div>
                                            </div>
                                            <h2 className="text-2xl md:text-3xl lg:text-5xl font-black text-white leading-[1.15] md:leading-tight tracking-tight">
                                                {heroPost.title}
                                            </h2>
                                            <p className="text-white/80 text-sm md:text-lg font-medium leading-relaxed max-w-2xl line-clamp-4 md:line-clamp-2">
                                                {heroPost.excerpt}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 border-t border-white/10 mt-4">
                                                <div className="flex items-center gap-2 text-white text-[8px] md:text-[10px] font-bold uppercase tracking-widest">
                                                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                                                        <User size={10} className="text-brand-primary" />
                                                    </div>
                                                    {heroPost.author}
                                                </div>
                                                <div className="flex items-center gap-2 text-white/50 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">
                                                    <Calendar size={12} className="text-brand-primary/70" /> {heroPost.date}
                                                </div>
                                                <div className="flex items-center gap-2 text-white/50 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">
                                                    <Clock size={12} className="text-brand-primary/70" /> {heroPost.readTime}
                                                </div>
                                            </div>

                                            <div className="pt-6">
                                                <button className="w-full sm:w-auto px-8 md:px-10 py-4 bg-white text-slate-900 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 group/btn">
                                                    Read Full Analysis <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-full min-h-[400px] flex flex-col items-center justify-center text-center bg-white rounded-[2rem] border border-slate-100"
                            >
                                <div className="text-slate-200 mb-6"><LayoutGrid size={64} strokeWidth={1} /></div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2">Scientific Insight Not Found</h3>
                                <p className="text-slate-500 max-w-sm mx-auto px-6">We are currently curating research for this criteria. Try another category.</p>
                                <button onClick={() => { setSearchQuery(""); setActiveCategory("All"); }} className="mt-8 px-8 py-3 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">Reset Pulse</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Main Grid Section */}
                {gridPosts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-20">
                        <AnimatePresence>
                            {gridPosts.map((post, i) => (
                                <motion.div
                                    key={post.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:border-brand-primary/15 transition-all group flex flex-col h-full"
                                >
                                    <div className="aspect-[4/3] relative overflow-hidden">
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-full text-[7px] font-black uppercase tracking-widest text-brand-primary border border-brand-primary/15 shadow-sm">
                                                {post.category}
                                            </span>
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <button
                                                onClick={(e) => { e.preventDefault(); toggleBookmark(post.id); }}
                                                className={cn(
                                                    "w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center border transition-all",
                                                    bookmarked.includes(post.id)
                                                        ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20"
                                                        : "bg-white/95 text-slate-900 border-slate-100 hover:bg-brand-primary hover:text-white"
                                                )}
                                            >
                                                <Bookmark size={14} fill={bookmarked.includes(post.id) ? "currentColor" : "none"} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6 md:p-8 flex flex-col flex-grow space-y-3 md:space-y-4">
                                        <div className="flex items-center gap-3 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5"><Calendar size={12} className="text-brand-primary" /> {post.date}</span>
                                            <span className="flex items-center gap-1.5"><Clock size={12} className="text-brand-primary" /> {post.readTime}</span>
                                        </div>
                                        <h3 className="text-lg md:text-xl font-black text-slate-900 leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-slate-500 text-[13px] font-medium leading-relaxed line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                        <div className="pt-4 mt-auto flex items-center justify-between border-t border-slate-50">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                                                    <User size={12} />
                                                </div>
                                                <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">{post.author}</span>
                                            </div>
                                            <button className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all">
                                                <ArrowUpRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Newsletter Box - Premium Square Aesthetic */}
                        <div className="bg-[#0A1D3D] rounded-xl md:rounded-2xl p-8 flex flex-col justify-between text-white shadow-2xl relative overflow-hidden h-full min-h-[450px] border border-white/5">
                            <div className="absolute top-0 right-0 p-10 opacity-[0.05] pointer-events-none rotate-[-15deg]">
                                <Bell size={180} className="text-white" />
                            </div>

                            <AnimatePresence mode="wait">
                                {!subscribed ? (
                                    <motion.div key="signup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 space-y-6">
                                        <div className="w-12 h-12 rounded-xl bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center">
                                            <TrendingUp size={24} className="text-brand-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl md:text-3xl font-black leading-tight tracking-tight">Stay Ahead.</h3>
                                            <p className="text-white/60 text-xs md:text-sm font-medium leading-relaxed">Join 8,000+ clinical specialists with our weekly scientific briefing.</p>
                                        </div>

                                        <form onSubmit={handleSubscribe} className="space-y-4 pt-4">
                                            <div className="p-4 bg-white/5 rounded-xl border border-white/10 focus-within:border-brand-primary/50 transition-all">
                                                <input type="email" required placeholder="Enter clinical email..." value={email} onChange={(e) => setEmail(e.target.value)} className="bg-transparent border-none outline-none text-[11px] font-black w-full placeholder:text-white/20 text-white uppercase tracking-widest" />
                                            </div>
                                            <button type="submit" className="w-full py-4 bg-brand-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-[#0A1D3D] transition-all active:scale-95 shadow-xl shadow-brand-primary/20 flex items-center justify-center gap-2">
                                                Subscribe Protocol <Mail size={14} />
                                            </button>
                                        </form>
                                    </motion.div>
                                ) : (
                                    <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-6">
                                        <div className="w-16 h-16 bg-brand-primary/20 border border-brand-primary/30 rounded-2xl flex items-center justify-center shadow-2xl shadow-brand-primary/20">
                                            <CheckCircle2 size={32} className="text-brand-primary" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black text-white">Verified!</h3>
                                            <p className="text-white/50 text-xs font-medium">Uplink established. Check your inbox.</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* Final CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[2.5rem] p-10 md:p-20 text-center border border-slate-100 shadow-xl shadow-slate-200/20"
                >
                    <div className="relative z-10 max-w-2xl mx-auto space-y-6 md:space-y-8">
                        <h2 className="text-2xl md:text-5xl font-black text-slate-900 leading-tight">
                            Contribute to <span className="text-brand-primary">Pulse.</span>
                        </h2>
                        <p className="text-slate-500 font-medium text-sm md:text-lg leading-relaxed">
                            Clinicians and researchers, share your insights with the global community.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="mailto:blog@blueteeth.store" className="w-full sm:w-auto px-10 py-5 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-900 transition-all shadow-xl">
                                Submit Article
                            </Link>
                            <button
                                onClick={() => {
                                    if (navigator.share) navigator.share({ title: 'Blueteeth Pulse', url: window.location.href });
                                    else alert("Link copied!");
                                }}
                                className="w-full sm:w-auto px-10 py-5 bg-slate-50 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-slate-100 hover:bg-white transition-all flex items-center justify-center gap-2"
                            >
                                <Share2 size={16} /> Share Pulse
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

