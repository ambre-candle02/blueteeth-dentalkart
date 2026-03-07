"use client";

import { useState } from "react";
import { updateGlobalConfig, GlobalConfig } from "@/actions/admin-settings";
import { toast } from "sonner";
import { Save, Loader2, ShoppingCart, MessageSquare, ShieldAlert, Eye } from "lucide-react";

export default function AdminSettingsForm({ initialConfig }: { initialConfig: GlobalConfig }) {
    const [config, setConfig] = useState(initialConfig);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        const result = await updateGlobalConfig(config);
        if (result.success) {
            toast.success("Settings updated successfully!");
        } else {
            toast.error(result.error || "Failed to update settings");
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl">

            {/* Store Controls */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-50 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-brand-light rounded-lg text-brand-primary border border-brand-primary/10">
                            <ShoppingCart size={14} />
                        </div>
                        <h2 className="text-[11px] font-black text-brand-dark uppercase tracking-widest">Cart Dynamics</h2>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Max Cart Items */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 px-5 rounded-xl border border-slate-100 bg-slate-50/20 hover:bg-slate-50/40 transition-colors">
                        <div className="max-w-md">
                            <h4 className="text-[12px] font-black text-brand-dark flex items-center gap-2 uppercase tracking-tight">
                                Max Payload
                                <span className="px-1.5 py-0.5 rounded-md bg-brand-light text-brand-primary text-[8px] font-black uppercase tracking-widest border border-brand-primary/10">Decision Node</span>
                            </h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 leading-relaxed">
                                Universal limit for unique components per transaction. prevention of automated volume ingestion.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm">
                            <input
                                type="number"
                                value={config.maxCartItems}
                                onChange={(e) => setConfig({ ...config, maxCartItems: parseInt(e.target.value) })}
                                className="w-16 px-2 py-1 text-center font-black text-sm text-brand-dark bg-transparent focus:outline-none"
                                min="1"
                                max="100"
                            />
                            <div className="text-[8px] font-black uppercase tracking-widest text-slate-300 border-l border-slate-100 pl-3 pr-1">Units</div>
                        </div>
                    </div>

                    {/* Show Stock Level */}
                    <div className="flex items-center justify-between gap-6 py-4 px-5 rounded-xl border border-slate-100 bg-slate-50/20 hover:bg-slate-50/40 transition-colors">
                        <div className="max-w-md">
                            <h4 className="text-[12px] font-black text-brand-dark flex items-center gap-2 uppercase tracking-tight">
                                <Eye size={12} className="text-slate-400" />
                                Inventory Optics
                            </h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Real-time depletion feedback for urgent fulfillment.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={config.showStockLevel}
                                onChange={(e) => setConfig({ ...config, showStockLevel: e.target.checked })}
                            />
                            <div className="w-10 h-5 bg-slate-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-primary"></div>
                        </label>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 flex items-center gap-2 uppercase tracking-[0.2em] ml-1">
                            <MessageSquare size={12} className="text-brand-primary" />
                            System-Wide Transmission
                        </label>
                        <textarea
                            value={config.shopAnnouncement}
                            onChange={(e) => setConfig({ ...config, shopAnnouncement: e.target.value })}
                            placeholder="e.g., GLOBAL DISPATCH ACTIVE"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-brand-primary transition-all text-xs font-bold leading-relaxed resize-none text-slate-600"
                            rows={2}
                        />
                    </div>
                </div>
            </div>

            {/* Critical Operations */}
            <div className="bg-red-50/10 rounded-2xl border border-red-100/50 overflow-hidden">
                <div className="p-5 border-b border-red-100/50 bg-red-50/30">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-red-100/50 rounded-lg text-red-600">
                            <ShieldAlert size={14} />
                        </div>
                        <h2 className="text-[11px] font-black text-red-900 uppercase tracking-widest">Protocol Override</h2>
                    </div>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between gap-6 py-4 px-5 rounded-xl border border-red-100/30 bg-white">
                        <div>
                            <h4 className="text-[12px] font-black text-red-900 uppercase tracking-tight">Lockdown State</h4>
                            <p className="text-[10px] text-red-600/60 font-medium uppercase tracking-wider mt-1">Suspend transactional flow. display system under maintenance.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={config.maintenanceMode}
                                onChange={(e) => setConfig({ ...config, maintenanceMode: e.target.checked })}
                            />
                            <div className="w-10 h-5 bg-slate-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Persistence Trigger */}
            <div className="fixed bottom-8 right-8 z-50">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-3 bg-brand-dark text-white pl-6 pr-5 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[9px] hover:bg-black hover:scale-105 transition-all shadow-xl shadow-brand-dark/20 disabled:opacity-70"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={14} />
                    ) : (
                        <Save size={14} />
                    )}
                    {loading ? "Synchronizing..." : "Synchronize System"}
                </button>
            </div>
        </div>

    );
}
