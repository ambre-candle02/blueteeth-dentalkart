"use client";

import { useState, useEffect } from "react";
import { getMembershipPlans, saveMembershipPlan, deleteMembershipPlan, seedInitialPlans } from "@/actions/membership-actions";
import { Plus, Trash2, Edit2, Save, X, RefreshCw, Star } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AdminMembershipPage() {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState<any | null>(null);
    const [newFeature, setNewFeature] = useState("");

    const addFeature = () => {
        if (!newFeature.trim()) return;
        setEditingPlan({
            ...editingPlan,
            features: [...(editingPlan.features || []), newFeature.trim()]
        });
        setNewFeature("");
    };

    const removeFeature = (index: number) => {
        setEditingPlan({
            ...editingPlan,
            features: editingPlan.features.filter((_: any, i: number) => i !== index)
        });
    };

    const fetchPlans = async () => {
        setLoading(true);
        const result = await getMembershipPlans();
        if (result.success) {
            setPlans(result.plans || []);
        } else {
            toast.error("Failed to fetch plans");
        }
        setLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchPlans();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await saveMembershipPlan(editingPlan);
        if (result.success) {
            toast.success("Plan saved successfully");
            setEditingPlan(null);
            fetchPlans();
        } else {
            toast.error("Error saving plan: " + result.error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this plan?")) return;
        const result = await deleteMembershipPlan(id);
        if (result.success) {
            toast.success("Plan deleted");
            fetchPlans();
        } else {
            toast.error("Error deleting plan");
        }
    };

    const handleSeed = async () => {
        if (!confirm("This will add default clinical tiers. Continue?")) return;
        const result = await seedInitialPlans();
        if (result.success) {
            toast.success("Initial tiers deployed");
            fetchPlans();
        } else {
            toast.error("Seeding failed");
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase tracking-widest text-sm">Clinical Tier Management</h1>
                    <p className="text-[11px] text-slate-500 mt-1 font-bold uppercase tracking-widest opacity-60 italic">Ecosystem // Membership Protocols</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleSeed}
                        className="flex items-center gap-3 px-6 py-4 bg-white/60 backdrop-blur-md border border-blue-200/50 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-blue-600 transition-all text-slate-500 shadow-sm"
                    >
                        <RefreshCw size={14} strokeWidth={3} /> Seed Defaults
                    </button>
                    <button
                        onClick={() => setEditingPlan({ name: "", price: 0, desc: "", features: [], icon: "Award", color: "blue", highlight: false })}
                        className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 ring-4 ring-blue-500/5"
                    >
                        <Plus size={16} strokeWidth={3} /> Create Tier
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center p-32">
                    <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full shadow-lg" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map(plan => (
                        <div key={plan.id} className="bg-white/50 backdrop-blur-xl rounded-2xl border border-blue-100/50 p-10 shadow-xl hover:shadow-blue-500/10 transition-all relative overflow-hidden group">
                            {plan.highlight && (
                                <div className="absolute top-6 right-6 text-amber-500 bg-amber-50 p-2 rounded-xl border border-amber-100 shadow-sm animate-pulse">
                                    <Star size={18} fill="currentColor" />
                                </div>
                            )}
                            <div className="mb-8">
                                <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase mb-1">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-blue-600 tracking-tighter tabular-nums">₹{plan.price.toLocaleString()}</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">/YR</span>
                                </div>
                                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-4 opacity-70 italic leading-relaxed">{plan.desc}</p>
                            </div>

                            <div className="space-y-3.5 mb-10 min-h-[160px]">
                                {plan.features?.map((f: string, i: number) => (
                                    <div key={i} className="flex items-center gap-3 text-[11px] text-slate-600 font-black tracking-tight group-hover:text-slate-900 transition-colors">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.3)]" />
                                        {f}
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3 pt-8 border-t border-blue-50">
                                <button
                                    onClick={() => setEditingPlan(plan)}
                                    className="flex-1 flex items-center justify-center gap-2.5 py-4 bg-blue-50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all border border-blue-100 shadow-sm"
                                >
                                    <Edit2 size={14} strokeWidth={3} /> Edit Protocol
                                </button>
                                <button
                                    onClick={() => handleDelete(plan.id)}
                                    className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all border border-rose-100 shadow-sm group/btn"
                                >
                                    <Trash2 size={16} strokeWidth={3} className="group-hover/btn:scale-110 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {editingPlan && (
                <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl border border-blue-200/50 ring-1 ring-black/5"
                    >
                        <form onSubmit={handleSave}>
                            <div className="px-10 py-8 border-b border-blue-50 flex items-center justify-between bg-blue-50/30">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase tracking-widest text-sm">Configure Tier Protocol</h2>
                                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1 opacity-60 italic">Tier Identity & Benefits Calibration</p>
                                </div>
                                <button type="button" onClick={() => setEditingPlan(null)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-blue-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all shadow-sm">
                                    <X size={20} strokeWidth={3} />
                                </button>
                            </div>

                            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10 max-h-[65vh] overflow-y-auto custom-scrollbar">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 block opacity-70 italic">Tier Name</label>
                                        <input
                                            required
                                            className="w-full px-5 py-4 bg-blue-50/50 border border-blue-100 rounded-2xl text-[13px] font-black tracking-tight focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all shadow-inner"
                                            value={editingPlan.name}
                                            onChange={e => setEditingPlan({ ...editingPlan, name: e.target.value })}
                                            placeholder="e.g. PLATINUM CORE"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 block opacity-70 italic">Price (Annual Matrix)</label>
                                        <div className="relative">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">₹</span>
                                            <input
                                                type="number"
                                                required
                                                className="w-full pl-10 pr-5 py-4 bg-blue-50/50 border border-blue-100 rounded-2xl text-[13px] font-black tracking-tight focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all shadow-inner"
                                                value={editingPlan.price}
                                                onChange={e => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 block opacity-70 italic">Icon Profile (Lucide)</label>
                                        <input
                                            className="w-full px-5 py-4 bg-blue-50/50 border border-blue-100 rounded-2xl text-[13px] font-black tracking-tight focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all shadow-inner"
                                            value={editingPlan.icon}
                                            onChange={e => setEditingPlan({ ...editingPlan, icon: e.target.value })}
                                            placeholder="Award, Star, Building2..."
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                                        <input
                                            type="checkbox"
                                            id="highlight"
                                            className="w-6 h-6 rounded-lg text-blue-600 border-blue-200 focus:ring-blue-500/20 cursor-pointer"
                                            checked={editingPlan.highlight}
                                            onChange={e => setEditingPlan({ ...editingPlan, highlight: e.target.checked })}
                                        />
                                        <label htmlFor="highlight" className="text-[11px] font-black text-slate-600 cursor-pointer uppercase tracking-widest italic select-none">Mark as Institutional Choice</label>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 block opacity-70 italic">Tier Abstract</label>
                                        <textarea
                                            className="w-full px-5 py-4 bg-blue-50/50 border border-blue-100 rounded-2xl text-[12px] font-black tracking-tight focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all shadow-inner min-h-[120px] resize-none"
                                            value={editingPlan.desc}
                                            onChange={e => setEditingPlan({ ...editingPlan, desc: e.target.value })}
                                            placeholder="Institutional description of the membership tier..."
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block opacity-70 italic">Benefit Protocols / Features</label>

                                        <div className="space-y-2.5 mb-5 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                            {editingPlan.features?.map((f: string, i: number) => (
                                                <div key={i} className="flex items-center justify-between bg-white border border-blue-100 p-4 rounded-xl shadow-sm group/item hover:border-blue-300 transition-colors">
                                                    <span className="text-[11px] font-black text-slate-600 tracking-tight">{f}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFeature(i)}
                                                        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                                                    >
                                                        <Trash2 size={14} strokeWidth={3} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex gap-2">
                                            <input
                                                className="flex-1 px-5 py-4 bg-white border border-blue-200 rounded-2xl text-[11px] font-black tracking-tight focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-300 shadow-sm"
                                                placeholder="Add new protocol benefit..."
                                                value={newFeature}
                                                onChange={e => setNewFeature(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                                            />
                                            <button
                                                type="button"
                                                onClick={addFeature}
                                                className="w-14 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center"
                                            >
                                                <Plus size={20} strokeWidth={3} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 bg-blue-50/30 flex gap-4 border-t border-blue-50">
                                <button type="submit" className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3 ring-4 ring-blue-500/5">
                                    <Save size={16} strokeWidth={3} /> Commit Protocol Changes
                                </button>
                                <button type="button" onClick={() => setEditingPlan(null)} className="px-10 py-5 bg-white border border-blue-200 text-slate-500 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all shadow-sm">
                                    Abort
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
