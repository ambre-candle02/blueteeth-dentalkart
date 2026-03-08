"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Calendar, MapPin, Users, Activity, Video, X, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getEvents, saveEvent, deleteEvent, EventData } from "@/actions/events-actions";

const EVENT_TYPES = ["Webinar", "Workshop", "Exhibition", "Conference", "Training"];
const EVENT_STATUSES = ["Upcoming", "Active", "Draft", "Completed"];

const EMPTY_FORM: EventData = {
    title: "",
    date: "",
    type: "Webinar",
    status: "Upcoming",
    attendees: 0,
    location: "",
    description: "",
};

export default function AdminEventsPage() {
    const [events, setEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState<EventData>(EMPTY_FORM);

    const fetchEvents = async () => {
        setLoading(true);
        const result = await getEvents();
        if (result.success) {
            setEvents(result.events || []);
        } else {
            toast.error("Failed to load events");
        }
        setLoading(false);
    };

    useEffect(() => { fetchEvents(); }, []);

    const openNew = () => { setForm(EMPTY_FORM); setModalOpen(true); };
    const openEdit = (event: EventData) => { setForm(event); setModalOpen(true); };
    const closeModal = () => { setModalOpen(false); setForm(EMPTY_FORM); };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title.trim() || !form.date) {
            toast.error("Title and Date are required.");
            return;
        }
        setSaving(true);
        const result = await saveEvent(form);
        if (result.success) {
            toast.success(form.id ? "Event updated!" : "Event created!");
            closeModal();
            fetchEvents();
        } else {
            toast.error("Failed to save: " + result.error);
        }
        setSaving(false);
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete event "${title}"?`)) return;
        const result = await deleteEvent(id!);
        if (result.success) {
            toast.success("Event deleted.");
            setEvents(events.filter(e => e.id !== id));
        } else {
            toast.error("Delete failed: " + result.error);
        }
    };

    const active = events.filter(e => e.status === 'Active').length;
    const totalAttendees = events.reduce((acc, e) => acc + (e.attendees || 0), 0);
    const webinars = events.filter(e => e.type === 'Webinar').length;

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 sm:space-y-10 animate-in fade-in duration-700 pb-20">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase tracking-widest text-sm">Academy Events</h1>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 font-bold uppercase tracking-widest opacity-60 italic">Live Workshops &amp; Webinars Management</p>
                </div>
                <button
                    onClick={openNew}
                    className="flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-xl sm:rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 active:scale-95"
                >
                    <Plus size={14} strokeWidth={3} /> Schedule Event
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <StatCard label="Total Events" count={events.length} icon={<Calendar size={18} className="text-blue-500" />} color="blue" />
                <StatCard label="Total Registrations" count={totalAttendees} icon={<Users size={18} className="text-emerald-500" />} color="emerald" />
                <StatCard label="Active Sessions" count={active} icon={<Activity size={18} className="text-amber-500" />} color="amber" />
                <StatCard label="Virtual Webinars" count={webinars} icon={<Video size={18} className="text-indigo-500" />} color="indigo" />
            </div>

            {/* Table */}
            <div className="bg-white/30 backdrop-blur-xl rounded-2xl border border-blue-200/40 shadow-xl overflow-hidden">
                {loading ? (
                    <div className="py-20 flex items-center justify-center gap-3 text-blue-400">
                        <Loader2 size={24} className="animate-spin" />
                        <span className="text-[11px] font-black uppercase tracking-widest opacity-70">Loading events...</span>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-blue-50/50 border-b border-blue-100/50">
                                <th className="px-4 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black text-blue-800/60 uppercase tracking-[0.2em] italic">Event</th>
                                <th className="hidden sm:table-cell px-8 py-6 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.2em] italic">Date</th>
                                <th className="hidden sm:table-cell px-8 py-6 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.2em] italic">Type</th>
                                <th className="hidden md:table-cell px-8 py-6 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.2em] italic">Attendees</th>
                                <th className="px-4 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black text-blue-800/60 uppercase tracking-[0.2em] italic">Status</th>
                                <th className="px-4 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black text-blue-800/60 uppercase tracking-[0.2em] text-right italic whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-100/30">
                            {events.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <Calendar size={36} className="text-blue-200" />
                                            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest opacity-70">No events yet. Schedule your first event!</p>
                                            <button onClick={openNew} className="mt-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                                                + Schedule Event
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                events.map((event) => (
                                    <tr key={event.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-4 sm:px-8 py-4 sm:py-6">
                                            <span className="font-black text-slate-900 text-xs sm:text-sm tracking-tight block">{event.title}</span>
                                            <span className="sm:hidden text-[8px] text-slate-400 font-bold mt-0.5 block">{event.date}</span>
                                            {event.location && <span className="hidden sm:flex items-center gap-1 text-[9px] text-slate-400 mt-0.5"><MapPin size={9} />{event.location}</span>}
                                        </td>
                                        <td className="hidden sm:table-cell px-8 py-6">
                                            <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{event.date}</span>
                                        </td>
                                        <td className="hidden sm:table-cell px-8 py-6">
                                            <span className="px-3 py-1 bg-white border border-blue-100 rounded-lg text-[9px] font-black text-blue-600 uppercase tracking-widest shadow-sm whitespace-nowrap">{event.type}</span>
                                        </td>
                                        <td className="hidden md:table-cell px-8 py-6">
                                            <span className="font-black text-slate-800 text-[13px] tabular-nums tracking-tighter">{(event.attendees || 0).toLocaleString()}</span>
                                        </td>
                                        <td className="px-4 sm:px-8 py-4 sm:py-6">
                                            <span className={`px-2 sm:px-3 py-1 rounded-lg text-[7px] sm:text-[9px] font-black uppercase tracking-widest border shadow-sm whitespace-nowrap ${event.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                    event.status === 'Upcoming' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                        event.status === 'Completed' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                                                            'bg-amber-50 text-amber-600 border-amber-200'
                                                }`}>{event.status}</span>
                                        </td>
                                        <td className="px-4 sm:px-8 py-4 sm:py-6 text-right">
                                            <div className="flex items-center justify-end gap-1.5 sm:gap-3">
                                                <button
                                                    onClick={() => openEdit(event)}
                                                    className="p-2 sm:p-2.5 bg-gradient-to-br from-cyan-400/25 to-teal-400/20 text-teal-600 border border-teal-300/40 hover:from-cyan-400/40 hover:to-teal-400/35 rounded-xl transition-all shadow-sm backdrop-blur-md"
                                                >
                                                    <Edit2 size={13} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(event.id!, event.title)}
                                                    className="p-2 sm:p-2.5 bg-gradient-to-br from-rose-400/25 to-red-400/20 text-rose-600 border border-rose-300/40 hover:from-rose-400/40 hover:to-red-400/35 rounded-xl transition-all shadow-sm backdrop-blur-md"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Add / Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md" onClick={closeModal}>
                    <div
                        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-blue-200/50 overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-white font-black text-sm uppercase tracking-widest">{form.id ? 'Edit Event' : 'Schedule New Event'}</h2>
                                <p className="text-blue-200 text-[9px] font-bold uppercase tracking-widest mt-0.5">Fill all required fields</p>
                            </div>
                            <button onClick={closeModal} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                            {/* Title */}
                            <div>
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Event Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.title}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    placeholder="e.g. National Dental Expo 2025"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                                />
                            </div>

                            {/* Date + Type */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={form.date}
                                        onChange={e => setForm({ ...form, date: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Type</label>
                                    <select
                                        value={form.type}
                                        onChange={e => setForm({ ...form, type: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                                    >
                                        {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Status + Attendees */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Status</label>
                                    <select
                                        value={form.status}
                                        onChange={e => setForm({ ...form, status: e.target.value as any })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                                    >
                                        {EVENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Expected Attendees</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={form.attendees}
                                        onChange={e => setForm({ ...form, attendees: Number(e.target.value) })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Location / Platform</label>
                                <input
                                    type="text"
                                    value={form.location || ''}
                                    onChange={e => setForm({ ...form, location: e.target.value })}
                                    placeholder="e.g. Mumbai, India or Zoom Webinar"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">Description</label>
                                <textarea
                                    rows={3}
                                    value={form.description || ''}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    placeholder="Brief description of the event..."
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-none"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all border border-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-60"
                                >
                                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                    {saving ? 'Saving...' : (form.id ? 'Update Event' : 'Create Event')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
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
        <div className={`p-4 sm:p-6 rounded-2xl border flex items-center gap-3 sm:gap-5 ${bgMap[color]} shadow-sm overflow-hidden`}>
            <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center border shadow-md ${colorMap[color]}`}>
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest mb-0.5 text-slate-500/70 truncate">{label}</p>
                <p className="text-xl sm:text-2xl font-black text-slate-900 leading-none tabular-nums tracking-tighter">{count.toLocaleString()}</p>
            </div>
        </div>
    );
}
