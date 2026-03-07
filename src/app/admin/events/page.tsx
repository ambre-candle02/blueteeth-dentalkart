"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Calendar, MapPin, Users, Activity, Video } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_EVENTS = [
    {
        id: "1",
        title: "National Dental Expo 2024",
        date: "2024-03-15",
        type: "Exhibition",
        status: "Upcoming",
        attendees: 15420,
    },
    {
        id: "2",
        title: "Endodontic Micro-Surgery",
        date: "2024-03-25",
        type: "Webinar",
        status: "Active",
        attendees: 800,
    },
    {
        id: "3",
        title: "Implantology & 3D Guided Surgery",
        date: "2024-04-10",
        type: "Workshop",
        status: "Draft",
        attendees: 30,
    }
];

export default function AdminEventsPage() {
    const [events, setEvents] = useState(MOCK_EVENTS);
    const [isEditing, setIsEditing] = useState(false);

    const handleDelete = (id: string, title: string) => {
        if (!confirm(`Are you sure you want to cancel the event "${title}"?`)) return;
        setEvents(events.filter(e => e.id !== id));
        toast.success("Event removed from the schedule.");
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase tracking-widest text-sm">Academy Events</h1>
                    <p className="text-[11px] text-slate-500 mt-1 font-bold uppercase tracking-widest opacity-60 italic">Live Workshops & Webinars Management</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 ring-4 ring-blue-500/5 active:scale-95"
                    >
                        <Plus size={16} strokeWidth={3} className="transition-transform" /> Schedule Event
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Total Events" count={events.length} icon={<Calendar size={18} className="text-blue-500" />} color="blue" />
                <StatCard label="Active Registrations" count={events.reduce((acc, curr) => acc + curr.attendees, 0)} icon={<Users size={18} className="text-emerald-500" />} color="emerald" />
                <StatCard label="Upcoming Sessions" count={events.filter(e => e.status !== 'Draft').length} icon={<Activity size={18} className="text-amber-500" />} color="amber" />
                <StatCard label="Virtual Webinars" count={events.filter(e => e.type === 'Webinar').length} icon={<Video size={18} className="text-indigo-500" />} color="indigo" />
            </div>

            {/* Events Table Container */}
            <div className="bg-white/30 backdrop-blur-xl rounded-2xl border border-blue-200/40 shadow-xl overflow-hidden mt-8">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-blue-50/50 border-b border-blue-100/50">
                                <th className="px-8 py-6 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.2em] italic">Session Title</th>
                                <th className="px-8 py-6 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.2em] italic">Date</th>
                                <th className="px-8 py-6 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.2em] italic">Type Matrix</th>
                                <th className="px-8 py-6 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.2em] italic">Headcount</th>
                                <th className="px-8 py-6 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.2em] italic">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.2em] text-right italic">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-100/30">
                            {events.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <Calendar size={40} className="text-blue-200 mb-4" />
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest opacity-70">No active events scheduled.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                events.map((event) => (
                                    <tr key={event.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-black text-slate-900 text-sm tracking-tight">{event.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{event.date}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-white border border-blue-100 rounded-lg text-[9px] font-black text-blue-600 uppercase tracking-widest shadow-sm">
                                                {event.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-black text-slate-800 text-[13px] tabular-nums tracking-tighter">
                                                {event.attendees.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${event.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                    event.status === 'Upcoming' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                        'bg-slate-100 text-slate-500 border-slate-200'
                                                }`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => toast.info("Event edit module initializing...")}
                                                    className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all border border-transparent hover:border-blue-100"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(event.id, event.title)}
                                                    className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all border border-transparent hover:border-rose-100"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Placeholder */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-blue-200/50 p-10 text-center"
                        >
                            <Calendar size={48} className="mx-auto text-blue-500 mb-6 opacity-80" />
                            <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase tracking-widest text-sm mb-4">Event Scheduler Setup</h2>
                            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-8 opacity-70 italic leading-relaxed">
                                The centralized schedule builder is currently undergoing calibration. Manual configuration is temporarily required via secure endpoints.
                            </p>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="w-full bg-slate-100 text-slate-600 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-200 transition-all border border-slate-200/80"
                            >
                                Acknowledge & Return
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatCard({ label, count, icon, color }: { label: string; count: number; icon: React.ReactNode; color: 'amber' | 'blue' | 'indigo' | 'emerald' }) {
    const colorMap = {
        amber: "text-amber-600 bg-amber-100 border-amber-200",
        blue: "text-blue-600 bg-blue-100 border-blue-200",
        indigo: "text-indigo-600 bg-indigo-100 border-indigo-200",
        emerald: "text-emerald-600 bg-emerald-100 border-emerald-200",
    };

    const bgMap = {
        amber: "bg-amber-50/80 border-amber-200/50",
        blue: "bg-blue-50/80 border-blue-200/50",
        indigo: "bg-indigo-50/80 border-indigo-200/50",
        emerald: "bg-emerald-50/80 border-emerald-200/50",
    };

    return (
        <div className={`p-6 rounded-2xl border flex items-center gap-5 cursor-default transition-all group overflow-hidden ${bgMap[color]} shadow-sm`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-md transition-all ${colorMap[color]}`}>
                {icon}
            </div>
            <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 text-slate-500/70`}>{label}</p>
                <p className="text-2xl font-black text-slate-900 leading-none tabular-nums">{count.toLocaleString()}</p>
            </div>
        </div>
    );
}
