"use client";

import { useState } from "react";
import {
    Search, Edit, Trash2, Package, FolderOpen,
    Star, AlertCircle, CheckCircle2, ChevronRight,
    LayoutGrid, List, Plus, Image as ImageIcon, Sparkles,
    TrendingUp, Settings, Pipette, Droplets, Activity,
    Zap, Leaf, Users, Calendar, ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { deleteProduct, updateProduct } from "@/actions/product-actions";
import { toast } from "sonner";
import Image from "next/image";

const SECTORS = [
    { id: "Equipment", label: "Equipment", icon: Settings, color: "text-blue-500", bg: "bg-blue-500/10", description: "Diagnostic & Sterilization systems" },
    { id: "Instruments", label: "Instruments", icon: Pipette, color: "text-purple-500", bg: "bg-purple-500/10", description: "Precision clinical hand tools" },
    { id: "Consumables", label: "Consumables", icon: Droplets, color: "text-emerald-500", bg: "bg-emerald-500/10", description: "Daily clinical supplies & PPE" },
    { id: "Endodontics", label: "Endodontics", icon: Activity, color: "text-rose-500", bg: "bg-rose-500/10", description: "Root canal & Nerve treatments" },
    { id: "Oral Care", label: "Oral Care", icon: Zap, color: "text-cyan-500", bg: "bg-cyan-500/10", description: "Hygiene & Preventive care" },
    { id: "Eco-Sustainable", label: "Eco-Sustainable", icon: Leaf, color: "text-green-600", bg: "bg-green-500/10", description: "Biodegradable clinical assets" },
    { id: "Best Sellers", label: "Best Sellers", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10", description: "High-velocity clinical assets" },
];

export default function ProductListClient({ initialProducts }: { initialProducts: any[] }) {
    const [products, setProducts] = useState(initialProducts);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSector, setActiveSector] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Permanently remove ${name} from the ecosystem?`)) return;
        const loadingToast = toast.loading("Purging from database...");
        try {
            const res = await deleteProduct(id);
            if (res.success) {
                setProducts(products.filter(p => p.id !== id));
                toast.success("Product neutralized", { id: loadingToast });
            } else {
                toast.error(res.error || "Purge failed", { id: loadingToast });
            }
        } catch (error) {
            toast.error("Process error", { id: loadingToast });
        }
    };

    const toggleFeatured = async (id: string, currentStatus: boolean) => {
        const loadingToast = toast.loading("Calibrating priority...");
        try {
            const res = await updateProduct(id, { isFeatured: !currentStatus });
            if (res.success) {
                setProducts(products.map(p => p.id === id ? { ...p, isFeatured: !currentStatus } : p));
                toast.success("Ecosystem priority updated", { id: loadingToast });
            } else {
                toast.error(res.error || "Calibration failed", { id: loadingToast });
            }
        } catch (error) {
            toast.error("Process error", { id: loadingToast });
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.id?.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesSector = activeSector ? (product.category === activeSector) : true;

        // Logical routing for virtual or new sectors
        if (activeSector === "Best Sellers") {
            matchesSector = product.isBestSeller === true || product.category === "Best Sellers";
        }

        return matchesSearch && matchesSector;
    });

    if (!activeSector) {
        return (
            <div className="space-y-12 animate-in fade-in duration-700">
                <div className="flex flex-col items-center text-center space-y-3 mb-12">
                    <span className="px-5 py-2 bg-blue-100/50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.35em] border border-blue-200/50 shadow-sm italic">
                        Institutional Repository
                    </span>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase tracking-widest text-sm">Sector Hub</h1>
                    <p className="text-slate-400 font-bold text-sm max-w-xl uppercase tracking-widest text-[10px] opacity-60">Select a clinical sector to initialize management protocols.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                    {SECTORS.map((sector) => (
                        <button
                            key={sector.id}
                            onClick={() => setActiveSector(sector.id)}
                            className="group bg-blue-50/10 backdrop-blur-xl p-8 rounded-2xl border border-blue-200/30 shadow-sm hover:shadow-xl hover:bg-white hover:scale-[1.02] active:scale-95 transition-all text-left relative overflow-hidden h-[240px] flex flex-col justify-between"
                        >
                            <div className={`w-16 h-16 ${sector.bg} ${sector.color} rounded-2xl flex items-center justify-center shadow-md border border-white/20 group-hover:scale-110 transition-transform duration-500`}>
                                <sector.icon size={32} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{sector.label}</h3>
                                    <span className="text-slate-300 font-black text-sm group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                                <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity italic leading-tight">{sector.description}</p>
                            </div>
                            <div className={`absolute -top-12 -right-12 w-64 h-64 opacity-[0.05] group-hover:opacity-[0.1] rounded-full blur-3xl transition-opacity ${sector.color.replace('text-', 'bg-')}`} />

                            {/* Counter Chip */}
                            <div className="absolute top-8 right-8 bg-slate-900/5 px-4 py-1.5 rounded-xl text-[10px] font-black text-slate-500 border border-slate-200/50 shadow-inner italic">
                                {products.filter(p => sector.id === "Best Sellers" ? (p.isBestSeller || p.category === "Best Sellers") : p.category === sector.id).length} Units
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    const currentSector = SECTORS.find(s => s.id === activeSector)!;

    return (
        <div className="space-y-10 animate-in slide-in-from-right-8 duration-500 pb-20">
            {/* Sector Control Bar */}
            <div className={`bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl px-8 py-8 text-white shadow-2xl relative overflow-hidden border border-white/20`}>
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setActiveSector(null)}
                            className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center transition-all group border border-white/20 shadow-lg"
                        >
                            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
                        </button>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`px-3 py-1 bg-white text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] backdrop-blur-md shadow-lg italic`}>
                                    Protocol Active
                                </div>
                                <span className="text-white/70 text-[10px] uppercase font-black tracking-widest leading-none opacity-80">• {filteredProducts.length} Assets Linked</span>
                            </div>
                            <h2 className="text-3xl font-black tracking-tight flex items-center gap-4 uppercase tracking-widest text-sm">
                                {activeSector}
                                <div className={`w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md ring-1 ring-white/30`}>
                                    <currentSector.icon size={20} className="text-white" />
                                </div>
                            </h2>
                        </div>
                    </div>

                    <Link
                        href={`/admin/products/new?category=${activeSector === 'Best Sellers' ? 'Equipment' : activeSector}`}
                        className="flex items-center justify-center gap-3 bg-white text-blue-700 px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:shadow-white/20 hover:scale-105 active:scale-95 transition-all text-center group ring-4 ring-white/5"
                    >
                        <Plus size={16} strokeWidth={3} className="transition-transform" />
                        Init New
                    </Link>
                </div>

                {/* Background Decor */}
                <div className="absolute top-0 right-0 p-6 opacity-10 translate-x-1/4 -translate-y-1/4">
                    <currentSector.icon size={240} strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/20 rounded-full blur-[80px]" />
            </div>

            {/* Sub-Control Layer */}
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between bg-blue-50/20 backdrop-blur-md p-8 rounded-2xl border border-blue-200/50 shadow-sm">
                <div className="relative w-full md:max-w-xl group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500/50 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder={`Locate ${activeSector} Entry...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-16 pr-8 py-5 bg-white/60 backdrop-blur-sm border border-blue-200/50 rounded-2xl focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-400 transition-all font-black text-[11px] uppercase tracking-widest text-slate-700 placeholder:text-slate-300 shadow-sm"
                    />
                </div>
                <div className="flex items-center gap-4 bg-white/50 p-2.5 rounded-2xl border border-blue-100 shadow-inner">
                    <button onClick={() => setViewMode("list")} className={`flex items-center gap-2.5 px-6 py-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${viewMode === "list" ? "bg-white text-blue-600 shadow-lg ring-1 ring-blue-50" : "text-slate-400 hover:text-blue-400"}`}>
                        <List size={16} /> List
                    </button>
                    <button onClick={() => setViewMode("grid")} className={`flex items-center gap-2.5 px-6 py-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest ${viewMode === "grid" ? "bg-white text-blue-600 shadow-lg ring-1 ring-blue-50" : "text-slate-400 hover:text-blue-400"}`}>
                        <LayoutGrid size={16} /> Grid
                    </button>
                </div>
            </div>

            {/* Conditional Render */}
            {filteredProducts.length === 0 ? (
                <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-blue-200/40 p-24 text-center space-y-10 shadow-xl">
                    <div className="w-28 h-28 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-blue-600 shadow-inner border border-blue-200/50 group">
                        <Package size={54} strokeWidth={2} className="group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase tracking-widest text-sm">Sector is Void</h3>
                        <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.4em] max-w-sm mx-auto leading-relaxed italic opacity-70">No registered assets found in the {activeSector} protocol.</p>
                    </div>
                    <Link
                        href={`/admin/products/new?category=${activeSector === 'Best Sellers' ? 'Equipment' : activeSector}`}
                        className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-1 active:scale-95 transition-all"
                    >
                        <Plus size={18} /> Initialize Entry
                    </Link>
                </div>
            ) : viewMode === "list" ? (
                <div className="bg-white/30 backdrop-blur-2xl rounded-2xl border border-blue-200/40 overflow-hidden shadow-xl">
                    <table className="w-full">
                        <thead className="bg-blue-50/50 border-b border-blue-100/50">
                            <tr>
                                <th className="px-10 py-8 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.3em] text-left italic">Clinical Asset Identity</th>
                                <th className="px-10 py-8 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.3em] text-left italic">Commercials</th>
                                <th className="px-10 py-8 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.3em] text-left italic">Inventory Node</th>
                                <th className="px-10 py-8 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.3em] text-right italic">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-100/30">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-8">
                                            <div className="relative w-20 h-20 rounded-2xl bg-white border border-blue-100 overflow-hidden shrink-0 shadow-lg group-hover:scale-115 transition-all duration-700 ring-4 ring-blue-50/50">
                                                {product.images?.[0]?.url || product.image ? (
                                                    <Image src={product.images?.[0]?.url || product.image} alt={product.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-100"><ImageIcon size={32} /></div>
                                                )}
                                            </div>
                                            <div className="min-w-0 space-y-2">
                                                <div className="flex items-center gap-3 mb-1.5">
                                                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${currentSector.bg} ${currentSector.color} border border-white/20 shadow-sm`}>{product.brand || "Institutional"}</span>
                                                    {product.isFeatured && <Sparkles size={14} className="text-amber-500 animate-pulse" />}
                                                </div>
                                                <p className="text-[17px] font-black text-slate-900 tracking-tighter truncate max-w-[320px]">{product.name}</p>
                                                <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase opacity-60">Node: {product.id.substring(0, 12)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-black text-2xl text-slate-950 tracking-tighter tabular-nums leading-none">₹{product.price.toLocaleString()}</span>
                                            {product.discountPercentage > 0 && <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit border border-emerald-100 shadow-sm mt-1">PROMO {product.discountPercentage}% OFF</span>}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="space-y-3">
                                            <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest w-fit border shadow-sm ${product.stockStatus === 'in-stock' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10' : 'bg-rose-500/10 text-rose-600 border-rose-500/10'}`}>
                                                {product.stockStatus || 'Out of Stock'}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner ring-1 ring-slate-200/50"><div className={`h-full bg-slate-900 transition-all duration-1000 shadow-[0_0_8px_rgba(15,23,42,0.2)]`} style={{ width: `${Math.min(product.stock, 100)}%` }} /></div>
                                                <span className="text-[11px] font-black text-slate-600 tabular-nums">{product.stock}U</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-12 group-hover:translate-x-0">
                                            <Link href={`/admin/products/${product.id}/edit`} className="p-4.5 bg-white text-slate-400 hover:text-slate-950 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all shadow-sm"><Edit size={20} /></Link>
                                            <button onClick={() => toggleFeatured(product.id, product.isFeatured)} className={`p-4.5 rounded-2xl transition-all border shadow-sm ${product.isFeatured ? 'text-amber-500 bg-amber-50 border-amber-100' : 'text-slate-200 bg-white hover:text-amber-500 border-slate-100'}`}><Star size={20} fill={product.isFeatured ? "currentColor" : "none"} /></button>
                                            <button onClick={() => handleDelete(product.id, product.name)} className="p-4.5 bg-white text-slate-200 hover:text-rose-500 hover:bg-rose-50 border border-slate-100 rounded-2xl transition-all shadow-sm"><Trash2 size={20} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white/50 backdrop-blur-xl p-8 rounded-2xl border border-blue-100/50 shadow-xl hover:shadow-blue-500/10 transition-all group relative overflow-hidden">
                            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden mb-8 shadow-2xl ring-4 ring-blue-50/30">
                                {product.images?.[0]?.url || product.image ? (
                                    <Image src={product.images?.[0]?.url || product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-100 bg-slate-50"><Package size={84} strokeWidth={1} /></div>
                                )}
                                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all translate-y-3 group-hover:translate-y-0 duration-500 z-10">
                                    <button onClick={() => toggleFeatured(product.id, product.isFeatured)} className={`p-4 rounded-2xl shadow-2xl backdrop-blur-md transition-all ${product.isFeatured ? 'bg-amber-500 text-white' : 'bg-white/95 text-slate-400 hover:text-amber-500 hover:scale-110'}`}>
                                        <Star size={18} fill={product.isFeatured ? "currentColor" : "none"} />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${currentSector.color} italic mb-2 block opacity-80`}>{product.brand || "Institutional Asset"}</span>
                                    <h4 className="text-2xl font-black text-slate-900 tracking-tighter truncate leading-tight">{product.name}</h4>
                                    <p className="text-[13px] text-slate-500 font-bold line-clamp-2 mt-3 leading-relaxed opacity-70 italic">{product.description}</p>
                                </div>
                                <div className="flex justify-between items-center pt-8 border-t border-blue-50">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic opacity-60">Market Value</span>
                                        <span className="text-3xl font-black text-slate-900 tracking-tighter leading-none tabular-nums">₹{product.price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <Link href={`/admin/products/${product.id}/edit`} className="p-5 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-xl hover:-translate-y-1 active:scale-95"><Edit size={22} /></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
