"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Calendar, MapPin, ArrowRight, Video, Users, GraduationCap,
    Sparkles, ShieldCheck, Search, Filter, Clock, Award,
    ChevronRight, Globe, Microscope, PlayCircle, Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "sonner";
import { BackButton } from "@/components/ui/BackButton";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All Events", "Webinars", "Workshops", "Exhibitions"];

const EVENTS = [
    {
        id: 1,
        title: "National Dental Expo 2024",
        faculty: "Global Trade Federation",
        date: "March 15 - 18, 2024",
        time: "09:00 AM - 06:00 PM (IST)",
        location: "Pragati Maidan, New Delhi",
        type: "Exhibition",
        points: "Non-CME",
        attendees: "15k+ Clinicians",
        desc: "Asia's premier dental trade forum showcasing 200+ global brands. Explore breakthrough digital imaging.",
        featured: true,
        gradient: "from-blue-600 to-indigo-700",
        icon: Globe
    },
    {
        id: 2,
        title: "Endodontic Micro-Surgery",
        faculty: "Dr. Elena Volkov, MDS",
        date: "March 25, 2024",
        time: "04:00 PM - 07:30 PM (IST)",
        location: "Virtual Clinical Suite",
        type: "Webinar",
        points: "4 CDE Points",
        attendees: "800+ Registered",
        desc: "Intensive digital workshop on microscope-guided endodontics and complex retrieval protocols.",
        gradient: "from-emerald-600 to-teal-700",
        icon: PlayCircle
    },
    {
        id: 3,
        title: "Implantology & 3D Guided Surgery",
        faculty: "Dr. Rajesh Mehra, PhD",
        date: "April 10, 2024",
        time: "10:00 AM - 05:00 PM (IST)",
        location: "The Oberoi, Mumbai",
        type: "Workshop",
        points: "8 CDE Points",
        attendees: "Limited (30 Seats)",
        desc: "Hands-on certification for immediate loading protocols and digital surgical stents.",
        gradient: "from-purple-600 to-fuchsia-700",
        icon: GraduationCap
    },
    {
        id: 4,
        title: "Pediatric Sedation Standards",
        faculty: "AIMS Dental Faculty",
        date: "May 12, 2024",
        time: "11:00 AM - 02:00 PM (IST)",
        location: "Online Portal Access",
        type: "Webinar",
        points: "2 CDE Points",
        attendees: "New Event",
        desc: "Guidelines for conscious sedation in pediatric dentistry. Focus on safety and patient standards.",
        gradient: "from-orange-500 to-amber-600",
        icon: ShieldCheck
    },
    {
        id: 5,
        title: "AI in Clinical Radiography",
        faculty: "Dr. Arun Varma",
        date: "June 05, 2024",
        time: "02:00 PM - 05:00 PM (IST)",
        location: "Digital Innovation Hub",
        type: "Webinar",
        points: "3 CDE Points",
        attendees: "1.2k+ Enrolled",
        desc: "Leveraging Artificial Intelligence for precise tumor detection and early radiographic diagnosis.",
        gradient: "from-slate-600 to-slate-800",
        icon: Search
    },
    {
        id: 6,
        title: "Facial Esthetics & Fillers",
        faculty: "Dr. Sophie Chen",
        date: "June 22, 2024",
        time: "09:00 AM - 06:00 PM (IST)",
        location: "JW Marriott, Bengaluru",
        type: "Workshop",
        points: "12 CDE Points",
        attendees: "Filling Fast",
        desc: "Advanced hands-on masterclass on mid-face fillers and clinical botulinum protocols.",
        gradient: "from-rose-500 to-pink-600",
        icon: Microscope
    }
];

export default function EventsPage() {
    const [activeTab, setActiveTab] = useState("All Events");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredEvents = EVENTS.filter(e => {
        const matchesTab = activeTab === "All Events" || activeTab.toLowerCase().includes(e.type.toLowerCase());
        const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.faculty.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className="bg-[#F8FAFC] min-h-screen pb-24 font-sans selection:bg-brand-primary/10">
            <Toaster position="bottom-right" richColors />
            {/* Background Decor - Refined without blurs */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#0056D2_1px,transparent_1px)] [background-size:40px_40px]" />
            </div>

            <div className="max-w-[1600px] w-full mx-auto px-6 sm:px-10 lg:px-14 relative z-10">

                {/* Integrated Header "Patti" */}
                <header className="mb-10">
                    <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6 w-full md:w-auto">
                            <BackButton />
                            <div className="h-10 w-px bg-slate-200 hidden md:block" />
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Clinical Academy</h1>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1 opacity-70">Empowering Modern Dentistry</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="flex -space-x-2.5 items-center mr-2">
                                {[11, 22, 33].map(i => (
                                    <img
                                        key={i}
                                        src={`https://i.pravatar.cc/100?u=${i}`}
                                        alt="Attendee"
                                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm grayscale-[0.3] hover:grayscale-0 transition-all cursor-pointer"
                                    />
                                ))}
                                <div className="px-3 bg-white border border-slate-100 rounded-full h-8 flex items-center shadow-sm -ml-2 relative z-10">
                                    <span className="text-[9px] font-black text-slate-900 uppercase tracking-tight">12k+ Attending</span>
                                </div>
                            </div>
                            <Link href="/events/past" className="bg-brand-primary text-white px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20">
                                Past Events
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Filter & Search Belt */}
                <div className="flex flex-col xl:flex-row items-center justify-between gap-6 mb-12 bg-white/50 backdrop-blur-md p-4 rounded-[1.5rem] border border-white/50 shadow-sm">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full xl:w-auto no-scrollbar">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveTab(cat)}
                                className={cn(
                                    "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    activeTab === cat
                                        ? "bg-brand-primary text-white shadow-xl shadow-brand-primary/20"
                                        : "text-slate-500 hover:bg-slate-100"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full xl:w-96 group">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Find Clinical Mastery..."
                            className="w-full pl-11 pr-6 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-brand-primary/5 transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Event Grid - Clean, Professional cards that don't rely only on images */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 px-1">
                    <AnimatePresence mode="popLayout">
                        {filteredEvents.map((event, idx) => {
                            const Icon = event.icon;
                            return (
                                <motion.div
                                    key={event.id}
                                    layout
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                    className="group"
                                >
                                    <div className="bg-white rounded-[2.25rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-brand-primary/20 transition-all duration-500 overflow-hidden flex flex-col h-full active:scale-[0.98]">

                                        {/* Visual Section - Restored Prominent Color Height */}
                                        <div className={cn("h-64 relative overflow-hidden bg-gradient-to-br flex items-center justify-center p-8", event.gradient)}>
                                            <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
                                            <div className="relative z-10 w-20 h-20 bg-white/20 backdrop-blur-md rounded-[1.85rem] border border-white/30 flex items-center justify-center shadow-2xl transition-transform duration-700 group-hover:scale-110">
                                                <Icon size={40} className="text-white" strokeWidth={1.5} />
                                            </div>

                                            {/* Labels */}
                                            <div className="absolute top-6 left-6 flex gap-2">
                                                <div className="px-3 py-1 bg-white/95 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-lg">
                                                    {event.type}
                                                </div>
                                                {event.featured && (
                                                    <div className="px-3 py-1 bg-brand-accent text-slate-900 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                                                        <Star size={10} fill="currentColor" /> Featured
                                                    </div>
                                                )}
                                            </div>

                                            <div className="absolute bottom-6 right-6">
                                                <div className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-[9px] font-black uppercase tracking-widest text-white">
                                                    {event.points}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-7 flex flex-col flex-1">
                                            <div className="flex items-center gap-2 mb-2.5">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{event.faculty}</span>
                                            </div>

                                            <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-brand-primary transition-colors leading-tight">
                                                {event.title}
                                            </h3>

                                            <p className="text-sm text-slate-500 font-semibold leading-relaxed mb-8 opacity-80 line-clamp-3">
                                                {event.desc}
                                            </p>

                                            <div className="mt-auto space-y-4 pt-6 border-t border-slate-50 relative">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-9 h-9 rounded-xl bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center text-brand-primary transition-colors">
                                                        <Calendar size={17} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol Date</p>
                                                        <p className="text-sm font-bold text-slate-800">{event.date}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-9 h-9 rounded-xl bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center text-brand-primary transition-colors">
                                                        <MapPin size={17} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Deployment Hub</p>
                                                        <p className="text-sm font-bold text-slate-800 line-clamp-1">{event.location}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => toast.success(`Access request submitted for "${event.title}"`, {
                                                    description: "Our clinical coordinator will contact you shortly.",
                                                    duration: 4000,
                                                })}
                                                className="mt-10 w-full bg-brand-primary hover:bg-[#0047b3] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] flex items-center justify-center gap-2 group-hover:gap-4 transition-all shadow-xl shadow-brand-primary/25 hover:shadow-brand-primary/40 active:scale-95 hover:scale-[1.02]"
                                            >
                                                Reserve Access <ChevronRight size={14} strokeWidth={4} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Authority Certification Section - Modernized Blue Theme */}
                <div className="p-10 md:p-16 bg-gradient-to-br from-blue-600 to-blue-900 rounded-[3rem] text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden group mb-16 border border-white/10">
                    <div className="absolute inset-0 opacity-[0.1] pointer-events-none bg-[radial-gradient(#fff_2px,transparent_2px)] [background-size:32px_32px]" />
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-[120px]" />
                    <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-brand-accent/20 rounded-full blur-[120px]" />

                    <div className="max-w-2xl relative z-10 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest mb-6 border border-white/20 backdrop-blur-md">
                            <ShieldCheck size={14} strokeWidth={2.5} /> Professional Certification Authority
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-[1.05]">Elite Standards in Dental Education.</h2>
                        <p className="text-blue-100 text-base md:text-lg font-medium leading-relaxed mb-10 opacity-90">
                            Every attendee is awarded a digitally verified credential, certified by world-leading clinical boards. Elevate your practice with recognized excellence.
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            {[
                                { val: "125k+", label: "Verified Docs" },
                                { val: "180+", label: "Masterclasses" },
                                { val: "4.9/5", label: "User Trust" }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                    <p className="text-3xl font-black text-white tracking-tighter">{stat.val}</p>
                                    <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mt-1 opacity-80">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 lg:w-1/3 w-full">
                        <div className="p-10 rounded-[2.5rem] bg-white text-slate-900 flex flex-col items-center text-center gap-8 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -mr-16 -mt-16" />
                            <div className="w-20 h-20 bg-brand-primary/10 rounded-3xl flex items-center justify-center text-brand-primary transition-transform duration-700">
                                <Award size={48} strokeWidth={1.5} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-primary mb-2">Blockchain Secured</p>
                                <h3 className="text-2xl font-black tracking-tight text-slate-900">Verified Protocol</h3>
                                <p className="text-slate-500 text-sm font-medium mt-2 leading-relaxed px-4">Instant, immutable digital badges provided globally.</p>
                            </div>
                            <button className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/30 flex items-center justify-center gap-3 active:scale-95">
                                Credential Lookup <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
