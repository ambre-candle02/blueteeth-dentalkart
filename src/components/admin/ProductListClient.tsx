"use client";

import { useState } from "react";
import {
    Search, Edit, Trash2, Package,
    Star, LayoutGrid, List, Plus, Image as ImageIcon, Sparkles,
    TrendingUp, Settings, Pipette, Droplets, Activity,
    Zap, Leaf
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
        } catch {
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
        } catch {
            toast.error("Process error", { id: loadingToast });
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.id?.toLowerCase().includes(searchQuery.toLowerCase());
        let matchesSector = activeSector ? (product.category === activeSector) : true;
        if (activeSector === "Best Sellers") {
            matchesSector = product.isBestSeller === true || product.category === "Best Sellers";
        }
        return matchesSearch && matchesSector;
    });

    const currentSector = SECTORS.find(s => s.id === activeSector) || SECTORS[0];

    // ── Sector Hub (no sector selected) ─────────────────────────────────────
    if (!activeSector) {
        return (
            <div className="p-4 sm:p-8 space-y-10 animate-in fade-in duration-700">
                <div className="flex flex-col items-center text-center space-y-3 mb-8">
                    <span className="px-5 py-2 bg-blue-100/50 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.35em] border border-blue-200/50 shadow-sm italic">
                        Institutional Repository
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter uppercase tracking-widest text-sm">Sector Hub</h1>
                    <p className="text-slate-400 font-bold text-sm max-w-xl uppercase tracking-widest text-[10px] opacity-60">Select a clinical sector to initialize management protocols.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pb-20">
                    {SECTORS.map((sector) => (
                        <button
                            key={sector.id}
                            onClick={() => setActiveSector(sector.id)}
                            className="group bg-blue-50/10 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-blue-200/30 shadow-sm hover:shadow-xl hover:bg-white hover:scale-[1.02] active:scale-95 transition-all text-left relative overflow-hidden h-[200px] sm:h-[240px] flex flex-col justify-between"
                        >
                            <div className={`w-14 h-14 sm:w-16 sm:h-16 ${sector.bg} ${sector.color} rounded-2xl flex items-center justify-center shadow-md border border-white/20 group-hover:scale-110 transition-transform duration-500`}>
                                <sector.icon size={28} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter">{sector.label}</h3>
                                    <span className="text-slate-300 font-black text-sm group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                                <p className="text-slate-500 text-[10px] sm:text-[11px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity italic leading-tight">{sector.description}</p>
                            </div>
                            <div className="absolute bottom-0 right-0 p-4 opacity-5">
                                <sector.icon size={80} strokeWidth={1} />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // ── Active Sector View ──────────────────────────────────────────────────
    return (
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 animate-in fade-in duration-700 pb-20">

            {/* Sector Header */}
            <div className={`relative rounded-2xl p-6 sm:p-10 overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-2xl`}>
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <button
                            onClick={() => setActiveSector(null)}
                            className="flex items-center gap-2 text-white/50 hover:text-white text-[9px] font-black uppercase tracking-[0.3em] transition-colors mb-4 sm:mb-6"
                        >
                            ← All Sectors
                        </button>
                        <h2 className="text-xl sm:text-3xl font-black tracking-tight flex items-center gap-3 sm:gap-4 uppercase tracking-widest text-sm">
                            <span className="truncate">{activeSector}</span>
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center backdrop-blur-md ring-1 ring-white/30 shrink-0">
                                <currentSector.icon size={16} className="text-white" />
                            </div>
                        </h2>
                    </div>
                    <Link
                        href={`/admin/products/new?category=${activeSector === 'Best Sellers' ? 'Equipment' : activeSector}`}
                        className="flex items-center justify-center gap-2 sm:gap-3 bg-white text-blue-700 px-5 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[11px] uppercase tracking-[0.2em] shadow-xl hover:shadow-white/20 active:scale-95 transition-all group ring-4 ring-white/5 whitespace-nowrap"
                    >
                        <Plus size={14} strokeWidth={3} />
                        Add Product
                    </Link>
                </div>
                <div className="absolute top-0 right-0 p-6 opacity-10 translate-x-1/4 -translate-y-1/4 hidden sm:block">
                    <currentSector.icon size={240} strokeWidth={1.5} />
                </div>
            </div>

            {/* Search + View Toggle */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-blue-50/20 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-blue-200/50 shadow-sm">
                <div className="relative w-full md:max-w-xl group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500/50 group-focus-within:text-blue-500 transition-colors" size={16} />
                    <input
                        type="text"
                        placeholder={`Search ${activeSector}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-5 py-3 sm:py-4 bg-white/60 backdrop-blur-sm border border-blue-200/50 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all font-black text-[10px] sm:text-[11px] uppercase tracking-widest text-slate-700 placeholder:text-slate-300 shadow-sm"
                    />
                </div>
                <div className="flex items-center gap-2 bg-white/50 p-1.5 rounded-xl border border-blue-100 shadow-inner w-full md:w-auto">
                    <button onClick={() => setViewMode("list")} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg transition-all font-black text-[9px] sm:text-[10px] uppercase tracking-widest ${viewMode === "list" ? "bg-white text-blue-600 shadow-lg ring-1 ring-blue-50" : "text-slate-400 hover:text-blue-400"}`}>
                        <List size={13} /> List
                    </button>
                    <button onClick={() => setViewMode("grid")} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg transition-all font-black text-[9px] sm:text-[10px] uppercase tracking-widest ${viewMode === "grid" ? "bg-white text-blue-600 shadow-lg ring-1 ring-blue-50" : "text-slate-400 hover:text-blue-400"}`}>
                        <LayoutGrid size={13} /> Grid
                    </button>
                </div>
            </div>

            {/* Empty state */}
            {filteredProducts.length === 0 ? (
                <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-blue-200/40 p-12 sm:p-24 text-center space-y-6 shadow-xl">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto text-blue-600 shadow-inner border border-blue-200/50">
                        <Package size={36} strokeWidth={2} />
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tighter uppercase tracking-widest text-sm">Sector is Void</h3>
                        <p className="text-[10px] sm:text-[11px] text-slate-400 font-black uppercase tracking-[0.4em] max-w-xs mx-auto leading-relaxed italic opacity-70">No registered assets found in the {activeSector} protocol.</p>
                    </div>
                    <Link
                        href={`/admin/products/new?category=${activeSector === 'Best Sellers' ? 'Equipment' : activeSector}`}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all"
                    >
                        <Plus size={16} strokeWidth={3} /> Initialize Entry
                    </Link>
                </div>

            ) : viewMode === "list" ? (

                // ── LIST VIEW (mobile-first, no horizontal scroll) ──────────
                <div className="bg-white/30 backdrop-blur-2xl rounded-2xl border border-blue-200/40 shadow-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-blue-50/50 border-b border-blue-100/50">
                            <tr>
                                <th className="px-4 sm:px-10 py-4 sm:py-8 text-[8px] sm:text-[10px] font-black text-blue-800/60 uppercase tracking-[0.3em] text-left italic">Product</th>
                                <th className="px-4 sm:px-10 py-4 sm:py-8 text-[8px] sm:text-[10px] font-black text-blue-800/60 uppercase tracking-[0.3em] text-left italic">Price</th>
                                <th className="hidden md:table-cell px-10 py-8 text-[10px] font-black text-blue-800/60 uppercase tracking-[0.3em] text-left italic">Stock</th>
                                <th className="px-4 sm:px-10 py-4 sm:py-8 text-[8px] sm:text-[10px] font-black text-blue-800/60 uppercase tracking-[0.3em] text-right italic">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-100/30">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-4 sm:px-10 py-4 sm:py-8">
                                        <div className="flex items-center gap-3 sm:gap-8">
                                            <div className="relative w-10 h-10 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white border border-blue-100 overflow-hidden shrink-0 shadow-lg ring-2 sm:ring-4 ring-blue-50/50">
                                                {product.images?.[0]?.url || product.image ? (
                                                    <Image src={product.images?.[0]?.url || product.image} alt={product.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-200"><ImageIcon size={18} /></div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs sm:text-[16px] font-black text-slate-900 tracking-tighter truncate max-w-[110px] sm:max-w-[300px]">{product.name}</p>
                                                <p className="text-[7px] sm:text-[10px] text-slate-400 font-black tracking-widest uppercase opacity-60 mt-0.5">ID: {product.id.substring(0, 6)}...</p>
                                                {/* Stock badge on mobile */}
                                                <div className="md:hidden mt-1">
                                                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[6px] font-black uppercase tracking-widest border ${product.stockStatus === 'in-stock' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10' : 'bg-rose-500/10 text-rose-600 border-rose-500/10'}`}>
                                                        {product.stock}u {product.stockStatus === 'in-stock' ? '✓' : '!'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-10 py-4 sm:py-8">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-black text-sm sm:text-2xl text-slate-950 tracking-tighter tabular-nums leading-none whitespace-nowrap">₹{product.price.toLocaleString()}</span>
                                            {product.discountPercentage > 0 && (
                                                <span className="text-[7px] sm:text-[9px] font-black text-emerald-600 bg-emerald-50 px-1 sm:px-2 py-0.5 rounded border border-emerald-100 w-fit mt-0.5">{product.discountPercentage}% OFF</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="hidden md:table-cell px-10 py-8">
                                        <div className="space-y-2.5">
                                            <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest w-fit border shadow-sm ${product.stockStatus === 'in-stock' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/10' : 'bg-rose-500/10 text-rose-600 border-rose-500/10'}`}>
                                                {product.stockStatus || 'Out of Stock'}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden ring-1 ring-slate-200/50">
                                                    <div className="h-full bg-slate-900 transition-all duration-1000" style={{ width: `${Math.min(product.stock, 100)}%` }} />
                                                </div>
                                                <span className="text-[11px] font-black text-slate-600 tabular-nums">{product.stock}U</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-10 py-4 sm:py-8 text-right">
                                        <div className="flex items-center justify-end gap-1 sm:gap-2.5">
                                            <Link href={`/admin/products/${product.id}/edit`} className="p-2 sm:p-3.5 bg-white text-slate-400 hover:text-slate-950 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all shadow-sm"><Edit size={13} /></Link>
                                            <button onClick={() => toggleFeatured(product.id, product.isFeatured)} className={`p-2 sm:p-3.5 rounded-xl transition-all border shadow-sm ${product.isFeatured ? 'text-amber-500 bg-amber-50 border-amber-100' : 'text-slate-200 bg-white hover:text-amber-500 border-slate-100'}`}><Star size={13} fill={product.isFeatured ? "currentColor" : "none"} /></button>
                                            <button onClick={() => handleDelete(product.id, product.name)} className="p-2 sm:p-3.5 bg-white text-slate-200 hover:text-rose-500 hover:bg-rose-50 border border-slate-100 rounded-xl transition-all shadow-sm"><Trash2 size={13} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            ) : (

                // ── GRID VIEW ───────────────────────────────────────────────
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-10">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white/50 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-blue-100/50 shadow-xl hover:shadow-blue-500/10 transition-all group relative overflow-hidden">
                            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden mb-6 sm:mb-8 shadow-2xl ring-4 ring-blue-50/30">
                                {product.images?.[0]?.url || product.image ? (
                                    <Image src={product.images?.[0]?.url || product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-[2s]" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-100 bg-slate-50"><Package size={64} strokeWidth={1} /></div>
                                )}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300 z-10">
                                    <button onClick={() => toggleFeatured(product.id, product.isFeatured)} className={`p-3 rounded-2xl shadow-2xl backdrop-blur-md transition-all ${product.isFeatured ? 'bg-amber-500 text-white' : 'bg-white/95 text-slate-400 hover:text-amber-500 hover:scale-110'}`}>
                                        <Star size={16} fill={product.isFeatured ? "currentColor" : "none"} />
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${currentSector.color} italic mb-1.5 block opacity-80`}>{product.brand || "Institutional Asset"}</span>
                                    <h4 className="text-xl font-black text-slate-900 tracking-tighter truncate leading-tight">{product.name}</h4>
                                    <p className="text-[12px] text-slate-500 font-bold line-clamp-2 mt-2 leading-relaxed opacity-70 italic">{product.description}</p>
                                </div>
                                <div className="flex justify-between items-center pt-5 border-t border-blue-50">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic opacity-60">Price</span>
                                        <span className="text-2xl font-black text-slate-900 tracking-tighter leading-none tabular-nums">₹{product.price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex gap-2.5">
                                        <Link href={`/admin/products/${product.id}/edit`} className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all shadow-xl active:scale-95"><Edit size={18} /></Link>
                                        <button onClick={() => handleDelete(product.id, product.name)} className="p-4 bg-white text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl border border-slate-100 transition-all shadow-sm"><Trash2 size={18} /></button>
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
